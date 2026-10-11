
from threading import Thread
import os
import smtplib
from email.message import EmailMessage

import psycopg
from dotenv import load_dotenv

from flask import Flask, jsonify, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)



def get_db_connection():
    database_url = os.getenv("DATABASE_URL")

    # Use hosted Neon PostgreSQL on Vercel.
    if database_url:
        return psycopg.connect(
            database_url,
            connect_timeout=10
        )

    # Use local PostgreSQL when running on your computer.
    return psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        connect_timeout=10,
    )




def send_brevo_email(to_email, subject, body):
    sender_email = os.getenv("BREVO_SENDER_EMAIL")
    sender_name = os.getenv("BREVO_SENDER_NAME", "RaktaSync")
    login = os.getenv("BREVO_SMTP_LOGIN")
    password = os.getenv("BREVO_SMTP_KEY")

    if not all([sender_email, login, password]):
        raise RuntimeError("Missing Brevo SMTP settings in .env")

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = f"{sender_name} <{sender_email}>"
    message["To"] = to_email
    message.set_content(body)

    with smtplib.SMTP(
        os.getenv("BREVO_SMTP_HOST", "smtp-relay.brevo.com"),
        int(os.getenv("BREVO_SMTP_PORT", "587")),
        timeout=8,
    ) as server:
        server.starttls()
        server.login(login, password)
        server.send_message(message)



@app.route("/")
def home():
    return jsonify({
        "message": "Welcome to RaktaSync Backend!",
        "status": "running",
    })


@app.route("/api/health")
def health():
    return jsonify({
        "project": "RaktaSync",
        "status": "healthy",
    })


@app.route("/api/db-test")
def db_test():
    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT current_database()")
                database_name = cur.fetchone()[0]

        return jsonify({
            "project": "RaktaSync",
            "database": database_name,
            "status": "connected",
        })

    except Exception:
        app.logger.exception("Database connection failed")
        return jsonify({
            "project": "RaktaSync",
            "status": "database connection failed",
        }), 500


@app.route("/api/students", methods=["POST"])
def register_student():
    data = request.get_json(silent=True) or {}

    required_fields = ["full_name", "college_email", "blood_group"]

    for field in required_fields:
        if not data.get(field):
            return jsonify({
                "error": f"{field} is required",
            }), 400

    try:
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO students
                        (full_name, college_email, phone, blood_group, is_donor)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING student_id
                    """,
                    (
                        data["full_name"].strip(),
                        data["college_email"].strip().lower(),
                        data.get("phone"),
                        data["blood_group"].strip().upper(),
                        data.get("is_donor", False),
                    ),
                )
                student_id = cur.fetchone()[0]

        return jsonify({
            "message": "Student registered successfully",
            "student_id": student_id,
        }), 201

    except psycopg.errors.UniqueViolation:
        return jsonify({
            "error": "This college email is already registered",
        }), 409

    except psycopg.errors.CheckViolation:
        return jsonify({
            "error": "Invalid blood group",
        }), 400

    except Exception:
        app.logger.exception("Student registration failed")
        return jsonify({
            "error": "Student registration failed",
        }), 500



@app.route("/api/blood-requests", methods=["POST"])
def create_blood_request():
    data = request.get_json(silent=True) or {}

    required_fields = [
        "requester_name",
        "blood_group",
        "units_required",
        "hospital_name",
        "hospital_address",
        "contact_phone",
    ]

    for field in required_fields:
        if data.get(field) is None or not str(data[field]).strip():
            return jsonify({"error": f"{field} is required"}), 400

    valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    blood_group = str(data["blood_group"]).strip().upper()

    if blood_group not in valid_groups:
        return jsonify({"error": "Invalid blood group"}), 400

    try:
        units = int(data["units_required"])
        if units <= 0:
            return jsonify({"error": "Units must be greater than zero"}), 400
    except (ValueError, TypeError):
        return jsonify({"error": "Units must be a valid number"}), 400

    urgency = str(data.get("urgency", "normal")).strip().lower()
    if urgency not in ["normal", "urgent", "critical"]:
        return jsonify({"error": "Invalid urgency"}), 400

    try:
        # Save request and find opted-in, available donors.
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO blood_requests (
                        requester_name, blood_group, units_required,
                        hospital_name, hospital_address, contact_phone, urgency
                    )
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                    RETURNING request_id
                    """,
                    (
                        str(data["requester_name"]).strip(),
                        blood_group,
                        units,
                        str(data["hospital_name"]).strip(),
                        str(data["hospital_address"]).strip(),
                        str(data["contact_phone"]).strip(),
                        urgency,
                    ),
                )
                request_id = cur.fetchone()[0]

                cur.execute(
                    """
                    SELECT full_name, college_email
                    FROM students
                    WHERE is_donor = TRUE
                      AND is_available = TRUE
                      AND college_email IS NOT NULL
                      AND UPPER(blood_group) = %s
                    """,
                    (blood_group,),
                )
                donors = cur.fetchall()

        # Send one email per matching donor in the background.
        def send_notifications():
            for donor_name, donor_email in donors:
                subject = f"RaktaSync blood request: {blood_group}"

                body = f"""Hello {donor_name},

A blood request has been submitted through RaktaSync.

Requested blood group: {blood_group}
Units requested: {units}
Hospital: {data['hospital_name']}
Address: {data['hospital_address']}
Urgency: {urgency.upper()}
Requester contact: {data['contact_phone']}
Request ID: {request_id}

Please respond only if you are willing to help.
Confirm donation eligibility with a qualified medical professional.

Thank you,
RaktaSync
"""
                try:
                    send_brevo_email(donor_email, subject, body)
                    app.logger.info("Email sent successfully to %s", donor_email)
                except Exception:
                    app.logger.exception(
                        "Email failed for donor %s", donor_email
                    )

        if donors:
            Thread(target=send_notifications, daemon=True).start()

        # Return immediately; email delivery continues in the background.
        return jsonify({
            "message": "Blood request created successfully",
            "request_id": request_id,
            "status": "open",
            "matching_donors": len(donors),
            "emails_queued": len(donors),
        }), 201

    except Exception:
        app.logger.exception("Blood request creation failed")
        return jsonify({
            "error": "Could not create blood request"
        }), 500



if __name__ == "__main__":
    app.run(debug=True, port=5000)
