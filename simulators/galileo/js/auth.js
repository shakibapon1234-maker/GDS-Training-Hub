/* Central Supabase login — Username + Password (Travelport Smartpoint style). */
(() => {
  const SUPA_URL  = 'https://ygkvaaxhcbtrlcyrkuol.supabase.co';
  const SUPA_KEY  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlna3ZhYXhoY2J0cmxjeXJrdW9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk4ODcxMjMsImV4cCI6MjEwNTQ2MzEyM30.8LtCcd6fgIHqUDKYc1G8dkXBegIbCm9bF26ccO0jA3w';
  const SESSION_KEY = 'gellelio_supabase_session_v1';
  const DEVICE_KEY  = 'gellelio_training_device_id_v1';
  const HISTORY_KEY = 'gellelio-command-history-v1';

  let deviceId, session, heartbeatTimer, heartbeatFailures = 0;
  let pendingEmail = '', rememberChoice = true, passwordRecoveryMode = false;

  const $ = id => document.getElementById(id);
  const errEl = (id, txt = '') => { if ($(id)) $(id).textContent = txt; };
  const headers = token => ({ apikey: SUPA_KEY, Authorization: `Bearer ${token || SUPA_KEY}`, 'Content-Type': 'application/json' });

  /* ── Device ID ── */
  function getDeviceId() {
    let id = localStorage.getItem(DEVICE_KEY);
    if (id) return id;
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    id = 'GLT-' + Array.from(bytes, b => b.toString(16).padStart(2,'0')).join('').toUpperCase().match(/.{1,4}/g).join('-');
    localStorage.setItem(DEVICE_KEY, id);
    return id;
  }

  /* ── Session storage ── */
  function store(data, remembered) {
    session = data;
    (remembered ? localStorage : sessionStorage).setItem(SESSION_KEY, JSON.stringify(data));
  }
  function clear() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    session = null;
  }

  /* ── Edge function calls ── */
  async function fn(name, body, token) {
    const r = await fetch(`${SUPA_URL}/functions/v1/${name}`, { method:'POST', headers: headers(token), body: JSON.stringify(body) });
    const json = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(json.error || 'Service unavailable. Check your connection.');
    return json;
  }

  /* ── App type & version ── */
  function appType() {
    if (navigator.userAgent.includes('Electron')) return 'electron';
    if (/Android/i.test(navigator.userAgent))     return 'android';
    return 'web';
  }
  function appVersion() { return new URLSearchParams(location.search).get('app_version') || '0.1.14'; }
  function showAppVersion() { document.querySelectorAll('[data-app-version]').forEach(el => { el.textContent = 'v' + appVersion(); }); }
  function setPasswordFormMode(recovery) {
    passwordRecoveryMode = recovery;
    if ($('changePasswordTitle')) $('changePasswordTitle').textContent = recovery ? 'Reset password' : 'Change password';
    if ($('changePasswordHint')) $('changePasswordHint').textContent = recovery ? 'Choose a new password with at least 8 characters.' : 'Use at least 8 characters.';
    if ($('currentPasswordRow')) $('currentPasswordRow').hidden = recovery;
    if ($('currentPassword')) $('currentPassword').required = !recovery;
    if ($('changePasswordClose')) $('changePasswordClose').hidden = recovery;
  }

  /* ── UI helpers ── */
  function setLoading(isLoading, btnId) {
    const overlay = $('gltLoginLoading');
    const btn     = $(btnId || 'gltSignInBtn');
    if (overlay) overlay.hidden = !isLoading;
    if (btn) btn.disabled = isLoading;
  }
  function identity(profile) {
    if ($('userBadge'))       $('userBadge').textContent       = `${profile.username} ▾`;
    if ($('mainOfficeId'))    $('mainOfficeId').textContent    = profile.office_id;
    if ($('footerOfficeId')) $('footerOfficeId').textContent  = profile.office_id;
    if ($('accountMenuName')) $('accountMenuName').textContent = `${profile.username} / ${profile.office_id}`;
  }
  function lockForConnection(msg) {
    clearInterval(heartbeatTimer);
    clear();
    setLoading(false);
    if ($('accountMenu'))  $('accountMenu').hidden  = true;
    if ($('loginShell'))   $('loginShell').hidden   = false;
    showAuthView('signin');
    errEl('loginError', msg || 'Internet connection is required to use this training application.');
  }

  /* ── Heartbeat ── */
  function startHeartbeat() {
    clearInterval(heartbeatTimer); heartbeatFailures = 0;
    heartbeatTimer = setInterval(async () => {
      if (!session || !session.access_token) return;
      try {
        await fn('device-license', { action:'heartbeat', device_id: deviceId, app_type: appType(), app_version: appVersion() }, session.access_token);
        heartbeatFailures = 0;
      } catch (err) {
        const msg = (err && err.message) || '';
        if (msg.includes('deactivated') || msg.includes('disabled') || msg.includes('not registered') || msg.includes('no longer supported')) {
          lockForConnection(msg);
        } else if (++heartbeatFailures >= 3) {
          lockForConnection('Connection to server lost. Please check your internet connection.');
        }
      }
    }, 5 * 60 * 1000);
  }

  /* ── Verify + launch training ── */
  async function verify(active, profile, remembered) {
    const license = await fn('device-license', {
      action: 'activate', device_id: deviceId,
      device_name: navigator.userAgent.slice(0, 120), app_type: appType(), app_version: appVersion()
    }, active.access_token);
    store({ ...active, profile, verified_at: Date.now(), license }, remembered);
    startHeartbeat();
    identity(profile);
    if ($('loginShell')) $('loginShell').hidden = true;
    document.dispatchEvent(new CustomEvent('gellelio-signed-in', { detail: profile }));
  }

  showAppVersion();

  /* ── Session restore ── */
  async function refresh(old) {
    if (!old || !old.refresh_token) return old;
    try {
      const r = await fetch(`${SUPA_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST', headers: headers(), body: JSON.stringify({ refresh_token: old.refresh_token })
      });
      const json = await r.json().catch(() => ({}));
      if (!r.ok) {
        const err = new Error(json.error_description || json.error || 'Session expired');
        err.status = r.status;
        throw err;
      }
      return json;
    } catch (e) {
      if (e.status === 400 || e.status === 401 || e.status === 403) {
        throw new Error('SESSION_INVALID');
      }
      throw e;
    }
  }

  async function restoreSavedSession() {
    const persistent = localStorage.getItem(SESSION_KEY);
    const temporary  = sessionStorage.getItem(SESSION_KEY);
    const remembered = !!persistent;
    let saved;
    try { saved = JSON.parse(persistent || temporary || 'null'); } catch (_) { clear(); return false; }
    if (!saved || !saved.profile || !saved.refresh_token) { clear(); return false; }
    const active = await refresh(saved);
    await verify(active, saved.profile, remembered);
    return true;
  }

  /* ══════════════════════════════════════════════════════
     Auth view switcher
  ══════════════════════════════════════════════════════ */
  window.showAuthView = function(view) {
    const forms = ['signInForm', 'passwordForm', 'forgotPasswordForm', 'recoverUsernameForm'];
    forms.forEach(function(id) { if ($(id)) $(id).hidden = true; });
    errEl('loginError'); errEl('loginError2'); errEl('resetError');
    if ($('usernameRecoveryMessage')) {
      $('usernameRecoveryMessage').textContent = '';
      $('usernameRecoveryMessage').className = 'auth-error';
    }

    if (view === 'signin') {
      if ($('signInForm')) { $('signInForm').hidden = false; }
      if ($('authTitle'))  $('authTitle').textContent = 'Welcome';
      if ($('loginEmail')) $('loginEmail').focus();
    } else if (view === 'password') {
      if ($('passwordForm')) { $('passwordForm').hidden = false; }
      if ($('authTitle'))    $('authTitle').textContent = 'Enter Your Password';
      if ($('emailDisplay')) $('emailDisplay').textContent = pendingEmail;
      if ($('loginPassword')) { $('loginPassword').value = ''; $('loginPassword').focus(); }
    } else if (view === 'forgot') {
      if ($('forgotPasswordForm')) { $('forgotPasswordForm').hidden = false; }
      if ($('authTitle')) $('authTitle').textContent = 'Need help?';
      if ($('resetUsername')) $('resetUsername').focus();
    } else if (view === 'recover-username') {
      if ($('recoverUsernameForm')) { $('recoverUsernameForm').hidden = false; }
      if ($('authTitle')) $('authTitle').textContent = 'Recover Username';
      errEl('usernameRecoveryMessage');
      if ($('recoveryEmail')) $('recoveryEmail').focus();
    }
  };

  window.copyDeviceId      = function() { if (navigator.clipboard) navigator.clipboard.writeText(deviceId).catch(function(){}); };
  window.toggleAccountMenu = function() { if ($('accountMenu')) $('accountMenu').hidden = !$('accountMenu').hidden; };

  window.signOut = function() {
    clearInterval(heartbeatTimer);
    clear();
    try { localStorage.removeItem(HISTORY_KEY); } catch (_) {}
    document.dispatchEvent(new CustomEvent('gellelio-signed-out'));
    if ($('accountMenu'))   $('accountMenu').hidden   = true;
    if ($('loginShell'))    $('loginShell').hidden    = false;
    if ($('loginEmail'))    $('loginEmail').value     = '';
    if ($('loginPassword')) $('loginPassword').value  = '';
    pendingEmail = '';
    window.showAuthView('signin');
  };

  /* ── Change Password UI ── */
  window.showChangePassword = function() {
    if ($('accountMenu')) $('accountMenu').hidden = true;
    const modal = $('changePasswordModal');
    if (modal) {
      setPasswordFormMode(false);
      modal.hidden = false;
      errEl('changePasswordError', '');
      const current = $('currentPassword');
      const newP = $('newPassword');
      const conf = $('confirmNewPassword');
      if (current) current.value = '';
      if (newP) newP.value = '';
      if (conf) conf.value = '';
      if (current) current.focus();
    }
  };

  window.closeChangePassword = function() {
    const modal = $('changePasswordModal');
    if (modal) modal.hidden = true;
  };

  function openRecoveryFromLink() {
    const hashParams = new URLSearchParams((location.hash || '').replace(/^#/, ''));
    const queryParams = new URLSearchParams(location.search);
    const read = key => hashParams.get(key) || queryParams.get(key);
    const accessToken = read('access_token');
    if (read('type') !== 'recovery' || !accessToken) return false;
    session = {
      access_token: accessToken,
      refresh_token: read('refresh_token') || '',
      token_type: read('token_type') || 'bearer'
    };
    if (history.replaceState) history.replaceState(null, document.title, location.pathname + location.search);
    setPasswordFormMode(true);
    const modal = $('changePasswordModal');
    if (modal) modal.hidden = false;
    if ($('newPassword')) $('newPassword').focus();
    return true;
  }

  /* ══════════════════════════════════════════════════════
     DOMContentLoaded — wire up forms
  ══════════════════════════════════════════════════════ */
  window.addEventListener('DOMContentLoaded', async function() {
    deviceId = getDeviceId();
    if ($('deviceIdDisplay'))  $('deviceIdDisplay').textContent  = deviceId;
    if ($('accountDeviceId'))  $('accountDeviceId').textContent  = deviceId;

    if ($('loginShell')) $('loginShell').hidden = false;
    window.showAuthView('signin');

    // A password-recovery token takes precedence over any older saved session.
    const recoveringPassword = openRecoveryFromLink();
    if (!recoveringPassword) {
      try {
        const restored = await restoreSavedSession();
        if (!restored && $('loginEmail')) $('loginEmail').focus();
      } catch (err) {
        if (err.message === 'SESSION_INVALID' || (err.message && (err.message.includes('deactivated') || err.message.includes('disabled')))) {
          clear();
          errEl('loginError', err.message === 'SESSION_INVALID' ? 'Previous session expired. Please sign in again.' : err.message);
        } else {
          errEl('loginError', 'Could not reach license server. Check your connection.');
        }
        if ($('loginEmail')) $('loginEmail').focus();
      }
    }

    window.addEventListener('offline', function() {
      // Show warning without immediately destroying credentials
      errEl('loginError', 'You are currently offline.');
    });

    document.addEventListener('visibilitychange', async function() {
      if (document.visibilityState === 'visible' && session && session.access_token) {
        try {
          await fn('device-license', { action:'heartbeat', device_id: deviceId, app_type: appType(), app_version: appVersion() }, session.access_token);
          heartbeatFailures = 0;
        } catch (err) {
          const msg = (err && err.message) || '';
          if (msg.includes('deactivated') || msg.includes('disabled') || msg.includes('not registered') || msg.includes('no longer supported')) {
            lockForConnection(msg);
          }
        }
      }
    });

    /* ── STEP 1: Username submit → advance to password screen ── */
    const signInForm = $('signInForm');
    if (signInForm) {
      signInForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const identifier = ($('loginEmail') ? $('loginEmail').value : '').trim();
        if (!identifier) return errEl('loginError', 'Please enter your username.');
        if (identifier.includes('@')) return errEl('loginError', 'Email sign-in is not available. Enter your username.');
        errEl('loginError', '');
        pendingEmail = identifier;
        window.showAuthView('password');
      });
    }

    /* ── Edit username button ── */
    const editEmailBtn = $('editEmailBtn');
    if (editEmailBtn) {
      editEmailBtn.addEventListener('click', function() {
        window.showAuthView('signin');
        if ($('loginEmail')) $('loginEmail').value = pendingEmail;
      });
    }

    /* ── Password eye toggle ── */
    const eyeBtn = $('gltPasswordEye');
    if (eyeBtn) {
      eyeBtn.addEventListener('click', function() {
        const input = $('loginPassword');
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        eyeBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
        eyeBtn.innerHTML = isPassword
          ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>'
          : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>';
      });
    }

    /* ── STEP 2: Password submit → login via login-with-device ── */
    const passwordForm = $('passwordForm');
    if (passwordForm) {
      passwordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const password = ($('loginPassword') ? $('loginPassword').value : '');
        rememberChoice = $('rememberLogin') ? ($('rememberLogin').checked !== false) : true;
        if (!password) return errEl('loginError2', 'Please enter your password.');
        errEl('loginError2', '');
        setLoading(true, 'gltPasswordBtn');
        try {
          const login = await fn('login-with-device', {
            username:    pendingEmail,
            password:    password,
            device_id:   deviceId,
            device_name: navigator.userAgent.slice(0, 120),
            app_type:    appType()
          });
          if ($('loginPassword')) $('loginPassword').value = '';
          await verify(login.session, login.profile, rememberChoice);
        } catch (err) {
          const message = err.message || '';
          errEl('loginError2', message.includes('Device limit reached')
            ? 'Your password is correct, but this account has reached its device limit. Ask your supervisor to replace an old device, then sign in again.'
            : message);
        } finally {
          setLoading(false, 'gltPasswordBtn');
        }
      });
    }

    /* ── Change Password Form Handler ── */
    const changePasswordForm = $('changePasswordForm');
    if (changePasswordForm) {
      changePasswordForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const newPassword = ($('newPassword') ? $('newPassword').value : '').trim();
        const confirmPassword = ($('confirmNewPassword') ? $('confirmNewPassword').value : '').trim();
        errEl('changePasswordError', '');

        if (newPassword.length < 8) {
          return errEl('changePasswordError', 'New password must contain at least 8 characters.');
        }
        if (newPassword !== confirmPassword) {
          return errEl('changePasswordError', 'New passwords do not match.');
        }

        if (!session || !session.access_token) {
          return errEl('changePasswordError', 'You must be signed in to change your password.');
        }

        const submitBtn = changePasswordForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        try {
          const r = await fetch(`${SUPA_URL}/auth/v1/user`, {
            method: 'PUT',
            headers: headers(session.access_token),
            body: JSON.stringify({ password: newPassword })
          });
          const json = await r.json().catch(() => ({}));
          if (!r.ok) throw new Error(json.msg || json.error_description || json.error || 'Failed to update password.');
          const wasRecovery = passwordRecoveryMode;
          if (wasRecovery) {
            clearInterval(heartbeatTimer);
            clear();
            $('changePasswordTitle').textContent = 'Password updated';
            $('changePasswordHint').textContent = 'Your new password has been saved.';
            $('newPassword').closest('label').hidden = true;
            $('confirmNewPassword').closest('label').hidden = true;
            $('changePasswordForm').querySelector('button[type="submit"]').hidden = true;
            $('recoveryCompleteNote').hidden = false;
          } else {
            window.closeChangePassword();
            alert('Password updated successfully.');
          }
        } catch (err) {
          errEl('changePasswordError', err.message || 'Password update failed.');
        } finally {
          if (submitBtn) submitBtn.disabled = false;
        }
      });
    }

    if (recoveringPassword) return;

    /* ── Forgot password: username identifies the registered recovery email. */
    const forgotForm = $('forgotPasswordForm');
    if (forgotForm) {
      forgotForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const username = ($('resetUsername') ? $('resetUsername').value : '').trim();
        if (!username) return errEl('resetError', 'Please enter your username.');
        if (username.includes('@')) return errEl('resetError', 'Enter your username, not an email address.');
        const button = $('resetPasswordBtn');
        if (button) button.disabled = true;
        errEl('resetError', '');
        try {
          await fn('request-password-reset', { username });
          errEl('resetError', 'We cannot confirm whether a reset email was sent. If it does not arrive, contact your supervisor.');
        } catch (_) {
          errEl('resetError', 'Could not submit the reset request. Please try again later or contact your supervisor.');
        } finally {
          if (button) button.disabled = false;
        }
      });
    }

    const recoverUsernameForm = $('recoverUsernameForm');
    if (recoverUsernameForm) {
      recoverUsernameForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = ($('recoveryEmail') ? $('recoveryEmail').value : '').trim().toLowerCase();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          return errEl('usernameRecoveryMessage', 'Enter a valid email address.');
        }

        const button = $('recoverUsernameBtn');
        if (button) button.disabled = true;
        if ($('usernameRecoveryMessage')) $('usernameRecoveryMessage').className = 'auth-error';
        errEl('usernameRecoveryMessage');
        try {
          await fn('request-username-reminder', { email });
          const message = $('usernameRecoveryMessage');
          if (message) {
            message.textContent = 'If an active account uses this email, we will send the username there. Check your inbox and spam folder.';
            message.className = 'auth-success';
          }
        } catch (_) {
          errEl('usernameRecoveryMessage', 'Could not submit the request. Please try again later or contact your supervisor.');
        } finally {
          if (button) button.disabled = false;
        }
      });
    }
  });
})();
