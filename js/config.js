// ============================================================================
// EnrollEase (PC316v2) - Supabase & Realtime Configuration Bridge
// ============================================================================

window.ENROLLEASE_CONFIG = {
  // Read from localStorage if user saved credentials in Settings, or use configured defaults
  supabaseUrl: localStorage.getItem('ee_supabase_url') || '',
  supabaseAnonKey: localStorage.getItem('ee_supabase_anon_key') || '',
  isRealtimeConnected: false,
  activeChannel: null
};

// Initialize Official Supabase JS Client if credentials are provided
window.supabaseClient = null;
if (window.supabase && window.ENROLLEASE_CONFIG.supabaseUrl && window.ENROLLEASE_CONFIG.supabaseAnonKey) {
  try {
    window.supabaseClient = window.supabase.createClient(
      window.ENROLLEASE_CONFIG.supabaseUrl,
      window.ENROLLEASE_CONFIG.supabaseAnonKey
    );
    console.log('[EnrollEase] Supabase Client Initialized for:', window.ENROLLEASE_CONFIG.supabaseUrl);
  } catch (err) {
    console.warn('[EnrollEase] Supabase initialization notice:', err);
  }
}

// Quick live connection test helper
window.testSupabaseConnection = async function() {
  if (!window.supabaseClient) {
    return { success: false, message: 'Supabase credentials not configured yet. Enter URL and Anon Key in Settings.' };
  }
  try {
    const { data, error } = await window.supabaseClient.from('erp_sis_students').select('student_id, full_name').limit(6);
    if (error) {
      return { success: false, message: 'Database error: ' + error.message };
    }
    return {
      success: true,
      message: `Connected successfully! Found ${data.length} student records (including Juan Dela Cruz).`,
      students: data
    };
  } catch (e) {
    return { success: false, message: 'Network or connection error: ' + e.message };
  }
};

// Audio chime generator using browser Web Audio API (Airport/counter chime)
window.playQueueChime = function() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Tone 1: D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
    gain1.gain.setValueAtTime(0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.05);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.6);

    // Tone 2: A5 (880.00 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.00, ctx.currentTime + 0.3);
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.3);
    gain2.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.35);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.3);
    osc2.stop(ctx.currentTime + 1.2);
  } catch (e) {
    console.warn('Audio chime notice:', e);
  }
};

// Realtime Cross-Tab Broadcast Channel (instantaneous local mesh + Supabase WebSocket bridge)
window.eeBroadcast = new BroadcastChannel('enrollease_realtime_mesh');
