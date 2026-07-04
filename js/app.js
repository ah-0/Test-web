/* js/app.js — Shared Capacitor utilities for AQB EDU */
'use strict';

// ── Bridge detection ──────────────────────────────────────────
const isNative = () =>
  typeof window !== 'undefined' &&
  typeof window.Capacitor !== 'undefined' &&
  window.Capacitor.isNativePlatform?.();

const CAP = (name) =>
  (isNative() && window.Capacitor?.Plugins?.[name]) || null;

// ── Toast ─────────────────────────────────────────────────────
let _toastTimer, _toastEl;
async function showToast(message, duration = 'short') {
  const p = CAP('Toast');
  if (p) { await p.show({ text: message, duration }); return; }
  if (!_toastEl) {
    _toastEl = document.createElement('div');
    _toastEl.id = '__toast';
    Object.assign(_toastEl.style, {
      position:'fixed', bottom:'80px', left:'50%',
      transform:'translateX(-50%) translateY(80px)',
      background:'#0d1b35', border:'1px solid #1a2d50', color:'#e2e8f0',
      padding:'10px 20px', borderRadius:'100px', fontSize:'13px',
      transition:'transform .3s', zIndex:'9999', whiteSpace:'nowrap',
      boxShadow:'0 4px 24px rgba(0,0,0,.7)', direction:'rtl',
    });
    document.body.appendChild(_toastEl);
  }
  _toastEl.textContent = message;
  _toastEl.style.transform = 'translateX(-50%) translateY(0)';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() =>
    _toastEl.style.transform = 'translateX(-50%) translateY(80px)', 2600);
}

// ── Haptics ───────────────────────────────────────────────────
const Haptics = {
  async impact(style = 'MEDIUM') {
    const p = CAP('Haptics');
    if (p) return p.impact({ style });
    navigator.vibrate?.(style === 'LIGHT' ? 30 : style === 'HEAVY' ? 100 : 50);
  },
  async notification(type = 'SUCCESS') {
    const p = CAP('Haptics');
    if (p) return p.notification({ type });
    navigator.vibrate?.(
      type === 'SUCCESS' ? [40,20,40] :
      type === 'ERROR'   ? [80,30,80] : [60,20,60]);
  },
  async success() { return this.notification('SUCCESS'); },
  async error()   { return this.notification('ERROR'); },
  async warning() { return this.notification('WARNING'); },
};

// ── Preferences ───────────────────────────────────────────────
const Prefs = {
  async set(key, value) {
    const p = CAP('Preferences');
    const val = JSON.stringify(value);
    if (p) await p.set({ key, value: val });
    else localStorage.setItem('aqb_' + key, val);
  },
  async get(key, fallback = null) {
    const p = CAP('Preferences');
    try {
      let raw;
      if (p) { const r = await p.get({ key }); raw = r.value; }
      else raw = localStorage.getItem('aqb_' + key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  async remove(key) {
    const p = CAP('Preferences');
    if (p) await p.remove({ key });
    else localStorage.removeItem('aqb_' + key);
  },
};

// ── Dialog ────────────────────────────────────────────────────
const Dialog = {
  async alert(title, message = '') {
    const p = CAP('Dialog');
    if (p) return p.alert({ title, message, buttonTitle: 'موافق' });
    alert(title + (message ? '\n' + message : ''));
  },
  async confirm(title, message = '') {
    const p = CAP('Dialog');
    if (p) {
      const { value } = await p.confirm({ title, message, okButtonTitle: 'نعم', cancelButtonTitle: 'إلغاء' });
      return value;
    }
    return confirm(title + (message ? '\n' + message : ''));
  },
  async prompt(title, message = '', placeholder = '') {
    const p = CAP('Dialog');
    if (p) {
      const { value, cancelled } = await p.prompt({
        title, message, inputPlaceholder: placeholder,
        okButtonTitle: 'موافق', cancelButtonTitle: 'إلغاء',
      });
      return cancelled ? null : value;
    }
    return window.prompt(title + (message ? '\n' + message : ''), placeholder);
  },
};

// ── Local Notifications ───────────────────────────────────────
let _notifId = (Date.now() % 100000) | 0;
const Notify = {
  async requestPermission() {
    const p = CAP('LocalNotifications');
    if (p) {
      const { display } = await p.requestPermissions();
      return display === 'granted';
    }
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }
    return false;
  },
  async schedule(title, body, at, id = null) {
    const nid = id ?? (++_notifId);
    const p = CAP('LocalNotifications');
    if (p) {
      await p.schedule({
        notifications: [{
          id: nid, title, body,
          schedule: { at },
          smallIcon: 'ic_stat_icon_config_sample',
          sound: 'default',
        }],
      });
    } else if ('Notification' in window && Notification.permission === 'granted') {
      const delay = at.getTime() - Date.now();
      if (delay <= 0) new Notification(title, { body });
      else setTimeout(() => new Notification(title, { body }), delay);
    }
    return nid;
  },
  async cancel(id) {
    const p = CAP('LocalNotifications');
    if (p) await p.cancel({ notifications: [{ id }] });
  },
};

// ── Share ─────────────────────────────────────────────────────
const Share = {
  async share(title, text, url = '') {
    const p = CAP('Share');
    try {
      if (p) { await p.share({ title, text, url, dialogTitle: 'مشاركة' }); return; }
      if (navigator.share) { await navigator.share({ title, text, url }); return; }
    } catch { /* cancelled */ }
    await navigator.clipboard?.writeText(text + (url ? '\n' + url : ''));
    showToast('📋 تم نسخ النص');
  },
};

// ── Camera ────────────────────────────────────────────────────
const Camera = {
  async pick(source = 'PHOTOS') {
    const p = CAP('Camera');
    if (!p) { showToast('⚠️ الكاميرا تعمل في التطبيق فقط'); return null; }
    try {
      const img = await p.getPhoto({
        quality: 85, allowEditing: true,
        resultType: 'base64', source, correctOrientation: true,
      });
      return 'data:image/jpeg;base64,' + img.base64String;
    } catch (e) {
      if (!e.message?.includes('cancel')) showToast('❌ ' + e.message);
      return null;
    }
  },
};

// ── Network ───────────────────────────────────────────────────
async function isOnline() {
  const p = CAP('Network');
  if (p) { const s = await p.getStatus(); return s.connected; }
  return navigator.onLine;
}

// ── Bottom nav ────────────────────────────────────────────────
function renderBottomNav(active) {
  const el = document.getElementById('bottom-nav');
  if (!el) return;
  const items = [
    { id: 'home',       icon: '🏠', label: 'الرئيسية',  href: 'index.html' },
    { id: 'courses',    icon: '📚', label: 'المواد',     href: 'courses.html' },
    { id: 'files',      icon: '📁', label: 'الملفات',    href: 'files.html' },
    { id: 'flashcards', icon: '🃏', label: 'البطاقات',   href: 'flashcards.html' },
    { id: 'profile',    icon: '👤', label: 'ملفي',       href: 'profile.html' },
  ];
  el.innerHTML = items.map(it => `
    <a href="${it.href}" class="nav-item${it.id === active ? ' active' : ''}">
      <span class="nav-icon">${it.icon}</span>
      <span class="nav-label">${it.label}</span>
    </a>`).join('');
}

// ── Date / Time helpers ───────────────────────────────────────
function pad2(n) { return String(n).padStart(2, '0'); }

function formatCountdown(ms) {
  if (ms <= 0) return '00:00:00';
  const s = Math.floor(ms / 1000);
  return `${pad2(Math.floor(s/3600))}:${pad2(Math.floor((s%3600)/60))}:${pad2(s%60)}`;
}

function formatTime12(date) {
  let h = date.getHours(), m = date.getMinutes();
  const ampm = h >= 12 ? 'م' : 'ص';
  h = h % 12 || 12;
  return `${h}:${pad2(m)} ${ampm}`;
}

function formatDateAr(date) {
  return date.toLocaleDateString('ar-SA', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ── Points helper ─────────────────────────────────────────────
async function addPoints(n) {
  const cur = await Prefs.get('points', 0);
  await Prefs.set('points', cur + n);
  return cur + n;
}

async function getPoints() { return Prefs.get('points', 0); }

// ── Streak helper ─────────────────────────────────────────────
async function touchStreak() {
  const today = new Date().toDateString();
  const last  = await Prefs.get('streak_day', '');
  let streak  = await Prefs.get('streak', 0);
  if (last === today) return streak;
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  streak = (last === yesterday) ? streak + 1 : 1;
  await Prefs.set('streak', streak);
  await Prefs.set('streak_day', today);
  return streak;
}
