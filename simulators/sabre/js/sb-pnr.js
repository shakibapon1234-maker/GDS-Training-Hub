/* =========================================================================
   SABRE TRAINING SIMULATOR — PNR STATE, RENDERING & TERMINAL I/O
   Independent educational tool — no affiliation with Sabre Corporation.
   ========================================================================= */

const SB_OFFICE = "3MUL";

/* ---------------------------------------------------------------------
   STATE — fresh on every load/refresh
--------------------------------------------------------------------- */
function sbEmptyState() {
  return {
    locator: null,
    officeId: SB_OFFICE,
    agentSine: "7H2Y",
    dateStamp: null,
    names: [],             // [{ raw, surname, first, title }]
    _availCache: null,      // last availability options shown (for sell)
    booked: [],             // sold segments in the PNR (flat list)
    phones: [],
    receivedFrom: null,
    receivedFromRequired: false, // set after PNR changes; cleared by 6<name>
    ticketingArrangement: null,
    ssrEntries: [],
    documents: [],          // DOCS SSR entries (passport/APIS information)
    remarks: [],            // 5C/ general remark entries
    frequentFlyers: [],     // FF entries
    emails: [],             // PE passenger email entries
    salesRecords: [],       // Issued tickets for sales reports
    voidedRecords: [],      // Voided tickets for void reports
    printerId: null,        // ticket printer selected for this running session
    printerAssigned: false,
    printerDesignated: false,
    fareQuote: null,        // { base, tax, total, currency }
    privateFare: null,      // fare loaded through WPA <carrier> then PQ
    ticketed: false,
    eticketNumber: null,
    ticketNumbers: [],
    ticketCoupons: [],
    exchangedCoupons: [],
    invoiced: false,
    voided: false,          // ticket was voided
    voidedTicketNo: null,   // ticket number that was voided
    voidedTicketNumbers: [], // ticket numbers voided in this PNR
    pendingVoidTicketNo: null, // WV requires the same entry twice for confirmation
    refunded: false,        // refund was processed
    partialRefundPractice: false,
    refundQuote: null,
    refundMaskOpen: false,
    refundTransaction: null,
    unusedRefundMask: null,
    unusedRefundPractice: false,
    issuedItinerary: null,
    issuedFare: null,
    reissueNeedsPricing: false,
    reissuePricedFare: null,
    reissueTrainingNewFare: null, // optional fixed fare for a lesson scenario
    reissueInsertIndex: null,
    reissueChangeFee: null,
    partialUsedPractice: false,
    exchangeMask: null,
    exchangeCollect: 0,
    changeFeeEmd: 0,
    changeFeeEmdNo: null,
    exchangedTicketNo: null,
    ended: false
  };
}
let sbState = sbEmptyState();
const SB_HISTORY_KEY = 'sabre_command_history';

function sbLoadCommandHistory() {
  try {
    const saved = localStorage.getItem(SB_HISTORY_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return [];
}

let sbCommandHistory = sbLoadCommandHistory();
let sbHistoryIndex = sbCommandHistory.length;

function sbRememberCommand(command) {
  if (!command) return;
  sbCommandHistory.push(command);
  if (sbCommandHistory.length > 500) {
    sbCommandHistory = sbCommandHistory.slice(-500);
  }
  sbHistoryIndex = sbCommandHistory.length;
  try {
    localStorage.setItem(SB_HISTORY_KEY, JSON.stringify(sbCommandHistory));
  } catch (e) {}
}

function sbRecallHistory(direction) {
  const input = document.getElementById('cmdInput');
  if (!input || sbCommandHistory.length === 0) return;
  sbHistoryIndex = Math.max(0, Math.min(sbCommandHistory.length - 1, sbHistoryIndex + direction));
  input.value = sbCommandHistory[sbHistoryIndex];
  input.focus();
}

/* ---------------------------------------------------------------------
   RESET SESSION — used by the terminal shell and the Electron menu
   (Simulator > Reset Session)
--------------------------------------------------------------------- */
function sbResetSession() {
  sbState = sbEmptyState();
  const term = document.getElementById('termArea');
  if (term) term.innerHTML = '<span class="ph">— কমান্ড টাইপ করে Send চাপুন —</span>';
  sbSyncSidePanel();
}

/* ---------------------------------------------------------------------
   LESSON PNR — quick-load sample matching a finished booking
   (parallel to Amaduce's THAI_PNR / LESSON_PNR quick-load buttons)
--------------------------------------------------------------------- */
function sbLoadLessonPNR() {
  sbState = sbEmptyState();
  sbState.locator = "K7QZLM";
  sbState.dateStamp = "09SEP26/0930Z";
  sbState.names = [{ raw: "RAHMAN/ANIS MR", surname: "RAHMAN", first: "ANIS", title: "MR" }];
  sbState.booked = [
    { al: "BG", fn: "555", cls: "Y", date: "25DEC", dep: "DAC", arr: "SIN", status: "HK1",
      depT: "1659", arrT: "2059", eq: "739", day: "5" }
  ];
  sbState.phones = [{ raw: "DAC 01700000000-A" }];
  sbState.receivedFrom = "SHAKIB";
  sbState.ticketingArrangement = "TAW-20DEC/";
  sbState.ended = true;
  sbEcho("*K7QZLM");
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

function sbLoadReissuePracticePNR() {
  sbState = sbEmptyState();
  sbState.locator = "R8SU26";
  sbState.dateStamp = "01OCT26/0900Z";
  sbState.names = [{ raw: "RAHMAN/ANIS MR", surname: "RAHMAN", first: "ANIS", title: "MR", paxType: "ADT" }];
  sbState.booked = [{ al: "BG", fn: "555", cls: "Y", date: "25DEC", dep: "DAC", arr: "SIN", status: "HK1", depT: "1659", arrT: "2059", eq: "739", day: "5", baggage: "30K" }];
  sbState.phones = [{ raw: "DAC 01700000000-A" }];
  sbState.receivedFrom = "SHAKIB";
  sbState.ticketingArrangement = "TAW-20DEC/";
  sbState.fareQuote = { base: 34230, tax: 6500, total: 40730, currency: "BDT", pax: 1, breakdown: [{ index: 1, type: "ADT", base: 34230, tax: 6500, total: 40730 }] };
  sbState.privateFare = { carrier: "BG", carrierName: "BIMAN BANGLADESH", baseBdt: 34230, tax: 6500, total: 40730, fareBasis: "YEE1M" };
  sbState.ticketed = true;
  sbState.invoiced = true;
  sbState.eticketNumber = "618-9281928391";
  sbState.ticketNumbers = ["6189281928391"];
  sbState.ticketCoupons = sbState.booked.map(segment => ({ ...segment, ticketStatus: "ACTL" }));
  sbState.issuedItinerary = JSON.stringify(sbState.booked);
  sbState.issuedFare = JSON.parse(JSON.stringify(sbState.fareQuote));
  // Same-fare reissue: no fare difference, but the video lesson collects
  // the normal BDT 3,265 change/reissue fee.
  sbState.reissueChangeFee = 3265;
  sbState.ended = true;
  if (typeof sbPnrStorePut === "function") sbPnrStorePut(sbState);
  sbEcho("LOADREISSUE");
  sbPrint("REISSUE PRACTICE PNR LOADED - TICKET 6189281928391");
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

// Automatic reissue with ADC lesson.  This is deliberately separate from
// LOADREISSUE (the no-ADC lesson), so trainees can practise the two outcomes
// without changing live-style fare data.
function sbLoadReissueAdcPracticePNR() {
  sbState = sbEmptyState();
  sbState.locator = "EYZBSB";
  sbState.dateStamp = "30AUG23/1140Z";
  sbState.names = [{ raw: "HOQUE/MOHAMMAD SAIFUL MR", surname: "HOQUE", first: "MOHAMMAD SAIFUL", title: "MR", paxType: "ADT" }];
  sbState.booked = [{ al: "BG", fn: "584", cls: "C", date: "20OCT", dep: "DAC", arr: "SIN", status: "HK1", depT: "0830", arrT: "1440", eq: "738", day: "5", baggage: "30K" }];
  sbState.phones = [{ raw: "DAC SABRE BANGLADESH CTC 01520102045 REF RABBI" }];
  sbState.receivedFrom = "RABBI";
  sbState.ticketingArrangement = "T-30AUG-CJ38*AIN";
  sbState.fareQuote = { base: 54415, tax: 9080, total: 63495, currency: "BDT", pax: 1, breakdown: [{ index: 1, type: "ADT", base: 54415, tax: 9080, total: 63495 }], baseUsd: 1000, rate: 54.415 };
  sbState.privateFare = { carrier: "BG", carrierName: "BIMAN BANGLADESH", baseUsd: 1000, rate: 54.415, baseBdt: 54415, tax: 9080, total: 63495, fareBasis: "CEE1M" };
  sbState.ticketed = true;
  sbState.invoiced = true;
  sbState.eticketNumber = "997-4164275968";
  sbState.ticketNumbers = ["9974164275968"];
  sbState.ticketCoupons = sbState.booked.map(segment => ({ ...segment, ticketStatus: "ACTL" }));
  sbState.issuedItinerary = JSON.stringify(sbState.booked);
  sbState.issuedFare = JSON.parse(JSON.stringify(sbState.fareQuote));
  sbState.reissueChangeFee = 3265;
  // The replacement itinerary in the official ADC lesson has an additional
  // fare of BDT 54,415 and the same BDT 9,080 tax.
  sbState.reissueTrainingNewFare = { baseBdt: 108830, tax: 9080, total: 117910, currency: "BDT", pax: 1, breakdown: [{ index: 1, type: "ADT", base: 108830, tax: 9080, total: 117910 }], baseUsd: 1000, rate: 108.83, fareBasis: "CEE1M", route: "BG DAC SIN 1000.00END ROE1.00" };
  sbState.ended = true;
  if (typeof sbPnrStorePut === "function") sbPnrStorePut(sbState);
  sbEcho("LOADREISSUEADC");
  sbPrint("ADC REISSUE PRACTICE PNR LOADED - TICKET 9974164275968");
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

function sbLoadHalfReissuePracticePNR() {
  sbState = sbEmptyState();
  sbState.locator = "JNHLS";
  sbState.dateStamp = "26OCT26/0900Z";
  sbState.names = [{ raw: "RAHMAN/ANIS MR", surname: "RAHMAN", first: "ANIS", title: "MR", paxType: "ADT" }];
  sbState.booked = [
    { al: "TG", fn: "342", cls: "Y", date: "20NOV", dep: "DAC", arr: "BKK", status: "HK1", depT: "2330", arrT: "0620", eq: "738", day: "5" },
    { al: "TG", fn: "321", cls: "Y", date: "27NOV", dep: "BKK", arr: "DAC", status: "HK1", depT: "1035", arrT: "1210", eq: "738", day: "5" }
  ];
  sbState.phones = [{ raw: "DAC 01700000000-A" }];
  sbState.receivedFrom = "SHAKIB";
  sbState.ticketingArrangement = "TAW-07NOV/";
  sbState.fareQuote = { base: 85576, tax: 15600, total: 101176, currency: "BDT", pax: 1, breakdown: [{ index: 1, type: "ADT", base: 85576, tax: 15600, total: 101176 }] };
  sbState.privateFare = { carrier: "TG", carrierName: "THAI AIRWAYS", baseBdt: 85576, tax: 15600, total: 101176, fareBasis: "VEE1M" };
  sbState.ticketed = true;
  sbState.invoiced = true;
  sbState.eticketNumber = "217-3022860230";
  sbState.ticketNumbers = ["2173022860230"];
  sbState.ticketCoupons = sbState.booked.map(segment => ({ ...segment, ticketStatus: "ACTL" }));
  sbState.issuedItinerary = JSON.stringify(sbState.booked);
  sbState.issuedFare = JSON.parse(JSON.stringify(sbState.fareQuote));
  sbState.ended = true;
  if (typeof sbPnrStorePut === "function") sbPnrStorePut(sbState);
  sbEcho("LOADHALFREISSUE");
  sbPrint("HALF-PORTION REISSUE PNR LOADED - DAC/BKK RETURN / TICKET 2173022860230");
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

function sbLoadPartialReissuePracticePNR() {
  sbState = sbEmptyState();
  sbState.locator = "P7R2CX";
  sbState.dateStamp = "26OCT26/0900Z";
  sbState.names = [{ raw: "RAHMAN/ANIS MR", surname: "RAHMAN", first: "ANIS", title: "MR", paxType: "ADT" }];
  sbState.booked = [
    { al: "WY", fn: "2664", cls: "R", date: "11NOV", dep: "DOH", arr: "MCT", status: "HK1", depT: "1900", arrT: "2130", eq: "738", day: "3" },
    { al: "WY", fn: "2669", cls: "R", date: "20JAN", dep: "MCT", arr: "DOH", status: "HK1", depT: "0500", arrT: "0540", eq: "738", day: "2" }
  ];
  sbState.phones = [{ raw: "DOH 01700000000-A" }];
  sbState.receivedFrom = "SHAKIB";
  sbState.ticketingArrangement = "TAW-10DEC/";
  sbState.fareQuote = { base: 29800, tax: 13200, total: 43000, currency: "QAR", pax: 1, breakdown: [{ index: 1, type: "ADT", base: 29800, tax: 13200, total: 43000 }] };
  sbState.privateFare = { carrier: "WY", carrierName: "OMAN AIR", baseBdt: 29800, tax: 13200, total: 43000, fareBasis: "RBL6QA" };
  sbState.ticketed = true;
  sbState.invoiced = true;
  sbState.eticketNumber = "910-2107515544";
  sbState.ticketNumbers = ["9102107515544"];
  sbState.ticketCoupons = [
    { ...sbState.booked[0], ticketStatus: "USED" },
    { ...sbState.booked[1], ticketStatus: "OPEN" }
  ];
  sbState.issuedItinerary = JSON.stringify(sbState.booked);
  sbState.issuedFare = JSON.parse(JSON.stringify(sbState.fareQuote));
  sbState.reissueChangeFee = 500;
  sbState.partialUsedPractice = true;
  sbState.ended = true;
  if (typeof sbPnrStorePut === "function") sbPnrStorePut(sbState);
  sbEcho("LOADPARTIALREISSUE");
  sbPrint("PARTIALLY USED TICKET REISSUE PRACTICE PNR LOADED - COUPON 1 USED / COUPON 2 OPEN");
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

function sbLoadPartialRefundPracticePNR() {
  sbState = sbEmptyState();
  sbState.locator = "PBGUHZ";
  sbState.dateStamp = "23APR24/0900Z";
  sbState.names = [{ raw: "KINHA/KAVITA MRS", surname: "KINHA", first: "KAVITA", title: "MRS", paxType: "ADT" }];
  sbState.booked = [
    { al: "WY", fn: "662", cls: "H", date: "23APR", dep: "DOH", arr: "MCT", status: "HK1", depT: "2145", arrT: "0010", eq: "738", day: "2" },
    { al: "WY", fn: "663", cls: "H", date: "02JUN", dep: "MCT", arr: "DOH", status: "HK1", depT: "1425", arrT: "1500", eq: "738", day: "7" }
  ];
  sbState.phones = [{ raw: "DOH 944484777-A" }];
  sbState.receivedFrom = "KAVITA";
  sbState.ticketingArrangement = "TAW-23APR-3GY5*AKK";
  sbState.fareQuote = { base: 3620, tax: 740, total: 4360, currency: "QAR", pax: 1, breakdown: [{ index: 1, type: "ADT", base: 3620, tax: 740, total: 4360 }] };
  sbState.privateFare = { carrier: "WY", carrierName: "OMAN AIR", baseBdt: 3620, tax: 740, total: 4360, fareBasis: "HEPRQA" };
  sbState.ticketed = true;
  sbState.invoiced = true;
  sbState.eticketNumber = "910-6610883119";
  sbState.ticketNumbers = ["9106610883119"];
  sbState.ticketCoupons = [
    { ...sbState.booked[0], ticketStatus: "USED" },
    { ...sbState.booked[1], ticketStatus: "OPEN" }
  ];
  sbState.issuedItinerary = JSON.stringify(sbState.booked);
  sbState.issuedFare = JSON.parse(JSON.stringify(sbState.fareQuote));
  sbState.partialRefundPractice = true;
  sbState.ended = true;
  if (typeof sbPnrStorePut === "function") sbPnrStorePut(sbState);
  sbEcho("LOADPARTIALREFUND");
  sbPrint("PARTIAL REFUND PRACTICE PNR LOADED - COUPON 1 USED / COUPON 2 OPEN");
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

function sbLoadUnusedRefundPracticePNR() {
  sbState = sbEmptyState();
  sbState.locator = "QWKICT";
  sbState.dateStamp = "21MAY25/0900Z";
  sbState.names = [{ raw: "HOSSAIN/MD ARMAN MR", surname: "HOSSAIN", first: "MD ARMAN", title: "MR", paxType: "ADT" }];
  sbState.booked = [
    { al: "BG", fn: "584", cls: "Y", date: "25JUN", dep: "DAC", arr: "SIN", status: "HK1", depT: "0825", arrT: "1440", eq: "738", day: "3" }
  ];
  sbState.phones = [{ raw: "DAC 01700000000-A" }];
  sbState.receivedFrom = "SHAKIB";
  sbState.ticketingArrangement = "TAW-21MAY-8MLJ*AUT";
  sbState.fareQuote = { base: 61000, tax: 9881, total: 70881, currency: "BDT", pax: 1, breakdown: [{ index: 1, type: "ADT", base: 61000, tax: 9881, total: 70881 }] };
  sbState.privateFare = { carrier: "BG", carrierName: "BIMAN BANGLADESH", baseUsd: 500, baseBdt: 61000, tax: 9881, total: 70881, fareBasis: "YBDO" };
  sbState.ticketed = true;
  sbState.invoiced = true;
  sbState.eticketNumber = "997-3022750006";
  sbState.ticketNumbers = ["9973022750006"];
  sbState.ticketCoupons = sbState.booked.map(segment => ({ ...segment, ticketStatus: "OPEN" }));
  sbState.issuedItinerary = JSON.stringify(sbState.booked);
  sbState.issuedFare = JSON.parse(JSON.stringify(sbState.fareQuote));
  sbState.unusedRefundPractice = true;
  sbState.ended = true;
  if (typeof sbPnrStorePut === "function") sbPnrStorePut(sbState);
  sbEcho("LOADUNUSEDREFUND");
  sbPrint("TOTALLY UNUSED TICKET REFUND PRACTICE PNR LOADED - COUPON 1 OPEN");
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

/* ---------------------------------------------------------------------
   TERMINAL I/O HELPERS
--------------------------------------------------------------------- */
function sbEcho(cmd) {
  const term = document.getElementById('termArea');
  if (!term) return null;
  if (term.querySelector('.ph')) term.innerHTML = '';
  const echo = document.createElement('div');
  echo.className = /^WPA/.test(cmd.trim()) ? 'line-echo fare-command' : 'line-echo';
  const text = cmd.toUpperCase().trim();
  echo.textContent = text.endsWith('«') ? text : (text + '«');
  term.appendChild(echo);
  if (typeof window !== 'undefined') window._sbLastCommandEcho = echo;
  return echo;
}
function sbScrollToCommand(echo) {
  const term = document.getElementById('termArea');
  if (!term) return;
  const target = echo || (typeof window !== 'undefined' ? window._sbLastCommandEcho : null);
  if (!target) return;

  try {
    const termRect = term.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offsetDiff = targetRect.top - termRect.top;
    term.scrollTop = Math.max(0, term.scrollTop + offsetDiff);
  } catch (e) {
    if (typeof target.scrollIntoView === 'function') {
      target.scrollIntoView({ block: 'start', behavior: 'auto' });
    }
  }
}
if (typeof window !== 'undefined') window.sbScrollToCommand = sbScrollToCommand;

function sbPrint(text, cls) {
  const term = document.getElementById('termArea');
  if (!term) return;
  const str = String(text ?? '');
  if (str.includes('\n')) {
    str.split('\n').forEach(sub => sbPrint(sub, cls));
    return;
  }
  const line = document.createElement('div');
  line.className = cls || (str === '*' ? 'line-display' : 'line-pnr');
  line.textContent = str || '\u00A0';
  term.appendChild(line);
  if (typeof window === 'undefined' || !window._sbSuppressScrollToBottom) {
    term.scrollTop = term.scrollHeight;
  }
}
function sbWarn(text) { sbPrint(text, 'line-warn'); }
function sbPrintSsrError(lines) {
  const term = document.getElementById('termArea');
  if (!term) return;
  const box = document.createElement('div');
  box.className = 'sb-ssr-error-box';
  box.innerHTML = `
    <div class="sb-ssr-error-icon">
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none">
        <circle cx="19" cy="19" r="17" fill="#cc0000"/>
        <circle cx="19" cy="19" r="11" stroke="#ffffff" stroke-width="2.8" fill="none"/>
        <line x1="11" y1="27" x2="27" y2="11" stroke="#ffffff" stroke-width="2.8"/>
      </svg>
    </div>
    <div class="sb-ssr-error-text">
      ${lines.map(l => `<div>${l}</div>`).join('')}
    </div>
  `;
  term.appendChild(box);
  term.scrollTop = term.scrollHeight;
}

function sbPrintDcMessage() {
  const term = document.getElementById('termArea');
  if (!term) return;
  const box = document.createElement('div');
  box.className = 'sb-dc-msg-box';
  box.innerHTML = `
    <div class="sb-dc-msg-icon">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="13" fill="#0088cc"/>
        <circle cx="14" cy="8.5" r="1.8" fill="#ffffff"/>
        <rect x="12.5" y="12" width="3" height="9" rx="1" fill="#ffffff"/>
      </svg>
    </div>
    <div class="sb-dc-msg-text">
      <div style="font-weight:bold; color:#f0f4f8;">DIRECT CONNECT MESSAGES RECEIVED</div>
      <div style="color:#8fd0f0;">¥NO ITIN MSGS¥</div>
    </div>
  `;
  term.appendChild(box);
  term.scrollTop = term.scrollHeight;
}

/* ---------------------------------------------------------------------
   INTERACTIVE AVAILABILITY — arrow or any booking-class bucket opens a
   Sabre-style seat-hold panel for that flight.
--------------------------------------------------------------------- */
const SB_AIRCRAFT_NAMES = {
  '788': 'BOEING 787-8',
  '789': 'BOEING 787-9',
  '77W': 'BOEING 777-300ER',
  '772': 'BOEING 777-200',
  '773': 'BOEING 777-300',
  '738': 'BOEING 737-800',
  '739': 'BOEING 737-900',
  '7M8': 'BOEING 737 MAX 8',
  '7M9': 'BOEING 737 MAX 9',
  '320': 'AIRBUS A320',
  '321': 'AIRBUS A321',
  '333': 'AIRBUS A330-300',
  '332': 'AIRBUS A330-200',
  '359': 'AIRBUS A350-900',
  '35K': 'AIRBUS A350-1000',
  '388': 'AIRBUS A380-800'
};

const SB_KNOWN_MILES = {
  'BKK-SIN': 876, 'SIN-BKK': 876,
  'DAC-BKK': 960, 'BKK-DAC': 960,
  'DAC-SIN': 1795, 'SIN-DAC': 1795,
  'DAC-KUL': 1625, 'KUL-DAC': 1625,
  'DAC-DXB': 2072, 'DXB-DAC': 2072,
  'DAC-DOH': 2450, 'DOH-DAC': 2450,
  'DAC-JED': 3150, 'JED-DAC': 3150,
  'DAC-DEL': 880, 'DEL-DAC': 880,
  'DAC-CCU': 150, 'CCU-DAC': 150,
  'DAC-KTM': 420, 'KTM-DAC': 420,
  'KUL-SIN': 185, 'SIN-KUL': 185,
  'DXB-SIN': 3635, 'SIN-DXB': 3635
};

function sbFormatHHMM(t) {
  if (!t) return '--:--';
  const clean = String(t).replace(':', '');
  if (clean.length < 4) return t;
  return `${clean.slice(0, 2)}:${clean.slice(2, 4)}`;
}

function sbCalcDuration(depT, arrT, dayOver = 0, tzDiff = '+00:00') {
  const dH = parseInt(String(depT).slice(0, 2), 10) || 0;
  const dM = parseInt(String(depT).slice(2, 4), 10) || 0;
  const aH = parseInt(String(arrT).slice(0, 2), 10) || 0;
  const aM = parseInt(String(arrT).slice(2, 4), 10) || 0;
  let total = (aH * 60 + aM + (dayOver * 1440)) - (dH * 60 + dM);
  const sign = tzDiff.startsWith('-') ? -1 : 1;
  const tzH = parseInt(tzDiff.slice(1, 3) || '0', 10);
  const tzM = parseInt(tzDiff.slice(4, 6) || '0', 10);
  total -= sign * (tzH * 60 + tzM);
  if (total <= 0) total += 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}h ${String(m).padStart(2, '0')}min`;
}

function sbFormatRowDuration(depT, arrT, dayOver = 0, tzDiff = '+00:00') {
  const dH = parseInt(String(depT).slice(0, 2), 10) || 0;
  const dM = parseInt(String(depT).slice(2, 4), 10) || 0;
  const aH = parseInt(String(arrT).slice(0, 2), 10) || 0;
  const aM = parseInt(String(arrT).slice(2, 4), 10) || 0;
  let total = (aH * 60 + aM + (dayOver * 1440)) - (dH * 60 + dM);
  const sign = tzDiff.startsWith('-') ? -1 : 1;
  const tzH = parseInt(tzDiff.slice(1, 3) || '0', 10);
  const tzM = parseInt(tzDiff.slice(4, 6) || '0', 10);
  total -= sign * (tzH * 60 + tzM);
  if (total <= 0) total += 1440;
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}H ${String(m).padStart(2, '0')}MIN`;
}

function sbLookupMiles(dep, arr) {
  const k = `${dep}-${arr}`;
  if (SB_KNOWN_MILES[k]) return SB_KNOWN_MILES[k];
  let h = 0;
  for (let i = 0; i < k.length; i++) h = (h * 31 + k.charCodeAt(i)) % 5000;
  return 850 + Math.abs(h % 3000);
}

function sbLookupTz(dep, arr) {
  const tz = {
    'DAC-BKK': '+01:00', 'BKK-DAC': '-01:00',
    'DAC-SIN': '+02:00', 'BKK-SIN': '+01:00', 'SIN-DAC': '-02:00',
    'DAC-KUL': '+02:00', 'KUL-DAC': '-02:00',
    'DAC-DXB': '-02:00', 'DXB-DAC': '+02:00',
    'DAC-DOH': '-03:00', 'DOH-DAC': '+03:00'
  };
  return tz[`${dep}-${arr}`] || '+01:00';
}

/* ---------------------------------------------------------------------
   INTERACTIVE AVAILABILITY — arrow or any booking-class bucket opens a
   Sabre-style compact, high-density seat-hold panel for that flight.
--------------------------------------------------------------------- */
function sbRenderAvailabilityBoard(options, date) {
  const term = document.getElementById('termArea');
  if (!term) return;
  const days = ['', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const firstLeg = options[0]?.legs[0];
  const board = document.createElement('section');
  board.className = 'sb-avail-board';
  board.innerHTML = `<div class="sb-avail-header">${date} ${days[Number(firstLeg?.day)] || '---'} &nbsp; ${firstLeg?.dep || ''} ${options[0]?.legs.at(-1)?.arr || ''}</div>`;

  options.forEach((option, index) => {
    const leg = option.legs[0];
    const finalLeg = option.legs.at(-1);
    const isConnection = option.legs.length > 1;
    const line = index + 1;
    const classes = leg.cls.split(' ');
    const isOdd = (index % 2 === 0);
    const rowClass = isOdd ? 'sb-row-odd' : 'sb-row-even';
    const rowDur = sbFormatRowDuration(leg.depT, leg.arrT, leg.dayOver, sbLookupTz(leg.dep, leg.arr));

    const row = document.createElement('div');
    row.className = `sb-avail-row ${rowClass}`;
    row.innerHTML = `
      <span class="sb-avail-num-air">${line} ${leg.al}</span>
      <span class="sb-avail-flight">${leg.fn}</span>
      <span class="sb-avail-classes"></span>
      <span class="sb-avail-route">${leg.dep} ${leg.arr}</span>
      <span class="sb-avail-time">${sbFormatHHMM(leg.depT)}</span>
      <span class="sb-avail-time">${sbFormatHHMM(leg.arrT)}${leg.dayOver ? ` +${leg.dayOver}` : ''}</span>
      <span class="sb-avail-eq">${leg.eq}</span>
      <span class="sb-avail-stops">0</span>
      <span class="sb-avail-dur">${rowDur}</span>
      <button class="sb-avail-arrow" type="button" aria-label="Open seat hold" title="Expand flight details">⌄</button>`;

    const detail = document.createElement('div');
    detail.className = 'sb-seat-hold';
    const tzDiff = sbLookupTz(leg.dep, finalLeg.arr);
    const flightDur = sbCalcDuration(leg.depT, finalLeg.arrT, finalLeg.dayOver, tzDiff);
    const miles = sbLookupMiles(leg.dep, finalLeg.arr);
    const terminal = (finalLeg.arr === 'SIN' || finalLeg.arr === 'BKK' || finalLeg.arr === 'DXB') ? '2' : '1';
    const eqName = SB_AIRCRAFT_NAMES[leg.eq] || `BOEING ${leg.eq}`;
    const meal = parseInt(flightDur, 10) >= 2 ? 'Meal' : 'Snack';

    detail.innerHTML = `
      <div class="sb-hold-wrap">
        <div class="sb-detail-line1">
          <span class="sb-detail-item"><b class="sb-detail-lbl">From:</b> ${leg.dep} ${date} at ${sbFormatHHMM(leg.depT)}</span>
          <span class="sb-detail-item"><b class="sb-detail-lbl">To:</b> ${finalLeg.arr} ${date} at ${sbFormatHHMM(finalLeg.arrT)} - TERMINAL ${terminal}</span>
          <span class="sb-detail-item"><b class="sb-detail-lbl">Flight Time:</b> ${flightDur}</span>
          <span class="sb-detail-item"><b class="sb-detail-lbl">Meals:</b> ${meal}</span>
          <span class="sb-detail-item"><b class="sb-detail-lbl">Equipment:</b> ${eqName}</span>
          <span class="sb-detail-item"><b class="sb-detail-lbl">Operates:</b> Everyday</span>
          <span class="sb-detail-item"><b class="sb-detail-lbl">On-Time:</b> No data</span>
          <span class="sb-detail-item"><b class="sb-detail-lbl">Air Miles:</b> ${miles}</span>
          <span class="sb-detail-item"><b class="sb-detail-lbl">Time Diff:</b> ${tzDiff}</span>
        </div>
        <div class="sb-detail-line2">
          <span class="sb-detail-item"><b class="sb-detail-lbl">Connectivity:</b> DCA</span>
          <span class="sb-detail-item"><b class="sb-detail-lbl">E-ticket:</b> Yes</span>
        </div>
        <div class="sb-hold-controls">
          <div class="sb-hold-ctrl-group">
            <label>Passengers</label>
            <select class="sb-pax-count">
              <option>1</option><option>2</option><option>3</option><option>4</option><option>5</option><option>6</option><option>7</option><option>8</option><option>9</option>
            </select>
          </div>
          ${isConnection ? `
          <div class="sb-hold-ctrl-group">
            <label>Class ${leg.dep}-${leg.arr}</label>
            <select class="sb-hold-class-leg1">
              ${classes.map(c => `<option value="${c.charAt(0)}">${c.charAt(0)}</option>`).join('')}
            </select>
          </div>
          <div class="sb-hold-ctrl-group">
            <label>Class ${finalLeg.dep}-${finalLeg.arr}</label>
            <select class="sb-hold-class-leg2">
              ${finalLeg.cls.split(' ').map(c => `<option value="${c.charAt(0)}">${c.charAt(0)}</option>`).join('')}
            </select>
          </div>
          ` : `
          <div class="sb-hold-ctrl-group">
            <label>Class ${leg.dep}-${leg.arr}</label>
            <select class="sb-hold-class">
              ${classes.map(c => `<option value="${c.charAt(0)}">${c.charAt(0)}</option>`).join('')}
            </select>
          </div>
          `}
          <div class="sb-hold-actions">
            <button class="sb-hold-sell" type="button">Sell</button>
            <button class="sb-hold-close" type="button" aria-label="Close" title="Collapse">⌃</button>
          </div>
        </div>
      </div>`;

    const arrowBtn = row.querySelector('.sb-avail-arrow');
    const classBox = row.querySelector('.sb-avail-classes');

    classes.forEach(bucket => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'sb-class-bucket';
      button.textContent = bucket;
      button.addEventListener('click', () => sbOpenSeatHold(line, bucket.charAt(0), detail, arrowBtn));
      classBox.appendChild(button);
    });

    const sellBtn = detail.querySelector('.sb-hold-sell');
    const closeBtn = detail.querySelector('.sb-hold-close');

    sellBtn.addEventListener('click', () => {
      const pax = detail.querySelector('.sb-pax-count').value;
      let primaryCls = 'Y';
      let selectedClasses = null;
      if (isConnection) {
        const cls1 = detail.querySelector('.sb-hold-class-leg1')?.value || 'Y';
        const cls2 = detail.querySelector('.sb-hold-class-leg2')?.value || 'Y';
        primaryCls = cls1;
        selectedClasses = [cls1, cls2];
      } else {
        primaryCls = detail.querySelector('.sb-hold-class')?.value || 'Y';
        selectedClasses = [primaryCls];
      }

      if (cmdSell(`0${primaryCls}${line}`, Number(pax), selectedClasses)) {
        detail.classList.remove('open');
        arrowBtn.textContent = '⌄';
        board.classList.add('sb-hold-locked');
      }
    });

    closeBtn.addEventListener('click', () => {
      detail.classList.remove('open');
      arrowBtn.textContent = '⌄';
    });

    arrowBtn.addEventListener('click', () => {
      const isOpen = detail.classList.contains('open');
      if (isOpen) {
        detail.classList.remove('open');
        arrowBtn.textContent = '⌄';
      } else {
        const defaultCls = classes.find(c => c.startsWith('Y'))?.charAt(0) || classes[0].charAt(0);
        sbOpenSeatHold(line, defaultCls, detail, arrowBtn);
      }
    });

    board.appendChild(row);

    if (isConnection) {
      const onwardClasses = finalLeg.cls.split(' ');
      const onward = document.createElement('div');
      onward.className = `sb-avail-row ${rowClass} sb-onward-leg`;
      const onwardDur = sbFormatRowDuration(finalLeg.depT, finalLeg.arrT, finalLeg.dayOver, sbLookupTz(finalLeg.dep, finalLeg.arr));
      onward.innerHTML = `
        <span class="sb-avail-num-air">↳ ${finalLeg.al}</span>
        <span class="sb-avail-flight">${finalLeg.fn}</span>
        <span class="sb-avail-classes"></span>
        <span class="sb-avail-route">${finalLeg.arr}</span>
        <span class="sb-avail-time">${sbFormatHHMM(finalLeg.depT)}&nbsp;&nbsp;${sbFormatHHMM(finalLeg.arrT)}${finalLeg.dayOver ? ` +${finalLeg.dayOver}` : ''}</span>
        <span class="sb-avail-eq">${finalLeg.eq}</span>
        <span class="sb-avail-stops">0</span>
        <span class="sb-avail-dur">${onwardDur}</span>
        <button class="sb-avail-arrow" type="button" aria-label="Open seat hold" title="Expand flight details">⌄</button>`;

      const onwardBox = onward.querySelector('.sb-avail-classes');
      const onwardArrow = onward.querySelector('.sb-avail-arrow');

      onwardClasses.forEach(bucket => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'sb-class-bucket';
        button.textContent = bucket;
        button.addEventListener('click', () => sbOpenSeatHold(line, bucket.charAt(0), detail, onwardArrow));
        onwardBox.appendChild(button);
      });

      onwardArrow.addEventListener('click', () => {
        const isOpen = detail.classList.contains('open');
        if (isOpen) {
          detail.classList.remove('open');
          onwardArrow.textContent = '⌄';
        } else {
          const defaultCls = onwardClasses.find(c => c.startsWith('Y'))?.charAt(0) || onwardClasses[0].charAt(0);
          sbOpenSeatHold(line, defaultCls, detail, onwardArrow);
        }
      });

      board.appendChild(onward);
      const connectionNote = document.createElement('div');
      connectionNote.className = 'sb-connection-note';
      connectionNote.textContent = `CONNECTION VIA ${leg.arr} — 2 SEGMENTS WILL BE SOLD TOGETHER`;
      board.appendChild(connectionNote);
    }
    board.appendChild(detail);
  });
  term.appendChild(board);
  board.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

function sbOpenSeatHold(line, bookingClass, detail, arrowBtn) {
  document.querySelectorAll('.sb-seat-hold.open').forEach(panel => {
    panel.classList.remove('open');
  });
  document.querySelectorAll('.sb-avail-arrow').forEach(btn => {
    btn.textContent = '⌄';
  });
  const singleCls = detail.querySelector('.sb-hold-class');
  if (singleCls) singleCls.value = bookingClass;
  const leg1Cls = detail.querySelector('.sb-hold-class-leg1');
  if (leg1Cls) leg1Cls.value = bookingClass;
  detail.classList.add('open');
  if (arrowBtn) arrowBtn.textContent = '⌃';
  detail.scrollIntoView({ block: 'nearest' });
}

function sbSyncSidePanel() {
  const pnrLine = document.getElementById('panelPnrLine');
  const msg = document.getElementById('panelMsg');
  if (pnrLine) {
    pnrLine.textContent = sbState.locator
      ? `${sbState.locator}.${sbState.officeId || '3MUL'}`
      : `${SB_OFFICE}.${SB_OFFICE}`;
  }
  if (msg) {
    msg.textContent = sbState.ticketed ? "TICKETED" : (sbState.locator ? "ACTIVE PNR" : "NO MESSAGE");
  }
  const tabA = document.querySelector('#wsA .code');
  if (tabA) {
    if (sbState.locator && sbState.names.length) {
      const firstPax = sbState.names[0];
      const pName = `${firstPax.surname || ''} ${firstPax.first || ''} ${firstPax.title || ''}`.trim() || firstPax.raw.replace('/', ' ');
      tabA.textContent = `${sbState.locator} - ${pName}`;
    } else {
      tabA.textContent = SB_OFFICE;
    }
  }
  if (typeof sbRefreshPanelView === 'function') sbRefreshPanelView();
}

/* ---------------------------------------------------------------------
   RENDER — Sabre-style PNR display (*R format)
--------------------------------------------------------------------- */
function sbRenderPNR(isEr = false) {
  if (!sbState.locator && sbState.booked.length === 0) {
    return "NO ACTIVE PNR — SELL A SEGMENT AND ADD A NAME FIRST";
  }
  const lines = [];

  // Names with 1.1, 2.1 and infant 3.I/1... indexing matching Sabre screenshots
  const adtAndChd = [];
  const inf = [];
  let paxCounter = 1;

  (sbState.names || []).forEach((pax) => {
    if (pax.paxType === 'INF') {
      inf.push(pax);
    } else {
      adtAndChd.push({ pax, num: paxCounter++ });
    }
  });

  const nameParts = adtAndChd.map(({ pax, num }) => {
    const ageTag = (pax.paxType === 'CHD' && pax.age) ? `*C${pax.age}` : '';
    const title = pax.title ? ` ${pax.title}` : '';
    return `${num}.1${pax.surname}/${pax.first}${title}${ageTag}`;
  });

  if (nameParts.length) {
    lines.push(` ${nameParts.join('  ')}`);
  } else {
    lines.push(' 1.1NAME PENDING');
  }

  inf.forEach((pax) => {
    const ageTag = pax.age ? `*I${pax.age}` : '';
    const title = pax.title ? ` ${pax.title}` : '';
    lines.push(` ${paxCounter++}.I/${pax.associatedAdultRef || 1}${pax.surname}/${pax.first}${title}${ageTag}`);
  });

  // Flight segments
  sbState.booked.forEach((s, i) => {
    const dayOverTag = s.dayOver ? `+${s.dayOver}` : '';
    const st = sbState.locator ? s.status.replace(/^SS/, 'HK') : s.status;
    if (!s.dcLocator) s.dcLocator = sbRandomLocator();
    const directConnect = isEr ? `  /DC${s.al} /E` : `  /DC${s.al}*${s.dcLocator} /E`;
    lines.push(
      ` ${i + 1} ${s.al} ${s.fn}${s.cls} ${s.date} ${s.day} ${s.dep}${s.arr} ${st}  ${s.depT}  ${s.arrT}${dayOverTag}${directConnect}`
    );
  });

  // Sabre redisplays a saved PNR with this explicit marker after XI removes
  // every segment during an exchange. It confirms that the cancellation was
  // stored and that the trainee may now sell the replacement itinerary.
  if (!sbState.booked.length && sbState.locator) lines.push("NO ITIN");

  // Ticketing arrangement
  if (sbState.ticketingArrangement) {
    lines.push("TKT/TIME LIMIT");
    lines.push(`  1.${sbState.ticketingArrangement}`);
  } else if (sbState.locator) {
    lines.push("TKT/TIME LIMIT");
    lines.push("  1.T-");
  }

  // Phones
  if (sbState.phones.length) {
    lines.push("PHONES");
    sbState.phones.forEach((p, i) => lines.push(`  ${i + 1}.${p.raw}`));
  }

  // General facts & SSR (matching Sabre screenshots 1 & 2)
  if (sbState.locator) {
    lines.push("PASSENGER DETAIL FIELD EXISTS - USE PD TO DISPLAY");
    lines.push("GENERAL FACTS");
    const mainAl = sbState.booked[0]?.al || 'SQ';
    const firstLeg = sbState.booked[0];
    const d = new Date();
    const mon = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][d.getMonth()];
    const dt = `${String(d.getDate()).padStart(2,'0')}${mon}`;

    let gfIdx = 1;

    // Check for child SSR
    const chdEntry = (sbState.ssrEntries || []).find(s => /CHLD/i.test(typeof s === 'string' ? s : (s.text || '')));
    if (chdEntry) {
      const txt = typeof chdEntry === 'string' ? chdEntry : chdEntry.text;
      const dobMatch = txt.match(/CHLD\/([A-Z0-9]+)/i);
      const dob = dobMatch ? dobMatch[1] : '11SEP19';
      lines.push(`  ${gfIdx++}.SSR CHLD ${mainAl} HK1/${dob}`);
    }

    // Check for infant SSR
    const infEntry = (sbState.ssrEntries || []).find(s => /INFT/i.test(typeof s === 'string' ? s : (s.text || '')));
    if (infEntry) {
      const txt = typeof infEntry === 'string' ? infEntry : infEntry.text;
      const parts = txt.replace(/^SSR\s+/i, '').replace(/^3?INFT\d*\/?/i, '').split('/');
      let infName = 'INFANT';
      let infDob = '02SEP25';
      if (parts.length >= 2) {
        infName = parts[0].trim();
        infDob = parts[1].split('-')[0].trim();
      }
      const dep = firstLeg ? firstLeg.dep : 'SIN';
      const arr = firstLeg ? firstLeg.arr : 'BKK';
      const fn = firstLeg ? String(firstLeg.fn).padStart(4, '0') : '0710';
      const fDate = firstLeg ? firstLeg.date : `${dt}`;
      const cls = firstLeg ? firstLeg.cls : 'B';
      const segTag = `${dep}${arr}${fn}${cls}${fDate}`;
      const status = isEr ? 'NN1' : 'KK1';
      lines.push(`  ${gfIdx++}.SSR INFT ${mainAl} ${status} ${segTag}/${infName}/${infDob}`);
    }

    // Check if any CTCM/CTCE/CTCR is present
    const hasContactSsr = (sbState.ssrEntries || []).some(s => {
      const txt = typeof s === 'string' ? s : (s.text || '');
      return /CTC[MER]/i.test(txt);
    });

    // If IR screen: add ADTK and OTHS advisories exactly as in Screenshot 2
    if (!isEr) {
      const advDate = new Date(d.getTime() + 21 * 24 * 60 * 60 * 1000);
      const advMon = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][advDate.getMonth()];
      const advDt = `${String(advDate.getDate()).padStart(2,'0')}${advMon}`;
      // Let the terminal wrap long advisories naturally.  A manually inserted
      // second line could leave an empty-looking block at the start of it.
      lines.push(`  ${gfIdx++}.SSR ADTK 1B TO ${mainAl} BY ${advDt} 2300 DAC TIME ZONE OTHERWISE WILL BE XLD`);
      if (!hasContactSsr) {
        lines.push(`  ${gfIdx++}.SSR OTHS 1B MISSING SSR CTCM MOBILE OR SSR CTCE EMAIL OR SSR CTCR NON-CONSENT FOR ${mainAl}`);
      }
    }

    // Any other custom SSR (CTCM, CTCE, CTCR, meals, etc.)
    (sbState.ssrEntries || []).forEach(s => {
      const rawText = typeof s === 'string' ? s : (s.text || '');
      if (!/CHLD|INFT/i.test(rawText)) {
        lines.push(`  ${gfIdx++}.${rawText}`);
      }
    });

    // Travel documents such as passport DOCS and visa DOCO appear in General Facts.
    (sbState.documents || []).forEach(doc => {
      const code = doc.code || 'DOCS';
      const paxRef = doc.subjectPaxRef || doc.paxRef || 1;
      const pax = sbState.names[paxRef - 1]?.raw || 'PASSENGER';
      const text = String(doc.raw || '').replace(new RegExp(`^${code}/`, 'i'), '').replace(/-\d+\.\d+$/, '');
      lines.push(`  ${gfIdx++}.SSR ${code} ${doc.carrier || mainAl} HK1/${text}  ${paxRef}.1 ${pax}`);
    });
  }

  // Fare quote
  if (sbState.fareQuote) {
    const fq = sbState.fareQuote;
    lines.push(`FARE  ${fq.currency}${fq.base}  TAX ${fq.currency}${fq.tax}  TOTAL ${fq.currency}${fq.total}` +
      (fq.pax > 1 ? `  (${fq.pax} PAX)` : ''));
  }

  if (sbState.invoiced) {
    const fare = sbState.fareQuote;
    const currentTicketNo = (sbState.eticketNumber || '').replace('-', '');
    // Reissue displays retain the original accounting line first, followed by
    // the newly issued ticket line, as in the Sabre PNR display.
    const ticketNo = sbState.exchangedTicketNo || currentTicketNo;
    const carrier = sbState.privateFare?.carrier || sbState.booked[0]?.al || 'MH';
    const pax = sbState.names[0]?.raw || 'PASSENGER';
    lines.push('INVOICED');
    lines.push('PRICE QUOTE RECORD - AUTOPRICED');
    lines.push('SECURITY INFO EXISTS *P3D OR *P4D TO DISPLAY');
    lines.push('ACCOUNTING DATA');
    lines.push(` 1.  ${carrier}¥${ticketNo}/      7/      ${fare?.base || 0}/  ${fare?.tax || 0}/ONE/CA 1.1${pax}/1/F/E`);
    if (sbState.exchangedTicketNo) {
      const addCollect = Number(sbState.exchangeCollect || 0);
      lines.push(` 2.  ${carrier}¥${currentTicketNo}/      0/      ${fare?.base || 0}/  ${fare?.tax || 0}/${addCollect}/ONE/CA 1.1${pax}/1/F/E`);
    }
  }

  // Received From
  if (sbState.receivedFrom) {
    lines.push(`RECEIVED FROM - ${sbState.receivedFrom}`);
  }

  // General Remarks
  if (sbState.remarks && sbState.remarks.length) {
    lines.push('GENERAL REMARKS');
    sbState.remarks.forEach((r, i) => lines.push(`  ${i + 1}.${r}`));
  }

  // A Sabre WV redisplay removes the electronic ticket lines and leaves the
  // ticketing arrangement in place; the void confirmation is shown by WV.
  if (sbState.refunded) {
    if (sbState.refundTransaction) {
      const label = sbState.refundTransaction.type === 'partial' ? 'PARTIAL REFUND PROCESSED' : 'REFUND PROCESSED';
      lines.push(`${label} ${sbState.refundTransaction.currency} ${sbState.refundTransaction.total.toFixed(2)}`);
      lines.push(`REFUNDED TICKET ${sbState.refundTransaction.ticket}`);
    } else {
      lines.push('REFUND PROCESSED');
    }
  }
  if (sbState.exchangedTicketNo) {
    lines.push(`EXCHANGED FROM TICKET ${sbState.exchangedTicketNo}`);
    lines.push(`EXCHANGE ADD COLLECT ${sbState.fareQuote?.currency || 'BDT'} ${sbState.exchangeCollect || 0}`);
    if (sbState.changeFeeEmd) lines.push(`CHANGE FEE EMD ${sbState.fareQuote?.currency || 'BDT'} ${sbState.changeFeeEmd} ${sbState.changeFeeEmdNo || ''}`.trim());
  }

  // Footer line matching 3MUL.3MUL*ATE 1218/29SEP26 RODXAE H M
  if (sbState.locator) {
    lines.push(`${sbState.officeId || '3MUL'}.${sbState.officeId || '3MUL'}*ATE ${sbSabreFooterStamp()} ${sbState.locator} H M`);
  } else {
    lines.push("*** NOT YET STORED — USE E TO END/SAVE ***");
  }

  return lines.join('\n');
}

/* ---------------------------------------------------------------------
   UTILITIES
--------------------------------------------------------------------- */
function sbSabreFooterStamp() {
  const d = new Date();
  const mon = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][d.getMonth()];
  const time = `${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}`;
  const date = `${String(d.getDate()).padStart(2,'0')}${mon}${String(d.getFullYear()).slice(2)}`;
  return `${time}/${date}`;
}
function sbRandomLocator() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
function sbNowStamp() {
  const d = new Date();
  const mon = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"][d.getMonth()];
  return `${String(d.getDate()).padStart(2,'0')}${mon}${String(d.getFullYear()).slice(2)}/${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}Z`;
}
