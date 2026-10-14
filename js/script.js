// ============================================================================
// EnrollEase (PC316v2) - Core Application Controller & Realtime Router
// ============================================================================

(function () {
  'use strict';

  // --- SEED INITIAL STATE ---
  function initStorage() {
    if (!localStorage.getItem('ee_seeded_v3')) {
      const students = [
        {
          student_id: '2024-00101',
          first_name: 'Juan',
          last_name: 'Dela Cruz',
          full_name: 'Juan Dela Cruz',
          email: 'juan.delacruz@ctu.edu.ph',
          program: 'BS Information Technology',
          year_level: 3,
          section: 'BSIT 3-A',
          student_type: 'Regular',
          tuition_status: 'Cleared / UniFAST',
          balance_amount: 0.0,
          erp_enrollment_status: 'Eligible for Enrollment',
          contact: '+63 912 345 6789'
        },
        {
          student_id: '2024-00102',
          first_name: 'Maria',
          last_name: 'Santos',
          full_name: 'Maria Santos',
          email: 'maria.santos@ctu.edu.ph',
          program: 'BS Information Technology',
          year_level: 3,
          section: 'BSIT 3-B',
          student_type: 'Regular',
          tuition_status: 'With Balance',
          balance_amount: 1250.0,
          erp_enrollment_status: 'Clearance Hold',
          contact: '+63 923 456 7890'
        },
        {
          student_id: '2024-00103',
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
        }
      ];

      const clearances = [
        // Juan Dela Cruz (All Cleared)
        { student_id: '2024-00101', office_code: 'MEDICAL', office_name: 'Campus Clinic', location_room: 'Health Services Rm 101', status: 'Cleared', remarks: 'Annual physical exam completed.' },
        { student_id: '2024-00101', office_code: 'LIBRARY', office_name: 'University Library', location_room: 'Learning Resource Center 2F', status: 'Cleared', remarks: 'No overdue books or liabilities.' },
        { student_id: '2024-00101', office_code: 'SAO_GUIDANCE', office_name: 'Student Affairs & Guidance', location_room: 'Student Center Rm 204', status: 'Cleared', remarks: 'Good moral standing verified.' },
        { student_id: '2024-00101', office_code: 'CASHIER', office_name: 'Accounting & Cashier', location_room: 'Admin Bldg Window 4', status: 'Cleared', remarks: 'UniFAST Free Higher Education subsidized.' },
        { student_id: '2024-00101', office_code: 'DEPT_LAB', office_name: 'IT Department Laboratories', location_room: 'Computer Lab 3', status: 'Cleared', remarks: 'Lab kit inventory signed.' },

        // Maria Santos (Has Holds for demonstration)
        { student_id: '2024-00102', office_code: 'MEDICAL', office_name: 'Campus Clinic', location_room: 'Health Services Rm 101', status: 'Hold', remarks: 'Submit signed Medical Examination Slip at Campus Clinic.' },
        { student_id: '2024-00102', office_code: 'LIBRARY', office_name: 'University Library', location_room: 'Learning Resource Center 2F', status: 'Hold', remarks: 'Return borrowed Arduino kit and Networking textbook.' },
        { student_id: '2024-00102', office_code: 'SAO_GUIDANCE', office_name: 'Student Affairs & Guidance', location_room: 'Student Center Rm 204', status: 'Cleared', remarks: 'Good moral verified.' },
        { student_id: '2024-00102', office_code: 'CASHIER', office_name: 'Accounting & Cashier', location_room: 'Admin Bldg Window 4', status: 'Cleared', remarks: 'Eligible for UniFAST.' },
        { student_id: '2024-00102', office_code: 'DEPT_LAB', office_name: 'IT Department Laboratories', location_room: 'Computer Lab 3', status: 'Cleared', remarks: 'Equipment return verified.' },

        // Carlo Mendoza
        { student_id: '2024-00103', office_code: 'MEDICAL', office_name: 'Campus Clinic', location_room: 'Health Services Rm 101', status: 'Cleared', remarks: 'Health certificate valid.' },
        { student_id: '2024-00103', office_code: 'LIBRARY', office_name: 'University Library', location_room: 'Learning Resource Center 2F', status: 'Cleared', remarks: 'Transferee library card issued.' },
        { student_id: '2024-00103', office_code: 'SAO_GUIDANCE', office_name: 'Student Affairs & Guidance', location_room: 'Student Center Rm 204', status: 'Cleared', remarks: 'Transferee orientation completed.' },
        { student_id: '2024-00103', office_code: 'CASHIER', office_name: 'Accounting & Cashier', location_room: 'Admin Bldg Window 4', status: 'Cleared', remarks: 'Subsidized under UniFAST.' },
        { student_id: '2024-00103', office_code: 'DEPT_LAB', office_name: 'IT Department Laboratories', location_room: 'Computer Lab 3', status: 'Cleared', remarks: 'Cleared.' }
      ];

      const subjects = [
        { student_id: '2024-00101', subject_code: 'PC 316', descriptive_title: 'Advanced Web Systems & Full-Stack Development', units: 3, schedule_block: 'MWF 09:00 AM - 10:30 AM (Lab 3)', is_advised: true },
        { student_id: '2024-00101', subject_code: 'IT 312', descriptive_title: 'Information Assurance and Security', units: 3, schedule_block: 'TTH 10:30 AM - 12:00 PM (Room 402)', is_advised: true },
        { student_id: '2024-00101', subject_code: 'IT 313', descriptive_title: 'Mobile Application Development', units: 3, schedule_block: 'MWF 01:00 PM - 02:30 PM (Lab 2)', is_advised: true },
        { student_id: '2024-00101', subject_code: 'IT 314', descriptive_title: 'Networking 2 / Advanced Routing & Switching', units: 3, schedule_block: 'TTH 01:00 PM - 02:30 PM (Cisco Lab)', is_advised: true },
        { student_id: '2024-00101', subject_code: 'GE 311', descriptive_title: 'Ethics and Social Issues in Computing', units: 3, schedule_block: 'Friday 03:00 PM - 06:00 PM (AVR)', is_advised: true },

        { student_id: '2024-00102', subject_code: 'PC 316', descriptive_title: 'Advanced Web Systems & Full-Stack Development', units: 3, schedule_block: 'MWF 10:30 AM - 12:00 PM (Lab 3)', is_advised: false },
        { student_id: '2024-00102', subject_code: 'IT 312', descriptive_title: 'Information Assurance and Security', units: 3, schedule_block: 'TTH 08:30 AM - 10:00 AM (Room 402)', is_advised: false },
        { student_id: '2024-00102', subject_code: 'IT 313', descriptive_title: 'Mobile Application Development', units: 3, schedule_block: 'MWF 02:30 PM - 04:00 PM (Lab 2)', is_advised: false },

        { student_id: '2024-00103', subject_code: 'PC 316', descriptive_title: 'Advanced Web Systems & Full-Stack Development', units: 3, schedule_block: 'MWF 09:00 AM - 10:30 AM (Lab 3)', is_advised: true },
        { student_id: '2024-00103', subject_code: 'IT 312', descriptive_title: 'Information Assurance and Security', units: 3, schedule_block: 'TTH 10:30 AM - 12:00 PM (Room 402)', is_advised: true }
      ];

      const workflowSteps = [
        {
          step_number: 1,
          step_title: 'Pre-Enrollment Clearance Verification',
          office_name: 'Campus Clearance Offices',
          building_room: 'Clinic, Library, SAO, Cashier',
          clear_instructions: 'Ensure all 5 campus clearances (Medical Clinic, University Library, SAO Guidance, Cashier, and Dept Lab) are cleared. If you have any Hold remark, visit that office to settle your requirement before proceeding.',
          required_documents: ['Valid School ID Card', 'Signed Medical Slip', 'Library Return Receipt']
        },
        {
          step_number: 2,
          step_title: 'Department Curriculum Advising & Subject Loading',
          office_name: 'Department of Computer Studies',
          building_room: 'IT Faculty Room - Room 304 (Window 1)',
          clear_instructions: 'Meet with your assigned academic adviser to review prerequisite subjects, lock in major courses (including PC 316: Advanced Web Systems), and obtain the approved Advising Form.',
          required_documents: ['Curriculum Evaluation Checklist', 'Previous Semester Grade Slip', 'Pre-Enrollment Advising Sheet']
        },
        {
          step_number: 3,
          step_title: 'Registrar Document Evaluation & Encoding',
          office_name: 'Office of the University Registrar',
          building_room: 'Admin Building - Windows 1 & 2',
          clear_instructions: 'Submit your signed department advising slip to the Registrar for official database encoding into the school system.',
          required_documents: ['Signed Advising Slip', 'Official Transcript / Grade Slip', 'Good Moral Certificate (if transferee)']
        },
        {
          step_number: 4,
          step_title: 'Cashier / UniFAST Assessment',
          office_name: 'Accounting & Cashier Office',
          building_room: 'Admin Building - Windows 3 & 4',
          clear_instructions: 'Validate your UniFAST Free Higher Education tuition subsidy coverage or settle assessed miscellaneous laboratory fees if not subsidized.',
          required_documents: ['Encoded Assessment Form', 'UniFAST Billing Sheet', 'Certificate of Indigency (if applicable)']
        },
        {
          step_number: 5,
          step_title: 'Official COR Printing & School ID Validation',
          office_name: 'Registrar Release Section',
          building_room: 'Admin Building - Window 5',
          clear_instructions: 'Claim your official stamped Certificate of Registration (COR) and validate your student ID sticker for the current semester.',
          required_documents: ['Official Assessment Form', 'Valid Student ID Card']
        }
      ];

      const progress = [
        // Juan Dela Cruz
        { student_id: '2024-00101', step_number: 1, status: 'completed', staff_notes: 'All 5 clearances verified.' },
        { student_id: '2024-00101', step_number: 2, status: 'in_queue', staff_notes: 'Waiting for IT Advising Window 1.' },
        { student_id: '2024-00101', step_number: 3, status: 'locked', staff_notes: 'Pending Step 2 completion.' },
        { student_id: '2024-00101', step_number: 4, status: 'locked', staff_notes: 'Pending registrar evaluation.' },
        { student_id: '2024-00101', step_number: 5, status: 'locked', staff_notes: 'Pending assessment.' },

        // Maria Santos (Has Hold)
        { student_id: '2024-00102', step_number: 1, status: 'action_required', staff_notes: 'Clinic and Library clearances on Hold.' },
        { student_id: '2024-00102', step_number: 2, status: 'locked', staff_notes: 'Locked: Resolve Step 1 first.' },
        { student_id: '2024-00102', step_number: 3, status: 'locked', staff_notes: 'Locked.' },
        { student_id: '2024-00102', step_number: 4, status: 'locked', staff_notes: 'Locked.' },
        { student_id: '2024-00102', step_number: 5, status: 'locked', staff_notes: 'Locked.' },

        // Carlo Mendoza
        { student_id: '2024-00103', step_number: 1, status: 'completed', staff_notes: 'Cleared.' },
        { student_id: '2024-00103', step_number: 2, status: 'completed', staff_notes: 'Advised by Dept Chair.' },
        { student_id: '2024-00103', step_number: 3, status: 'ready_to_book', staff_notes: 'Ready for Registrar Encoding.' },
        { student_id: '2024-00103', step_number: 4, status: 'locked', staff_notes: 'Locked.' },
        { student_id: '2024-00103', step_number: 5, status: 'locked', staff_notes: 'Locked.' }
      ];

      const appointments = [
        {
          id: 'a1',
          reference_code: 'EE-2026-8841',
          student_id: '2024-00101',
          step_number: 2,
          purpose: 'Department Curriculum Advising & PC 316 Loading',
          date: new Date().toISOString().slice(0, 10),
          time: '10:00 AM',
          queue: 'ADV-004',
          counter_window: 'Window 1 - IT Advising',
          status: 'Checked-In'
        },
        {
          id: 'a2',
          reference_code: 'EE-2026-9022',
          student_id: '2024-00103',
          step_number: 3,
          purpose: 'Registrar Document Verification',
          date: new Date().toISOString().slice(0, 10),
          time: '02:00 PM',
          queue: 'REG-019',
          counter_window: 'Window 2 - Registrar',
          status: 'Upcoming'
        }
      ];

      const queue = [
        {
          queue_id: 'q1',
          ticket_number: 'ADV-001',
          student_id: '2024-00095',
          student_name: 'Andrea Nicole Lim',
          step_number: 2,
          counter_window: 'Window 1 - IT Advising',
          priority_type: 'Booked Appointment',
          status: 'Serving',
          estimated_wait_mins: 0,
          created_at: new Date(Date.now() - 15 * 60000).toISOString()
        },
        {
          queue_id: 'q2',
          ticket_number: 'ADV-004',
          student_id: '2024-00101',
          student_name: 'Juan Dela Cruz',
          step_number: 2,
          counter_window: 'Window 1 - IT Advising',
          priority_type: 'Booked Appointment',
          status: 'Waiting',
          estimated_wait_mins: 8,
          created_at: new Date(Date.now() - 10 * 60000).toISOString()
        },
        {
          queue_id: 'q3',
          ticket_number: 'ADV-007',
          student_id: '2024-00115',
          student_name: 'Mark Kenneth Bautista',
          step_number: 2,
          counter_window: 'Window 1 - IT Advising',
          priority_type: 'Regular Walk-In',
          status: 'Waiting',
          estimated_wait_mins: 16,
          created_at: new Date(Date.now() - 5 * 60000).toISOString()
        },
        {
          queue_id: 'q4',
          ticket_number: 'REG-014',
          student_id: '2024-00088',
          student_name: 'Samantha Rose Cruz',
          step_number: 3,
          counter_window: 'Window 2 - Registrar',
          priority_type: 'Booked Appointment',
          status: 'Serving',
          estimated_wait_mins: 0,
          created_at: new Date(Date.now() - 20 * 60000).toISOString()
        },
        {
          queue_id: 'q5',
          ticket_number: 'REG-019',
          student_id: '2024-00103',
          student_name: 'Carlo Mendoza',
          step_number: 3,
          counter_window: 'Window 2 - Registrar',
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
      localStorage.setItem('ee_session', '2024-00101'); // Default to Juan Dela Cruz
      localStorage.setItem('ee_seeded_v3', 'true');
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
      // Broadcast change across tabs
      if (window.eeBroadcast) {
        window.eeBroadcast.postMessage({ type: 'SYNC_' + key.toUpperCase(), payload: val });
      }
    },
    currentStudentId() {
      return localStorage.getItem('ee_session') || '2024-00101';
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

      const progress = this.get('progress');
      let p1 = progress.find(p => p.student_id === sid && p.step_number === 1);
      let p2 = progress.find(p => p.student_id === sid && p.step_number === 2);

      if (hasHold) {
        if (p1) p1.status = 'action_required';
        if (p2) p2.status = 'locked';
        student.erp_enrollment_status = 'Clearance Hold';
      } else {
        if (p1) p1.status = 'completed';
        if (p2 && p2.status === 'locked') p2.status = 'ready_to_book';
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
        // If current student ticket was called to Serving, trigger chime!
        if (type === 'SYNC_QUEUE') {
          const mySid = DAL.currentStudentId();
          const queue = DAL.get('queue');
          const myTicket = queue.find(q => q.student_id === mySid);
          if (myTicket && myTicket.status === 'Serving') {
            window.playQueueChime();
            toast('🔔 Your Ticket ' + myTicket.ticket_number + ' is NOW SERVING at ' + myTicket.counter_window + '!');
          }
        }
        // Re-render current page if active
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

  function modal(html) {
    const m = document.createElement('div');
    m.className = 'modal';
    m.innerHTML = `<div class="card">${html}</div>`;
    m.onclick = e => { if (e.target === m) m.remove(); };
    document.body.appendChild(m);
    return m;
  }

  // --- DEMO BAR COMPONENT (Floating Top Banner for Live Defense) ---
  function demoBarHtml() {
    const currentSid = DAL.currentStudentId();
    const students = DAL.get('students');
    const isStudentPortal = !location.pathname.includes('staff-terminal') && !location.pathname.includes('erp-simulator');

    return `
      <div class="demo-bar">
        <div class="demo-bar-left">
          <span class="demo-bar-label">⚡ Live Defense Switcher:</span>
          <a href="dashboard.html" class="demo-pill ${isStudentPortal ? 'active' : ''}">🎓 Student Portal</a>
          <a href="staff-terminal.html" class="demo-pill ${location.pathname.includes('staff-terminal') ? 'active' : ''}">🖥️ Staff Terminal</a>
          <a href="erp-simulator.html" class="demo-pill ${location.pathname.includes('erp-simulator') ? 'active' : ''}">🗄️ SIS/ERP Simulator</a>
        </div>
        <div class="demo-bar-left">
          <span class="demo-sync-badge">
            <span class="pulse-dot"></span>
            Realtime Mesh Active
          </span>
          <select id="demoStudentSwitch" style="padding: 4px 8px; font-size: 11px; width: auto; height: 28px; border-radius: 8px; margin: 0; background: #0f172a; color: #fff; border: 1px solid #334155;">
            ${students.map(s => `
              <option value="${s.student_id}" ${s.student_id === currentSid ? 'selected' : ''}>
                👤 ${s.full_name} (${s.student_id === '2024-00102' ? 'Has Holds' : 'Cleared'})
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `;
  }

  // --- APP SHELL (Royal Blue Sidebar + Header) ---
  const NAV_ITEMS = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'book-appointment', icon: '📅', label: 'Book Appointment' },
    { id: 'my-schedule', icon: '🗓️', label: 'My Schedule' },
    { id: 'enrollment', icon: '🎓', label: 'Enrollment Details' },
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'settings', icon: '⚙️', label: 'Settings' }
  ];

  function shell(contentHtml, activePage) {
    return `
      <div class="shell">
        <aside class="side" id="sideNav">
          <div class="logo">Enroll<span>Ease</span></div>
          <div class="side-nav">
            ${NAV_ITEMS.map(item => `
              <a href="${item.id}.html" class="${item.id === activePage ? 'on' : ''}">
                <span>${item.icon}</span>
                <span>${item.label}</span>
              </a>
            `).join('')}
          </div>
          <div class="side-footer">
            <a href="login.html" id="logoutLink" style="color: #fca5a5;">
              <span>🚪</span>
              <span>Logout</span>
            </a>
          </div>
        </aside>
        <main class="main">
          <div class="top-bar-mobile">
            <button class="burger" id="burgerBtn" aria-label="Toggle Menu">☰</button>
            <div class="logo">Enroll<span>Ease</span></div>
          </div>
          ${demoBarHtml()}
          ${contentHtml}
        </main>
      </div>
    `;
  }

  // --- 5-STEP ENROLLMENT GUIDE TRACKER COMPONENT ---
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
              <div class="step-num-badge">${p.status === 'completed' ? '✓' : step.step_number}</div>
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
            <span>🧭</span>
            <span>Step-by-Step Enrollment Guide & Roadmap</span>
          </h3>
          <span class="badge ${holdClearances.length > 0 ? 'd' : 'p'}">
            ${holdClearances.length > 0 ? `⚠️ ${holdClearances.length} Clearance Hold(s) Detected` : '🟢 Clearances in Good Standing'}
          </span>
        </div>
        <div class="stepper-row">
          ${stepItems}
        </div>
        <div class="step-drawer">
          <div class="drawer-grid">
            <div class="drawer-box">
              <h4>📍 Office & Window Location</h4>
              <p><b>${activeStepData.office_name}</b></p>
              <p class="muted" style="margin-top: 4px;">${activeStepData.building_room}</p>
            </div>
            <div class="drawer-box">
              <h4>📋 What Documents to Bring</h4>
              <ul>
                ${activeStepData.required_documents.map(doc => `<li>${doc}</li>`).join('')}
              </ul>
            </div>
            <div class="drawer-box">
              <h4>📢 Clear Instructions</h4>
              <p>${activeStepData.clear_instructions}</p>
              ${activeProgress.staff_notes ? `<p style="margin-top: 8px; color: var(--b2); font-weight: 600;">Staff Note: ${activeProgress.staff_notes}</p>` : ''}
            </div>
          </div>
          <div class="row sp">
            <div class="muted" style="font-size: 13px;">
              Current Status: <b>${activeProgress.status.toUpperCase().replace('_', ' ')}</b>
            </div>
            <div>
              ${activeProgress.status === 'action_required' ? `
                <a href="enrollment.html" class="btn warning sm">Resolve Clearance Holds at Issuing Offices</a>
              ` : activeProgress.status === 'ready_to_book' ? `
                <a href="book-appointment.html" class="btn sm">Book Slot for Step ${selectedStep}</a>
              ` : activeProgress.status === 'in_queue' ? `
                <a href="my-schedule.html" class="btn sm success">View Live Queue Ticket</a>
              ` : `
                <a href="book-appointment.html" class="btn alt sm">Appointment Info</a>
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
                <a href="staff-terminal.html" class="btn alt sm">🖥️ Staff Queue Terminal</a>
                <a href="erp-simulator.html" class="btn alt sm">🗄️ University SIS Simulator</a>
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
              <label>Student ID Number</label>
              <input type="text" id="loginId" value="2024-00101" placeholder="e.g. 2024-00101" required>
              
              <label>PIN or Password</label>
              <input type="password" id="loginPw" value="demo1234" required>
              
              <div class="err" id="loginErr"></div>
              
              <button type="submit" class="btn" style="width: 100%; margin-top: 14px;">Sign In</button>
            </form>

            <div style="margin-top: 24px; padding-top: 18px; border-top: 1px solid var(--ln);">
              <label style="margin-bottom: 8px;">⚡ Quick Demo Login:</label>
              <div style="display: flex; flex-direction: column; gap: 8px;">
                <button type="button" class="btn alt sm" id="quickJuan">
                  👤 Juan Dela Cruz (Cleared • Regular Student)
                </button>
                <button type="button" class="btn alt sm" id="quickMaria">
                  ⚠️ Maria Santos (With Medical/Library Holds)
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
        localStorage.setItem('ee_session', '2024-00101');
        toast('Logged in as Juan Dela Cruz');
        location.href = 'dashboard.html';
      };

      $('#quickMaria').onclick = () => {
        localStorage.setItem('ee_session', '2024-00102');
        toast('Logged in as Maria Santos (Clearance Hold Demo)');
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
      const myTicket = queue.find(q => q.student_id === student.student_id);
      const servingTicket = queue.find(q => q.status === 'Serving' && q.counter_window.includes('Advising'));

      const isHold = student.erp_enrollment_status === 'Clearance Hold';

      return shell(`
        <!-- Top Welcome Banner -->
        <div class="banner">
          <div class="banner-badge">
            <span class="pulse-dot"></span>
            ${isHold ? '⚠️ Clearance Action Required in Campus SIS' : '🟢 Synced with Campus SIS/ERP'}
          </div>
          <h1>Welcome back, ${esc(student.full_name)}!</h1>
          <p>
            ${student.program} • ${student.section} • Year Level ${student.year_level}
          </p>
          <p style="margin-top: 8px; font-weight: 600; opacity: 0.95;">
            ${myTicket ? `🎟️ Live Queue Ticket: ${myTicket.ticket_number} (${myTicket.status}) at ${myTicket.counter_window}` :
              activeAppt ? `📅 Next Appointment: ${formatDate(activeAppt.date)} at ${activeAppt.time} (${activeAppt.purpose})` :
              'Ready for enrollment advising. Please check your roadmap below.'}
          </p>
        </div>

        <!-- 5-Step Enrollment Guide Tracker -->
        ${renderGuideTracker(student, progress, currentTrackerStep)}

        <!-- 6 Action Cards Grid -->
        <div class="grid">
          <!-- 1. Book Appointment -->
          <a class="tile" href="book-appointment.html">
            <div>
              <div class="tile-top">
                <div class="ic">📅</div>
                <span class="badge ${isHold ? 'd' : 'p'}">${isHold ? 'Hold Warning' : 'Available'}</span>
              </div>
              <b>Book Appointment</b>
              <p>Reserve an advising or registrar window time slot</p>
            </div>
            <div style="margin-top: 14px; font-weight: 600; font-size: 13px; color: var(--b2);">
              ${isHold ? 'Check clearance requirements →' : 'Select date & time →'}
            </div>
          </a>

          <!-- 2. My Schedule -->
          <a class="tile" href="my-schedule.html">
            <div>
              <div class="tile-top">
                <div class="ic">🗓️</div>
                <span class="badge p">${appointments.length} Booked</span>
              </div>
              <b>My Schedule</b>
              <p>Upcoming passes, QR verification & check-in</p>
            </div>
            <div style="margin-top: 14px; font-weight: 600; font-size: 13px; color: var(--b2);">
              View appointment passes →
            </div>
          </a>

          <!-- 3. Active Queue Number Spotlight -->
          <a class="tile ${myTicket ? 'queue-card-active' : ''}" href="my-schedule.html">
            <div>
              <div class="tile-top">
                <div class="ic" style="${myTicket ? 'background: rgba(255,255,255,0.2); color: #fff;' : ''}">🎫</div>
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
                <p>No active queue ticket issued. Check in to an appointment or request a ticket.</p>
              `}
            </div>
          </a>

          <!-- 4. Enrollment Details -->
          <a class="tile" href="enrollment.html">
            <div>
              <div class="tile-top">
                <div class="ic">🎓</div>
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
                <div class="ic">👤</div>
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
                <div class="ic">⚙️</div>
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
      // Setup click handlers for stepper items
      $$('.step-item').forEach(el => {
        el.onclick = () => {
          currentTrackerStep = parseInt(el.dataset.step, 10);
          renderCurrentPage();
        };
      });

      // Quick student switcher in demo bar
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
        <h1>📅 Book Enrollment Appointment</h1>
        
        ${hasHold ? `
          <div class="card" style="border-left: 5px solid var(--er); margin-bottom: 20px; background: #fff5f5;">
            <h3 style="color: var(--er);">⚠️ Pre-Enrollment Clearance Notice</h3>
            <p>Our Simulated ERP detected outstanding clearance hold(s) on your student record:</p>
            <ul style="color: var(--er); font-weight: 600; margin: 8px 0 14px 20px;">
              ${clearances.filter(c => c.status === 'Hold').map(c => `
                <li><b>${c.office_name}:</b> ${c.remarks} (${c.location_room})</li>
              `).join('')}
            </ul>
            <p class="muted" style="font-size: 13px;">
              You can still book an <b>Advising Appointment</b>, but your official registration cannot be stamped until clearance holds are marked Cleared in the ERP.
            </p>
          </div>
        ` : ''}

        <div class="card" style="max-width: 680px;">
          <label>Select Enrollment Stage</label>
          <select id="apptStep">
            <option value="2">Step 2: Department Curriculum Advising & Subject Loading (Window 1)</option>
            <option value="3">Step 3: Registrar Document Evaluation & Encoding (Window 2)</option>
            <option value="4">Step 4: Cashier / UniFAST Assessment (Window 3)</option>
            <option value="5">Step 5: Official COR Printing & ID Validation (Window 5)</option>
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
        const draft = {
          step_number: parseInt($('#apptStep').value, 10),
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
        <h1>📋 Appointment Pass Summary</h1>
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
              <li>Have your School ID card and printed advising sheet ready.</li>
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
        const queuePrefix = draft.step_number === 2 ? 'ADV' : draft.step_number === 3 ? 'REG' : 'CSH';
        const queueNum = `${queuePrefix}-${String(Math.floor(Math.random() * 80) + 1).padStart(3, '0')}`;

        const newAppt = {
          id: 'a' + Date.now(),
          reference_code: refCode,
          student_id: sid,
          step_number: draft.step_number,
          purpose: draft.purpose,
          date: draft.date,
          time: draft.time,
          queue: queueNum,
          counter_window: draft.step_number === 2 ? 'Window 1 - IT Advising' : 'Window 2 - Registrar',
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

      return shell(`
        <div class="card center" style="max-width: 540px; margin: 30px auto;">
          <div style="font-size: 50px; margin-bottom: 8px;">✅</div>
          <h1>Appointment Confirmed!</h1>
          <p class="muted">Your smart campus enrollment slot is successfully booked.</p>

          <div class="qr-container">
            <div class="qr-box">
              <svg width="90" height="90" viewBox="0 0 100 100" fill="currentColor">
                <path d="M0,0 h30 v30 h-30 z M10,10 h10 v10 h-10 z M70,0 h30 v30 h-30 z M80,10 h10 v10 h-10 z M0,70 h30 v30 h-30 z M10,80 h10 v10 h-10 z M40,10 h10 v10 h-10 z M60,10 h10 v10 h-10 z M40,40 h20 v20 h-20 z M10,40 h10 v20 h-10 z M70,40 h20 v10 h-20 z M70,60 h10 v20 h-10 z M40,70 h10 v20 h-10 z M80,80 h20 v20 h-20 z" />
              </svg>
              <span style="margin-top: 4px;">SCAN PASS</span>
            </div>
            <div class="ref-code">${appt.reference_code}</div>
            <p class="muted" style="font-size: 12px; margin: 4px 0 0;">Official EnrollEase Smart Appointment Pass</p>
          </div>

          <dl style="text-align: left; margin: 20px 0;">
            <dt>Purpose:</dt>
            <dd>${appt.purpose}</dd>
            <dt>Date & Time:</dt>
            <dd>${formatDate(appt.date)} at ${appt.time}</dd>
            <dt>Counter Window:</dt>
            <dd>${appt.counter_window}</dd>
          </dl>

          <div class="row sp" style="justify-content: center; gap: 12px;">
            <a href="dashboard.html" class="btn alt">Back to Dashboard</a>
            <a href="my-schedule.html" class="btn success">Go to My Schedule</a>
          </div>
        </div>
      `, 'book-appointment');
    }
  };

  // MY SCHEDULE
  P['my-schedule'] = {
    render() {
      const student = DAL.currentStudent();
      const appts = DAL.get('appts').filter(a => a.student_id === student.student_id);
      const queue = DAL.get('queue');
      const myTicket = queue.find(q => q.student_id === student.student_id);

      return shell(`
        <h1>🗓️ My Appointments & Queue Passes</h1>
        
        ${myTicket ? `
          <div class="card" style="background: linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%); color: #fff; margin-bottom: 24px;">
            <div class="row sp">
              <div>
                <span class="badge w">⚡ LIVE QUEUE TICKET ACTIVE</span>
                <div style="font-size: 40px; font-weight: 800; color: #60a5fa; margin: 4px 0;">
                  ${myTicket.ticket_number}
                </div>
                <p style="margin: 0; color: #dbeafe;">${myTicket.counter_window} • Status: <b>${myTicket.status}</b></p>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 24px; font-weight: 700;">${myTicket.estimated_wait_mins} mins</div>
                <p class="muted" style="color: #93c5fd; margin: 0;">Estimated Wait</p>
              </div>
            </div>
          </div>
        ` : ''}

        <h2>Booked Passes</h2>
        <div style="display: flex; flex-direction: column; gap: 14px; margin-top: 12px;">
          ${appts.length === 0 ? `
            <div class="card muted">No appointments scheduled yet. <a href="book-appointment.html">Book a slot now</a>.</div>
          ` : appts.map(a => `
            <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
              <div>
                <div style="font-size: 16px; font-weight: 700; color: var(--tx);">${a.purpose}</div>
                <div class="muted" style="font-size: 13px; margin-top: 4px;">
                  📅 ${formatDate(a.date)} • ⏰ ${a.time} • 🏢 ${a.counter_window}
                </div>
                <div style="font-size: 12px; font-family: monospace; color: var(--b); margin-top: 4px;">
                  Ref: <b>${a.reference_code}</b>
                </div>
              </div>
              <div class="row">
                <span class="badge ${a.status === 'Checked-In' ? 'w' : 'p'}">${a.status}</span>
                ${a.status !== 'Checked-In' ? `
                  <button class="btn sm success btnCheckIn" data-id="${a.id}">
                    🎟️ Check-In & Issue Queue Ticket
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

          // Add to live queue
          const queue = DAL.get('queue');
          const prefix = appt.step_number === 2 ? 'ADV' : appt.step_number === 3 ? 'REG' : 'CSH';
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

          toast(`Checked-In! Your Live Queue Ticket is ${ticketNumber}.`);
          window.playQueueChime();
          renderCurrentPage();
        };
      });

      $$('.btnCancelAppt').forEach(btn => {
        btn.onclick = () => {
          if (!confirm('Are you sure you want to cancel this appointment?')) return;
          const appts = DAL.get('appts').filter(a => a.id !== btn.dataset.id);
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
          <h1>🎓 University SIS Enrollment Details</h1>
          <button class="btn alt" onclick="window.print()">🖨️ Print / Download Enrollment Slip</button>
        </div>

        <!-- Student Summary Header -->
        <div class="card" style="margin-bottom: 20px;">
          <div class="row sp">
            <div>
              <h2 style="margin: 0;">${esc(student.full_name)}</h2>
              <p class="muted" style="margin: 4px 0 0;">
                Student ID: <b>${student.student_id}</b> • ${student.program} (${student.section})
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
          <h3>📋 University Office Clearance Checklist</h3>
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
                      ${c.status === 'Cleared' ? '✓ Cleared' : '⚠️ ' + c.status}
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
              <h3>📚 Curriculum Subjects & Loading</h3>
              <p class="muted" style="margin: 0;">Academic Year 2026-2027 • 1st Semester</p>
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
                      ${s.is_advised ? '✓ Advised & Locked' : 'Pending Advising'}
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
        <h1>👤 Student Profile</h1>
        <div class="card" style="max-width: 640px;">
          <h3>Official SIS/ERP Student Record</h3>
          <p class="muted" style="margin-bottom: 18px;">Registered credentials in the University Student Information System</p>
          
          <form id="profileForm">
            <label>Full Name</label>
            <input type="text" id="profName" value="${esc(student.full_name)}">

            <label>Student ID (Permanent)</label>
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
        <h1>⚙️ System Preferences & Connection Hub</h1>
        
        <div class="card" style="max-width: 680px; margin-bottom: 20px;">
          <h3>🔔 Alert & Notification Audio</h3>
          <p class="muted">Test and verify realtime sound announcements</p>
          
          <div style="margin-top: 14px;">
            <button type="button" class="btn alt" id="btnTestChime">
              🔊 Play Campus Queue Chime (Airport Bell)
            </button>
          </div>
        </div>

        <div class="card" style="max-width: 680px; margin-bottom: 20px;">
          <h3>⚡ Demo Account Switcher</h3>
          <p class="muted">Quickly switch between student personas for your project defense</p>
          
          <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
            <button class="btn alt sm" id="setJuan">
              👤 Juan Dela Cruz (Eligible Regular Student • All Clearances Passed)
            </button>
            <button class="btn alt sm" id="setMaria">
              ⚠️ Maria Santos (Simulated Clearance Hold • Medical & Library)
            </button>
            <button class="btn alt sm" id="setCarlo">
              🎓 Carlo Mendoza (Transferee Student • 2nd Year)
            </button>
          </div>
        </div>

        <div class="card" style="max-width: 680px;">
          <h3>🌐 Supabase Live Database Connection</h3>
          <p class="muted">
            Configure your remote Supabase Project URL and Public Anon Key.
          </p>

          <label>Supabase URL</label>
          <input type="text" id="cfgUrl" value="${esc(config.supabaseUrl || '')}" placeholder="https://xyzcompany.supabase.co">

          <label>Supabase Anon Key</label>
          <input type="text" id="cfgKey" value="${esc(config.supabaseAnonKey || '')}" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6...">

          <div style="margin-top: 16px;" class="row sp">
            <button class="btn" id="btnSaveConfig">Save Connection Config</button>
            <button class="btn danger sm" id="btnResetData">Reset All Mock Data to Default</button>
          </div>
        </div>
      `, 'settings');
    },
    init() {
      $('#btnTestChime').onclick = () => {
        window.playQueueChime();
        toast('🔔 Playing live queue notification bell');
      };

      $('#setJuan').onclick = () => {
        localStorage.setItem('ee_session', '2024-00101');
        toast('Switched to Juan Dela Cruz');
        location.href = 'dashboard.html';
      };

      $('#setMaria').onclick = () => {
        localStorage.setItem('ee_session', '2024-00102');
        toast('Switched to Maria Santos');
        location.href = 'dashboard.html';
      };

      $('#setCarlo').onclick = () => {
        localStorage.setItem('ee_session', '2024-00103');
        toast('Switched to Carlo Mendoza');
        location.href = 'dashboard.html';
      };

      $('#btnSaveConfig').onclick = () => {
        const u = $('#cfgUrl').value.trim();
        const k = $('#cfgKey').value.trim();
        localStorage.setItem('ee_supabase_url', u);
        localStorage.setItem('ee_supabase_anon_key', k);
        toast('Supabase credentials saved!');
      };

      $('#btnResetData').onclick = () => {
        if (!confirm('Reset all demo records back to clean state?')) return;
        localStorage.removeItem('ee_seeded_v3');
        initStorage();
        toast('Demo data refreshed!');
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

    // Attach burger menu toggle
    const burger = $('#burgerBtn');
    const side = $('#sideNav');
    if (burger && side) {
      burger.onclick = () => side.classList.toggle('open');
    }
  }

  window.renderCurrentPage = renderCurrentPage;
  window.addEventListener('DOMContentLoaded', renderCurrentPage);

})();
