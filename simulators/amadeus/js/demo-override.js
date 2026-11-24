/**
 * GDS Training Hub — Amadeus DEMO MODE Override
 * This script is injected BEFORE auth.js to bypass Supabase login
 * and restrict Reissue/Refund commands for the one-time free trial.
 *
 * Strategy: Mock fetch() so that all Supabase Edge Function calls
 * return a fake successful session, then hide loginShell after DOMContentLoaded.
 */
(function () {
  'use strict';

  window.GDS_DEMO_MODE = true;
  window.GDS_SIM_TYPE = 'amadeus';

  /* ── Fake profile injected into UI ── */
  const DEMO_PROFILE = {
    username: 'DEMO USER',
    office_id: 'DAC123IT'
  };
  const FAKE_TOKEN = 'demo_token_amadeus_trial_2024';

  /* ── Pre-seed localStorage so restoreSavedSession() auto-succeeds ── */
  try {
    localStorage.setItem('amaduce_supabase_session_v1', JSON.stringify({
      access_token: FAKE_TOKEN,
      refresh_token: FAKE_TOKEN,
      profile: DEMO_PROFILE,
      verified_at: Date.now()
    }));
  } catch (_) {}

  /* ── Mock fetch to intercept Supabase calls ── */
  const _origFetch = window.fetch;
  window.fetch = function (url, opts) {
    const u = String(url);
    // Intercept any Supabase function or auth call
    if (u.includes('supabase.co')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({
          session: {
            access_token: FAKE_TOKEN,
            refresh_token: FAKE_TOKEN,
            user: { id: 'demo-user-amadeus', email: 'demo@gdstraininghub.com' }
          },
          profile: DEMO_PROFILE,
          license: { valid: true },
          access_token: FAKE_TOKEN,
          refresh_token: FAKE_TOKEN,
          verified_at: Date.now()
        })
      });
    }
    return _origFetch.apply(this, arguments);
  };

  /* ── After DOM ready: hide login shell, inject profile, start app ── */
  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      // Hide login shell
      const loginShell = document.getElementById('loginShell');
      if (loginShell) {
        loginShell.hidden = true;
        loginShell.style.display = 'none';
      }

      // Show account menu + fill demo profile
      const userBadge = document.getElementById('userBadge');
      if (userBadge) userBadge.textContent = DEMO_PROFILE.username + ' ▾';

      const mainOfficeId = document.getElementById('mainOfficeId');
      if (mainOfficeId) mainOfficeId.textContent = DEMO_PROFILE.office_id;

      const footerOfficeId = document.getElementById('footerOfficeId');
      if (footerOfficeId) footerOfficeId.textContent = DEMO_PROFILE.office_id;

      const accountMenuName = document.getElementById('accountMenuName');
      if (accountMenuName) accountMenuName.textContent = DEMO_PROFILE.username + ' · ' + DEMO_PROFILE.office_id;

      // Inject a "DEMO MODE" banner inside the simulator
      _injectDemoBanner();

    }, 200); // slight delay so auth.js has set up DOM first
  }, { once: true });

  /* ── Intercept reissue/refund commands ── */
  // We patch the command dispatcher AFTER all scripts load
  window.addEventListener('load', function () {
    setTimeout(_patchReissueRefund, 500);
  });

  function _patchReissueRefund() {
    // Amadeus reissue commands: TRFU, TRFP, TKTRF, REISSUE, etc.
    const BLOCKED_PATTERNS = [
      /^TRF/i, /^REISSUE/i, /^TKTRF/i, /^REFUND/i, /^TKT\/RF/i,
      /^TKTRFND/i, /^TRFR/i
    ];

    // Find the command input element
    const cmdInput = document.getElementById('cmdInput') ||
                     document.querySelector('input[type="text"][id*="cmd"]') ||
                     document.querySelector('.cmd-input');

    if (!cmdInput) return;

    // Listen to form submit or Enter key on input
    const form = cmdInput.closest('form') || cmdInput.parentElement;

    function interceptCommand(cmd) {
      if (!cmd) return false;
      const trimmed = cmd.trim().toUpperCase();
      for (const pat of BLOCKED_PATTERNS) {
        if (pat.test(trimmed)) {
          _showRestrictionMessage();
          return true; // blocked
        }
      }
      return false;
    }

    // Patch keydown
    cmdInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        if (/^NM[Il]/i.test(cmdInput.value)) {
          cmdInput.value = cmdInput.value.replace(/^NM[Il]/i, 'NM1');
        }
        if (interceptCommand(cmdInput.value)) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    }, true);

    // Also patch any global processCommand function
    const origProcess = window.processCommand;
    if (typeof origProcess === 'function') {
      window.processCommand = function (cmd) {
        if (typeof cmd === 'string' && /^NM[Il]/i.test(cmd)) {
          cmd = cmd.replace(/^NM[Il]/i, 'NM1');
        }
        if (interceptCommand(cmd)) return;
        return origProcess.apply(this, arguments);
      };
    }

    // Also patch handleCommand
    const origHandle = window.handleCommand;
    if (typeof origHandle === 'function') {
      window.handleCommand = function (cmd) {
        if (typeof cmd === 'string' && /^NM[Il]/i.test(cmd)) {
          cmd = cmd.replace(/^NM[Il]/i, 'NM1');
        }
        if (interceptCommand(cmd)) return;
        return origHandle.apply(this, arguments);
      };
    }
  }

  function _showRestrictionMessage() {
    // Try to output to the terminal display area
    const outputArea = document.getElementById('outputArea') ||
                       document.getElementById('terminalOutput') ||
                       document.querySelector('.output-area, .terminal-output, .pnr-panel');

    const msg = `
⛔ REISSUE / REFUND — NOT AVAILABLE IN DEMO

এই ফ্রি ট্রায়ালে শুধুমাত্র PNR Issue (Ticket Issue পর্যন্ত) প্র্যাকটিস করা যাবে।
Reissue এবং Refund শুধুমাত্র ফুল ভার্সনে পাওয়া যাবে।

✅ Full Bundle কিনতে WhatsApp করুন: +8801674091748
`.trim();

    if (outputArea) {
      const pre = document.createElement('pre');
      pre.className = 'output-block output-restricted';
      pre.style.cssText = 'color:#ff4444;background:#1a0000;border:1px solid #ff4444;padding:12px;border-radius:6px;margin:8px 0;white-space:pre-wrap;';
      pre.textContent = msg;
      outputArea.appendChild(pre);
      outputArea.scrollTop = outputArea.scrollHeight;
    }

    // Also notify parent window for modal
    try {
      window.parent.postMessage({ type: 'GDS_REISSUE_BLOCKED', sim: 'amadeus' }, '*');
    } catch (_) {}
  }

  function _injectDemoBanner() {
    if (document.getElementById('gdsDemoBanner')) return;
    const banner = document.createElement('div');
    banner.id = 'gdsDemoBanner';
    banner.style.cssText = [
      'position:fixed', 'top:0', 'left:0', 'right:0', 'z-index:99999',
      'background:linear-gradient(90deg,#f59e0b,#d97706)',
      'color:#1a1a1a', 'font-weight:700', 'font-size:13px',
      'padding:6px 16px', 'text-align:center',
      'display:flex', 'align-items:center', 'justify-content:center', 'gap:12px',
      'font-family:sans-serif', 'box-shadow:0 2px 8px rgba(0,0,0,0.3)'
    ].join(';');
    banner.innerHTML = `
      <span>🎓 DEMO MODE — শুধুমাত্র PNR Issue পর্যন্ত (একবার)</span>
      <span style="background:#1a1a1a;color:#f59e0b;padding:2px 10px;border-radius:12px;font-size:12px;">
        Full Bundle: WhatsApp <a href="https://wa.me/8801674091748" target="_blank" style="color:#f59e0b;">01674091748</a>
      </span>
    `;
    document.body.insertBefore(banner, document.body.firstChild);

    // Push body content down so banner doesn't overlap
    document.body.style.paddingTop = (document.body.style.paddingTop || '0px');
    const bodyPad = parseInt(document.body.style.paddingTop) || 0;
    document.body.style.paddingTop = (bodyPad + 36) + 'px';
  }

  /* ── Ticket Issue detection → notify parent ── */
  // Poll for ticket issue indicators in the DOM
  let _ticketCheckInterval = null;
  window.addEventListener('load', function () {
    _ticketCheckInterval = setInterval(function () {
      // Look for ticket confirmation elements common in Amadeus simulator
      const ticketEl = document.querySelector('.ticket-issued, .eticket-number, [data-ticket-issued]') ||
                       document.getElementById('ticketNumber') ||
                       document.getElementById('eticketDisplay');

      // Also check for text in the output area
      const outputArea = document.getElementById('outputArea') ||
                         document.getElementById('terminalOutput');

      let ticketIssued = false;

      if (ticketEl && ticketEl.textContent.trim()) {
        ticketIssued = true;
      }

      if (outputArea) {
        const text = outputArea.textContent || '';
        // Amadeus ticket issue confirmation patterns
        if (
          /OK ETICKET ISSUED/i.test(text) ||
          /TKT-\d{13}/i.test(text) ||
          /TICKET NUMBER.*\d{13}/i.test(text) ||
          /ETK\s*\d{13}/i.test(text) ||
          /OK ISSUED/i.test(text)
        ) {
          ticketIssued = true;
        }
      }

      if (ticketIssued) {
        clearInterval(_ticketCheckInterval);
        try {
          window.parent.postMessage({
            type: 'GDS_TICKET_ISSUED',
            sim: 'amadeus',
            timestamp: Date.now()
          }, '*');
        } catch (_) {}
      }
    }, 1500);
  });

})();
