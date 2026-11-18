/**
 * GDS Training Hub — Terminal UI Controller (v2.2)
 * Command Input at the TOP, results render directly BELOW.
 * Strict Error handling — No "Command Executed" badges, authentic GDS terminal output.
 */

(function () {
  'use strict';

  let currentGds = 'amadeus'; // 'amadeus' | 'galileo' | 'sabre'
  const history = { amadeus: [], galileo: [], sabre: [] };
  const historyIndex = { amadeus: -1, galileo: -1, sabre: -1 };

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
        'STATUS: [DEMO MODE - FLIGHT SEARCH & SEAT HOLD ACTIVE]',
        '-------------------------------------------------------------------',
        'উপরে কমান্ড লিখে [রান করুন ↵] চাপুন অথবা নিচের রেডিমেড বাটনে ক্লিক করুন:'
      ],
      defaultCmd: 'AN 15OCT DACDXB',
      chips: [
        { label: '১. ফ্লাইট সার্চ (ঢাকা-দুবাই)', cmd: 'AN 15OCT DACDXB' },
        { label: '২. ফ্লাইট সার্চ (এমিরেটস জেদ্দা)', cmd: 'AN 20NOV DACJED/AEK' },
        { label: '৩. সিট হোল্ড করুন (HK1)', cmd: 'SS 1 Y 1' },
        { label: '৪. নাম ও টিকিট ট্রাই (লক টেস্ট)', cmd: 'NM1RAHMAN/ANIS MR' }
      ],
      guide: {
        commandBreakdown: [
          { token: 'AN', desc: 'Availability Neutral (ফ্লাইট সার্চের মূল কমান্ড)' },
          { token: '15OCT', desc: 'ভ্রমণের তারিখ (১৫ই অক্টোবর)' },
          { token: 'DACDXB', desc: 'যাত্রার রুট (ঢাকা DAC থেকে দুবাই DXB)' },
          { token: '/AEK', desc: 'নির্দিষ্ট এয়ারলাইন ফিল্টার (/A + EK = Emirates)' },
          { token: 'SS 1 Y 1', desc: 'সিট হোল্ড: SS + 1 (সিট সংখ্যা) + Y (ক্লাস) + 1 (লাইন নাম্বার)' }
        ],
        tips: 'ভুল কমান্ড লিখলে টার্মিনালে সরাসরি আসল Amadeus-এর মতো "INVALID FORMAT" এরর দেখাবে।'
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
        'STATUS: [DEMO MODE - FLIGHT SEARCH & SEAT HOLD ACTIVE]',
        '-------------------------------------------------------------------',
        'উপরে কমান্ড লিখে [রান করুন ↵] চাপুন অথবা নিচের রেডিমেড বাটনে ক্লিক করুন:'
      ],
      defaultCmd: 'A15OCTDACDXB',
      chips: [
        { label: '১. ফ্লাইট সার্চ (ঢাকা-দুবাই)', cmd: 'A15OCTDACDXB' },
        { label: '২. ফ্লাইট সার্চ (এমিরেটস জেদ্দা)', cmd: 'A20NOVDACJED*EK' },
        { label: '৩. সিট বিক্রি/হোল্ড (HK1)', cmd: 'N1Y1' },
        { label: '৪. নাম ও টিকিট ট্রাই (লক টেস্ট)', cmd: 'N.RAHMAN/MD MR' }
      ],
      guide: {
        commandBreakdown: [
          { token: 'A', desc: 'Availability (গ্যালিলিওর ফ্লাইট সার্চ কোড)' },
          { token: '15OCT', desc: 'ভ্রমণের তারিখ (১৫ই অক্টোবর)' },
          { token: 'DACDXB', desc: 'রুট: ঢাকা DAC থেকে দুবাই DXB' },
          { token: '*EK', desc: 'নির্দিষ্ট এয়ারলাইন সিলেক্টর (* + EK)' },
          { token: 'N1Y1', desc: 'সিট বিক্রি: N (সিট ১) + Y (ক্লাস) + ১ (লাইন নাম্বার)' }
        ],
        tips: 'ভুল কমান্ড লিখলে টার্মিনালে আসল গ্যালিলিওর মতো "CHECK ENTRY - FORMAT ERROR" এরর দেখাবে।'
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
        'STATUS: [DEMO MODE - FLIGHT SEARCH & SEAT HOLD ACTIVE]',
        '-------------------------------------------------------------------',
        'উপরে কমান্ড লিখে [রান করুন ↵] চাপুন অথবা নিচের রেডিমেড বাটনে ক্লিক করুন:'
      ],
      defaultCmd: '115OCTDACDXB',
      chips: [
        { label: '১. ফ্লাইট সার্চ (ঢাকা-দুবাই)', cmd: '115OCTDACDXB' },
        { label: '২. ফ্লাইট সার্চ (এমিরেটস জেদ্দা)', cmd: '120NOVDACJED‡EK' },
        { label: '৩. সিট বিক্রি/হোল্ড (HK1)', cmd: '01Y1' },
        { label: '৪. নাম ও টিকিট ট্রাই (লক টেস্ট)', cmd: '-RAHMAN/ANIS MR' }
      ],
      guide: {
        commandBreakdown: [
          { token: '1', desc: 'Availability (Sabre-এ ১ দিয়ে ফ্লাইট সার্চ শুরু হয়)' },
          { token: '15OCT', desc: 'ভ্রমণের তারিখ (১৫ই অক্টোবর)' },
          { token: 'DACDXB', desc: 'ঢাকা DAC থেকে দুবাই DXB' },
          { token: '‡EK', desc: 'ক্রস অব লোরেন এয়ারলাইন কোড (‡ বা / + EK)' },
          { token: '01Y1', desc: 'সিট বিক্রি: 0 + 1 (সিট সংখ্যা) + Y (ক্লাস) + 1 (লাইন)' }
        ],
        tips: 'ভুল কমান্ড লিখলে টার্মিনালে আসল Sabre-এর মতো "FORMAT" এরর বার্তা দেখাবে।'
      }
    }
  };

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Switch Active GDS Tab
  window.switchGdsDemoTab = function (gdsKey) {
    if (!GDS_CONFIG[gdsKey]) return;
    currentGds = gdsKey;

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

    const pccEl = document.getElementById('demoTerminalPcc');
    if (pccEl) pccEl.textContent = cfg.pcc;

    const gdsTitleEl = document.getElementById('demoTerminalTitle');
    if (gdsTitleEl) gdsTitleEl.textContent = cfg.name;

    const input = document.getElementById('demoCommandInput');
    if (input) {
      input.placeholder = `কমান্ড লিখুন (যেমন: ${cfg.defaultCmd}) এবং Enter চাপুন...`;
    }

    renderChips();
    renderGuide();

    resetTerminal();
    executeDemoCommand(cfg.defaultCmd, true);
  };

  function renderChips() {
    const container = document.getElementById('demoChipsContainer');
    if (!container) return;
    const cfg = GDS_CONFIG[currentGds];

    container.innerHTML = cfg.chips.map(chip => `
      <button
        type="button"
        onclick="window.runDemoChip('${escapeHtml(chip.cmd)}')"
        class="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-amber-500/20 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/40 transition flex items-center gap-1.5 shadow-sm group text-left cursor-pointer"
        title="ক্লিক করলেই কমান্ড টার্মিনালে রান হবে"
      >
        <span class="text-amber-400 group-hover:scale-110 transition-transform font-bold">▸</span>
        <span class="font-bold text-amber-300/95">${escapeHtml(chip.cmd)}</span>
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
    screen.innerHTML = cfg.welcome.map(line => `<div class="text-slate-500 text-[11px] sm:text-xs leading-tight">${escapeHtml(line)}</div>`).join('');
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

  function displayResultUnderCommand(cmd, res) {
    const screen = document.getElementById('demoTerminalScreen');
    if (!screen) return;

    const block = document.createElement('div');
    block.className = 'mt-2 pt-2 border-t border-slate-800 space-y-1 font-mono text-xs sm:text-sm';

    // Echo the prompt line exactly like real GDS (NO "Command Executed" fake badge!)
    const cmdEcho = document.createElement('div');
    const isErr = res.type === 'error';
    cmdEcho.className = `${isErr ? 'text-red-400' : 'text-amber-300'} font-bold flex items-center gap-1.5 pb-1 border-b border-slate-900`;
    cmdEcho.innerHTML = `<span class="text-amber-500 font-black">&gt;</span> <span>${escapeHtml(cmd)}</span>`;
    block.appendChild(cmdEcho);

    let colorClass = 'text-emerald-400';
    if (currentGds === 'amadeus') colorClass = 'text-sky-300';
    if (currentGds === 'sabre') colorClass = 'text-rose-200';
    if (res.type === 'seathold') colorClass = 'text-emerald-300 font-semibold';
    if (res.type === 'error') colorClass = 'text-red-400 font-bold';
    if (res.type === 'restricted') colorClass = 'text-amber-400 font-bold';

    res.lines.forEach(line => {
      const row = document.createElement('div');
      row.className = `leading-relaxed whitespace-pre-wrap ${colorClass}`;
      row.textContent = line;
      block.appendChild(row);
    });

    const existingResult = screen.querySelector('.active-demo-result');
    if (existingResult) {
      existingResult.remove();
    }
    block.classList.add('active-demo-result');
    screen.appendChild(block);

    screen.scrollTop = block.offsetTop - screen.offsetTop - 10;
  }

  function executeDemoCommand(cmd, isInitial) {
    if (!cmd || !cmd.trim()) return;
    const trimmed = cmd.trim();

    history[currentGds].push(trimmed);
    historyIndex[currentGds] = history[currentGds].length;

    if (!window.GdsDemoEngine) return;
    const res = window.GdsDemoEngine.processCommand(currentGds, trimmed);

    if (!res) {
      displayResultUnderCommand(trimmed, {
        type: 'error',
        lines: ['INVALID COMMAND FORMAT']
      });
      return;
    }

    displayResultUnderCommand(trimmed, res);

    if (res.type === 'restricted' && !isInitial) {
      setTimeout(() => {
        openDemoLockedModal(trimmed);
      }, 700);
    }
  }

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

  document.addEventListener('DOMContentLoaded', function () {
    initTerminalInput();
    switchGdsDemoTab('amadeus');
  });

})();
