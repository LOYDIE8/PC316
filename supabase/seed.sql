-- ============================================================================
-- EnrollEase (PC316v2) - Dual-Database Domain Architecture Migration
-- Domain 1: Simulated School ERP (erp_sis_*)
-- Domain 2: EnrollEase Operational DB (enrollease_*)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. DOMAIN 1: SIMULATED SCHOOL ERP (SIS)
-- ----------------------------------------------------------------------------

DROP TABLE IF EXISTS erp_sis_curriculum_subjects CASCADE;
DROP TABLE IF EXISTS erp_sis_clearances CASCADE;
DROP TABLE IF EXISTS erp_sis_students CASCADE;

CREATE TABLE erp_sis_students (
    student_id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    program TEXT NOT NULL DEFAULT 'BS Information Technology',
    year_level INT NOT NULL DEFAULT 3,
    section TEXT NOT NULL DEFAULT 'BSIT 3-A',
    student_type TEXT NOT NULL DEFAULT 'Regular', -- 'Regular', 'Irregular', 'Freshman', 'Transferee'
    tuition_status TEXT NOT NULL DEFAULT 'Cleared / UniFAST', -- 'Cleared / UniFAST', 'With Balance', 'Pending Assessment'
    balance_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    erp_enrollment_status TEXT NOT NULL DEFAULT 'Eligible for Enrollment', -- 'Not Enrolled', 'Clearance Hold', 'Eligible for Enrollment', 'Advised', 'Officially Enrolled'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE erp_sis_clearances (
    clearance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES erp_sis_students(student_id) ON DELETE CASCADE,
    office_code TEXT NOT NULL, -- 'MEDICAL', 'LIBRARY', 'SAO_GUIDANCE', 'CASHIER', 'DEPT_LAB'
    office_name TEXT NOT NULL,
    location_room TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Cleared', -- 'Cleared', 'Pending', 'Hold'
    remarks TEXT DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE erp_sis_curriculum_subjects (
    subject_record_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES erp_sis_students(student_id) ON DELETE CASCADE,
    subject_code TEXT NOT NULL,
    descriptive_title TEXT NOT NULL,
    units INT NOT NULL DEFAULT 3,
    schedule_block TEXT NOT NULL,
    is_advised BOOLEAN NOT NULL DEFAULT FALSE,
    semester TEXT NOT NULL DEFAULT '1st Semester',
    school_year TEXT NOT NULL DEFAULT '2026-2027'
);

-- ----------------------------------------------------------------------------
-- 2. DOMAIN 2: ENROLLEASE OPERATIONAL PLATFORM
-- ----------------------------------------------------------------------------

DROP TABLE IF EXISTS enrollease_live_queue CASCADE;
DROP TABLE IF EXISTS enrollease_appointments CASCADE;
DROP TABLE IF EXISTS enrollease_time_slots CASCADE;
DROP TABLE IF EXISTS enrollease_student_progress CASCADE;
DROP TABLE IF EXISTS enrollease_workflow_steps CASCADE;
DROP TABLE IF EXISTS enrollease_users CASCADE;

CREATE TABLE enrollease_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT UNIQUE NOT NULL,
    pin_or_password TEXT NOT NULL DEFAULT 'demo1234',
    role TEXT NOT NULL DEFAULT 'student', -- 'student', 'staff_advising', 'staff_registrar', 'staff_cashier', 'admin'
    notification_prefs JSONB DEFAULT '{"sms": true, "sound": true, "browser": true}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE enrollease_workflow_steps (
    step_number INT PRIMARY KEY,
    step_title TEXT NOT NULL,
    office_name TEXT NOT NULL,
    building_room TEXT NOT NULL,
    clear_instructions TEXT NOT NULL,
    required_documents TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE enrollease_student_progress (
    progress_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES erp_sis_students(student_id) ON DELETE CASCADE,
    step_number INT NOT NULL REFERENCES enrollease_workflow_steps(step_number) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'locked', -- 'locked', 'action_required', 'ready_to_book', 'in_queue', 'completed'
    staff_notes TEXT DEFAULT '',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_student_step UNIQUE (student_id, step_number)
);

CREATE TABLE enrollease_time_slots (
    slot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    step_number INT NOT NULL REFERENCES enrollease_workflow_steps(step_number) ON DELETE CASCADE,
    office_window TEXT NOT NULL,
    max_capacity INT NOT NULL DEFAULT 15,
    booked_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE enrollease_appointments (
    appointment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_code TEXT UNIQUE NOT NULL,
    student_id TEXT NOT NULL REFERENCES erp_sis_students(student_id) ON DELETE CASCADE,
    slot_id UUID REFERENCES enrollease_time_slots(slot_id) ON DELETE SET NULL,
    step_number INT NOT NULL REFERENCES enrollease_workflow_steps(step_number) ON DELETE CASCADE,
    purpose TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Upcoming', -- 'Upcoming', 'Checked-In', 'Completed', 'Cancelled', 'No-Show'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE enrollease_live_queue (
    queue_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number TEXT NOT NULL,
    student_id TEXT NOT NULL REFERENCES erp_sis_students(student_id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    appointment_id UUID REFERENCES enrollease_appointments(appointment_id) ON DELETE SET NULL,
    step_number INT NOT NULL DEFAULT 2,
    counter_window TEXT NOT NULL,
    priority_type TEXT NOT NULL DEFAULT 'Booked Appointment', -- 'Booked Appointment', 'Regular Walk-In', 'Priority Lane'
    status TEXT NOT NULL DEFAULT 'Waiting', -- 'Waiting', 'Serving', 'Hold', 'Completed', 'Skipped'
    estimated_wait_mins INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    called_at TIMESTAMPTZ
);

-- ----------------------------------------------------------------------------
-- 3. PERMISSIVE ROW LEVEL SECURITY (RLS) FOR LIVE CLASSROOM DEMO
-- ----------------------------------------------------------------------------

ALTER TABLE erp_sis_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_sis_clearances ENABLE ROW LEVEL SECURITY;
ALTER TABLE erp_sis_curriculum_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollease_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollease_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollease_student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollease_time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollease_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollease_live_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all access on erp_sis_students" ON erp_sis_students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on erp_sis_clearances" ON erp_sis_clearances FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on erp_sis_curriculum_subjects" ON erp_sis_curriculum_subjects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on enrollease_users" ON enrollease_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on enrollease_workflow_steps" ON enrollease_workflow_steps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on enrollease_student_progress" ON enrollease_student_progress FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on enrollease_time_slots" ON enrollease_time_slots FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on enrollease_appointments" ON enrollease_appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all access on enrollease_live_queue" ON enrollease_live_queue FOR ALL USING (true) WITH CHECK (true);

-- ----------------------------------------------------------------------------
-- 4. REALTIME PUBLICATION SETUP
-- ----------------------------------------------------------------------------

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        CREATE PUBLICATION supabase_realtime;
    END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE enrollease_live_queue;
ALTER PUBLICATION supabase_realtime ADD TABLE enrollease_student_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE enrollease_appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE erp_sis_clearances;
ALTER PUBLICATION supabase_realtime ADD TABLE erp_sis_students;

-- ----------------------------------------------------------------------------
-- 5. RPC FUNCTION: sync_student_erp_status
-- ----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION sync_student_erp_status(p_student_id TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_student RECORD;
    v_has_hold BOOLEAN;
    v_all_cleared BOOLEAN;
    v_hold_count INT;
    v_progress_record RECORD;
    v_result JSONB;
BEGIN
    -- Fetch student
    SELECT * INTO v_student FROM erp_sis_students WHERE student_id = p_student_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Student not found in ERP');
    END IF;

    -- Check clearance holds
    SELECT COUNT(*) INTO v_hold_count FROM erp_sis_clearances 
    WHERE student_id = p_student_id AND status = 'Hold';

    v_has_hold := (v_hold_count > 0);
    v_all_cleared := NOT v_has_hold;

    -- Auto-synchronize step 1 & step 2 progress
    IF v_has_hold THEN
        -- Step 1 requires action
        INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes, updated_at)
        VALUES (p_student_id, 1, 'action_required', 'Outstanding clearance hold detected. Visit issuing offices.', NOW())
        ON CONFLICT (student_id, step_number)
        DO UPDATE SET status = 'action_required', staff_notes = 'Clearance holds pending.', updated_at = NOW();

        -- Step 2 remains locked until Step 1 is cleared
        INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes, updated_at)
        VALUES (p_student_id, 2, 'locked', 'Locked: Resolve Step 1 clearances first.', NOW())
        ON CONFLICT (student_id, step_number)
        DO UPDATE SET status = 'locked', staff_notes = 'Locked: Resolve Step 1 clearances first.', updated_at = NOW();

        UPDATE erp_sis_students SET erp_enrollment_status = 'Clearance Hold' WHERE student_id = p_student_id;
    ELSE
        -- Step 1 is Completed!
        INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes, updated_at)
        VALUES (p_student_id, 1, 'completed', 'All university clearances cleared.', NOW())
        ON CONFLICT (student_id, step_number)
        DO UPDATE SET status = 'completed', staff_notes = 'All university clearances cleared.', updated_at = NOW();

        -- Step 2 is ready to book or in progress
        INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes, updated_at)
        VALUES (p_student_id, 2, 'ready_to_book', 'Ready for Department Curriculum Advising.', NOW())
        ON CONFLICT (student_id, step_number)
        DO UPDATE SET status = CASE 
            WHEN enrollease_student_progress.status = 'completed' THEN 'completed'
            WHEN enrollease_student_progress.status = 'in_queue' THEN 'in_queue'
            ELSE 'ready_to_book'
        END, updated_at = NOW();

        IF v_student.erp_enrollment_status = 'Clearance Hold' THEN
            UPDATE erp_sis_students SET erp_enrollment_status = 'Eligible for Enrollment' WHERE student_id = p_student_id;
        END IF;
    END IF;

    -- Return consolidated student snapshot
    SELECT jsonb_build_object(
        'success', true,
        'student', row_to_json(v_student),
        'clearances', (SELECT jsonb_agg(c) FROM erp_sis_clearances c WHERE c.student_id = p_student_id),
        'subjects', (SELECT jsonb_agg(s) FROM erp_sis_curriculum_subjects s WHERE s.student_id = p_student_id),
        'progress', (SELECT jsonb_agg(p) FROM enrollease_student_progress p WHERE p.student_id = p_student_id),
        'appointments', (SELECT jsonb_agg(a) FROM enrollease_appointments a WHERE a.student_id = p_student_id),
        'active_queue', (SELECT row_to_json(q) FROM enrollease_live_queue q WHERE q.student_id = p_student_id AND q.status IN ('Waiting', 'Serving') LIMIT 1)
    ) INTO v_result;

    RETURN v_result;
END;
$$;

-- ----------------------------------------------------------------------------
-- 6. SEED DATA
-- ----------------------------------------------------------------------------

-- Workflow Steps (The 5 Standard Stages of Campus Enrollment)
INSERT INTO enrollease_workflow_steps (step_number, step_title, office_name, building_room, clear_instructions, required_documents) VALUES
(1, 'Pre-Enrollment Clearance Verification', 'Campus Clearance Offices', 'Clinic, Library, SAO, Cashier', 'Ensure all 5 campus clearances are marked Cleared. If you have a Hold remark, visit the corresponding office to settle your obligation.', ARRAY['Valid School ID', 'Clearance Slip / Medical Slip', 'Library Return Receipt']),
(2, 'Department Curriculum Advising & Subject Loading', 'Department of Computer Studies', 'IT Faculty Room - Room 304', 'Meet with your academic adviser to verify prerequisites, lock in your subjects (including PC 316), and evaluate your curriculum checklist.', ARRAY['Curriculum Checklist', 'Previous Semester Grade Slip', 'Advising Form']),
(3, 'Registrar Document Evaluation & Encoding', 'Office of the University Registrar', 'Admin Building - Windows 1 & 2', 'Submit your advised subject loading form for official system encoding into the university database.', ARRAY['Signed Advising Form', 'Good Moral Certificate (if required)', 'PSA Birth Certificate (freshmen)']),
(4, 'Cashier / UniFAST Assessment', 'Accounting & Cashier Office', 'Admin Building - Windows 3 & 4', 'Verify your UniFAST Free Higher Education eligibility or pay assessed fees if irregular/exceeded maximum residency.', ARRAY['Encoded Assessment Slip', 'Certificate of Indigency (if applicable)', 'UniFAST Annex A Form']),
(5, 'Official COR Printing & School ID Validation', 'Registrar Release Section', 'Admin Building - Window 5', 'Claim your official stamped Certificate of Registration (COR) and validate your student ID sticker for the new semester.', ARRAY['Validated Assessment Form', 'Official Receipt (if paid)', 'Current School ID Card'])
ON CONFLICT (step_number) DO UPDATE SET
    step_title = EXCLUDED.step_title,
    office_name = EXCLUDED.office_name,
    building_room = EXCLUDED.building_room,
    clear_instructions = EXCLUDED.clear_instructions,
    required_documents = EXCLUDED.required_documents;

-- Students
INSERT INTO erp_sis_students (student_id, first_name, last_name, full_name, email, program, year_level, section, student_type, tuition_status, balance_amount, erp_enrollment_status) VALUES
('2024-00101', 'Juan', 'Dela Cruz', 'Juan Dela Cruz', 'juan.delacruz@ctu.edu.ph', 'BS Information Technology', 3, 'BSIT 3-A', 'Regular', 'Cleared / UniFAST', 0.00, 'Eligible for Enrollment'),
('2024-00102', 'Maria', 'Santos', 'Maria Santos', 'maria.santos@ctu.edu.ph', 'BS Information Technology', 3, 'BSIT 3-B', 'Regular', 'With Balance', 1250.00, 'Clearance Hold'),
('2024-00103', 'Carlo', 'Mendoza', 'Carlo Mendoza', 'carlo.mendoza@ctu.edu.ph', 'BS Information Technology', 2, 'BSIT 2-A', 'Transferee', 'Cleared / UniFAST', 0.00, 'Advised')
ON CONFLICT (student_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    tuition_status = EXCLUDED.tuition_status,
    balance_amount = EXCLUDED.balance_amount,
    erp_enrollment_status = EXCLUDED.erp_enrollment_status;

-- Clearances for Juan Dela Cruz (All Cleared)
INSERT INTO erp_sis_clearances (student_id, office_code, office_name, location_room, status, remarks, updated_at) VALUES
('2024-00101', 'MEDICAL', 'Campus Clinic', 'Health Services Bldg Rm 101', 'Cleared', 'Annual physical exam completed.', NOW()),
('2024-00101', 'LIBRARY', 'University Library', 'Learning Resource Center 2F', 'Cleared', 'No overdue books or liabilities.', NOW()),
('2024-00101', 'SAO_GUIDANCE', 'Student Affairs & Guidance', 'Student Center Rm 204', 'Cleared', 'Good standing and conduct verified.', NOW()),
('2024-00101', 'CASHIER', 'Accounting & Cashier', 'Admin Bldg Window 4', 'Cleared', 'UniFAST Free Higher Education subsidized.', NOW()),
('2024-00101', 'DEPT_LAB', 'IT Department Laboratories', 'Computer Lab 3', 'Cleared', 'No missing hardware or laboratory liabilities.', NOW());

-- Clearances for Maria Santos (Has Holds for demonstration)
INSERT INTO erp_sis_clearances (student_id, office_code, office_name, location_room, status, remarks, updated_at) VALUES
('2024-00102', 'MEDICAL', 'Campus Clinic', 'Health Services Bldg Rm 101', 'Hold', 'Submit signed Medical Examination Slip at Campus Clinic.', NOW()),
('2024-00102', 'LIBRARY', 'University Library', 'Learning Resource Center 2F', 'Hold', 'Return borrowed Arduino Kit and Networking textbook.', NOW()),
('2024-00102', 'SAO_GUIDANCE', 'Student Affairs & Guidance', 'Student Center Rm 204', 'Cleared', 'Good standing verified.', NOW()),
('2024-00102', 'CASHIER', 'Accounting & Cashier', 'Admin Bldg Window 4', 'Cleared', 'Assessed for UniFAST subsidy.', NOW()),
('2024-00102', 'DEPT_LAB', 'IT Department Laboratories', 'Computer Lab 3', 'Cleared', 'Equipment return signed.', NOW());

-- Clearances for Carlo Mendoza
INSERT INTO erp_sis_clearances (student_id, office_code, office_name, location_room, status, remarks, updated_at) VALUES
('2024-00103', 'MEDICAL', 'Campus Clinic', 'Health Services Bldg Rm 101', 'Cleared', 'Health certificate valid.', NOW()),
('2024-00103', 'LIBRARY', 'University Library', 'Learning Resource Center 2F', 'Cleared', 'Transferee library clearance processed.', NOW()),
('2024-00103', 'SAO_GUIDANCE', 'Student Affairs & Guidance', 'Student Center Rm 204', 'Cleared', 'Orientation completed.', NOW()),
('2024-00103', 'CASHIER', 'Accounting & Cashier', 'Admin Bldg Window 4', 'Cleared', 'UniFAST verified.', NOW()),
('2024-00103', 'DEPT_LAB', 'IT Department Laboratories', 'Computer Lab 3', 'Cleared', 'Cleared.', NOW());

-- Curriculum Subjects (Including PC 316)
INSERT INTO erp_sis_curriculum_subjects (student_id, subject_code, descriptive_title, units, schedule_block, is_advised, semester, school_year) VALUES
('2024-00101', 'PC 316', 'Advanced Web Systems & Full-Stack Development', 3, 'MWF 09:00 AM - 10:30 AM (Lab 3)', TRUE, '1st Semester', '2026-2027'),
('2024-00101', 'IT 312', 'Information Assurance and Security', 3, 'TTH 10:30 AM - 12:00 PM (Room 402)', TRUE, '1st Semester', '2026-2027'),
('2024-00101', 'IT 313', 'Mobile Application Development', 3, 'MWF 01:00 PM - 02:30 PM (Lab 2)', TRUE, '1st Semester', '2026-2027'),
('2024-00101', 'IT 314', 'Networking 2 / Advanced Routing & Switching', 3, 'TTH 01:00 PM - 02:30 PM (Cisco Lab)', TRUE, '1st Semester', '2026-2027'),
('2024-00101', 'GE 311', 'Ethics and Social Issues in Computing', 3, 'Friday 03:00 PM - 06:00 PM (AVR)', TRUE, '1st Semester', '2026-2027'),

('2024-00102', 'PC 316', 'Advanced Web Systems & Full-Stack Development', 3, 'MWF 10:30 AM - 12:00 PM (Lab 3)', FALSE, '1st Semester', '2026-2027'),
('2024-00102', 'IT 312', 'Information Assurance and Security', 3, 'TTH 08:30 AM - 10:00 AM (Room 402)', FALSE, '1st Semester', '2026-2027'),
('2024-00102', 'IT 313', 'Mobile Application Development', 3, 'MWF 02:30 PM - 04:00 PM (Lab 2)', FALSE, '1st Semester', '2026-2027');

-- EnrollEase Users
INSERT INTO enrollease_users (student_id, pin_or_password, role) VALUES
('2024-00101', 'demo1234', 'student'),
('2024-00102', 'demo1234', 'student'),
('2024-00103', 'demo1234', 'student'),
('STAFF-ADV-01', 'staff123', 'staff_advising'),
('STAFF-REG-01', 'staff123', 'staff_registrar'),
('STAFF-CSH-01', 'staff123', 'staff_cashier')
ON CONFLICT (student_id) DO NOTHING;

-- Initial Progress for Juan Dela Cruz
INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes) VALUES
('2024-00101', 1, 'completed', 'All 5 offices signed and cleared online.'),
('2024-00101', 2, 'in_queue', 'Waiting for IT Advising Window 1.'),
('2024-00101', 3, 'locked', 'Pending Step 2 advising signature.'),
('2024-00101', 4, 'locked', 'Pending registrar evaluation.'),
('2024-00101', 5, 'locked', 'Pending assessment.');

-- Initial Progress for Maria Santos
INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes) VALUES
('2024-00102', 1, 'action_required', 'Clinic & Library clearance holds must be resolved first.'),
('2024-00102', 2, 'locked', 'Locked due to pre-enrollment clearance hold.'),
('2024-00102', 3, 'locked', 'Locked.'),
('2024-00102', 4, 'locked', 'Locked.'),
('2024-00102', 5, 'locked', 'Locked.');

-- Appointments
INSERT INTO enrollease_appointments (reference_code, student_id, step_number, purpose, status) VALUES
('EE-2026-8841', '2024-00101', 2, 'Curriculum Advising & PC 316 Loading', 'Checked-In'),
('EE-2026-9022', '2024-00103', 3, 'Registrar Document Verification', 'Upcoming');

-- Live Queue Tickets
INSERT INTO enrollease_live_queue (ticket_number, student_id, student_name, step_number, counter_window, priority_type, status, estimated_wait_mins, called_at) VALUES
('ADV-001', '2024-00095', 'Andrea Nicole Lim', 2, 'Window 1 - IT Advising', 'Booked Appointment', 'Serving', 0, NOW() - INTERVAL '4 minutes'),
('ADV-004', '2024-00101', 'Juan Dela Cruz', 2, 'Window 1 - IT Advising', 'Booked Appointment', 'Waiting', 8, NULL),
('ADV-007', '2024-00115', 'Mark Kenneth Bautista', 2, 'Window 1 - IT Advising', 'Regular Walk-In', 'Waiting', 16, NULL),
('REG-014', '2024-00088', 'Samantha Rose Cruz', 3, 'Window 2 - Registrar', 'Booked Appointment', 'Serving', 0, NOW() - INTERVAL '2 minutes'),
('REG-019', '2024-00103', 'Carlo Mendoza', 3, 'Window 2 - Registrar', 'Booked Appointment', 'Waiting', 12, NULL);
