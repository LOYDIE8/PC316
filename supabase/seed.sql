-- ============================================================================
-- EnrollEase (PC316v2) - Dual-Database Domain Architecture Migration
-- Domain 1: Simulated School ERP (erp_sis_*)
-- Domain 2: EnrollEase Operational DB (enrollease_*)
-- Student ID Format: 7 Digits (e.g. 8240873)
-- Real Enrollment Flow:
--   Step 1: Department Head Advising (IT, BIT, HM, EDUC, IE) - No Queuing
--   Step 2: Campus Clinic Clearance - Live Queuing Starts
--   Step 3: Student Affairs Office (SAO) Clearance - Live Queuing
--   Step 4: University Library Clearance - Live Queuing
--   Step 5: Cashier & Accounting Assessment - Live Queuing
--   Step 6: Registrar Document Evaluation & COR Printing - Live Queuing
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
    year_level INT NOT NULL DEFAULT 2,
    section TEXT NOT NULL DEFAULT 'BSIT 2-A',
    student_type TEXT NOT NULL DEFAULT 'Regular', -- 'Regular', 'Irregular', 'Freshman', 'Transferee'
    tuition_status TEXT NOT NULL DEFAULT 'Cleared / UniFAST', -- 'Cleared / UniFAST', 'With Balance', 'Pending Assessment'
    balance_amount NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    erp_enrollment_status TEXT NOT NULL DEFAULT 'Eligible for Enrollment', -- 'Not Enrolled', 'Clearance Hold', 'Eligible for Enrollment', 'Advised', 'Officially Enrolled'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE erp_sis_clearances (
    clearance_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id TEXT NOT NULL REFERENCES erp_sis_students(student_id) ON DELETE CASCADE,
    office_code TEXT NOT NULL, -- 'DEPT_HEAD', 'CLINIC', 'SAO', 'LIBRARY', 'CASHIER'
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
    role TEXT NOT NULL DEFAULT 'student', -- 'student', 'staff_clinic', 'staff_sao', 'staff_library', 'staff_cashier', 'staff_registrar', 'admin'
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
    student_id TEXT REFERENCES erp_sis_students(student_id) ON DELETE SET NULL,
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
    v_clinic_hold BOOLEAN;
    v_lib_hold BOOLEAN;
    v_result JSONB;
BEGIN
    SELECT * INTO v_student FROM erp_sis_students WHERE student_id = p_student_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Student not found in ERP');
    END IF;

    -- Check clearance holds
    SELECT COUNT(*) INTO v_hold_count FROM erp_sis_clearances 
    WHERE student_id = p_student_id AND status = 'Hold';

    SELECT EXISTS(SELECT 1 FROM erp_sis_clearances WHERE student_id = p_student_id AND office_code = 'CLINIC' AND status = 'Hold') INTO v_clinic_hold;
    SELECT EXISTS(SELECT 1 FROM erp_sis_clearances WHERE student_id = p_student_id AND office_code = 'LIBRARY' AND status = 'Hold') INTO v_lib_hold;

    v_has_hold := (v_hold_count > 0);
    v_all_cleared := NOT v_has_hold;

    -- If holds exist, reflect in progress
    IF v_clinic_hold THEN
        INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes, updated_at)
        VALUES (p_student_id, 2, 'action_required', 'Medical clearance hold detected. Visit Campus Clinic.', NOW())
        ON CONFLICT (student_id, step_number)
        DO UPDATE SET status = 'action_required', staff_notes = 'Medical clearance hold pending.', updated_at = NOW();
    END IF;

    IF v_lib_hold THEN
        INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes, updated_at)
        VALUES (p_student_id, 4, 'action_required', 'Library clearance hold detected. Settle library liabilities.', NOW())
        ON CONFLICT (student_id, step_number)
        DO UPDATE SET status = 'action_required', staff_notes = 'Library liabilities pending.', updated_at = NOW();
    END IF;

    IF v_has_hold THEN
        UPDATE erp_sis_students SET erp_enrollment_status = 'Clearance Hold' WHERE student_id = p_student_id;
    ELSE
        IF v_student.erp_enrollment_status = 'Clearance Hold' THEN
            UPDATE erp_sis_students SET erp_enrollment_status = 'Eligible for Enrollment' WHERE student_id = p_student_id;
        END IF;
    END IF;

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
-- 6. SEED DATA (Real 6-Step University Enrollment Flow)
-- ----------------------------------------------------------------------------

-- Workflow Steps (Step 1 Department Head has NO QUEUING; Queuing starts at Step 2 Clinic)
INSERT INTO enrollease_workflow_steps (step_number, step_title, office_name, building_room, clear_instructions, required_documents) VALUES
(1, 'Department Head Advising & Evaluation', 'Department Head Office', 'Department Office (IT, BIT, HM, EDUC, IE)', 'Consult with your Department Head or assigned faculty adviser for curriculum evaluation and subject loading approval. Note: Direct walk-in consultation; no queuing ticket required.', ARRAY['Curriculum Checklist', 'Previous Semester Grade Slip', 'Pre-Enrollment Advising Sheet']),
(2, 'Campus Clinic Clearance', 'Campus Health Services', 'Health Services Building - Clinic Windows 1 & 2', 'Queue up at the Campus Clinic for annual physical examination verification and medical clearance slip validation.', ARRAY['Valid Student ID Card', 'Medical Examination Slip', 'Health Declaration Form']),
(3, 'Student Affairs Office (SAO) Clearance', 'Student Affairs & Guidance Office', 'Student Center Building - Room 204', 'Queue up at the SAO counter for student conduct review, disciplinary clearance, and good moral verification.', ARRAY['Valid Student ID Card', 'SAO Clearance Slip', 'Student Handbook']),
(4, 'University Library Clearance', 'University Library', 'Learning Resource Center - 2nd Floor Circulation Desk', 'Queue up at the Library circulation desk to verify book returns, clear overdue liabilities, and update library privileges.', ARRAY['Valid Student ID Card', 'Library Borrower Card', 'Return Receipts (if applicable)']),
(5, 'Cashier & Accounting Assessment', 'Accounting & Cashier Office', 'Administration Building - Cashier Windows 3 & 4', 'Queue up at the Cashier counter for UniFAST Free Higher Education billing validation or payment of assessed miscellaneous fees.', ARRAY['Encoded Assessment Form', 'UniFAST Billing Sheet', 'Official Payment Slip (if paying balance)']),
(6, 'Registrar Document Evaluation & COR Printing', 'Office of the University Registrar', 'Administration Building - Registrar Windows 1 & 2', 'Queue up at the Registrar counter for official database encoding, official Certificate of Registration (COR) printing, and student ID semester validation sticker. Enrollment complete.', ARRAY['Signed Department Advising Slip', 'Validated Cashier Assessment Slip', 'Valid Student ID Card'])
ON CONFLICT (step_number) DO UPDATE SET
    step_title = EXCLUDED.step_title,
    office_name = EXCLUDED.office_name,
    building_room = EXCLUDED.building_room,
    clear_instructions = EXCLUDED.clear_instructions,
    required_documents = EXCLUDED.required_documents;

-- Students Master
INSERT INTO erp_sis_students (student_id, first_name, last_name, full_name, email, program, year_level, section, student_type, tuition_status, balance_amount, erp_enrollment_status) VALUES
('8240871', 'Andrea Nicole', 'Lim', 'Andrea Nicole Lim', 'andrea.lim@ctu.edu.ph', 'BS Information Technology', 2, 'BSIT 2-A', 'Regular', 'Cleared / UniFAST', 0.00, 'Eligible for Enrollment'),
('8240872', 'Samantha Rose', 'Cruz', 'Samantha Rose Cruz', 'samantha.cruz@ctu.edu.ph', 'BS Information Technology', 2, 'BSIT 2-A', 'Regular', 'Cleared / UniFAST', 0.00, 'Eligible for Enrollment'),
('8240873', 'Juan', 'Dela Cruz', 'Juan Dela Cruz', 'juan.delacruz@ctu.edu.ph', 'BS Information Technology', 2, 'BSIT 2-A', 'Regular', 'Cleared / UniFAST', 0.00, 'Eligible for Enrollment'),
('8240874', 'Maria', 'Santos', 'Maria Santos', 'maria.santos@ctu.edu.ph', 'BS Information Technology', 2, 'BSIT 2-B', 'Regular', 'With Balance', 1250.00, 'Clearance Hold'),
('8240875', 'Carlo', 'Mendoza', 'Carlo Mendoza', 'carlo.mendoza@ctu.edu.ph', 'BS Information Technology', 2, 'BSIT 2-A', 'Transferee', 'Cleared / UniFAST', 0.00, 'Advised'),
('8240876', 'Mark Kenneth', 'Bautista', 'Mark Kenneth Bautista', 'mark.bautista@ctu.edu.ph', 'BS Information Technology', 2, 'BSIT 2-B', 'Regular', 'Cleared / UniFAST', 0.00, 'Eligible for Enrollment')
ON CONFLICT (student_id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    tuition_status = EXCLUDED.tuition_status,
    balance_amount = EXCLUDED.balance_amount,
    erp_enrollment_status = EXCLUDED.erp_enrollment_status;

-- Clearances for 8240873 (Juan Dela Cruz - 2nd Year)
INSERT INTO erp_sis_clearances (student_id, office_code, office_name, location_room, status, remarks, updated_at) VALUES
('8240873', 'DEPT_HEAD', 'IT Department Head', 'Department Office Room 304', 'Cleared', 'Curriculum subjects approved.', NOW()),
('8240873', 'CLINIC', 'Campus Clinic', 'Health Services Bldg Rm 101', 'Cleared', 'Annual physical exam completed.', NOW()),
('8240873', 'SAO', 'Student Affairs & Guidance', 'Student Center Rm 204', 'Cleared', 'Good standing and conduct verified.', NOW()),
('8240873', 'LIBRARY', 'University Library', 'Learning Resource Center 2F', 'Cleared', 'No overdue books or liabilities.', NOW()),
('8240873', 'CASHIER', 'Accounting & Cashier', 'Admin Bldg Window 4', 'Cleared', 'UniFAST Free Higher Education subsidized.', NOW());

-- Clearances for 8240874 (Maria Santos - Has Holds at Clinic and Library)
INSERT INTO erp_sis_clearances (student_id, office_code, office_name, location_room, status, remarks, updated_at) VALUES
('8240874', 'DEPT_HEAD', 'IT Department Head', 'Department Office Room 304', 'Cleared', 'Advising checklist signed.', NOW()),
('8240874', 'CLINIC', 'Campus Clinic', 'Health Services Bldg Rm 101', 'Hold', 'Submit signed Medical Examination Slip at Campus Clinic.', NOW()),
('8240874', 'SAO', 'Student Affairs & Guidance', 'Student Center Rm 204', 'Cleared', 'Good standing verified.', NOW()),
('8240874', 'LIBRARY', 'University Library', 'Learning Resource Center 2F', 'Hold', 'Return borrowed Arduino Kit and Networking textbook.', NOW()),
('8240874', 'CASHIER', 'Accounting & Cashier', 'Admin Bldg Window 4', 'Cleared', 'Assessed for UniFAST subsidy.', NOW());

-- Clearances for 8240875 (Carlo Mendoza - Transferee)
INSERT INTO erp_sis_clearances (student_id, office_code, office_name, location_room, status, remarks, updated_at) VALUES
('8240875', 'DEPT_HEAD', 'IT Department Head', 'Department Office Room 304', 'Cleared', 'Transferee subject crediting approved.', NOW()),
('8240875', 'CLINIC', 'Campus Clinic', 'Health Services Bldg Rm 101', 'Cleared', 'Health certificate valid.', NOW()),
('8240875', 'SAO', 'Student Affairs & Guidance', 'Student Center Rm 204', 'Cleared', 'Transferee orientation completed.', NOW()),
('8240875', 'LIBRARY', 'University Library', 'Learning Resource Center 2F', 'Cleared', 'Transferee library clearance processed.', NOW()),
('8240875', 'CASHIER', 'Accounting & Cashier', 'Admin Bldg Window 4', 'Cleared', 'UniFAST verified.', NOW());

-- Clearances for 8240871, 8240872, 8240876
INSERT INTO erp_sis_clearances (student_id, office_code, office_name, location_room, status, remarks, updated_at) VALUES
('8240871', 'DEPT_HEAD', 'IT Department Head', 'Department Office Room 304', 'Cleared', 'Cleared.', NOW()),
('8240871', 'CLINIC', 'Campus Clinic', 'Health Services Bldg Rm 101', 'Cleared', 'Cleared.', NOW()),
('8240872', 'DEPT_HEAD', 'IT Department Head', 'Department Office Room 304', 'Cleared', 'Cleared.', NOW()),
('8240872', 'CLINIC', 'Campus Clinic', 'Health Services Bldg Rm 101', 'Cleared', 'Cleared.', NOW()),
('8240876', 'DEPT_HEAD', 'IT Department Head', 'Department Office Room 304', 'Cleared', 'Cleared.', NOW()),
('8240876', 'CLINIC', 'Campus Clinic', 'Health Services Bldg Rm 101', 'Cleared', 'Cleared.', NOW());

-- Curriculum Subjects (Including PC 316)
INSERT INTO erp_sis_curriculum_subjects (student_id, subject_code, descriptive_title, units, schedule_block, is_advised, semester, school_year) VALUES
('8240873', 'PC 316', 'Advanced Web Systems & Full-Stack Development', 3, 'MWF 09:00 AM - 10:30 AM (Lab 3)', TRUE, '1st Semester', '2026-2027'),
('8240873', 'IT 312', 'Information Assurance and Security', 3, 'TTH 10:30 AM - 12:00 PM (Room 402)', TRUE, '1st Semester', '2026-2027'),
('8240873', 'IT 313', 'Mobile Application Development', 3, 'MWF 01:00 PM - 02:30 PM (Lab 2)', TRUE, '1st Semester', '2026-2027'),
('8240873', 'IT 314', 'Networking 2 / Advanced Routing & Switching', 3, 'TTH 01:00 PM - 02:30 PM (Cisco Lab)', TRUE, '1st Semester', '2026-2027'),
('8240873', 'GE 311', 'Ethics and Social Issues in Computing', 3, 'Friday 03:00 PM - 06:00 PM (AVR)', TRUE, '1st Semester', '2026-2027'),

('8240874', 'PC 316', 'Advanced Web Systems & Full-Stack Development', 3, 'MWF 10:30 AM - 12:00 PM (Lab 3)', FALSE, '1st Semester', '2026-2027'),
('8240874', 'IT 312', 'Information Assurance and Security', 3, 'TTH 08:30 AM - 10:00 AM (Room 402)', FALSE, '1st Semester', '2026-2027'),
('8240874', 'IT 313', 'Mobile Application Development', 3, 'MWF 02:30 PM - 04:00 PM (Lab 2)', FALSE, '1st Semester', '2026-2027'),

('8240875', 'PC 316', 'Advanced Web Systems & Full-Stack Development', 3, 'MWF 09:00 AM - 10:30 AM (Lab 3)', TRUE, '1st Semester', '2026-2027'),
('8240875', 'IT 312', 'Information Assurance and Security', 3, 'TTH 10:30 AM - 12:00 PM (Room 402)', TRUE, '1st Semester', '2026-2027');

-- EnrollEase Users
INSERT INTO enrollease_users (student_id, pin_or_password, role) VALUES
('8240871', 'demo1234', 'student'),
('8240872', 'demo1234', 'student'),
('8240873', 'demo1234', 'student'),
('8240874', 'demo1234', 'student'),
('8240875', 'demo1234', 'student'),
('8240876', 'demo1234', 'student'),
('STAFF-CLN-01', 'staff123', 'staff_clinic'),
('STAFF-SAO-01', 'staff123', 'staff_sao'),
('STAFF-LIB-01', 'staff123', 'staff_library'),
('STAFF-CSH-01', 'staff123', 'staff_cashier'),
('STAFF-REG-01', 'staff123', 'staff_registrar')
ON CONFLICT (student_id) DO NOTHING;

-- Initial Progress for Juan Dela Cruz (8240873 - 2nd Year)
INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes) VALUES
('8240873', 1, 'completed', 'Advised and evaluated by IT Department Head.'),
('8240873', 2, 'in_queue', 'Waiting in live queue at Campus Clinic.'),
('8240873', 3, 'locked', 'Pending Step 2 Clinic clearance.'),
('8240873', 4, 'locked', 'Pending Step 3 SAO clearance.'),
('8240873', 5, 'locked', 'Pending Step 4 Library clearance.'),
('8240873', 6, 'locked', 'Pending Step 5 Cashier assessment.');

-- Initial Progress for Maria Santos (8240874)
INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes) VALUES
('8240874', 1, 'completed', 'Department Head evaluation signed.'),
('8240874', 2, 'action_required', 'Clinic clearance hold: Medical slip required.'),
('8240874', 3, 'ready_to_book', 'SAO good standing cleared.'),
('8240874', 4, 'action_required', 'Library clearance hold: Return borrowed Arduino kit.'),
('8240874', 5, 'locked', 'Pending clearance resolution.'),
('8240874', 6, 'locked', 'Pending assessment.');

-- Initial Progress for Carlo Mendoza (8240875)
INSERT INTO enrollease_student_progress (student_id, step_number, status, staff_notes) VALUES
('8240875', 1, 'completed', 'Transferee advising signed by Department Head.'),
('8240875', 2, 'completed', 'Clinic physical exam passed.'),
('8240875', 3, 'completed', 'SAO orientation verified.'),
('8240875', 4, 'completed', 'Library clearance cleared.'),
('8240875', 5, 'completed', 'UniFAST free tuition assessed.'),
('8240875', 6, 'ready_to_book', 'Ready for Registrar Encoding & COR Release.');

-- Appointments
INSERT INTO enrollease_appointments (reference_code, student_id, step_number, purpose, status) VALUES
('EE-2026-8841', '8240873', 2, 'Campus Clinic Clearance', 'Checked-In'),
('EE-2026-9022', '8240875', 6, 'Registrar Document Verification & COR Printing', 'Upcoming');

-- Live Queue Tickets (Queue starts at Step 2 Clinic!)
INSERT INTO enrollease_live_queue (ticket_number, student_id, student_name, step_number, counter_window, priority_type, status, estimated_wait_mins, called_at) VALUES
('CLN-001', '8240871', 'Andrea Nicole Lim', 2, 'Clinic Window 1', 'Booked Appointment', 'Serving', 0, NOW() - INTERVAL '4 minutes'),
('CLN-004', '8240873', 'Juan Dela Cruz', 2, 'Clinic Window 1', 'Booked Appointment', 'Waiting', 8, NULL),
('CLN-007', '8240876', 'Mark Kenneth Bautista', 2, 'Clinic Window 1', 'Regular Walk-In', 'Waiting', 16, NULL),
('SAO-012', '8240872', 'Samantha Rose Cruz', 3, 'SAO Window 1', 'Booked Appointment', 'Serving', 0, NOW() - INTERVAL '2 minutes'),
('REG-019', '8240875', 'Carlo Mendoza', 6, 'Registrar Window 2', 'Booked Appointment', 'Waiting', 12, NULL);
