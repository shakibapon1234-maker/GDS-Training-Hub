const GDS_LOGO_DATA_URI = "data:image/jpeg;base64,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";
// ============================================================
//  Gellelio Galileo Training Simulator — App Shell
// ============================================================
const terminal   = document.getElementById("terminal");
const terminalOutput = document.getElementById("terminalOutput");
const copyTerminalBtn = document.getElementById("copyTerminal");
const inputEl    = document.getElementById("commandInput");
const formEl     = document.getElementById("commandForm");
const leftMsg    = document.getElementById("leftMessage");
const leftBtns   = document.getElementById("leftButtons");
const leftVendorBox = document.getElementById("leftVendorBox");
const leftDetails   = document.getElementById("leftDetails");
const leftSegment = document.getElementById("leftSegment");
const leftPnrHeader = document.getElementById("leftPnrHeader");
const leftPassenger = document.getElementById("leftPassenger");
const leftSegmentHeader = document.getElementById("leftSegmentHeader");
const leftSegmentNotes = document.getElementById("leftSegmentNotes");
const leftOsi = document.getElementById("leftOsi");
const tabLabel   = document.getElementById("tabLabel");
const locBadge   = document.getElementById("locatorBadge");
const pnrSummary = document.getElementById("pnrSummary");
const statusSpan = document.getElementById("sessionStatus");
const officeSpan = document.getElementById("officeLabel");
const tipEl      = document.getElementById("flightTip");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const historyMenu = document.getElementById("historyMenu");
const historyTool = document.getElementById("historyTool");
const brandPanel = document.getElementById("brandPanel");
const itineraryPanel = document.getElementById("itineraryPanel");
const itineraryTool = document.getElementById("itineraryTool");
const assistedTicketingPanel = document.getElementById("assistedTicketingPanel");
const assistedTicketingTool = document.getElementById("assistedTicketingTool");
const toolsMenu = document.getElementById("toolsMenu");
const historyInput = { selected: -1 };
const HISTORY_KEY = "gellelio-command-history-v1";

const engine = new GalileoCommandEngine();
try {
  const stored = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  if (Array.isArray(stored)) engine.state.history = stored.slice(-100);
} catch (_) {}
let histIdx = -1;
let lastCommand = "";
let activeLeftCommands = new Set();
let isFqExpanded = false; // multi-select toggle set

let currentScreenMode = "empty";

function getTerminalContainer() {
  return terminalOutput || terminal;
}

function span(cls, text) {
  const el = document.createElement("span");
  el.className = cls;
  el.textContent = text;
  return el;
}

function setTerminalMode(mode) {
  currentScreenMode = mode;
  if (!terminal) return;
  terminal.classList.remove("mode-avail", "mode-fare", "mode-lines", "mode-top");
  if (mode === "avail" || mode === "fare" || mode === "empty") {
    terminal.classList.add("mode-top", "mode-" + mode);
  } else {
    terminal.classList.add("mode-lines");
  }
}

function clearScreen() {
  const container = getTerminalContainer();
  container.innerHTML = "";
  setTerminalMode("empty");
  hideTip();
}

function print(text, kind) {
  const pre = document.createElement("pre");
  pre.className = "output" + (kind ? " " + kind : "");
  if (kind === "html") {
    pre.innerHTML = text;
    getTerminalContainer().appendChild(pre);
    terminal.scrollTop = terminal.scrollHeight;
    return;
  }
  if (kind !== "echo" && text && (text.includes(">*") || text.includes("<span") || text.includes("«Display Rules»") || text.includes("«Back to Fare Components»"))) {
    let safeHtml = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    safeHtml = safeHtml.replace(/&gt;\*([A-Z0-9]+)(?:&laquo;|«|·|&middot;)?/g, function(m, pnrCmd) {
      return '<span class="cmd-link terminal-pnr-link" data-cmd="*' + pnrCmd + '" title="Click to retrieve ' + pnrCmd + '" style="color:#45e945;cursor:pointer;text-decoration:underline;font-weight:bold;">&gt;*' + pnrCmd + '&laquo;</span>';
    });
    safeHtml = safeHtml.replace(/«Display Rules»/g, '<span class="display-rules-link" data-action="display-rules" style="color:#00ff00;cursor:pointer;text-decoration:underline;">«Display Rules»</span>');
    safeHtml = safeHtml.replace(/«Back to Fare Components»/g, '<span class="rule-link" data-action="fare-components" style="color:#00ff00;cursor:pointer;text-decoration:underline;">«Back to Fare Components»</span>');
    pre.innerHTML = safeHtml;
  } else {
    pre.textContent = text;
  }
  getTerminalContainer().appendChild(pre);
  terminal.scrollTop = terminal.scrollHeight;
}

function setScreen(text, kind) {
  clearScreen();
  if (kind === "avail" || kind === "fare") {
    setTerminalMode(kind);
  } else {
    setTerminalMode(text ? "lines" : "empty");
  }
  if (text) print(text, kind);
  terminal.scrollTop = 0;
}

function printEcho(cmd) {
  print(">" + cmd, "echo");
}

function hideTip() {
  if (tipEl) tipEl.hidden = true;
}

copyTerminalBtn.addEventListener("click", async function() {
  const text = (terminalOutput || terminal).innerText;
  let copied = false;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      copied = true;
    }
  } catch (_) {}
  if (!copied) {
    const fallback = document.createElement("textarea");
    fallback.value = text;
    fallback.setAttribute("readonly", "");
    fallback.style.position = "fixed";
    fallback.style.opacity = "0";
    document.body.appendChild(fallback);
    fallback.select();
    copied = document.execCommand("copy");
    fallback.remove();
  }
  copyTerminalBtn.textContent = copied ? "Copied" : "Copy failed";
  setTimeout(function() { copyTerminalBtn.textContent = "Copy"; }, 1400);
});

function persistHistory() {
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify((engine.state.history || []).slice(-100))); } catch (_) {}
}

function renderHistory() {
  if (!historyList) return;
  historyList.innerHTML = "";
  const entries = engine.state.history || [];
  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "history-empty";
    empty.textContent = "NO COMMANDS IN HISTORY";
    historyList.appendChild(empty);
    historyInput.selected = -1;
    return;
  }
  entries.slice().reverse().forEach(function(command, displayIndex) {
    const sourceIndex = entries.length - 1 - displayIndex;
    const entry = document.createElement("textarea");
    entry.className = "history-entry" + (sourceIndex === historyInput.selected ? " selected" : "");
    entry.dataset.historyIndex = String(sourceIndex);
    entry.value = command;
    entry.rows = 1;
    entry.spellcheck = false;
    entry.addEventListener("focus", function() {
      historyInput.selected = sourceIndex;
    });
    entry.addEventListener("input", function() {
      engine.state.history[sourceIndex] = entry.value;
      persistHistory();
    });
    historyList.appendChild(entry);
  });
}

function openHistory() {
  renderHistory();
  if (historyPanel) {
    historyPanel.hidden = false;
    historyPanel.removeAttribute("hidden");
  }
}

function closeHistory() {
  if (historyPanel) {
    historyPanel.hidden = true;
    historyPanel.setAttribute("hidden", "");
  }
}

function sendHistorySelection() {
  const command = engine.state.history[historyInput.selected];
  if (!command) return;
  closeHistory();
  processCommand(command);
  inputEl.focus();
}

function deleteHistorySelection() {
  if (historyInput.selected < 0) return;
  engine.state.history.splice(historyInput.selected, 1);
  persistHistory();
  historyInput.selected = -1;
  renderHistory();
}

function closeBrands() { if (brandPanel) brandPanel.hidden = true; }

function escapeItinerary(value) { return String(value || "").replace(/[&<>"']/g, function(char) { return ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"})[char]; }); }
function openItinerary() {
  if (!itineraryPanel) return;
  const hasItinerary = !!(engine.state.segments && engine.state.segments.length);
  document.getElementById("itineraryPrint").disabled = !hasItinerary;
  document.getElementById("itineraryHint").textContent = hasItinerary ? "Preview, print, or choose Save as PDF in the print dialog." : "Create or retrieve a booking to enable preview and print.";
  itineraryPanel.hidden = false;
}
function closeItinerary() { if (itineraryPanel) itineraryPanel.hidden = true; }
function getPassportForPax(paxIdx, paxName) {
  const s = engine.state;
  const ssrList = s.ssr || [];
  if (!ssrList.length) return '';
  const pNum = String(paxIdx + 1);
  for (let i = 0; i < ssrList.length; i++) {
    const item = ssrList[i];
    const raw = String(typeof item === 'object' ? (item.raw || '') : item);
    if (!raw.toUpperCase().includes('DOCS')) continue;
    const matches = (typeof item === 'object' && String(item.passenger || '') === pNum) ||
      new RegExp('(?:^|[./])P' + pNum + '(?:[./]|$)', 'i').test(raw);
    if (matches) { const m = raw.match(/\/P\/[A-Z]{3}\/([A-Z0-9]+)\//i) || raw.match(/\/([A-Z0-9]{7,10})\//i); if (m) return m[1]; }
  }
  return '';
}

function buildItineraryPageHTML(paxNames, tickets, issuedArr, state, opts) {
  const showFare = opts.showFare, showClass = opts.showClass, showCabin = opts.showCabin,
        showBaggage = opts.showBaggage, showFareBasis = opts.showFareBasis;
  const issueDate = new Date().toLocaleDateString();

  // Passenger rows with Ticket Number & Passport Number
  const paxRows = paxNames.map(function(rawName, i) {
    const cleanName = escapeItinerary(rawName.replace(/^\d+-/, ''));
    const tkt = issuedArr[i] || issuedArr[0] || {};
    const tktNum = tkt.ticketNumberRaw || (tkt.ticketNumber ? tkt.ticketNumber.replace(/-/g,'') : (state.issued ? 'Issued' : ''));
    const hasDocs = (state.ssr || []).some(function(item) { return String(item && (item.raw || item) || '').toUpperCase().includes('DOCS'); });
    const passport = hasDocs ? getPassportForPax(i, rawName) : (tkt.passport || '');
    return '<tr><td>' + cleanName + '</td><td>' + escapeItinerary(passport) + '</td><td></td><td>' + escapeItinerary(tktNum) + '</td></tr>';
  }).join('');

  const rows = state.segments.map(function(segment) {
    const details = (showClass ? 'Class: ' + escapeItinerary(segment.soldClass || 'Y') + '<br>' : '') +
      (showCabin ? 'Cabin: Economy<br>' : '') +
      (showBaggage ? 'Baggage: 20 KG<br>' : '') +
      (showFareBasis ? 'Fare Basis: ' + escapeItinerary((segment.soldClass || 'Y') + 'TRAIN') : '');
    return '<tr><td><b>' + escapeItinerary(segment.carrier) + ' ' + escapeItinerary(segment.number) +
      '</b><br><small>Operating carrier</small></td><td><b>' + escapeItinerary(segment.origin) +
      '</b><br>Terminal 1</td><td><b>' + escapeItinerary(segment.destination) +
      '</b><br>Terminal 1</td><td><b>' + escapeItinerary(segment.date || '') +
      '</b><br>' + escapeItinerary(segment.depart || '') + '</td><td><b>' +
      escapeItinerary(segment.date || '') + '</b><br>' + escapeItinerary(segment.arrive || '') +
      '</td><td>' + details + '</td></tr>';
  }).join('');

  const fareHtml = (showFare && state.fare && state.fare.total) ?
    '<section class="fare-data"><h3>Fare Data</h3><div><span>Fare</span><b>' + escapeItinerary(state.fare.base || 0) + ' BDT</b></div>' +
    '<div><span>Taxes</span><b>' + escapeItinerary(state.fare.taxes || 0) + ' BDT</b></div>' +
    '<div><span>Total</span><b>' + escapeItinerary(state.fare.total) + ' BDT</b></div></section>' : '';

  return '<article class="itinerary-document">' +
    '<header class="doc-agency">' +
    '<div><h2>GDS Training Hub</h2><p>Galileo Training Simulator<br>Electronic Ticket</p></div>' +
    '<div class="doc-logo"><img src="' + GDS_LOGO_DATA_URI + '" alt="GDS Training Hub" style="height:72px;width:72px;border-radius:50%;object-fit:cover;"></div>' +
    '</header>' +
    '<h3 class="doc-section-title">Electronic Ticket</h3>' +
    '<section class="passenger-info"><h3>Passenger Information</h3>' +
    '<table><thead><tr><th>Passenger Information</th><th>Passport Number</th><th>Frequent Flyer Number</th><th>Ticket</th></tr></thead>' +
    '<tbody>' + paxRows + '</tbody></table></section>' +
    (function() {
      const airlinePnr = state.airlinePnr ||
        (state.vendorLocator && state.vendorLocator.match(/\*([A-Z0-9]{5,7})/i)?.[1]) ||
        (state.issuedTicket && state.issuedTicket.airlinePnr) ||
        (state.locator && state.locator !== "PENDING" ? state.locator.split("").reverse().join("") : "CONFIRMED");
      return '<section class="pnr-info"><table><thead><tr><th>Airline PNR</th><th>Galileo PNR</th><th>Date of Issue</th></tr></thead>' +
        '<tbody><tr><td>' + escapeItinerary(airlinePnr) + '</td><td>' + escapeItinerary(state.locator || 'PENDING') + '</td><td>' + issueDate + '</td></tr></tbody></table></section>';
    })() +
    '<section class="flight-info"><h3>Itinerary Information</h3>' +
    '<table><thead><tr><th>Flight</th><th>From</th><th>To</th><th>Depart</th><th>Arrive</th><th>Info</th></tr></thead>' +
    '<tbody>' + rows + '</tbody></table></section>' +
    fareHtml +
    '<footer>This is a training itinerary only. It is not a live airline document.</footer></article>';
}

function renderItineraryPreview() {
  const area = document.getElementById('itineraryPreviewArea'), state = engine.state;
  if (!area) return;
  if (!state.segments || !state.segments.length) {
    area.innerHTML = "<div class='preview-empty'><span>&#9992;</span><b>Itinerary preview</b><p>Retrieve or create a PNR, then select Preview.</p></div>";
    return;
  }
  const opts = {
    showFare: document.getElementById('includeFare').checked,
    showClass: document.getElementById('showClass').checked,
    showCabin: document.getElementById('showCabin').checked,
    showBaggage: document.getElementById('showBaggage').checked,
    showFareBasis: document.getElementById('showFareBasis').checked
  };
  const onePage = document.getElementById('onePage').checked;
  const names = state.names || ['Passenger'];
  const allTickets = (state.issuedTickets && state.issuedTickets.length) ? state.issuedTickets : (state.issuedTicket ? [state.issuedTicket] : []);
  const activeArr = allTickets.filter(t => !["EXCHANGED", "PARTIALLY EXCHANGED", "VOID", "REFUNDED"].includes(t.status));
  const issuedArr = activeArr.length ? activeArr : (state.issuedTicket ? [state.issuedTicket] : allTickets);

  if (onePage && names.length > 1) {
    // Show separate page per passenger in preview
    area.innerHTML = names.map(function(name, i) {
      return buildItineraryPageHTML([name], issuedArr.slice(i, i+1), issuedArr, state, opts);
    }).join('<div style="border-top:3px dashed #0c7da7;margin:28px 0;"></div>');
  } else {
    area.innerHTML = buildItineraryPageHTML(names, issuedArr, issuedArr, state, opts);
  }
}

function printItinerary() {
  if (!engine.state.segments || !engine.state.segments.length) return;
  const state = engine.state;
  const opts = {
    showFare: document.getElementById('includeFare').checked,
    showClass: document.getElementById('showClass').checked,
    showCabin: document.getElementById('showCabin').checked,
    showBaggage: document.getElementById('showBaggage').checked,
    showFareBasis: document.getElementById('showFareBasis').checked
  };
  const onePage = document.getElementById('onePage').checked;
  const names = state.names || ['Passenger'];
  const allTicketsPrint = (state.issuedTickets && state.issuedTickets.length) ? state.issuedTickets : (state.issuedTicket ? [state.issuedTicket] : []);
  const activePrintArr = allTicketsPrint.filter(t => !["EXCHANGED", "PARTIALLY EXCHANGED", "VOID", "REFUNDED"].includes(t.status));
  const issuedArr = activePrintArr.length ? activePrintArr : (state.issuedTicket ? [state.issuedTicket] : allTicketsPrint);

  let bodyContent = '';
  const pageBreakStyle = '@media print { .page-break { page-break-after: always; break-after: page; } }';

  if (onePage && names.length > 1) {
    bodyContent = names.map(function(name, i) {
      return '<div class="page-break">' + buildItineraryPageHTML([name], issuedArr.slice(i, i+1), issuedArr, state, opts) + '</div>';
    }).join('');
  } else {
    bodyContent = buildItineraryPageHTML(names, issuedArr, issuedArr, state, opts);
  }

  const cssText = pageBreakStyle +
    'body{font-family:Arial,sans-serif;color:#283846;padding:30px;margin:0}' +
    '.itinerary-document{max-width:720px;margin:auto 0}' +
    '.doc-agency{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #0c7da7;padding-bottom:18px;margin-bottom:20px}' +
    '.doc-agency h2{margin:0 0 6px;color:#075f85;font-size:17px}' +
    '.doc-agency p{margin:0;font-size:12px;color:#555;line-height:1.5}' +
    '.doc-logo img{height:72px;width:72px;border-radius:50%;object-fit:cover}' +
    '.doc-section-title{font-size:17px;font-weight:800;margin:18px 0 10px;color:#1e293b}' +
    '.passenger-info h3,.flight-info h3{font-size:14px;margin:14px 0 6px;color:#1e293b}' +
    'table{width:100%;border-collapse:collapse;font-size:12px;margin-bottom:14px}' +
    'th{text-align:left;background:#b2dce8;padding:8px 7px;border:1px solid #8ec5d6;font-size:12px}' +
    'td{padding:8px 7px;border-bottom:1px solid #d9e1e4;vertical-align:top}' +
    'footer{border-top:1px solid #d9e1e4;margin-top:24px;padding-top:10px;font-size:11px;color:#64748b}' +
    '.fare-data{margin-top:16px;font-size:13px}' +
    '.fare-data div{display:flex;justify-content:space-between;padding:4px 0;border-bottom:1px dashed #e2e8f0}' +
    '.page-break{padding-bottom:20px}';
  const fullHTML = '<!doctype html><html><head><title>GDS Training Hub - Electronic Ticket</title><style>' +
    cssText + '</style></head><body>' + bodyContent + '</body></html>';

  // Electron desktop: use native Save dialog for real PDF
  if (window.gellelioDesktop && window.gellelioDesktop.savePDF) {
    const locator = state.locator || 'Itinerary';
    window.gellelioDesktop.savePDF(fullHTML, locator).then(function(result) {
      if (result && result.error) { alert('PDF save error: ' + result.error); }
    }).catch(function(err) { alert('PDF save error: ' + err); });
    return;
  }

  // Browser / Android: open print dialog (user can "Save as PDF" from browser)
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    // Fallback: use hidden iframe
    var iframe = document.createElement('iframe');
    iframe.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:900px;height:700px';
    document.body.appendChild(iframe);
    iframe.contentDocument.write(fullHTML + '<script>window.onload=function(){window.print();}<\/script>');
    iframe.contentDocument.close();
    setTimeout(function() { document.body.removeChild(iframe); }, 15000);
    return;
  }
  printWindow.document.write(fullHTML + '<script>window.onload=function(){window.print();}<\/script>');
  printWindow.document.close();
}

function openBrands(flight, bookingClass) {
  if (!brandPanel || !flight) return;
  const available = flight.classes && flight.classes[bookingClass];
  const families = [["Promotion International", "Q9  V9  G9  B9"], ["Saver International", "T9  L9  H9"], ["Freedom International", "Y9  M9  K9  N9"], ["Blue Ribbon International", "C9  D9  J9"]];
  document.getElementById("brandSegment").textContent = flight.line + " " + flight.origin + ">" + flight.destination;
  document.getElementById("brandFlight").textContent = flight.date + "  " + flight.origin + " " + flight.depart + " > " + flight.destination + " " + flight.arrive + " / " + flight.carrier + " " + flight.number;
  const familyEl = document.getElementById("brandFamilies");
  familyEl.innerHTML = "";
  families.forEach(function(family, index) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "brand-family" + (index === 2 ? " active" : "");
    item.innerHTML = "<b>" + escapeItinerary(family[0]) + "</b><span>" + escapeItinerary(family[1]) + "</span>";
    familyEl.appendChild(item);
  });
  document.getElementById("brandHero").innerHTML = "<div class='brand-logo'>" + escapeItinerary(flight.carrier) + "</div><div><b>" + escapeItinerary(flight.carrier) + " " + escapeItinerary(flight.number) + "</b><span>" + escapeItinerary(flight.date) + "<br>" + escapeItinerary(flight.origin) + " " + escapeItinerary(flight.depart) + "  &gt;  " + escapeItinerary(flight.destination) + " " + escapeItinerary(flight.arrive) + "</span></div>";
  document.getElementById("brandDescription").innerHTML = "<h3>Currently viewing " + escapeItinerary(bookingClass) + " Class</h3><p><b>" + (available === "C" ? "Waitlist only" : escapeItinerary(available == null ? "" : available) + " seats available") + "</b></p><p>Economy fare brand for " + escapeItinerary(flight.airline_full || "the operating carrier") + ". Confirm fare rules and ticketing conditions before selling.</p><ul><li>Cabin baggage allowance included</li><li>Seat selection subject to availability</li><li>Changes and refund rules vary by fare</li><li>Meals and special services by carrier policy</li></ul>";
  const items = [["▣", "Baggage Allowance", "Included"], ["▰", "Hand-carry Allowance", "Included"], ["◆", "CHANGE FEE", "Varies based on flight"], ["!", "Rebooking", "Varies based on flight"], ["▾", "Pre Reserved Seat", "Available"], ["♨", "Inflight Meal", "Carrier policy"]];
  document.getElementById("brandAncillaries").innerHTML = items.map(function(item) { return "<div class='ancillary'><i>" + item[0] + "</i><b>" + item[1] + "</b><span>" + item[2] + "</span></div>"; }).join("");
  brandPanel.hidden = false;
}

if (historyMenu) historyMenu.addEventListener("click", openHistory);
if (historyTool) historyTool.addEventListener("click", openHistory);
if (itineraryTool) itineraryTool.addEventListener("click", openItinerary);
document.getElementById("itineraryClose")?.addEventListener("click", closeItinerary);
document.getElementById("itineraryPreview")?.addEventListener("click", renderItineraryPreview);
document.getElementById("itineraryPrint")?.addEventListener("click", printItinerary);
["includeFare", "onePage", "showFareBasis", "showClass", "showCabin", "showBaggage", "itineraryPassenger"].forEach(function(id) {
  document.getElementById(id)?.addEventListener("change", function() {
    if (itineraryPanel && !itineraryPanel.hidden) renderItineraryPreview();
  });
});
document.getElementById("brandClose")?.addEventListener("click", closeBrands);
document.getElementById("brandCloseFooter")?.addEventListener("click", closeBrands);
if (historyPanel) historyPanel.addEventListener("click", function(e) {
  if (e.target === historyPanel) closeHistory();
});
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape" && historyPanel && !historyPanel.hidden) closeHistory();
  if (e.key === "Escape" && brandPanel && !brandPanel.hidden) closeBrands();
  if (e.key === "Escape" && itineraryPanel && !itineraryPanel.hidden) closeItinerary();
  if (e.key === "Escape" && assistedTicketingPanel && !assistedTicketingPanel.hidden) closeAssistedTicketing();

  // Ctrl+S or Ctrl+L → Clear right terminal output panel only (left panel stays)
  if ((e.ctrlKey || e.metaKey) && (e.key === "s" || e.key === "S" || e.key === "l" || e.key === "L")) {
    // Only clear if not typing inside a modal/panel input
    const active = document.activeElement;
    const inModal = active && active.closest(
      "#historyPanel, #itineraryPanel, #brandPanel, #assistedTicketingPanel, .ticket-modal-backdrop"
    );
    if (!inModal) {
      e.preventDefault();
      clearScreen();
      inputEl.focus();
    }
  }
});

// ── ASSISTED TICKETING (GRAPHICAL REFUND & EXCHANGE) ──
let currentAtData = { tab: "refund", tkt: null };

function getActiveTicketForAt(preferredTab) {
  const s = engine.state;
  if (s.issuedTicket) return s.issuedTicket;
  if (engine.lastSavedPnr && engine.lastSavedPnr.issuedTicket) return engine.lastSavedPnr.issuedTicket;
  return null;
}

function openAssistedTicketing(tab) {
  tab = tab || "refund";
  if (!assistedTicketingPanel) return;
  currentAtData.tab = tab;
  const activeTkt = getActiveTicketForAt(tab);
  currentAtData.tkt = activeTkt;
  const tkt = activeTkt || { ticketNumber:"", paxName:"", issueDate:"", carrier:"", baseFare:0, taxes:[], total:0, status:"RETRIEVE OR ENTER TICKET" , coupons:[] };

  const tabRefund = document.getElementById("atTabRefund");
  const tabExchange = document.getElementById("atTabExchange");
  const tabVoid = document.getElementById("atTabVoid");
  const paneRefund = document.getElementById("atPaneRefund");
  const paneExchange = document.getElementById("atPaneExchange");
  const paneVoid = document.getElementById("atPaneVoid");

  [tabRefund, tabExchange, tabVoid].forEach(t => t?.classList.remove("active"));
  [paneRefund, paneExchange, paneVoid].forEach(p => p?.classList.remove("active"));

  if (tab === "exchange") {
    tabExchange?.classList.add("active");
    paneExchange?.classList.add("active");
  } else if (tab === "void") {
    tabVoid?.classList.add("active");
    paneVoid?.classList.add("active");
  } else {
    tabRefund?.classList.add("active");
    paneRefund?.classList.add("active");
  }

  const pnrVal = engine.state.locator || "";
  const refPnr = document.getElementById("atRefundPnr");
  const refTkt = document.getElementById("atRefundTkt");
  const refPax = document.getElementById("atRefundPax");
  const refDate = document.getElementById("atRefundDate");
  const refRoute = document.getElementById("atRefundRoute");

  if (refPnr) refPnr.value = pnrVal;
  if (refTkt) refTkt.value = tkt.ticketNumber;
  if (refPax) refPax.value = "1.1 " + tkt.paxName;
  if (refDate) refDate.value = tkt.issueDate || "";
  const routes = (tkt.coupons || []).map(c => "CPN " + c.cpn + ": " + c.route + " (" + (c.statusDesc || c.status) + ")").join(" | ");
  if (refRoute) refRoute.value = routes || "";

  const typePartial = document.getElementById("atTypePartial");
  const typeUnused = document.getElementById("atTypeUnused");
  const partialControls = document.getElementById("atPartialControls");

  if (tkt.isPartial || (tkt.coupons && tkt.coupons.some(c => c.status === "F"))) {
    if (typePartial) typePartial.checked = true;
    if (partialControls) partialControls.hidden = false;
  } else {
    if (typeUnused) typeUnused.checked = true;
    if (partialControls) partialControls.hidden = true;
  }

  const penaltyInput = document.getElementById("atRefundPenaltyInput");
  const defaultPenalty = tkt.carrier === "BG" ? (tkt.isPartial ? 3000 : 1000) : (tkt.carrier ? 5000 : 0);
  if (penaltyInput) penaltyInput.value = defaultPenalty;

  const flownFareInput = document.getElementById("atFlownFareInput");
  const flownTaxInput = document.getElementById("atFlownTaxInput");
  if (flownFareInput) flownFareInput.value = tkt.flownBaseFare || "";
  if (flownTaxInput) flownTaxInput.value = tkt.flownTaxes || "";
  const hasStoredPartialAllocation = Number.isFinite(Number(tkt.flownBaseFare)) && Number.isFinite(Number(tkt.flownTaxes));
  if (flownFareInput) flownFareInput.readOnly = !!(tkt.isPartial && hasStoredPartialAllocation);
  if (flownTaxInput) flownTaxInput.readOnly = !!(tkt.isPartial && hasStoredPartialAllocation);

  const exchPnr = document.getElementById("atExchPnr");
  const exchTkt = document.getElementById("atExchTkt");
  const exchPax = document.getElementById("atExchPax");
  const exchOrigPaid = document.getElementById("atExchOrigPaid");
  const exchTaxBreakdown = document.getElementById("atExchTaxBreakdown");
  const exchNewBase = document.getElementById("atExchNewBase");
  const exchFareDiff = document.getElementById("atExchFareDiff");
  const exchPenalty = document.getElementById("atExchPenalty");
  const exchTaxDiff = document.getElementById("atExchTaxDiff");
  const exchTypeUnused = document.getElementById("atExchTypeUnused");
  const exchTypePartial = document.getElementById("atExchTypePartial");
  const exchangeIsPartial = !!(tkt.isPartial || (tkt.coupons && tkt.coupons.some(c => c.status === "F")));
  if (exchTypePartial) exchTypePartial.checked = exchangeIsPartial;
  if (exchTypeUnused) exchTypeUnused.checked = !exchangeIsPartial;
  const exchangeBasis = getAssistedExchangeBasis(tkt, exchangeIsPartial);

  if (exchPnr) exchPnr.value = pnrVal;
  if (exchTkt) exchTkt.value = tkt.ticketNumber;
  if (exchPax) exchPax.value = "1.1 " + tkt.paxName;
  if (exchOrigPaid) exchOrigPaid.value = exchangeBasis.error ? exchangeBasis.error : "BDT " + exchangeBasis.total.toLocaleString() + (exchangeIsPartial ? " (UNUSED COUPON ONLY)" : "");
  if (exchTaxBreakdown) exchTaxBreakdown.value = (tkt.taxes || []).map(tax => `${tax.code} BDT ${Number(tax.amount || 0).toLocaleString()}`).join(" | ") || "No itemized taxes";
  const newBase = activeTkt && !exchangeBasis.error ? exchangeBasis.base + 5000 : "";
  if (exchNewBase) exchNewBase.value = newBase;
  if (exchFareDiff) exchFareDiff.value = activeTkt ? 5000 : "";
  if (exchPenalty) exchPenalty.value = activeTkt ? (tkt.carrier === "BG" ? 2000 : 3000) : "";
  if (exchTaxDiff) exchTaxDiff.value = activeTkt ? 1500 : "";

  // Populate Void Tab
  const voidPnr = document.getElementById("atVoidPnr");
  const voidTkt = document.getElementById("atVoidTkt");
  const voidPax = document.getElementById("atVoidPax");
  const voidDate = document.getElementById("atVoidDate");
  const voidStatus = document.getElementById("atVoidStatus");
  const sumVoidGross = document.getElementById("atSumVoidGross");
  const sumVoidTotal = document.getElementById("atSumVoidTotal");

  if (voidPnr) voidPnr.value = pnrVal;
  if (voidTkt) voidTkt.value = tkt.ticketNumber;
  if (voidPax) voidPax.value = "1.1 " + tkt.paxName;
  if (voidDate) voidDate.value = tkt.issueDate || "";
  if (voidStatus) voidStatus.value = tkt.status || "RETRIEVE OR ENTER TICKET";
  if (sumVoidGross) sumVoidGross.textContent = "BDT " + Number(tkt.total || 0).toLocaleString();
  if (sumVoidTotal) sumVoidTotal.textContent = "BDT " + Number(tkt.total || 0).toLocaleString();

  recalcAtRefund();
  recalcAtExchange();

  assistedTicketingPanel.hidden = false;
}

function closeAssistedTicketing() {
  if (assistedTicketingPanel) assistedTicketingPanel.hidden = true;
  if (inputEl) inputEl.focus();
}

// Only the unflown portion of a partially used ticket may be exchanged.
// Keeping this calculation in one place prevents the graphical rapid-reprice
// preview and the issued exchange notice from using different values.
function getAssistedExchangeBasis(tkt, isPartial) {
  const fullBase = Number(tkt?.baseFare || 0);
  const fullTaxes = (tkt?.taxes || []).reduce((sum, tax) => sum + (Number(tax.amount) || 0), 0);
  if (!isPartial) return { base: fullBase, taxes: fullTaxes, total: Number(tkt?.total || (fullBase + fullTaxes)), partial: false };
  const base = Number(tkt?.unusedBaseFare);
  const taxes = Number(tkt?.unusedTaxes);
  if (!Number.isFinite(base) || !Number.isFinite(taxes)) return { error: "PARTIAL RAPID REPRICE REQUIRES UNUSED COUPON FARE/TAX ALLOCATION" };
  return { base, taxes, total: base + taxes, partial: true };
}

function recalcAtRefund() {
  const tkt = currentAtData.tkt || getActiveTicketForAt("refund");
  if (!tkt) return;
  const typePartial = document.getElementById("atTypePartial");
  const isPartial = typePartial ? typePartial.checked : false;
  const penaltyInput = document.getElementById("atRefundPenaltyInput");
  const penalty = Math.max(0, Number(penaltyInput ? penaltyInput.value : 1000) || 0);

  const base = tkt.baseFare || 3200;
  const total = tkt.total || (base + 725);
  const taxes = total - base;

  let flownBase = 0;
  let flownTaxes = 0;
  let refundableBase = 0;
  let refundableTaxes = taxes;

  const partialControls = document.getElementById("atPartialControls");
  const rowFlownFare = document.getElementById("atRowFlownFare");
  const rowFlownTax = document.getElementById("atRowFlownTax");
  const statusPreview = document.getElementById("atStatusPreview");

  if (isPartial) {
    if (partialControls) partialControls.hidden = false;
    if (rowFlownFare) rowFlownFare.hidden = false;
    if (rowFlownTax) rowFlownTax.hidden = false;

    const fFare = document.getElementById("atFlownFareInput");
    const fTax = document.getElementById("atFlownTaxInput");
    flownBase = Number.isFinite(Number(tkt.flownBaseFare)) ? Math.max(0, Number(tkt.flownBaseFare)) : Math.max(0, Number(fFare ? fFare.value : 0) || 0);
    flownTaxes = Number.isFinite(Number(tkt.flownTaxes)) ? Math.max(0, Number(tkt.flownTaxes)) : Math.max(0, Number(fTax ? fTax.value : 0) || 0);
    refundableBase = Math.max(0, (base - flownBase) - penalty);
    refundableTaxes = Math.max(0, taxes - flownTaxes);
    if (statusPreview) statusPreview.textContent = "PARTIALLY REFUNDED";
  } else {
    if (partialControls) partialControls.hidden = true;
    if (rowFlownFare) rowFlownFare.hidden = true;
    if (rowFlownTax) rowFlownTax.hidden = true;

    refundableBase = Math.max(0, base - penalty);
    refundableTaxes = taxes;
    if (statusPreview) statusPreview.textContent = "RFND (FULL)";
  }

  const netRefund = refundableBase + refundableTaxes;

  const sumGross = document.getElementById("atSumGross");
  const sumFlownFare = document.getElementById("atSumFlownFare");
  const sumBase = document.getElementById("atSumBase");
  const sumTax = document.getElementById("atSumTax");
  const sumTaxDetail = document.getElementById("atSumTaxDetail");
  const sumFlownTax = document.getElementById("atSumFlownTax");
  const sumRefTax = document.getElementById("atSumRefTax");
  const sumPenalty = document.getElementById("atSumPenalty");
  const sumNet = document.getElementById("atSumNet");

  if (sumGross) sumGross.textContent = "BDT " + total.toLocaleString();
  if (sumFlownFare) sumFlownFare.textContent = "- BDT " + flownBase.toLocaleString();
  if (sumBase) sumBase.textContent = "BDT " + (isPartial ? Math.max(0, base - flownBase) : base).toLocaleString();
  if (sumTax) sumTax.textContent = "BDT " + taxes.toLocaleString();
  if (sumTaxDetail) sumTaxDetail.textContent = (tkt.taxes || []).map(tax => `${tax.code} ${Number(tax.amount || 0).toLocaleString()}`).join(" | ") || "No itemized taxes";
  if (sumFlownTax) sumFlownTax.textContent = "- BDT " + flownTaxes.toLocaleString();
  if (sumRefTax) sumRefTax.textContent = "BDT " + refundableTaxes.toLocaleString();
  if (sumPenalty) sumPenalty.textContent = "- BDT " + penalty.toLocaleString();
  if (sumNet) sumNet.textContent = "BDT " + netRefund.toLocaleString();
}

function recalcAtExchange() {
  const tkt = currentAtData.tkt || getActiveTicketForAt("exchange");
  if (!tkt) return;
  const typePartial = document.getElementById("atExchTypePartial");
  const isPartial = typePartial ? typePartial.checked : false;
  const basis = getAssistedExchangeBasis(tkt, isPartial);
  if (basis.error) {
    const quoteStatus = document.getElementById("atExchQuoteStatus");
    if (quoteStatus) quoteStatus.textContent = basis.error;
    return;
  }
  const origBase = basis.base;
  const origTaxes = basis.taxes;
  const origTotal = basis.total;
  const fareDiffInput = document.getElementById("atExchFareDiff");
  const newBaseInput = document.getElementById("atExchNewBase");
  const penaltyInput = document.getElementById("atExchPenalty");
  const taxDiffInput = document.getElementById("atExchTaxDiff");

  const enteredFareDiff = Number(fareDiffInput ? fareDiffInput.value : 0) || 0;
  const newBase = Math.max(0, Number(newBaseInput ? newBaseInput.value : origBase + enteredFareDiff) || 0);
  const fareDiff = newBase - origBase;
  const penalty = Math.max(0, Number(penaltyInput ? penaltyInput.value : 0) || 0);
  const taxDiff = Number(taxDiffInput ? taxDiffInput.value : 0) || 0;
  const newTaxes = Math.max(0, origTaxes + taxDiff);
  const newTotal = newBase + newTaxes;
  const settlement = fareDiff + taxDiff + penalty;

  const sumOrig = document.getElementById("atSumExchOrig");
  const sumNew = document.getElementById("atSumExchNew");
  const sumDiff = document.getElementById("atSumExchFareDiff");
  const sumTaxDiff = document.getElementById("atSumExchTaxDiff");
  const sumPen = document.getElementById("atSumExchPenalty");
  const sumAdd = document.getElementById("atSumExchAddCollect");

  if (sumOrig) sumOrig.textContent = "BDT " + origTotal.toLocaleString();
  if (sumNew) sumNew.textContent = "BDT " + newTotal.toLocaleString();
  if (sumDiff) sumDiff.textContent = "BDT " + fareDiff.toLocaleString();
  if (sumTaxDiff) sumTaxDiff.textContent = "BDT " + taxDiff.toLocaleString();
  if (sumPen) sumPen.textContent = "BDT " + penalty.toLocaleString();
  if (sumAdd) sumAdd.textContent = (settlement < 0 ? "REFUND/RESIDUAL BDT " : "ADD COLLECT BDT ") + Math.abs(settlement).toLocaleString();
  const quoteStatus = document.getElementById("atExchQuoteStatus");
  if (quoteStatus) quoteStatus.textContent = `${isPartial ? "PARTIAL" : "UNUSED"} RAPID REPRICE READY: ${isPartial ? "flown coupon excluded; " : ""}review the simulated quote before issue.`;
}

function resolveAssistedTicket(inputId) {
  const entered = (document.getElementById(inputId)?.value || "").trim();
  const tkt = engine.findTicket(entered);
  if (!tkt) {
    setScreen("TICKET NOT FOUND - RETRIEVE A TICKETED PNR OR ENTER A VALID TRAINING TICKET NUMBER", "error");
    return null;
  }
  currentAtData.tkt = tkt;
  return tkt;
}

function submitAtRefund() {
  const tkt = resolveAssistedTicket("atRefundTkt");
  if (!tkt) return;
  const typePartial = document.getElementById("atTypePartial");
  const isPartial = typePartial ? typePartial.checked : false;
  const penaltyInput = document.getElementById("atRefundPenaltyInput");
  const waiverInput = document.getElementById("atRefundWaiverInput");
  const fopInput = document.getElementById("atRefundFop");

  const penalty = Math.max(0, Number(penaltyInput ? penaltyInput.value : 1000) || 0);
  const waiver = waiverInput ? waiverInput.value.trim() : "";
  const fop = fopInput ? fopInput.value : "CASH";

  const base = tkt.baseFare || 3200;
  const total = tkt.total || (base + 725);
  const taxes = total - base;

  let flownBase = 0;
  let flownTaxes = 0;
  let refundableBase = 0;
  let refundableTaxes = taxes;

  if (isPartial) {
    const fFare = document.getElementById("atFlownFareInput");
    const fTax = document.getElementById("atFlownTaxInput");
    flownBase = Number.isFinite(Number(tkt.flownBaseFare)) ? Math.max(0, Number(tkt.flownBaseFare)) : Math.max(0, Number(fFare ? fFare.value : 0) || 0);
    flownTaxes = Number.isFinite(Number(tkt.flownTaxes)) ? Math.max(0, Number(tkt.flownTaxes)) : Math.max(0, Number(fTax ? fTax.value : 0) || 0);
    refundableBase = Math.max(0, (base - flownBase) - penalty);
    refundableTaxes = Math.max(0, taxes - flownTaxes);
  } else {
    refundableBase = Math.max(0, base - penalty);
    refundableTaxes = taxes;
  }
  const netRefund = refundableBase + refundableTaxes;

  const res = engine.processAssistedRefund({
    ticketNumber: tkt.ticketNumber,
    paxName: tkt.paxName,
    refundType: isPartial ? "partial" : "unused",
    grossFare: total,
    basePaid: base,
    taxesPaid: taxes,
    flownFare: flownBase,
    flownTaxes: flownTaxes,
    refundableBase: refundableBase,
    refundableTaxes: refundableTaxes,
    penalty: penalty,
    netRefund: netRefund,
    waiver: waiver,
    fop: fop
  });

  closeAssistedTicketing();
  setScreen(res.lines.join("\n"), res.kind);
  update();
}

function submitAtExchange() {
  const tkt = resolveAssistedTicket("atExchTkt");
  if (!tkt) return;
  const typePartial = document.getElementById("atExchTypePartial");
  const isPartial = typePartial ? typePartial.checked : false;
  const basis = getAssistedExchangeBasis(tkt, isPartial);
  if (basis.error) {
    setScreen(basis.error, "error");
    return;
  }

  const origBase = basis.base;
  const origTaxes = basis.taxes;
  const origTotal = basis.total;
  const newBaseInput = document.getElementById("atExchNewBase");
  const fareDiffInput = document.getElementById("atExchFareDiff");
  const penaltyInput = document.getElementById("atExchPenalty");
  const taxDiffInput = document.getElementById("atExchTaxDiff");
  const fopInput = document.getElementById("atExchFop");

  const enteredFareDiff = Number(fareDiffInput ? fareDiffInput.value : 0) || 0;
  const newBase = Math.max(0, Number(newBaseInput ? newBaseInput.value : origBase + enteredFareDiff) || 0);
  const fareDiff = newBase - origBase;
  const penalty = Math.max(0, Number(penaltyInput ? penaltyInput.value : 0) || 0);
  const taxDiff = Number(taxDiffInput ? taxDiffInput.value : 0) || 0;
  const newTaxes = Math.max(0, origTaxes + taxDiff);
  const newTotal = newBase + newTaxes;
  const addCollect = fareDiff + taxDiff + penalty;
  const fop = fopInput ? fopInput.value : "EXCH + CASH";

  const res = engine.processAssistedExchange({
    ticketNumber: tkt.ticketNumber,
    paxName: tkt.paxName,
    exchangeType: isPartial ? "partial" : "unused",
    originalFare: origTotal,
    originalBase: origBase,
    originalTaxes: origTaxes,
    newBase: newBase,
    newTaxes: newTaxes,
    newFare: newTotal,
    fareDiff: fareDiff,
    taxDiff: taxDiff,
    penalty: penalty,
    addCollect: addCollect,
    fop: fop
  });

  closeAssistedTicketing();
  setScreen(res.lines.join("\n"), res.kind);
  update();
}

// Attach Assisted Ticketing listeners
if (assistedTicketingTool) assistedTicketingTool.addEventListener("click", () => openAssistedTicketing("refund"));
if (toolsMenu) toolsMenu.addEventListener("click", () => openAssistedTicketing("refund"));
document.getElementById("atClose")?.addEventListener("click", closeAssistedTicketing);
document.getElementById("atCloseFooter")?.addEventListener("click", closeAssistedTicketing);
document.getElementById("atTabRefund")?.addEventListener("click", () => openAssistedTicketing("refund"));
document.getElementById("atTabExchange")?.addEventListener("click", () => openAssistedTicketing("exchange"));
document.getElementById("atTypeUnused")?.addEventListener("change", recalcAtRefund);
document.getElementById("atTypePartial")?.addEventListener("change", recalcAtRefund);
document.getElementById("atRefundPenaltyInput")?.addEventListener("input", recalcAtRefund);
document.getElementById("atFlownFareInput")?.addEventListener("input", recalcAtRefund);
document.getElementById("atFlownTaxInput")?.addEventListener("input", recalcAtRefund);
document.getElementById("atBtnCalcRefund")?.addEventListener("click", recalcAtRefund);
document.getElementById("atBtnProcessRefund")?.addEventListener("click", submitAtRefund);

document.getElementById("atExchTypeUnused")?.addEventListener("change", recalcAtExchange);
document.getElementById("atExchTypePartial")?.addEventListener("change", recalcAtExchange);
document.getElementById("atExchNewBase")?.addEventListener("input", () => {
  const tkt = currentAtData.tkt || getActiveTicketForAt("exchange");
  if (!tkt) return;
  const isPartial = document.getElementById("atExchTypePartial")?.checked;
  const basis = getAssistedExchangeBasis(tkt, isPartial);
  if (basis.error) return;
  const value = Number(document.getElementById("atExchNewBase").value) || 0;
  document.getElementById("atExchFareDiff").value = value - basis.base;
  recalcAtExchange();
});
document.getElementById("atExchFareDiff")?.addEventListener("input", () => {
  const tkt = currentAtData.tkt || getActiveTicketForAt("exchange");
  if (!tkt) return;
  const isPartial = document.getElementById("atExchTypePartial")?.checked;
  const basis = getAssistedExchangeBasis(tkt, isPartial);
  if (basis.error) return;
  const diff = Number(document.getElementById("atExchFareDiff").value) || 0;
  document.getElementById("atExchNewBase").value = basis.base + diff;
  recalcAtExchange();
});
document.getElementById("atExchPenalty")?.addEventListener("input", recalcAtExchange);
document.getElementById("atExchTaxDiff")?.addEventListener("input", recalcAtExchange);
document.getElementById("atBtnCalcExchange")?.addEventListener("click", recalcAtExchange);
document.getElementById("atBtnProcessExchange")?.addEventListener("click", submitAtExchange);

function submitAtVoid() {
  const tkt = resolveAssistedTicket("atVoidTkt");
  if (!tkt) return;
  const reasonSelect = document.getElementById("atVoidReason");
  const reason = reasonSelect ? reasonSelect.value : "AGENCY BOOKING ERROR";

  const res = engine.processAssistedVoid({
    ticketNumber: tkt.ticketNumber,
    paxName: tkt.paxName,
    total: tkt.total,
    reason: reason
  });

  closeAssistedTicketing();
  setScreen(res.lines.join("\n"), res.kind);
  update();
}

document.getElementById("atTabVoid")?.addEventListener("click", () => openAssistedTicketing("void"));
document.getElementById("atBtnProcessVoid")?.addEventListener("click", submitAtVoid);


function showTip(text, x, y) {
  if (!tipEl || !text) return;
  tipEl.textContent = text;
  tipEl.hidden = false;
  const wrap = tipEl.parentElement.getBoundingClientRect();
  const left = Math.min(Math.max(8, x - wrap.left + 12), wrap.width - 200);
  const top  = Math.min(Math.max(40, y - wrap.top + 12), wrap.height - 80);
  tipEl.style.left = left + "px";
  tipEl.style.top  = top + "px";
}

function showFlightDetails(flight, bookingClass) {
  if (!flight || !leftMsg) return;
  const availability = flight.classes && flight.classes[bookingClass];
  const seatStatus = availability === "C" ? "CLOSED / WAITLIST" :
    (availability === 0 ? "WAITLIST ONLY" : availability + " SEATS AVAILABLE");
  const notes = (flight.notes && flight.notes.length) ? flight.notes : [
    "CHECK FARE RULES, BAGGAGE AND TICKET TIME LIMIT BEFORE SELLING.",
    "USE N" + flight.line + bookingClass + "1 TO SELL ONE SEAT IN THIS CLASS."
  ];
  const detailLines = [
    "FLIGHT / CLASS DETAILS",
    "",
    flight.line + ". " + flight.carrier + " " + flight.number + "  " + (flight.airline_full || "OPERATING CARRIER"),
    "BOOKING CLASS " + bookingClass + "  " + seatStatus,
    "",
    "DATE       " + flight.date + "   OPERATING " + (flight.freq || "DAILY"),
    "ROUTE      " + flight.origin + "  -  " + flight.destination,
    "DEPARTS    " + flight.depart + "  TERMINAL " + (flight.termOrig || "1"),
    "ARRIVES    " + flight.arrive + "  TERMINAL " + (flight.termDest || "1"),
    "AIRCRAFT   " + (flight.equip || "SEE CARRIER"),
    "STATUS     CONFIRM ON AVAILABILITY",
    "",
    "TRAVEL INFORMATION",
    "------------------"
  ].concat(notes).concat([
    "",
    "COMMAND: N" + flight.line + bookingClass + "1  (SELL 1 SEAT)",
    "CLICK ANOTHER CLASS TO VIEW ITS DETAILS"
  ]);
  setLeftPane(detailLines, true);
}

function renderAvailability(resp) {
  clearScreen();
  setTerminalMode("avail");
  const container = getTerminalContainer();

  const header = document.createElement("pre");
  header.className = "output avail-header";
  header.textContent = resp.header || "";
  container.appendChild(header);

  (resp.flights || []).forEach(function(f) {
    const parts = GalileoFlights.formatParts(f);
    const block = document.createElement("div");
    block.className = "avail-block";
    block.dataset.notes = (f.notes || []).join("\n");

    const line = document.createElement("div");
    line.className = "avail-line";
    line.append(
      span("gds-ln", parts.ln + " "),
      span("gds-city", parts.orig + " "),
      span("gds-city", parts.dest + " "),
      span("gds-time", parts.times),
      span("gds-al", parts.flt + " ")
    );

    const classEntries = Object.entries(f.classes || {});
    function appendClass(entry, target) {
      const bookingClass = entry[0];
      const availability = String(entry[1]);
      const classButton = document.createElement("button");
      classButton.type = "button";
      let statusCls = "";
      if (availability === "C" || availability === "0") {
        statusCls = " closed";
      } else if (availability === "R") {
        statusCls = " request";
      }
      classButton.className = "gds-cls" + statusCls;
      classButton.textContent = bookingClass + availability;
      classButton.title = "Sell 1 seat in " + bookingClass + " class (Line " + f.line + ")";
      classButton.addEventListener("click", function(e) {
        e.stopPropagation();
        if (availability === "C" || availability === "0") return;
        terminal.querySelectorAll(".gds-cls.selected").forEach(function(el) { el.classList.remove("selected"); });
        classButton.classList.add("selected");
        processCommand("N1" + bookingClass + f.line);
      });
      target.appendChild(classButton);
      target.appendChild(document.createTextNode(" "));
    }

    // Line 1 gets up to 10 classes
    const line1Classes = classEntries.slice(0, 10);
    const overflowClasses = classEntries.slice(10);
    line1Classes.forEach(function(entry) { appendClass(entry, line); });

    line.append(span("gds-eq", parts.equip + " "), span("gds-flag", parts.flag));
    block.appendChild(line);

    // Extra rows for classes or brand
    const extraRows = [...(f.rows || [])];
    if (overflowClasses.length && !extraRows.length) {
      extraRows.push(overflowClasses.map(([k, v]) => `${k}${v}`).join(" "));
    }

    if (extraRows.length) {
      extraRows.forEach(function(row, rIdx) {
        const rLine = document.createElement("div");
        rLine.className = "avail-line";
        let leadLen = 0;
        if (f.brand && rIdx === 0) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "gds-b";
          b.textContent = "\u00abB\u00bb";
          rLine.appendChild(document.createTextNode("   "));
          rLine.appendChild(b);
          leadLen = 6;
        }
        const padSpaces = " ".repeat(Math.max(1, 41 - leadLen));
        rLine.appendChild(document.createTextNode(padSpaces));

        const rowTokens = row.trim().split(/\s+/);
        rowTokens.forEach(function(tok) {
          const m = tok.match(/^([A-Z])([0-9A-Z])$/);
          if (m) {
            appendClass([m[1], m[2]], rLine);
          } else {
            rLine.appendChild(span("gds-row2", tok + " "));
          }
        });
        block.appendChild(rLine);
      });
    } else if (f.brand) {
      const bLine = document.createElement("div");
      bLine.className = "avail-line";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gds-b";
      btn.textContent = "\u00abB\u00bb";
      bLine.appendChild(document.createTextNode("   "));
      bLine.appendChild(btn);
      block.appendChild(bLine);
    }

    container.appendChild(block);
  });

  if (resp.hasMore !== false) {
    const moreWrap = document.createElement("div");
    moreWrap.className = "avail-line";
    const more = document.createElement("button");
    more.type = "button";
    more.className = "gds-more";
    more.textContent = "«More Flights»";
    more.addEventListener("click", function() { processCommand("MD"); });
    moreWrap.appendChild(more);
    container.appendChild(moreWrap);
  }

  terminal.scrollTop = 0;
}

function renderFare(resp) {
  clearScreen();
  setTerminalMode("fare");
  const output = document.createElement("div");
  output.className = "fare-output";
  let fareOptionIndex = -1;
  (resp.lines || []).forEach(function(line) {
    const row = document.createElement("div");
    row.className = "fare-row";
    // BOOK was historically emitted with a legacy character encoding. Match
    // the action word so both the old and normal terminal text remain usable.
    if (/BOOK/.test(line)) {
      row.classList.add("fare-book");
      const book = document.createElement("button");
      book.type = "button";
      book.className = "fare-book-button";
      book.textContent = line;
      const selectedOption = fareOptionIndex;
      book.addEventListener("click", function() { bookFareShopOption(selectedOption); });
      row.appendChild(book);
      output.appendChild(row);
      return;
    }
    if (/^PRICING OPTION/.test(line)) { row.classList.add("fare-label"); fareOptionIndex++; }
    if (/^ADT|^TTL OF/.test(line)) row.classList.add("fare-label");
    if (/TOTAL AMOUNT/.test(line)) row.classList.add("fare-total");
    if (/^\d+\s/.test(line)) row.classList.add("fare-flight");
    if (/^«BOOK»/.test(line)) row.classList.add("fare-book");
    if (/D  R/.test(line)) row.classList.add("fare-actions");
    if (/TOTAL AMOUNT/.test(line)) {
      const parts = line.split("TOTAL AMOUNT");
      row.appendChild(document.createTextNode(parts[0] + "TOTAL AMOUNT"));
      const total = document.createElement("span");
      total.className = "fare-total-value";
      total.textContent = parts[1].trim();
      row.appendChild(total);
    } else if (/^«BOOK»/.test(line)) {
      const book = document.createElement("button");
      book.type = "button";
      book.className = "fare-book-button";
      book.textContent = line;
      const selectedOption = fareOptionIndex;
      book.addEventListener("click", function() { bookFareShopOption(selectedOption); });
      row.appendChild(book);
    } else {
      row.textContent = line || " ";
    }
    output.appendChild(row);
  });
  getTerminalContainer().appendChild(output);
  terminal.scrollTop = 0;
}

function bookFareShopOption(index) {
  const option = engine.state.fare && engine.state.fare.options && engine.state.fare.options[index];
  if (!option) {
    setScreen("FARE OPTION NOT AVAILABLE - PLEASE SEARCH AGAIN", "error");
    return;
  }
  const selectedLegs = option.legs.concat(engine.state.fare.roundTrip ? option.returnLegs : []);
  // Fare Shop can be opened before or after passenger names are entered.
  // Keep the booked segment count aligned with the actual seated party in
  // either case; infants do not occupy a seat.
  const fareParty = (engine.state.fare.passengers.adt || 0) + (engine.state.fare.passengers.chd || 0);
  const namedSeatPassengers = (engine.state.names || []).filter(function(name) {
    return !String(name).replace(/^\d+-/, '').toUpperCase().startsWith('I/');
  }).length;
  const bookedSeatCount = Math.max(1, fareParty, namedSeatPassengers);
  const segments = selectedLegs.map(function(leg, index) {
    const termDest = (leg.destination === "SIN") ? "3" : "1";
    return {
      segNum: index + 1, carrier: String(leg.carrier || "").replace("#", ""), number: leg.number,
      soldClass: option.cls, date: leg.date, origin: leg.origin, destination: leg.destination,
      depart: leg.depart, arrive: leg.arrive, termOrig: "1", termDest: termDest,
      paxCount: bookedSeatCount, heldSeats: bookedSeatCount, status: "HS",
      notes: [
        "DEPARTS " + leg.origin + " TERMINAL 1  - ARRIVES " + leg.destination + " TERMINAL " + termDest,
        "*APIS PAX DATA REQUIRED SSR DOCS*",
        "ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS",
        "PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION",
        "WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES",
        "FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES"
      ]
    };
  });
  const segment = segments[0];
  engine.state.segments = segments;
  engine.state.fare.selectedOption = index;
  const selectedTotal = option.partyTotal || option.total;
  engine.state.fare.total = selectedTotal;
  engine.state.fare.base = Math.round(selectedTotal / 1.21);
  engine.state.fare.taxes = selectedTotal - engine.state.fare.base;
  engine.state.priced = true;
  engine.state.filedFare = false;

  const soldLines = [
    "************************* SOLD SEGMENTS *************************"
  ];
  segments.forEach(function(item) {
    const arr = (item.arrive || "").replace("#", "");
    const dCode = getSegmentDayCode(item.date, item.depart, formatArriveTime(item.depart, item.arrive)) || "TH";
    soldLines.push(" 1. " + item.carrier.padEnd(2) + "  " + item.number.padStart(3) + " " + item.soldClass + " " + item.date + " " + item.origin + item.destination + " HS " + item.depart + "   " + arr + "          E " + dCode);
  });
  soldLines.push("DEPARTS " + segment.origin + " TERMINAL 1  - ARRIVES " + segment.destination + " TERMINAL " + (segment.destination === "SIN" ? "3" : "1"));
  soldLines.push("*APIS PAX DATA REQUIRED SSR DOCS*");
  soldLines.push("ADD ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS");
  soldLines.push("PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION");
  soldLines.push("WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES");
  soldLines.push("FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES");
  soldLines.push("");
  soldLines.push("************************** FILED FARE **************************");
  soldLines.push("NO PLATING CARRIER FOUND");

  setScreen(soldLines.join("\n"));

  renderLeftSegment(segment, [], true);
  leftSegmentHeader.innerHTML = segments.map(function(item) {
    const arriveStr = formatArriveTime(item.depart, item.arrive);
    const dayCode = getSegmentDayCode(item.date, item.depart, arriveStr);
    return '<span class="segment-number">' + item.segNum + '.</span> ' +
      '<span class="segment-airline">' + item.carrier + '</span>  ' + item.number + ' ' +
      '<span class="segment-class">' + item.soldClass + '</span> ' + item.date +
      ' <span class="segment-airline">' + item.origin + item.destination + '</span> ' +
      'HS' + (item.paxCount || 1) + '  ' + item.depart + '  ' + arriveStr + ' 0' +
      (dayCode ? ('      ' + dayCode) : '') + '<br>';
  }).join("");
  update();
  inputEl.focus();
}

function setLeftPane(lines, showButtons) {
  const text = Array.isArray(lines) ? lines.join("\n") : (lines || "");
  const ws = document.querySelector(".workspace");
  if (text.trim().length) {
    if (ws) ws.classList.add("split-view");
  }
  if (leftMsg) {
    leftMsg.textContent = text;
    leftMsg.hidden = !text.trim().length;
  }
  if (leftSegment) leftSegment.hidden = true;
  if (leftPassenger) leftPassenger.hidden = true;
  if (leftPnrHeader) leftPnrHeader.hidden = true;
  if (leftVendorBox) leftVendorBox.hidden = true;
  if (leftDetails) { leftDetails.innerHTML = ""; leftDetails.hidden = true; }
  if (leftBtns) leftBtns.style.display = "none";
  if (leftOsi) leftOsi.hidden = true;
}

function formatArriveTime(depart, arrive) {
  if (!arrive) return "";
  const arr = String(arrive).trim();
  if (arr.startsWith("#") || arr.startsWith("+") || arr.startsWith("-")) return arr;
  const depNum = parseInt(String(depart || "").replace(/\D/g, ""), 10);
  const arrNum = parseInt(arr.replace(/\D/g, ""), 10);
  if (!isNaN(depNum) && !isNaN(arrNum) && arrNum < depNum) {
    return "#" + arr;
  }
  return arr;
}

function getSegmentDayCode(dateStr, depart, arrive) {
  if (!dateStr) return "";
  const MONTHS = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
  const DAYS_2 = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  const m = String(dateStr).trim().toUpperCase().match(/^(\d{1,2})([A-Z]{3})(\d{2})?$/);
  if (!m) return "";
  const d = parseInt(m[1], 10);
  const mon = MONTHS[m[2]];
  if (mon === undefined) return "";
  const yr = m[3] ? 2000 + parseInt(m[3], 10) : new Date().getFullYear();
  const dt = new Date(yr, mon, d);
  const depDayIdx = dt.getDay();
  const depDay = DAYS_2[depDayIdx];

  let offset = 0;
  const arrStr = String(arrive || "").trim();
  if (arrStr.startsWith("#") || arrStr.startsWith("+1")) offset = 1;
  else if (arrStr.startsWith("+2")) offset = 2;
  else if (arrStr.startsWith("-1") || arrStr.startsWith("-")) offset = -1;
  else {
    const depNum = parseInt(String(depart || "").replace(/\D/g, ""), 10);
    const arrNum = parseInt(arrStr.replace(/\D/g, ""), 10);
    if (!isNaN(depNum) && !isNaN(arrNum) && arrNum < depNum) offset = 1;
  }

  const arrDayIdx = (depDayIdx + offset + 7) % 7;
  const arrDay = DAYS_2[arrDayIdx];
  if (offset !== 0 || depDay !== arrDay) {
    return depDay + "/" + arrDay;
  }
  return depDay;
}

function refreshLeftPnrHeader() {
  if (!leftPnrHeader) return;
  const s = engine.state;
  if (s.saved && s.locator) {
    const month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
    const now = new Date();
    const stamp = String(now.getDate()).padStart(2, "0") + month[now.getMonth()];
    const office = (s.officeId || "DACVS086JJ").replace(/^DAC(VS0)?/i, "") || "86JJ";
    const officeStr = office.includes("AR") ? office : (office + "AR");
    const city = (s.segments && s.segments[0] && s.segments[0].origin) || "DAC";
    const agencyLine = office + " - GELLELIO TRAVEL SERVICES   " + city;
    const pnrLine = s.locator + "/AR DACOU " + officeStr + " AG 42306891 " + stamp;
    leftPnrHeader.textContent = agencyLine + "\n" + pnrLine;
    leftPnrHeader.hidden = false;
  } else {
    leftPnrHeader.textContent = "";
    leftPnrHeader.hidden = true;
  }
}

function refreshLeftPassenger() {
  if (!leftPassenger) return;
  const rawNames = engine.state.names || [];
  if (!rawNames.length) {
    leftPassenger.hidden = true;
    leftPassenger.textContent = "";
    return;
  }

  const formattedItems = rawNames.map(function(item, idx) {
    const clean = item.replace(/^\d+-/, "");
    const infMatch = clean.match(/^I\/(?:(\d+))?(.*)$/);
    if (infMatch) {
      const ref = infMatch[1] || "1";
      return (idx + 1) + ".I/" + ref + infMatch[2];
    }
    return (idx + 1) + ".1" + clean;
  });

  // Pack items onto lines up to ~64 chars to match real Smartpoint
  const lines = [];
  let curLine = "";
  formattedItems.forEach(function(item) {
    if (!curLine) {
      curLine = item;
    } else if ((curLine + "  " + item).length <= 64) {
      curLine += "  " + item;
    } else {
      lines.push(curLine);
      curLine = item;
    }
  });
  if (curLine) lines.push(curLine);

  leftPassenger.textContent = lines.join("\n");
  leftPassenger.hidden = false;
}

function renderLeftSegment(seg, notes, hideNotes) {
  if (!seg || !leftSegment || !leftSegmentHeader || !leftSegmentNotes) return;
  const ws = document.querySelector(".workspace");
  if (ws) ws.classList.add("split-view");
  const segments = (engine.state.segments && engine.state.segments.length) ? engine.state.segments : [seg];

  const headerHtml = segments.map(function(s, idx) {
    const isConfirmed = (s.status === "HK" && engine.state.saved) || engine.state.saved;
    const status = (isConfirmed ? "HK" : (s.status || "HS")) + (s.heldSeats || s.paxCount || 1);
    const stopInd = isConfirmed ? "0*         E " : "O          ";
    const arriveStr = formatArriveTime(s.depart, s.arrive);
    const dayCode = getSegmentDayCode(s.date, s.depart, arriveStr);
    const num = s.segNum || (idx + 1);
    const flightNum = String(s.number).padStart(3, " ");
    return '<span class="segment-number">' + num + '.</span> ' +
      '<span class="segment-airline">' + s.carrier + '</span>  ' + flightNum + ' ' +
      '<span class="segment-class">' + s.soldClass + '</span> ' +
      s.date + ' <span class="segment-airline">' + s.origin + s.destination + '</span> ' +
      status + '  ' + s.depart + '  ' + arriveStr + '  ' + stopInd +
      (dayCode || 'SU');
  }).join("<br>");

  leftSegmentHeader.innerHTML = headerHtml;
  leftSegmentNotes.classList.remove("pnr-details");

  const activeSeg = seg || segments[0];
  const termOrig = activeSeg.termOrig || "1";
  const termDest = (activeSeg.destination === "SIN") ? "3" : (activeSeg.termDest || "1");
  const departsLine = "DEPARTS " + activeSeg.origin + " TERMINAL " + termOrig + "  - ARRIVES " + activeSeg.destination + " TERMINAL " + termDest;

  let lines = [departsLine];
  const segNotes = (notes && notes.length) ? notes : (activeSeg.notes || []);
  if (segNotes && segNotes.length) {
    segNotes.forEach(function(line) {
      if (!line.startsWith("DEPARTS") && !line.includes("APIS PAX DATA REQUIRED")) {
        lines.push(line);
      }
    });
  } else if (activeSeg.airline_full) {
    lines.push("*AIRCRAFT OWNER " + activeSeg.airline_full + "*");
    lines.push("*COCKPIT CREW " + activeSeg.airline_full + "*");
    lines.push("*MAX CONNECTION TIME IS 12 HRS*");
  }
  if (!lines.some(function(l) { return l.includes("ADVANCE PASSENGER") || l.includes("ADO ADVANCE"); })) {
    lines.push("ADO ADVANCE PASSENGER INFORMATION SSRS DOCA/DOCO/DOCS");
  }
  if (!lines.some(function(l) { return l.includes("PERSONAL DATA"); })) {
    lines.push("PERSONAL DATA WHICH IS PROVIDED TO US IN CONNECTION");
    lines.push("WITH YOUR TRAVEL MAY BE PASSED TO GOVERNMENT AUTHORITIES");
    lines.push("FOR BORDER CONTROL AND AVIATION SECURITY PURPOSES");
  }

  leftSegmentNotes.textContent = lines.join("\n");
  if (leftMsg) leftMsg.hidden = true;
  const hasName = !!(engine.state.names && engine.state.names.length);
  leftSegmentNotes.hidden = hideNotes !== undefined ? !!hideNotes : hasName;
  leftSegment.hidden = false;
  refreshLeftPnrHeader();
  refreshLeftPassenger();
  if (leftBtns) {
    refreshLeftButtons();
    leftBtns.style.display = "flex";
  }
  refreshLeftVendorBox();
  if (leftOsi) {
    if (engine.state.osk && engine.state.osk.length) {
      leftOsi.hidden = false;
      leftOsi.textContent = engine.state.osk.join("\n");
    } else {
      leftOsi.hidden = true;
      leftOsi.textContent = "";
    }
  }
}

function getVisibleLeftCommands() {
  const s = engine.state;
  if (!s.segments || !s.segments.length) return [];
  if (s.issued) {
    return ["*ALL", "*P", "*TD", "*FF", "*NP", "*VL", "*VR", "*SI", "*HTI", "*HTE", "*DV"];
  }
  const commands = ["*ALL"];
  if (s.phones && s.phones.length) commands.push("*P");
  if (s.ticketing) commands.push("*TD");
  if (s.filedFare || (s.filedFares && s.filedFares.length > 0)) commands.push("*FF");
  if (s.vendorLocator) commands.push("*VL");
  // *VR only appears after IR (justEnded=false). Real Smartpoint shows *VL immediately after
  // ER but defers *VR until the user runs IR — mirrored here by the justEnded flag.
  if (s.vendorRemarks && !s.justEnded) commands.push("*VR");
  if (s.ssr && s.ssr.length) commands.push("*SI");
  // *RV: In real Smartpoint:
  // 1. When creating new PNR (!s.saved): *RV is ALWAYS present.
  // 2. When saved PNR has uncommitted modifications (s.dirty): *RV is present at right end.
  // 3. Immediately after clean ER / IR: *RV is NOT present.
  if (!s.saved || s.dirty) commands.push("*RV");
  return commands;
}

function refreshLeftVendorBox() {
  if (!leftVendorBox) return;
  const s = engine.state;
  if (!s.segments || !s.segments.length) {
    leftVendorBox.hidden = true;
    return;
  }
  const lines = [];
  if (s.issued) {
    lines.push('<div class="vendor-exists-line">** FILED FARE DATA EXISTS **  <span class="cmd-link" data-cmd="*FF">&gt;*FF</span></div>');
    lines.push('<div class="vendor-exists-line">** VENDOR LOCATOR DATA EXISTS **  <span class="cmd-link" data-cmd="*VL">&gt;*VL</span></div>');
    lines.push('<div class="vendor-exists-line">** VENDOR REMARKS DATA EXISTS **  <span class="cmd-link" data-cmd="*VR">&gt;*VR</span></div>');
    lines.push('<div class="vendor-exists-line">** SERVICE INFORMATION EXISTS **  <span class="cmd-link" data-cmd="*SI">&gt;*SI</span></div>');
    lines.push('<div class="vendor-exists-line">** TINS REMARKS EXIST **  <span class="cmd-link" data-cmd="*HTI">&gt;*HTI</span></div>');
    // When *HTI is clicked / active, expand the TIN data right inside vendor box (matches Smartpoint Image 5)
    if (activeLeftCommands.has("*HTI")) {
      lines.push('<div class="vendor-exists-line">&nbsp;</div>');
      const allTkts = (s.issuedTickets && s.issuedTickets.length) ? s.issuedTickets : (s.issuedTicket ? [s.issuedTicket] : []);
      const activeTkts = allTkts.filter(function(t) { return !["EXCHANGED","PARTIALLY EXCHANGED","VOID","REFUNDED"].includes(t.status); });
      const histTkts = allTkts.filter(function(t) { return ["EXCHANGED","PARTIALLY EXCHANGED","VOID","REFUNDED"].includes(t.status); });
      const currentTkts = activeTkts.length ? activeTkts : allTkts;
      if (histTkts.length) {
        lines.push('<div class="vendor-exists-line">** HISTORY TIN DATA **</div>');
        histTkts.forEach(function(t) {
          const rawTkt = t.ticketNumberRaw || (t.ticketNumber || "").replace(/[-]/g, "");
          lines.push('<div class="vendor-exists-line">' + t.paxName + '-/' + rawTkt + '/-BDT/' + t.total + '/ET</div>');
        });
      } else {
        lines.push('<div class="vendor-exists-line">** NO HISTORY TIN DATA **</div>');
      }
      lines.push('<div class="vendor-exists-line">** CURRENT TIN DATA **</div>');
      currentTkts.forEach(function(t) {
        const rawTkt = t.ticketNumberRaw || (t.ticketNumber || "").replace(/[-]/g, "");
        lines.push('<div class="vendor-exists-line">' + t.paxName + '-/' + rawTkt + '/-BDT/' + t.total + '/ET</div>');
      });
      lines.push('<div class="vendor-exists-line">&nbsp;</div>');
    }
    lines.push('<div class="vendor-exists-line">** DIVIDED BOOKINGS EXIST **  <span class="cmd-link" data-cmd="*DV">&gt;*DV</span></div>');
    lines.push('<div class="vendor-exists-line">** ELECTRONIC DATA EXISTS **  <span class="cmd-link" data-cmd="*HTE">&gt;*HTE</span></div>');
  } else {
    if (s.filedFare || (s.filedFares && s.filedFares.length > 0)) {
      lines.push('<div class="vendor-exists-line">** FILED FARE DATA EXISTS **  <span class="cmd-link" data-cmd="*FF">&gt;*FF</span></div>');
    }
    if (s.vendorLocator) {
      lines.push('<div class="vendor-exists-line">** VENDOR LOCATOR DATA EXISTS **  <span class="cmd-link" data-cmd="*VL">&gt;*VL</span></div>');
    }
    // *VR vendor box line is hidden until IR is run (justEnded flag), matching real Smartpoint.
    if (s.vendorRemarks && !s.justEnded) {
      lines.push('<div class="vendor-exists-line">** VENDOR REMARKS DATA EXISTS **  <span class="cmd-link" data-cmd="*VR">&gt;*VR</span></div>');
    }
    if (s.ssr && s.ssr.length) {
      lines.push('<div class="vendor-exists-line">** SERVICE INFORMATION EXISTS **  <span class="cmd-link" data-cmd="*SI">&gt;*SI</span></div>');
    }
  }
  if (!lines.length) {
    leftVendorBox.hidden = true;
    leftVendorBox.innerHTML = "";
    return;
  }
  leftVendorBox.innerHTML = lines.join("");
  leftVendorBox.hidden = false;
}

function refreshLeftButtons() {
  if (!leftBtns) return;
  const s = engine.state;
  if (!s.segments || !s.segments.length) {
    leftBtns.style.display = "none";
    return;
  }
  const commands = getVisibleLeftCommands();

  const nonAllCmds = commands.filter(function(c) { return c !== "*ALL"; });
  leftBtns.innerHTML = commands.map(function(command) {
    const isSelected = (command !== "*ALL")
      ? activeLeftCommands.has(command)
      : (nonAllCmds.length > 0 && nonAllCmds.every(function(c) { return activeLeftCommands.has(c); }));
    return '<button class="left-btn' + (isSelected ? ' selected' : '') + '" data-cmd="' + command + '">' + command + '</button>';
  }).join("");
  leftBtns.style.display = "flex";
}


// Render combined content for all active left buttons (multi-select)
// Get lines for a specific display section in left panel
function getLeftDisplayLines(display) {
  const s = engine.state;
  const seg = s.segments && s.segments[0];
  const city = (seg && seg.origin) || "DAC";

  if (display === "phone") {
    const phoneLines = [];
    if (s.phones && s.phones.length) {
      s.phones.forEach((p, idx) => {
        let pStr = (typeof p === "string" ? p : (p.full || p.text || "")).toUpperCase().trim();
        if (!pStr) return;
        pStr = pStr.replace(/^FONE-/, "");
        if (idx === 0) {
          if (/^[A-Z]{3}[A-Z]?\*/i.test(pStr) || /^T\*/i.test(pStr)) {
            phoneLines.push('<span class="highlight-green">FONE</span>-' + pStr);
          } else {
            phoneLines.push('<span class="highlight-green">FONE</span>-' + city + "T*" + pStr.replace(/^T\*/, "").trim());
          }
        } else {
          phoneLines.push("  " + (idx + 1) + ". " + pStr);
        }
      });
    }
    return phoneLines.length ? phoneLines : ["NO PHONE FIELD IN PNR"];
  }

  if (display === "ticketing") {
    return [s.ticketing ? '<span class="highlight-green">TKTG</span>-' + s.ticketing : "NO TICKETING FIELD IN PNR"];
  }

  if (display === "received" || display === "rv" || display === "overview") {
    return [s.receivedFrom ? ("RCVD-" + s.receivedFrom.toUpperCase()) : "NO RECEIVED DATA EXISTS"];
  }

  if (display === "vendorLocator") {
    return ["VENDOR LOCATOR", "VLOC-" + (s.vendorLocator || "NOT AVAILABLE")];
  }

  if (display === "vendorRemarks") {
    return ["VENDOR REMARKS", s.vendorRemarks || "NO VENDOR REMARKS IN PNR"];
  }

  if (display === "service") {
    const serviceLines = [
      "*** SPECIAL SERVICE REQUIREMENT ***",
      "SEGMENT/PASSENGER RELATED"
    ];

    // After ticketing: add TKNE segment-grouped entries (matching real Smartpoint *SI display)
    if (s.issued && s.segments && s.segments.length) {
      const allTkts = (s.issuedTickets && s.issuedTickets.length) ? s.issuedTickets : (s.issuedTicket ? [s.issuedTicket] : []);
      const activeTkts = allTkts.filter(function(t) { return !["EXCHANGED","PARTIALLY EXCHANGED","VOID","REFUNDED"].includes(t.status); });
      const tktList = activeTkts.length ? activeTkts : allTkts;
      s.segments.forEach(function(sg, sIdx) {
        serviceLines.push('S ' + (sIdx + 1) + '. ' + sg.carrier + '  ' + (sg.number || '') + ' ' + (sg.soldClass || sg.bookingClass || 'Y') + '  ' + (sg.date || '') + ' ' + (sg.origin || '') + (sg.destination || ''));
        tktList.forEach(function(tkt, tIdx) {
          const paxName = tkt.paxName || ((s.names && s.names[tIdx]) ? s.names[tIdx].replace(/^[\d\.\-]+/, '').replace(/\*.*$/, '').trim() : 'PASSENGER');
          const rawTkt = tkt.ticketNumberRaw || (tkt.ticketNumber || '').replace(/[-]/g, '');
          const couponCode = rawTkt + 'C' + (sIdx + 1);
          serviceLines.push('   P ' + (tIdx + 1) + '. ' + paxName + ' TKNE HK 1  ' + couponCode);
        });
      });
    }

    serviceLines.push("*** MANUAL SSR DATA ***");
    if (s.ssr && s.ssr.length) {
      s.ssr.forEach((ssr, idx) => {
        const num = idx + 1;
        const isObj = typeof ssr === "object" && ssr !== null;
        const code = (isObj && ssr.code) ? ssr.code.toUpperCase() : "";
        const rawText = isObj ? (ssr.raw || ssr.detail || ssr.full || ssr.text || "") : String(ssr || "");
        const paxIdx = (isObj && ssr.passenger) ? (parseInt(ssr.passenger, 10) - 1) : ((ssr && ssr.paxNum) ? (parseInt(ssr.paxNum, 10) - 1) : 0);
        const thisPaxName = (s.names && s.names[paxIdx]) ? s.names[paxIdx].replace(/^[\d\.\-]+/, "").replace(/\*.*$/, "").trim() : "PASSENGER";
        const paxNum = paxIdx + 1;

        // Helper to extract carrier + payload from detail like "BSHK1/payload"
        function parseSsrDetail(str) {
          var m = str.match(/^([A-Z]{2})?\s*(?:HK\d*)?\/(.*)/i);
          return {
            carrier: (m && m[1]) ? m[1].toUpperCase() : (seg ? seg.carrier : "BS"),
            payload: (m && m[2] !== undefined) ? m[2] : str.replace(/^.*?\//, "")
          };
        }

        let lineText = "";
        if (code === "DOCS" || (!code && rawText.toUpperCase().includes("DOCS"))) {
          var dCarrier, dPayload;
          if (isObj && ssr.detail) {
            var dp = parseSsrDetail(ssr.detail);
            dCarrier = dp.carrier; dPayload = dp.payload;
          } else {
            var dp2 = parseSsrDetail(rawText.replace(/^.*?DOCS/i, ""));
            dCarrier = dp2.carrier; dPayload = dp2.payload;
          }
          lineText = '  <span class="highlight-green">M ' + num + '.</span> SSRDOCS' + dCarrier + " HK  " + dPayload + " -" + paxNum + thisPaxName;
        } else if (code === "CTCE" || (!code && rawText.toUpperCase().includes("CTCE"))) {
          var cCarrier, cEmail;
          if (isObj && ssr.detail) {
            var cp = parseSsrDetail(ssr.detail);
            cCarrier = cp.carrier; cEmail = cp.payload;
          } else {
            var cp2 = parseSsrDetail(rawText.replace(/^.*?CTCE/i, ""));
            cCarrier = cp2.carrier; cEmail = cp2.payload;
          }
          lineText = '  <span class="highlight-green">M ' + num + '.</span> SSRCTCE' + cCarrier + " HK  /" + cEmail + "-" + paxNum + thisPaxName;
        } else if (code === "CTCM" || (!code && rawText.toUpperCase().includes("CTCM"))) {
          var mCarrier, mPhone;
          if (isObj && ssr.detail) {
            var mp = parseSsrDetail(ssr.detail);
            mCarrier = mp.carrier; mPhone = mp.payload;
          } else {
            var mp2 = parseSsrDetail(rawText.replace(/^.*?CTCM/i, ""));
            mCarrier = mp2.carrier; mPhone = mp2.payload;
          }
          lineText = '  <span class="highlight-green">M ' + num + '.</span> SSRCTCM' + mCarrier + " HK  /" + mPhone + "-" + paxNum + thisPaxName;
        } else if (code === "INFT" || rawText.toUpperCase().includes("INFT")) {
          var infData = (code === "INFT" && isObj && ssr.detail) ? ssr.detail : rawText;
          lineText = '  <span class="highlight-green">M ' + num + '.</span> SSR-INFT ' + infData + " -" + paxNum + thisPaxName;
        } else {
          lineText = '  <span class="highlight-green">M ' + num + '.</span> SSR-' + rawText + " -" + paxNum + thisPaxName;
        }
        serviceLines.push(lineText);
      });
      if (s.osk && s.osk.length) {
        serviceLines.push("*** OSI DATA ***");
        s.osk.forEach((o, oIdx) => {
          serviceLines.push("  " + (oIdx + 1) + ". " + o);
        });
      } else {
        serviceLines.push("NO OSI EXISTS");
      }
    } else {
      serviceLines.push("NO SSR DATA IN PNR");
    }
    return serviceLines;
  }

  if (display === "filedFare") {
    if (!s.fare && (!s.filedFares || !s.filedFares.length)) return ["NO FILED FARE DATA IN PNR"];
    const quotes = (s.filedFares && s.filedFares.length) ? s.filedFares : [s.fare];
    const seg = s.segments && s.segments[0];
    const today = (function() { var d=new Date(); var m=["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"]; return (String(d.getDate()).padStart(2,"0"))+m[d.getMonth()]+(String(d.getFullYear()).slice(-2)); })();
    const names = (s.names && s.names.length) ? s.names : ["1.1PASSENGER/TEST MR"];
    const offId = (s.officeId || "86JJ").slice(-4);

    const filedFare = [];

    quotes.forEach(function(fqItem, qIdx) {
      const qNum = qIdx + 1;
      const fCarrier = fqItem.carrier || (seg && seg.carrier) || "TG";
      const fOrigin = (seg && seg.origin) || "DAC";
      const fDest = (seg && seg.destination) || "BKK";
      const fDate = (seg && seg.date) || "20DEC";
      const fTotal = fqItem.total || 0;
      const fBase = (fqItem.adtFare && fqItem.adtFare.base) || fqItem.base || Math.round(fTotal * 0.7);
      const fBasis = fqItem.fareBasis || ((seg && seg.soldClass ? seg.soldClass : "W") + "LOSV");
      const nucAmt = fBase > 0 ? (Math.round(fBase / 123.54 * 100) / 100).toFixed(2) : "169.00";
      const usdAmt = fBase > 0 ? Math.round(fBase / 123.54) : 169;
      const fCmd = s.lastFareQuoteCmd ? s.lastFareQuoteCmd.replace(/^\d+\s*-\s*/, "").replace(/^>/, "").trim() : ("FQBB/C" + fCarrier + "/ET");
      const lastDate = s.ticketing ? (s.ticketing.replace(/TAU\//i,"").replace(/tau\//i,"").replace(/T\./i,"").replace(/\*/g,"").trim() + "26") : (fDate + "26");
      const adtUnit = (fqItem.adtFare && fqItem.adtFare.total) || Math.round(fTotal / names.length);
      const chdUnit = (fqItem.chdFare && fqItem.chdFare.total) || Math.round(adtUnit * 0.75);
      const infUnit = (fqItem.infFare && fqItem.infFare.total) || Math.round(adtUnit * 0.10);
      const pCounts = (fqItem.passengers) || { adt: names.length, chd: 0, inf: 0 };

      if (qIdx > 0 && !isFqExpanded) {
        filedFare.push(""); // blank line between FQ1 and FQ2 matching Smartpoint Image 1
      }

      if (!isFqExpanded) {
        // Summary View: FQ header + passenger lines (matches Smartpoint Image 1)
        filedFare.push('<span class="highlight-green fq-toggle" style="cursor:pointer;" title="Click to expand/collapse fare details">FQ' + qNum + '</span>  - S1                    AP    G ' + today + '   <span class="fq-toggle" style="color:#00e5ff;cursor:pointer;font-weight:bold;" title="Click to expand/collapse fare details">/</span>');
        names.forEach(function(item, idx) {
          const pNum = idx + 1;
          const paxName = item.replace(/^[\d\.\-]+/, "").replace(/\*.*$/, "").trim();
          let pType = "ADT";
          let pTot = adtUnit;
          if (idx >= pCounts.adt && idx < pCounts.adt + pCounts.chd) {
            pType = "CNN";
            pTot = chdUnit;
          } else if (idx >= pCounts.adt + pCounts.chd) {
            pType = "INF";
            pTot = infUnit;
          }
          filedFare.push("P" + pNum + "   " + paxName.padEnd(24) + '<span style="color:#00e5ff">' + pType + "</span>   G  " + today + " *  BDT " + pTot);
        });
        return;
      }

      // Expanded Box View (matches video 37s with blue border)
      filedFare.push('<div class="fq-expanded-box" style="border: 1px solid #1976d2; padding: 4px; margin: 4px 0;">');
      filedFare.push('<span class="highlight-green fq-toggle" style="cursor:pointer;">FQ' + qNum + '</span>  - S1                    AP    G ' + today + '  <span class="fq-toggle" style="float:right;background:#1976d2;color:#ffffff;padding:0 5px;cursor:pointer;font-weight:bold;" title="Collapse details">-</span>');
      filedFare.push('MR/AG');
      filedFare.push(fCmd);
      names.forEach(function(item, idx) {
        const pNum = idx + 1;
        const paxName = item.replace(/^[\d\.\-]+/, "").replace(/\*.*$/, "").trim();
        let pType = "ADT";
        let pTot = adtUnit;
        if (idx >= pCounts.adt && idx < pCounts.adt + pCounts.chd) {
          pType = "CNN";
          pTot = chdUnit;
        } else if (idx >= pCounts.adt + pCounts.chd) {
          pType = "INF";
          pTot = infUnit;
        }
        filedFare.push("P" + pNum + "   " + paxName.padEnd(20) + ' <span style="color:#00e5ff">' + pType + "</span>   G  " + today + " *  BDT " + pTot);
      });
      filedFare.push(fOrigin + " " + fCarrier + " " + fDest + " " + nucAmt + " NUC" + nucAmt + "END ROE1.0");
      filedFare.push("");
      filedFare.push("FARE USD" + usdAmt + ".00 EQU BDT" + fBase + " TAX 500BD TAX 25000W TAX 1236P7");
      filedFare.push("TAX 1236P8 TAX 4000UT TAX 129E7 TAX 92G8 TAX 446E5 TAX 1236YR");
      filedFare.push("TOT BDT" + fTotal);
      filedFare.push("***ADDITIONAL FEES MAY APPLY*SEE&gt;FO1&middot;");
      filedFare.push('S1  FB-<span class="highlight-green">' + fBasis + '</span>  B-1PC          NB-' + fDate + '    NA-' + fDate);
      filedFare.push("NON END/FLT/DTE CHANGE");
      filedFare.push("REROUTE/CANCELLATION");
      filedFare.push("CHECK FARE RULE");
      filedFare.push("LAST DATE TO PURCHASE TICKET: " + lastDate);
      filedFare.push("SUBTOTAL BDT " + fTotal + "   TOTAL FEES 0   GRAND TOTAL " + fTotal);
      filedFare.push('<span class="highlight-green">&lt;&lt;VIEW BRAND DETAILS&gt;&gt;</span>');
      const fCarrierCode = fCmd.includes("/C") ? fCmd.replace(/^.*\/C([A-Z0-9]{2}).*$/i, "$1").toUpperCase() : fCarrier;
      filedFare.push("T P1/S1/C" + fCarrierCode + "/ET/TA" + offId);
      filedFare.push('</div>');
    });

    return filedFare;
  }

  if (display === "tins") {
    // In real Smartpoint, TIN remarks expand directly inside the vendor box under ** TINS REMARKS EXIST **
    return [];
  }

  return [];
}

// Render combined content for all active left buttons (multi-select)
function renderCombinedLeftDisplay() {
  if (!leftDetails) return;
  if (activeLeftCommands.size === 0) {
    leftDetails.innerHTML = "";
    leftDetails.hidden = true;
    return;
  }
  // Section order matches real Smartpoint: FONE -> TKTG -> FQ1 -> RCVD -> SSR
  var sectionOrder = ["*P","*TD","*FF","*RV","*SI","*VL","*VR","*NP","*HTI","*HTE","*DV"];
  var cmdToDisplay = {
    "*P":"phone","*TD":"ticketing","*FF":"filedFare","*RV":"received",
    "*SI":"service","*VL":"vendorLocator","*VR":"vendorRemarks","*HTI":"tins"
  };
  var activeSections = sectionOrder.filter(function(c) { return activeLeftCommands.has(c); });
  if (activeSections.length === 0) {
    leftDetails.innerHTML = "";
    leftDetails.hidden = true;
    return;
  }
  var combined = [];
  activeSections.forEach(function(cmd) {
    var display = cmdToDisplay[cmd] || cmd.replace(/^\*/, "");
    var lines = getLeftDisplayLines(display);
    if (lines && lines.length) {
      if (cmd === "*FF" && isFqExpanded) {
        combined = combined.concat(lines);
      } else {
        var boxHtml = '<div class="left-detail-box" data-section-cmd="' + cmd + '">' +
          '<span class="section-close-btn" data-close-cmd="' + cmd + '" title="Collapse">-</span>' +
          lines.join("\n") +
          '</div>';
        combined.push(boxHtml);
      }
    }
  });
  if (combined.length > 0) {
    leftDetails.innerHTML = combined.join("\n");
    leftDetails.hidden = false;
  } else {
    leftDetails.innerHTML = "";
    leftDetails.hidden = true;
  }
}

function renderCancelledPNR() {
  const s = engine.state;
  setLeftPane([
    "PNR INUSE - IGNORE AND RERETRIEVE",
    "1-" + ((s.names && s.names[0]) ? s.names[0].replace(/^1-/, "") : "PASSENGER"),
    "",
    "** VENDOR LOCATOR DATA EXISTS **  >*VL",
    "** VENDOR REMARKS DATA EXISTS **  >*VR"
  ], true);
}

function renderLeftPNRDisplay(display) {
  if (!leftDetails) return;
  const lines = getLeftDisplayLines(display);
  if (lines && lines.length) {
    leftDetails.innerHTML = lines.join("\n");
    leftDetails.hidden = false;
    if (leftSegment) {
      setTimeout(function() {
        leftSegment.scrollTop = 0;
      }, 50);
    }
  } else {
    leftDetails.innerHTML = "";
    leftDetails.hidden = true;
  }
}

function updateTab() {
  if (!tabLabel) return;
  tabLabel.textContent = lastCommand ? ("1 - " + lastCommand) : "1 ->";
}

function mark() {
  const s = engine.state;
  const done = {
    login:        s.signedIn,
    availability: s.availability,
    sell:         s.segments && s.segments.length > 0,
    name:         s.names    && s.names.length > 0,
    contact:      s.phones   && s.phones.length > 0,
    save:         s.saved,
    price:        s.priced,
    issue:        s.issued
  };
  GalileoSteps.forEach(function(step) {
    const el = document.querySelector("[data-step=\"" + step + "\"]");
    if (el) el.classList.toggle("done", !!done[step]);
  });
}

function updatePNR() {
  const s = engine.state;
  if (locBadge) locBadge.textContent = s.locator || "---";
  if (!pnrSummary) return;
  if (!s.locator && (!s.segments || !s.segments.length) && (!s.names || !s.names.length)) {
    pnrSummary.textContent = "No active booking";
    pnrSummary.className = "empty";
    return;
  }
  const seg  = s.segments && s.segments[0];
  const name = s.names    && s.names[0];
  pnrSummary.className = "";
  pnrSummary.innerHTML =
    "<b>" + escapeItinerary(s.locator || "UNSAVED") + "</b><br>" +
    escapeItinerary(name || "No passenger") + "<br>" +
    escapeItinerary(seg ? seg.carrier + seg.number + " " + seg.origin + "-" + seg.destination : "No segment") + "<br>" +
    (s.priced ? "FARE QUOTED" : "Not priced") +
    (s.issued ? "<br><b class='issued'>TICKET ISSUED</b>" : "");
}

function update() {
  const s = engine.state;
  if (statusSpan) statusSpan.textContent = s.signedIn ? "SIGNED IN" : "OFFLINE";
  if (officeSpan) officeSpan.textContent = s.signedIn ? ("OFFICE: " + (s.officeId || "DACVS086JJ")) : "GALILEO TRAINING";
  updateTab();
  updatePNR();
  if (!s.activeBfCleared) {
    refreshLeftButtons();
    refreshLeftVendorBox();
    refreshLeftPnrHeader();
    refreshLeftPassenger();
  }
  mark();
  persistHistory();
}

function processCommand(raw, fromButton) {
  const cmd = raw.trim();
  if (!cmd) return;
  histIdx = -1;
  const nav = cmd.toUpperCase();
  const isNav = nav === "MD" || nav === "MU" || nav === "MT" || nav === "MB";
  if (!isNav) lastCommand = cmd.toUpperCase();
  if (!isNav && !engine.state.segments.length) { setLeftPane(["NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST"], false); }

  if (cmd.toUpperCase().startsWith("LESSON ")) {
    const lesson = GalileoLessons.get(cmd.slice(7));
    if (lesson) setScreen(GalileoLessons.format(lesson).join("\n"), "dim");
    else setScreen("LESSON NOT FOUND - USE: BASIC, TICKETING, MODIFICATION, REISSUE or REFUND", "error");
    update();
    return;
  }

  const navCmd = cmd.toUpperCase();
  if (navCmd === "MD" || navCmd === "MU" || navCmd === "MT" || navCmd === "MB") {
    const paged = engine.process(navCmd);
    if (paged && paged.kind === "avail" && paged.flights) renderAvailability(paged);
    else if (paged && paged.lines && paged.lines.length) setScreen(paged.lines.join("\n"), paged.kind || "");
    update();
    return;
  }

  const resp = engine.process(cmd);

  // A fresh availability, or Ignore, must not leave an old fare-detail panel open.
  if (/^A\d{2}[A-Z]{3}/i.test(cmd) || /^(I|IG)$/i.test(cmd)) closeBrands();

  if (resp.clearTerminal) clearScreen();
  if (resp.kind === "retrieve") {
    clearScreen();
    setTerminalMode("empty");
    if (leftMsg) { leftMsg.textContent = ""; leftMsg.hidden = true; }
    const seg = engine.state.segments && engine.state.segments[0];
    if (seg) renderLeftSegment(seg, [], true);
    if (engine.state.issued) {
      activeLeftCommands.clear();
      activeLeftCommands.add("*P");
      activeLeftCommands.add("*SI");
      renderCombinedLeftDisplay();
      refreshLeftButtons();
      refreshLeftVendorBox();
    }
  }
  const isTerminalQuickDisplay = (cmd.toUpperCase() === "*P" || cmd.toUpperCase() === "*TD") && !fromButton;
  if (resp.leftDisplay && resp.leftDisplay !== "overview" && !isTerminalQuickDisplay) {
    var autoCmd = resp.leftDisplay === "all" ? null : (resp.leftDisplay === "service" ? "*SI" : (resp.leftDisplay === "phone" ? "*P" : (resp.leftDisplay === "ticketing" ? "*TD" : (resp.leftDisplay === "filedFare" ? "*FF" : (resp.leftDisplay === "vendorLocator" ? "*VL" : (resp.leftDisplay === "vendorRemarks" ? "*VR" : null))))));
    if (autoCmd) {
      activeLeftCommands.clear();
      activeLeftCommands.add(autoCmd);
      if (autoCmd === "*FF") isFqExpanded = false;
      renderCombinedLeftDisplay();
      refreshLeftButtons();
    } else if (resp.leftDisplay === "issued-pnr" || (resp.kind === "retrieve" && engine.state.issued)) {
      activeLeftCommands.clear();
      activeLeftCommands.add("*P");
      activeLeftCommands.add("*SI");
      renderCombinedLeftDisplay();
      refreshLeftButtons();
      refreshLeftVendorBox();
    } else if (resp.leftDisplay === "all") {
      const visCmds = getVisibleLeftCommands();
      activeLeftCommands.clear();
      visCmds.filter(function(c) { return c !== "*ALL"; }).forEach(function(c) { activeLeftCommands.add(c); });
      isFqExpanded = true;
      renderCombinedLeftDisplay();
      refreshLeftButtons();
      refreshLeftVendorBox();
    }
  } else if (resp.kind === "service") {
    activeLeftCommands.clear(); activeLeftCommands.add("*SI");
    renderLeftPNRDisplay("service");
  }
  // FQC/FQBBC/FQBBK replaces the filed fare / rebooks segment. Keep left panel
  // buttons, vendor box (** FILED FARE DATA EXISTS **), segment display and *FF in sync.
  if (resp.kind === "fare-load" || resp.kind === "fare-rebook") {
    const seg = engine.state.segments && engine.state.segments[0];
    if (seg) renderLeftSegment(seg, [], true);
    refreshLeftButtons();
    refreshLeftVendorBox();
    if (activeLeftCommands.size > 0) {
      renderCombinedLeftDisplay();
    }
  }
  // FX1/FX2/FXALL deletes filed fare(s). Sync left panel buttons and *FF panel.
  if (resp.kind === "fare-delete") {
    refreshLeftButtons();
    refreshLeftVendorBox();
    // If *FF is currently open and no fares remain, remove it from active set
    if (activeLeftCommands.has("*FF") && !engine.state.filedFare) {
      activeLeftCommands.delete("*FF");
      isFqExpanded = false;
    }
    if (activeLeftCommands.size > 0) {
      renderCombinedLeftDisplay();
    } else if (leftDetails) {
      leftDetails.innerHTML = "";
      leftDetails.hidden = true;
    }
  }
  if (resp.kind === "end" || (resp.leftDisplay === "overview") || (!engine.state.issued && (cmd.toUpperCase() === "IR" || cmd.toUpperCase() === "*RV"))) {
    clearScreen();
    setTerminalMode("empty");
    activeLeftCommands.clear();
    if (leftDetails) {
      leftDetails.innerHTML = "";
      leftDetails.hidden = true;
    }
    if (leftSegmentNotes) {
      leftSegmentNotes.classList.remove("pnr-details");
      leftSegmentNotes.textContent = "";
      leftSegmentNotes.hidden = true;
    }
    const seg = engine.state.segments && engine.state.segments[0];
    if (seg) renderLeftSegment(seg, [], true);
  }
  if (resp.kind === "cancel") renderCancelledPNR();

  if (cmd.toUpperCase() === "SOF") {
    engine.state.history = [];
    try { localStorage.removeItem(HISTORY_KEY); } catch (_) {}
  }

  if (resp.segment) {
    const seg = resp.segment;
    renderLeftSegment(seg, resp.leftPaneNotes);
  }
  if (resp.kind === "name" && leftSegmentNotes) leftSegmentNotes.hidden = true;

  if (resp.kind === "ignore") {
    clearScreen();
    currentScreenMode = "empty";
    engine.state.activeBfCleared = false;
    if (engine.state.segments && engine.state.segments.length) {
      const seg = engine.state.segments[0];
      renderLeftSegment(seg, seg.notes || []);
      if (leftSegmentNotes) leftSegmentNotes.hidden = false;
    } else {
      setLeftPane(["NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST"], false);
    }
  }

  const isLineCmd = /^(N\.|N\/|P\.|9\/|T\.|T-|T\*|R\.|RF-|SI\.|M\.)/i.test(cmd);
  if (isLineCmd) {
    activeLeftCommands.clear();
    if (leftDetails) {
      leftDetails.innerHTML = "";
      leftDetails.hidden = true;
    }
    if (currentScreenMode !== "lines") {
      clearScreen();
      setTerminalMode("lines");
    }
    if (resp.kind === "error") {
      print(">" + cmd, "echo");
      print(resp.lines.join("\n"), "error");
    } else {
      const rawCmd = raw.trim().toUpperCase();
      const lineEcho = /\s+\*$/.test(rawCmd) ? (">" + rawCmd) : (">" + rawCmd + " *");
      print(lineEcho, resp.kind || "");
      refreshLeftPnrHeader();
      refreshLeftPassenger();
      refreshLeftButtons();
      refreshLeftVendorBox();
    }
  } else if (resp.kind === "avail" && resp.flights) {
    renderAvailability(resp);
  } else if (resp.kind === "sell" && engine.state.availability && engine.state.results.length) {
    renderAvailability(engine._availScreen());
  } else if (resp.kind === "issue" || resp.kind === "reissue-ok") {
    // ── Original Galileo behavior after TKPDTD: ──
    // 1. Right panel shows ticket issue output with clickable PNR locator link
    // 2. Entire Left panel CLEARS (completely blank screen like real Galileo)
    // 3. Clicking >*LOCATOR« link loads and displays full PNR on left panel
    engine.state.activeBfCleared = true;
    setScreen(resp.lines.join("\n"), "issue");

    // Clear active booking from left panel and show NO B.F. TO DISPLAY (matches Smartpoint Image 2)
    if (leftMsg) {
      leftMsg.textContent = "NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST";
      leftMsg.hidden = false;
    }
    if (leftSegment) leftSegment.hidden = true;
    if (leftPassenger) { leftPassenger.hidden = true; leftPassenger.textContent = ""; }
    if (leftPnrHeader) { leftPnrHeader.hidden = true; leftPnrHeader.textContent = ""; }
    if (leftVendorBox) leftVendorBox.hidden = true;
    if (leftDetails) { leftDetails.innerHTML = ""; leftDetails.hidden = true; }
    if (leftBtns) leftBtns.style.display = "none";
    if (leftOsi) leftOsi.hidden = true;
    activeLeftCommands.clear();

    // Add Print Ticket button below issue output
    const btn = document.createElement("button");
    btn.className = "print-ticket-btn";
    btn.innerHTML = "&#128438; Print Electronic Ticket Receipt";
    btn.onclick = function() { openGalileoTicketModal(); };
    getTerminalContainer().appendChild(btn);
  } else if (resp.kind === "assisted-ticketing") {
    openAssistedTicketing(resp.tab || "refund");
    if (resp.lines && resp.lines.length) setScreen(resp.lines.join("\n"), resp.kind || "");
    if (resp.lines.some(l => /ETK ISSUED OK|ELECTRONIC TICKET RECORD|TICKET NO/i.test(l)) || resp.kind === 'ticket' || /^(TKP|\*TE|\*HTE)/i.test(cmd)) {
      const btn = document.createElement("button");
      btn.className = "print-ticket-btn";
      btn.innerHTML = "&#128438; Print Electronic Ticket Receipt";
      btn.onclick = function() { openGalileoTicketModal(); };
      getTerminalContainer().appendChild(btn);
    }
  } else if (resp.kind === "fare") {
    renderFare(resp);
  } else if (resp.kind === "error") {
    if (currentScreenMode === "lines") {
      print(">" + cmd, "echo");
      print(resp.lines.join("\n"), "error");
    } else {
      setScreen(resp.lines.join("\n"), "error");
    }
  } else if (resp.lines && resp.lines.length) {
    const isSplit = document.querySelector(".workspace")?.classList.contains("split-view");
    if (resp.kind === "retrieve" && isSplit) {
      clearScreen();
      setTerminalMode("empty");
    } else {
      setScreen(resp.lines.join("\n"), resp.kind || "");
    }
  }

  update();
}

formEl.addEventListener("submit", function(e) {
  e.preventDefault();
  processCommand(inputEl.value);
  inputEl.value = "";
  inputEl.focus();
});

inputEl.addEventListener("keydown", function(e) {
  const hist = engine.state.history;
  if (!hist.length) return;
  if (e.key === "ArrowUp") {
    e.preventDefault();
    if (histIdx < hist.length - 1) histIdx++;
    inputEl.value = hist[hist.length - 1 - histIdx] || "";
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (histIdx > 0) { histIdx--; inputEl.value = hist[hist.length - 1 - histIdx] || ""; }
    else             { histIdx = -1; inputEl.value = ""; }
  }
});

// Commands must always be displayed and entered in Galileo's uppercase form,
// regardless of the user's Caps Lock state or pasted text.
inputEl.addEventListener("input", function() {
  const upper = inputEl.value.toUpperCase();
  if (inputEl.value !== upper) inputEl.value = upper;
});

// The terminal is both an interactive display and a readable transcript.  Do
// not steal focus from it after a drag: focusing the command field clears the
// browser selection before the user can press Ctrl/Cmd+C.
function terminalTextIsSelected() {
  const selection = window.getSelection && window.getSelection();
  return !!(selection && !selection.isCollapsed &&
    terminal.contains(selection.anchorNode) && terminal.contains(selection.focusNode));
}

document.addEventListener("click", function(e) {
  if (e.target.closest(".fq-toggle")) {
    isFqExpanded = !isFqExpanded;
    renderCombinedLeftDisplay();
    return;
  }
  if (e.target.closest("#historyMenu")) {
    openHistory();
    return;
  }
  if (e.target.closest("#historyClose")) {
    closeHistory();
    return;
  }
  if (e.target.closest("#historySend")) {
    sendHistorySelection();
    return;
  }
  if (e.target.closest("#historyDelete")) {
    deleteHistorySelection();
    return;
  }
  if (e.target.closest("#historyOptions")) {
    return;
  }
  if (historyPanel && e.target === historyPanel) {
    closeHistory();
    return;
  }
  // Major Airlines Master Profile for Dynamic Display Rules
const AirlineData = {
  "TG": {
    name: "THAI AIRWAYS",
    premiumClass: "ROYAL SILK CLASS",
    partners: ["ANY TG FLIGHT OPERATED BY BR", "ANY TG FLIGHT OPERATED BY OZ", "ANY TG FLIGHT OPERATED BY NH"],
    ruleCode: "008/SV03",
    ruleType: "RULE SAVER"
  },
  "SQ": {
    name: "SINGAPORE AIRLINES",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY SQ FLIGHT OPERATED BY TR", "ANY SQ FLIGHT OPERATED BY LH", "ANY SQ FLIGHT OPERATED BY NZ"],
    ruleCode: "016/SQ01",
    ruleType: "RULE VALUE"
  },
  "MH": {
    name: "MALAYSIA AIRLINES",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY MH FLIGHT OPERATED BY FY", "ANY MH FLIGHT OPERATED BY QR", "ANY MH FLIGHT OPERATED BY BA"],
    ruleCode: "023/MH02",
    ruleType: "RULE SAVER"
  },
  "EK": {
    name: "EMIRATES",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY EK FLIGHT OPERATED BY FZ", "ANY EK FLIGHT OPERATED BY QF", "ANY EK FLIGHT OPERATED BY UA"],
    ruleCode: "176/EK01",
    ruleType: "RULE SAVER"
  },
  "QR": {
    name: "QATAR AIRWAYS",
    premiumClass: "QSUITE / BUSINESS CLASS",
    partners: ["ANY QR FLIGHT OPERATED BY BA", "ANY QR FLIGHT OPERATED BY AA", "ANY QR FLIGHT OPERATED BY IB"],
    ruleCode: "157/QR05",
    ruleType: "RULE VALUE"
  },
  "SV": {
    name: "SAUDI ARABIAN AIRLINES",
    premiumClass: "ALFURSAN BUSINESS CLASS",
    partners: ["ANY SV FLIGHT OPERATED BY AF", "ANY SV FLIGHT OPERATED BY ME", "ANY SV FLIGHT OPERATED BY KL"],
    ruleCode: "065/SV01",
    ruleType: "RULE BASIC"
  },
  "BG": {
    name: "BIMAN BANGLADESH AIRLINES",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY BG FLIGHT OPERATED BY BS", "ANY BG FLIGHT OPERATED BY 2A"],
    ruleCode: "997/BG01",
    ruleType: "RULE SAVER"
  },
  "BS": {
    name: "US-BANGLA AIRLINES",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY BS FLIGHT OPERATED BY BG"],
    ruleCode: "760/BS01",
    ruleType: "RULE FLEXI"
  },
  "AI": {
    name: "AIR INDIA",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY AI FLIGHT OPERATED BY LH", "ANY AI FLIGHT OPERATED BY UA", "ANY AI FLIGHT OPERATED BY SQ"],
    ruleCode: "098/AI03",
    ruleType: "RULE VALUE"
  },
  "TK": {
    name: "TURKISH AIRLINES",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY TK FLIGHT OPERATED BY LH", "ANY TK FLIGHT OPERATED BY UA", "ANY TK FLIGHT OPERATED BY MS"],
    ruleCode: "235/TK02",
    ruleType: "RULE SAVER"
  },
  "UL": {
    name: "SRILANKAN AIRLINES",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY UL FLIGHT OPERATED BY MH", "ANY UL FLIGHT OPERATED BY QR"],
    ruleCode: "603/UL01",
    ruleType: "RULE VALUE"
  },
  "CX": {
    name: "CATHAY PACIFIC",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY CX FLIGHT OPERATED BY AA", "ANY CX FLIGHT OPERATED BY BA", "ANY CX FLIGHT OPERATED BY QR"],
    ruleCode: "160/CX01",
    ruleType: "RULE SAVER"
  },
  "WY": {
    name: "OMAN AIR",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY WY FLIGHT OPERATED BY QR", "ANY WY FLIGHT OPERATED BY MH"],
    ruleCode: "910/WY01",
    ruleType: "RULE SAVER"
  },
  "GF": {
    name: "GULF AIR",
    premiumClass: "FALCON GOLD CLASS",
    partners: ["ANY GF FLIGHT OPERATED BY EK", "ANY GF FLIGHT OPERATED BY EY"],
    ruleCode: "072/GF01",
    ruleType: "RULE SMART"
  },
  "J9": {
    name: "JAZEERA AIRWAYS",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY J9 FLIGHT OPERATED BY KU"],
    ruleCode: "201/J901",
    ruleType: "RULE VALUE"
  },
  "G9": {
    name: "AIR ARABIA",
    premiumClass: "EXTRA CLASS",
    partners: ["ANY G9 FLIGHT OPERATED BY 3O"],
    ruleCode: "514/G901",
    ruleType: "RULE BASIC"
  },
  "FZ": {
    name: "FLYDUBAI",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY FZ FLIGHT OPERATED BY EK"],
    ruleCode: "141/FZ01",
    ruleType: "RULE LITE"
  },
  "KU": {
    name: "KUWAIT AIRWAYS",
    premiumClass: "OASIS BUSINESS CLASS",
    partners: ["ANY KU FLIGHT OPERATED BY ME"],
    ruleCode: "229/KU01",
    ruleType: "RULE SAVER"
  }
};

function getAirlineData(carr) {
  const code = (carr || "TG").toUpperCase();
  return AirlineData[code] || {
    name: code + " AIRWAYS",
    premiumClass: "BUSINESS CLASS",
    partners: ["ANY " + code + " FLIGHT OPERATED BY CODESHARE PARTNER"],
    ruleCode: "001/" + code + "01",
    ruleType: "RULE STANDARD"
  };
}

// Display Rules View Generators
function renderFareComponentsView() {
  const comps = engine.state.fareComponents || [];
  const fc = engine.state.fare;
  const seg0 = engine.state.segments && engine.state.segments[0];
  const carr = (fc && fc.carrier) || (seg0 && seg0.carrier) || "TG";
  const basis = (fc && fc.fareBasis) || "WLOSV";
  const route = seg0 ? (seg0.origin + "-" + seg0.destination) : "DAC-BKK";
  const lastFareCmd = engine.state.lastFareQuoteCmd || ("FQBB/C" + carr + "/ET");

  clearScreen();
  printEcho(lastFareCmd.replace(/^>/, ""));
  print(" ", "");
  print(" FARE  COMPONENT  BASIS", "");

  if (comps.length > 0) {
    comps.forEach(function(comp, idx) {
      const lineHtml = '   <span style="color:#00ff00;">' + String(comp.num).trim() + '</span>    ' +
        '<span class="rule-link" data-action="route-rules" data-compidx="' + idx + '" style="color:#00ff00;cursor:pointer;text-decoration:underline;">' + comp.route + '</span>   ' +
        '<span class="rule-link" data-action="fare-penalties" data-compidx="' + idx + '" style="color:#00ff00;cursor:pointer;text-decoration:underline;">' + String(comp.basis || basis).padEnd(11) + '</span> ' +
        '<span class="rule-link" data-action="fare-penalties" data-compidx="' + idx + '" style="color:#ffffff;cursor:pointer;text-decoration:underline;">RULE</span>';
      print(lineHtml, "html");
    });
  } else {
    const lineHtml = '   <span style="color:#00ff00;">1</span>    ' +
      '<span class="rule-link" data-action="route-rules" data-compidx="0" style="color:#00ff00;cursor:pointer;text-decoration:underline;">' + route + '</span>   ' +
      '<span class="rule-link" data-action="fare-penalties" data-compidx="0" style="color:#00ff00;cursor:pointer;text-decoration:underline;">' + String(basis).padEnd(11) + '</span> ' +
      '<span class="rule-link" data-action="fare-penalties" data-compidx="0" style="color:#ffffff;cursor:pointer;text-decoration:underline;">RULE</span>';
    print(lineHtml, "html");
  }
  print(" ", "");
  print('<span class="rule-link" data-action="back-quote" style="color:#00ff00;cursor:pointer;text-decoration:underline;">«Back to Fare Quote»</span>', "html");
  terminal.scrollTop = 0;
}

function renderRouteRulesView(compIdx) {
  const comps = engine.state.fareComponents || [];
  const comp = comps[compIdx] || comps[0] || null;
  const fc = engine.state.fare;
  const seg0 = engine.state.segments && engine.state.segments[0];
  const carr = (comp && comp.carrier) || (fc && fc.carrier) || (seg0 && seg0.carrier) || "TG";
  const route = (comp && comp.route) || (seg0 ? (seg0.origin + "-" + seg0.destination) : "DAC-BKK");
  const info = getAirlineData(carr);
  const orig = route.split("-")[0] || "DAC";

  clearScreen();
  print('<span class="rule-link" data-action="fare-components" style="color:#00ff00;cursor:pointer;text-decoration:underline;">«Back to Fare Components»</span>', "html");
  const lines = [
    " 0.  APPLICATION AND OTHER CONDITIONS",
    "RULE - " + info.ruleCode,
    "UNLESS OTHERWISE SPECIFIED   NOTE - GENERAL RULE DOES NOT",
    "APPLY",
    info.ruleType,
    " APPLICATION",
    "   CLASS OF SERVICE",
    "     THESE FARES APPLY FOR FIRST/BUSINESS/PREMIUM ECONOMY/",
    "     ECONOMY CLASS SERVICE.",
    "   TYPES OF TRANSPORTATION",
    "     THIS RULE GOVERNS ONE-WAY AND ROUND-TRIP FARES.",
    "     FARES GOVERNED BY THIS RULE CAN BE USED TO CREATE",
    "     ONE-WAY/ROUND-TRIP/OPEN-JAW/SINGLE OPEN-JAW/DOUBLE",
    "     OPEN-JAW JOURNEYS.",
    "   TYPES OF PASSENGERS & APPLICABLE FARES",
    "     ADULT PASSENGER (ADT):",
    "       FULL APPLICABLE ADULT FARE (100 PERCENT). AGE 12 AND OLDER.",
    "     CHILD PASSENGER (CHD / CNN):",
    "       ACCOMPANIED CHILD AGE 02-11 YEARS.",
    "       CHARGE 75 PERCENT OF THE ADULT BASE FARE.",
    "       CHILD MUST OCCUPY AN INDIVIDUAL SEAT.",
    "     INFANT PASSENGER UNDER 2 YEARS WITHOUT SEAT (INF):",
    "       CHARGE 10 PERCENT OF THE ADULT BASE FARE.",
    "       MUST BE ACCOMPANIED BY AN ADULT PASSENGER AT LEAST 18 YEARS.",
    "       INFANT DOES NOT OCCUPY A SEAT.",
    "     INFANT PASSENGER UNDER 2 YEARS WITH SEAT (INS):",
    "       CHARGE 75 PERCENT OF THE ADULT BASE FARE (CHILD DISCOUNT APPLIES).",
    " CAPACITY LIMITATIONS",
    "   THE CARRIER SHALL LIMIT THE NUMBER OF PASSENGERS CARRIED",
    "   ON ANY ONE FLIGHT AT FARES GOVERNED BY THIS RULE AND SUCH",
    "   FARES WILL NOT NECESSARILY BE AVAILABLE ON ALL FLIGHTS.",
    "   THE NUMBER OF SEATS WHICH THE CARRIER SHALL MAKE",
    "   AVAILABLE ON A GIVEN FLIGHT WILL BE DETERMINED BY THE",
    "   CARRIERS BEST JUDGMENT.",
    " OTHER CONDITIONS",
    "   PIECE CONCEPT BAGGAGE ALLOWANCE",
    "   FOR " + carr + " TARIFFS TICKETS",
    "   ISSUED OR TOTALLY UNUSED TICKETS REISSUED",
    "   ON/AFTER 25 NOV25 AND TRAVEL ON/AFTER 02 MAR26",
    "   POS " + orig.slice(0, 2) + " - TICKETS ISSUED OR TOTALLY UNUSED TICKETS",
    "   ADULT / CHILD (ADT / CHD):",
    "     FIRST CLASS                 - 3 PIECES (32 KG / 70 LB PER PIECE)",
    "     " + info.premiumClass.padEnd(28) + "- 2 PIECES (32 KG / 70 LB PER PIECE)",
    "     PREMIUM ECONOMY CLASS       - 2 PIECES (23 KG / 50 LB PER PIECE)",
    "     ECONOMY CLASS               - 1 PIECE  (23 KG / 50 LB PER PIECE)",
    "   INFANT WITHOUT SEAT (INF):",
    "     ALL CLASSES                 - 1 PIECE  (10 KG / 22 LB)",
    "     PLUS ONE FULLY COLLAPSIBLE PUSHCHAIR / STROLLER OR CAR SEAT",
    "     ACCEPTED FREE OF CHARGE.",
    "   UNBUNDLED FARES WITH FBC -USV- NO CHECKED BAGGAGE ALLOWANCE.",
    "   THE SUM OF LENGTH WIDTH AND HEIGHT OF EACH",
    "   CHECKED BAGGAGE MUST NOT EXCEED 158CM 62 INCHES.",
    "   --------------------------------------------------",
    "   MISTAKEN/ERRONEOUS FARES - " + info.name + " RESERVES",
    "   THE RIGHT TO CANCEL RESERVATION AND/OR TICKETS",
    "   ISSUED WITH AN ERRONEOUSLY QUOTED FARE AFTER",
    "   CARRIER BECOMES AWARE OF THE PUBLISHING OF AN",
    "   ERRONEOUS FARE.",
    "4.  FLIGHT APPLICATION",
    "UNLESS OTHERWISE SPECIFIED",
    "  THE FARE COMPONENT MUST NOT BE ON",
    "      ONE OR MORE OF THE FOLLOWING"
  ];
  info.partners.forEach(function(p) {
    lines.push("        " + p);
  });
  lines.push("  AND");
  lines.push("  IF THE FARE COMPONENT INCLUDES TRAVEL ON " + route);
  lines.push("      THEN TRAVEL MUST BE ON SCHEDULED FLIGHTS OF " + info.name);
  lines.push("      OR AUTHORIZED CODESHARE PARTNERS.");

  lines.forEach(function(l) { print(l); });
  terminal.scrollTop = 0;
}

function renderPenaltiesView(compIdx) {
  const comps = engine.state.fareComponents || [];
  const comp = comps[compIdx] || comps[0] || null;
  const fc = engine.state.fare;
  const carr = (comp && comp.carrier) || (fc && fc.carrier) || (engine.state.segments && engine.state.segments[0] && engine.state.segments[0].carrier) || "TG";
  const info = getAirlineData(carr);
  const basis = (comp && comp.basis) || (fc && fc.fareBasis) || "WLOSV";

  clearScreen();
  print('<span class="rule-link" data-action="fare-components" style="color:#00ff00;cursor:pointer;text-decoration:underline;">«Back to Fare Components»</span>', "html");
  print('16. <span style="color:#ff9900;font-weight:bold;">PENALTIES</span> FOR ' + carr + ' FARE ' + basis, "html");
  const lines = [
    "UNLESS OTHERWISE SPECIFIED",
    "  CHANGES",
    "    ANY TIME - ADULT (ADT)",
    "      CHARGE USD 100.00 (OR EQUIVALENT IN LOCAL CURRENCY) FOR",
    "      REISSUE / REVALIDATION.",
    "    ANY TIME - CHILD (CHD / CNN)",
    "      CHARGE USD 75.00 (75 PERCENT OF APPLICABLE ADULT FEE) FOR",
    "      REISSUE / REVALIDATION.",
    "    ANY TIME - INFANT UNDER 2 YEARS WITHOUT SEAT (INF)",
    "      NO CHARGE / FREE OF CHARGE FOR REISSUE / REVALIDATION.",
    "    ANY TIME - INFANT UNDER 2 YEARS WITH SEAT (INS)",
    "      CHARGE USD 75.00 (CHILD FEE APPLIES) FOR REISSUE / REVALIDATION.",
    "        NOTE - " + info.name,
    "          FARE DIFFERENCE AND APPLICABLE TAX DIFFERENCE WILL BE COLLECTED.",
    "          NVA / NVB - APPLICABLE AS PER TICKET RULES.",
    "          ALL PENALTY CHARGES ARE NON-COMMISSIONABLE.",
    "          NAME CHANGE ANYTIME - NOT PERMITTED.",
    "          NAME CORRECTION BEFORE DEPARTURE - PERMITTED WITH CHARGE.",
    "          NAME CORRECTION AFTER DEPARTURE - NOT PERMITTED.",
    "          --------------------------------------",
    "          -GENERAL INFORMATION FOR REROUTING/ REISSUE:",
    "          1- CHANGE EQUALS TO REISSUE REVALIDATE AND REBOOKING.",
    "          2- ONE FEE APPLIED PER TRANSACTION PER PASSENGER.",
    "          3- CHANGE OF AIRPORT WITHIN ONE CITY DOES NOT",
    "             CONSTITUTE AS REROUTING.",
    "          4- CHANGE MUST BE MADE WITHIN TICKET VALIDITY.",
    "          5- INFANT WITHOUT SEAT IS FULLY EXEMPT FROM CHANGE FEES.",
    "          6- CHILD PAYS 75 PERCENT OF APPLICABLE CHANGE PENALTY.",
    "  CANCELLATIONS",
    "    ANY TIME - ADULT (ADT)",
    "      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.",
    "      UNUTILIZED GOVERNMENT TAXES ARE REFUNDABLE SUBJECT TO ADMIN FEE.",
    "    ANY TIME - CHILD (CHD / CNN)",
    "      TICKET IS NON-REFUNDABLE IN CASE OF CANCEL/REFUND.",
    "      UNUTILIZED GOVERNMENT TAXES ARE REFUNDABLE SUBJECT TO ADMIN FEE.",
    "    ANY TIME - INFANT UNDER 2 YEARS WITHOUT SEAT (INF)",
    "      FULL REFUND PERMITTED WITHOUT CANCELLATION PENALTY."
  ];
  lines.forEach(function(l) { print(l); });
  terminal.scrollTop = 0;
}

function renderLastFareQuote() {
  const lastFareCmd = engine.state.lastFareQuoteCmd;
  if (lastFareCmd) {
    clearScreen();
    printEcho(lastFareCmd.replace(/^>/, ""));
    const resp = engine.process(lastFareCmd);
    if (resp && resp.lines) resp.lines.forEach(function(l) { print(l); });
    terminal.scrollTop = terminal.scrollHeight;
  }
}

  // Handle Display Rules / Back links clicks
  const ruleLink = e.target.closest(".rule-link, .display-rules-link");
  if (ruleLink) {
    const action = ruleLink.dataset.action;
    const compIdx = parseInt(ruleLink.dataset.compidx, 10) || 0;
    if (action === "route-rules") {
      renderRouteRulesView(compIdx);
    } else if (action === "fare-penalties") {
      renderPenaltiesView(compIdx);
    } else if (action === "fare-components") {
      renderFareComponentsView();
    } else if (action === "back-quote") {
      renderLastFareQuote();
    } else {
      renderFareComponentsView();
    }
    inputEl.focus();
    return;
  }
  const closeBtn = e.target.closest(".section-close-btn");
  if (closeBtn && closeBtn.dataset.closeCmd) {
    activeLeftCommands.delete(closeBtn.dataset.closeCmd);
    if (closeBtn.dataset.closeCmd === "*FF") isFqExpanded = false;
    renderCombinedLeftDisplay();
    refreshLeftButtons();
    inputEl.focus();
    return;
  }
  const btn = e.target.closest(".left-btn, [data-cmd]");
  if (btn && btn.dataset.cmd && !btn.classList.contains("display-rules-link")) {
    const cmd = btn.dataset.cmd;
    // If the cmd-link is inside the terminal output (not the left panel), treat it as a command to execute.
    // This handles clickable >*LOCATOR« links produced by TKPDTD / exchange outputs.
    const isInsideTerminal = !!btn.closest(".terminal-wrap, .output, pre");
    if (isInsideTerminal && /^\*[A-Z0-9]{1,8}$/.test(cmd)) {
      printEcho(cmd);
      processCommand(cmd);
      inputEl.focus();
      return;
    }
    const visCmds = getVisibleLeftCommands();
    const nonAll = visCmds.filter(function(c) { return c !== "*ALL"; });
    const allOn = nonAll.length > 0 && nonAll.every(function(c) { return activeLeftCommands.has(c); });
    if (cmd === "*ALL") {
      if (allOn) {
        activeLeftCommands.clear();
        isFqExpanded = false;
      } else {
        nonAll.forEach(function(c) { activeLeftCommands.add(c); });
        isFqExpanded = true;
      }
    } else {
      if (activeLeftCommands.has(cmd)) {
        activeLeftCommands.delete(cmd);
        if (cmd === "*FF") isFqExpanded = false;
      } else {
        activeLeftCommands.add(cmd);
        if (cmd === "*FF") isFqExpanded = false;
      }
    }
    renderCombinedLeftDisplay();
    refreshLeftButtons();
    refreshLeftVendorBox();
    inputEl.focus();
    return;
  }
  if (e.target.closest(".prompt-gt") || e.target.closest(".terminal-wrap")) {
    if (!e.target.closest("button") && !terminalTextIsSelected()) inputEl.focus();
  }
});

terminal.addEventListener("mousemove", function(e) {
  if (terminalTextIsSelected()) { hideTip(); return; }
  const block = e.target.closest(".avail-block");
  if (!block) { hideTip(); return; }
  showTip(block.dataset.notes || "", e.clientX, e.clientY);
});
terminal.addEventListener("mouseleave", hideTip);

function reset() {
  const preservedHistory = engine.state.history || [];
  engine.reset();
  engine.state.history = preservedHistory;
  historyInput.selected = -1;
  lastCommand = "";
  // Default: both panels visible (split-view) just like real Galileo/Smartpoint
  const ws = document.querySelector(".workspace");
  if (ws) ws.classList.add("split-view");
  if (leftMsg) {
    leftMsg.textContent = "NO B.F. TO DISPLAY - CREATE OR RETRIEVE FIRST";
    leftMsg.hidden = false;
  }
  if (leftSegment) leftSegment.hidden = true;
  if (leftBtns) leftBtns.style.display = "none";
  if (leftVendorBox) leftVendorBox.hidden = true;
  if (leftDetails) { leftDetails.innerHTML = ""; leftDetails.hidden = true; }
  if (leftOsi) leftOsi.hidden = true;
  const officeId = (engine.state.officeId || "DACVS086JJ");
  const signOn   = (engine.state.signOn   || "ZHA");
  setScreen(
    "GELLELIO GALILEO TRAINING SIMULATOR\nTRAINING ENVIRONMENT\n\n" +
    "SIGNED IN: " + signOn + "  |  OFFICE: " + officeId + "\n" +
    "Display availability: A22JUNDACDXB  |  Help: HELP\n" +
    "Type at the > prompt above."
  );
  update();
  inputEl.focus();
}

window.reset = reset;
reset();

// Auto sign-in when website auth completes
document.addEventListener('gellelio-signed-in', function(e) {
  const profile = e.detail || {};
  const officeId = profile.office_id || '86JJ';
  const initials = profile.username || 'DEMO';
  // Sync engine state with the authenticated profile
  engine.state.signedIn  = true;
  engine.state.officeId  = officeId;
  engine.state.signOn    = initials;
  // Update displays
  if (typeof update === 'function') update();
  // Remove split-view so terminal is full width on first load
  const ws = document.querySelector('.workspace');
  if (ws) ws.classList.add('split-view');
  // Clear screen, show welcome
  const today = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const dd = String(today.getDate()).padStart(2,'0');
  const mon = months[today.getMonth()];
  const exampleCmd = 'A' + dd + mon + 'DACDXB';
  setScreen(
    'GELLELIO GALILEO TRAINING SIMULATOR\nTRAINING ENVIRONMENT - ONLINE\n\n' +
    'SIGNED IN: ' + initials + '  |  OFFICE: ' + officeId + '\n' +
    'Display availability: ' + exampleCmd + '  |  Help: HELP\n' +
    'Type at the > prompt above.'
  );
  inputEl.focus();
});

// Clear engine state and local history when user signs out
document.addEventListener('gellelio-signed-out', function() {
  try { localStorage.removeItem(HISTORY_KEY); } catch (_) {}
  engine.reset();
  engine.state.history = [];
  engine.state.signedIn = false;
  historyInput.selected = -1;
  lastCommand = "";
  clearScreen();
  reset();
});


// Ticket Receipt Modal Bridge for Galileo
function openGalileoTicketModal() {
  const s = engine.state;
  const tkt = s.issuedTicket || (engine.lastSavedPnr && engine.lastSavedPnr.issuedTicket) || {
    ticketNumber: '232-8901234567',
    ticketNumberRaw: '2328901234567',
    paxName: (s.names[0] || 'PASSENGER').replace(/^\d+-/, ''),
    total: s.fare ? s.fare.total : 45000,
    baseFare: s.fare ? Math.round(s.fare.total / 1.21) : 37190,
    fop: 'CASH',
    status: 'OPEN FOR USE'
  };
  const allTickets = (s.issuedTickets && s.issuedTickets.length)
    ? s.issuedTickets
    : [tkt];
  const activeModalTickets = allTickets.filter(t => !["EXCHANGED", "PARTIALLY EXCHANGED", "VOID", "REFUNDED"].includes(t.status));
  const tickets = activeModalTickets.length ? activeModalTickets : [s.issuedTicket || allTickets[allTickets.length - 1]];

  const segs = s.segments || [];
  const firstSeg = segs[0] || {};
  const carrier = firstSeg.carrier || tkt.carrier || 'BS';

  openTicketModal(
    tickets,
    {
      locator: s.locator || 'GL' + Math.floor(1000 + Math.random()*9000),
      airlinePnr: firstSeg.airlineLocator || firstSeg.carrierLocator || (carrier === 'BS' ? '0A68X7' : '9F3K8L'),
      fop: tkt.fop || 'CASH',
      status: tkt.status || 'CONFIRMED',
      total: s.fare ? s.fare.total : (tkt.total || 45000),
      ssr: s.ssr || [],
      segments: segs
    },
    segs
  );
}

// Toggle Fullscreen Terminal / Split View (Smartpoint FS+ / Window mode)
function toggleWorkspaceView() {
  const ws = document.querySelector(".workspace");
  if (!ws) return;
  ws.classList.toggle("split-view");
}
window.toggleWorkspaceView = toggleWorkspaceView;

document.querySelectorAll("#btnToggleFs, .fs-btn, [title*='Fullscreen'], [title*='Minimize']").forEach(function(btn) {
  btn.style.cursor = "pointer";
  btn.addEventListener("click", toggleWorkspaceView);
});
const windowMenu = document.getElementById("windowMenu");
if (windowMenu) {
  windowMenu.style.cursor = "pointer";
  windowMenu.addEventListener("click", toggleWorkspaceView);
}

const pnrMenu = document.getElementById("pnrMenu");
if (pnrMenu) {
  pnrMenu.style.cursor = "pointer";
  pnrMenu.addEventListener("click", function() {
    const loc = engine.state.locator || (engine.lastSavedPnr && engine.lastSavedPnr.locator);
    if (loc) {
      processCommand("*" + loc);
    } else {
      processCommand("*ALL");
    }
  });
}
