/**
 * GDS Training Hub — Terminal UI Controller
 * Manages Tab switching, terminal outputs, quick-chips, interactive prompts, and modals
 */

(function () {
  'use strict';

  let currentGds = 'amadeus'; // 'amadeus' | 'galileo' | 'sabre'
  const history = {
    amadeus: [],
    galileo: [],
    sabre: []
  };
  const historyIndex = {
    amadeus: -1,
    galileo: -1,
    sabre: -1
  };

  const GDS_CONFIG = {
    amadeus: {
      name: 'Amadeus Selling Platform Connect',
      shortName: 'Amadeus',
      pcc: 'DAC1A0980 / 0001AA',
      badgeClass: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
      terminalTheme: 'text-sky-300',
      welcome: [
        '*** AMADEUS SELLING PLATFORM CONNECT — TRAINING SIMULATOR ***',
        'OFFICE ID: DAC1A0980    AGENT: 0001AA/SU    SIGN-IN: OK',
        'STATUS: [DEMO MODE - FLIGHT AVAILABILITY SEARCH ONLY]',
        '-------------------------------------------------------------------',
        'ফ্লাইট সার্চ করতে টাইপ করুন (যেমন: AN 15OCT DACDXB) অথবা নিচের বাটনে চাপুন:'
      ],
      defaultCmd: 'AN 15OCT DACDXB',
      chips: [
        { label: 'ঢাকা টু দুবাই (সব ফ্লাইট)', cmd: 'AN 15OCT DACDXB' },
        { label: 'এমিরেটস দিয়ে ঢাকা - জেদ্দা', cmd: 'AN 20NOV DACJED/AEK' },
        { label: 'সৌদিয়া দিয়ে ঢাকা - লন্ডন', cmd: 'AN 10DEC DACLHR/ASV' },
        { label: 'সিঙ্গাপুর সরাসরি ও ট্রানজিট', cmd: 'AN 05JAN DACSIN' },
        { label: 'সিট বুকিং ট্রাই করুন (লক টেস্ট)', cmd: 'SS 1 Y 1' }
      ],
      guide: {
        commandBreakdown: [
          { token: 'AN', desc: 'Availability Neutral (ফ্লাইট খোঁজার মূল কমান্ড)' },
          { token: '15OCT', desc: 'ভ্রমণের তারিখ (১৫ই অক্টোবর)' },
          { token: 'DACDXB', desc: 'যাত্রার রুট (ঢাকা DAC থেকে দুবাই DXB)' },
          { token: '/AEK', desc: 'নির্দিষ্ট এয়ারলাইন ফিল্টার (/A + এয়ারলাইন কোড EK = Emirates)' }
        ],
        tips: 'Amadeus-এ AN কমান্ড দিয়ে সার্চ করলে এয়ারলাইন্স, ডিপার্চার টাইম এবং সিট ক্লাস (যেমন J4 C4 Y9) রিয়েল-টাইমে দেখা যায়।'
      }
    },
    galileo: {
      name: 'Travelport Galileo (Smartpoint / Focalpoint)',
      shortName: 'Galileo',
      pcc: 'HA89MD / DACVS086JJ',
      badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      terminalTheme: 'text-emerald-300',
      welcome: [
        '*** TRAVELPORT GALILEO / SMARTPOINT — TRAINING SIMULATOR ***',
        'PCC: HA89MD    SIGN-ON: SON/ZHA    WORK AREA: A (ACTIVE)',
        'STATUS: [DEMO MODE - FLIGHT AVAILABILITY SEARCH ONLY]',
        '-------------------------------------------------------------------',
        'ফ্লাইট সার্চ করতে টাইপ করুন (যেমন: A15OCTDACDXB) অথবা নিচের বাটনে চাপুন:'
      ],
      defaultCmd: 'A15OCTDACDXB',
      chips: [
        { label: 'ঢাকা টু দুবাই (সব ফ্লাইট)', cmd: 'A15OCTDACDXB' },
        { label: 'এমিরেটস দিয়ে ঢাকা - জেদ্দা', cmd: 'A20NOVDACJED*EK' },
        { label: 'সৌদিয়া দিয়ে ঢাকা - লন্ডন', cmd: 'A10DECDACLHR*SV' },
        { label: 'সিঙ্গাপুর এয়ারলাইন্স', cmd: 'A05JANDACSIN*SQ' },
        { label: 'সিট বিক্রি ট্রাই করুন (লক টেস্ট)', cmd: 'N1Y1' }
      ],
      guide: {
        commandBreakdown: [
          { token: 'A', desc: 'Availability (ফ্লাইট সার্চের জন্য গ্যালিলিওর কমান্ড)' },
          { token: '15OCT', desc: 'ভ্রমণের তারিখ (১৫ই অক্টোবর)' },
          { token: 'DACDXB', desc: 'ঢাকা DAC থেকে দুবাই DXB' },
          { token: '*EK', desc: 'নির্দিষ্ট এয়ারলাইন সিলেক্টর (* + এয়ারলাইন কোড EK = Emirates)' }
        ],
        tips: 'Galileo-তে স্পেস ছাড়া সব একসাথে লিখতে হয় (যেমন A15OCTDACDXB*EK)। ক্লাস লেটারগুলোর পাশে কত সিট বাকি আছে তা দেখায়।'
      }
    },
    sabre: {
      name: 'Sabre Red 360 Workspace',
      shortName: 'Sabre',
      pcc: '14KT / 9999 / SU',
      badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
      terminalTheme: 'text-rose-200',
      welcome: [
        '*** SABRE RED 360 WORKSPACE — TRAINING SIMULATOR ***',
        'PCC: 14KT    AGENT: 9999/SU    STATUS: SIGNED IN TO WORK AREA A',
        'STATUS: [DEMO MODE - FLIGHT AVAILABILITY SEARCH ONLY]',
        '-------------------------------------------------------------------',
        'ফ্লাইট সার্চ করতে টাইপ করুন (যেমন: 115OCTDACDXB) অথবা নিচের বাটনে চাপুন:'
      ],
      defaultCmd: '115OCTDACDXB',
      chips: [
        { label: 'ঢাকা টু দুবাই (সব ফ্লাইট)', cmd: '115OCTDACDXB' },
        { label: 'এমিরেটস দিয়ে ঢাকা - জেদ্দা', cmd: '120NOVDACJED‡EK' },
        { label: 'সৌদিয়া দিয়ে ঢাকা - লন্ডন', cmd: '110DECDACLHR‡SV' },
        { label: 'সিঙ্গাপুর এয়ারলাইন্স', cmd: '105JANDACSIN‡SQ' },
        { label: 'সিট বিক্রি ট্রাই করুন (লক টেস্ট)', cmd: '01Y1' }
      ],
      guide: {
        commandBreakdown: [
          { token: '1', desc: 'Availability Indicator (Sabre-এ ১ দিয়ে ফ্লাইট সার্চ শুরু হয়)' },
          { token: '15OCT', desc: 'ভ্রমণের তারিখ (১৫ই অক্টোবর)' },
          { token: 'DACDXB', desc: 'ঢাকা DAC থেকে দুবাই DXB' },
          { token: '‡EK', desc: 'ক্রস অব লোরেন / স্লেশ ক্যারিয়ার কোড (‡ বা / + এয়ারলাইন EK)' }
        ],
        tips: 'Sabre-এ "1" হলো ফ্লাইট খোঁজার ইউনিভার্সাল কোড। কীবোর্ডের বিশেষ চিহ্ন ‡ (বা /) দিয়ে নির্দিষ্ট এয়ারলাইন্সের ফ্লাইট সরাসরি ফিল্টার করা যায়।'
      }
    }
  };

  // Helper to escape HTML
  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Switch Active GDS Tab
  window.switchGdsDemoTab = function (gdsKey) {
    if (!GDS_CONFIG[gdsKey]) return;
    currentGds = gdsKey;

    // Update active tab buttons
    document.querySelectorAll('.gds-demo-tab-btn').forEach(btn => {
      const target = btn.getAttribute('data-gds');
      if (target === gdsKey) {
        btn.classList.add('active', 'border-amber-400', 'bg-amber-400/10', 'text-amber-300');
        btn.classList.remove('text-slate-400', 'border-transparent');
      } else {
        btn.classList.remove('active', 'border-amber-400', 'bg-amber-400/10', 'text-amber-300');
        btn.classList.add('text-slate-400', 'border-transparent');
      }
    });

    const cfg = GDS_CONFIG[gdsKey];

    // Update terminal header
    const pccEl = document.getElementById('demoTerminalPcc');
    if (pccEl) pccEl.textContent = cfg.pcc;

    const gdsTitleEl = document.getElementById('demoTerminalTitle');
    if (gdsTitleEl) gdsTitleEl.textContent = cfg.name;

    // Update chips
    renderChips();

    // Update command guide
    renderGuide();

    // Reset terminal content to welcome + execute default sample command
    resetTerminal();
    executeDemoCommand(cfg.defaultCmd);
  };

  function renderChips() {
    const container = document.getElementById('demoChipsContainer');
    if (!container) return;
    const cfg = GDS_CONFIG[currentGds];

    container.innerHTML = cfg.chips.map(chip => `
      <button
        type="button"
        onclick="window.runDemoChip('${escapeHtml(chip.cmd)}')"
        class="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/40 transition flex items-center gap-1.5 shadow-sm group text-left"
        title="ক্লিক করলেই কমান্ড টার্মিনালে রান হবে"
      >
        <span class="text-amber-400 group-hover:scale-110 transition-transform">▸</span>
        <span class="font-bold text-amber-300/90">${escapeHtml(chip.cmd)}</span>
        <span class="text-slate-400 text-[11px] hidden sm:inline">(${escapeHtml(chip.label)})</span>
      </button>
    `).join('');
  }

  function renderGuide() {
    const container = document.getElementById('demoGuideContainer');
    if (!container) return;
    const cfg = GDS_CONFIG[currentGds];

    const tokensHtml = cfg.guide.commandBreakdown.map(item => `
      <div class="flex items-start gap-2 text-xs">
        <code class="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono font-bold whitespace-nowrap">
          ${escapeHtml(item.token)}
        </code>
        <span class="text-slate-300 leading-snug">${escapeHtml(item.desc)}</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left space-y-3">
        <div class="flex items-center justify-between border-b border-slate-800 pb-2">
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-circle-question text-amber-400 text-sm"></i>
            <h4 class="text-sm font-bold text-white">${escapeHtml(cfg.shortName)} কমান্ড কীভাবে কাজ করে?</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
            Syntax Breakdown
          </span>
        </div>
        <div class="space-y-2">
          ${tokensHtml}
        </div>
        <div class="p-2.5 rounded-lg bg-black/40 border border-slate-800/80 text-[11px] text-slate-400 flex items-start gap-2">
          <i class="fa-solid fa-lightbulb text-amber-400/90 mt-0.5"></i>
          <span>${escapeHtml(cfg.guide.tips)}</span>
        </div>
      </div>
    `;
  }

  function resetTerminal() {
    const screen = document.getElementById('demoTerminalScreen');
    if (!screen) return;
    const cfg = GDS_CONFIG[currentGds];
    screen.innerHTML = cfg.welcome.map(line => `<div class="text-slate-400 leading-tight">${escapeHtml(line)}</div>`).join('');
  }

  window.clearDemoTerminal = function () {
    resetTerminal();
    const input = document.getElementById('demoCommandInput');
    if (input) {
      input.value = '';
      input.focus();
    }
  };

  window.runDemoChip = function (cmd) {
    const input = document.getElementById('demoCommandInput');
    if (input) {
      input.value = cmd;
      input.focus();
    }
    executeDemoCommand(cmd);
  };

  function appendToTerminal(lines, isCommand, isError, isRestricted) {
    const screen = document.getElementById('demoTerminalScreen');
    if (!screen) return;

    const block = document.createElement('div');
    block.className = 'mt-2 space-y-0.5 font-mono text-xs sm:text-sm';

    if (isCommand) {
      block.innerHTML = `
        <div class="text-amber-300 font-bold flex items-center gap-1.5 pt-2 border-t border-slate-900">
          <span class="text-amber-500">&gt;</span>
          <span>${escapeHtml(lines)}</span>
        </div>
      `;
    } else {
      let colorClass = 'text-emerald-400';
      if (currentGds === 'amadeus') colorClass = 'text-sky-300';
      if (currentGds === 'sabre') colorClass = 'text-rose-200';
      if (isError) colorClass = 'text-red-400 font-bold';
      if (isRestricted) colorClass = 'text-amber-400 font-bold';

      lines.forEach(line => {
        const row = document.createElement('div');
        row.className = `leading-relaxed whitespace-pre-wrap ${colorClass}`;
        row.textContent = line;
        block.appendChild(row);
      });
    }

    screen.appendChild(block);
    screen.scrollTop = screen.scrollHeight;
  }

  function executeDemoCommand(cmd) {
    if (!cmd || !cmd.trim()) return;
    const trimmed = cmd.trim();

    // Store in history
    history[currentGds].push(trimmed);
    historyIndex[currentGds] = history[currentGds].length;

    // Echo command in terminal
    appendToTerminal(trimmed, true);

    // Process via GdsDemoEngine
    if (!window.GdsDemoEngine) return;
    const res = window.GdsDemoEngine.processCommand(currentGds, trimmed);

    if (!res) {
      appendToTerminal(['UNRECOGNIZED COMMAND - TYPE HELP FOR EXAMPLES'], false, true);
      return;
    }

    if (res.type === 'restricted') {
      appendToTerminal(res.lines, false, false, true);
      // Trigger Lock Modal with delay for natural feel
      setTimeout(() => {
        openDemoLockedModal(trimmed);
      }, 1000);
      return;
    }

    if (res.type === 'error') {
      appendToTerminal(res.lines, false, true);
      return;
    }

    // Normal availability or help
    appendToTerminal(res.lines, false, false);
  }

  // Handle Form Submit & Keyboard Navigation
  function initTerminalInput() {
    const input = document.getElementById('demoCommandInput');
    const form = document.getElementById('demoTerminalForm');

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (!input) return;
        const val = input.value;
        if (!val.trim()) return;
        input.value = '';
        executeDemoCommand(val);
      });
    }

    if (input) {
      input.addEventListener('keydown', function (e) {
        const hist = history[currentGds];
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (historyIndex[currentGds] > 0) {
            historyIndex[currentGds]--;
            input.value = hist[historyIndex[currentGds]] || '';
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (historyIndex[currentGds] < hist.length - 1) {
            historyIndex[currentGds]++;
            input.value = hist[historyIndex[currentGds]] || '';
          } else {
            historyIndex[currentGds] = hist.length;
            input.value = '';
          }
        }
      });
    }
  }

  // Modal Functions
  window.openDemoLockedModal = function (triggerCmd) {
    const modal = document.getElementById('demoLockedModal');
    const triggerTxt = document.getElementById('lockedTriggerCmd');
    if (triggerTxt && triggerCmd) {
      triggerTxt.textContent = triggerCmd;
    }
    if (modal) {
      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  };

  window.closeDemoLockedModal = function () {
    const modal = document.getElementById('demoLockedModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
    const input = document.getElementById('demoCommandInput');
    if (input) input.focus();
  };

  // Initialize on DOM Ready
  document.addEventListener('DOMContentLoaded', function () {
    initTerminalInput();
    // Start with Amadeus tab
    switchGdsDemoTab('amadeus');
  });

})();
