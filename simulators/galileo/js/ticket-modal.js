// ============================================================
// GDS Training Hub - Electronic Ticket Receipt Modal Controller
// Matches official airline e-ticket format (Screenshot 2 / Galileo)
// Supports multi-passenger separate pages (1 page per pax) vs combined ticket
// ============================================================

let currentTicketData = null;
let currentTicketMode = 'separate';

const TICKET_AIRPORTS = {
  DAC: { name: "Hazrat Shahjalal Intl Arpt", city: "Dhaka", terminal: "1" },
  CGP: { name: "Shah Amanat Intl Arpt", city: "Chittagong", terminal: "1" },
  ZYL: { name: "Osmani Intl Arpt", city: "Sylhet", terminal: "1" },
  CXB: { name: "Cox's Bazar Arpt", city: "Cox's Bazar", terminal: "1" },
  JSR: { name: "Jashore Arpt", city: "Jashore", terminal: "1" },
  SPD: { name: "Saidpur Arpt", city: "Saidpur", terminal: "1" },
  BZL: { name: "Barishal Arpt", city: "Barishal", terminal: "1" },
  RJH: { name: "Shah Makhdum Arpt", city: "Rajshahi", terminal: "1" },
  KUL: { name: "Kuala Lumpur International Arpt", city: "Kuala Lumpur", terminal: "M" },
  BKK: { name: "Suvarnabhumi Intl Arpt", city: "Bangkok", terminal: "1" },
  DMK: { name: "Don Mueang Intl Arpt", city: "Bangkok", terminal: "1" },
  SIN: { name: "Singapore Changi Intl Arpt", city: "Singapore", terminal: "3" },
  DXB: { name: "Dubai Intl Arpt", city: "Dubai", terminal: "3" },
  SHJ: { name: "Sharjah Intl Arpt", city: "Sharjah", terminal: "1" },
  AUH: { name: "Zayed Intl Arpt", city: "Abu Dhabi", terminal: "A" },
  DOH: { name: "Hamad Intl Arpt", city: "Doha", terminal: "1" },
  JED: { name: "King Abdulaziz Intl Arpt", city: "Jeddah", terminal: "1" },
  MED: { name: "Prince Mohammad Intl Arpt", city: "Medina", terminal: "1" },
  RUH: { name: "King Khalid Intl Arpt", city: "Riyadh", terminal: "2" },
  DMM: { name: "King Fahd Intl Arpt", city: "Dammam", terminal: "1" },
  BOM: { name: "Chhatrapati Shivaji Intl Arpt", city: "Mumbai", terminal: "2" },
  DEL: { name: "Indira Gandhi Intl Arpt", city: "Delhi", terminal: "3" },
  CCU: { name: "Netaji Subhash Chandra Bose Arpt", city: "Kolkata", terminal: "2" },
  MAA: { name: "Chennai Intl Arpt", city: "Chennai", terminal: "2" },
  BLR: { name: "Kempegowda Intl Arpt", city: "Bangalore", terminal: "2" },
  KTM: { name: "Tribhuvan Intl Arpt", city: "Kathmandu", terminal: "1" },
  CMB: { name: "Bandaranaike Intl Arpt", city: "Colombo", terminal: "1" },
  MLE: { name: "Velana Intl Arpt", city: "Male", terminal: "1" },
  LHR: { name: "Heathrow Intl Arpt", city: "London", terminal: "4" },
  IST: { name: "Istanbul Arpt", city: "Istanbul", terminal: "1" },
  JFK: { name: "John F. Kennedy Intl Arpt", city: "New York", terminal: "4" }
};

const TICKET_AIRLINES = {
  BS: { name: "US Bangla", num: "779", aircraft: "Airbus Industrie A330-300" },
  MH: { name: "Malaysia Airlines", num: "232", aircraft: "Airbus Industrie A330-300" },
  BG: { name: "Biman Bangladesh Airlines", num: "997", aircraft: "Boeing 787-8" },
  AI: { name: "Air India", num: "098", aircraft: "Airbus A320neo" },
  TK: { name: "Turkish Airlines", num: "235", aircraft: "Airbus A330-300" },
  TG: { name: "Thai Airways", num: "217", aircraft: "Boeing 777-300ER" },
  EK: { name: "Emirates", num: "176", aircraft: "Boeing 777-300ER" },
  SQ: { name: "Singapore Airlines", num: "618", aircraft: "Airbus A350-900" },
  QR: { name: "Qatar Airways", num: "157", aircraft: "Boeing 787-9" },
  SV: { name: "Saudia", num: "065", aircraft: "Boeing 777-300ER" },
  EY: { name: "Etihad Airways", num: "607", aircraft: "Boeing 787-10" },
  G9: { name: "Air Arabia", num: "514", aircraft: "Airbus A320" },
  FZ: { name: "Flydubai", num: "141", aircraft: "Boeing 737 MAX 8" },
  J9: { name: "Jazeera Airways", num: "486", aircraft: "Airbus A320neo" },
  KU: { name: "Kuwait Airways", num: "229", aircraft: "Boeing 777-300ER" },
  WY: { name: "Oman Air", num: "910", aircraft: "Boeing 787-9" },
  "6E": { name: "IndiGo", num: "312", aircraft: "Airbus A321neo" },
  "2A": { name: "Air Astra", num: "610", aircraft: "ATR 72-600" },
  AK: { name: "AirAsia", num: "807", aircraft: "Airbus A320" }
};

function getTicketAirport(code) {
  if (!code) return { name: "International Airport", city: "City", terminal: "1" };
  const c = code.toUpperCase();
  if (TICKET_AIRPORTS[c]) return TICKET_AIRPORTS[c];
  if (typeof GalileoAirports !== "undefined" && GalileoAirports.airports && GalileoAirports.airports[c]) {
    const a = GalileoAirports.airports[c];
    return { name: a.name + " Arpt", city: a.city, terminal: "1" };
  }
  return { name: c + " Airport", city: c, terminal: "1" };
}

function getTicketAirline(code) {
  if (!code) return { name: "Airlines", num: "232", aircraft: "Airbus Industrie A330-300" };
  const c = code.toUpperCase();
  if (TICKET_AIRLINES[c]) return TICKET_AIRLINES[c];
  if (typeof GalileoAirports !== "undefined" && GalileoAirports.airlines && GalileoAirports.airlines[c]) {
    const a = GalileoAirports.airlines[c];
    return { name: a.name, num: a.num || "232", aircraft: "Airbus Industrie A330-300" };
  }
  return { name: c, num: "232", aircraft: "Airbus Industrie A330-300" };
}

function formatTicketDate(dateStr) {
  if (!dateStr) return "Tue, 18 Aug 26";
  const str = String(dateStr).trim().toUpperCase();
  const MONTHS = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const m = str.match(/^(\d{1,2})([A-Z]{3})(\d{2})?$/);
  if (m) {
    const d = parseInt(m[1], 10);
    const monIdx = MONTHS[m[2]];
    const yr = m[3] ? (2000 + parseInt(m[3], 10)) : new Date().getFullYear();
    if (monIdx !== undefined) {
      const dt = new Date(yr, monIdx, d);
      const dayName = DAYS[dt.getDay()];
      const yrShort = String(yr).slice(-2);
      return `${dayName}, ${String(d).padStart(2, "0")} ${MONTH_NAMES[monIdx]} ${yrShort}`;
    }
  }
  return dateStr;
}

function formatIssueDate(dateStr) {
  if (!dateStr) {
    const now = new Date();
    const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${String(now.getDate()).padStart(2, "0")}${MONTH_NAMES[now.getMonth()]}${String(now.getFullYear()).slice(-2)}`;
  }
  return dateStr;
}

function getPassengerPassport(paxIdx, paxName, ssrList) {
  if (!ssrList || !ssrList.length) return "";
  const pNum = String(paxIdx + 1);

  for (let i = 0; i < ssrList.length; i++) {
    const item = ssrList[i];
    const raw = (typeof item === "object" && item.raw) ? item.raw : String(item);
    if (!raw.toUpperCase().includes("DOCS")) continue;

    // A document must have an explicit passenger association.  In particular,
    // never use the lone DOCS SSR as a fallback for other passengers.
    const matches = (typeof item === "object" && String(item.passenger || "") === pNum) ||
      new RegExp(`(?:^|[./])P${pNum}(?:[./]|$)`, "i").test(raw);

    if (matches) {
      const m = raw.match(/\/P\/[A-Z]{3}\/([A-Z0-9]+)\//i) || raw.match(/\/([A-Z0-9]{7,10})\//i);
      if (m) return m[1];
    }
  }
  return "";
}

function renderTicketSheets() {
  const container = document.getElementById('ticketSheetsContainer');
  if (!container || !currentTicketData) return;

  const { tickets, pnrData, itinerary } = currentTicketData;
  const isSeparate = currentTicketMode === 'separate' && tickets.length > 1;

  // Toggle button active states
  const btnSep = document.getElementById('btnModeSeparate');
  const btnComb = document.getElementById('btnModeCombined');
  const toggleWrap = document.getElementById('ticketModeToggle');
  if (toggleWrap) {
    toggleWrap.style.display = tickets.length > 1 ? 'flex' : 'none';
  }
  if (btnSep) btnSep.classList.toggle('active', isSeparate);
  if (btnComb) btnComb.classList.toggle('active', !isSeparate);

  let html = '';

  const sheetsToRender = isSeparate ? tickets.map(t => [t]) : [tickets];

  sheetsToRender.forEach((sheetTickets, sheetIdx) => {
    const firstTkt = sheetTickets[0] || {};
    const primaryCarrier = firstTkt.carrier || (itinerary[0] && itinerary[0].carrier) || "BS";
    const airlineInfo = getTicketAirline(primaryCarrier);

    const airlinePnrRaw = pnrData.airlinePnr || (itinerary[0] && (itinerary[0].airlineLocator || itinerary[0].carrierLocator)) || "0A68X7";
    const airlinePnrDisplay = `${airlinePnrRaw} (${primaryCarrier} - ${airlineInfo.name})`;
    const galileoPnrDisplay = pnrData.locator || "HQCT3M";
    const issueDateDisplay = formatIssueDate(firstTkt.issueDate);

    // Calculate fare for this sheet
    let sheetBase = 0;
    let sheetTax = 0;
    let sheetTotal = 0;
    sheetTickets.forEach(t => {
      sheetTotal += (t.total || 0);
      sheetBase += (t.baseFare || Math.round((t.total || 0) / 1.21));
      sheetTax += (t.total || 0) - (t.baseFare || Math.round((t.total || 0) / 1.21));
    });
    if (sheetTotal === 0) {
      sheetTotal = pnrData.total || 45000;
      sheetBase = Math.round(sheetTotal / 1.21);
      sheetTax = sheetTotal - sheetBase;
    }

    html += `
      <div class="ticket-sheet">
        <!-- Top Agency Header & Logo -->
        <div class="ticket-agency-row">
          <div class="ticket-agency-header">
            <div class="agency-title">GDS Training Hub</div>
            <div class="agency-detail">Galileo Training Simulator</div>
            <div class="agency-detail">Electronic Ticket Receipt</div>
          </div>
          <div class="ticket-logo-box">
            <img src="images/gds-training-hub-logo.jpg" alt="Logo" class="ticket-modal-logo" onerror="this.src='images/logo.png'">
          </div>
        </div>

        <h2 class="ticket-doc-title">Electronic Ticket</h2>

        <!-- Passenger Information Table -->
        <div class="ticket-section-header">Passenger Information</div>
        <table class="ticket-teal-table">
          <thead>
            <tr>
              <th style="width: 38%;">Passenger Information</th>
              <th style="width: 22%;">Passport Number</th>
              <th style="width: 18%;">Frequent Flyer Number</th>
              <th style="width: 22%;">Ticket</th>
            </tr>
          </thead>
          <tbody>
            ${sheetTickets.map((t, idx) => {
              const pIdx = (t.passengerIndex ? t.passengerIndex - 1 : (isSeparate ? sheetIdx : idx));
              // A live PNR SSR is authoritative.  Do not fall back to a
              // ticket-level value when DOCS entries exist, otherwise an old
              // copied value can appear on another passenger's separate page.
              const hasDocs = (pnrData.ssr || []).some(item => String(item && (item.raw || item) || '').toUpperCase().includes('DOCS'));
              const passport = hasDocs
                ? getPassengerPassport(pIdx, t.paxName, pnrData.ssr || [])
                : (t.passport || '');
              const tktDisplay = t.ticketNumberRaw || (t.ticketNumber ? t.ticketNumber.replace(/-/g, '') : '7793959708372');
              return `
                <tr>
                  <td><strong>${t.paxName || 'PASSENGER'}</strong></td>
                  <td>${passport || ''}</td>
                  <td>${t.frequentFlyer || ''}</td>
                  <td>${tktDisplay}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Airline PNR / Galileo PNR / Date of Issue Bar -->
        <table class="ticket-teal-table ticket-pnr-bar">
          <thead>
            <tr>
              <th style="width: 48%;">Airline PNR</th>
              <th style="width: 28%;">Galileo PNR</th>
              <th style="width: 24%;">Date of Issue</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>${airlinePnrDisplay}</strong></td>
              <td><strong>${galileoPnrDisplay}</strong></td>
              <td>${issueDateDisplay}</td>
            </tr>
          </tbody>
        </table>

        <!-- Itinerary Information Table -->
        <div class="ticket-section-header">Itinerary Information</div>
        <table class="ticket-teal-table itinerary-table">
          <thead>
            <tr>
              <th style="width: 13%;">Flight #</th>
              <th style="width: 22%;">From</th>
              <th style="width: 22%;">To</th>
              <th style="width: 14%;">Depart</th>
              <th style="width: 14%;">Arrive</th>
              <th style="width: 6%;">Seat</th>
              <th style="width: 19%;">Info</th>
            </tr>
          </thead>
          <tbody>
            ${(!itinerary || !itinerary.length) ? `
              <tr>
                <td colspan="7" style="text-align:center;color:#64748b;padding:12px;">No flight itinerary segments found.</td>
              </tr>
            ` : itinerary.map((seg, sIdx) => {
              const segCarrier = seg.carrier || primaryCarrier;
              const segAirline = getTicketAirline(segCarrier);
              const fltNum = seg.number || seg.flightNumber || '315';
              const origAirport = getTicketAirport(seg.origin || 'DAC');
              const destAirport = getTicketAirport(seg.destination || 'KUL');
              const origTerm = seg.termOrig || origAirport.terminal || '1';
              const destTerm = seg.termDest || destAirport.terminal || 'M';

              const depDateStr = formatTicketDate(seg.date || '18AUG26');
              const arrDateStr = formatTicketDate(seg.arrDate || seg.date || '18AUG26');
              const depTime = seg.depart || seg.depTime || '08:25';
              const arrTime = seg.arrive || seg.arrTime || '14:20';

              const baggage = seg.baggage || (pnrData.baggage) || '30K';
              const clsDesc = (seg.soldClass === 'J' || seg.soldClass === 'C') ? 'Business' : 'Economy';
              const duration = seg.duration || '3h 55m';
              const aircraft = seg.aircraft || segAirline.aircraft || 'Airbus Industrie A330-300';

              return `
                <tr>
                  <td>
                    <div class="tkt-carrier-name">${segAirline.name}</div>
                    <div class="tkt-flight-code">${segCarrier} ${fltNum}</div>
                  </td>
                  <td>
                    <strong>${origAirport.city} - ${origAirport.name}</strong>
                    <br><span style="font-size:11px;color:#334155;">, Terminal ${origTerm}</span>
                  </td>
                  <td>
                    <strong>${destAirport.city} - ${destAirport.name}</strong>
                    <br><span style="font-size:11px;color:#334155;">, Terminal ${destTerm}</span>
                  </td>
                  <td>
                    <div style="font-size:11px;color:#334155;">${depDateStr}</div>
                    <div class="flight-time">${depTime}</div>
                  </td>
                  <td>
                    <div style="font-size:11px;color:#334155;">${arrDateStr}</div>
                    <div class="flight-time">${arrTime}</div>
                  </td>
                  <td>${seg.seat || '—'}</td>
                  <td>
                    <div class="tkt-info-item">Baggage : ${baggage}</div>
                    <div class="tkt-info-item">Class : ${clsDesc}</div>
                    <div class="tkt-info-item">Duration : ${duration}</div>
                    <div class="tkt-info-item">Status : <span style="color:#16a34a;font-weight:700;">Confirmed</span></div>
                    <div class="tkt-info-item">Aircraft : ${aircraft}</div>
                    <div class="tkt-info-item">Special Svc : </div>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Fare Breakdown (User: ফেয়ার যেভাবে আছে থাক) -->
        <div class="ticket-fare-section">
          <div class="ticket-detail-row">
            <span class="detail-label">Base Fare:</span>
            <span class="detail-value">BDT ${sheetBase.toLocaleString()}</span>
          </div>
          <div class="ticket-detail-row">
            <span class="detail-label">Taxes / Fees / Charges:</span>
            <span class="detail-value">BDT ${sheetTax.toLocaleString()}</span>
          </div>
          <div class="ticket-detail-row ticket-fare-row">
            <span class="detail-label">Total Fare:</span>
            <span class="detail-value" style="font-size:15px;font-weight:800;color:#15803d;">BDT ${sheetTotal.toLocaleString()}</span>
          </div>
          <div class="ticket-detail-row">
            <span class="detail-label">Form of Payment:</span>
            <span class="detail-value">${pnrData.fop || firstTkt.fop || 'CASH'}</span>
          </div>
          <div class="ticket-detail-row">
            <span class="detail-label">Ticket Status:</span>
            <span class="detail-value" style="font-weight:700;color:#16a34a;">${firstTkt.status || pnrData.status || 'OPEN FOR USE'}</span>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

function switchTicketMode(mode) {
  currentTicketMode = mode;
  renderTicketSheets();
}

function openTicketModal(ticketsArg, pnrData, itineraryArg) {
  let tickets = [];
  let itinerary = [];
  let pnr = pnrData || {};

  // Compatibility with old signature: openTicketModal(pax, tktNo, fare, flight, depDate, dest, origTkt, itinerary, pnrData)
  if (typeof ticketsArg === 'string') {
    const pax = ticketsArg;
    const tktNo = arguments[1] || '7793959708372';
    const fareStr = arguments[2] || 'BDT 35000';
    const totalNum = parseInt(String(fareStr).replace(/[^\d]/g, ''), 10) || 35000;
    const flight = arguments[3] || 'BS 315';
    const depDate = arguments[4] || '18AUG';
    const dest = arguments[5] || 'KUL';
    const origTkt = arguments[6] || null;
    itinerary = arguments[7] || [];
    pnr = arguments[8] || {};

    const [carrier, fltNum] = flight.split(' ');
    tickets = [{
      paxName: pax,
      ticketNumber: tktNo,
      ticketNumberRaw: String(tktNo).replace(/-/g, ''),
      total: totalNum,
      baseFare: Math.round(totalNum / 1.21),
      originalTicket: origTkt,
      carrier: carrier || 'BS',
      flightNumber: fltNum || '315',
      date: depDate,
      destination: dest
    }];
  } else if (Array.isArray(ticketsArg)) {
    tickets = ticketsArg;
    itinerary = (pnrData && pnrData.segments) || (typeof engine !== 'undefined' && engine.state && engine.state.segments) || [];
  } else if (typeof ticketsArg === 'object' && ticketsArg !== null) {
    tickets = [ticketsArg];
    itinerary = (pnrData && pnrData.segments) || (typeof engine !== 'undefined' && engine.state && engine.state.segments) || [];
  }

  if (!itinerary || !itinerary.length) {
    if (typeof engine !== 'undefined' && engine.state && engine.state.segments && engine.state.segments.length) {
      itinerary = engine.state.segments;
    }
  }

  currentTicketData = {
    tickets: tickets,
    pnrData: pnr,
    itinerary: itinerary
  };

  // If multiple passengers: prompt user whether they want separate ticket pages or combined
  if (tickets.length > 1) {
    const askSeparate = confirm(
      `You have ${tickets.length} passengers in this booking.\n\n` +
      `Do you want separate ticket pages for all ${tickets.length} passengers (3 separate pages)?\n\n` +
      `• Click OK for ${tickets.length} separate ticket pages (1 page per passenger)\n` +
      `• Click Cancel for 1 combined ticket listing all passengers`
    );
    currentTicketMode = askSeparate ? 'separate' : 'combined';
  } else {
    currentTicketMode = 'combined';
  }

  renderTicketSheets();

  const card = document.getElementById('ticketModalCard');
  if (card) {
    card.scrollTop = 0;
    card.classList.remove('hide-fare-on-print', 'hide-fare-active');
  }

  const hideFare = document.getElementById('hideFareCheckbox') || document.getElementById('tktHideFare');
  if (hideFare) {
    hideFare.checked = false;
    hideFare.onchange = function() {
      if (card) {
        card.classList.toggle('hide-fare-active', this.checked);
        card.classList.toggle('hide-fare-on-print', this.checked);
      }
    };
  }

  const bd = document.getElementById('ticketModalBackdrop');
  if (bd) bd.classList.add('show');
}

function closeTicketModal() {
  const bd = document.getElementById('ticketModalBackdrop');
  if (bd) bd.classList.remove('show');
}

function printTicketReceipt() {
  const card = document.getElementById('ticketModalCard');
  const hideFare = document.getElementById('hideFareCheckbox');
  if (card) card.classList.toggle('hide-fare-on-print', Boolean(hideFare && hideFare.checked));
  window.print();
}

window.openTicketModal = openTicketModal;
window.closeTicketModal = closeTicketModal;
window.printTicketReceipt = printTicketReceipt;
window.switchTicketMode = switchTicketMode;
