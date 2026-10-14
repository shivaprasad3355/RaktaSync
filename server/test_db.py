
import os
import psycopg
from dotenv import load_dotenv

load_dotenv()

try:
    with psycopg.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    ) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT current_database(), version()")
            result = cur.fetchone()

            print("Database connection successful!")
            print("Database:", result[0])
            print("PostgreSQL:", result[1].split(",")[0])

except Exception as e:
    print("Database connection failed.")
    print("Error:", e)
