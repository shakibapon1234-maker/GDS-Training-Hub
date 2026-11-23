/* Central Supabase login and one-device license gate. Service-role keys never belong here. */
(() => {
  const URL = 'https://snqezkptksrtndktmwzq.supabase.co';
  const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNucWV6a3B0a3NydG5ka3Rtd3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NzMxODQsImV4cCI6MjEwNTE0OTE4NH0.Y5ogzDtyuJimwn9KDnaacRtRSG_R2qcpasd8nMzJq4E';
  const SESSION_KEY = 'amaduce_supabase_session_v1', DEVICE_KEY = 'amaduce_training_device_id_v1';
  let deviceId, session, heartbeatTimer, heartbeatFailures = 0, recoveryToken = null, recoveryMode = false;
  const $ = id => document.getElementById(id);
  const error = (id, text = '') => $(id).textContent = text;
  function resetLoginView() {
    const panel = document.querySelector('.login-form-panel');
    panel?.scrollTo(0, 0);
    // Do not autofocus here. Chromium may scroll an overflow panel to reveal
    // a focused field, which can hide the sign-in heading in Electron.
    window.setTimeout(() => panel?.scrollTo(0, 0), 0);
    window.setTimeout(() => panel?.scrollTo(0, 0), 250);
  }
  function setLoginLoading(isLoading) {
    const overlay = $('loginLoading'), submit = $('loginSubmit');
    if (overlay) overlay.hidden = !isLoading;
    if (submit) { submit.disabled = isLoading; submit.textContent = isLoading ? 'Signing in…' : 'Sign in'; }
  }
  const headers = token => ({ apikey: KEY, Authorization: `Bearer ${token || KEY}`, 'Content-Type': 'application/json' });
  function getDeviceId() { let id = localStorage.getItem(DEVICE_KEY); if (id) return id; const bytes = new Uint8Array(16); crypto.getRandomValues(bytes); id = 'AMT-' + Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('').toUpperCase().match(/.{1,4}/g).join('-'); localStorage.setItem(DEVICE_KEY, id); return id; }
  function store(data, remembered) { session = data; (remembered ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(data)); }
  function clear() { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY); session = null; }
  function identity(profile) { $('userBadge').textContent = `${profile.username} ▾`; $('mainOfficeId').textContent = profile.office_id; $('footerOfficeId').textContent = profile.office_id; $('accountMenuName').textContent = `${profile.username} · ${profile.office_id}`; }
  async function fn(name, body, token) { const r = await fetch(`${URL}/functions/v1/${name}`, { method:'POST', headers:headers(token), body:JSON.stringify(body) }); const json = await r.json().catch(() => ({})); if (!r.ok) throw new Error(json.error || 'Security service is unavailable.'); return json; }
  function appType() { if (window.electronAPI || navigator.userAgent.includes('Electron')) return 'electron'; if (/Android/i.test(navigator.userAgent) || window.AndroidBridge) return 'android'; return 'web'; }
  function lockForConnection(msg) { clearInterval(heartbeatTimer); clear(); $('accountMenu').hidden = true; $('loginShell').hidden = false; showAuthView('signin'); error('loginError', msg || 'Internet connection is required to use this training application.'); }
  function startHeartbeat() {
    clearInterval(heartbeatTimer); heartbeatFailures = 0;
    heartbeatTimer = setInterval(async () => {
      if (!session?.access_token) return;
      try {
        await fn('device-license', { action:'heartbeat', device_id:deviceId, app_type:appType() }, session.access_token);
        heartbeatFailures = 0;
      } catch (err) {
        // Check if this is a revoke/account-disabled message vs a network failure
        const msg = err?.message || '';
        if (msg.includes('deactivated') || msg.includes('disabled') || msg.includes('not registered')) {
          lockForConnection(msg); // Immediate lock with specific reason
        } else if (++heartbeatFailures >= 2) {
          lockForConnection();
        }
      }
    }, 5 * 60 * 1000);
  }
  async function verify(active, profile, remembered) { const license = await fn('device-license', { action:'activate', device_id:deviceId, device_name:navigator.userAgent.slice(0,120), app_type:appType() }, active.access_token); store({ ...active, profile, verified_at:Date.now(), license }, remembered); startHeartbeat(); identity(profile); $('loginShell').hidden = true; }
  async function refresh(old) { if (!old?.refresh_token) return old; const r = await fetch(`${URL}/auth/v1/token?grant_type=refresh_token`, { method:'POST', headers:headers(), body:JSON.stringify({ refresh_token:old.refresh_token }) }); if (!r.ok) throw new Error('Session expired'); return r.json(); }
  async function restoreSavedSession() {
    const persistent = localStorage.getItem(SESSION_KEY);
    const temporary = sessionStorage.getItem(SESSION_KEY);
    const remembered = !!persistent;
    let saved;
    try { saved = JSON.parse(persistent || temporary || 'null'); } catch (_) { clear(); return false; }
    if (!saved?.refresh_token || !saved?.profile) { clear(); return false; }
    // A stored token is never trusted by itself: refresh it and re-check the
    // one-device license with the server before unlocking the application.
    const active = await refresh(saved);
    await verify(active, saved.profile, remembered);
    return true;
  }
  window.showAuthView = view => {
    const signIn = view === 'signin';
    $('signInForm').hidden = !signIn;
    $('forgotPasswordForm').hidden = signIn || view === 'username';
    $('forgotUsernameForm').hidden = view !== 'username';
    $('resetUsername').closest('label').hidden = recoveryMode || view !== 'forgot';
    $('newPasswordFields').hidden = !recoveryMode;
    const button = $('forgotPasswordForm').querySelector('button[type="submit"]');
    if (button) button.textContent = recoveryMode ? 'Update password' : 'Send reset link';
    $('authTitle').textContent = signIn ? 'Sign in' : view === 'username' ? 'Forgot username?' : recoveryMode ? 'Choose a new password' : 'Reset password';
    error('loginError'); error('resetError'); error('usernameRecoveryError');
  };
  window.copyDeviceId = () => { navigator.clipboard?.writeText(deviceId).catch(() => {}); };
  window.toggleAccountMenu = () => $('accountMenu').hidden = !$('accountMenu').hidden;
  window.showChangePassword = () => { $('accountMenu').hidden = true; $('changePasswordModal').hidden = false; $('currentPassword').focus(); };
  window.closeChangePassword = () => { $('changePasswordModal').hidden = true; $('changePasswordForm').reset(); error('changePasswordError'); };
  window.signOut = () => {
    clearInterval(heartbeatTimer);
    clear();
    try {
      localStorage.removeItem('amaduce_savedPnrs');
      localStorage.removeItem('pnr');
      localStorage.removeItem('pnrHistory');
      localStorage.removeItem('amaduce_history');
      sessionStorage.clear();
    } catch (_) {}
    if (typeof resetSimulator === 'function') {
      try { resetSimulator(); } catch (_) {}
    }
    $('accountMenu').hidden = true;
    $('loginPassword').value = '';
    $('loginShell').hidden = false;
    showAuthView('signin');
    resetLoginView();
  };
  window.addEventListener('DOMContentLoaded', async () => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    deviceId = getDeviceId(); $('deviceIdDisplay').textContent = deviceId; $('accountDeviceId').textContent = deviceId;
    $('loginUsername').value = '';
    $('loginPassword').value = '';
    $('loginShell').hidden = false;
    showAuthView('signin');
    const hash = new URLSearchParams(location.hash.slice(1));
    const recoveryCallback = hash.get('type') === 'recovery' && !!hash.get('access_token');
    if (recoveryCallback) {
      clear();
      recoveryToken = hash.get('access_token'); recoveryMode = true;
      history.replaceState(null, '', location.pathname + location.search);
      showAuthView('forgot');
      error('resetError', 'Enter a new password to finish resetting your account.');
      $('recoveryPassword').focus();
    } else if (hash.get('error')) {
      history.replaceState(null, '', location.pathname + location.search);
      error('loginError', 'This password reset link is invalid or expired. Request a new link.');
    }
    try {
      const restored = recoveryCallback ? false : await restoreSavedSession();
      if (!restored) resetLoginView();
    } catch (_) {
      clear();
      error('loginError', 'Saved session expired. Please sign in again.');
      resetLoginView();
    }
    window.addEventListener('load', resetLoginView, { once: true });
    window.addEventListener('offline', () => lockForConnection());
    // Re-verify when user switches back to this tab (tab-visibility check)
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible' && session?.access_token) {
        try { await fn('device-license', { action:'heartbeat', device_id:deviceId, app_type:appType() }, session.access_token); heartbeatFailures = 0; }
        catch (err) { const msg = err?.message || ''; if (msg.includes('deactivated') || msg.includes('disabled') || msg.includes('not registered')) { lockForConnection(msg); } }
      }
    });
    document.querySelectorAll('[data-password-toggle]').forEach(b => b.addEventListener('click', () => { const input = $(b.dataset.passwordToggle); input.type = input.type === 'password' ? 'text' : 'password'; }));
    $('signInForm').addEventListener('submit', async e => { e.preventDefault(); const username = $('loginUsername').value.trim().toUpperCase(), password = $('loginPassword').value, remembered = $('rememberLogin').checked; if (!username || !password) return error('loginError','Please enter your username and password.'); setLoginLoading(true); try { const login = await fn('login-with-device', { username, password, device_id:deviceId, device_name:navigator.userAgent.slice(0,120), app_type:appType() }); await verify(login.session, login.profile, remembered); $('loginPassword').value = ''; } catch (e) { error('loginError',e.message); } finally { setLoginLoading(false); } });
    $('forgotPasswordForm').addEventListener('submit', async e => {
      e.preventDefault();
      if (recoveryMode) {
        const password = $('recoveryPassword').value;
        if (password.length < 8) return error('resetError', 'Use at least 8 characters.');
        if (password !== $('recoveryPasswordConfirm').value) return error('resetError', 'The passwords do not match.');
        try {
          const r = await fetch(`${URL}/auth/v1/user`, { method:'PUT', headers:headers(recoveryToken), body:JSON.stringify({password}) });
          if (!r.ok) {
            const failure = await r.json().catch(() => ({}));
            const code = String(failure.code || failure.error_code || '').toLowerCase();
            if (code === 'same_password') throw new Error('Choose a new password that is different from your current password.');
            if ([401, 403].includes(r.status) || ['otp_expired', 'invalid_token', 'bad_jwt', 'session_not_found'].includes(code)) {
              throw new Error('This reset link is invalid or expired. Request a new link.');
            }
            if (r.status === 422) throw new Error('Password could not be changed. Check the password requirements and choose a different password.');
            throw new Error('Password could not be updated. Please try again.');
          }
          recoveryToken = null; recoveryMode = false; $('recoveryPassword').value = ''; $('recoveryPasswordConfirm').value = '';
          showAuthView('signin'); error('loginError', 'Password updated. Return to the Amaduce app and sign in with your new password.');
        } catch (err) { error('resetError', err.message || 'Password could not be updated.'); }
        return;
      }
      const username = $('resetUsername').value.trim().toUpperCase();
      if (!/^[A-Z0-9._-]{3,40}$/.test(username)) return error('resetError', 'Enter a valid username.');
      error('resetError', '');
      try { await fn('request-password-reset', { username }); showAuthView('signin'); error('loginError','If the account exists, a reset link has been sent.'); }
      catch (_) { showAuthView('signin'); error('loginError','If the account exists, a reset link has been sent.'); }
    });
    $('forgotUsernameForm').addEventListener('submit', async e => {
      e.preventDefault();
      const emailInput = $('usernameRecoveryEmail');
      emailInput.value = emailInput.value.trim();
      if (!emailInput.checkValidity()) return error('usernameRecoveryError', 'Enter a valid email address.');
      error('usernameRecoveryError', '');
      try { await fn('request-username-reminder', { email:$('usernameRecoveryEmail').value.trim().toLowerCase() }); }
      catch (_) { /* Keep the response identical to prevent account discovery. */ }
      showAuthView('signin'); error('loginError', 'If the verified email matches an active account, the username has been sent.');
    });
    $('changePasswordForm').addEventListener('submit', async e => { e.preventDefault(); const current = $('currentPassword').value, password = $('newPassword').value, confirm = $('confirmNewPassword').value; if (!session?.access_token) return error('changePasswordError','Please sign in again.'); if (!current || password.length < 8) return error('changePasswordError','Use your current password and a new password of at least 8 characters.'); if (password !== confirm) return error('changePasswordError','The new passwords do not match.'); try { const check = await fn('login-with-device', { username:session.profile.username, password:current, device_id:deviceId, device_name:navigator.userAgent.slice(0,120), app_type:appType() }); const r = await fetch(`${URL}/auth/v1/user`, { method:'PUT', headers:headers(check.session.access_token), body:JSON.stringify({password}) }); if (!r.ok) throw new Error('Password could not be updated.'); session.access_token = check.session.access_token; session.refresh_token = check.session.refresh_token; store(session, !!localStorage.getItem(SESSION_KEY)); closeChangePassword(); if (typeof showToast === 'function') showToast('Password updated successfully.'); } catch (e) { error('changePasswordError',e.message); } });
  });
})();
