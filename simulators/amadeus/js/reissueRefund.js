// ==========================================================================
// AMADEUS REISSUE & REFUND SYSTEM (Standard IATA / Amadeus GDS Formats)
// Supports BOTH:
// 1. Manual Workflow: TravelOcademy Session 30 (TRF, TRFP/CP, FO, TTP/EXCH)
// 2. Automated Auto-Code Workflow: ATC Amadeus Ticket Changer (TRF/ATC, FXQ, FXE, FXI, TQR, TTP/ATC)
// ==========================================================================

// Global session refunds store for TRDC reporting
window._sessionRefunds = window._sessionRefunds || [];

// ---------- 1. TRDC — Void Electronic Ticket ----------
// Void is distinct from refund: it is available only on the ticket issue date,
// while the sale is not confirmed and the coupon is still open for travel.
function handleTRDCVoid(cmd){
  const tickets = state.tickets || [];
  if(!tickets.length){
    printLines(['NO ELECTRONIC TICKET RECORD IN ACTIVE PNR TO VOID', 'RETRIEVE A TICKETED PNR OR ISSUE A TICKET FIRST WITH TTP'], 'err');
    return;
  }

  const ticketMatch = cmd.match(/\/TK-?([0-9-]+)/i);
  const lineMatch = cmd.match(/\/L(\d+)\b/i);
  if(!ticketMatch && !lineMatch){
    printLines([
      'SELECT FA OR FH LINE NUMBER',
      'ENTER TRDC/L1 FOR THE FIRST TICKET IN THIS SIMULATOR',
      'OR ENTER TRDC/TK-157-7800396554421 FOR A SPECIFIC TICKET'
    ], 'err');
    return;
  }

  let ticket;
  if(ticketMatch){
    const wanted = ticketMatch[1].replace(/-/g, '');
    ticket = tickets.find(t => String(t.tktNum || '').replace(/-/g, '') === wanted);
  } else {
    // In the simulator L1, L2, etc. select the corresponding FA/FH ticket.
    ticket = tickets[parseInt(lineMatch[1], 10) - 1];
  }
  if(!ticket){
    printLines(['DOCUMENT NOT FOUND', 'CHECK THE FA/FH LINE OR TICKET NUMBER WITH TWD'], 'err');
    return;
  }
  if(ticket.status === 'V'){
    printLines([`TRDC/TK-${ticket.tktNum}`, 'ERROR: DOCUMENT ALREADY VOIDED', 'VOIDED E-TICKETS CANNOT BE REINSTATED'], 'err');
    return;
  }
  if(ticket.status === 'R'){
    printLines([`TRDC/TK-${ticket.tktNum}`, 'ERROR: TICKET ALREADY REFUNDED', 'A REFUNDED TICKET CANNOT BE VOIDED'], 'err');
    return;
  }
  if(ticket.status === 'E'){
    printLines([`TRDC/TK-${ticket.tktNum}`, 'ERROR: TICKET ALREADY EXCHANGED', 'SELECT THE CURRENT REISSUED TICKET; AIRLINE RULES MUST ALLOW VOID'], 'err');
    return;
  }
  if(ticket.issuedAt && new Date(ticket.issuedAt).toDateString() !== new Date().toDateString()){
    printLines([`TRDC/TK-${ticket.tktNum}`, 'VOID PERIOD EXPIRED', 'VOID IS AVAILABLE ONLY ON THE TICKET ISSUE DATE — USE TRF FOR REFUND'], 'err');
    return;
  }

  ticket.status = 'V';
  ticket.voidedAt = new Date().toISOString();
  state.ticketed = tickets.some(t => t.status !== 'V');
  state.hasPending = true;
  saveCurrentPNR();
  printLines([
    `TRDC/TK-${ticket.tktNum}`,
    'OK - DOCUMENT(S) CANCELLED',
    `ETKT ${ticket.tktNum} STATUS: VOID`,
    'NO REFUND RECORD CREATED — VOID COMPLETED ON ISSUE DATE'
  ], 'success');
  showToast(`Ticket voided: ${ticket.tktNum}`);
}

// ---------- 2. TWD — Electronic Ticket Record Display (ETR) ----------
const REFUND_TAX_WEIGHTS = [
  ['BD', 500], ['E5', 444], ['OW', 2500], ['P7', 1228], ['P8', 1228],
  ['UT', 4000], ['E3', 524], ['IO', 4585], ['T2', 164]
];

function getTicketTaxLines(ticket){
  if(Array.isArray(ticket.taxBreakdown) && ticket.taxBreakdown.length) return ticket.taxBreakdown;
  const amount = Number(ticket.amount) || 30000;
  const taxTotal = amount - Math.round(amount * 0.8);
  let allocated = 0;
  ticket.taxBreakdown = REFUND_TAX_WEIGHTS.map(([code, weight], index) => {
    const value = index === REFUND_TAX_WEIGHTS.length - 1
      ? taxTotal - allocated
      : Math.floor(taxTotal * weight / 15173);
    allocated += value;
    return { code, amount: value };
  });
  return ticket.taxBreakdown;
}

function getRefundTaxTotal(refund){
  return (refund.taxLines || []).reduce((sum, line) => sum + (Number(line.amount) || 0), 0);
}

function getRefundFare(refund){
  return Math.max(0, Number(refund.farePaid || 0) - Number(refund.fareUsed || 0));
}

function getRefundTotal(refund){
  return Math.max(0, getRefundFare(refund) + getRefundTaxTotal(refund) - Number(refund.penalty || 0));
}

function getTicketByLine(lineNumber){
  const tickets = state.tickets || [];
  const mappedTicket = state.ticketLineNumbers && state.ticketLineNumbers[String(lineNumber)];
  if(mappedTicket){
    return tickets.find(ticket => ticket.tktNum === mappedTicket) || null;
  }
  return Number(lineNumber) >= 1 && Number(lineNumber) <= tickets.length ? tickets[Number(lineNumber) - 1] : null;
}

function printRefundRecord(){
  const r = state._refundData;
  if(!r) return;
  const t = r.ticket;
  printLines([
    `REFUND RECORD ${r.isATC ? '(ATC)' : '(MANUAL)'}`,
    `TKT ${t.tktNum}  NAME: ${t.name || 'PASSENGER'}`,
    `FARE PAID       BDT ${Number(r.farePaid || 0)}`,
    `FARE USED       BDT ${Number(r.fareUsed || 0)}`,
    `FARE REFUND     BDT ${getRefundFare(r)}`,
    `TAX REFUND      BDT ${getRefundTaxTotal(r)}   >TRFT`,
    `CANCELLATION FEE BDT ${Number(r.penalty || 0)}`,
    `REFUND TOTAL    BDT ${getRefundTotal(r)}`,
    `FP ${state.fop || 'CASH'}  REFUND FORM OF PAYMENT`,
    `ENTER TRFP TO PROCESS REFUND`
  ], '');
}

function handleTRFT(){
  if(!state._refundData){
    printLines(['NO REFUND RECORD — ENTER TRF FIRST'], 'err');
    return;
  }
  const r = state._refundData;
  const rows = [`REFUNDABLE TAXES — ${r.ticket.name || 'PASSENGER'}`, `TKT ${r.ticket.tktNum}`, 'UNUSED TAXES'];
  (r.taxLines || []).forEach((line, index) => rows.push(`T${index + 1}  ${Number(line.amount || 0)} ${line.code}`));
  rows.push(`REFUNDABLE TAX TOTAL  BDT ${getRefundTaxTotal(r)} XT`);
  printLines(rows, '');
}

function handleTRFU(cmd){
  const r = state._refundData;
  if(!r){
    printLines(['NO REFUND RECORD — ENTER TRF FIRST'], 'err');
    return;
  }
  let m = cmd.match(/^TRFU\/(?:TX)(\d+)(?:-(\d+))?$/i);
  if(m){
    const first = Number(m[1]);
    const last = Number(m[2] || m[1]);
    if(first < 1 || last < first || last > r.taxLines.length){
      printLines(['TAX LINE RANGE NOT FOUND — ENTER TRFT TO CHECK TAX LINES'], 'err');
      return;
    }
    r.taxLines.splice(first - 1, last - first + 1);
    r.updated = true;
    printLines([`REFUND TAX LINES ${first}${last !== first ? `-${last}` : ''} DELETED`, `REFUNDABLE TAX TOTAL BDT ${getRefundTaxTotal(r)}`], 'success');
    return;
  }
  m = cmd.match(/^TRFU\/(?:TU)(\d+)[-/](\d+(?:\.\d{1,2})?)$/i);
  if(m){
    const index = Number(m[1]) - 1;
    const value = Number(m[2]);
    if(index < 0 || index >= r.taxLines.length || !Number.isFinite(value)){
      printLines(['TAX LINE OR AMOUNT INVALID — ENTER TRFT TO CHECK TAX LINES'], 'err');
      return;
    }
    r.taxLines[index].amount = value;
    r.updated = true;
    printLines([`REFUND TAX T${index + 1} UPDATED TO BDT ${value}`, `REFUNDABLE TAX TOTAL BDT ${getRefundTaxTotal(r)}`], 'success');
    return;
  }
  m = cmd.match(/^TRFU\/(?:U|FU)(\d+(?:\.\d{1,2})?)$/i);
  if(m){
    const usedFare = Number(m[1]);
    if(usedFare > r.farePaid){
      printLines(['FARE USED CANNOT EXCEED FARE PAID'], 'err');
      return;
    }
    r.fareUsed = usedFare;
    r.updated = true;
    printLines([`FARE USED UPDATED BDT ${usedFare}`, `FARE REFUND BDT ${getRefundFare(r)}`, `REFUND TOTAL BDT ${getRefundTotal(r)}`], 'success');
    return;
  }
  m = cmd.match(/^TRFU\/CP(\d+(?:\.\d{1,2})?)([AP])?$/i);
  if(m){
    const input = Number(m[1]);
    const type = (m[2] || 'A').toUpperCase();
    const penalty = type === 'P' ? Math.round(Number(r.farePaid || 0) * input / 100) : input;
    if(penalty > getRefundFare(r) + getRefundTaxTotal(r)){
      printLines(['PENALTY CANNOT EXCEED REFUNDABLE AMOUNT'], 'err');
      return;
    }
    r.penalty = penalty;
    r.penaltyInput = input;
    r.penaltyType = type;
    r.penaltySource = 'FARE RULE FEE ENTERED';
    r.updated = true;
    printLines([`CANCELLATION PENALTY UPDATED BDT ${penalty} (${input}${type})`, `REFUND TOTAL BDT ${getRefundTotal(r)}`], 'success');
    return;
  }
  printLines(['FORMAT: TRFU/U<FARE-USED>, TRFU/TX<LINE[-LINE]>, TRFU/TU<LINE>-<AMOUNT>, OR TRFU/CP<AMOUNT>'], 'err');
}

// Training-only helper: coupon status is normally updated by the airline/DCS.
function handleSimFlownCoupon(cmd){
  const match = cmd.match(/^SIM\/COUPON\/FLOWN\/(\d+)$/i);
  const ticket = state.tickets && state.tickets[state.tickets.length - 1];
  const couponNo = match ? Number(match[1]) : 0;
  if(!ticket || ticket.status === 'E' || ticket.status === 'R' || ticket.status === 'V'){
    printLines(['NO ACTIVE ISSUED TICKET AVAILABLE FOR TRAINING COUPON UPDATE'], 'err');
    return;
  }
  if(!Number.isInteger(couponNo) || couponNo < 1 || couponNo > (ticket.itinerary || []).length){
    printLines(['COUPON NUMBER NOT FOUND — CHECK TWD'], 'err');
    return;
  }
  if(!ticket.couponStatuses) ticket.couponStatuses = (ticket.itinerary || []).map(seg => seg.couponStatus || 'O');
  if(String(ticket.couponStatuses[couponNo - 1]).toUpperCase() !== 'O'){
    printLines([`COUPON ${couponNo} IS NOT OPEN — CURRENT STATUS ${ticket.couponStatuses[couponNo - 1]}`], 'err');
    return;
  }
  ticket.couponStatuses[couponNo - 1] = 'F';
  delete ticket.remainingValue;
  if(typeof saveCurrentPNR === 'function') saveCurrentPNR();
  printLines([`TRAINING DATA UPDATED: COUPON ${couponNo} MARKED FLOWN`, 'SIMULATOR HELPER ONLY — REAL COUPON STATUS COMES FROM THE AIRLINE'], 'success');
}

function handleTWD(cmd){
  let ticket = null;
  let matchedPNR = null;

  const tktMatch = cmd.match(/(?:TWD|ITR)?(?:\/TKT\s*|\/|\s+)([0-9-]+)/i);
  const lineMatch = cmd.match(/\/L(\d+)\b/i);
  const targetTkt = tktMatch ? tktMatch[1].trim() : null;
  const numClean = targetTkt ? targetTkt.replace(/-/g, '') : null;

  const isOriginal = /\/O(?:\*|$)/i.test(cmd);

  // 1. Check current state tickets
  if(state.tickets && state.tickets.length){
    if(isOriginal){
      const activeTkt = (state.tickets || []).slice().reverse().find(t => t.status !== 'E') || state.tickets[state.tickets.length - 1];
      const origNum = (activeTkt && activeTkt.originalIssue) || (state._exchangeData && state._exchangeData.oldTkt);
      if(origNum){
        ticket = (state.tickets || []).find(t => t.tktNum === origNum || t.tktNum.replace(/-/g, '') === origNum.replace(/-/g, ''));
      }
      if(!ticket){
        ticket = (state.tickets || []).find(t => t.status === 'E');
      }
      if(!ticket && origNum){
        ticket = {
          tktNum: origNum,
          name: (activeTkt && activeTkt.name) || 'JHONY/MD MR',
          pax: 'P1',
          amount: 30000,
          fare: 24000,
          tax: 6000,
          alLetter: (activeTkt && activeTkt.alLetter) || 'BG',
          flightNum: '555',
          cls: 'Y',
          date: '25JUL',
          dep: 'DAC',
          arr: 'SIN',
          tktDate: '17JUN26',
          office: 'DACVS31XW',
          status: 'E',
          couponStatuses: ['E'],
          exchangedFor: activeTkt ? activeTkt.tktNum : null
        };
      }
    } else if(lineMatch){
      ticket = getTicketByLine(lineMatch[1]);
    } else if(targetTkt){
      ticket = state.tickets.find(t => t.tktNum === targetTkt || t.tktNum.replace(/-/g, '') === numClean);
    } else if(/\/?T1\b|\s+1$/i.test(cmd)){
      ticket = state.tickets[0];
    } else if(/\/?T2\b|\s+2$/i.test(cmd) && state.tickets.length > 1){
      ticket = state.tickets[1];
    } else {
      ticket = (state.tickets || []).slice().reverse().find(t => t.status !== 'E') || state.tickets[state.tickets.length - 1];
    }
    if(ticket) matchedPNR = state;
  }

  // 2. Search all saved PNRs in localStorage
  if(!ticket && typeof loadSavedPNRs === 'function'){
    if(lineMatch){
      printLines([`TWD/L${lineMatch[1]}`, 'FA LINE NOT FOUND IN ACTIVE PNR'], 'err');
      return;
    }
    const saved = loadSavedPNRs();
    for(const loc in saved){
      const p = saved[loc];
      if(p && p.tickets && p.tickets.length){
        if(targetTkt){
          const found = p.tickets.find(t => t.tktNum === targetTkt || t.tktNum.replace(/-/g, '') === numClean);
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

  // 3. Fallback for demo tickets if not in storage
  if(!ticket && targetTkt){
    const is074 = targetTkt.startsWith('074');
    const isTG = targetTkt.startsWith('217');
    const al = is074 ? 'TK' : (isTG ? 'TG' : 'BG');
    ticket = {
      tktNum: targetTkt,
      name: is074 ? 'SHADAT/MD MR' : 'JHONY/MD MR',
      pax: 'P1',
      amount: is074 ? 68731 : 30000,
      alLetter: al,
      flightNum: is074 ? '721' : '555',
      tktDate: '18JUN26',
      office: is074 ? 'DACVS3334' : 'DACVS31XW',
      status: 'OK'
    };
    matchedPNR = {
      locator: is074 ? 'UQ27GN' : 'ICRBPO',
      fop: is074 ? 'INV' : 'CASH',
      segments: [{
        al,
        fn: is074 ? '721' : '555',
        dep: 'DAC',
        arr: is074 ? 'IST' : 'SIN',
        date: '25JUL',
        cls: 'Y'
      }]
    };
  }

  if(!ticket){
    printLines([
      'NO ELECTRONIC TICKET RECORD FOR THIS PNR',
      'ISSUE A TICKET FIRST WITH TTP, OR RETRIEVE A TICKETED PNR: RT [LOCATOR] OR TWD/[TICKET]'
    ], 'err');
    return;
  }

  if(/\/TAX$/i.test(cmd)){
    const lines = getTicketTaxLines(ticket);
    const totalTax = lines.reduce((sum, line) => sum + Number(line.amount || 0), 0);
    printLines([`TICKET TAX BREAKDOWN — ${ticket.tktNum}`, ...lines.map((line, index) => `T${index + 1}  ${Number(line.amount || 0)} ${line.code}`), `TOTAL TAX BDT ${totalTax}`], '');
    return;
  }

  const pNum = ticket.pax ? ticket.pax.replace('.', 'P').replace(/\s+/g, '') : 'P1';
  let paxName = ticket.name || 'PASSENGER';
  const tktNum = ticket.tktNum;
  const office = ticket.office || (matchedPNR && matchedPNR.officeId) || state.officeId || (typeof OFFICE_ID !== 'undefined' ? OFFICE_ID : 'DACVS31XW');
  const dt = ticket.tktDate || (matchedPNR && matchedPNR.dateStamp ? matchedPNR.dateStamp.split('/')[0] : (state.dateStamp ? state.dateStamp.split('/')[0] : '18JUN26'));
  const locator = (matchedPNR && matchedPNR.locator) || state.locator || 'ICRBPO';
  const segments = (ticket.itinerary && ticket.itinerary.length) ? ticket.itinerary : ((matchedPNR && matchedPNR.segments && matchedPNR.segments.length) ? matchedPNR.segments : ((state.segments && state.segments.length) ? state.segments : [{}]));
  const firstSeg = segments[0] || {};
  const dep = firstSeg.dep || 'DAC';
  const arr = firstSeg.arr || 'SIN';

  let statusLetter = 'O';
  let statusText = 'OK Y23';
  if(ticket.status === 'R'){
    statusLetter = 'R';
    statusText = 'RFND';
  } else if(ticket.status === 'E'){
    statusLetter = 'E';
    statusText = 'EXCH';
  } else if(ticket.status === 'V'){
    statusLetter = 'V';
    statusText = 'VOID';
  }

  const baseFare = Math.round((ticket.amount || 30000) * 0.8);
  const tax = (ticket.amount || 30000) - baseFare;
  const fop = (matchedPNR && matchedPNR.fop) || state.fop || 'CASH';

  const ticketDigits = String(tktNum || '').replace(/\D/g, '');
  const issueDate = String(dt || '').toUpperCase();
  const rows = [
    `TKT-${ticketDigits.padEnd(15, ' ')} RCI-            1A  LOC-${locator}`,
    `OD-${dep}${(segments[segments.length - 1] || {}).arr || arr}  SI-    FCPI-0  POI-${dep}  DOI-${issueDate}  IOI-${office}`,
    `PAX ${paxName.toUpperCase().padEnd(31, ' ')} ADT        ST`,
    ``,
    `    CPNS  C  ORG DST  CXR FLT  CL DATE      FARE BASIS       NVB       NVA       BAGS  ST`
  ];

  segments.forEach((seg, index) => {
    const coupon = String(index + 1);
    const al = seg.al || ticket.alLetter || "BG";
    const fn = String(seg.fn || ticket.flightNum || "555");
    const cls = seg.cls || "Y";
    const segDate = seg.date || issueDate || "25JUL";
    const origin = seg.dep || dep;
    const destination = seg.arr || arr;
    const fareBasis = `${cls}${String(seg.fn || "").slice(-2) || "55"}`;
    const baggage = seg.baggage || "25K";
    const storedCouponStatus = (ticket.couponStatuses || [])[index] || seg.couponStatus || "O";
    const couponLetter = ticket.status === "R" ? (String(storedCouponStatus).toUpperCase() === "F" ? "F" : "R") : ticket.status === "E" ? (String(storedCouponStatus).toUpperCase() === "F" ? "F" : "E") : ticket.status === "V" ? "V" : String(storedCouponStatus).toUpperCase();
    const couponStatus = ticket.status === "R" && couponLetter !== "F" ? "RFND" : ticket.status === "E" && couponLetter !== "F" ? "EXCH" : ticket.status === "V" ? "VOID" : couponLetter === "F" ? "FLOWN" : "OPEN";
    const nvb = seg.nvb || segDate;
    const nva = seg.nva || segDate;

    const chars = new Array(92).fill(" ");
    const cpnStr = coupon.padStart(2, " ");
    for(let i = 0; i < cpnStr.length; i++) chars[5 + i] = cpnStr[i];
    chars[10] = couponLetter;
    for(let i = 0; i < origin.slice(0, 3).length; i++) chars[13 + i] = origin[i];
    for(let i = 0; i < destination.slice(0, 3).length; i++) chars[17 + i] = destination[i];
    for(let i = 0; i < al.slice(0, 2).length; i++) chars[22 + i] = al[i];
    const fnStr = fn.padStart(4, " ");
    for(let i = 0; i < fnStr.length; i++) chars[26 + i] = fnStr[i];
    chars[31] = cls.slice(0, 1);
    for(let i = 0; i < segDate.slice(0, 7).length; i++) chars[34 + i] = segDate[i];
    for(let i = 0; i < fareBasis.slice(0, 15).length; i++) chars[44 + i] = fareBasis[i];
    for(let i = 0; i < nvb.slice(0, 7).length; i++) chars[61 + i] = nvb[i];
    for(let i = 0; i < nva.slice(0, 7).length; i++) chars[71 + i] = nva[i];
    for(let i = 0; i < baggage.slice(0, 4).length; i++) chars[81 + i] = baggage[i];
    for(let i = 0; i < couponStatus.slice(0, 4).length; i++) chars[87 + i] = couponStatus[i];
    rows.push(chars.join("").trimEnd());
  });

  if(ticket.status === 'E' && ticket.exchangedFor){
    rows.push(`COUPON STATUS: E - EXCHANGED FOR NEW TKT ${ticket.exchangedFor}`);
  }
  if(ticket.originalIssue){
    rows.push(`FO ${ticket.originalIssue}/${dep}${dt}/${office}/23567890`);
  }
  if(ticket.status === 'R' && ticket.refundNotice){
    rows.push(`REFUND NOTICE: ${ticket.refundNotice}`);
  }

  rows.push(
    ``,
    `FARE   BDT        ${baseFare}`,
    `EQUIV  BDT        ${baseFare}`,
    `TOTAL TAX BDT     ${tax}`,
    `TOTAL  BDT        ${ticket.amount || 30000}`,
    `/FC ${dep}${arr} ${String(firstSeg.al || ticket.alLetter || 'BG')}${String(firstSeg.fn || ticket.flightNum || '555')} ${String(firstSeg.cls || 'Y')} ${String(firstSeg.date || issueDate)} END`,
    `FORM OF PAYMENT: ${fop}`,
    `NON-ENDORSABLE`,
    `FOR TAX/FEE DETAILS USE TWD/TAX`
  );

  printLines(rows, '');
  showToast(`E-Ticket Record: ${tktNum} [Status: ${statusText}]`);
}

// ---------- 3. TRF — Ticket Refund Record (Manual & ATC Automated) ----------
function handleTRF(cmd){
  if(/^TRF$/i.test(cmd.trim()) && state._refundData){
    printRefundRecord();
    return;
  }
  if(!state.tickets || !state.tickets.length){
    printLines([
      'NO ELECTRONIC TICKET RECORD IN ACTIVE PNR TO REFUND',
      'ISSUE A TICKET FIRST WITH TTP, OR RETRIEVE A TICKETED PNR'
    ], 'err');
    return;
  }

  // Find ticket
  let ticket = state.tickets[state.tickets.length - 1];
  const lineMatch = cmd.match(/\/L(\d+)\b/i);
  const m = cmd.match(/TRF(?:\s+|\/TKT\s*|\/)([0-9-]+)/i);
  if(lineMatch){
    ticket = getTicketByLine(lineMatch[1]);
    if(!ticket){
      printLines([`TRF/L${lineMatch[1]}`, 'FA LINE NOT FOUND IN ACTIVE PNR'], 'err');
      return;
    }
  } else if(m && m[1]){
    const numClean = m[1].replace(/-/g, '');
    const found = state.tickets.find(t => t.tktNum === m[1] || t.tktNum.replace(/-/g, '') === numClean);
    if(!found){
      printLines([`TRF ${m[1]}`, 'DOCUMENT NOT FOUND IN ACTIVE PNR', 'CHECK THE TICKET NUMBER WITH TWD'], 'err');
      return;
    }
    ticket = found;
  } else if(/\/L1\b/i.test(cmd)){
    ticket = state.tickets[0];
  } else if(/\/L2\b/i.test(cmd) && state.tickets.length > 1){
    ticket = state.tickets[1];
  } else if(/\/?T1\b|\s+1$/i.test(cmd)){
    ticket = state.tickets[0];
  } else if(/\/?T2\b|\s+2$/i.test(cmd) && state.tickets.length > 1){
    ticket = state.tickets[1];
  }

  if(ticket.status === 'R'){
    printLines([
      `TRF ${ticket.tktNum}`,
      `ERROR: TICKET ALREADY REFUNDED`,
      `REFUND NOTICE: ${ticket.refundNotice || 'RN157-998877'}`
    ], 'err');
    return;
  }

  if(ticket.status === 'E'){
    printLines([
      `TRF ${ticket.tktNum}`,
      `ERROR: COUPON ALREADY EXCHANGED`,
      `CANNOT REFUND EXCHANGED TICKET - SELECT THE NEW TICKET`
    ], 'err');
    return;
  }

  if(ticket.status === 'V'){
    printLines([`TRF ${ticket.tktNum}`, 'ERROR: TICKET WAS VOIDED', 'VOIDED TICKETS CANNOT BE REFUNDED'], 'err');
    return;
  }

  const base = Math.round((ticket.amount || 30000) * 0.8);
  const tax = (ticket.amount || 30000) - base;
  const usedCoupon = (ticket.couponStatuses || []).some(status => String(status).toUpperCase() === 'F');
  const isATC = /\/ATC(?:\/|$)/i.test(cmd);
  const configuredPenalty = Number.isFinite(Number(ticket.refundPenalty))
    ? Number(ticket.refundPenalty)
    : (Number.isFinite(Number(ticket.cancellationFee)) ? Number(ticket.cancellationFee) : 0);
  const configuredPenaltyPercent = Number(ticket.refundPenaltyPercent);
  const autoPenalty = configuredPenaltyPercent > 0 ? Math.round(base * configuredPenaltyPercent / 100) : configuredPenalty;
  const refundScope = usedCoupon ? 'PARTIAL - FLOWN COUPON(S) FOUND' : 'FULL - ALL COUPONS UNUSED';
  const hasPenaltyRule = (ticket.refundPenalty !== undefined && ticket.refundPenalty !== null && Number.isFinite(Number(ticket.refundPenalty))) || (ticket.cancellationFee !== undefined && ticket.cancellationFee !== null && Number.isFinite(Number(ticket.cancellationFee))) || configuredPenaltyPercent > 0;

  state._refundData = {
    ticket,
    farePaid: base,
    fareUsed: usedCoupon ? base : 0,
    baseFare: base,
    tax: tax,
    total: ticket.amount || 30000,
    taxLines: getTicketTaxLines(ticket).map(line => ({ ...line })),
    penalty: autoPenalty,
    penaltySource: hasPenaltyRule ? 'TICKET RULE DATA' : 'NO TICKET RULE DATA - ENTER FARE-RULE FEE',
    validated: isATC,
    isATC,
    partial: usedCoupon,
    refundScope
  };
  const fareRefund = getRefundFare(state._refundData);
  const taxRefund = getRefundTaxTotal(state._refundData);
  const netRefund = getRefundTotal(state._refundData);

  if(isATC){
    // Automated ATC Refund Mask
    const rows = [
      `TRF ${ticket.tktNum}/ATC`,
      `ATC AUTOMATED REFUND CALCULATION (ATPCO CAT 16/33)`,
      `TKT: ${ticket.tktNum}  NAME: ${ticket.name || 'PASSENGER'}`,
      `REFUND SCOPE       : ${refundScope}`,
      `ORIGINAL FARE PAID : BDT ${state._refundData.farePaid}`,
      `FARE USED          : BDT  ${state._refundData.fareUsed}`,
      `FARE REFUND        : BDT  ${fareRefund}`,
      `CANCELLATION FEE   : BDT  ${autoPenalty} (${state._refundData.penaltySource})`,
      `REFUNDABLE TAXES   : BDT  ${taxRefund} (REVIEW WITH TRFT)`,
      `TOTAL REFUND AMOUNT: BDT ${netRefund}`,
      `FORM OF REFUND     : ${state.fop || 'CASH'}`,
      `-----------------------------------------------------------`,
      hasPenaltyRule ? 'ATC AUTO-RECORD STORED & VALIDATED — ENTER TRFP/FP TO PROCESS' : 'ATC RECORD STORED — ENTER TRFU/CP<FARE-RULE-FEE>A, THEN TRFP/FP'
    ];
    printLines(rows, 'success');
    showToast(`ATC Auto Refund: Penalty BDT ${autoPenalty} computed`);
    return;
  }

  // Manual Refund Mask
  const rows = [
    `TRF ${ticket.tktNum}`,
    `TKT ${ticket.tktNum}  NAME: ${ticket.name || 'PASSENGER'}`,
    `ORG: ${state.segments[0] ? state.segments[0].dep : 'DAC'}  DES: ${state.segments[0] ? state.segments[0].arr : 'BKK'}  PAX: 1  FARE: BDT ${base}`,
    `TAX: ${tax}BD  TOTAL: BDT ${ticket.amount || 30000}`,
    `FORM OF PAYMENT: ${state.fop || 'CASH'}`,
    `FLOWN COUPONS: ${(ticket.couponStatuses || []).filter(status => String(status).toUpperCase() === 'F').length}  OPEN COUPONS: ${(ticket.couponStatuses || []).filter(status => String(status).toUpperCase() === 'O').length}`,
    `-----------------------------------------------------------`,
    `FARE USED : BDT ${state._refundData.fareUsed}`,
    `RFND FARE : BDT ${fareRefund.toString().padStart(6, ' ')}`,
    `RFND TAX  : BDT ${taxRefund.toString().padStart(6, ' ')}`,
    `CANCELLATION PENALTY: BDT ${autoPenalty.toString().padStart(7, ' ')}`,
    `TOTAL REFUND AMOUNT : BDT ${netRefund.toString().padStart(6, ' ')}`,
    `FORM OF REFUND      : ${state.fop || 'CASH'}`,
    `-----------------------------------------------------------`,
    `REFUND SCOPE: ${refundScope}`,
    `ENTER PENALTY (TRFP/CP[AMOUNT]) OR CONFIRM WITH TRF/OK`
  ];
  printLines(rows, '');
  showToast(`TRF Refund record opened for ${ticket.tktNum}`);
}

function handleTRFPenalty(cmd){
  if(!state._refundData){
    printLines([
      'NO ACTIVE REFUND RECORD',
      'ENTER TRF FOLLOWED BY TICKET NUMBER FIRST (e.g. TRF 157-7800396554421)'
    ], 'err');
    return;
  }

  const m = cmd.match(/CP\s*(\d+(?:\.\d{1,2})?)([AP])?/i);
  if(!m){
    printLines([
      'INVALID PENALTY FORMAT — PLEASE SPECIFY PENALTY AMOUNT',
      'Example: TRFP/CP3000'
    ], 'err');
    return;
  }
  const input = Number(m[1]);
  const type = (m[2] || 'A').toUpperCase();
  const penalty = type === 'P' ? Math.round(Number(state._refundData.farePaid || 0) * input / 100) : input;
  if(!Number.isSafeInteger(penalty) || penalty < 0 || penalty > getRefundFare(state._refundData) + getRefundTaxTotal(state._refundData)){
    printLines(['INVALID PENALTY AMOUNT — ENTER A NON-NEGATIVE AMOUNT NOT EXCEEDING THE REFUNDABLE TOTAL'], 'err');
    return;
  }
  state._refundData.penalty = penalty;
  state._refundData.penaltyInput = input;
  state._refundData.penaltyType = type;
  state._refundData.penaltySource = 'FARE RULE FEE ENTERED';

  const tkt = state._refundData.ticket;
  const netRefund = getRefundTotal(state._refundData);

  const rows = [
    `TRF ${tkt.tktNum}`,
    `FARE USED : BDT ${state._refundData.fareUsed.toString().padStart(6, ' ')}`,
    `RFND FARE : BDT ${getRefundFare(state._refundData).toString().padStart(6, ' ')}`,
    `RFND TAX  : BDT ${getRefundTaxTotal(state._refundData).toString().padStart(6, ' ')}`,
    `CANCELLATION PENALTY: BDT ${penalty.toString().padStart(7, ' ')}`,
    `TOTAL REFUND AMOUNT : BDT ${netRefund.toString().padStart(6, ' ')}`,
    `UPDATED. ENTER TRF/OK TO VALIDATE`
  ];
  printLines(rows, '');
  showToast(`Penalty BDT ${penalty} recorded — Type TRF/OK to validate`);
}

function handleTRFConfirm(){
  if(!state._refundData){
    printLines(['NO ACTIVE REFUND RECORD — ENTER TRF FIRST'], 'err');
    return;
  }
  state._refundData.validated = true;
  const tkt = state._refundData.ticket;
  printLines([
    `TRF ${tkt.tktNum}`,
    `REFUND RECORD STORED - ENTER TRFP/FP TO PROCESS REFUND`
  ], 'success');
  showToast('Refund record stored — Type TRFP/FP to finalize');
}

function handleTRFProcess(cmd){
  if(!state._refundData){
    printLines(['NO STORED REFUND RECORD — ENTER TRF AND TRF/OK FIRST'], 'err');
    return;
  }
  if(state._refundData.isATC && state._refundData.penaltySource && state._refundData.penaltySource.startsWith('NO TICKET RULE DATA')){
    printLines(['ATC REFUND NOT READY: CANCELLATION FEE IS NOT IN THE TICKET RULE DATA', 'CHECK THE FARE RULE, ENTER TRFU/CP<AMOUNT>A, REVIEW WITH TRF, THEN ENTER TRFP/FP'], 'err');
    return;
  }
  // Check if FOP is supplied in command
  if(cmd){
    const fopMatch = cmd.match(/\/FP([A-Z0-9]+)$/i);
    if(fopMatch && fopMatch[1]) state.fop = fopMatch[1].toUpperCase();
  }

  const tkt = state._refundData.ticket;
  const penalty = Number.isFinite(state._refundData.penalty) ? state._refundData.penalty : 0;
  const refundFare = getRefundFare(state._refundData);
  const refundTax = getRefundTaxTotal(state._refundData);
  const net = getRefundTotal(state._refundData);
  const prefix = (tkt.tktNum.split('-')[0] || '157');
  const rnNum = 'RN' + prefix + '-' + Math.floor(1000000000 + Math.random() * 9000000000);

  tkt.status = 'R';
  tkt.couponStatuses = (tkt.couponStatuses || (tkt.itinerary || []).map(seg => seg.couponStatus || 'O')).map(status => String(status).toUpperCase() === 'F' ? 'F' : 'R');
  tkt.refundNotice = rnNum;
  tkt.refundAmount = net;
  tkt.refundFare = refundFare;
  tkt.refundTax = refundTax;
  tkt.refundFareUsed = state._refundData.fareUsed;
  tkt.refundPenalty = penalty;

  // Track into session refunds for TRDC
  window._sessionRefunds = window._sessionRefunds || [];
  window._sessionRefunds.push({
    tktNum: tkt.tktNum,
    name: tkt.name || 'PASSENGER',
    penalty: penalty,
    refundFare,
    refundTax,
    fareUsed: state._refundData.fareUsed,
    refundAmount: net,
    refundNotice: rnNum,
    date: new Date().toLocaleDateString()
  });

  state.hasPending = true;
  state._refundData = null;

  saveCurrentPNR();

  const rows = [
    `OK REFUND PROCESSED`,
    `REFUND NOTICE NUMBER: ${rnNum}`,
    `TKT ${tkt.tktNum} STATUS: RFND`,
    `REFUND PAID TO: ${state.fop || 'CASH'}  AMOUNT: BDT ${net}`,
    `TICKET HAS BEEN REFUNDED IN CENTRAL GDS`
  ];
  printLines(rows, 'success');
  showToast(`✓ Refund processed! Notice: ${rnNum}`);
}

function handleTRDC(){
  const pnrRefunded = (state.tickets || []).filter(t => t.status === 'R');
  const sessionRefunded = window._sessionRefunds || [];

  const allMap = new Map();
  pnrRefunded.forEach(t => {
    allMap.set(t.tktNum, {
      tktNum: t.tktNum,
      name: t.name || 'PASSENGER',
      penalty: t.refundPenalty || 0,
      refundAmount: t.refundAmount || t.amount,
      refundNotice: t.refundNotice || ''
    });
  });
  sessionRefunded.forEach(t => {
    if(!allMap.has(t.tktNum)){
      allMap.set(t.tktNum, {
        tktNum: t.tktNum,
        name: t.name || 'PASSENGER',
        penalty: t.penalty || 0,
        refundAmount: t.refundAmount,
        refundNotice: t.refundNotice || ''
      });
    }
  });

  const list = Array.from(allMap.values());
  if(!list.length){
    printLines(['NO REFUNDED TICKETS IN CURRENT ACTIVE PNR OR SESSION'], 'err');
    return;
  }
  const rows = [
    `TRDC — REFUND REPORT SUMMARY`,
    `-----------------------------------------------------------`,
    `TKT NUMBER         PAX NAME         PENALTY    NET REFUND  NOTICE`,
    `-----------------------------------------------------------`
  ];
  list.forEach(t => {
    rows.push(`${t.tktNum.padEnd(18, ' ')} ${(t.name || 'PAX').padEnd(16, ' ')} ${(t.penalty || 0).toString().padStart(7, ' ')} ${(t.refundAmount || 0).toString().padStart(11, ' ')}  ${t.refundNotice || ''}`);
  });
  rows.push(`-----------------------------------------------------------`);
  printLines(rows, '');
}

// ---------- 3. Reissue / Exchange (Manual & Auto-Code ATC: FXQ, FXE, FXI, TQR) ----------
function handleTTE(){
  if(!state.hasTST && !(state.tstRecords && state.tstRecords.length)){
    printLines(['NO TST EXISTS'], 'err');
    return;
  }
  state.hasTST = false;
  state.tstRecords = [];
  state.tstNeedsReprice = true;
  state._exchangeTstDeleted = true;
  state._exchangeData = null;
  state._exchangeMode = false;
  state._foRecorded = null;
  state._manualExchange = null;
  state._exchangePayment = null;
  state.hasPending = true;
  printLines(['TST DELETED'], 'success');
  showToast('Previous TST deleted - enter FXQ or FXI again to prepare the reissue');
}

// Helper: resolve active segment being reissued or priced
function getReissueActiveSegment(oldTkt, cmd){
  if(!state.segments || !state.segments.length) return null;
  const m = (cmd || '').match(/\/S(\d+)/i);
  if(m){
    const idx = parseInt(m[1], 10) - 1;
    if(state.segments[idx]) return state.segments[idx];
  }
  if(state.segments.length === 1) return state.segments[0];
  const oldDate = (oldTkt.itinerary && oldTkt.itinerary[0] && oldTkt.itinerary[0].date) || oldTkt.tktDate || '25JUL';
  const oldCls = (oldTkt.itinerary && oldTkt.itinerary[0] && oldTkt.itinerary[0].cls) || oldTkt.cls || 'Y';
  // Pick the segment that differs from old ticket in date OR class (new held flight)
  const diffSeg = state.segments.find(s => s.date !== oldDate || s.cls !== oldCls);
  if(diffSeg) return diffSeg;
  // If only one segment and same as old, return it (SB already changed it in place)
  return state.segments[state.segments.length - 1];
}

// Class tier evaluation for realistic reissue pricing:
// Economy Promo/Saver (1.00) -> Economy Std (1.15) -> Economy Full (1.30) -> Premium Eco (1.50) -> Business (2.10 - 2.60) -> First (3.50)
function getATCClassTier(cls){
  cls = String(cls || 'Y').toUpperCase();
  if(['F','A','P'].includes(cls)) return { name: 'FIRST', weight: 3.50, diffRatio: 1.80 };
  if(['J','C'].includes(cls)) return { name: 'BUSINESS FULL', weight: 2.60, diffRatio: 1.10 };
  if(['D','Z','I'].includes(cls)) return { name: 'BUSINESS', weight: 2.10, diffRatio: 0.80 };
  if(['W','E','R'].includes(cls)) return { name: 'PREM ECO', weight: 1.50, diffRatio: 0.45 };
  if(['B','Y'].includes(cls)) return { name: 'ECO FULL', weight: 1.30, diffRatio: 0.25 };
  if(['K','M','H'].includes(cls)) return { name: 'ECO HIGH', weight: 1.20, diffRatio: 0.20 };
  if(['S','L'].includes(cls)) return { name: 'ECO STD', weight: 1.15, diffRatio: 0.16 };
  return { name: 'ECO SAVER', weight: 1.00, diffRatio: 0.12 }; // Q, T, G, V, N, O, X
}

function calcATCReissuePricing(oldTkt, isInvoluntary, cmd){
  const prevPd = Number(oldTkt.amount) || 30000;
  const oldBase = Math.round(prevPd * 0.8);
  const oldTax = prevPd - oldBase;

  const oldCls = (oldTkt.itinerary && oldTkt.itinerary[0] && oldTkt.itinerary[0].cls) || oldTkt.cls || 'Y';
  const activeSeg = getReissueActiveSegment(oldTkt, cmd);
  const newCls = (activeSeg && activeSeg.cls) || oldCls;

  if(isInvoluntary){
    return {
      prevPd, oldBase, oldTax,
      newFare: prevPd, newBase: oldBase, newTax: oldTax,
      baseDiff: 0, taxDiff: 0, ticketDiff: 0,
      changeFee: 0, grandTotal: 0,
      involuntary: true,
      oldCls, newCls,
      activeSeg,
      ptc: 'ADT'
    };
  }

  // Detect passenger type (ADT = 1.00, CHD = 0.75, INF = 0.10)
  let ptcRatio = 1.00;
  let ptcCode = 'ADT';
  const p0 = (state.passengers && state.passengers[0]) || {};
  const pType = String(p0.type || '').toLowerCase();
  const pLabel = String(p0.label || p0.nameDisplay || oldTkt.name || '').toUpperCase();
  if(pType === 'child' || /CHD|\bCH\b|CHILD/i.test(pLabel)){
    ptcRatio = 0.75;
    ptcCode = 'CHD';
  } else if(pType === 'infant' || /INF|\bIN\b|INFANT/i.test(pLabel)){
    ptcRatio = 0.10;
    ptcCode = 'INF';
  }

  const oldTier = getATCClassTier(oldCls);
  const newTier = getATCClassTier(newCls);

  let baseDiff = 0;
  let changeFee = 3500; // Standard airline voluntary change penalty

  if(oldTkt.refundPenalty && Number.isFinite(Number(oldTkt.refundPenalty))){
    changeFee = Number(oldTkt.refundPenalty);
  } else if(oldTkt.cancellationFee && Number.isFinite(Number(oldTkt.cancellationFee))){
    changeFee = Number(oldTkt.cancellationFee);
  }

  if(newCls === oldCls){
    // Same class: Date change only! No base fare difference
    baseDiff = 0;
  } else if(newTier.weight > oldTier.weight){
    // Upgraded class: realistic proportionate fare increase
    const ratio = (newTier.weight - oldTier.weight) / oldTier.weight;
    baseDiff = Math.round(oldBase * ratio * ptcRatio);
  } else {
    // Rebooking into another booking class (e.g. S, M, L, Q)
    const diffRate = (oldTier.diffRatio && newTier.diffRatio && oldTier.diffRatio !== newTier.diffRatio)
      ? Math.abs(newTier.diffRatio - oldTier.diffRatio) + 0.10
      : (newTier.diffRatio || 0.16);
    baseDiff = Math.round(oldBase * diffRate * ptcRatio);
  }

  // Round baseDiff to neat hundreds for realistic airline tariff display
  if(baseDiff > 0){
    baseDiff = Math.round(baseDiff / 100) * 100;
  }

  // Adjust penalty by passenger type (Infants pay 0 penalty, child pays 75%)
  if(ptcRatio <= 0.10){
    changeFee = 0;
  } else if(ptcRatio === 0.75){
    changeFee = Math.round(changeFee * 0.75);
  }

  const taxDiff = baseDiff > 0 ? Math.round(baseDiff * 0.15) : 0;
  const newBase = oldBase + baseDiff;
  const newTax = oldTax + taxDiff;
  const ticketDiff = baseDiff + taxDiff;
  const grandTotal = ticketDiff + changeFee;
  const newFare = prevPd + ticketDiff;

  return {
    prevPd, oldBase, oldTax,
    newFare, newBase, newTax,
    baseDiff, taxDiff, ticketDiff,
    changeFee, grandTotal,
    involuntary: false,
    oldCls, newCls,
    activeSeg,
    ptc: ptcCode
  };
}

function handleReissueQuote(cmd){
  if(!state.tickets || !state.tickets.length){
    printLines(['NO ORIGINAL TICKET FOUND IN ACTIVE PNR FOR EXCHANGE'], 'err');
    return;
  }
  const oldTkt = (state.tickets || []).slice().reverse().find(t => t.status !== 'E' && t.status !== 'R' && t.status !== 'V') || state.tickets[state.tickets.length - 1];
  if(oldTkt.status === 'R' || oldTkt.status === 'V' || oldTkt.status === 'E'){
    const reason = oldTkt.status === 'R' ? 'REFUNDED' : oldTkt.status === 'V' ? 'VOIDED' : 'ALREADY EXCHANGED';
    printLines([`CANNOT REISSUE: ORIGINAL TICKET IS ${reason}`], 'err');
    return;
  }

  // In ATC (Automated Ticket Changer), FXQ creates/updates the TST automatically without requiring TTE.
  // Segment overlap only occurs if conflicting segments remain uncancelled without segment selector /S.
  if(state.segments && state.segments.length > 1 && !cmd.match(/\/S\d+/i)){
    const oldDate = (oldTkt.itinerary && oldTkt.itinerary[0] && oldTkt.itinerary[0].date) || oldTkt.tktDate;
    const hasOldSeg = state.segments.some(s => s.date === oldDate);
    const hasNewSeg = state.segments.some(s => s.date !== oldDate);
    if(hasOldSeg && hasNewSeg){
      printLines(['SEGMENT OVERLAP — CANCEL OLD SEGMENT WITH XE FIRST OR SPECIFY SEGMENT FXQ/S3'], 'warn');
      return;
    }
  }

  const isInvoluntary = /^FXI/i.test(cmd);
  const isInformative = /^FX[FE]/i.test(cmd);
  const pricing = calcATCReissuePricing(oldTkt, isInvoluntary, cmd);

  if(!isInformative){
    state._exchangeMode = true;
    state._exchangeData = {
      oldTkt: oldTkt.tktNum,
      newFare: pricing.newFare,
      prevPd: pricing.prevPd,
      oldBase: pricing.oldBase,
      newBase: pricing.newBase,
      oldTax: pricing.oldTax,
      newTax: pricing.newTax,
      fareDiff: pricing.baseDiff,
      taxDiff: pricing.taxDiff,
      ticketDiff: pricing.ticketDiff,
      changeFee: pricing.changeFee,
      addCollect: pricing.grandTotal,
      involuntary: isInvoluntary,
      ptc: pricing.ptc
    };
    state.hasTST = true;
    state.tstNeedsReprice = false;
    state._exchangeTstDeleted = false;
    state._foRecorded = oldTkt.tktNum;
    const pax = (state.passengers && state.passengers[0] && state.passengers[0].label) || oldTkt.name || 'PASSENGER';
    state.tstRecords = [{
      tstNum: 1,
      pCode: '.1',
      name: pax,
      fare: pricing.newBase,
      tax: pricing.newTax,
      total: pricing.newFare,
      ptc: pricing.ptc,
      segs: (cmd.match(/\/S([0-9,-]+)/i) || [])[1] || '1'
    }];
  }

  const pax = (state.passengers && state.passengers[0] && state.passengers[0].label) || oldTkt.name || 'PASSENGER';
  const selected = (cmd.match(/\/S([0-9,]+)/i) || [])[1] || '';
  const cmdPrefix = (cmd.match(/^FX[QEIFO]/i) || ['FXQ'])[0].toUpperCase();

  const rows = isInvoluntary ? [
    'FXI',
    `01 ${String(pax).toUpperCase()}`,
    `ORIGINAL TKT : ${oldTkt.tktNum}`,
    `ORIGINAL FARE (R) : BDT ${pricing.prevPd}`,
    `ORIGINAL TAXES (O): BDT ${pricing.oldTax}`,
    `FARE CALCULATION  : I- (INVOLUNTARY)` ,
    `ENDORSEMENT (FE)  : SKCHG`,
    `FO ORIGINAL ISSUE : ${oldTkt.tktNum}`,
    `FPO ORIGINAL FORM : ${state.fop || 'CASH'}`,
    `TST CREATED       : BDT ${pricing.newFare} (MANUAL TST)`,
    `PENALTY           : BDT 0`,
    `ADDITIONAL COLLECT: BDT 0`,
    `RESIDUAL VALUE    : BDT 0`,
    'REISSUE READY — DISPLAY WITH TQR/TQT; ISSUE WITH TTP'
  ] : [
    `${cmdPrefix}${selected ? '/S' + selected : ''}`,
    ``,
    `01 ${String(pax).toUpperCase()}`,
    `LAST TKT DTE ${String(oldTkt.tktDate || '17JUN26')} - 2359 - - SEE ADV PURCHASE`,
    `FARE FAMILIES:  (ENTER FQF FOR DETAILS, FXY FOR UPSELL)`,
    `SERVICE MAY HAVE CHANGED - PLEASE CHECK NEW CONTRACT`,
    `TICKETING STOCK RESTRICTION`,
    `--------------------------------------------------------------------------`,
    `       AL FLGT BK DATE TIME  FARE BASIS     NVB   NVA  BG`
  ];

  if(isInvoluntary) rows.push("NEW BOOKING:");
  const activeSeg = pricing.activeSeg || ((state.segments && state.segments.length) ? state.segments[state.segments.length - 1] : { dep: "DAC", arr: "SIN", al: "BG", fn: "555", cls: pricing.newCls || "Y", date: "25AUG", depT: "1659" });
  const segsToDisplay = (cmd.match(/\/S\d+/i) || (state.segments && state.segments.length > 1)) ? [activeSeg] : ((state.segments && state.segments.length) ? state.segments : [activeSeg]);

  const firstDep = segsToDisplay[0].dep || "DAC";
  rows.push(firstDep);
  segsToDisplay.forEach((seg) => {
    const dst = seg.arr || "SIN";
    const al = seg.al || oldTkt.alLetter || "BG";
    const flt = String(seg.fn || "555").padStart(4, " ");
    const bk = seg.cls || pricing.newCls || "Y";
    const date = seg.date || "25AUG";
    const time = seg.depT || "1659";
    const fareBasis = `${bk}${String(seg.fn || "").slice(-2) || "55"}`;
    const nvb = seg.nvb || date;
    const nva = seg.nva || date;
    const bg = seg.baggage || "25K";

    const chars = new Array(65).fill(" ");
    for(let i = 0; i < dst.slice(0, 3).length; i++) chars[0 + i] = dst[i];
    for(let i = 0; i < al.slice(0, 2).length; i++) chars[4 + i] = al[i];
    for(let i = 0; i < flt.length; i++) chars[7 + i] = flt[i];
    chars[12] = bk.slice(0, 1);
    for(let i = 0; i < date.slice(0, 5).length; i++) chars[15 + i] = date[i];
    for(let i = 0; i < time.slice(0, 4).length; i++) chars[21 + i] = time[i];
    for(let i = 0; i < fareBasis.slice(0, 14).length; i++) chars[26 + i] = fareBasis[i];
    for(let i = 0; i < nvb.slice(0, 5).length; i++) chars[41 + i] = nvb[i];
    for(let i = 0; i < nva.slice(0, 5).length; i++) chars[47 + i] = nva[i];
    for(let i = 0; i < bg.slice(0, 4).length; i++) chars[53 + i] = bg[i];
    rows.push(chars.join("").trimEnd());
  });

  if(!isInvoluntary){
    rows.push(
      ``,
      `                         ORIGIN TRVL CURRENCY    REISSUE CURRENCY`,
      `OLD BASE FARE            BDT        ${String(pricing.oldBase).padStart(8, ' ')}`,
      `NEW BASE FARE            BDT        ${String(pricing.newBase).padStart(8, ' ')}`,
      `FARE BALANCE                                      BDT        ${String(pricing.baseDiff).padStart(8, ' ')}`,
      ``,
      `                              PAYMENT CURRENCY`,
      `OLD TAX                  BDT        ${String(pricing.oldTax).padStart(8, ' ')}`,
      `NEW TAX                  BDT        ${String(pricing.newTax).padStart(8, ' ')}`,
      `TAX BALANCE                                       BDT        ${String(pricing.taxDiff).padStart(8, ' ')}`,
      `TICKET DIFFERENCE                                 BDT        ${String(pricing.ticketDiff).padStart(8, ' ')}`,
      `PENALTY                                           BDT        ${String(pricing.changeFee).padStart(8, ' ')}`,
      `GRAND TOTAL                                       BDT        ${String(pricing.grandTotal).padStart(8, ' ')}`,
      `*TRN*`,
      `) >`
    );
  }
  printLines(rows, '');
  showToast(isInvoluntary ? 'FXI involuntary TST prepared: no penalty or additional collection' : (isInformative ? `Informative Reissue Quote: Add Collect BDT ${pricing.grandTotal}` : `ATC Reissue Quote: Add Collect BDT ${pricing.grandTotal}`));
}

// TQR — Display Amadeus Ticket Changer (ATC) Panel (matches video format seq5_02.jpg)
function handleTQR(cmd){
  if(!state._exchangeData && (!state.tickets || !state.tickets.length)){
    printLines(['NO ACTIVE REISSUE RECORD TO DISPLAY — ENTER FXQ OR FXI FIRST'], 'err');
    return;
  }
  const d = state._exchangeData || {
    oldTkt: state.tickets[state.tickets.length - 1].tktNum,
    newFare: 34000,
    prevPd: 30000,
    oldBase: 24000,
    newBase: 24000,
    fareDiff: 0,
    taxDiff: 0,
    ticketDiff: 0,
    changeFee: 3500,
    addCollect: 3500
  };
  const pax = (state.passengers && state.passengers[0] && state.passengers[0].label) || 'JHONY/MD MR';
  const cleanPax = pax.split('(')[0].trim().toUpperCase();
  const tktNo = String(d.oldTkt || '').replace(/\D/g, '');
  const tktFormatted = tktNo.length >= 13 ? `${tktNo.slice(0, 3)}-${tktNo.slice(3)}` : (d.oldTkt || '157-7800396554421');

  const rows = [
    `TQR`,
    `TST00001           TKT-${tktFormatted}E1`,
    `FARE FAMILIES:    (ENTER FQF FOR DETAILS, FXY FOR UPSELL)`,
    `  01.${cleanPax}`,
    ...(d.involuntary ? [
      `INVOLUNTARY : YES (FXI)`,
      `FARE/TAXES  : ORIGINAL VALUES`,
      `PENALTY / ADD COLLECT / RESIDUAL: BDT 0`
    ] : [
      `                   ORIGIN TRVL CURRENCY  REISSUE CURRENCY`,
      `OLD BASE FARE      BDT        ${String(d.oldBase || Math.round((d.prevPd || 30000) * 0.8)).padStart(8, ' ')}`,
      `NEW BASE FARE      BDT        ${String(d.newBase || Math.round((d.newFare || 30000) * 0.8)).padStart(8, ' ')}`,
      `FARE BALANCE                             BDT        ${String(d.fareDiff || 0).padStart(8, ' ')}`,
      `                   PAYMENT CURRENCY`,
      `OLD TAX            BDT        ${String(d.oldTax || 6000).padStart(8, ' ')}`,
      `NEW TAX            BDT        ${String(d.newTax || 6000).padStart(8, ' ')}`,
      `TAX BALANCE                              BDT        ${String(d.taxDiff || 0).padStart(8, ' ')}`,
      ``,
      `TICKET DIFFERENCE                        BDT        ${String(d.ticketDiff || d.fareDiff || 0).padStart(8, ' ')}`,
      `RESIDUAL VALUE     BDT           0.00`,
      ``,
      `TST ADD COLL                             BDT        ${String(d.ticketDiff || d.fareDiff || 0).padStart(8, ' ')}`,
      `PENALTY                                  BDT        ${String(d.changeFee || 0).padStart(8, ' ')}`,
      `TOTAL ADD COLL                           BDT        ${String(d.addCollect || 0).padStart(8, ' ')}`,
      `GRAND TOTAL                              BDT        ${String(d.addCollect || 0).padStart(8, ' ')}`
    ])
  ];
  printLines(rows, '');
}

// TQM — Display Ticket Services Message / EMD for Change Penalty (seq6_25.jpg in video)
function handleTQM(cmd){
  const d = state._exchangeData;
  const oldTkt = (state.tickets && state.tickets.length) ? state.tickets[state.tickets.length - 1] : null;
  const pax = (state.passengers && state.passengers[0] && state.passengers[0].label) || (oldTkt && oldTkt.name) || 'JHONY/MD MR';
  const cleanPax = pax.split('(')[0].trim().toUpperCase();
  const penalty = (d && d.changeFee !== undefined) ? d.changeFee : 3500;
  const al = (state.segments && state.segments[0] && state.segments[0].al) || 'BG';
  const orig = (state.segments && state.segments[0] && state.segments[0].dep) || 'DAC';
  const emdNum = (oldTkt && oldTkt.penaltyEMD) || `157-7112817362`;

  const rows = [
    `TQM`,
    `TSM   1   TYPE P    TKT-${emdNum}`,
    ` 1.${cleanPax}`,
    `RFIC-D/Q  FINANCIAL IMPACT`,
    `  1. RFISC-993 PENALTY FEE FOR REISSUE / CHANGE            L   2`,
    `     OPERATING CC-${al}`,
    `     PRESENT TO:${al}`,
    `     PRESENT AT:${orig}`,
    `     NON REFUNDABLE`,
    `     NON EXCHANGEABLE`,
    `     CONSUMED AT ISSUANCE`,
    ``,
    `ADD INF/RKS:`,
    ``,
    `FARE   BDT        ${penalty}`,
    `TOTAL  BDT        ${penalty}`
  ];
  printLines(rows, '');
}

// TTK/EXCH marks a priced TST for manual exchange. For partly used tickets,
// only open coupons are exchanged and the agent must enter the calculated ADC.
function handleTTK(cmd){
  if(!state.tstRecords || !state.tstRecords.length || !state.hasTST){
    printLines(['NO TST EXISTS — PRICE THE NEW ITINERARY WITH FXP FIRST'], 'err');
    return;
  }
  if(/^TTK\/EXCH(?:\/T\d+)?$/i.test(cmd)){
    const oldTkt = (state.tickets || []).slice().reverse().find(t => t.status !== 'E' && t.status !== 'R' && t.status !== 'V');
    if(!oldTkt){
      printLines(['NO ELIGIBLE ORIGINAL TICKET FOUND IN ACTIVE PNR'], 'err');
      return;
    }
    const couponStatuses = (oldTkt.couponStatuses || oldTkt.itinerary || []).map(item => String(typeof item === 'string' ? item : (item.couponStatus || 'O')).toUpperCase());
    const hasOpenCoupon = couponStatuses.some(status => status === 'O');
    const invalidCoupon = couponStatuses.find(status => !['O', 'F'].includes(status));
    if(!hasOpenCoupon || invalidCoupon){
      printLines([invalidCoupon ? `MANUAL REISSUE CANNOT EXCHANGE COUPON STATUS ${invalidCoupon}` : 'NO OPEN COUPONS REMAIN FOR REISSUE'], 'err');
      return;
    }
    const partiallyUsed = couponStatuses.some(status => status === 'F');
    state._manualExchange = { oldTkt: oldTkt.tktNum, addCollect: null, partiallyUsed };
    state._exchangeMode = true;
    state._exchangeData = null;
    state._exchangePayment = null;
    state._foRecorded = null;
    state.hasPending = true;
    printLines([`TST SET FOR MANUAL ${partiallyUsed ? 'PARTIALLY USED' : 'UNUSED'} TICKET EXCHANGE`, `ORIGINAL TKT: ${oldTkt.tktNum}`, partiallyUsed ? 'PRICE ONLY OPEN COUPONS; ENTER THE MANUALLY CALCULATED ADC WITH TTK/T<amount>' : 'NEXT: ADD FO ORIGINAL ISSUE AND FPO FORM OF PAYMENT'], 'success');
    showToast('Manual exchange TST prepared');
    return;
  }
  if(!state._manualExchange){
    printLines(['TST IS NOT SET FOR MANUAL EXCHANGE — ENTER TTK/EXCH FIRST'], 'err');
    return;
  }
  // The final /T amount in a manual TTK update represents the total ADC.
  const totals = [...cmd.matchAll(/\/T(\d+(?:\.\d{1,2})?)(?=\/|$)/ig)];
  if(totals.length && !/^TTK\/T\d+$/i.test(cmd)){
    state._manualExchange.addCollect = Number(totals[totals.length - 1][1]);
  }
  state._manualExchange.lastUpdate = cmd;
  state.hasPending = true;
  printLines([
    'MANUAL EXCHANGE TST UPDATED',
    state._manualExchange.addCollect === null ? (state._manualExchange.partiallyUsed ? 'PARTIAL TICKET: ENTER THE MANUALLY CALCULATED ADC WITH TTK/T<amount>' : 'ADC WILL BE CALCULATED FROM NEW FARE AND ORIGINAL TICKET') : `ADDITIONAL COLLECTION: ${state._manualExchange.addCollect}`,
    'ENTER FPO/OLD-FOP+/NEW-FOP, THEN FO*L1 AND TTP/EXCH'
  ], 'success');
}

function handleFPO(cmd){
  const match = cmd.match(/^FPO\/(.+)$/i);
  if(!match){
    printLines(['FORMAT: FPO/OLD-FOP OR FPO/OLD-FOP+/NEW-FOP'], 'err');
    return;
  }
  const parts = match[1].split('+');
  const originalFop = (parts[0] || '').trim().toUpperCase();
  const additionalFop = parts.length > 1 ? parts.slice(1).join('+').replace(/^\/+/, '').trim().toUpperCase() : '';
  if(!originalFop || (parts.length > 1 && !additionalFop)){
    printLines(['INVALID FPO — ENTER THE ORIGINAL FORM AND, FOR ADC, THE COLLECTION FORM'], 'err');
    return;
  }
  const originalTicket = state._manualExchange
    ? (state.tickets || []).find(t => t.tktNum === state._manualExchange.oldTkt)
    : (state.tickets || []).slice().reverse().find(t => t.status !== 'E' && t.status !== 'R' && t.status !== 'V');
  const expectedOriginalFop = (originalTicket && originalTicket.formOfPayment) || state.fop;
  if(expectedOriginalFop && originalFop !== String(expectedOriginalFop).toUpperCase()){
    printLines([`ORIGINAL FOP MUST MATCH THE TICKET: ${expectedOriginalFop}`], 'err');
    return;
  }
  state._exchangePayment = { originalFop, additionalFop: additionalFop || null };
  state.fop = additionalFop || originalFop;
  state.hasPending = true;
  printLines([
    `ORIGINAL FORM OF PAYMENT: ${originalFop}`,
    additionalFop ? `ADDITIONAL COLLECTION FORM: ${additionalFop}` : 'NO ADDITIONAL COLLECTION FORM',
    'FORM OF PAYMENT RECORDED FOR EXCHANGE'
  ], 'success');
  showToast('Original form of payment recorded');
}

function handleFO(cmd){
  const lineMatch = cmd.match(/^FO\*L(\d+)/i);
  const numberMatch = cmd.match(/^FO(?:\*|\s*)([0-9-]+)/i);
  let ticket = null;
  if(lineMatch){
    ticket = (state.tickets || [])[Number(lineMatch[1]) - 1] || null;
    if(!ticket){
      printLines([`FA/FH LINE L${lineMatch[1]} NOT FOUND IN ACTIVE PNR`], 'err');
      return;
    }
  } else if(numberMatch){
    const wanted = numberMatch[1].replace(/-/g, '');
    ticket = (state.tickets || []).find(t => String(t.tktNum || '').replace(/-/g, '') === wanted) || null;
    if(!ticket){
      printLines([`ORIGINAL TICKET ${numberMatch[1]} NOT FOUND IN ACTIVE PNR`], 'err');
      return;
    }
  } else {
    ticket = (state.tickets || []).slice().reverse().find(t => t.status !== 'E' && t.status !== 'R' && t.status !== 'V') || null;
  }
  if(!ticket){
    printLines(['NO ORIGINAL TICKET FOUND IN ACTIVE PNR'], 'err');
    return;
  }
  const tktNum = ticket.tktNum;
  if(state._manualExchange && state._manualExchange.oldTkt !== tktNum){
    printLines(['FO TICKET DOES NOT MATCH THE TICKET SELECTED BY TTK/EXCH'], 'err');
    return;
  }
  if(ticket.status === 'E' || ticket.status === 'R' || ticket.status === 'V'){
    printLines([`CANNOT USE ORIGINAL TICKET WITH STATUS ${ticket.status}`], 'err');
    return;
  }
  state._foRecorded = tktNum;
  state._exchangeMode = true;
  printLines([
    `ORIGINAL ISSUE RECORDED: ${tktNum}`,
    `ENTER FORM OF PAYMENT (FP CASH / FP INV) OR ISSUE WITH TTP/EXCH`
  ], 'success');
  showToast(`Original Issue recorded: ${tktNum}`);
}

// ---------- 4. TJQ — Ticket Journal Query / Daily Sales Report ----------
function handleTJQ(cmd){
  const office = state.officeId || (typeof OFFICE_ID !== 'undefined' ? OFFICE_ID : 'DACVS31XW');
  const agent = state.agentCode || 'BP/AS';
  const dt = state.dateStamp ? state.dateStamp.split('/')[0] : '18JUN26';
  const isSummaryOnly = /\/SO\b/i.test(cmd);

  // Collect all tickets across local storage and current active state
  const allTickets = [];
  const seenTktNums = new Set();

  // 1. Current active state tickets
  if(state.tickets && state.tickets.length){
    state.tickets.forEach(t => {
      if(!seenTktNums.has(t.tktNum)){
        seenTktNums.add(t.tktNum);
        allTickets.push({
          ...t,
          pnr: state.locator || 'CURRENT',
          fop: state.fop || 'CASH'
        });
      }
    });
  }

  // 2. Saved PNRs in localStorage
  const savedPnrs = typeof loadSavedPNRs === 'function' ? loadSavedPNRs() : {};
  Object.keys(savedPnrs).forEach(loc => {
    const pnr = savedPnrs[loc];
    if(pnr && pnr.tickets && pnr.tickets.length){
      pnr.tickets.forEach(t => {
        if(!seenTktNums.has(t.tktNum)){
          seenTktNums.add(t.tktNum);
          allTickets.push({
            ...t,
            pnr: loc,
            fop: pnr.fop || 'CASH'
          });
        }
      });
    }
  });

  // If no tickets issued yet in the database, provide standard training demo records
  if(allTickets.length === 0){
    allTickets.push({
      tktNum: '157-7800396554421',
      name: 'JHONY/MD MR',
      pnr: 'ICRBPO',
      fop: 'CASH',
      amount: 30000,
      status: 'OK',
      tktDate: dt
    });
  }

  if(isSummaryOnly){
    let cashTotal = 0;
    let nonCashTotal = 0;
    let cashCount = 0;
    let nonCashCount = 0;

    allTickets.forEach(t => {
      const isVoid = t.status === 'V';
      const amt = isVoid ? 0 : (parseInt(t.amount, 10) || 30000);
      const isCash = !t.fop || /CASH/i.test(t.fop);
      if(!isVoid){
        if(isCash){
          cashTotal += amt;
          cashCount++;
        } else {
          nonCashTotal += amt;
          nonCashCount++;
        }
      }
    });

    const netSales = cashTotal + nonCashTotal;
    const totalDocs = allTickets.length;

    const summaryLines = [
      `TJQ/SO/CURRENT/${office}/${dt}`,
      `DAILY SALES SUMMARY REPORT — ${office} / ${dt}`,
      `--------------------------------------------------------------------------------`,
      `FORM OF PAYMENT               DOCUMENTS                       AMOUNT BDT`,
      `CASH                                  ${String(cashCount).padStart(3, ' ')}                       ${String(cashTotal).padStart(10, ' ')}`,
      `INVOICE / NON-CASH                    ${String(nonCashCount).padStart(3, ' ')}                       ${String(nonCashTotal).padStart(10, ' ')}`,
      `--------------------------------------------------------------------------------`,
      `NET SALES TOTAL                       ${String(totalDocs).padStart(3, ' ')}                       ${String(netSales).padStart(10, ' ')}`
    ];
    printLines(summaryLines, '');
    showToast(`TJQ Summary Report displayed`);
    return;
  }

  // Full TJQ Details
  let cashTotal = 0;
  let nonCashTotal = 0;

  const rows = [
    `TJQ/CURRENT/${office}/${dt}                                  PAGE  1/ 1`,
    `OFFICE: ${office}     AGENT: ${agent}     CURRENCY: BDT`,
    ``,
    `SEQ   TKT/DOC NBR       PAX NAME                 PNR    FOP    AMOUNT  CUR  ST`,
    `--------------------------------------------------------------------------------`
  ];

  allTickets.forEach((t, idx) => {
    const seq = String(idx + 1).padStart(3, '0');
    const tktClean = (t.tktNum || '157-7800396554421').padEnd(17, ' ');
    let name = (t.name || 'PASSENGER').toUpperCase();
    if(name.length > 24) name = name.substring(0, 24);
    name = name.padEnd(24, ' ');
    const loc = (t.pnr || '------').padEnd(6, ' ');
    const fop = (t.fop || 'CASH').padEnd(6, ' ');
    const isVoid = t.status === 'V';
    const isRfnd = t.status === 'R';
    const isExch = t.status === 'E';
    const stCode = isVoid ? 'VOID' : (isRfnd ? 'RFND' : (isExch ? 'EXCH' : 'OK  '));
    const amtVal = isVoid ? 0 : (parseInt(t.amount, 10) || 30000);
    const amtStr = String(amtVal).padStart(8, ' ');

    const isCash = !t.fop || /CASH/i.test(t.fop);
    if(!isVoid){
      if(isCash) cashTotal += amtVal;
      else nonCashTotal += amtVal;
    }

    rows.push(`${seq}   ${tktClean} ${name} ${loc} ${fop} ${amtStr}  BDT  ${stCode}`);
  });

  const grandTotal = cashTotal + nonCashTotal;

  rows.push(
    `--------------------------------------------------------------------------------`,
    `TOTAL DOCUMENTS: ${String(allTickets.length).padStart(3, '0')}`,
    `TOTAL CASH     : BDT ${String(cashTotal).padStart(10, ' ')}`,
    `TOTAL NON-CASH : BDT ${String(nonCashTotal).padStart(10, ' ')}`,
    `GRAND TOTAL    : BDT ${String(grandTotal).padStart(10, ' ')}`
  );

  printLines(rows, '');
  showToast(`TJQ: Daily sales query report displayed`);
}

