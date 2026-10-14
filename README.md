# RaktaSync

A campus-focused blood donation platform that helps students register as donors and request emergency blood support quickly.

Live demo: https://rakta-sync.vercel.app

## Overview

RaktaSync connects verified student donors with people who need blood during emergencies. The platform offers:

- Student donor registration
- Blood group-based matching
- Emergency blood request submission
- Automated email and SMS notifications through Brevo
- PostgreSQL-backed data persistence
- Modern React frontend with animated campus landing experience

## Features

- Donor onboarding with student details and blood group information
- Blood request form with hospital, urgency, and request details
- Matching logic that finds available donors by blood type
- Secure backend API for registration and requests
- Responsive web app for desktop and mobile users

## Tech Stack

### Frontend
- React
- Vite
- Framer Motion
- Lucide React
- React Three Fiber / Drei

### Backend
- Flask
- PostgreSQL
- psycopg
- Python-dotenv

## Project Structure

```text
RaktaSync/
├── client/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── server/
│   ├── app.py
│   ├── requirements.txt
│   ├── schema.sql
│   └── test_db.py
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── BloodRequest.jsx
│   ├── StudentRegistration.jsx
│   └── ...
├── package.json
├── vite.config.js
├── index.html
├── README.md
├── .gitignore
└── build-output.txt
```

## Getting Started

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

### 3. Set up backend environment

Go to the `server` directory and install Python dependencies:

```bash
cd server
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file inside `server/` with values similar to:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=raktasync
DB_USER=postgres
DB_PASSWORD=your_password
DATABASE_URL=postgresql://user:password@host:port/dbname

BREVO_SENDER_EMAIL=your_sender_email
BREVO_SENDER_NAME=RaktaSync
BREVO_SMTP_LOGIN=your_brevo_login
BREVO_SMTP_KEY=your_brevo_key
BREVO_SMTP_HOST=smtp-relay.brevo.com
BREVO_SMTP_PORT=587
BREVO_API_KEY=your_brevo_api_key
BREVO_SMS_SENDER=RaktaSync
BREVO_DEFAULT_COUNTRY_CODE=91
```

### 4. Run the backend

```bash
cd server
python app.py
```

The backend exposes APIs such as:

- `GET /api/health`
- `POST /api/students`
- `POST /api/blood-requests`

## Database

The project uses PostgreSQL. A schema definition is included in:

- `server/schema.sql`

This contains the database structure for storing student registrations and blood requests.

## Deployment Notes

- Frontend is structured for Vercel-style deployment.
- Backend is designed to work with a hosted PostgreSQL database and environment variables in production.
- Email and SMS notifications are integrated through Brevo.

## Contributing

Contributions are welcome. If you'd like to improve the platform, feel free to open an issue or submit a pull request.

## License

This project is currently unlicensed unless otherwise specified by the repository owner.
