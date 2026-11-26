// Per-device preferences for the staff terminals (kitchen, cashier, waiter).
// They live in localStorage because they describe this screen (sound on/off,
// highlight rules), not the restaurant - the restaurant-wide values come from
// /settings.

const keyFor = (scope) => `rms.prefs.${scope}`;

export function readPrefs(scope, defaults) {
  try {
    const raw = JSON.parse(localStorage.getItem(keyFor(scope)) || '{}');
    return { ...defaults, ...(raw && typeof raw === 'object' ? raw : {}) };
  } catch {
    return { ...defaults };
  }
}

export function writePrefs(scope, prefs) {
  try {
    localStorage.setItem(keyFor(scope), JSON.stringify(prefs));
    return true;
  } catch {
    return false;
  }
}

let audioCtx = null;

// Short synthetic beep so no audio asset is needed. Browsers may block audio
// until the user has interacted with the page - that is fine, we just skip it.
export function playBeep(kind = 'new') {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    audioCtx = audioCtx || new Ctx();
    if (audioCtx.state === 'suspended') audioCtx.resume();

    const tones = kind === 'ready' ? [660, 880] : kind === 'request' ? [880, 660, 880] : [740];
    let start = audioCtx.currentTime;
    tones.forEach((freq) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.22);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(start);
      osc.stop(start + 0.24);
      start += 0.26;
    });
  } catch {
    // audio is optional
  }
}

// Scope + defaults for each terminal, shared by its Settings page and the
// screens that honour the preferences.
export const KITCHEN_PREFS = { scope: 'kitchen', defaults: { soundEnabled: true, priorityAlerts: true } };
export const CASHIER_PREFS = { scope: 'cashier', defaults: { stationName: '', soundOnNewBill: true } };
export const WAITER_PREFS = { scope: 'waiter', defaults: { requestAlerts: true, kitchenSound: true } };
