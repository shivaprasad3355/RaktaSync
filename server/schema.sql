CREATE TABLE IF NOT EXISTS students (
    student_id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    college_email VARCHAR(150) NOT NULL UNIQUE,
    phone VARCHAR(30),
    blood_group VARCHAR(3) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    is_donor BOOLEAN NOT NULL DEFAULT FALSE,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS blood_requests (
    request_id BIGSERIAL PRIMARY KEY,
    requester_name VARCHAR(100) NOT NULL,
    blood_group VARCHAR(3) NOT NULL CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
    units_required INTEGER NOT NULL CHECK (units_required > 0),
    hospital_name VARCHAR(150) NOT NULL,
    hospital_address TEXT NOT NULL,
    contact_phone VARCHAR(30) NOT NULL,
    urgency VARCHAR(10) NOT NULL DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS students_blood_group_available_idx
    ON students (blood_group, is_donor, is_available);