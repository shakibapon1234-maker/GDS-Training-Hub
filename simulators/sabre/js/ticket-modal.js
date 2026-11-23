// Electronic ticket receipt modal controller.
function sbTicketText(value){
  return String(value == null || value === '' ? '—' : value).replace(/[&<>"']/g, function(c){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]; });
}
function renderTicketItinerary(ticketSegments){
  const el = document.getElementById('tktModalItinerary'); if(!el) return;
  if(!Array.isArray(ticketSegments) || !ticketSegments.length){ el.innerHTML = '<p class="ticket-empty">No segment itinerary recorded for this ticket.</p>'; return; }
  el.innerHTML = '<table class="ticket-itinerary-table"><thead><tr><th>Flight</th><th>From</th><th>To</th><th>Depart</th><th>Arrive</th><th>Travel information</th></tr></thead><tbody>' + ticketSegments.map(function(seg){
    const flight = sbTicketText((seg.carrier || seg.al || '') + ' ' + (seg.flightNumber || seg.fn || seg.number || ''));
    const date = sbTicketText(seg.date || seg.fullDate);
    const info = '<span class="ticket-booking-class">Class: ' + sbTicketText(seg.bookingClass || seg.class || seg.soldClass || 'Y') + '<br></span>Cabin: ' + sbTicketText(seg.cabin || 'Economy') + '<br>Baggage: ' + sbTicketText(seg.baggage || '20 KG');
    return '<tr><td><strong>' + flight + '</strong><small>Operating carrier</small></td><td><strong>' + sbTicketText(seg.origin || seg.dep) + '</strong><small>Terminal 1</small></td><td><strong>' + sbTicketText(seg.destination || seg.arr) + '</strong><small>Terminal 1</small></td><td><strong>' + date + '</strong><small>' + sbTicketText(seg.depart || seg.depTime) + '</small></td><td><strong>' + date + '</strong><small>' + sbTicketText(seg.arrive || seg.arrTime) + '</small></td><td>' + info + '<br><span class="ticket-confirmed">' + sbTicketText(seg.status || 'HK1 (CONFIRMED)') + '</span></td></tr>';
  }).join('') + '</tbody></table>';
}
function renderTicketPassengers(passengers){
  const el = document.getElementById('tktModalPassengers'); if(!el) return;
  const rows = Array.isArray(passengers) && passengers.length ? passengers : [{ name: 'PASSENGER' }];
  el.innerHTML = '<table class="ticket-passenger-table"><thead><tr><th>Passenger information</th><th>Passport number</th><th>Frequent flyer number</th><th>Ticket</th></tr></thead><tbody>' + rows.map(function(p){ return '<tr><td>' + sbTicketText(p.name) + '</td><td>' + sbTicketText(p.passport) + '</td><td>' + sbTicketText(p.frequentFlyer) + '</td><td>' + sbTicketText(p.ticket) + '</td></tr>'; }).join('') + '</tbody></table>';
}
function openTicketModal(pax, tktNo, fare, flight, depDate, dest, origTkt, itinerary, pnrData, documentOptions){
  pnrData = pnrData || {}; documentOptions = documentOptions || {};
  const set = function(id, value){ const el = document.getElementById(id); if(el) el.textContent = value || '—'; };
  const origRow = document.getElementById('tktModalOrigRow'); if(origRow){ origRow.style.display = origTkt ? 'flex' : 'none'; set('tktModalOrig', origTkt); }
  set('tktModalPNR', pnrData.locator); const airlineRow = document.getElementById('tktModalAirlinePNRRow'); const airlinePnr = pnrData.airlinePnr || (itinerary && itinerary[0] && (itinerary[0].airlineLocator || itinerary[0].carrierLocator)); if(airlineRow) airlineRow.style.display = airlinePnr ? 'flex' : 'none'; set('tktModalAirlinePNR', airlinePnr);
  set('tktModalFOP', pnrData.fop || 'CASH'); const status = pnrData.status || 'OK'; const statusText = { R:'REFUNDED', E:'EXCHANGED', V:'VOIDED', OK:'OPEN', O:'OPEN' }[status] || status; set('tktModalStatus', statusText);
  const statusEl = document.getElementById('tktModalStatus'); if(statusEl) statusEl.style.color = /REFUND|VOID/.test(statusText) ? '#dc2626' : (statusText === 'EXCHANGED' ? '#d97706' : '#157347');
  const route = Array.isArray(itinerary) && itinerary.length ? itinerary.map(function(s){ return s.origin || s.dep; }).concat((itinerary[itinerary.length - 1] || {}).destination || (itinerary[itinerary.length - 1] || {}).arr).filter(Boolean).join(' → ') : '—';
  set('tktModalRoute', route); set('tktModalPax', pax || 'PASSENGER'); set('tktModalNumber', tktNo); set('tktModalFare', fare); set('tktModalFlight', flight); set('tktModalDate', depDate); set('tktModalDest', dest); set('tktModalIssueDate', pnrData.issueDate || new Date().toLocaleDateString('en-GB', {day:'2-digit', month:'short', year:'numeric'}).toUpperCase()); set('tktModalFareBasis', pnrData.fareBasis); set('tktModalBaseFare', pnrData.baseFare || fare);
  const title = document.getElementById('tktModalTitle'); if(title) title.textContent = documentOptions.title || 'Electronic Ticket'; renderTicketPassengers(pnrData.passengers); renderTicketItinerary(itinerary);
  const card = document.getElementById('ticketModalCard'); if(card){ card.scrollTop = 0; card.classList.remove('hide-fare-on-print', 'hide-fare-active', 'hide-booking-class'); card.classList.toggle('hide-booking-class', Boolean(documentOptions.hideBookingClass)); }
  const hideFare = document.getElementById('hideFareCheckbox'); if(hideFare){ hideFare.checked = false; hideFare.onchange = function(){ if(card){ card.classList.toggle('hide-fare-active', this.checked); card.classList.toggle('hide-fare-on-print', this.checked); } }; }
  const backdrop = document.getElementById('ticketModalBackdrop'); if(backdrop) backdrop.classList.add('show');
}
function closeTicketModal(){ const el = document.getElementById('ticketModalBackdrop'); if(el) el.classList.remove('show'); }
function printTicketReceipt(){ const card = document.getElementById('ticketModalCard'); const hide = document.getElementById('hideFareCheckbox'); if(card) card.classList.toggle('hide-fare-on-print', Boolean(hide && hide.checked)); window.print(); }
async function saveTicketReceiptPdf(){ const ticketNumber = document.getElementById('tktModalNumber')?.textContent?.trim() || 'ticket-receipt'; if(window.sabreDesktop && typeof window.sabreDesktop.saveTicketPdf === 'function'){ await window.sabreDesktop.saveTicketPdf(ticketNumber); return; } window.print(); }
