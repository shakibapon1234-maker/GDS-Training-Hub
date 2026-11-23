/* Sabre security gate. This file intentionally contains only the public
   Supabase URL/key; privileged actions are performed by Edge Functions. */
(() => {
  const URL = 'https://yajsoxywosuyyoufuxui.supabase.co';
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhanNveHl3b3N1eXlvdWZ1eHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyMzYyMDAsImV4cCI6MjEwNTgxMjIwMH0.b4ESJvByQkje10NVjn0bJQPwUOaalV2ZvkRh8p6h3ds';
  const SESSION_KEY = 'sabre_supabase_session_v1';
  const DEVICE_KEY = 'sabre_training_device_id_v1';

  let session = null;
  let deviceId = null;
  let heartbeat = null;
  let failures = 0;
  let recoveryAccessToken = '';
  let recoveryLinkError = '';
  const recoveryMessage = 'If the account details match an active Sabre account with a verified email, instructions will be sent shortly.';

  const SVG_EYE_OPEN = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
  const SVG_EYE_CLOSED = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

  const headers = token => ({
    apikey: KEY,
    Authorization: `Bearer ${token || KEY}`,
    'Content-Type': 'application/json'
  });

  const $ = id => document.getElementById(id);

  function device() {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      const bytes = new Uint8Array(16);
      crypto.getRandomValues(bytes);
      id = 'SBR-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').toUpperCase().match(/.{1,4}/g).join('-');
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  }

  function appType() {
    return navigator.userAgent.includes('Electron') ? 'electron' : (/Android/i.test(navigator.userAgent) ? 'android' : 'web');
  }

  function setLoginLoading(isLoading) {
    const overlay = $('loginLoading');
    const btn = $('sbSignIn');
    if (overlay) overlay.hidden = !isLoading;
    if (btn) {
      btn.disabled = isLoading;
      btn.textContent = isLoading ? 'Signing in…' : 'Sign in';
      btn.style.opacity = isLoading ? '0.75' : '1';
      btn.style.cursor = isLoading ? 'not-allowed' : 'pointer';
    }
  }

  function render() {
    if ($('sbLoginShell')) return;

    const shell = document.createElement('section');
    shell.id = 'sbLoginShell';

    // If a saved session exists, keep login shell hidden while validating in background to prevent flickering
    const hasSaved = !recoveryAccessToken && !recoveryLinkError && Boolean(localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY));
    if (hasSaved) {
      shell.style.display = 'none';
    }

    shell.innerHTML = `
<style>
#sbLoginShell {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
  background: radial-gradient(circle at 12% 15%, rgba(200, 16, 46, 0.35) 0%, transparent 45%),
              radial-gradient(circle at 88% 85%, rgba(0, 130, 138, 0.3) 0%, transparent 45%),
              radial-gradient(circle at 50% 50%, rgba(20, 5, 8, 0.7) 0%, transparent 60%),
              linear-gradient(145deg, #0d0204 0%, #1c060a 50%, #080a0f 100%);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  color: #1d2733;
}
#sbLoginShell[hidden] {
  display: none !important;
}
#sbLoginShell .card {
  width: min(446px, 94vw);
  padding: 38px 34px 28px;
  border-radius: 16px;
  background: #ffffff;
  color: #1d2733;
  box-shadow: 0 24px 65px rgba(0, 0, 0, 0.6), 0 0 35px rgba(200, 16, 46, 0.2);
  border: 1px solid rgba(200, 16, 46, 0.25);
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
}
/* Vibrant top accent border */
#sbLoginShell .card::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 5px;
  background: linear-gradient(90deg, #c8102e, #ff4d4f, #00828a, #00d4aa);
}

.sb-brand-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 22px;
}
.sb-brand-logo-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.sb-brand-badge {
  font-size: 26px;
  line-height: 1;
  color: #c8102e;
}
.sb-brand-name {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 3px;
  color: #111827;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
.sb-academy-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: linear-gradient(90deg, #fef2f2, #fff1f2);
  border: 1px solid #fecdd3;
  color: #be123c;
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 12px;
  border-radius: 99px;
  letter-spacing: 0.2px;
}

#sbLoginShell label {
  display: block;
  margin: 14px 0 6px;
  font-weight: 600;
  font-size: 13px;
  color: #334155;
}
#sbLoginShell input {
  width: 100%;
  height: 48px;
  padding: 12px 14px;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
  box-sizing: border-box;
  background: #f8fafc;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
  font-family: inherit;
}
#sbLoginShell input:focus {
  border-color: #c8102e;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(200, 16, 46, 0.18);
}
#sbLoginShell .password-wrap {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
}
#sbLoginShell .password-wrap input {
  padding-right: 44px;
}
#sbLoginShell .eye {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 32px;
  height: 32px;
  margin: 0;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
#sbLoginShell .eye:hover {
  background: #fdebee;
  color: #c8102e;
}
#sbLoginShell .submit {
  width: 100%;
  height: 46px;
  margin-top: 20px;
  border: 0;
  border-radius: 8px;
  background: linear-gradient(135deg, #c8102e 0%, #e01e37 50%, #00828a 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 15px;
  cursor: pointer;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 14px rgba(200, 16, 46, 0.35);
  transition: all 0.2s ease;
}
#sbLoginShell .submit:hover {
  background: linear-gradient(135deg, #e01e37 0%, #c8102e 100%);
  box-shadow: 0 6px 20px rgba(200, 16, 46, 0.5);
  transform: translateY(-1px);
}
#sbLoginShell .submit:active {
  transform: translateY(0);
}
#sbLoginShell .err {
  min-height: 20px;
  color: #b42318;
  margin: 10px 0 0;
  font-weight: 600;
  font-size: 13px;
  text-align: center;
}

/* ── Colorful & High-Contrast System Panel (Device ID & Version) ── */
.login-system-panel {
  margin-top: 22px;
  padding: 12px 14px;
  background: linear-gradient(135deg, #18080b 0%, #220b10 100%);
  border: 1px solid rgba(200, 16, 46, 0.32);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sb-device-card {
  margin: 0 !important;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border: 1px solid rgba(255, 175, 185, 0.25);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.35);
  font-size: 12px;
}
.device-card-label {
  color: #ff99a8;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.5px;
  white-space: nowrap;
}
.sb-device-card code {
  color: #00d4aa !important;
  font-weight: 700;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 12px;
  letter-spacing: 0.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.device-copy-btn {
  border: 1px solid #c8102e !important;
  background: linear-gradient(135deg, #c8102e, #a80f27) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  cursor: pointer;
  font-size: 11px !important;
  padding: 4px 12px !important;
  border-radius: 6px !important;
  transition: all 0.2s ease !important;
  white-space: nowrap;
}
.device-copy-btn:hover {
  background: #e01e37 !important;
  box-shadow: 0 0 10px rgba(200, 16, 46, 0.6) !important;
  transform: scale(1.04) !important;
}

.app-version-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 10px;
}

.version-badge {
  background: rgba(0, 212, 170, 0.15);
  color: #00d4aa;
  border: 1px solid rgba(0, 212, 170, 0.35);
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 11.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  letter-spacing: 0.3px;
}
.version-badge b {
  color: #ffffff;
  font-weight: 700;
}

.btn-check-update {
  background: linear-gradient(135deg, #c8102e 0%, #a80f27 100%) !important;
  color: #ffffff !important;
  font-weight: 700 !important;
  font-size: 11.5px !important;
  padding: 4px 14px !important;
  border-radius: 99px !important;
  border: 1px solid #ff4d4f !important;
  cursor: pointer !important;
  box-shadow: 0 2px 8px rgba(200, 16, 46, 0.4) !important;
  display: inline-flex !important;
  align-items: center !important;
  gap: 5px !important;
  transition: all 0.2s ease !important;
  text-decoration: none !important;
}
.btn-check-update:hover {
  background: #e01e37 !important;
  box-shadow: 0 0 14px rgba(224, 30, 55, 0.7) !important;
  transform: translateY(-1px) !important;
}

#sbLoginShell .sb-login-helpline {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px dashed #e2e8f0;
  text-align: center;
  font-size: 12.5px;
  color: #64748b;
}
#sbLoginShell .sb-login-helpline strong {
  color: #c8102e;
  letter-spacing: 0.4px;
  font-size: 13.5px;
}
.sb-recovery-links { display:flex; justify-content:center; gap:16px; margin-top:12px; }
.sb-recovery-links button { border:0; background:transparent; color:#a81228; text-decoration:underline; cursor:pointer; font:inherit; font-size:12px; }

/* --- Animated Flying Plane Progress Overlay (Sabre Red) --- */
.login-loading {
  position: fixed;
  inset: 0;
  z-index: 20010;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(18, 3, 5, 0.82);
  backdrop-filter: blur(4px);
}
.login-loading[hidden] {
  display: none !important;
}
.login-loading-card {
  width: min(370px, 92vw);
  padding: 30px 28px 26px;
  display: grid;
  justify-items: center;
  gap: 12px;
  border: 1px solid rgba(255, 175, 185, 0.35);
  border-radius: 16px;
  background: linear-gradient(145deg, #a81327, #48080f);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55);
  color: #ffffff;
  text-align: center;
}
.login-loading-card strong {
  font-size: 20px;
  letter-spacing: 0.1px;
}
.login-loading-card > span {
  color: #ffccd3;
  font-size: 13.5px;
}
.login-flight-track {
  position: relative;
  width: 230px;
  height: 42px;
  overflow: hidden;
  border-bottom: 2px dashed rgba(255, 200, 210, 0.75);
}
.login-flight-plane {
  position: absolute;
  top: 2px;
  left: -32px;
  color: #ffffff;
  font-size: 30px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.45));
  animation: login-flight 1.8s linear infinite;
}
.login-spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 255, 255, 0.28);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: login-spin 0.75s linear infinite;
}
@keyframes login-flight {
  from {
    transform: translateX(0) translateY(6px) rotate(-8deg);
  }
  45% {
    transform: translateX(115px) translateY(0) rotate(-8deg);
  }
  to {
    transform: translateX(275px) translateY(-9px) rotate(-8deg);
  }
}
@keyframes login-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
<div class="card">
  <div class="sb-brand-header">
    <div class="sb-brand-logo-row">
      <span class="sb-brand-badge">&#9670;</span>
      <span class="sb-brand-name">SABRE</span>
    </div>
    <div class="sb-academy-badge">&#9992; Wings Fly Aviation Academy &bull; Sabre GDS</div>
  </div>
  <form id="sbLoginForm" style="${recoveryAccessToken ? 'display:none' : ''}">
    <label>Username
      <input id="sbLoginUsername" autocomplete="username" placeholder="Enter username" required>
    </label>
    <label>Password
      <span class="password-wrap">
        <input id="sbLoginPassword" type="password" autocomplete="current-password" placeholder="Enter password" required>
        <button class="eye" id="sbPasswordEye" type="button" aria-label="Show password">${SVG_EYE_OPEN}</button>
      </span>
    </label>
    <button class="submit" id="sbSignIn" type="button">Sign in</button>
  </form>
  <p class="err" id="sbLoginError"></p>
  <div class="sb-recovery-links" id="sbRecoveryLinks" style="${recoveryAccessToken ? 'display:none' : ''}">
    <button type="button" id="sbForgotPassword">Forgot password?</button>
    <button type="button" id="sbForgotUsername">Forgot username?</button>
  </div>
  <form id="sbForgotPasswordForm" style="display:none">
    <label>Account email<input id="sbRecoveryEmail" type="email" autocomplete="email" required maxlength="254"></label>
    <button class="submit" type="submit">Send reset link</button>
    <button class="submit" type="button" id="sbBackFromPassword" style="margin-top:8px;background:#64748b">Back to sign in</button>
  </form>
  <form id="sbForgotUsernameForm" style="display:none">
    <label>Verified account email<input id="sbUsernameEmail" type="email" autocomplete="email" required maxlength="254"></label>
    <button class="submit" type="submit">Send username</button>
    <button class="submit" type="button" id="sbBackFromUsername" style="margin-top:8px;background:#64748b">Back to sign in</button>
  </form>
  <p class="err" id="sbRecoveryRequestMessage" role="status" aria-live="polite"></p>
  <form id="sbRecoveryForm" style="${recoveryAccessToken ? '' : 'display:none'}">
    <label>New password
      <input id="sbNewPassword" type="password" autocomplete="new-password" minlength="8" required>
    </label>
    <label>Confirm new password
      <input id="sbConfirmPassword" type="password" autocomplete="new-password" minlength="8" required>
    </label>
    <button class="submit" id="sbSavePassword" type="submit">Save new password</button>
  </form>
  <p class="err" id="sbRecoveryError"></p>

  <!-- High-Contrast System Panel (Device ID & Version) -->
  <div class="login-system-panel">
    <div class="sb-device-card">
      <span class="device-card-label">&#128187; Device ID</span>
      <code id="sbDeviceId">Loading…</code>
      <button type="button" class="device-copy-btn" id="sbCopyDeviceBtn" onclick="sbCopyDeviceId()">Copy</button>
    </div>
    <div class="app-version-bar">
      <span class="version-badge">&#9881; Version <b id="sbAppVersionDisplay">v1.0.17</b></span>
      <button type="button" id="sbLoginCheckUpdateBtn" class="btn-check-update" onclick="window.sbCheckForUpdates ? window.sbCheckForUpdates() : window.open('https://github.com/shakibapon1234-maker/Sabre-Releases/releases/latest','_blank')">&#8635; Check for updates</button>
    </div>
  </div>

  <div class="sb-login-helpline">
    <span>📞 হেল্পলাইন: <strong>01757208244 (Shakib)</strong></span>
  </div>
</div>

<div class="login-loading" id="loginLoading" hidden role="status" aria-live="assertive" aria-label="Signing you in">
  <div class="login-loading-card">
    <div class="login-flight-track"><span class="login-flight-plane">&#9992;</span></div>
    <div class="login-spinner" aria-hidden="true"></div>
    <strong>Signing you in…</strong>
    <span>Verifying your account and device.</span>
  </div>
</div>`;


    // Deep-link error text is untrusted input; render it as text, never markup.
    const recoveryError = shell.querySelector('#sbRecoveryError');
    if (recoveryError) recoveryError.textContent = recoveryLinkError;

    document.body.appendChild(shell);
    if ($('sbDeviceId')) $('sbDeviceId').textContent = deviceId;
    if (window.sabreUpdater && window.sabreUpdater.getVersion) {
      window.sabreUpdater.getVersion().then(version => {
        if ($('sbAppVersionDisplay') && version) $('sbAppVersionDisplay').textContent = `v${version}`;
      }).catch(() => {});
    }

    $('sbLoginForm').addEventListener('submit', signIn);
    $('sbSignIn').addEventListener('click', signIn);
    $('sbRecoveryForm').addEventListener('submit', saveNewPassword);
    $('sbForgotPassword').addEventListener('click', () => showRecoveryRequest('password'));
    $('sbForgotUsername').addEventListener('click', () => showRecoveryRequest('username'));
    $('sbBackFromPassword').addEventListener('click', showLoginForm);
    $('sbBackFromUsername').addEventListener('click', showLoginForm);
    $('sbForgotPasswordForm').addEventListener('submit', event => requestRecovery(event, 'password'));
    $('sbForgotUsernameForm').addEventListener('submit', event => requestRecovery(event, 'username'));
    $('sbPasswordEye').addEventListener('click', () => {
      const input = $('sbLoginPassword');
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      $('sbPasswordEye').innerHTML = isPassword ? SVG_EYE_CLOSED : SVG_EYE_OPEN;
      $('sbPasswordEye').setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
    });
  }

  function showRecoveryRequest(kind) {
    $('sbLoginForm').style.display = 'none';
    $('sbRecoveryLinks').style.display = 'none';
    $('sbForgotPasswordForm').style.display = kind === 'password' ? '' : 'none';
    $('sbForgotUsernameForm').style.display = kind === 'username' ? '' : 'none';
    $('sbRecoveryRequestMessage').textContent = '';
    $('sbLoginError').textContent = '';
  }

  function showLoginForm() {
    $('sbLoginForm').style.display = '';
    $('sbRecoveryLinks').style.display = '';
    $('sbForgotPasswordForm').style.display = 'none';
    $('sbForgotUsernameForm').style.display = 'none';
    $('sbRecoveryRequestMessage').textContent = '';
  }

  async function requestRecovery(event, action) {
    event.preventDefault();
    const email = $(action === 'password' ? 'sbRecoveryEmail' : 'sbUsernameEmail').value.trim();
    const message = $('sbRecoveryRequestMessage');
    const button = event.submitter || event.target.querySelector('button[type="submit"]');
    button.disabled = true;
    message.textContent = '';
    try {
      await call('account-recovery', { action, email });
    } catch (_) {
      // Keep the public response identical when the account is unknown or service delivery fails.
    } finally {
      message.textContent = recoveryMessage;
      button.disabled = false;
      event.target.reset();
    }
  }

  async function call(name, body, token) {
    const r = await fetch(`${URL}/functions/v1/${name}`, {
      method: 'POST',
      headers: headers(token),
      body: JSON.stringify(body)
    });
    const json = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(json.error || 'Security service unavailable.');
    return json;
  }

  async function refreshSessionToken(rfToken) {
    const res = await fetch(`${URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        apikey: KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ refresh_token: rfToken })
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.access_token) {
      throw new Error(data.msg || data.error_description || 'Session refresh failed.');
    }
    return data;
  }

  async function saveNewPassword(event) {
    event.preventDefault();
    const password = $('sbNewPassword').value;
    const error = $('sbRecoveryError');
    const button = $('sbSavePassword');
    error.textContent = '';
    if (password !== $('sbConfirmPassword').value) {
      error.textContent = 'The passwords do not match.';
      return;
    }
    if (!recoveryAccessToken) {
      error.textContent = 'This password reset link is invalid or expired. Request a new reset email.';
      return;
    }

    button.disabled = true;
    button.textContent = 'Saving…';
    try {
      const response = await fetch(`${URL}/functions/v1/complete-password-reset`, {
        method: 'POST',
        headers: {
          apikey: KEY,
          Authorization: `Bearer ${recoveryAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password, confirm_password: $('sbConfirmPassword').value })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.msg || result.message || result.error_description || result.error || 'Could not update the password.');
      }

      clearInterval(heartbeat);
      heartbeat = null;
      session = null;
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem('sabre_master_session');
      recoveryAccessToken = '';
      $('sbRecoveryForm').style.display = 'none';
      $('sbLoginForm').style.display = '';
      $('sbRecoveryLinks').style.display = '';
      $('sbLoginError').textContent = 'Password updated. Sign in using your training username and new password.';
      $('sbNewPassword').value = '';
      $('sbConfirmPassword').value = '';
    } catch (cause) {
      error.textContent = cause.message || 'Could not update the password. Request a new reset email.';
    } finally {
      button.disabled = false;
      button.textContent = 'Save new password';
    }
  }

  function readRecoveryLink() {
    const params = new URLSearchParams(location.hash.slice(1));
    if (params.get('type') === 'recovery') {
      recoveryAccessToken = params.get('access_token') || '';
      recoveryLinkError = recoveryAccessToken
        ? ''
        : 'This password reset link is invalid or expired. Request a new reset email.';
      if (recoveryAccessToken) history.replaceState(null, '', location.pathname + location.search);
      return;
    }
    if (params.has('error')) {
      recoveryLinkError = params.get('error_description') || 'This password reset link is invalid or expired. Request a new reset email.';
      history.replaceState(null, '', location.pathname + location.search);
    }
  }

  function lock(message) {
    clearInterval(heartbeat);
    session = null;
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('sabre_master_session');
    setLoginLoading(false);
    if ($('sbLoginError')) {
      $('sbLoginError').textContent = message || '';
    }
    if ($('sbLoginShell')) {
      $('sbLoginShell').style.display = '';
    }
  }

  window.sabreLogout = function() {
    lock('');
  };

  function startHeartbeat() {
    clearInterval(heartbeat);
    failures = 0;
    heartbeat = setInterval(async () => {
      if (!session || !session.access_token) return;
      try {
        await call('device-license', {
          action: 'heartbeat',
          device_id: deviceId,
          app_type: appType()
        }, session.access_token);
        failures = 0;
      } catch (e) {
        // Try token refresh before failing if possible
        if (session.refresh_token) {
          try {
            const refreshed = await refreshSessionToken(session.refresh_token);
            session.access_token = refreshed.access_token;
            session.refresh_token = refreshed.refresh_token || session.refresh_token;
            localStorage.setItem(SESSION_KEY, JSON.stringify(session));
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
            await call('device-license', {
              action: 'heartbeat',
              device_id: deviceId,
              app_type: appType()
            }, session.access_token);
            failures = 0;
            return;
          } catch (_) {}
        }
        if (++failures >= 2) lock(e.message);
      }
    }, 300000); // 5 minutes
  }

  async function signIn(event) {
    if (event) event.preventDefault();
    const username = ($('sbLoginUsername')?.value || '').trim().toUpperCase();
    const password = $('sbLoginPassword')?.value || '';
    if ($('sbLoginError')) $('sbLoginError').textContent = '';

    setLoginLoading(true);
    try {
      const login = await call('login-with-device', {
        username,
        password,
        device_id: deviceId,
        device_name: navigator.userAgent.slice(0, 150),
        app_type: appType()
      });

      await call('device-license', {
        action: 'activate',
        device_id: deviceId,
        device_name: navigator.userAgent.slice(0, 150),
        app_type: appType()
      }, login.session.access_token);

      session = { ...login.session, profile: login.profile };
      // Persist in localStorage so reloads and app restarts retain session
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

      if ($('sbLoginShell')) $('sbLoginShell').style.display = 'none';
      startHeartbeat();
    } catch (e) {
      if ($('sbLoginError')) $('sbLoginError').textContent = e.message;
    } finally {
      setLoginLoading(false);
    }
  }

  async function restoreSession() {
    const stored = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (!stored) {
      if ($('sbLoginShell')) $('sbLoginShell').style.display = '';
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!parsed) {
        throw new Error('Invalid session format.');
      }
      session = parsed;

      if (!parsed.access_token) {
        throw new Error('Invalid session format.');
      }

      // Verify the session and device registration against backend
      try {
        await call('device-license', {
          action: 'heartbeat',
          device_id: deviceId,
          app_type: appType()
        }, session.access_token);
      } catch (err) {
        // If access token expired, attempt token refresh
        if (session.refresh_token) {
          const refreshed = await refreshSessionToken(session.refresh_token);
          session.access_token = refreshed.access_token;
          session.refresh_token = refreshed.refresh_token || session.refresh_token;
          localStorage.setItem(SESSION_KEY, JSON.stringify(session));
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));

          // Retry heartbeat with the newly refreshed access token
          await call('device-license', {
            action: 'heartbeat',
            device_id: deviceId,
            app_type: appType()
          }, session.access_token);
        } else {
          throw err;
        }
      }

      // Backend confirmed device and session are valid
      if ($('sbLoginShell')) $('sbLoginShell').style.display = 'none';
      startHeartbeat();
    } catch (e) {
      console.warn('Session auto-unlock failed:', e.message);
      // Device revoked, session expired, or user disabled
      lock(e.message || 'Session expired. Please sign in again.');
    }
  }

  window.addEventListener('DOMContentLoaded', async () => {
    deviceId = device();
    readRecoveryLink();
    render();
    const stored = localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);
    if (recoveryAccessToken || recoveryLinkError) {
      // Show recovery UI without discarding the current device session until reset succeeds.
      if ($('sbLoginShell')) $('sbLoginShell').style.display = '';
    } else if (stored) {
      // Saved session exists — try to restore it
      await restoreSession();
    } else {
      if ($('sbLoginShell')) $('sbLoginShell').style.display = '';
      if (recoveryLinkError && $('sbLoginError')) $('sbLoginError').textContent = recoveryLinkError;
    }
    window.addEventListener('offline', () => {
      lock();
    });
  });
})();

window.sbCopyDeviceId = function() {
  const codeEl = document.getElementById('sbDeviceId');
  const btn = document.getElementById('sbCopyDeviceBtn');
  if (codeEl && codeEl.textContent) {
    navigator.clipboard.writeText(codeEl.textContent.trim()).then(() => {
      if (btn) {
        btn.textContent = '✓ Copied';
        setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
      }
    }).catch(() => {});
  }
};
