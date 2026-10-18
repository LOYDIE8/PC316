// ============================================================================
// EnrollEase (PC316v2) - Core Application Controller & Realtime Router
// Student ID Format: 7 Digits (e.g. 8240873)
// 6-Stage Campus Enrollment Flow:
//   Step 1: Department Head Advising & Evaluation (Walk-in; No Queuing)
//   Step 2: Campus Clinic Clearance (Live Queuing: CLN-xxx)
//   Step 3: Student Affairs Office (SAO) Clearance (Live Queuing: SAO-xxx)
//   Step 4: University Library Clearance (Live Queuing: LIB-xxx)
//   Step 5: Cashier & Accounting Assessment (Live Queuing: CSH-xxx)
//   Step 6: Registrar Document Evaluation & COR Printing (Live Queuing: REG-xxx)
// ============================================================================

(function () {
  'use strict';

  // --- SEED INITIAL STATE ---
  function initStorage() {
    // Force reseed if not v5 or if legacy dash IDs are detected
    if (!localStorage.getItem('ee_seeded_v5') || (localStorage.getItem('ee_session') && localStorage.getItem('ee_session').includes('-'))) {
      const students = [
        {
          student_id: '8240871',
          first_name: 'Andrea Nicole',
          last_name: 'Lim',
          full_name: 'Andrea Nicole Lim',
          email: 'andrea.lim@ctu.edu.ph',
          program: 'BS Information Technology',
          year_level: 2,
          section: 'BSIT 2-A',
          student_type: 'Regular',
          tuition_status: 'Cleared / UniFAST',
          balance_amount: 0.0,
          erp_enrollment_status: 'Eligible for Enrollment',
          contact: '+63 911 234 5678'
        },
        {
          student_id: '8240872',
          first_name: 'Samantha Rose',
          last_name: 'Cruz',
          full_name: 'Samantha Rose Cruz',
          email: 'samantha.cruz@ctu.edu.ph',
          program: 'BS Information Technology',
          year_level: 2,
          section: 'BSIT 2-A',
          student_type: 'Regular',
          tuition_status: 'Cleared / UniFAST',
          balance_amount: 0.0,
          erp_enrollment_status: 'Eligible for Enrollment',
          contact: '+63 912 876 5432'
        },
        {
          student_id: '8240873',
          first_name: 'Juan',
          last_name: 'Dela Cruz',
          full_name: 'Juan Dela Cruz',
          email: 'juan.delacruz@ctu.edu.ph',
          program: 'BS Information Technology',
          year_level: 2,
          section: 'BSIT 2-A',
          student_type: 'Regular',
          tuition_status: 'Cleared / UniFAST',
          balance_amount: 0.0,
          erp_enrollment_status: 'Eligible for Enrollment',
          contact: '+63 912 345 6789'
        },
        {
          student_id: '8240874',
          first_name: 'Maria',
          last_name: 'Santos',
          full_name: 'Maria Santos',
          email: 'maria.santos@ctu.edu.ph',
          program: 'BS Information Technology',
          year_level: 2,
          section: 'BSIT 2-B',
          student_type: 'Regular',
          tuition_status: 'With Balance',
          balance_amount: 1250.0,
          erp_enrollment_status: 'Clearance Hold',
          contact: '+63 923 456 7890'
        },
        {
          student_id: '8240875',
          first_name: 'Carlo',
          last_name: 'Mendoza',
          full_name: 'Carlo Mendoza',
          email: 'carlo.mendoza@ctu.edu.ph',
          program: 'BS Information Technology',
          year_level: 2,
          section: 'BSIT 2-A',
          student_type: 'Transferee',
          tuition_status: 'Cleared / UniFAST',
          balance_amount: 0.0,
          erp_enrollment_status: 'Advised',
          contact: '+63 934 567 8901'
        },
        {
          student_id: '8240876',
          first_name: 'Mark Kenneth',
          last_name: 'Bautista',
          full_name: 'Mark Kenneth Bautista',
          email: 'mark.bautista@ctu.edu.ph',
          program: 'BS Information Technology',
          year_level: 2,
          section: 'BSIT 2-B',
          student_type: 'Regular',
          tuition_status: 'Cleared / UniFAST',
          balance_amount: 0.0,
          erp_enrollment_status: 'Eligible for Enrollment',
          contact: '+63 945 678 9012'
        }
      ];

      const clearances = [
        // 8240873 - Juan Dela Cruz (All 5 Offices Cleared)
        { student_id: '8240873', office_code: 'DEPT_HEAD', office_name: 'Department Head Advising', location_room: 'Department Office (IT, BIT, HM, EDUC, IE)', status: 'Cleared', remarks: 'Curriculum checklist verified and major subjects approved.' },
        { student_id: '8240873', office_code: 'CLINIC', office_name: 'Campus Health Services', location_room: 'Health Services Bldg - Clinic Windows 1 & 2', status: 'Cleared', remarks: 'Annual physical examination and health form validated.' },
        { student_id: '8240873', office_code: 'SAO', office_name: 'Student Affairs & Guidance', location_room: 'Student Center - Room 204', status: 'Cleared', remarks: 'Good moral standing confirmed. No disciplinary record.' },
        { student_id: '8240873', office_code: 'LIBRARY', office_name: 'University Library', location_room: 'Learning Resource Center - 2F Circulation Desk', status: 'Cleared', remarks: 'All borrowed books returned. No overdue charges.' },
        { student_id: '8240873', office_code: 'CASHIER', office_name: 'Accounting & Cashier Office', location_room: 'Admin Bldg - Cashier Windows 3 & 4', status: 'Cleared', remarks: 'UniFAST Free Higher Education billing validated. Zero balance.' },

        // 8240874 - Maria Santos (Clinic & Library Holds)
        { student_id: '8240874', office_code: 'DEPT_HEAD', office_name: 'Department Head Advising', location_room: 'Department Office (IT, BIT, HM, EDUC, IE)', status: 'Cleared', remarks: 'Curriculum evaluation approved.' },
        { student_id: '8240874', office_code: 'CLINIC', office_name: 'Campus Health Services', location_room: 'Health Services Bldg - Clinic Windows 1 & 2', status: 'Hold', remarks: 'Submit signed Medical Examination Slip at Campus Health Services.' },
        { student_id: '8240874', office_code: 'SAO', office_name: 'Student Affairs & Guidance', location_room: 'Student Center - Room 204', status: 'Cleared', remarks: 'Good moral clearance passed.' },
        { student_id: '8240874', office_code: 'LIBRARY', office_name: 'University Library', location_room: 'Learning Resource Center - 2F Circulation Desk', status: 'Hold', remarks: 'Return overdue reference book: Systems Analysis and Design.' },
        { student_id: '8240874', office_code: 'CASHIER', office_name: 'Accounting & Cashier Office', location_room: 'Admin Bldg - Cashier Windows 3 & 4', status: 'Cleared', remarks: 'Assessment in order.' },

        // 8240875 - Carlo Mendoza (Transferee - All Cleared)
        { student_id: '8240875', office_code: 'DEPT_HEAD', office_name: 'Department Head Advising', location_room: 'Department Office (IT, BIT, HM, EDUC, IE)', status: 'Cleared', remarks: 'Transferee credit evaluation completed.' },
        { student_id: '8240875', office_code: 'CLINIC', office_name: 'Campus Health Services', location_room: 'Health Services Bldg - Clinic Windows 1 & 2', status: 'Cleared', remarks: 'Medical clearance passed.' },
        { student_id: '8240875', office_code: 'SAO', office_name: 'Student Affairs & Guidance', location_room: 'Student Center - Room 204', status: 'Cleared', remarks: 'Transferee clearance validated.' },
        { student_id: '8240875', office_code: 'LIBRARY', office_name: 'University Library', location_room: 'Learning Resource Center - 2F Circulation Desk', status: 'Cleared', remarks: 'Library card issued.' },
        { student_id: '8240875', office_code: 'CASHIER', office_name: 'Accounting & Cashier Office', location_room: 'Admin Bldg - Cashier Windows 3 & 4', status: 'Cleared', remarks: 'UniFAST subsidy active.' }
      ];

      const subjects = [
        { student_id: '8240873', subject_code: 'PC 316', descriptive_title: 'Advanced Web Systems & Full-Stack Development', units: 3, schedule_block: 'MWF 09:00 AM - 10:30 AM (Lab 3)', is_advised: true },
        { student_id: '8240873', subject_code: 'IT 311', descriptive_title: 'Advanced Database Management Systems', units: 3, schedule_block: 'TTH 01:00 PM - 02:30 PM (Lab 1)', is_advised: true },
        { student_id: '8240873', subject_code: 'IT 312', descriptive_title: 'Information Assurance and Security', units: 3, schedule_block: 'TTH 08:30 AM - 10:00 AM (Room 402)', is_advised: true },
        { student_id: '8240873', subject_code: 'IT 313', descriptive_title: 'Mobile Application Development', units: 3, schedule_block: 'MWF 02:30 PM - 04:00 PM (Lab 2)', is_advised: true },
        { student_id: '8240873', subject_code: 'GE 109', descriptive_title: 'Ethics and Moral Reasoning', units: 3, schedule_block: 'Saturday 08:00 AM - 11:00 AM (Room 201)', is_advised: true },

        { student_id: '8240874', subject_code: 'PC 316', descriptive_title: 'Advanced Web Systems & Full-Stack Development', units: 3, schedule_block: 'MWF 09:00 AM - 10:30 AM (Lab 3)', is_advised: false },
        { student_id: '8240874', subject_code: 'IT 311', descriptive_title: 'Advanced Database Management Systems', units: 3, schedule_block: 'TTH 01:00 PM - 02:30 PM (Lab 1)', is_advised: false },
        { student_id: '8240874', subject_code: 'IT 312', descriptive_title: 'Information Assurance and Security', units: 3, schedule_block: 'TTH 08:30 AM - 10:00 AM (Room 402)', is_advised: false },
        { student_id: '8240874', subject_code: 'IT 313', descriptive_title: 'Mobile Application Development', units: 3, schedule_block: 'MWF 02:30 PM - 04:00 PM (Lab 2)', is_advised: false },

        { student_id: '8240875', subject_code: 'PC 316', descriptive_title: 'Advanced Web Systems & Full-Stack Development', units: 3, schedule_block: 'MWF 09:00 AM - 10:30 AM (Lab 3)', is_advised: true },
        { student_id: '8240875', subject_code: 'IT 312', descriptive_title: 'Information Assurance and Security', units: 3, schedule_block: 'TTH 10:30 AM - 12:00 PM (Room 402)', is_advised: true }
      ];

      const workflowSteps = [
        {
          step_number: 1,
          step_title: 'Department Head Advising & Evaluation',
          office_name: 'Department Head Office',
          building_room: 'Department Office (IT, BIT, HM, EDUC, IE)',
          clear_instructions: 'Consult directly with your Department Head or assigned faculty adviser for curriculum checklist evaluation and subject loading approval. Note: Direct walk-in consultation; no queuing ticket required.',
          required_documents: ['Curriculum Checklist', 'Previous Semester Grade Slip', 'Pre-Enrollment Advising Sheet']
        },
        {
          step_number: 2,
          step_title: 'Campus Clinic Clearance',
          office_name: 'Campus Health Services',
          building_room: 'Health Services Building - Clinic Windows 1 & 2',
          clear_instructions: 'Queue up at the Campus Clinic for annual physical examination verification and medical clearance slip validation.',
          required_documents: ['Valid Student ID Card', 'Medical Examination Slip', 'Health Declaration Form']
        },
        {
          step_number: 3,
          step_title: 'Student Affairs Office (SAO) Clearance',
          office_name: 'Student Affairs & Guidance Office',
          building_room: 'Student Center Building - Room 204',
          clear_instructions: 'Queue up at the SAO counter for student conduct review, disciplinary clearance, and good moral certificate verification.',
          required_documents: ['Valid Student ID Card', 'SAO Clearance Slip', 'Student Handbook']
        },
        {
          step_number: 4,
          step_title: 'University Library Clearance',
          office_name: 'University Library',
          building_room: 'Learning Resource Center - 2nd Floor Circulation Desk',
          clear_instructions: 'Queue up at the Library circulation desk to verify book returns, clear overdue liabilities, and update library borrowing privileges.',
          required_documents: ['Valid Student ID Card', 'Library Borrower Card', 'Return Receipts (if applicable)']
        },
        {
          step_number: 5,
          step_title: 'Cashier & Accounting Assessment',
          office_name: 'Accounting & Cashier Office',
          building_room: 'Administration Building - Cashier Windows 3 & 4',
          clear_instructions: 'Queue up at the Cashier counter for UniFAST Free Higher Education billing validation or payment of assessed miscellaneous fees.',
          required_documents: ['Encoded Assessment Form', 'UniFAST Billing Sheet', 'Official Payment Slip (if paying balance)']
        },
        {
          step_number: 6,
          step_title: 'Registrar Document Evaluation & COR Printing',
          office_name: 'Office of the University Registrar',
          building_room: 'Administration Building - Registrar Windows 1 & 2',
          clear_instructions: 'Queue up at the Registrar counter for official database encoding, official Certificate of Registration (COR) printing, and student ID semester validation sticker. Enrollment complete.',
          required_documents: ['Signed Department Advising Slip', 'Validated Cashier Assessment Slip', 'Valid Student ID Card']
        }
      ];

      const progress = [
        // 8240873 - Juan Dela Cruz
        { student_id: '8240873', step_number: 1, status: 'completed', staff_notes: 'Advised by IT Department Head.' },
        { student_id: '8240873', step_number: 2, status: 'in_queue', staff_notes: 'Waiting at Clinic Window 1.' },
        { student_id: '8240873', step_number: 3, status: 'locked', staff_notes: 'Pending Clinic clearance.' },
        { student_id: '8240873', step_number: 4, status: 'locked', staff_notes: 'Pending SAO clearance.' },
        { student_id: '8240873', step_number: 5, status: 'locked', staff_notes: 'Pending Cashier assessment.' },
        { student_id: '8240873', step_number: 6, status: 'locked', staff_notes: 'Pending Registrar encoding.' },

        // 8240874 - Maria Santos (Has Hold)
        { student_id: '8240874', step_number: 1, status: 'completed', staff_notes: 'Advised by Department Head.' },
        { student_id: '8240874', step_number: 2, status: 'action_required', staff_notes: 'Medical clearance hold pending at Campus Clinic.' },
        { student_id: '8240874', step_number: 3, status: 'locked', staff_notes: 'Locked.' },
        { student_id: '8240874', step_number: 4, status: 'action_required', staff_notes: 'Library clearance hold pending.' },
        { student_id: '8240874', step_number: 5, status: 'locked', staff_notes: 'Locked.' },
        { student_id: '8240874', step_number: 6, status: 'locked', staff_notes: 'Locked.' },

        // 8240875 - Carlo Mendoza (Transferee)
        { student_id: '8240875', step_number: 1, status: 'completed', staff_notes: 'Cleared.' },
        { student_id: '8240875', step_number: 2, status: 'completed', staff_notes: 'Medical clearance validated.' },
        { student_id: '8240875', step_number: 3, status: 'completed', staff_notes: 'SAO clearance cleared.' },
        { student_id: '8240875', step_number: 4, status: 'completed', staff_notes: 'Library clearance cleared.' },
        { student_id: '8240875', step_number: 5, status: 'completed', staff_notes: 'Cashier assessment cleared.' },
        { student_id: '8240875', step_number: 6, status: 'ready_to_book', staff_notes: 'Ready for Registrar Window 2.' }
      ];

      const appointments = [
        {
          id: 'a1',
          reference_code: 'EE-2026-8841',
          student_id: '8240873',
          step_number: 2,
          purpose: 'Campus Clinic Medical Clearance',
          date: new Date().toISOString().slice(0, 10),
          time: '10:00 AM',
          queue: 'CLN-004',
          counter_window: 'Clinic Window 1',
          status: 'Checked-In'
        },
        {
          id: 'a2',
          reference_code: 'EE-2026-9022',
          student_id: '8240875',
          step_number: 6,
          purpose: 'Registrar Document Verification & COR Printing',
          date: new Date().toISOString().slice(0, 10),
          time: '02:00 PM',
          queue: 'REG-019',
          counter_window: 'Registrar Window 2',
          status: 'Upcoming'
        }
      ];

      const queue = [
        {
          queue_id: 'q1',
          ticket_number: 'CLN-001',
          student_id: '8240871',
          student_name: 'Andrea Nicole Lim',
          step_number: 2,
          counter_window: 'Clinic Window 1',
          priority_type: 'Booked Appointment',
          status: 'Serving',
          estimated_wait_mins: 0,
          created_at: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
          queue_id: 'q2',
          ticket_number: 'CLN-004',
          student_id: '8240873',
          student_name: 'Juan Dela Cruz',
          step_number: 2,
          counter_window: 'Clinic Window 1',
          priority_type: 'Booked Appointment',
          status: 'Waiting',
          estimated_wait_mins: 8,
          created_at: new Date(Date.now() - 10 * 60000).toISOString()
        },
        {
          queue_id: 'q3',
          ticket_number: 'CLN-007',
          student_id: '8240876',
          student_name: 'Mark Kenneth Bautista',
          step_number: 2,
          counter_window: 'Clinic Window 1',
          priority_type: 'Regular Walk-In',
          status: 'Waiting',
          estimated_wait_mins: 16,
          created_at: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
          queue_id: 'q4',
          ticket_number: 'SAO-012',
          student_id: '8240872',
          student_name: 'Samantha Rose Cruz',
          step_number: 3,
          counter_window: 'SAO Window 1',
          priority_type: 'Booked Appointment',
          status: 'Serving',
          estimated_wait_mins: 0,
          created_at: new Date(Date.now() - 20 * 60000).toISOString()
        },
        {
          queue_id: 'q5',
          ticket_number: 'REG-019',
          student_id: '8240875',
          student_name: 'Carlo Mendoza',
          step_number: 6,
          counter_window: 'Registrar Window 2',
          priority_type: 'Booked Appointment',
          status: 'Waiting',
          estimated_wait_mins: 12,
          created_at: new Date(Date.now() - 8 * 60000).toISOString()
        }
      ];

      localStorage.setItem('ee_students', JSON.stringify(students));
      localStorage.setItem('ee_clearances', JSON.stringify(clearances));
      localStorage.setItem('ee_subjects', JSON.stringify(subjects));
      localStorage.setItem('ee_steps', JSON.stringify(workflowSteps));
      localStorage.setItem('ee_progress', JSON.stringify(progress));
      localStorage.setItem('ee_appts', JSON.stringify(appointments));
      localStorage.setItem('ee_queue', JSON.stringify(queue));
      localStorage.setItem('ee_session', '8240873'); // Default to Juan Dela Cruz (8240873)
      localStorage.setItem('ee_seeded_v5', 'true');
    }
  }

  initStorage();

  // --- DATA ACCESS LAYER (DAL) ---
  const DAL = {
    get(key) {
      try {
        return JSON.parse(localStorage.getItem('ee_' + key)) || [];
      } catch (e) {
        return [];
      }
    },
    set(key, val) {
      localStorage.setItem('ee_' + key, JSON.stringify(val));
      if (window.eeBroadcast) {
        window.eeBroadcast.postMessage({ type: 'SYNC_' + key.toUpperCase(), payload: val });
      }
    },
    currentStudentId() {
      return localStorage.getItem('ee_session') || '8240873';
    },
    currentStudent() {
      const sid = this.currentStudentId();
      return this.get('students').find(s => s.student_id === sid) || this.get('students')[0];
    },
    syncStudentERP(sid) {
      const student = this.get('students').find(s => s.student_id === sid);
      if (!student) return null;
      const clearances = this.get('clearances').filter(c => c.student_id === sid);
      const hasHold = clearances.some(c => c.status === 'Hold');

      const clinicHold = clearances.some(c => c.office_code === 'CLINIC' && c.status === 'Hold');
      const libHold = clearances.some(c => c.office_code === 'LIBRARY' && c.status === 'Hold');

      const progress = this.get('progress');
      let p1 = progress.find(p => p.student_id === sid && p.step_number === 1);
      let p2 = progress.find(p => p.student_id === sid && p.step_number === 2);
      let p4 = progress.find(p => p.student_id === sid && p.step_number === 4);

      if (clinicHold) {
        if (p2) {
          p2.status = 'action_required';
          p2.staff_notes = 'Medical clearance hold detected. Visit Campus Clinic.';
        }
      } else {
        if (p2 && p2.status === 'action_required') {
          p2.status = 'ready_to_book';
          p2.staff_notes = 'Medical clearance verified.';
        }
      }

      if (libHold) {
        if (p4) {
          p4.status = 'action_required';
          p4.staff_notes = 'Library liabilities detected. Settle overdue books.';
        }
      } else {
        if (p4 && p4.status === 'action_required') {
          p4.status = 'locked';
          p4.staff_notes = 'Library cleared.';
        }
      }

      if (hasHold) {
        student.erp_enrollment_status = 'Clearance Hold';
      } else {
        if (student.erp_enrollment_status === 'Clearance Hold') {
          student.erp_enrollment_status = 'Eligible for Enrollment';
        }
      }

      this.set('students', this.get('students'));
      this.set('progress', progress);
      return { student, clearances, hasHold };
    }
  };

  // Listen to realtime updates across browser tabs
  if (window.eeBroadcast) {
    window.eeBroadcast.onmessage = function (event) {
      const { type } = event.data || {};
      if (type && type.startsWith('SYNC_')) {
        console.log('[Realtime Sync]', type);
        if (type === 'SYNC_QUEUE') {
          const mySid = DAL.currentStudentId();
          const queue = DAL.get('queue');
          const myTicket = queue.find(q => q.student_id === mySid);
          if (myTicket && myTicket.status === 'Serving') {
            window.playQueueChime();
            toast('Your Ticket ' + myTicket.ticket_number + ' is NOW SERVING at ' + myTicket.counter_window + '!');
          }
        }
        if (typeof renderCurrentPage === 'function') {
          renderCurrentPage();
        }
      }
    };
  }

  // --- HELPERS ---
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => new Date().toISOString().slice(0, 10);
  const formatDate = d => {
    if (!d) return '';
    try {
      const [y, m, day] = d.split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return `${months[parseInt(m, 10) - 1]} ${parseInt(day, 10)}, ${y}`;
    } catch (e) {
      return d;
    }
  };

  function toast(msg, isError = false) {
    const el = document.createElement('div');
    el.className = 'toast' + (isError ? ' e' : '');
    el.innerHTML = msg;
    document.body.appendChild(el);
    setTimeout(() => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(-10px)';
      el.style.transition = 'all 0.3s';
      setTimeout(() => el.remove(), 300);
    }, 3800);
  }

  // --- SVG ICONS (Clean, Modern, Vector) ---
  const ICONS = {
    dashboard: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
    calendar: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>',
    clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>',
    ticket: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"></path><line x1="13" y1="5" x2="13" y2="19"></line></svg>',
    academic: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
    user: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    settings: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
    logout: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>'
  };

  // --- DEMO BAR (Top Control Switcher) ---
  function demoBarHtml() {
    const students = DAL.get('students');
    const currentSid = DAL.currentStudentId();
    const isStudentPortal = location.pathname.includes('dashboard') || location.pathname.includes('book-appointment') || location.pathname.includes('my-schedule') || location.pathname.includes('enrollment') || location.pathname.includes('profile') || location.pathname.includes('settings');

    return `
      <div class="demo-bar">
        <div class="demo-bar-left">
          <span class="demo-bar-label">Live Defense Switcher:</span>
          <a href="dashboard.html" class="demo-pill ${isStudentPortal ? 'active' : ''}">Student Portal</a>
          <a href="staff-terminal.html" class="demo-pill ${location.pathname.includes('staff-terminal') ? 'active' : ''}">Staff Terminal</a>
          <a href="erp-simulator.html" class="demo-pill ${location.pathname.includes('erp-simulator') ? 'active' : ''}">SIS/ERP Simulator</a>
        </div>
        <div class="demo-bar-left">
          <span class="demo-sync-badge">
            <span class="pulse-dot"></span>
            Realtime Mesh Active
          </span>
          <select id="demoStudentSwitch" style="padding: 4px 8px; font-size: 11px; width: auto; height: 28px; border-radius: 8px; margin: 0; background: #0f172a; color: #fff; border: 1px solid #334155;">
            ${students.map(s => `
              <option value="${s.student_id}" ${s.student_id === currentSid ? 'selected' : ''}>
                ${s.full_name} (${s.student_id}) - ${s.student_id === '8240874' ? 'Has Holds' : 'Cleared'}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `;
  }

  // --- APP SHELL (Royal Blue Sidebar + Header) ---
  const NAV_ITEMS = [
    { id: 'dashboard', iconKey: 'dashboard', label: 'Dashboard' },
    { id: 'book-appointment', iconKey: 'calendar', label: 'Book Appointment' },
    { id: 'my-schedule', iconKey: 'clock', label: 'My Schedule' },
    { id: 'enrollment', iconKey: 'academic', label: 'Enrollment Details' },
    { id: 'profile', iconKey: 'user', label: 'Profile' },
    { id: 'settings', iconKey: 'settings', label: 'Settings' }
  ];

  function shell(contentHtml, activePage) {
    return `
      <div class="shell">
        <aside class="side" id="sideNav">
          <div class="logo">Enroll<span>Ease</span></div>
          <div class="side-nav">
            ${NAV_ITEMS.map(item => `
              <a href="${item.id}.html" class="${item.id === activePage ? 'on' : ''}">
                <span>${ICONS[item.iconKey]}</span>
                <span>${item.label}</span>
              </a>
            `).join('')}
          </div>
          <div class="side-footer">
            <a href="login.html" id="logoutLink" style="color: #fca5a5;">
              <span>${ICONS.logout}</span>
              <span>Logout</span>
            </a>
          </div>
        </aside>
        <main class="main">
          <div class="top-bar-mobile">
            <button class="burger" id="burgerBtn" aria-label="Toggle Menu"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
            <div class="logo">Enroll<span>Ease</span></div>
          </div>
          ${demoBarHtml()}
          ${contentHtml}
        </main>
      </div>
    `;
  }

  // --- 6-STEP ENROLLMENT GUIDE TRACKER COMPONENT ---
  function renderGuideTracker(student, progressList, selectedStep = 2) {
    const steps = DAL.get('steps');
    const clearances = DAL.get('clearances').filter(c => c.student_id === student.student_id);
    const holdClearances = clearances.filter(c => c.status === 'Hold');

    const stepItems = steps.map(step => {
      const p = progressList.find(pr => pr.step_number === step.step_number) || { status: 'locked' };
      const isSelected = step.step_number === selectedStep;
      let statusClass = p.status;
      let statusLabel = p.status.replace('_', ' ');

      return `
        <div class="step-item ${statusClass} ${isSelected ? 'selected' : ''}" data-step="${step.step_number}">
          <div>
            <div class="step-top">
              <div class="step-num-badge">${p.status === 'completed' ? ICONS.check : step.step_number}</div>
              <span class="step-status-tag ${statusClass}">${statusLabel}</span>
            </div>
            <div class="step-title-text">${step.step_title}</div>
            <div class="step-office-text">${step.office_name}</div>
          </div>
        </div>
      `;
    }).join('');

    const activeStepData = steps.find(s => s.step_number === selectedStep) || steps[0];
    const activeProgress = progressList.find(pr => pr.step_number === selectedStep) || { status: 'locked', staff_notes: '' };

    return `
      <div class="guide-tracker" id="guideTracker">
        <div class="tracker-header">
          <h3>
            <span>Step-by-Step Enrollment Guide & Roadmap</span>
          </h3>
          <span class="badge ${holdClearances.length > 0 ? 'd' : 'p'}">
            ${holdClearances.length > 0 ? 'Action Required: ' + holdClearances.length + ' Clearance Hold(s) Detected' : 'All Clearances Cleared'}
          </span>
        </div>
        <div class="stepper-row">
          ${stepItems}
        </div>
        <div class="step-drawer">
          <div class="drawer-grid">
            <div class="drawer-box">
              <h4>Office & Window Location</h4>
              <p><b>${activeStepData.office_name}</b></p>
              <p class="muted" style="margin-top: 4px;">${activeStepData.building_room}</p>
            </div>
            <div class="drawer-box">
              <h4>What Documents to Bring</h4>
              <ul>
                ${activeStepData.required_documents.map(doc => `<li>${doc}</li>`).join('')}
              </ul>
            </div>
            <div class="drawer-box">
              <h4>Clear Instructions</h4>
              <p>${activeStepData.clear_instructions}</p>
              ${activeProgress.staff_notes ? `<p style="margin-top: 8px; color: var(--b2); font-weight: 600;">Staff Note: ${activeProgress.staff_notes}</p>` : ''}
            </div>
          </div>
          <div class="row sp" style="margin-top: 16px;">
            <div class="muted" style="font-size: 13px;">
              Current Status: <b>${activeProgress.status.toUpperCase().replace('_', ' ')}</b>
            </div>
            <div>
              ${selectedStep === 1 ? `
                ${activeProgress.status === 'completed' ? `
                  <span class="badge" style="background: #dcfce7; color: #15803d; padding: 6px 14px;">Consultation Completed</span>
                ` : `
                  <span class="badge" style="background: #dbeafe; color: #1e40af; padding: 6px 14px;">Direct Walk-In Consultation (No Queue Ticket Needed)</span>
                `}
              ` : activeProgress.status === 'action_required' ? `
                <a href="enrollment.html" class="btn warning sm">Resolve Clearance Holds at Issuing Offices</a>
              ` : activeProgress.status === 'ready_to_book' ? `
                <a href="book-appointment.html" class="btn sm">Book Slot for Step ${selectedStep}</a>
              ` : activeProgress.status === 'in_queue' ? `
                <a href="my-schedule.html" class="btn sm success">View Live Queue Ticket</a>
              ` : activeProgress.status === 'completed' ? `
                <span class="badge" style="background: #dcfce7; color: #15803d; padding: 6px 14px;">Stage Completed</span>
              ` : `
                <span class="badge" style="background: #f1f5f9; color: #64748b; padding: 6px 14px;">Complete Previous Steps First</span>
              `}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- VIEWS CONTROLLER ---
  const P = {};
  let currentTrackerStep = 2;

  // LANDING / HERO
  P.index = {
    render() {
      return `
        <div class="hero">
          <div class="card">
            <div class="logo center" style="font-size: 36px; margin-bottom: 8px;">Enroll<span>Ease</span></div>
            <h2>Smart Campus Enrollment & Live Queuing</h2>
            <p class="muted" style="margin-bottom: 24px;">
              Skip the exhausting campus lines. Book appointments, verify real-time ERP clearances, track live counter queues, and walk through enrollment effortlessly.
            </p>
            <div style="display: flex; flex-direction: column; gap: 12px;">
              <a href="dashboard.html" class="btn lg">Enter Student Portal</a>
              <div class="row sp" style="justify-content: center; gap: 10px; margin-top: 8px;">
                <a href="staff-terminal.html" class="btn alt sm">Staff Queue Terminal</a>
                <a href="erp-simulator.html" class="btn alt sm">University SIS Simulator</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  };

  // LOGIN
  P.login = {
    render() {
      return `
        <div class="auth">
          <div class="card">
            <div class="logo center">Enroll<span>Ease</span></div>
            <h2 class="center" style="margin-top: 4px;">Student Login</h2>
            <p class="muted center" style="margin-bottom: 20px;">Access your official enrollment appointment pass</p>
            
            <form id="loginForm">
              <label>7-Digit Student ID Number</label>
              <input type="text" id="loginId" value="8240873" placeholder="e.g. 8240873" maxlength="7" required>
              
              <label>PIN or Password</label>
              <input type="password" id="loginPw" value="demo1234" required>
              
              <div class="err" id="loginErr"></div>
              
              <button type="submit" class="btn" style="width: 100%; margin-top: 14px;">Sign In</button>
            </form>

            <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--ln);">
              <label style="margin-bottom: 8px;">Quick Demo Login:</label>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button type="button" class="btn alt sm" id="quickJuan">
                  Juan Dela Cruz (8240873 - Cleared)
                </button>
                <button type="button" class="btn alt sm" id="quickMaria">
                  Maria Santos (8240874 - With Holds)
                </button>
              </div>
            </div>
          </div>
        </div>
      `;
    },
    init() {
      $('#loginForm').onsubmit = e => {
        e.preventDefault();
        const sid = $('#loginId').value.trim();
        const student = DAL.get('students').find(s => s.student_id === sid);
        if (!student) {
          $('#loginErr').textContent = 'Student ID not found in campus database.';
          return;
        }
        localStorage.setItem('ee_session', sid);
        toast(`Welcome back, ${student.full_name}!`);
        location.href = 'dashboard.html';
      };

      $('#quickJuan').onclick = () => {
        localStorage.setItem('ee_session', '8240873');
        toast('Logged in as Juan Dela Cruz (8240873)');
        location.href = 'dashboard.html';
      };

      $('#quickMaria').onclick = () => {
        localStorage.setItem('ee_session', '8240874');
        toast('Logged in as Maria Santos (8240874 - Clearance Hold Demo)');
        location.href = 'dashboard.html';
      };
    }
  };

  // REGISTER
  P.register = {
    render() {
      return `
        <div class="auth">
          <div class="card">
            <div class="logo center">Enroll<span>Ease</span></div>
            <h2 class="center" style="margin-top: 4px;">Student Registration</h2>
            <p class="muted center" style="margin-bottom: 20px;">Link your 7-Digit University Student ID</p>
            
            <form id="regForm">
              <label>Full Name</label>
              <input type="text" id="regName" placeholder="Juan Dela Cruz" required>

              <label>7-Digit Student ID</label>
              <input type="text" id="regId" placeholder="e.g. 8240873" maxlength="7" pattern="\d{7}" required>

              <label>Institutional Email</label>
              <input type="email" id="regEmail" placeholder="student@ctu.edu.ph" required>

              <label>Create PIN or Password</label>
              <input type="password" id="regPw" value="demo1234" required>

              <div class="err" id="regErr"></div>

              <button type="submit" class="btn" style="width: 100%; margin-top: 14px;">Complete Registration</button>
              <p class="center" style="margin-top: 14px; font-size: 13px;">Already registered? <a href="login.html">Login here</a></p>
            </form>
          </div>
        </div>
      `;
    },
    init() {
      $('#regForm').onsubmit = e => {
        e.preventDefault();
        const sid = $('#regId').value.trim();
        const name = $('#regName').value.trim();
        const email = $('#regEmail').value.trim();
        if (!/^\d{7}$/.test(sid)) {
          $('#regErr').textContent = 'Student ID must be exactly 7 digits (e.g. 8240873).';
          return;
        }
        const students = DAL.get('students');
        let existing = students.find(s => s.student_id === sid);
        if (!existing) {
          existing = {
            student_id: sid,
            first_name: name.split(' ')[0] || name,
            last_name: name.split(' ').slice(1).join(' ') || 'Student',
            full_name: name,
            email: email,
            program: 'BS Information Technology',
            year_level: 2,
            section: 'BSIT 2-A',
            student_type: 'Regular',
            tuition_status: 'Cleared / UniFAST',
            balance_amount: 0.0,
            erp_enrollment_status: 'Eligible for Enrollment',
            contact: '+63 912 345 6789'
          };
          students.push(existing);
          DAL.set('students', students);

          const clearances = DAL.get('clearances');
          const offices = [
            { code: 'DEPT_HEAD', name: 'Department Head Advising', room: 'Department Office (IT, BIT, HM, EDUC, IE)' },
            { code: 'CLINIC', name: 'Campus Health Services', room: 'Health Services Bldg - Clinic Windows 1 & 2' },
            { code: 'SAO', name: 'Student Affairs & Guidance', room: 'Student Center - Room 204' },
            { code: 'LIBRARY', name: 'University Library', room: 'Learning Resource Center - 2F Circulation Desk' },
            { code: 'CASHIER', name: 'Accounting & Cashier Office', room: 'Admin Bldg - Cashier Windows 3 & 4' }
          ];
          offices.forEach(o => {
            clearances.push({
              student_id: sid,
              office_code: o.code,
              office_name: o.name,
              location_room: o.room,
              status: 'Cleared',
              remarks: 'Initial registration cleared.'
            });
          });
          DAL.set('clearances', clearances);

          const progress = DAL.get('progress');
          for (let st = 1; st <= 6; st++) {
            progress.push({
              student_id: sid,
              step_number: st,
              status: st === 1 ? 'completed' : st === 2 ? 'ready_to_book' : 'locked',
              staff_notes: st === 1 ? 'Department advising verified.' : ''
            });
          }
          DAL.set('progress', progress);
        }

        localStorage.setItem('ee_session', sid);
        toast(`Account registered! Logged in as ${name}.`);
        location.href = 'dashboard.html';
      };
    }
  };

  // DASHBOARD
  P.dashboard = {
    render() {
      const student = DAL.currentStudent();
      DAL.syncStudentERP(student.student_id);

      const progress = DAL.get('progress').filter(p => p.student_id === student.student_id);
      const appointments = DAL.get('appts').filter(a => a.student_id === student.student_id);
      const activeAppt = appointments.find(a => a.status === 'Checked-In' || a.status === 'Upcoming');

      const queue = DAL.get('queue');
      const myTicket = queue.find(q => q.student_id === student.student_id && (q.status === 'Waiting' || q.status === 'Serving' || q.status === 'Hold'));
      const servingTicket = myTicket ? queue.find(q => q.status === 'Serving' && q.counter_window === myTicket.counter_window) : null;

      const isHold = student.erp_enrollment_status === 'Clearance Hold';

      return shell(`
        <!-- Top Welcome Banner -->
        <div class="banner">
          <div class="banner-badge">
            <span class="pulse-dot" style="${isHold ? 'background:#ef4444;' : ''}"></span>
            ${isHold ? 'Clearance Action Required in Campus SIS' : 'Synced with Campus SIS/ERP'}
          </div>
          <h1>Welcome back, ${esc(student.full_name)}!</h1>
          <p>
            ${student.program} - ${student.section} - Year Level ${student.year_level} - ID: <b>${student.student_id}</b>
          </p>
          <p style="margin-top: 8px; font-weight: 600; opacity: 0.95;">
            ${myTicket ? `Live Queue Ticket: ${myTicket.ticket_number} (${myTicket.status}) at ${myTicket.counter_window}` :
              activeAppt ? `Next Appointment: ${formatDate(activeAppt.date)} at ${activeAppt.time} (${activeAppt.purpose})` :
              'Ready for enrollment. Step 1 is Department Head Advising (Walk-in, no queue ticket needed).'}
          </p>
        </div>

        <!-- 6-Step Enrollment Guide Tracker -->
        ${renderGuideTracker(student, progress, currentTrackerStep)}

        <!-- 6 Action Cards Grid -->
        <div class="grid">
          <!-- 1. Book Appointment -->
          <a class="tile" href="book-appointment.html">
            <div>
              <div class="tile-top">
                <div class="ic">${ICONS.calendar}</div>
                <span class="badge ${isHold ? 'd' : 'p'}">${isHold ? 'Hold Warning' : 'Available'}</span>
              </div>
              <b>Book Appointment</b>
              <p>Reserve an office window counter slot for Steps 2 to 6</p>
            </div>
            <div style="margin-top: 14px; font-weight: 600; font-size: 13px; color: var(--b2);">
              ${isHold ? 'Check clearance requirements →' : 'Select stage & time slot →'}
            </div>
          </a>

          <!-- 2. My Schedule -->
          <a class="tile" href="my-schedule.html">
            <div>
              <div class="tile-top">
                <div class="ic">${ICONS.clock}</div>
                <span class="badge p">${appointments.length} Booked</span>
              </div>
              <b>My Schedule</b>
              <p>Upcoming appointment passes, check-in, and tickets</p>
            </div>
            <div style="margin-top: 14px; font-weight: 600; font-size: 13px; color: var(--b2);">
              View appointment passes →
            </div>
          </a>

          <!-- 3. Active Queue Number Spotlight -->
          <a class="tile ${myTicket ? 'queue-card-active' : ''}" href="my-schedule.html">
            <div>
              <div class="tile-top">
                <div class="ic" style="${myTicket ? 'background: rgba(255,255,255,0.2); color: #fff;' : ''}">${ICONS.ticket}</div>
                <span class="badge ${myTicket ? 'w' : 'g'}">${myTicket ? myTicket.status.toUpperCase() : 'No Ticket'}</span>
              </div>
              <b>Live Queue Tracker</b>
              ${myTicket ? `
                <div class="q-big-ticket">${myTicket.ticket_number}</div>
                <p style="color: #bfdbfe;">${myTicket.counter_window}</p>
                <div class="q-metrics">
                  <div>
                    <div class="q-metric-val">${servingTicket ? servingTicket.ticket_number : 'None'}</div>
                    <div class="q-metric-lbl">Now Serving</div>
                  </div>
                  <div>
                    <div class="q-metric-val">${myTicket.status === 'Serving' ? '0' : '1'}</div>
                    <div class="q-metric-lbl">Ahead</div>
                  </div>
                  <div>
                    <div class="q-metric-val">${myTicket.estimated_wait_mins}m</div>
                    <div class="q-metric-lbl">Est. Wait</div>
                  </div>
                </div>
              ` : `
                <p>No active queue ticket issued. Check in to an appointment or visit an office counter.</p>
              `}
            </div>
          </a>

          <!-- 4. Enrollment Details -->
          <a class="tile" href="enrollment.html">
            <div>
              <div class="tile-top">
                <div class="ic">${ICONS.academic}</div>
                <span class="badge ${student.tuition_status.includes('UniFAST') ? '' : 'w'}">
                  ${student.tuition_status.includes('UniFAST') ? 'UniFAST Free' : 'With Balance'}
                </span>
              </div>
              <b>Enrollment Details</b>
              <p>ERP clearances, advised subjects (PC 316) & slip</p>
            </div>
            <div style="margin-top: 14px; font-weight: 600; font-size: 13px; color: var(--b2);">
              View curriculum & units →
            </div>
          </a>

          <!-- 5. Profile -->
          <a class="tile" href="profile.html">
            <div>
              <div class="tile-top">
                <div class="ic">${ICONS.user}</div>
                <span class="badge p">${student.student_type}</span>
              </div>
              <b>Student Profile</b>
              <p>Official SIS registration records and contact info</p>
            </div>
            <div style="margin-top: 14px; font-weight: 600; font-size: 13px; color: var(--b2);">
              Manage contact details →
            </div>
          </a>

          <!-- 6. Settings -->
          <a class="tile" href="settings.html">
            <div>
              <div class="tile-top">
                <div class="ic">${ICONS.settings}</div>
                <span class="badge g">Config</span>
              </div>
              <b>Preferences & Switcher</b>
              <p>Alert chimes, demo switchboard, & Supabase setup</p>
            </div>
            <div style="margin-top: 14px; font-weight: 600; font-size: 13px; color: var(--b2);">
              Open settings →
            </div>
          </a>
        </div>
      `, 'dashboard');
    },
    init() {
      $$('.step-item').forEach(el => {
        el.onclick = () => {
          currentTrackerStep = parseInt(el.dataset.step, 10);
          renderCurrentPage();
        };
      });

      const switchEl = $('#demoStudentSwitch');
      if (switchEl) {
        switchEl.onchange = () => {
          localStorage.setItem('ee_session', switchEl.value);
          toast('Switched active student to ' + switchEl.options[switchEl.selectedIndex].text);
          renderCurrentPage();
        };
      }
    }
  };

  // BOOK APPOINTMENT
  P['book-appointment'] = {
    render() {
      const student = DAL.currentStudent();
      const clearances = DAL.get('clearances').filter(c => c.student_id === student.student_id);
      const hasHold = clearances.some(c => c.status === 'Hold');

      return shell(`
        <h1>Book Enrollment Appointment</h1>
        
        ${hasHold ? `
          <div class="card" style="border-left: 5px solid var(--er); margin-bottom: 20px; background: #fff5f5;">
            <h3 style="color: var(--er);">Pre-Enrollment Clearance Notice</h3>
            <p>Our Simulated ERP detected outstanding clearance hold(s) on your student record (<b>ID: ${student.student_id}</b>):</p>
            <ul style="color: var(--er); font-weight: 600; margin: 8px 0 14px 20px;">
              ${clearances.filter(c => c.status === 'Hold').map(c => `
                <li><b>${c.office_name}:</b> ${c.remarks} (${c.location_room})</li>
              `).join('')}
            </ul>
            <p class="muted" style="font-size: 13px;">
              You can still book appointments for clearance resolution, but official registration requires all holds to be marked Cleared in the ERP.
            </p>
          </div>
        ` : ''}

        <div class="card" style="max-width: 680px;">
          <div style="background: #f1f5f9; padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 13px;">
            <b>Notice on Step 1:</b> Department Head Advising (IT, BIT, HM, EDUC, IE) is direct walk-in consultation; no appointment slot or queue ticket required. Select from Steps 2 to 6 below.
          </div>

          <label>Select Enrollment Stage</label>
          <select id="apptStep">
            <option value="2">Step 2: Campus Clinic Clearance (Clinic Windows 1 & 2)</option>
            <option value="3">Step 3: Student Affairs Office (SAO) Clearance (Room 204)</option>
            <option value="4">Step 4: University Library Clearance (Circulation Desk)</option>
            <option value="5">Step 5: Cashier & Accounting Assessment (Cashier Windows 3 & 4)</option>
            <option value="6">Step 6: Registrar Document Evaluation & COR Printing (Registrar Windows 1 & 2)</option>
          </select>

          <label>Appointment Date (Monday to Friday)</label>
          <input type="date" id="apptDate" min="${today()}">

          <label>Available Counter Time Slots</label>
          <div id="slotBox" class="slots">
            <p class="muted" style="grid-column: 1 / -1;">Select a date above to display live window openings.</p>
          </div>

          <div class="err" id="slotErr"></div>

          <div style="margin-top: 20px;">
            <button class="btn lg" id="btnContinueBooking" disabled style="width: 100%;">
              Continue to Pass Summary →
            </button>
          </div>
        </div>
      `, 'book-appointment');
    },
    init() {
      const dateInput = $('#apptDate');
      const slotBox = $('#slotBox');
      const btn = $('#btnContinueBooking');
      let selectedSlotTime = null;

      const TIMES = [
        '08:30 AM', '09:15 AM', '10:00 AM', '10:45 AM',
        '01:15 PM', '02:00 PM', '02:45 PM', '03:30 PM'
      ];

      dateInput.onchange = () => {
        selectedSlotTime = null;
        btn.disabled = true;
        const val = dateInput.value;
        if (!val) return;

        const dayOfWeek = new Date(val + 'T00:00:00').getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          slotBox.innerHTML = '<p class="err" style="grid-column: 1 / -1;">Campus offices are open Monday to Friday. Please choose a weekday.</p>';
          return;
        }

        slotBox.innerHTML = TIMES.map(t => {
          return `
            <button type="button" class="slot" data-time="${t}">
              ${t}
              <small>Available</small>
            </button>
          `;
        }).join('');

        $$('.slot').forEach(s => {
          s.onclick = () => {
            $$('.slot').forEach(x => x.classList.remove('sel'));
            s.classList.add('sel');
            selectedSlotTime = s.dataset.time;
            btn.disabled = false;
          };
        });
      };

      btn.onclick = () => {
        if (!dateInput.value || !selectedSlotTime) return;
        const stepNum = parseInt($('#apptStep').value, 10);
        const draft = {
          step_number: stepNum,
          purpose: $('#apptStep').options[$('#apptStep').selectedIndex].text,
          date: dateInput.value,
          time: selectedSlotTime
        };
        sessionStorage.setItem('ee_draft_appt', JSON.stringify(draft));
        location.href = 'appointment-summary.html';
      };
    }
  };

  // APPOINTMENT SUMMARY
  P['appointment-summary'] = {
    render() {
      const draft = JSON.parse(sessionStorage.getItem('ee_draft_appt') || 'null');
      if (!draft) {
        location.href = 'book-appointment.html';
        return '';
      }
      const student = DAL.currentStudent();

      return shell(`
        <h1>Appointment Pass Summary</h1>
        <div class="card" style="max-width: 600px;">
          <h3>Review Slot Details</h3>
          <dl style="margin-top: 14px;">
            <dt>Student Name:</dt>
            <dd>${esc(student.full_name)}</dd>
            <dt>Student ID:</dt>
            <dd>${student.student_id}</dd>
            <dt>Purpose / Stage:</dt>
            <dd>${draft.purpose}</dd>
            <dt>Date:</dt>
            <dd>${formatDate(draft.date)}</dd>
            <dt>Time Window:</dt>
            <dd>${draft.time}</dd>
          </dl>

          <div style="background: var(--bg); padding: 16px; border-radius: 12px; margin: 20px 0;">
            <h4 style="margin: 0 0 6px;">Important Instructions:</h4>
            <ul class="muted" style="margin: 0; padding-left: 20px; font-size: 13px;">
              <li>Arrive 10 minutes prior to your time window.</li>
              <li>Have your School ID card (ID: ${student.student_id}) and required documents ready.</li>
              <li>Present the reference pass or QR code at the counter scanner.</li>
            </ul>
          </div>

          <div class="row sp">
            <a href="book-appointment.html" class="btn alt">Back</a>
            <button class="btn success" id="btnConfirmAppt">Confirm & Issue Pass</button>
          </div>
        </div>
      `, 'book-appointment');
    },
    init() {
      $('#btnConfirmAppt').onclick = () => {
        const draft = JSON.parse(sessionStorage.getItem('ee_draft_appt') || '{}');
        const sid = DAL.currentStudentId();
        const randNum = Math.floor(1000 + Math.random() * 9000);
        const refCode = `EE-2026-${randNum}`;

        const prefixMap = { 2: 'CLN', 3: 'SAO', 4: 'LIB', 5: 'CSH', 6: 'REG' };
        const windowMap = {
          2: 'Clinic Window 1',
          3: 'SAO Window 1',
          4: 'Library Counter',
          5: 'Cashier Window 3',
          6: 'Registrar Window 1'
        };

        const prefix = prefixMap[draft.step_number] || 'ENR';
        const queueNum = `${prefix}-${String(Math.floor(Math.random() * 80) + 1).padStart(3, '0')}`;

        const newAppt = {
          id: 'a' + Date.now(),
          reference_code: refCode,
          student_id: sid,
          step_number: draft.step_number,
          purpose: draft.purpose,
          date: draft.date,
          time: draft.time,
          queue: queueNum,
          counter_window: windowMap[draft.step_number] || 'General Window',
          status: 'Upcoming'
        };

        const appts = DAL.get('appts');
        appts.push(newAppt);
        DAL.set('appts', appts);
        sessionStorage.setItem('ee_last_confirmed', JSON.stringify(newAppt));
        sessionStorage.removeItem('ee_draft_appt');

        toast('Appointment confirmed! Reference Code: ' + refCode);
        location.href = 'confirmation.html';
      };
    }
  };

  // CONFIRMATION
  P.confirmation = {
    render() {
      const appt = JSON.parse(sessionStorage.getItem('ee_last_confirmed') || 'null');
      if (!appt) {
        location.href = 'dashboard.html';
        return '';
      }
      const student = DAL.currentStudent();

      return shell(`
        <div style="max-width: 640px; margin: 0 auto; text-align: center;">
          <div class="card">
            <span class="badge" style="background: #dcfce7; color: #15803d; font-size: 14px; padding: 6px 16px; margin-bottom: 12px; display: inline-block;">
              Appointment Reserved Successfully
            </span>
            <h1 style="margin: 8px 0 4px;">You are Scheduled!</h1>
            <p class="muted">Show this pass upon arrival at the campus counter</p>

            <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff; border-radius: 16px; padding: 24px; margin: 24px 0; text-align: left;">
              <div class="row sp">
                <div>
                  <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Appointment Reference</span>
                  <div style="font-size: 26px; font-weight: 800; font-family: monospace; color: #60a5fa;">${appt.reference_code}</div>
                </div>
                <div style="text-align: right;">
                  <span class="badge w">${appt.status}</span>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 18px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div>
                  <small style="color: #94a3b8;">Student Name</small>
                  <div style="font-weight: 600;">${esc(student.full_name)}</div>
                </div>
                <div>
                  <small style="color: #94a3b8;">Student ID</small>
                  <div style="font-weight: 600;">${student.student_id}</div>
                </div>
                <div>
                  <small style="color: #94a3b8;">Date</small>
                  <div style="font-weight: 600;">${formatDate(appt.date)}</div>
                </div>
                <div>
                  <small style="color: #94a3b8;">Time Window</small>
                  <div style="font-weight: 600;">${appt.time}</div>
                </div>
              </div>

              <div style="margin-top: 14px; padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.1);">
                <small style="color: #94a3b8;">Assigned Counter</small>
                <div style="font-weight: 700; color: #93c5fd;">${appt.counter_window}</div>
              </div>
            </div>

            <div class="row sp">
              <a href="my-schedule.html" class="btn">View in My Schedule</a>
              <a href="dashboard.html" class="btn alt">Return to Dashboard</a>
            </div>
          </div>
        </div>
      `, 'book-appointment');
    }
  };

  // RESCHEDULE
  P.reschedule = {
    render() {
      const urlParams = new URLSearchParams(location.search);
      const apptId = urlParams.get('id');
      const appts = DAL.get('appts');
      const appt = appts.find(a => a.id === apptId) || appts[0];
      if (!appt) {
        location.href = 'my-schedule.html';
        return '';
      }

      return shell(`
        <h1>Reschedule Appointment</h1>
        <div class="card" style="max-width: 600px;">
          <p>Current: <b>${appt.purpose}</b> on <b>${formatDate(appt.date)}</b> at <b>${appt.time}</b></p>
          <label>New Appointment Date (Monday to Friday)</label>
          <input type="date" id="reschedDate" min="${today()}">

          <label>New Available Time Slots</label>
          <div id="reschedSlotBox" class="slots">
            <p class="muted" style="grid-column: 1 / -1;">Select a new weekday date above.</p>
          </div>

          <div class="row sp" style="margin-top: 20px;">
            <a href="my-schedule.html" class="btn alt">Cancel</a>
            <button class="btn" id="btnConfirmResched" disabled>Confirm New Slot</button>
          </div>
        </div>
      `, 'my-schedule');
    },
    init() {
      const urlParams = new URLSearchParams(location.search);
      const apptId = urlParams.get('id');
      const dateInput = $('#reschedDate');
      const slotBox = $('#reschedSlotBox');
      const btn = $('#btnConfirmResched');
      let newTime = null;

      const TIMES = ['08:30 AM', '09:15 AM', '10:00 AM', '10:45 AM', '01:15 PM', '02:00 PM', '02:45 PM', '03:30 PM'];

      dateInput.onchange = () => {
        newTime = null;
        btn.disabled = true;
        const val = dateInput.value;
        if (!val) return;

        const dayOfWeek = new Date(val + 'T00:00:00').getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          slotBox.innerHTML = '<p class="err" style="grid-column: 1 / -1;">Please choose a weekday.</p>';
          return;
        }

        slotBox.innerHTML = TIMES.map(t => `<button type="button" class="slot" data-time="${t}">${t}<small>Available</small></button>`).join('');

        $$('.slot').forEach(s => {
          s.onclick = () => {
            $$('.slot').forEach(x => x.classList.remove('sel'));
            s.classList.add('sel');
            newTime = s.dataset.time;
            btn.disabled = false;
          };
        });
      };

      btn.onclick = () => {
        const appts = DAL.get('appts');
        const target = appts.find(a => a.id === apptId);
        if (target) {
          target.date = dateInput.value;
          target.time = newTime;
          DAL.set('appts', appts);
          toast('Appointment rescheduled successfully!');
          location.href = 'my-schedule.html';
        }
      };
    }
  };

  // RESCHEDULE CONFIRMATION
  P['reschedule-confirmation'] = {
    render() {
      return shell(`
        <div class="card" style="max-width: 500px; margin: 40px auto; text-align: center;">
          <h2>Appointment Rescheduled</h2>
          <p class="muted">Your new appointment time has been locked in.</p>
          <a href="my-schedule.html" class="btn" style="margin-top: 16px;">View Schedule</a>
        </div>
      `, 'my-schedule');
    }
  };

  // MY SCHEDULE
  P['my-schedule'] = {
    render() {
      const student = DAL.currentStudent();
      const appts = DAL.get('appts').filter(a => a.student_id === student.student_id);
      const queue = DAL.get('queue');
      const myTicket = queue.find(q => q.student_id === student.student_id && (q.status === 'Waiting' || q.status === 'Serving' || q.status === 'Hold'));

      return shell(`
        <div class="row sp" style="margin-bottom: 16px;">
          <h1>My Appointments & Queue Passes</h1>
          <a href="book-appointment.html" class="btn sm">Book New Slot</a>
        </div>

        ${myTicket ? `
          <div class="card" style="border: 2px solid #3b82f6; background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%); color: #fff; margin-bottom: 24px;">
            <div class="row sp">
              <div>
                <span class="badge w">LIVE QUEUE TICKET ACTIVE</span>
                <div style="font-size: 40px; font-weight: 800; color: #60a5fa; margin: 4px 0;">
                  ${myTicket.ticket_number}
                </div>
                <p style="margin: 0; color: #dbeafe;">${myTicket.counter_window} - Status: <b>${myTicket.status}</b></p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 13px; color: #bfdbfe;">Estimated Wait</div>
                <div style="font-size: 28px; font-weight: 700;">${myTicket.estimated_wait_mins} mins</div>
              </div>
            </div>
          </div>
        ` : ''}

        <div class="card">
          <h3>Active & Upcoming Scheduled Passes</h3>
          <p class="muted" style="margin-bottom: 16px;">Present your reference code or check in to join the active counter queue</p>

          ${appts.length === 0 ? `
            <p class="muted" style="padding: 20px 0; text-align: center;">No appointments found. <a href="book-appointment.html">Book your first slot</a>.</p>
          ` : appts.map(a => `
            <div class="sched-card" style="border: 1px solid var(--ln); border-radius: 12px; padding: 16px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
              <div>
                <div style="font-weight: 700; font-size: 16px;">${a.purpose}</div>
                <div class="muted" style="font-size: 13px; margin-top: 4px;">
                  Date: ${formatDate(a.date)} - Time: ${a.time} - Counter: ${a.counter_window}
                </div>
                <div style="font-size: 12px; font-family: monospace; color: var(--b); margin-top: 4px;">
                  Ref: <b>${a.reference_code}</b> - Student ID: <b>${a.student_id}</b>
                </div>
              </div>
              <div class="row">
                <span class="badge ${a.status === 'Checked-In' ? 'w' : 'p'}">${a.status}</span>
                ${a.status !== 'Checked-In' ? `
                  <button class="btn sm success btnCheckIn" data-id="${a.id}">
                    Check-In & Issue Queue Ticket
                  </button>
                ` : `
                  <span class="badge" style="background: #e0e7ff; color: #3730a3;">Ticket Issued</span>
                `}
                <button class="btn sm danger btnCancelAppt" data-id="${a.id}">Cancel</button>
              </div>
            </div>
          `).join('')}
        </div>
      `, 'my-schedule');
    },
    init() {
      $$('.btnCheckIn').forEach(btn => {
        btn.onclick = () => {
          const apptId = btn.dataset.id;
          const appts = DAL.get('appts');
          const appt = appts.find(a => a.id === apptId);
          if (!appt) return;

          appt.status = 'Checked-In';
          DAL.set('appts', appts);

          const queue = DAL.get('queue');
          const prefixMap = { 2: 'CLN', 3: 'SAO', 4: 'LIB', 5: 'CSH', 6: 'REG' };
          const prefix = prefixMap[appt.step_number] || 'ENR';
          const ticketNumber = `${prefix}-${String(Math.floor(Math.random() * 70) + 10).padStart(3, '0')}`;

          const newQueueItem = {
            queue_id: 'q' + Date.now(),
            ticket_number: ticketNumber,
            student_id: appt.student_id,
            student_name: DAL.currentStudent().full_name,
            step_number: appt.step_number,
            counter_window: appt.counter_window,
            priority_type: 'Booked Appointment',
            status: 'Waiting',
            estimated_wait_mins: 8,
            created_at: new Date().toISOString()
          };

          queue.push(newQueueItem);
          DAL.set('queue', queue);

          // Update progress for this step to in_queue
          const progress = DAL.get('progress');
          const p = progress.find(x => x.student_id === appt.student_id && x.step_number === appt.step_number);
          if (p) {
            p.status = 'in_queue';
            p.staff_notes = 'Ticket ' + ticketNumber + ' waiting at ' + appt.counter_window;
            DAL.set('progress', progress);
          }

          toast('Checked in! Issued Live Queue Ticket: ' + ticketNumber);
          renderCurrentPage();
        };
      });

      $$('.btnCancelAppt').forEach(btn => {
        btn.onclick = () => {
          if (!confirm('Cancel this scheduled appointment?')) return;
          const apptId = btn.dataset.id;
          let appts = DAL.get('appts');
          appts = appts.filter(a => a.id !== apptId);
          DAL.set('appts', appts);
          toast('Appointment cancelled.');
          renderCurrentPage();
        };
      });
    }
  };

  // ENROLLMENT DETAILS (ERP Clearances & Advised Subjects including PC 316)
  P.enrollment = {
    render() {
      const student = DAL.currentStudent();
      const clearances = DAL.get('clearances').filter(c => c.student_id === student.student_id);
      const subjects = DAL.get('subjects').filter(s => s.student_id === student.student_id);
      const totalUnits = subjects.reduce((sum, s) => sum + (s.units || 0), 0);

      return shell(`
        <div class="row sp" style="margin-bottom: 16px;">
          <h1>University SIS Enrollment Details</h1>
          <button class="btn alt" onclick="window.print()">Print / Download Enrollment Slip</button>
        </div>

        <!-- Student Summary Header -->
        <div class="card" style="margin-bottom: 20px;">
          <div class="row sp">
            <div>
              <h2 style="margin: 0;">${esc(student.full_name)}</h2>
              <p class="muted" style="margin: 4px 0 0;">
                Student ID: <b>${student.student_id}</b> - ${student.program} (${student.section}) - Year Level ${student.year_level}
              </p>
            </div>
            <div>
              <span class="badge ${student.erp_enrollment_status === 'Clearance Hold' ? 'd' : 'p'}" style="font-size: 14px; padding: 6px 14px;">
                ${student.erp_enrollment_status}
              </span>
            </div>
          </div>
        </div>

        <!-- Clearance Status Checklist Table -->
        <div class="card" style="margin-bottom: 24px;">
          <h3>University Office Clearance Checklist</h3>
          <p class="muted" style="margin-bottom: 12px;">Live records pulled from University ERP Database</p>
          <table class="data-table">
            <thead>
              <tr>
                <th>Office Code</th>
                <th>Office Name</th>
                <th>Location / Room</th>
                <th>Status</th>
                <th>Remarks / Action Needed</th>
              </tr>
            </thead>
            <tbody>
              ${clearances.map(c => `
                <tr>
                  <td><b>${c.office_code}</b></td>
                  <td>${c.office_name}</td>
                  <td class="muted">${c.location_room}</td>
                  <td>
                    <span class="badge ${c.status === 'Cleared' ? '' : 'd'}">
                      ${c.status === 'Cleared' ? 'Cleared' : c.status}
                    </span>
                  </td>
                  <td style="color: ${c.status === 'Hold' ? 'var(--er)' : 'inherit'}; font-weight: ${c.status === 'Hold' ? '600' : 'normal'};">
                    ${c.remarks || 'None'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <!-- Advised Curriculum Subjects Table (Includes PC 316) -->
        <div class="card">
          <div class="row sp" style="margin-bottom: 12px;">
            <div>
              <h3>Curriculum Subjects & Loading</h3>
              <p class="muted" style="margin: 0;">Academic Year 2026-2027 - 1st Semester</p>
            </div>
            <div style="font-size: 16px; font-weight: 700; color: var(--b);">
              Total Enrolled Units: ${totalUnits} Units
            </div>
          </div>

          <table class="data-table">
            <thead>
              <tr>
                <th>Subject Code</th>
                <th>Descriptive Title</th>
                <th>Units</th>
                <th>Schedule Block</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${subjects.map(s => `
                <tr style="${s.subject_code === 'PC 316' ? 'background: rgba(29, 78, 216, 0.05);' : ''}">
                  <td>
                    <b>${s.subject_code}</b>
                    ${s.subject_code === 'PC 316' ? '<span class="badge p" style="margin-left: 6px; font-size: 10px;">Course Project</span>' : ''}
                  </td>
                  <td>${s.descriptive_title}</td>
                  <td><b>${s.units}</b></td>
                  <td class="muted">${s.schedule_block}</td>
                  <td>
                    <span class="badge ${s.is_advised ? '' : 'w'}">
                      ${s.is_advised ? 'Advised & Locked' : 'Pending Advising'}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `, 'enrollment');
    }
  };

  // PROFILE
  P.profile = {
    render() {
      const student = DAL.currentStudent();
      return shell(`
        <h1>Student Profile</h1>
        <div class="card" style="max-width: 640px;">
          <h3>Official SIS/ERP Student Record</h3>
          <p class="muted" style="margin-bottom: 18px;">Registered credentials in the University Student Information System</p>
          
          <form id="profileForm">
            <label>Full Name</label>
            <input type="text" id="profName" value="${esc(student.full_name)}">

            <label>Student ID (7-Digit)</label>
            <input type="text" value="${student.student_id}" disabled>

            <label>Academic Program</label>
            <input type="text" value="${student.program}" disabled>

            <div class="row" style="gap: 16px;">
              <div style="flex: 1;">
                <label>Year Level</label>
                <input type="text" value="${student.year_level}" disabled>
              </div>
              <div style="flex: 1;">
                <label>Section</label>
                <input type="text" value="${student.section}" disabled>
              </div>
            </div>

            <label>Tuition Subsidy Status</label>
            <input type="text" value="${student.tuition_status}" disabled>

            <label>Email Address</label>
            <input type="email" id="profEmail" value="${esc(student.email)}">

            <label>Contact Number</label>
            <input type="tel" id="profContact" value="${esc(student.contact || '+63 912 345 6789')}">

            <div style="margin-top: 20px;">
              <button type="submit" class="btn">Save Contact Details</button>
            </div>
          </form>
        </div>
      `, 'profile');
    },
    init() {
      $('#profileForm').onsubmit = e => {
        e.preventDefault();
        const sid = DAL.currentStudentId();
        const students = DAL.get('students');
        const s = students.find(x => x.student_id === sid);
        if (s) {
          s.full_name = $('#profName').value.trim();
          s.email = $('#profEmail').value.trim();
          s.contact = $('#profContact').value.trim();
          DAL.set('students', students);
          toast('Profile updated successfully!');
          renderCurrentPage();
        }
      };
    }
  };

  // SETTINGS
  P.settings = {
    render() {
      const config = window.ENROLLEASE_CONFIG || {};

      return shell(`
        <h1>System Preferences & Connection Hub</h1>
        
        <div class="card" style="max-width: 680px; margin-bottom: 20px;">
          <h3>Alert & Notification Audio</h3>
          <p class="muted">Test and verify realtime sound announcements</p>
          
          <div style="margin-top: 14px;">
            <button type="button" class="btn alt" id="btnTestChime">
              Play Campus Queue Chime (Airport Bell)
            </button>
          </div>
        </div>

        <div class="card" style="max-width: 680px; margin-bottom: 20px;">
          <h3>Demo Account Switcher</h3>
          <p class="muted">Quickly switch between 7-digit student personas for your project defense</p>
          
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
            <button class="btn alt sm" id="setJuan">
              Juan Dela Cruz (8240873 - Regular Student - All Clearances Passed)
            </button>
            <button class="btn alt sm" id="setMaria">
              Maria Santos (8240874 - Simulated Clearance Hold - Medical & Library)
            </button>
            <button class="btn alt sm" id="setCarlo">
              Carlo Mendoza (8240875 - Transferee Student - 2nd Year)
            </button>
          </div>
        </div>

        <div class="card" style="max-width: 680px;">
          <h3>Supabase Live Database Connection</h3>
          <p class="muted">
            Configure your remote Supabase Project URL and Public Anon Key.
          </p>

          <label>Supabase Project URL</label>
          <input type="text" id="cfgUrl" value="${esc(config.supabaseUrl || '')}" placeholder="https://xxxxxxxxxxxx.supabase.co">

          <label>Supabase Public Anon Key</label>
          <input type="text" id="cfgKey" value="${esc(config.supabaseAnonKey || '')}" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6...">

          <div id="cfgStatusBox" style="margin-top: 14px; display: none;"></div>

          <div style="margin-top: 16px;" class="row sp">
            <div class="row">
              <button class="btn" id="btnSaveConfig">Save Config</button>
              <button class="btn alt success" id="btnTestConn">Test Live Supabase</button>
            </div>
            <button class="btn danger sm" id="btnResetData">Reset Local Cache</button>
          </div>
        </div>
      `, 'settings');
    },
    init() {
      $('#btnTestChime').onclick = () => {
        window.playQueueChime();
        toast('Playing live queue notification bell');
      };

      $('#setJuan').onclick = () => {
        localStorage.setItem('ee_session', '8240873');
        toast('Switched to Juan Dela Cruz (8240873)');
        location.href = 'dashboard.html';
      };

      $('#setMaria').onclick = () => {
        localStorage.setItem('ee_session', '8240874');
        toast('Switched to Maria Santos (8240874)');
        location.href = 'dashboard.html';
      };

      $('#setCarlo').onclick = () => {
        localStorage.setItem('ee_session', '8240875');
        toast('Switched to Carlo Mendoza (8240875)');
        location.href = 'dashboard.html';
      };

      $('#btnSaveConfig').onclick = () => {
        const u = $('#cfgUrl').value.trim();
        const k = $('#cfgKey').value.trim();
        localStorage.setItem('ee_supabase_url', u);
        localStorage.setItem('ee_supabase_anon_key', k);
        window.ENROLLEASE_CONFIG.supabaseUrl = u;
        window.ENROLLEASE_CONFIG.supabaseAnonKey = k;
        if (window.supabase && u && k) {
          window.supabaseClient = window.supabase.createClient(u, k);
        }
        toast('Supabase credentials saved!');
      };

      $('#btnTestConn').onclick = async () => {
        const u = $('#cfgUrl').value.trim();
        const k = $('#cfgKey').value.trim();
        const box = $('#cfgStatusBox');
        box.style.display = 'block';
        box.innerHTML = '<p class="muted" style="padding: 10px;">Connecting to Supabase project...</p>';

        if (!u || !k) {
          box.innerHTML = '<div style="background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px; font-weight: 600;">Please paste your Supabase Project URL and Public Anon Key first.</div>';
          return;
        }

        localStorage.setItem('ee_supabase_url', u);
        localStorage.setItem('ee_supabase_anon_key', k);
        window.ENROLLEASE_CONFIG.supabaseUrl = u;
        window.ENROLLEASE_CONFIG.supabaseAnonKey = k;

        if (window.supabase) {
          window.supabaseClient = window.supabase.createClient(u, k);
        }

        const res = await window.testSupabaseConnection();
        if (res.success) {
          box.innerHTML = `
            <div style="background: #dcfce7; color: #166534; padding: 14px; border-radius: 10px; font-weight: 600;">
              ${res.message}<br>
              <span style="font-size: 12px; font-weight: normal; color: #14532d;">
                Live tables verified! Students: ${res.students.map(s => s.full_name + ' (' + s.student_id + ')').join(', ')}
              </span>
            </div>
          `;
          toast('Supabase live connection verified!');
        } else {
          box.innerHTML = `
            <div style="background: #fee2e2; color: #991b1b; padding: 14px; border-radius: 10px; font-weight: 600;">
              ${res.message}<br>
              <span style="font-size: 12px; font-weight: normal; color: #7f1d1d;">
                Make sure you pasted and ran the SQL migration in Supabase SQL Editor.
              </span>
            </div>
          `;
        }
      };

      $('#btnResetData').onclick = () => {
        if (!confirm('Reset all demo records back to clean state?')) return;
        localStorage.removeItem('ee_seeded_v5');
        localStorage.removeItem('ee_session');
        initStorage();
        toast('Demo data refreshed with 7-digit IDs!');
        location.href = 'dashboard.html';
      };
    }
  };

  // --- ROUTER DISPATCHER ---
  function getPageName() {
    const pageAttr = document.body.dataset.page;
    if (pageAttr) return pageAttr;
    const path = location.pathname.split('/').pop().replace('.html', '');
    return path || 'index';
  }

  function renderCurrentPage() {
    const page = getPageName();
    const appEl = $('#app') || document.body;
    const view = P[page] || P.dashboard;

    if (view && typeof view.render === 'function') {
      const html = view.render();
      if (appEl.id === 'app') {
        appEl.innerHTML = html;
      } else {
        appEl.innerHTML = `<div id="app">${html}</div>`;
      }
      if (typeof view.init === 'function') {
        view.init();
      }
    }

    const burger = $('#burgerBtn');
    const side = $('#sideNav');
    if (burger && side) {
      burger.onclick = () => side.classList.toggle('open');
    }
  }

  window.renderCurrentPage = renderCurrentPage;
  window.addEventListener('DOMContentLoaded', renderCurrentPage);

})();
