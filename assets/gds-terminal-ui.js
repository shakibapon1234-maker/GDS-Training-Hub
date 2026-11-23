/**
 * GDS Training Hub — Terminal UI Controller (v3.0)
 * Command Input at the TOP, results render directly BELOW.
 * Supports full 1-Time PNR Creation and Ticket Issue with Completion Modal.
 * Reissue and Refund restricted with informative educational notice.
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
        'STATUS: [ONE-TIME FREE TRIAL - FULL PNR & TICKET ISSUE ACTIVE]',
        '-------------------------------------------------------------------',
        'কমান্ড লিখুন অথবা নিচে পর্যায়ক্রমে রেডিমেড চিপসগুলোতে ক্লিক করে PNR ও টিকেট ইস্যু সম্পন্ন করুন:'
      ],
      defaultCmd: 'AN 15OCT DACDXB',
      chips: [
        { label: '১. ফ্লাইট সার্চ', cmd: 'AN 15OCT DACDXB' },
        { label: '২. সিট সিলেক্ট (HK1)', cmd: 'SS 1 Y 1' },
        { label: '৩. প্যাসেঞ্জার নাম', cmd: 'NM1CHOWDHURY/RAHIM MR' },
        { label: '৪. কন্টাক্ট ফিল্ড', cmd: 'AP DAC 01711000000' },
        { label: '৫. টিকেট টাইম-লিমিট', cmd: 'TK TL15OCT' },
        { label: '৬. রিসিভড ফ্রম', cmd: 'RF BAYEZID' },
        { label: '৭. পিএনআর সম্পন্ন', cmd: 'ER' },
        { label: '৮. টিকিট ইস্যু', cmd: 'FXP' },
        { label: '৯. রিইস্যু (লক টেস্ট)', cmd: 'FO' }
      ],
      guide: {
        commandBreakdown: [
          { token: 'AN 15OCT DACDXB', desc: 'ফ্লাইট শিডিউল ও সিট অ্যাভেইলেবিলিটি সার্চ' },
          { token: 'SS 1 Y 1', desc: '১টি সিট Y ক্লাসে লাইন ১ থেকে হোল্ড (HK1)' },
          { token: 'NM1SURNAME/FIRST MR', desc: 'যাত্রীর নাম সংযোজন (Adult/Child/Infant)' },
          { token: 'AP DAC 01711...', desc: 'এজেন্সি ও প্যাসেঞ্জার কন্টাক্ট ইনফো (Phone Element)' },
          { token: 'TK TL15OCT', desc: 'টিকেট ইস্যুর টাইম-লিমিট নির্ধারণ' },
          { token: 'RF BAYEZID', desc: 'রিসিভড ফ্রম — যিনি বুকিংটি প্রদান করেছেন' },
          { token: 'ER', desc: 'End Record — নিশ্চিত PNR তৈরি ও ৬ সংখ্যার রেকর্ড লোকেটর জেনারেট' },
          { token: 'FXP / TTP', desc: 'অটো ফেয়ার ক্যালকুলেশন এবং আসল ইলেকট্রনিক টিকিট ইস্যু' }
        ],
        tips: 'রি-ইস্যু বা রিফান্ড কমান্ড দিলে ডেমো লিমিটেশন দেখাবে—কারণ এটি শুধুমাত্র পেইড ফুল ভার্সনে সংরক্ষিত।'
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
        'STATUS: [ONE-TIME FREE TRIAL - FULL PNR & TICKET ISSUE ACTIVE]',
        '-------------------------------------------------------------------',
        'কমান্ড লিখুন অথবা নিচে পর্যায়ক্রমে রেডিমেড চিপসগুলোতে ক্লিক করে PNR ও টিকেট ইস্যু সম্পন্ন করুন:'
      ],
      defaultCmd: 'A15OCTDACDXB',
      chips: [
        { label: '১. ফ্লাইট সার্চ', cmd: 'A15OCTDACDXB' },
        { label: '২. সিট সিলেক্ট (HK1)', cmd: 'N.1Y1' },
        { label: '৩. প্যাসেঞ্জার নাম', cmd: 'N.CHOWDHURY/RAHIM MR' },
        { label: '৪. ফোন ফিল্ড', cmd: 'P.DAC*01711000000' },
        { label: '৫. টিকেট টাইম-লিমিট', cmd: 'T.TAU/15OCT' },
        { label: '৬. রিসিভড ফ্রম', cmd: 'R.BAYEZID' },
        { label: '৭. বুকিং সম্পন্ন', cmd: 'ER' },
        { label: '৮. টিকিট ইস্যু', cmd: 'FQ' },
        { label: '৯. রিইস্যু (লক টেস্ট)', cmd: 'TRNE' }
      ],
      guide: {
        commandBreakdown: [
          { token: 'A15OCTDACDXB', desc: 'Galileo ফ্লাইট অ্যাভেইলেবিলিটি সার্চ' },
          { token: 'N.1Y1', desc: 'সিট বিক্রি: ১টি সিট Y ক্লাসে লাইন ১ থেকে বুকিং' },
          { token: 'N.SURNAME/FIRST MR', desc: 'যাত্রীর নাম ইনপুট (Name Field)' },
          { token: 'P.DAC*01711...', desc: 'ফোন নম্বর ও কন্টাক্ট ফিল্ড যুক্তকরণ' },
          { token: 'T.TAU/15OCT', desc: 'টিকেট টাইম-লিমিট সেট করা' },
          { token: 'R.BAYEZID', desc: 'রিসিভড ফ্রম ইনফরমেশন' },
          { token: 'ER', desc: 'End Record — বুকিং ফাইল তৈরি ও লোকেটর প্রাপ্তি' },
          { token: 'FQ / *FF', desc: 'ফেয়ার কোটেশন ও ইলেকট্রনিক টিকেট ইস্যু' }
        ],
        tips: 'রি-ইস্যু বা রিফান্ড কমান্ড দিলে ডেমো লিমিটেশন দেখাবে—কারণ এটি ফুল লাইফটাইম ভার্সনে সংরক্ষিত।'
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
        'STATUS: [ONE-TIME FREE TRIAL - FULL PNR & TICKET ISSUE ACTIVE]',
        '-------------------------------------------------------------------',
        'কমান্ড লিখুন অথবা নিচে পর্যায়ক্রমে রেডিমেড চিপসগুলোতে ক্লিক করে PNR ও টিকেট ইস্যু সম্পন্ন করুন:'
      ],
      defaultCmd: '115OCTDACDXB',
      chips: [
        { label: '১. ফ্লাইট সার্চ', cmd: '115OCTDACDXB' },
        { label: '২. সিট সিলেক্ট (HK1)', cmd: '01Y1' },
        { label: '৩. প্যাসেঞ্জার নাম', cmd: '-CHOWDHURY/RAHIM MR' },
        { label: '৪. ফোন ফিল্ড', cmd: '901711000000-A' },
        { label: '৫. টিকেট টাইম-লিমিট', cmd: '7TAW15OCT/' },
        { label: '৬. রিসিভড ফ্রম', cmd: '6BAYEZID' },
        { label: '৭. পিএনআর সম্পন্ন', cmd: 'ER' },
        { label: '৮. টিকিট ইস্যু', cmd: 'WP' },
        { label: '৯. রিইস্যু (লক টেস্ট)', cmd: 'WFR' }
      ],
      guide: {
        commandBreakdown: [
          { token: '115OCTDACDXB', desc: 'Sabre ফ্লাইট অ্যাভেইলেবিলিটি (1 দিয়ে শুরু)' },
          { token: '01Y1', desc: 'সিট বিক্রি: ০ + ১ সিট + Y ক্লাস + লাইন ১' },
          { token: '-SURNAME/FIRST MR', desc: 'মাইনাস (-) দিয়ে Sabre নাম ফিল্ড' },
          { token: '9PHONE-A', desc: '৯ দিয়ে Sabre এজেন্সি কন্টাক্ট ফিল্ড' },
          { token: '7TAW15OCT/', desc: '৭ দিয়ে Sabre টিকেট টাইম-লিমিট ফিল্ড' },
          { token: '6BAYEZID', desc: '৬ দিয়ে Sabre রিসিভড ফ্রম ফিল্ড' },
          { token: 'ER', desc: 'End Record — Sabre PNR ও রেকর্ড লোকেটর তৈরি' },
          { token: 'WP / WPNI', desc: 'Work Pricing ও ইলেকট্রনিক টিকেট ইস্যু' }
        ],
        tips: 'রি-ইস্যু বা রিফান্ড কমান্ড দিলে ডেমো লিমিটেশন দেখাবে—কারণ এটি ফুল লাইফটাইম ভার্সনে সংরক্ষিত।'
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
            <h4 class="text-sm font-bold text-white">${escapeHtml(cfg.shortName)} সম্পূর্ণ টিকেট ইস্যু ধাপসমূহ:</h4>
          </div>
          <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-semibold">
            One-Time Practice Guide
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

    const cmdEcho = document.createElement('div');
    const isErr = res.type === 'error';
    cmdEcho.className = `${isErr ? 'text-red-400' : 'text-amber-300'} font-bold flex items-center gap-1.5 pb-1 border-b border-slate-900`;
    cmdEcho.innerHTML = `<span class="text-amber-500 font-black">&gt;</span> <span>${escapeHtml(cmd)}</span>`;
    block.appendChild(cmdEcho);

    let colorClass = 'text-emerald-400';
    if (currentGds === 'amadeus') colorClass = 'text-sky-300';
    if (currentGds === 'sabre') colorClass = 'text-rose-200';
    if (res.type === 'seathold') colorClass = 'text-emerald-300 font-semibold';
    if (res.type === 'pnr_building') colorClass = 'text-cyan-300';
    if (res.type === 'pnr_confirmed') colorClass = 'text-amber-300 font-bold';
    if (res.type === 'ticket_issued') colorClass = 'text-green-300 font-bold';
    if (res.type === 'error') colorClass = 'text-red-400 font-bold';
    if (res.type === 'restricted_reissue') colorClass = 'text-amber-400 font-bold';

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

    if (res.type === 'restricted_reissue' && !isInitial) {
      setTimeout(() => {
        openDemoLockedModal(trimmed);
      }, 700);
    }

    if (res.type === 'ticket_issued' && !isInitial) {
      try {
        localStorage.setItem('gds_trial_used', 'true');
      } catch (e) {}

      setTimeout(() => {
        if (typeof window.openCompletionModal === 'function') {
          window.openCompletionModal(res.ticket);
        }
      }, 1000);
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
