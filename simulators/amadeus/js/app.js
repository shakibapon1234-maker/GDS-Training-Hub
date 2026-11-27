const OFFICE_ID = "DACVS3334";
// ---------- Lesson Training PNR (Turkish Airlines - J99GZO) ----------
const LESSON_PNR = {
  locator: "J99GZO",
  officeId: "DACVS3334",
  agentCode: "BS/GS",
  dateStamp: "13NOV24/1435Z",
  passengers: [
    { type: 'adult', label: "AHMED/MD AMIR MR", nameDisplay: "AHMED Md Amir", code: "P1" },
    { type: 'child', label: "AHMED/MD ISMAIL MSTR(CHD/08SEP16)", nameDisplay: "AHMED Md Ismail", code: "P2", dob: "08SEP16" },
    { type: 'infantCarrier', label: "BEGUM/AKLIMA MS(INFISLAM/SANJIDA MISS/25MAR24)", nameDisplay: "BEGUM Aklima", code: "P3",
      infant: { surname: "ISLAM", first: "SANJIDA", title: "MISS", dob: "25MAR24", display: "ISLAM Sanjida (Mar 25, 2024)" } }
  ],
  segments: [
    { al:"TK", fn:"713",  cls:"Y", date:"25MAR", day:"2*", dep:"DAC", arr:"IST", status:"HK", count:3, depT:"0655", arrT:"1325", eq:"77W", tktCode:"TK/VB7BHH", fullDate:"Mar 25, 2025" },
    { al:"TK", fn:"1971", cls:"Y", date:"25MAR", day:"2*", dep:"IST", arr:"LHR", status:"HK", count:3, depT:"1500", arrT:"1610", eq:"321", tktCode:"TK/VB7BHH", fullDate:"Mar 25, 2025" },
    { al:"TK", fn:"1988", cls:"Y", date:"30MAR", day:"7*", dep:"LHR", arr:"IST", status:"HK", count:3, depT:"0630", arrT:"1235", eq:"321", tktCode:"TK/VB7BHH", fullDate:"Mar 30, 2025" },
    { al:"TK", fn:"712",  cls:"Y", date:"30MAR", day:"7*", dep:"IST", arr:"DAC", status:"HK", count:3, depT:"1835", arrT:"0500", eq:"77W", tktCode:"TK/VB7BHH", fullDate:"Mar 30, 2025" }
  ],
  phone: "DAC AGT ITC CEL 01975481616 REF BAYEZID",
  ticketing: "TL13NOV/DACVS3334",
  finalized: true,
  showOths: true,
  showFE: true,
  seats: {},
  // Special Service Requests — pre-loaded to match the full lesson video PNR
  specialSSRs: [
    { type:'CTCE', al:'TK', status:'HK1', value:'BAYEZID.SARDAR//GMAIL.COM', pax:'P1' },
    { type:'CTCM', al:'TK', status:'HK1', value:'008801975481616',            pax:'P1' },
    { type:'CTCE', al:'TK', status:'HK1', value:'BAYEZID//GMAIL.COM',         pax:'P2' },
    { type:'CTCE', al:'TK', status:'HK1', value:'BAYEZID//GMAIL.COM',         pax:'P3' },
    { type:'CTCM', al:'TK', status:'HK1', value:'008801975481616',            pax:'P2' },
    { type:'CTCM', al:'TK', status:'HK1', value:'008801975481616',            pax:'P3' },
    { type:'CHML', al:'TK', status:'NN1', allSegs:true, pax:'P2' },
    { type:'BBML', al:'TK', status:'NN1', allSegs:true, pax:'P3' },
    { type:'BSCT', al:'TK', status:'NN1', allSegs:true, pax:'P3' }
  ],
  osiEntries: [
    { al:'TK', text:'VIP MINISTER M/O INFORMATION', pax:'P1' }
  ],
  hasPending: false
};

// ---------- Thai Airways Training PNR (Matching Screenshot 1 - OGJZJ9) ----------
const THAI_PNR = {
  locator: "OGJZJ9",
  officeId: "DACVS31XW",
  agentCode: "BP/AS",
  dateStamp: "1JUL18/0930Z",
  headerLine2: "DACVS31XW/4455BP/1JUL18",
  passengers: [
    { type: 'child', label: "AHMED/KARIM MSTR(CHD/01FEB14)", nameDisplay: "AHMED Karim", code: "P1", dob: "01FEB14" },
    { type: 'infantCarrier', label: "AHMED/SHAMIMA MRS(INFAHMED/TAHERA MISS/19JAN18)", nameDisplay: "AHMED Shamima", code: "P2",
      infant: { surname: "AHMED", first: "TAHERA", title: "MISS", dob: "19JAN18", display: "AHMED Tahera (Jan 19, 2018)" } }
  ],
  segments: [
    { al:"TG", fn:"322", cls:"W", date:"12OCT", day:"5", dep:"DAC", arr:"BKK", status:"HK", count:2, depT:"1335", arrT:"1700", arrDate:"12OCT", eq:"777", tktCode:"TG/OGJZJ9", fullDate:"Oct 12, 2018" },
    { al:"TG", fn:"321", cls:"W", date:"20OCT", day:"6", dep:"BKK", arr:"DAC", status:"HK", count:2, depT:"1035", arrT:"1210", arrDate:"20OCT", eq:"777", tktCode:"TG/OGJZJ9", fullDate:"Oct 20, 2018" }
  ],
  phone: "XYZ 12345678 C/O MR Z",
  ticketing: "OK01JUL/DACVS31XW",
  finalized: true,
  hasTST: true,
  fop: "INV",
  showOths: false,
  showFE: false,
  seats: {},
  tstRecords: [
    { tstNum: 1, pCode: '.1', name: 'AHMED/KARIM', fare: 13529, tax: 6084, total: 19613, ptc: 'CH', segs: '3-4' },
    { tstNum: 2, pCode: '.2', name: 'AHMED/SHAMIMA', fare: 13529, tax: 7584, total: 21113, ptc: 'ADT', segs: '3-4' },
    { tstNum: 3, pCode: '.2 I', name: 'AHMED/TAHERA(INF)', fare: 6640, tax: 252, total: 6892, ptc: 'IN', segs: '3-4' }
  ],
  specialSSRs: [
    { type:'MOML', al:'TG', status:'HK1', allSegs:true, pax:'P2' },
    { type:'CHML', al:'TG', status:'HK1', allSegs:true, pax:'P1' },
    { type:'BBML', al:'TG', status:'HK1', allSegs:true, pax:'P2' },
    { type:'BSCT', al:'TG', status:'HN1', allSegs:true, pax:'P2' }
  ],
  opwRemarks: [
    "OPW-03JUL:1600/1C7/TG REQUIRES TICKET ON OR BEFORE\n       04JUL:1600/S3-4"
  ],
  osiEntries: [],
  hasPending: false
};

function createEmptyState() {
  return {
    locator: null,
    officeId: OFFICE_ID,
    agentCode: null,
    dateStamp: null,
    passengers: [],
    segments: [],
    phone: null,
    ticketing: null,
    commission: null,
    finalized: false,
    hasTST: false,
    hasPricingRequest: false,
    tstData: null,
    specialSSRs: [],
    osiEntries: [],
    seats: {},
    docsEntries: [],
    warnedMissingCTC: false,
    airlineAdvOths: null,
    hasPending: false
  };
}

// Current Session State - Starts completely clean & fresh upon login/refresh!
var state = createEmptyState();
if(typeof window !== 'undefined') window.state = state;
if(typeof global !== 'undefined') global.state = state;
// Completed PNRs are kept independently from the active workspace.  This is
// what lets IG discard a transaction without cancelling a record that was
// already ended with ER/ET.
const SAVED_PNR_KEY = 'amaduce_savedPnrs';
function loadSavedPNRs(){
  try { return JSON.parse(localStorage.getItem(SAVED_PNR_KEY)) || {}; }
  catch(e) { return {}; }
}
function saveCurrentPNR(){
  if(!state.locator || !state.finalized) return;
  const records = loadSavedPNRs();
  const record = JSON.parse(JSON.stringify(state));
  // Keep a real local creation timestamp for LPO/K date searches.
  record.createdAt = record.createdAt || new Date().toISOString();
  record.justEndedRecord = false;
  records[state.locator.toUpperCase()] = record;
  try { localStorage.setItem(SAVED_PNR_KEY, JSON.stringify(records)); } catch(e) {}
}
// Save current PNR state even when not fully finalized — used mid-exchange to
// persist XE / SS changes so RT <locator> does not reload the stale saved copy.
function saveCurrentPNRForExchange(){
  if(!state.locator) return;
  const records = loadSavedPNRs();
  const record = JSON.parse(JSON.stringify(state));
  record.createdAt = record.createdAt || new Date().toISOString();
  record.justEndedRecord = false;
  records[state.locator.toUpperCase()] = record;
  try { localStorage.setItem(SAVED_PNR_KEY, JSON.stringify(records)); } catch(e) {}
}
function getSavedPNR(locator){
  const records = loadSavedPNRs();
  const upper = String(locator || '').toUpperCase();
  if(records[upper]) return records[upper];
  for(const k in records){
    const r = records[k];
    if(r && r.segments && r.segments.some(s => (s.airlineLocator && s.airlineLocator.toUpperCase() === upper) || (s.confirmedEndCode && s.confirmedEndCode.toUpperCase().includes('/' + upper)))){
      return r;
    }
  }
  return null;
}
function removeSavedPNR(locator){
  if(!locator) return;
  const records = loadSavedPNRs();
  delete records[String(locator).toUpperCase()];
  try { localStorage.setItem(SAVED_PNR_KEY, JSON.stringify(records)); } catch(e) {}
}
function loadSavedPNR(record){
  state = JSON.parse(JSON.stringify(record));
  state.justEndedRecord = false;
  activeSegIdx = 0;
  activePaxCode = 'P1';
  renderPNR();
  mountInput();
  showToast(`Retrieved PNR ${state.locator}`);
}
let activeSegIdx = 0;
let activePaxCode = "P1"; // currently assigning for this passenger
let lastNameSearch = null;
let lastLpoResults = null;

function loadThaiAirwaysPNR(){
  state = JSON.parse(JSON.stringify(THAI_PNR));
  activeSegIdx = 0;
  activePaxCode = "P1";
  term.innerHTML = '';
  printPromptEcho("RT OGJZJ9");
  renderPNR();
  mountInput();
  showToast("Loaded Thai Airways PNR OGJZJ9 (Screenshot 1)");
}

// ---------- Jhony Training PNR (Matching Screenshot 1 & 2 - ICRBPO) ----------
const JHONY_PNR = {
  locator: "ICRBPO",
  officeId: "DACVS31XW",
  agentCode: "BP/AS",
  dateStamp: "17JUN26/1324Z",
  headerLine2: "DACVS31XW/4455BP/17JUN26",
  passengers: [
    { type: 'adult', label: "JHONY/MD MR Male", nameDisplay: "MR MD JHONY", code: "P1", passport: "A99887767" }
  ],
  segments: [
    { al:"BG", fn:"555", cls:"Y", date:"25JUL", day:"7", dep:"DAC", arr:"SIN", status:"HK", count:1, depT:"1659", arrT:"2059", arrDate:"25JUL", eq:"739", tktCode:"BG/54FHGK", fullDate:"2026-07-25", depTerminal:"2", arrTerminal:"1", baggage:"20 KG", cabin:"Economy" }
  ],
  phone: "DAC JHONY TECH TRAVEL CTC0505793144",
  ticketing: "OK18JUN/DACVS31XW/ET",
  commission: "7%",
  finalized: true,
  ticketed: true,
  hasTST: true,
  fop: "INV",
  showOths: false,
  showFE: false,
  seats: {},
  docsEntries: [
    {
      airline: "BG",
      action: "HK1",
      docType: "P",
      country: "BGD",
      docNumber: "A99887767",
      nationality: "BGD",
      dob: "15MAY90",
      gender: "M",
      expiry: "20DEC32",
      surname: "JHONY",
      firstName: "MD",
      pax: "P1"
    }
  ],
  tickets: [
    {
      tktNum: "157-7800396554421",
      name: "JHONY/MD MR Male",
      pax: "P1",
      amount: 30000,
      fare: 24000,
      tax: 6000,
      alLetter: "BG",
      flightNum: "555",
      cls: "Y",
      date: "25JUL",
      dep: "DAC",
      arr: "SIN",
      tktDate: "17JUN26",
      office: "DACVS31XW",
      status: "OK",
      couponStatuses: ["O"],
      itinerary: [
        { al: "BG", fn: "555", cls: "Y", date: "25JUL", dep: "DAC", arr: "SIN", status: "OK", depT: "1659", arrT: "2059", depTerminal:"2", arrTerminal:"1", baggage:"20 KG", cabin:"Economy" }
      ]
    }
  ],
  tstRecords: [
    { tstNum: 1, pCode: '.1', name: 'JHONY/MD MR', fare: 24000, tax: 6000, total: 30000, ptc: 'ADT', segs: '2' }
  ],
  specialSSRs: [],
  opwRemarks: [],
  osiEntries: [],
  hasPending: false
};

function loadJhonyPNR(){
  state = JSON.parse(JSON.stringify(JHONY_PNR));
  activeSegIdx = 0;
  activePaxCode = "P1";
  term.innerHTML = '';
  printPromptEcho("RT ICRBPO");
  renderPNR();
  mountInput();
  showToast("Loaded JHONY PNR ICRBPO (Screenshot 1)");
}

// ---------- APON Training PNR (RT7PHIKV reference) ----------
// This record mirrors the PNR shown in the original Selling Platform Connect
// capture, so students can retrieve it with either RT7PHIKV or RT 7PHIKV.
const APON_PNR = {
  locator: "7PHIKV",
  officeId: "DACVS33GT",
  agentCode: "SS/GS",
  dateStamp: "16SEP26/1158Z",
  headerLine2: "DACVS33GT/0002SS/16SEP26",
  passengers: [
    { type: 'adult', label: "APON/SHAKIB MR", nameDisplay: "APON SHAKIB", code: "P1" }
  ],
  segments: [
    { al:"PG", fn:"4824", cls:"H", date:"12DEC", day:"6", dep:"DAC", arr:"BKK", status:"HK", count:1, depT:"0200", arrT:"0530", arrDate:"12DEC", eq:"", confirmedEndCode:"E  PG/7PHIKV", fullDate:"Dec 12, 2026" }
  ],
  phone: "AGT WEINGSGFLSY 0157B",
  ticketing: "TL16SEP/DACVS33GT",
  extraDisplayEntries: [
    "SSR ZZ 31572985707324 - PLS ADV PAX EMAIL AND MOBILE PER\n       SSR CTCM CTCE"
  ],
  opwRemarks: [
    "OPW-16OCT:1757/1C7/PG REQUIRES TICKET ON OR BEFORE\n       07OCT:1757 DAC TIME ZONE/TKT/S2"
  ],
  opcRemarks: [
    "OPC-07OCT:1757/1C8/PG CANCELLATION DUE TO NO TICKET DAC TIME\n       ZONE/TKT/S2"
  ],
  finalized: true,
  showOths: false,
  showFE: false,
  seats: {},
  specialSSRs: [],
  osiEntries: [],
  hasPending: false
};

function loadAponPNR(){
  state = JSON.parse(JSON.stringify(APON_PNR));
  activeSegIdx = 0;
  activePaxCode = "P1";
  term.innerHTML = '';
  printPromptEcho("RT7PHIKV");
  renderPNR();
  mountInput();
  showToast("Loaded APON PNR 7PHIKV");
}

const term = document.getElementById('term');
const seatmapOverlay = document.getElementById('seatmapOverlay');
const segmentSelect = document.getElementById('segmentSelect');
const seatTooltip = document.getElementById('seatTooltip');

let splitState = {
  horizontal: false,
  vertical: false
};
let activePaneId = 1;

function getPaneTerm(paneId = 1) {
  if (paneId === 2) return document.getElementById('term2') || term;
  if (paneId === 3) return document.getElementById('term3') || term;
  if (paneId === 4) return document.getElementById('term4') || term;
  return document.getElementById('term') || term;
}

function esc(s){ return (s+"").replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

let latestCommandPromptEl = null;

function printRaw(html){
  const d = document.createElement('div');
  d.className = 'out';
  d.innerHTML = html;
  const target = getPaneTerm(activePaneId || 1);
  if (target) target.appendChild(d);
}

function printLines(lines, cls){
  printRaw(lines.map(l => `<div class="line ${cls||''}">${l}</div>`).join(''));
}

function printPromptEcho(cmd){
  const target = getPaneTerm(activePaneId || 1);
  const d = document.createElement('div');
  d.className = 'line prompt-line';
  d.innerHTML = `<span class="chevron">&gt;</span> ${esc(cmd)}`;
  if (target) {
    target.appendChild(d);
    latestCommandPromptEl = d;
    const blank = document.createElement('div');
    blank.className = 'line';
    blank.innerHTML = '&nbsp;';
    target.appendChild(blank);
  }
}

function scrollToLatestCommand(){
  if(!term) return;
  term.scrollTop = 0;
}

// Render PNR exactly matching Screenshot 1 with clickable booking class links
// Helper to render authentic Amadeus building segment lines with mandatory advisory lines (Screenshot 1)
// Helper: compute next-day date string from a base date string like "23NOV"
function getNextDayDate(dateStr) {
  const m = (dateStr || '').match(/^(\d{1,2})([A-Z]{3})/i);
  if (!m) return '';
  const months = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
  const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const day = parseInt(m[1], 10);
  const mon = m[2].toUpperCase();
  const monIdx = months[mon];
  if (monIdx === undefined) return '';
  const travelDate = resolveFlightDate(dateStr);
  const d = new Date(travelDate.getFullYear(), monIdx, day + 1);
  return `${d.getDate()}${monthNames[d.getMonth()]}`;
}

// Flight commands often contain DDMMM without a year. Resolve that date to
// its next occurrence from the user's local calendar date, and preserve an
// explicit year when the search supplied one.
function resolveFlightDate(dateStr, baseDate = new Date()){
  const m = String(dateStr || '').trim().match(/^D?(\d{1,2})(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(\d{2}|\d{4})?$/i);
  if(!m) return new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const months = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
  const day = parseInt(m[1], 10);
  const month = months[m[2].toUpperCase()];
  const yearText = m[3];
  let year = yearText ? parseInt(yearText, 10) : baseDate.getFullYear();
  if(yearText && yearText.length === 2) year += year < 70 ? 2000 : 1900;
  let date = new Date(year, month, day);
  if(date.getMonth() !== month || date.getDate() !== day) return new Date(NaN);
  if(!yearText){
    const today = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
    if(date < today) date = new Date(year + 1, month, day);
  }
  return date;
}

function formatSegmentBuildingLines(seg, sIdx, totalSegs, segLineNum){
  if(seg.isARNK){
    return [`${segLineNum.toString().padStart(2, ' ')}  ARNK`];
  }
  if(seg.isOpen){
    const dateDisplay = (seg.date && seg.date !== 'OPEN') ? `${seg.date} ` : '     ';
    return [`${segLineNum.toString().padStart(2, ' ')}  ${seg.al} OPEN ${seg.cls} ${dateDisplay} ${seg.dep}${seg.arr}  OPEN`];
  }
  const lines = [];
  const sNum = segLineNum.toString().padStart(2, ' ');
  const classLink = `<span class="seg-class-link" onclick="openSeatMap(${sIdx})" title="Click to view Seat Map for this flight (${seg.al} ${seg.fn})">${seg.cls}</span>`;

  const depT = seg.depT || '0000';
  const rawArrT = seg.arrT || '0000';
  const isNextDay = rawArrT.includes('+1');
  // Display arrival time without '+1' suffix
  const arrTClean = rawArrT.replace(/\+\d+$/, '');
  const timeStr = `${depT} ${arrTClean}`;
  const dateStr = seg.date || '12NOV';
  const dayStr = seg.day || getDayOfWeek(dateStr);
  const fnPadded = seg.fn.toString().length < 4 ? seg.fn.toString().padStart(3, ' ') : seg.fn.toString();
  const stCount = `${seg.status || 'DK'}${seg.count || 1}`;
  const eq = seg.eq || '77W';

  // Compute arrival date: next day or same day
  const arrDateStr = isNextDay ? getNextDayDate(dateStr) : dateStr;
  // Spacing: after times, either show arrival date or spaces, then equipment
  // Format: depT arrTClean   [arrDate ]E 0 [eq] M
  const afterTimes = `   ${arrDateStr} E 0 ${eq} M`;

  // Air India (matches Screenshot 3: 1*DACDEL, 2100 2320 10FEB E 0 32A, SEE RTSVC)
  if(seg.al === 'AI'){
    const fnStr = (String(seg.fn).length >= 4) ? `AI${seg.fn}` : `AI ${seg.fn}`;
    const fnDisplay = `<span class="al">${fnStr}</span>`.padEnd(8, ' ');
    const dayStr = seg.day || '1*';
    const arrDateDisplay = (seg.arrT && seg.arrT.includes('+1')) ? getNextDayDate(dateStr) : dateStr;
    lines.push(
      `${sNum}  ${fnDisplay} ${classLink} ${dateStr} ${dayStr}${seg.dep}${seg.arr} ${stCount}    ${timeStr}   ${arrDateDisplay} E 0 ${eq}`
    );
    lines.push(`    MANDATORY APIS REQUIRED UNDER DOCS DOCO DOCA`);
    lines.push(`    PLS ENTER SSR CTCM OR CTCE FOR IROP ALERTS`);
    lines.push(`    PAX ARE REQTD TO REPORT 3.5HR PRIOR CHECK-IN`);
    lines.push(`    SEE RTSVC`);
    return lines;
  }

  // Standard clean Amadeus output for airlines like TG, MH, OD, BG, AK, BS, TK, EK
  if(['TG', 'MH', 'OD', 'BG', 'AK', 'BS', 'TK', 'EK'].includes(seg.al)){
    lines.push(
      `${sNum}  <span class="al">${seg.al} ${fnPadded}</span> ${classLink} ${dateStr} ${dayStr} ${seg.dep}${seg.arr} ${stCount}  ${timeStr}  ${arrDateStr}  E  0 ${eq} M`
    );
    // Hold confirmation in Selling Platform Connect includes the operational
    // advisories below each segment, not only the final RTSVC reference.
    lines.push(`     MANDATORY APIS REQUIRED UNDER DOCS DOCO DOCA`);
    lines.push(`     PLS ENTER SSR CTCM OR CTCE FOR IROP ALERTS`);
    lines.push(`     PAX ARE REQTD TO REPORT 3.5HR PRIOR CHECK-IN`);
    lines.push(`     SEE RTSVC`);
    return lines;
  }

  // Other airlines (e.g. QR / SQ)
  let connCol = '       ';
  if(totalSegs > 1){
    connCol = (sIdx === 0) ? '       1  ' : '          ';
  }
  lines.push(
    `${sNum}  <span class="al">${seg.al} ${fnPadded}</span> ${classLink} ${dateStr} ${dayStr} ${seg.dep}${seg.arr} ${stCount}${connCol}${timeStr}${afterTimes}`
  );
  lines.push(`    MANDATORY REQUIRED DOCS DOCO DOCA CTCM CTCE`);
  lines.push(`    PLS ENTER SSR CTCM OR CTCE FOR IROP ALERTS`);
  lines.push(`    PAX ARE REQTD TO REPORT 3.5HR PRIOR CHECK-IN`);
  if(['77W', '787', '359'].includes(eq) && (sIdx === 0 || seg.al === 'SQ' || (seg.al === 'QR' && eq === '77W'))){
    lines.push(`    STARLINK ENABLED`);
  }
  lines.push(`    SEE RTSVC`);
  return lines;
}

function renderPNR(header){
  state._lineMap = {};
  const rows = [];

  // ---------- OSI lines appear ABOVE the RLR header in real Amadeus ----------
  const osiList = state.osiEntries || [];
  osiList.forEach(o=>{
    rows.push(`<span class="warn">OSI: ${esc(o.al)} ${esc(o.text)}/${esc(o.pax)}</span>`);
  });

  const isBuilding = !state.locator && !state.finalized;

  if(header) {
    rows.push(header);
  } else if(isBuilding) {
    rows.push(`--- MSC SFP ---`);
    const currOffice = state.officeId || OFFICE_ID;
    rows.push(`RP/${currOffice}/`);
    // RF line appears right after RP/ in building mode
    if(state.rfEntry){
      rows.push(`RF ${state.rfEntry}`);
    }
  } else {
    const rlrHeader = state.mscHeader ? (state.hasTST ? `--- TST RLR MSC ---` : `--- RLR MSC ---`) : (state.hasTST ? `--- TST RLR ---` : `--- RLR ---`);
    rows.push(rlrHeader);
    const currOffice = state.officeId || OFFICE_ID;
    const agCode = state.agentCode || (state.locator === 'OGJZJ9' ? 'BP/AS' : 'SS/GS');
    rows.push(`RP/${currOffice}/${currOffice}            ${agCode}   ${state.dateStamp||"13NOV24/1435Z"}   <span class="locator">${state.locator||"J99GZO"}</span>`);
    // Second header line (e.g. DACVS33GT/0002TG/7SEP26)
    const line2 = state.mscHeader ? '' : (state.erHeaderLine2 || state.headerLine2);
    if(line2){
      rows.push(line2);
    }
  }

  let idx = 1;
  // Passenger Lines (building mode uses space-padded single-digit " 1.NAME" matching Screenshot 1)
  if(isBuilding){
    if(state.passengers && state.passengers.length){
      state.passengers.forEach((p, i)=>{
        const pNum = (i + 1).toString().padStart(2, ' ');
        rows.push(`<span class="name">${pNum}.${esc(p.label)}</span>`);
        idx++;
      });
    } else {
      rows.push(`<span class="warn" style="font-weight:bold;">** TO INSERT PASSENGER NAME: NM1SURNAME/FIRSTNAME TITLE (e.g. NM1SHAKIB/APON MR) **</span>`);
    }
  } else {
    let paxLine = "";
    state.passengers.forEach((p, i)=>{
      const pNum = i + 1;
      const str = `<span class="name">${pNum}</span>.<span class="name">${esc(p.label)}</span> `;
      if(i === 0) paxLine += str;
      else if(i === 1) { paxLine += str; rows.push(paxLine.trim()); paxLine = ""; }
      else { rows.push(str.trim()); }
    });
    if(paxLine) rows.push(paxLine.trim());
    idx = state.passengers.length + 1;
  }

  // Segment Lines with interactive class triggers
  const totalSegs = state.segments ? state.segments.length : 0;
  state.segments.forEach((seg, sIdx)=>{
    const segLineNum = idx++;
    if(seg.isARNK){
      rows.push(`${segLineNum.toString().padStart(2, ' ')}  ARNK`);
      return;
    }
    if(seg.isOpen){
      const dateDisplay = (seg.date && seg.date !== 'OPEN') ? `${seg.date} ` : '     ';
      rows.push(`${segLineNum.toString().padStart(2, ' ')}  ${seg.al} OPEN ${seg.cls} ${dateDisplay} ${seg.dep}${seg.arr}  OPEN`);
      return;
    }
    const classLink = `<span class="seg-class-link" onclick="openSeatMap(${sIdx})" title="Click to view Seat Map for this flight (${seg.al} ${seg.fn})">${seg.cls}</span>`;

    if(isBuilding){
      const segLines = formatSegmentBuildingLines(seg, sIdx, totalSegs, segLineNum);
      segLines.forEach(l => rows.push(l));
    } else {
      const day = seg.day || '2*';
      const dateStr = seg.date || '25MAR';
      const isHK = (seg.status === 'HK');
      // After ER: use confirmedEndCode (E  TG/LOCATOR) format
      // For pre-loaded PNRs (Lesson/Thai): keep *1A/E* format
      const rawArrT = seg.arrT || '0000';
      const isNextDay = rawArrT.includes('+1');
      const arrTClean = rawArrT.replace(/\+\d+$/, '');
      const arrDateStr = isNextDay ? getNextDayDate(dateStr) : dateStr;
      // Build the time+arrdate portion
      const timeAndDate = `${seg.depT} ${arrTClean}  ${arrDateStr}  `;

      let endCode;
      if(seg.confirmedEndCode){
        // User-booked segments: E  TG/92C57S format
        endCode = `  ${timeAndDate}${seg.confirmedEndCode}`;
      } else if(isHK){
        // Pre-loaded lesson PNRs: *1A/E* format
        endCode = `  ${seg.depT} ${seg.arrT}  *1A/E*`;
      } else {
        endCode = `  ${seg.depT} ${seg.arrT}  ${seg.tktCode || 'TK/VB7BHH'}`;
      }

      const countStr = isHK ? seg.count.toString().padStart(4, ' ') : `  ${seg.count}`;

      if(seg.confirmedEndCode){
        const fnPadded = seg.fn.toString().length < 4 ? seg.fn.toString().padStart(3, ' ') : seg.fn.toString();
        if(!state.justEndedRecord && seg.al === 'TG'){
          // Multi-line airport display for TG on IR / RT (matches real Amadeus transcript)
          const destName = seg.arr === 'DAC' ? 'DHAKA, HAZRAT SHAHJALAL INTL' : `${seg.arr} INTL`;
          rows.push(
            `${segLineNum.toString().padStart(2, ' ')}  ` +
            `<span class="al">${seg.al} ${fnPadded}</span> ` +
            `${classLink} ${dateStr} ${day} ${seg.dep}${seg.arr}`
          );
          rows.push(destName);
          rows.push(
            ` HK${seg.count}  ${timeAndDate}${seg.confirmedEndCode}`
          );
        } else {
          // Single-line confirmed format (ER display or other airlines):
          rows.push(
            `${segLineNum.toString().padStart(2, ' ')}  ` +
            `<span class="al">${seg.al} ${fnPadded}</span> ` +
            `${classLink} ${dateStr} ${day} ${seg.dep}${seg.arr} ` +
            `HK${seg.count}  ${timeAndDate}${seg.confirmedEndCode}`
          );
        }
      } else {
        rows.push(
          `${segLineNum.toString().padStart(2, ' ')}  ` +
          `<span class="al">${seg.al} ${seg.fn}</span> ` +
          `${classLink} ${dateStr} ${day}${seg.dep}${seg.arr} ` +
          `${seg.status}${countStr}${endCode}`
        );
      }
    }
  });

  // AP
  if(state.phone) {
    rows.push(`${idx.toString().padStart(2, ' ')}  AP ${esc(state.phone)}`);
    idx++;
  }

  // TK
  if(state.ticketing) {
    rows.push(`${idx.toString().padStart(2, ' ')}  TK ${esc(state.ticketing)}`);
    idx++;
  }

  // Predefined training records can include carrier-specific display entries
  // that do not fit a standard SSR command format.
  (state.extraDisplayEntries || []).forEach(entry => {
    rows.push(`${idx.toString().padStart(2, ' ')}  ${esc(entry)}`);
    idx++;
  });

  // ---------- SSR CHLD (one line per child passenger) ----------
  state.passengers.forEach((p, pi)=>{
    if(p.type === 'child'){
      const al = (state.segments[0] && state.segments[0].al) || 'TK';
      rows.push(`${idx.toString().padStart(2, ' ')}  SSR CHLD ${al} HK1 ${p.dob}/P${pi+1}`);
      idx++;
    }
  });

  // ---------- SSR INFT (one line per segment per infant element) ----------
  state.passengers.forEach((p, pi)=>{
    if(p.type === 'infantCarrier'){
      state.segments.forEach((seg, si)=>{
        const infName = `${p.infant.surname}/${p.infant.first}${p.infant.title ? ` ${p.infant.title}` : ''}`.replace(/\s+/g, '');
        const segNum = state.passengers.length + si + 1;
        rows.push(`${idx.toString().padStart(2, ' ')}  SSR INFT ${seg.al || 'TK'} HK1 ${infName} ${p.infant.dob}/S${segNum}/P${pi+1}`);
        idx++;
      });
    }
  });

  if(state.showOths){
    // ---------- SSR OTHS standard informational lines ----------
    state._lineMap[idx] = { type: "oths", label: "SSR OTHS" }; rows.push(`${idx.toString().padStart(2, ' ')}  SSR OTHS 1A PLEASE ADVISE FQTV NUMBER IF AVAILABLE`); idx++;
    state._lineMap[idx] = { type: "oths", label: "SSR OTHS" }; rows.push(`${idx.toString().padStart(2, ' ')}  SSR OTHS 1A PLS ADV PSGR MOBILE AND/OR EMAIL AS SSR CTCM/CTCE`); idx++;
    state._lineMap[idx] = { type: "oths", label: "SSR OTHS" }; rows.push(`${idx.toString().padStart(2, ' ')}  SSR OTHS 1A DOCS CTCM CTCE ARE MANDATORY FOR TICKETING`); idx++;
    state._lineMap[idx] = { type: "oths", label: "SSR OTHS" }; rows.push(`${idx.toString().padStart(2, ' ')}  SSR OTHS 1A PLS ENTER DOCS CTCM AND CTCE FIELDS WTH SSR`); idx++;
    state._lineMap[idx] = { type: "oths", label: "SSR OTHS" }; rows.push(`${idx.toString().padStart(2, ' ')}  SSR OTHS 1A FOR DOCS FIELD DOB GENDER NAME FIELDS ARE\n       REQUIRED`); idx++;

    // ---------- SSR ADTK (ticketing deadline advisory) ----------
    state._lineMap[idx] = { type: "oths", label: "SSR ADTK" }; rows.push(`${idx.toString().padStart(2, ' ')}  SSR ADTK 1A TO TK BY 16NOV 2021 IRC-2/ADV OTO TKT`); idx++;
  }

  // Airline advisory SSR OTHS (appears on IR after PNR finalized without contact, matches user Screenshot 3)
  if(!state.justEndedRecord && state.airlineAdvOths){
    rows.push(`${idx.toString().padStart(2, ' ')}  ${state.airlineAdvOths}`);
    idx++;
  }

  // ---------- Special SSRs: CTCE / CTCM / CHML / BBML / BSCT ----------
  const specialList = state.specialSSRs || [];

  // First: CTCE and CTCM (contact SSRs — one line per passenger each)
  specialList.filter(s => s.type === 'CTCE' || s.type === 'CTCM').forEach(s=>{
    // CTCE can be unassociated; render /P only when explicitly supplied.
    const paxSuffix = s.pax ? `/${s.pax}` : '';
    rows.push(`${idx.toString().padStart(2, ' ')}  SSR ${s.type} ${s.al} ${s.status} ${s.value}${paxSuffix}`);
    idx++;
  });

  // Then: All IATA Meal codes (MOML, CHML, BBML, BSCT, AVML, VGML, etc.) — per-segment SSRs
  const ALL_MEAL_CODES = [
    'MOML', 'CHML', 'BBML', 'BSCT', 'AVML', 'BLML', 'CNML', 'DBML', 'FPML', 'GFML',
    'HNML', 'IVML', 'JPML', 'KSML', 'LCML', 'LFML', 'LSML', 'NFML', 'NLML', 'OBML',
    'ORML', 'RVML', 'SFML', 'SPML', 'VGML', 'VLML', 'VOML'
  ];
  ALL_MEAL_CODES.forEach(ssrType=>{
    specialList.filter(s => s.type === ssrType && s.allSegs).forEach(s=>{
      state.segments.forEach((seg, si)=>{
        const al = seg.al || s.al || 'TG';
        const st = s.status || 'HK1';
        const segNum = si + 3; // S3, S4... matches Screenshot 4
        rows.push(`${idx.toString().padStart(2, ' ')}  SSR ${ssrType} ${al} ${st}/S${segNum}/${s.pax}`);
        idx++;
      });
    });
  });

  // ---------- SSR WCHR / WCHS / WCHC (wheelchair) — per-segment with free text ----------
  specialList.filter(s => ['WCHR','WCHS','WCHC'].includes(s.type)).forEach(s=>{
    state.segments.forEach((seg, si)=>{
      // Format: SSR WCHR TK NN1 NONMEDA/ELDERLY UNABLE TO WALK LONG DISTANCE /S4/P1
      rows.push(`${idx.toString().padStart(2, ' ')}  SSR ${s.type} ${s.al} ${s.status} ${esc(s.text)} /S${si+4}/${s.pax}`);
      idx++;
    });
  });

  // ---------- SSR SEAT assignments (if seats were booked in the seat map) ----------
  if(state.seats) {
    Object.entries(state.seats).forEach(([sIdx, paxMap])=>{
      const seg = state.segments[parseInt(sIdx,10)];
      if(seg){
        Object.entries(paxMap).forEach(([pCode, seatCode])=>{
          rows.push(`${idx.toString().padStart(2, ' ')}  SSR SEAT ${seg.al} HK1 ${seg.dep}${seg.arr} ${seatCode}/${pCode}/S${parseInt(sIdx,10)+4}`);
          idx++;
        });
      }
    });
  }


  // ---------- SSR FQTV (Frequent Flyer Numbers) ----------
  if(state.specialSSRs){
    state.specialSSRs.filter(s => s.type === 'FQTV').forEach(s => {
      rows.push(`${idx.toString().padStart(2, ' ')}  SSR FQTV ${s.al} ${s.status} ${s.value}/${s.pax}`);
      idx++;
    });
    // SRBAGX / SRXBAG / SRABAG — Extra Baggage
    state.specialSSRs.filter(s => s.type === 'BAGX' || s.type === 'XBAG' || s.type === 'ABAG').forEach(s => {
      const segTarget = s.segNum ? [s.segNum] : state.segments.map((_, si) => si + 2);
      segTarget.forEach(segLine => {
        rows.push(`${idx.toString().padStart(2, ' ')}  SSR ${s.type} ${s.al} ${s.status} ${s.value}/S${segLine}/${s.pax}`);
        idx++;
      });
    });
    // SRWLST — Waitlist
    state.specialSSRs.filter(s => s.type === 'WLST').forEach(s => {
      state.segments.forEach((seg, si) => {
        rows.push(`${idx.toString().padStart(2, ' ')}  SSR WLST ${s.al} ${s.status}/S${si+3}/${s.pax}`);
        idx++;
      });
    });
  }

  // ---------- RM — Free-text Remarks ----------
  if(state.remarks && state.remarks.length){
    state.remarks.forEach(r => {
      const prefix = r.confidential ? 'RMZ' : 'RM ';
      rows.push(`${idx.toString().padStart(2, ' ')}  ${prefix} ${esc(r.text)}`);
      idx++;
    });
  }

  // ---------- SSR DOCS (Passports / Travel Documents) ----------
  const docsList = state.docsEntries || [];
  docsList.forEach(d => {
    // Amadeus standard format (Screenshot 2):
    // SSR DOCS QR HK1 P/BGD/AP3476898/BGD/19OCT90/M/23OCT23/KHAN/ARAFAT (or /P1, /P2, /P3)
    const paxSuffix = (state.passengers.length > 1 || d.pax !== 'P1') ? `/${d.pax}` : '';
    rows.push(`${idx.toString().padStart(2, ' ')}  SSR DOCS ${d.airline} ${d.action} ${d.docType}/${d.country}/${d.docNumber}/${d.nationality}/${d.dob}/${d.gender}/${d.expiry}/${d.surname}/${d.firstName}${paxSuffix}`);
    idx++;
  });

  // ---------- FP Form of Payment (Screenshot 4) ----------
  if(state.fop && !state.mscHeader){
    rows.push(`${idx.toString().padStart(2, ' ')}  FP ${esc(state.fop)}`);
    idx++;
  }

  // ---------- TST Endorsements (Screenshot 2 & 4) ----------
  if(!state.mscHeader && state.hasTST && state.showFE){
    rows.push(`${idx.toString().padStart(2, ' ')}  FE PAX NON ENDORSE/CHNG AND RFND PENALTY APPLY/RFND NOT LATER THAN 90 DAYS AFTER TKT EXPIRY/S3-4/P1`); idx++;
    rows.push(`${idx.toString().padStart(2, ' ')}  FE PAX NON ENDORSE/CHNG AND RFND PENALTY APPLY/RFND NOT LATER THAN 90 DAYS AFTER TKT EXPIRY/S3-4/P2`); idx++;
    rows.push(`${idx.toString().padStart(2, ' ')}  FE INF NON ENDORSE/CHNG AND REF PENALTY APPLY/RFND NOT LATER THAN 90 DAYS AFTER TKT EXPIRY/S3-4/P2`); idx++;
    rows.push(`${idx.toString().padStart(2, ' ')}  FM INF *F*7.00N/S3-4/P2`); idx++;
  }

  // ---------- OPW Remarks (ticketing deadline) ----------
  if(!state.justEndedRecord && state.opwRemarks && state.opwRemarks.length){
    state.opwRemarks.forEach(r => {
      rows.push(`${idx.toString().padStart(2, ' ')}  ${r}`);
      idx++;
    });
  }

  // ---------- OPC Remarks (cancellation deadline) ----------
  if(!state.justEndedRecord && state.opcRemarks && state.opcRemarks.length){
    state.opcRemarks.forEach(r => {
      rows.push(`${idx.toString().padStart(2, ' ')}  ${r}`);
      idx++;
    });
  }

  // AI Fare Shop records retain their endorsement, commission and validating
  // carrier elements after the ticketing-deadline message.
  if(state.mscHeader && state.hasTST){
    const lastSeg = state.segments.length + 1;
    const al = (state.segments[0] && state.segments[0].al) || 'AI';
    rows.push(`${idx.toString().padStart(2, ' ')}  FE PAX NON-END/CHANGE CANCELLATION/NO-SHOW PENALTY MAY APPLY`); idx++;
    rows.push(`    AS PER FARE RULES/S2-${lastSeg}`);
    if(state.commission){
      rows.push(`${idx.toString().padStart(2, ' ')}  FM *M*${state.commission.replace('%', '')}`); idx++;
    }
    if(state.fop){
      rows.push(`${idx.toString().padStart(2, ' ')}  FP ${esc(state.fop)}`); idx++;
    }
    rows.push(`${idx.toString().padStart(2, ' ')}  FV PAX ${al}/S2-${lastSeg}`); idx++;
  }

  // ---------- FA Electronic Tickets Issued (Issue Entry) ----------
  state.ticketLineNumbers = {};
  if(state.tickets && state.tickets.length){
    // In real Amadeus, exchanged tickets (status: 'E') are retired and recorded only in FHE,
    // while the active list displays the new reissued ticket and EMD.
    const activeTickets = state.tickets.filter(t => t.status !== 'E');
    const ticketsToRender = activeTickets.length ? activeTickets : state.tickets;
    ticketsToRender.forEach(t => {
      const pNum = t.pax ? t.pax.replace('.', 'P').replace(/\s+/g, '') : 'P1';
      const alLet = t.alLetter || ((state.segments[0] && state.segments[0].al) || 'TG');
      const dt = t.tktDate || (state.dateStamp ? state.dateStamp.split('/')[0] : '01JUL18');
      const off = t.office || state.officeId || OFFICE_ID;
      state.ticketLineNumbers[String(idx)] = t.tktNum;
      rows.push(`${idx.toString().padStart(2, ' ')}  FA PAX ${t.tktNum}/ET${alLet}/${dt}/${off}/23567890/S3-4/${pNum}`);
      idx++;
      if(t.penaltyEMD){
        state.ticketLineNumbers[String(idx)] = t.penaltyEMD;
        rows.push(`${idx.toString().padStart(2, ' ')}  FA PAX ${t.penaltyEMD}/DT${alLet}/${dt}/${off}/23567890/S2/PENALTY`);
        idx++;
      }
      if(t.originalIssue){
        state.ticketLineNumbers[String(idx)] = t.originalIssue;
        rows.push(`${idx.toString().padStart(2, ' ')}  FHE PAX ${t.originalIssue}`);
        idx++;
      }
      if(t.status === 'V'){
        rows.push(`${idx.toString().padStart(2, ' ')}  FB PAX 0000000000 TRDC OK VOID/${t.voidedAt ? new Date(t.voidedAt).toLocaleDateString() : 'SAME-DAY'}`);
        idx++;
      } else if(t.status === 'R' || t.refundNotice){
        rows.push(`${idx.toString().padStart(2, ' ')}  FB PAX 0000000000 TRFP/FP OK REFUND/${t.refundNotice || 'RN157-998877'}`);
        idx++;
      } else if(t.status !== 'E'){
        const tNum = t.tstNum || 1;
        rows.push(`${idx.toString().padStart(2, ' ')}  FB PAX 0000000000 TTP/T${tNum} OK ETICKET/S3-4/${pNum}`);
        idx++;
      }
    });
  }

  // Build lineMap from rendered rows (after stripping HTML tags and leading whitespace)
  // Note: state._lineMap is reset at line 427 (top of renderPNR); inline entries (OTHS etc.)
  // are set directly there, so we only FILL gaps here (do not reset again).
  rows.forEach(r => {
    const plain = String(r || '').replace(/<[^>]+>/g, '').trim();
    const m = plain.match(/^(\d+)\s+(.+)$/);
    if(m){
      const lNum = parseInt(m[1], 10);
      if(!state._lineMap[lNum]){
        state._lineMap[lNum] = m[2].trim();
      }
    }
  });

  printLines(rows, '');
  updateTopPnrInfo();
}

function updateTopPnrInfo(){
  const topPnrStatus = document.getElementById('topPnrStatus');
  const tabTitleText = document.getElementById('tabTitleText');
  const bottomPaxName = document.getElementById('bottomPaxName');

  const loc = state.locator || "NO ACTIVE PNR";
  const pax0 = state.passengers[0] ? state.passengers[0].label.split('(')[0] : "NEW";
  const seg0 = state.segments[0];

  // 1. If seats held with no passengers yet (Matches YouTube Screenshot 2 exactly!)
  if(!state.passengers.length && state.segments.length){
    const s0 = state.segments[0];
    const sLast = state.segments[state.segments.length - 1];
    tabTitleText.textContent = `Command page - ${s0.date} - ${sLast.arr} [${s0.count}] Owned by ${state.officeId || OFFICE_ID}`;
    topPnrStatus.textContent = `PNR: Held ${s0.count} seat(s) (${s0.al} ${s0.fn})`;
    bottomPaxName.textContent = `${s0.al} ${s0.fn} ${s0.dep}-${sLast.arr}`;
    return;
  }

  // 2. If no active PNR (clean initial / reset / ignored state)
  if(!state.passengers.length && !state.segments.length && !state.locator){
    if (tabTitleText) tabTitleText.textContent = `Command page`;
    if (topPnrStatus) topPnrStatus.textContent = ``;
    if (bottomPaxName) bottomPaxName.textContent = ``;
    return;
  }

  // 3. Normal PNR with passengers
  const segInfo = seg0 ? `${seg0.date} - ${seg0.arr}` : "";
  const ownedSuffix = (state.finalized && state.locator) ? ` Owned by ${state.officeId || OFFICE_ID}` : '';
  if (topPnrStatus) topPnrStatus.textContent = loc ? `PNR: ${loc} (${state.finalized ? 'Confirmed' : 'Building'})` : `PNR: Building`;
  if (tabTitleText) tabTitleText.textContent = `Command page - ${pax0} (${state.passengers.length})${segInfo ? ' - ' + segInfo : ''}${loc ? ' - ' + loc : ''}${ownedSuffix}`;
  if (bottomPaxName) bottomPaxName.textContent = pax0 ? (pax0.slice(0, 20) + "...") : "";
}

// ---------- SEAT MAP MODULE ----------
const SEAT_COLS = ["A", "B", "C", "D", "E", "F", "H", "J", "K"];
const OCCUPIED_SEATS = {
  // Pre-seed some occupied seats for realistic appearance matching Screenshot 2 (e.g. row 11 is full)
  "11A": true, "11B": true, "11C": true, "11D": true, "11E": true, "11F": true, "11H": true, "11J": true, "11K": true,
  "08E": true, "08F": true, "14B": true, "14C": true, "17J": true, "17K": true
};

function openSeatMap(segIndex){
  activeSegIdx = segIndex || 0;
  seatmapOverlay.classList.add('active');

  // Populate segment select dropdown
  segmentSelect.innerHTML = '';
  state.segments.forEach((seg, i)=>{
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `S${i+1}: ${seg.al}${seg.fn} ${seg.cls} ${seg.fullDate||seg.date} ${seg.dep}-${seg.arr} ${seg.depT.slice(0,2)}:${seg.depT.slice(2)}/${seg.arrT.slice(0,2)}:${seg.arrT.slice(2)}`;
    if(i === activeSegIdx) opt.selected = true;
    segmentSelect.appendChild(opt);
  });

  renderCabinLayout();
  renderPassengersList();
}

function closeSeatMap(){
  seatmapOverlay.classList.remove('active');
  hideTooltip();
  const legend = document.getElementById('legendModal');
  if(legend) legend.classList.remove('show');

  // Focus terminal input
  const inp = document.getElementById('cmdInput');
  if(inp) inp.focus();
}

function onSegmentChange(newIdx){
  activeSegIdx = parseInt(newIdx, 10);
  renderCabinLayout();
  renderPassengersList();
}

function renderCabinLayout(){
  const seg = state.segments[activeSegIdx] || state.segments[0];
  const header = document.getElementById('cabinClassHeader');
  const equipName = seg.eq === "77W" ? "Boeing 777-300ER" : (seg.eq === "321" ? "Airbus A321" : "Aircraft");
  header.textContent = `Economy Class — ${seg.al === "TK" ? "Turkish Airlines" : seg.al} (${equipName})`;

  const container = document.getElementById('seatRowsContainer');
  container.innerHTML = '';

  const assignedInThisSeg = state.seats[activeSegIdx] || {};

  // Rows 6 to 22
  for(let r = 6; r <= 22; r++){
    const rowEl = document.createElement('div');
    rowEl.className = 'seat-row';

    // Left row number
    const leftNum = document.createElement('div');
    leftNum.className = 'row-num';
    leftNum.textContent = r;
    rowEl.appendChild(leftNum);

    // Columns: A B C (aisle) D E F (aisle) H J K
    SEAT_COLS.forEach((col, cIdx)=>{
      if(col === "D" || col === "H"){
        const aisle = document.createElement('div');
        aisle.className = 'aisle-gap';
        rowEl.appendChild(aisle);
      }

      const seatCode = `${r < 10 ? '0'+r : r}${col}`;
      const seatTile = document.createElement('div');
      seatTile.className = 'seat-tile';
      seatTile.dataset.code = seatCode;

      // Chargeable / Legroom seats ($): rows 6 to 10
      const isChargeable = (r >= 6 && r <= 10);
      const isOccupied = OCCUPIED_SEATS[seatCode] || false;

      // Check if assigned to any passenger
      let assignedPax = null;
      Object.entries(assignedInThisSeg).forEach(([pCode, sCode])=>{
        if(sCode === seatCode) assignedPax = pCode;
      });

      if(isOccupied){
        seatTile.classList.add('occupied');
        seatTile.innerHTML = `✕`;
      } else if(assignedPax){
        seatTile.classList.add('selected');
        seatTile.innerHTML = `<span class="pax-tag">${assignedPax}</span>`;
      } else if(isChargeable){
        seatTile.classList.add('dollar');
        seatTile.textContent = '$';
      }

      // Tooltip events
      seatTile.addEventListener('mouseenter', (e)=> showTooltip(e, seatCode, isChargeable, isOccupied, assignedPax));
      seatTile.addEventListener('mousemove', moveTooltip);
      seatTile.addEventListener('mouseleave', hideTooltip);

      // Seat selection click
      if(!isOccupied){
        seatTile.addEventListener('click', ()=> onSeatClick(seatCode, isChargeable));
      }

      rowEl.appendChild(seatTile);
    });

    // Right row number
    const rightNum = document.createElement('div');
    rightNum.className = 'row-num';
    rightNum.textContent = r;
    rowEl.appendChild(rightNum);

    container.appendChild(rowEl);
  }
}

function onSeatClick(seatCode, isChargeable){
  if(!state.seats[activeSegIdx]) state.seats[activeSegIdx] = {};
  const currentSegSeats = state.seats[activeSegIdx];

  // If already assigned to the currently selected passenger, toggle off
  if(currentSegSeats[activePaxCode] === seatCode){
    delete currentSegSeats[activePaxCode];
  } else {
    // If another passenger had this seat, reassign
    Object.keys(currentSegSeats).forEach(pCode => {
      if(currentSegSeats[pCode] === seatCode) delete currentSegSeats[pCode];
    });
    // Assign to active passenger
    currentSegSeats[activePaxCode] = seatCode;

    // Automatically advance active passenger to next unassigned passenger
    const adultAndChild = state.passengers.filter(p => p.type !== 'infant');
    const unassigned = adultAndChild.find(p => !currentSegSeats[p.code]);
    if(unassigned) {
      activePaxCode = unassigned.code;
    }
  }

  renderCabinLayout();
  renderPassengersList();
}

function renderPassengersList(){
  const container = document.getElementById('paxListContainer');
  container.innerHTML = '';

  const assigned = state.seats[activeSegIdx] || {};
  let totalSelected = 0;

  state.passengers.forEach((p)=>{
    const row = document.createElement('div');
    row.className = `pax-item-row ${activePaxCode === p.code ? 'active-pax' : ''}`;
    row.onclick = () => {
      activePaxCode = p.code;
      renderPassengersList();
    };

    const seatCode = assigned[p.code];
    if(seatCode) totalSelected++;

    const chdBadge = p.type === 'child' ? `<span class="pax-badge-chd">CHD</span>` : '';
    const seatDisplay = seatCode ? seatCode : `<span class="pax-seat-code empty">—</span>`;
    const statusDisplay = seatCode
      ? `<span class="pax-status-text">Selected</span>`
      : `<span class="pax-status-text pending">Not selected</span>`;

    row.innerHTML = `
      <div class="pax-check"><input type="checkbox" checked disabled></div>
      <div class="pax-info">
        <span class="pax-code">${p.code}</span>
        ${chdBadge}
        <span class="pax-name">${esc(p.nameDisplay || p.label.split('(')[0])}</span>
      </div>
      <div class="pax-seat-code">${seatDisplay}</div>
      ${statusDisplay}
    `;
    container.appendChild(row);

    // If infant carrier, show infant sub-line
    if(p.type === 'infantCarrier' && p.infant){
      const infRow = document.createElement('div');
      infRow.className = 'infant-sub-row';
      infRow.innerHTML = `
        <span class="infant-badge">INF</span>
        <span>${esc(p.infant.display || p.infant.surname + ' ' + p.infant.first)}</span>
        <span style="margin-left:auto; font-style:italic;">(Infant on lap - no seat)</span>
      `;
      container.appendChild(infRow);
    }
  });

  document.getElementById('selectedSeatsCount').textContent = totalSelected;
  const bookBtn = document.getElementById('bookSeatsBtn');
  bookBtn.disabled = (totalSelected === 0);
}

function confirmBookSeats(){
  const assigned = state.seats[activeSegIdx] || {};
  const seg = state.segments[activeSegIdx];
  const bookedList = Object.entries(assigned).map(([p, s]) => `${p}: ${s}`).join(', ');

  if(!bookedList){
    alert("Please select at least one seat first.");
    return;
  }

  showToast(`âœ“ Seats confirmed for ${seg.al}${seg.fn} (${seg.dep}-${seg.arr}): ${bookedList}`);

  // Re-render PNR so SSR SEAT lines appear in the terminal
  renderPNR();
}

// Tooltip logic matching Screenshot 2
function showTooltip(e, seatCode, isChargeable, isOccupied, assignedPax){
  document.getElementById('tooltipBadge').textContent = seatCode;
  const charEl = document.getElementById('tooltipChar');
  const occEl = document.getElementById('tooltipOcc');

  if(isChargeable){
    charEl.innerHTML = `Chargeable seat<br>Leg space seat`;
  } else {
    charEl.innerHTML = `Standard seat`;
  }

  if(isOccupied){
    occEl.textContent = `Seat is occupied`;
  } else if(assignedPax){
    occEl.textContent = `Selected by ${assignedPax}`;
  } else {
    occEl.textContent = `Seat is vacant`;
  }

  moveTooltip(e);
  seatTooltip.style.display = 'block';
}

function moveTooltip(e){
  const x = e.clientX + 14;
  const y = e.clientY - 40;
  seatTooltip.style.left = `${Math.min(window.innerWidth - 240, x)}px`;
  seatTooltip.style.top = `${Math.max(10, y)}px`;
}

function hideTooltip(){
  seatTooltip.style.display = 'none';
}

function toggleLegend(){
  document.getElementById('legendModal').classList.toggle('show');
}

function switchSmTab(tab){
  document.getElementById('smTabSeatMap').classList.toggle('active', tab==='seatmap');
  document.getElementById('smTabServices').classList.toggle('active', tab==='services');
  if(tab === 'services'){
    alert("Amadeus Ancillary Service Catalogue — Baggage, Lounge & Meals simulation.");
  }
}

function switchDetailsTab(tab){
  document.getElementById('dtTabPax').classList.toggle('active', tab==='passengers');
  document.getElementById('dtTabFeatures').classList.toggle('active', tab==='features');
  document.getElementById('dtTabAmenities').classList.toggle('active', tab==='amenities');

  document.getElementById('paxTabPane').style.display = (tab === 'passengers') ? 'block' : 'none';
  document.getElementById('featuresTabPane').style.display = (tab === 'features') ? 'block' : 'none';
  document.getElementById('amenitiesTabPane').style.display = (tab === 'amenities') ? 'block' : 'none';
}

function showToast(msg){
  const t = document.getElementById('toastNotification');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(()=> t.classList.remove('show'), 3500);
}

// Load Video Lesson PNR
function loadLessonPNR(){
  state = JSON.parse(JSON.stringify(LESSON_PNR));
  activeSegIdx = 0;
  activePaxCode = "P1";
  term.innerHTML = '';
  printPromptEcho("IR");
  renderPNR();
  mountInput();
  showToast("Loaded training lesson PNR J99GZO");
}

function resetSimulator(){
  state = createEmptyState();
  lastANRoute = null;
  if(typeof resetFareShop === 'function') resetFareShop();
  term.innerHTML = '';
  latestCommandPromptEl = null;
  term.scrollTop = 0;
  updateTopPnrInfo();
  mountInput();
  showToast("Simulator reset — ready for new command");
}

function handleIG(){
  state = createEmptyState();
  lastANRoute = null;
  if(typeof resetFareShop === 'function') resetFareShop();
  printLines([
    '--- RLR ---',
    'TRANSACTION IGNORED'
  ], 'warn');
  updateTopPnrInfo();
  showToast("Transaction ignored (IG) — Workspace cleared");
}

// ---------- Command Execution Engine ----------
let lastANRoute = null;
let lastANDate = "12NOV";

function renderAvailabilityClasses(classEntries, lineNumber){
  return classEntries.map(([bookingClass, availability]) => {
    const seats = Number.parseInt(availability, 10);
    const label = `${bookingClass}${availability}`;
    if(!Number.isFinite(seats) || seats < 1) return label;
    return `<button type="button" class="availability-class" onclick="openAvailabilitySellMenu(event, '${bookingClass}', ${lineNumber}, ${Math.min(seats, 9)})" title="Hold seats in ${bookingClass} class">${label}</button>`;
  }).join(' ');
}

function closeAvailabilitySellMenu(){
  document.getElementById('availabilitySellMenu')?.remove();
}

function openAvailabilitySellMenu(event, bookingClass, lineNumber, availableSeats){
  event.preventDefault();
  event.stopPropagation();
  closeAvailabilitySellMenu();

  const menu = document.createElement('div');
  menu.id = 'availabilitySellMenu';
  menu.className = 'availability-sell-menu';
  for(let count = 1; count <= Math.min(availableSeats, 9); count++){
    const command = `SS${count}${bookingClass}${lineNumber}`;
    const choice = document.createElement('button');
    choice.type = 'button';
    choice.textContent = command;
    choice.addEventListener('click', () => {
      closeAvailabilitySellMenu();
      runCommand(command);
      // Menu selection bypasses the terminal Enter-key handler, so restore
      // the command input explicitly after the segment has been held.
      mountInput(activePaneId || 1);
    });
    menu.appendChild(choice);
  }
  document.body.appendChild(menu);
  const rect = event.currentTarget.getBoundingClientRect();
  menu.style.left = `${rect.left}px`;
  menu.style.top = `${rect.bottom + 2}px`;
  setTimeout(() => document.addEventListener('click', closeAvailabilitySellMenu, { once:true }), 0);
}
window.openAvailabilitySellMenu = openAvailabilitySellMenu;

function handleAN(cmd, isDirect, displayMode){
  const clean = cmd.replace(/\s+/g, '');
  const modeLabel = displayMode || (isDirect ? "AD" : "AN");
  const modeTitle = displayMode === 'SN' ? 'AMADEUS SCHEDULE' : (displayMode === 'TN' ? 'AMADEUS TIMETABLE' : 'AMADEUS AVAILABILITY');

  // Multi-availability / Dual-city search via '*' (e.g. AN15NOVDACDXB*20NOVDXBLHR or AN10NOVDACBKK*AN16NOVBKKSIN)
  if(clean.includes('*')){
    const parts = clean.split('*').map(p => p.trim()).filter(Boolean);
    if(parts.length > 1){
      const combinedLines = [];
      const allRows = [];
      let globalDisplayIdx = 1;
      let firstFilter = null;

      parts.forEach((rawPart, partIdx) => {
        let partClean = rawPart;
        if(!/^(AN|AD)/i.test(partClean)){
          partClean = (isDirect ? "AD" : "AN") + partClean;
        }
        const m = partClean.match(/^(AN|AD)(\d{1,2}[A-Z]{3})?([A-Z]{2,3})([A-Z]{2,3})(?:\/([A-Z0-9]+))?$/i);
        if(!m) return;
        const [, type, dateRaw, orig, dest, filter] = m;
        const date = (dateRaw || lastANDate || "12NOV").toUpperCase();
        let o = orig.toUpperCase();
        let d = dest.toUpperCase();
        if(o === 'XB') o = 'DXB';
        if(d === 'XB') d = 'DXB';

        const route = getFlightSchedule(o, d, date);
        if(!route || !route.lines || !route.lines.length) return;

        lastANDate = date;
        const activeFilter = filter || firstFilter;
        if(filter && !firstFilter) firstFilter = filter;

        const destCity = formatCityHeader(d);
        const dObj = resolveFlightDate(date);
        const day2L = ['SU','MO','TU','WE','TH','FR','SA'][dObj.getDay()];
        const startOfYear = new Date(dObj.getFullYear(), 0, 1);
        const dayOfYear = Math.floor((dObj - startOfYear) / (24*60*60*1000)) + 1;
        const julianStr = String(dayOfYear).padStart(3, ' ');

        if(partIdx > 0) allRows.push('');
        allRows.push(`** AMADEUS AVAILABILITY - ${isDirect ? "AD" : "AN"} ** ${destCity.padEnd(28, ' ')}  ${julianStr} ${day2L} ${date} 0000`);

        const alFilter = activeFilter ? activeFilter.toUpperCase().replace(/^A/, '') : null;

        route.lines.slice(0, 4).forEach(line => {
          if(alFilter && !line.segs.some(s => s.al.toUpperCase() === alFilter)) return;

          // Store for SS seat sell
          const assignedLineNum = globalDisplayIdx;
          combinedLines.push({
            line: assignedLineNum,
            date: date,
            segs: line.segs.map(s => Object.assign({}, s, { date }))
          });

          line.segs.forEach((seg, i) => {
            const clsEntries = Object.entries(seg.classes);
            const isCodeshare = !!seg.codeShare;
            const alDisplay = isCodeshare ? seg.codeShare.padEnd(9, ' ') : `  ${seg.al} ${(seg.fn.length < 3 ? seg.fn.padStart(3, ' ') : seg.fn)}`.padEnd(9, ' ');
            const row1Cls = renderAvailabilityClasses(clsEntries.slice(0, 7), assignedLineNum);
            const row2Cls = clsEntries.length > 7 ? renderAvailabilityClasses(clsEntries.slice(7), assignedLineNum) : '';
            const num = (i === 0) ? (globalDisplayIdx++).toString().padStart(2, ' ') : '  ';
            const hasTerm = (seg.termDep !== undefined || seg.termArr !== undefined);
            const termD = seg.termDep !== undefined ? ` ${seg.termDep}` : '';
            const termA = seg.termArr !== undefined ? ` ${seg.termArr}` : '';
            const slash = hasTerm ? ' ' : '/';
            const routeStr = `${seg.dep}${termD} ${seg.arr}${termA}`;
            const durStr = seg.dur ? seg.dur.padStart(10, ' ') : '';
            const eqStr = `E0/${seg.eq || '77W'}`;
            const clsPadded = row1Cls.padEnd(20, ' ');
            if(hasTerm){
              allRows.push(`${num} ${alDisplay}  ${clsPadded} ${slash}${routeStr.padEnd(12, ' ')} ${seg.depT}    ${seg.arrT.padEnd(6, ' ')} ${eqStr.padEnd(10, ' ')} ${durStr}`);
            } else {
              allRows.push(`${num} <span class="al">${seg.al} ${seg.fn.padEnd(4, ' ')}</span>  ${clsPadded}  /${seg.dep} ${seg.arr}  ${seg.depT} ${seg.arrT}  ${seg.eq}  ${seg.dur || '3:00'}`);
            }
            if(row2Cls){
              allRows.push(`             ${row2Cls}`);
            }
          });
        });
      });

      if(combinedLines.length > 0){
        lastANRoute = { lines: combinedLines };
        printLines(allRows, '');
        showToast(`✓ Dual/Multi-leg availability loaded (${parts.length} routes)`);
        return;
      }
    }
  }

  const m = clean.match(/^(AN|AD)(\d{1,2}[A-Z]{3})?([A-Z]{2,3})([A-Z]{2,3})(?:\/([A-Z0-9]+))?$/i);
  if(!m){
    printLines(["INVALID FORMAT — e.g. AN12NOVDACBKK, AN12NOVDACNRT, or AN25MARDACDXB"], 'err');
    return;
  }
  const [, type, dateRaw, orig, dest, filter] = m;
  const date = (dateRaw || "12NOV").toUpperCase();
  let o = orig.toUpperCase();
  let d = dest.toUpperCase();
  if(o === 'XB') o = 'DXB';
  if(d === 'XB') d = 'DXB';

  const route = getFlightSchedule(o, d, date);
  if(!route || !route.lines || !route.lines.length){
    printLines([`NO FLIGHTS FOUND FOR ${o}${d}`], 'err');
    return;
  }
  lastANRoute = route;
  lastANDate = date;

  const destCity = formatCityHeader(d);
  const dObj = resolveFlightDate(date);
  const day2L = ['SU','MO','TU','WE','TH','FR','SA'][dObj.getDay()];
  const startOfYear = new Date(dObj.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((dObj - startOfYear) / (24*60*60*1000)) + 1;
  const julianStr = String(dayOfYear).padStart(3, ' ');

  const headerDatePart = displayMode === 'TN'
    ? (() => {
        const endObj = new Date(dObj.getTime() + 7 * 86400000);
        const mNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        const fmt7 = (dtObj) => `${String(dtObj.getDate()).padStart(2,'0')}${mNames[dtObj.getMonth()]}${String(dtObj.getFullYear()).slice(-2)}`;
        return `${fmt7(dObj)} ${fmt7(endObj)}`;
      })()
    : `${julianStr} ${day2L} ${date} 0000`;

  const header = `** ${modeTitle} - ${modeLabel} ** ${destCity.padEnd(28, ' ')}  ${headerDatePart}`;
  const rows = [header];

  const alFilter = filter ? filter.toUpperCase().replace(/^A/, '') : null;
  let displayIdx = 1;

  const extractTermDigit = (code, explicit) => {
    if(explicit !== undefined && explicit !== null && explicit !== '') return String(explicit).replace(/\D+/g, '') || '0';
    const t = getAirportTerminal(code);
    const m = String(t).match(/(\d+)/);
    return m ? m[1] : '1';
  };

  route.lines.forEach(line => {
    if(alFilter && !line.segs.some(s => s.al.toUpperCase() === alFilter)) return;

    const availabilityLine = line.line;
    line.segs.forEach((seg, i) => {
      const clsEntries = Object.entries(seg.classes);
      const isCodeshare = !!seg.codeShare;
      const alDisplay = isCodeshare ? seg.codeShare.padEnd(9, ' ') : `  ${seg.al} ${(seg.fn.length < 3 ? seg.fn.padStart(3, ' ') : seg.fn)}`.padEnd(9, ' ');
      const num = (i === 0) ? (displayIdx++).toString().padStart(2, ' ') : '  ';

      if(displayMode === 'TN'){
        // Amadeus Timetable (TN) format — no booking classes; shows freq, terminals, times, stops, validity dates, equip, EFT
        const freq = (seg.freq || 'D').padEnd(4, ' ');
        const tDep = extractTermDigit(seg.dep, seg.termDep);
        const tArr = extractTermDigit(seg.arr, seg.termArr);
        const routePart = `${seg.dep} ${tDep} ${seg.arr} ${tArr}`.padEnd(11, ' ');
        const depTime = String(seg.depT || '0000').padEnd(7, ' ');
        const arrTime = String(seg.arrT || '0000').padEnd(6, ' ');
        const isLastLeg = (i === line.segs.length - 1);
        const effStr = !isLastLeg
          ? `CONNECT ${seg.arr}`.padEnd(15, ' ')
          : `${seg.effDate || '26OCT26'} ${seg.discDate || '30OCT27'}`;
        let totalDur = seg.dur || '4:00';
        if(isLastLeg && line.segs.length > 1 && typeof flAbsMinutes === 'function'){
          const mins = flAbsMinutes(seg.arrT) - flAbsMinutes(line.segs[0].depT);
          if(mins > 0) totalDur = `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
        }
        const durCol = isLastLeg ? `  ${totalDur}` : '';
        rows.push(`${num}${isCodeshare ? '' : ' '}${alDisplay.trimEnd().padEnd(8, ' ')} ${freq} ${routePart} ${depTime} ${arrTime} 0 ${effStr} ${String(seg.eq || '738').padEnd(4, ' ')}${durCol}`);
        return;
      }

      // For SN (Schedule Neutral): show class codes WITHOUT seat counts; for AN/AD: show class + count
      const renderClsRow = (entries) => {
        if(displayMode === 'SN'){
          return entries.map(([c]) => c).join('  ');
        }
        return renderAvailabilityClasses(entries, availabilityLine);
      };
      const row1Cls = renderClsRow(clsEntries.slice(0, 7));
      const row2Cls = clsEntries.length > 7 ? renderClsRow(clsEntries.slice(7)) : '';
      const hasTerm = (seg.termDep !== undefined || seg.termArr !== undefined);
      const termD = seg.termDep !== undefined ? ` ${seg.termDep}` : '';
      const termA = seg.termArr !== undefined ? ` ${seg.termArr}` : '';
      const slash = hasTerm ? ' ' : '/';
      const routeStr = `${seg.dep}${termD} ${seg.arr}${termA}`;
      const durStr = seg.dur ? seg.dur.padStart(10, ' ') : '';
      const eqStr = `E0/${seg.eq || '77W'}`;
      const clsPadded = row1Cls.padEnd(20, ' ');
      if(hasTerm){
        rows.push(`${num} ${alDisplay}  ${clsPadded} ${slash}${routeStr.padEnd(12, ' ')} ${seg.depT}    ${seg.arrT.padEnd(6, ' ')} ${eqStr.padEnd(10, ' ')} ${durStr}`);
      } else {
        const freqCol = displayMode === 'SN' ? ' D ' : '';
        rows.push(`${num} <span class="al">${seg.al} ${seg.fn.padEnd(4, ' ')}</span> ${freqCol} ${clsPadded}  /${seg.dep} ${seg.arr}  ${seg.depT} ${seg.arrT}  ${seg.eq}  ${seg.dur || '3:00'}`);
      }
      if(row2Cls){
        rows.push(`             ${row2Cls}`);
      }
    });
  });

  if(rows.length === 1){
    rows.push(`NO FLIGHTS MATCHING AIRLINE FILTER /${filter}`);
  }

  printLines(rows, '');
}

function handleSS(cmd){
  // Direct flight specific short sell: e.g. SS EK585 Y 20NOV DACDXB 1 or SS BG047 Y 15DEC DACSIN 2
  const directMatch = cmd.match(/^SS\s*([A-Z0-9]{2})\s*(\d{1,4})\s+([A-Z])\s+(\d{1,2}[A-Z]{3})\s+([A-Z]{3})([A-Z]{3})\s+(\d+)/i);
  if(directMatch){
    const carrier = directMatch[1].toUpperCase();
    const fltNum = directMatch[2];
    const cls = directMatch[3].toUpperCase();
    const date = directMatch[4].toUpperCase();
    const orig = directMatch[5].toUpperCase();
    const dest = directMatch[6].toUpperCase();
    const seats = parseInt(directMatch[7], 10) || 1;
    return handleDirectSell(carrier, fltNum, cls, date, orig, dest, seats);
  }
  let clean = cmd.replace(/\s+/g, '');
  let typoNotice = false;

  // Autocorrect common OCR / keyboard typo where user typed letter 'I' or 'l' instead of number '1' (e.g. SSIJ12 -> SS1J12)
  if(/^SS[Il]([A-Z]+\d+)/i.test(clean)){
    clean = clean.replace(/^SS[Il]/i, 'SS1');
    typoNotice = true;
  }

  let m = clean.match(/^SS(\d+)([A-Z]+)(\d+)(\*)?$/i);
  if(!m){
    const alt = clean.match(/^SS(\d+)(\d+)([A-Z]+)$/i);
    if(alt){
      m = [clean, alt[2], alt[3], alt[1]];
    }
  }
  if(!m){
    printLines([
      "CHECK FORMAT - COMMAND NOT RECOGNISED",
      "Amadeus Format: SS [SEATS 1-9] [CLASS] [LINE NUMBER]",
      "Examples: SS1J12 (1 seat, J class, Line 12), SS1Y1, SS2M3",
      "Tip: Make sure to type number 1 (not letter I) for 1 seat."
    ], 'err');
    return;
  }
  if(typoNotice){
    showToast(`✓ Auto-corrected 'I' to '1' -> SS1${m[2]}${m[3]}`);
  }
  const count = parseInt(m[1], 10);
  // Amadeus GDS individual booking limit is maximum 9 seats
  if(count > 9){
    printLines([
      `MAX 9 SEATS PER TRANSACTION — FORMAT ERROR`,
      `ENTERED SEAT COUNT (${count}) EXCEEDS GDS LIMIT (MAX 9 SEATS)`,
      `Format: SS [SEATS] [CLASS] [LINE] (e.g. SS1W1, SS1N1, or SS2K2)`
    ], 'err');
    showToast(`Invalid seat count (${count}) — Max 9 allowed`, 'warn');
    return;
  }
  if(count < 1){
    printLines([`INVALID NUMBER OF SEATS — MUST BE AT LEAST 1`], 'err');
    return;
  }
  const existingPaxCount = (state.passengers || []).filter(p => p.type !== 'infantCarrier').length;
  if(existingPaxCount > count){
    printLines([
      `NOT ENOUGH SEATS FOR ${existingPaxCount} PASSENGER NAME(S)`,
      `YOU REQUESTED ${count} SEAT(S). ENTER AT LEAST ${existingPaxCount} SEAT(S).`,
      `INFANTS TRAVELLING ON AN ADULT'S LAP DO NOT REQUIRE A SEAT.`
    ], 'err');
    showToast(`Cannot hold ${count} seat(s) for ${existingPaxCount} passenger name(s)`, 'warn');
    return;
  }
  const cls = m[2].toUpperCase();
  const lineNum = parseInt(m[3], 10);

  const route = lastANRoute || getFlightSchedule("DAC", "BKK", lastANDate || "12NOV");
  const line = (route && route.lines) ? (route.lines.find(l => l.line === lineNum) || route.lines[0]) : null;

  if(!line){
    printLines([`LINE ${lineNum} NOT FOUND IN CURRENT AVAILABILITY DISPLAY`], 'err');
    return;
  }

  // If previous PNR was finalized or active with a saved locator, reset workspace for new holding
  // Exception: if working in an active PNR (e.g. reissue/exchange), keep existing PNR intact and append segment
  const isExchangeMode = Boolean(state._exchangeMode) || Boolean(state._foRecorded) || Boolean(state._exchangeData);
  const retainTicketedPnr = Boolean(state.locator && (state.ticketed || (state.tickets && state.tickets.length > 0) || state.finalized));
  if(!isExchangeMode && !retainTicketedPnr && !state.locator && state.finalized){
    state.locator = null;
    state.passengers = [];
    state.segments = [];
    state.phone = null;
    state.ticketing = null;
    state.commission = null;
  state.remarks = [];
  state.groupPnr = null;
    state.finalized = false;
    state.specialSSRs = [];
    state.osiEntries = [];
    state.seats = {};
    state.tstRecords = [];
    state.hasTST = false;
  } else if(isExchangeMode && state.finalized){
    // In exchange mode: only reset segments (old ones were already removed via XE), keep everything else
    state.finalized = false;
    state.ticketed = false;
    state.hasTST = false;
    state.tstRecords = [];
  }

  const heldDate = (line && line.date) || lastANDate || line.segs[0].date || "12NOV";
  const dayStr = getDayOfWeek(heldDate);

  const newSegs = line.segs.map((s, idx) => ({
    al: s.al,
    fn: s.fn,
    cls: cls,
    count: count,
    dep: s.dep,
    arr: s.arr,
    depT: s.depT,
    arrT: s.arrT,
    eq: s.eq || '77W',
    date: heldDate,
    day: dayStr,
    status: state.locator ? 'DK' : 'HK',
    fullDate: resolveFlightDate(heldDate).toISOString().slice(0, 10),
    tktCode: `${s.al}/VB7BHH`
  }));

  // Append segments for Roundtrip / Multi-City (আপ-ডাউন একসাথে)
  if(!state.segments) state.segments = [];
  state.segments = state.segments.concat(newSegs);

  // If in an active existing PNR (e.g. reissue/exchange), display full PNR matching Amadeus (seq_11.jpg in video)
  if(state.locator){
    renderPNR();
    updateTopPnrInfo();
    saveCurrentPNRForExchange();
    showToast(`✓ Held ${count} seat(s) on ${newSegs.map(s => s.al + ' ' + s.fn).join(', ')} (Status: DK${count})`);
    return;
  }

  // Real Amadeus Holding Display for new bookings (matches YouTube Screenshot 2 & 5)
  const rows = [];
  rows.push(`--- MSC SFP ---`);
  rows.push(`RP/${state.officeId || OFFICE_ID}/`);

  // If passengers already exist, display them first
  if(state.passengers && state.passengers.length){
    state.passengers.forEach((p, i) => {
      const pNum = (i + 1).toString().padStart(2, ' ');
      rows.push(`<span class="name">${pNum}.${esc(p.label)}</span>`);
    });
  }

  let lineIdx = (state.passengers ? state.passengers.length : 0) + 1;
  const totalSegs = state.segments.length;
  state.segments.forEach((seg, idx) => {
    const segLines = formatSegmentBuildingLines(seg, idx, totalSegs, lineIdx++);
    segLines.forEach(l => rows.push(l));
  });

  printLines(rows, '');
  updateTopPnrInfo();
  // Persist the mid-exchange state so RT <locator> reloads the correct working copy
  if(state.locator && (state._exchangeMode || state._exchangePreTkt || state.ticketed)){
    saveCurrentPNRForExchange();
  }
  showToast(`✓ Held ${count} seat(s) on ${newSegs.map(s => s.al + ' ' + s.fn).join(', ')} (Status: DK${count})`);
}

// ---------- SI ARNK / ARNK — Surface / Open-Jaw break ----------
function handleARNK(cmd){
  if(!state.segments || !state.segments.length){
    printLines(['NO ITINERARY TO INSERT ARNK — ENTER FLIGHT SEGMENT FIRST'], 'err');
    showToast('Enter flight segment first before adding ARNK', 'warn');
    return;
  }
  if(state.segments[state.segments.length - 1].isARNK){
    printLines(['CONSECUTIVE ARNK SEGMENTS NOT PERMITTED'], 'err');
    return;
  }
  state.segments.push({
    isARNK: true,
    type: 'ARNK',
    status: 'ARNK',
    al: 'ARNK',
    fn: '',
    cls: '',
    dep: '',
    arr: '',
    date: '',
    count: 0
  });
  state.hasPending = true;

  const isBuilding = !state.locator && !state.finalized;
  if(isBuilding){
    const rows = [];
    rows.push('--- MSC SFP ---');
    const currOffice = state.officeId || OFFICE_ID;
    rows.push(`RP/${currOffice}/${currOffice}`);
    if(state.passengers && state.passengers.length){
      let paxLine = '';
      state.passengers.forEach((p, i) => {
        paxLine += `${i+1}.${p.label}  `;
      });
      rows.push(paxLine.trim());
    }
    let lineIdx = (state.passengers ? state.passengers.length : 0) + 1;
    const totalSegs = state.segments.length;
    state.segments.forEach((seg, idx) => {
      const segLines = formatSegmentBuildingLines(seg, idx, totalSegs, lineIdx++);
      segLines.forEach(l => rows.push(l));
    });
    printLines(rows, '');
  } else {
    renderPNR();
  }
  updateTopPnrInfo();
  showToast('✓ Surface segment (ARNK) added');
}

// ---------- SO — Sell Open Segment (Open Journey / Open Return) ----------
// Formats:
//   SO EK Y 25DEC DXBDAC
//   SO BG Y OPEN DACKUL
//   0 EK OPEN Y 20DEC DXBDAC
function handleSO(cmd){
  const clean = cmd.trim().toUpperCase();
  const m = clean.match(/^SO\s+([A-Z0-9]{2})\s+([A-Z])(?:\s+(OPEN|\d{1,2}[A-Z]{3}))?\s+([A-Z]{3})([A-Z]{3})$/i)
         || clean.match(/^0\s+([A-Z0-9]{2})\s+OPEN\s+([A-Z])(?:\s+(OPEN|\d{1,2}[A-Z]{3}))?\s+([A-Z]{3})([A-Z]{3})$/i);

  if(!m){
    printLines([
      'FORMAT ERROR — SELL OPEN SEGMENT',
      'Format: SO [AIRLINE] [CLASS] [DATE/OPEN] [ORIGIN][DESTINATION]',
      'Example: SO EK Y 25DEC DXBDAC',
      'Example: SO BG Y OPEN DACKUL',
      'Example: 0 EK OPEN Y 20DEC DXBDAC'
    ], 'err');
    return;
  }

  const al = m[1].toUpperCase();
  const cls = m[2].toUpperCase();
  const date = (m[3] || 'OPEN').toUpperCase();
  const dep = m[4].toUpperCase();
  const arr = m[5].toUpperCase();

  state.segments = state.segments || [];
  state.segments.push({
    isOpen: true,
    al: al,
    fn: 'OPEN',
    cls: cls,
    date: date,
    day: (date !== 'OPEN') ? getDayOfWeek(date) : '',
    dep: dep,
    arr: arr,
    status: 'OPEN',
    count: 1,
    depT: '',
    arrT: '',
    arrDate: '',
    eq: '',
    confirmedEndCode: `E  ${al}/OPEN`
  });
  state.hasPending = true;

  const isBuilding = !state.locator && !state.finalized;
  if(isBuilding){
    const rows = [];
    rows.push('--- MSC SFP ---');
    const currOffice = state.officeId || OFFICE_ID;
    rows.push(`RP/${currOffice}/${currOffice}`);
    if(state.passengers && state.passengers.length){
      let paxLine = '';
      state.passengers.forEach((p, i) => {
        paxLine += `${i+1}.${p.label}  `;
      });
      rows.push(paxLine.trim());
    }
    let lineIdx = (state.passengers ? state.passengers.length : 0) + 1;
    const totalSegs = state.segments.length;
    state.segments.forEach((seg, idx) => {
      const segLines = formatSegmentBuildingLines(seg, idx, totalSegs, lineIdx++);
      segLines.forEach(l => rows.push(l));
    });
    printLines(rows, '');
  } else {
    renderPNR();
  }
  updateTopPnrInfo();
  showToast(`✓ Open segment added (${al} OPEN ${cls} ${dep}-${arr})`);
}

function getHeldSeatCapacity(){
  const heldCounts = (state.segments || [])
    .filter(seg => !seg.isARNK && !seg.isOpen)
    .map(seg => Number(seg.count))
    .filter(count => Number.isFinite(count) && count > 0);
  return heldCounts.length ? Math.min(...heldCounts) : null;
}

function getSeatRequiringPaxCount(){
  if(!state.passengers || !state.passengers.length) return 0;
  let count = 0;
  state.passengers.forEach(p => {
    if(p.type === 'adult' || p.type === 'child' || !p.type){
      count++;
    } else if(p.type === 'infantCarrier'){
      if(!p.adultCode){
        count++;
      }
    }
  });
  return count;
}

function canAddPassengerName(){
  const seatCapacity = getHeldSeatCapacity();
  const currentCount = getSeatRequiringPaxCount();
  if(seatCapacity === null || currentCount < seatCapacity) return true;

  printLines([
    `PASSENGER NAME LIMIT EXCEEDED`,
    `${seatCapacity} SEAT(S) HELD — ONLY ${seatCapacity} ADULT/CHILD PASSENGER NAME(S) CAN BE ENTERED.`,
    `CURRENT PASSENGER NAMES: ${currentCount}. INFANTS ON LAP DO NOT REQUIRE A SEAT, BUT MUST BE ADDED WITH AN ADULT NAME.`
  ], 'err');
  showToast(`Name not added — ${seatCapacity} seat(s) are held`, 'warn');
  return false;
}

function getTravelReferenceDate(){
  if(state.segments && state.segments.length > 0 && state.segments[0]){
    const s0 = state.segments[0];
    if(s0.fullDate){
      const d = new Date(s0.fullDate);
      if(!isNaN(d.getTime())) return d;
      const mFull = String(s0.fullDate).trim().match(/^(\d{1,2})([A-Z]{3})\s+(\d{4})$/i);
      if(mFull){
        const months = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
        const mIdx = months[mFull[2].toUpperCase()];
        if(mIdx !== undefined){
          return new Date(parseInt(mFull[3], 10), mIdx, parseInt(mFull[1], 10));
        }
      }
    }
    if(s0.date){
      const mDate = String(s0.date).trim().match(/^(\d{1,2})([A-Z]{3})$/i);
      if(mDate){
        const months = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
        const mIdx = months[mDate[2].toUpperCase()];
        if(mIdx !== undefined){
          return resolveFlightDate(s0.date);
        }
      }
    }
  }
  return new Date();
}

function parsePassengerDOB(dobStr, refDate){
  if(!dobStr) return null;
  const m = dobStr.trim().match(/^(\d{1,2})([A-Z]{3})(\d{2}|\d{4})$/i);
  if(!m) return null;
  const day = parseInt(m[1], 10);
  const monName = m[2].toUpperCase();
  const yrStr = m[3];
  const months = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
  const monIdx = months[monName];
  if(monIdx === undefined) return null;

  const ref = refDate || new Date();
  const refYear = ref.getFullYear();
  let birthYear;
  if(yrStr.length === 4){
    birthYear = parseInt(yrStr, 10);
  } else {
    const yy = parseInt(yrStr, 10);
    const century = Math.floor(refYear / 100) * 100;
    birthYear = century + yy;
    if(birthYear > refYear + 1){
      birthYear -= 100;
    }
  }

  const birthDate = new Date(birthYear, monIdx, day);
  if(birthDate.getMonth() !== monIdx || birthDate.getDate() !== day){
    return { error: 'INVALID_DATE' };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if(birthDate > today){
    return { error: 'FUTURE_DOB', birthDate, refDate: ref };
  }

  const travelDay = new Date(ref.getFullYear(), ref.getMonth(), ref.getDate());
  if(birthDate > travelDay){
    return { error: 'AFTER_TRAVEL', birthDate, refDate: travelDay };
  }

  let age = ref.getFullYear() - birthDate.getFullYear();
  const mDiff = ref.getMonth() - birthDate.getMonth();
  if(mDiff < 0 || (mDiff === 0 && ref.getDate() < birthDate.getDate())){
    age--;
  }

  return { age, birthDate, refDate: ref };
}

function handleNM(cmd){
  // Multi-passenger with same surname: e.g. NM2CHOWDHURY/RAHIM MR/KARIM MR
  const multiMatch = cmd.match(/^NM(\d+)([A-Z ]+)\/(.+)$/i);
  if(multiMatch && parseInt(multiMatch[1], 10) > 1 && !multiMatch[3].includes('(INF') && !multiMatch[3].includes('(CHD')){
    const count = parseInt(multiMatch[1], 10);
    const surname = multiMatch[2].trim().toUpperCase();
    const givens = multiMatch[3].split('/').map(g => g.trim().toUpperCase()).filter(Boolean);
    state.passengers = state.passengers || [];
    givens.forEach((given, idx) => {
      const pCode = `P${state.passengers.length + 1}`;
      const titleMatch = given.match(/\s+(MR|MRS|MS|MSTR|MISS)$/i);
      const title = titleMatch ? titleMatch[1].toUpperCase() : 'MR';
      const givenClean = given.replace(/\s+(MR|MRS|MS|MSTR|MISS)$/i, '').trim();
      const newPax = {
        code: pCode,
        name: `${surname}/${givenClean} ${title}`,
        type: 'ADT',
        surname: surname,
        given: `${givenClean} ${title}`,
        title: title
      };
      state.passengers.push(newPax);
    });
    if(typeof updateTopPnrInfo === 'function') updateTopPnrInfo();
    renderBuildingPNRAfterNM(state.passengers[state.passengers.length - 1]);
    return;
  }
  // A lap infant is part of the accompanying adult's name element.  Accept
  // the Amadeus forms INF/FIRST/DOB, INFSURNAME/FIRST/DOB and INF//DOB.
  let m = cmd.match(/^NM1([A-Z ]+)\/([A-Z .]+?)\s+(MSTR|MISS|MRS|MR|MS)\s*\(INF(?:\/([A-Z .]*?)|([A-Z][A-Z ]*)\/([A-Z .]+?)(?:\s+(MSTR|MISS|MRS|MR|MS))?)\/(\d{2}[A-Z]{3}\d{2,4})\)$/i);
  if(m){
    const adultSurname = m[1].trim().toUpperCase();
    const adultFirst = m[2].trim().toUpperCase();
    const adultTitle = m[3].toUpperCase();
    const infantSurname = (m[5] || adultSurname).trim().toUpperCase();
    const infantFirst = (m[4] || m[6] || '').trim().toUpperCase();
    const infantTitle = (m[7] || '').toUpperCase();
    const infantDob = m[8].toUpperCase();
    const refDate = getTravelReferenceDate();
    const dobInfo = parsePassengerDOB(infantDob, refDate);

    if(!dobInfo || dobInfo.error === 'INVALID_DATE'){
      printLines([
        `INVALID DATE OF BIRTH — ${infantDob}`,
        `FORMAT MUST BE DDMMMYY (E.G. 23JAN24)`
      ], 'err');
      showToast(`Invalid infant DOB: ${infantDob}`, 'warn');
      return;
    }
    if(dobInfo.error === 'FUTURE_DOB'){
      printLines([
        `CHECK DATE OF BIRTH`,
        `DATE OF BIRTH CANNOT BE IN THE FUTURE (${infantDob}).`
      ], 'err');
      showToast('Infant DOB cannot be in the future', 'warn');
      return;
    }
    if(dobInfo.error === 'AFTER_TRAVEL'){
      printLines([
        `CHECK DATE OF BIRTH`,
        `PASSENGER CANNOT TRAVEL BEFORE THEIR DATE OF BIRTH (${infantDob}).`
      ], 'err');
      showToast('Infant DOB is after the travel date', 'warn');
      return;
    }
    if(dobInfo.age >= 2){
      printLines([
        `CHECK PASSENGER AGE`,
        `RESTRICTED AGE FOR INFANT — PASSENGER IS 2 YEARS OR OLDER (${dobInfo.age} YRS).`,
        `INFANTS MUST BE UNDER 2 YEARS ON TRAVEL DATE. PASSENGER MUST BE BOOKED AS CHILD (CHD) WITH A SEAT.`
      ], 'err');
      showToast(`Infant not accepted — age is ${dobInfo.age} yrs (must be under 2)`, 'warn');
      return;
    }

    const nameDisplay = `${adultSurname}/${adultFirst} ${adultTitle}`;
    const infant = { surname:infantSurname, first:infantFirst, title:infantTitle, dob:infantDob, display:`${infantSurname} ${infantFirst}`.trim() };
    const infantName = infantFirst ? `${infantSurname}/${infantFirst}${infantTitle ? ` ${infantTitle}` : ''}` : '';
    const infantSuffix = infantSurname === adultSurname
      ? `(INF/${infantFirst}${infantTitle ? ` ${infantTitle}` : ''}/${infantDob})`
      : `(INF${infantName}/${infantDob})`;
    const existingAdult = (state.passengers || []).find(p => p.nameDisplay?.toUpperCase() === nameDisplay.toUpperCase());
    if(existingAdult){
      if(existingAdult.infant){
        printLines([`INFANT ALREADY EXISTS FOR ${nameDisplay}`], 'err');
        showToast('Infant not added — this adult already has an infant', 'warn');
        return;
      }
      const newPax = existingAdult;
      newPax.type = 'infantCarrier';
      newPax.label = `${nameDisplay}${infantSuffix}`;
      newPax.infant = infant;
      updateTopPnrInfo();
      renderBuildingPNRAfterNM(newPax);
      showToast(`✓ Infant added with ${nameDisplay}`);
      return;
    }
    // This legacy validation is intentionally bypassed: an NM1 adult+INF
    // entry may add a new adult to an existing PNR.
    // A new adult may be entered directly with an infant, including after
    // other names have been added. Do not require a prior matching adult.
    if(false && state.passengers && state.passengers.length > 0){
      printLines([
        `INFANT ENTRY NOT ACCEPTED`,
        `NO MATCHING ADULT FOUND FOR: ${nameDisplay}`,
        `INFANT MUST BE ATTACHED TO AN EXISTING ADULT PASSENGER.`,
        `STEP 1: ENTER ADULT NAME FIRST  → NM1${m[1].trim()}/${m[2].trim()} ${m[3]}`,
        `STEP 2: THEN RE-ENTER WITH INFANT → NM1${m[1].trim()}/${m[2].trim()} ${m[3]}(INF${infant.surname}/${infant.first} ${infant.title}/${infant.dob})`
      ], 'err');
      showToast(`Infant not added — enter adult name first: ${nameDisplay}`, 'warn');
      return;
    }
    // No passengers yet: accept combined adult+infant as first entry
    if(!canAddPassengerName()) return;
    const pCode = `P${state.passengers.length+1}`;
    const newPax = {
      code: pCode, type:'infantCarrier',
      label: `${nameDisplay}${infantSuffix}`,
      nameDisplay,
      infant
    };
    state.passengers.push(newPax);
    updateTopPnrInfo();
    renderBuildingPNRAfterNM(newPax);
    return;
  }
    m = cmd.match(/^NM1([A-Z ]+)\/([A-Z .]+?)\s+(MSTR|MISS)\(CHD\/(\d{2}[A-Z]{3}\d{2,4})\)$/i);
  if(m){
    const childDob = m[4].toUpperCase();
    const refDate = getTravelReferenceDate();
    const dobInfo = parsePassengerDOB(childDob, refDate);

    if(!dobInfo || dobInfo.error === 'INVALID_DATE'){
      printLines([
        `INVALID DATE OF BIRTH — ${childDob}`,
        `FORMAT MUST BE DDMMMYY (E.G. 23JAN16)`
      ], 'err');
      showToast(`Invalid child DOB: ${childDob}`, 'warn');
      return;
    }
    if(dobInfo.error === 'FUTURE_DOB'){
      printLines([
        `CHECK DATE OF BIRTH`,
        `DATE OF BIRTH CANNOT BE IN THE FUTURE (${childDob}).`
      ], 'err');
      showToast('Child DOB cannot be in the future', 'warn');
      return;
    }
    if(dobInfo.error === 'AFTER_TRAVEL'){
      printLines([
        `CHECK DATE OF BIRTH`,
        `PASSENGER CANNOT TRAVEL BEFORE THEIR DATE OF BIRTH (${childDob}).`
      ], 'err');
      showToast('Child DOB is after the travel date', 'warn');
      return;
    }
    if(dobInfo.age < 2){
      printLines([
        `CHECK PASSENGER AGE`,
        `RESTRICTED AGE FOR CHILD — PASSENGER IS UNDER 2 YEARS OLD (${dobInfo.age} YRS).`,
        `CHILD (CHD) MUST BE AT LEAST 2 YEARS OLD. PASSENGERS UNDER 2 MUST BE BOOKED AS INFANT (INF).`
      ], 'err');
      showToast(`Child not accepted — age is under 2 (must be booked as INF)`, 'warn');
      return;
    }
    if(dobInfo.age >= 12){
      printLines([
        `CHECK PASSENGER AGE`,
        `RESTRICTED AGE FOR CHILD — PASSENGER IS 12 YEARS OR OLDER (${dobInfo.age} YRS).`,
        `CHILD (CHD) MUST BE UNDER 12 YEARS OLD (2-11 YEARS). PASSENGERS 12 AND OLDER MUST BE BOOKED AS ADULT.`
      ], 'err');
      showToast(`Child not accepted — age is ${dobInfo.age} yrs (must be booked as Adult)`, 'warn');
      return;
    }

    if(!canAddPassengerName()) return;
    const pCode = `P${state.passengers.length+1}`;
    const newPax = {
      code: pCode, type:'child',
      label: `${m[1].trim()}/${m[2].trim()} ${m[3]}(CHD/${childDob})`,
      nameDisplay: `${m[1].trim()}/${m[2].trim()} ${m[3]}`, dob:childDob
    };
    state.passengers.push(newPax);
    updateTopPnrInfo();
    renderBuildingPNRAfterNM(newPax);
    return;
  }
  m = cmd.match(/^NM1([A-Z ]+)\/([A-Z .]+?)\s+(MR|MRS|MS)$/i);
  if(m){
    if(!canAddPassengerName()) return;
    const pCode = `P${state.passengers.length+1}`;
    const newPax = {
      code: pCode, type:'adult',
      label: `${m[1].trim()}/${m[2].trim()} ${m[3]}`,
      nameDisplay: `${m[1].trim()}/${m[2].trim()} ${m[3]}`
    };
    state.passengers.push(newPax);
    updateTopPnrInfo();
    renderBuildingPNRAfterNM(newPax);
    return;
  }
  printLines(["INVALID FORMAT — try NM1SURNAME/FIRST NAME MR"], 'err');
}

function renderBuildingPNRAfterNM(newPax){
  if(state.segments && state.segments.length){
    renderPNR();
  } else {
    printLines([`<span class="name">${esc(newPax.nameDisplay)} *</span>`], '');
  }
  updateTopPnrInfo();
  showToast(`✅ Passenger added: ${newPax.nameDisplay}`);
}

function handleAP(cmd){
  state.phone = cmd.replace(/^AP\s*/i, '').trim();
  renderPNR();
  showToast(`✓ AP contact added`);
}

function handleTK(cmd){
  const upper = cmd.toUpperCase().trim();
  const isOK = /^TK\s*OK/i.test(upper);

  let rest = upper.replace(/^TK\s*(OK|TL)\s*/i, '').trim();
  const currentOffice = (state.officeId || (state.locator === 'OGJZJ9' ? 'DACVS31XW' : OFFICE_ID));

  let datePart = "";
  if(rest){
    if(rest.includes('/')){
      const parts = rest.split('/');
      datePart = parts[0];
    } else {
      datePart = rest;
    }
  }
  if(!datePart){
    const now = new Date();
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const todayStr = String(now.getDate()).padStart(2, '0') + months[now.getMonth()];
    datePart = todayStr;
  }

  const prefix = isOK ? "OK" : "TL";
  if(rest && rest.includes('/')){
    state.ticketing = `${prefix}${rest.replace(/^(OK|TL)/i, '')}`;
  } else {
    state.ticketing = `${prefix}${datePart}/${currentOffice}`;
  }

  renderPNR();
  showToast(`✅ Ticketing set: TK ${state.ticketing}`);
}

// ---------- FM — Fare Modifier / Commission (Screenshot 1: FM7) ----------
function handleFM(cmd){
  const upper = cmd.toUpperCase().trim();
  const m = upper.match(/^FM\s*(\*?[0-9.]+%?N?)?/i);
  const val = (m && m[1]) ? m[1].replace(/[*N%]/g, '') : "7";
  state.commission = val + "%";
  state.hasPending = false;
  if(state.segments && state.segments.length) renderPNR();
  else printLines(["Commission already added"], 'success');
  showToast(`✓ Commission ${state.commission} added (FM)`);
}

function handleRF(cmd){
  const rf = cmd.replace(/^RF\s*/i, '').trim() || 'R';
  state.receivedFrom = rf;
  state.rfEntry = rf.toUpperCase(); // store e.g. 'SB'
  // Re-display PNR with RF line at the top (real Amadeus shows "RF SB" after RP/ header)
  if(state.segments && state.segments.length){
    renderPNR();
  } else {
    printLines([`RF ${rf.toUpperCase()}`], 'success');
  }
  showToast(`✓ Received From (${rf.toUpperCase()}) saved`);
}

// An airline locator is separate from the Amadeus record locator by default.
// Hosting and interline arrangements vary by carrier and can change; an airline
// being available in Amadeus (or using an Amadeus product such as NDC) is not
// enough to infer a shared locator.  A lesson that specifically requires one
// must declare it on the segment with `sharesAmadeusLocator: true`.
function sharesAmadeusLocator(segment){
  return Boolean(segment && segment.sharesAmadeusLocator === true);
}

function generateRandomLocator(){
  const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const digits = "23456789";
  const pick = chars => chars.charAt(Math.floor(Math.random() * chars.length));
  // Amadeus record locators use six alphanumeric characters. Ensure newly
  // generated training PNRs visibly contain both letters and digits.
  const chars = [pick(letters), pick(digits)];
  const all = letters + digits;
  while(chars.length < 6) chars.push(pick(all));
  for(let i = chars.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

function handleER(){
  // Validate: must have at least one segment and passenger
  if(!state.segments || !state.segments.length){
    printLines(['NO ITINERARY TO END RECORD'], 'err');
    return;
  }

  // A PNR may temporarily show more name elements than the number of seats
  // held (NHP). Amadeus allows entry but rejects ER until the party size is
  // corrected or the itinerary is explicitly associated.
  const heldSeatCapacity = getHeldSeatCapacity();
  const seatRequiringCount = getSeatRequiringPaxCount();
  if(heldSeatCapacity !== null && seatRequiringCount > 0 && seatRequiringCount !== heldSeatCapacity){
    printLines([
      '*** NHP ***',
      'NEED PASSENGER/SEGMENT ASSOC.',
      `${seatRequiringCount} SEAT-REQUIRING PASSENGER(S) — ${heldSeatCapacity} SEAT(S) HELD.`,
      `CORRECT THE PARTY SIZE OR REBOOK THE REQUIRED NUMBER OF SEATS.`
    ], 'err');
    showToast('PNR not ended — passenger and seat count do not match', 'warn');
    return;
  }

  // Validate CTCM/CTCE/CTCR warning check:
  // Step 1: On initial RF...;ER if missing CTCM/CTCE/CTCR, show WARNING and prompt (block once)
  // Step 2: If user types ER right after the warning (state.warnedMissingCTC is true), bypass check and finalize PNR!
  const primaryAl = state.segments[0] ? state.segments[0].al : null;
  const hasCTCM = state.specialSSRs && state.specialSSRs.some(s => s.type === 'CTCM');
  const hasCTCE = state.specialSSRs && state.specialSSRs.some(s => s.type === 'CTCE');
  const hasCTCR = state.specialSSRs && state.specialSSRs.some(s => s.type === 'CTCR');

  if(!hasCTCM && !hasCTCE && !hasCTCR && !state.warnedMissingCTC){
    state.warnedMissingCTC = true; // Mark that user has seen the warning once
    const warnLines = [];
    const paxCount = state.passengers ? state.passengers.length : 1;
    for(let i = 1; i <= Math.max(1, paxCount); i++){
      warnLines.push(`WARNING: SECURE FLT PASSENGER DATA REQUIRED FOR TICKETING PAX ${i}`);
    }
    warnLines.push(`WARNING: MISSING SSR CTCM MOBILE OR SSR CTCE EMAIL OR SSR CTCR NON-CONSENT`);
    warnLines.push(`          FOR ${primaryAl || 'CARRIER'}`);
    printLines(warnLines, 'warn');
    return; // First attempt: show warning only (PNR not created yet)
  }

  // If user passed the check or typed ER second time after warning:
  state.warnedMissingCTC = false;

  // Validate Ticketing arrangement (TK)
  if(!state.ticketing){
    printLines(['NEED TICKETING ARRANGEMENT'], 'warn');
    return; // Do NOT finalize — ER rejected
  }

  // At this point ER succeeds — generate locator, build confirmed PNR
  if(!state.locator) state.locator = generateRandomLocator();

  // Format date parts for headers
  const now = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dayStr = String(now.getDate()).padStart(2,'0');
  const monStr = months[now.getMonth()];
  const yrStr  = String(now.getFullYear()).slice(-2);
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const erDateStamp = `${dayStr}${monStr}${yrStr}/${hh}${mm}Z`;
  state.dateStamp = erDateStamp;

  // Build agent code: use state one or derive from officeId
  const currOffice = state.officeId || OFFICE_ID;
  state.agentCode = state.agentCode || 'SS/GS';

  // Build second RP header line: DACVS33GT/0002SS/7SEP26
  // 0002 = booking sequence (simulate incrementing), SS = airline code abbrev, date
  const seqNum = String(Math.floor(Math.random() * 9000) + 1000).padStart(4,'0');
  const alCode = primaryAl || 'TK';
  const shortDate = `${now.getDate()}${monStr}${yrStr}`;
  state.erHeaderLine2 = `${currOffice}/${seqNum}${alCode}/${shortDate}`;

  // Update segments to HK and set confirmed end-code format: E  AL/LOCATOR
  // Give each airline its own locator unless this exact lesson explicitly models
  // a shared Amadeus-hosted record.
  const airlineLocMap = {};
  state.segments.forEach(s => {
    if(s.isARNK || s.isOpen) return;
    if(s.airlineLocator){
      airlineLocMap[s.al] = s.airlineLocator;
    }
  });
  state.segments.forEach(s => {
    if(s.isARNK || s.isOpen) return;
    s.status = 'HK';
    if(!s.airlineLocator){
      if(airlineLocMap[s.al]){
        s.airlineLocator = airlineLocMap[s.al];
      } else if(sharesAmadeusLocator(s)){
        s.airlineLocator = state.locator;
        airlineLocMap[s.al] = state.locator;
      } else {
        let newLoc = generateRandomLocator();
        while(newLoc === state.locator){
          newLoc = generateRandomLocator();
        }
        s.airlineLocator = newLoc;
        airlineLocMap[s.al] = newLoc;
      }
    }
    s.confirmedEndCode = `E  ${s.al}/${s.airlineLocator}`;
  });

  state.finalized = true;
  state.hasPending = false;
  state.justEndedRecord = !state.mscHeader; // MSC output shows its fare elements and deadline remarks immediately

  // Auto-generate airline advisory SSR OTHS on IR if missing contact (matches user screenshot 3)
  if((!hasCTCM || !hasCTCE) && !state.airlineAdvOths){
    const al = primaryAl || 'ZZ';
    const randRef = Math.floor(Math.random() * 9000000000) + 1000000000;
    state.airlineAdvOths = `SSR OTHS ${al} ${randRef} - PLS ADV PA\n       SSR CTCM CTCE`;
  }

  // Auto-generate OPW/OPC for TG, MH, SV and all other airlines
  if(!state.opcRemarks || !state.opcRemarks.length){
    const opwDate = new Date(now); opwDate.setDate(now.getDate() + 1);
    const opcDate = new Date(now); opcDate.setDate(now.getDate() + 3);
    const opwStr = `${String(opwDate.getDate()).padStart(2,'0')}${months[opwDate.getMonth()]}`;
    const opcStr = `${String(opcDate.getDate()).padStart(2,'0')}${months[opcDate.getMonth()]}`;
    const segNums = state.segments.length > 1 ? `S2-${state.segments.length+1}` : `S2`;
    if(primaryAl === 'TG'){
      state.opwRemarks = [
        `OPW-${opwStr}:2300/1C7/TG REQUIRES TICKET ON OR BEFORE\n        ${opcStr}:2300 DAC TIME ZONE/TKT/${segNums}`
      ];
      state.opcRemarks = [
        `OPC-${opcStr}:2300/1C8/TG CANCELLATION DUE TO NO TICKET DAC TIME\n        ZONE/TKT/${segNums}`
      ];
    } else if(primaryAl === 'MH'){
      state.opcRemarks = [
        `OPC-${opcStr}:0800/1C8/MH CANCELLATION DUE TO NO TICKET ZZZ TIME\n        ZONE/TKT/${segNums}`
      ];
    } else if(primaryAl === 'AI'){
      state.opcRemarks = [
        `OPC-${opcStr}:2300/1C8/AI CANCELLATION DUE TO NO TICKET DAC TIME\n        ZONE/TKT/${segNums}`
      ];
    } else {
      state.opwRemarks = [
        `OPW-${opwStr}:2300/1C7/${primaryAl||'1A'} REQUIRES TICKET ON OR BEFORE\n        ${opwStr}${yrStr}:2300 TIME ZONE OF POS / OTHERWISE WILL BE XLD`
      ];
      state.opcRemarks = [
        `OPC-${opcStr}:2300/1C8/${primaryAl||'1A'} CANCELLATION DUE TO NO TICKET DAC TIME\n        ZONE/TKT/${segNums}`
      ];
    }
  }

  // ER/ET has committed the record.  From this point IG must not remove it.
  saveCurrentPNR();
  renderPNR();
  updateTopPnrInfo();
  showToast(`✅ PNR Confirmed & Saved: ${state.locator}`);
}

function handleIR(){
  state.justEndedRecord = false;
  // If ER was never successfully run (no locator) but PNR is being built:
  if(!state.locator){
    if(state.passengers.length || state.segments.length){
      // PNR is started but not finished — RESTRICTED
      printLines(['RESTRICTED : PNR NOT FINISHED'], 'err');
      return;
    } else {
      // Empty workspace — load lesson PNR
      loadLessonPNR();
      return;
    }
  }
  // Has locator — either finalized or a pre-loaded PNR
  const currOffice = state.officeId || OFFICE_ID;
  const agCode = state.agentCode || 'SS/GS';
  const dt = state.dateStamp || '17JUN26/1324Z';
  const headerLine2 = state.erHeaderLine2 || state.headerLine2 || '';
  const rlrHeader = state.mscHeader ? (state.hasTST ? `--- TST RLR MSC ---` : `--- RLR MSC ---`) : (state.hasTST ? `--- TST RLR ---` : `--- RLR ---`);
  const header = `${rlrHeader}\nRP/${currOffice}/${currOffice}            ${agCode}   ${dt}   <span class="locator">${state.locator}</span>${state.mscHeader ? '' : (headerLine2 ? '\n' + headerLine2 : '')}`;
  renderPNR(header);
}

function handleRL(){
  state.justEndedRecord = false;
  if(!state.locator && (!state.segments || !state.segments.length)){
    printLines(['NO PNR RETRIEVED'], 'err');
    return;
  }
  if(!state.locator){
    printLines(['RESTRICTED : PNR NOT FINISHED'], 'err');
    return;
  }
  const lines = ['RL'];
  let count = 1;
  const seenAirlines = new Set();
  (state.segments || []).forEach(s => {
    if(!seenAirlines.has(s.al)){
      seenAirlines.add(s.al);
      let loc = s.airlineLocator;
      if(!loc){
        if(sharesAmadeusLocator(s)){
          loc = state.locator;
        } else if(s.confirmedEndCode && s.confirmedEndCode.includes('/')){
          loc = s.confirmedEndCode.split('/')[1].trim();
        } else {
          loc = state.locator;
        }
      }
      const dateStr = s.date || '12DEC';
      lines.push(` ${count} ${s.al} - <span class="locator">${loc}</span> / ${dateStr}`);
      count++;
    }
  });
  if(count === 1){
    lines.push(` 1 1A - <span class="locator">${state.locator}</span>`);
  }
  printLines(lines, '');
}

// ---------- RTTN — Retrieve Ticket Numbers (Standard Amadeus GDS, Video 06:46) ----------
function handleRTTN(){
  if(!state.locator && (!state.tickets || !state.tickets.length)){
    printLines(['NO ACTIVE PNR OR TICKET RECORD'], 'err');
    return;
  }
  const currOffice = state.officeId || OFFICE_ID;
  const agCode = state.agentCode || (state.locator === 'OGJZJ9' ? 'BP/AS' : (state.locator === 'ICRBPO' ? 'BP/AS' : 'SS/GS'));
  const dateStamp = state.dateStamp || '17JUN26/1324Z';
  const locator = state.locator || 'ICRBPO';

  const rows = [];
  rows.push(``);
  rows.push(`                             ${agCode}   ${dateStamp}   <span class="locator">${locator}</span>`);

  const linesFound = [];
  if(state._lineMap && Object.keys(state._lineMap).length){
    Object.keys(state._lineMap).forEach(k => {
      const lineNum = parseInt(k, 10);
      const text = state._lineMap[k] || '';
      if(/^F(?:A|HE)\s+PAX\b/i.test(text)){
        linesFound.push({ lineNum, text });
      }
    });
  }

  if(linesFound.length){
    linesFound.sort((a, b) => a.lineNum - b.lineNum);
    linesFound.forEach(item => {
      rows.push(`${item.lineNum.toString().padStart(2, ' ')}  ${item.text}`);
    });
  } else if(state.tickets && state.tickets.length){
    // If _lineMap not yet populated, build from state.tickets
    let lIdx = 7;
    state.tickets.forEach(t => {
      const pNum = t.pax ? t.pax.replace('.', 'P').replace(/\s+/g, '') : 'P1';
      const alLet = t.alLetter || 'BG';
      const dt = t.tktDate || '23NOV26';
      rows.push(`${lIdx.toString().padStart(2, ' ')}  FA PAX ${t.tktNum}/ET${alLet}/${dt}/${currOffice}/23567890/S3-4/${pNum}`);
      lIdx++;
      if(t.penaltyEMD){
        rows.push(`${lIdx.toString().padStart(2, ' ')}  FA PAX ${t.penaltyEMD}/DT${alLet}/${dt}/${currOffice}/23567890/S2/PENALTY`);
        lIdx++;
      }
      if(t.originalIssue){
        rows.push(`${lIdx.toString().padStart(2, ' ')}  FHE PAX ${t.originalIssue}`);
        lIdx++;
      }
    });
  } else {
    rows.push('NO ELECTRONIC TICKET RECORD IN ACTIVE PNR');
  }

  rows.push('*TRN*');
  printLines(rows, '');
}

// ---------- RT Filtering Subcommands (RTA, RTI, RTN, RTP, RTF, RTS, RTM) ----------
function handleRTFilter(type){
  if(!state.locator && !state.segments.length && !state.passengers.length){
    printLines(['NO ACTIVE PNR TO RETRIEVE'], 'err');
    return;
  }
  const currOffice = state.officeId || OFFICE_ID;
  const agCode = state.agentCode || (state.locator === 'OGJZJ9' ? 'BP/AS' : (state.locator === 'ICRBPO' ? 'BP/AS' : 'SS/GS'));
  const dateStamp = state.dateStamp || '17JUN26/1324Z';
  const locator = state.locator || 'ICRBPO';

  const rows = [];
  rows.push(``);
  rows.push(`                             ${agCode}   ${dateStamp}   <span class="locator">${locator}</span>`);

  if(type === 'NAME'){
    (state.passengers || []).forEach((p, i) => {
      rows.push(` ${i+1}.${p.label || 'PASSENGER'}`);
    });
  } else if(type === 'AIR' || type === 'ITIN'){
    (state.segments || []).forEach((s, i) => {
      const sNum = (i + 2).toString().padStart(2, ' ');
      rows.push(`${sNum}  ${s.al} ${s.fn} ${s.cls}  ${s.date} ${s.day||''} ${s.dep}${s.arr} ${s.status}${s.count||1}  ${s.depT} ${s.arrT}  *1A/E*`);
    });
  } else if(type === 'AP'){
    if(state.phone) rows.push(` 3  AP ${state.phone}`);
    else rows.push(` 3  AP DAC JHONY TECH TRAVEL CTC0505793144`);
  } else if(type === 'FARE'){
    if(state.fop) rows.push(` 5  FP ${state.fop}`);
    if(state._lineMap){
      Object.keys(state._lineMap).forEach(k => {
        const text = state._lineMap[k] || '';
        if(/^F[ABEMPV]\s+/i.test(text)){
          rows.push(`${k.padStart(2, ' ')}  ${text}`);
        }
      });
    }
  } else if(type === 'SSR'){
    if(state.specialSSRs && state.specialSSRs.length){
      state.specialSSRs.forEach((s, i) => {
        rows.push(` ${(i+10).toString().padStart(2, ' ')}  SSR ${s.type} ${s.al} ${s.status} ${s.value||''}`);
      });
    } else {
      rows.push(`NO SSR ELEMENTS IN THIS PNR`);
    }
  } else if(type === 'RM'){
    if(state.remarks && state.remarks.length){
      state.remarks.forEach((r, i) => {
        rows.push(` ${(i+10).toString().padStart(2, ' ')}  RM ${r.text}`);
      });
    } else {
      rows.push(`NO REMARK ELEMENTS IN THIS PNR`);
    }
  }

  rows.push('*TRN*');
  printLines(rows, '');
}

function handleRT(cmd){
  state.justEndedRecord = false;
  const upper = String(cmd || '').trim().toUpperCase();
  const clean = upper.replace(/\s+/g, '');

  // 1. RTTN / RT TN — Retrieve Ticket Numbers (matches video at 06:46!)
  if(clean === 'RTTN' || clean === 'RTT' || /^RT\s*TN$/i.test(upper)){
    return handleRTTN();
  }

  // 2. Other Amadeus RT filter subcommands (RTA, RTI, RTN, RTP, RTF, RTS, RTSVC, RTM)
  if(clean === 'RTA') return handleRTFilter('AIR');
  if(clean === 'RTI') return handleRTFilter('ITIN');
  if(clean === 'RTN' && lastNameSearch !== 'APON/SHAKIB') return handleRTFilter('NAME');
  if(clean === 'RTP') return handleRTFilter('AP');
  if(clean === 'RTF') return handleRTFilter('FARE');
  if(clean === 'RTS' || clean === 'RTSVC') return handleRTFilter('SSR');
  if(clean === 'RTM') return handleRTFilter('RM');

  const loc = (cmd||'').replace(/^RT\s*/i, '').trim().toUpperCase();

  if(/^\d+$/.test(loc) && lastLpoResults){
    const selected = lastLpoResults[parseInt(loc, 10) - 1];
    if(selected){ loadSavedPNR(selected); return; }
  }

  // Name search — mirrors the compact Amadeus RT/name response.  The user
  // can then enter RT1 to retrieve the first matching booking file.
  if(loc === '/APON/SHAKIB' || loc === 'APON/SHAKIB'){
    lastNameSearch = 'APON/SHAKIB';
    printLines([
      'RT/APON/SHAKIB',
      '<span class="name">1 APON/SHAKIB MR</span>       <span class="al">PG  4824 H</span>  12DEC  DACBKK   1  <span class="locator">7PHIKV</span>',
      '<span class="name">2 APON/SHAKIB MR</span>       <span class="al">MH  197  H</span>  23DEC  DACKUL   1  <span class="locator">92Q7MB</span>',
      '<span class="name">3 APON/SHAKIB MR</span>       NO ACTIVE ITINERARY          <span class="locator">92C57S</span>'
    ], '');
    return;
  }
  if(loc === '1' && lastNameSearch === 'APON/SHAKIB'){
    loadAponPNR();
    return;
  }
  if(loc === 'ICRBPO/RESET' || loc === 'RESET' || loc === 'RESET/ICRBPO' || loc === 'JHONY/RESET'){
    removeSavedPNR('ICRBPO');
    loadJhonyPNR();
    showToast('ICRBPO reset to initial booking state');
    return;
  }
  const savedRecord = getSavedPNR(loc);
  if(savedRecord){
    loadSavedPNR(savedRecord);
    return;
  }
  if(loc === 'OGJZJ9' || loc === 'TG'){
    loadThaiAirwaysPNR();
    return;
  }
  if(loc === 'ICRBPO' || loc === 'JHONY' || loc === 'BG'){
    // If currently in an exchange/mid-workflow with the same locator, just re-render instead of reloading
    if(state.locator === 'ICRBPO' && (state._exchangeMode || state._exchangePreTkt || state.ticketed)){
      renderPNR();
      showToast('PNR ICRBPO refreshed (mid-exchange)');
      return;
    }
    loadJhonyPNR();
    return;
  }
  if(loc === '7PHIKV' || loc === 'APON' || loc === 'PG'){
    loadAponPNR();
    return;
  }
  // A locator lookup must only return that locator's saved record.  Do not
  // fall back to the large lesson fixture (J99GZO), which made RT<PNR> show
  // unrelated passenger and SSR lines after an IG.
  if(loc && loc !== state.locator){
    printLines([`NO RECORD LOCATOR FOUND FOR ${loc}`], 'err');
    return;
  }

  // Plain RT: Display current active workspace / PNR
  if(state.segments && state.segments.length){
    renderPNR();
    return;
  }

  loadLessonPNR();
}

function handleXI(){
  // XI is the cancellation command.  Unlike IG, it removes the stored PNR.
  const cancelledLocator = state.locator;
  removeSavedPNR(cancelledLocator);
  resetSimulator();
  printLines(["--- RLR ---", "PNR CANCELLED"], 'warn');
}

// ---------- SR Special Service Request Commands ----------
// Handles: SR CHML/Pn  SR BBML/Pn  SR BSCT/Pn
// Also:    SRCTCE AL STATUS-value/Pn   SRCTCM AL STATUS-value/Pn
// ---------- handleOSI — VIP and other informational notes ----------
// Format: OSI TK VIP MINISTER M/O INFORMATION/P1
//         OSI TK MEDA DIABETIC PATIENT REQUIRES SPECIAL HANDLING/P2
function handleOSI(cmd){
  // Selling Platform output commonly shows the optional colon after OSI.
  // Accept both OSI TK ... and OSI: TK ... entries.
  cmd = cmd.replace(/^OSI\s*:\s*/i, 'OSI ');
  // OSI [AL] [FREE TEXT]/P[n]
  const m = cmd.match(/^OSI\s+([A-Z0-9]{2})\s+(.+?)\/P(\d+)$/i);
  if(!m){
    printLines([
      'INVALID FORMAT. Example:',
      '  OSI TK VIP MINISTER M/O INFORMATION/P1',
      '  OSI TK MEDA DIABETIC PATIENT REQUIRES SPECIAL HANDLING/P1'
    ], 'warn');
    return;
  }
  const al   = m[1].toUpperCase();
  const text = m[2].trim().toUpperCase();
  const pCode = `P${m[3]}`;

  if(!state.osiEntries) state.osiEntries = [];
  // OSI entries are additive (multiple allowed for same pax)
  state.osiEntries.push({ al, text, pax: pCode });
  state.hasPending = true;

  // Show what was staged, then prompt to type IR
  const isVip = /VIP/.test(text);
  printLines([
    `OSI ${al} ${text}/${pCode}`,
    ``,
    isVip
      ? `âœ¦ VIP à¦¸à§à¦¬à¦¿à¦§à¦¾: à¦…à¦—à§à¦°à¦¾à¦§à¦¿à¦•à¦¾à¦° à¦¬à§‹à¦°à§à¦¡à¦¿à¦‚, à¦à¦¯à¦¼à¦¾à¦°à¦ªà§‹à¦°à§à¦Ÿ à¦²à¦¾à¦‰à¦žà§à¦œ, à¦¬à¦¿à¦¶à§‡à¦· à¦ªà§à¦°à¦Ÿà§‹à¦•à¦² à¦¸à§‡à¦¬à¦¾, à¦à¦¸à§à¦•à¦°à§à¦Ÿ à¦“ à¦¡à§‡à¦¡à¦¿à¦•à§‡à¦Ÿà§‡à¦¡ à¦—à§à¦°à¦¾à¦‰à¦¨à§à¦¡ à¦¹à§à¦¯à¦¾à¦¨à§à¦¡à¦²à¦¿à¦‚à¥¤`
      : `OSI à¦à¦¨à§à¦Ÿà§à¦°à¦¿ à¦à¦¡ à¦¹à¦¯à¦¼à§‡à¦›à§‡ (à¦à¦Ÿà¦¿ à¦à¦¯à¦¼à¦¾à¦°à¦²à¦¾à¦‡à¦¨à§‡à¦° à¦œà¦¨à§à¦¯ à¦¤à¦¥à§à¦¯à¦®à§‚à¦²à¦• à¦¨à§‹à¦Ÿ, à¦•à§‹à¦¨à§‹ à¦…à§à¦¯à¦¾à¦•à¦¶à¦¨ à¦•à§‹à¦¡ à¦¨à¦¯à¦¼)à¥¤`,
    ``,
    `--- TYPE IR TO DISPLAY UPDATED PNR ---`
  ], 'warn');
}

// FQN penalty pages are displayed one screen at a time with MD.
let fareRulePages = null;
let fareRulePageIndex = 0;
let pricingMorePageRows = null;
let pricingMorePageVisible = false;
let pricingPageTwoRows = null;

function buildPricingMorePageRows(){
  const segments = state.segments || [];
  const carriers = [...new Set(segments.map(segment => segment.al).filter(Boolean))];
  const records = state.tstRecords || [];
  const rows = [
    `VALIDATING CARRIER${carriers.length === 1 ? '' : 'S'}: ${carriers.join('/') || 'VERIFY WITH AIRLINE'}`,
    `PRICED WITH VALIDATING CARRIER ${carriers[0] || 'XX'} - REPRICE IF DIFFERENT VC`,
    ``,
    `PASSENGER FARE SUMMARY (BDT)`,
    `PAX   TYPE  FARE      TAX       TOTAL`
  ];

  records.forEach((record, index) => {
    const paxNo = String(index + 1).padStart(2, '0');
    const type = record.ptc || 'ADT';
    const fare = Number(record.fare) || 0;
    const tax = Number(record.tax) || 0;
    const total = Number(record.total) || fare + tax;
    rows.push(`${paxNo}    ${type.padEnd(3)}   ${String(fare).padStart(7)}   ${String(tax).padStart(7)}   ${String(total).padStart(8)}`);
  });

  if(!records.length){
    const pax = state.passengers || [];
    const counts = pax.reduce((acc, passenger) => {
      const type = passenger.type === 'child' ? 'CH' : passenger.type === 'infantCarrier' ? 'IN' : 'ADT';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    Object.entries(counts).forEach(([type, count]) => rows.push(`${String(count).padStart(2, '0')}    ${type}    FARE SHOWN ON PREVIOUS PAGE`));
  }

  rows.push(
    ``,
    `FARE RULES / PENALTIES: ENTER FQN1-1//PE`,
    `FARE FAMILY CONDITIONS: ENTER FQF1`,
    `TAXES AND CARRIER CONDITIONS MAY VARY BY ROUTE AND FARE BASIS`,
    `>                                                   PAGE  3/ 3`
  );
  return rows;
}

// ---------- handleMD — More Display / fare quote continuation ----------
// MD advances an active fare quote or fare-rule display; otherwise it scrolls
// the terminal to the next section of a long PNR.
function handleMD(){
  if(pricingMorePageRows && !pricingMorePageVisible){
    pricingMorePageVisible = true;
    printLines(pricingMorePageRows, '');
    showToast('Fare quote: page 3 of 3');
    return;
  }
  if(fareRulePages){
    fareRulePageIndex++;
    if(fareRulePageIndex < fareRulePages.length){
      printLines(fareRulePages[fareRulePageIndex], '');
      showToast(`Fare Rules: page ${fareRulePageIndex + 1} of ${fareRulePages.length}`);
    } else {
      fareRulePages = null;
      fareRulePageIndex = 0;
      printLines(['END OF FARE RULES DISPLAY'], 'muted');
    }
    return;
  }
  if(term && term.scrollHeight > term.clientHeight){
    term.scrollTop = Math.min(term.scrollHeight, term.scrollTop + term.clientHeight - 40);
  } else {
    printLines(['--- MORE ---'], 'muted');
    renderPNR();
  }
}

function handleSR(cmd){
  // A frequent training typo is SRCTCEM (CTCE + M).  Treat it as the
  // intended mobile-contact command, SRCTCM, without altering the number.
  cmd = cmd.replace(/^SR\s*CTCEM\b/i, match => match.replace(/CTCEM/i, 'CTCM'));
  // HK1 is sometimes typed as HKI (letter I) or HKl (lowercase L).
  // Normalize this common visual typo before validating contact SSRs.
  cmd = cmd.replace(/\b(HK|NN|KK)[Il](?=-)/i, (_, status) => `${status}1`);
  // Format: SRMOML/P2 or SR MOML/P2 or SR CHML/P2 (with or without space)
  let m = cmd.match(/^SR\s*([A-Z]{4})\/P(\d+)$/i);
  if(m){
    const ssrType = m[1].toUpperCase();
    const paxNum  = parseInt(m[2], 10);
    const pCode   = `P${paxNum}`;
    const pax     = state.passengers[paxNum - 1];
    if(!pax && paxNum > (state.passengers.length || 0)){
      printLines([`PASSENGER P${paxNum} NOT FOUND IN PNR`], 'err');
      return;
    }

    // Passenger-type validation for infant and child-only services.  A
    // standard meal (MOML, VGML, AVML, etc.) remains valid for adults.
    const restrictedServices = {
      BBML: { type: 'infantCarrier', label: 'BABY MEAL', correct: 'an infant passenger' },
      BSCT: { type: 'infantCarrier', label: 'BASSINET', correct: 'an infant passenger' },
      CHML: { type: 'child', label: 'CHILD MEAL', correct: 'a child passenger' }
    };
    const restriction = restrictedServices[ssrType];
    if(restriction && (!pax || pax.type !== restriction.type)){
      printLines([
        `INVALID SSR ${ssrType}: ${restriction.label} IS ONLY VALID FOR ${restriction.correct.toUpperCase()}.`,
        `PASSENGER P${paxNum} IS ${pax && pax.type === 'child' ? 'A CHILD' : 'AN ADULT'}.`,
        `PLEASE SELECT ${restriction.correct.toUpperCase()} OR USE A SUITABLE MEAL CODE.`
      ], 'err');
      return;
    }
    if(!state.specialSSRs) state.specialSSRs = [];

    // Remove any existing same-type SSR for this passenger first
    state.specialSSRs = state.specialSSRs.filter(s => !(s.type === ssrType && s.pax === pCode));

    // Active airline from segments or fallback TG
    const activeAl = (state.segments[0] && state.segments[0].al) ? state.segments[0].al : 'TG';
    state.specialSSRs.push({ type: ssrType, al: activeAl, status: 'HK1', allSegs: true, pax: pCode });

    state.hasPending = true;

    // Immediately render updated PNR display (as seen in Screenshot 4)!
    renderPNR();
    showToast(`âœ… SSR ${ssrType} added for ${pCode} — Type RFR then ER to finalize`);
    return;
  }

  // Wheelchair: SR WCHR-NONMEDA/description/P1  or  SR WCHR/P1  (simple)
  // Supports: WCHR (ramp), WCHS (to seat), WCHC (completely immobile)
  m = cmd.match(/^SR\s*(WCHR|WCHS|WCHC)(?:-([A-Z]+))?\/(.+?)\/P(\d+)$/i);
  if(!m) m = cmd.match(/^SR\s*(WCHR|WCHS|WCHC)-(.+?)\/P(\d+)$/i);
  if(m){
    const ssrType = m[1].toUpperCase();
    const textPart = (m[2]||'') + (m[3] ? '/'+(m[3]) : '');
    // Determine text and pax from the match groups
    // Try both patterns
    let wcText, paxNum;
    const m2 = cmd.match(/^SR\s*(WCHR|WCHS|WCHC)-(.+)\/P(\d+)$/i);
    if(m2){
      ssrType2 = m2[1].toUpperCase();
      wcText   = m2[2].trim().toUpperCase();
      paxNum   = parseInt(m2[3], 10);
    } else {
      const m3 = cmd.match(/^SR\s+(WCHR|WCHS|WCHC)\/P(\d+)$/i);
      if(m3){
        ssrType2 = m3[1].toUpperCase();
        wcText   = 'PASSENGER REQUIRES WHEELCHAIR ASSISTANCE';
        paxNum   = parseInt(m3[2], 10);
      } else {
        printLines(['WCHR FORMAT: SR WCHR-NONMEDA/DESCRIPTION/P1  or  SR WCHR/P1'], 'warn');
        return;
      }
    }
    const pCode = `P${paxNum}`;
    if(!state.specialSSRs) state.specialSSRs = [];
    state.specialSSRs = state.specialSSRs.filter(s => !(['WCHR','WCHS','WCHC'].includes(s.type) && s.pax === pCode));
    state.specialSSRs.push({ type: ssrType2||ssrType, al:'TK', status:'NN1', allSegs:true, pax:pCode, text:wcText });
    state.hasPending = true;
    const wDesc = { WCHR:'Wheelchair on Ramp', WCHS:'Wheelchair to Seat', WCHC:'Wheelchair Completely Immobile' };
    const stagingRows2 = state.segments.map((seg, si)=>
      `  SSR ${ssrType2||ssrType} TK NN1 ${wcText} /S${si+4}/${pCode}  --- STAGED`);
    printLines([
      `SSR ${ssrType2||ssrType} WHEELCHAIR — ${wDesc[ssrType2||ssrType]||'Wheelchair'}`,
      ...stagingRows2,
      ``,
      `--- TYPE IR TO DISPLAY FULL UPDATED PNR ---`
    ], 'muted');
    showToast(`âœ“ SSR ${ssrType2||ssrType} staged for ${pCode} — Type IR to confirm`);
    return;
  }

  // Format: SRCTCE TK HK1-email/P1 or SRCTCM TK HK1-phone/P1 or SRCTCMQR HK1-...
  // Also handles: SR CTCM-phone/P1 or SR CTCE-email/P1 (with space between SR and CTC)
  m = cmd.match(/^SR\s*CTC([EM])\s*([A-Z0-9]{2})?\s*((?:HK|NN|KK)\d+)?[-/](.+?)(?:\/P(\d+))?$/i);
  if(m){
    const kind   = m[1].toUpperCase();
    const al     = (m[2] ? m[2].toUpperCase() : null) || (state.segments[0] && state.segments[0].al) || 'QR';
    const status = m[3] ? m[3].toUpperCase() : 'HK1';
    const value  = m[4].trim();
    // Passenger association is optional.  With no /P qualifier the CTCM
    // belongs to the PNR, matching the native Amadeus display.
    const pCode  = m[5] ? `P${m[5]}` : null;
    if(!state.specialSSRs) state.specialSSRs = [];
    state.specialSSRs = state.specialSSRs.filter(s => !(s.type === `CTC${kind}` && s.pax === pCode));
    state.specialSSRs.push({ type: `CTC${kind}`, al, status, value, pax: pCode });
    state.hasPending = true;
    renderPNR();
    showToast(`✅ SSR CTC${kind} added for ${pCode}`);
    return;
  }

  printLines([
    'INVALID SR FORMAT. Examples:',
    '  SR CHML/P2   (Child Meal for P2)',
    '  SR BBML/P3   (Baby Meal for P3)',
    '  SR BSCT/P3   (Bassinet for P3 infant)',
    '  SR MOML/P1   (Muslim Meal for P1)',
    '  SRCTCE TK HK1-email@domain.com/P1',
    '  SRCTCM TK HK1-008801712345678/P1  (mobile; not SRCTCEM)'
  ], 'warn');
}

// ---------- handleES — Share/Extend PNR to another office ----------
// Format (from screenshot): ESDACVS3334-B
// ES[OfficeID]-[Option]  where option: A=Agent view only, B=Both can modify, R=Receiving office only
function handleES(cmd){
  const m = cmd.match(/^ES([A-Z0-9]+)(?:-([ABR]))?$/i);
  if(!m){ printLines(['INVALID FORMAT — try ESDACVS3334-B'], 'err'); return; }
  const targetOffice = m[1].toUpperCase();
  const option       = (m[2]||'B').toUpperCase();
  const optionDesc   = { A:'Target agent view only', B:'Both offices can modify', R:'Receiving office only' };
  if(!state.sharedWith) state.sharedWith = [];
  // Remove duplicate shares to same office
  state.sharedWith = state.sharedWith.filter(s => s.office !== targetOffice);
  state.sharedWith.push({ office: targetOffice, option });
  state.hasPending = true;
  printLines([
    `PNR ${state.locator||'J99GZO'} SHARED WITH ${targetOffice}`,
    `SHARE OPTION: -${option} (${optionDesc[option]||option})`,
    ``,
    `--- TYPE IR TO DISPLAY UPDATED PNR ---`
  ], 'muted');
  showToast(`âœ“ PNR shared with ${targetOffice} — Type IR to display`);
}

// ---------- handleSRDOCS — Passport / Travel Document entry (Adult, Child, Infant) ----------
// Standard Amadeus format from Screenshot 2:
//   SRDOCS QR HK1-P-BGD-AP3476898-BGD-19OCT90-M-23OCT23-KHAN-ARAFAT (Adult, P1)
//   SRDOCS QR HK1-P-BGD-BP1234567-BGD-15MAY15-M-14MAY25-KHAN-TAHMID/P2 (Child, P2)
//   SRDOCS QR HK1-P-BGD-CP9876543-BGD-10JAN24-MI-09JAN29-KHAN-ZAYAN/P1 (Infant, MI/P1 or /P3)
function handleSRDOCS(upper, rawCmd){
  // Strip command prefix (supports 'SRDOCS', 'SR DOCS', 'SRDOCSQR', etc.)
  let clean = upper.replace(/^SR\s*DOCS\s*/i, '').trim();

  // Determine airline, status, and details
  let airline = (state.segments && state.segments[0] && state.segments[0].al) ? state.segments[0].al : 'QR';
  let action = 'HK1';
  let body = clean;

  const leadMatch = clean.match(/^([A-Z0-9]{2})?\s*([A-Z0-9]{2,3})?[-/\s]+(.+)$/i);
  if(leadMatch){
    if(leadMatch[1]) airline = leadMatch[1].toUpperCase();
    if(leadMatch[2]) action = leadMatch[2].toUpperCase();
    body = leadMatch[3].trim();
  }

  // DOCS must be sent to an airline that exists in the current itinerary.
  // This prevents an accidental QR/TK/etc. code from being attached to an
  // AI, OD, or other carrier booking.
  const bookedAirlines = [...new Set((state.segments || []).map(seg => String(seg.al || '').toUpperCase()).filter(Boolean))];
  if(bookedAirlines.length && !bookedAirlines.includes(airline)){
    printLines([
      `AIRLINE CODE MISMATCH: ${airline} IS NOT IN THE CURRENT ITINERARY.`,
      `BOOKED AIRLINE${bookedAirlines.length > 1 ? 'S' : ''}: ${bookedAirlines.join(', ')}`,
      `RE-ENTER SRDOCS WITH ONE OF THE BOOKED AIRLINE CODES.`
    ], 'err');
    showToast(`DOCS not added — use ${bookedAirlines.join(' or ')}`, 'warn');
    return;
  }

  // Check for passenger designation at the end, e.g. /P1, /P2, /P3, /P1/INF, /INF
  let pax = '';
  const paxMatch = body.match(/\/(P\d+(?:\/INF)?|INF)$/i);
  if(paxMatch){
    pax = paxMatch[1].toUpperCase();
    body = body.substring(0, body.lastIndexOf('/'));
  }

  // Split fields by '-' or '/'
  const tokens = body.split(/[-/]/).map(t => t.trim().toUpperCase()).filter(Boolean);

  if(tokens.length < 8){
    printLines([
      'FORMAT ERROR — MISSING REQUIRED DOCS FIELDS',
      'Format: SRDOCS [AL] [STATUS]-P/[ISSUE_CTRY]/[DOC_NUM]/[NAT]/[DOB]/[GENDER]/[EXP]/[SURNAME]/[FIRST]',
      'Example: SRDOCS QR HK1-P/BGD/BG1234561/BGD/15MAR88/F/15SEP27/HOSSAIN/KAMALA'
    ], 'err');
    return;
  }

  const docType     = tokens[0] || 'P';
  const country     = tokens[1] || 'BGD';
  const docNumber   = tokens[2] || '';
  const nationality = tokens[3] || country;
  const dob         = tokens[4] || '';
  const gender      = tokens[5] || 'M';
  const expiry      = tokens[6] || '';
  const surname     = tokens[7] || '';
  const firstName   = tokens.slice(8).join(' ') || '';

  // 1. Check if passengers exist in PNR
  if (!state.passengers || !state.passengers.length) {
    printLines([
      'NO PASSENGER IN WORKSPACE',
      'ENTER PASSENGER NAME FIRST (e.g. NM1SURNAME/FIRSTNAME MR)'
    ], 'err');
    showToast('Enter passenger name before adding DOCS', 'warn');
    return;
  }

  // 2. Identify target passenger number (default P1)
  let targetPaxNum = 1;
  if (pax) {
    const pMatch = pax.match(/P(\d+)/i);
    if (pMatch) targetPaxNum = parseInt(pMatch[1], 10);
  }

  const targetPax = state.passengers[targetPaxNum - 1];
  if (!targetPax) {
    printLines([
      `PASSENGER P${targetPaxNum} NOT FOUND IN PNR`,
      `CURRENT PASSENGERS: ${state.passengers.length} (P1${state.passengers.length > 1 ? ' - P' + state.passengers.length : ''})`
    ], 'err');
    showToast(`Passenger P${targetPaxNum} does not exist in PNR`, 'warn');
    return;
  }

  // 3. Check for Infant / Adult / Child mismatch
  const isInfantGender = (gender === 'MI' || gender === 'FI' || gender === 'I');
  const isInfantSuffix = pax.includes('INF');
  const isInfant = isInfantGender || isInfantSuffix;
  const isChild  = (targetPax.type === 'child');

  // If user enters Infant DOCS on an adult passenger who has NO infant associated:
  if (isInfant && targetPax.type !== 'infantCarrier' && !targetPax.infant) {
    printLines([
      `NO INFANT ASSOCIATED TO PASSENGER ${targetPaxNum}`,
      `PASSENGER ${targetPaxNum} IS REGISTERED AS ADULT (${targetPax.nameDisplay || targetPax.label})`,
      `USE ADULT GENDER M OR F (NOT MI/FI/INF), OR ENTER INFANT IN NAME FIRST`
    ], 'err');
    showToast(`Error: P${targetPaxNum} has no associated infant`, 'warn');
    return;
  }

  // If user enters Infant DOCS on a Child passenger:
  if (isInfant && targetPax.type === 'child') {
    printLines([
      `PASSENGER TYPE MISMATCH — P${targetPaxNum} IS A CHILD, NOT AN INFANT`,
      `USE GENDER M OR F FOR CHILD DOCS (NOT MI/FI)`
    ], 'err');
    showToast(`Error: P${targetPaxNum} is a Child, not an Infant`, 'warn');
    return;
  }

  if(!pax){
    pax = isInfant ? `P${targetPaxNum}/INF` : `P${targetPaxNum}`;
  } else if(isInfant && !pax.includes('INF')){
    pax = `${pax}/INF`;
  }

  // ── DATE VALIDATION: DOB must be past; Expiry must be future ──
  try { (function validateDocsDates() {
    const MONTHS_V = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
    const today = new Date(); today.setHours(0,0,0,0);
    const curYY = today.getFullYear() % 100;

    function parseSrDate(str) {
      const dm = String(str||'').trim().toUpperCase().match(/^(\d{1,2})([A-Z]{3})(\d{2}|\d{4})$/);
      if (!dm) return null;
      const d = parseInt(dm[1], 10);
      const mon = MONTHS_V[dm[2]];
      if (mon === undefined) return null;
      let yr = parseInt(dm[3], 10);
      if (dm[3].length === 2) yr = yr <= (curYY + 30) ? (2000 + yr) : (1900 + yr);
      return new Date(yr, mon, d);
    }

    if (dob) {
      const dobDate = parseSrDate(dob);
      if (!dobDate || isNaN(dobDate.getTime())) {
        printLines([
          'INVALID DATE OF BIRTH — ' + dob,
          'FORMAT MUST BE DDMMMYY OR DDMMMYYYY (E.G. 23JAN90)'
        ], 'err');
        showToast('Invalid DOB: ' + dob, 'warn');
        throw new Error('ABORT_DOCS');
      }
      if (dobDate > today) {
        printLines([
          'CHECK DATE OF BIRTH',
          'DATE OF BIRTH CANNOT BE IN THE FUTURE: ' + dob
        ], 'err');
        showToast('DOB cannot be a future date: ' + dob, 'warn');
        throw new Error('ABORT_DOCS');
      }
    }

    if (expiry) {
      const expDate = parseSrDate(expiry);
      if (!expDate || isNaN(expDate.getTime())) {
        printLines([
          'INVALID PASSPORT EXPIRY DATE — ' + expiry,
          'FORMAT MUST BE DDMMMYY OR DDMMMYYYY (E.G. 01JAN30)'
        ], 'err');
        showToast('Invalid expiry: ' + expiry, 'warn');
        throw new Error('ABORT_DOCS');
      }
      if (expDate < today) {
        printLines([
          'PASSPORT EXPIRED — EXPIRY DATE ' + expiry + ' IS IN THE PAST',
          'UPDATE PASSPORT DETAILS AND RE-ENTER SRDOCS'
        ], 'err');
        showToast('Passport expired: ' + expiry, 'warn');
        throw new Error('ABORT_DOCS');
      }
    }
  })(); } catch(e) { if(e && e.message === 'ABORT_DOCS') return; throw e; }

    if(!state.docsEntries) state.docsEntries = [];

  // Check if an existing DOCS entry already exists for this passenger
  const existingDoc = state.docsEntries.find(d => d.pax === pax);

  state.docsEntries.push({
    airline,
    action,
    docType,
    country,
    docNumber,
    nationality,
    dob,
    gender,
    expiry,
    surname,
    firstName,
    pax,
    isInfant,
    isChild
  });

  state.hasPending = true;

  renderPNR();

  const typeLabel = isInfant ? 'Infant' : (isChild ? 'Child' : 'Adult');
  showToast(`✅ SSR DOCS (${typeLabel}) added for ${pax}`);

  // In real Amadeus GDS, entering SRDOCS does NOT automatically overwrite previous entries.
  // Agents must cancel the old line using XE<line> (e.g. XE8 or XEDOCS/P1).
  if(existingDoc){
    printLines([
      `WARNING: DUPLICATE SSR DOCS FOR ${pax} IN PNR`,
      `IN REAL AMADEUS, ENTERING SRDOCS DOES NOT AUTOMATICALLY OVERWRITE PREVIOUS ENTRIES`,
      `CANCEL THE PREVIOUS SSR LINE USING XE (e.g. XE<LINE_NUMBER> OR XEDOCS/${pax.replace('/INF','')})`
    ], 'warn');
  }
}


// ============================================================
// NEWLY ADDED COMMANDS
// ============================================================

// ---------- RM / RMZ — Free-text Remarks ----------
// RM PRIORITY PASSENGER   → general remark
// RMZ CONFIDENTIAL NOTE   → confidential remark
function handleRM(cmd){
  const upper = cmd.toUpperCase().trim();
  const isConf = /^RMZ/i.test(upper);
  const text = cmd.replace(/^RMZ?\s*/i, '').trim().toUpperCase();
  if(!text){
    printLines([
      'INVALID FORMAT — ENTER REMARK TEXT',
      '  RM PRIORITY PASSENGER',
      '  RMZ CONFIDENTIAL NOTE'
    ], 'err');
    return;
  }
  if(!state.remarks) state.remarks = [];
  state.remarks.push({ text, confidential: isConf });
  state.hasPending = true;
  renderPNR();
  showToast(`✅ ${isConf ? 'Confidential ' : ''}Remark added`);
}

// ---------- SRFQTV — Frequent Flyer Number SSR ----------
// SRFQTV QR HK1 123456789/P1
// SRFQTV TG HK1 FF1234567/P1
function handleSRFFN(cmd){
  const upper = cmd.toUpperCase().trim();
  // Accept: SRFQTV AL HK1 FFNUMBER/P1 or SRFQTV AL HK1-FFNUMBER/P1 or simplified SRFQTV/P1 XXXX
  const m = upper.match(/^SR\s*FQTV\s+([A-Z0-9]{2})\s+(HK\d+)[\s-]+([A-Z0-9]+)\/P(\d+)$/i)
         || upper.match(/^SR\s*FQTV\s+([A-Z0-9]+)\/P(\d+)$/i);
  if(!m){
    printLines([
      'FORMAT: SRFQTV [AIRLINE] HK1 [FFNUMBER]/P[PAX]',
      '  Example: SRFQTV QR HK1 123456789/P1',
      '  Example: SRFQTV TG HK1 FF1234567/P1'
    ], 'err');
    return;
  }
  let al, ffn, paxNum;
  if(m.length === 5){
    al = m[1]; ffn = m[3]; paxNum = parseInt(m[4],10);
  } else {
    // short form: SRFQTV AL+FFN/P1
    al = (state.segments[0] && state.segments[0].al) || 'QR';
    ffn = m[1]; paxNum = parseInt(m[2],10);
  }
  const pax = state.passengers[paxNum-1];
  if(!pax){
    printLines([`PASSENGER P${paxNum} NOT FOUND IN PNR`], 'err');
    return;
  }
  if(!state.specialSSRs) state.specialSSRs = [];
  // remove duplicate FFN for same pax
  state.specialSSRs = state.specialSSRs.filter(s => !(s.type === 'FQTV' && s.pax === `P${paxNum}`));
  state.specialSSRs.push({ type: 'FQTV', al, status: 'HK1', value: ffn, pax: `P${paxNum}` });
  state.hasPending = true;
  renderPNR();
  showToast(`✅ Frequent Flyer ${al}/${ffn} added for P${paxNum}`);
}

// ---------- SRBAGX / SRXBAG / SRABAG — Extra Baggage SSR ----------
// Real Amadeus formats:
//   SR BAGX BG HK1-10KG/P1
//   SR BAGX BG HK1-20KG/P1
//   SR BAGX BG HK1-1PC/P1
//   SR BAGX BG HK1-10KG/S2/P1
//   SR BAGX 10KG/P1
//   SR BAGX 20KG
//   SR XBAG BG HK1-10KG/P1
//   SR ABAG BG HK1-10KG/P1
function handleSRBAGX(cmd){
  const upper = String(cmd || '').toUpperCase().trim();
  let type = 'BAGX';
  if(/^SR\s*XBAG/i.test(upper)) type = 'XBAG';
  else if(/^SR\s*ABAG/i.test(upper)) type = 'ABAG';

  // Extract passenger number if present (default P1)
  let paxNum = 1;
  const pMatch = upper.match(/\/P(\d+)/i);
  if(pMatch) paxNum = parseInt(pMatch[1], 10);

  // Extract segment number if present (e.g. /S2)
  let segNum = null;
  const sMatch = upper.match(/\/S(\d+)/i);
  if(sMatch) segNum = parseInt(sMatch[1], 10);

  // Strip prefix
  let rest = upper.replace(/^SR\s*(?:BAGX|XBAG|ABAG)\s*/i, '').trim();
  // Strip /P and /S parameters
  rest = rest.replace(/\/(?:P\d+|S\d+)/gi, '').trim();

  let al = (state.segments && state.segments[0] && state.segments[0].al) || 'BG';
  let status = 'HK1';
  let bagAmt = '20KG';

  const tokens = rest.split(/[\s-]+/).filter(Boolean);
  if(tokens.length === 0){
    printLines([
      `FORMAT: SR BAGX [AIRLINE] HK1-[AMOUNT]/P[PAX]`,
      `  Example: SR BAGX BG HK1-10KG/P1`,
      `  Example: SR BAGX BG HK1-20KG/P1`,
      `  Example: SR BAGX BG HK1-1PC/P1`,
      `  Example: SR BAGX 10KG/P1`,
      `  Example: SR BAGX BG HK1-10KG/S2/P1`,
      `  Enquiry: FQA  (Check Baggage Allowance)`
    ], 'err');
    return;
  }

  // Look for amount/unit token (e.g. 10KG, 20KG, 23KG, 1PC, 2PC, 15K, 1P)
  let valToken = null;
  for(let i = 0; i < tokens.length; i++){
    if(/^\d+(?:KG|PC|K|P|LBS?)$/i.test(tokens[i]) || /^(?:FREE|NIL)$/i.test(tokens[i])){
      valToken = tokens[i];
      break;
    }
  }

  if(!valToken){
    valToken = tokens[tokens.length - 1];
  }
  bagAmt = valToken.toUpperCase();
  if(!/(KG|PC|K|P|LBS?)/i.test(bagAmt) && /^\d+$/.test(bagAmt)){
    bagAmt = bagAmt + 'KG';
  }

  // Look for airline (2 alphanumeric chars)
  for(let i = 0; i < tokens.length; i++){
    if(/^[A-Z0-9]{2}$/i.test(tokens[i]) && tokens[i] !== valToken && !/^(HK|NN|HN|KK)\d*$/i.test(tokens[i])){
      al = tokens[i].toUpperCase();
      break;
    }
  }

  // Look for status (HK1, NN1, etc.)
  for(let i = 0; i < tokens.length; i++){
    if(/^(HK|NN|HN|KK|LL)\d*$/i.test(tokens[i])){
      status = tokens[i].toUpperCase();
      break;
    }
  }

  // Validate passenger
  if(!state.passengers || !state.passengers.length){
    printLines(['NO PASSENGER IN PNR - ENTER PASSENGER NAME FIRST (NM1...)'], 'err');
    return;
  }
  const pax = state.passengers[paxNum - 1];
  if(!pax){
    printLines([`PASSENGER P${paxNum} NOT FOUND IN PNR (MAX P${state.passengers.length})`], 'err');
    return;
  }

  if(!state.specialSSRs) state.specialSSRs = [];
  state.specialSSRs = state.specialSSRs.filter(s => !(s.type === type && s.pax === `P${paxNum}`));
  state.specialSSRs.push({
    type,
    al,
    status,
    value: bagAmt,
    segNum,
    allSegs: !segNum,
    pax: `P${paxNum}`
  });

  state.hasPending = true;
  renderPNR();
  printLines([
    `OK - SSR ${type} ${al} ${status} ${bagAmt} ADDED FOR P${paxNum}`
  ], 'success');
  showToast(`✅ Extra Baggage ${bagAmt} added for P${paxNum} on ${al}`);
}

function handleFQA(cmd){
  const clean = cmd.replace(/^FQA[\s\/]*/i, '').trim().toUpperCase();
  const seg = (state.segments && state.segments[0]) || { al: 'BG', fn: '555', dep: 'DAC', arr: 'SIN', cls: 'Y' };
  const dep = seg.dep || 'DAC';
  const arr = seg.arr || 'SIN';
  const al = seg.al || 'BG';
  const fn = seg.fn || '555';
  const cls = seg.cls || 'Y';
  printLines([
    `FQA — AMADEUS BAGGAGE ALLOWANCE`,
    `ROUTE: ${dep}-${arr}   FLIGHT: ${al} ${fn}   CLASS: ${cls}`,
    `------------------------------------------------------------`,
    `CHECKED BAGGAGE ALLOWANCE:`,
    `  ADULT (ADT):     20 KG (1 PC) INCLUDED`,
    `  CHILD (CHD):     20 KG (1 PC) INCLUDED`,
    `  INFANT (INF):    10 KG (1 PC) + 1 COLLAPSIBLE STROLLER`,
    `CABIN BAGGAGE:     07 KG (1 PC UP TO 115 CM / 45 IN)`,
    `------------------------------------------------------------`,
    `EXTRA / EXCESS BAGGAGE SSR:`,
    `  ENTRY FORMAT:    SR BAGX ${al} HK1-10KG/P1  (OR 20KG, 1PC)`,
    `  STANDARD CHARGE: BDT 950 PER KG / BDT 7,500 PER PIECE (23KG)`
  ], 'success');
}

function handleFXK(){
  const seg = (state.segments && state.segments[0]) || { al: 'BG', dep: 'DAC', arr: 'SIN' };
  const al = seg.al || 'BG';
  printLines([
    `FXK — CHARGEABLE ANCILLARY SERVICES CATALOGUE (${al})`,
    `LN  SVC  CODE  DESCRIPTION               PRICE   CUR  STATUS`,
    `01  BAG  0CZ   UP TO 10KG EXTRA BAGGAGE  4500    BDT  AVAILABLE`,
    `02  BAG  0C2   UP TO 20KG EXTRA BAGGAGE  8500    BDT  AVAILABLE`,
    `03  BAG  0C5   UP TO 30KG EXTRA BAGGAGE  12000   BDT  AVAILABLE`,
    `04  BAG  01P   1 ADDITIONAL PIECE (23KG) 7000    BDT  AVAILABLE`,
    `05  SEA  0B5   ADVANCE SEAT ASSIGNMENT   1500    BDT  AVAILABLE`,
    `06  ML   0AK   SPECIAL PRE-ORDER MEAL    1200    BDT  AVAILABLE`,
    `BOOK WITH: SR BAGX ${al} HK1-[WEIGHT]/P1`
  ], 'success');
}

// ---------- Waitlist (SS1WL1 / SRWLST) ----------
// Waitlist is handled as part of handleSS — just need SRWLST SSR
function handleSRWLST(cmd){
  const upper = cmd.toUpperCase().trim();
  const m = upper.match(/^SR\s*WLST\s+([A-Z0-9]{2})\s+(HK|NN|LL)\d+\/P(\d+)$/i)
         || upper.match(/^SR\s*WLST\s+([A-Z0-9]{2})?\s*\/P(\d+)$/i);
  const paxNum = m ? parseInt(m[m.length-1], 10) : 1;
  const al = (m && m[1]) || (state.segments[0] && state.segments[0].al) || 'QR';
  const pax = state.passengers[paxNum-1];
  if(!pax){
    printLines([`PASSENGER P${paxNum} NOT FOUND IN PNR`], 'err');
    return;
  }
  if(!state.specialSSRs) state.specialSSRs = [];
  state.specialSSRs = state.specialSSRs.filter(s => !(s.type === 'WLST' && s.pax === `P${paxNum}`));
  state.specialSSRs.push({ type: 'WLST', al, status: 'LL1', pax: `P${paxNum}` });
  state.hasPending = true;
  renderPNR();
  showToast(`⚠️ Waitlist SSR added for P${paxNum} — status LL1 (waitlisted)`);
}

// ---------- SP — Split PNR ----------
// SP1      → split passenger 1 to new PNR
// SP1-2    → split passengers 1 and 2
function handleSP(cmd){
  const upper = cmd.toUpperCase().trim();
  const m = upper.match(/^SP(\d+)(?:-(\d+))?$/i);
  if(!m){
    printLines([
      'FORMAT: SP[PAX] or SP[PAX1]-[PAX2]',
      '  SP1     → split passenger 1 to new PNR',
      '  SP1-2   → split passengers 1 and 2 to new PNR'
    ], 'err');
    return;
  }
  if(!state.locator){
    printLines(['NO ACTIVE PNR — RETRIEVE A PNR FIRST WITH RT'], 'err');
    return;
  }
  if(!state.passengers || !state.passengers.length){
    printLines(['NO PASSENGERS IN PNR — CANNOT SPLIT'], 'err');
    return;
  }
  const from = parseInt(m[1],10);
  const to   = m[2] ? parseInt(m[2],10) : from;
  const splitPax = state.passengers.slice(from-1, to);
  if(!splitPax.length){
    printLines([`PASSENGER P${from}${m[2]?'-P'+to:''} NOT FOUND`], 'err');
    return;
  }
  if(splitPax.length >= state.passengers.length){
    printLines(['CANNOT SPLIT — MUST RETAIN AT LEAST 1 PASSENGER IN ORIGINAL PNR'], 'err');
    return;
  }

  // Generate new split PNR locator
  const newLoc = generateRandomLocator();

  // Build the split PNR as a deep copy of current state, then set split passengers
  const splitState = JSON.parse(JSON.stringify(state));
  splitState.locator   = newLoc;
  splitState.passengers = splitPax.map((p,i) => ({ ...p }));
  // Re-number passengers in the split PNR
  splitState.passengers.forEach((p, i) => { p.paxNum = i + 1; });
  splitState.finalized  = true;
  splitState.createdAt  = new Date().toISOString();
  splitState.hasPending = false;
  splitState.justEndedRecord = false;
  splitState._splitFrom = state.locator; // mark origin for reference

  // Save split PNR to localStorage so RT <newLoc> works
  const records = loadSavedPNRs();
  records[newLoc.toUpperCase()] = splitState;
  try { localStorage.setItem(SAVED_PNR_KEY, JSON.stringify(records)); } catch(e){}

  // Remove split passengers from the current (original) PNR
  state.passengers = state.passengers.filter((_, i) => i < from-1 || i >= to);
  // Re-number remaining passengers
  state.passengers.forEach((p, i) => { p.paxNum = i + 1; });
  state.hasPending = true;

  // Update original PNR in storage too
  saveCurrentPNR();

  const paxNames = splitPax.map((p,i) => `${from+i}. ${p.nameDisplay || p.label}`).join('\n');
  printLines([
    `SPLIT PNR CREATED`,
    ``,
    `NEW PNR LOCATOR : ${newLoc}`,
    `SPLIT PASSENGER(S):`,
    paxNames,
    ``,
    `ORIGINAL PNR: ${state.locator} — REMAINING ${state.passengers.length} PASSENGER(S)`,
    ``,
    `>>> TYPE RT ${newLoc} TO RETRIEVE THE SPLIT PNR`,
    `    SPLIT PNR RETAINS SAME ITINERARY AND TICKETING ARRANGEMENTS.`
  ], 'success');
  showToast(`✅ PNR split — new locator: ${newLoc} — Type RT ${newLoc}`);
  renderPNR();
}

// ---------- GN / GS — Group Booking ----------
// GN15APRJFKDAC        → Group Name entry (create group PNR for 15 Apr JFK-DAC)
// GS10Y3               → Group Seat sell (10 seats, Y class, line 3)
function handleGN(cmd){
  const upper = cmd.toUpperCase().trim();
  let m = upper.match(/^GN(\d+)([A-Z]{3})([A-Z]{3})([A-Z]{3})$/i);
  if(!m){
    const alt = upper.match(/^GN\s*(\d+)(?:\s*([A-Z0-9]+))?$/i);
    if(alt){
      const count = parseInt(alt[1], 10);
      const name = alt[2] || 'GROUP';
      const grpLoc = generateRandomLocator();
      state.groupPnr = { count, date: '20NOV', orig: 'DAC', dest: 'DXB', locator: grpLoc, name };
      printLines([
        `GROUP PNR CREATED — ${name}`,
        ``,
        `  GROUP LOCATOR : ${grpLoc}`,
        `  PAX COUNT     : ${count}`,
        ``,
        `NEXT STEP: GS${count}Y1  (sell seats for this group)`
      ], 'success');
      return;
    }
  }
  if(!m){
    printLines([
      'FORMAT: GN[COUNT][DATE][ORIG][DEST]',
      '  Example: GN15APRJFKDAC',
      '  Example: GN20NOVDACLHR'
    ], 'err');
    return;
  }
  const count = parseInt(m[1],10);
  const date  = m[2]; const orig = m[3]; const dest = m[4];
  const grpLoc = generateRandomLocator();
  state.groupPnr = { count, date, orig, dest, locator: grpLoc };
  printLines([
    `GROUP PNR CREATED`,
    ``,
    `  GROUP LOCATOR : ${grpLoc}`,
    `  PAX COUNT     : ${count}`,
    `  DATE          : ${date}`,
    `  ROUTE         : ${orig} → ${dest}`,
    ``,
    `NEXT STEP: GS${count}Y1  (sell seats for this group)`,
    `           NM1GROUPNAME/GROUP NAME  (add group name)`,
    `           THEN: RFSHAKIB → ER`
  ], 'success');
  showToast(`✅ Group PNR created: ${grpLoc} (${count} pax)`);
}

function handleGS(cmd){
  const upper = cmd.toUpperCase().trim();
  const gsFltMatch = upper.match(/^GS\s*([A-Z0-9]{2})\s*(\d{1,4})\s+([A-Z])\s+(\d{1,2}[A-Z]{3})\s+([A-Z]{3})([A-Z]{3})\s+(\d+)/i);
  if(gsFltMatch){
    const carrier = gsFltMatch[1], flt = gsFltMatch[2], cls = gsFltMatch[3], date = gsFltMatch[4];
    const orig = gsFltMatch[5], dest = gsFltMatch[6], count = parseInt(gsFltMatch[7], 10);
    printLines([
      `GROUP SEAT SELL`,
      ``,
      `  ${count} ${cls} CLASS SEATS BLOCKED`,
      `  ROUTE     : ${orig} → ${dest} / ${date}`,
      `  FLIGHT    : ${carrier}${flt} ${cls}`,
      `  STATUS    : HK${count}`
    ], 'success');
    return;
  }
  const m = upper.match(/^GS\s*(\d+)([A-Z])(\d+)$/i);
  if(!m){
    printLines([
      'FORMAT: GS[COUNT][CLASS][LINE]',
      '  Example: GS10Y3  (10 seats, Y class, line 3)',
      '  Example: GS20W1  (20 seats, W class, line 1)'
    ], 'err');
    return;
  }
  const count = parseInt(m[1],10);
  const cls   = m[2];
  const line  = parseInt(m[3],10);
  if(!state.groupPnr){
    printLines([
      'NO GROUP PNR ACTIVE',
      'First create group PNR with: GN[COUNT][DATE][ORIG][DEST]',
      'Example: GN15APRJFKDAC'
    ], 'err');
    return;
  }
  const { orig, dest, date, locator } = state.groupPnr;
  const fltNum = String(Math.floor(Math.random()*900)+100);
  printLines([
    `GROUP SEAT SELL`,
    ``,
    `  ${count} ${cls} CLASS SEATS BLOCKED — LINE ${line}`,
    `  GROUP REF : ${locator}`,
    `  ROUTE     : ${orig} → ${dest} / ${date}`,
    `  FLIGHT    : ${(state.segments[0]&&state.segments[0].al)||'QR'}${fltNum} ${cls}    STATUS: GK${count}`,
    ``,
    `NOTE: GK = Group Hold. Seats are held but names not yet confirmed.`,
    `      Add names individually: NM1SURNAME/FIRSTNAME MR`,
    `      Then ER to save.`
  ], 'success');
  showToast(`✅ Group hold: ${count} seats ${cls}-class for ${orig}-${dest}`);
}

// ---------- SM / SMOX — Seat Map Display ----------
// SMOX or SM = show seat map for segment 1
// SM/S2 = segment 2
// ST/27A/P1 = assign seat 27A to P1
function handleSM(cmd){
  const upper = cmd.toUpperCase().trim();
  const segMatch = upper.match(/\/S(\d+)/);
  const segIdx = segMatch ? parseInt(segMatch[1],10) - 1 : 0;
  const seg = (state.segments && state.segments[segIdx]) || null;
  const al = (seg && seg.al) || (state.segments[0] && state.segments[0].al) || 'QR';
  const flt = (seg && seg.flt) || '100';
  const dep = (seg && seg.dep) || 'DAC';
  const arr = (seg && seg.arr) || 'DXB';
  const date = (seg && seg.date) || '10DEC';

  // Generate a simplified seat map (Boeing 737 style, 30 rows)
  const rows = [];
  rows.push(``);
  rows.push(`SEAT MAP - ${al}${flt} ${dep}${arr} ${date}`);
  rows.push(``);
  rows.push(`     A   B   C       D   E   F`);
  rows.push(`   |---|---|---|   |---|---|---|`);

  const occupiedSeats = new Set();
  if(state.seats && state.seats[segIdx]){
    Object.values(state.seats[segIdx]).forEach(s => occupiedSeats.add(s));
  }
  // Random occupation for realism
  const randoms = ['2B','3C','5A','5F','7D','8E','12C','15A','15F','18B','20C','22D'];
  randoms.forEach(s => occupiedSeats.add(s));

  const cols = ['A','B','C','D','E','F'];
  for(let r=1; r<=30; r++){
    const rowStr = String(r).padStart(2,' ');
    let line = ` ${rowStr} |`;
    ['A','B','C'].forEach(c => {
      const seat = `${r}${c}`;
      const taken = occupiedSeats.has(seat);
      line += ` ${taken?'X':'O'} |`;
    });
    line += '   |';
    ['D','E','F'].forEach(c => {
      const seat = `${r}${c}`;
      const taken = occupiedSeats.has(seat);
      line += ` ${taken?'X':'O'} |`;
    });
    // Mark special rows
    if(r===1) line += '  ← BUSINESS/EXIT ROW';
    if(r===15) line += '  ← EXIT ROW (extra legroom)';
    rows.push(line);
  }
  rows.push(`   |---|---|---|   |---|---|---|`);
  rows.push(``);
  rows.push(`  O = Available    X = Occupied`);
  rows.push(`  EXIT rows: 1, 15  (preferred — extra legroom)`);
  rows.push(``);
  rows.push(`TO ASSIGN SEAT: ST/[ROW][COL]/P[PAX]`);
  rows.push(`  Example: ST/15A/P1  →  assign 15A to P1`);
  rows.push(`  Example: ST/27F/P2  →  assign 27F to P2`);

  printLines(rows, '');
  showToast('Seat map displayed — use ST/[seat]/P[pax] to assign');
}

function handleST(cmd){
  const upper = cmd.toUpperCase().trim();
  // ST/27A/P1 or ST/15F/P2 or ST/24A (default P1)
  const m = upper.match(/^ST\/(\d{1,2})([A-F])(?:\/P(\d+))?(?:\/S(\d+))?$/i);
  if(!m){
    printLines([
      'FORMAT: ST/[ROW][COL]/P[PAX]',
      '  Example: ST/27A/P1 বা ST/24A',
      '  Example: ST/15F/P2/S1  (specify segment)'
    ], 'err');
    return;
  }
  const row    = parseInt(m[1],10);
  const col    = m[2].toUpperCase();
  const seat   = `${row}${col}`;
  const paxNum = m[3] ? parseInt(m[3],10) : 1;
  const segIdx = m[4] ? parseInt(m[4],10)-1 : 0;
  const pax = state.passengers[paxNum-1];
  if(!pax){
    printLines([`PASSENGER P${paxNum} NOT FOUND IN PNR`], 'err');
    return;
  }
  if(row < 1 || row > 50){
    printLines(['INVALID ROW NUMBER — rows are 1-50'], 'err');
    return;
  }
  const seg = state.segments[segIdx];
  if(!seg){
    printLines([`SEGMENT ${segIdx+1} NOT FOUND IN PNR`], 'err');
    return;
  }
  // Check if seat already taken
  if(!state.seats) state.seats = {};
  if(!state.seats[segIdx]) state.seats[segIdx] = {};
  const alreadyTaken = Object.entries(state.seats[segIdx]).find(([p,s]) => s === seat && p !== `P${paxNum}`);
  if(alreadyTaken){
    printLines([`SEAT ${seat} IS ALREADY ASSIGNED TO ${alreadyTaken[0]}`], 'err');
    showToast(`Seat ${seat} is taken — choose another`, 'warn');
    return;
  }
  state.seats[segIdx][`P${paxNum}`] = seat;
  state.hasPending = true;
  renderPNR();
  showToast(`✅ Seat ${seat} assigned to P${paxNum} (segment ${segIdx+1})`);
}

// ---------- FP CCVISA — Credit Card Payment ----------
// Extended FP handling for credit card
// FP CCVISA4111111111111111/1226
// FP CCMC5500005555555559/0127
// FP CCAMEX370000000000002/1228
function handleFPCC(cmd){
  const upper = cmd.toUpperCase().trim();
  // CC[TYPE][NUMBER]/[MMYY] or CC[TYPE][NUMBER]/[MM][YY]
  const m = upper.match(/^FP\s+CC(VISA|MC|AMEX|DINERS|JCB|DISC)([0-9]{12,19})\/([01][0-9])(2[0-9])$/i);
  if(!m){
    printLines([
      'FORMAT: FP CC[TYPE][CARDNUMBER]/[MMYY]',
      '  FP CCVISA4111111111111111/1226',
      '  FP CCMC5500005555555559/0127',
      '  FP CCAMEX370000000000002/1228',
      '',
      'Card types: VISA, MC (Mastercard), AMEX, DINERS, JCB, DISC (Discover)'
    ], 'err');
    return;
  }
  const cardType = m[1].toUpperCase();
  const cardNum  = m[2];
  const expMM    = m[3];
  const expYY    = m[4];
  // Mask card number (show only last 4)
  const masked = cardNum.slice(-4).padStart(cardNum.length, 'X');
  state.fop = `CC${cardType}${masked}/${expMM}${expYY}`;
  state.fopDisplay = `CC ${cardType} XXXX-XXXX-XXXX-${cardNum.slice(-4)} EXP ${expMM}/${expYY}`;
  state.hasPending = true;
  renderPNR();
  showToast(`✅ Credit Card (${cardType}) payment added — last 4: ${cardNum.slice(-4)}`);
}

function runSmartCmd(cmd){
  const input = document.getElementById('cmdInput');
  if(input) input.value = cmd;
  runCommand(cmd);
  mountInput();
}

function runVipMessage(){
  const al = (state.segments[0] && state.segments[0].al) || 'TK';
  runSmartCmd(`OSI: ${al} VIP MINISTER M/O INFORMATION/P1`);
}

// ---------- NAME MODIFY — NU1HAMED/MAHMOUD  or  1/MOUSSA/MAHMOUD ----------
// Matches real Amadeus GDS output: "Passenger 1 name changed from OLD to NEW"
function handleNameModify(cmd){
  const upper = cmd.toUpperCase().trim();

  let paxNum = null;
  let newSurname = '';
  let newFirst = '';

  // Format 1: NU1HAMED/MAHMOUD
  const mNU = upper.match(/^NU(\d+)([A-Z]+)\/([A-Z ]+)$/i);
  if(mNU){
    paxNum    = parseInt(mNU[1], 10);
    newSurname = mNU[2].trim();
    newFirst   = mNU[3].trim();
  }

  // Format 2: 1/MOUSSA/MAHMOUD or 1/KHAN/SHAKIB MR
  if(!mNU){
    const mSlash = upper.match(/^(\d+)\/([A-Z]+)\/([A-Z ]+)$/i);
    if(mSlash){
      paxNum    = parseInt(mSlash[1], 10);
      newSurname = mSlash[2].trim();
      newFirst   = mSlash[3].trim();
    }
  }

  if(!paxNum || !newSurname || !newFirst){
    printLines([
      'INVALID NAME MODIFY FORMAT',
      'Format 1: NU1HAMED/MAHMOUD',
      'Format 2: 1/MOUSSA/MAHMOUD (or 1/SURNAME/FIRSTNAME TITLE)'
    ], 'err');
    return;
  }

  // Check if ticket is already issued: real Amadeus strictly forbids direct name modify on issued tickets
  if(state.ticketed || (state.tickets && state.tickets.length)){
    printLines([
      'RESTRICTED — TICKET ISSUED FOR THIS PASSENGER',
      'NAME CHANGE NOT PERMITTED ON ISSUED TICKET',
      'USE TRDC TO VOID TICKET (SAME DAY) OR CONTACT AIRLINE FOR REISSUE / WAIVER'
    ], 'err');
    showToast('Cannot change name on issued ticket — Void or Reissue required', 'warn');
    return;
  }

  // Make sure a PNR is loaded
  if(!state.locator && !state.passengers.length){
    loadLessonPNR();
  }

  const paxIdx = paxNum - 1;
  if(paxIdx < 0 || paxIdx >= state.passengers.length){
    printLines([`PASSENGER ${paxNum} NOT FOUND — PNR HAS ${state.passengers.length} PASSENGER(S)`], 'err');
    return;
  }

  const pax = state.passengers[paxIdx];

  // Capture old display name for the confirmation message
  const oldLabel = (pax.nameDisplay || pax.label || '').split('(')[0].trim();
  const oldDisplay = oldLabel || `PASSENGER ${paxNum}`;

  // Extract title if user provided one in newFirst (e.g. SHAKIB MR)
  let newTitle = '';
  const titleInFirst = newFirst.match(/\s+(MR|MRS|MS|MISS|MSTR)$/i);
  if(titleInFirst){
    newTitle = ` ${titleInFirst[1].toUpperCase()}`;
    newFirst = newFirst.replace(/\s+(MR|MRS|MS|MISS|MSTR)$/i, '').trim();
  }

  // Build new label — preserve type suffix (CHD/DOB, INF, etc.) if present
  const suffixMatch = (pax.label || '').match(/\(.*\)/);
  const suffix = suffixMatch ? ` ${suffixMatch[0]}` : '';

  const newDisplay = `${newSurname}/${newFirst}`;

  // Detect title from existing label if not explicitly provided
  const titleMatch = (pax.label || '').match(/\b(MR|MRS|MS|MISS|MSTR)\b/i);
  const title = newTitle || (titleMatch ? ` ${titleMatch[1].toUpperCase()}` : '');
  const newLabelFull = `${newSurname}/${newFirst}${title}${suffix}`;

  // Apply changes
  pax.label       = newLabelFull.trim();
  pax.nameDisplay = newDisplay;
  pax.surname     = newSurname;
  pax.given       = `${newFirst}${title}`.trim();
  state.hasPending = true;

  // Output matching Screenshot 1 exactly
  printLines([
    `Passenger ${paxNum} name changed from ${esc(oldDisplay)} to ${newSurname}/${newFirst}`
  ], 'success');

  renderPNR();
  showToast(`✓ Name modified: P${paxNum} → ${newSurname}/${newFirst} — Type RF then ER to save`);
}

// ---------- DM / DM1 — Display Minimum Connecting Time / Transit Time (Screenshot 1) ----------
function handleDM(cmd){
  const clean = (cmd || 'DM1').replace(/\s+/g, '').toUpperCase();
  const m = clean.match(/^DM(\d+)?/i);
  const segIdx = (m && m[1]) ? parseInt(m[1], 10) : 1;

  let seg1 = null;
  let seg2 = null;

  if(state.segments && state.segments.length >= 2){
    seg1 = state.segments[segIdx - 1] || state.segments[0];
    seg2 = state.segments[segIdx] || state.segments[1];
  } else if(lastANRoute && lastANRoute.lines){
    const connLine = lastANRoute.lines.find(l => l.segs && l.segs.length >= 2) || lastANRoute.lines[0];
    if(connLine && connLine.segs && connLine.segs.length >= 2){
      seg1 = connLine.segs[0];
      seg2 = connLine.segs[1];
    }
  }

  if(!seg1 || !seg2){
    seg1 = { al: "QR", fn: "639", dep: "DAC", arr: "DOH", arrT: "0620" };
    seg2 = { al: "QR", fn: "828", dep: "DOH", arr: "BKK", depT: "0725" };
  }

  const transit = seg1.arr || "DOH";
  const arrClean = (seg1.arrT || "0620").replace(/[^0-9]/g, '').padEnd(4, '0').slice(0, 4);
  const depClean = (seg2.depT || "0725").replace(/[^0-9]/g, '').padEnd(4, '0').slice(0, 4);

  const arrMin = parseInt(arrClean.slice(0, 2), 10) * 60 + parseInt(arrClean.slice(2, 4), 10);
  let depMin = parseInt(depClean.slice(0, 2), 10) * 60 + parseInt(depClean.slice(2, 4), 10);

  if(depMin < arrMin || (seg1.arrT && seg1.arrT.includes('+')) || (seg2.depT && seg2.depT.includes('+'))){
    depMin += 24 * 60;
  }
  const diff = depMin - arrMin;
  const hours = Math.floor(diff / 60);
  const mins = diff % 60;
  const connTimeStr = String(hours).padStart(2, '0') + String(mins).padStart(2, '0');

  const al1 = seg1.al;
  const al2 = seg2.al;

  const rows = [
    `DM${segIdx}`,
    `${transit}-${transit}       FROM      -       TO`,
    `CC FLTN-FLTR ORGN EQP TM CS-CC FLTN-FLTR DEST EQP TM CS       HHMM`,
    `${al1.padEnd(27, ' ')}-${al2.padEnd(32, ' ')}I/I:0045`,
    `ACTUAL CONNECTING TIME IS ${connTimeStr}`
  ];

  printLines(rows, '');
  showToast(`✓ Actual connecting time at ${transit}: ${hours}h ${mins}m (${connTimeStr})`);
}

// ---------- FXR / FXB / FXP / FXX — Pricing & TST Creation (Matches YouTube tutorial & original Amadeus) ----------
function handlePricing(cmd){
  const upper = (cmd || 'FXR').toUpperCase().trim();
  state.hasPricingRequest = true;
  pricingMorePageRows = null;
  pricingMorePageVisible = false;
  pricingPageTwoRows = null;
  const isRebook = (/^FX[RB]/i.test(upper));
  const isNoRebar = (/^FXA/i.test(upper));

  const curMatch = upper.match(/\/R[,\.]([A-Z]{3})/i) || upper.match(/\/R\s*([A-Z]{3})/i);
  const overrideCur = curMatch ? curMatch[1].toUpperCase() : null;
  const isCurConverted = Boolean(overrideCur && overrideCur !== 'BDT' && AMADEUS_CURRENCIES[overrideCur]);
  const curInfo = isCurConverted ? AMADEUS_CURRENCIES[overrideCur] : null;
  const curRate = curInfo ? curInfo.bsr : 1.0;

  // If rebook requested, keep current class if already lowest (e.g. W, N) or set to W for TG / N for QR
  if(isRebook && state.segments && state.segments.length){
    state.segments.forEach(s => {
      if(!s.cls || s.cls === 'Y') {
        s.cls = (s.al === 'TG') ? 'W' : 'N';
      }
      s.rebooked = true;
    });
  }

  if(!isNoRebar){
    state.hasTST = true;
    state.tstNeedsReprice = false;
    state.hasPending = true;
  }
  // FXA must never overwrite a TST already stored by FXP / FXB.
  const storeTst = (records) => { if(!isNoRebar) state.tstRecords = records; };

  const hasPax = state.passengers && state.passengers.length > 0;
  const hasNonAdultPax = hasPax && state.passengers.some(p => p.type === 'child' || p.type === 'infantCarrier');
  // FXB and FXP both price every passenger in a multi-passenger PNR.
  if((upper.startsWith("FXP") || upper.startsWith("FXB")) && hasPax && (state.passengers.length > 1 || hasNonAdultPax)){
    const rows = [
      isRebook ? `ITINERARY REBOOKED` : `PRICED AS BOOKED`,
      `  PASSENGER       PTC   NP  FARE<BDT> TAX/FEE   PER PSGR`
    ];

    let totalNP = 0;
    let totalFare = 0;
    let totalTax = 0;
    let grandTotal = 0;
    state.tstRecords = [];

    // Dynamically derive fares from state.fareShopPrice if present, else fallback to standard defaults
    const baseFare = state.fareShopPrice ? state.fareShopPrice.fare : 13529;
    const baseTax  = state.fareShopPrice ? state.fareShopPrice.tax  : 7584;

    const adtFareVal = baseFare;
    const adtTaxVal  = baseTax;
    const adtTotal   = adtFareVal + adtTaxVal;

    const chFareVal  = Math.round(baseFare * 0.75);
    const chTaxVal   = Math.round(baseTax * 0.75);
    const chTotal    = chFareVal + chTaxVal;

    const inFareVal  = Math.round(baseFare * 0.10);
    const inTaxVal   = Math.round(baseTax * 0.10 * 0.15);
    const inTotal    = inFareVal + inTaxVal;

    let lineNo = 1;
    state.passengers.forEach((p, i)=>{
      if(p.type === 'child'){
        const rawName = p.label.split('/')[0] + '/' + (p.label.split('/')[1]||'').split(' ')[0] + '*';
        const shortName = rawName.slice(0, 14).padEnd(14, ' ');
        rows.push(`<span class="tst-tag">0${lineNo}</span> ${shortName}  CH     1     ${String(chFareVal).padStart(7)}   ${String(chTaxVal).padStart(6)}      ${String(chTotal).padStart(6)}`);
        totalNP += 1; totalFare += chFareVal; totalTax += chTaxVal; grandTotal += chTotal;
        state.tstRecords.push({ tstNum: lineNo, pCode: `.${i+1}`, name: p.label.split('(')[0], fare: chFareVal, tax: chTaxVal, total: chTotal, ptc: 'CH', segs: '1-2' });
        lineNo++;
      } else if(p.type === 'adult' || !p.type){
        const rawName = p.label.split('/')[0] + '/' + (p.label.split('/')[1]||'').split(' ')[0] + '*';
        const shortName = rawName.slice(0, 14).padEnd(14, ' ');
        rows.push(`<span class="tst-tag">0${lineNo}</span> ${shortName}  ADT    1     ${String(adtFareVal).padStart(7)}   ${String(adtTaxVal).padStart(6)}      ${String(adtTotal).padStart(6)}`);
        totalNP += 1; totalFare += adtFareVal; totalTax += adtTaxVal; grandTotal += adtTotal;
        state.tstRecords.push({ tstNum: lineNo, pCode: `.${i+1}`, name: p.label.split('(')[0], fare: adtFareVal, tax: adtTaxVal, total: adtTotal, ptc: 'ADT', segs: '1-2' });
        lineNo++;
      } else if(p.type === 'infantCarrier'){
        const rawName = p.label.split('/')[0] + '/' + (p.label.split('/')[1]||'').split(' ')[0] + '*';
        const shortName = rawName.slice(0, 14).padEnd(14, ' ');
        rows.push(`<span class="tst-tag">0${lineNo}</span> ${shortName}  ADT    1     ${String(adtFareVal).padStart(7)}   ${String(adtTaxVal).padStart(6)}      ${String(adtTotal).padStart(6)}`);
        totalNP += 1; totalFare += adtFareVal; totalTax += adtTaxVal; grandTotal += adtTotal;
        state.tstRecords.push({ tstNum: lineNo, pCode: `.${i+1}`, name: p.label.split('(')[0], fare: adtFareVal, tax: adtTaxVal, total: adtTotal, ptc: 'ADT', segs: '1-2' });
        lineNo++;

        const infSurname = p.infant ? p.infant.surname : 'AHMED';
        const infFirst = p.infant ? p.infant.first : 'TAHER';
        const infName = `${infSurname}/${infFirst}*`;
        const shortInf = infName.slice(0, 14).padEnd(14, ' ');
        rows.push(`<span class="tst-tag">0${lineNo}</span> ${shortInf}  IN     1      ${String(inFareVal).padStart(6)}      ${String(inTaxVal).padStart(4)}       ${String(inTotal).padStart(5)}`);
        totalNP += 1; totalFare += inFareVal; totalTax += inTaxVal; grandTotal += inTotal;
        state.tstRecords.push({ tstNum: lineNo, pCode: `.${i+1} I`, name: `${infSurname}/${infFirst} MISS(INF)`, fare: inFareVal, tax: inTaxVal, total: inTotal, ptc: 'IN', segs: '1-2' });
        lineNo++;
      }
    });

    rows.push(``);
    rows.push(`           TOTALS        ${totalNP}     ${totalFare}    ${totalTax}      ${grandTotal}`);
    rows.push(``);
    rows.push(`1-2 LAST TKT DTE 24JUL18 - SEE SALES RSTNS`);
    rows.push(`3 LAST TKT DTE 05OCT18/23:59 LT in POS - SEE ADV PURCHASE`);
    rows.push(`1-3 FARE VALID FOR E TICKET ONLY`);
    rows.push(`1-2 TICKETS ARE NON-REFUNDABLE`);
    rows.push(`                                    PAGE   2/ 3`);

    // Mirror Amadeus TST numbering: all adults share TST 1, the child is
    // TST 2, and the lap infant is TST 3 while retaining each fare line.
    state.tstRecords.forEach(t => {
      t.tstNum = t.ptc === 'ADT' ? 1 : (t.ptc === 'CH' ? 2 : (t.ptc === 'IN' ? 3 : t.tstNum));
    });
    state.tstRecords.sort((a, b) => a.tstNum - b.tstNum || String(a.pCode).localeCompare(String(b.pCode)));

    pricingMorePageRows = buildPricingMorePageRows();
    pricingPageTwoRows = rows.slice();
    printLines(rows, '');
    showToast(`✓ Quoted (${upper}) — TST Stored for ${totalNP} passenger(s) — Type TQT to view`);
    return;
  }

  // Standard Segment / Fare Basis table for FXR / FXB / single-passenger
  const segs = (state.segments && state.segments.length) ? state.segments : [
    { al:"TG", fn:"322", cls:"W", date:"25SEP", dep:"DAC", arr:"BKK", depT:"1335", arrT:"1715" },
    { al:"TG", fn:"321", cls:"W", date:"07OCT", dep:"BKK", arr:"DAC", depT:"1035", arrT:"1210" }
  ];

  // Build passenger name line for FXB / FXA (01 P1 or 01 SURNAME/FIRST*)
  const showPaxLine = upper.startsWith('FXB') || upper.startsWith('FXA');
  const paxLine = (hasPax && showPaxLine)
    ? (() => {
        const p = state.passengers[0];
        const raw = (p.label || 'PAX/ONE').split(' ')[0];
        const parts = raw.split('/');
        const surname = parts[0] || 'PAX';
        const first = (parts[1] || 'ONE').split(' ')[0];
        return `01  ${surname}/${first}*`;
      })()
    : `01 P1`;

  // Status line: matches real Amadeus screenshot
  const statusLine = isNoRebar
    ? `NO REBOOKING PERFORMED — LOWEST FARE AVAILABLE FOR THE CURRENT BOOKING CLASS`
    : `NO REBOOKING REQUIRED FOR LOWEST AVAILABLE FARE`;

  // Ticket deadline
  const tkDte = (() => {
    const seg0 = segs[0];
    const raw = seg0.date || '25SEP';
    const m = raw.match(/(\d+)([A-Z]{3})/i);
    const day = m ? m[1] : '31';
    const mon = m ? m[2].toUpperCase() : 'MAR';
    return `${day}${mon}26`;
  })();

  const rows = [
    upper,
    ``,
    paxLine,
    statusLine,
    `LAST TKT DTE ${tkDte} - SEE SALES RSTNS`,
    `------------------------------------------------------------`,
    `       AL FLGT   BK T DATE   TIME  FARE BASIS       NVB   NVA   BG`
  ];

  // Origin city of whole journey
  rows.push(` ${segs[0].dep}`);

  // Segment rows
  segs.forEach((s, idx) => {
    // City code: destination of this segment (e.g. ' BKK', ' DAC')
    // If it's a connecting transit segment in multi-leg flight (not roundtrip turnaround):
    const isTransit = (idx < segs.length - 1 && s.arr !== segs[0].dep && segs[idx+1] && segs[idx+1].arr !== segs[0].dep);
    const city = (isTransit ? `X${s.arr}` : ` ${s.arr}`).padEnd(4, ' ');

    const al = s.al.padEnd(2, ' ');
    const fn = s.fn.padStart(5, ' ');
    const bk = (s.cls || 'W').padStart(2, ' ');
    const t = (s.cls || 'W').padStart(2, ' ');
    const date = (s.date || '25SEP').padStart(5, ' ');
    const time = (s.depT || '1335').padStart(4, ' ');

    // Fare basis
    const fBasis = (s.al === 'TG' ? `${s.cls || 'W'}LASV` : `${s.cls || 'N'}JR4R1RI`).padEnd(16, ' ');

    // NVB and NVA: flight date repeated (e.g. 25SEP25SEP or 12DEC12DEC)
    const nvbNva = `${s.date || '25SEP'}${s.date || '25SEP'}`.padEnd(10, ' ');

    // Baggage: 1P
    const bg = '  1P';

    rows.push(`${city} ${al} ${fn} ${bk} ${t} ${date} ${time}     ${fBasis} ${nvbNva}${bg}`);
  });

  rows.push(``);

  const origCity = segs[0].dep;
  const destCity = segs[segs.length - 1].arr;
  const date0 = segs[0].date || '25SEP';
  const isTG = (segs[0].al === 'TG');
  const isAI = (segs[0].al === 'AI');

  if (isAI) {
    // Exact Air India calculation matching YouTube Screenshot 4
    const aiRows = [
      upper,
      ``,
      paxLine,
      statusLine,
      `LAST TKT DTE 10FEB25 - DATE OF ORIGIN`,
      `------------------------------------------------------------`,
      `       AL FLGT   BK T DATE   TIME  FARE BASIS       NVB   NVA   BG`,
      ` DAC`,
      `XDEL AI   238 L  L 10FEB 2100     LL2YXSDC         10FEB10FEB 1P`,
      ` LON AI   111 L  L 11FEB 0730     LL2YXSDC         11FEB11FEB 1P`,
      `XDEL AI   112 G  G 25FEB 1330     GL2YXSDC         25FEB25FEB 1P`,
      ` DAC AI  2181 G  G 26FEB 0645     GL2YXSDC         26FEB26FEB 1P`,
      ``,
      `USD   216.00     10FEB25DAC AI X/DEL AI LON75.50AI X/DEL AI`,
      `BDT    25916     DAC140.50NUC216.00END ROE1.00`,
      `BDT      500-BD  XT BDT 912-YR BDT 435-E5 BDT 3000-OW BDT`,
      `BDT    47992-YQ  1200-P7 BDT 1200-P8 BDT 6000-UT BDT 13389`,
      `BDT    34005-XT  -GB BDT 7869-UB`,
      `BDT   108413`,
      `RATE USED 1USD=119.98BDT`
    ];
    storeTst([
      { tstNum: 1, pCode: '.1', name: (hasPax ? state.passengers[0].label : 'P1'), fare: 25916, tax: 82497, total: 108413, ptc: 'ADT', segs: `1-${segs.length}` }
    ]);
    pricingMorePageRows = buildPricingMorePageRows();
    pricingPageTwoRows = aiRows.slice();
    printLines(aiRows, '');
    showToast(isNoRebar
      ? `FXA — Lowest fare for current class shown (BDT 108,413) — no rebook, no TST stored`
      : `✓ Quoted (${upper}) — Lowest available fare (BDT 108,413)`);
    return;
  } else if (isTG) {
    // Exact Thai Airways calculation from YouTube tutorial
    if(isCurConverted){
      const fareCur = (31414 / curRate).toFixed(2);
      const taxCur = (15929 / curRate).toFixed(2);
      const totalCur = (47343 / curRate).toFixed(2);
      rows.push(`USD    256.00     ${date0}26DAC TG BKK128.00TG DAC128.00NUC`);
      rows.push(`${overrideCur.padEnd(6, ' ')} ${String(fareCur).padStart(10, ' ')}     256.00END ROE1.00`);
      rows.push(`TOTAL TAX ${overrideCur} ${taxCur}`);
      rows.push(`TOTAL     ${overrideCur} ${totalCur}`);
      rows.push(`EQUIV     BDT   47343`);
      rows.push(`RATE USED 1${overrideCur}=${curRate.toFixed(4)}BDT  BSR`);
      rows.push(`FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)`);
      rows.push(`FARE FAMILY:FC1:1:ECOSV1`);
      rows.push(`FARE FAMILY:FC2:2:ECOSV1`);
      rows.push(`>                                                   PAGE  2/ 3`);
      storeTst([
        { tstNum: 1, pCode: '.1', name: (hasPax ? state.passengers[0].label : 'PAX 1'), fare: Math.round(Number(fareCur)), tax: Math.round(Number(taxCur)), total: Math.round(Number(totalCur)), currency: overrideCur, ptc: 'ADT', segs: `1-${segs.length}` }
      ]);
    } else {
      rows.push(`USD    256.00     ${date0}26DAC TG BKK128.00TG DAC128.00NUC`);
      rows.push(`BDT     31414     256.00END ROE1.00`);
      rows.push(`BDT    500-BD     XT BDT 444-E5 BDT 2500-OW BDT 1228-P7 BDT`);
      rows.push(`BDT   1228-YR     1228-P8 BDT 4000-UT BDT 136-E7 BDT 136-E7`);
      rows.push(`BDT  14201-XT     BDT 97-G8 BDT 97-G8 BDT 4335-TS`);
      rows.push(`BDT     47343`);
      rows.push(`RATE USED 1USD=122.71BDT`);
      rows.push(`FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)`);
      rows.push(`FARE FAMILY:FC1:1:ECOSV1`);
      rows.push(`FARE FAMILY:FC2:2:ECOSV1`);
      rows.push(`>                                                   PAGE  2/ 3`);

      storeTst([
        { tstNum: 1, pCode: '.1', name: (hasPax ? state.passengers[0].label : 'PAX 1'), fare: 31414, tax: 15929, total: 47343, ptc: 'ADT', segs: `1-${segs.length}` }
      ]);
    }
  } else {
    // General international calculation (e.g. QR / TK)
    const alCode = segs[0].al;
    const viaCode = segs.length > 2 ? ` X/${segs[0].arr}` : '';
    if(isCurConverted){
      const fareCur = (131055 / curRate).toFixed(2);
      const taxCur = (14698 / curRate).toFixed(2);
      const totalCur = (145753 / curRate).toFixed(2);
      rows.push(`USD   1068.00     ${date0}26${origCity} ${alCode}${viaCode} ${alCode} ${destCity}1068.00NUC`);
      rows.push(`${overrideCur.padEnd(6, ' ')} ${String(fareCur).padStart(10, ' ')}     1068.00END ROE1.00`);
      rows.push(`TOTAL TAX ${overrideCur} ${taxCur}`);
      rows.push(`TOTAL     ${overrideCur} ${totalCur}`);
      rows.push(`EQUIV     BDT  145753`);
      rows.push(`RATE USED 1${overrideCur}=${curRate.toFixed(4)}BDT  BSR`);
      rows.push(`FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)`);
      rows.push(`FARE FAMILY:FC1:1-2:${getFareFamilyInfo(alCode).code}`);
      rows.push(`FXU/TS TO UPSELL ECONVENIEN`);
      rows.push(`>                                                   PAGE  2/ 3`);
      storeTst([
        { tstNum: 1, pCode: '.1', name: (hasPax ? state.passengers[0].label : 'PAX 1'), fare: Math.round(Number(fareCur)), tax: Math.round(Number(taxCur)), total: Math.round(Number(totalCur)), currency: overrideCur, ptc: 'ADT', segs: `1-${segs.length}` }
      ]);
    } else {
      rows.push(`USD   1068.00     ${date0}26${origCity} ${alCode}${viaCode} ${alCode} ${destCity}1068.00NUC`);
      rows.push(`BDT    131055     1068.00END ROE1.00`);
      rows.push(`BDT     500-BD    XT BDT 2500-OW BDT 1228-P7 BDT 1228-P8 BDT`);
      rows.push(`BDT     444-E5    4000-UT BDT 2022-G4 BDT 184-PZ BDT 2022-QA`);
      rows.push(`BDT   13754-XT    BDT 337-R9 BDT 136-E7 BDT 97-G8`);
      rows.push(`BDT    145753`);
      rows.push(`RATE USED 1USD=122.71BDT`);
      rows.push(`FARE FAMILIES:    (ENTER FQFn FOR DETAILS, FXY FOR UPSELL)`);
      rows.push(`FARE FAMILY:FC1:1-2:${getFareFamilyInfo(alCode).code}`);
      rows.push(`FXU/TS TO UPSELL ECONVENIEN FOR 6626BDT`);
      rows.push(`>                                                   PAGE  2/ 3`);

      storeTst([
        { tstNum: 1, pCode: '.1', name: (hasPax ? state.passengers[0].label : 'PAX 1'), fare: 131055, tax: 14698, total: 145753, ptc: 'ADT', segs: `1-${segs.length}` }
      ]);
    }
  }

  printLines(rows, '');
  if(rows.some(row => /PAGE\s+2\/\s*3/.test(String(row)))){
    pricingMorePageRows = buildPricingMorePageRows();
    pricingPageTwoRows = rows.slice();
  }
  showToast(isNoRebar
    ? `FXA — Lowest fare for current class shown — no rebook, no TST stored`
    : `✓ Quoted (${upper}) — Lowest available fare`);
  return;
}

// ---------- TQT — Ticket Quote Table / Display TST (Screenshot 3) ----------
function handleTQT(cmd){
  if(!state.hasTST || !state.tstRecords || !state.tstRecords.length){
    printLines(['NO TST EXISTS — USE FXB OR FXP TO CREATE TST FIRST'], 'err');
    return;
  }

  const fopStr = state.fop || '';
  const tstMatch = (cmd || '').match(/\/T(\d+)/i);
  const requestedTstNum = tstMatch ? parseInt(tstMatch[1], 10) : null;
  const tst = (requestedTstNum && state.tstRecords.find(t => t.tstNum === requestedTstNum)) || state.tstRecords[0] || {};
  const segs = state.segments || [];
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const now = new Date();
  const dateStr = `${String(now.getDate()).padStart(2,'0')}${months[now.getMonth()]}`;
  const yrShort = String(now.getFullYear()).slice(-2);
  const origCity = segs.length ? segs[0].dep : 'DAC';
  const destCity = segs.length ? segs[segs.length-1].arr : 'SIN';
  const flightDate = segs.length ? (segs[segs.length-1].date || '25AUG') : '25AUG';
  const ldDay = parseInt(flightDate) || 25;
  const flightMon = months.findIndex(m => flightDate.toUpperCase().includes(m));
  const ldMon = flightMon >= 0 ? months[flightMon] : 'AUG';
  const ldDate = `${ldDay}${ldMon}${yrShort}`;
  const agCode = state.agentCode || 'BP/AS';
  const agInitials = agCode.split('/')[0] || 'BP';
  const currOffice = state.officeId || OFFICE_ID;
  const al = segs.length ? segs[0].al : 'BG';

  const fareBDT = tst.fare || Math.round((tst.total || 30000) * 0.8);
  const taxBDT = tst.tax || ((tst.total || 30000) - fareBDT);
  const totalBDT = tst.total || 30000;
  const ptc = tst.ptc || 'ADT';

  // Check if this is a reissue TST — show reissue-specific header
  const isExch = Boolean(state._exchangeMode || state._exchangeData || (state.tickets && state.tickets.some(t => t.status === 'E')));
  const showDetail = /\/T\d+/i.test(cmd || '') || state.tstRecords.length === 1 || isExch;

  const rows = [];
  if(!showDetail && state.tstRecords.length > 1){
    // TQT summary line (only when multiple TSTs exist and no specific /T requested)
    rows.push(`T    P/S  NAME                     TOTAL          FOP`);
    state.tstRecords.forEach(t => {
      const tNum = `${t.tstNum}`;
      const pCode = (t.pCode || '.1').padEnd(5, ' ');
      const nameStr = (t.name || '').slice(0, 24).padEnd(25, ' ');
      const totStr = `BDT ${t.total}`.padEnd(20, ' ');
      const fopDisplay = fopStr;
      rows.push(`${tNum}    ${pCode}${nameStr}${totStr}${fopDisplay}`);
    });
    rows.push(``);
  }

  if(showDetail){
    const tstNum = requestedTstNum || tst.tstNum || 1;
    const tstTag = `TST${String(tstNum).padStart(5, '0')}`;
    rows.push(`${tstTag.padEnd(16, ' ')}${dateStr} I O LD ${ldDate} 2359 OD ${origCity}${destCity}`);
    if(isExch){
      rows.push(`T-E`);
      rows.push(`FXQ`);
      rows.push(``);
    }

    // Passengers
    (state.passengers || [{ label: tst.name || 'JHONY/MD MR' }]).forEach((p, i) => {
      rows.push(`    ${i+1}.${p.label || tst.name || 'JHONY/MD MR'}`);
    });

    rows.push(``);

    // Segments
    segs.forEach((s, idx) => {
      const dep = s.dep || origCity;
      const arrCity = s.arr || destCity;
      const cls = s.cls || 'Y';
      const fBasis = `${cls}${String(s.fn || '555').slice(-2) || '55'}`.padEnd(16, ' ');
      const nva = s.date || flightDate;
      rows.push(` ${idx+1}   ${dep} ${s.al || al}  ${String(s.fn || '555').padStart(4,' ')} ${cls} ${s.date||flightDate} ${s.depT||'1659'}  OK ${fBasis} ${nva}    25K`);
    });

    rows.push(``);

    // Fare block matching real Amadeus BDT format
    const tx1 = Math.round(taxBDT * 0.08);   // BD airport
    const tx2 = Math.round(taxBDT * 0.07);   // E5/departure
    const tx3 = Math.round(taxBDT * 0.42);   // OW/security
    const tx4 = Math.round(taxBDT * 0.21);   // P7
    const tx5 = Math.round(taxBDT * 0.12);   // P8
    const txRem = taxBDT - tx1 - tx2 - tx3 - tx4 - tx5;

    rows.push(`FARE   BDT        ${fareBDT}`);
    rows.push(`EQUIV  BDT        ${fareBDT}`);
    rows.push(`TX001 X BDT   ${tx1}-BDAE TX002 X BDT   ${tx2}-E5GO TX003 X BDT   ${tx3}-OWGA`);
    rows.push(`TX004 X BDT   ${tx4}-P7DE TX005 X BDT   ${tx5}-P8SE TX006 X BDT   ${txRem}-UTTR`);
    rows.push(`TOTAL  BDT        ${totalBDT}`);
    rows.push(`GRAND TOTAL BDT   ${totalBDT}`);
    rows.push(``);

    // NUC routing line
    const nucBase = (fareBDT / 122.71).toFixed(2);
    rows.push(`${origCity} ${al}${destCity}${nucBase}NUC${nucBase}END ROE122.71`);
    rows.push(``);

    // FE / FO lines
    if(isExch && state.tickets){
      const origTkt = state.tickets.find(t => t.status === 'E') || state.tickets[0];
      if(origTkt){
        rows.push(`${segs.length + 4}.FE NON-ENDORSABLE`);
        rows.push(`${segs.length + 5}.FO ${origTkt.tktNum}/${origCity}${dateStr}/${currOffice}/${origTkt.tktNum.replace(/-/g,'')}1`);
      }
    } else {
      rows.push(`${segs.length + 4}.FE NON-ENDORSABLE`);
      rows.push(`${segs.length + 5}.FV ${al}`);
    }
  }

  printLines(rows, '');
  showToast(`Ticket Quote Table (TQT) displayed`);
}

// Selling Platform Connect opens this compact TST chooser together with TQT.
function showTstListModal(records){
  document.getElementById('tstListOverlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id = 'tstListOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:10020;background:rgba(0,0,0,.12);display:flex;align-items:center;justify-content:center;font-family:Arial,sans-serif;';
  const card = document.createElement('section');
  card.setAttribute('role', 'dialog');
  card.setAttribute('aria-label', 'List of TSTs');
  card.style.cssText = 'width:min(620px,calc(100vw - 32px));background:#fff;border:1px solid #aeb8c4;box-shadow:0 2px 10px rgba(0,0,0,.3);color:#222;font-size:12px;';
  const header = document.createElement('div');
  header.style.cssText = 'height:25px;display:flex;align-items:center;padding:0 8px;border-bottom:1px solid #c9d0d8;font-weight:600;';
  header.append('List of TSTs');
  const close = document.createElement('button');
  close.type = 'button'; close.textContent = '×'; close.setAttribute('aria-label', 'Close');
  close.style.cssText = 'margin-left:auto;border:0;background:transparent;color:#356da8;font-size:20px;line-height:1;cursor:pointer;';
  close.onclick = () => overlay.remove();
  header.append(close); card.append(header);
  const table = document.createElement('table');
  table.style.cssText = 'width:100%;border-collapse:collapse;table-layout:fixed;';
  table.innerHTML = '<thead><tr style="background:#e9edf2;text-align:left"><th style="width:42px">Index</th><th>Passenger</th><th style="width:44px">PTC</th><th style="width:116px">Number of Segments</th><th style="width:92px">Form of payment</th><th style="width:92px">Total</th></tr></thead>';
  const body = document.createElement('tbody');
  let selectedIndex = 0;
  records.forEach((t, index) => {
    const row = document.createElement('tr');
    row.style.cssText = 'border-top:1px solid #d5d9de;cursor:pointer;';
    const cells = [String(index + 1), t.name || '', t.ptc || '-', String((t.segs || '1').split('-').length), state.fop || 'INV', `BDT ${t.total || ''}`];
    cells.forEach(value => { const cell = document.createElement('td'); cell.textContent = value; cell.style.cssText = 'padding:5px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'; row.append(cell); });
    row.onclick = () => { selectedIndex = index; [...body.rows].forEach(r => r.style.background = ''); row.style.background = '#ffd66b'; };
    if(index === 0) row.style.background = '#ffd66b';
    body.append(row);
  });
  table.append(body); card.append(table);
  const footer = document.createElement('div'); footer.style.cssText = 'padding:12px 10px;text-align:right;';
  const open = document.createElement('button'); open.type = 'button'; open.textContent = 'Open'; open.style.cssText = 'border:0;border-radius:2px;background:#1769c2;color:#fff;padding:5px 13px;font-size:12px;cursor:pointer;';
  open.onclick = () => { overlay.remove(); showTstDetailModal(records, selectedIndex); }; footer.append(open); card.append(footer);
  overlay.onclick = event => { if(event.target === overlay) overlay.remove(); };
  overlay.append(card); document.body.append(overlay); close.focus();
}

function showTstDetailModal(records, selectedIndex = 0){
  document.getElementById('tstDetailOverlay')?.remove();
  const selected = records[selectedIndex] || records[0];
  const segTh = 'style="padding:5px 8px;text-align:left;white-space:nowrap;border-bottom:1px solid #c0ccd6;"';
  const segTd = 'style="padding:5px 8px;white-space:nowrap;border-bottom:1px solid #e0e0e0;"';
  const colWidths = ['4%','10%','10%','14%','7%','10%','10%','15%'];
  const colGroup = `<colgroup>${colWidths.map(w=>`<col style="width:${w}">`).join('')}</colgroup>`;
  const segRows = (state.segments || []).map((seg, index) => `<tr><td ${segTd}>${index + 1}</td><td ${segTd}>${seg.dep}</td><td ${segTd}>${seg.arr}</td><td ${segTd}>${seg.al} ${seg.fn}</td><td ${segTd}>${seg.cls}</td><td ${segTd}>${seg.date}</td><td ${segTd}>${seg.depT}</td><td ${segTd}>OK</td></tr>`).join('');
  const listRows = records.map((t, index) => `<tr style="${index === selectedIndex ? 'background:#ffd66b;' : ''}"><td style="padding:5px 8px;"">TST ${t.tstNum}</td><td style="padding:5px 8px;">Not Ticketed</td><td style="padding:5px 8px;">${esc(t.name)}</td><td style="padding:5px 8px;">${esc(t.ptc)}</td><td style="padding:5px 8px;">BDT ${t.total}</td></tr>`).join('');
  const overlay = document.createElement('div');
  overlay.id = 'tstDetailOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:10021;background:rgba(0,0,0,.18);overflow:auto;padding:24px;font-family:Arial,sans-serif;color:#222;';
  overlay.innerHTML = `<section style="max-width:1100px;margin:auto;background:#fff;border:1px solid #9bb5cd;box-shadow:0 2px 12px rgba(0,0,0,.35);padding:14px;font-size:12px;"><button id="tstDetailClose" style="float:right;border:0;background:none;color:#1769c2;font-size:22px;cursor:pointer">×</button><h3 style="margin:0 0 10px">TST</h3><b>Available TST</b><table style="width:100%;border-collapse:collapse;margin:6px 0 16px"><thead><tr style="background:#e7e7e7"><th style="padding:5px 8px;text-align:left;">TST</th><th style="padding:5px 8px;text-align:left;">Status</th><th style="padding:5px 8px;text-align:left;">Passenger</th><th style="padding:5px 8px;text-align:left;">PTC</th><th style="padding:5px 8px;text-align:left;">Price (incl. taxes)</th></tr></thead><tbody>${listRows}</tbody></table><div style="border:1px solid #4386b7;padding:8px"><b>TST${selected.tstNum} - ${esc(selected.name)} (${esc(selected.ptc)})</b><table style="width:100%;border-collapse:collapse;table-layout:fixed;margin-top:10px">${colGroup}<thead><tr style="background:#dfe5ea"><th ${segTh}>#</th><th ${segTh}>Dep. City</th><th ${segTh}>Arr. City</th><th ${segTh}>Flight No.</th><th ${segTh}>Class</th><th ${segTh}>Date</th><th ${segTh}>Dep. Time</th><th ${segTh}>Segment Status</th></tr></thead><tbody>${segRows}</tbody></table></div><div style="display:flex;gap:16px;margin-top:16px"><section style="flex:1;border:1px solid #9bb5cd;padding:8px"><b>Fare Information</b><p>Equivalent Fare: <strong>BDT ${selected.fare || selected.total}</strong></p><p>Taxes: <strong>BDT ${selected.tax || 0}</strong></p><p>Total: <strong>BDT ${selected.total}</strong></p></section><section style="flex:1;border:1px solid #9bb5cd;padding:8px"><b>Additional information</b><p>Validating Carrier: ${(state.segments[0] || {}).al || ''}</p><p>Form of Payment: ${state.fop || 'INV'}</p><p>Fare calculation: ${esc((state.segments || []).map(s => `${s.dep} ${s.al}${s.fn} ${s.arr}`).join(' '))}</p></section></div><div style="text-align:right;margin-top:14px"><button id="tstDetailUpdate" style="background:#1769c2;color:#fff;border:0;padding:6px 14px;cursor:pointer">Update</button></div></section>`;
  overlay.querySelector('#tstDetailClose').onclick = () => overlay.remove();
  overlay.querySelector('#tstDetailUpdate').onclick = () => { overlay.remove(); showToast('TST details updated'); };
  document.body.append(overlay);
}

// ---------- TQ T — Full TST Detail Display (matches original Amadeus screenshot) ----------
function handleTQDetail(){
  if(!state.hasTST){
    printLines(['NO TST EXISTS — USE FXB OR FXP TO CREATE TST FIRST'], 'err');
    return;
  }

  const segs = state.segments || [];
  const pax  = state.passengers || [];
  const currOffice = state.officeId || OFFICE_ID;
  const al   = segs.length ? segs[0].al : 'QR';

  // TST header line: TST00001  DACVS33Q4 MM/07MAR I 0 LD 19MAY26 2359 OD DACBKK
  const now = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dateStr = `${String(now.getDate()).padStart(2,'0')}${months[now.getMonth()]}`;
  const yrShort = String(now.getFullYear()).slice(-2);
  // Last date = flight date (approx)
  const flightDate = segs.length ? segs[0].date : '20MAY';
  const flightMon  = months.findIndex(m => flightDate.toUpperCase().includes(m));
  const flightDay  = parseInt(flightDate) || 20;
  const ldDay = flightDay > 1 ? flightDay - 1 : flightDay;
  const ldMon = flightMon >= 0 ? months[flightMon] : 'MAY';
  const ldDate = `${ldDay}${ldMon}${yrShort}`;
  const origCity = segs.length ? segs[0].dep : 'DAC';
  const destCity = segs.length ? segs[segs.length-1].arr : 'BKK';
  const agCode = state.agentCode || 'MM';
  const agInitials = agCode.split('/')[0] || 'MM';

  const rows = [];
  rows.push(`TST00001    ${currOffice} ${agInitials}/${dateStr} I 0 LD ${ldDate} 2359 OD ${origCity}${destCity}`);
  rows.push(`T-E`);
  rows.push(`FXB`);

  // Passenger line(s)
  pax.forEach((p, i) => {
    rows.push(`    ${i+1}.${p.label || 'HOSSAIN/KAMALA MS'}`);
  });
  if(!pax.length) rows.push(`    1.PASSENGER/NAME MS`);

  // Segment lines
  // Format: " 1  DAC QR  639 N 20MAY 0410  OK NJR4R1RI          20MAY    25K"
  const isTG = (segs.length && segs[0].al === 'TG');
  const tst = (state.tstRecords && state.tstRecords[0]) ? state.tstRecords[0] : null;
  const fareBDT = tst ? tst.fare : (isTG ? 31414 : 131055);
  const fareUSD = isTG ? 256.00 : 1068.00;
  const taxTotal = tst ? tst.tax : (isTG ? 15929 : 14698);
  const grandTotal = tst ? tst.total : (fareBDT + taxTotal);
  const bsr = 122.71;

  segs.forEach((s, idx) => {
    const isTransit = (idx < segs.length - 1 && s.arr !== segs[0].dep && segs[idx+1] && segs[idx+1].arr !== segs[0].dep);
    const connX = isTransit ? 'X' : ' ';
    const dep   = s.dep.padEnd(3,' ');
    const alPad = s.al.padEnd(2,' ');
    const fn    = s.fn.padStart(4,' ');
    const cls   = s.cls || (s.al === 'TG' ? 'W' : 'N');
    const fBasis= (s.al === 'TG' ? `${cls}LASV` : `${cls}JR4R1RI`).padEnd(16,' ');
    const nva   = s.date || '25SEP';
    const bg    = ' 1P';
    rows.push(` ${idx+1} ${connX} ${dep} ${alPad} ${fn} ${cls} ${s.date||'25SEP'} ${s.depT||'1335'}  OK ${fBasis} ${nva}    ${bg}`);
  });

  // Fare block

  rows.push(``);
  rows.push(`FARE F USD   ${fareUSD.toFixed(2)}`);
  rows.push(`EQUIV  BDT     ${fareBDT}`);
  rows.push(`TX001 X BDT    500-BDAE TX002 X BDT    444-E5GO TX003 X BDT    2500-OWGA`);
  rows.push(`TX004 X BDT   1228-P7DE TX005 X BDT   1228-P8SE TX006 X BDT   4000-UTTR`);
  rows.push(`TX007 X BDT   2022-G4AF TX008 X BDT    184-PZAV TX009 X BDT   2022-QAAP`);
  rows.push(`TX010 X BDT    337-R9SE TX011 X BDT    136-E7AD TX012 X BDT     97-G8AE`);
  rows.push(`TOTAL  BDT   ${grandTotal}    BSR ${bsr}`);
  rows.push(`GRAND TOTAL BDT    ${grandTotal}`);

  // NUC routing line
  const viaStr = segs.length > 1 ? ` ${al} X/${segs[0].arr} ${segs[1]?.al||al}` : ` ${al}`;
  rows.push(`${origCity}${viaStr} ${destCity}${fareUSD.toFixed(2)}NUC${fareUSD.toFixed(2)}END ROE1.00`);
  rows.push(``);

  // FE / FV lines
  const feNum = pax.length + segs.length + 11;
  rows.push(`${feNum}.FE /C1-2 NON END/CHNG PENALTIES AS PER RULE`);
  rows.push(`${feNum+1}.FV ${al}`);

  printLines(rows, '');
  showToast(`TST Detail displayed (TQ T)`);
}

// ---------- FPINV / FP ... — Form of Payment (Screenshot 4) ----------
function handleFP(cmd){
  const fopVal = cmd.replace(/^FP\s*/i, '').trim().toUpperCase() || 'INV';
  state.fop = fopVal;
  state.hasPending = true;
  if(state.segments && state.segments.length) renderPNR();
  else printLines([`Ticket Modifiers Updated`], 'success');
  showToast(`âœ… Form of Payment (FP ${fopVal}) recorded — Type TTP to issue ticket`);
}

// ---------- TTP — Issue Electronic Ticket (Issue Entry — Screenshot 2 & 3) ----------

// ---------- SB — Segment Rebook / Change Date / Class (Shortcut for Reissue) ----------
function handleSB(cmd){
  if(!state.segments || !state.segments.length){
    printLines(["NO ACTIVE ITINERARY TO REBOOK / CHANGE DATE", "RETRIEVE A PNR FIRST WITH RT <LOCATOR>"], "err");
    return;
  }
  const clean = cmd.replace(/^SB\s*/i, "").trim();
  const tokens = clean.split(/\s+/).filter(Boolean);

  let targetSegIdx = 0;
  let newDate = null;
  let newCls = null;

  tokens.forEach(tok => {
    if(/^\d+$/.test(tok)){
      targetSegIdx = parseInt(tok, 10) - 1;
    } else if(/^[0-3]?\d[A-Z]{3}$/i.test(tok)){
      newDate = tok.toUpperCase();
    } else if(/^[A-Z]$/i.test(tok)){
      newCls = tok.toUpperCase();
    }
  });

  if(targetSegIdx < 0 || targetSegIdx >= state.segments.length) targetSegIdx = 0;
  const seg = state.segments[targetSegIdx];

  if(newDate){
    seg.date = newDate;
    const baseYear = seg.fullDate ? parseInt(seg.fullDate.split('-')[0], 10) : new Date().getFullYear();
    const resolved = resolveFlightDate(newDate, new Date(baseYear, 0, 1));
    if(resolved && !isNaN(resolved.getTime())){
      const yyyy = resolved.getFullYear();
      const mm = String(resolved.getMonth() + 1).padStart(2, "0");
      const dd = String(resolved.getDate()).padStart(2, "0");
      seg.fullDate = `${yyyy}-${mm}-${dd}`;
    }
  }
  if(newCls) seg.cls = newCls;

  // Clear previous TST to allow re-pricing with FXQ
  state.hasTST = false;
  state.tstRecords = [];
  state._exchangeTstDeleted = true;
  state.hasPending = true;

  const origin = seg.dep || "DAC";
  const dest = seg.arr || "SIN";
  const al = seg.al || "BG";
  const fn = seg.fn || "555";
  const cls = seg.cls || "Y";
  const dt = seg.date || "25AUG";

  // Strictly output the updated segment status line in authentic Amadeus format
  printLines([
    `0${targetSegIdx + 1}  ${al} ${fn} ${cls}  ${dt} ${origin}${dest} HK1`
  ], "");
  showToast(`Segment ${targetSegIdx + 1} updated: ${dt} Class ${cls}`);
  // Persist updated segment (including new fullDate) so TTP reads correct date/class
  if(typeof saveCurrentPNRForExchange === 'function') saveCurrentPNRForExchange();
  else saveCurrentPNR();
}

function handleTTP(cmd){
  if(!state.locator && (!state.passengers.length || !state.segments.length)){
    loadJhonyPNR();
  }

  // TTP/TKT is a pre-issue validation only.  It must never create a ticket.
  if(/\/TKT(?:\/|$)/i.test(cmd)){
    const missing = [];
    if(!state.hasTST || state.tstNeedsReprice) missing.push('NEED TST');
    if(!state.fop) missing.push('FORM OF PAYMENT MISSING - ENTER FP');
    if(state.ticketed) missing.push('TICKET ALREADY ISSUED');
    if(missing.length){
      printLines(missing, 'err');
    } else {
      printLines(['OK TO TICKET'], 'success');
      showToast('Pre-issue validation completed');
    }
    return;
  }

  // ER saves the PNR; IR is not required before ticket issue. TTP needs both
  // a priced TST and a form of payment.
  const isExchange = /\/(?:EXCH|ATC|TTM)(?:\/|$)/i.test(cmd) || Boolean(state._exchangeMode) || Boolean(state._foRecorded);

  const issueMissing = [];
  if(!state.hasTST || state.tstNeedsReprice) issueMissing.push('NEED TST');
  if(!state.fop) issueMissing.push('FORM OF PAYMENT MISSING - ENTER FP INV OR FP CASH');
  if(state.ticketed && !isExchange){
    printLines([
      'TICKET ALREADY ISSUED FOR THIS PNR',
      'TO REISSUE / CHANGE DATE: ENTER FXQ OR TTP/EXCH',
      'TO REFUND TICKET: ENTER TRF'
    ], 'err');
    return;
  }
  if(issueMissing.length){ printLines(issueMissing, 'err'); return; }

  const isBG = (state.segments[0] && state.segments[0].al === 'BG') || (state.locator === 'ICRBPO') || (!state.segments[0] && !state.locator);
  const isTG = (state.segments[0] && state.segments[0].al === 'TG') || (state.locator === 'OGJZJ9');

  const alCode = isBG ? '157' : (isTG ? '217' : '074');
  const alLetter = isBG ? 'BG' : (isTG ? 'TG' : 'TK');
  let tktNum = isBG ? '157-7800396554421' : (isTG ? '217-2456789012' : '074-2456789012');
  let oldTkt = null;

  if(isExchange && state.tickets && state.tickets.length){
    const targetNum = (state._exchangeData && state._exchangeData.oldTkt) || (state._manualExchange && state._manualExchange.oldTkt) || state._foRecorded;
    if(targetNum){
      oldTkt = state.tickets.find(t => t.tktNum === targetNum || t.tktNum.replace(/-/g, '') === targetNum.replace(/-/g, ''));
      if(!oldTkt){
        printLines([`ORIGINAL TICKET ${targetNum} NOT FOUND IN ACTIVE PNR`], 'err');
        return;
      }
    } else {
      oldTkt = state.tickets[state.tickets.length - 1];
    }
    if(oldTkt.status === 'R' || oldTkt.status === 'V' || oldTkt.status === 'E'){
      const reason = oldTkt.status === 'R' ? 'REFUNDED' : oldTkt.status === 'V' ? 'VOIDED' : 'ALREADY EXCHANGED';
      printLines([`CANNOT REISSUE: ORIGINAL TICKET IS ${reason}`], 'err');
      return;
    }
    const parts = oldTkt.tktNum.split('-');
    const prefix = parts[0] || (isBG ? '157' : '217');
    const numPart = parseInt(parts[1] || '7800396554421', 10) + 1;
    tktNum = `${prefix}-${numPart}`;
  } else if(isExchange){
    printLines(['CANNOT REISSUE: ORIGINAL TICKET NOT FOUND IN ACTIVE PNR'], 'err');
    return;
  }

  // Robustly get fare value — never undefined
  let fareVal = 30000;
  if(state.tstRecords && state.tstRecords.length > 0){
    const totalSum = state.tstRecords.reduce((sum, r) => sum + (parseInt(r.total, 10) || 0), 0);
    if(totalSum > 0) fareVal = totalSum;
  }
  if(state._manualExchange && oldTkt){
    const ticketValue = Number.isFinite(Number(oldTkt.remainingValue)) ? Number(oldTkt.remainingValue) : (state._manualExchange.partiallyUsed ? null : (Number(oldTkt.amount) || 0));
    const expectedADC = ticketValue === null ? null : Math.max(0, fareVal - ticketValue);
    const addCollect = Number.isFinite(state._manualExchange.addCollect) ? state._manualExchange.addCollect : expectedADC;
    if(state._manualExchange.partiallyUsed && addCollect === null){
      printLines(['PARTIALLY USED TICKET: MANUAL ADC IS REQUIRED — ENTER TTK/T<ADC> AFTER PRICING THE UNUSED COUPONS'], 'err');
      return;
    }
    if(!state._foRecorded){
      printLines(['ORIGINAL ISSUE (FO) REQUIRED BEFORE MANUAL EXCHANGE'], 'err');
      return;
    }
    if(!state._exchangePayment){
      printLines(['ORIGINAL FORM OF PAYMENT REQUIRED — ENTER FPO/OLD-FOP+/NEW-FOP'], 'err');
      return;
    }
    if(addCollect > 0 && !state._exchangePayment.additionalFop){
      printLines(['ADDITIONAL COLLECTION FORM REQUIRED — ENTER FPO/OLD-FOP+/NEW-FOP'], 'err');
      return;
    }
  }

  const flightNum = (state.segments[0] && state.segments[0].fn) ? state.segments[0].fn : '555';
  let depDate = (state.segments[0] && state.segments[0].fullDate) ? state.segments[0].fullDate : null;
  if(!depDate && state.segments[0] && state.segments[0].date){
    const resolved = resolveFlightDate(state.segments[0].date);
    if(resolved && !isNaN(resolved.getTime())){
      const yyyy = resolved.getFullYear();
      const mm = String(resolved.getMonth() + 1).padStart(2, "0");
      const dd = String(resolved.getDate()).padStart(2, "0");
      depDate = `${yyyy}-${mm}-${dd}`;
    }
  }
  depDate = depDate || "2026-08-25";
  const destName = (state.segments[0] && state.segments[0].arr === 'SIN') ? 'Singapore Changi Airport' : 
                   ((state.segments[0] && state.segments[0].arr === 'BKK') ? 'Bangkok Suvarnabhumi Airport' :
                   ((state.segments[0] && state.segments[0].arr === 'DXB') ? 'Dubai International Airport' :
                   ((state.segments[0] && state.segments[0].arr === 'IST') ? 'Istanbul Airport' :
                   ((state.segments[0] && state.segments[0].arr === 'LHR') ? 'London Heathrow Airport' : 'Destination Airport'))));

  let paxName = 'MR MD JHONY';
  if(state.passengers && state.passengers.length){
    const p = state.passengers[0];
    const raw = (p.nameDisplay || p.label || '').split('(')[0].trim();
    if(raw.includes('/')){
      const parts = raw.split('/');
      const surname = parts[0].trim();
      const rest = (parts[1] || '').trim();
      paxName = `${rest} ${surname}`.trim();
    } else {
      paxName = raw || 'MR MD JHONY';
    }
  }

  // Finalize state
  state.finalized = true;
  state.ticketed = true;
  state.hasPending = false;
  state.segments.forEach(s => s.status = 'HK');

  const currentOffice = state.officeId || OFFICE_ID;
  const tktDate = state.dateStamp ? state.dateStamp.split('/')[0] : '18JUN26';

  if(state.ticketing && !state.ticketing.includes('/ET')){
    state.ticketing = state.ticketing + '/ET';
  } else if(!state.ticketing){
    state.ticketing = `OK${tktDate}/${currentOffice}/ET`;
  }

  if(!state.tickets) state.tickets = [];
  const tstMatch = (cmd || '').match(/\/T(\d+)/i);
  const issuedTstNum = tstMatch ? parseInt(tstMatch[1], 10) : 1;
  let newTicketFare = Math.round(fareVal * 0.8);
  let newTicketTax = fareVal - newTicketFare;
  if(isExchange && state._exchangeData && state._exchangeData.newBase){
    newTicketFare = state._exchangeData.newBase;
    newTicketTax = state._exchangeData.newTax || (fareVal - newTicketFare);
  } else if(state.tstRecords && state.tstRecords[0] && state.tstRecords[0].fare){
    newTicketFare = state.tstRecords[0].fare;
    newTicketTax = state.tstRecords[0].tax || (fareVal - newTicketFare);
  }

  const newTicketObj = {
    tktNum,
    pax: 'P1',
    name: paxName,
    tstNum: issuedTstNum,
    amount: fareVal,
    fare: newTicketFare,
    tax: newTicketTax,
    alLetter,
    tktDate,
    office: currentOffice,
    status: 'OK',
    originalIssue: (isExchange && oldTkt) ? oldTkt.tktNum : null,
    formOfPayment: state.fop || 'CASH',
    originalFormOfPayment: state._exchangePayment ? state._exchangePayment.originalFop : null,
    additionalCollection: (state._manualExchange && oldTkt) ? (Number.isFinite(state._manualExchange.addCollect) ? state._manualExchange.addCollect : Math.max(0, fareVal - (Number(oldTkt.amount) || 0))) : null,
    remainingValue: fareVal,
    itinerary: (state.segments || []).map(seg => ({ ...seg })),
    // O = open for use.  A flown coupon is stored as F by a flown/reissue
    // workflow and TWD renders it as FLOWN instead of OPEN.
    couponStatuses: (state.segments || []).map(() => 'O'),
    issuedAt: new Date().toISOString()
  };

  const exchangeSummary = isExchange && state._exchangeData ? { ...state._exchangeData } : (isExchange && oldTkt ? {
    oldTkt: oldTkt.tktNum,
    addCollect: state._manualExchange && Number.isFinite(state._manualExchange.addCollect) ? state._manualExchange.addCollect : Math.max(0, fareVal - (Number(oldTkt.amount) || 0)),
    manual: true
  } : null);
  const changePenalty = (state._exchangeData && state._exchangeData.changeFee) || 0;
  let penaltyEMD = null;
  if(isExchange && changePenalty > 0){
    const emdPrefix = alCode;
    const emdNumPart = Math.floor(5000000000 + Math.random() * 9000000000);
    penaltyEMD = `${emdPrefix}-${emdNumPart}`;
    newTicketObj.penaltyEMD = penaltyEMD;
    newTicketObj.changePenalty = changePenalty;
  }

  if(isExchange && oldTkt){
    // Commit the exchange only after every ticketing prerequisite has passed
    // and the replacement ticket has been fully prepared.
    oldTkt.status = 'E';
    oldTkt.couponStatuses = (oldTkt.couponStatuses || (oldTkt.itinerary || []).map(seg => seg.couponStatus || 'O')).map(status => String(status).toUpperCase() === 'F' ? 'F' : 'E');
    oldTkt.exchangedFor = tktNum;
    if(state.segments && state.segments.length > 1){
      const oldDate = (oldTkt.itinerary && oldTkt.itinerary[0] && oldTkt.itinerary[0].date) || oldTkt.tktDate;
      const oldCls = (oldTkt.itinerary && oldTkt.itinerary[0] && oldTkt.itinerary[0].cls) || oldTkt.cls;
      const filtered = state.segments.filter(s => s.date !== oldDate || s.cls !== oldCls);
      if(filtered.length > 0) state.segments = filtered;
    }
    newTicketObj.itinerary = (state.segments || []).map(seg => ({ ...seg }));
    state.tickets.push(newTicketObj);
  } else {
    state.tickets = [newTicketObj];
  }

  state._exchangeMode = false;
  state._foRecorded = null;
  state._exchangeData = null;
  state._manualExchange = null;
  state._exchangePayment = null;

  // Store ticket info in data attributes to avoid JS injection issues in onclick
  const safeId = 'ttp_' + Date.now();
  window._ttpData = window._ttpData || {};
  window._ttpData[safeId] = { paxName, tktNum, fareVal, flightNum, depDate, destName, origTkt: newTicketObj.originalIssue || null, itinerary: newTicketObj.itinerary };
  // Persist the issued-ticket data so RT <locator> followed by ITR can print
  // the receipt later, even after the active workspace has been closed.
  saveCurrentPNR();

  const rowHtml = isExchange ? `
    <div class="ttp-issued-row">
      <span>REISSUED ELECTRONIC TKT GENERATED TTL FARE BDT ${fareVal} (ADD COLLECT BDT ${exchangeSummary ? exchangeSummary.addCollect : 6500}) TICKET NUMBER: ${tktNum} ORIGINAL ISSUE: ${oldTkt ? oldTkt.tktNum : ''}</span>
      <button type="button" class="ttp-inline-print-btn" data-ttp-id="${safeId}">Print Reissued Ticket</button>
    </div>
  ` : `
    <div class="ttp-issued-row">
      <span>ELECTRONIC TKT GENERATED TTL FARE BDT ${fareVal} TICKET NUMBER: ${tktNum} SUPPORTING DOCUMENTS GENERATED</span>
      <button type="button" class="ttp-inline-print-btn" data-ttp-id="${safeId}">Print Ticket</button>
    </div>
  `;
  // TTP/T1 issues the selected TST. /RT additionally redisplays the PNR.
  const emdGenerated = isExchange && Boolean(penaltyEMD);
  const okMsg = emdGenerated ? 'OK ETICKET/EMD' : (isExchange ? 'OK ETICKET' : 'OK PROCESSED');
  if(/\/RT(?:\/|$)/i.test(cmd)){
    printLines([okMsg], 'success');
    renderPNR();
  } else {
    printLines([okMsg], 'success');
  }
  printRaw(rowHtml);
  setTimeout(() => {
    const btn = document.querySelector(`[data-ttp-id="${safeId}"]`);
    if(btn) btn.addEventListener('click', () => {
      const d = window._ttpData[safeId];
      if(d) openTicketModal(d.paxName, d.tktNum, 'BDT ' + d.fareVal, d.flightNum, d.depDate, d.destName, d.origTkt, d.itinerary, { locator: state.locator, fop: state.fop, airlinePnr: (d.itinerary&&d.itinerary[0]?d.itinerary[0].airlineLocator:null), status: 'OK', record: state, tktDate: newTicketObj.tktDate });
    });
  }, 0);
  showToast(`Electronic ticket issued: ${tktNum} — Click Print to view`);
  return;

  // Attach click listener via event delegation (avoids inline JS escaping issues)
  setTimeout(() => {
    const btn = document.querySelector(`[data-ttp-id="${safeId}"]`);
    if(btn){
      btn.addEventListener('click', () => {
        const d = window._ttpData[safeId];
        if(d) openTicketModal(d.paxName, d.tktNum, 'BDT ' + d.fareVal, d.flightNum, d.depDate, d.destName, d.origTkt, d.itinerary, { locator: state.locator, fop: state.fop, status: 'OK' });
      });
    }
  }, 0);

  showToast(`ðŸŽ‰ Electronic Ticket Generated (${tktNum}) — Click Print to view`);
}

function ticketTimeToMinutes(time){
  const match = String(time || '').match(/(\d{2})(\d{2})(\+(\d+))?/);
  if(!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10) + (parseInt(match[4] || '0', 10) * 1440);
}

function formatTransitDuration(arrival, departure){
  const arrivalMinutes = ticketTimeToMinutes(arrival);
  let departureMinutes = ticketTimeToMinutes(departure);
  if(arrivalMinutes === null || departureMinutes === null) return '';
  while(departureMinutes < arrivalMinutes) departureMinutes += 1440;
  const duration = departureMinutes - arrivalMinutes;
  return `${Math.floor(duration / 60)}h ${duration % 60}m`;
}

function formatTicketTime(time){
  const match = String(time || '').match(/^(\d{2})(\d{2})(?:\+(\d+))?$/);
  if(!match) return time || 'Time not provided';
  const dayOffset = parseInt(match[3] || '0', 10);
  return `${match[1]}:${match[2]}${dayOffset ? ` (+${dayOffset} day${dayOffset === 1 ? '' : 's'})` : ''}`;
}

function getAirportTerminal(airportCode, defaultVal){
  if(defaultVal && !String(defaultVal).toLowerCase().includes('not provided')) return defaultVal;
  const code = String(airportCode || '').toUpperCase().trim();
  const TERMINALS = {
    DAC: 'Terminal 2',
    SIN: 'Terminal 1',
    BKK: 'Terminal 1',
    KUL: 'Terminal 1',
    DXB: 'Terminal 3',
    DOH: 'Terminal 1',
    JED: 'Terminal 1',
    RUH: 'Terminal 2',
    LHR: 'Terminal 4',
    IST: 'Main Terminal',
    JFK: 'Terminal 4',
    CGP: 'Domestic',
    ZYL: 'Main Terminal',
    CXB: 'Main Terminal'
  };
  return TERMINALS[code] || 'Terminal 1';
}

function getFlightBaggage(seg, record){
  if(seg && seg.baggage && !String(seg.baggage).toLowerCase().includes('not provided')) return seg.baggage;
  const bagSSRs = (record && record.specialSSRs) ? record.specialSSRs.filter(s => s.type === 'BAGX') : [];
  if(bagSSRs.length){
    return `20 KG (+${bagSSRs[0].value || 'Extra'})`;
  }
  const cls = (seg && seg.cls) ? seg.cls.toUpperCase() : 'Y';
  if(['J','C','D','Z','I'].includes(cls)) return '35 KG (2 PC)';
  if(['F','A','P'].includes(cls)) return '40 KG (2 PC)';
  return '20 KG (1 PC)';
}

function getFlightCabin(seg){
  if(seg && seg.cabin && !String(seg.cabin).toLowerCase().includes('not provided')) return seg.cabin;
  const cls = (seg && seg.cls) ? seg.cls.toUpperCase() : 'Y';
  if(['J','C','D','Z','I'].includes(cls)) return 'Business';
  if(['F','A','P'].includes(cls)) return 'First';
  if(['W','S'].includes(cls)) return 'Premium Economy';
  return 'Economy';
}

function getPassengerPassport(passenger, index, record){
  const paxCode = (passenger && passenger.code) || `P${index + 1}`;
  const docs = (record && Array.isArray(record.docsEntries)) ? record.docsEntries : ((state && Array.isArray(state.docsEntries)) ? state.docsEntries : []);
  const found = docs.find(d => {
    if(d.pax && d.pax.toUpperCase().startsWith(paxCode.toUpperCase())) return true;
    if(d.surname && passenger.label && passenger.label.toUpperCase().includes(d.surname.toUpperCase())) return true;
    return false;
  });
  if(found && found.docNumber) return found.docNumber;
  if(passenger && passenger.passport) return passenger.passport;
  if(record && record.locator === 'ICRBPO') return 'A99887767';
  return '—';
}

function getPassengerFQTV(passenger, index, record){
  const paxCode = (passenger && passenger.code) || `P${index + 1}`;
  const ssrs = (record && Array.isArray(record.specialSSRs)) ? record.specialSSRs : ((state && Array.isArray(state.specialSSRs)) ? state.specialSSRs : []);
  const found = ssrs.find(s => s.type === 'FQTV' && (!s.pax || s.pax.toUpperCase().startsWith(paxCode.toUpperCase())));
  if(found && found.number) return found.number;
  return '—';
}

function getPassengerTicketNum(index, tktNo, record){
  if(record && Array.isArray(record.tickets) && record.tickets[index]){
    return record.tickets[index].tktNum;
  }
  return index === 0 ? tktNo : '—';
}

function renderTicketPassengers(pax, tktNo, pnrData){
  const holder = document.getElementById('tktModalPassengers');
  if(!holder) return;
  const record = (pnrData && pnrData.record) || state || {};
  const passengers = Array.isArray(record.passengers) && record.passengers.length ? record.passengers : [{ label: pax }];
  holder.innerHTML = passengers.map((passenger, index) => {
    const name = passenger.label || passenger.nameDisplay || pax || 'PASSENGER';
    const passport = getPassengerPassport(passenger, index, record);
    const fqtv = getPassengerFQTV(passenger, index, record);
    const tkt = getPassengerTicketNum(index, tktNo, record);
    return `<tr><td><b>${esc(name)}</b></td><td>${esc(passport)}</td><td>${esc(fqtv)}</td><td>${esc(tkt)}</td></tr>`;
  }).join('');
}

function renderTicketItinerary(ticketSegments, pnrData){
  const holder = document.getElementById('tktModalItinerary');
  if(!holder) return;
  const record = (pnrData && pnrData.record) || state || {};
  const segments = Array.isArray(ticketSegments) && ticketSegments.length ? ticketSegments : (record.segments || state.segments || []);
  if(!segments.length){
    holder.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:16px;color:#64748b;">No flight segments available</td></tr>';
    return;
  }
  holder.innerHTML = segments.map((seg, index) => {
    const al = seg.al || 'BG';
    const fn = seg.fn || '555';
    const cls = seg.cls || 'Y';
    const dep = seg.dep || 'DAC';
    const arr = seg.arr || 'SIN';
    const date = seg.date || '25JUL';
    const depT = formatTicketTime(seg.depT || '1659');
    const arrT = formatTicketTime(seg.arrT || '2059');

    const depAirport = typeof AIRPORTS !== 'undefined' && AIRPORTS[dep] ? AIRPORTS[dep].name : dep;
    const arrAirport = typeof AIRPORTS !== 'undefined' && AIRPORTS[arr] ? AIRPORTS[arr].name : arr;

    const depTerm = getAirportTerminal(dep, seg.depTerminal || seg.departureTerminal);
    const arrTerm = getAirportTerminal(arr, seg.arrTerminal || seg.arrivalTerminal);

    const cabin = getFlightCabin(seg);
    const baggage = getFlightBaggage(seg, record);
    const fareBasis = (seg.fareBasis || `${cls}TRAIN`).toUpperCase();

    const info = `Class: <b>${esc(cls)}</b><br>Cabin: ${esc(cabin)}<br>Baggage: <b>${esc(baggage)}</b><br>Fare Basis: ${esc(fareBasis)}`;

    return `<tr>
      <td><b>${esc(al)} ${esc(fn)}</b><br><small style="color:#64748b;">Operating carrier</small></td>
      <td><b>${esc(dep)}</b><br><small style="color:#64748b;">${esc(depAirport)}</small><br><span style="color:#005a9c;font-weight:600;">${esc(depTerm)}</span></td>
      <td><b>${esc(arr)}</b><br><small style="color:#64748b;">${esc(arrAirport)}</small><br><span style="color:#005a9c;font-weight:600;">${esc(arrTerm)}</span></td>
      <td><b>${esc(date)}</b><br>${esc(depT)}</td>
      <td><b>${esc(seg.arrDate || date)}</b><br>${esc(arrT)}</td>
      <td style="font-size:11px;line-height:1.45;">${info}</td>
    </tr>`;
  }).join('');
}

function openTicketModal(pax, tktNo, fare, flight, depDate, dest, origTkt, itinerary, pnrData){
  pnrData = pnrData || {};
  const record = pnrData.record || state || {};

  // GDS PNR
  const pnrEl = document.getElementById('tktModalPNR');
  if(pnrEl) pnrEl.textContent = pnrData.locator || record.locator || state.locator || 'ICRBPO';

  // Airline PNR
  const alPnrEl = document.getElementById('tktModalAirlinePNR');
  if(alPnrEl){
    let alPnr = pnrData.airlinePnr;
    if(!alPnr && Array.isArray(itinerary) && itinerary.length) alPnr = itinerary[0].airlineLocator;
    if(!alPnr && Array.isArray(record.segments) && record.segments.length) alPnr = record.segments[0].airlineLocator || record.segments[0].tktCode;
    alPnrEl.textContent = alPnr || 'XUDL4Y';
  }

  // Issue Date
  const issueDate = document.getElementById('tktModalIssueDate');
  if(issueDate) issueDate.textContent = pnrData.tktDate || (record.tickets && record.tickets[0] && record.tickets[0].tktDate) || record.dateStamp || '17JUN26';

  // Status
  const stEl = document.getElementById('tktModalStatus');
  if(stEl){
    const st = pnrData.status || (record.tickets && record.tickets[0] && record.tickets[0].status) || 'OK';
    const stMap = { 'R': 'REFUNDED', 'E': 'EXCHANGED', 'V': 'VOIDED', 'OK': 'OPEN FOR USE', 'O': 'OPEN FOR USE' };
    const displayStatus = stMap[st] || st;
    stEl.textContent = displayStatus;
    stEl.style.color = (st === 'R' || st === 'V' || st === 'VOIDED' || st === 'REFUNDED') ? '#dc2626' : (st === 'E' || st === 'EXCHANGED' ? '#d97706' : '#16a34a');
  }

  // FOP
  const fopEl = document.getElementById('tktModalFOP');
  if(fopEl) fopEl.textContent = pnrData.fop || record.fop || state.fop || 'INV';

  // Fares
  const totalNum = parseInt(String(fare || '').replace(/\D+/g, ''), 10) || (record.tickets && record.tickets[0] && record.tickets[0].amount) || 30000;
  const baseNum = (record.tickets && record.tickets[0] && record.tickets[0].fare) || Math.round(totalNum * 0.8);
  const taxNum = (record.tickets && record.tickets[0] && record.tickets[0].tax) || (totalNum - baseNum);

  const totalEl = document.getElementById('tktModalFare');
  if(totalEl) totalEl.textContent = `BDT ${totalNum.toLocaleString()}`;
  const baseEl = document.getElementById('tktModalBaseFare');
  if(baseEl) baseEl.textContent = `BDT ${baseNum.toLocaleString()}`;
  const taxEl = document.getElementById('tktModalTaxes');
  if(taxEl) taxEl.textContent = `BDT ${taxNum.toLocaleString()}`;

  renderTicketPassengers(pax, tktNo, pnrData);
  renderTicketItinerary(itinerary, pnrData);

  const card = document.getElementById('ticketModalCard');
  if(card){
    card.scrollTop = 0;
    card.classList.remove('hide-fare-on-print', 'hide-fare-active');
  }
  const hideFare = document.getElementById('tktHideFare');
  if(hideFare){
    hideFare.checked = false;
    hideFare.onchange = function(){
      if(card){
        card.classList.toggle('hide-fare-active', this.checked);
        card.classList.toggle('hide-fare-on-print', this.checked);
      }
    };
  }

  document.getElementById('ticketModalBackdrop').classList.add('show');
}
function closeTicketModal(){
  document.getElementById('ticketModalBackdrop').classList.remove('show');
}

function printTicketFromModal(){
  const card = document.getElementById('ticketModalCard');
  const hideFare = document.getElementById('tktHideFare');
  if(card){
    card.classList.toggle('hide-fare-active', Boolean(hideFare && hideFare.checked));
    card.classList.toggle('hide-fare-on-print', Boolean(hideFare && hideFare.checked));
  }
  window.print();
}

// ---------- ITR — Print an issued e-ticket itinerary receipt (Standard Amadeus GDS) ----------
function handleITR(cmd){
  let ticket = null;
  let matchedPNR = null;

  const lineMatch = cmd.match(/\/L(\d+)/i);
  const tktMatch = cmd.match(/(?:ITR|ITRD|TWD)?(?:\/TKT\s*|\/|\s+)([0-9-]+)/i);
  const requestedTicket = tktMatch ? tktMatch[1].trim() : null;
  const numClean = requestedTicket ? requestedTicket.replace(/-/g, '') : null;

  // 0. Line number selector (e.g. ITR/L6 for original ticket, ITR/L8 for reissued ticket)
  if(lineMatch && state.tickets && state.tickets.length){
    const lNum = parseInt(lineMatch[1], 10);
    if(state.tickets.length > 1){
      if(lNum === 6) ticket = state.tickets[0];
      else if(lNum === 8) ticket = state.tickets[state.tickets.length - 1];
      else ticket = state.tickets[0];
      matchedPNR = state;
    } else {
      ticket = state.tickets[0];
      matchedPNR = state;
    }
  }

  // 1. Current active state tickets
  if(!ticket && state.tickets && state.tickets.length){
    if(requestedTicket){
      ticket = state.tickets.find(t => t.tktNum === requestedTicket || t.tktNum.replace(/-/g, '') === numClean);
    } else {
      ticket = state.tickets[state.tickets.length - 1];
    }
    if(ticket) matchedPNR = state;
  }

  // 2. Saved PNRs in localStorage
  if(!ticket && typeof loadSavedPNRs === 'function'){
    const saved = loadSavedPNRs();
    for(const loc in saved){
      const p = saved[loc];
      if(p && p.tickets && p.tickets.length){
        if(requestedTicket){
          const found = p.tickets.find(t => t.tktNum === requestedTicket || t.tktNum.replace(/-/g, '') === numClean);
          if(found){
            ticket = found;
            matchedPNR = p;
            break;
          }
        } else if(!ticket){
          ticket = p.tickets[p.tickets.length - 1];
          matchedPNR = p;
        }
      }
    }
  }

  // 3. Fallback for demo tickets
  if(!ticket && requestedTicket){
    const is074 = requestedTicket.startsWith('074');
    const isTG = requestedTicket.startsWith('217');
    const al = is074 ? 'TK' : (isTG ? 'TG' : 'BG');
    ticket = {
      tktNum: requestedTicket,
      name: is074 ? 'SHADAT/MD MR' : 'JHONY/MD MR',
      amount: is074 ? 68731 : 30000,
      flightNum: is074 ? '721' : '555',
      originalIssue: null,
      itinerary: [{ al, fn: is074 ? '721' : '555', dep: 'DAC', arr: is074 ? 'IST' : 'SIN', date: '25JUL', fullDate: '2026-07-25' }]
    };
    matchedPNR = { locator: is074 ? 'UQ27GN' : 'ICRBPO' };
  }

  if(!ticket){
    printLines([
      'NO ISSUED ELECTRONIC TICKET IN THIS PNR',
      'RETRIEVE A TICKETED PNR: RT [LOCATOR], OR SPECIFY TICKET: ITR/[TICKET NUMBER]'
    ], 'err');
    return;
  }

  const safeId = 'itr_' + Date.now();
  const itinerary = (ticket.itinerary && ticket.itinerary.length) ? ticket.itinerary : ((matchedPNR && matchedPNR.segments && matchedPNR.segments.length) ? matchedPNR.segments : (state.segments || []));
  const seg = itinerary[0];
  const flightNum = (seg && seg.fn) ? `${seg.al || ''}${seg.fn}` : (ticket.flightNum || '555');
  const depDate = seg ? (seg.fullDate || seg.date || '2026-07-25') : '2026-07-25';
  const destName = (seg && seg.arr === 'SIN') ? 'Singapore Changi Airport' : 
                   ((seg && seg.arr === 'BKK') ? 'Bangkok Suvarnabhumi Airport' :
                   ((seg && seg.arr === 'IST') ? 'Istanbul Airport' :
                   ((seg && seg.arr === 'DXB') ? 'Dubai International Airport' :
                   ((seg && seg.arr === 'LHR') ? 'London Heathrow Airport' : 'Destination Airport'))));

  const isDisplay = /^ITRD/i.test(cmd);
  if(isDisplay){
    const rows = [
      `ITRD`,
      `--- AMADEUS ITINERARY RECEIPT ---`,
      `NAME: ${ticket.name}`,
      `ETKT NBR: ${ticket.tktNum}   LOCATOR: 1A/${matchedPNR.locator || state.locator || 'ICRBPO'}`,
      `DATE OF ISSUE: ${ticket.tktDate || '17JUN26'}   OFFICE: ${state.officeId || OFFICE_ID}`,
      `FROM: DHAKA (DAC)`,
      `TO:   ${destName}`,
      `FLIGHT: ${flightNum}   DATE: ${depDate}   DEP: ${seg ? seg.depT || '1659' : '1659'}   ARR: ${seg ? seg.arrT || '2059' : '2059'}`,
      `STATUS: CONFIRMED (HK1)   BAGS: 25K`,
      `FARE: BDT ${ticket.amount ? Math.round(ticket.amount * 0.8) : 24000}   TAX: BDT ${ticket.amount ? ticket.amount - Math.round(ticket.amount * 0.8) : 6000}   TOTAL: BDT ${ticket.amount || 30000}`,
      `FORM OF PAYMENT: ${ticket.formOfPayment || state.fop || 'INV'}`,
      `NOTICE: CARRIAGE AND OTHER SERVICES ARE SUBJECT TO CONDITIONS OF CARRIAGE`
    ];
    printLines(rows, '');
    return;
  }

  const receiptData = {
    paxName: ticket.name,
    tktNum: ticket.tktNum,
    fareVal: ticket.amount,
    flightNum,
    depDate,
    destName,
    origTkt: ticket.originalIssue || null,
    itinerary
  };
  window._ttpData = window._ttpData || {};
  window._ttpData[safeId] = receiptData;
  printLines([`OK - ETICKET ITINERARY RECEIPT PROCESSED — TICKET ${ticket.tktNum}`], 'success');
  printRaw(`
    <div class="ttp-issued-row">
      <span>AMADEUS ETICKET ITINERARY RECEIPT READY FOR PRINT</span>
      <button type="button" class="ttp-inline-print-btn" data-ttp-id="${safeId}">Print ITR</button>
    </div>
  `);
  // Automatically open the official Itinerary Receipt modal in Selling Platform Connect
  setTimeout(() => {
    openTicketModal(receiptData.paxName, receiptData.tktNum, 'BDT ' + receiptData.fareVal, receiptData.flightNum, receiptData.depDate, receiptData.destName, receiptData.origTkt, receiptData.itinerary, { locator: matchedPNR.locator || state.locator, fop: matchedPNR.fop || state.fop, airlinePnr: (receiptData.itinerary&&receiptData.itinerary[0]?receiptData.itinerary[0].airlineLocator:null), status: ticket.status || 'OK', record: matchedPNR, tktDate: ticket.tktDate });
    const btn = document.querySelector(`[data-ttp-id="${safeId}"]`);
    if(btn) btn.addEventListener('click', () => {
      openTicketModal(receiptData.paxName, receiptData.tktNum, 'BDT ' + receiptData.fareVal, receiptData.flightNum, receiptData.depDate, receiptData.destName, receiptData.origTkt, receiptData.itinerary, { locator: matchedPNR.locator || state.locator, fop: matchedPNR.fop || state.fop, airlinePnr: (receiptData.itinerary&&receiptData.itinerary[0]?receiptData.itinerary[0].airlineLocator:null), status: ticket.status || 'OK', record: matchedPNR, tktDate: ticket.tktDate });
    });
  }, 0);
  showToast(`ITR ready for ticket ${ticket.tktNum}`);
}

// ---------- MEAL HELP & REFERENCE (Screenshot 1 & 2) ----------
function handleMealHelpIndex(){
  const rows = [
    `                     MEAL CODES              EN  16NOV16 0939Z`,
    ``,
    `CODE                                              REFERENCE`,
    `----                                              ---------`,
    `MEAL CODES IN SSR                                 MS 22`,
    `MEAL CODES IN FLIGHT INFORMATION                  MS 64`,
    ``,
    `                                                               >MD`
  ];
  printLines(rows, '');
  showToast(`Meal Codes Index displayed — Enter MS22 to view SSR Meal Codes`);
}

function handleMealCodesSSR(){
  const rows = [
    `                     MEAL CODES              EN  16NOV16 0939Z`,
    ``,
    `MEAL CODES IN SSR`,
    `-----------------`,
    ``,
    `CODE   MEAL DESCRIPTION`,
    `----   ----------------`,
    `AVML   VEGETARIAN HINDU MEAL`,
    `BBML   BABY MEAL`,
    `BLML   BLAND MEAL`,
    `CHML   CHILD MEAL`,
    `CNML   CHICKEN MEAL (LY SPECIFIC)`,
    `DBML   DIABETIC MEAL`,
    `FPML   FRUIT PLATTER MEAL`,
    `GFML   GLUTEN INTOLERANT MEAL`,
    `HNML   HINDU (NON VEGETARIAN) MEAL SPECIFIC`,
    `IVML   INDIAN VEGETARIAN MEAL (UA SPECIFIC)`,
    `JPML   JAPANESE MEAL (LH SPECIFIC)`,
    `KSML   KOSHER MEAL`,
    `LCML   LOW CALORIE MEAL`,
    `LFML   LOW FAT MEAL`,
    `LSML   LOW SALT MEAL`,
    `MOML   MUSLIM MEAL`,
    `NFML   NO FISH MEAL`,
    `NLML   NON-LACTOSE MEAL`,
    `OBML   JAPANESE OBENTO MEAL`,
    `ORML   ORIENTAL MEAL`,
    `RVML   RAW VEGETARIAN MEAL`,
    `SFML   SEA FOOD MEAL`,
    `SPML   SPECIAL MEAL`,
    `VGML   VEGETARIAN VEGAN MEAL`,
    `VLML   VEGETARIAN LACTO-OVO MEAL`,
    `VOML   VEGETARIAN ORIENTAL MEAL`,
    `                                                               >MD`
  ];
  printLines(rows, '');
  showToast(`Meal Codes in SSR displayed — Example: SRMOML/P2 to add Muslim Meal`);
}

function handleMealCodesFlightInfo(){
  const rows = [
    `                     MEAL CODES              EN  16NOV16 0939Z`,
    ``,
    `MEAL CODES IN FLIGHT INFORMATION`,
    `--------------------------------`,
    ``,
    `CODE   MEAL DESCRIPTION`,
    `----   ----------------`,
    `B      BREAKFAST`,
    `L      LUNCH`,
    `D      DINNER`,
    `S      SNACK OR BRUNCH`,
    `M      MEAL (NON-SPECIFIC)`,
    `R      REFRESHMENT`,
    `C      ALCOHOLIC BEVERAGES COMPLIMENTARY`,
    `                                                               >MD`
  ];
  printLines(rows, '');
  showToast(`Flight Information Meal Codes displayed`);
}

// ── Command history: persisted in localStorage across reloads ──
const CMD_HISTORY_KEY = 'amaduce_cmdHistory';
const CMD_HISTORY_MAX = 40;

function loadCmdHistory() {
  try {
    const raw = localStorage.getItem(CMD_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}
function saveCmdHistory(arr) {
  try { localStorage.setItem(CMD_HISTORY_KEY, JSON.stringify(arr)); } catch(e) {}
}

let commandHistory = loadCmdHistory();
let historyPos = commandHistory.length;

// ---------- XE — Delete SSR / DOCS / OSI by line number or SSR type ----------
// Formats:
//   XE10              — delete PNR line number 10
//   XEMOML            — delete all MOML meal requests
//   XECHML            — delete all CHML meal requests
//   XESRDOCS/P1       — delete passport docs for passenger 1
//   XEDOCS/P2         — same shorthand for SRDOCS
function handleXE(cmd){
  const upper = cmd.toUpperCase().trim();
  const body  = upper.replace(/^XE\s*/i, '').trim();

  if(!body){
    printLines([
      'INVALID XE FORMAT. Examples:',
      '  XE10          — Delete line 10 from PNR',
      '  XEMOML        — Delete Muslim Meal SSR',
      '  XECHML        — Delete Child Meal SSR',
      '  XESRDOCS/P1   — Delete passport docs for Passenger 1',
    ], 'err');
    return;
  }

  // ---- Format 1: XE[number] — delete by line number ----
  const lineMatch = body.match(/^(\d+)$/);
  if(lineMatch){
    const lineNum = parseInt(lineMatch[1], 10);
    const lineText = state._lineMap && state._lineMap[lineNum];
    if(lineText){
      // 1. SSR CTCE or CTCM (Contact SSRs)
      if(/^SSR\s+CTC[EM]\b/i.test(lineText)){
        const specialList = state.specialSSRs || [];
        const matchIdx = specialList.findIndex(s => (s.type === 'CTCE' || s.type === 'CTCM') && (lineText.includes(s.value) || specialList.length === 1));
        if(matchIdx !== -1){
          const removed = specialList.splice(matchIdx, 1)[0];
          state.hasPending = true;
          renderPNR();
          printLines([`ELEMENT DELETED - LINE ${lineNum} (SSR ${removed.type})`], 'success');
          showToast(`✕ Line ${lineNum} deleted — Type IR to refresh PNR`);
          return;
        }
      }

      // 2. SSR DOCS
      if(/^SSR\s+DOCS\b/i.test(lineText)){
        const docsList = state.docsEntries || [];
        // Match by exact document number first to avoid deleting wrong line if multiple exist
        let matchIdx = docsList.findIndex(d => d.docNumber && lineText.includes(d.docNumber));
        if(matchIdx === -1){
          matchIdx = docsList.findIndex(d => d.surname && lineText.includes(d.surname));
        }
        if(matchIdx === -1 && docsList.length === 1){
          matchIdx = 0;
        }
        if(matchIdx !== -1){
          const removed = docsList.splice(matchIdx, 1)[0];
          state.hasPending = true;
          renderPNR();
          printLines([`ELEMENT DELETED - LINE ${lineNum} (SSR DOCS)`], 'success');
          showToast(`✕ Line ${lineNum} deleted`);
          return;
        }
      }

      // 3. AP Phone
      if(/^AP\b/i.test(lineText)){
        state.phone = null;
        state.hasPending = true;
        renderPNR();
        printLines([`ELEMENT DELETED - LINE ${lineNum} (AP PHONE)`], 'success');
        showToast(`✕ Phone deleted`);
        return;
      }

      // 4. TK Ticketing
      if(/^TK\b/i.test(lineText)){
        state.ticketing = null;
        state.hasPending = true;
        renderPNR();
        printLines([`ELEMENT DELETED - LINE ${lineNum} (TK)`], 'success');
        showToast(`✕ TK deleted`);
        return;
      }

      // 5. FP Form of payment
      if(/^FP\b/i.test(lineText)){
        state.fop = null;
        state.hasPending = true;
        renderPNR();
        printLines([`ELEMENT DELETED - LINE ${lineNum} (FP)`], 'success');
        showToast(`✕ Form of Payment deleted`);
        return;
      }

      // 6. Generic Meal / Wheelchair / Other SSRs
      if(/^SSR\s+([A-Z]{4})\b/i.test(lineText)){
        const mType = lineText.match(/^SSR\s+([A-Z]{4})\b/i)[1].toUpperCase();
        const specialList = state.specialSSRs || [];
        const matchIdx = specialList.findIndex(s => s.type === mType);
        if(matchIdx !== -1){
          const removed = specialList.splice(matchIdx, 1)[0];
          state.hasPending = true;
          renderPNR();
          printLines([`ELEMENT DELETED - LINE ${lineNum} (SSR ${removed.type})`], 'success');
          showToast(`✕ SSR ${removed.type} deleted`);
          return;
        }
      }

      // 7a. ARNK Surface Segment
      if(lineText === 'ARNK' || /^ARNK\b/i.test(lineText)){
        const arnkIdx = (state.segments || []).findIndex(s => s.isARNK);
        if(arnkIdx !== -1){
          state.segments.splice(arnkIdx, 1);
          state.hasPending = true;
          renderPNR();
          printLines([`ELEMENT DELETED - LINE ${lineNum} (ARNK)`], 'success');
          showToast(`✕ Line ${lineNum} deleted (ARNK)`);
          return;
        }
      }

      // 7b. Open Segment
      if(/^[A-Z0-9]{2}\s+OPEN\b/i.test(lineText)){
        const openIdx = (state.segments || []).findIndex(s => s.isOpen && lineText.includes(s.al));
        if(openIdx !== -1){
          const removed = state.segments.splice(openIdx, 1)[0];
          state.hasPending = true;
          renderPNR();
          printLines([`ELEMENT DELETED - LINE ${lineNum} (OPEN ${removed.al} ${removed.dep}-${removed.arr})`], 'success');
          showToast(`✕ Line ${lineNum} deleted (OPEN)`);
          return;
        }
      }

      // 7. Segments
      const segMatch = lineText.match(/^([A-Z0-9]{2})\s*(\d{1,4})\b/);
      if(segMatch){
        let segIdx = (state.segments || []).findIndex(s => s.al === segMatch[1] && String(s.fn) === segMatch[2] && lineText.includes(s.date));
        if(segIdx === -1){
          segIdx = (state.segments || []).findIndex(s => s.al === segMatch[1] && String(s.fn) === segMatch[2]);
        }
        if(segIdx !== -1){
          const removed = state.segments.splice(segIdx, 1)[0];
          state.hasPending = true;
          if(state.ticketed && state.tickets && state.tickets.length){
            state._exchangeMode = true;
            state._exchangePreTkt = state.tickets[state.tickets.length - 1].tktNum;
          }
          saveCurrentPNRForExchange();
          printLines([`ELEMENT DELETED - LINE ${lineNum} (${removed.al}${removed.fn} ${removed.dep}-${removed.arr})`], 'success');
          showToast(`✕ Segment deleted — Type RT to redisplay PNR`);
          return;
        }
      }

      // 8. Passenger
      const paxIdx = (state.passengers || []).findIndex(p => lineText.includes(p.label.split('(')[0].trim()) || p.label.includes(lineText));
      if(paxIdx !== -1){
        if(state.ticketed || (state.tickets && state.tickets.length)){
          printLines([
            `CANNOT CANCEL PASSENGER — TICKET ALREADY ISSUED (LINE ${lineNum})`,
            'NAME/PASSENGER CANNOT BE CANCELLED ON ISSUED TICKET',
            'USE TRDC TO VOID TICKET (SAME DAY) OR PROCESS TICKET EXCHANGE / REFUND'
          ], 'err');
          showToast('Cannot delete passenger — Ticket already issued', 'warn');
          return;
        }
        const removed = state.passengers.splice(paxIdx, 1)[0];
        state.hasPending = true;
        renderPNR();
        printLines([`ELEMENT DELETED - LINE ${lineNum} (${esc(removed.label.split('(')[0].trim())})`], 'success');
        showToast(`✕ Line ${lineNum} deleted — Type IR to refresh PNR`);
        return;
      }

      // 9. Remarks
      if(/^RM/i.test(lineText)){
        state.remarks = state.remarks || [];
        const rIdx = state.remarks.findIndex(r => lineText.includes(r.text));
        if(rIdx !== -1) state.remarks.splice(rIdx, 1);
        state.hasPending = true;
        renderPNR();
        printLines([`ELEMENT DELETED - LINE ${lineNum} (REMARK)`], 'success');
        showToast(`✕ Remark deleted`);
        return;
      }

      // 10. Ticket lines cannot be deleted with XE
      if(/^F[AB]\s+PAX\b/i.test(lineText)){
        printLines([`CANNOT DELETE TICKET LINE WITH XE — USE TRDC/L1 OR TRDC/TK-... TO VOID TICKET`], 'err');
        return;
      }
    }

    // Fallback if not found in map
    let deleted = false;
    let lineCounter = 1;

    // Passengers
    for(let i = 0; i < state.passengers.length; i++){
      if(lineCounter === lineNum){
        if(state.ticketed || (state.tickets && state.tickets.length)){
          printLines([
            `CANNOT CANCEL PASSENGER — TICKET ALREADY ISSUED (LINE ${lineNum})`,
            'NAME/PASSENGER CANNOT BE CANCELLED ON ISSUED TICKET',
            'USE TRDC TO VOID TICKET (SAME DAY) OR PROCESS TICKET EXCHANGE / REFUND'
          ], 'err');
          showToast('Cannot delete passenger — Ticket already issued', 'warn');
          return;
        }
        const removed = state.passengers.splice(i, 1)[0];
        state.hasPending = true;
        printLines([`ELEMENT DELETED - LINE ${lineNum} (${esc(removed.label.split('(')[0].trim())})`], 'success');
        showToast(`✕ Line ${lineNum} deleted — Type IR to refresh PNR`);
        deleted = true; break;
      }
      lineCounter++;
    }

    // Segments
    if(!deleted){
      for(let i = 0; i < state.segments.length; i++){
        if(lineCounter === lineNum){
          const removed = state.segments.splice(i, 1)[0];
          state.hasPending = true;
          // If a ticket exists, mark this as an exchange operation so SS does not reset state
          if(state.ticketed && state.tickets && state.tickets.length){
            state._exchangeMode = true;
            state._exchangePreTkt = state.tickets[state.tickets.length - 1].tktNum;
          }
          saveCurrentPNRForExchange();
          printLines([`ELEMENT DELETED - LINE ${lineNum} (${removed.al}${removed.fn} ${removed.dep}-${removed.arr})`], 'success');
          showToast(`✕ Segment deleted — Type IR to refresh`);
          deleted = true; break;
        }
        lineCounter++;
      }
    }

    // SSR / Other lines (AP, TK, special SSRs, docs)
    if(!deleted){
      if(state.phone) lineCounter++;
      if(state.ticketing) lineCounter++;
      // SSR lines
      const ssrList = state.specialSSRs || [];
      for(let i = 0; i < ssrList.length; i++){
        if(lineCounter === lineNum){
          const removed = ssrList.splice(i, 1)[0];
          state.hasPending = true;
          printLines([`ELEMENT DELETED - LINE ${lineNum} (SSR ${removed.type}/${removed.pax})`], 'success');
          showToast(`✕ SSR ${removed.type} deleted`);
          deleted = true; break;
        }
        lineCounter++;
      }
    }

    if(!deleted){
      printLines([`LINE ${lineNum} NOT FOUND OR CANNOT BE DELETED IN TRAINING MODE`], 'warn');
    }
    return;
  }

  // ---- Format 2: XE[SSRTYPE] — delete all SSRs of that type ----
  // e.g. XEMOML, XECHML, XEBBML
  const MEAL_CODES = ['MOML','CHML','BBML','BSCT','AVML','BLML','DBML','FPML','GFML','HNML','KSML','LCML','LFML','LSML','NFML','NLML','ORML','RVML','SFML','SPML','VGML','VLML','VOML','WCHR','WCHS','WCHC'];
  const ssrTypeMatch = MEAL_CODES.find(c => body === c || body === 'SSR' + c);
  if(ssrTypeMatch){
    const before = (state.specialSSRs || []).length;
    state.specialSSRs = (state.specialSSRs || []).filter(s => s.type !== ssrTypeMatch);
    const removed = before - state.specialSSRs.length;
    if(removed > 0){
      state.hasPending = true;
      printLines([`SSR ${ssrTypeMatch} DELETED (${removed} entr${removed > 1 ? 'ies' : 'y'} removed) — Type IR to confirm`], 'success');
      showToast(`✕ SSR ${ssrTypeMatch} removed`);
    } else {
      printLines([`NO SSR ${ssrTypeMatch} FOUND IN THIS PNR`], 'warn');
    }
    return;
  }

  // ---- Format 3: XESRDOCS/P1 or XEDOCS/P1 — delete passport docs ----
  const docsMatch = body.match(/^(?:SR)?DOCS\/(P\d+(?:\/INF)?|INF|ALL)$/i);
  if(docsMatch){
    const target = docsMatch[1].toUpperCase();
    const before = (state.docsEntries || []).length;
    if(target === 'ALL'){
      state.docsEntries = [];
    } else {
      state.docsEntries = (state.docsEntries || []).filter(d => d.pax !== target);
    }
    const removed = before - (state.docsEntries || []).length;
    if(removed > 0){
      state.hasPending = true;
      renderPNR();
      printLines([`SSR DOCS DELETED FOR ${target} — Re-enter SRDOCS to add new passport`], 'success');
      showToast(`✕ DOCS deleted for ${target}`);
    } else {
      printLines([`NO DOCS ENTRY FOUND FOR ${target}`], 'warn');
    }
    return;
  }

  // ---- Format 4: XEOSI — delete OSI entries ----
  if(body === 'OSI' || body === 'OSHI' || body.startsWith('OSI')){
    const before = (state.osiEntries || []).length;
    state.osiEntries = [];
    if(before > 0){
      state.hasPending = true;
      printLines([`ALL OSI ENTRIES DELETED (${before} removed)`], 'success');
      showToast('✖ OSI entries deleted');
    } else {
      printLines(['NO OSI ENTRIES TO DELETE'], 'warn');
    }
    return;
  }

  printLines([
    `CANNOT DELETE: ${body}`,
    'Valid formats: XE[lineNo]  |  XE[SSRTYPE]  |  XESRDOCS/P1'
  ], 'err');
}

// ═════════════════════════════════════════════════════════════════════════════
// AMADEUS GDS QUEUE SYSTEM MODULE (QS, QT, QN, QR, QD, QI, QE)
// ═════════════════════════════════════════════════════════════════════════════

function initDefaultQueues(){
  return {
    1: {
      name: "TICKETING TIME LIMIT",
      category: "C0",
      desc: "TICKETING TIME LIMIT (OPW / TKTL)",
      items: [
        {
          id: "Q1-1",
          notice: "TICKETING TIME LIMIT WARNING - ISSUE ELECTRONIC TICKET BEFORE DEADLINE",
          pnr: {
            locator: "W7K9P2",
            officeId: OFFICE_ID,
            agentCode: "SS/GS",
            dateStamp: "18NOV24/1015Z",
            headerLine2: "DACVS3334/18NOV",
            passengers: [
              { type: 'adult', label: "CHOWDHURY/RAFIQ MR", nameDisplay: "CHOWDHURY Rafiq", code: "P1" }
            ],
            segments: [
              { al:"MH", fn:"197", cls:"M", date:"28DEC", day:"6", dep:"DAC", arr:"KUL", status:"HK", count:1, depT:"0050", arrT:"0650", eq:"7M8", tktCode:"MH/W7K9P2", fullDate:"Dec 28, 2026" }
            ],
            phone: "DAC 01711223344 REF BAYEZID",
            ticketing: "TL20NOV/DACVS3334",
            finalized: true,
            hasTST: true,
            fop: "CASH",
            opwRemarks: ["OPW-20NOV:1200/1C1/MH REQUIRES TICKET ON OR BEFORE 20NOV:1200"],
            seats: {},
            specialSSRs: [],
            osiEntries: []
          }
        },
        {
          id: "Q1-2",
          notice: "AUTOMATIC CANCELLATION NOTICE - ISSUE TST (TTP) OR CANCEL SEGMENT",
          pnr: {
            locator: "B4R8T1",
            officeId: OFFICE_ID,
            agentCode: "SS/GS",
            dateStamp: "19NOV24/0830Z",
            passengers: [
              { type: 'adult', label: "HOSSAIN/KAMRUL MR", nameDisplay: "HOSSAIN Kamrul", code: "P1" }
            ],
            segments: [
              { al:"BG", fn:"388", cls:"K", date:"25DEC", day:"5", dep:"DAC", arr:"BKK", status:"HK", count:1, depT:"1145", arrT:"1500", eq:"788", tktCode:"BG/B4R8T1", fullDate:"Dec 25, 2026" }
            ],
            phone: "DAC 01812345678",
            ticketing: "TL21NOV/DACVS3334",
            finalized: true,
            hasTST: true,
            opwRemarks: ["OPW-21NOV:1800/BG CANCELS UNTICKETED SEGMENT AFTER DEADLINE"],
            seats: {},
            specialSSRs: [],
            osiEntries: []
          }
        }
      ]
    },
    2: {
      name: "AIRLINE SCHEDULE CHANGE",
      category: "C0",
      desc: "AIRLINE SCHEDULE CHANGE (SC / UN / TK)",
      items: [
        {
          id: "Q2-1",
          notice: "SCHEDULE CHANGE: TK713 DEPARTURE RETIMED FROM 06:55 TO 07:25 (STATUS: TK) - NOTIFY PASSENGER",
          pnr: {
            locator: "P8L3X9",
            officeId: OFFICE_ID,
            agentCode: "SS/GS",
            dateStamp: "15NOV24/1120Z",
            passengers: [
              { type: 'adult', label: "KHAN/IMRAN MR", nameDisplay: "KHAN Imran", code: "P1" },
              { type: 'adult', label: "KHAN/TANIA MRS", nameDisplay: "KHAN Tania", code: "P2" }
            ],
            segments: [
              { al:"TK", fn:"713", cls:"Y", date:"15JAN", day:"4", dep:"DAC", arr:"IST", status:"TK", count:2, depT:"0725", arrT:"1355", eq:"77W", tktCode:"TK/P8L3X9", fullDate:"Jan 15, 2027" }
            ],
            phone: "DAC 01999887766",
            ticketing: "OK15NOV/DACVS3334",
            finalized: true,
            seats: {},
            specialSSRs: [],
            osiEntries: [
              { al:'TK', text:'SCHEDULE CHANGE RETIMED FROM 0655 TO 0725', pax:'P1' }
            ]
          }
        }
      ]
    },
    3: {
      name: "WAITLIST CONFIRMATION",
      category: "C0",
      desc: "WAITLIST CONFIRMATION (DW -> KL/HK)",
      items: [
        {
          id: "Q3-1",
          notice: "WAITLIST CONFIRMED: MH197 CLASS G IS NOW CONFIRMED (STATUS: KL1) - ACCEPT WITH ER",
          pnr: {
            locator: "M9Q2V5",
            officeId: OFFICE_ID,
            agentCode: "SS/GS",
            dateStamp: "17NOV24/1545Z",
            passengers: [
              { type: 'adult', label: "AHMED/FARUK MR", nameDisplay: "AHMED Faruk", code: "P1" }
            ],
            segments: [
              { al:"MH", fn:"197", cls:"G", date:"12DEC", day:"6", dep:"DAC", arr:"KUL", status:"KL", count:1, depT:"0050", arrT:"0650", eq:"7M8", tktCode:"MH/M9Q2V5", fullDate:"Dec 12, 2026" }
            ],
            phone: "DAC 01777112233",
            ticketing: "TL19NOV/DACVS3334",
            finalized: true,
            seats: {},
            specialSSRs: [],
            osiEntries: [
              { al:'MH', text:'WAITLIST CONFIRMED FROM DW1 TO KL1 - PLEASE CONFIRM WITH AIRLINE OR ER', pax:'P1' }
            ]
          }
        }
      ]
    },
    8: {
      name: "SPECIAL SERVICE REQUEST (SSR)",
      category: "C0",
      desc: "SPECIAL SERVICE REQUEST (SSR CONFIRMED)",
      items: [
        {
          id: "Q8-1",
          notice: "SSR CONFIRMATION: TG CONFIRMED MOML (MUSLIM MEAL) AND WCHR (WHEELCHAIR) STATUS HK1",
          pnr: {
            locator: "S5T1Z4",
            officeId: OFFICE_ID,
            agentCode: "SS/GS",
            dateStamp: "16NOV24/1410Z",
            passengers: [
              { type: 'adult', label: "ISLAM/NAZMA MRS", nameDisplay: "ISLAM Nazma", code: "P1" }
            ],
            segments: [
              { al:"TG", fn:"322", cls:"W", date:"20DEC", day:"7", dep:"DAC", arr:"BKK", status:"HK", count:1, depT:"1335", arrT:"1700", eq:"777", tktCode:"TG/S5T1Z4", fullDate:"Dec 20, 2026" }
            ],
            phone: "DAC 01555443322",
            ticketing: "OK16NOV/DACVS3334",
            finalized: true,
            specialSSRs: [
              { type:'MOML', al:'TG', status:'HK1', allSegs:true, pax:'P1' },
              { type:'WCHR', al:'TG', status:'HK1', text:'WCHR-NONMEDA/UNABLE WALK DISTANCE', pax:'P1' }
            ],
            seats: {},
            osiEntries: []
          }
        }
      ]
    }
  };
}

let officeQueues = initDefaultQueues();
let queueSession = {
  inQueue: false,
  queueNum: null,
  itemIdx: 0
};

function displayQueueSummary(){
  const rows = [];
  const off = state.officeId || OFFICE_ID;
  rows.push(`--- QUEUE SUMMARY ---`);
  rows.push(`OFFICE: ${off}`);
  rows.push(`Q   CAT   ITEMS   DESCRIPTION`);
  let total = 0;
  Object.keys(officeQueues).sort((a,b)=>Number(a)-Number(b)).forEach(qKey => {
    const q = officeQueues[qKey];
    const cnt = q.items ? q.items.length : 0;
    total += cnt;
    const qPad = String(qKey).padStart(2, '0');
    const catPad = (q.category || 'C0').padEnd(5, ' ');
    const cntPad = String(cnt).padStart(5, ' ');
    rows.push(`${qPad}  ${catPad} ${cntPad}   ${q.desc || q.name}`);
  });
  rows.push(``);
  rows.push(`TOTAL QUEUE ITEMS: ${total}`);
  rows.push(`TO ENTER QUEUE: QT[QueueNo] (e.g. QT1, QT2, QT3, QT8)`);
  printLines(rows, '');
  showToast(`Queue Summary: ${total} item(s) pending`);
}

function displayCurrentQueueItem(){
  const q = officeQueues[queueSession.queueNum];
  if(!q || !q.items || !q.items.length){
    printLines([
      `QUEUE ${String(queueSession.queueNum).padStart(2,'0')} CAT 00 IS EMPTY`,
      `USE QI TO EXIT QUEUE MODE OR QS TO VIEW QUEUE SUMMARY`
    ], 'warn');
    queueSession.inQueue = false;
    return;
  }
  if(queueSession.itemIdx >= q.items.length){
    queueSession.itemIdx = 0;
  }
  const item = q.items[queueSession.itemIdx];
  state = JSON.parse(JSON.stringify(item.pnr));
  const currentNum = queueSession.itemIdx + 1;
  const totalNum = q.items.length;
  const qPad = String(queueSession.queueNum).padStart(2, '0');

  const rows = [];
  rows.push(`QUEUE ${qPad} CAT 00 ITEM ${String(currentNum).padStart(3,'0')} OF ${String(totalNum).padStart(3,'0')}`);
  if(item.notice){
    rows.push(`<span class="warn" style="font-weight:bold;">${esc(item.notice)}</span>`);
  }
  printLines(rows, '');
  renderPNR();
  printLines([
    `<span class="muted">[QUEUE ACTIONS: QN = Next PNR | QR = Remove from Queue | QD = Delay | QI = Exit Queue]</span>`
  ], '');
  updateTopPnrInfo();
  showToast(`Queue ${qPad} Item ${currentNum}/${totalNum} (${state.locator})`);
}

function handleQueue(upper, clean, rawCmd){
  // 1. QS or QTE: Queue Summary
  if(clean === 'QS' || clean === 'QTE' || /^QS\b/i.test(upper)){
    return displayQueueSummary();
  }

  // 2. QT: Queue Target
  if(/^QT/i.test(clean)){
    let qNum = null;
    const m = clean.match(/^QT\/?(\d+)/i);
    if(m){
      qNum = parseInt(m[1], 10);
    } else {
      const firstWithItems = Object.keys(officeQueues).sort((a,b)=>Number(a)-Number(b)).find(k => officeQueues[k].items && officeQueues[k].items.length > 0);
      qNum = firstWithItems ? parseInt(firstWithItems, 10) : 1;
    }

    if(!officeQueues[qNum]){
      officeQueues[qNum] = { name: `QUEUE ${qNum}`, category: "C0", desc: `QUEUE ${qNum} ITEMS`, items: [] };
    }

    const q = officeQueues[qNum];
    if(!q.items || !q.items.length){
      printLines([
        `QUEUE ${String(qNum).padStart(2,'0')} CAT 00 IS EMPTY`,
        `NO ITEMS PENDING IN THIS QUEUE. USE QS TO VIEW ACTIVE QUEUES.`
      ], 'warn');
      return;
    }

    queueSession.inQueue = true;
    queueSession.queueNum = qNum;
    queueSession.itemIdx = 0;
    return displayCurrentQueueItem();
  }

  // 3. QN: Queue Next
  if(clean === 'QN'){
    if(!queueSession.inQueue || !queueSession.queueNum){
      printLines(['NOT IN QUEUE MODE — USE QT[Q#] TO ENTER QUEUE (e.g. QT1, QT2)'], 'warn');
      return;
    }
    const q = officeQueues[queueSession.queueNum];
    if(!q || !q.items || !q.items.length){
      printLines([`QUEUE ${String(queueSession.queueNum).padStart(2,'0')} IS EMPTY`], 'warn');
      queueSession.inQueue = false;
      return;
    }
    queueSession.itemIdx++;
    if(queueSession.itemIdx >= q.items.length){
      printLines([
        `END OF QUEUE ${String(queueSession.queueNum).padStart(2,'0')} CAT 00 — ALL ${q.items.length} ITEM(S) PROCESSED`,
        `USE QI TO EXIT QUEUE MODE OR QS TO VIEW QUEUE SUMMARY`
      ], 'warn');
      queueSession.itemIdx = 0;
      return;
    }
    return displayCurrentQueueItem();
  }

  // 4. QR: Queue Remove
  if(clean === 'QR'){
    if(!queueSession.inQueue || !queueSession.queueNum){
      printLines(['NOT IN QUEUE MODE — USE QT[Q#] TO ENTER QUEUE'], 'warn');
      return;
    }
    const q = officeQueues[queueSession.queueNum];
    if(!q || !q.items || !q.items.length){
      printLines([`QUEUE ${String(queueSession.queueNum).padStart(2,'0')} IS EMPTY`], 'warn');
      queueSession.inQueue = false;
      return;
    }
    const removed = q.items.splice(queueSession.itemIdx, 1)[0];
    const loc = (removed && removed.pnr && removed.pnr.locator) || 'PNR';
    printLines([
      `ITEM REMOVED FROM QUEUE ${String(queueSession.queueNum).padStart(2,'0')} (${loc})`
    ], 'warn');
    showToast(`✓ Removed ${loc} from Queue ${queueSession.queueNum}`);

    if(!q.items.length){
      printLines([
        `QUEUE ${String(queueSession.queueNum).padStart(2,'0')} CAT 00 IS NOW EMPTY — EXITING QUEUE MODE`,
        `USE QS TO VIEW OTHER QUEUES`
      ], 'warn');
      queueSession.inQueue = false;
      return;
    }

    if(queueSession.itemIdx >= q.items.length){
      queueSession.itemIdx = 0;
    }
    return displayCurrentQueueItem();
  }

  // 5. QD: Queue Delay
  if(/^QD/i.test(clean)){
    if(!queueSession.inQueue || !queueSession.queueNum){
      printLines(['NOT IN QUEUE MODE'], 'warn');
      return;
    }
    const q = officeQueues[queueSession.queueNum];
    printLines([
      `ITEM DELAYED ON QUEUE ${String(queueSession.queueNum).padStart(2,'0')} — MOVED TO NEXT RECORD`
    ], 'warn');
    if(q && q.items && q.items.length > 1){
      queueSession.itemIdx++;
      if(queueSession.itemIdx >= q.items.length) queueSession.itemIdx = 0;
      return displayCurrentQueueItem();
    } else {
      printLines([`ONLY 1 ITEM IN QUEUE ${String(queueSession.queueNum).padStart(2,'0')}`], 'warn');
    }
    return;
  }

  // 6. QI: Queue Ignore / Exit Queue
  if(clean === 'QI'){
    queueSession.inQueue = false;
    printLines([
      `QUEUE PROCESSING SUSPENDED — WORKSPACE ACTIVE`,
      `USE QS TO RETURN TO QUEUE SUMMARY OR RT TO RETRIEVE ACTIVE PNR`
    ], 'warn');
    showToast('Queue mode exited');
    return;
  }

  // 7. QE: Queue Enter / Place PNR in Queue
  if(/^QE/i.test(clean)){
    if(!state.locator){
      printLines(['NO ACTIVE PNR TO PLACE IN QUEUE — USE RT OR CREATE PNR FIRST'], 'err');
      return;
    }
    let targetQ = 1;
    const parts = upper.split(/\s+/);
    const lastPart = parts[parts.length - 1].replace(/\D/g, '');
    if(lastPart){
      targetQ = parseInt(lastPart, 10);
    }
    if(!officeQueues[targetQ]){
      officeQueues[targetQ] = { name: `QUEUE ${targetQ}`, category: "C0", desc: `QUEUE ${targetQ} ITEMS`, items: [] };
    }
    officeQueues[targetQ].items.push({
      id: `Q${targetQ}-${Date.now()}`,
      notice: `MANUALLY PLACED IN QUEUE ${targetQ} BY AGENT`,
      pnr: JSON.parse(JSON.stringify(state))
    });
    const qPad = String(targetQ).padStart(2, '0');
    printLines([
      `OK - PNR ${state.locator} PLACED ON QUEUE ${qPad} CAT 00`
    ], 'warn');
    showToast(`✓ PNR ${state.locator} queued to Q${qPad}`);
    return;
  }

  printLines([`QUEUE COMMAND NOT RECOGNISED: ${upper}`], 'err');
}


// ── AMADEUS SIGN IN / SIGN OUT (JI / JO) ─────────────────────────
function handleJI(cmd){
  const duty = cmd.includes('/') ? cmd.split('/')[1].trim().toUpperCase() : 'SU';
  const m = cmd.match(/JI\*?([0-9A-Z]+)/i);
  const agent = m ? m[1].toUpperCase() : '1234AA';
  printLines([
    `* SIGN IN COMPLETED - AGENT ${agent} / DUTY ${duty} *`,
    `OFFICE: DACVS3334 / WORK AREA A ACTIVE`,
    `DATE: ${new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'2-digit' }).toUpperCase()}`
  ], 'success');
}

function handleJO(cmd){
  const all = cmd.includes('*');
  printLines([
    all ? `* SIGNED OUT ALL WORK AREAS (A-F) *` : `* SIGNED OUT WORK AREA A *`,
    `THANK YOU FOR USING AMADEUS GDS`
  ], 'muted');
}

// ── AMADEUS ENCODE & DECODE (DAN / DAC / DNA / DNE / DC / DNS) ────
const AMAD_AIRLINES = {
  'EK': { name: 'EMIRATES', num: '176', iso3: 'UAE' },
  'BG': { name: 'BIMAN BANGLADESH AIRLINES', num: '997', iso3: 'BGD' },
  'BS': { name: 'US-BANGLA AIRLINES', num: '787', iso3: 'BGD' },
  '2A': { name: 'AIR ASTRA', num: '992', iso3: 'BGD' },
  'VQ': { name: 'NOVOAIR', num: '788', iso3: 'BGD' },
  'SQ': { name: 'SINGAPORE AIRLINES', num: '618', iso3: 'SGP' },
  'TR': { name: 'SCOOT', num: '668', iso3: 'SGP' },
  'TG': { name: 'THAI AIRWAYS INTERNATIONAL', num: '217', iso3: 'THA' },
  'PG': { name: 'BANGKOK AIRWAYS', num: '829', iso3: 'THA' },
  'FD': { name: 'THAI AIRASIA', num: '843', iso3: 'THA' },
  'QR': { name: 'QATAR AIRWAYS', num: '157', iso3: 'QAT' },
  'SV': { name: 'SAUDI ARABIAN AIRLINES', num: '065', iso3: 'SAU' },
  'XY': { name: 'FLYNAS', num: '593', iso3: 'SAU' },
  'KU': { name: 'KUWAIT AIRWAYS', num: '229', iso3: 'KWT' },
  'J9': { name: 'JAZEERA AIRWAYS', num: '486', iso3: 'KWT' },
  'GF': { name: 'GULF AIR', num: '072', iso3: 'BHR' },
  'WY': { name: 'OMAN AIR', num: '910', iso3: 'OMN' },
  'OV': { name: 'SALAMAIR', num: '519', iso3: 'OMN' },
  'FZ': { name: 'FLYDUBAI', num: '141', iso3: 'UAE' },
  'G9': { name: 'AIR ARABIA', num: '514', iso3: 'UAE' },
  'EY': { name: 'ETIHAD AIRWAYS', num: '607', iso3: 'UAE' },
  'AI': { name: 'AIR INDIA', num: '098', iso3: 'IND' },
  '6E': { name: 'INDIGO', num: '312', iso3: 'IND' },
  'UK': { name: 'VISTARA', num: '228', iso3: 'IND' },
  'MH': { name: 'MALAYSIA AIRLINES', num: '232', iso3: 'MYS' },
  'OD': { name: 'BATIK AIR MALAYSIA', num: '816', iso3: 'MYS' },
  'AK': { name: 'AIRASIA', num: '807', iso3: 'MYS' },
  'UL': { name: 'SRILANKAN AIRLINES', num: '603', iso3: 'LKA' },
  'CX': { name: 'CATHAY PACIFIC', num: '160', iso3: 'HKG' },
  'CZ': { name: 'CHINA SOUTHERN AIRLINES', num: '784', iso3: 'CHN' },
  'MU': { name: 'CHINA EASTERN AIRLINES', num: '781', iso3: 'CHN' },
  'CA': { name: 'AIR CHINA', num: '999', iso3: 'CHN' },
  'TK': { name: 'TURKISH AIRLINES', num: '235', iso3: 'TUR' },
  'BA': { name: 'BRITISH AIRWAYS', num: '125', iso3: 'GBR' },
  'LH': { name: 'LUFTHANSA', num: '220', iso3: 'DEU' },
  'AF': { name: 'AIR FRANCE', num: '057', iso3: 'FRA' },
  'KL': { name: 'KLM ROYAL DUTCH AIRLINES', num: '074', iso3: 'NLD' },
  'MS': { name: 'EGYPTAIR', num: '077', iso3: 'EGY' },
  'ET': { name: 'ETHIOPIAN AIRLINES', num: '071', iso3: 'ETH' },
  'JL': { name: 'JAPAN AIRLINES', num: '131', iso3: 'JPN' },
  'NH': { name: 'ALL NIPPON AIRWAYS', num: '205', iso3: 'JPN' },
  'KE': { name: 'KOREAN AIR', num: '180', iso3: 'KOR' },
  'QF': { name: 'QANTAS AIRWAYS', num: '081', iso3: 'AUS' },
  'AA': { name: 'AMERICAN AIRLINES', num: '001', iso3: 'USA' },
  'UA': { name: 'UNITED AIRLINES', num: '016', iso3: 'USA' },
  'DL': { name: 'DELTA AIR LINES', num: '006', iso3: 'USA' },
  'AC': { name: 'AIR CANADA', num: '014', iso3: 'CAN' },
  'PK': { name: 'PAKISTAN INTERNATIONAL AIRLINES', num: '214', iso3: 'PAK' }
};

const AMAD_EQUIP = {
  '77W': { body: 'W', name: 'BOEING 777-300ER', prop: 'JET', seats: '339-378' },
  '777': { body: 'W', name: 'BOEING 777 ALL SERIES', prop: 'JET', seats: '305-440' },
  '772': { body: 'W', name: 'BOEING 777-200/200ER', prop: 'JET', seats: '305-328' },
  '77L': { body: 'W', name: 'BOEING 777-200LR', prop: 'JET', seats: '238-301' },
  '787': { body: 'W', name: 'BOEING 787 DREAMLINER', prop: 'JET', seats: '242-335' },
  '788': { body: 'W', name: 'BOEING 787-8 DREAMLINER', prop: 'JET', seats: '242-271' },
  '789': { body: 'W', name: 'BOEING 787-9 DREAMLINER', prop: 'JET', seats: '270-298' },
  '78X': { body: 'W', name: 'BOEING 787-10 DREAMLINER', prop: 'JET', seats: '330-337' },
  '737': { body: 'N', name: 'BOEING 737 ALL PASSENGER SERIES', prop: 'JET', seats: '110-189' },
  '738': { body: 'N', name: 'BOEING 737-800', prop: 'JET', seats: '162-189' },
  '73H': { body: 'N', name: 'BOEING 737-800 WINGLETS', prop: 'JET', seats: '162-189' },
  '739': { body: 'N', name: 'BOEING 737-900/900ER', prop: 'JET', seats: '177-215' },
  '7M8': { body: 'N', name: 'BOEING 737 MAX 8', prop: 'JET', seats: '162-189' },
  '7M9': { body: 'N', name: 'BOEING 737 MAX 9', prop: 'JET', seats: '178-220' },
  '744': { body: 'W', name: 'BOEING 747-400', prop: 'JET', seats: '416-524' },
  '748': { body: 'W', name: 'BOEING 747-8I', prop: 'JET', seats: '364-467' },
  '763': { body: 'W', name: 'BOEING 767-300/300ER', prop: 'JET', seats: '218-290' },
  'D11': { body: 'W', name: 'BOEING (DOUGLAS) DC-10-10/15', prop: 'JET', seats: '237-374' },
  'DC3': { body: 'N', name: 'BOEING (DOUGLAS) DC-3', prop: 'PIST', seats: '18- 30' },
  '350': { body: 'W', name: 'AIRBUS A350 ALL SERIES', prop: 'JET', seats: '300-410' },
  '359': { body: 'W', name: 'AIRBUS A350-900', prop: 'JET', seats: '253-325' },
  '351': { body: 'W', name: 'AIRBUS A350-1000', prop: 'JET', seats: '350-410' },
  '380': { body: 'W', name: 'AIRBUS A380 ALL SERIES', prop: 'JET', seats: '489-615' },
  '388': { body: 'W', name: 'AIRBUS A380-800', prop: 'JET', seats: '489-615' },
  '330': { body: 'W', name: 'AIRBUS A330 ALL SERIES', prop: 'JET', seats: '247-335' },
  '332': { body: 'W', name: 'AIRBUS A330-200', prop: 'JET', seats: '247-290' },
  '333': { body: 'W', name: 'AIRBUS A330-300', prop: 'JET', seats: '277-335' },
  '339': { body: 'W', name: 'AIRBUS A330-900NEO', prop: 'JET', seats: '287-336' },
  '320': { body: 'N', name: 'AIRBUS A320', prop: 'JET', seats: '150-180' },
  '321': { body: 'N', name: 'AIRBUS A321', prop: 'JET', seats: '185-220' },
  '32N': { body: 'N', name: 'AIRBUS A320NEO', prop: 'JET', seats: '150-186' },
  '32Q': { body: 'N', name: 'AIRBUS A321NEO', prop: 'JET', seats: '180-240' },
  '319': { body: 'N', name: 'AIRBUS A319', prop: 'JET', seats: '124-156' },
  'AT7': { body: 'N', name: 'ATR 72', prop: 'TURB', seats: '68- 78' },
  'AT4': { body: 'N', name: 'ATR 42', prop: 'TURB', seats: '42- 50' },
  'DH4': { body: 'N', name: 'DE HAVILLAND DASH 8-400', prop: 'TURB', seats: '70- 78' },
  'E90': { body: 'N', name: 'EMBRAER 190', prop: 'JET', seats: '96-114' },
  'CR9': { body: 'N', name: 'BOMBARDIER CRJ900', prop: 'JET', seats: '76- 90' }
};

const AMAD_COUNTRY_DATA = [
  { code: 'BD', name: 'BANGLADESH', region: 'ASIA REGION', tc: 'TC3', cur: 'BDT', curName: 'BANGLADESH TAKA', cit: 'BGD', citName: 'BANGLADESH CITIZEN' },
  { code: 'IN', name: 'INDIA', region: 'ASIA REGION', tc: 'TC3', cur: 'INR', curName: 'INDIAN RUPEE', cit: 'IND', citName: 'INDIA CITIZEN' },
  { code: 'PK', name: 'PAKISTAN', region: 'ASIA REGION', tc: 'TC3', cur: 'PKR', curName: 'PAKISTAN RUPEE', cit: 'PAK', citName: 'PAKISTAN CITIZEN' },
  { code: 'LK', name: 'SRI LANKA', region: 'ASIA REGION', tc: 'TC3', cur: 'LKR', curName: 'SRI LANKA RUPEE', cit: 'LKA', citName: 'SRI LANKA CITIZEN' },
  { code: 'NP', name: 'NEPAL', region: 'ASIA REGION', tc: 'TC3', cur: 'NPR', curName: 'NEPALESE RUPEE', cit: 'NPL', citName: 'NEPAL CITIZEN' },
  { code: 'MV', name: 'MALDIVES', region: 'ASIA REGION', tc: 'TC3', cur: 'MVR', curName: 'MALDIVIAN RUFIYAA', cit: 'MDV', citName: 'MALDIVES CITIZEN' },
  { code: 'TH', name: 'THAILAND', region: 'ASIA REGION', tc: 'TC3', cur: 'THB', curName: 'THAI BAHT', cit: 'THA', citName: 'THAILAND CITIZEN' },
  { code: 'SG', name: 'SINGAPORE', region: 'ASIA REGION', tc: 'TC3', cur: 'SGD', curName: 'SINGAPORE DOLLAR', cit: 'SGP', citName: 'SINGAPORE CITIZEN' },
  { code: 'MY', name: 'MALAYSIA', region: 'ASIA REGION', tc: 'TC3', cur: 'MYR', curName: 'MALAYSIAN RINGGIT', cit: 'MYS', citName: 'MALAYSIA CITIZEN' },
  { code: 'ID', name: 'INDONESIA', region: 'ASIA REGION', tc: 'TC3', cur: 'IDR', curName: 'INDONESIAN RUPIAH', cit: 'IDN', citName: 'INDONESIA CITIZEN' },
  { code: 'PH', name: 'PHILIPPINES', region: 'ASIA REGION', tc: 'TC3', cur: 'PHP', curName: 'PHILIPPINE PESO', cit: 'PHL', citName: 'PHILIPPINES CITIZEN' },
  { code: 'VN', name: 'VIETNAM', region: 'ASIA REGION', tc: 'TC3', cur: 'VND', curName: 'VIETNAMESE DONG', cit: 'VNM', citName: 'VIETNAM CITIZEN' },
  { code: 'CN', name: 'CHINA', region: 'ASIA REGION', tc: 'TC3', cur: 'CNY', curName: 'CHINESE YUAN RENMINBI', cit: 'CHN', citName: 'CHINA CITIZEN' },
  { code: 'HK', name: 'HONG KONG', region: 'ASIA REGION', tc: 'TC3', cur: 'HKD', curName: 'HONG KONG DOLLAR', cit: 'HKG', citName: 'HONG KONG CITIZEN' },
  { code: 'JP', name: 'JAPAN', region: 'ASIA REGION', tc: 'TC3', cur: 'JPY', curName: 'JAPANESE YEN', cit: 'JPN', citName: 'JAPAN CITIZEN' },
  { code: 'KR', name: 'SOUTH KOREA', region: 'ASIA REGION', tc: 'TC3', cur: 'KRW', curName: 'SOUTH KOREAN WON', cit: 'KOR', citName: 'KOREA CITIZEN' },
  { code: 'AU', name: 'AUSTRALIA', region: 'SOUTH WEST PACIFIC', tc: 'TC3', cur: 'AUD', curName: 'AUSTRALIAN DOLLAR', cit: 'AUS', citName: 'AUSTRALIA CITIZEN' },
  { code: 'NZ', name: 'NEW ZEALAND', region: 'SOUTH WEST PACIFIC', tc: 'TC3', cur: 'NZD', curName: 'NEW ZEALAND DOLLAR', cit: 'NZL', citName: 'NEW ZEALAND CITIZEN' },
  { code: 'AE', name: 'UNITED ARAB EMIRATES', region: 'MIDDLE EAST REGION', tc: 'TC2', cur: 'AED', curName: 'UAE DIRHAM', cit: 'ARE', citName: 'UAE CITIZEN' },
  { code: 'SA', name: 'SAUDI ARABIA', region: 'MIDDLE EAST REGION', tc: 'TC2', cur: 'SAR', curName: 'SAUDI RIYAL', cit: 'SAU', citName: 'SAUDI ARABIA CITIZEN' },
  { code: 'QA', name: 'QATAR', region: 'MIDDLE EAST REGION', tc: 'TC2', cur: 'QAR', curName: 'QATARI RIAL', cit: 'QAT', citName: 'QATAR CITIZEN' },
  { code: 'KW', name: 'KUWAIT', region: 'MIDDLE EAST REGION', tc: 'TC2', cur: 'KWD', curName: 'KUWAITI DINAR', cit: 'KWT', citName: 'KUWAIT CITIZEN' },
  { code: 'BH', name: 'BAHRAIN', region: 'MIDDLE EAST REGION', tc: 'TC2', cur: 'BHD', curName: 'BAHRAINI DINAR', cit: 'BHR', citName: 'BAHRAIN CITIZEN' },
  { code: 'OM', name: 'OMAN', region: 'MIDDLE EAST REGION', tc: 'TC2', cur: 'OMR', curName: 'OMANI RIAL', cit: 'OMN', citName: 'OMAN CITIZEN' },
  { code: 'EG', name: 'EGYPT', region: 'AFRICA / MIDDLE EAST', tc: 'TC2', cur: 'EGP', curName: 'EGYPTIAN POUND', cit: 'EGY', citName: 'EGYPT CITIZEN' },
  { code: 'TR', name: 'TURKEY', region: 'EUROPE REGION', tc: 'TC2', cur: 'TRY', curName: 'TURKISH LIRA', cit: 'TUR', citName: 'TURKEY CITIZEN' },
  { code: 'GB', name: 'UNITED KINGDOM', region: 'EUROPE REGION', tc: 'TC2', cur: 'GBP', curName: 'POUND STERLING', cit: 'GBR', citName: 'BRITISH CITIZEN', aliases: ['UK'] },
  { code: 'FR', name: 'FRANCE', region: 'EUROPE REGION', tc: 'TC2', cur: 'EUR', curName: 'EURO', cit: 'FRA', citName: 'FRANCE CITIZEN' },
  { code: 'DE', name: 'GERMANY', region: 'EUROPE REGION', tc: 'TC2', cur: 'EUR', curName: 'EURO', cit: 'DEU', citName: 'GERMANY CITIZEN' },
  { code: 'IT', name: 'ITALY', region: 'EUROPE REGION', tc: 'TC2', cur: 'EUR', curName: 'EURO', cit: 'ITA', citName: 'ITALY CITIZEN' },
  { code: 'ES', name: 'SPAIN', region: 'EUROPE REGION', tc: 'TC2', cur: 'EUR', curName: 'EURO', cit: 'ESP', citName: 'SPAIN CITIZEN' },
  { code: 'NL', name: 'NETHERLANDS', region: 'EUROPE REGION', tc: 'TC2', cur: 'EUR', curName: 'EURO', cit: 'NLD', citName: 'NETHERLANDS CITIZEN' },
  { code: 'CH', name: 'SWITZERLAND', region: 'EUROPE REGION', tc: 'TC2', cur: 'CHF', curName: 'SWISS FRANC', cit: 'CHE', citName: 'SWITZERLAND CITIZEN' },
  { code: 'US', name: 'UNITED STATES', region: 'NORTH AMERICA REGION', tc: 'TC1', cur: 'USD', curName: 'US DOLLAR', cit: 'USA', citName: 'UNITED STATES CITIZEN', aliases: ['USA'] },
  { code: 'CA', name: 'CANADA', region: 'NORTH AMERICA REGION', tc: 'TC1', cur: 'CAD', curName: 'CANADIAN DOLLAR', cit: 'CAN', citName: 'CANADA CITIZEN' }
];

const AMAD_COUNTRIES = {};
AMAD_COUNTRY_DATA.forEach(c => {
  AMAD_COUNTRIES[c.code] = c.name;
  AMAD_COUNTRIES[c.name] = c.code;
  if(c.aliases) c.aliases.forEach(a => { AMAD_COUNTRIES[a] = c.name; });
});

const AMAD_STATES = [
  { code: 'USFL', state: 'FL', name: 'FLORIDA', country: 'UNITED STATES' },
  { code: 'USCA', state: 'CA', name: 'CALIFORNIA', country: 'UNITED STATES' },
  { code: 'USNY', state: 'NY', name: 'NEW YORK', country: 'UNITED STATES' },
  { code: 'USTX', state: 'TX', name: 'TEXAS', country: 'UNITED STATES' },
  { code: 'USIL', state: 'IL', name: 'ILLINOIS', country: 'UNITED STATES' },
  { code: 'USGA', state: 'GA', name: 'GEORGIA', country: 'UNITED STATES' },
  { code: 'USWA', state: 'WA', name: 'WASHINGTON', country: 'UNITED STATES' },
  { code: 'USMA', state: 'MA', name: 'MASSACHUSETTS', country: 'UNITED STATES' },
  { code: 'CAON', state: 'ON', name: 'ONTARIO', country: 'CANADA' },
  { code: 'CAQC', state: 'QC', name: 'QUEBEC', country: 'CANADA' },
  { code: 'CABC', state: 'BC', name: 'BRITISH COLUMBIA', country: 'CANADA' },
  { code: 'CAAB', state: 'AB', name: 'ALBERTA', country: 'CANADA' },
  { code: 'AUNS', state: 'NSW', name: 'NEW SOUTH WALES', country: 'AUSTRALIA' },
  { code: 'AUVI', state: 'VIC', name: 'VICTORIA', country: 'AUSTRALIA' },
  { code: 'AUQL', state: 'QLD', name: 'QUEENSLAND', country: 'AUSTRALIA' }
];

function getCountryIso2(countryName){
  const upper = String(countryName || '').toUpperCase().trim();
  if(!upper) return '';
  if(AMAD_COUNTRIES[upper] && upper.length === 2) return upper;
  const hit = AMAD_COUNTRY_DATA.find(c => c.name === upper || upper.includes(c.name));
  return hit ? hit.code : upper.slice(0, 2);
}

function handleDAN(cmd){
  const q = cmd.replace(/^DAN[\s\/]*/i, '').trim().toUpperCase();
  if(!q){ printLines(['CHECK FORMAT - e.g. DAN DHAKA or DAN/DHAKA'], 'err'); return; }
  const citiesMap = {};
  if(typeof AIRPORTS === 'object'){
    for(const [code, info] of Object.entries(AIRPORTS)){
      const city = (info.city || '').toUpperCase();
      const name = (info.name || '').toUpperCase();
      if(city.includes(q) || name.includes(q) || code === q){
        const iso = info.countryIso || getCountryIso2(info.country);
        if(!citiesMap[city]) citiesMap[city] = { cityCode: code, city, iso, airports: [] };
        citiesMap[city].airports.push({ code, name, iso });
      }
    }
  }
  const cityList = Object.values(citiesMap);
  if(!cityList.length){
    printLines([`DAN ${q}`, `NO LOCATION MATCHING "${q}"`], 'warn');
    return;
  }
  const rows = [
    `DAN ${q}`,
    `A:APT B:BUS C:CITY G:GRD H:HELI O:OFF-PT R:RAIL S:ASSOC TOWN`
  ];
  cityList.slice(0, 6).forEach(entry => {
    rows.push(`${entry.cityCode} C  ${entry.city.padEnd(46, ' ')} /${entry.iso}`);
    entry.airports.slice(0, 4).forEach(ap => {
      rows.push(`    A  ${ap.code} - ${ap.name.padEnd(28, ' ')} -  0K${' '.repeat(14)}/${ap.iso}`);
    });
  });
  printLines(rows, 'success');
}

function handleDAC(cmd){
  const code = cmd.replace(/^DAC[\s\/]*/i, '').trim().toUpperCase();
  if(!code){ printLines(['CHECK FORMAT - e.g. DAC DAC or DAC SIN'], 'err'); return; }
  if(typeof AIRPORTS === 'object' && AIRPORTS[code]){
    const info = AIRPORTS[code];
    const city = (info.city || '').toUpperCase();
    const name = (info.name || '').toUpperCase();
    const country = (info.country || '').toUpperCase();
    const iso = info.countryIso || getCountryIso2(country);
    const sameCity = Object.entries(AIRPORTS).filter(([, v]) => (v.city || '').toUpperCase() === city);
    const rows = [
      `DAC ${code}`,
      `A:APT B:BUS C:CITY G:GRD H:HELI O:OFF-PT R:RAIL S:ASSOC TOWN`,
      `CITY :`,
      `  ${code} C  ${city.padEnd(22, ' ')}/${iso}:${country}`,
      `AIRPORT-HELIPORT :`
    ];
    sameCity.forEach(([apCode, apInfo]) => {
      const apName = (apInfo.name || '').toUpperCase();
      rows.push(`  ${apCode} A  ${apName.padEnd(22, ' ')}/${iso}        -  0K`);
    });
    printLines(rows, 'success');
  } else {
    printLines([`DAC ${code}`, `NO LOCATION MATCHING "${code}"`], 'warn');
  }
}

function handleDNA(cmd){
  const q = cmd.replace(/^DNA[\s\/]*/i, '').trim().toUpperCase();
  if(!q){ printLines(['CHECK FORMAT - e.g. DNA EK, DNA EMIRATES or DNA 176'], 'err'); return; }
  const found = [];
  const qNum = /^\d+$/.test(q) ? q.padStart(3, '0') : null;
  for(const [code, info] of Object.entries(AMAD_AIRLINES)){
    if(info.name.includes(q) || code === q || (qNum && info.num === qNum) || info.num === q){
      found.push(`${code}/${info.iso3 || 'INT'} ${info.num} ${info.name}`);
    }
  }
  if(found.length){
    printLines([`DNA ${q}`, ...found.slice(0, 15)], 'success');
  } else {
    printLines([`DNA ${q}`, `AIRLINE NOT FOUND`], 'warn');
  }
}

function handleDNE(cmd){
  const q = cmd.replace(/^DNE[\s\/]*/i, '').trim().toUpperCase();
  if(!q){ printLines(['CHECK FORMAT - e.g. DNE 77W or DNE BOEING'], 'err'); return; }
  if(AMAD_EQUIP[q]){
    const eq = AMAD_EQUIP[q];
    printLines([
      `DNE ${q}`,
      `${q.padEnd(3, ' ')} ${eq.body} ${eq.name.padEnd(35, ' ')} ${eq.prop.padEnd(4, ' ')} ${eq.seats.padStart(7, ' ')}`
    ], 'success');
    return;
  }
  const matches = [];
  for(const [code, eq] of Object.entries(AMAD_EQUIP)){
    if(eq.name.includes(q) || code.includes(q)){
      matches.push(`${code.padEnd(3, ' ')} ${eq.body} ${eq.name.padEnd(35, ' ')} ${eq.prop.padEnd(4, ' ')} ${eq.seats.padStart(7, ' ')}`);
    }
  }
  if(matches.length){
    printLines([`DNE ${q}`, ...matches.slice(0, 20)], 'success');
    return;
  }
  printLines([`DNE ${q}`, `EQUIPMENT NOT FOUND`], 'warn');
}

function handleDC(cmd){
  const q = cmd.replace(/^DC[\s\/]*/i, '').trim().toUpperCase();
  if(!q){ printLines(['CHECK FORMAT - e.g. DC BD or DC BANGLADESH'], 'err'); return; }
  const hit = AMAD_COUNTRY_DATA.find(c =>
    c.code === q || c.name === q || c.name.includes(q) || (c.aliases && c.aliases.includes(q))
  );
  if(!hit){
    printLines([`DC ${q}`, `COUNTRY NOT FOUND`], 'warn');
    return;
  }
  const rows = [
    `DC ${q}`,
    `${hit.code.padEnd(4, ' ')} ${(`${hit.name}/${hit.region}`).padEnd(32, ' ')} ${hit.tc}`,
    ``,
    `${hit.cur.padEnd(4, ' ')} ${hit.curName.padEnd(32, ' ')} LOCAL`
  ];
  if(hit.cur !== 'USD'){
    rows.push(`USD  ${'US DOLLAR'.padEnd(32, ' ')} INTL PUBLISHED`);
  }
  rows.push('');
  rows.push(`${hit.cit.padEnd(4, ' ')} ${hit.citName}`);
  printLines(rows, 'success');
}

function handleDNS(cmd){
  const q = cmd.replace(/^DNS[\s\/]*/i, '').trim().toUpperCase();
  if(!q){ printLines(['CHECK FORMAT - e.g. DNS FL, DNS USFL or DNS FLORIDA'], 'err'); return; }
  const matches = AMAD_STATES.filter(s => s.code === q || s.state === q || s.name.includes(q));
  if(!matches.length){
    printLines([`DNS ${q}`, `STATE/PROVINCE NOT FOUND`], 'warn');
    return;
  }
  printLines([
    `DNS ${q}`,
    ...matches.map(s => `${s.code}  ${s.name.padEnd(20, ' ')} /${s.country}`)
  ], 'success');
}

function handleDD(cmd){
  const clean = cmd.replace(/^DD[\s\/]*/i, '').trim().toUpperCase();
  if(!clean){
    const now = new Date();
    printLines([
      `DD — CURRENT SYSTEM DATE/TIME`,
      `UTC:   ${now.toUTCString().toUpperCase()}`,
      `LOCAL: ${now.toString().toUpperCase()}`
    ], 'success');
    return;
  }
  const calcMatch = clean.match(/^(\d{1,2}[A-Z]{3})(?:\/([+-]?\d+))?$/);
  if(calcMatch && calcMatch[2]){
    const baseDate = parseFlightDate ? parseFlightDate(calcMatch[1]) : new Date();
    if(baseDate && !isNaN(baseDate.getTime())){
      const days = parseInt(calcMatch[2], 10);
      const res = new Date(baseDate.getTime() + days * 86400000);
      const dayNames = ['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'];
      const monthNames = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      printLines([
        `DD — DATE CALCULATION: ${calcMatch[1]} ${days >= 0 ? '+' : ''}${days} DAYS`,
        `RESULT: ${res.getDate().toString().padStart(2, '0')}${monthNames[res.getMonth()]}${res.getFullYear()} (${dayNames[res.getDay()]})`
      ], 'success');
      return;
    }
  }
  const TIMEZONES = {
    DAC: { city: 'DHAKA', diff: '+6:00', tz: 'Asia/Dhaka' },
    SIN: { city: 'SINGAPORE', diff: '+8:00', tz: 'Asia/Singapore' },
    BKK: { city: 'BANGKOK', diff: '+7:00', tz: 'Asia/Bangkok' },
    KUL: { city: 'KUALA LUMPUR', diff: '+8:00', tz: 'Asia/Kuala_Lumpur' },
    DXB: { city: 'DUBAI', diff: '+4:00', tz: 'Asia/Dubai' },
    DOH: { city: 'DOHA', diff: '+3:00', tz: 'Asia/Qatar' },
    LON: { city: 'LONDON', diff: '+0:00', tz: 'Europe/London' },
    LHR: { city: 'LONDON HEATHROW', diff: '+0:00', tz: 'Europe/London' },
    NYC: { city: 'NEW YORK', diff: '-5:00', tz: 'America/New_York' },
    JFK: { city: 'NEW YORK JFK', diff: '-5:00', tz: 'America/New_York' }
  };
  const cityInfo = TIMEZONES[clean];
  if(cityInfo){
    try {
      const nowStr = new Date().toLocaleTimeString('en-US', { timeZone: cityInfo.tz, hour12: false });
      const dateStr = new Date().toLocaleDateString('en-GB', { timeZone: cityInfo.tz, day:'2-digit', month:'short', year:'2-digit' }).toUpperCase();
      printLines([
        `DD — LOCAL TIME & DATE FOR ${clean} (${cityInfo.city})`,
        `DATE: ${dateStr}   LOCAL TIME: ${nowStr}   TIME ZONE: UTC ${cityInfo.diff}`
      ], 'success');
      return;
    } catch(e){}
  }
  printLines([`DD: TIME/CALCULATION NOT FOUND FOR "${clean}". Try: DD DAC · DD LON · DD 15NOV/10`], 'warn');
}

function handleDO(cmd){
  const clean = cmd.replace(/^DO[\s\/]*/i, '').trim().toUpperCase();

  // Known real-world flights for DO command (not in training PNR)
  // Only these specific flights get full planned info; others → FLIGHT NOT OPERATIONAL
  const KNOWN_REAL_FLIGHTS = {
    'BG584': { al:'BG', fn:'584', dep:'DAC', arr:'SIN', termDep:'2', termArr:'3', depT:'0825', arrT:'1440', eq:'738', dur:'4:15',
                classes:{ Z:0, C:0, J:0, U:0, D:0, Y:0, B:0, E:0, M:0, H:0, W:0 } },
    'SQ447': { al:'SQ', fn:'447', dep:'DAC', arr:'SIN', termDep:'2', termArr:'3', depT:'2355', arrT:'0600+1', eq:'787', dur:'4:05',
                classes:{ Z:0, C:0, J:0, U:0, D:0, Y:0, B:0, E:0, M:0, H:0, W:0, Q:0, N:0, G:0 } },
    'SQ421': { al:'SQ', fn:'421', dep:'DAC', arr:'SIN', termDep:'2', termArr:'3', depT:'0013', arrT:'0615', eq:'787', dur:'4:05',
                classes:{ Z:0, C:0, J:0, U:0, D:0, Y:0, B:0, E:0, M:0, H:0, W:0, Q:0, N:0, G:0 } },
    'BG563': { al:'BG', fn:'563', dep:'DAC', arr:'SIN', termDep:'2', termArr:'3', depT:'1700', arrT:'2100', eq:'738', dur:'4:10',
                classes:{ Y:0, B:0, M:0, K:0, H:0, Q:0, T:0 } },
    'BG022': { al:'BG', fn:'022', dep:'DAC', arr:'DXB', termDep:'1', termArr:'3', depT:'0130', arrT:'0400', eq:'738', dur:'4:30',
                classes:{ Y:0, B:0, M:0, K:0, H:0, Q:0 } },
    'EK582': { al:'EK', fn:'582', dep:'DAC', arr:'DXB', termDep:'1', termArr:'3', depT:'0145', arrT:'0415', eq:'77W', dur:'4:30',
                classes:{ F:0, A:0, J:0, C:0, D:0, Y:0, B:0, E:0, M:0, H:0, W:0 } },
  };

  const renderDOOutput = (seg, al, fn, fnRaw, date) => {
    const dep = seg.dep || 'DAC';
    const arr = seg.arr || 'SIN';
    const depRaw = String(seg.depT || seg.depTime || '1659').replace(':', '');
    const arrRaw = String(seg.arrT || seg.arrTime || '2059').replace(':', '');
    const depHHMM = depRaw.replace(/\+\d+/, '').slice(0, 4);
    const arrPlusMatch = arrRaw.match(/\+(\d+)/);
    const arrPlusDays = arrPlusMatch ? parseInt(arrPlusMatch[1], 10) : 0;
    const arrHHMM = arrRaw.replace(/\+\d+/, '').slice(0, 4);
    const arrSuffix = arrPlusDays > 0 ? `+${arrPlusDays}` : '';

    const dObj = typeof resolveFlightDate === 'function' ? resolveFlightDate(date) : new Date();
    const dayCodes = ['SU','MO','TU','WE','TH','FR','SA'];
    const depDay = dayCodes[dObj.getDay()];
    const arrObj = new Date(dObj.getTime() + arrPlusDays * 86400000);
    const arrDay = dayCodes[arrObj.getDay()];
    const yr2 = String(dObj.getFullYear()).slice(-2);

    const depTermDigit = String(getAirportTerminal(dep, seg.depTerminal || seg.termDep)).replace(/\D+/g, '') || '2';
    const arrTermDigit = String(getAirportTerminal(arr, seg.arrTerminal || seg.termArr)).replace(/\D+/g, '') || '3';
    const eqCode = seg.eq || '738';
    const dur = seg.dur || '4:00';

    // Build class/meal string from classes object or fallback
    const clsKeys = seg.classes
      ? Object.keys(seg.classes).join('')
      : (seg.cls || 'Y') + 'BMHKQL';
    // Split into two rows of max 11 chars each (like Amadeus)
    const row1Cls = clsKeys.slice(0, 11);
    const row2Cls = clsKeys.slice(11);
    const clsRow1 = `${row1Cls}/M`;
    const clsRow2 = row2Cls ? `${row2Cls}/M` : '';

    const isWide = ['787','788','789','777','77W','359','351','333','388'].includes(eqCode);
    const jSeats = isWide ? 36 : 12;
    const ySeats = isWide ? 301 : 150;
    const hasJ = clsKeys.includes('J') || clsKeys.includes('C');

    // Header: *1A PLANNED FLIGHT INFO*  AL  FN   capacity DAY DATEYY
    const fnDisplay = String(fn).padStart(3,' ');
    const hdr = `*1A PLANNED FLIGHT INFO*  ${al}  ${fnDisplay}   240 ${depDay} ${date}${yr2}`;

    // Col widths matching real Amadeus screenshot
    // APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL
    // DAC          2355  SU ZCJUDYBEMHW/M       787        4:05
    //                       QNG/M
    // SIN 0600  MO                                         4:05
    const arrDisplay = `${arrHHMM}${arrSuffix}`;
    const depLine = `${dep.padEnd(3,' ')}          ${depHHMM.padStart(4,' ')}  ${depDay} ${clsRow1.padEnd(21,' ')} ${eqCode.padEnd(4,' ')}       ${dur.padStart(4,' ')}`;
    const arrLine = `${arr.padEnd(3,' ')} ${arrDisplay.padEnd(5,' ')}  ${arrDay}                                         ${dur.padStart(4,' ')}`;

    const lines = [
      `DO${al}${fnRaw}/${date}`,
      hdr,
      `APT ARR   DY DEP   DY CLASS/MEAL          EQP  GRND  EFT   TTL`,
      depLine,
    ];
    if(clsRow2){
      lines.push(`                      ${clsRow2}`);
    }
    lines.push(arrLine);
    lines.push('');
    lines.push(`COMMENTS-`);
    lines.push(` 1.${dep} ${arr}  - DEPARTS TERMINAL ${depTermDigit}`);
    lines.push(` 2.${dep} ${arr}  -   9/ NON-SMOKING`);
    lines.push(` 3.${dep} ${arr}  -  ET/ ELECTRONIC TKT CANDIDATE`);
    lines.push(` 4.${dep} ${arr}  - ${hasJ ? `J${fnDisplay}` : ''}${row1Cls.includes('Y') ? `Y${ySeats}` : ''}`);
    lines.push(` 5.${dep} ${arr}  - CO2/PAX* 187.51 KG ECO, 522.40 KG CLB`);
    lines.push(` (*):SOURCE:ICAO`);
    lines.push('');
    lines.push(`CONFIGURATION-`);
    lines.push(`               ${eqCode.padEnd(4,' ')} ${hasJ ? `J  ${String(jSeats).padEnd(4,' ')} ` : ''}Y ${ySeats}`);

    printLines(lines, 'success');
  };

  // Support segment-number shortcut from active PNR: DO2 or DO 2
  const segNumMatch = clean.match(/^(\d+)$/);
  if(segNumMatch){
    const segNum = parseInt(segNumMatch[1], 10);
    const segs = (state && state.segments) || [];
    const paxCount = (state && state.passengers) ? state.passengers.length : 0;
    const segIdx = (segNum > paxCount && segs[segNum - paxCount - 1]) ? (segNum - paxCount - 1) : (segNum - 1);
    const seg = segs[segIdx];
    if(!seg){
      printLines([`CHECK SEGMENT NUMBER - SEGMENT ${segNum} NOT FOUND`], 'err');
      return;
    }
    const segFn = String(seg.fn || '555');
    return renderDOOutput(seg, seg.al || 'BG', segFn.replace(/^0+/,'') || segFn, segFn, seg.date || '25JUL');
  }

  const m = clean.match(/^([A-Z0-9]{2})\s*(\d+)(?:\/(\d{1,2}[A-Z]{3}))?$/i);
  if(!m){
    printLines(['CHECK FORMAT - e.g. DO BG584/25JUL, DO SQ447/25JUL or DO 2'], 'err');
    return;
  }
  const al = m[1];
  const fn = m[2].replace(/^0+/, '') || m[2];
  const fnPadded = m[2];
  const date = m[3] || '25JUL';

  const matchSeg = (s) => s && String(s.al || '').toUpperCase() === al && (String(s.fn || '') === fnPadded || String(s.fn || '').replace(/^0+/, '') === fn);

  // 1. Check active PNR segments
  let foundSeg = ((state && state.segments) || []).find(matchSeg);

  // 2. Check last AN/SN/TN availability display
  if(!foundSeg && typeof lastANRoute !== 'undefined' && lastANRoute && Array.isArray(lastANRoute.lines)){
    for(const l of lastANRoute.lines){
      foundSeg = (l.segs || []).find(matchSeg);
      if(foundSeg) break;
    }
  }

  // 3. Check known real/training schedules
  if(!foundSeg && typeof getFlightSchedule === 'function'){
    const pairs = [['DAC','SIN'],['SIN','DAC'],['DAC','BKK'],['BKK','DAC'],['DAC','KUL'],['KUL','DAC'],['DAC','DXB'],['DXB','DAC'],['DAC','JED'],['JED','DAC'],['DAC','IST'],['IST','DAC'],['DAC','NRT'],['DAC','JFK']];
    for(const [o, d] of pairs){
      const sched = getFlightSchedule(o, d, date);
      if(sched && Array.isArray(sched.lines)){
        for(const l of sched.lines){
          foundSeg = (l.segs || []).find(matchSeg);
          if(foundSeg) break;
        }
      }
      if(foundSeg) break;
    }
  }

  // 4. Real-world extra flights shown in Amadeus live timetable (e.g. BG 584)
  if(!foundSeg && al === 'BG' && fn === '584'){
    foundSeg = { al:'BG', fn:'584', dep:'DAC', arr:'SIN', termDep:'2', termArr:'3', depT:'0825', arrT:'1440', eq:'738', dur:'4:15', cls:'Y' };
  }

  if(!foundSeg){
    printLines([`DO${al}${fnPadded}/${date}`, `FLIGHT NOT OPERATIONAL`], 'err');
    return;
  }

  return renderDOOutput(foundSeg, al, fn, fnPadded, date);
}

function handleMU(){
  if(pricingMorePageRows && pricingMorePageVisible && pricingPageTwoRows){
    pricingMorePageVisible = false;
    printLines(pricingPageTwoRows, '');
    showToast('Fare quote: page 2 of 3');
    return;
  }
  if(typeof fareRulePages !== 'undefined' && fareRulePages && fareRulePageIndex > 0){
    fareRulePageIndex--;
    printLines(fareRulePages[fareRulePageIndex], '');
    if(typeof showToast === 'function') showToast(`Fare Rules: page ${fareRulePageIndex + 1} of ${fareRulePages.length}`);
    return;
  }
  printLines(['TOP OF DISPLAY'], 'muted');
}

function handleDirectSell(carrier, fltNum, cls, date, orig, dest, seats){
  state.segments = state.segments || [];
  const segNum = state.segments.length + 1;
  const newSeg = {
    num: segNum,
    al: carrier,
    fn: fltNum,
    cls: cls,
    date: date,
    orig: orig,
    dest: dest,
    dep: orig,
    arr: dest,
    from: orig,
    to: dest,
    depTime: '1000',
    arrTime: '1330',
    seats: seats,
    count: seats,
    status: `HK${seats}`
  };
  state.segments.push(newSeg);
  printLines([
    `--- MSC SFP ---`,
    `RP/DACVS3334/`,
    `  ${segNum}  ${carrier} ${fltNum}  ${cls}  ${date}  ${orig}${dest} HK${seats}  1000 1330`
  ], 'success');
}

function runCommand(raw, paneId){
  if (typeof paneId === 'number') activePaneId = paneId;
  const cmd = raw.trim();
  if(!cmd) return;
  commandHistory.push(cmd);
  // Keep only last CMD_HISTORY_MAX entries
  if (commandHistory.length > CMD_HISTORY_MAX) commandHistory.shift();
  saveCmdHistory(commandHistory);
  historyPos = commandHistory.length;
  // Keep a continuous terminal transcript, like the original command page.
  // The input row is replaced separately by mountInput after Enter, while all
  // earlier commands and responses remain available through scrolling.
  printPromptEcho(cmd);
  const upper = cmd.toUpperCase();
  const clean = upper.replace(/\s+/g, '');

  // Sign In & Sign Out — JI / JO
  if(/^JI(\*.*)?$/i.test(upper)) return handleJI(upper);
  if(/^JO\*?$/i.test(upper)) return handleJO(upper);

  // Encode & Decode — DAN / DAC / DNA / DNE / DC / DNS / DD / DO
  if(/^DAN(?:[\s\/].*|[A-Z]{2,})?$/i.test(upper)) return handleDAN(upper);
  if(/^DAC(?:[\s\/].*|[A-Z]{2,})?$/i.test(upper)) return handleDAC(upper);
  if(/^DNA(?:[\s\/].*|[A-Z0-9]{2,})?$/i.test(upper)) return handleDNA(upper);
  if(/^DNE(?:[\s\/].*|[A-Z0-9]{2,})?$/i.test(upper)) return handleDNE(upper);
  if(/^DNS(?:[\s\/].*|[A-Z]{2,})?$/i.test(upper)) return handleDNS(upper);
  if(/^DC(?:[\s\/].*|[A-Z]{2,})?$/i.test(upper)) return handleDC(upper);
  if(/^DD[\s\/]|^DD[A-Z0-9]/i.test(upper) || clean === 'DD') return handleDD(upper);
  if(/^DO[\s\/]|^DO[A-Z0-9]/i.test(upper)) return handleDO(upper);

  // Schedule & Timetable Neutral — SN / TN (date before city pair in real Amadeus)
  if(/^[ST]N/i.test(clean) && clean.length >= 8) return handleSN(upper);

  // Move Up (Page Up) — MU
  if(upper === "MU" || clean === "MU") return handleMU();

  // Reset default test PNR (ICRBPO)
  if(upper === "RESET" || clean === "RESET" || upper === "ICRBPO/RESET" || upper === "RESET/ICRBPO" || upper === "JHONY/RESET"){
    if(typeof removeSavedPNR === 'function') removeSavedPNR('ICRBPO');
    loadJhonyPNR();
    showToast('ICRBPO reset to initial booking state with ticket');
    return;
  }

  if(/^A[ND]/i.test(clean) && clean.length >= 8) return handleAN(upper, clean.startsWith("AD"));
  // Reject SSR prefix — Real Amadeus command is SR (SSR is display-only category)
  if(/^SSR\b/i.test(upper)){
    printLines(['CHECK FORMAT - COMMAND IS SR (NOT SSR)', 'Example: SR CTCM SV HK1-01757208244/P1'], 'err');
    return;
  }
  // SI ARNK / SIARNK / ARNK / 0AA — Surface / ARNK segment for Open Jaw
  if(/^(?:SI\s*)?ARNK$/i.test(clean) || /^SI\s*ARNK/i.test(upper) || clean === '0AA') {
    return handleARNK(upper);
  }

  // SO / 0 ... OPEN — Sell Open Segment (Open Journey / Open Return)
  if(/^SO\s+[A-Z0-9]{2}\s+[A-Z]/i.test(upper) || /^0\s+[A-Z0-9]{2}\s+OPEN\s+[A-Z]/i.test(upper)){
    return handleSO(upper);
  }

  if(/^SS/i.test(clean)) return handleSS(upper);
  // Auto-correct common typo: NMI or NMl (letter I or l instead of number 1)
  if(/^NM[Il]/i.test(upper)){
    upper = upper.replace(/^NM[Il]/i, 'NM1');
    cmd = cmd.replace(/^NM[Il]/i, 'NM1');
  }
  if(/^NM\d+/i.test(upper)) return handleNM(upper);
  if(/^AP\s/i.test(upper)) return handleAP(cmd);
  if(/^TK\s*(TL|OK)/i.test(upper)) return handleTK(upper);
  if(/^FM/i.test(upper)) return handleFM(upper);

  // CTCM / CTCE typed WITHOUT the SR prefix → INVALID FORMAT (real Amadeus rejects these)
  if(/^CTC[ME]-/i.test(clean)){
    printLines(['INVALID FORMAT'], 'err');
    return;
  }

  // RF / Received From and ER / ET End Transaction
  if(/^RF\s*[^;]*\s*;\s*(ER|ET)\s*$/i.test(cmd)) {
    const parts = cmd.split(';');
    const rfVal = parts[0].replace(/^RF\s*/i, '').trim() || 'R';
    state.receivedFrom = rfVal;
    state.rfEntry = rfVal.toUpperCase();
    return handleER();
  }
  if(/^RF/i.test(upper)) {
    return handleRF(cmd);
  }
  if(upper === "ER" || clean === "ER") return handleER();
  if(upper === "ET" || clean === "ET") return handleER();
  // ITR / ITRD / ITR-EML — Print / Display Electronic Ticket Itinerary Receipt
  if(/^ITR(?:D|-EML)?(?:\/.*|\s+.*)?$/i.test(upper)) return handleITR(upper);
  if(/^SIM\/COUPON\/FLOWN\/\d+$/i.test(upper)) return handleSimFlownCoupon(upper);
  if(/^TWD(?:\/.*|\s+.*)?$/i.test(upper)) return handleTWD(upper);
  if(/^TJQ(?:\/.*|\s+.*)?$/i.test(upper)) return handleTJQ(upper);
  if(/^TTK(?:\/.*)?$/i.test(upper)) return handleTTK(upper);
  if(/^FPO(?:\/.*)?$/i.test(upper)) return handleFPO(upper);
  if(upper === "TTE" || clean === "TTE") return handleTTE();
  if(/^TQR(?:\/.*)?$/i.test(upper)) return handleTQR(upper);
  if(/^TQM(?:\/.*)?$/i.test(upper)) return handleTQM(upper);
  if(/^TRFT$/i.test(upper)) return handleTRFT();
  if(/^TRFU\/.+$/i.test(upper)) return handleTRFU(upper);
  if(/^TRF\/OK$/i.test(upper) || /^TRFU$/i.test(upper)) return handleTRFConfirm();
  if(/^TRFP(?:\/FP.*)?$/i.test(upper)) return handleTRFProcess(upper);
  if(/^TRFP?\/CP(?:\s*\d+(?:\.\d{1,2})?[AP]?)?$/i.test(upper)) return handleTRFPenalty(upper);
  if(/^TRF(?:\s+.*|\/.*)?$/i.test(upper)) return handleTRF(upper);
  if(/^TRDC(?:\/.*)?$/i.test(upper)) return handleTRDCVoid(upper);
  if(/^TRFR$/i.test(upper)) return handleTRF('TRFR');
  if(/^SB(?:\s+.*)?$/i.test(upper)) return handleSB(upper);
  if(/^FX[QEIFO]/i.test(clean)) return handleReissueQuote(upper);
  if(/^FO(?:\*|\s+|\d)/i.test(upper)) return handleFO(upper);
  if(upper === "IR" || clean === "IR") return handleIR();
  if(upper === "RL" || clean === "RL" || upper === "RLR" || clean === "RLR") return handleRL();
  if(upper === "MD" || clean === "MD") return handleMD();
  if(/^LPO(?:\/K\(?[0-3]?\d[A-Z]{3}\)?)?$/i.test(upper)) return handleLPO(upper);
  if(/^RT/i.test(upper)) return handleRT(upper);
  if(upper === "XI" || clean === "XI") return handleXI();
  if(upper === "IG" || clean === "IG" || upper === "I" || clean === "I") return handleIG();

  // Queue Processing Commands (QS, QT, QN, QR, QD, QI, QE)
  if(/^(QS|QT|QN|QR|QD|QI|QE)/i.test(clean) || /^(QS|QT|QN|QR|QD|QI|QE)\b/i.test(upper)){
    return handleQueue(upper, clean, cmd);
  }

  // Help & Reference Commands (Screenshot 1 & 2)
  if(/^(HE\/MEAL|HE\s+MEAL|GG\s*MEAL|HELP\s+MEAL|MS\s*21)$/i.test(upper)) return handleMealHelpIndex();
  if(/^MS\s*22$/i.test(upper)) return handleMealCodesSSR();
  if(/^MS\s*64$/i.test(upper)) return handleMealCodesFlightInfo();
  if(/^MS\s*\d+$/i.test(upper)) return handleMealCodesSSR();
  if(/^HE(?:[\s\/].*)?$/i.test(upper)) return handleHelp(upper);

  // ES = Share/Extend PNR to another office — ESDACVS3334-B
  if(/^ES[A-Z0-9]+-[ABR]$/i.test(upper) || /^ES[A-Z0-9]+$/i.test(upper)) return handleES(upper);

  // SRDOCS or SR DOCS - Passport / Travel Document entry (Adult / Child / Infant)
  if(/^SR\s*DOCS/i.test(upper)) return handleSRDOCS(upper, cmd);

  // SRFQTV — Frequent Flyer Number.  Must be tested before the generic SR
  // handler below, otherwise the catch-all swallows it and the dedicated
  // handler is never reached.
  if(/^SR\s*FQTV/i.test(upper)) return handleSRFFN(upper);

  // SRBAGX / SRXBAG / SRABAG — Extra / Excess Baggage SSR (same ordering requirement as SRFQTV)
  if(/^SR\s*(?:BAGX|XBAG|ABAG)/i.test(upper)) return handleSRBAGX(upper);

  // SRWLST — Waitlist SSR (same ordering requirement as SRFQTV)
  if(/^SR\s*WLST/i.test(upper)) return handleSRWLST(upper);

  // SR (all meal and special service requests with or without space: SRMOML/P2, SR MOML/P2, etc.)
  if(/^SR/i.test(upper)) return handleSR(upper);

  // OSI VIP / MEDA / informational notes
  if(/^OSI\s*:?\s+/i.test(upper)) return handleOSI(upper);

  // DM / DM1 — Display Minimum Connecting Time / Transit Time (Screenshot 1)
  if(/^DM\d*/i.test(clean)) return handleDM(upper);

  // FXD / FS — Fare Shop / Master Pricer (original Amadeus fare shopping)
  if(/^FXD/i.test(clean)) return handleFXD(upper, clean);
  if(/^FS(?:[A-Z]{6}|[A-Z]{3}\d{1,2}[A-Z]{3}[A-Z]{3})/i.test(clean)) return handleFS(upper, clean);
  if(/^FX[SZUY]\d+(\/.*)?$/i.test(clean)) return handleFXAction(upper, clean);

  // FXR / FXB / FXP / FXX / FXA — Pricing & TST Creation (Screenshot 2 & 3)
  // FXA is the read-only "no rebook" quote: it reuses the same display but
  // neither rebooks the segments nor stores a TST.
  if(/^FX[RBPAX]/i.test(clean)) return handlePricing(upper);

  // TQ T - Full TST Detail display (matches original Amadeus "tq t" command)
  if(/^TQ\s+T$/i.test(upper)) return handleTQDetail();

  // TQT — Ticket Quote Table / Display TST (Screenshot 3)
  if(/^TQT(\/T\d+)?$/i.test(upper)) return handleTQT(upper);

  // FP CC — Credit Card Payment.  Must be tested before the generic FP
  // catch-all below, which would otherwise store the raw (unmasked) card
  // number and skip the card-type / expiry validation done here.
  if(/^FP\s+CC(VISA|MC|AMEX|DINERS|JCB|DISC)/i.test(upper)) return handleFPCC(upper);

  // FPINV / FP ... — Form of Payment (Screenshot 4)
  if(/^FP\s*/i.test(upper) || /^FPINV/i.test(upper)) return handleFP(cmd);

  // TTP — Issue Electronic Ticket (Issue Entry)
  if(/^TTP(\/\S+)?$/i.test(upper)) return handleTTP(upper);

  // ---------- NAME MODIFY — Two real Amadeus formats ----------
  // Format 1: NU1HAMED/MAHMOUD  (NU + pax number + new name)
  // Format 2: 1/MOUSSA/MAHMOUD  (pax number + / + surname + / + firstname)
  if(/^NU\d+[A-Z]+\/[A-Z ]+/i.test(upper)) return handleNameModify(upper);
  if(/^\d+\/[A-Z]+\/[A-Z ]+/i.test(upper)) return handleNameModify(upper);

  // XE — Delete SSR / DOCS / OSI entry (XE10 or XEMOML or XESRDOCS/P1)
  if(/^XE/i.test(upper)) return handleXE(upper);

  // FQB & FQC — Currency Conversion & Banker's Selling Rates
  if(/^FQB/i.test(clean)) return handleFQB(upper, clean);
  if(/^FQC/i.test(clean)) return handleFQC(upper, clean);

  // FQD — Fare Display. Use this after availability and before booking to
  // inspect fare options and rules.
  if(/^FQD/i.test(clean)) return handleFQD(upper, clean);

  // FQA — Baggage Allowance Display
  if(/^FQA/i.test(clean)) return handleFQA(upper);

  // FXK — Chargeable Ancillary Service Catalogue (Baggage / Seats / Meals)
  if(/^FXK/i.test(clean)) return handleFXK();

  // FQN — Fare Quote Notes / Rules Display (Screenshot 5: FQN1-1//PE, FQN1-1, etc.)
  // Strips accidental backticks like FQN1-1`//PE -> FQN1-1//PE
  const fqnClean = clean.replace(/[`']/g, '');
  if(/^FQN/i.test(fqnClean)) return handleFQN(upper.replace(/[`']/g, ''), fqnClean);

  // FQF — Fare Families Details Display (e.g. FQF1, FQF2, FQF)
  if(/^FQF/i.test(clean)) return handleFQF(upper, clean);


  // RM / RMZ — Free-text and Confidential Remarks
  if(/^RMZ?\s+\S/i.test(upper)) return handleRM(cmd);

  // SP — Split PNR
  if(/^SP\d+/i.test(upper)) return handleSP(upper);

  // GN — Group Name / GS — Group Seat sell
  if(/^GN\s*\d+/i.test(upper)) return handleGN(upper);
  if(/^GS\s*\d+/i.test(upper) || /^GS\s+[A-Z0-9]/i.test(upper)) return handleGS(upper);

  // SM / SMOX — Seat Map Display
  if(/^SM(?:\s*\d+|OX)?(?:\/S\d+)?$/i.test(upper)) return handleSM(upper);

  // ST — Seat Assignment
  if(/^ST\/\d+[A-F](?:\/P\d+)?$/i.test(upper)) return handleST(upper);

  // ── RH / RHA / RHN / RHP / RHS / RHF ── PNR History
  if(/^RH[ANPSFC]?$/i.test(clean) || /^RH\s/i.test(upper)) return handleRH(upper);

  // ── QC / QCA / QC14 / QC/14 ── Queue Count
  if(/^QC(?:A|\d+|\/\d+)?$/i.test(clean)) return handleQC(upper);

  // ── GG ── General Information Pages (AIS)
  if(/^GG/i.test(upper)) return handleGG(upper);

  // ── JD ── Display Sign / Work Area Status (A-F)
  if(clean === 'JD') return handleJD(upper);

  // ── HELP / H ── General help alias (real Amadeus uses HE)
  if(clean === 'HELP' || clean === 'H' || /^HELP\s+/i.test(upper)) return handleHelp(upper);

  printLines([`FORMAT - command not recognised. Try: FXDDAC/D10FEBLHR/D25FEBDAC · FSDACBKK20NOV · FXS1 · FXZ1 · FXR · FXB · RT · RL · HE/MEAL · ER · TQT · TTP`], 'err');
}

// ═══════════════════════════════════════════════════════════════
// RH / RHA / RHN / RHP / RHS / RHF — PNR Modification History
// Real Amadeus: RH = all, RHA = air, RHN = name, RHP = phone, RHS = SSR/OSI, RHF = FOP/TST/TKT
// ═══════════════════════════════════════════════════════════════
function handleRH(cmd){
  const upper = cmd.toUpperCase().replace(/\s+/g, '').trim();
  const mode = upper.replace(/^RH/, '') || 'ALL';
  const now = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const today = `${String(now.getDate()).padStart(2,'0')}${months[now.getMonth()]}${String(now.getFullYear()).slice(-2)}`;
  const time = `${String(now.getHours()).padStart(2,'0')}${String(now.getMinutes()).padStart(2,'0')}Z`;

  if(!state || !state.locator){
    printLines(['NO PNR IN CONTEXT - RETRIEVE PNR FIRST (RT XXXXXX)'], 'err');
    return;
  }

  const officeId = state.officeId || 'DACVS31XW';
  const agentCode = (state.agentCode || 'BP/AS').replace('/','');
  const locator = state.locator || 'ICRBPO';

  const histLines = [];
  histLines.push(`--- RLR ---`);
  histLines.push(`RP/${officeId}/${officeId}         ${state.agentCode||'BP/AS'}  ${state.dateStamp||today+'/'+time}  ${locator}`);
  histLines.push('');
  histLines.push(`RFC ${officeId}`);
  histLines.push('');

  let hIdx = 1;
  const dateStamp = state.dateStamp ? state.dateStamp.split('/')[0] : today;
  const ag = agentCode.split('/').pop() || 'AS';
  const showAll = (mode === 'ALL' || mode === 'C');

  if(showAll){
    histLines.push(`${String(hIdx++).padStart(2)} RF ${ag} ${dateStamp}/${time} - PNR CREATED`);
  }

  if((showAll || mode === 'N') && state.passengers && state.passengers.length){
    state.passengers.forEach(p => {
      histLines.push(`${String(hIdx++).padStart(2)} NM ${ag} ${dateStamp}/${time} - ${(p.label||'').toUpperCase()}`);
    });
  }

  if((showAll || mode === 'A') && state.segments && state.segments.length){
    state.segments.forEach(s => {
      histLines.push(`${String(hIdx++).padStart(2)} SS ${ag} ${dateStamp}/${time} - ${s.al||'BG'}${s.fn||'555'} ${s.cls||'Y'} ${s.date||'25JUL'} ${s.dep||'DAC'}${s.arr||'SIN'} HK${s.count||1}`);
    });
  }

  if((showAll || mode === 'P') && state.phone){
    histLines.push(`${String(hIdx++).padStart(2)} AP ${ag} ${dateStamp}/${time} - ${state.phone}`);
  }

  if(showAll && state.ticketing){
    histLines.push(`${String(hIdx++).padStart(2)} TK ${ag} ${dateStamp}/${time} - ${state.ticketing}`);
  }

  if((showAll || mode === 'S') && state.specialSSRs && state.specialSSRs.length){
    state.specialSSRs.forEach(s => {
      histLines.push(`${String(hIdx++).padStart(2)} SR ${ag} ${dateStamp}/${time} - SSR ${s.type} ${s.al||'BG'} ${s.status||'HK1'} ${s.value||''}`);
    });
  }

  if((showAll || mode === 'S') && state.osiEntries && state.osiEntries.length){
    state.osiEntries.forEach(o => {
      histLines.push(`${String(hIdx++).padStart(2)} OS ${ag} ${dateStamp}/${time} - OSI ${o.al||'YY'} ${o.text||''}`);
    });
  }

  if((showAll || mode === 'F') && state.hasTST){
    histLines.push(`${String(hIdx++).padStart(2)} FX ${ag} ${dateStamp}/${time} - TST CREATED - FXP/FXB`);
  }

  if((showAll || mode === 'F') && state.fop){
    histLines.push(`${String(hIdx++).padStart(2)} FP ${ag} ${dateStamp}/${time} - FP ${state.fop}`);
  }

  if((showAll || mode === 'F') && state.tickets && state.tickets.length){
    state.tickets.forEach(t => {
      const st = t.status === 'V' ? 'VOIDED' : t.status === 'R' ? 'REFUNDED' : 'ISSUED';
      histLines.push(`${String(hIdx++).padStart(2)} TT ${ag} ${dateStamp}/${time} - TKT ${t.tktNum||''} ${st}`);
    });
  }

  if(showAll && state.finalized){
    histLines.push(`${String(hIdx++).padStart(2)} ER ${ag} ${dateStamp}/${time} - PNR SAVED/FILED`);
  }

  histLines.push('');
  histLines.push(hIdx === 1 ? `NO HISTORY ITEMS FOR FILTER RH${mode}` : `END OF HISTORY - ${hIdx-1} ENTRIES`);

  printLines(histLines, 'normal');
}

// ═══════════════════════════════════════════════════════════════
// QC — Queue Count Display (reads live officeQueues state)
// Real Amadeus: QC, QCA, QC14, QC/14
// ═══════════════════════════════════════════════════════════════
function handleQC(cmd){
  const clean = cmd.toUpperCase().replace(/\s+/g, '').trim();
  const officeId = (state && state.officeId) || 'DACVS31XW';
  const activeOnly = clean === 'QCA';
  const qMatch = clean.match(/^QC\/?(\d+)$/);
  const specificQ = qMatch ? parseInt(qMatch[1], 10) : null;

  const queues = (typeof officeQueues === 'object' && officeQueues) ? officeQueues : {};

  if(specificQ !== null){
    const q = queues[specificQ];
    const count = (q && Array.isArray(q.items)) ? q.items.length : 0;
    const desc = (q && q.desc) || `QUEUE ${specificQ}`;
    printLines([
      `QC/${String(specificQ).padStart(2,'0')} - ${officeId}`,
      ``,
      ` Q  CAT   DESCRIPTION                     TOTAL`,
      ` -- ---   ------------------------------  -----`,
      ` ${String(specificQ).padStart(2,'0')} C00   ${desc.padEnd(30,' ')}  ${String(count).padStart(5,' ')}`,
      ``,
      count > 0 ? ` ${count} PNR(S) AWAITING ACTION (USE QT${specificQ} TO PROCESS)` : ` QUEUE IS EMPTY`
    ], 'normal');
    return;
  }

  const rows = [
    `QC${activeOnly ? 'A' : ''} - QUEUE COUNT - ${officeId}`,
    ``,
    ` Q  CAT   DESCRIPTION                     TODAY    TOTAL`,
    ` -- ---   ------------------------------  -----    -----`
  ];
  let totalAll = 0;
  const qKeys = Object.keys(queues).sort((a,b) => Number(a) - Number(b));
  qKeys.forEach(k => {
    const q = queues[k];
    const cnt = (q && Array.isArray(q.items)) ? q.items.length : 0;
    if(activeOnly && cnt === 0) return;
    totalAll += cnt;
    const qPad = String(k).padStart(2, '0');
    const cat = (q.category || 'C0').padEnd(3, ' ');
    const desc = (q.desc || q.name || `QUEUE ${qPad}`).slice(0, 30).padEnd(30, ' ');
    rows.push(` ${qPad} ${cat}   ${desc}  ${String(cnt).padStart(5,' ')}    ${String(cnt).padStart(5,' ')}`);
  });
  rows.push('');
  rows.push(` TOTAL QUEUED PNR(S): ${totalAll}`);
  printLines(rows, 'normal');
}

// ═══════════════════════════════════════════════════════════════
// GG — Amadeus Information System (AIS)
// Real Amadeus: GG NEWS, GG AIR BG, GG AIR TG, GG APT DAC, GG COU BD
// ═══════════════════════════════════════════════════════════════
function handleGG(cmd){
  const upper = cmd.toUpperCase().trim();
  const topic = upper.replace(/^GG\s*/,'').trim();

  if(!topic || topic === 'NEWS'){
    printLines([
      `GG NEWS`,
      ``,
      `  AMADEUS SELLING PLATFORM - TRAINING NEWS`,
      `  ==========================================`,
      ``,
      `  27NOV26 - NOTICE TO ALL AGENTS`,
      `  AMADEUS SYSTEM UPDATE - NDC CONTENT AVAILABLE`,
      `  FOR TG/BG/SQ - PLEASE USE FXB FOR BOOKING`,
      ``,
      `  15NOV26 - BAGGAGE POLICY REMINDER`,
      `  SR BAGX IS NOTIFICATION ONLY - EXTRA BAGGAGE`,
      `  FEES COLLECTED AT AIRPORT CHECK-IN COUNTER`,
      ``,
      `  01NOV26 - COMMAND REFERENCE`,
      `  FQA - BAGGAGE ALLOWANCE DISPLAY`,
      `  FXK - ANCILLARY SERVICES CATALOGUE`,
      `  DD  - DATE/TIME ZONE DISPLAY`,
      `  DO  - FLIGHT OPERATIONAL STATUS`,
      ``,
      `  END OF NEWS - GDS TRAINING HUB`
    ], 'normal');
    return;
  }

  // Airport AIS: GG APT DAC
  const aptMatch = topic.match(/^APT\s+([A-Z]{3})$/);
  if(aptMatch){
    const code = aptMatch[1];
    if(typeof AIRPORTS === 'object' && AIRPORTS[code]){
      const a = AIRPORTS[code];
      printLines([
        `GG APT ${code}`,
        ``,
        `  AIRPORT INFORMATION - ${code}`,
        `  NAME     : ${a.name}`,
        `  CITY     : ${a.city}`,
        `  COUNTRY  : ${a.country} (${a.countryIso || ''})`,
        `  TERMINAL : ${getAirportTerminal(code)}`
      ], 'normal');
      return;
    }
  }

  // Country AIS: GG COU BD
  const couMatch = topic.match(/^COU\s+([A-Z]{2})$/);
  if(couMatch && typeof AMAD_COUNTRIES === 'object' && AMAD_COUNTRIES[couMatch[1]]){
    printLines([
      `GG COU ${couMatch[1]}`,
      ``,
      `  COUNTRY INFORMATION - ${couMatch[1]}`,
      `  NAME : ${AMAD_COUNTRIES[couMatch[1]]}`
    ], 'normal');
    return;
  }

  const AL_NOTICES = {
    BG: ['BIMAN BANGLADESH AIRLINES - AGENT NOTICE',
         '  BAGGAGE: Y CLASS - 20KG CHECKED + 7KG CABIN',
         '  J CLASS - 35KG CHECKED + 10KG CABIN',
         '  CREDIT CARD SURCHARGE: 1.5% ON ALL FARES',
         '  TICKET TIME LIMIT: 24HRS AFTER BOOKING',
         '  CONTACT: SALES@BIMAN-AIRLINES.COM'],
    TG: ['THAI AIRWAYS INTERNATIONAL - AGENT NOTICE',
         '  BAGGAGE: Y/H/M CLASS - 30KG ECONOMY',
         '  C CLASS - 40KG BUSINESS (2 PC)',
         '  F CLASS - 50KG FIRST (3 PC)',
         '  CODESHARE: TG:PG OPERATED BY BANGKOK AIR',
         '  RTSVC: SEE RTSVC FOR ANCILLARY SERVICES'],
    SQ: ['SINGAPORE AIRLINES - AGENT NOTICE',
         '  BAGGAGE: ECONOMY - 30KG / SCOOT 15KG',
         '  BUSINESS - 40KG (2 PC)',
         '  SUITES/FIRST - 50KG (3 PC)',
         '  BOOKING: USE FXP FOR PRICING WITH SSR'],
    EK: ['EMIRATES - AGENT NOTICE',
         '  BAGGAGE: ECONOMY - 25KG / BUSINESS - 35KG / FIRST - 50KG',
         '  ONLINE CHECK-IN: 48HRS BEFORE DEPARTURE',
         '  SPECIAL MEALS: MUST ADD SSR AT LEAST 24HRS PRIOR'],
    QR: ['QATAR AIRWAYS - AGENT NOTICE',
         '  BAGGAGE: ECONOMY - 23KG / BUSINESS - 32KG / FIRST - 50KG',
         '  DOHA TRANSIT: FREE HOTEL AVAILABLE FOR 8+ HRS LAYOVER'],
    PG: ['BANGKOK AIRWAYS - AGENT NOTICE',
         '  OPERATED FLIGHTS UNDER TG CODESHARE',
         '  BAGGAGE: 20KG ECONOMY ALL ROUTES',
         '  BAGGAGE SSR: USE OSI INSTEAD OF SR BAGX',
         '  CONTACT SSR: CTCM/CTCE REQUIRED FOR ALL BOOKINGS']
  };

  const alCode = topic.replace(/^AIR\s+/, '').replace(/NOTICE$/,'').trim();
  if(AL_NOTICES[alCode]){
    printLines([
      `GG ${topic}`,
      ``,
      ...AL_NOTICES[alCode],
      ``,
      `  END OF GG ${topic} - ${new Date().toDateString().toUpperCase()}`
    ], 'normal');
    return;
  }

  printLines([
    `GG ${topic}`,
    ``,
    `  GENERAL INFORMATION - ${topic}`,
    `  NO SPECIFIC NOTICE AVAILABLE`,
    `  TRY: GG NEWS / GG AIR BG / GG AIR TG / GG APT DAC / GG COU BD`
  ], 'normal');
}

// ═══════════════════════════════════════════════════════════════
// SN / TN — Schedule Neutral / Timetable Neutral
// Real Amadeus format: SN25JULDACSIN or SNDACSIN / TN25JULDACSIN or TNDACSIN
// (Date comes BEFORE city pair; SNDACSIN25JUL returns CHECK FORMAT in real Amadeus)
// ═══════════════════════════════════════════════════════════════
function handleSN(cmd){
  const clean = cmd.toUpperCase().replace(/\s+/g, '').trim();
  const validMatch = clean.match(/^(SN|TN)(\d{1,2}[A-Z]{3})?([A-Z]{3})([A-Z]{3})(?:\/([A-Z0-9]+))?$/i);
  if(!validMatch){
    printLines([
      `CHECK FORMAT`,
      `REAL AMADEUS FORMAT: SN25JULDACSIN OR SNDACSIN (DATE BEFORE CITY PAIR)`
    ], 'err');
    return;
  }
  const mode = validMatch[1].toUpperCase();
  const anCmd = clean.replace(/^(SN|TN)/i, 'AN');
  handleAN(anCmd, false, mode);
}

// ═══════════════════════════════════════════════════════════════
// TRDC — Void Issued Ticket (Same Day Only)
// Real Amadeus: TRDC or TRDC/L10 (FA line) or TRDC/TKT-157-...
// ═══════════════════════════════════════════════════════════════
function handleTRDCVoid(cmd){
  const upper = cmd.toUpperCase().trim();

  if(!state || !state.locator){
    printLines(['NO PNR IN CONTEXT - RETRIEVE PNR FIRST'], 'err');
    return;
  }

  if(!state.tickets || !state.tickets.length){
    printLines([
      `DOCUMENT NOT FOUND`,
      `CHECK THE FA/FH LINE OR TICKET NUMBER WITH TWD`
    ], 'err');
    return;
  }

  let targetTicket = null;
  const lineMatch = upper.match(/\/L(\d+)/);
  const tktMatch = upper.match(/\/(?:TKT[-\s]?|TK[-\s]?)([0-9-]{10,})/);

  if(lineMatch){
    const lNum = parseInt(lineMatch[1], 10);
    // In real Amadeus, /L# must point to an FA/FHE line (stored in ticketLineNumbers), NOT an FB line
    if(state.ticketLineNumbers && Object.keys(state.ticketLineNumbers).length){
      const matchedTktNum = state.ticketLineNumbers[String(lNum)];
      if(matchedTktNum){
        targetTicket = state.tickets.find(t => t.tktNum === matchedTktNum);
      }
    } else {
      targetTicket = state.tickets[0];
    }
  } else if(tktMatch){
    const tktNum = tktMatch[1].replace(/-/g,'');
    targetTicket = state.tickets.find(t => (t.tktNum||'').replace(/-/g,'') === tktNum);
  } else {
    targetTicket = state.tickets.find(t => t.status !== 'E') || state.tickets[0];
  }

  if(!targetTicket){
    printLines([
      `DOCUMENT NOT FOUND`,
      `CHECK THE FA/FH LINE OR TICKET NUMBER WITH TWD`
    ], 'err');
    return;
  }

  if(targetTicket.status === 'V'){
    printLines([
      `TICKET ${targetTicket.tktNum} ALREADY VOIDED`,
      `VOID DATE: ${targetTicket.voidedAt || 'SAME DAY'}`
    ], 'err');
    return;
  }

  if(targetTicket.status === 'R'){
    printLines([`TICKET ALREADY REFUNDED - VOID NOT PERMITTED`], 'err');
    return;
  }

  const now = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const voidDate = `${String(now.getMonth()+1).padStart(2,'0')}/${String(now.getDate()).padStart(2,'0')}/${now.getFullYear()}`;
  const voidDateShort = `${String(now.getDate()).padStart(2,'0')}${months[now.getMonth()]}${String(now.getFullYear()).slice(-2)}`;

  targetTicket.status = 'V';
  targetTicket.voidedAt = voidDate;

  const tktNum = targetTicket.tktNum || '157-7800396554421';
  const officeId = state.officeId || 'DACVS31XW';

  printLines([
    `--- TST RLR ---`,
    `RP/${officeId}/${officeId}         ${state.agentCode||'BP/AS'}  ${state.dateStamp||voidDateShort+'/1200Z'}  ${state.locator}`,
    `${state.headerLine2 || officeId+'/4455BP/'+voidDateShort}`,
    ...(state.passengers||[]).map((p,i)=> `${i===0?'1.':'   '}${p.label||''}`),
    ``,
    ` FB PAX 0000000000 TRDC OK VOID/${voidDate}`
  ], 'normal');

  showToast(`Ticket ${tktNum} VOIDED successfully`, 'warn');
}

// ═══════════════════════════════════════════════════════════════
// JD — Display Amadeus Sign / Work Area Status (A-F)
// Real Amadeus: JD shows active work areas, agent sign, office ID, duty code
// ═══════════════════════════════════════════════════════════════
function handleJD(cmd){
  const officeId = (state && state.officeId) || 'DACVS31XW';
  const agentCode = (state && state.agentCode) || 'BP/AS';
  const activeLoc = (state && state.locator) ? `PNR ${state.locator}` : 'NO PNR';
  const now = new Date();
  const timeStr = `${String(now.getUTCHours()).padStart(2,'0')}${String(now.getUTCMinutes()).padStart(2,'0')}Z`;

  printLines([
    `AREA  STATUS     OFFICE     SIGN    DUTY  ACTIVE RECORD   TIME`,
    `----  ---------  ---------  ------  ----  --------------  -----`,
    ` A    ACTIVE     ${officeId.padEnd(9,' ')}  ${agentCode.padEnd(6,' ')}  SU    ${activeLoc.padEnd(14,' ')}  ${timeStr}`,
    ` B    SIGNED IN  ${officeId.padEnd(9,' ')}  ${agentCode.padEnd(6,' ')}  SU    NO PNR          ${timeStr}`,
    ` C    SIGNED OUT`,
    ` D    SIGNED OUT`,
    ` E    SIGNED OUT`,
    ` F    SIGNED OUT`
  ], 'normal');
}

// ═══════════════════════════════════════════════════════════════
// HE / HELP — Amadeus Help System
// ═══════════════════════════════════════════════════════════════
function handleHelp(cmd){
  const upper = cmd.toUpperCase().trim();
  const topic = upper.replace(/^(?:HELP|HE|H)[\s\/]*/,'').trim();

  if(topic === 'BAGGAGE' || topic === 'BAG' || topic === 'BAGX' || topic === 'FQA'){
    printLines([
      `HE BAGGAGE - BAGGAGE COMMANDS`,``,
      ` FQA        - Display baggage allowance for PNR segments`,
      ` FXK        - Ancillary services catalogue (seats, bags)`,
      ` SR BAGX BG HK1-10KG/P1  - Request extra baggage (SSR)`,
      ` SR BAGX BG HK1-1PC/P1   - Request 1 extra piece`,
      ` OS BG PSGR REQUESTS EXTRA BAGGAGE P1 - OSI note`,
      ``,
      ` NOTE: SR BAGX is notification only - fee paid at airport`
    ], 'normal');
    return;
  }

  if(topic === 'TICKET' || topic === 'TKT' || topic === 'TTP' || topic === 'TRDC' || topic === 'FXP'){
    printLines([
      `HE TICKET - TICKETING COMMANDS`,``,
      ` FXP / FXB  - Price PNR and create TST`,
      ` FXR        - Price without storing TST`,
      ` FP INV     - Form of payment (invoice)`,
      ` FP CCVISAMD/26122025  - Credit card payment`,
      ` TTP        - Issue e-ticket (after FXP+FP)`,
      ` TQT        - Display TST (ticket quote)`,
      ` ITR        - Display issued e-ticket receipt`,
      ` TRDC/L10   - VOID issued ticket on FA line (same day only)`,
      ` TRF        - Refund issued ticket`
    ], 'normal');
    return;
  }

  printLines([
    `HE - AMADEUS COMMAND REFERENCE`,
    ``,
    ` AVAILABILITY      AN / SN / TN      AN25JULDACSIN · SN25JULDACSIN`,
    ` BOOKING           SS / ARNK         Sell segment / surface`,
    ` NAMES             NM / NU           Add / modify passenger names`,
    ` CONTACT           AP                Phone / email`,
    ` TICKETING         TK / FXP / TTP    TK entry / price / issue`,
    ` PRICING           FXP/FXB/FXR       Price PNR options`,
    ` TST DISPLAY       TQT               Display ticket quote`,
    ` RECEIPT           ITR               E-ticket receipt`,
    ` VOID              TRDC/L10          Void same-day ticket (FA line)`,
    ` REFUND            TRF               Refund processing`,
    ` SSR               SR MOML/BAGX/DOCS Special service requests`,
    ` DOCS              SR DOCS           Passport entry`,
    ` BAGGAGE           FQA / FXK         Baggage & ancillary`,
    ` QUEUE             QS / QC / QT      Queue count & processing`,
    ` HISTORY           RH / RHA / RHP    PNR modification history`,
    ` INFO              GG NEWS / GG AIR  General information (AIS)`,
    ` SIGN STATUS       JD                Work areas (A-F) sign status`,
    ` DECODE/ENCODE     DAN/DAC/DNA/DNE   Airport/airline/equipment`,
    ` CURRENCY          FQB / FQC         Currency rates`,
    ` FARES             FQD / FQF / FQN   Fare display & rules`,
    ` SEAT MAP          SM / ST           Seat map & assignment`,
    ` SAVE/CANCEL       ER / XI           End & retrieve / cancel`,
    ``,
    ` TYPE: HE BAGGAGE / HE TICKET / HE MEAL for more details`
  ], 'normal');
}

// ---------- Currency Rates & Conversion (FQC / FQB / /R Currency Override) ----------
const AMADEUS_CURRENCIES = {
  USD: { name: 'US DOLLAR', bsr: 122.7100, roe: 1.000000, decimals: 2 },
  EUR: { name: 'EURO', bsr: 133.7540, roe: 0.917424, decimals: 2 },
  GBP: { name: 'BRITISH POUND', bsr: 156.4020, roe: 0.784577, decimals: 2 },
  AED: { name: 'UAE DIRHAM', bsr: 33.4110, roe: 3.673000, decimals: 2 },
  SAR: { name: 'SAUDI RIYAL', bsr: 32.7215, roe: 3.750500, decimals: 2 },
  SGD: { name: 'SINGAPORE DOLLAR', bsr: 92.5030, roe: 1.326550, decimals: 2 },
  MYR: { name: 'MALAYSIAN RINGGIT', bsr: 27.6040, roe: 4.445370, decimals: 2 },
  QAR: { name: 'QATARI RIYAL', bsr: 33.7020, roe: 3.641000, decimals: 2 },
  KWD: { name: 'KUWAITI DINAR', bsr: 399.5010, roe: 0.307158, decimals: 3 },
  CAD: { name: 'CANADIAN DOLLAR', bsr: 89.2040, roe: 1.375610, decimals: 2 },
  AUD: { name: 'AUSTRALIAN DOLLAR', bsr: 80.5010, roe: 1.524328, decimals: 2 },
  INR: { name: 'INDIAN RUPEE', bsr: 1.4520, roe: 84.511019, decimals: 2 },
  THB: { name: 'THAI BAHT', bsr: 3.5510, roe: 34.556463, decimals: 2 },
  JPY: { name: 'JAPANESE YEN', bsr: 0.8120, roe: 151.120690, decimals: 0 },
  CNY: { name: 'CHINESE YUAN', bsr: 16.9030, roe: 7.259658, decimals: 2 },
  TRY: { name: 'TURKISH LIRA', bsr: 3.5200, roe: 34.860795, decimals: 2 },
  CHF: { name: 'SWISS FRANC', bsr: 138.9000, roe: 0.883441, decimals: 2 },
  BDT: { name: 'BANGLADESHI TAKA', bsr: 1.0000, roe: 122.710000, decimals: 2 }
};

function handleFQB(cmd, clean){
  const now = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const date = `${String(now.getDate()).padStart(2, '0')}${months[now.getMonth()]}${String(now.getFullYear()).slice(-2)}`;

  const targetCur = (clean || '').replace(/^FQB\s*/i, '').trim().toUpperCase();
  if(targetCur && AMADEUS_CURRENCIES[targetCur]){
    const info = AMADEUS_CURRENCIES[targetCur];
    printLines([
      `FQB ${targetCur}`,
      `BANKERS SELLING RATE (BSR) FOR ${targetCur} - ${info.name}`,
      `1 ${targetCur} = ${info.bsr.toFixed(4)} BDT  EFFECTIVE ${date}`,
      `ENTER FQC ${targetCur} TO CONVERT OR VIEW FULL EXCHANGE DETAILS`
    ], '');
    showToast(`BSR for ${targetCur}: 1 ${targetCur} = ${info.bsr.toFixed(4)} BDT`);
    return;
  }

  const rates = Object.keys(AMADEUS_CURRENCIES).filter(c => c !== 'BDT').map(c => [c, AMADEUS_CURRENCIES[c].bsr.toFixed(4)]);
  printLines(['FQB', `LIST OF BSR FOR BDT EFF ${date}`, ...rates.map(([currency, rate]) => `1 ${currency} = ${rate.padStart(12, ' ')}  BDT`)], '');
  showToast(`BSR list for BDT displayed — effective ${date}`);
}

function handleFQC(cmd, clean){
  const now = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dateStr = `${String(now.getDate()).padStart(2, '0')}${months[now.getMonth()]}${String(now.getFullYear()).slice(-2)}`;

  const raw = (cmd || '').replace(/^FQC\s*/i, '').trim().toUpperCase();
  if(!raw || /^HELP$/i.test(raw)){
    printLines([
      'FQC — AMADEUS CURRENCY CONVERTER HELP',
      'COMMAND FORMATS:',
      '  FQC 100 USD / BDT        CONVERT SPECIFIC AMOUNT (USD TO BDT)',
      '  FQC 10000 BDT / USD      CONVERT LOCAL TO FOREIGN (BDT TO USD)',
      '  FQC 100 EUR / USD        CROSS CURRENCY CONVERSION (EUR TO USD)',
      '  FQC 100 USD              CONVERT FOREIGN AMOUNT TO LOCAL (BDT)',
      '  FQC USD                  DISPLAY EXCHANGE RATE, BSR & ROE FOR USD',
      '  FQB                      LIST ALL BANKERS SELLING RATES (BSR)',
      '  FQB USD                  DISPLAY BSR SPECIFIC TO USD',
      '  FXP/R,USD                PRICE PNR ITINERARY IN USD',
      '  FQD DACLHR/R,USD         FARE DISPLAY IN USD'
    ], '');
    showToast('FQC: Currency conversion help displayed');
    return;
  }

  // Single currency rate query: FQC USD, FQC EUR, etc.
  if(/^[A-Z]{3}$/.test(raw)){
    const cur = raw;
    const cInfo = AMADEUS_CURRENCIES[cur];
    if(!cInfo){
      printLines([`FQC ${cur}`, `INVALID CURRENCY CODE — TRY: USD, EUR, GBP, SAR, AED, SGD, MYR, KWD, BDT`], 'err');
      return;
    }
    const inv = cInfo.bsr > 0 ? (1 / cInfo.bsr).toFixed(6) : '0.000000';
    printLines([
      `FQC ${cur}`,
      `CURRENCY: ${cur} - ${cInfo.name}`,
      `1 ${cur} = ${cInfo.bsr.toFixed(4)} BDT   BSR - BANKERS SELLING RATE`,
      `1 BDT = ${inv} ${cur}   INVERSE RATE`,
      `EFF DATE: ${dateStr}   IROE: ${cInfo.roe.toFixed(6)} NUC`
    ], '');
    showToast(`Exchange rate for ${cur}: 1 ${cur} = ${cInfo.bsr.toFixed(4)} BDT`);
    return;
  }

  // Conversion: amount + currency + optional target currency
  // Examples: 100 USD / BDT | 100USD/BDT | 100 USD BDT | 100 USD | 10000 BDT
  const m = raw.match(/^([0-9.,]+)\s*([A-Z]{3})(?:\s*[\/ ]\s*([A-Z]{3}))?$/i);
  if(!m){
    printLines([
      `FQC ${raw}`,
      'FORMAT NOT RECOGNISED. FORMAT EXAMPLES:',
      '  FQC 100 USD / BDT',
      '  FQC 10000 BDT / USD',
      '  FQC 100 USD',
      '  FQC USD'
    ], 'err');
    return;
  }

  const amount = parseFloat(m[1].replace(/,/g, ''));
  const fromCur = m[2].toUpperCase();
  let toCur = m[3] ? m[3].toUpperCase() : (fromCur === 'BDT' ? 'USD' : 'BDT');

  if(isNaN(amount) || amount <= 0){
    printLines(['INVALID AMOUNT FOR CURRENCY CONVERSION'], 'err');
    return;
  }

  const fromInfo = AMADEUS_CURRENCIES[fromCur];
  const toInfo = AMADEUS_CURRENCIES[toCur];

  if(!fromInfo){
    printLines([`UNKNOWN CURRENCY CODE: ${fromCur}`], 'err');
    return;
  }
  if(!toInfo){
    printLines([`UNKNOWN CURRENCY CODE: ${toCur}`], 'err');
    return;
  }

  const rateRatio = fromInfo.bsr / toInfo.bsr;
  const converted = amount * rateRatio;
  const dec = toInfo.decimals !== undefined ? toInfo.decimals : 2;
  const formattedConverted = Number(converted.toFixed(dec)).toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  const formattedAmount = Number(amount.toFixed(fromInfo.decimals !== undefined ? fromInfo.decimals : 2)).toLocaleString('en-US', { minimumFractionDigits: fromInfo.decimals !== undefined ? fromInfo.decimals : 2 });

  const rows = [
    `FQC ${formattedAmount} ${fromCur} / ${toCur}`,
    `${formattedAmount} ${fromCur} = ${formattedConverted} ${toCur}`
  ];

  if(fromCur === 'USD' || toCur === 'USD'){
    rows.push(`BSR  1 USD = 122.7100 BDT     EFF ${dateStr}`);
    rows.push(`IROE 1 USD = 1.000000 NUC`);
  } else if(toCur === 'BDT'){
    rows.push(`BSR  1 ${fromCur} = ${fromInfo.bsr.toFixed(4)} BDT     EFF ${dateStr}`);
  } else if(fromCur === 'BDT'){
    rows.push(`BSR  1 ${toCur} = ${toInfo.bsr.toFixed(4)} BDT     EFF ${dateStr}`);
  } else {
    rows.push(`RATE 1 ${fromCur} = ${rateRatio.toFixed(6)} ${toCur}     EFF ${dateStr}`);
    rows.push(`BSR  1 ${fromCur} = ${fromInfo.bsr.toFixed(4)} BDT   1 ${toCur} = ${toInfo.bsr.toFixed(4)} BDT`);
  }

  printLines(rows, '');
  showToast(`${formattedAmount} ${fromCur} = ${formattedConverted} ${toCur}`);
}

function handleFQD(cmd, clean){
  // Examples: FQDDACLHR/D12DEC  |  FQDDACKUL/D12NOV  |  FQDDACLHR/R,USD
  const m = clean.match(/^FQD([A-Z]{3})([A-Z]{3})(?:\/D?(\d{1,2}[A-Z]{3}))?(?:\/R,([A-Z]{3}))?$/i);
  if(!m){
    printLines([
      'INVALID FARE DISPLAY FORMAT',
      'Examples:',
      '  FQDDACLHR/D12DEC',
      '  FQDDACKUL/D12NOV',
      '  FQDDACLHR/R,USD'
    ], 'err');
    return;
  }
  state.hasPricingRequest = true;
  const [, orig, dest, dateInput, curInput] = m;
  const date = (dateInput || '12DEC').toUpperCase();
  const reqCur = curInput ? curInput.toUpperCase() : 'BDT';
  const cInfo = AMADEUS_CURRENCIES[reqCur] || AMADEUS_CURRENCIES.BDT;
  const curRate = cInfo.bsr;
  const route = `${orig}-${dest}`;
  const base = (orig === 'DAC' && dest === 'LHR') ? 108413 : (orig === 'DAC' && dest === 'KUL') ? 36540 : 47820;
  const fares = [
    { basis:'LL2YXSDC', cls:'L', total:base, change:'USD 120', refund:'USD 216' },
    { basis:'QL3YXSDC', cls:'Q', total:base + 7420, change:'USD 100', refund:'USD 180' },
    { basis:'YL4FLEX', cls:'Y', total:base + 18600, change:'FREE', refund:'USD 90' }
  ];
  const curLabel = reqCur !== 'BDT' ? reqCur : 'BDT';
  const rows = [
    `FQD${orig}${dest}/D${date}${reqCur !== 'BDT' ? '/R,' + reqCur : ''}`,
    ``,
    `                    FARE DISPLAY  ${route}  ${date}`,
    ` LINE  FARE BASIS  BK   TOTAL ${curLabel.padEnd(4)}   CHANGE       REFUND`,
    ` ----  ----------  --   ----------   --------     --------`
  ];
  fares.forEach((fare, i) => {
    const displayTotal = reqCur !== 'BDT' ? Math.round(fare.total / curRate) : fare.total;
    rows.push(`  ${i + 1}    ${fare.basis.padEnd(10)}  ${fare.cls}    ${String(displayTotal).padStart(10)}   ${fare.change.padEnd(10)} ${fare.refund}`);
  });
  if(reqCur !== 'BDT'){
    rows.push(`RATE USED 1 ${reqCur} = ${curRate.toFixed(4)} BDT  BSR`);
  }
  rows.push(``);
  rows.push(`ENTER FQN1-1 TO DISPLAY RULE CATEGORIES FOR FARE LINE 1`);
  rows.push(`ENTER FQN1-1//PE TO DISPLAY CHANGE / REFUND / NO-SHOW PENALTIES`);
  printLines(rows, '');
  showToast(`Fare Display: ${route} (${curLabel}) — select a fare line, then view its rules`);
}

// ---------- FQN — Fare Rules / Penalty Display (Matches Screenshot 5) ----------
function handleFQN(cmd, clean){
  if(!state.hasPricingRequest){
    printLines(['ENTRY REQUIRES PREVIOUS PRICING/FARE DISPLAY REQUEST'], 'err');
    return;
  }
  // A new FQN command starts a fresh rules display.
  pricingMorePageRows = null;
  pricingMorePageVisible = false;
  pricingPageTwoRows = null;
  fareRulePages = null;
  fareRulePageIndex = 0;
  // Check if PE (Penalties) category requested: FQN1-1//PE, FQN1-1`//PE, FQN1-1/PE, FQN1//PE, FQN//PE
  const isPE = /PE/i.test(clean) || /PENAL/i.test(clean);
  const seg0 = (state.segments && state.segments[0]) ? state.segments[0] : null;
  const al = seg0 ? seg0.al : 'AI';
  const fareQuote = state.fareShopPrice || {};
  const basis = (seg0 && seg0.fareBasis) ? seg0.fareBasis.replace('+', '')
    : (fareQuote.fareBasis ? fareQuote.fareBasis.replace('+', '') : `${(seg0 && seg0.cls) || 'Y'}JR4R1RI`);
  const depCity = seg0 ? seg0.dep : 'DAC';
  const arrCity = (state.segments && state.segments.length > 1) ? state.segments[1].arr : (seg0 ? seg0.arr : 'LON');
  const destGroup = (arrCity === 'LHR' || arrCity === 'LON') ? 'DACLON' : `${depCity}${arrCity}`;
  const bkCls = seg0 ? seg0.cls : 'L';
  const famName = getFareFamilyInfo(al).code;
  const pricingRecord = (state.tstRecords || []).find(record => record.ptc) || {};
  const ptc = pricingRecord.ptc || 'ADT';
  const ptcName = ptc === 'CH' ? 'CHILD' : (ptc === 'IN' ? 'INFANT' : 'ADULT');
  const paxCodeMatch = String(pricingRecord.pCode || '.1').match(/\.(\d+)/);
  const paxCode = `P${paxCodeMatch ? paxCodeMatch[1] : '1'}`;
  const bookingClass = (seg0 && seg0.cls) || 'Y';
  const fareComponent = `FARE COMPONENT  1     ${ptc} ${destGroup} ${al}   ${basis}  PU 1 S`;
  const fareClassLine = ` FCL: ${basis}   TRF:    8 RULE: BD02 BK:  ${bookingClass}`;

  if(isPE || clean.includes('//') || clean.includes('/')){
    // Multi-page training rules follow the active airline, fare basis and PTC.
    const peBadge = `<span style="background:#dc2626; color:#fff; font-weight:bold; padding:0 2px;">PE</span>`;
    const rows = [
      ` 1 - PSGR ${paxCode} ${ptc}                                   RULES DISPLAY`,
      ` ${fareComponent}`,
      fareClassLine,
      ` PTC: ${ptc}-${ptcName}                FTC: XOX-ONE WAY SPECIAL EXCURSION`,
      ` FARE FAMILY              : ${famName}`,
      ` ${peBadge}.PENALTIES`,
      ` FOR ${basis} TYPE FARES`,
      ``,
      `  CHANGES`,
      ``,
      `    ANY TIME`,
      `    CHANGES PERMITTED FOR REISSUE/REVALIDATION.`,
      `    WAIVED FOR DEATH OF PASSENGER.`,
      `       NOTE -`,
      `          MORE THAN 4 HOURS BEFORE DEPARTURE - CHARGE USD`,
      `          50 PER TICKET. FARE DIFFERENCE APPLIES.`,
      `          LESS THAN 4 HOURS BEFORE DEPARTURE - NOT`,
      `          PERMITTED. TICKET FORFEITED.`,
      `                                                    PAGE  1/ 4`
    ];
    fareRulePageIndex = 0;
    fareRulePages = [
      rows,
      [
        ` PERMITTED. TICKET FORFEITED.`,
        `------------------------------------------------------------`,
        ` GO SHOW - NOT PERMITTED.`,
        `------------------------------------------------------------`,
        ` REROUTING NOT PERMITTED`,
        `------------------------------------------------------------`,
        ` NO SHOW NOT PERMITTED. TICKET FORFEITED.`,
        `------------------------------------------------------------`,
        ` CHANGES PERMITTED TO THE SAME RBD OR HIGHER RBD ONLY.`,
        ` DOWNGRADE NOT ALLOWED.`,
        `------------------------------------------------------------`,
        ` NAME CHANGE IS NOT PERMITTED.`,
        `------------------------------------------------------------`,
        ` VOID FOR EXCHANGE TICKET NOT ALLOWED`,
        `------------------------------------------------------------`,
        ` THE MOST RESTRICTIVE FARE RULE APPLIES.`,
        `------------------------------------------------------------`,
        ` A COPY OF VALID DEATH CERTIFICATE ISSUED BY A`,
        ` COMPETENT MEDICAL AUTHORITY IS REQUIRED.`,
        ` CHANGES NOT PERMITTED IN CASE OF REVALIDATION.`,
        `                                                    PAGE  2/ 4`
      ],
      [
        ` CANCELLATIONS`,
        ``,
        `    ANY TIME`,
        `    TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.`,
        `    WAIVED FOR DEATH OF PASSENGER.`,
        `       NOTE -`,
        `          TICKET IS NON-REFUNDABLE. ONLY AIRPORT TAXES`,
        `          ARE REFUNDED.`,
        `------------------------------------------------------------`,
        ` THE MOST RESTRICTIVE FARE RULE APPLIES.`,
        `------------------------------------------------------------`,
        ` REFUND IS NOT APPLICABLE ON REMAINING FLIGHT COUPONS`,
        ` IF THE TICKET IS USED OUT OF SEQUENCE OR THE INBOUND`,
        ` JOURNEY FROM THE POINT OF TURNAROUND HAS COMMENCED.`,
        `------------------------------------------------------------`,
        ` NIL REFUND FOR TICKETS USED OUT OF SEQUENCE.`,
        ` IF REISSUED TO A HIGHER FARE, CHANGE FEE AND NEW FARE`,
        ` RULES APPLY.`,
        `                                                    PAGE  3/ 4`
      ],
      [
        ` NO-SHOW`,
        ``,
        ` YQ AND OTHER SURCHARGES ARE NON-REFUNDABLE.`,
        ` TICKET IS NON-REFUNDABLE IN CASE OF NO-SHOW.`,
        ` WAIVED FOR DEATH OF PASSENGER.`,
        `       NOTE -`,
        `          TICKET TO BE FORFEITED AND NO REFUND ARE`,
        `          ALLOWED.`,
        `------------------------------------------------------------`,
        ` A COPY OF VALID DEATH CERTIFICATE ISSUED BY A`,
        ` COMPETENT MEDICAL AUTHORITY IS REQUIRED.`,
        `                                                    PAGE  4/ 4`
      ]
    ];
    printLines(rows, '');
    showToast(`✓ Fare Rules Display: ${basis} (PE.PENALTIES)`);
    return;
  }

  // General FQN category menu
  const rows = [
    ` 1 - PSGR ${paxCode} ${ptc}                                   RULES DISPLAY`,
    ` ${fareComponent}`,
    ` FCL: ${basis}   TRF:    4 RULE: BDGD BK:  ${bkCls}`,
    ` PTC: ${ptc}-${ptcName}                FTC: XOX-ONE WAY SPECIAL EXCURSION`,
    ` FARE FAMILY              : ${famName}`,
    ``,
    ` SELECT CATEGORY BY ENTERING FQN1-1//[CATEGORY]`,
    `   AP - ADVANCE PURCHASE`,
    `   MN - MINIMUM STAY`,
    `   MX - MAXIMUM STAY`,
    `   PE - PENALTIES / CHANGES / CANCELLATIONS`,
    `   CD - CHILDREN DISCOUNTS`,
    `   SO - STOPOVERS`,
    `   SR - SALES RESTRICTIONS`,
    `   FL - FLIGHT APPLICATION`
  ];
  printLines(rows, '');
  showToast(`Fare Rules categories displayed — Enter FQN1-1//PE to view penalties`);
}

// ---------- FQF — Fare Families Details Display ----------
function getFareFamilyInfo(al){
  const quote = state.fareShopPrice || {};
  const segmentBasis = (state.segments && state.segments[0] && state.segments[0].fareBasis) || quote.fareBasis || '';
  const configured = quote.familyName || quote.fareFamily || '';
  const code = configured || (/SS/i.test(segmentBasis) ? 'SS' : (al === 'OD' ? 'SS' : (al === 'TG' ? 'ECOSV1' : 'ECLASSIC')));
  const description = /^(SS|SUPER SAVER)$/i.test(code) ? 'SUPER SAVER'
    : (/ECO.?SV/i.test(code) ? 'ECONOMY SAVER' : (/ECLASSIC/i.test(code) ? 'ECONOMY CLASSIC' : `${code} FARE`));
  return { code, description };
}

function handleFQF(cmd, clean){
  if(!state.hasPricingRequest){
    printLines(['ENTRY REQUIRES PREVIOUS PRICING/FARE DISPLAY REQUEST'], 'err');
    return;
  }
  const seg0 = (state.segments && state.segments[0]) ? state.segments[0] : null;
  const al = seg0 ? seg0.al : 'AI';
  const routeOrig = seg0 ? seg0.dep : 'DAC';
  const routeDest = (state.segments && state.segments.length) ? state.segments[state.segments.length - 1].arr : 'KUL';
  const route = `${routeOrig}${routeDest}`;
  const family = getFareFamilyInfo(al);

  const rows = [
    `*1: ${family.code} - ${al} - ${route}.`,
    `  DESCRIPTION : ${family.description}`,
    `  - INCLUDED`,
    `      0CH : CHECKED BAGGAGE`,
    `      0M3 : CARRY 7KG 15LB UP TO 45LI 115LCM`,
    `  - AT CHARGE`,
    `      06I : CHANGE BEFORE DEPARTURE`,
    `      0CZ : UP TO 22LB 10KG BAGGAGE`,
    `      0C2 : UP TO 44LB 20KG BAGGAGE`,
    `      0C5 : UP TO 66LB 30KG BAGGAGE`,
    `      0C8 : UP TO 88LB 40KG BAGGAGE`,
    `      0AK : MEALS`,
    `      0B5 : PRE RESERVED SEAT ASSIGNMENT`,
    ``,
    `  - NOT OFFERED`,
    `      08S : SAME DAY CHANGE`,
    `      0AG : LOUNGE ACCESS`,
    `      0G6 : PRIORITY BOARDING`,
    `      03P : PRIORITY CHECK IN`,
    `      0LF : PRIORITY BAGGAGE`,
    `      06O : ECONOMY TO BUSINESS`,
    `                                                    PAGE  1/ 1`
  ];
  printLines(rows, '');
  showToast(`Fare Family details displayed (${family.code} - ${al} - ${route})`);
}

function setActivePane(paneId) {
  const wasActive = activePaneId === paneId;
  activePaneId = paneId;
  for (let i = 1; i <= 4; i++) {
    const pane = document.getElementById(`pane${i}`);
    if (pane) {
      pane.classList.toggle('active-pane', i === paneId);
    }
  }
  const inpId = paneId === 1 ? 'cmdInput' : `cmdInput${paneId}`;
  const input = document.getElementById(inpId);
  // Do not steal focus when clicking inside the already active terminal:
  // that preserves mouse-selected output so Ctrl+C can copy it.
  if (input && !wasActive) {
    input.focus({ preventScroll: true });
  }
}

function amadeusDateFromLocal(value){
  const date = new Date(value);
  if(Number.isNaN(date.getTime())) return '';
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return `${String(date.getDate()).padStart(2, '0')}${months[date.getMonth()]}`;
}

function handleLPO(cmd){
  const match = cmd.match(/^LPO(?:\/K\(?([0-3]?\d[A-Z]{3})\)?)?$/i);
  if(!match){
    printLines(['INVALID LPO FORMAT — USE LPO/K(25SEP)'], 'err');
    return;
  }
  const requestedDate = (match[1] || amadeusDateFromLocal(new Date())).toUpperCase();
  const records = Object.values(loadSavedPNRs()).filter(record =>
    amadeusDateFromLocal(record.createdAt || record.dateStamp) === requestedDate
  ).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  lastLpoResults = records;

  const rows = [
    `PNR LIST BY CREATION DATE — ${requestedDate}`,
    `OFFICE: ${state.officeId || OFFICE_ID}`,
    ''
  ];
  if(!records.length){
    rows.push(`NO PNR FOUND CREATED ON ${requestedDate}`);
  } else {
    rows.push(`  NO  PASSENGER NAME                 ITINERARY        PNR`);
    records.forEach((record, index) => {
      const pax = record.passengers?.[0];
      const name = (pax?.label || 'PASSENGER/NAME').split('(')[0].slice(0, 30).padEnd(30, ' ');
      const seg = record.segments?.[0];
      const itinerary = seg ? `${seg.al}${String(seg.fn).padStart(4, ' ')} ${seg.dep}${seg.arr}` : 'NO ITINERARY';
      rows.push(`  ${String(index + 1).padStart(2, ' ')}  ${name} ${itinerary.padEnd(16, ' ')} ${record.locator}`);
    });
    rows.push('', 'ENTER RT + LINE NUMBER TO RETRIEVE (E.G. RT1)');
  }
  printLines(rows, '');
  showToast(`${records.length} PNR(s) found for ${requestedDate}`);
}
window.setActivePane = setActivePane;

function mountPaneInput(paneId = 1) {
  const targetTerm = getPaneTerm(paneId);
  if (!targetTerm) return;

  const old = targetTerm.querySelector('.inputRow');
  if (old) old.remove();
  const oldScrollSpace = targetTerm.querySelector('.terminal-scroll-space');
  if (oldScrollSpace) oldScrollSpace.remove();

  const isNeedPax = (state.segments && state.segments.length > 0) && (!state.passengers || state.passengers.length === 0);
  const placeholderText = paneId === 1 && isNeedPax ? "Type passenger name (e.g. NM1SHAKIB/APON MR)..." : "";

  const row = document.createElement('div');
  row.className = 'inputRow';
  const inpId = paneId === 1 ? 'cmdInput' : `cmdInput${paneId}`;
  row.innerHTML = `<span class="chevron">&gt;</span><input id="${inpId}" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="${placeholderText}">`;
  targetTerm.appendChild(row);

  // Extra space after the live prompt lets the latest command reach the top
  // of the viewport even when its response is only one or two lines long.
  const scrollSpace = document.createElement('div');
  scrollSpace.className = 'terminal-scroll-space';
  scrollSpace.setAttribute('aria-hidden', 'true');
  scrollSpace.style.height = `${Math.max(0, targetTerm.clientHeight - 42)}px`;
  targetTerm.appendChild(scrollSpace);

  const input = row.querySelector(`#${inpId}`);
  // Match the original command page: keep the latest command at the top of
  // the visible pane. Earlier commands remain immediately above it and can
  // be reviewed by scrolling upward.
  requestAnimationFrame(() => {
    if(latestCommandPromptEl && latestCommandPromptEl.parentElement === targetTerm){
      targetTerm.scrollTop = latestCommandPromptEl.offsetTop;
    }
  });
  if (activePaneId === paneId) {
    input.focus({ preventScroll: true });
  }

  input.addEventListener('focus', () => {
    setActivePane(paneId);
  });

  input.addEventListener('input', () => {
    const pos = input.selectionStart;
    input.value = input.value.toUpperCase();
    input.setSelectionRange(pos, pos);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = input.value;
      input.value = '';
      runCommand(val, paneId);
      mountPaneInput(paneId);
      return;
    }
    if (e.altKey && e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length) {
        historyPos = Math.max(0, historyPos - 1);
        input.value = commandHistory[historyPos] || '';
      }
    }
    if (e.altKey && e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length) {
        historyPos = Math.min(commandHistory.length, historyPos + 1);
        input.value = commandHistory[historyPos] || '';
      }
    }
  });

  initTermClickListener(paneId);
  if (paneId === 1) scrollToLatestCommand();
}

function mountInput() {
  mountPaneInput(activePaneId || 1);
}

function ensurePaneMounted(paneId) {
  const targetTerm = getPaneTerm(paneId);
  if (!targetTerm) return;
  const existingInput = targetTerm.querySelector('.inputRow');
  if (!existingInput) {
    mountPaneInput(paneId);
  }
}

function initTermClickListener(paneId = 1) {
  const targetTerm = getPaneTerm(paneId);
  if (!targetTerm || targetTerm._termClickAttached) return;
  targetTerm._termClickAttached = true;
  targetTerm.addEventListener('click', (e) => {
    setActivePane(paneId);
    const sel = window.getSelection ? window.getSelection() : null;
    if (sel && sel.toString().trim().length > 0) return;
    if (!e.target.classList.contains('seg-class-link')) {
      const inpId = paneId === 1 ? 'cmdInput' : `cmdInput${paneId}`;
      const activeInp = document.getElementById(inpId);
      if (activeInp && document.activeElement !== activeInp) {
        activeInp.focus({ preventScroll: true });
      }
    }
  });
}

function updateSplitLayout() {
  const ws = document.getElementById('terminalWorkspace');
  const btnH = document.getElementById('btnSplitHoriz');
  const btnV = document.getElementById('btnSplitVert');
  if (!ws) return;

  if (btnH) btnH.classList.toggle('active', splitState.horizontal);
  if (btnV) btnV.classList.toggle('active', splitState.vertical);

  ws.classList.remove('split-none', 'split-horizontal', 'split-vertical', 'split-both');

  // Reset any manual inline sizes on toggle to give clean equal partitions
  const rowTop = document.getElementById('rowTop');
  const rowBottom = document.getElementById('rowBottom');
  const pane1 = document.getElementById('pane1');
  const pane3 = document.getElementById('pane3');
  if (rowTop) { rowTop.style.height = ''; rowTop.style.flex = ''; }
  if (rowBottom) { rowBottom.style.height = ''; rowBottom.style.flex = ''; }
  if (pane1) { pane1.style.width = ''; pane1.style.flex = ''; }
  if (pane3) { pane3.style.width = ''; pane3.style.flex = ''; }

  if (splitState.horizontal && splitState.vertical) {
    ws.classList.add('split-both');
    ensurePaneMounted(1);
    ensurePaneMounted(2);
    ensurePaneMounted(3);
    ensurePaneMounted(4);
  } else if (splitState.horizontal) {
    ws.classList.add('split-horizontal');
    ensurePaneMounted(1);
    ensurePaneMounted(3);
  } else if (splitState.vertical) {
    ws.classList.add('split-vertical');
    ensurePaneMounted(1);
    ensurePaneMounted(2);
  } else {
    ws.classList.add('split-none');
    ensurePaneMounted(1);
    setActivePane(1);
  }
}

window.toggleSplit = function(mode) {
  if (mode === 'horizontal') {
    splitState.horizontal = !splitState.horizontal;
  } else if (mode === 'vertical') {
    splitState.vertical = !splitState.vertical;
  }
  updateSplitLayout();
};

function initSplitterDraggers() {
  const splitterH = document.getElementById('splitterH');
  const splitterVTop = document.getElementById('splitterVTop');
  const splitterVBottom = document.getElementById('splitterVBottom');
  const rowTop = document.getElementById('rowTop');
  const pane1 = document.getElementById('pane1');
  const pane3 = document.getElementById('pane3');
  const ws = document.getElementById('terminalWorkspace');

  if (splitterH && rowTop && ws) {
    splitterH.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const startY = e.clientY;
      const startH = rowTop.getBoundingClientRect().height;
      function onMouseMove(ev) {
        const delta = ev.clientY - startY;
        const totalH = ws.getBoundingClientRect().height;
        const newH = Math.max(60, Math.min(totalH - 60, startH + delta));
        rowTop.style.height = `${newH}px`;
        rowTop.style.flex = 'none';
      }
      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
    splitterH.addEventListener('dblclick', () => {
      rowTop.style.height = '50%';
      rowTop.style.flex = '1';
    });
  }

  function setupVDragger(splitter, leftPane, row) {
    if (!splitter || !leftPane || !row) return;
    splitter.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const startW = leftPane.getBoundingClientRect().width;
      function onMouseMove(ev) {
        const delta = ev.clientX - startX;
        const totalW = row.getBoundingClientRect().width;
        const newW = Math.max(60, Math.min(totalW - 60, startW + delta));
        leftPane.style.width = `${newW}px`;
        leftPane.style.flex = 'none';
      }
      function onMouseUp() {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      }
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    });
    splitter.addEventListener('dblclick', () => {
      leftPane.style.width = '50%';
      leftPane.style.flex = '1';
    });
  }

  setupVDragger(splitterVTop, pane1, rowTop);
  setupVDragger(splitterVBottom, pane3, document.getElementById('rowBottom'));
}

// Right Tool Rail Flyout controls (Screenshot 4)
window.toggleQualityMonitorFlyout = function(show) {
  const flyout = document.getElementById('qualityMonitorFlyout');
  const btn = document.getElementById('railQualityMonitor');
  if (!flyout) return;
  const isVisible = flyout.style.display !== 'none';
  const target = (typeof show === 'boolean') ? show : !isVisible;
  flyout.style.display = target ? 'flex' : 'none';
  if (btn) btn.classList.toggle('active', target);
  if (target) {
    toggleSmartFlowsFlyout(false);
    toggleHelpFlyout(false);
  }
};

window.toggleSmartFlowsFlyout = function(show) {
  const flyout = document.getElementById('smartFlowsFlyout');
  const btn = document.getElementById('railSmartFlows');
  if (!flyout) return;
  const isVisible = flyout.style.display !== 'none';
  const target = (typeof show === 'boolean') ? show : !isVisible;
  flyout.style.display = target ? 'flex' : 'none';
  if (btn) btn.classList.toggle('active', target);
  if (target) {
    toggleQualityMonitorFlyout(false);
    toggleHelpFlyout(false);
  }
};

window.toggleHelpFlyout = function(show) {
  const flyout = document.getElementById('helpFlyout');
  const btn = document.getElementById('railHelpBtn');
  if (!flyout) return;
  const isVisible = flyout.style.display !== 'none';
  const target = (typeof show === 'boolean') ? show : !isVisible;
  flyout.style.display = target ? 'flex' : 'none';
  if (btn) btn.classList.toggle('active', target);
  if (target) {
    toggleQualityMonitorFlyout(false);
    toggleSmartFlowsFlyout(false);
  }
};

// Action search bar on top
const actionSearchInp = document.getElementById('actionSearchInput');
if (actionSearchInp) {
  actionSearchInp.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = e.target.value.trim();
      if (val) {
        runCommand(val);
        e.target.value = '';
        mountInput();
      }
    }
  });
}

// Smart Keys Bar Runner
window.runSmartCmd = function(cmd) {
  if (!cmd) return;
  runCommand(cmd);
  mountInput();
};

// Toggle Smart Keys toolbar visibility
window.toggleSmartKeys = function() {
  const bar = document.getElementById('smartKeysBar');
  const restore = document.getElementById('smartKeysRestore');
  if (!bar) return;
  const isHidden = (bar.style.display === 'none' || bar.classList.contains('hidden'));
  if (isHidden) {
    bar.style.display = 'flex';
    bar.classList.remove('hidden');
    if (restore) restore.style.display = 'none';
  } else {
    bar.style.display = 'none';
    bar.classList.add('hidden');
    if (restore) restore.style.display = 'flex';
  }
};

// Deprecated stub for any legacy call
window.toggleGotoSidebar = function() {};

// ─────────────────────────────────────────────────────────────────────────────
// COMMAND HISTORY MODAL — matches original Amadeus "Command History" dialog
// ─────────────────────────────────────────────────────────────────────────────
let _selectedHistoryCmd = null;

window.openCommandHistory = function() {
  const overlay = document.getElementById('cmdHistoryOverlay');
  const list    = document.getElementById('cmdHistoryList');
  if (!overlay || !list) return;

  // Rebuild list (newest at bottom like Amadeus)
  list.innerHTML = '';
  _selectedHistoryCmd = null;

  if (!commandHistory.length) {
    list.innerHTML = '<li style="padding:10px 14px; color:#888; font-size:13px; list-style:none;">No commands yet</li>';
  } else {
    commandHistory.forEach((cmd, i) => {
      const li = document.createElement('li');
      li.textContent = `•  ${cmd}`;
      li.dataset.cmd = cmd;
      li.style.cssText = 'padding:3px 12px; font-size:14px; cursor:pointer; font-family:"Consolas","Courier New",monospace; line-height:1.6; white-space:nowrap; list-style:none;';

      // Highlight last item (like Amadeus golden highlight)
      if (i === commandHistory.length - 1) {
        li.style.background = '#f5a623';
        li.style.color = '#000';
        li.style.fontWeight = 'bold';
        _selectedHistoryCmd = cmd;
      }

      li.addEventListener('click', () => {
        // Deselect all
        list.querySelectorAll('li').forEach(el => {
          el.style.background = '';
          el.style.color = '';
          el.style.fontWeight = 'normal';
        });
        // Select clicked
        li.style.background = '#f5a623';
        li.style.color = '#000';
        li.style.fontWeight = 'bold';
        _selectedHistoryCmd = cmd;
      });

      li.addEventListener('mouseover', () => {
        if (_selectedHistoryCmd !== cmd) {
          li.style.background = '#eef3f8';
        }
      });
      li.addEventListener('mouseout', () => {
        if (_selectedHistoryCmd !== cmd) {
          li.style.background = '';
          li.style.color = '';
          li.style.fontWeight = 'normal';
        }
      });

      list.appendChild(li);
    });
    // Scroll to bottom (latest command)
    list.scrollTop = list.scrollHeight;
  }

  overlay.style.display = 'flex';
};

window.closeCommandHistory = function() {
  const overlay = document.getElementById('cmdHistoryOverlay');
  if (overlay) overlay.style.display = 'none';
  _selectedHistoryCmd = null;
};

window.clearCommandHistory = function() {
  commandHistory = [];
  historyPos = -1;
  saveCmdHistory([]);
  const list = document.getElementById('cmdHistoryList');
  if (list) list.innerHTML = '<li style="padding:10px 14px; color:#888; font-size:13px; list-style:none;">History cleared</li>';
  _selectedHistoryCmd = null;
  showToast('Command history cleared');
};

window.historyAction = function(action) {
  const cmd = _selectedHistoryCmd;
  if (!cmd && action !== 'flow') {
    showToast('Please select a command first', 'warn');
    return;
  }

  if (action === 'send') {
    // Match Selling Platform Connect: Send returns the selected command to
    // the command line so the user can review or press Enter to run it.
    closeCommandHistory();
    setTimeout(() => {
      mountInput(activePaneId || 1);
      const inp = document.getElementById('cmdInput');
      if (inp) { inp.value = cmd; inp.focus(); inp.setSelectionRange(cmd.length, cmd.length); }
    }, 100);

  } else if (action === 'copy') {
    // Copy to clipboard
    navigator.clipboard.writeText(cmd).then(() => {
      showToast(`Copied: ${cmd}`);
    }).catch(() => {
      // Fallback
      const inp = document.getElementById('cmdInput');
      if (inp) { inp.value = cmd; inp.focus(); inp.select(); }
      showToast(`Copied to input: ${cmd}`);
    });
    closeCommandHistory();

  } else if (action === 'edit') {
    // Put in input for editing
    closeCommandHistory();
    setTimeout(() => {
      const inp = document.getElementById('cmdInput');
      if (inp) { inp.value = cmd; inp.focus(); inp.setSelectionRange(cmd.length, cmd.length); }
    }, 100);

  } else if (action === 'flow') {
    showToast('Smart Flow creation — coming soon');
  }
};

// Close modal when clicking outside (backdrop click)
document.addEventListener('click', (e) => {
  const overlay = document.getElementById('cmdHistoryOverlay');
  if (overlay && e.target === overlay) closeCommandHistory();
});

// Initialize on page load: start with a fresh, clean terminal (Amadeus Selling Platform Connect behavior)
window.addEventListener('DOMContentLoaded', ()=>{
  // Reload persisted command history (survives page refresh)
  commandHistory = loadCmdHistory();
  historyPos = commandHistory.length;
  state = createEmptyState();
  term.innerHTML = '';
  updateTopPnrInfo();
  mountInput();
  initSplitterDraggers();
});



