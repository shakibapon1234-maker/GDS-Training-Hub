/**
 * GDS Training Hub — Sabre DEMO MODE Override
 */
(function () {
  'use strict';

  window.GDS_DEMO_MODE = true;
  window.GDS_SIM_TYPE = 'sabre';

  const DEMO_PROFILE = {
    username: 'DEMO USER',
    office_id: 'DAC123SB'
  };
  const FAKE_TOKEN = 'demo_token_sabre_trial_2024';

  /* ── Pre-seed localStorage so restoreSession succeeds ── */
  try {
    localStorage.setItem('sabre_supabase_session_v1', JSON.stringify({
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
            user: { id: 'demo-user-sabre', email: 'demo@gdstraininghub.com' }
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
    // Sabre renders the login shell dynamically, so we poll for it
    let attempts = 0;
    const hideLogin = setInterval(function () {
      attempts++;

      // Sabre login shell ID is sbLoginShell (dynamically created by auth.js render())
      const loginShell = document.getElementById('sbLoginShell') ||
                         document.getElementById('loginShell');

      if (loginShell) {
        loginShell.hidden = true;
        loginShell.style.display = 'none';
        clearInterval(hideLogin);

        // Fill identity elements
        const userBadge = document.getElementById('userBadge');
        if (userBadge) userBadge.textContent = DEMO_PROFILE.username + ' ▾';
        const mainOfficeId = document.getElementById('mainOfficeId');
        if (mainOfficeId) mainOfficeId.textContent = DEMO_PROFILE.office_id;
        const footerOfficeId = document.getElementById('footerOfficeId');
        if (footerOfficeId) footerOfficeId.textContent = DEMO_PROFILE.office_id;
        const accountMenuName = document.getElementById('accountMenuName');
        if (accountMenuName) accountMenuName.textContent = DEMO_PROFILE.username + ' · ' + DEMO_PROFILE.office_id;

        _injectDemoBanner();
      }

      if (attempts > 60) clearInterval(hideLogin); // stop after 6s
    }, 100);
  }, { once: true });

  /* ── Reissue/Refund block ── */
  window.addEventListener('load', function () {
    setTimeout(_patchReissueRefund, 500);
  });

  function _patchReissueRefund() {
    // Sabre reissue/refund commands
    const BLOCKED_PATTERNS = [
      /^TKTRF/i, /^TRFR/i, /^TRF\b/i,
      /^WETR/i, /^REISSUE/i, /^REFUND/i,
      /^TKTRFND/i, /^WEREISSUE/i
    ];

    const cmdInput = document.getElementById('cmdInput') ||
                     document.getElementById('commandInput') ||
                     document.querySelector('input[id*="cmd"], input[id*="command"]');

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

    ['processCommand', 'handleCommand', 'executeCommand', 'sbProcessCommand'].forEach(fn => {
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
                       document.querySelector('.output-area, .sb-terminal, .terminal-body');

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
    try { window.parent.postMessage({ type: 'GDS_REISSUE_BLOCKED', sim: 'sabre' }, '*'); } catch (_) {}
  }

  function _injectDemoBanner() {
    if (document.getElementById('gdsDemoBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'gdsDemoBanner';
    banner.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:99999',
      'background:linear-gradient(90deg,#c8102e,#a00d26)',
      'color:#fff', 'font-weight:700', 'font-size:13px',
      'padding:6px 16px', 'text-align:center',
      'display:flex', 'align-items:center', 'justify-content:center', 'gap:12px',
      'font-family:sans-serif', 'box-shadow:0 2px 8px rgba(0,0,0,0.3)'
    ].join(';');
    banner.innerHTML = `
      <span>🎓 DEMO MODE — শুধুমাত্র PNR Issue পর্যন্ত (একবার)</span>
      <span style="background:#fff;color:#c8102e;padding:2px 10px;border-radius:12px;font-size:12px;">
        Full Bundle: <a href="https://wa.me/8801674091748" target="_blank" style="color:#c8102e;">WhatsApp 01674091748</a>
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
      // Sabre ticket confirmation patterns
      if (
        /OK ISSUED/i.test(text) ||
        /TICKET ISSUED/i.test(text) ||
        /TKT-\d{10,13}/i.test(text) ||
        /E-TICKET.*ISSUED/i.test(text) ||
        /DOCUMENT ISSUED/i.test(text)
      ) {
        clearInterval(interval);
        try {
          window.parent.postMessage({ type: 'GDS_TICKET_ISSUED', sim: 'sabre', timestamp: Date.now() }, '*');
        } catch (_) {}
      }
    }, 1500);
  });

})();
