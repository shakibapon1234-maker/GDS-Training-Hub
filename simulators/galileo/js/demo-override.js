/**
 * GDS Training Hub — Galileo (Travelport) DEMO MODE Override
 */
(function () {
  'use strict';

  /* ── Direct Access & Expiration Guard ── */
  try {
    // 1. If opened directly in browser tab outside iframe, redirect to demo page
    if (window.top === window.self) {
      window.location.replace('../../demo.html');
      return;
    }
    // 2. If trial used or not unlocked, redirect to demo page
    if (localStorage.getItem('gds_trial_used') === 'true' || localStorage.getItem('gds_trial_unlocked') !== 'true') {
      window.location.replace('../../demo.html');
      return;
    }
    // 3. If 1-hour session timer expired, expire and redirect
    const startStr = localStorage.getItem('gds_trial_start_time');
    if (startStr) {
      const elapsed = Date.now() - parseInt(startStr, 10);
      if (elapsed >= 60 * 60 * 1000) {
        localStorage.setItem('gds_trial_used', 'true');
        window.location.replace('../../demo.html');
        return;
      }
    }
  } catch (_) {}

  window.GDS_DEMO_MODE = true;
  window.GDS_SIM_TYPE = 'galileo';

  const DEMO_PROFILE = {
    username: 'DEMO USER',
    office_id: 'DAC123TP'
  };
  const FAKE_TOKEN = 'demo_token_galileo_trial_2024';

  /* ── Pre-seed localStorage so restore session succeeds ── */
  try {
    localStorage.setItem('gellelio_supabase_session_v1', JSON.stringify({
      access_token: FAKE_TOKEN,
      refresh_token: FAKE_TOKEN,
      profile: DEMO_PROFILE,
      verified_at: Date.now()
    }));
  } catch (_) {}

  /* ── Mock fetch for Supabase ── */
  const _origFetch = window.fetch;
  window.fetch = function (url, opts) {
    if (String(url).includes('supabase.co')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          session: {
            access_token: FAKE_TOKEN,
            refresh_token: FAKE_TOKEN,
            user: { id: 'demo-user-galileo', email: 'demo@gdstraininghub.com' }
          },
          profile: DEMO_PROFILE,
          license: { valid: true },
          access_token: FAKE_TOKEN,
          refresh_token: FAKE_TOKEN
        })
      });
    }
    return _origFetch.apply(this, arguments);
  };

  /* ── After DOM ready: bypass login ── */
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      // Hide Galileo login shell
      const loginShell = document.getElementById('loginShell');
      if (loginShell) {
        loginShell.hidden = true;
        loginShell.style.display = 'none';
      }

      // Fill identity
      const userBadge = document.getElementById('userBadge');
      if (userBadge) userBadge.textContent = DEMO_PROFILE.username + ' ▾';
      const mainOfficeId = document.getElementById('mainOfficeId');
      if (mainOfficeId) mainOfficeId.textContent = DEMO_PROFILE.office_id;
      const footerOfficeId = document.getElementById('footerOfficeId');
      if (footerOfficeId) footerOfficeId.textContent = DEMO_PROFILE.office_id;
      const accountMenuName = document.getElementById('accountMenuName');
      if (accountMenuName) accountMenuName.textContent = DEMO_PROFILE.username + ' / ' + DEMO_PROFILE.office_id;

      _injectDemoBanner();
    }, 200);
  }, { once: true });

  /* ── Reissue/Refund block ── */
  window.addEventListener('load', function () {
    setTimeout(_patchReissueRefund, 500);
  });

  function _patchReissueRefund() {
    // Galileo reissue/refund commands
    const BLOCKED_PATTERNS = [
      /^WETR/i, /^WE\//i, /^WREISSUE/i, /^WREFUND/i,
      /^TRFR/i, /^TRF\b/i, /^TKREFUND/i,
      /^REISSUE/i, /^REFUND/i
    ];

    const cmdInput = document.getElementById('cmdInput') ||
                     document.getElementById('commandInput') ||
                     document.querySelector('input.cmd-input, input[placeholder*="command"], input[placeholder*="Command"]');

    if (!cmdInput) return;

    function interceptCommand(cmd) {
      const trimmed = (cmd || '').trim().toUpperCase();
      for (const pat of BLOCKED_PATTERNS) {
        if (pat.test(trimmed)) { _showRestrictionMessage(); return true; }
      }
      return false;
    }

    cmdInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (interceptCommand(cmdInput.value)) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }, true);

    ['processCommand', 'handleCommand', 'executeCommand'].forEach(fn => {
      if (typeof window[fn] === 'function') {
        const orig = window[fn];
        window[fn] = function (cmd) {
          if (interceptCommand(cmd)) return;
          return orig.apply(this, arguments);
        };
      }
    });
  }

  function _showRestrictionMessage() {
    const outputArea = document.getElementById('outputArea') ||
                       document.getElementById('terminalOutput') ||
                       document.querySelector('.output-area, .terminal-body, .pnr-panel');

    const msg = `
⛔ REISSUE / REFUND — NOT AVAILABLE IN DEMO

এই ফ্রি ট্রায়ালে শুধুমাত্র PNR Issue (Ticket Issue পর্যন্ত) প্র্যাকটিস করা যাবে।
Reissue এবং Refund শুধুমাত্র ফুল ভার্সনে পাওয়া যাবে।

✅ Full Bundle কিনতে WhatsApp করুন: +8801674091748
`.trim();

    if (outputArea) {
      const pre = document.createElement('pre');
      pre.style.cssText = 'color:#ff4444;background:#1a0000;border:1px solid #ff4444;padding:12px;border-radius:6px;margin:8px 0;white-space:pre-wrap;font-family:monospace;';
      pre.textContent = msg;
      outputArea.appendChild(pre);
      outputArea.scrollTop = outputArea.scrollHeight;
    }
    try { window.parent.postMessage({ type: 'GDS_REISSUE_BLOCKED', sim: 'galileo' }, '*'); } catch (_) {}
  }

  function _injectDemoBanner() {
    if (document.getElementById('gdsDemoBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'gdsDemoBanner';
    banner.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:99999',
      'background:linear-gradient(90deg,#0077c8,#005fa3)',
      'color:#fff', 'font-weight:700', 'font-size:13px',
      'padding:6px 16px', 'text-align:center',
      'display:flex', 'align-items:center', 'justify-content:center', 'gap:12px',
      'font-family:sans-serif', 'box-shadow:0 2px 8px rgba(0,0,0,0.3)'
    ].join(';');
    banner.innerHTML = `
      <span>🎓 DEMO MODE — শুধুমাত্র PNR Issue পর্যন্ত (একবার)</span>
      <span style="background:#fff;color:#0077c8;padding:2px 10px;border-radius:12px;font-size:12px;">
        Full Bundle: <a href="https://wa.me/8801674091748" target="_blank" style="color:#0077c8;">WhatsApp 01674091748</a>
      </span>
    `;
    document.body.insertBefore(banner, document.body.firstChild);
    const bodyPad = parseInt(document.body.style.paddingTop) || 0;
    document.body.style.paddingTop = (bodyPad + 36) + 'px';
  }

  /* ── Ticket Issue detection ── */
  window.addEventListener('load', function () {
    const interval = setInterval(function () {
      const outputArea = document.getElementById('outputArea') ||
                         document.getElementById('terminalOutput');
      if (!outputArea) return;
      const text = outputArea.textContent || '';
      // Galileo ticket confirmation patterns
      if (
        /TKT ISSUED/i.test(text) ||
        /OK ISSUED/i.test(text) ||
        /TICKET NUMBER/i.test(text) ||
        /ETK\d{10}/i.test(text) ||
        /\bTKT\b.*\d{10,13}/i.test(text)
      ) {
        clearInterval(interval);
        try {
          window.parent.postMessage({ type: 'GDS_TICKET_ISSUED', sim: 'galileo', timestamp: Date.now() }, '*');
        } catch (_) {}
      }
    }, 1500);
  });

})();
