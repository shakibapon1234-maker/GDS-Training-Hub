/*!
 * GDS Lead Modal — shared across all pages
 * Injects the modal HTML + CSS once, then wires up JS functions and
 * the WhatsApp-link click interceptor.
 */
(function () {
  'use strict';

  /* ── 1. Inject CSS ──────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.textContent = [
    '#gdsLeadModal{display:none;position:fixed;inset:0;z-index:9999;align-items:center;justify-content:center;padding:12px;background:rgba(2,6,23,0.92);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);}',
    '#gdsLeadModal.show{display:flex!important;}',
    '.gds-modal-box{width:100%;max-width:540px;max-height:92vh;display:flex;flex-direction:column;background:linear-gradient(180deg,#0a1222 0%,#050a14 100%);border:1.5px solid #1e3a5f;border-radius:20px;box-shadow:0 25px 60px -15px rgba(0,0,0,0.9),0 0 40px rgba(56,189,248,0.15);overflow:hidden;animation:leadModalPop 0.25s cubic-bezier(0.16,1,0.3,1);}',
    '@keyframes leadModalPop{0%{opacity:0;transform:scale(0.94) translateY(12px);}100%{opacity:1;transform:scale(1) translateY(0);}}',
    '.gds-modal-body{padding:14px 18px 10px;overflow-y:auto;flex:1;}',
    '.gds-input{width:100%;box-sizing:border-box;background:#040812;border:1.5px solid #1e293b;border-radius:10px;padding:9px 12px;font-size:13px;color:#f8fafc;outline:none;transition:border-color 0.15s,box-shadow 0.15s;}',
    '.gds-input:focus{border-color:#38bdf8;box-shadow:0 0 0 3px rgba(56,189,248,0.15);}',
    '.gds-card,.dev-card{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:8px 6px;border-radius:10px;border:1.5px solid #1e293b;background:#040812;cursor:pointer;text-align:center;transition:all 0.15s ease;user-select:none;}',
    '.gds-card input,.dev-card input{display:none;}',
    '#gdsModalFooter{padding:10px 18px 14px;background:rgba(4,8,18,0.95);border-top:1px solid #1e293b;}',
    '#submitLeadBtn{width:100%;background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:#ffffff;font-weight:900;font-size:14px;padding:12px 16px;border-radius:12px;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;box-shadow:0 4px 20px rgba(34,197,94,0.35);transition:all 0.15s ease;}',
    '#submitLeadBtn:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(34,197,94,0.45);}',
    '.gds-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:8px;}',
    '.gds-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;}',
    '@media(max-width:500px){.gds-grid-2{grid-template-columns:1fr;}}'
  ].join('');
  document.head.appendChild(style);

  /* ── 2. Inject Modal HTML ───────────────────────────────────────── */
  var wrapper = document.createElement('div');
  wrapper.innerHTML = '<div id="gdsLeadModal" role="dialog" aria-modal="true" aria-labelledby="leadModalTitle">' +
    '<div class="gds-modal-box">' +
      /* Header */
      '<div style="padding:14px 18px 10px;border-bottom:1px solid #1e3a5f;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(90deg,#0a192f 0%,#0f2744 100%);">' +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<div style="width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#f59e0b 0%,#d97706 100%);display:flex;align-items:center;justify-content:center;color:#050a14;font-size:16px;font-weight:900;">✈️</div>' +
          '<div>' +
            '<h3 id="leadModalTitle" style="margin:0;font-size:15px;font-weight:900;color:#ffffff;line-height:1.2;">সিমুলেটর অর্ডার ফরম</h3>' +
            '<p style="margin:2px 0 0;font-size:11px;color:#94a3b8;">সরাসরি WhatsApp-এ কথা বলে অর্ডার কনফার্ম করুন</p>' +
          '</div>' +
        '</div>' +
        '<button type="button" id="closeLeadModalBtn" aria-label="Close modal" style="background:#0f172a;border:1px solid #334155;color:#94a3b8;width:30px;height:30px;border-radius:8px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;">&times;</button>' +
      '</div>' +
      /* Body */
      '<div class="gds-modal-body">' +
        '<form id="gdsLeadForm">' +
          '<div class="gds-grid-2" style="margin-bottom:12px;">' +
            '<div>' +
              '<label for="leadFullName" style="display:block;font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:5px;"><i class="fa-solid fa-user" style="color:#38bdf8;margin-right:3px;"></i> আপনার পুরো নাম *</label>' +
              '<input type="text" id="leadFullName" class="gds-input" placeholder="যেমন: মো: কামরুল হাসান" required autocomplete="name">' +
            '</div>' +
            '<div>' +
              '<label for="leadPhoneNumber" style="display:block;font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:5px;"><i class="fa-brands fa-whatsapp" style="color:#22c55e;margin-right:3px;"></i> WhatsApp নম্বর <span style="font-size:10px;color:#475569;font-weight:400;">(ঐচ্ছিক)</span></label>' +
              '<input type="tel" id="leadPhoneNumber" class="gds-input" placeholder="+88017... / +966..." style="border-color:#14532d;font-family:monospace;">' +
            '</div>' +
          '</div>' +
          /* GDS + Device cards */
          '<div class="gds-grid-2" style="margin-bottom:12px;align-items:stretch;">' +
            /* GDS panel */
            '<div style="background:#060d1a;border:2px solid #1e3a5f;border-radius:14px;padding:12px;">' +
              '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">' +
                '<span style="font-size:11px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;gap:5px;"><i class="fa-solid fa-boxes-stacked"></i> GDS বেছে নিন</span>' +
                '<button type="button" onclick="window.selectAllGds()" style="background:none;border:none;font-size:10px;color:#fbbf24;font-weight:700;cursor:pointer;text-decoration:underline;padding:0;">৩টি একসাথে</button>' +
              '</div>' +
              '<div class="gds-grid-3" style="margin-bottom:10px;">' +
                '<label id="cardAmadeus" class="gds-card" style="border-color:#1e3a5f;background:#060d1a;opacity:0.45;filter:grayscale(60%);"><input type="checkbox" name="simChoice" value="Amadeus" onchange="window.updatePriceSummary()"><i class="fa-solid fa-terminal" style="color:#38bdf8;font-size:16px;margin-bottom:4px;"></i><span style="font-size:11px;font-weight:800;color:#7dd3fc;">Amadeus</span><span class="sim-check-status" style="font-size:9px;color:#64748b;margin-top:2px;">নির্বাচন করুন</span></label>' +
                '<label id="cardGalileo" class="gds-card" style="border-color:#1e3a5f;background:#060d1a;opacity:0.45;filter:grayscale(60%);"><input type="checkbox" name="simChoice" value="Galileo" onchange="window.updatePriceSummary()"><i class="fa-solid fa-globe" style="color:#34d399;font-size:16px;margin-bottom:4px;"></i><span style="font-size:11px;font-weight:800;color:#6ee7b7;">Galileo</span><span class="sim-check-status" style="font-size:9px;color:#64748b;margin-top:2px;">নির্বাচন করুন</span></label>' +
                '<label id="cardSabre" class="gds-card" style="border-color:#1e3a5f;background:#060d1a;opacity:0.45;filter:grayscale(60%);"><input type="checkbox" name="simChoice" value="Sabre" onchange="window.updatePriceSummary()"><i class="fa-solid fa-bolt" style="color:#fb7185;font-size:16px;margin-bottom:4px;"></i><span style="font-size:11px;font-weight:800;color:#fda4af;">Sabre</span><span class="sim-check-status" style="font-size:9px;color:#64748b;margin-top:2px;">নির্বাচন করুন</span></label>' +
              '</div>' +
              '<div style="display:flex;align-items:center;justify-content:space-between;padding-top:8px;border-top:1px solid #1e3a5f;">' +
                '<span id="selectedSimSummary" style="font-size:11px;color:#94a3b8;">পছন্দের GDS নির্বাচন করুন</span>' +
                '<span id="livePriceBadge" style="font-size:14px;font-weight:900;color:#fbbf24;">৳ ০</span>' +
              '</div>' +
            '</div>' +
            /* Device panel */
            '<div style="background:#060d1a;border:2px solid #1e3a5f;border-radius:14px;padding:12px;">' +
              '<div style="margin-bottom:10px;"><span style="font-size:11px;font-weight:800;color:#a78bfa;text-transform:uppercase;letter-spacing:1px;display:flex;align-items:center;gap:5px;"><i class="fa-solid fa-laptop-code"></i> ডিভাইস বেছে নিন</span></div>' +
              '<div class="gds-grid-2" style="margin-bottom:10px;">' +
                '<label id="cardDevicePc" class="dev-card" style="border-color:#1e3a5f;background:#060d1a;opacity:0.45;filter:grayscale(60%);"><input type="checkbox" name="deviceChoice" value="Windows PC" onchange="window.handleDeviceToggle()"><i class="fa-brands fa-windows" style="color:#60a5fa;font-size:18px;margin-bottom:4px;"></i><span style="font-size:11px;font-weight:800;color:#93c5fd;">Windows PC</span><span class="dev-check-status" style="font-size:9px;color:#64748b;margin-top:2px;">নির্বাচন করুন</span></label>' +
                '<label id="cardDeviceAndroid" class="dev-card" style="border-color:#1e3a5f;background:#060d1a;opacity:0.45;filter:grayscale(60%);"><input type="checkbox" name="deviceChoice" value="Android APK" onchange="window.handleDeviceToggle()"><i class="fa-brands fa-android" style="color:#4ade80;font-size:18px;margin-bottom:4px;"></i><span style="font-size:11px;font-weight:800;color:#86efac;">Android মোবাইল</span><span class="dev-check-status" style="font-size:9px;color:#64748b;margin-top:2px;">নির্বাচন করুন</span></label>' +
              '</div>' +
              '<div style="background:#0d1f0a;border:1px solid #166534;border-radius:8px;padding:8px 10px;text-align:center;"><p style="margin:0;font-size:11px;font-weight:700;color:#86efac;line-height:1.5;"><i class="fa-solid fa-circle-exclamation" style="color:#fbbf24;margin-right:4px;"></i>অ্যান্ড্রয়েড ও উইন্ডোজের জন্য আলাদা করে আইডি / payment কাউন্ট করা হবে।</p></div>' +
            '</div>' +
          '</div>' +
          /* Note */
          '<div style="margin-bottom:4px;">' +
            '<label style="display:block;font-size:11px;font-weight:700;color:#94a3b8;margin-bottom:5px;"><i class="fa-solid fa-comment-dots" style="color:#a78bfa;margin-right:3px;"></i> কোনো প্রশ্ন বা মন্তব্য <span style="font-weight:400;color:#475569;">(ঐচ্ছিক)</span></label>' +
            '<input type="text" id="leadNoteField" class="gds-input" placeholder="যেমন: বিস্তারিত জানতে চাই">' +
          '</div>' +
        '</form>' +
      '</div>' +
      /* Footer */
      '<div id="gdsModalFooter">' +
        '<div style="background:#0d1a08;border:1px solid #15803d;border-radius:10px;padding:8px 12px;margin-bottom:10px;">' +
          '<p style="margin:0;font-size:11px;color:#86efac;line-height:1.5;"><i class="fa-solid fa-credit-card" style="color:#fbbf24;margin-right:5px;"></i><strong>পেমেন্ট মাধ্যম:</strong> বিকাশ / নগদ: <strong style="color:#f9a8d4;">01674091748</strong> &nbsp;|&nbsp; BRAC Bank A/C: <strong style="color:#93c5fd;font-family:monospace;">1058494150001</strong> (Shakib Ibna Mustafa, Bonosree Branch)</p>' +
        '</div>' +
        '<button type="submit" form="gdsLeadForm" id="submitLeadBtn" onclick="window.handleLeadSubmit(event)">' +
          '<i class="fa-brands fa-whatsapp" style="font-size:20px;"></i> জমা দিন ও WhatsApp-এ মেসেজ দিন 📲' +
        '</button>' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-top:7px;padding:0 2px;">' +
          '<span style="font-size:10px;color:#475569;">ফর্ম না দিয়ে সরাসরি চ্যাট করতে:</span>' +
          '<a id="directWaBypassLink" href="https://wa.me/8801674091748" target="_blank" rel="noopener" style="font-size:10px;color:#fbbf24;text-decoration:underline;">সরাসরি WhatsApp →</a>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>';
  document.body.appendChild(wrapper.firstElementChild);

  /* ── 3. JS Engine ───────────────────────────────────────────────── */
  var MODAL_ID = 'gdsLeadModal';
  var STORAGE_KEY = 'gds_leads_v1';
  window.GDS_GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycby3G_zjritnMYFzWvNwUTN2P4X3Sjkywf5Yy389EJ8Q4Pmb2D64Qosm3a3VAlCUQLRT/exec';

  function getLeads() {
    try { var r = localStorage.getItem(STORAGE_KEY); return r ? JSON.parse(r) : []; } catch(e) { return []; }
  }
  function saveLead(item) {
    try { var l = getLeads(); l.unshift(item); localStorage.setItem(STORAGE_KEY, JSON.stringify(l)); } catch(e) {}
  }

  window.handleDeviceToggle = function () {
    window.updateDeviceStyles();
    window.updatePriceSummary();
  };

  window.updatePriceSummary = function () {
    var checkedSims = Array.from(document.querySelectorAll('input[name="simChoice"]:checked')).map(function (c) { return c.value; });
    var checkedDevs = Array.from(document.querySelectorAll('input[name="deviceChoice"]:checked')).map(function (c) { return c.value; });
    var summaryEl = document.getElementById('selectedSimSummary');
    var priceEl = document.getElementById('livePriceBadge');
    var gdsThemes = {
      'Amadeus': { border: '#0ea5e9', bg: '#001929', text: '#38bdf8' },
      'Galileo': { border: '#10b981', bg: '#001a0d', text: '#34d399' },
      'Sabre':   { border: '#f43f5e', bg: '#1a0010', text: '#fb7185' }
    };
    ['Amadeus', 'Galileo', 'Sabre'].forEach(function (sim) {
      var inp = document.querySelector('input[name="simChoice"][value="' + sim + '"]');
      var card = document.getElementById('card' + sim);
      if (!inp || !card) return;
      var statusEl = card.querySelector('.sim-check-status');
      var t = gdsThemes[sim];
      if (inp.checked) {
        card.style.opacity = '1'; card.style.filter = 'none'; card.style.borderColor = t.border; card.style.background = t.bg;
        if (statusEl) { statusEl.textContent = '✔ নির্বাচিত'; statusEl.style.color = t.text; }
      } else {
        card.style.opacity = '0.5'; card.style.filter = 'grayscale(50%)'; card.style.borderColor = '#1e3a5f'; card.style.background = '#060d1a';
        if (statusEl) { statusEl.textContent = 'নির্বাচন করুন'; statusEl.style.color = '#64748b'; }
      }
    });
    var basePrice = 0, summaryText = '';
    if (checkedSims.length === 3)      { basePrice = 5000; summaryText = '৩টি কমপ্লিট বান্ডেল'; }
    else if (checkedSims.length === 2) { basePrice = 3500; summaryText = checkedSims.join(' + '); }
    else if (checkedSims.length === 1) { basePrice = 2000; summaryText = checkedSims[0]; }
    else                               { basePrice = 0;    summaryText = 'পছন্দের GDS বেছে নিন'; }
    var devMul = checkedDevs.length > 0 ? checkedDevs.length : 1;
    var finalPrice = basePrice * devMul;
    if (summaryEl) summaryEl.textContent = summaryText;
    if (priceEl) {
      if (basePrice === 0) {
        priceEl.textContent = '৳ ০';
      } else if (checkedDevs.length === 0) {
        var bnBase = basePrice === 5000 ? '৫,০০০' : (basePrice === 3500 ? '৩,৫০০' : '২,০০০');
        priceEl.textContent = '৳ ' + bnBase + ' (ডিভাইস নির্বাচন করুন)';
      } else if (checkedDevs.length === 2) {
        var bnNum2 = finalPrice === 10000 ? '১০,০০০' : (finalPrice === 7000 ? '৭,০০০' : '৪,০০০');
        priceEl.textContent = '৳ ' + bnNum2 + ' (২টি ডিভাইসের আলাদা আইডি)';
      } else {
        var bnNum1 = finalPrice === 5000 ? '৫,০০০' : (finalPrice === 3500 ? '৩,৫০০' : '২,০০০');
        priceEl.textContent = '৳ ' + bnNum1;
      }
    }
  };

  window.updateDeviceStyles = function () {
    var devThemes = {
      'Windows PC':  { id: 'cardDevicePc',      border: '#3b82f6', bg: '#00163a', text: '#60a5fa' },
      'Android APK': { id: 'cardDeviceAndroid',  border: '#22c55e', bg: '#00200d', text: '#4ade80' }
    };
    for (var dev in devThemes) {
      var inp = document.querySelector('input[name="deviceChoice"][value="' + dev + '"]');
      var t = devThemes[dev];
      var card = document.getElementById(t.id);
      if (!inp || !card) continue;
      var statusEl = card.querySelector('.dev-check-status');
      if (inp.checked) {
        card.style.opacity = '1'; card.style.filter = 'none'; card.style.borderColor = t.border; card.style.background = t.bg;
        if (statusEl) { statusEl.textContent = '✔ নির্বাচিত'; statusEl.style.color = t.text; }
      } else {
        card.style.opacity = '0.5'; card.style.filter = 'grayscale(50%)'; card.style.borderColor = '#1e3a5f'; card.style.background = '#060d1a';
        if (statusEl) { statusEl.textContent = 'নির্বাচন করুন'; statusEl.style.color = '#64748b'; }
      }
    }
  };

  window.selectAllGds = function () {
    document.querySelectorAll('input[name="simChoice"]').forEach(function (c) { c.checked = true; });
    window.updatePriceSummary();
  };

  window.openGdsLeadModal = function (presetPkg, fallbackUrl) {
    var modal = document.getElementById(MODAL_ID);
    if (!modal) return;
    var cA = document.querySelector('input[name="simChoice"][value="Amadeus"]');
    var cG = document.querySelector('input[name="simChoice"][value="Galileo"]');
    var cS = document.querySelector('input[name="simChoice"][value="Sabre"]');
    if (presetPkg === 'bundle3') {
      if (cA) cA.checked = true; if (cG) cG.checked = true; if (cS) cS.checked = true;
    } else {
      if (cA) cA.checked = false; if (cG) cG.checked = false; if (cS) cS.checked = false;
    }
    var cPc  = document.querySelector('input[name="deviceChoice"][value="Windows PC"]');
    var cAnd = document.querySelector('input[name="deviceChoice"][value="Android APK"]');
    if (cPc) cPc.checked = false; if (cAnd) cAnd.checked = false;
    window.updateDeviceStyles();
    window.updatePriceSummary();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(function () { var n = document.getElementById('leadFullName'); if (n) n.focus(); }, 80);
  };

  window.closeGdsLeadModal = function () {
    var modal = document.getElementById(MODAL_ID);
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
  };

  window.handleLeadSubmit = function (e) {
    e.preventDefault();
    var name  = (document.getElementById('leadFullName').value  || '').trim();
    var phone = (document.getElementById('leadPhoneNumber').value || '').trim();
    var note  = (document.getElementById('leadNoteField').value  || '').trim();
    var checkedSims = Array.from(document.querySelectorAll('input[name="simChoice"]:checked')).map(function (c) { return c.value; });
    var checkedDevs = Array.from(document.querySelectorAll('input[name="deviceChoice"]:checked')).map(function (c) { return c.value; });
    if (!name) { alert('অনুগ্রহ করে আপনার পুরো নাম লিখুন।'); return; }
    if (checkedSims.length === 0) { alert('অনুগ্রহ করে অন্তত ১টি GDS নির্বাচন করুন।'); return; }
    if (checkedDevs.length === 0) { alert('অনুগ্রহ করে অন্তত ১টি ডিভাইস (PC বা Android) নির্বাচন করুন।'); return; }
    var simText = checkedSims.join(', ');
    var devText = checkedDevs.join(', ');
    var devMul  = checkedDevs.length;
    var baseP   = checkedSims.length === 3 ? 5000 : (checkedSims.length === 2 ? 3500 : 2000);
    var totalP  = baseP * devMul;
    var formattedPrice = 'BDT ' + totalP.toLocaleString('en-US');
    var btn = document.getElementById('submitLeadBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> প্রসেসিং হচ্ছে...'; }
    var params = new URLSearchParams(window.location.search);
    var pageName = document.title || window.location.pathname;
    var leadData = {
      timestamp: new Date().toISOString(),
      name: name, phone: phone || 'Not provided',
      package: simText, device: devText, price: formattedPrice,
      note: note, page: pageName,
      source: params.get('src') || params.get('utm_source') || 'direct'
    };
    saveLead(leadData);
    if (window.GDS_GOOGLE_SHEET_URL) {
      try {
        fetch(window.GDS_GOOGLE_SHEET_URL, {
          method: 'POST', mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(leadData)
        }).catch(function () {});
      } catch (err) {}
    }
    var waLines = [
      'হ্যালো, আমি GDS Training Hub থেকে অর্ডার করতে চাই।',
      '👤 নাম: ' + name,
      (phone ? '📞 ফোন/WhatsApp: ' + phone : ''),
      '📦 প্যাকেজ: ' + simText,
      '💻 ডিভাইস: ' + devText,
      '💰 মূল্য: ' + formattedPrice,
      (note ? '💬 নোট: ' + note : ''),
      '',
      '(Source: ' + pageName + ')'
    ].filter(Boolean).join('\n');
    var targetWaUrl = 'https://wa.me/8801674091748?text=' + encodeURIComponent(waLines);
    window.closeGdsLeadModal();
    setTimeout(function () { window.open(targetWaUrl, '_blank'); }, 120);
  };

  /* ── 4. WhatsApp link click interceptor ────────────────────────── */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a || !a.href) return;
    if (a.id === 'directWaBypassLink') return;
    if (!/wa\.me|whatsapp\.com|api\.whatsapp/i.test(a.href)) return;
    e.preventDefault();
    e.stopPropagation();
    var hrefTxt = decodeURIComponent(a.href || '');
    var preset = '';
    if (/Complete\s*Bundle|3\s*GDS|5000/i.test(hrefTxt))  preset = 'bundle3';
    else if (/2\s*GDS|3500/i.test(hrefTxt))                preset = 'duo2';
    else if (/1\s*GDS|2000/i.test(hrefTxt))                preset = 'single1';
    window.openGdsLeadModal(preset, a.href);
  }, true);

  /* ── 5. Close button, backdrop click, Escape ───────────────────── */
  document.addEventListener('click', function (e) {
    var modal = document.getElementById(MODAL_ID);
    if (modal && modal.style.display === 'flex' && e.target === modal) window.closeGdsLeadModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') window.closeGdsLeadModal();
  });
  function wireClose() {
    var btn = document.getElementById('closeLeadModalBtn');
    if (btn) btn.onclick = window.closeGdsLeadModal;
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', wireClose); } else { wireClose(); }

})();
