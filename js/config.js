// ============================================================================
// EnrollEase (PC316v2) - Supabase & Realtime Configuration Bridge
// ============================================================================

window.ENROLLEASE_CONFIG = {
  // Default demo / placeholder credentials - can be overridden via UI Settings or localStorage
  supabaseUrl: localStorage.getItem('ee_supabase_url') || 'https://drysqgfqaryfhlsrimfu.supabase.co',
  supabaseAnonKey: localStorage.getItem('ee_supabase_anon_key') || 'sb_publishable_v5fe2alisEshoaLpnWzodA_kLQHe4Qr',
  isRealtimeConnected: false,
  activeChannel: null
};

// Audio chime generator using browser Web Audio API
window.playQueueChime = function() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Note 1: D5 (587.33 Hz)
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

    // Note 2: A5 (880.00 Hz) - chime bell
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

// Realtime Cross-Tab Broadcast Channel (guarantees instantaneous sync across student, staff, & ERP tabs)
window.eeBroadcast = new BroadcastChannel('enrollease_realtime_mesh');
