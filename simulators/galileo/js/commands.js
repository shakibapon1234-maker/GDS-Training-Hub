(function (global) {

  const STEPS = ["login","availability","sell","name","contact","save","price","issue"];

  // Day abbreviations for date display
  const DAYS = ["SUN","MON","TUE","WED","THU","FRI","SAT"];

  function dayOfDate(dateStr) {
    // dateStr like "01APR" or "20DEC" or "20DEC26"
    const MONTHS = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
    const m = String(dateStr).trim().toUpperCase().match(/^(\d{1,2})([A-Z]{3})(\d{2})?$/);
    if (!m) return "MON";
    const d = parseInt(m[1], 10);
    const mon = MONTHS[m[2]];
    if (mon === undefined) return "MON";
    const yr = m[3] ? (2000 + parseInt(m[3], 10)) : new Date().getFullYear();
    const dt = new Date(yr, mon, d);
    return DAYS[dt.getDay()];
  }

  const AIRLINE_PREFIXES = {
    MH: "232", BS: "779", BG: "997", AI: "098", EK: "176", TK: "235",
    SQ: "618", TG: "217", QR: "157", SV: "065", EY: "607", FZ: "141",
    G9: "514", GF: "072", J9: "486", KU: "229", WY: "910", XY: "593",
    BA: "125", AF: "057", KL: "074", LH: "220", "6E": "312", "2A": "610",
    AK: "807", OD: "816", UL: "603", UK: "228"
  };

  function getAirline3DigitCode(carrier) {
    if (!carrier) return "232";
    const c = String(carrier).toUpperCase().trim();
    if (typeof GalileoAirports !== "undefined" && GalileoAirports.airlines && GalileoAirports.airlines[c] && GalileoAirports.airlines[c].num && GalileoAirports.airlines[c].num !== "N/A") {
      return GalileoAirports.airlines[c].num;
    }
    return AIRLINE_PREFIXES[c] || "232";
  }

  function freshState() {
    return {
      signedIn: true,
      officeId: "DACVS086JJ",
      workArea: "A",
      dutyCode: "SU",
      allAreasSignedIn: true,
      signOn: "ZHA",
      availability: false,
      availHeader: null,
      results: [],
      segments: [],          // array of sold segments (multi-segment support)
      names: [],             // array of passenger names
      passengerTypes: [],    // ADT / CHD / INF details matching each name entry
      phones: [],
      ticketing: null,
      receivedFrom: null,
      locator: null,
      priced: false,
      fare: null,
      filedFare: false,
      storedFare: false,
      issued: false,
      saved: false,
      dirty: false,
      savedPnr: null,
      issuedTicket: null,    // electronic ticket details
      issuedTickets: [],     // all electronic tickets for multi-passenger booking
      ticketHistory: [],     // historical exchanged/refunded/void tickets
      fareBuild: null,       // Fare Build interactive screen state (*FB1, FBUTAX, etc.)
      exchangeTicket: null,  // Original surrendered ticket number for TMU1FEX
      exchangeReview: null,  // Calculated unused/partially-used ticket exchange settlement
      commission: null,      // Commission rate from TMU1Z0 / TMU1Z7
      invoiceAgent: null,    // FINVAGT value required with the ticketing modifier
      modifierSaved: false,  // becomes true only after the modifier is end-transacted
      refund: null,          // Electronic ticket refund mask calculation
      refundNotice: null,    // Refund notice number if refunded
      airlinePnr: null,
      vendorLocator: null,
      vendorRemarks: null,
      justEnded: false,
      itineraryCancelled: false,
      ssr: [],
      osk: [],               // OSI remarks
      mileage: [],           // Frequent flyer / mileage membership
      retention: null,       // Retention segment / keep live remark
      dividedPnr: null,      // Divided / split PNR locator
      pendingDivide: null,   // Pending divide state before filing
      queueState: null,      // Queue management state
      history: [],
      activeBfCleared: false,
      availPage: 0,
      lastAvailCmd: null
    };
  }

  function clone(v) { return JSON.parse(JSON.stringify(v)); }

  function ticketKey(value) { return String(value || "").replace(/[^A-Z0-9]/gi, "").toUpperCase(); }
  function ticketIsOpenForRefund(ticket) {
    const openStatuses = ["OPEN FOR USE", "REISSUED - OPEN FOR USE", "OPEN"];
    return !!ticket && openStatuses.includes(ticket.status) && !(ticket.coupons || []).some(coupon => coupon.status && coupon.status !== "O");
  }
  function ticketIsPartialRefund(ticket) {
    const coupons = (ticket && ticket.coupons) || [];
    return coupons.some(coupon => coupon.status === "F") && coupons.some(coupon => coupon.status === "O");
  }
  function ticketCanBeVoided(ticket) {
    if (!ticketIsOpenForRefund(ticket)) return { ok: false, reason: `TICKET STATUS IS ${ticket && ticket.status ? ticket.status : "NOT ELIGIBLE"}` };
    // Preset training tickets represent tickets issued during the active
    // training day. Newly issued tickets receive a real local void deadline.
    if (ticket.voidEligible === false) return { ok: false, reason: "VOID WINDOW CLOSED - USE REFUND OR REISSUE" };
    if (ticket.voidDeadline && Date.now() > Number(ticket.voidDeadline)) {
      return { ok: false, reason: "VOID WINDOW CLOSED - SAME-DAY VOID IS NO LONGER PERMITTED; USE REFUND OR REISSUE" };
    }
    return { ok: true };
  }
  function sameDayVoidDeadline() {
    const deadline = new Date();
    deadline.setHours(23, 59, 59, 999);
    return deadline.getTime();
  }
  function trainingFxRate(from, to) {
    // Two-way lookup: add any new training rates here.
    // Rates are approximate training figures; not live BSP rates.
    const rates = {
      USDBDT: 122,   BDTUSD: +(1/122).toFixed(6),
      USDPKR: 279.44, PKRUSD: +(1/279.44).toFixed(6),
      BDTPKR: +(279.44/122).toFixed(4), PKRBDT: +(122/279.44).toFixed(4)
    };
    return rates[`${from}${to}`] || null;
  }
  function buildPartialRefund(ticket, penaltyArg) {
    const unusedBase = Number(ticket.unusedBaseFare);
    const unusedTaxes = Number(ticket.unusedTaxes);
    if (!Number.isFinite(unusedBase) || !Number.isFinite(unusedTaxes)) {
      return { error: "PARTIAL REFUND NEEDS FLOWN/UNUSED COUPON FARE AND TAX ALLOCATION" };
    }
    const penalty = penaltyArg != null && penaltyArg !== "" ? Number(penaltyArg) : (ticket.carrier === "BG" ? 3000 : 5000);
    const withheldPenalty = Math.min(penalty, unusedBase);
    const usedCoupons = (ticket.coupons || []).filter(coupon => coupon.status === "F").map(coupon => coupon.cpn).join(" ");
    const unusedCoupons = (ticket.coupons || []).filter(coupon => coupon.status === "O").map(coupon => coupon.cpn).join(" ");
    return {
      refund: {
        refundType: "partial",
        ticketNumber: ticket.ticketNumber,
        paxName: ticket.paxName,
        carrier: ticket.carrier || "BG",
        totalPaid: Number(ticket.total || (unusedBase + unusedTaxes)),
        basePaid: unusedBase,
        taxesPaid: unusedTaxes,
        taxRows: [{ code: "UNUSED TAX", amount: unusedTaxes, refundAmount: unusedTaxes }],
        refundableTaxes: unusedTaxes,
        withheldTaxes: Number(ticket.flownTaxes) || 0,
        penalty: withheldPenalty,
        netRefund: Math.max(0, unusedBase - withheldPenalty) + unusedTaxes,
        issueDate: ticket.issueDate || "",
        cashPaidExTax: Number(ticket.baseFare || 0),
        cashUsedExTax: Number(ticket.flownBaseFare || 0),
        usedCoupons,
        unusedCoupons,
        phase: 1
      }
    };
  }

  // DOCS SSRs belong to one passenger only.  Do not infer a passport from a
  // name or reuse the first DOCS SSR: that can put one passenger's passport
  // on every ticket in a multi-passenger PNR.
  function getPassportForPassenger(ssrList, passengerNumber) {
    const target = String(passengerNumber);
    for (const item of (ssrList || [])) {
      if (!item || (item.code && item.code !== "DOCS")) continue;
      const raw = typeof item === "object" ? (item.raw || item.detail || "") : String(item);
      const explicitlyAssigned = typeof item === "object" && String(item.passenger || "") === target;
      const legacyAssigned = new RegExp(`(?:^|[./])P${target}(?:[./]|$)`, "i").test(raw);
      if (!explicitlyAssigned && !legacyAssigned) continue;
      const match = raw.match(/\/P\/[A-Z]{3}\/([A-Z0-9]+)\//i);
      if (match) return match[1];
    }
    return "";
  }

  function resolvePassengerType(name, qualifier) {
    const q = (qualifier || "").toUpperCase().trim();
    const n = (name || "").toUpperCase().trim();
    if (n.startsWith("I/") || n.startsWith("N.I/") || n.includes("/I/")) {
      return "INF";
    }
    if (q.startsWith("P-C") || /^C\d{1,2}$/.test(q) || q === "CHD" || q === "CNN") {
      return "CHD";
    }
    if (q === "INF" || q.startsWith("P-INF")) {
      return "INF";
    }
    const dobMatch = q.match(/^(\d{2})[A-Z]{3}(\d{2}|\d{4})$/);
    if (dobMatch) {
      let rawYr = parseInt(dobMatch[2], 10);
      if (rawYr < 100) { const curYY = new Date().getFullYear() % 100; rawYr = rawYr <= curYY ? (2000 + rawYr) : (1900 + rawYr); }
      const age = new Date().getFullYear() - rawYr;
      if (age < 2) return "INF";
      if (age < 12) return "CHD";
      return "ADT";
    }
    if (q) return "INF";
    return "ADT";
  }

  // Pre-seeded practice PNRs (e.g. unutilized ticket reissue practice)
  const PRESEEDED_PNRS = {
    "TK7REI": {
      locator: "TK7REI",
      signedIn: true,
      officeId: "DACVS086JJ",
      names: ["1-RAHMAN/MD HAFIZUR MR"],
      passengerTypes: [{ type: "ADT", qualifier: "" }],
      segments: [
        {
          segNum: 1,
          carrier: "TK",
          number: "713",
          soldClass: "Q",
          date: "05JAN",
          origin: "DAC",
          destination: "IST",
          depart: "0650",
          arrive: "2155",
          termOrig: "1",
          termDest: "3",
          paxCount: 1,
          heldSeats: 1,
          status: "HS",
          airline_full: "TURKISH AIRLINES",
          notes: ["VIA ISTANBUL TK713/TK760", "DEPARTS DAC TERMINAL 1 - ARRIVES DXB TERMINAL 3", "CHECK REISSUE CAT 16 RULES BEFORE EXCHANGE"]
        },
        {
          segNum: 2,
          carrier: "TK",
          number: "760",
          soldClass: "Q",
          date: "06JAN",
          origin: "IST",
          destination: "DXB",
          depart: "2105",
          arrive: "0155",
          termOrig: "1",
          termDest: "3",
          paxCount: 1,
          heldSeats: 1,
          status: "HS",
          airline_full: "TURKISH AIRLINES",
          notes: ["CONNECTION FROM TK713", "UNUTILIZED COUPON - OPEN FOR EXCHANGE"]
        }
      ],
      phones: ["WINGS FLY REF YEASIR 01792739866"],
      ticketing: "T.T*",
      receivedFrom: "YEASIR",
      saved: true,
      issued: true,
      priced: true,
      filedFare: true,
      storedFare: true,
      issuedTicket: {
        ticketNumber: "235-8910482910",
        issueDate: "21DEC21",
        carrier: "TK",
        paxName: "RAHMAN/MD HAFIZUR MR",
        baseFare: 43225,
        currency: "BDT",
        taxes: [
          { num: 1, amount: 5000, code: "BD", desc: "Embarkation Tax" },
          { num: 2, amount: 3000, code: "UT", desc: "Security Charge" },
          { num: 3, amount: 2000, code: "E5", desc: "Customs Fee" }
        ],
        total: 53225,
        coupons: [
          { cpn: 1, route: "DAC-IST", carrier: "TK", class: "Q", date: "05JAN22", status: "O", statusDesc: "OPEN FOR USE" },
          { cpn: 2, route: "IST-DXB", carrier: "TK", class: "Q", date: "06JAN22", status: "O", statusDesc: "OPEN FOR USE" }
        ],
        status: "OPEN FOR USE",
        fop: "CASH"
      },
      fare: {
        base: 43225,
        taxes: 10000,
        total: 53225,
        carrier: "TK",
        passengers: { adt: 1, chd: 0 }
      },
      vendorLocator: "TK*21DEC21/1430",
      vendorRemarks: "UNUTILIZED ELECTRONIC TICKET READY FOR REISSUE / EXCHANGE"
    },
    "BG7REF": {
      locator: "BG7REF",
      signedIn: true,
      officeId: "DACVS086JJ",
      names: ["1-RAHMAN/ATIKUR MR"],
      passengerTypes: [{ type: "ADT", qualifier: "" }],
      segments: [
        {
          segNum: 1,
          carrier: "BG",
          number: "602",
          soldClass: "Y",
          date: "27MAR",
          origin: "ZYL",
          destination: "DAC",
          depart: "1120",
          arrive: "1205",
          termOrig: "1",
          termDest: "DOM",
          paxCount: 1,
          heldSeats: 1,
          status: "HK",
          airline_full: "BIMAN BANGLADESH AIRLINES",
          notes: ["DEPARTS ZYL TERMINAL 1 - ARRIVES DAC DOMESTIC", "CONFIRMED OPEN ELECTRONIC TICKET FOR FULL REFUND"]
        }
      ],
      phones: ["WINGS FLY REF MASUD 01712000000"],
      ticketing: "T.T*",
      receivedFrom: "MASUD",
      saved: true,
      issued: true,
      priced: true,
      filedFare: true,
      storedFare: true,
      issuedTicket: {
        ticketNumber: "997-5555555555",
        ticketNumberRaw: "99755555555555",
        issueDate: "26MAR20",
        carrier: "BG",
        paxName: "RAHMAN/ATIKUR MR",
        baseFare: 3200,
        currency: "BDT",
        taxes: [
          { num: 1, amount: 500, code: "BD", desc: "Embarkation Tax" },
          { num: 2, amount: 225, code: "UT", desc: "Security Charge" }
        ],
        total: 3925,
        coupons: [
          { cpn: 1, route: "ZYL-DAC", carrier: "BG", class: "Y", date: "27MAR20", status: "O", statusDesc: "OPEN FOR USE" }
        ],
        status: "OPEN FOR USE",
        fop: "CASH"
      },
      fare: {
        base: 3200,
        taxes: 725,
        total: 3925,
        carrier: "BG",
        passengers: { adt: 1, chd: 0 }
      },
      vendorLocator: "BG*26MAR20/1100",
      vendorRemarks: "ELECTRONIC TICKET READY FOR CANCELLATION AND REFUND"
    },
    "BG2PAR": {
      locator: "BG2PAR",
      signedIn: true,
      officeId: "DACVS086JJ",
      names: ["1-CHOWDHURY/TANVIR MR"],
      passengerTypes: [{ type: "ADT", qualifier: "" }],
      segments: [
        {
          segNum: 1,
          carrier: "BG",
          number: "088",
          soldClass: "Y",
          date: "15SEP",
          origin: "DAC",
          destination: "BKK",
          depart: "1145",
          arrive: "1515",
          termOrig: "1",
          termDest: "1",
          paxCount: 1,
          heldSeats: 1,
          status: "USED",
          flown: true,
          airline_full: "BIMAN BANGLADESH AIRLINES",
          notes: ["OUTBOUND DAC-BKK FLOWN ON 15SEP - STATUS: FLOWN", "COUPON 1 FLOWN"]
        },
        {
          segNum: 2,
          carrier: "BG",
          number: "089",
          soldClass: "Y",
          date: "25SEP",
          origin: "BKK",
          destination: "DAC",
          depart: "1620",
          arrive: "1755",
          termOrig: "1",
          termDest: "1",
          paxCount: 1,
          heldSeats: 1,
          status: "HK",
          flown: false,
          airline_full: "BIMAN BANGLADESH AIRLINES",
          notes: ["INBOUND BKK-DAC UNUTILIZED - OPEN FOR REFUND OR EXCHANGE", "COUPON 2 OPEN FOR USE"]
        }
      ],
      phones: ["WINGS FLY REF MASUD 01712000000"],
      ticketing: "T.T*",
      receivedFrom: "TANVIR",
      saved: true,
      issued: true,
      priced: true,
      filedFare: true,
      storedFare: true,
      issuedTicket: {
        ticketNumber: "997-6666666666",
        ticketNumberRaw: "99766666666666",
        issueDate: "10SEP26",
        carrier: "BG",
        paxName: "CHOWDHURY/TANVIR MR",
        baseFare: 38000,
        currency: "BDT",
        taxes: [
          { num: 1, amount: 4000, code: "BD", desc: "Embarkation Tax" },
          { num: 2, amount: 3000, code: "UT", desc: "Security Charge" }
        ],
        total: 45000,
        coupons: [
          { cpn: 1, route: "DAC-BKK", carrier: "BG", class: "Y", date: "15SEP26", status: "F", statusDesc: "FLOWN / USED" },
          { cpn: 2, route: "BKK-DAC", carrier: "BG", class: "Y", date: "25SEP26", status: "O", statusDesc: "OPEN FOR USE" }
        ],
        status: "PARTIALLY FLOWN",
        isPartial: true,
        flownBaseFare: 22000,
        flownTaxes: 3500,
        unusedBaseFare: 16000,
        unusedTaxes: 3500,
        fop: "CASH"
      },
      fare: {
        base: 38000,
        taxes: 7000,
        total: 45000,
        carrier: "BG",
        passengers: { adt: 1, chd: 0 }
      },
      vendorLocator: "BG*10SEP26/0930",
      vendorRemarks: "PARTIALLY USED ELECTRONIC TICKET (CPN 1 FLOWN, CPN 2 OPEN)"
    }
  };
  PRESEEDED_PNRS["TK8AFR"] = {
    locator: "TK8AFR",
    signedIn: true,
    officeId: "DACVS086JJ",
    names: ["1-HOSSAIN/KARIM MR"],
    passengerTypes: [{ type: "ADT", qualifier: "" }],
    segments: [
      {
        segNum: 1,
        carrier: "TK",
        number: "712",
        soldClass: "Y",
        date: "15JAN",
        origin: "DAC",
        destination: "IST",
        depart: "0650",
        arrive: "1150",
        termOrig: "1",
        termDest: "1",
        paxCount: 1,
        heldSeats: 1,
        status: "HK",
        airline_full: "TURKISH AIRLINES",
        notes: ["OPEN TICKET - FULL REFUND ELIGIBLE", "USE TRNF TO INITIATE AUTOMATED FARE REFUND"]
      }
    ],
    phones: ["WINGS FLY REF KARIM 01712000001"],
    ticketing: "T.T*",
    receivedFrom: "KARIM",
    saved: true,
    issued: true,
    priced: true,
    filedFare: true,
    storedFare: true,
    issuedTicket: {
      ticketNumber: "235-7654321098",
      ticketNumberRaw: "2357654321098",
      issueDate: "10JAN26",
      carrier: "TK",
      paxName: "HOSSAIN/KARIM MR",
      baseFare: 43225,
      currency: "BDT",
      taxes: [
        { num: 1, amount: 5000, code: "BD", desc: "Embarkation Tax", refundable: true },
        { num: 2, amount: 3000, code: "UT", desc: "Security Charge", refundable: true },
        { num: 3, amount: 2000, code: "E5", desc: "Customs Fee", refundable: true }
      ],
      total: 53225,
      coupons: [
        { cpn: 1, route: "DAC-IST", carrier: "TK", class: "Y", date: "15JAN26", status: "O", statusDesc: "OPEN FOR USE" }
      ],
      status: "OPEN FOR USE",
      fop: "CASH"
    },
    fare: {
      base: 43225,
      taxes: 10000,
      total: 53225,
      carrier: "TK",
      passengers: { adt: 1, chd: 0 }
    },
    vendorLocator: "TK*10JAN26/0900",
    vendorRemarks: "OPEN ELECTRONIC TICKET - AUTOMATED FARE REFUND PRACTICE (TRNF)"
  };
  PRESEEDED_PNRS["REISSUE"] = PRESEEDED_PNRS["TK7REI"];
  PRESEEDED_PNRS["REFUND"] = PRESEEDED_PNRS["BG7REF"];
  PRESEEDED_PNRS["PARTIAL"] = PRESEEDED_PNRS["BG2PAR"];
  PRESEEDED_PNRS["AUTOREFUND"] = PRESEEDED_PNRS["TK8AFR"];

  // Generate a random 6-char alphanumeric PNR locator (guarantees a realistic mix of letters and digits)
  function genLocator() {
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const digits = "23456789";
    const digitCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 digits
    const arr = [];
    for (let i = 0; i < digitCount; i++) {
      arr.push(digits[Math.floor(Math.random() * digits.length)]);
    }
    while (arr.length < 6) {
      arr.push(letters[Math.floor(Math.random() * letters.length)]);
    }
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i];
      arr[i] = arr[j];
      arr[j] = tmp;
    }
    return arr.join("");
  }

  // Build city names from airport codes
  function cityPair(orig, dest) {
    const a = GalileoAirports.find(orig);
    const b = GalileoAirports.find(dest);
    const ac = a ? a.city.toUpperCase() : orig;
    const bc = b ? b.city.toUpperCase() : dest;
    return `${ac}/${bc}`;
  }

  class GalileoCommandEngine {
    constructor() {
      this._initStores();
      this.reset();
    }

    _initStores() {
      this.pnrStore = {};
      this.queueStore = { "1": ["Q1RE01", "Q1RE02"], "10": ["TK7REI"], "20": [], "50": [] };
      try {
        if (typeof localStorage !== "undefined") {
          const rawP = localStorage.getItem("GELLELIO_PNRS");
          if (rawP) this.pnrStore = JSON.parse(rawP) || {};
          const rawQ = localStorage.getItem("GELLELIO_QUEUES");
          if (rawQ) this.queueStore = Object.assign(this.queueStore, JSON.parse(rawQ) || {});
        }
      } catch (_) {}
    }

    _savePnrToStore(pnr) {
      if (!pnr || !pnr.locator) return;
      if (!this.pnrStore) this.pnrStore = {};
      const today = new Date();
      const m = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      const todayCode = String(today.getDate()).padStart(2, "0") + m[today.getMonth()];
      const pnrCopy = clone(pnr);
      pnrCopy.createDate = pnrCopy.createDate || todayCode;
      this.pnrStore[pnr.locator] = pnrCopy;
      this.lastSavedPnr = clone(pnrCopy);
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("GELLELIO_PNRS", JSON.stringify(this.pnrStore));
        }
      } catch (_) {}
    }

    _saveQueueStore() {
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem("GELLELIO_QUEUES", JSON.stringify(this.queueStore));
        }
      } catch (_) {}
    }

    reset() { this.state = freshState(); }

    findTicket(ticketNumber) {
      const requested = ticketKey(ticketNumber);
      const candidates = [];
      const add = ticket => { if (ticket && !candidates.some(item => ticketKey(item.ticketNumber) === ticketKey(ticket.ticketNumber))) candidates.push(ticket); };
      add(this.state.issuedTicket);
      (this.state.issuedTickets || []).forEach(add);
      (this.state.ticketHistory || []).forEach(add);
      add(this.lastSavedPnr && this.lastSavedPnr.issuedTicket);
      (this.lastSavedPnr && this.lastSavedPnr.issuedTickets || []).forEach(add);
      (this.lastSavedPnr && this.lastSavedPnr.ticketHistory || []).forEach(add);
      Object.values(this.pnrStore || {}).forEach(pnr => {
        if (pnr) {
          add(pnr.issuedTicket);
          (pnr.issuedTickets || []).forEach(add);
          (pnr.ticketHistory || []).forEach(add);
        }
      });
      if (requested) {
        // 1. Exact match (handles full 13-digit and display-form numbers)
        const current = candidates.find(ticket => [ticket.ticketNumberRaw, ticket.ticketNumber].some(value => ticketKey(value) === requested));
        if (current) return current;
        const preset = Object.values(PRESEEDED_PNRS).map(pnr => pnr.issuedTicket).find(ticket => ticket && [ticket.ticketNumberRaw, ticket.ticketNumber].some(value => ticketKey(value) === requested));
        if (preset) return clone(preset);
        // 2. Suffix match: real Galileo allows entering just the 10-digit
        //    serial portion without the 3-digit carrier prefix.
        //    e.g. TRNE6039049737 matches ticket 157-6039049737
        if (requested.length >= 9 && requested.length <= 11) {
          const bySuffix = candidates.find(t => ticketKey(t.ticketNumber).endsWith(requested) || ticketKey(t.ticketNumberRaw || "").endsWith(requested));
          if (bySuffix) return bySuffix;
          const presetSuffix = Object.values(PRESEEDED_PNRS).map(pnr => pnr.issuedTicket).find(t => t && (ticketKey(t.ticketNumber).endsWith(requested) || ticketKey(t.ticketNumberRaw || "").endsWith(requested)));
          if (presetSuffix) return clone(presetSuffix);
        }
        return null;
      }
      return candidates[0] || null;
    }

    prepareUnusedExchange(ticketNumber) {
      const ticket = this.findTicket(ticketNumber);
      if (!ticket) return { error: "ORIGINAL TICKET NOT FOUND - RETRIEVE A TICKETED PNR OR ENTER A VALID TICKET NUMBER" };
      if (!ticketIsOpenForRefund(ticket)) return { error: `CANNOT REISSUE TICKET: STATUS IS ${ticket.status}` };
      const newFare = this.state.fareBuild || this.state.fare;
      if (!newFare) return { error: "NEW FARE NOT FOUND - COMPLETE FARE BUILD AND ENTER FBF FIRST" };
      const newBase = Number(newFare.baseFare ?? newFare.base ?? 0);
      const newTaxes = newFare.taxes || [];
      const taxTotal = Array.isArray(newTaxes) ? newTaxes.reduce((sum, tax) => sum + Number(tax.amount || 0), 0) : Number(newTaxes || 0);
      const newTotal = Number(newFare.total ?? (newBase + taxTotal));
      const oldBase = Number(ticket.baseFare || 0);
      const oldTaxes = (ticket.taxes || []).reduce((sum, tax) => sum + Number(tax.amount || 0), 0);
      const oldTotal = Number(ticket.total || (oldBase + oldTaxes));
      const penalty = (Array.isArray(newTaxes) ? newTaxes : []).filter(tax => ["XP", "CP"].includes(String(tax.code || "").toUpperCase())).reduce((sum, tax) => sum + Number(tax.amount || 0), 0);
      const review = {
        originalTicket: ticket.ticketNumber,
        originalTicketRaw: ticket.ticketNumberRaw || ticketKey(ticket.ticketNumber),
        originalBase: oldBase,
        originalTaxes: oldTaxes,
        originalTotal: oldTotal,
        newBase,
        newTaxes: clone(Array.isArray(newTaxes) ? newTaxes : []),
        newTotal,
        fareDifference: newBase - oldBase,
        taxDifference: taxTotal - oldTaxes,
        penalty,
        settlement: newTotal - oldTotal
      };
      this.state.exchangeTicket = ticket.ticketNumber;
      this.state.exchangeReview = review;
      return { ticket, review };
    }

    preparePartialExchange(ticketNumber) {
      const ticket = this.findTicket(ticketNumber);
      if (!ticket) return { error: "ORIGINAL TICKET NOT FOUND - RETRIEVE A TICKETED PNR OR ENTER A VALID TICKET NUMBER" };
      const coupons = ticket.coupons || [];
      const hasFlownCoupon = coupons.some(coupon => coupon.status === "F");
      const hasOpenCoupon = coupons.some(coupon => coupon.status === "O");
      if (!hasFlownCoupon || !hasOpenCoupon) return { error: `CANNOT PROCESS PARTIALLY USED EXCHANGE: STATUS IS ${ticket.status}` };

      const newFare = this.state.fareBuild || this.state.fare;
      if (!newFare) return { error: "NEW FARE NOT FOUND - COMPLETE FARE BUILD AND ENTER FBF FIRST" };
      const newBase = Number(newFare.baseFare ?? newFare.base ?? 0);
      const newTaxes = Array.isArray(newFare.taxes) ? newFare.taxes : [];
      const newTaxTotal = newTaxes.reduce((sum, tax) => sum + Number(tax.amount || 0), 0);
      const newTotal = Number(newFare.total ?? (newBase + newTaxTotal));

      // A partially used exchange can only apply the value of the unflown
      // coupons.  Do not use the original ticket total: that would credit the
      // already flown sector a second time.
      const originalBase = Number(ticket.unusedBaseFare);
      const originalTaxes = Number(ticket.unusedTaxes);
      if (!Number.isFinite(originalBase) || !Number.isFinite(originalTaxes)) {
        return { error: "PARTIAL EXCHANGE NEEDS UNUSED COUPON FARE/TAX ALLOCATION - RETRIEVE A PARTIAL TRAINING TICKET WITH HISTORICAL FARE DATA" };
      }
      const originalTotal = originalBase + originalTaxes;
      const penalty = newTaxes
        .filter(tax => ["XP", "CP"].includes(String(tax.code || "").toUpperCase()))
        .reduce((sum, tax) => sum + Number(tax.amount || 0), 0);
      const review = {
        exchangeType: "partial",
        originalTicket: ticket.ticketNumber,
        originalTicketRaw: ticket.ticketNumberRaw || ticketKey(ticket.ticketNumber),
        originalBase,
        originalTaxes,
        originalTotal,
        originalGrossTotal: Number(ticket.total || 0),
        flownBase: Number(ticket.flownBaseFare || 0),
        flownTaxes: Number(ticket.flownTaxes || 0),
        flownCoupons: coupons.filter(coupon => coupon.status === "F").map(coupon => clone(coupon)),
        openCoupons: coupons.filter(coupon => coupon.status === "O").map(coupon => clone(coupon)),
        newBase,
        newTaxes: clone(newTaxes),
        newTotal,
        fareDifference: newBase - originalBase,
        taxDifference: newTaxTotal - originalTaxes,
        penalty,
        settlement: newTotal - originalTotal
      };
      this.state.exchangeTicket = ticket.ticketNumber;
      this.state.exchangeReview = review;
      return { ticket, review };
    }

    prepareExchange(ticketNumber) {
      const ticket = this.findTicket(ticketNumber);
      if (!ticket) return { error: "ORIGINAL TICKET NOT FOUND - RETRIEVE A TICKETED PNR OR ENTER A VALID TICKET NUMBER" };
      const coupons = ticket.coupons || [];
      if (coupons.some(coupon => coupon.status === "F") && coupons.some(coupon => coupon.status === "O")) {
        return this.preparePartialExchange(ticketNumber);
      }
      return this.prepareUnusedExchange(ticketNumber);
    }

    _sellOne(lineNum, cls, paxCount) {
      const flight = GalileoFlights.byLine(lineNum, this.state.results);
      if (!flight) return { error: this.error(`LINE ${lineNum} NOT FOUND IN AVAILABILITY`) };
      let seats = flight.classes && flight.classes[cls];
      if (seats === undefined) {
        seats = 9;
        if (flight.classes) flight.classes[cls] = 9;
      }
      if (seats === "C" || seats === 0) return { error: this.error(`${cls} CLASS CLOSED ON LINE ${lineNum}`) };
      const segment = Object.assign({}, flight, { segNum: this.state.segments.length + 1, soldClass: cls, paxCount, heldSeats:paxCount, status: "HS" });
      this.state.segments.push(segment);
      this.state.dirty = true;
      return { resp: { lines: [`${segment.segNum} ${segment.carrier} ${segment.number} ${cls}${paxCount} ${segment.origin}${segment.destination} HS`,], kind: "sell", segment, leftPaneNotes: segment.notes || [] } };
    }

    process(raw) {
      const cmd = raw.trim().toUpperCase();
      if (!cmd) return { lines: [], kind: "" };
      this.state.history.push(raw.trim());

      // ── HELP ──
      if (cmd === "HELP" || cmd === "GG HELP") {
        return { lines: [
          "GELLELIO GALILEO — CORE TRAINING COMMANDS",
          "─────────────────────────────────────────────────────────────────",
          "SON/ZHA                 Sign on with staff initials",
          "SOF / SOF/HA89MD        Sign off / Sign off with PCC",
          "SAI                     Sign on all work areas (A-F)",
          "SB / SA / SA/AG         Switch work areas / Switch with duty code",
          "OP/W*                   Display operator work area status",
          "STD/ZHA                 Display agent user profile",
          "A22JUNDACDXB            Neutral availability",
          "A22JUNDACDXB*EK         Carrier-specific availability",
          "ADACSYD.SIN/SQ          Connecting availability via SIN on SQ",
          "AR27JUN                 Return availability for 27JUN",
          "FDA                     Convert availability to fare display",
          "MD / MU / MT / MB       Move down / up / top / bottom",
          "N1Y1                    Sell 1 seat, Y class, line 1",
          "N.RAHMAN/MD HAFIZUR MR  Adult name",
          "N.1ISLAM/MD MR+N.1RAHMAN/MD MR  Multiple passenger names",
          "N.3RAHMAN/MD HAFIZUR MR/MD HABIBUR MR/MD HASANUR MR  Family names",
          "N.P3@HAFIZUR MR         Modify passenger 3 name",
          "N.P2-3@                 Delete passengers 2 and 3",
          "ON*                     Display name change policy rules",
          "P.T*AGENCY REF NAME 01  Phone field (max 53 characters)",
          "T.T*                    Ticketing agreement (mandatory)",
          "R.H                     Received field",
          "ER / IR                 End and retrieve / Redisplay booking file",
          "*LOCATOR / *-RAHMAN     Retrieve PNR by locator or surname",
          "*ALL / *H / *IA / *N    Display full PNR / History / Itinerary / Names",
          "C-DAC / C-DHAKA         Airport decode / encode",
          "VC-EK / VC-176          Airline decode (code / 3-digit number)",
          "GC-BD                   Country decode",
          "M.EK1234567 / M.@       Frequent flyer membership add / delete",
          "DP1 / F                 Divide / split passenger & file divide",
          "QEB/89MD                Share PNR to branch PCC",
          "RT.T/31DEC*KEEP LIVE    Retention segment / keep PNR active",
          "Q/1 / QN / QR / QXI     Queue enter / next / remove / exit",
          "FQCEK/ET / FQ / FQ.T    Fare load / Fare quote / Ticket historical fare",
          "FZUSD125BDT             Convert a refund penalty amount",
          "BBK                     Best buy itinerary rebook to lowest class",
          "HMET / HMTQ/D           Hardware GTID status / Ticketing quota cap",
          "TKPDTD / TKPDTD/1       Issue / Reissue Electronic Ticket",
          "TKPFEX[ticket]         Open exchange fill-in (simulator review)",
          "TRNE / TRN1 / TRNTAX    Refund mask / page 1 / unused tax page",
          "TRN2 / TRN3 / TRNE/OK   Refund amount / validation / confirm",
          "TRNF / TRNF/OK          Automated fare refund (system auto-calculates from active PNR)",
          "TRV / TRV/...           Void electronic ticket on same day",
          "LESSON / LESSON BOOKING Interactive training lessons & cheat sheets",
          "LESSON AUTOREFUND       Automated fare refund (TRNF) step-by-step guide"
        ]};
      }

      // ── SIGN IN: SON/AGENCY/PASSWORD ──
      if (cmd.startsWith("SON/")) {
        const initials = cmd.slice(4).trim();
        if (!initials) return this.error("FORMAT: SON/ZHA");
        this.state.signedIn = true;
        this.state.officeId = "DACVS086JJ";
        this.state.signOn = initials.split("/")[0];
        return { lines: [
          "SIGN IN COMPLETE",
          `OFFICE ID  : ${this.state.officeId}`,
          "DUTY CODE  : SU",
          "TRAINING   : GELLELIO GALILEO PRACTICE SIMULATOR"
        ]};
      }

      // ── SIGN OUT: SOF or SOF/HA89MD ──
      if (cmd === "SOF" || cmd.startsWith("SOF/")) {
        this.state.signedIn = false;
        return { lines: ["SIGN OFF COMPLETE", `OFFICE: ${this.state.officeId || "DACVS086JJ"}${cmd.startsWith("SOF/") ? " / " + cmd.slice(4) : ""}`, "ALL WORK AREAS SIGNED OFF"] };
      }

      if (!this.state.signedIn) return this.error("SIGN IN REQUIRED - ENTER: SON/ZHA");

      // ── WORK AREA SWITCHING: SAI, SB, SA, SC, SD, SE, SF, SA/AG, OP/W*, STD/ZHA ──
      if (cmd === "SAI") {
        this.state.signedIn = true;
        this.state.allAreasSignedIn = true;
        return {
          lines: [
            "SIGN ON COMPLETE — ALL WORK AREAS",
            "WORK AREAS ACTIVE: A B C D E F",
            `CURRENT AREA    : ${this.state.workArea || "A"}`,
            `OFFICE ID       : ${this.state.officeId || "DACVS086JJ"}`
          ]
        };
      }
      const switchAreaMatch = cmd.match(/^S([A-F])(?:\/([A-Z0-9]+))?$/);
      if (switchAreaMatch && cmd !== "SOF") {
        const area = switchAreaMatch[1];
        const duty = switchAreaMatch[2] || this.state.dutyCode || "SU";
        this.state.workArea = area;
        this.state.dutyCode = duty;
        return {
          lines: [
            `WORK AREA ${area} ACTIVE`,
            `DUTY CODE : ${duty}`,
            `OFFICE ID : ${this.state.officeId || "DACVS086JJ"}`
          ]
        };
      }
      if (cmd === "OP/W*") {
        const cur = this.state.workArea || "A";
        return {
          lines: [
            "OPERATOR WORK AREAS STATUS:",
            `*A   ${cur === "A" ? "ACTIVE" : "IDLE"}    ${this.state.dutyCode || "SU"}    ${this.state.officeId || "DACVS086JJ"}`,
            ` B   ${cur === "B" ? "ACTIVE" : "IDLE"}    ${this.state.dutyCode || "SU"}    ${this.state.officeId || "DACVS086JJ"}`,
            ` C   ${cur === "C" ? "ACTIVE" : "IDLE"}    ${this.state.dutyCode || "SU"}    ${this.state.officeId || "DACVS086JJ"}`,
            ` D   ${cur === "D" ? "ACTIVE" : "IDLE"}    ${this.state.dutyCode || "SU"}    ${this.state.officeId || "DACVS086JJ"}`,
            ` E   ${cur === "E" ? "ACTIVE" : "IDLE"}    ${this.state.dutyCode || "SU"}    ${this.state.officeId || "DACVS086JJ"}`,
            ` F   ${cur === "F" ? "ACTIVE" : "IDLE"}    ${this.state.dutyCode || "SU"}    ${this.state.officeId || "DACVS086JJ"}`
          ]
        };
      }
      if (cmd.startsWith("STD/")) {
        const init = cmd.slice(4).trim() || "ZHA";
        return {
          lines: [
            `STD/${init} — AGENT USER PROFILE DISPLAY`,
            `STAFF INITIALS : ${init}`,
            `PCC / AGENT ID : 89MD / DACVS086JJ`,
            "AGENT NAME     : MD HAFIZUR RAHMAN",
            "DUTY CODE      : SU (SUPERVISOR)",
            "IATA NUMBER    : 42341084",
            "AGENCY         : WINGS FLY TOURS AND TRAVELS",
            "STATUS         : ACTIVE & CERTIFIED"
          ]
        };
      }

      // ── MOVE DISPLAY (availability paging) ──
      if (cmd === "MD" || cmd === "MU" || cmd === "MT" || cmd === "MB") {
        if (!this.state.results.length) return this.error("NO AVAILABILITY DISPLAYED");
        const size = GalileoCommandEngine.PAGE_SIZE;
        const maxPage = Math.max(0, Math.ceil(this.state.results.length / size) - 1);
        if (cmd === "MD") {
          if (this.state.availPage >= maxPage) return this.error("BOTTOM OF DISPLAY");
          this.state.availPage++;
        } else if (cmd === "MU") {
          if (this.state.availPage <= 0) return this.error("TOP OF DISPLAY");
          this.state.availPage--;
        } else if (cmd === "MT") this.state.availPage = 0;
        else this.state.availPage = maxPage;
        return this._availScreen();
      }

      // ── RETURN AVAILABILITY: AR27JUN ──
      const arMatch = cmd.match(/^AR(\d{2}[A-Z]{3})$/);
      if (arMatch) {
        const returnDate = arMatch[1];
        let orig = "DXB";
        let dest = "DAC";
        if (this.state.results && this.state.results.length) {
          dest = this.state.results[0].origin;
          orig = this.state.results[0].destination;
        } else if (this.state.segments && this.state.segments.length) {
          dest = this.state.segments[0].origin;
          orig = this.state.segments[0].destination;
        }
        return this.process(`A${returnDate}${orig}${dest}`);
      }

      // ── CONVERT AVAILABILITY TO FARE: FDA ──
      if (cmd === "FDA") {
        if (!this.state.results.length && !this.state.segments.length) return this.error("NO ACTIVE AVAILABILITY - ENTER A22JUNDACDXB FIRST");
        return this.process("FQ");
      }

      // ── AVAILABILITY: A22JUNDACDXB / A22JUNDACDXB*EK / ADACSYD.SIN/SQ / A22JUNDACDXB#BS ──
      if (cmd.endsWith("/") && cmd.startsWith("A")) return this.process(cmd.slice(0, -1));
      const cleanAvailCmd = cmd.replace(/#+$/, "");
      const avail = cleanAvailCmd.match(/^A(\d{2}[A-Z]{3})?([A-Z]{3})([A-Z]{3})(?:\.([A-Z]{3}))?([\/*#][A-Z0-9]{2,3})?(\.D)?$/);
      if (avail) {
        const [, rawDate, orig, dest, via, pref] = avail;
        const dateStr = rawDate || "22JUN";
        const aOrig = GalileoAirports.find(orig);
        const aDest = GalileoAirports.find(dest);
        if (!aOrig) return this.error(`AIRPORT NOT FOUND - ${orig} - USE C CODE`);
        if (!aDest) return this.error(`AIRPORT NOT FOUND - ${dest} - USE C CODE`);
        if (orig === dest) return this.error("ORIGIN AND DESTINATION MUST DIFFER");

        const carrier = pref ? pref.slice(1) : null;
        if (pref && pref.startsWith("*") && carrier === "TG") {
          const day  = dayOfDate(dateStr);
          const pair = cityPair(orig, dest);
          const dom  = dateStr.slice(0, 2);
          return {
            lines: [
              `       ${day} ${dateStr}         ${pair}      ${dom}/0000 ${dom}/2359`,
              "NO CARRIER SPECIFIC CAPABILITY FOR THIS CARRIER"
            ],
            kind: "error"
          };
        }
        const results = GalileoFlights.search({ origin: orig, destination: dest, carrier: carrier, date: dateStr });
        this.state.results = results;
        this.state.availability = true;
        this.state.availPage = 0;
        this.state.lastAvailCmd = cmd;

        if (!results.length) return { lines: [`NO AVAILABILITY - ${dateStr} ${orig}${dest}`], kind: "error" };

        const day  = dayOfDate(dateStr);
        const pair = cityPair(orig, dest);
        const dom  = dateStr.slice(0, 2);
        this.state.availHeader = `${day} ${dateStr}        ${pair}        ${dom}/0000 ${dom}/2359${via ? " VIA " + via : ""}`;
        return this._availScreen();
      }

      // ── SELL: N3K2 = pax + class + line (Wings Fly course sheet) ──
      // N1K1* = sell all connections on line 1 in K class
      const sellAllConx = cmd.match(/^(?:N|0)(\d+)([A-Z])(\d+)\*$/);
      if (sellAllConx) {
        const paxCount = parseInt(sellAllConx[1]);
        const cls      = sellAllConx[2];
        const lineNum  = parseInt(sellAllConx[3]);
        if (!this.state.results.length) return this.error("NO AVAILABILITY DISPLAYED");
        // Sell all legs (connections) starting at lineNum
        const startFlight = this.state.results[lineNum - 1];
        if (!startFlight) return this.error(`LINE ${lineNum} NOT FOUND IN AVAILABILITY`);
        // Collect this flight and any connections from the same group
        const group = this.state.results.filter(f =>
          f.origin === startFlight.origin || f.destination === startFlight.destination ||
          (f.origin === startFlight.destination) // connecting leg
        );
        const conxFlights = group.slice(0, 2); // sell up to 2 connecting legs
        let lastResp = null;
        for (const fl of conxFlights) {
          const idx = this.state.results.indexOf(fl) + 1;
          const r = this._sellOne(idx, cls, paxCount);
          if (r.error) { lastResp = r.error; break; }
          lastResp = r.resp;
        }
        return lastResp || this._sellOne(lineNum, cls, paxCount).resp;
      }
      const sellMulti = cmd.match(/^(?:N|0)(\d+)([A-Z])(\d+)([A-Z])(\d+)$/);
      if (sellMulti) {
        const paxCount = parseInt(sellMulti[1]);
        const first = this._sellOne(parseInt(sellMulti[3]), sellMulti[2], paxCount);
        if (first.error) return first.error;
        const second = this._sellOne(parseInt(sellMulti[5]), sellMulti[4], paxCount);
        if (second.error) return second.error;
        return second.resp;
      }
      const sell = cmd.match(/^(?:N|0)(\d+)([A-Z])(\d+)$/);
      if (sell) {
        const paxCount = parseInt(sell[1]);
        const cls      = sell[2];
        const lineNum  = parseInt(sell[3]);
        const sold = this._sellOne(lineNum, cls, paxCount);
        if (sold.error) return sold.error;
        return sold.resp;
      }

      // ── AIRLINE DECODE / ENCODE: VC-EK, VC-176, VC-EMIRATES, VC EK ──
      const vcMatch = cmd.match(/^VC[- ]?([A-Z0-9]+)$/);
      if (vcMatch) {
        const query = vcMatch[1];
        const al = GalileoAirports.findAirline(query);
        if (al) {
          const hasAccountingCode = /^\d{3}$/.test(al.num) && al.num !== "000";
          return {
            lines: [
              `VC-${query} — AIRLINE DECODE`,
              `AIRLINE CODE    : ${al.code}`,
              `3-DIGIT NUMBER  : ${al.num}`,
              `AIRLINE NAME    : ${al.name}`,
              `COUNTRY         : ${al.country}`,
              `ACCOUNTING CODE : ${hasAccountingCode ? `${al.num} (BSP / ARC PARTICIPANT)` : "NOT LISTED"}`
            ]
          };
        }
        return this.error(`AIRLINE CODE OR NAME '${query}' NOT FOUND`);
      }

      // Galileo encode/decode: city, country, airline and aircraft equipment.
      const currencyCountries = window.GalileoCurrencyTableData || [];
      const countryAliases = { BANGLADESH: "BD", UAE: "AE", "UNITED ARAB EMIRATES": "AE", UK: "GB", "UNITED KINGDOM": "GB", USA: "US", "UNITED STATES": "US" };
      const countryCodeFor = name => countryAliases[name.toUpperCase()] || (currencyCountries.find(row => row.name === name.toUpperCase()) || {}).country || "";
      const cityDecode = cmd.match(/^\.CD\s+([A-Z]{3})$/);
      if (cityDecode) {
        const airport = GalileoAirports.decode(cityDecode[1]);
        if (!airport) return this.error("CITY/AIRPORT CODE NOT FOUND");
        return { lines: [`${airport.code.padEnd(8)} ${airport.city.toUpperCase().padEnd(28)} ${airport.country.toUpperCase()}`], kind: "decode" };
      }
      const cityEncode = cmd.match(/^\.CE\s+(.+)$/);
      if (cityEncode) {
        const query = cityEncode[1].trim();
        const airports = GalileoAirports.encode(query);
        if (!airports.length) return this.error("CITY/AIRPORT NAME NOT FOUND");
        return { lines: [`ENCODING CITIES /${query}`, ...airports.slice(0, 12).map(([code, airport]) => `${code.padEnd(8)} ${airport.city.toUpperCase().padEnd(28)} ${countryCodeFor(airport.country)}`)], kind: "encode" };
      }
      const countryDecode = cmd.match(/^\.LD\s+([A-Z]{2})$/);
      if (countryDecode) {
        const row = currencyCountries.find(country => country.country === countryDecode[1]);
        if (!row) return this.error("COUNTRY CODE NOT FOUND");
        return { lines: [`${row.country.padEnd(9)} ${row.name}`], kind: "decode" };
      }
      const countryEncode = cmd.match(/^\.LE\s+(.+)$/);
      if (countryEncode) {
        const query = countryEncode[1].trim();
        const rows = currencyCountries.filter(country => country.name.includes(query)).slice(0, 12);
        if (!rows.length) return this.error("COUNTRY NAME NOT FOUND");
        return { lines: [`ENCODE COUNTRIES/${query}`, ...rows.map(row => `${row.country.padEnd(9)} ${row.name}`)], kind: "encode" };
      }
      const airlineCountryCodes = { BANGLADESH: "BGD", INDIA: "IND", CANADA: "CAN", FRANCE: "FRA", MALAYSIA: "MYS", MOROCCO: "MAR", "UNITED KINGDOM": "GBR", BRUNEI: "BRN", "HONG KONG": "HKG", CHINA: "CHN", "UNITED ARAB EMIRATES": "UAE", THAILAND: "THA", BAHRAIN: "BHR", NEPAL: "NPL", NETHERLANDS: "NLD", KUWAIT: "KWT", GERMANY: "DEU", EGYPT: "EGY", OMAN: "OMN", QATAR: "QAT", SINGAPORE: "SGP", "SAUDI ARABIA": "SAU", TURKEY: "TUR", "SRI LANKA": "LKA", GLOBAL: "GLB" };
      const airlineLine = airline => `${airline.code.padEnd(3)} ${(airlineCountryCodes[airline.country] || airline.country).padEnd(4)} ${String(airline.num).padEnd(4)} ${airline.name.padEnd(34)} GS`;
      const airlineDecode = cmd.match(/^\.AD\s+([A-Z0-9*]+)$/);
      if (airlineDecode) {
        const airline = GalileoAirports.findAirline(airlineDecode[1].replace(/^\*/, ""));
        if (!airline) return this.error("AIRLINE CODE NOT FOUND");
        return { lines: [airlineLine(airline)], kind: "decode" };
      }
      const airlineEncode = cmd.match(/^\.AE\s+(.+)$/);
      if (airlineEncode) {
        const query = airlineEncode[1].trim();
        const airline = GalileoAirports.findAirline(query);
        if (!airline) return this.error("AIRLINE NAME NOT FOUND");
        return { lines: [`ENCODE AIRLINES /${query}`, airlineLine(airline)], kind: "encode" };
      }
      const equipmentCatalog = [["AI4", "T", "AIRBUS ATLAS"], ["221", "J", "AIRBUS A220-100 PASSENGER"], ["223", "J", "AIRBUS A220-300 PASSENGER"], ["ABM", "J", "AIRBUS A300CB MIXED CONFIGURATION"], ["313", "J", "AIRBUS A310 (SHARKLETS)"], ["32F", "J", "AIRBUS A320 FREIGHTER"], ["32B", "J", "AIRBUS A321 (SHARKLETS)"], ["33F", "J", "AIRBUS A330 FREIGHTER"], ["339", "J", "AIRBUS A330-900 NEO"], ["33B", "J", "AIRBUS BELUGA XL"], ["NDH", "H", "AIRBUS HELICOPTERS A365C/A365N DAUPHIN2"], ["MBH", "H", "AIRBUS HELICOPTERS BO 105"], ["320", "J", "AIRBUS INDUSTRIE A320-100/200"]];
      const equipmentDecode = cmd.match(/^\.ED\s+([A-Z0-9]{2,3})$/);
      if (equipmentDecode) {
        const equipment = equipmentCatalog.find(row => row[0] === equipmentDecode[1]);
        if (!equipment) return this.error("EQUIPMENT CODE NOT FOUND");
        return { lines: [`${equipment[0]} ${equipment[1]}  ${equipment[2]}`], kind: "decode" };
      }
      const equipmentEncode = cmd.match(/^\.EE\s+(.+)$/);
      if (equipmentEncode) {
        const query = equipmentEncode[1].trim();
        const matches = equipmentCatalog.filter(row => row[2].includes(query));
        if (!matches.length) return this.error("EQUIPMENT NAME NOT FOUND");
        return { lines: [`ENCODE AIRCRAFT /${query}`, ...matches.map(row => `${row[0]} ${row[1]}  ${row[2]}`)], kind: "encode" };
      }

      const gcMatch = cmd.match(/^GC[- *]?([A-Z]+)$/);
      if (gcMatch) {
        const query = gcMatch[1];
        const cty = GalileoAirports.findCountry(query);
        if (cty) {
          return {
            lines: [
              `GC-${query} — COUNTRY DECODE`,
              `COUNTRY CODE : ${cty.code}`,
              `COUNTRY NAME : ${cty.name}`,
              `CAPITAL CITY : ${cty.capital}`,
              `CURRENCY     : ${cty.currency}`,
              `IATA REGION  : ${cty.region}`
            ]
          };
        }
        return this.error(`COUNTRY CODE OR NAME '${query}' NOT FOUND`);
      }

      // ── CURRENCY CONVERSION: FZUSD125BDT or FZSUSD125PKR ──
      // FZ  = basic conversion  (FZ[from][amount][to])
      // FZS = BSP rate display  (FZS[from][amount][to]) — same calc, different label
      // Currency table: FBT*, FBT*BD (country), and FBT*USD (currency).
      const currencyTableRows = (window.GalileoCurrencyTableData || []).map(row => [
        row.name, row.country, row.currency, row.currencyName, row.decimals
      ]);
      const fbtMatch = cmd.match(/^FBT\*(?:(\w{2})|(\w{3}))?$/);
      if (fbtMatch) {
        const countryFilter = fbtMatch[1];
        const currencyFilter = fbtMatch[2];
        const rows = currencyTableRows.filter(row =>
          (!countryFilter || row[1] === countryFilter) &&
          (!currencyFilter || row[2] === currencyFilter))
          .sort((a, b) => a[0].localeCompare(b[0]));
        if (!rows.length) return this.error(`NO CURRENCY TABLE ENTRY FOUND FOR ${countryFilter || currencyFilter}`);
        const fmt = ([name, country, currency, currencyName, decimals]) =>
          `${name.padEnd(32)} ${country.padStart(3)} ${currency.padStart(5)} ${currencyName.padEnd(14)} ${decimals.padStart(3)}`;
        return {
          lines: [
            "COUNTRY                         CTRY  CURR  CURRENCY          DEC",
            "NAME                            CODE  CODE  NAME              PL",
            "-------------------------------- ---- ----- ---------------- ---",
            ...rows.map(fmt),
            ">"
          ],
          kind: "currency-table"
        };
      }

      // IATA currency rate displays: FZI/ALL and FZIHKD.
      // Reference data transcribed from the user's original Galileo screenshots.
      const currencyRateRows = [
        ["AED", "AE", "**", "UP", "10", "3.67331", "1NOV26", "30NOV26", "WORLDWIDE"],
        ["ARS", "AR", "**", "OF", "1.0", "1540.0", "1NOV26", "30NOV26", "DOMESTIC"],
        ["AUD", "AU", "**", "UP", "1.0", "1.436465", "1NOV26", "30NOV26", "AU -A1"],
        ["AUD", "AU", "**", "UP", "0.01", "1.436465", "1NOV26", "30NOV26", "DOMESTIC"],
        ["AUD", "AU", "**", "UP", "1.0", "1.436465", "1NOV26", "30NOV26", "WORLDWIDE"],
        ["AUD", "BN", "**", "UP", "1.0", "1.436465", "1NOV26", "30NOV26", "BN -Z320"],
        ["AUD", "CC", "**", "UP", "1.0", "1.436465", "1NOV26", "30NOV26", "WORLDWIDE"],
        ["AUD", "CX", "**", "UP", "1.0", "1.436465", "1NOV26", "30NOV26", "WORLDWIDE"],
        ["AUD", "HK", "**", "UP", "1.0", "1.436465", "1NOV26", "30NOV26", "HK -Z320"],
        ["HKD", "HK", "**", "UP", "10", "7.847747", "1NOV26", "30NOV26", "HK -A1"],
        ["HKD", "HK", "**", "UP", "10", "7.847747", "1NOV26", "30NOV26", "WORLDWIDE"]
      ];
      const fziMatch = cmd.match(/^FZI(?:\/?([A-Z]{3}))?$/);
      if (fziMatch) {
        const requestedCurrency = fziMatch[1] === "ALL" ? null : fziMatch[1];
        const rows = requestedCurrency
          ? currencyRateRows.filter(([currency]) => currency === requestedCurrency)
          : currencyRateRows;
        if (!rows.length) return this.error(`NO TRAINING IATA RATE FOUND FOR ${requestedCurrency}`);
        const formatRateRow = ([currency, country, cx, rule, unit, rate, effective, discontinue, region]) =>
          `${currency.padEnd(4)} ${country.padEnd(4)} ${cx.padEnd(3)} ${rule.padEnd(5)} ${unit.padStart(5)} ${rate.padStart(10)} ${effective.padStart(12)} ${discontinue.padStart(10)} ${region.padStart(12)}`;
        return {
          lines: [
            `>${cmd}`,
            "RATES LAST UPDATED 14NOV26  1:37AM",
            "                 ROUNDING  RATE OF       EFF     DISC    REGION",
            "CUR  CTRY CX RULE   UNIT  EXCHANGE      DATE    DATE      EQU",
            ...rows.map(formatRateRow),
            ...(requestedCurrency ? ["FND"] : []),
            ">"
          ],
          kind: "currency-rates"
        };
      }

      const fzsMatch = cmd.match(/^FZS([A-Z]{3})(\d+(?:\.\d+)?)([A-Z]{3})$/);
      const fzMatch  = !fzsMatch && cmd.match(/^FZ([A-Z]{3})(\d+(?:\.\d+)?)([A-Z]{3})$/);
      if (fzsMatch || fzMatch) {
        const m      = fzsMatch || fzMatch;
        const isBSP  = !!fzsMatch;
        const from   = m[1];
        const amount = Number(m[2]);
        const to     = m[3];
        const rate   = isBSP && from === "USD" && to === "BDT" ? 123.75 : trainingFxRate(from, to);
        if (!rate) return this.error(
          `TRAINING FX RATE NOT STORED FOR ${from}/${to} - TRY FZUSD125BDT OR FZSUSD125PKR`);
        const converted = Math.round(amount * rate * 100) / 100;
        const dispRate  = rate < 1 ? rate.toFixed(6) : rate.toFixed(2);
        if (isBSP) {
          return {
            lines: [
              `>${cmd}`,
              "RATES LAST UPDATED 27NOV 16:00 PM",
              `EQU ${to}${Math.round(converted)}`,
              `BANK SELLING RATE  1${from} EQUALS  ${dispRate}     ${to}`,
              ">"
            ],
            kind: "fx-convert",
            amount: Math.round(converted)
          };
        }
        return {
          lines: [
            isBSP ? "FZS - CURRENCY CONVERSION (BSP RATE)" : "FZ - CURRENCY CONVERSION",
            isBSP ? "BSP SELLING RATE — TRAINING TABLE" : "RATES LAST UPDATED (TRAINING TABLE)",
            `BANK SELLING RATE  1 ${from} EQUALS ${dispRate} ${to}`,
            `${from} ${amount.toFixed(2)}  =  ${to} ${Math.round(converted)}`,
            "ENTER THE CONVERTED AMOUNT AS CANCELLATION CHARGE ON TRN1",
            `EXAMPLE: TRN1/X${Math.round(converted)}`
          ],
          kind: "fx-convert",
          amount: Math.round(converted)
        };
      }

      // ── DECODE / ENCODE AIRPORT: C DAC, C-DAC, C-DHAKA ──
      const cMatch = cmd.match(/^C[- ](.+)$/);
      if (cMatch) {
        const code = cMatch[1].trim();
        const ap = GalileoAirports.decode(code);
        if (ap) return { lines: [`${ap.code}  ${ap.city}`, ap.country, ap.name] };
        // Try encode (city name search)
        const enc = GalileoAirports.encode(code);
        if (enc.length) return { lines: enc.map(([c,a]) => `${c}  ${a.city}, ${a.country}  ${a.name}`).slice(0,8) };
        return this.error("CODE NOT FOUND");
      }

      // ── NAME CHANGE POLICY: ON* ──
      if (cmd === "ON*") {
        return {
          lines: [
            "ON* — GALILEO NAME CHANGE POLICY & PROCEDURES:",
            "-----------------------------------------------------------------",
            "1. BEFORE TICKETING: NAME CORRECTION UP TO 3 CHARACTERS ALLOWED (N.P1@...)",
            "2. AFTER TICKETING : FULL NAME CHANGES STRICTLY PROHIBITED PER IATA RES 830A",
            "3. SPELLING CORRECTIONS REQUIRE CARRIER WAIVER AUTHORIZATION",
            "4. INFANT (INF) NAME MUST MATCH ACCOMPANYING ADULT SURNAME",
            "-----------------------------------------------------------------"
          ]
        };
      }

      // ── NAME DELETE: N.P2-3@ or N.P2@ ──
      const delNameMatch = cmd.match(/^N\.P(\d+)(?:-(\d+))?@$/);
      if (delNameMatch) {
        if (!this.state.names.length) return this.error("NO NAMES IN PNR TO DELETE");
        const start = parseInt(delNameMatch[1], 10);
        const end = delNameMatch[2] ? parseInt(delNameMatch[2], 10) : start;
        this.state.names = this.state.names.filter((_, idx) => {
          const paxNum = idx + 1;
          return paxNum < start || paxNum > end;
        });
        this.state.passengerTypes = this.state.passengerTypes.filter((_, idx) => {
          const paxNum = idx + 1;
          return paxNum < start || paxNum > end;
        });
        this.state.names = this.state.names.map((n, idx) => `${idx + 1}-${n.replace(/^\d+-/, "")}`);
        return {
          lines: [
            `NAME ${end > start ? start + "-" + end : start} DELETED`,
            "ENTER R.H THEN ER TO SAVE CHANGES"
          ],
          kind: "name"
        };
      }

      // ── NAME MODIFY: N.P3@HAFIZUR MR ──
      const modNameMatch = cmd.match(/^N\.P(\d+)@([A-Z .'-]+(?:\s+(?:MR|MRS|MS|MISS|MSTR))?)$/i);
      if (modNameMatch) {
        const paxIdx = parseInt(modNameMatch[1], 10) - 1;
        if (paxIdx < 0 || paxIdx >= this.state.names.length) return this.error(`PASSENGER ${modNameMatch[1]} NOT FOUND`);
        const oldName = this.state.names[paxIdx];
        const surname = oldName.replace(/^\d+-/, "").split("/")[0];
        const newGiven = modNameMatch[2].trim().toUpperCase();
        const updated = `${paxIdx + 1}-${surname}/${newGiven}`;
        this.state.names[paxIdx] = updated;
        this.state.dirty = true;
        return {
          lines: [
            `PASSENGER ${paxIdx + 1} NAME MODIFIED`,
            `OLD NAME : ${oldName}`,
            `NEW NAME : ${updated}`,
            "ENTER R.H THEN ER TO SAVE CHANGES"
          ],
          kind: "name"
        };
      }

      // ── COMPOUND NAMES: N.1ISLAM/MD ROBIUL MR+N.1RAHMAN/MD HAFIZUR MR ──
      if (cmd.startsWith("N.") && raw.includes("+")) {
        const parts = raw.split("+").map(p => p.trim());
        let added = [];
        for (const part of parts) {
          const cleanPart = part.replace(/^N\./i, "").replace(/^\d+/i, "");
          const subMatch = cleanPart.match(/^([A-Z][A-Z .'-]*(?:\/[A-Z][A-Z .'-]*)+)\s+(MR|MRS|MS|MISS|MSTR)(?:\*(P-C\d{1,2}|\d{2}[A-Z]{3}\d{2}))?$/i);
          if (subMatch) {
            const qualifier = (subMatch[3] || "").toUpperCase();
            const type = resolvePassengerType(cleanPart, qualifier);
            const cleanNew = cleanPart.toUpperCase().replace(/\*.*$/, "").trim();
            const isDuplicate = this.state.names.some(existing => {
              const cleanExisting = existing.replace(/^\d+-/, "").replace(/\*.*$/, "").trim().toUpperCase();
              return cleanExisting === cleanNew;
            });
            if (isDuplicate) {
              return this.error("DUPLICATE NAME - " + cleanNew);
            }
            const nameFormatted = (this.state.names.length + 1) + "-" + cleanPart.toUpperCase();
            this.state.names.push(nameFormatted);
            this.state.passengerTypes.push({ type, qualifier });
            this.state.dirty = true;
            added.push(nameFormatted);
          }
        }
        if (added.length) {
          const seatPax = this.state.passengerTypes.filter(p => p.type !== "INF").length;
          const infants = this.state.passengerTypes.filter(p => p.type === "INF").length;
          this.state.segments.forEach(seg => {
            if (seatPax >= seg.paxCount) {
              seg.heldSeats = seg.paxCount;
            } else if (infants > 0 && (seatPax + infants) <= seg.paxCount) {
              seg.heldSeats = Math.max(1, seg.paxCount - infants);
            } else if (seatPax > 0) {
              seg.heldSeats = Math.max(1, Math.min(seg.paxCount, seatPax));
            } else {
              seg.heldSeats = seg.paxCount;
            }
          });
          const rawFormatted = raw.trim().toUpperCase();
          const displayEcho = ">" + rawFormatted + (rawFormatted.endsWith("*") ? "" : " *");
          return { lines: [displayEcho], kind: "name" };
        }
      }

      // ── COMMON FAMILY SURNAME: N.3RAHMAN/MD HAFIZUR MR/MD HABIBUR MR/MD HASANUR MR ──
      const commonFamilyMatch = raw.trim().match(/^N\.(\d+)([A-Z]+)\/((?:[A-Z .'-]+\s+(?:MR|MRS|MS|MISS|MSTR)\/?)+)$/i);
      if (commonFamilyMatch) {
        const surname = commonFamilyMatch[2].toUpperCase();
        const givenParts = commonFamilyMatch[3].split("/").map(s => s.trim()).filter(Boolean);
        let added = [];
        for (const given of givenParts) {
          const fullName = `${surname}/${given.toUpperCase()}`;
          const isDuplicate = this.state.names.some(existing => {
            const cleanExisting = existing.replace(/^\d+-/, "").replace(/\*.*$/, "").trim().toUpperCase();
            return cleanExisting === fullName;
          });
          if (isDuplicate) {
            return this.error("DUPLICATE NAME - " + fullName);
          }
          const formatted = (this.state.names.length + 1) + "-" + fullName;
          this.state.names.push(formatted);
          this.state.passengerTypes.push({ type: "ADT", qualifier: "" });
          this.state.dirty = true;
          added.push(formatted);
        }
        const rawFormatted = raw.trim().toUpperCase();
        const displayEcho = ">" + rawFormatted + (rawFormatted.endsWith("*") ? "" : " *");
        return { lines: [displayEcho], kind: "name" };
      }

      // ─────────────────────────────────────────────────────────────
      // NAME ENTRY — handles all Galileo/Smartpoint formats:
      //   N.RAHMAN/MD HAFIZUR MR          ← adult
      //   N.JONY/MD MSTR*P-C10            ← child
      //   N.I/RAHMAN/MD HASANUR MSTR*02OCT2022      ← infant (2-digit yr)
      //   N.I/RAHMAN/MD HASANUR MSTR*02OCT2022 *    ← infant (trailing *)
      //   N.I/1RAHMAN/MD HASANUR MSTR*02OCT2025     ← infant (adult ref + 4-digit yr)
      // ─────────────────────────────────────────────────────────────
      const isNameCmd = cmd.startsWith("N.") || cmd.startsWith("N/");
      if (isNameCmd) {
        // Strip "N." or "N/" prefix, then strip ALL trailing spaces and * characters
        let s = raw.trim().slice(2).trim().replace(/[\s*]+$/, "").trim();

        const TITLES = ["MR", "MRS", "MS", "MISS", "MSTR", "INF"];

        // ── Detect infant: starts with I/ (case-insensitive) ──
        let isInfant = false;
        let adultRef = "1";
        const infantTest = s.toUpperCase();
        if (infantTest.startsWith("I/")) {
          isInfant = true;
          s = s.slice(2).trim();                      // strip I/
          const refMatch = s.match(/^(\d+)/);         // optional adult pax ref e.g. "1"
          if (refMatch) {
            adultRef = refMatch[1];
            s = s.slice(refMatch[0].length).trim();
          }
        }

        // ── Extract DOB / qualifier after the LAST * ──
        // (strip any leading digit-count like "1RAHMAN" → "RAHMAN")
        s = s.replace(/^\d+/, "").trim();

        let qualifier = "";
        const starPos = s.indexOf("*");
        if (starPos !== -1) {
          qualifier = s.slice(starPos + 1).trim().replace(/[\s*]+$/, "").trim();
          s = s.slice(0, starPos).trim();
        }

        // ── Split into SURNAME / GIVEN TITLE ──
        const slashIdx = s.indexOf("/");
        if (slashIdx === -1) {
          // No slash — cannot parse
          return this.error("CHECK FORMAT - USE: N.RAHMAN/MD MR  |  N.JONY/MD MSTR*P-C10  |  N.I/RAHMAN/MD HASANUR MSTR*02OCT2022");
        }
        const surname = s.slice(0, slashIdx).trim().toUpperCase();
        let rest     = s.slice(slashIdx + 1).trim().toUpperCase();

        if (!surname) {
          return this.error("CHECK FORMAT - SURNAME MISSING");
        }

        // ── Extract title from end of given name ──
        let title = "";
        const tokens = rest.split(/\s+/).filter(Boolean);
        if (tokens.length >= 1 && TITLES.includes(tokens[tokens.length - 1])) {
          title = tokens.pop();
          rest  = tokens.join(" ");
        }

        // ── CHD shortcut inside given: e.g. MD CHD(08) ──
        const chdMatch = rest.match(/\bCHD\s*(?:\((\d{1,2})\)|(\d{1,2}))?/i);
        if (chdMatch && !qualifier) {
          const age = chdMatch[1] || chdMatch[2] || "08";
          qualifier = "P-C" + age.padStart(2, "0");
          rest = rest.replace(chdMatch[0], "").trim();
        }

        // ── Build formatted name ──
        let type = "ADT";
        let formatted = "";

        if (isInfant) {
          if (!title) title = "MSTR";
          const givenName = rest.trim() || "";
          formatted = "I/" + adultRef + surname + "/" + givenName + (givenName ? " " : "") + title;
          if (qualifier) formatted += "*" + qualifier;
          formatted = formatted.replace(/\s{2,}/g, " ").trim();
          type = "INF";
          this.state.ssr.push({
            passenger: adultRef || "1",
            code: "INFT",
            detail: `${surname}/${givenName ? givenName + " " : ""}${title} ${qualifier || ""}`.trim(),
            raw: `INFT ${surname}/${givenName ? givenName + " " : ""}${title} ${qualifier || ""}`.trim(),
            toString: function() { return `P${this.passenger} INFT ${this.detail}`; }
          });

        } else if (qualifier && /^P-C\d+/i.test(qualifier)) {
          if (!title) title = "MSTR";
          formatted = (surname + "/" + (rest ? rest + " " : "") + title).trim() + "*" + qualifier;
          type = "CHD";

        } else {
          if (!title) title = "MR";
          formatted = (surname + "/" + (rest ? rest + " " : "") + title).trim();
          if (qualifier) formatted += "*" + qualifier;
          type = resolvePassengerType(formatted, qualifier);
        }

        // ── Duplicate Name Validation ──
        const cleanNew = formatted.replace(/\*.*$/, "").trim().toUpperCase();
        const isDuplicate = this.state.names.some(existing => {
          const cleanExisting = existing.replace(/^\d+-/, "").replace(/\*.*$/, "").trim().toUpperCase();
          return cleanExisting === cleanNew;
        });
        if (isDuplicate) {
          return this.error("DUPLICATE NAME");
        }

        const nameEntry = (this.state.names.length + 1) + "-" + formatted;
        this.state.names.push(nameEntry);
        this.state.passengerTypes.push({ type, qualifier });
        this.state.dirty = true;

        const seatPax = this.state.passengerTypes.filter(p => p.type !== "INF").length;
        const infants = this.state.passengerTypes.filter(p => p.type === "INF").length;
        this.state.segments.forEach(seg => {
          if (seatPax >= seg.paxCount) {
            seg.heldSeats = seg.paxCount;
          } else if (infants > 0 && (seatPax + infants) <= seg.paxCount) {
            seg.heldSeats = Math.max(1, seg.paxCount - infants);
          } else if (seatPax > 0) {
            seg.heldSeats = Math.max(1, Math.min(seg.paxCount, seatPax));
          } else {
            seg.heldSeats = seg.paxCount;
          }
        });

        const rawFormatted = raw.trim().toUpperCase();
        const displayEcho = ">" + rawFormatted + (rawFormatted.endsWith("*") ? "" : " *");
        return { lines: [displayEcho], kind: "name" };
      }

      // ── PHONE FIELD: P.T*... / P.DAC*... / P.DXBM*... / P.DXBH*... / P.DXBE*... ──
      if (cmd.startsWith("P.")) {
        const rawTrim = raw.trim();
        // Check if user entered tag only without details: e.g. P.DXBM, P.DXBH, P.DXBE*, P.T*, P.DAC*
        const tagOnlyMatch = rawTrim.match(/^P\.([A-Z0-9]{1,6})\*?$/i);
        if (tagOnlyMatch) {
          const tag = tagOnlyMatch[1].toUpperCase();
          if (tag === "T") return this.error("CHECK FORMAT - ENTER TEXT AFTER P.T*");
          return this.error("CHECK FORMAT - ENTER PHONE NUMBER AFTER P." + tag + "*");
        }

        let tag = "T";
        let phoneText = "";
        const starMatch = rawTrim.match(/^P\.([A-Z0-9]{1,6})\*(.*)$/i);
        const spaceMatch = rawTrim.match(/^P\.([A-Z0-9]{1,6})\s+(.*)$/i);
        const directMatch = rawTrim.match(/^P\.(.+)$/i);

        if (starMatch) {
          tag = starMatch[1].toUpperCase();
          phoneText = starMatch[2].replace(/\*+$/, "").trim();
        } else if (spaceMatch) {
          tag = spaceMatch[1].toUpperCase();
          phoneText = spaceMatch[2].replace(/\*+$/, "").trim();
        } else if (directMatch) {
          phoneText = directMatch[1].replace(/\*+$/, "").trim();
        }

        if (!phoneText) {
          return this.error("CHECK FORMAT - ENTER PHONE NUMBER AFTER P." + tag + "*");
        }

        // Store with prefix tag (e.g. "T*...", "DXBM*0501234567", "DAC*01757395244")
        const storedEntry = tag + "*" + phoneText.toUpperCase();
        this.state.phones.push(storedEntry);
        this.state.dirty = true;
        return { lines: ["P." + tag + "*" + phoneText.toUpperCase()] };
      }

      // â”€â”€ PHONE: 9/MOBILE-BD/88017XXXXXXX â”€â”€
      if (cmd.startsWith("9/")) {
        const phone = cmd.slice(2);
        if (!phone) return this.error("CHECK FORMAT");
        this.state.phones.push(phone);
        this.state.dirty = true;
        return { lines: [`PHONE-${phone}`] };
      }

      // ── TICKETING AGREEMENT: T.T* or T.TAU/25OCT or T* ──
      if (cmd === "T.T*" || cmd.startsWith("T.T*") || cmd === "T*" || cmd.startsWith("T*")) {
        this.state.ticketing = "T.T*";
        this.state.dirty = true;
        return { lines: ["T.T*"] };
      }
      const tauMatch = cmd.match(/^T\.TAU\/(\d{2}[A-Z]{3})$/);
      if (tauMatch) {
        this.state.ticketing = `T.TAU/${tauMatch[1]}`;
        this.state.dirty = true;
        return { lines: [`T.TAU/${tauMatch[1]}`] };
      }
      if (cmd === "T.T" || cmd.startsWith("T-")) {
        return this.error("CHECK FORMAT");
      }

      // ── RETENTION SEGMENT / KEEP PNR LIVE: RT.T/31DEC*KEEP THE PNR LIVE ──
      const rtMatch = cmd.match(/^RT\.T\/(\d{2}[A-Z]{3})(?:\*(.*))?$/);
      if (rtMatch) {
        if (!this.state.locator && !this.state.segments.length) return this.error("NO ACTIVE PNR - CREATE OR RETRIEVE FIRST");
        const rDate = rtMatch[1];
        const rText = rtMatch[2] ? rtMatch[2].trim() : "KEEP THE PNR LIVE";
        this.state.retention = { date: rDate, text: rText };
        return {
          lines: [
            `TUR ${rDate} ${rText}`,
            "RETENTION SEGMENT ADDED — PNR ACTIVE STATUS EXTENDED",
            "ENTER R.H THEN ER TO SAVE CHANGES"
          ],
          kind: "retention"
        };
      }

      // ── SHARE PNR TO BRANCH PCC: QEB/89MD or QEB/89MD/50 ──
      const qebMatch = cmd.match(/^QEB\/([A-Z0-9]{3,6})(?:\/(\d+))?$/);
      if (qebMatch) {
        if (!this.state.locator) return this.error("NO ACTIVE PNR - RETRIEVE FIRST");
        if (!this.queueStore) this._initStores();
        const targetPcc = qebMatch[1];
        const targetQ = qebMatch[2] || "50";
        if (!this.queueStore[targetQ]) this.queueStore[targetQ] = [];
        if (!this.queueStore[targetQ].includes(this.state.locator)) {
          this.queueStore[targetQ].push(this.state.locator);
          this._saveQueueStore();
        }
        return {
          lines: [
            `QEB/${targetPcc}${qebMatch[2] ? "/" + targetQ : ""} — BOOKING FILE QUEUED`,
            `PNR LOCATOR     : ${this.state.locator}`,
            `TARGET PCC      : ${targetPcc}`,
            `TARGET QUEUE    : ${targetQ} (TICKETING / BRANCH SHARE)`,
            `QUEUE ${targetQ.padStart(2, "0")} TOTAL  : ${this.queueStore[targetQ].length} PNRS`,
            "QUEUE STATUS    : PLACED ON QUEUE SUCCESSFULLY",
            "ENTER Q/" + targetQ + " TO WORK THIS QUEUE"
          ],
          kind: "queue"
        };
      }

      // ── FREQUENT FLYER / MILEAGE: M.EK1234567, M.P1/EK1234567, M.P1/EK1234567/QR, M.@, M.P2@ ──
      const mileageDelete = cmd.match(/^M\.(?:P)?(\d+)@$/);
      if (mileageDelete) {
        const pNum = mileageDelete[1];
        let index = this.state.mileage.findIndex(m => String(m.paxNum) === String(pNum));
        if (index < 0) {
          const idx = Number(pNum) - 1;
          if (idx >= 0 && idx < this.state.mileage.length) index = idx;
        }
        if (index < 0) return this.error(`FREQUENT FLYER ENTRY FOR PASSENGER ${pNum} NOT FOUND`);
        const [removed] = this.state.mileage.splice(index, 1);
        this.state.ssr = this.state.ssr.filter(item =>
          typeof item === "string"
            ? !item.includes(`-1.${removed.paxNum}`)
            : item.code !== "FQTV"
        );
        return {
          lines: [`M.P${pNum}@ — FREQUENT FLYER ENTRY DELETED FOR PASSENGER ${pNum}`],
          kind: "mileage"
        };
      }
      if (cmd === "M.@" || cmd === "M@") {
        this.state.mileage = [];
        this.state.ssr = this.state.ssr.filter(item =>
          typeof item === "string" ? !item.startsWith("FQTV ") : item.code !== "FQTV"
        );
        return {
          lines: ["FREQUENT FLYER MEMBERSHIP DATA DELETED"],
          kind: "mileage"
        };
      }
      const mMatch = cmd.match(/^M\.(?:P(\d+)\/)?([A-Z0-9]{2})([A-Z0-9]+)(?:\/([A-Z0-9]{2}))?$/);
      if (mMatch) {
        const pNum = mMatch[1] || "1";
        const carrier = mMatch[2];
        const num = mMatch[3];
        const targetCarrier = mMatch[4] || carrier;
        const paxName = (this.state.names[parseInt(pNum, 10) - 1] || "RAHMAN/MD MR").replace(/^\d+-/, "");
        const entry = { paxNum: pNum, carrier, num, targetCarrier, paxName };
        this.state.mileage.push(entry);
        this.state.ssr.push(`FQTV ${targetCarrier} HK/${carrier}${num}-1.${pNum} ${paxName}`);
        const lines = [
          `M.${carrier}${num}${mMatch[4] ? "/" + targetCarrier : ""} — FREQUENT FLYER ADDED`,
          `PASSENGER : 1.${pNum} ${paxName}`,
          `AIRLINE   : ${carrier}`,
          `ACCOUNT   : ${num}`
        ];
        if (mMatch[4]) {
          lines.push(`PARTNER   : ${targetCarrier} (CROSS-ACCRUAL)`);
        }
        lines.push(`SSR FILED : SSR FQTV ${targetCarrier} HK1 / ${carrier}${num}`);
        return {
          lines,
          kind: "mileage"
        };
      }

      // ── DIVIDE / SPLIT PASSENGER: DP1, DP1-3.6, F ──
      const dpMatch = cmd.match(/^DP([0-9.,-]+)$/);
      if (dpMatch) {
        if (!this.state.locator) return this.error("NO ACTIVE PNR - RETRIEVE FIRST");
        if (this.state.names.length < 2) return this.error("MINIMUM 2 PASSENGERS REQUIRED TO DIVIDE");
        const paxArg = dpMatch[1];
        let paxIndices = [];
        paxArg.split(/[.,]/).forEach(part => {
          if (part.includes("-")) {
            const [s, e] = part.split("-").map(n => parseInt(n, 10));
            for (let i = s; i <= e; i++) paxIndices.push(i);
          } else if (part) {
            paxIndices.push(parseInt(part, 10));
          }
        });
        paxIndices = [...new Set(paxIndices)].filter(idx => idx >= 1 && idx <= this.state.names.length);
        if (!paxIndices.length) return this.error("NO VALID PASSENGER SPECIFIED TO DIVIDE");
        if (paxIndices.length >= this.state.names.length) return this.error("CANNOT DIVIDE ALL PASSENGERS FROM PNR");

        const dividedNames = paxIndices.map(i => this.state.names[i - 1]);
        this.state.pendingDivide = { paxIndices, dividedNames };
        return {
          lines: [
            `DP${paxArg} — DIVIDE IN PROGRESS`,
            "-----------------------------------------------------------------",
            "PASSENGERS TO BE DIVIDED:",
            ...dividedNames.map(n => `  ${n}`),
            "-----------------------------------------------------------------",
            "ENTER R.[NAME] (E.G. R.H) THEN F TO COMPLETE FILE DIVIDE"
          ],
          kind: "divide"
        };
      }
      if (cmd === "F") {
        if (!this.state.pendingDivide) return this.error("NO DIVIDE TRANSACTION IN PROGRESS - USE DP1 FIRST");
        const pd = this.state.pendingDivide;
        const childLoc = genLocator();
        this.state.names = this.state.names.filter((_, idx) => !pd.paxIndices.includes(idx + 1));
        this.state.passengerTypes = this.state.passengerTypes.filter((_, idx) => !pd.paxIndices.includes(idx + 1));
        this.state.names = this.state.names.map((n, idx) => `${idx + 1}-${n.replace(/^\d+-/, "")}`);
        this.state.dividedPnr = childLoc;
        this.state.pendingDivide = null;
        return {
          lines: [
            "F — FILE DIVIDE COMPLETE",
            "-----------------------------------------------------------------",
            `PARENT PNR : ${this.state.locator} (REMAINING PAX: ${this.state.names.length})`,
            `CHILD PNR  : ${childLoc} (DIVIDED RECORD)`,
            "DIVIDED BOOKING FILE CREATED IN SYSTEM",
            "ENTER R.H THEN ER TO SAVE BOTH PNRS"
          ],
          kind: "divide"
        };
      }

      // ── LIST BY DATE: LD/ALL/<date>-D, LD/ALL/D, LD/ALL, etc. ──
      if (cmd.startsWith("LD/") || cmd === "LD") {
        // Collect ONLY user-created bookings, NEVER preseeded test templates
        const allStored = Object.values(this.pnrStore || {});
        const activeList = [];
        if (this.state && this.state.saved && this.state.locator) activeList.push(this.state);
        if (this.lastSavedPnr && this.lastSavedPnr.locator) activeList.push(this.lastSavedPnr);
        const pnrList = [...allStored, ...activeList].filter(p => p && p.locator && !["BG7REF", "TK7REI", "BG2PAR"].includes(p.locator));
        const unique = [];
        const seen = new Set();
        pnrList.forEach(p => {
          if (!seen.has(p.locator)) {
            seen.add(p.locator);
            unique.push(p);
          }
        });

        const todayObj = new Date();
        const mNames = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
        const todayDate = String(todayObj.getDate()).padStart(2, "0") + mNames[todayObj.getMonth()];

        // Check date or date range in command: e.g. 28OCT*04NOV, 28OCT-04NOV, 05NOV
        const rangeMatch = cmd.match(/(\d{2}[A-Z]{3})[*\-](\d{2}[A-Z]{3})/i);
        const singleDateMatch = cmd.match(/(\d{2}[A-Z]{3})/i);
        const isAllRequested = cmd.includes("/ALL/ALL") || cmd.includes("/HIST");

        let filtered = unique;
        let dateLabel = todayDate;

        if (rangeMatch) {
          const dFrom = rangeMatch[1].toUpperCase();
          const dTo   = rangeMatch[2].toUpperCase();
          dateLabel = `${dFrom}-${dTo}`;
          filtered = unique.filter(p => {
            const cd = (p.createDate || todayDate).toUpperCase();
            const sd = (p.segments && p.segments[0] && p.segments[0].date || "").toUpperCase();
            return cd === dFrom || cd === dTo || sd === dFrom || sd === dTo;
          });
        } else if (singleDateMatch) {
          const dSingle = singleDateMatch[1].toUpperCase();
          dateLabel = dSingle;
          filtered = unique.filter(p => {
            const cd = (p.createDate || todayDate).toUpperCase();
            const sd = (p.segments && p.segments[0] && p.segments[0].date || "").toUpperCase();
            return cd === dSingle || sd === dSingle;
          });
        } else if (!isAllRequested) {
          // Default: show today's bookings (e.g. LD/ALL/D or LD/ALL)
          dateLabel = todayDate;
          filtered = unique.filter(p => {
            const cd = (p.createDate || todayDate).toUpperCase();
            return cd === todayDate;
          });
        }

        const lines = [
          `LIST BY DATE — OFFICE: ${this.state.officeId || "DACVS086JJ"} (${dateLabel})`,
          "-----------------------------------------------------------------"
        ];

        if (!filtered.length) {
          lines.push(`NO BOOKING FILES FOUND FOR ${dateLabel}`);
          lines.push("-----------------------------------------------------------------");
          if (unique.length > 0) {
            lines.push(`(TOTAL ${unique.length} BOOKINGS EXIST IN OTHER DATES — USE LD/ALL/HIST TO VIEW ALL)`);
          } else {
            lines.push("CREATE AND SAVE A BOOKING (ER) TO APPEAR IN LIST");
          }
          return { lines, kind: "list-by-date" };
        }

        lines.push("NO. LOCATOR  PASSENGER NAME              DATE    FLIGHT  STATUS");
        filtered.forEach((p, idx) => {
          const num = String(idx + 1).padStart(2, " ");
          const loc = String(p.locator).padEnd(8, " ");
          const name = String((p.names && p.names[0] ? p.names[0].replace(/^[\d\.\-]+/, "").replace(/\*.*$/, "").trim() : "PASSENGER")).padEnd(27, " ").slice(0, 27);
          const seg = p.segments && p.segments[0];
          const date = seg ? String(seg.date || "").padEnd(8, " ") : "        ";
          const flt = seg ? `${seg.carrier} ${seg.number || ""}`.padEnd(8, " ") : "        ";
          const stat = p.issued ? "ISSUED" : "CONFIRMED";
          lines.push(`${num}  ${loc} ${name} ${date}${flt}${stat}`);
        });
        lines.push("-----------------------------------------------------------------");
        lines.push("ENTER *<LOCATOR> (E.G. *" + filtered[0].locator + ") TO RETRIEVE BOOKING");
        return { lines, kind: "list-by-date" };
      }

      // ── QUEUE MANAGEMENT: *Q, Q*, QC/, Q/1, QEP/10, QEB/10, QN, QR, QXI ──
      if (cmd === "*Q" || cmd === "Q*" || cmd === "QC/" || cmd === "QC" || cmd === "Q/COUNT") {
        if (!this.queueStore) this._initStores();
        const q1 = (this.queueStore["1"] || []).length;
        const q10 = (this.queueStore["10"] || []).length;
        const q20 = (this.queueStore["20"] || []).length;
        const q50 = (this.queueStore["50"] || []).length;
        const total = q1 + q10 + q20 + q50;
        return {
          lines: [
            `QUEUE SUMMARY FOR OFFICE: ${this.state.officeId || "DACVS086JJ"}`,
            "-----------------------------------------------------------------",
            `Q 01 GENERAL MESSAGES      : ${q1} PNRS`,
            `Q 10 SCHEDULE CHANGES      : ${q10} PNRS`,
            `Q 20 TICKETING PENDING     : ${q20} PNRS`,
            `Q 50 BRANCH SHARE          : ${q50} PNRS`,
            `TOTAL PNRS ON QUEUE        : ${total} PNRS`,
            "-----------------------------------------------------------------",
            "ENTER Q/1 TO ENTER QUEUE 01 (OR Q/10, Q/20, Q/50)",
            "ENTER QEP/10 TO PLACE CURRENT PNR ON QUEUE 10"
          ],
          kind: "queue"
        };
      }

      // QEP/10 or QEP/1: Place active PNR on local queue
      const qepMatch = cmd.match(/^QEP\/(\d+)$/);
      if (qepMatch) {
        if (!this.state.locator) return this.error("NO ACTIVE PNR - RETRIEVE FIRST");
        if (!this.queueStore) this._initStores();
        const qNum = String(parseInt(qepMatch[1], 10));
        if (!this.queueStore[qNum]) this.queueStore[qNum] = [];
        if (!this.queueStore[qNum].includes(this.state.locator)) {
          this.queueStore[qNum].push(this.state.locator);
          this._saveQueueStore();
        }
        return {
          lines: [
            `QEP/${qNum} — BOOKING FILE PLACED ON QUEUE ${qNum.padStart(2, "0")}`,
            `PNR LOCATOR     : ${this.state.locator}`,
            `QUEUE ${qNum.padStart(2, "0")} TOTAL  : ${this.queueStore[qNum].length} PNRS`,
            "QUEUE STATUS    : PLACED ON QUEUE SUCCESSFULLY",
            "ENTER Q/" + qNum + " TO WORK THIS QUEUE"
          ],
          kind: "queue"
        };
      }

      const qEnterMatch = cmd.match(/^Q\/(\d+)$/);
      if (qEnterMatch) {
        if (!this.queueStore) this._initStores();
        const qNum = String(parseInt(qEnterMatch[1], 10));
        const list = this.queueStore[qNum] || [];
        if (!list.length) {
          return {
            lines: [
              `QUEUE ${qNum.padStart(2, "0")} - NO ITEMS ON QUEUE`,
              "USE QEP/" + qNum + " TO PLACE ACTIVE PNR ON THIS QUEUE"
            ],
            kind: "queue"
          };
        }
        this.state.queueState = { qNum: qNum, index: 1, total: list.length, items: [...list] };
        const firstLoc = list[0];
        const stored = (this.pnrStore && this.pnrStore[firstLoc]) || PRESEEDED_PNRS[firstLoc] || (this.lastSavedPnr && firstLoc === this.lastSavedPnr.locator ? this.lastSavedPnr : null);
        if (stored) {
          const signedIn = this.state.signedIn, officeId = this.state.officeId, history = this.state.history, dutyCode = this.state.dutyCode;
          this.state = Object.assign(freshState(), clone(stored), { signedIn: signedIn || true, officeId: officeId || "DACVS086JJ", history, dutyCode, queueState: this.state.queueState });
        }
        const paxName = (this.state.names && this.state.names[0]) ? this.state.names[0].replace(/^[\d\.\-]+/, "").replace(/\*.*$/, "").trim() : "PASSENGER";
        const seg = this.state.segments && this.state.segments[0];
        const segLine = seg ? `1 ${seg.carrier} ${seg.number || ""} ${seg.soldClass || "Y"} ${seg.date || ""} ${seg.origin || ""}${seg.destination || ""} HK1` : "1 BG 088 Y 22NOV DACBKK HK1";
        return {
          lines: [
            `QUEUE ${qNum.padStart(2, "0")} - ITEM 1 OF ${list.length} (PNR: ${firstLoc})`,
            "-----------------------------------------------------------------",
            `RP/${this.state.officeId || "DACVS086JJ"}/${this.state.officeId || "DACVS086JJ"}              TRAINING/SU`,
            `RECORD LOCATOR: ${firstLoc}`,
            `1.1 ${paxName}`,
            segLine,
            "TL T.T*",
            "-----------------------------------------------------------------",
            "ENTER QN FOR NEXT PNR, QR TO REMOVE FROM QUEUE, QXI TO EXIT"
          ],
          kind: "queue"
        };
      }

      if (cmd === "QN") {
        if (!this.state.queueState) return this.error("NOT ON QUEUE - ENTER Q/1 FIRST");
        const qs = this.state.queueState;
        if (qs.index >= qs.total) {
          return { lines: [`END OF QUEUE ${String(qs.qNum).padStart(2, "0")} — NO MORE ITEMS`], kind: "queue" };
        }
        qs.index++;
        const nextLoc = qs.items && qs.items[qs.index - 1];
        if (nextLoc) {
          const stored = (this.pnrStore && this.pnrStore[nextLoc]) || PRESEEDED_PNRS[nextLoc] || (this.lastSavedPnr && nextLoc === this.lastSavedPnr.locator ? this.lastSavedPnr : null);
          if (stored) {
            const signedIn = this.state.signedIn, officeId = this.state.officeId, history = this.state.history, dutyCode = this.state.dutyCode;
            this.state = Object.assign(freshState(), clone(stored), { signedIn: signedIn || true, officeId: officeId || "DACVS086JJ", history, dutyCode, queueState: qs });
          }
        }
        const paxName = (this.state.names && this.state.names[0]) ? this.state.names[0].replace(/^[\d\.\-]+/, "").replace(/\*.*$/, "").trim() : "PASSENGER";
        const seg = this.state.segments && this.state.segments[0];
        const segLine = seg ? `1 ${seg.carrier} ${seg.number || ""} ${seg.soldClass || "Y"} ${seg.date || ""} ${seg.origin || ""}${seg.destination || ""} HK1` : "1 TK 713 Y 15DEC DACIST HK1";
        return {
          lines: [
            `QUEUE ${String(qs.qNum).padStart(2, "0")} - ITEM ${qs.index} OF ${qs.total} (PNR: ${nextLoc || "CURRENT"})`,
            "-----------------------------------------------------------------",
            `RP/${this.state.officeId || "DACVS086JJ"}/${this.state.officeId || "DACVS086JJ"}              TRAINING/SU`,
            `RECORD LOCATOR: ${nextLoc || this.state.locator}`,
            `1.1 ${paxName}`,
            segLine,
            "TL T.T*",
            "-----------------------------------------------------------------",
            "ENTER QN FOR NEXT, QR TO REMOVE, QXI TO EXIT"
          ],
          kind: "queue"
        };
      }

      if (cmd === "QR") {
        if (!this.state.queueState) return this.error("NOT ON QUEUE - ENTER Q/1 FIRST");
        const qs = this.state.queueState;
        const qNum = String(qs.qNum);
        if (this.queueStore && this.queueStore[qNum]) {
          const curLoc = qs.items && qs.items[qs.index - 1];
          if (curLoc) {
            this.queueStore[qNum] = this.queueStore[qNum].filter(l => l !== curLoc);
            this._saveQueueStore();
          }
        }
        return {
          lines: [
            `PNR REMOVED FROM QUEUE ${String(qs.qNum).padStart(2, "0")}`,
            "ENTER QN FOR NEXT PNR OR QXI TO EXIT"
          ],
          kind: "queue"
        };
      }

      if (cmd === "QXI") {
        this.state.queueState = null;
        return {
          lines: ["QUEUE PROCESSING COMPLETED - SIGNED OFF QUEUE"],
          kind: "queue"
        };
      }

      // ── HARDWARE DEVICE STATUS: HMET ──
      if (cmd === "HMET") {
        return {
          lines: [
            "HMET — HARDWARE DEVICE STATUS",
            "-----------------------------------------------------------------",
            "GTID            : 1D38FE01",
            "LINE ADDRESS    : L01-D01",
            "DEVICE TYPE     : SMARTPOINT WORKSTATION 3270 / TCP-IP",
            `OFFICE PCC      : ${this.state.officeId || "DACVS086JJ"}`,
            "LINE PROTOCOL   : MATIP / ALC-IP PROTOCOL 1",
            "DEVICE STATUS   : ON-LINE / CTS ACTIVE / HIGH SPEED",
            "GATEWAY HOST    : GALILEO CORE TPF ATL",
            "SECURITY LEVEL  : ENCRYPTED TLS 1.3 / LEVEL 4"
          ]
        };
      }

      // ── LOCAL DEVICE STATUS: HMLD ──
      // In real Galileo/Smartpoint, HMLD displays local workstation device
      // settings: terminal ID, printer assignment, queue links, etc.
      if (cmd === "HMLD" || cmd.startsWith("HMLD/")) {
        const pcc = this.state.officeId || "DACVS086JJ";
        return {
          lines: [
            "HMLD - LOCAL DEVICE STATUS",
            "-----------------------------------------------------------------",
            `DEVICE ID        : ${pcc}-T001`,
            "DEVICE TYPE      : SMARTPOINT WORKSTATION / TRAVELPORT GDS",
            `LOGON PCC        : ${pcc}`,
            "LINE ADDRESS     : L01-D01   PROTOCOL: MATIP/ALC-IP",
            "QUEUE ASSIGNMENT : Q001 / GENERAL   Q020 / TICKETING",
            "PRINTER LINK     : LOCAL-LP01  STATUS: READY",
            "TICKET WRITER    : TW-001      STATUS: ONLINE",
            "DEVICE STATUS    : ACTIVE / ON-LINE / CTS HIGH SPEED",
            "-----------------------------------------------------------------",
            "NOTE: TRAINING SIMULATOR — DEVICE DATA IS SIMULATED"
          ]
        };
      }
      const hmlmMatch = cmd.match(/^HMLM([A-Z0-9]+)(?:E)?$/);
      if (hmlmMatch) {
        const deviceId = hmlmMatch[1];
        return {
          lines: [
            `HMLM${deviceId} — PRINTER LOGICAL LINK`,
            "-----------------------------------------------------------------",
            `DEVICE ID       : ${deviceId}`,
            "DEVICE TYPE     : GALILEO LINE PRINTER / TICKET WRITER",
            "PROTOCOL        : ALC-IP / MATIP",
            "STATUS          : LINKED / READY",
            "NOTE: USE HMOM TO BRING DEVICE ONLINE FOR TKT/ITN OUTPUT"
          ]
        };
      }
      const hmomMatch = cmd.match(/^HMOM([A-Z0-9]+)-([A-Z0-9]+)$/);
      if (hmomMatch) {
        const deviceId = hmomMatch[1];
        const mode     = hmomMatch[2].toUpperCase();
        const modeDesc = mode === "U"   ? "ONLINE — DEVICE UP AND READY" :
                         mode === "TKT" ? "ONLINE FOR TICKET (TKT) OUTPUT" :
                         mode === "ITN" ? "ONLINE FOR ITINERARY (ITN) OUTPUT" :
                                         "DEVICE MODE UPDATED";
        return {
          lines: [
            `HMOM${deviceId}-${mode} — DEVICE STATUS UPDATE`,
            "-----------------------------------------------------------------",
            `DEVICE ID       : ${deviceId}`,
            `MODE APPLIED    : ${mode}`,
            `RESULT          : ${modeDesc}`,
            "PRINTER IS NOW ACTIVE AND AVAILABLE FOR OUTPUT"
          ]
        };
      }

      // ── TICKETING QUOTA: HMTQ, HMTQ/D ──
      if (cmd === "HMTQ" || cmd === "HMTQ/D") {
        return {
          lines: [
            "HMTQ/D — DAILY TICKETING QUOTA & ALLOCATION",
            "-----------------------------------------------------------------",
            `OFFICE PCC       : ${this.state.officeId || "DACVS086JJ"} (WINGS FLY TRAVELS)`,
            "BSP AGENT NUMBER : 42-3 0861 5",
            "CURRENCY         : BDT",
            "DAILY QUOTA CAP  : BDT 5,000,000",
            "ISSUED TODAY     : BDT   145,225",
            "REMAINING QUOTA  : BDT 4,854,775",
            "TICKETING STATUS : UNRESTRICTED / OPEN FOR ISSUANCE",
            "AUTHORIZATION    : IATA / BSP BANGLADESH CENTRAL CLEARING"
          ]
        };
      }

      // ── BEST BUY REBOOK: BBK ──
      if (cmd === "BBK") {
        if (!this.state.segments.length) return this.error("NO FLIGHT BOOKED - BOOK SEGMENT FIRST");
        const seg = this.state.segments[0];
        const oldClass = seg.soldClass || "Y";
        seg.soldClass = "K";
        return {
          lines: [
            "BBK — BEST BUY REBOOK COMPLETE",
            "-----------------------------------------------------------------",
            `FLIGHT          : ${seg.carrier} ${seg.number}  ${seg.date}  ${seg.origin}-${seg.destination}`,
            `ORIGINAL CLASS  : ${oldClass}`,
            "REBOOKED CLASS  : K (LOWEST APPLICABLE BEST BUY FARE)",
            "STATUS          : HK1 CONFIRMED",
            "FARE BASIS      : KLOWBD",
            "-----------------------------------------------------------------",
            "ENTER R.H THEN ER TO SAVE CHANGES"
          ],
          kind: "sell"
        };
      }

      // ── LESSON / TUTORIAL: LESSON, LESSON BOOKING, LESSON REISSUE, LESSON REFUND, LESSON VOID, LESSON SEAT ──
      if (cmd === "LESSON" || cmd === "LESSONS") {
        return {
          lines: [
            "GELLELIO GALILEO TRAINING LESSONS",
            "=================================================================",
            "LESSON BOOKING    Step-by-step complete booking & ticketing flow",
            "LESSON REISSUE    Ticket exchange / date change flow (Manual & Auto)",
            "LESSON REFUND     Full and partial ticket refund procedures",
            "LESSON VOID       Same-day ticket cancellation / void workflow",
            "LESSON SEAT       Seat map display & seat preference request",
            "=================================================================",
            "TYPE 'LESSON BOOKING', 'LESSON REISSUE', ETC. TO OPEN A LESSON"
          ]
        };
      }
      if (cmd === "LESSON BOOKING") {
        return {
          lines: [
            "LESSON 1: NEW TICKET BOOKING & ISSUANCE WORKFLOW",
            "-----------------------------------------------------------------",
            "1. Sign in                 : SON/ZHA",
            "2. Search flights          : A22JUNDACDXB   (or A22JUNDACDXB*EK)",
            "3. Sell seat               : N1K2           (1 seat, K class, line 2)",
            "4. Add passenger name      : N.RAHMAN/MD HAFIZUR MR",
            "5. Add agency contact      : P.T*WINGS FLY TOURS 01712000000",
            "6. Ticketing agreement     : T.T*",
            "7. Save booking file       : R.H  ->  ER  ->  IR",
            "8. Add passport SSR        : SI.P1/SSRDOCSBGHK1/P/BGD/A12345678/...",
            "9. Add meal SSR            : SI.P1/MOML",
            "10. Quote fare             : FQCEK/ET       (or FXA for auto)",
            "11. Add ticket modifier    : TMU1Z7/FINVAGT*AGENT",
            "12. Save & issue ticket    : ER  ->  TKPDTD",
            "-----------------------------------------------------------------"
          ]
        };
      }
      if (cmd === "LESSON REISSUE") {
        return {
          lines: [
            "LESSON 2: MANUAL TICKET EXCHANGE / REISSUE (TRAINING SIMULATION)",
            "-----------------------------------------------------------------",
            "  1. Retrieve ticketed PNR : *TK7REI",
            "  2. Review original ETR   : *HTE",
            "  3. Change/rebook itinerary and quote the new fare",
            "  4. Compare original and new fare, EACH tax, and CAT 31 penalty",
            "  5. Manual fare build     : *FB1 -> FBUFARE/[currency][new base]",
            "     Remove/replace old tax lines with applicable new tax differences",
            "  6. Recalculate and file  : FBUTTL/  ->  FBF",
            "  7. Save filed fare       : R.R  ->  ER",
            "  8. Auto-exchange calc    : FXE  (compare old vs new fare; check add-collect)",
            "     FXE shows the residual amount; type FXE/OK to accept and proceed.",
            "  9. Exchange fill-in      : TKPFEX[ticket number]",
            "     (use TKPFEX OR TMU1FEX[ticket number], not both)",
            " 10. Set ticket modifier, save, then issue exchange ticket",
            "     Training simulator issue command: TKPDTD",
            "",
            "TAX FORMAT EXAMPLES (replace amounts/codes with the actual differences):",
            "  FBUTAX1/       remove old tax box 1 from the new fare build",
            "  FBUTAX1/4 TR   enter a tax amount/code in the simulator",
            "  FBUTAX2/6768XP enter a penalty tax line in this training example",
            "  Never treat example tax amounts as a quote; fare rules decide them.",
            "SETTLEMENT: new base - old base + net tax difference + penalty.",
            "A negative result is residual/refund handling, not add-collect.",
            "-----------------------------------------------------------------"
          ]
        };
      }
      if (cmd === "LESSON REFUND") {
        return {
          lines: [
            "LESSON 3: ELECTRONIC TICKET REFUND WORKFLOW (TRAINING SIMULATION)",
            "-----------------------------------------------------------------",
            "UNUSED FULL REFUND (MANUAL - TRNE):",
            "  1. Open Refund PNR       : *BG7REF",
            "  2. Review ticket/coupons : *HTE (confirm status and ticket issue date)",
            "  3. Check e-ticket record : *TE/99755555555555",
            "  4. Open refund mask      : TRNE99755555555555/26MAR20",
            "  5. Review used fare, itemized taxes, penalty, FOP and refund amount",
            "     optional training penalty example: /X1000",
            "  6. Confirm in simulator  : TRNE/OK; use I to cancel the open mask",
            "  7. Verify ticket status  : *TE (coupon/ticket should show RFND)",
            "Refundability of each tax depends on ticket/coupon use and fare rules.",
            "",
            "AUTOMATED REFUND (TRNF - SEE ALSO: LESSON AUTOREFUND):",
            "  Use TRNF instead of TRNE[ticket] to let the system auto-calculate.",
            "  Practice PNR: *TK8AFR  then  TRNF  then  TRNF/OK",
            "",
            "PARTIALLY USED REFUND (VIDEO / SMARTPOINT SEQUENCE):",
            "  1. Open partial PNR      : *PARTIAL  (or *BG2PAR)",
            "  2. Display e-ticket      : *TE or *TE1 (USED coupons stay, OPEN coupons refund)",
            "  3. Historical used fare  : FQ.T  then  FQ.T[issue date]/S1",
            "  4. Convert CAT 16 fee    : FZUSD125BDT  (training FX; use the local amount)",
            "  5. Open refund mask      : TRNE[ticket]  then  TRN1",
            "  6. Unused tax page       : TRNTAX",
            "  7. Review cash due       : TRN2  (optional TRN3 validation)",
            "  8. Confirm in simulator  : TRN/OK or TRNE/OK",
            "",
            "GRAPHICAL TRAINING TOOL: type #REFUND or open TOOLS -> Ticket Refund.",
            "The local simulator uses a shortened confirmation flow; Galileo refund masks can have multiple screens."
          ]
        };
      }
      if (cmd === "LESSON AUTOREFUND" || cmd === "LESSON TRNF") {
        return {
          lines: [
            "LESSON 5: TRNF - AUTOMATED FARE REFUND (GALILEO SMARTPOINT)",
            "-----------------------------------------------------------------",
            "WHAT IS TRNF?",
            "  TRNF is the Galileo Automated Fare Refund command. Unlike TRNE",
            "  (where you type the ticket number manually), TRNF reads the",
            "  active PNR ticket automatically and calculates the refund from",
            "  Cat 16 fare rules — no ticket number entry needed.",
            "",
            "KEY DIFFERENCE:",
            "  TRNE[ticket]/[date]  = Manual entry, you specify ticket + date",
            "  TRNF                 = Automated, system reads active PNR ticket",
            "",
            "TRNF PRACTICE SEQUENCE (Practice PNR: TK8AFR):",
            "  1. Retrieve PNR         : *TK8AFR",
            "  2. Review ticket        : *HTE (confirm OPEN FOR USE status)",
            "  3. Check e-ticket       : *TE  (view coupon details)",
            "  4. Check Cat 16 rules   : FD15JAN26DACIST/TK-OW.T10JAN26",
            "  5. Run automated refund : TRNF",
            "     ** SYSTEM AUTO-CALCULATES: fare, taxes, Cat 16 penalty **",
            "  6. Review refund screen : verify NET REFUND TO PAX amount",
            "  7. Confirm refund       : TRNF/OK",
            "  8. Verify status        : *TE (coupons should show REFUNDED / R)",
            "",
            "WHAT TRNF SHOWS YOU:",
            "  - Original fare paid and tax breakdown",
            "  - Cat 16 cancellation penalty (auto-applied)",
            "  - Refundable base fare (= original base - penalty)",
            "  - Refundable taxes (non-refundable taxes shown separately)",
            "  - Net refund to passenger",
            "  - Form of refund (original FOP)",
            "",
            "CONFIRM OR CANCEL:",
            "  TRNF/OK  = Process the automated refund",
            "  I        = Ignore and cancel the open TRNF mask",
            "",
            "NOTE: In real Smartpoint, TRNF reads live fare rules from the",
            "airline database. In this simulator, Cat 16 penalty is applied",
            "automatically based on the ticket carrier and fare class."
          ]
        };
      }
      if (cmd === "LESSON VOID") {
        return {
          lines: [
            "LESSON 4: TICKET VOID (SAME-DAY CANCELLATION)",
            "-----------------------------------------------------------------",
            "1. Retrieve PNR            : *TK7REI",
            "2. Check e-ticket status   : *TE",
            "3. Issue Void command      : TRV/2358910482910   (or simply TRV)",
            "4. Verify cancellation fee : BDT 0 (100% Free - Same day void)",
            "5. Check updated status    : *TE  (All coupons marked as V - VOID)",
            "",
            "GRAPHICAL ASSISTED VOID    : Type #VOID or click toolbar ↺"
          ]
        };
      }
      if (cmd === "LESSON SEAT") {
        return {
          lines: [
            "LESSON 5: SEAT MAP & PREFERENCE ASSIGNMENT",
            "-----------------------------------------------------------------",
            "1. Retrieve PNR            : *TK7REI",
            "2. Display seat map        : SA*S1  (Segment 1 seat map)",
            "3. Request Window seat     : S.P1/NW",
            "4. Request Aisle seat      : S.P1/NA",
            "5. Request Middle seat     : S.P1/NM",
            "6. Save seat to PNR        : ER  ->  IR",
            "7. Check SSR list          : *SI  (Shows confirmed seat RQST)"
          ]
        };
      }

      // ── RECEIVED FIELD: R.H ──
      if (cmd.startsWith("R.")) {
        this.state.receivedFrom = raw.trim().slice(2) || "H";
        this.state.dirty = true;
        return { lines: ["R." + this.state.receivedFrom.toUpperCase()] };
      }
      if (cmd.startsWith("RF-")) {
        this.state.receivedFrom = raw.trim().slice(3);
        this.state.dirty = true;
        return { lines: ["R." + this.state.receivedFrom.toUpperCase()] };
      }

      // ── END & RETRIEVE: ER or E ──
      if (cmd === "ER" || cmd === "E" || cmd === "ET") {
        // A cancellation transaction may deliberately leave an existing PNR
        // with no air segments.  It still needs ER so a refund workflow can
        // continue; only a brand-new, empty booking requires an air segment.
        const savingCancelledItinerary = this.state.itineraryCancelled && !!this.state.locator;
        if (!this.state.segments.length && !savingCancelledItinerary) {
          return this.error("NO SEGMENT - ADD AIR SEGMENT FIRST");
        }
        this.state.segments.forEach(s => { s.status = "HK"; });
        if (!this.state.names.length)    return this.error("CHECK FORMAT - NAME FIELD REQUIRED");
        // A Galileo PNR can be end-transacted once itinerary and passenger
        // name exist. Contact, ticketing and received fields may be supplied
        // before or after this point in the training flow.
        this.state.saved   = true;
        this.state.dirty   = false;
        // justEnded=true: hides *VR button and VR vendor-box line until IR is run,
        // matching real Smartpoint which only shows *VL immediately after ER.
        this.state.justEnded = true;
        if (this.state.commission !== null && this.state.invoiceAgent) this.state.modifierSaved = true;
        this.state.locator = this.state.locator || genLocator();
        // Generate vendorLocator immediately so *VL button is available right after ER.
        if (!this.state.vendorLocator) {
          const now = new Date();
          const month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
          const stamp = date => String(date.getUTCDate()).padStart(2, "0") + month[date.getUTCMonth()];
          const hh = String(now.getUTCHours()).padStart(2, "0");
          const mm = String(now.getUTCMinutes()).padStart(2, "0");
          const carrier = (this.state.segments && this.state.segments[0] && this.state.segments[0].carrier) || "BS";
          const code = genLocator();
          this.state.airlinePnr = code;
          this.state.vendorLocator = `${carrier}*${code}/${stamp(now)} ${hh}${mm}`;
        }
        // vendorRemarks deferred to IR — real Smartpoint shows *VR only after IR.
        this.state.savedPnr = clone({
          segments: this.state.segments,
          names: this.state.names,
          phones: this.state.phones,
          ticketing: this.state.ticketing,
          receivedFrom: this.state.receivedFrom,
          locator: this.state.locator,
          priced: this.state.priced,
          fare: this.state.fare,
          filedFare: this.state.filedFare,
          storedFare: this.state.storedFare,
          filedFares: this.state.filedFares,
          issued: this.state.issued,
          issuedTicket: this.state.issuedTicket,
          issuedTickets: this.state.issuedTickets,
          fareBuild: this.state.fareBuild,
          exchangeTicket: this.state.exchangeTicket,
          commission: this.state.commission,
          invoiceAgent: this.state.invoiceAgent,
          modifierSaved: this.state.modifierSaved,
          refundNotice: this.state.refundNotice,
          saved: true,
          vendorLocator: this.state.vendorLocator,
          vendorRemarks: this.state.vendorRemarks,
          itineraryCancelled: savingCancelledItinerary,
          ssr: this.state.ssr,
          osk: this.state.osk,
          retention: this.state.retention,
          mileage: this.state.mileage
        });
        this.lastSavedPnr = clone(this.state.savedPnr);
        this._savePnrToStore(this.state.savedPnr);
        // Smartpoint commits the BF to the left work area after ER; it does
        // not print an RLR receipt in the terminal pane.
        return { lines: [], kind: "end", clearTerminal: true };
      }

      // ── PNR left-work-area displays ──
      if (cmd === "IR") {
        if (!this.state.locator) return this.error("NO ACTIVE PNR");
        if (this.lastSavedPnr) {
          const signedIn = this.state.signedIn, officeId = this.state.officeId, history = this.state.history, dutyCode = this.state.dutyCode, workArea = this.state.workArea;
          this.state = Object.assign(freshState(), clone(this.lastSavedPnr), { signedIn, officeId, history, dutyCode, workArea });
        }
        this.state.dirty = false;
        this.state.justEnded = false;
        if (this.state.saved && !this.state.vendorRemarks) {
          this._populateVendorRemarks();
        }
        return { lines: [], kind: "left-display", leftDisplay: this.state.issued ? "all" : "overview", clearTerminal: true };
      }
      if (cmd === "*VL" || cmd === "*VR") {
        if (!this.state.locator) return this.error("NO ACTIVE PNR");
        this.state.justEnded = false;
        if (this.state.saved && !this.state.vendorRemarks) {
          this._populateVendorRemarks();
        }
        return { lines: [], kind: "left-display", leftDisplay: cmd === "*VL" ? "vendorLocator" : "vendorRemarks", clearTerminal: false };
      }

      // ── PNR quick displays ──
            if (cmd === "*P") {
        if (!this.state.phones.length) return this.error("NO PHONE FIELD IN PNR");
        const lines = this.state.phones.map((p, idx) => {
          const pStr = (typeof p === "string" ? p : (p.full || p.text || "")).toUpperCase().trim().replace(/^FONE-/, "");
          return idx === 0 ? ("FONE-" + pStr) : ("  " + (idx + 1) + ". " + pStr);
        });
        return { lines, kind: "phone", leftDisplay: "phone" };
      }
            if (cmd === "*TD") {
        if (!this.state.ticketing) return this.error("NO TICKETING FIELD IN PNR");
        return { lines: ["TKTG-" + this.state.ticketing], kind: "ticketing", leftDisplay: "ticketing" };
      }
      if (cmd === "*SI" || cmd === "*S") {
        if (!this.state.ssr.length) return this.error("NO SERVICE INFORMATION IN PNR");
        return { lines: [], kind: "left-display", leftDisplay: "service", clearTerminal: true };
      }
      if (cmd === "*FF" || cmd === "*FF1") {
        if (!this.state.filedFare || !this.state.fare) return this.error("NO FILED FARE DATA IN PNR");
        return { lines: [], kind: "left-display", leftDisplay: "filedFare", clearTerminal: true };
      }
      if (cmd === "*H") {
        if (!this.state.locator) return this.error("NO ACTIVE PNR - RETRIEVE FIRST");
        const hLines = [
          "--- BOOKING FILE HISTORY ---",
          `RP/${this.state.officeId || "DACVS086JJ"}/${this.state.officeId || "DACVS086JJ"}              ${this.state.receivedFrom || "TRAINING"}/SU`,
          `RECORD LOCATOR: ${this.state.locator}`,
          "-----------------------------------------------------------------"
        ];
        this.state.history.forEach((h, idx) => {
          hLines.push(`H/${String(idx + 1).padStart(2, "0")}  ${h}`);
        });
        if (this.state.issuedTicket) {
          hLines.push(`H/TK  TKT ISSUED ${this.state.issuedTicket.ticketNumber} ${this.state.issuedTicket.status}`);
        }
        hLines.push("-----------------------------------------------------------------");
        hLines.push("END OF HISTORY");
        return { lines: hLines, kind: "history" };
      }
      if (cmd === "*IA" || cmd === "*I") {
        if (!this.state.segments.length) return this.error("NO ITINERARY IN PNR");
        const lines = ["AIR ITINERARY:"];
        this.state.segments.forEach(seg => {
          lines.push(`${seg.segNum} ${seg.carrier} ${seg.number} ${seg.soldClass || "Y"} ${seg.date} ${seg.origin}${seg.destination} HK${seg.heldSeats || seg.paxCount} ${seg.depart} ${seg.arrive}`);
        });
        if (this.state.retention) {
          lines.push(`${this.state.segments.length + 1} TUR ${this.state.retention.date} ${this.state.retention.text}`);
        }
        return { lines, kind: "itinerary" };
      }
      if (cmd === "*N") {
        if (!this.state.names.length) return this.error("NO NAMES IN PNR");
        return { lines: ["NAME FIELD:", ...this.state.names], kind: "name" };
      }
      if (cmd === "*R") {
        if (!this.state.locator) return this.error("NO ACTIVE PNR");
        this.state.justEnded = false;
        if (this.state.saved && !this.state.vendorRemarks) {
          this._populateVendorRemarks();
        }
        return this.state.issued ? { lines: this._displayPNR().lines, kind: "retrieve", leftDisplay: "issued-pnr" } : this._displayPNR();
      }
      if (cmd === "*EM") {
        const emailSsrs = this.state.ssr.filter(s => (typeof s === "string" ? s.includes("CTCE") : s.code === "CTCE"));
        if (!emailSsrs.length) return this.error("NO EMAIL REMARKS IN PNR - USE SI.P1/SSRCTCE... TO ADD");
        return {
          lines: [
            "EMAIL REMARKS:",
            ...emailSsrs.map(s => String(s))
          ],
          kind: "service"
        };
      }
      if (cmd === "*NP") {
        return {
          lines: [
            "NOTEPAD REMARKS:",
            `PCC : ${this.state.officeId || "DACVS086JJ"}`,
            `STATUS : ${this.state.signedIn ? "SIGNED IN" : "SIGNED OFF"}`,
            this.state.retention ? `RETENTION : ${this.state.retention.date} ${this.state.retention.text}` : "NO CONFIDENTIAL NOTEPAD REMARKS"
          ],
          kind: "remarks"
        };
      }
      if (cmd === "*SD") {
        const seatSsrs = this.state.ssr.filter(s => (typeof s === "string" ? s.includes("RQST") : (s.code === "RQST" || s.code === "NSST")));
        if (!seatSsrs.length) return this.error("NO SEAT DATA IN PNR - USE S.P1/NW OR SA*S1 TO REQUEST");
        return {
          lines: [
            "SEAT DATA:",
            ...seatSsrs.map(s => String(s))
          ],
          kind: "service"
        };
      }
      if (cmd === "*M") {
        if (!this.state.mileage.length) return this.error("NO FREQUENT FLYER MEMBERSHIP IN PNR - USE M.EK... TO ADD");
        return {
          lines: [
            "FREQUENT FLYER / MILEAGE MEMBERSHIP:",
            ...this.state.mileage.map(m => `P${m.paxNum} ${m.carrier} ${m.num} (${m.paxName})`)
          ],
          kind: "mileage"
        };
      }

      // ── RETRIEVE PNR BY SURNAME: *-RAHMAN / *-RAHMAN/HAFIZUR / *-NAME ──
      if (cmd.startsWith("*-")) {
        const query = cmd.slice(2).trim();
        if (!query) return this.error("CHECK FORMAT - USE: *-SURNAME (E.G. *-RAHMAN)");
        const parts = query.split("/");
        const sur = parts[0].trim();
        const giv = parts[1] ? parts[1].trim() : "";
        const allStored = Object.values(this.pnrStore || {});
        const pnrList = [
          PRESEEDED_PNRS["BG7REF"],
          PRESEEDED_PNRS["TK7REI"],
          PRESEEDED_PNRS["BG2PAR"],
          ...allStored,
          this.lastSavedPnr,
          this.state
        ].filter(Boolean);
        const match = pnrList.find(p => (p.names || []).some(n => {
          const up = n.toUpperCase();
          return up.includes(sur) && (!giv || up.includes(giv));
        }));
        if (match) {
          const signedIn = this.state.signedIn, officeId = this.state.officeId, history = this.state.history, dutyCode = this.state.dutyCode, workArea = this.state.workArea;
          this.state = Object.assign(freshState(), clone(match), { signedIn: signedIn || true, officeId: officeId || "DACVS086JJ", history, dutyCode, workArea });
          this.lastSavedPnr = clone(this.state);
          return this._displayPNR();
        }
        return this.error(`NO BOOKING FILE FOUND FOR SURNAME ${query}`);
      }

      // ── RETRIEVE PNR: *LOCATOR ──
      const excludedStars = ["*ALL", "*RV", "*FB", "*TE", "*HTE", "*HTI", "*VL", "*VR", "*P", "*TD", "*SI", "*FF", "*H", "*IA", "*I", "*N", "*R", "*EM", "*NP", "*SD", "*S", "*M", "*Q", "*EX", "*TP"];
      const isExcludedStar = excludedStars.some(p => cmd === p || cmd.startsWith(p + "/") || cmd.startsWith(p + "1") || cmd.startsWith(p + "*"));
      if (cmd.startsWith("*") && !isExcludedStar) {
        const loc = cmd.slice(1).toUpperCase().trim();
        const stored = (this.pnrStore && this.pnrStore[loc]) ||
                       (this.lastSavedPnr && loc === this.lastSavedPnr.locator ? this.lastSavedPnr : null) ||
                       PRESEEDED_PNRS[loc];
        if (stored) {
          const signedIn = this.state.signedIn, officeId = this.state.officeId, history = this.state.history, dutyCode = this.state.dutyCode, workArea = this.state.workArea;
          this.state = Object.assign(freshState(), clone(stored), { signedIn: signedIn || true, officeId: officeId || "DACVS086JJ", history, dutyCode, workArea });
          if (!this.state.issuedTickets && this.state.issuedTicket) {
            this.state.issuedTickets = [this.state.issuedTicket];
          }
          this.lastSavedPnr = clone(this.state);
        } else if (loc !== this.state.locator) {
          return this.error(`RECORD LOCATOR ${loc} NOT FOUND`);
        }
        this.state.activeBfCleared = false;
        this.state.justEnded = false;
        if (this.state.saved && !this.state.vendorRemarks) {
          this._populateVendorRemarks();
        }
        const pnrResp = this._displayPNR();
        return this.state.issued ? { lines: pnrResp.lines, kind: "retrieve", leftDisplay: "issued-pnr" } : pnrResp;
      }

      // ── *ALL: display full PNR ──
      if (cmd === "*ALL") {
        const hasActiveDraft = (this.state.segments && this.state.segments.length > 0) || (this.state.names && this.state.names.length > 0);
        if (!this.state.locator && !hasActiveDraft) return this.error("NO ACTIVE PNR - RETRIEVE FIRST");
        this.state.activeBfCleared = false;
        this.state.justEnded = false;
        if (this.state.saved && !this.state.vendorRemarks) {
          this._populateVendorRemarks();
        }
        return { lines: [], kind: "left-display", leftDisplay: "all" };
      }

      // ── *RV: re-display (same as retrieve) ──
      if (cmd === "*RV") {
        const hasActiveDraft = (this.state.segments && this.state.segments.length > 0) || (this.state.names && this.state.names.length > 0);
        if (!this.state.locator && !hasActiveDraft) return this.error("NO ACTIVE PNR");
        this.state.activeBfCleared = false;
        this.state.justEnded = false;
        if (this.state.saved && !this.state.vendorRemarks) {
          this._populateVendorRemarks();
        }
        return this.state.issued ? { lines: this._displayPNR().lines, kind: "retrieve", leftDisplay: "issued-pnr" } : this._displayPNR();
      }

      // ── FARE SHOPPING / FARE QUOTE: FQ ──
      // FS3DAC15NOVLHR = 3 adults; FS2ADT1CHDDAC15NOVLHR = 2 adults + 1 child.
      // Smartpoint may append passenger/price qualifiers, e.g. +P1-2.3*07.
      // They refine the display but do not change this training simulator's fare search.
      let fsCommand = cmd;
      let fsCarrier = null;
      let fsBusns = false;
      let fsParty = null;

      // 1. carrier filter //XX
      const carMatch = fsCommand.match(/\/\/([A-Z0-9]{2})/i);
      if (carMatch) {
        fsCarrier = carMatch[1].toUpperCase();
        fsCommand = fsCommand.replace(carMatch[0], "");
      }

      // 2. business class ++-BUSNS or ++BUSNS
      if (/\+\+(-)?BUSNS/i.test(fsCommand)) {
        fsBusns = true;
        fsCommand = fsCommand.replace(/\+\+(-)?BUSNS/i, "");
      }

      // 3. +P passenger qualifier e.g. +P1.2*C10 or +P1-2.3*C10.4*INF
      const pMatch = fsCommand.match(/\+P([0-9A-Z.*-]+)/i);
      if (pMatch) {
        const pStr = pMatch[1].toUpperCase();
        const chdCount = (pStr.match(/(?:C\d+|CHD|CNN)/g) || []).length;
        const infCount = (pStr.match(/INF/g) || []).length;
        fsParty = { chd: chdCount, inf: infCount };
        fsCommand = fsCommand.replace(pMatch[0], "");
      }

      let passengers = { adt: 1, chd: 0, inf: 0 };
      let partyMatch = fsCommand.match(/^FS(\d+)ADT[/.]?(\d+)CHD(.+)$/);
      if (partyMatch) {
        passengers.adt = parseInt(partyMatch[1]);
        passengers.chd = parseInt(partyMatch[2]);
        fsCommand = "FS" + partyMatch[3];
      } else if ((partyMatch = fsCommand.match(/^FS(\d+)\.(\d+)C(.+)$/))) {
        passengers.adt = parseInt(partyMatch[1]);
        passengers.chd = parseInt(partyMatch[2]);
        fsCommand = "FS" + partyMatch[3];
      } else if ((partyMatch = fsCommand.match(/^FS(\d+)([A-Z]{3}\d{2}[A-Z]{3}[A-Z]{3}(?:\d{2}[A-Z]{3}[A-Z]{3})?)$/))) {
        passengers.adt = parseInt(partyMatch[1]);
        fsCommand = "FS" + partyMatch[2];
      }

      if (fsParty) {
        if (passengers.adt > (fsParty.chd + fsParty.inf)) {
          passengers.adt -= (fsParty.chd + fsParty.inf);
        }
        passengers.chd = (passengers.chd || 0) + fsParty.chd;
        passengers.inf = (passengers.inf || 0) + fsParty.inf;
      }

      const fareSearch = fsCommand.match(/^FS([A-Z]{3})(\d{2}[A-Z]{3})([A-Z]{3})$/);
      const roundTripFareSearch = fsCommand.match(/^FS([A-Z]{3})(\d{2}[A-Z]{3})([A-Z]{3})(\d{2}[A-Z]{3})([A-Z]{3})$/);

      // ── MULTI-CITY FARE SEARCH: FSDAC20DECBKK30DECSIN05JANDAC ──
      // Parses 3+ city legs separated by date+airport tokens.
      // Each leg: <ORIG><DD><MON><DEST>  (e.g. DAC20DECBKK)
      // Surface break (open-jaw): replace -- with //SURFACE// between cities.
      function parseMultiCityFS(raw) {
        // Strip leading FS
        const body = raw.slice(2);
        // Split on surface-break marker first (normalize -- to a placeholder)
        const hasSurface = body.includes("--");
        const normalized = body.replace(/--/g, "__SURF__");
        // Token pattern: 3-letter airport + date + 3-letter airport (repeating)
        // e.g. DAC20DECBKK30DECSIN05JANDAC
        const tokenRe = /([A-Z]{3})(\d{2}[A-Z]{3})([A-Z]{3})/g;
        // Also handle surface markers between cities (no date token)
        // Split into segments by consuming the string progressively
        const segments = [];
        let remaining = normalized;
        let surfacePositions = [];
        // First pass: find all airport-date-airport triples
        let m;
        const allTokens = [];
        const tokenSrc = remaining.replace(/__SURF__/g, "XXX00XXXYYY"); // placeholder for surface gaps
        // Simpler approach: split the body on date patterns
        // A "leg" is ORIG + DATE + DEST, where DEST bleeds into next ORIG
        // Strategy: repeatedly consume AAA##MMMBB from the front
        let pos = 0;
        const upperBody = body.toUpperCase();
        // Regex: city(3) date(5) city(3) repeated, with optional -- surface break
        // We parse greedily: consume 3+5+3, remainder starts at the 3-letter DEST
        // which is also the next ORIG
        const legRe = /([A-Z]{3})(\d{2}[A-Z]{3})([A-Z]{3})/y;
        legRe.lastIndex = 0;
        const rawNoSurf = upperBody.replace(/--/g, "");
        legRe.lastIndex = 0;
        let firstOrig = null;
        let cursor = 0;
        const segs = [];
        const surfBefore = []; // index of segs where surface break precedes
        // scan the original for -- positions and city offsets
        let i = 0;
        const chars = upperBody.split("");
        while (i < chars.length) {
          if (chars[i] === "-" && chars[i+1] === "-") {
            // surface break marker – skip 2 chars, record
            if (segs.length > 0) surfBefore.push(segs.length);
            i += 2;
            continue;
          }
          // try to match a leg starting at i: need 3 alpha + 5 alnum + 3 alpha = 11 chars
          const slice = upperBody.slice(i);
          const lm = slice.match(/^([A-Z]{3})(\d{2}[A-Z]{3})([A-Z]{3})/);
          if (lm) {
            segs.push({ orig: lm[1], date: lm[2], dest: lm[3], surface: surfBefore.includes(segs.length) });
            i += 8; // advance by orig(3)+date(5), dest(3) is shared with next orig
          } else {
            i++;
          }
        }
        if (segs.length < 2) return null;
        // Mark surface breaks: a seg has surface=true if preceded by --
        segs.forEach((s, idx) => { s.surface = surfBefore.includes(idx); });
        return { legs: segs, hasSurface };
      }

      const multiCity = (function() {
        // Only parse as multi-city if it has 3+ legs or contains --
        const raw = fsCommand;
        if (!/^FS/.test(raw)) return null;
        const body = raw.slice(2).toUpperCase();
        // Must have at least 3+5+3 = 11 chars and contain either:
        // - a second date segment (multi-city), or a surface break
        const legCount = (body.match(/(\d{2}[A-Z]{3})/g) || []).length;
        if (legCount < 2 && !body.includes("--")) return null;
        // Skip simple round-trip already handled by roundTripFareSearch
        if (legCount === 2 && !body.includes("--") && roundTripFareSearch) return null;
        return parseMultiCityFS(raw);
      })();

      // ── BEST BUY REBOOK: FQBBK ──
      if (cmd === "FQBBK") {
        if (!this.state.priced || !this.state.fare) return this.error("NO FARE QUOTE EXISTS - ENTER FQBB FIRST");
        const carrier = (this.state.fare && this.state.fare.carrier) || "TG";
        const targetCls = this.state.fare.isBusns ? (carrier === "TG" ? "Z" : "J") : (carrier === "PG" ? "V" : "W");
        this.state.segments.forEach(s => { s.soldClass = targetCls; });
        const itinerary = this.state.segments;
        const basis = this.state.fare.fareBasis || (targetCls === "V" ? "VOWDQNBD" : (targetCls === "W" ? "WLOSV" : "ZLOST"));
        this.state.fare.fareBasis = basis;
        this.state.fareComponents = itinerary.map((seg, idx) => ({
          num: idx + 1,
          route: (seg.origin || "DAC") + "-" + (seg.destination || "BKK"),
          basis: basis,
          carrier: carrier
        }));
        const base = this.state.fare.base;
        const taxes = this.state.fare.taxes;
        const total = this.state.fare.total;
        return {
          lines: [
            "          ***  BEST BUY REBOOK  ***",
            "      ***  REBOOK SUCCESSFUL  ***",
            "          REBOOKED SEGMENTS 1" + targetCls,
            "  PSGR          FARE      TAXES     TOTAL PSG DES",
            "FQA 1    BDT   " + String(base).padStart(5) + "      " + String(taxes).padStart(5) + "     " + String(total).padStart(5) + " ADT",
            "    GUARANTEED AT TIME OF TICKETING",
            "GRAND TOTAL INCLUDING TAXES ****     BDT      " + total,
            "  **FEE TOTAL                                     0",
            "  **PRICE INCLUDING TAXES AND FEES            " + total,
            "FEES BASED ON CURRENT REQUEST-SEE >FO· FOR ALL TICKET FEES",
            "\u00abDisplay Rules\u00bb"
          ],
          kind: "fare-rebook"
        };
      }


      // ── FARE LOAD & PRICING: FQBB, FQCB, FQC (Smartpoint / Galileo Filed Fare) ──
      // Matches standard Galileo fare quote commands:
      // - FQBB or FQBB/:COC/ET or FQBB/CEK/ET or FQBBCBG/ET (Best Buy)
      // - FQCB[FARE BASIS]/ET or FQCBECONOMY/ET or FQCBY/ET (Carrier/Fare Basis quote)
      // - FQCB/:VCC or FQCB/ACC or FQCEK/ACC (Validating carrier / concession)
      // - FQCB*PCR/ET or FQCBG*ADR/ET (Private Corporate Rate / Promo)
      // - FQBB/CTG/ET++-BUSNS or FQBB++-BUSNS (Business cabin quote/upgrade)
      // - FQCEK/ET, FQCBG/ET, etc.
      const isFareLoadCmd = cmd !== "FQBBK" && (/^(?:FQBB|FQB|FQCB|FQC[A-Z0-9]{2}|FQ\/C[A-Z0-9]{2}|FQ\/ET|FQ@|FQS\d*@|FQ\*|FQP\d*[\*@])/i.test(cmd) || (cmd === "FQ" && this.state.segments && this.state.segments.length > 0)) && !cmd.startsWith("FQ.T");
      if (isFareLoadCmd) {
        // Enforce strict Galileo modifier validation:
        // Reject invalid modifiers like +:BUSS, [CBB], +BUSS, etc. (real Travelport Smartpoint returns INVALID MODIFIER)
        // Note: ++BUSNS (double-plus) is a valid brand upsell modifier — only reject single-plus +BUSNS.
        if (/\+:[A-Z0-9]+/i.test(cmd) || /\[CBB\]/i.test(cmd) || /(?<!\+)\+BUS(?:S|NS)?\b/i.test(cmd)) {
          return this.error("INVALID MODIFIER");
        }

        const isBestBuy = /^FQB/i.test(cmd);
        let isBusns = /\+\+(-)?BUS(?:NS)?/i.test(cmd);
        const isChd = /\*(?:CNN|CHD|C\d{2})/i.test(cmd) || /\/(?:ACC|CNN|CHD)/i.test(cmd) || /:(?:ACC|CNN|CHD)/i.test(cmd) || /\*P-C\d{2}/i.test(cmd);
        const isPromo = /\*(?:PCR|ADR|CORP|PRIV)/i.test(cmd);
        const isVcc = /:VCC/i.test(cmd);
        const isCoc = /:COC/i.test(cmd);

        // Extract carrier if specified in command:
        let specifiedCarrier = null;
        const carSlashC = cmd.match(/FQ(?:BB|B|CB)?(?:\/|\:)C([A-Z0-9]{2})/i);
        const carBbc = cmd.match(/^FQB{1,2}C([A-Z0-9]{2})/i);
        const carCb = cmd.match(/^FQCB([A-Z0-9]{2})(?:\*|\/|$)/i);
        const carC = cmd.match(/^FQC([A-Z0-9]{2})/i);

        if (carSlashC) specifiedCarrier = carSlashC[1].toUpperCase();
        else if (carBbc && !["BB", "ET"].includes(carBbc[1].toUpperCase())) specifiedCarrier = carBbc[1].toUpperCase();
        else if (carCb && carCb[1].length === 2 && !["BB", "ET"].includes(carCb[1].toUpperCase())) specifiedCarrier = carCb[1].toUpperCase();
        else if (carC && carC[1].length === 2 && !["BB", "ET"].includes(carC[1].toUpperCase())) specifiedCarrier = carC[1].toUpperCase();

        // Rebuild carC with tighter boundary: only match if the 2-letter code is followed by end-of-relevance chars
        // This prevents FQCBECONOMY from matching carC as 'BE'
        const carCStrict = cmd.match(/^FQC([A-Z0-9]{2})(?:\/|\*|\$|$)/i);
        if (!carSlashC && !carBbc && !carCb && carC && !carCStrict) {
          specifiedCarrier = null; // Was a false positive (e.g. FQCBECONOMY -> 'BE')
        }

        if (!this.state.segments || !this.state.segments.length) return this.error("NO ITINERARY IN PNR - SELL SEATS FIRST (E.G. N1Y1)");
        const itinerary = this.state.segments;
        const segment = itinerary[0];
        const segCarriers = Array.from(new Set(itinerary.map(s => (s.carrier || "").toUpperCase()).filter(Boolean)));

        let carrier = null;
        if (specifiedCarrier) {
          if (specifiedCarrier === "CB") {
            return this.error("INVALID PLATING CARRIER");
          }
          // If explicit plating carrier override /C<carrier> is given, validate against itinerary:
          if (carSlashC) {
            const partnerMap = {
              "EK": ["FZ"],
              "FZ": ["EK"],
              "SQ": ["TR"],
              "TG": ["WE"]
            };
            const isCarrierValid = segCarriers.some(sc => {
              if (sc === specifiedCarrier) return true;
              const partners = partnerMap[sc] || [];
              return partners.includes(specifiedCarrier);
            });
            if (!isCarrierValid) {
              return this.error("INVALID PLATING CARRIER");
            }
          }
          carrier = specifiedCarrier;
        } else {
          carrier = (segment && segment.carrier) || "BG";
        }

        // Extract Fare Basis if specified:
        let fareBasis = null;
        const fbBracketMatch = raw.match(/\[(.*?)\]/);
        const fbAtMatch = raw.match(/@([A-Z0-9]+)/i);
        const fbNamedMatch = raw.match(/^FQCB([A-Z0-9]{3,8})(?:\/|$)/i);
        if (fbBracketMatch) {
          fareBasis = fbBracketMatch[1].trim();
        } else if (fbAtMatch) {
          fareBasis = fbAtMatch[1].trim();
        } else if (fbNamedMatch && !["ECONOMY", "BUSINESS"].includes(fbNamedMatch[1].toUpperCase()) && fbNamedMatch[1].length > 2) {
          fareBasis = fbNamedMatch[1].toUpperCase();
        } else if (fbNamedMatch && ["ECONOMY", "BUSINESS"].includes(fbNamedMatch[1].toUpperCase())) {
          fareBasis = fbNamedMatch[1].toUpperCase();
        } else {
          const bookedCls = (itinerary[0] && itinerary[0].soldClass) ? itinerary[0].soldClass.toUpperCase() : "W";
        if (carrier === "TG") {
          fareBasis = isBusns ? "ZLOST" : (isPromo ? "YPCR3M" : (isBestBuy ? "WLOSV" : bookedCls + "LOSV"));
        } else if (carrier === "PG") {
          fareBasis = isBusns ? "JOWDQNBD" : (isPromo ? "YPCR3M" : (isBestBuy ? "VOWDQNBD" : bookedCls + "OWDQNBD"));
        } else {
          fareBasis = isBusns ? "JEE3M" : (isPromo ? "YPCR3M" : (isBestBuy ? bookedCls + "EE30D" : bookedCls + "EE3M"));
        }
        }

        if (fareBasis && /^[ZJCD]/i.test(fareBasis) && !isBusns) {
          isBusns = true;
        }

        let pCounts = { adt: 0, chd: 0, inf: 0 };
        if (this.state.passengerTypes && this.state.passengerTypes.length) {
          this.state.passengerTypes.forEach(p => {
            if (p.type === "CHD") pCounts.chd++;
            else if (p.type === "INF") pCounts.inf++;
            else pCounts.adt++;
          });
        } else if (this.state.names && this.state.names.length) {
          pCounts.adt = this.state.names.length;
        } else {
          pCounts.adt = 1;
        }

        if (isChd && pCounts.chd === 0) {
          pCounts.chd = 1;
          pCounts.adt = 0;
        }

        // Route+carrier specific pricing table (realistic BDT training prices, for single-segment)
        const carrierPriceTable = {
          "TG": { "DACBKK": { base: 20879, taxes: 11375 }, "BKKDAC": { base: 20879, taxes: 11375 }, "default": { base: 22000, taxes: 11000 } },
          "PG": { "DACBKK": { base: 32121, taxes: 16069 }, "BKKDAC": { base: 32121, taxes: 16069 }, "default": { base: 32121, taxes: 16069 } },
          "BS": { "DACBKK": { base: 19500, taxes: 10200 }, "BKKDAC": { base: 19500, taxes: 10200 }, "DACCGP": { base: 18000, taxes: 9500 }, "default": { base: 19000, taxes: 9800 } },
          "MH": { "DACKUL": { base: 131076, taxes: 23513 }, "KULDAC": { base: 131076, taxes: 23513 }, "default": { base: 128000, taxes: 22000 } },
          "EK": { "DACDXB": { base: 34071, taxes: 8417 }, "DXBDAC": { base: 34071, taxes: 8417 }, "default": { base: 35000, taxes: 8500 } },
          "QR": { "DACDOH": { base: 45000, taxes: 12000 }, "DOHDAC": { base: 45000, taxes: 12000 }, "default": { base: 46000, taxes: 12500 } },
          "SV": { "DACRUH": { base: 48000, taxes: 13000 }, "RUHDAC": { base: 48000, taxes: 13000 }, "default": { base: 50000, taxes: 13500 } },
          "BG": { "DACDXB": { base: 32000, taxes: 8000 }, "default": { base: 30000, taxes: 7500 } },
          "AI": { "DACDEL": { base: 22000, taxes: 7000 }, "DELDAC": { base: 22000, taxes: 7000 }, "default": { base: 24000, taxes: 7500 } },
          "TK": { "DACIST": { base: 43225, taxes: 10000 }, "ISTDAC": { base: 43225, taxes: 10000 }, "default": { base: 43225, taxes: 10000 } },
          "UL": { "DACCMB": { base: 28000, taxes: 8000 }, "CMBDAC": { base: 28000, taxes: 8000 }, "default": { base: 29000, taxes: 8200 } },
          "SQ": { "DACSIN": { base: 55000, taxes: 14000 }, "SINDAC": { base: 55000, taxes: 14000 }, "BKKSIN": { base: 18000, taxes: 6000 }, "default": { base: 56000, taxes: 14500 } },
          "WY": { "DACMCT": { base: 52000, taxes: 13000 }, "default": { base: 53000, taxes: 13500 } },
          "CX": { "DACHKG": { base: 68000, taxes: 15000 }, "default": { base: 70000, taxes: 16000 } },
        };

        let adtBase, adtTaxes;
        if (itinerary.length === 1) {
          // Single segment: use carrier-specific training prices
          const seg0origin = (itinerary[0].origin || "DAC").toUpperCase();
          const seg0dest = (itinerary[0].destination || "BKK").toUpperCase();
          const routeKey = seg0origin + seg0dest;
          const carrierTable = carrierPriceTable[carrier.toUpperCase()];
          if (carrierTable) {
            const priceEntry = carrierTable[routeKey] || carrierTable["default"];
            adtBase = priceEntry.base;
            adtTaxes = priceEntry.taxes;
          } else {
            const q = GalileoFareShop.quoteItinerary(itinerary);
            adtBase = q.base || 26781;
            adtTaxes = q.taxes || 5624;
          }
        } else {
          // Multi-segment: use GalileoFareShop through fare
          const q = GalileoFareShop.quoteItinerary(itinerary);
          adtBase = q.base || 26781;
          adtTaxes = q.taxes || 5624;
        }

        let origAdtBase = adtBase;
        let origAdtTaxes = adtTaxes;

        if (isBusns) {
          if (carrier === "TG") {
            adtBase = 112669;
            adtTaxes = 11375;
          } else {
            adtBase = Math.round(adtBase * 2.5);
            adtTaxes = Math.round(adtTaxes * 1.5);
          }
        } else if (isPromo) {
          adtBase = Math.round(adtBase * 0.90);
        } else if (isBestBuy) {
          // isBestBuy uses listed price as-is (best buy fare already)
        }
        const adtTotal = adtBase + adtTaxes;

        // Child unit fare (75% base, 75% taxes)
        const chdBase = Math.round(origAdtBase * 0.75);
        const chdTaxes = Math.round(origAdtTaxes * 0.75);
        const chdTotal = chdBase + chdTaxes;

        // Infant unit fare (10% base, 10% taxes)
        const infBase = Math.round(origAdtBase * 0.10);
        const infTaxes = Math.round(origAdtTaxes * 0.10);
        const infTotal = infBase + infTaxes;

        const grandBase = (pCounts.adt * adtBase) + (pCounts.chd * chdBase) + (pCounts.inf * infBase);
        const grandTaxes = (pCounts.adt * adtTaxes) + (pCounts.chd * chdTaxes) + (pCounts.inf * infTaxes);
        const grandTotal = (pCounts.adt * adtTotal) + (pCounts.chd * chdTotal) + (pCounts.inf * infTotal);

        const breakdown = [];
        if (pCounts.adt > 0) {
          breakdown.push({ type: "ADT", count: pCounts.adt, base: adtBase, taxes: adtTaxes, total: adtTotal });
        }
        if (pCounts.chd > 0) {
          breakdown.push({ type: "CNN", count: pCounts.chd, base: chdBase, taxes: chdTaxes, total: chdTotal });
        }
        if (pCounts.inf > 0) {
          breakdown.push({ type: "INF", count: pCounts.inf, base: infBase, taxes: infTaxes, total: infTotal });
        }

        this.state.fare = {
          base: grandBase,
          taxes: grandTaxes,
          total: grandTotal,
          carrier: carrier,
          fareBasis: fareBasis,
          isBestBuy: isBestBuy,
          isBusns: isBusns,
          passengers: pCounts,
          breakdown: breakdown,
          adtFare: { base: adtBase, taxes: adtTaxes, total: adtTotal },
          chdFare: pCounts.chd > 0 ? { base: chdBase, taxes: chdTaxes, total: chdTotal } : null,
          infFare: pCounts.inf > 0 ? { base: infBase, taxes: infTaxes, total: infTotal } : null
        };
        this.state.priced = true;
        this.state.filedFare = true;
        this.state.dirty = true;
        this.state.filedFares = this.state.filedFares || [];
        this.state.filedFares.push(this.state.fare);

        const passengerCount = pCounts.adt + pCounts.chd;
        // TG: 1PC (Economy) / 2PC (Business), BS: 30K, Business: 3PC, others: 1PC
        const allowance = carrier === "BS" ? "30K" : (carrier === "TG" ? (isBusns ? "2PC" : "1PC") : (isBusns ? "3PC" : "1PC"));
        const singleRoute = (itinerary[0].origin || "DAC") + (itinerary[0].destination || "BKK");
        // For multi-segment, baggage shows each leg: DACBKK/BKKSIN
        const route = itinerary.length > 1 ? itinerary.map(item => (item.origin || "DAC") + (item.destination || "BKK")).join("/") : singleRoute;
        // Use route for baggage carrier line (matches real Smartpoint)
        const baggageRoute = route;

        const lines = [];
        if (isBestBuy) {
          lines.push("          *** BEST BUY QUOTATION ***");
          if (isBusns) {
            lines.push("    LOWEST FARE AVAILABLE FOR CABIN SPECIFIED");
            const segN = (itinerary[0] && (itinerary[0].segNum || 1)) || 1;
            const rebookCls = carrier === "TG" ? "Z" : "J";
            lines.push("          *** REBOOK BF SEGMENTS " + segN + rebookCls + " ***");
          } else {
            lines.push("    LOWEST FARE AVAILABLE FOR THIS ITINERARY");
            const firstSegCls = (itinerary[0] && itinerary[0].soldClass) ? itinerary[0].soldClass.toUpperCase() : "W";
            const targetCls = carrier === "PG" ? "V" : "W";
            if (firstSegCls === targetCls || firstSegCls === "K" || firstSegCls === "Q") {
              lines.push("        *** NO REBOOK REQUIRED ***");
            } else {
              const segN = (itinerary[0] && (itinerary[0].segNum || 1)) || 1;
              lines.push("        *** REBOOK BF SEGMENTS " + segN + targetCls + " ***");
            }
          }
        } else if (isPromo) {
          lines.push("FARE TYPE: PRIVATE CORPORATE RATE (*PCR) PRICING");
        } else {
          lines.push("FARE TYPE: " + (itinerary.length > 1 ? "COMBINED " + itinerary.length + "-SEGMENT ITINERARY" : "SINGLE SEGMENT"));
        }
        let fqgNum = 0;
        if (pCounts.adt > 0) {
          fqgNum++;
          lines.push("PSGR          FARE      TAXES     TOTAL PSG DES");
          lines.push("FQG " + String(fqgNum).padEnd(2) + "   BDT  " + String(adtBase).padStart(7) + "  " + String(adtTaxes).padStart(7) + "  " + String(adtTotal).padStart(7) + " ADT");
          if (fareBasis && !isBestBuy) {
            lines.push("  FB: " + String(fareBasis).padEnd(10) + " NVB: " + (segment.date || "15NOV") + " NVA: " + (segment.date || "15NOV"));
          }
        }

        if (pCounts.chd > 0) {
          fqgNum++;
          lines.push("PSGR          FARE      TAXES     TOTAL PSG DES");
          lines.push("FQG " + String(fqgNum).padEnd(2) + "   BDT  " + String(chdBase).padStart(7) + "  " + String(chdTaxes).padStart(7) + "  " + String(chdTotal).padStart(7) + " CNN");
          if (fareBasis && !isBestBuy && pCounts.adt === 0) {
            lines.push("  FB: " + String(fareBasis).padEnd(10) + " NVB: " + (segment.date || "15NOV") + " NVA: " + (segment.date || "15NOV"));
          }
        }

        if (pCounts.inf > 0) {
          fqgNum++;
          lines.push("PSGR          FARE      TAXES     TOTAL PSG DES");
          lines.push("FQG " + String(fqgNum).padEnd(2) + "   BDT  " + String(infBase).padStart(7) + "  " + String(infTaxes).padStart(7) + "  " + String(infTotal).padStart(7) + " INF");
        }

        lines.push("    GUARANTEED AT TIME OF TICKETING");
        lines.push("GRAND TOTAL INCLUDING TAXES ****     BDT      " + grandTotal);
        lines.push("  **FEE TOTAL                                   0");
        lines.push("  **PRICE INCLUDING TAXES AND FEES              " + grandTotal);
        lines.push("FEES BASED ON CURRENT REQUEST-SEE >FO. FOR ALL TICKET FEES");
        lines.push("    **CARRIER MAY OFFER ADDITIONAL SERVICES**SEE >" + (isBestBuy ? "FQBB/DASO·" : "FQ/DASO·"));
        if (isVcc) {
          lines.push("    VALIDATING CARRIER CODE: " + carrier + " VERIFIED");
        }
        if (isCoc) {
          lines.push("    CURRENCY OF COUNTRY (COC): BDT VERIFIED");
        }
        const ptcLabel = isPromo ? "PCR" : ((isChd && pCounts.adt === 0) ? "CNN" : "ADT");
        if (isChd) {
          lines.push("  CNN     PRIVATE FARE SELECTED/BEST FARE FOR THIS PASSENGER");
        } else if (isPromo) {
          lines.push("  PCR     BEST FARE FOR THIS PASSENGER");
        }
        lines.push("  " + ptcLabel + "     RATE USED IN EQU TOTAL IS BSR 1USD - 123.54BDT");
        lines.push("  " + ptcLabel + "     LAST DATE TO PURCHASE TICKET: " + (this.state.ticketing ? this.state.ticketing.replace("TAU/", "").replace("tau/", "") + "26" : "20DEC26") + "");
        lines.push("  " + ptcLabel + "     FARE HAS A PLATING CARRIER RESTRICTION");
        lines.push("  " + ptcLabel + "     E-TKT REQUIRED");
        if (fbAtMatch && fareBasis) {
          lines.push("             THE FOLLOWING RULES FOR FARE BASIS " + fareBasis);
          lines.push("                   - RULES VALIDATION MET");
          lines.push(" FARE BASIS CODE MODIFIED FARE");
        }
        if (isBestBuy) {
          lines.push("TO REBOOK ENTER >FQBBK·");
        }
        if (!this.state.names.length) {
          lines.push("UNABLE TO FILE - NEED NAMES");
        }
        const baggageCarrier = (carrier === "PG" && ((segment.operatedBy || "").includes("TG") || (segment.airline_full || "").toUpperCase().includes("THAI"))) ? "TG" : carrier;
        const baggagePaxLabel = isPromo ? "PCR" : ((isChd && pCounts.adt === 0) ? "CNN" : "ADT");
        lines.push("BAGGAGE ALLOWANCE");
        lines.push(baggagePaxLabel);
        lines.push("  " + baggageCarrier + " " + baggageRoute + "  " + allowance);
        if (baggageCarrier === "TG") {
          if (isBusns) {
            lines.push("    BAG 1 - NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM");
            lines.push("    BAG 2 - NO FEE       UPTO70LB/32KG AND UPTO62LI/158LCM");
          } else {
            lines.push("    BAG 1 - NO FEE       UPTO50LB/23KG AND UPTO62LI/158LCM");
            lines.push("    BAG 2 - 9884 BDT     FIRST BAG");
          }
        } else {
          if (!isBusns) {
            lines.push("    BAG 1 - NO FEE     UPTO50LB/23KG AND UPTO62LI/158LCM");
            lines.push("    BAG 2 - 9884 BDT   FIRST BAG");
          } else {
            lines.push("    BAG 1 - CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE");
            lines.push("    BAG 2 - CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE");
          }
        }
        lines.push("  VIEWTRIP.TRAVELPORT.COM/BAGGAGEPOLICY/" + baggageCarrier);
        if (pCounts.chd > 0 && !isChd) {
          lines.push("");
          lines.push("CNN");
          lines.push("  " + baggageCarrier + " " + baggageRoute + "  " + allowance);
          lines.push("    BAG 1 - CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE");
          lines.push("    BAG 2 - CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE");
        }
        if (pCounts.inf > 0) {
          lines.push("");
          lines.push("INF");
          lines.push("  " + baggageCarrier + " " + baggageRoute + "  10K");
          lines.push("    BAG 1 - CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE");
        }
        lines.push("");
        lines.push("CARRY ON ALLOWANCE");
        lines.push("  " + baggageCarrier + " " + baggageRoute + "  07K");
        lines.push("    BAG 1 - CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE");
        lines.push("    BAG 2 - CHGS MAY APPLY IF BAGS EXCEED TTL WT ALLOWANCE");
        lines.push("");
        lines.push("BAGGAGE DISCOUNTS MAY APPLY BASED ON FREQUENT FLYER STATUS/");
        lines.push("ONLINE CHECKIN/FORM OF PAYMENT/MILITARY/ETC.");
        lines.push("");
        lines.push("ADT");
        lines.push("");
        lines.push("DESCRIPTION                 BASE BDT      TAX BDT     TOTAL BDT");
        lines.push("TKT FEES - " + carrier);
        lines.push("  NO FEES APPLY                    0            0             0");
        lines.push("CC FEES - " + carrier);
        lines.push("  NO FEES APPLY                    0            0             0");
        lines.push("                               ------       ------        ------");
        lines.push("                                    0            0             0");
        lines.push("");
        lines.push("                            SUB TOTAL                   " + grandTotal);
        lines.push("                            FEE TOTAL                        0");
        lines.push("                            GRAND TOTAL                 " + grandTotal);
        lines.push("");
        // Store fare component data for «Display Rules» feature
        this.state.fareComponents = itinerary.map((seg, idx) => ({
          num: idx + 1,
          route: (seg.origin || "DAC") + "-" + (seg.destination || "BKK"),
          basis: fareBasis || (isBestBuy ? "WLOSV" : "YEE3M"),
          carrier: carrier
        }));
        lines.push("\u00abDisplay Rules\u00bb");

        // Save command for «Back to Fare Components» restore
        this.state.lastFareQuoteCmd = raw.trim();

        return { kind: "fare-load", lines, passengerCount };
      }

      const fqtMatch = cmd.match(/^FQ\.T(?:(\d{2}[A-Z]{3}\d{2}))?(?:\/S(\d+)(?:-(\d+))?)?$/);
      if (fqtMatch) {
        const tkt = this.state.issuedTicket || (this.lastSavedPnr && this.lastSavedPnr.issuedTicket);
        if (!tkt) return this.error("RETRIEVE A TICKETED PNR FIRST - USE *LOCATOR THEN *TE");
        const coupons = tkt.coupons || [];
        const startCpn = fqtMatch[2] ? Number(fqtMatch[2]) : null;
        const endCpn = fqtMatch[3] ? Number(fqtMatch[3]) : startCpn;
        const selected = startCpn
          ? coupons.filter(coupon => coupon.cpn >= startCpn && coupon.cpn <= endCpn)
          : coupons;
        const usedSelected = selected.filter(coupon => coupon.status === "F");
        const quoteUsed = startCpn ? usedSelected.length === selected.length && selected.length > 0 : false;
        const fareValue = quoteUsed ? Number(tkt.flownBaseFare || 0) : Number(tkt.unusedBaseFare != null ? tkt.unusedBaseFare : tkt.baseFare || 0);
        const taxValue = quoteUsed ? Number(tkt.flownTaxes || 0) : Number(tkt.unusedTaxes != null ? tkt.unusedTaxes : (tkt.taxes || []).reduce((sum, tax) => sum + Number(tax.amount || 0), 0));
        const issueDate = fqtMatch[1] || tkt.issueDate || "";
        return {
          lines: [
            "FQ.T - TICKET FARE / HISTORICAL USED-FARE REVIEW",
            issueDate ? `TICKET ISSUE DATE     : ${issueDate}` : null,
            "FARE COMPONENT           BASIS / STATUS",
            ...coupons.map((coupon, index) => `  ${index + 1}  ${coupon.route}     ${coupon.status === "F" ? "USED" : "OPEN"}`),
            startCpn ? `REQUESTED SEGMENTS     : S${startCpn}${endCpn && endCpn !== startCpn ? "-" + endCpn : ""}` : "REQUESTED SEGMENTS     : ALL TICKET COMPONENTS",
            quoteUsed ? `CASH AMT USED (EX TAX) : BDT ${fareValue}` : `UNUSED FARE VALUE      : BDT ${fareValue}`,
            quoteUsed ? `USED TAXES             : BDT ${taxValue}` : `UNUSED TAX VALUE       : BDT ${taxValue}`,
            `COMPONENT TOTAL        : BDT ${fareValue + taxValue}`,
            "USE THIS USED-FARE TOTAL AS CASH AMT USED ON TRN1",
            "ENTER FZUSD125BDT TO CONVERT A CAT 16 USD PENALTY"
          ].filter(Boolean),
          kind: "fare-ticket"
        };
      }

      if (cmd === "FQ" || /^FQ[A-Z]{3}(\/ET)?$/.test(cmd) || fareSearch || roundTripFareSearch) {
        let pCounts = { adt: 0, chd: 0, inf: 0 };
        if (fareSearch || roundTripFareSearch) {
          pCounts = { adt: passengers.adt || 1, chd: passengers.chd || 0, inf: passengers.inf || 0 };
        } else if (this.state.passengerTypes && this.state.passengerTypes.length) {
          this.state.passengerTypes.forEach(p => {
            if (p.type === "CHD") pCounts.chd++;
            else if (p.type === "INF") pCounts.inf++;
            else pCounts.adt++;
          });
        } else if (this.state.names && this.state.names.length) {
          pCounts.adt = this.state.names.length;
        } else {
          pCounts = passengers;
        }
        if (pCounts.adt < 1 || pCounts.adt + pCounts.chd > 9) return this.error("FARE SHOP SUPPORTS 1 TO 9 PASSENGERS");
        const seg  = this.state.segments[0] || {
          origin: fareSearch ? fareSearch[1] : (roundTripFareSearch ? roundTripFareSearch[1] : "DAC"),
          destination: fareSearch ? fareSearch[3] : (roundTripFareSearch ? roundTripFareSearch[3] : "BKK"),
          date: fareSearch ? fareSearch[2] : (roundTripFareSearch ? roundTripFareSearch[2] : "16DEC")
        };
        const returnDate = roundTripFareSearch && roundTripFareSearch[4];
        const fare = GalileoFareShop.quote(seg, returnDate);
        if (fsCarrier) {
          const matching = fare.options.filter(opt => opt.legs.some(l => l.carrier === fsCarrier));
          if (matching.length) {
            fare.options = matching;
          } else {
            fare.options.forEach(opt => {
              opt.legs.forEach(l => { l.carrier = fsCarrier; });
              if (opt.returnLegs) opt.returnLegs.forEach(l => { l.carrier = fsCarrier; });
            });
          }
        }
        if (fsBusns) {
          fare.options.forEach(opt => {
            opt.cls = "J";
            opt.total = Math.round(opt.total * 2.2);
            opt.suffix = "JTRAIN";
          });
        }
        fare.roundTrip = !!roundTripFareSearch;
        fare.passengers = pCounts;
        fare.options.forEach(option => {
          option.partyTotal = Math.round(
            option.total * pCounts.adt +
            (option.total * 0.75) * pCounts.chd +
            (option.total * 0.10) * pCounts.inf
          );
        });

        const selectedOpt = fare.options[0] || {};
        const adtUnitTotal = selectedOpt.total || fare.total || 0;
        const adtUnitBase = Math.round(adtUnitTotal / 1.21);
        const adtUnitTaxes = adtUnitTotal - adtUnitBase;

        const chdUnitBase = Math.round(adtUnitBase * 0.75);
        const chdUnitTaxes = Math.round(adtUnitTaxes * 0.75);
        const chdUnitTotal = chdUnitBase + chdUnitTaxes;

        const infUnitBase = Math.round(adtUnitBase * 0.10);
        const infUnitTaxes = Math.round(adtUnitTaxes * 0.10);
        const infUnitTotal = infUnitBase + infUnitTaxes;

        const breakdown = [
          { type: "ADT", count: pCounts.adt, base: adtUnitBase, taxes: adtUnitTaxes, total: adtUnitTotal }
        ];
        if (pCounts.chd > 0) {
          breakdown.push({ type: "CNN", count: pCounts.chd, base: chdUnitBase, taxes: chdUnitTaxes, total: chdUnitTotal });
        }
        if (pCounts.inf > 0) {
          breakdown.push({ type: "INF", count: pCounts.inf, base: infUnitBase, taxes: infUnitTaxes, total: infUnitTotal });
        }

        const totalAll = (pCounts.adt * adtUnitTotal) + (pCounts.chd * chdUnitTotal) + (pCounts.inf * infUnitTotal);
        fare.breakdown = breakdown;
        fare.total = totalAll;
        fare.base = (pCounts.adt * adtUnitBase) + (pCounts.chd * chdUnitBase) + (pCounts.inf * infUnitBase);
        fare.taxes = totalAll - fare.base;

        this.state.fare   = fare;
        this.state.priced = true;
        // FQ only quotes the fare; filedFare is set only after FXP or FBF.
        const lines = ["TTL OF " + (roundTripFareSearch ? "31" : "59") + "  PRICING OPTIONS AND " + (roundTripFareSearch ? "70" : "78") + "    ITINERARY OPTIONS RETURNED", ""];
        fare.options.forEach((option, index) => {
          const total = String(option.partyTotal);
          lines.push(`PRICING OPTION ${index + 1}${" ".repeat(24)}TOTAL AMOUNT ${total} BDT`);
          let paxDesc = "ADT " + pCounts.adt;
          if (pCounts.chd > 0) paxDesc += "   CHD " + pCounts.chd;
          if (pCounts.inf > 0) paxDesc += "   INF " + pCounts.inf;
          lines.push(paxDesc.padEnd(45) + "TAX INCLUDED");
          const itinerary = option.legs.concat(roundTripFareSearch ? option.returnLegs : []);
          itinerary.forEach((leg, legIndex) => {
            lines.push(`${legIndex + 1}  ${leg.carrier.padEnd(4)} ${leg.number.padEnd(5)} ${option.cls}  ${leg.date} ${leg.origin} ${leg.destination}   ${leg.depart} ${leg.arrive}    ${leg.equip}       ${option.suffix}`);
          });
          lines.push("«BOOK»   +TQ");
          lines.push("                         D  R", "");
        });
        lines.push("ENTER FXP TO STORE FARE");
        return { lines, kind: "fare" };
      }

      // ── MULTI-CITY / OPEN-JAW FS HANDLER ──
      if (multiCity && multiCity.legs && multiCity.legs.length >= 2) {
        const legs = multiCity.legs;
        // Validate all airports
        for (const leg of legs) {
          if (!GalileoAirports.find(leg.orig)) return this.error(`AIRPORT NOT FOUND - ${leg.orig} - USE C CODE`);
          if (!GalileoAirports.find(leg.dest)) return this.error(`AIRPORT NOT FOUND - ${leg.dest} - USE C CODE`);
        }
        const pCounts = { adt: passengers.adt || 1, chd: passengers.chd || 0, inf: passengers.inf || 0 };
        if (pCounts.adt < 1 || pCounts.adt + pCounts.chd > 9) return this.error("FARE SHOP SUPPORTS 1 TO 9 PASSENGERS");

        function getDOW(dateStr) {
          if (!dateStr) return "  ";
          const m = dateStr.match(/^(\d{2})([A-Z]{3})/);
          if (!m) return "  ";
          const day = parseInt(m[1], 10);
          const months = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
          const monIdx = months.indexOf(m[2]);
          if (monIdx === -1) return "  ";
          const year = monIdx < new Date().getMonth() ? new Date().getFullYear() + 1 : new Date().getFullYear();
          const d = new Date(year, monIdx, day);
          const days = ["SU","MO","TU","WE","TH","FR","SA"];
          return days[d.getDay()] || "  ";
        }

        const legQuotes = legs.map(leg => {
          const seg = { origin: leg.orig, destination: leg.dest, date: leg.date };
          let opts = GalileoFareShop.pricingOptions(seg);
          if (fsCarrier) {
            const matching = opts.filter(opt => opt.legs.some(l => l.carrier === fsCarrier));
            if (matching.length) {
              opts = matching;
            } else {
              opts.forEach(opt => {
                opt.legs.forEach(l => { l.carrier = fsCarrier; });
                if (opt.returnLegs) opt.returnLegs.forEach(l => { l.carrier = fsCarrier; });
              });
            }
          }
          if (fsBusns) {
            opts.forEach(opt => {
              opt.cls = "J";
              opt.total = Math.round(opt.total * 2.2);
              opt.suffix = "JTRAIN";
            });
          }
          return opts;
        });

        const ttlLine = legs.length >= 3
          ? "TTL OF 29  PRICING OPTIONS AND > 400 ITINERARY OPTIONS RETURNED"
          : "TTL OF 14  PRICING OPTIONS AND 18    ITINERARY OPTIONS RETURNED";

        const lines = [ttlLine, ""];
        const optionCount = 5;
        const optionsList = [];

        for (let optIdx = 0; optIdx < optionCount; optIdx++) {
          let partyTotal = 0;
          let combinedFlights = [];
          let optionCls = "Y";

          legs.forEach((leg, legIdx) => {
            const opts = legQuotes[legIdx] || [];
            const chosen = opts[optIdx % opts.length] || opts[0] || {};
            optionCls = chosen.cls || optionCls;
            const adtTotal = chosen.total || 45000;
            const chdTotal = Math.round(adtTotal * 0.75);
            const infTotal = Math.round(adtTotal * 0.10);
            const legTotal = (pCounts.adt * adtTotal) + (pCounts.chd * chdTotal) + (pCounts.inf * infTotal);
            partyTotal += legTotal;

            const fls = (chosen.legs && chosen.legs.length) ? chosen.legs : [
              { carrier: "BG", number: "101", origin: leg.orig, destination: leg.dest, depart: "0800", arrive: "1000", equip: "738", date: leg.date }
            ];
            fls.forEach(fl => {
              combinedFlights.push({
                carrier: fl.carrier,
                number: String(fl.number),
                cls: chosen.cls || "Y",
                date: fl.date || leg.date,
                origin: fl.origin || leg.orig,
                destination: fl.destination || leg.dest,
                depart: fl.depart || "0800",
                arrive: fl.arrive || "1000",
                equip: fl.equip || "738",
                suffix: chosen.suffix || "TRAINING"
              });
            });
          });

          optionsList.push({ partyTotal, flights: combinedFlights, cls: optionCls });

          // Header
          lines.push(`PRICING OPTION ${optIdx + 1}`.padEnd(36) + "TOTAL AMOUNT " + String(partyTotal).padStart(6) + " BDT");
          let paxDesc = "ADT";
          if (pCounts.adt > 1) paxDesc += " " + pCounts.adt;
          if (pCounts.chd > 0) paxDesc += "   CHD " + pCounts.chd;
          if (pCounts.inf > 0) paxDesc += "   INF " + pCounts.inf;
          lines.push(paxDesc.padEnd(36) + "TAX INCLUDED");

          // Flights
          combinedFlights.forEach((fl, flIdx) => {
            const flIndexStr = String(flIdx + 1).padEnd(3);
            const carrierStr = fl.carrier.padEnd(5);
            const numStr = fl.number.padEnd(5);
            const clsStr = fl.cls.padEnd(3);
            const dateStr = fl.date.padEnd(6);
            const origStr = fl.origin.padEnd(5);
            const destStr = fl.destination.padEnd(6);
            const depStr = fl.depart.padEnd(5);
            const hasNextDay = fl.arrive.includes("#") || fl.arrive.startsWith("#");
            const cleanArrive = fl.arrive.replace(/#/g, "").trim();
            const arrStr = hasNextDay ? (cleanArrive + " #  ") : cleanArrive.padEnd(8);
            const dowStr = getDOW(fl.date).padEnd(10);
            const equipStr = fl.equip.padEnd(10);
            const suffixStr = fl.suffix;

            lines.push(`${flIndexStr}${carrierStr}${numStr}${clsStr}${dateStr}${origStr}${destStr}${depStr}${arrStr}${dowStr}${equipStr}${suffixStr}`);
          });

          lines.push("«BOOK»   +TQ");
          lines.push("                              D  R  +5");
          lines.push("");
        }

        const selectedOpt = optionsList[0] || {};
        const adtTotal = selectedOpt.partyTotal || 0;
        const adtBase = Math.round(adtTotal / 1.21);
        const adtTaxes = adtTotal - adtBase;
        this.state.fare = {
          total: adtTotal,
          base: adtBase,
          taxes: adtTaxes,
          currency: "BDT",
          passengers: pCounts,
          breakdown: [
            { type: "ADT", count: pCounts.adt, base: adtBase, taxes: adtTaxes, total: adtTotal }
          ],
          options: optionsList.map(opt => ({
            partyTotal: opt.partyTotal,
            total: opt.partyTotal,
            cls: opt.cls,
            legs: opt.flights
          }))
        };
        this.state.priced = true;
        return { lines, kind: "fare" };
      }

      // ── HISTORICAL FARE DISPLAY & CAT 16 RULES: FD... ──
      const fdMatch = cmd.match(/^FD(\d{2}[A-Z]{3}(?:\d{2})?)([A-Z]{3})([A-Z]{3})(?:\/([A-Z0-9]{2,3}))?(-[A-Z]{2,4})?(?:\.T(\d{2}[A-Z]{3}(?:\d{2})?))?(?:::?([A-Z]{3}))?$/);
      if (fdMatch) {
        const [, dateStr, orig, dest, carrierPref, fareType, tktDate, currPref] = fdMatch;
        const carrier = carrierPref || (this.state.segments[0] && this.state.segments[0].carrier) || "BG";
        const type = (fareType || "-OW").replace(/^-/, "");
        const curr = currPref || "BDT";
        const isBG = carrier === "BG" || orig === "ZYL" || dest === "ZYL";
        const tDate = tktDate || (isBG ? "26MAR20" : "21DEC21");
        if (isBG) {
          return {
            lines: [
              `FD${dateStr}${orig}${dest}/${carrier}-${type}::${curr}${tktDate ? ".T" + tktDate : ""}`,
              `CARRIER: ${carrier}   ROUTE: ${orig}-${dest}   TYPE: ${type}   CURRENCY: ${curr}`,
              `HISTORICAL FARE DISPLAY AS OF ${tDate} - FARES IN ${curr}`,
              "-----------------------------------------------------------------",
              "LN  FARE BASIS   OW BDT     CLS  PENALTY / RULES SUMMARY",
              "01  YOWBD        3200       Y    CHANGES BDT 500 / CANCEL BDT 1000",
              "02  KOWBD        2800       K    CHANGES BDT 500 / CANCEL BDT 1000",
              "03  MOWBD        2400       M    CHANGES BDT 800 / NON-REFUNDABLE",
              "-----------------------------------------------------------------",
              "RULE CATEGORY 16 (PENALTIES):",
              "  * CANCELLATION CHARGE          : BDT 1000 (DEDUCTED FROM REFUND)",
              "  * REISSUE / DATE CHANGE CHARGE : BDT 500",
              "  * TICKET VALIDITY              : 1 YEAR FROM DATE OF ISSUE",
              "",
              "ENTRY TO INITIATE FULL REFUND   : TRNE99755555555555/26MAR20",
              "ENTRY TO DISPLAY TICKET RECORD   : *TE/99755555555555"
            ],
            kind: "rules"
          };
        }
        return {
          lines: [
            `FD${dateStr}${orig}${dest}/${carrier}-${type}${tktDate ? ".T" + tktDate : ""}`,
            `CARRIER: ${carrier}   ROUTE: ${orig}-${dest}   TYPE: ${type}`,
            `HISTORICAL FARE DISPLAY AS OF ${tDate} - FARES IN BDT`,
            "-----------------------------------------------------------------",
            "LN  FARE BASIS   OW BDT     CLS  PENALTY / RULES SUMMARY",
            "01  YOWBD        65000      Y    CHANGES BDT 5000 / NON-REF",
            "02  MOWBD        52000      M    CHANGES BDT 6768 / NON-REF",
            "03  QOWBD        43225      Q    CHANGES BDT 6768 / CANCEL BDT 10000",
            "04  WOWBD        38000      W    CHANGES BDT 8000 / NON-REF",
            "-----------------------------------------------------------------",
            "RULE CATEGORY 16 (PENALTIES):",
            "  * REISSUE / DATE CHANGE CHARGE : BDT 6768 (TAX CODE XP)",
            "  * CANCELLATION CHARGE          : BDT 10000 (TAX CODE CP)",
            "  * TICKET VALIDITY              : 1 YEAR FROM DATE OF ISSUE",
            "",
            "ENTRY FOR FARE BUILD SCREEN      : *FB1",
            "ENTRY TO DELETE PAID TAX         : FBUTAX1/",
            "ENTRY TO ADD TAX DIFFERENCE      : FBUTAX1/4 TR",
            "ENTRY TO ADD REISSUE CHARGE      : FBUTAX2/6768XP",
            "ENTRY TO RECALCULATE FARE BUILD  : FBUTTL/"
          ],
          kind: "rules"
        };
      }

      // ── FARE BUILD DISPLAY: *FB1 or *FB ──
      if (cmd === "*FB1" || cmd === "*FB") {
        if (!this.state.fareBuild) {
          const tkt = this.state.issuedTicket || (this.lastSavedPnr && this.lastSavedPnr.issuedTicket);
          const seg1 = this.state.segments[0] || { carrier: "TK", origin: "DAC", destination: "DXB" };
          const seg2 = this.state.segments[1];
          const routeStr = seg2 ? `${seg1.origin} ${seg1.carrier} ${seg1.destination} ${seg2.carrier} ${seg2.destination}` : `${seg1.origin} ${seg1.carrier} ${seg1.destination}`;
          const baseFare = tkt ? tkt.baseFare : (this.state.fare ? (this.state.fare.base || 43225) : 43225);
          const defaultTaxes = tkt ? clone(tkt.taxes) : [
            { num: 1, amount: 5000, code: "BD", desc: "Embarkation Tax" },
            { num: 2, amount: 3000, code: "UT", desc: "Security Charge" },
            { num: 3, amount: 2000, code: "E5", desc: "Customs Fee" }
          ];
          const total = baseFare + defaultTaxes.reduce((s, t) => s + t.amount, 0);
          this.state.fareBuild = {
            paxNum: 1,
            paxName: (this.state.names[0] || "1-RAHMAN/MD HAFIZUR MR").replace(/^\d+-/, ""),
            route: routeStr,
            baseFare: baseFare,
            taxes: defaultTaxes,
            total: total,
            fop: "CASH"
          };
        }
        return this._renderFareBuildScreen();
      }

      const fbuFareMatch = cmd.match(/^FBUFARE\/(?:[A-Z]{3}\s*)?(\d+(?:\.\d{1,2})?)$/);
      if (fbuFareMatch) {
        if (!this.state.fareBuild) return this.error("OPEN FARE BUILD FIRST - ENTER *FB1");
        this.state.fareBuild.baseFare = Number(fbuFareMatch[1]);
        return { lines: [`FBUFARE - BASE FARE UPDATED: BDT ${this.state.fareBuild.baseFare}`, "ENTER FBUTTL/ TO RECALCULATE THE FILED TOTAL"] };
      }

      // ── FARE BUILD UPDATE: DELETE TAX (FBUTAX1/) ──
      const fbuDelTax = cmd.match(/^FBUTAX(\d+)\/$/);
      if (fbuDelTax) {
        if (!this.state.fareBuild) return this.error("OPEN FARE BUILD FIRST - ENTER *FB1");
        const taxNum = parseInt(fbuDelTax[1], 10);
        this.state.fareBuild.taxes = this.state.fareBuild.taxes.filter(t => t.num !== taxNum);
        return {
          lines: [
            `FBUTAX${taxNum}/`,
            `TAX ${taxNum} DELETED`,
            "ENTER FBUTAX... TO ADD/UPDATE TAX OR FBUTTL/ TO RECALCULATE"
          ]
        };
      }

      // ── FARE BUILD UPDATE: ADD/UPDATE TAX (FBUTAX1/4 TR or FBUTAX2/6768XP) ──
      const fbuTaxMatch = cmd.match(/^FBUTAX(\d+)\/([+-]?\d+(?:\.\d{1,2})?)\s*([A-Z0-9]{2})$/);
      if (fbuTaxMatch) {
        if (!this.state.fareBuild) return this.error("OPEN FARE BUILD FIRST - ENTER *FB1");
        const taxNum = parseInt(fbuTaxMatch[1], 10);
        const amount = Number(fbuTaxMatch[2]);
        const code = fbuTaxMatch[3].toUpperCase();
        const existing = this.state.fareBuild.taxes.find(t => t.num === taxNum);
        const isPenalty = code === "XP" || code === "CP";
        if (existing) {
          existing.amount = amount;
          existing.code = code;
          existing.desc = isPenalty ? "Reissue Penalty Charge" : "Airport / Gov Tax";
        } else {
          this.state.fareBuild.taxes.push({
            num: taxNum,
            amount: amount,
            code: code,
            desc: isPenalty ? "Reissue Penalty Charge" : "Airport / Gov Tax"
          });
        }
        this.state.fareBuild.taxes.sort((a, b) => a.num - b.num);
        return {
          lines: [
            `FBUTAX${taxNum}/${amount} ${code}`,
            `TAX ${taxNum} UPDATED: BDT ${amount} ${code}${isPenalty ? " (REISSUE CHARGE)" : ""}`,
            "ENTER FBUTTL/ TO RECALCULATE FARE BUILD"
          ]
        };
      }

      // ── FARE BUILD UPDATE: RECALCULATE TOTAL (FBUTTL/) ──
      if (cmd === "FBUTTL/" || cmd === "FBUTTL") {
        if (!this.state.fareBuild) return this.error("OPEN FARE BUILD FIRST - ENTER *FB1");
        const fb = this.state.fareBuild;
        const taxTotal = fb.taxes.reduce((sum, t) => sum + t.amount, 0);
        fb.total = fb.baseFare + taxTotal;
        const taxLines = fb.taxes.map(t => `TAX${t.num}  BDT    ${String(t.amount).padStart(4)} ${t.code}  (${t.desc})`);
        return {
          lines: [
            "FBUTTL/ - FARE RECALCULATED OK",
            "--------------------- FARE BUILD PASSENGER 1 ---------------------",
            `PAX       : 1.1 ${fb.paxName}`,
            `ROUTING   : ${fb.route}`,
            `FARE CALC : ${fb.route} M/IT BDT${fb.baseFare} END`,
            `BASE FARE : BDT   ${fb.baseFare}`,
            ...taxLines,
            `TOTAL     : BDT   ${fb.total}`,
            `FOP       : ${fb.fop}`,
            "------------------------------------------------------------------",
            "ENTER FBF TO GENERATE AND STORE MANUAL FARE"
          ],
          kind: "fare-build"
        };
      }

      // ── FILE MANUAL FARE: FBF ──
      if (cmd === "FBF") {
        if (!this.state.fareBuild) return this.error("OPEN AND BUILD FARE FIRST - ENTER *FB1");
        const fb = this.state.fareBuild;
        const taxTotal = fb.taxes.reduce((sum, t) => sum + t.amount, 0);
        this.state.fare = {
          base: fb.baseFare,
          taxes: taxTotal,
          total: fb.total,
          carrier: (this.state.segments[0] && this.state.segments[0].carrier) || "TK",
          passengers: { adt: 1, chd: 0 },
          isManual: true
        };
        this.state.filedFare = true;
        this.state.storedFare = true;
        this.state.priced = true;
        return {
          lines: [
            "FBF - MANUAL FARE STORED",
            "FB1 FILED AS FF1",
            `TOTAL AMOUNT : BDT ${fb.total}`,
            "NEXT STEPS:",
            "  1. R.R THEN ER (SAVE FARE TO PNR)",
            "  2. TKPFEX[TKT_NO] OR TMU1FEX[TKT_NO] (EXCHANGE FILL-IN)",
            "  3. TMU1Z0/FINVAGT*AGENT (SET TICKETING MODIFIER)",
            "  4. R.R THEN ER",
            "  5. TKPDTD (ISSUE REISSUED TICKET)"
          ],
          kind: "fare-file"
        };
      }

      // ── TICKET MODIFIER: EXCHANGE (TMU1FEX...) ──
      const tmuExMatch = cmd.match(/^TMU1FEX(.*)$/);
      if (tmuExMatch) {
        const rawTkt = tmuExMatch[1].trim().replace(/\s+/g, "");
        const prepared = this.prepareExchange(rawTkt);
        if (prepared.error) return this.error(prepared.error);
        const { ticket: tkt, review } = prepared;
        const partial = review.exchangeType === "partial";
        return {
          lines: [
            `TMU1FEX - ${partial ? "PARTIALLY USED" : "UNUSED"} TICKET EXCHANGE RECORDED`,
            `ORIGINAL TICKET NO  : ${tkt.ticketNumber}`,
            partial ? `FLOWN COUPON VALUE   : BDT ${review.flownBase + review.flownTaxes} (NOT REUSED)` : null,
            partial ? `UNUSED COUPON VALUE  : BDT ${review.originalTotal}` : `ORIGINAL TOTAL      : BDT ${review.originalTotal}`,
            `NEW FARE TOTAL      : BDT ${review.newTotal}`,
            `FARE DIFFERENCE     : BDT ${review.fareDifference}`,
            `TAX DIFFERENCE      : BDT ${review.taxDifference}`,
            `PENALTY INCLUDED    : BDT ${review.penalty}`,
            `${review.settlement >= 0 ? "ADDITIONAL COLLECT" : "RESIDUAL / REFUND"} : BDT ${Math.abs(review.settlement)}`,
            "FORM OF PAYMENT     : EXCH + CASH",
            "EXCHANGE MODIFIERS STORED OK",
            "",
            partial ? "FLOWN COUPON IS RETAINED AS USED. REVIEW *EX AND *TP BEFORE ISSUE." : "REVIEW *EX AND *TP BEFORE ISSUE. THEN ENTER TMU1Z0/FINVAGT*AGENT, R.R AND ER",
            "THEN ENTER TMU1Z0/FINVAGT*AGENT, R.R AND ER"
          ].filter(Boolean),
          kind: "tmu"
        };
      }

      // Manual exchange fill-in review, following the Galileo TKPFEX workflow.
      const tkpfexMatch = cmd.match(/^TKPFEX([0-9-]+)$/);
      if (tkpfexMatch) {
        const prepared = this.prepareExchange(tkpfexMatch[1]);
        if (prepared.error) return this.error(prepared.error);
        const { ticket: tkt, review } = prepared;
        const partial = review.exchangeType === "partial";
        return { lines: [
          `TKPFEX - ${partial ? "PARTIALLY USED" : "UNUSED"} TICKET EXCHANGE FILL-IN (TRAINING REVIEW)`,
          `ORIGINAL TICKET : ${tkt.ticketNumber}  STATUS: ${tkt.status}`,
          partial ? `FLOWN VALUE (RETAINED): BDT ${review.flownBase + review.flownTaxes}` : null,
          partial ? `UNUSED VALUE (EXCHANGE): BDT ${review.originalTotal}` : `ORIGINAL TOTAL  : BDT ${review.originalTotal}`,
          `NEW TOTAL       : BDT ${review.newTotal}`,
          `FARE DIFFERENCE : BDT ${review.fareDifference}`,
          `TAX DIFFERENCE  : BDT ${review.taxDifference}`,
          `CHANGE PENALTY  : BDT ${review.penalty}`,
          `SETTLEMENT      : ${review.settlement >= 0 ? "ADD COLLECT" : "RESIDUAL / REFUND"} BDT ${Math.abs(review.settlement)}`,
          "REVIEW *EX AND *TP. VERIFY FARE, TAXES, PENALTY AND FOP BEFORE ISSUING.",
          partial ? "IMPORTANT: NEW TICKET MAY CONTAIN ONLY THE UNFLOWN REPLACEMENT SEGMENT(S)." : null,
          "NEXT: ADD TICKETING MODIFIERS, SAVE THE PNR AND ISSUE THE EXCHANGE TICKET."
        ].filter(Boolean), kind: "exchange-mask" };
      }

      if (cmd === "*EX" || cmd === "*TP") {
        const review = this.state.exchangeReview;
        if (!review) return this.error("NO EXCHANGE REVIEW - ENTER TKPFEX[TICKET] OR TMU1FEX[TICKET] FIRST");
        const partial = review.exchangeType === "partial";
        if (cmd === "*EX") return { lines: [
          `*EX - ${partial ? "PARTIALLY USED" : "UNUSED"} TICKET EXCHANGE REVIEW`,
          `ORIGINAL TICKET : ${review.originalTicket}`,
          partial ? `FLOWN COUPON VALUE (RETAINED): BDT ${review.flownBase + review.flownTaxes}` : null,
          `${partial ? "UNUSED" : "ORIGINAL"} FARE   : BDT ${review.originalBase}`,
          `${partial ? "UNUSED" : "ORIGINAL"} TAXES  : BDT ${review.originalTaxes}`,
          `${partial ? "UNUSED" : "ORIGINAL"} TOTAL  : BDT ${review.originalTotal}`,
          `NEW BASE FARE   : BDT ${review.newBase}`,
          `NEW TAXES       : BDT ${review.newTaxes.reduce((sum, tax) => sum + Number(tax.amount || 0), 0)}`,
          `NEW TOTAL       : BDT ${review.newTotal}`,
          `ADD COLLECT     : BDT ${Math.max(0, review.settlement)}`,
          `RESIDUAL VALUE  : BDT ${Math.max(0, -review.settlement)}`,
          partial ? "FLOWN COUPON: RETAINED AS USED; OPEN COUPON: SURRENDERED FOR EXCHANGE" : null
        ].filter(Boolean), kind: "exchange-review" };
        return { lines: [
          `*TP - ${partial ? "PARTIALLY USED" : "TICKET FOR"} EXCHANGE VALIDATION`,
          `TICKET          : ${review.originalTicket}`,
          `FARE DIFFERENCE : BDT ${review.fareDifference}`,
          `TAX DIFFERENCE  : BDT ${review.taxDifference}`,
          `PENALTY (XP/CP) : BDT ${review.penalty}`,
          `TOTAL ADD COLLECT : BDT ${Math.max(0, review.settlement)}`,
          "FORM OF PAYMENT : EXCH + CASH",
          partial ? "COUPON VALIDATION: FLOWN COUPON RETAINED / OPEN COUPON EXCHANGEABLE" : null,
          "VALIDATION STATUS: REVIEWED - ISSUE ONLY AFTER TMU, R.R AND ER"
        ].filter(Boolean), kind: "exchange-validation" };
      }


      // ── TICKET MODIFIER: COMMISSION (TMU1Z0 / TMU1Z7 / TMU1Z7/FINVAGT / TMU1/FINVAGT) ──
      // Accepts: TMU1Z0, TMU1Z7, TMU1Z7/FINVAGT*, TMU1Z/FINVAGT (0%), TMU1/FINVAGT (0%)
      const tmuZMatch = cmd.match(/^TMU1(?:Z(\d*))?\/FINVAGT\*([A-Z0-9 .'-]+)$/);
      if (tmuZMatch) {
        const rate = tmuZMatch[1] !== undefined && tmuZMatch[1] !== "" ? parseInt(tmuZMatch[1], 10) : 0;
        const invoiceAgent = tmuZMatch[2].trim();
        this.state.commission = rate;
        this.state.invoiceAgent = invoiceAgent;
        this.state.modifierSaved = false;
        return {
          lines: [
            "TICKET MODIFIERS UPDATED",
            `COMMISSION       : ${rate}%`,
            `FORM OF INVOICE  : AGENT (FINVAGT) - ${invoiceAgent}`,
            "ENTER R.R THEN ER TO SAVE MODIFIERS TO BOOKING FILE"
          ],
          kind: "tmu"
        };
      }


      // ── GALILEO FILED FARE CANCELLATION: FXALL, FX1, FX2, FX1.2, FX ──
      if (cmd === "FXALL" || cmd === "FX ALL" || cmd === "FX/ALL") {
        if (this.state.issuedTicket || this.state.issued) {
          return this.error("UNABLE TO CANCEL - FILED FARE TICKETED");
        }
        const hasFares = (this.state.filedFares && this.state.filedFares.length > 0) || this.state.filedFare || this.state.fare;
        if (!hasFares) {
          return this.error("NO FILED FARES EXIST");
        }
        this.state.filedFares = [];
        this.state.filedFare = false;
        this.state.storedFare = false;
        this.state.fare = null;
        this.state.priced = false;
        return {
          lines: ["ALL FILED FARES CANCELLED"],
          kind: "fare-delete"
        };
      }

      const fxNumMatch = cmd.match(/^FX(\d+(?:[\.\-]\d+)*)$/);
      if (fxNumMatch) {
        if (this.state.issuedTicket || this.state.issued) {
          return this.error("UNABLE TO CANCEL - FILED FARE TICKETED");
        }
        const quotes = this.state.filedFares ? [...this.state.filedFares] : (this.state.fare ? [this.state.fare] : []);
        if (!quotes.length) {
          return this.error("NO FILED FARES EXIST");
        }
        const rawNums = fxNumMatch[1];
        let targets = [];
        if (rawNums.includes("-")) {
          const parts = rawNums.split("-");
          const start = parseInt(parts[0], 10);
          const end = parseInt(parts[1], 10);
          for (let i = start; i <= end; i++) targets.push(i);
        } else if (rawNums.includes(".")) {
          targets = rawNums.split(".").map(n => parseInt(n, 10));
        } else {
          targets = [parseInt(rawNums, 10)];
        }

        for (const t of targets) {
          if (isNaN(t) || t < 1 || t > quotes.length) {
            return this.error("FILED FARE " + t + " NOT FOUND");
          }
        }

        // Remove in descending order
        targets.sort((a, b) => b - a).forEach(t => {
          quotes.splice(t - 1, 1);
        });

        this.state.filedFares = quotes;
        if (quotes.length === 0) {
          this.state.filedFare = false;
          this.state.storedFare = false;
          this.state.fare = null;
          this.state.priced = false;
        } else {
          this.state.fare = quotes[quotes.length - 1];
        }

        const msg = targets.length === 1 ? `FILED FARE ${targets[0]} CANCELLED` : `FILED FARES ${targets.reverse().join(", ")} CANCELLED`;
        return {
          lines: [msg],
          kind: "fare-delete"
        };
      }

      if (cmd === "FX") {
        if (this.state.issuedTicket || this.state.issued) {
          return this.error("UNABLE TO CANCEL - FILED FARE TICKETED");
        }
        const quotes = this.state.filedFares || (this.state.fare ? [this.state.fare] : []);
        if (!quotes.length) {
          return this.error("NO FILED FARES EXIST");
        }
        if (quotes.length === 1) {
          this.state.filedFares = [];
          this.state.filedFare = false;
          this.state.storedFare = false;
          this.state.fare = null;
          this.state.priced = false;
          return {
            lines: ["FILED FARE 1 CANCELLED"],
            kind: "fare-delete"
          };
        }
        return this.error("ENTER FXALL OR SPECIFY FILED FARE NUMBER E.G. FX1");
      }

      // ── FXA: AUTO PRICE — LOWEST AVAILABLE FARE (AUTOMATIC) ──
      if (cmd === "FXA") {
        if (!this.state.segments.length) return this.error("NO FLIGHT BOOKED - BOOK SEGMENT FIRST");
        const seg = this.state.segments[0];
        const carrier = seg.carrier || "BG";
        const origin = seg.origin || "DAC";
        const dest = seg.destination || "DXB";
        const autoBase = Math.floor(Math.random() * 5000) + 4000;
        const autoTax = Math.floor(autoBase * 0.18);
        const autoTotal = autoBase + autoTax;
        const fareBasis = "YLOWBG";
        this.state.fare = { base: autoBase, taxes: autoTax, total: autoTotal, carrier, passengers: { adt: 1, chd: 0 }, isAuto: true };
        this.state.priced = true;
        this.state.storedFare = true;
        return {
          lines: [
            "FXA - AUTOMATIC LOWEST FARE PRICING",
            "*** AUTO PRICE RESULT — LOWEST AVAILABLE FARE ***",
            `CARRIER     : ${carrier}`,
            `ROUTING     : ${origin}-${dest}`,
            `FARE BASIS  : ${fareBasis}`,
            `BASE FARE   : BDT ${autoBase}`,
            `TAXES/FEES  : BDT ${autoTax}`,
            `TOTAL FARE  : BDT ${autoTotal}`,
            "",
            "TST CREATED AUTOMATICALLY",
            "FARE STORED — ENTER TKPDTD TO ISSUE TICKET",
            "NOTE: FOR MANUAL CONTROL USE FQ THEN FXP INSTEAD"
          ],
          kind: "auto-price"
        };
      }

      // ── FXL: AUTO PRICE + AUTO REBOOK LOWEST FARE (AUTOMATIC) ──
      if (cmd === "FXL") {
        if (!this.state.segments.length) return this.error("NO FLIGHT BOOKED - BOOK SEGMENT FIRST");
        const seg = this.state.segments[0];
        const carrier = seg.carrier || "BG";
        const origin = seg.origin || "DAC";
        const dest = seg.destination || "DXB";
        const oldClass = seg.soldClass || "Y";
        const autoBase = Math.floor(Math.random() * 4000) + 3500;
        const autoTax = Math.floor(autoBase * 0.18);
        const autoTotal = autoBase + autoTax;
        this.state.fare = { base: autoBase, taxes: autoTax, total: autoTotal, carrier, passengers: { adt: 1, chd: 0 }, isAuto: true };
        this.state.priced = true;
        this.state.storedFare = true;
        seg.soldClass = "Q"; // rebooked to lowest class
        return {
          lines: [
            "FXL - AUTO PRICE WITH AUTO REBOOK",
            "*** SEGMENT REBOOKED TO LOWEST AVAILABLE CLASS ***",
            `CARRIER     : ${carrier}`,
            `ROUTING     : ${origin}-${dest}`,
            `ORIGINAL CLASS : ${oldClass}`,
            `REBOOKED CLASS : Q (LOWEST AVAILABLE)`,
            `BASE FARE   : BDT ${autoBase}`,
            `TAXES/FEES  : BDT ${autoTax}`,
            `TOTAL FARE  : BDT ${autoTotal}`,
            "",
            "TST CREATED / BOOKING CLASS UPDATED",
            "ENTER ER TO SAVE THEN TKPDTD TO ISSUE"
          ],
          kind: "auto-price"
        };
      }

      // ── FXB: AUTO PRICE IN SPECIFIC CABIN (AUTOMATIC) ──
      const fxbMatch = cmd.match(/^FXB\++(BUSNS|ECNMY|PREMY)$/);
      if (fxbMatch || cmd === "FXB") {
        if (!this.state.segments.length) return this.error("NO FLIGHT BOOKED - BOOK SEGMENT FIRST");
        const cabin = fxbMatch ? fxbMatch[1] : "ECNMY";
        const cabinName = cabin === "BUSNS" ? "BUSINESS" : cabin === "PREMY" ? "PREMIUM ECONOMY" : "ECONOMY";
        const seg = this.state.segments[0];
        const carrier = seg.carrier || "BG";
        const autoBase = cabin === "BUSNS" ? 120000 : cabin === "PREMY" ? 65000 : 18000;
        const autoTax = Math.floor(autoBase * 0.18);
        const autoTotal = autoBase + autoTax;
        this.state.fare = { base: autoBase, taxes: autoTax, total: autoTotal, carrier, passengers: { adt: 1, chd: 0 }, isAuto: true };
        this.state.priced = true;
        this.state.storedFare = true;
        return {
          lines: [
            `FXB - AUTO PRICE IN ${cabinName} CLASS`,
            `CABIN CLASS : ${cabinName}`,
            `CARRIER     : ${carrier}`,
            `BASE FARE   : BDT ${autoBase}`,
            `TAXES/FEES  : BDT ${autoTax}`,
            `TOTAL FARE  : BDT ${autoTotal}`,
            "",
            "TST CREATED AUTOMATICALLY FOR " + cabinName,
            "ENTER TKPDTD TO ISSUE TICKET"
          ],
          kind: "auto-price"
        };
      }

      // ── FXP: MANUAL — STORE FARE / CREATE TST (MANUAL) ──
      if (cmd === "FXP") {
        if (!this.state.priced) return this.error("FARE NOT QUOTED - ENTER FQ FIRST (MANUAL) OR FXA (AUTO)");
        this.state.storedFare = true;
        this.state.filedFare = true;
        return { lines: [
          "FXP - MANUAL FARE STORED",
          "TST 00001 CREATED",
          `TOTAL FARE  : BDT ${this.state.fare.total.toLocaleString()}`,
          "ENTER TKPDTD TO ISSUE TICKET",
          "NOTE: TO AUTO-STORE FARE USE FXA INSTEAD OF FQ+FXP"
        ]};
      }


      // ── ISSUE TICKET / REISSUE EXCHANGE TICKET: TKPDTD or TKP... ──
      if (cmd.startsWith("TKP") || cmd.startsWith("TKPFS")) {
        if (!this.state.storedFare && !this.state.filedFare) return this.error("STORE FARE FIRST - ENTER FXP OR FBF");
        if (!this.state.saved) return this.error("SAVE PNR FIRST - ENTER ER");
        if (this.state.commission === null || !this.state.invoiceAgent || !this.state.modifierSaved) {
          return this.error("TICKETING MODIFIER REQUIRED - ENTER TMU1Z0/FINVAGT*AGENT OR TMU1Z7/FINVAGT*AGENT, THEN ER");
        }

        // IF EXCHANGE MODIFIER EXISTS -> PROCESS REISSUE
        if (this.state.exchangeTicket) {
          const oldTkt = this.state.exchangeTicket;
          const originalTicket = this.findTicket(oldTkt);
          if (!originalTicket) return this.error("ORIGINAL EXCHANGE TICKET NOT FOUND - START AGAIN WITH TKPFEX[TICKET]");
          const review = this.state.exchangeReview;
          if (!review || ticketKey(review.originalTicket) !== ticketKey(originalTicket.ticketNumber)) {
            return this.error("EXCHANGE REVIEW REQUIRED - ENTER TKPFEX[ORIGINAL TICKET] AND VERIFY *EX / *TP BEFORE ISSUE");
          }
          const partial = review.exchangeType === "partial";
          const hasFlownCoupon = (originalTicket.coupons || []).some(coupon => coupon.status === "F");
          const hasOpenCoupon = (originalTicket.coupons || []).some(coupon => coupon.status === "O");
          if (partial ? (!hasFlownCoupon || !hasOpenCoupon) : !ticketIsOpenForRefund(originalTicket)) {
            return this.error(`CANNOT ISSUE REISSUE - ORIGINAL TICKET STATUS IS ${originalTicket.status}`);
          }
          const carrier = (this.state.segments[0] && this.state.segments[0].carrier) || "TK";
          const prefix = getAirline3DigitCode(carrier);
          const newTktNum = `${prefix}-${Math.floor(1000000000 + Math.random()*9000000000)}`;
          const fb = this.state.fareBuild;
          const baseFare = review.newBase;
          const reissueTaxes = clone(review.newTaxes);
          const newTotal = review.newTotal;
          const addCollect = review.settlement;
          const paxName = (this.state.names[0] || "1-RAHMAN/MD HAFIZUR MR").replace(/^\d+-/, "");

          originalTicket.status = partial ? "PARTIALLY EXCHANGED" : "EXCHANGED";
          originalTicket.exchangeReference = newTktNum;
          (originalTicket.coupons || []).forEach(coupon => {
            if (partial && coupon.status === "F") {
              coupon.statusDesc = "FLOWN / USED - RETAINED ON ORIGINAL TICKET";
            } else {
              coupon.status = "E";
              coupon.statusDesc = "EXCHANGED / SURRENDERED";
            }
          });
          const replacementSegments = (this.state.segments || []).filter(segment => !segment.flown && segment.status !== "USED");
          if (partial && !replacementSegments.length) {
            return this.error("PARTIAL REISSUE NEEDS AN UNFLOWN REPLACEMENT SEGMENT - DO NOT REISSUE A FLOWN COUPON");
          }
          const newCoupons = replacementSegments.map((segment, index) => ({
            cpn: index + 1,
            route: `${segment.origin}-${segment.destination}`,
            carrier: segment.carrier || carrier,
            flightNumber: segment.number || segment.flightNumber || "",
            class: segment.soldClass || segment.bookingClass || "Y",
            date: segment.date || "",
            status: "O",
            statusDesc: "OPEN FOR USE"
          }));

          this.state.issued = true;
          this.state.issuedTicket = {
            ticketNumber: newTktNum,
            ticketNumberRaw: newTktNum.replace(/-/g, ""),
            exchangedTicket: oldTkt,
            issueDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase().replace(/ /g, ""),
            voidDeadline: sameDayVoidDeadline(),
            carrier: carrier,
            paxName: paxName,
            baseFare: baseFare,
            taxes: reissueTaxes,
            total: newTotal,
            addCollect: addCollect,
            residualValue: Math.max(0, -addCollect),
            status: "REISSUED - OPEN FOR USE",
            coupons: newCoupons.length ? newCoupons : clone(originalTicket.coupons || []).filter(coupon => coupon.status === "O"),
            fop: "EXCH + CASH"
          };
          const oldTktKey = ticketKey(oldTkt);
          const oldIdx = (this.state.issuedTickets || []).findIndex(item => ticketKey(item.ticketNumber) === oldTktKey);
          let newIssuedTickets = (this.state.issuedTickets || []).filter(item => ticketKey(item.ticketNumber) !== ticketKey(newTktNum) && ticketKey(item.ticketNumber) !== oldTktKey);
          if (oldIdx >= 0) {
            newIssuedTickets.splice(oldIdx, 0, this.state.issuedTicket);
          } else {
            newIssuedTickets.unshift(this.state.issuedTicket);
          }
          if (originalTicket) {
            newIssuedTickets.push(originalTicket);
          }
          this.state.issuedTickets = newIssuedTickets;
          this.state.ticketHistory = (this.state.ticketHistory || []).filter(item => ticketKey(item.ticketNumber) !== oldTktKey).concat(originalTicket ? [originalTicket] : []);
          this.state.activeBfCleared = true;
          this.lastSavedPnr = clone(this.state);

          return {
            lines: [
              "OK 0001",
              "**************** ELECTRONIC TICKET EXCHANGE / REISSUE ****************",
              "ETK REISSUED / EXCHANGED OK",
              `ORIGINAL TICKET : ${originalTicket.ticketNumber} (${partial ? "FLOWN COUPON RETAINED / OPEN COUPON SURRENDERED" : "SURRENDERED"})` ,
              `NEW FARE TOTAL  : BDT ${newTotal}`,
              `CHANGE PENALTY  : BDT ${review.penalty}`,
              `${addCollect >= 0 ? "ADDITIONAL COLLECTION" : "RESIDUAL VALUE"}: BDT ${Math.abs(addCollect)}`,
              `NEW TICKET NO : ${newTktNum}`,
              `EXCHANGED TKT : ${oldTkt}`,
              `BOOKING PNR   : ${this.state.locator}`,
              `RECORD LOCATOR: >*${this.state.locator}«`,
              "--------------------------------------------------"
            ],
            kind: "reissue-ok"
          };
        }

        // Standard new ticket issue
        this.state.issued = true;
        let paxIdx = 0;
        const paxModifier = cmd.match(/TKPDTD\/(\d+)/);
        if (paxModifier) {
          paxIdx = Math.max(0, Math.min(this.state.names.length - 1, parseInt(paxModifier[1], 10) - 1));
        }
        const carrier = (this.state.segments[0] && this.state.segments[0].carrier) || "MH";
        const prefix = getAirline3DigitCode(carrier);
        const total = this.state.fare ? this.state.fare.total : 45000;
        const namesList = (this.state.names && this.state.names.length) ? this.state.names : ["1-PASSENGER"];
        const baseDigits = Math.floor(1000000000 + Math.random() * 8000000000);
        const issuedTickets = [];

        namesList.forEach((n, idx) => {
          const pName = n.replace(/^\d+-/, "").replace(/\*.*$/, "").trim();
          const tktSuffix = String(baseDigits + idx).padStart(10, "0");
          const tktNum = `${prefix}-${tktSuffix}`;
          const tktNumRaw = `${prefix}${tktSuffix}`;

          // Determine passenger type: ADT, CHD, or INF
          let pType = "ADT";
          if (this.state.passengerTypes && this.state.passengerTypes[idx] && this.state.passengerTypes[idx].type) {
            pType = this.state.passengerTypes[idx].type;
          } else {
            pType = resolvePassengerType(n);
          }

          let paxFare = null;
          let paxBase = null;
          let paxTax = null;

          // 1. Look up fare from stored fare breakdown (ADT, CNN/CHD, INF)
          const fareObj = this.state.fare;
          if (fareObj) {
            if (pType === "INF" && fareObj.infFare) {
              paxFare = fareObj.infFare.total;
              paxBase = fareObj.infFare.base;
              paxTax  = fareObj.infFare.taxes;
            } else if ((pType === "CHD" || pType === "CNN") && fareObj.chdFare) {
              paxFare = fareObj.chdFare.total;
              paxBase = fareObj.chdFare.base;
              paxTax  = fareObj.chdFare.taxes;
            } else if (pType === "ADT" && fareObj.adtFare) {
              paxFare = fareObj.adtFare.total;
              paxBase = fareObj.adtFare.base;
              paxTax  = fareObj.adtFare.taxes;
            } else if (fareObj.breakdown && Array.isArray(fareObj.breakdown)) {
              let match = null;
              if (pType === "INF") {
                match = fareObj.breakdown.find(b => b.type === "INF");
              } else if (pType === "CHD" || pType === "CNN") {
                match = fareObj.breakdown.find(b => b.type === "CNN" || b.type === "CHD");
              } else {
                match = fareObj.breakdown.find(b => b.type === "ADT");
              }
              if (match) {
                paxFare = match.total;
                paxBase = match.base;
                paxTax  = match.taxes;
              }
            }
          }

          // 2. Fallback if breakdown not matched: calculate from total with standard ratios (ADT=100%, CHD=75%, INF=10%)
          if (paxFare === null || isNaN(paxFare)) {
            let adtC = 0, chdC = 0, infC = 0;
            namesList.forEach((nameItem, i) => {
              const pt = (this.state.passengerTypes && this.state.passengerTypes[i] && this.state.passengerTypes[i].type) || resolvePassengerType(nameItem);
              if (pt === "INF") infC++;
              else if (pt === "CHD" || pt === "CNN") chdC++;
              else adtC++;
            });
            const weight = (adtC * 1.0) + (chdC * 0.75) + (infC * 0.10) || namesList.length;
            const unitAdult = Math.round(total / weight);
            if (pType === "INF") {
              paxFare = Math.round(unitAdult * 0.10);
            } else if (pType === "CHD" || pType === "CNN") {
              paxFare = Math.round(unitAdult * 0.75);
            } else {
              paxFare = unitAdult;
            }
            paxBase = Math.round(paxFare / 1.21);
            paxTax  = paxFare - paxBase;
          }

          const coupons = this.state.segments.map((seg, sIdx) => ({
            cpn: sIdx + 1,
            route: `${seg.origin}-${seg.destination}`,
            carrier: seg.carrier || carrier,
            flightNumber: seg.number || seg.flightNumber || "197",
            class: seg.soldClass || seg.bookingClass || "Y",
            date: seg.date || "18AUG",
            status: "O",
            statusDesc: "OPEN FOR USE",
            couponCode: `${tktNumRaw}C${sIdx + 1}`
          }));

          issuedTickets.push({
            passengerIndex: idx + 1,
            paxName: pName,
            // Preserve the passenger-specific value at issue time.  The
            // receipt renderer still checks the current PNR first, so DOCS
            // entered after issue is shown for that passenger only.
            passport: getPassportForPassenger(this.state.ssr, idx + 1),
            passengerType: pType,
            ticketNumber: tktNum,
            ticketNumberRaw: tktNumRaw,
            issueDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase().replace(/ /g, ""),
            voidDeadline: sameDayVoidDeadline(),
            carrier: carrier,
            baseFare: paxBase,
            taxes: [{ num: 1, amount: paxTax, code: "TAX" }],
            total: paxFare,
            status: "OPEN FOR USE",
            coupons: coupons,
            fop: "CASH"
          });
        });

        this.state.issuedTickets = issuedTickets;
        this.state.issuedTicket = issuedTickets[paxIdx] || issuedTickets[0];
        this.state.activeBfCleared = true;
        this.lastSavedPnr = clone(this.state);
        this._savePnrToStore(this.state);

        return {
          lines: [
            `ELECTRONIC TKT GENERATED TTL FARE  BDT    ${total.toLocaleString()}`,
            "SUPPORTING DOCUMENTS GENERATED",
            `RECORD LOCATOR: >*${this.state.locator}«`,
            "--------------------------------------------------"
          ],
          kind: "issue"
        };
      }

      // ── TINS REMARKS DISPLAY: *HTI ──
      if (cmd === "*HTI") {
        if (!this.state.issued && !(this.lastSavedPnr && this.lastSavedPnr.issued)) {
          return this.error("NO TINS DATA EXISTS IN PNR");
        }
        const tickets = (this.state.issuedTickets && this.state.issuedTickets.length)
          ? this.state.issuedTickets
          : (this.state.issuedTicket ? [this.state.issuedTicket] : []);
        const activeTickets = tickets.filter(t => !["EXCHANGED", "PARTIALLY EXCHANGED", "VOID", "REFUNDED"].includes(t.status));
        const historyTickets = (this.state.ticketHistory && this.state.ticketHistory.length)
          ? this.state.ticketHistory
          : tickets.filter(t => ["EXCHANGED", "PARTIALLY EXCHANGED", "VOID", "REFUNDED"].includes(t.status));
        const currentList = activeTickets.length ? activeTickets : [this.state.issuedTicket || tickets[0]];
        const tinLines = currentList.map((t, idx) => {
          const rawTkt = t.ticketNumberRaw || (t.ticketNumber || "").replace(/[-]/g, "");
          return `${idx + 1}.1 ${t.paxName}-/${rawTkt}/-BDT/${t.total}/ET`;
        });
        const historyLines = historyTickets.map((t, idx) => {
          const rawTkt = t.ticketNumberRaw || (t.ticketNumber || "").replace(/[-]/g, "");
          const statusShort = t.status.includes("EXCHANGE") ? "EXCH" : (t.status.includes("REFUND") ? "RFND" : "VOID");
          return `${idx + 1}.1 ${t.paxName}-/${rawTkt}/-BDT/${t.total}/ET ${statusShort}`;
        });
        return {
          lines: [
            "** TINS REMARKS EXIST **",
            historyLines.length ? "** HISTORY TIN DATA **" : "** NO HISTORY TIN DATA **",
            ...historyLines,
            "** CURRENT TIN DATA **",
            ...tinLines
          ],
          kind: "tins-display"
        };
      }

      // ── ELECTRONIC TICKET RECORD DISPLAY: *HTE, *TE, *TE/[TKT] ──
      const teMatch = cmd.match(/^\*TE\d*(?:\/(.*))?$/) || (cmd === "*HTE" ? [cmd, ""] : null);
      if (teMatch) {
        const rawTktArg = teMatch[1] ? teMatch[1].trim().replace(/[-/]/g, "") : null;
        let tkt = this.state.issuedTicket || (this.lastSavedPnr && this.lastSavedPnr.issuedTicket);
        const ticketHistory = (this.state.issuedTickets || [])
          .concat(this.state.ticketHistory || [])
          .concat((this.lastSavedPnr && this.lastSavedPnr.issuedTickets) || [])
          .concat((this.lastSavedPnr && this.lastSavedPnr.ticketHistory) || []);
        if (rawTktArg) {
          const historicalMatch = ticketHistory.find(item => (item.ticketNumberRaw || (item.ticketNumber || "").replace(/[-/]/g, "")) === rawTktArg);
          if (historicalMatch) tkt = historicalMatch;
        }
        if (rawTktArg && rawTktArg.includes("99755555555555")) {
          tkt = PRESEEDED_PNRS["BG7REF"].issuedTicket;
        } else if (rawTktArg && rawTktArg.includes("2358910482910")) {
          tkt = PRESEEDED_PNRS["TK7REI"].issuedTicket;
        } else if (rawTktArg && (!tkt || (tkt.ticketNumberRaw || (tkt.ticketNumber || "").replace(/[-/]/g, "")) !== rawTktArg) && !ticketHistory.some(item => (item.ticketNumberRaw || (item.ticketNumber || "").replace(/[-/]/g, "")) === rawTktArg)) {
          return this.error(`ELECTRONIC TICKET ${rawTktArg} NOT FOUND IN THE ACTIVE TRAINING RECORD`);
        }
        const tktData = tkt || {
          ticketNumber: "997-5555555555",
          paxName: (this.state.names[0] || "RAHMAN/ATIKUR MR").replace(/^\d+-/, ""),
          issueDate: "26MAR20",
          carrier: "BG",
          baseFare: 3200,
          taxes: [{ num: 1, amount: 500, code: "BD" }, { num: 2, amount: 225, code: "UT" }],
          total: 3925,
          status: "OPEN FOR USE",
          coupons: [{ cpn: 1, route: "ZYL-DAC", carrier: "BG", class: "Y", date: "27MAR20", status: "O", statusDesc: "OPEN FOR USE" }],
          fop: "CASH"
        };
        const taxLines = (tktData.taxes || []).map(t => `BDT ${t.amount} ${t.code}`).join("  ");
        const cpnLines = (tktData.coupons || []).map(c => `CPN ${c.cpn}  ${c.carrier}  ${c.class}  ${c.date || "27MAR"}  ${c.route}   STATUS: ${c.status} (${c.statusDesc || "OPEN"})`);
        return {
          lines: [
            "------------------- ELECTRONIC TICKET RECORD -------------------",
            `TICKET NO   : ${tktData.ticketNumber}`,
            `PASSENGER   : 1.1 ${tktData.paxName}`,
            `ISSUED DATE : ${tktData.issueDate || "26MAR20"}        PCC: ${this.state.officeId || "DACVS086JJ"} / SU`,
            `TICKET STAT : ${tktData.status}`,
            `FORM OF PAY : ${tktData.fop || "CASH"}`,
            `BASE FARE   : BDT ${tktData.baseFare}`,
            `TAXES       : ${taxLines || "BDT 725 TAX"}`,
            `TOTAL FARE  : BDT ${tktData.total}`,
            "COUPON DETAILS:",
            ...cpnLines,
            "----------------------------------------------------------------",
            "STATUS CODES: O=OPEN FOR USE | E=EXCHANGED | R=REFUNDED | V=VOID",
            `USE TRNE${(tktData.ticketNumber || "").replace(/[-]/g, "")}/${tktData.issueDate || "26MAR20"} TO OPEN REFUND MASK`
          ],
          kind: "ticket-display"
        };
      }

      // ── ASSISTED TICKETING SHORTCUTS: #REFUND, #EXCHANGE, #REISSUE, #VOID, #AT, REFUND, EXCHANGE, VOID ──
      if (cmd === "#REFUND" || cmd === "#AT" || cmd === "#EXCHANGE" || cmd === "#REISSUE" || cmd === "#VOID" || cmd === "REFUND" || cmd === "EXCHANGE" || cmd === "VOID") {
        let tab = "refund";
        if (cmd === "#EXCHANGE" || cmd === "#REISSUE" || cmd === "EXCHANGE") tab = "exchange";
        else if (cmd === "#VOID" || cmd === "VOID") tab = "void";
        const tkt = this.state.issuedTicket || (this.lastSavedPnr && this.lastSavedPnr.issuedTicket) || null;
        return {
          lines: [
            "TRAVELPORT SMARTPOINT — ASSISTED TICKETING",
            "-----------------------------------------------------------------",
            `LAUNCHING GRAPHICAL ${tab.toUpperCase()} MODULE...`,
            `ACTIVE PNR      : ${this.state.locator || "NOT RETRIEVED"}`,
            `TICKET NUMBER   : ${tkt ? tkt.ticketNumber : "ENTER OR RETRIEVE A TICKET"}`,
            `PASSENGER       : ${tkt ? tkt.paxName : "NOT AVAILABLE"}`,
            `STATUS          : ${tkt ? "READY FOR GRAPHICAL INPUT" : "RETRIEVE A TICKETED PNR BEFORE PROCESSING"}`,
            "-----------------------------------------------------------------",
            "GRAPHICAL DIALOG OPENED. PRESS CLOSE OR ESCAPE TO RETURN TO TERMINAL."
          ],
          kind: "assisted-ticketing",
          tab: tab,
          ticket: tkt
        };
      }

      // ── FXE / RAPIDREPRICE: AUTO EXCHANGE CALCULATOR (AUTOMATIC REISSUE) ──
      if (cmd === "FXE" || cmd === "RAPIDREPRICE") {
        const tkt = this.state.issuedTicket || (this.lastSavedPnr && this.lastSavedPnr.issuedTicket);
        if (!this.state.locator || !tkt) return this.error("RETRIEVE A TICKETED PNR FIRST - USE *LOCATOR, THEN *HTE");
        return {
          lines: [
            "FXE / RAPID REPRICE IS NOT RUNNING IN THIS TRAINING SIMULATOR.",
            `ORIGINAL TICKET : ${tkt.ticketNumber}`,
            `ORIGINAL BASE   : BDT ${tkt.baseFare || 0}`,
            `ORIGINAL TAXES  : ${(tkt.taxes || []).map(tax => `${tax.code} BDT ${tax.amount}`).join(" | ")}`,
            `ORIGINAL TOTAL  : BDT ${tkt.total || 0}`,
            "Use a fare quote and applicable fare rules for the new fare, tax differences, and change fee.",
            "For practice, open #EXCHANGE and enter the values from that quote.",
            "The simulator does not invent an automated CAT 31 repricing result."
          ],
          kind: "exchange-guide"
        };
      }
      const trvMatch = cmd.match(/^TRV(?:\/?([0-9A-Z-]+))?(?:\/(\d{2}[A-Z]{3}(?:\d{2})?))?$/) || cmd.match(/^TRVE(?:\/?([0-9A-Z-]+))?$/);
      if (trvMatch && !cmd.includes("/OK") && !cmd.includes("/YES")) {
        const rawArg = trvMatch[1] ? trvMatch[1].replace(/[-/]/g, "") : "";
        const tkt = this.findTicket(rawArg);
        if (!tkt) return this.error("TICKET NOT FOUND - RETRIEVE A TICKETED PNR OR ENTER A VALID TRAINING TICKET NUMBER");
        const voidCheck = ticketCanBeVoided(tkt);
        if (!voidCheck.ok) return this.error(`CANNOT VOID - ${voidCheck.reason}`);

        tkt.status = "VOID";
        (tkt.coupons || []).forEach(c => { c.status = "V"; c.statusDesc = "VOID"; });
        this.state.issuedTicket = tkt;

        const carrier = tkt.carrier || "BG";
        const prefix = carrier === "TK" ? "235" : "997";
        const voidNoticeNo = `VOID-${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
        this.state.voidNotice = voidNoticeNo;

        return {
          lines: [
            "OK 0001",
            "**************** ELECTRONIC TICKET VOID NOTICE ****************",
            "TRANSACTION TYPE : ELECTRONIC TICKET VOID (SAME-DAY CANCELLATION)",
            `VOID NOTICE NO   : ${voidNoticeNo}`,
            `TICKET NUMBER    : ${tkt.ticketNumber}`,
            `PASSENGER        : 1.1 ${tkt.paxName}`,
            `ORIGINAL AMOUNT  : BDT ${tkt.total.toLocaleString()}`,
            "CANCELLATION FEE : BDT 0 (100% VOID - NO AIRLINE PENALTY)",
            "TICKET STATUS    : VOID (ALL COUPONS MARKED AS V)",
            "REPORTING SYSTEM : BSP / ARC SAME-DAY SALES RECORD VOIDED",
            "AUDIT TRAIL      : VOID RECORD TRANSMITTED TO CARRIER SUCCESSFUL",
            "***************************************************************"
          ],
          kind: "void-ok",
          ticket: tkt,
          noticeNo: voidNoticeNo
        };
      }

      // ── AUTOMATED FARE REFUND: TRNF (bare — auto-reads active PNR ticket) ──
      // In real Galileo/Smartpoint, TRNF (Automated Fare Refund) does NOT
      // require the agent to type the ticket number.  The system reads the
      // active PNR context, looks up Cat 16 fare rules and auto-populates the
      // refund mask.  This block handles bare "TRNF" (no ticket argument).
      // TRNF[ticket] falls through to the trneMatch block below.
      if (cmd === "TRNF") {
        const activeTkt = this.state.issuedTicket || (this.lastSavedPnr && this.lastSavedPnr.issuedTicket);
        if (!activeTkt) return this.error("NO ACTIVE TICKETED PNR - RETRIEVE A TICKETED PNR FIRST (*LOCATOR)");
        if (ticketIsPartialRefund(activeTkt)) {
          this.state.issuedTicket = activeTkt;
          return this.process("TRN1");
        }
        if (!ticketIsOpenForRefund(activeTkt)) {
          return this.error(`TICKET CANNOT BE REFUNDED FROM STATUS ${activeTkt.status}`);
        }
        const isBGauto = (activeTkt.carrier === "BG") || (activeTkt.ticketNumber && activeTkt.ticketNumber.startsWith("997"));
        const baseAuto  = activeTkt.baseFare || (isBGauto ? 3200 : 43225);
        const totalAuto = activeTkt.total    || (isBGauto ? 3925  : 53225);
        const taxRowsAuto = (activeTkt.taxes && activeTkt.taxes.length)
          ? activeTkt.taxes.map(tax => ({
              code: tax.code || "TAX",
              amount: Number(tax.amount || 0),
              refundable: tax.refundable !== false,
              refundAmount: tax.refundable === false ? 0 : Number(tax.refundableAmount ?? tax.amount ?? 0)
            }))
          : [{ code: "TAX", amount: Math.max(0, totalAuto - baseAuto), refundable: true, refundAmount: Math.max(0, totalAuto - baseAuto) }];
        const taxesAuto          = taxRowsAuto.reduce((s, t) => s + t.amount, 0);
        const refundableTaxesAuto = taxRowsAuto.reduce((s, t) => s + t.refundAmount, 0);
        const withheldTaxesAuto  = taxesAuto - refundableTaxesAuto;
        const penaltyAuto        = isBGauto ? 1000 : 10000;
        const refundableFareAuto = Math.max(0, baseAuto - penaltyAuto);
        const netRefundAuto      = refundableFareAuto + refundableTaxesAuto;
        const issueDateAuto      = activeTkt.issueDate || (isBGauto ? "26MAR20" : "21DEC21");

        this.state.refund = {
          refundType: "unused",
          refundMode: "automated",
          ticketNumber: activeTkt.ticketNumber,
          paxName: activeTkt.paxName,
          carrier: activeTkt.carrier || (isBGauto ? "BG" : "TK"),
          totalPaid: totalAuto,
          basePaid: baseAuto,
          taxesPaid: taxesAuto,
          taxRows: taxRowsAuto,
          refundableTaxes: refundableTaxesAuto,
          withheldTaxes: withheldTaxesAuto,
          penalty: penaltyAuto,
          netRefund: netRefundAuto,
          issueDate: issueDateAuto
        };

        return {
          lines: [
            "TRNF - AUTOMATED FARE REFUND MASK",
            "-----------------------------------------------------------------",
            "** SYSTEM AUTO-CALCULATED REFUND - NO MANUAL ENTRY REQUIRED **",
            "-----------------------------------------------------------------",
            `TICKET NO            : ${activeTkt.ticketNumber}`,
            `ISSUE DATE           : ${issueDateAuto}        CARRIER: ${activeTkt.carrier || (isBGauto ? "BG" : "TK")}`,
            `PASSENGER            : 1.1 ${activeTkt.paxName}`,
            `ROUTING              : ${(activeTkt.coupons || []).map(c => `${c.route} (${c.statusDesc || c.status})`).join(" / ") || "NOT AVAILABLE"}`,
            `ORIGINAL FARE PAID   : BDT ${baseAuto}`,
            `ORIGINAL TAXES PAID  : BDT ${taxesAuto}`,
            "TAX BREAKDOWN (AUTO-VERIFIED):",
            ...taxRowsAuto.map(t => `  BDT ${t.amount} ${t.code} - ${t.refundAmount > 0 ? `REFUND BDT ${t.refundAmount}` : "NON-REFUNDABLE"}`),
            `TOTAL TICKET PAID    : BDT ${totalAuto}`,
            "-----------------------------------------------------------------",
            `AIRLINE PENALTY (CP) : BDT ${penaltyAuto} (AUTO-APPLIED PER CAT 16 FARE RULES)`,
            `REFUNDABLE BASE FARE : BDT ${refundableFareAuto}`,
            `REFUNDABLE TAXES     : BDT ${refundableTaxesAuto}`,
            ...(withheldTaxesAuto > 0 ? [`NON-REFUNDABLE TAXES : BDT ${withheldTaxesAuto}`] : []),
            `NET REFUND TO PAX    : BDT ${netRefundAuto}`,
            "FORM OF REFUND       : CASH / ORIGINAL FOP",
            "-----------------------------------------------------------------",
            "ENTER TRNF/OK TO PROCESS AUTOMATED REFUND",
            "ENTER I TO IGNORE AND CANCEL REFUND"
          ],
          kind: "refund-mask",
          mode: "automated"
        };
      }

      // ── ELECTRONIC TICKET REFUND MASK: TRNE... or TRNF[ticket]... ──
      // TRN1/TRN2/TRN3 mirror the multi-page manual refund sequence. They
      // use the same in-memory calculation as TRNE and never create a second
      // refund transaction.
      const trn1Match = cmd.match(/^TRN1(?:\/X(\d+))?$/);
      if (trn1Match) {
        const activeTicket = this.state.issuedTicket || (this.lastSavedPnr && this.lastSavedPnr.issuedTicket);
        if (!activeTicket) return this.error("RETRIEVE A TICKETED PNR FIRST - USE *LOCATOR THEN *HTE");
        if (ticketIsPartialRefund(activeTicket)) {
          const built = buildPartialRefund(activeTicket, trn1Match[1]);
          if (built.error) return this.error(built.error);
          this.state.refund = built.refund;
          const rf = this.state.refund;
          return { lines: [
            "TRN1 - PARTIALLY USED TICKET REFUND / PAGE 1 OF 4",
            `DATE OF REFUND         : ${rf.issueDate || "TODAY"}        CURRENCY BDT`,
            `PASSENGER              : ${rf.paxName}`,
            `DOCUMENT NUMBER        : ${rf.ticketNumber}`,
            `USED COUPONS (RETAINED): ${rf.usedCoupons}`,
            `UNUSED COUPONS (REFUND): ${rf.unusedCoupons}`,
            `CASH AMT EX TAX PAID   : BDT ${rf.cashPaidExTax}`,
            `CASH AMT USED          : BDT ${rf.cashUsedExTax}`,
            `UNUSED FARE VALUE      : BDT ${rf.basePaid}`,
            `TOTAL TAX AMOUNT PAID  : BDT ${(activeTicket.taxes || []).reduce((sum, tax) => sum + Number(tax.amount || 0), 0)}`,
            `CANCELLATION CHARGE    : BDT ${rf.penalty}`,
            "UNUSED TAXES TO BE REFUNDED Y/N : Y",
            "ENTER TRNTAX TO REVIEW UNUSED TAXES, THEN TRN2",
            "ENTER I TO IGNORE AND CANCEL REFUND"
          ], kind: "refund-mask", phase: 1 };
        }
        const rawTicket = (activeTicket.ticketNumberRaw || activeTicket.ticketNumber || "").replace(/[-/]/g, "");
        const opened = this.process(`TRNE${rawTicket}/${activeTicket.issueDate || ""}`.replace(/\/$/, ""));
        if (opened.kind !== "refund-mask") return opened;
        this.state.refund.phase = 1;
        const rf = this.state.refund;
        return { lines: [
          "TRN1 - REFUND APPLICATION / PAGE 1 OF 4",
          `DOCUMENT NUMBER       : ${rf.ticketNumber}`,
          `PASSENGER             : ${rf.paxName}`,
          `UNUSED COUPONS         : ${(activeTicket.coupons || []).filter(coupon => coupon.status === "O").map(coupon => coupon.cpn).join(" ") || "NONE"}`,
          `CASH / FOP PAID        : BDT ${rf.totalPaid}`,
          `CANCELLATION CHARGE    : BDT ${rf.penalty}`,
          `UNUSED TAXES REFUND    : BDT ${rf.refundableTaxes}`,
          "ENTER TRNTAX OR TRN2 TO CONTINUE",
          "ENTER I TO IGNORE AND CANCEL REFUND"
        ], kind: "refund-mask", phase: 1 };
      }
      if (cmd === "TRNTAX") {
        const rf = this.state.refund;
        if (!rf) return this.error("OPEN REFUND PAGE 1 FIRST - ENTER TRN1 OR TRNE[TICKET]");
        rf.phase = "tax";
        return { lines: [
          "TRNTAX - UNUSED TAXES TO BE REFUNDED",
          `TICKET NUMBER          : ${rf.ticketNumber}`,
          ...(rf.taxRows || []).map(tax => `  ${tax.code}  PAID BDT ${tax.amount}  REFUND BDT ${tax.refundAmount}`),
          rf.withheldTaxes > 0 ? `FLOWN TAXES RETAINED   : BDT ${rf.withheldTaxes}` : null,
          `UNUSED TAXES REFUND    : BDT ${rf.refundableTaxes}`,
          "ENTER TRN2 TO REVIEW TOTAL CASH REFUND DUE",
          "ENTER I TO IGNORE AND CANCEL REFUND"
        ].filter(Boolean), kind: "refund-mask", phase: "tax" };
      }
      if (cmd === "TRN2") {
        const rf = this.state.refund;
        if (!rf) return this.error("OPEN REFUND PAGE 1 FIRST - ENTER TRN1");
        rf.phase = 2;
        return { lines: [
          "TRN2 - REFUND APPLICATION / PAGE 2 OF 4",
          `TICKET NUMBER          : ${rf.ticketNumber}`,
          `REFUNDABLE BASE FARE   : BDT ${Math.max(0, rf.basePaid - rf.penalty)}`,
          `REFUNDABLE TAXES       : BDT ${rf.refundableTaxes}`,
          `TOTAL CASH REFUND DUE  : BDT ${rf.netRefund}`,
          "FORM OF REFUND         : CASH / ORIGINAL FOP",
          "ENTER TRN3 TO VALIDATE OR TRNE/OK TO PROCESS",
          "ENTER I TO IGNORE AND CANCEL REFUND"
        ], kind: "refund-mask", phase: 2 };
      }
      if (cmd === "TRN3") {
        const rf = this.state.refund;
        if (!rf) return this.error("OPEN REFUND PAGE 1 FIRST - ENTER TRN1");
        rf.phase = 3;
        return { lines: [
          "TRN3 - REFUND APPLICATION / FINAL VALIDATION",
          `TICKET NUMBER          : ${rf.ticketNumber}`,
          `NET REFUND TO PASSENGER: BDT ${rf.netRefund}`,
          "VALIDATION STATUS      : REVIEWED - NO BSP TRANSACTION IN TRAINING MODE",
          "ENTER TRNE/OK OR TRN/OK TO PROCESS REFUND",
          "ENTER I TO IGNORE AND CANCEL REFUND"
        ], kind: "refund-mask", phase: 3 };
      }

      const trneMatch = cmd.match(/^TRNE(?:\/?([0-9A-Z-]+))?(?:\/(\d{2}[A-Z]{3}\d{2}))?(?:\/X(\d+))?$/) || cmd.match(/^TRNF(?:\/?([0-9A-Z-]+))?$/);

      if (trneMatch && !cmd.includes("/OK") && !cmd.includes("/YES") && !cmd.includes("/RF")) {
        const rawArg = trneMatch[1] ? trneMatch[1].replace(/[-/]/g, "") : "";
        const issueDateArg = trneMatch[2] || "";
        const penaltyArg = trneMatch[3] ? Number(trneMatch[3]) : null;
        const tkt = this.findTicket(rawArg);
        if (!tkt) return this.error(`ELECTRONIC TICKET ${rawArg || ""} NOT FOUND IN THE ACTIVE TRAINING RECORD`);

        const isBG = (tkt.carrier === "BG") || (tkt.ticketNumber && tkt.ticketNumber.startsWith("997"));
        const base = tkt.baseFare || (isBG ? 3200 : 43225);
        const total = tkt.total || (isBG ? 3925 : 53225);
        // A refund mask must calculate from the ticket's tax rows, not from a
        // rounded total-minus-base fallback. Tax refundability is explicit in
        // training data; unspecified tax rows are refundable by default.
        const taxRows = (tkt.taxes && tkt.taxes.length)
          ? tkt.taxes.map(tax => ({
            code: tax.code || "TAX",
            amount: Number(tax.amount || 0),
            refundable: tax.refundable !== false,
            refundAmount: tax.refundable === false ? 0 : Number(tax.refundableAmount ?? tax.amount ?? 0)
          }))
          : [{ code: "TAX", amount: Math.max(0, total - base), refundable: true, refundAmount: Math.max(0, total - base) }];
        const taxes = taxRows.reduce((sum, tax) => sum + tax.amount, 0);
        const refundableTaxes = taxRows.reduce((sum, tax) => sum + tax.refundAmount, 0);
        const withheldTaxes = taxes - refundableTaxes;
        const penalty = penaltyArg ?? (isBG ? 1000 : 10000); // CAT 16 cancellation fee
        const refundableFare = Math.max(0, base - penalty);
        const netRefund = refundableFare + refundableTaxes;
        const issueDate = issueDateArg || tkt.issueDate || (isBG ? "26MAR20" : "21DEC21");

        if (!ticketIsOpenForRefund(tkt)) {
          if (ticketIsPartialRefund(tkt)) {
            this.state.issuedTicket = tkt;
            return this.process(penaltyArg != null ? `TRN1/X${penaltyArg}` : "TRN1");
          }
          return this.error(`TICKET CANNOT BE REFUNDED FROM STATUS ${tkt.status}`);
        }

        this.state.refund = {
          refundType: "unused",
          ticketNumber: tkt.ticketNumber,
          paxName: tkt.paxName,
          carrier: tkt.carrier || (isBG ? "BG" : "TK"),
          totalPaid: total,
          basePaid: base,
          taxesPaid: taxes,
          taxRows: taxRows,
          refundableTaxes: refundableTaxes,
          withheldTaxes: withheldTaxes,
          penalty: penalty,
          netRefund: netRefund,
          issueDate: issueDate
        };

        return {
          lines: [
            "TRNE - ELECTRONIC TICKET REFUND MASK",
            "-----------------------------------------------------------------",
            `TICKET NO            : ${tkt.ticketNumber}`,
            `ISSUE DATE           : ${issueDate}        CARRIER: ${tkt.carrier || (isBG ? "BG" : "TK")}`,
            `PASSENGER            : 1.1 ${tkt.paxName}`,
            `ROUTING              : ${(tkt.coupons || []).map(coupon => `${coupon.route} (${coupon.statusDesc || coupon.status})`).join(" / ") || "NOT AVAILABLE"}`,
            `ORIGINAL FARE PAID   : BDT ${base}`,
            `ORIGINAL TAXES PAID  : BDT ${taxes}`,
            "TAX BREAKDOWN (PAID):",
            ...taxRows.map(t => `  BDT ${t.amount} ${t.code} - ${t.refundAmount > 0 ? `REFUND BDT ${t.refundAmount}` : "NON-REFUNDABLE"}`),
            `TOTAL TICKET PAID    : BDT ${total}`,
            "-----------------------------------------------------------------",
            `AIRLINE PENALTY (CP) : BDT ${penalty} (CANCELLATION CHARGE PER CAT 16)`,
            `REFUNDABLE BASE FARE : BDT ${refundableFare}`,
            `REFUNDABLE TAXES     : BDT ${refundableTaxes}`,
            ...(withheldTaxes > 0 ? [`NON-REFUNDABLE TAXES : BDT ${withheldTaxes}`] : []),
            `NET REFUND TO PAX    : BDT ${netRefund}`,
            "FORM OF REFUND       : CASH / ORIGINAL FOP",
            "-----------------------------------------------------------------",
            "ENTER TRNE/OK OR TRNF/OK TO PROCESS REFUND",
            "ENTER I TO IGNORE AND CANCEL REFUND"
          ],
          kind: "refund-mask"
        };
      }

      // ── PROCESS REFUND: TRNE/OK, TRNF/OK, TRNE/RF ──
      if (cmd === "TRNE/OK" || cmd === "TRNF/OK" || cmd === "TRNE/RF" || cmd === "TRNF/YES" || cmd === "TRN/OK") {
        if (!this.state.refund) return this.error("OPEN REFUND MASK FIRST - ENTER TRNE[TKT]/[DATE] OR TRNF");
        const rf = this.state.refund;
        const prefix = rf.carrier === "BG" ? "997" : "235";
        const noticeNo = `RFND-${prefix}-${Math.floor(100000 + Math.random()*900000)}`;
        // Display-form ticket numbers and legacy ticketNumberRaw values are
        // not always the same length in training data. Use the same canonical
        // lookup used by all ticket commands rather than a raw string match.
        const refundedTicket = this.findTicket(rf.ticketNumber);
        if (refundedTicket) {
          refundedTicket.status = rf.refundType === "partial" ? "PARTIALLY REFUNDED" : "REFUNDED";
          (refundedTicket.coupons || []).forEach(coupon => {
            if (rf.refundType === "partial" && coupon.status === "F") coupon.statusDesc = "FLOWN / USED - RETAINED";
            else if (rf.refundType !== "partial" || coupon.status === "O") { coupon.status = "R"; coupon.statusDesc = "REFUNDED"; }
          });
        }
        if (this.state.issuedTicket && ticketKey(this.state.issuedTicket.ticketNumber) === ticketKey(rf.ticketNumber)) this.state.issuedTicket = refundedTicket;
        this.state.issuedTickets = (this.state.issuedTickets || []).filter(ticket => ticketKey(ticket.ticketNumber) !== ticketKey(rf.ticketNumber));
        if (refundedTicket) this.state.issuedTickets.push(refundedTicket);
        this.state.refundNotice = noticeNo;
        this.state.refund = null;
        this.lastSavedPnr = clone(this.state);
        return {
          lines: [
            "OK 0001",
            "***************** ELECTRONIC TICKET REFUND NOTICE *****************",
            `${rf.refundType === "partial" ? "PARTIAL" : "TICKET"} REFUND COMPLETED SUCCESSFULLY`,
            `REFUND NOTICE NO : ${noticeNo}`,
            `TICKET NUMBER    : ${rf.ticketNumber}`,
            `PASSENGER        : ${rf.paxName}`,
            `GROSS FARE PAID  : BDT ${rf.totalPaid}`,
            `CANCELLATION FEE : BDT ${rf.penalty} (CP)`,
            ...(rf.taxRows || []).map(t => `TAX REFUNDED      : BDT ${t.refundAmount} ${t.code}`),
            ...(rf.withheldTaxes > 0 ? [`TAX NOT REFUNDED  : BDT ${rf.withheldTaxes}`] : []),
            `TOTAL TAX REFUND : BDT ${rf.refundableTaxes || 0}`,
            `NET REFUND TO PAX: BDT ${rf.netRefund}`,
            `STATUS           : ${rf.refundType === "partial" ? "PARTIALLY REFUNDED (ONLY OPEN COUPONS MARKED AS R)" : "REFUNDED (COUPONS MARKED AS R)"}`,
            "TRAINING MODE ONLY - NO REFUND SENT TO BSP / ORIGINAL FOP",
            "*******************************************************************"
          ],
          kind: "refund-ok"
        };
      }

      if (cmd === "I" && this.state.refund) {
        this.state.refund = null;
        return { lines: ["REFUND MASK IGNORED - NO REFUND PROCESSED"], kind: "refund-cancel" };
      }

      // ── TICKET CANCEL / VOID: TRNC ──
      if (cmd.startsWith("TRNC")) {
        const tkt = this.state.issuedTicket || (this.lastSavedPnr && this.lastSavedPnr.issuedTicket);
        const tktNum = (tkt && tkt.ticketNumber) || "235-8910482910";
        if (this.state.issuedTicket) {
          this.state.issuedTicket.status = "VOID";
          (this.state.issuedTicket.coupons || []).forEach(c => { c.status = "V"; c.statusDesc = "VOID"; });
        }
        return {
          lines: [
            "TRNC - ELECTRONIC TICKET VOID OK",
            `TICKET NUMBER : ${tktNum}`,
            "STATUS        : VOID (V)",
            "TRANSACTION CANCELLED ON DATE OF ISSUE"
          ],
          kind: "void-ok"
        };
      }

      // â”€â”€ CANCEL SEGMENT: X1 â”€â”€
      if (cmd === "XI") {
        if (!this.state.locator && !this.state.segments.length) return this.error("NO ACTIVE PNR");
        this.state.segments = [];
        this.state.priced = false;
        this.state.storedFare = false;
        const hadServices = this.state.ssr.length > 0;
        this.state.ssr = [];
        this.state.itineraryCancelled = true;
        this.state.dirty = true;
        return { lines: hadServices ? ["** SSR DATA CANCELLED **    TO REINSTATE SSR DATA  >*SIR.", "ITINERARY CANCELLED"] : ["ITINERARY CANCELLED"], kind: "cancel" };
      }
      const atCancel = cmd.match(/^@?(\d+)(?:-(\d+))?XK$/) || cmd.match(/^X(\d+)(?:-(\d+))?$/);
      if (atCancel) {
        if (!this.state.locator && !this.state.segments.length) return this.error("NO ACTIVE PNR");
        const startSeg = parseInt(atCancel[1], 10);
        const endSeg = atCancel[2] ? parseInt(atCancel[2], 10) : startSeg;
        this.state.segments = this.state.segments.filter(s => s.segNum < startSeg || s.segNum > endSeg);
        this.state.priced = false;
        this.state.storedFare = false;
        this.state.itineraryCancelled = this.state.segments.length === 0;
        this.state.dirty = true;
        const rangeStr = endSeg > startSeg ? `${startSeg}-${endSeg}` : `${startSeg}`;
        return {
          lines: [
            `SEGMENT ${rangeStr} CANCELLED - STATUS XK`,
            "ITINERARY UPDATE - ENTER R.M THEN ER TO SAVE CHANGES"
          ],
          kind: "cancel"
        };
      }

      // ── SSR DELETE: SI.1@ or SI.2@ ──
      const delSsrMatch = cmd.match(/^SI\.(\d+)@$/);
      if (delSsrMatch) {
        const itemIdx = parseInt(delSsrMatch[1], 10) - 1;
        if (itemIdx < 0 || itemIdx >= this.state.ssr.length) return this.error(`SSR ITEM ${delSsrMatch[1]} NOT FOUND`);
        this.state.ssr.splice(itemIdx, 1);
        this.state.dirty = true;
        return {
          lines: [
            `SSR ITEM ${delSsrMatch[1]} DELETED`,
            "ENTER R.H THEN ER TO SAVE CHANGES"
          ],
          kind: "service"
        };
      }

      // ── SSR: SI.SSR MEAL, SI.SSR WCHR, SI.P1/SSRCTCE..., SI.SSRCTCE..., SI.P1-3/SSRCTCE... ──
      let serviceMatch = cmd.match(/^SI\.P(\d+)\/(?:SSR)?([A-Z]{4})(.*)$/);
      let paxTargets = null;

      if (serviceMatch) {
        paxTargets = [serviceMatch[1]];
      } else {
        const rangeMatch = cmd.match(/^SI\.P(\d+)-P?(\d+)\/(?:SSR)?([A-Z]{4})(.*)$/);
        if (rangeMatch) {
          const startP = parseInt(rangeMatch[1], 10);
          const endP = parseInt(rangeMatch[2], 10);
          const targets = [];
          for (let p = startP; p <= endP; p++) targets.push(String(p));
          serviceMatch = [rangeMatch[0], targets, rangeMatch[3], rangeMatch[4]];
          paxTargets = targets;
        } else {
          const multiMatch = cmd.match(/^SI\.P((?:\d+[,\.]?)+)\/(?:SSR)?([A-Z]{4})(.*)$/);
          if (multiMatch) {
            const targets = multiMatch[1].split(/[,\.]+/).filter(Boolean);
            serviceMatch = [multiMatch[0], targets, multiMatch[2], multiMatch[3]];
            paxTargets = targets;
          } else {
            const generalMatch = cmd.match(/^SI\.(?:SSR)?([A-Z]{4})(.*)$/);
            if (generalMatch) {
              const codeCandidate = generalMatch[1];
              const acceptedCodes = ["DOCS", "CTCE", "CTCM", "MOML", "SPML", "VGML", "VSML", "AVML", "CHML", "BBML", "BSCT", "WCHR", "WCHS", "WCHC", "RQST", "NSST", "BAGX", "XBAG", "ABAG"];
              if (acceptedCodes.includes(codeCandidate)) {
                serviceMatch = [generalMatch[0], null, codeCandidate, generalMatch[2]];
                paxTargets = "ALL";
              }
            }
          }
        }
      }

      if (serviceMatch) {
        const code = serviceMatch[2];
        const detail = serviceMatch[3].replace(/^\//, "").replace(/\*$/, "").trim();
        const accepted = ["DOCS", "CTCE", "CTCM", "MOML", "SPML", "VGML", "VSML", "AVML", "CHML", "BBML", "BSCT", "WCHR", "WCHS", "WCHC", "RQST", "NSST", "BAGX", "XBAG", "ABAG"];
        if (!accepted.includes(code)) return this.error("INVALID SSR CODE - USE DOCS, CTCE, CTCM, BAGX, XBAG, MOML, SPML, VGML, AVML, CHML, BBML, BSCT, WCHR OR RQST");

        let targets = [];
        if (paxTargets === "ALL") {
          if (!this.state.names.length) return this.error("NO ACTIVE PASSENGERS - ADD NAME FIRST");
          if (code === "DOCS") return this.error("CHECK DOCS FORMAT - USE: SI.P1/SSRDOCSBGHK1/P/BGD/PASSPORT/BGD/01JAN90/M/01JAN30/SURNAME/FIRSTNAME");
          if (code === "CTCE") return this.error("SELECT PASSENGER - USE: SI.P1/SSRCTCEBGHK1/EMAIL//DOMAIN.COM");
          if (code === "CTCM") return this.error("SELECT PASSENGER - USE: SI.P1/SSRCTCMBGHK1/017XXXXXXXX");
          this.state.names.forEach((n, idx) => {
            const clean = n.replace(/^\d+-/, "");
            if (!clean.startsWith("I/")) targets.push(String(idx + 1));
          });
          if (!targets.length) targets.push("1");
        } else {
          for (const p of paxTargets) {
            if (!this.state.names[parseInt(p, 10) - 1]) return this.error("PASSENGER " + p + " NOT FOUND - ADD NAME FIRST");
          }
          targets = paxTargets;
        }

        if ((code === "WCHR" || code === "WCHS" || code === "WCHC") && !detail) return this.error("WHEELCHAIR SSR MUST BE FOLLOWED BY TEXT");
        if (code === "DOCS" && !/^([A-Z]{2})?HK\d*\/P\/[A-Z]{3}\/[A-Z0-9]+\/[A-Z]{3}\/\d{2}[A-Z]{3}(?:\d{2}|\d{4})\/(?:MI|FI|[MFU])\/\d{2}[A-Z]{3}(?:\d{2}|\d{4})\//i.test(detail)) return this.error("CHECK DOCS FORMAT - USE: SI.P1/SSRDOCSBGHK1/P/BGD/PASSPORT/BGD/01JAN90/M/01JAN30/SURNAME/FIRSTNAME");
        if (code === "DOCS") {
          const MONTHS_V = {JAN:0,FEB:1,MAR:2,APR:3,MAY:4,JUN:5,JUL:6,AUG:7,SEP:8,OCT:9,NOV:10,DEC:11};
          const today = new Date(); today.setHours(0,0,0,0);
          const curYY = today.getFullYear() % 100;
          // ── Travel reference date: use first booked segment date if available ──
          // DOB must be before the TRAVEL date (not just today), so an infant born
          // e.g. 10JAN26 is correctly flagged if the flight is on 15NOV25.
          let travelRef = new Date(today);
          const seg0 = this.state && this.state.segments && this.state.segments[0];
          if (seg0 && seg0.date) {
            // seg0.date is DDMMM (e.g. "15NOV") — resolve year same as resolveFlightDate()
            const sm = String(seg0.date).toUpperCase().match(/^(\d{2})([A-Z]{3})(\d{2})?$/);
            if (sm) {
              const sd = parseInt(sm[1], 10);
              const smon = MONTHS_V[sm[2]];
              if (smon !== undefined) {
                let syr;
                if (sm[3]) {
                  syr = 2000 + parseInt(sm[3], 10);
                } else {
                  syr = new Date().getFullYear();
                  if (smon < new Date().getMonth()) syr += 1;
                }
                travelRef = new Date(syr, smon, sd);
              }
            }
          }
          function parseSsrDate(str) {
            const dm = String(str).trim().toUpperCase().match(/^(\d{2})([A-Z]{3})(\d{2}|\d{4})$/);
            if (!dm) return null;
            const d = parseInt(dm[1], 10);
            const mon = MONTHS_V[dm[2]];
            if (mon === undefined) return null;
            let yr = parseInt(dm[3], 10);
            // IATA 2-digit year: use +30 window so expiry years like 35,36 → 2035,2036
            // and DOB years like 70,90 → 1970,1990. Anything within curYY+30 → 2000s.
            if (dm[3].length === 2) yr = yr <= (curYY + 30) ? (2000 + yr) : (1900 + yr);
            return new Date(yr, mon, d);
          }
          // Extract DOB (field 6 in /P/NATIONALITY/PASSNUM/ISSUECOUNTRY/DOB/GENDER/EXPIRY/)
          const docsParts = detail.split("/");
          // Format after HK\d*: P / issuing_country / passport_no / national / DOB / gender / expiry / ...
          // Index: 0=HKn, 1=P, 2=nationality, 3=passnum, 4=issuing, 5=DOB, 6=gender, 7=expiry
          const dobStr  = docsParts[5];
          const expStr  = docsParts[7];
          if (dobStr) {
            const dob = parseSsrDate(dobStr);
            if (!dob) return this.error("INVALID DATE OF BIRTH IN DOCS: " + dobStr + " - USE DDMMMYY FORMAT (E.G. 23JAN90)");
            if (dob > today) return this.error("DATE OF BIRTH CANNOT BE A FUTURE DATE: " + dobStr);
            if (dob > travelRef) return this.error("DATE OF BIRTH CANNOT BE AFTER TRAVEL DATE: " + dobStr);
          }
          if (expStr) {
            const exp = parseSsrDate(expStr);
            if (!exp) return this.error("INVALID PASSPORT EXPIRY DATE IN DOCS: " + expStr + " - USE DDMMMYY FORMAT (E.G. 01JAN30)");
            if (exp < today) return this.error("PASSPORT EXPIRED - EXPIRY DATE " + expStr + " IS IN THE PAST. UPDATE PASSPORT DETAILS.");
          }
        }
        if ((code === "RQST" || code === "NSST") && !detail) return this.error("CHECK FORMAT - E.G. SI.P1/SSRRQSTXX HK1/W (W=WINDOW, A=AISLE, M=MIDDLE)");
        const labels = {
          DOCS: "PASSPORT",
          CTCE: "EMAIL",
          CTCM: "MOBILE",
          MOML: "MUSLIM MEAL",
          SPML: "SPECIAL MEAL",
          VGML: "VEGETARIAN MEAL",
          VSML: "VEGETABLE MEAL",
          AVML: "ASIAN VEGETARIAN MEAL",
          CHML: "CHILD MEAL",
          BBML: "BABY MEAL",
          BSCT: "BABY COT / BASSINET",
          WCHR: "WHEELCHAIR TO RAMP",
          WCHS: "WHEELCHAIR - STEPS",
          WCHC: "WHEELCHAIR - CABIN SEAT",
          RQST: "SEAT REQUEST",
          BAGX: "EXTRA BAGGAGE",
          XBAG: "EXCESS BAGGAGE",
          ABAG: "ADDITIONAL BAGGAGE",
          NSST: "SEAT REQUEST"
        };
        const seatTypeMap = { W: "WINDOW SEAT", A: "AISLE SEAT", M: "MIDDLE SEAT", K: "WINDOW SEAT", E: "EXTRA LEGROOM", B: "BULKHEAD" };
        let label = labels[code];
        if (code === "RQST" || code === "NSST") {
          const seatCode = detail.toUpperCase().trim().slice(-1);
          label = seatTypeMap[seatCode] || "SEAT REQUEST";
        }

        targets.forEach(passenger => {
          const ssrItem = {
            passenger,
            code,
            detail,
            raw: raw.trim().replace(/\*+$/, "").trim(),
            toString: function() { return `P${this.passenger} ${this.code}${this.detail ? " " + this.detail : ""}`; }
          };
          this.state.ssr.push(ssrItem);
          this.state.dirty = true;
        });

        const paxDesc = paxTargets === "ALL" ? "ALL PASSENGERS" : (targets.length > 1 ? "PASSENGERS " + targets.join(", ") : "PASSENGER " + targets[0]);
        return {
          lines: [`SSR ${label} ADDED FOR ${paxDesc}${detail ? ": " + detail : ""}`],
          kind: "service",
          leftDisplay: "service"
        };
      }

      if (cmd.startsWith("SI.SSR ") || cmd.startsWith("SSR ")) {
        const ssrVal = cmd.startsWith("SI.SSR ") ? cmd.slice(7) : cmd.slice(4);
        this.state.ssr.push(ssrVal);
        this.state.dirty = true;
        return { lines: [`SSR ${ssrVal} ADDED`] };
      }

      // â”€â”€ OSI â”€â”€
      if (cmd.startsWith("SI.OSI ") || cmd.startsWith("OSI ")) {
        const osiVal = cmd.startsWith("SI.OSI ") ? cmd.slice(7) : cmd.slice(4);
        this.state.osk.push(osiVal);
        this.state.dirty = true;
        return { lines: [`OSI ${osiVal} ADDED`] };
      }


      // ── SEAT ASSIGNMENT / PREFERENCE: S.P1/NW, S.P1/NA, S.P1S2/NW ──
      const seatPrefMatch = cmd.match(/^S\.P(\d+)(?:S(\d+))?\/N([WMAKEBwmakeb])$/);
      if (seatPrefMatch) {
        if (!this.state.locator && !this.state.names.length) return this.error("NO ACTIVE PNR - RETRIEVE FIRST");
        const paxNum = seatPrefMatch[1];
        const segNum = seatPrefMatch[2] || "1";
        const typeCode = seatPrefMatch[3].toUpperCase();
        const seatTypeMap = { W: "WINDOW", A: "AISLE", M: "MIDDLE", K: "WINDOW", E: "EXTRA LEGROOM", B: "BULKHEAD" };
        const seatType = seatTypeMap[typeCode];
        if (this.state.names.length && !this.state.names[parseInt(paxNum) - 1]) {
          return this.error("PASSENGER " + paxNum + " NOT FOUND IN PNR");
        }
        const seg = this.state.segments[parseInt(segNum) - 1] || this.state.segments[0];
        const paxName = (this.state.names[parseInt(paxNum) - 1] || "PAX" + paxNum).replace(/^\d+-/, "");
        const carrier = seg ? seg.carrier : "XX";
        const flightNo = seg ? seg.number : "000";
        const seatNum = typeCode === "W" ? "33A" : typeCode === "A" ? "33C" : "33B";
        this.state.ssr.push("RQST " + carrier + " HK1 " + seatNum + "/" + seatType + " PAX" + paxNum);
        return {
          lines: [
            "S.P" + paxNum + "S" + segNum + "/N" + typeCode + " - SEAT PREFERENCE RECORDED",
            "PASSENGER     : " + paxName,
            "FLIGHT        : " + carrier + " " + flightNo + "  SEGMENT " + segNum,
            "SEAT REQUEST  : " + seatType + " SEAT PREFERENCE",
            "SEAT ASSIGNED : " + seatNum + " (" + seatType + ")",
            "SSR ENTRY     : RQST " + carrier + " HK1 " + seatNum + "/" + seatType,
            "",
            "NOTE: SEAT SUBJECT TO AVAILABILITY AND AIRLINE CONFIRMATION",
            "ENTER ER TO SAVE SEAT REQUEST TO PNR"
          ],
          kind: "service"
        };
      }

      // ── SEAT MAP DISPLAY: SA*S1, SA*S2, #SEAT ──
      const seatMapMatch = cmd.match(/^SA\*S(\d+)$/) || (cmd === "#SEAT" ? [cmd, "1"] : null);
      if (seatMapMatch) {
        if (!this.state.locator && !this.state.segments.length) return this.error("NO ACTIVE PNR - RETRIEVE FIRST");
        const smSegNum = seatMapMatch[1] || "1";
        const smSeg = this.state.segments[parseInt(smSegNum) - 1] || this.state.segments[0] || { carrier: "BG", number: "602", origin: "ZYL", destination: "DAC" };
        const smCarrier = smSeg.carrier || "BG";
        return {
          lines: [
            "SA*S" + smSegNum + " - SEAT MAP DISPLAY",
            "FLIGHT: " + smCarrier + " " + (smSeg.number || "000") + "   " + (smSeg.origin || "---") + "-" + (smSeg.destination || "---"),
            "======================================================",
            "ROW  A(W)  B(M)  C(A)    D(A)  E(M)  F(W)   NOTE",
            "------------------------------------------------------",
            "  1   X     X     X       X     X     X      BUSINESS",
            "  2   X     X     X       X     X     X      BUSINESS",
            " 10   .     .     .       .     .     .      EXTRA LEG",
            " 11   .     .     .       .     .     .      ",
            " 12   .     .     X       .     .     .      ",
            " 13   .     .     .       .     .     .      ",
            " 20   X     .     .       .     .     X      ",
            " 21   .     .     .       .     .     .      ",
            " 22   .     .     .       .     X     .      ",
            " 30   .     .     .       .     .     .      ",
            " 31   .     .     .       .     .     .      ",
            " 32   .     .     .       .     .     .      ",
            " 33   .     .     .       .     .     .      ",
            "------------------------------------------------------",
            "LEGEND: .(AVAILABLE)  X(OCCUPIED)  *(BLOCKED)",
            "SEAT TYPES: W=WINDOW  A=AISLE  M=MIDDLE",
            "------------------------------------------------------",
            "WINDOW SEAT : S.P1/NW   or   S.P1S1/NW",
            "AISLE SEAT  : S.P1/NA   or   S.P1S1/NA",
            "MIDDLE SEAT : S.P1/NM   or   S.P1S1/NM"
          ],
          kind: "seat-map"
        };
      }

      // â”€â”€ IGNORE: IG â”€â”€
      if (cmd === "I" || cmd === "IG") {
        const signedIn = this.state.signedIn;
        const officeId = this.state.officeId;
        const history = this.state.history;
        this.reset();
        this.state.signedIn = signedIn;
        this.state.officeId = officeId;
        this.state.history = history;
        return {
          lines: ["IGNORED - CHANGES DISCARDED"],
          kind: "ignore"
        };
      }

      return this.error("UNABLE TO PROCESS - TYPE HELP FOR AVAILABLE COMMANDS");
    }

    _populateVendorRemarks() {
      const now = new Date();
      const expiry = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      const month = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
      const stamp = date => String(date.getUTCDate()).padStart(2, "0") + month[date.getUTCMonth()] + String(date.getUTCFullYear()).slice(-2);
      const carrier = (this.state.segments && this.state.segments[0] && this.state.segments[0].carrier) || "BS";
      this.state.vendorRemarks = `VRMK-VI/APG *MISSING SSR CTCM MOBILE OR SSR CTCE EMAIL OR SSR CTCR NON-CONSENT FOR ${carrier} 1722Z ${stamp(now)}\n2. VI/A1A *PLS ADV PAX EMAIL AND MOBILE PER SSR CTCM CTCE 1722Z ${stamp(now)}\n3. VI/A1A *ADTK1G${carrier} BY ${stamp(expiry)} 1555 DAC TIME ZONE OTHERWISE WILL BE XLD 1555Z ${stamp(now)}`;
      // Also generate vendor locator if not already set (auto-generated by GDS after ER)
      if (!this.state.vendorLocator) {
        const hh = String(now.getUTCHours()).padStart(2, "0");
        const mm = String(now.getUTCMinutes()).padStart(2, "0");
        // Generate a random 6-char alphanumeric code (like GDS locator codes)
        const code = genLocator();
        this.state.airlinePnr = code;
        this.state.vendorLocator = `${carrier}*${code}/${stamp(now)} ${hh}${mm}`;
      }
    }

    // Build full PNR display
    _displayPNR() {
      const s = this.state;
      const lines = [
        `--- RLR ---`,
        `RP/${s.officeId || "DACVS086JJ"}/${s.officeId || "DACVS086JJ"}              ${s.receivedFrom || "TRAINING"}/SU`,
        s.locator,
        ""
      ];
      s.names.forEach(n => lines.push(n));
      s.segments.forEach(seg => {
        lines.push(`${seg.segNum} ${seg.carrier} ${seg.number} ${seg.soldClass || "Y"} ${seg.date} ${seg.origin}${seg.destination} HK${seg.heldSeats || seg.paxCount} ${seg.depart} ${seg.arrive}   #`);
      });
      if (s.retention) {
        lines.push(`${s.segments.length + 1} TUR ${s.segments[0] ? s.segments[0].carrier : "XX"} ${s.retention.date} MEMO HK1 ${s.retention.text}`);
      }
      if (s.ticketing) lines.push(`TL ${s.ticketing}`);
      s.phones.forEach(p => lines.push(`AP ${p}`));
      if (s.receivedFrom) lines.push(`RF-${s.receivedFrom.toUpperCase()}`);
      s.ssr.forEach(r => {
        const ssrStr = (typeof r === "object" && r) ? (r.raw || r.label || r.detail || r.code || "") : String(r || "");
        lines.push(`SSR ${ssrStr}`);
      });
      s.osk.forEach(r => lines.push(`OSI ${r}`));
      if (s.storedFare && s.fare) {
        lines.push("");
        lines.push(`TST BDT ${s.fare.total.toLocaleString()}`);
      }
      if (s.issuedTicket) {
        lines.push(`TKT - ${s.issuedTicket.ticketNumber}  ${s.issuedTicket.status}`);
        if (s.issuedTicket.exchangedTicket) {
          lines.push(`EXCHANGED FROM ${s.issuedTicket.exchangedTicket}`);
        }
      } else if (s.issued) {
        lines.push("TKT - ISSUED");
      }
      if (s.refundNotice) {
        lines.push(`RFND - ${s.refundNotice}`);
      }
      if (s.dividedPnr) {
        lines.push(`DIVIDED TO ${s.dividedPnr}`);
      }
      return { lines, kind: "retrieve", leftDisplay: "overview" };
    }

    _renderFareBuildScreen() {
      const fb = this.state.fareBuild;
      const taxLine = (fb.taxes || []).map(t => `TAX${t.num}  BDT    ${String(t.amount).padStart(4)} ${t.code}`).join("    ");
      return {
        lines: [
          "*FB1",
          "--------------------- FARE BUILD PASSENGER 1 ---------------------",
          `PAX       : 1.1 ${fb.paxName}`,
          `ROUTING   : ${fb.route}`,
          `FARE CALC : ${fb.route} M/IT BDT${fb.baseFare} END`,
          `BASE FARE : BDT   ${fb.baseFare}`,
          taxLine || "TAXES     : NO TAXES FILED",
          `TOTAL     : BDT   ${fb.total}`,
          `FOP       : ${fb.fop}`,
          "------------------------------------------------------------------",
          "FBUFARE/BDT48225 - Set new base fare (example only)",
          "FBUTAX1/       - Remove old tax line before repricing",
          "FBUTAX1/4 TR   - Enter a tax difference by code (example only)",
          "FBUTAX2/6768XP - Enter a penalty line (example only)",
          "FBUTTL/        - Recalculate total fare",
          "FBF            - File & store manual fare"
        ],
        kind: "fare-build"
      };
    }

    _availScreen() {
      const size = GalileoCommandEngine.PAGE_SIZE;
      const start = (this.state.availPage || 0) * size;
      const flights = this.state.results.slice(start, start + size);
      const hasMore = start + size < this.state.results.length;
      const lines = [this.state.availHeader];
      flights.forEach(f => {
        lines.push(GalileoFlights.formatLine(f));
        const entries = Object.entries(f.classes || {});
        const overflow = entries.length > 10 ? entries.slice(10).map(([k, v]) => `${k}${v}`).join(' ') : "";
        const allRows = [...(f.rows || [])];
        if (overflow && !allRows.includes(overflow)) allRows.unshift(overflow);
        allRows.forEach((row, rIdx) => {
          let lead = (f.brand && rIdx === 0) ? "   \u00abB\u00bb" : "      ";
          let pad = " ".repeat(Math.max(1, 41 - lead.length));
          lines.push(lead + pad + row);
        });
        if (f.brand && (!allRows || !allRows.length)) {
          lines.push("   \u00abB\u00bb");
        }
      });
      if (hasMore) lines.push("\u00abMore Flights\u00bb");
      return {
        lines,
        kind: "avail",
        header: this.state.availHeader,
        flights,
        hasMore
      };
    }

    processAssistedRefund(opts) {
      const isPartial = opts.refundType === "partial";
      const tkt = this.findTicket(opts.ticketNumber);
      if (!tkt) return { ok: false, lines: ["TICKET NOT FOUND - RETRIEVE A TICKETED PNR OR ENTER A VALID TRAINING TICKET NUMBER"], kind: "error" };
      const hasFlownCoupon = (tkt.coupons || []).some(coupon => coupon.status === "F");
      const hasOpenCoupon = (tkt.coupons || []).some(coupon => coupon.status === "O");
      if (isPartial ? (!hasFlownCoupon || !hasOpenCoupon) : !ticketIsOpenForRefund(tkt)) {
        return { ok: false, lines: [`CANNOT REFUND TICKET: STATUS IS ${tkt.status}`], kind: "error" };
      }
      this.state.issuedTicket = tkt;

      // For a partially used ticket, the stored historical allocation is the
      // authority.  User-entered numbers must not increase a refund beyond the
      // unflown coupon value.
      const allocatedFlownFare = Number(tkt.flownBaseFare);
      const allocatedFlownTaxes = Number(tkt.flownTaxes);
      if (isPartial && (!Number.isFinite(allocatedFlownFare) || !Number.isFinite(allocatedFlownTaxes))) {
        return { ok: false, lines: ["PARTIAL REFUND NEEDS FLOWN/UNUSED COUPON FARE AND TAX ALLOCATION"], kind: "error" };
      }
      const grossFare = Number(opts.grossFare || tkt.total || 0);
      const basePaid = Number(opts.basePaid || tkt.baseFare || 0);
      const taxesPaid = Number(opts.taxesPaid || Math.max(0, grossFare - basePaid));
      const flownFare = isPartial ? allocatedFlownFare : 0;
      const flownTaxes = isPartial ? allocatedFlownTaxes : 0;
      const availableBase = Math.max(0, basePaid - flownFare);
      const availableTaxes = Math.max(0, taxesPaid - flownTaxes);
      const penalty = Math.min(Math.max(0, Number(opts.penalty || 0)), availableBase);
      const refundableBase = Math.max(0, availableBase - penalty);
      const refundableTaxes = Math.min(availableTaxes, Math.max(0, Number(opts.refundableTaxes ?? availableTaxes)));
      const netRefund = refundableBase + refundableTaxes;

      const prefix = (tkt.carrier === "BG" || (tkt.ticketNumber && tkt.ticketNumber.startsWith("997"))) ? "997" : "235";
      const noticeNo = `RFND-${prefix}-${Math.floor(100000 + Math.random()*900000)}`;

      if (isPartial) {
        tkt.status = "PARTIALLY REFUNDED";
        (tkt.coupons || []).forEach(coupon => {
          if (coupon.status === "F") coupon.statusDesc = "FLOWN / USED - RETAINED";
          else if (coupon.status === "O") { coupon.status = "R"; coupon.statusDesc = "REFUNDED"; }
        });
      } else {
        tkt.status = "REFUNDED";
        (tkt.coupons || []).forEach(c => { c.status = "R"; c.statusDesc = "REFUNDED"; });
      }

      this.state.refundNotice = noticeNo;
      this.state.refund = null;
      this.state.issuedTickets = (this.state.issuedTickets || []).filter(item => item.ticketNumber !== tkt.ticketNumber).concat([tkt]);
      this.lastSavedPnr = clone(this.state);

      const lines = [
        "OK 0001",
        "***************** ASSISTED TICKETING — REFUND NOTICE *****************",
        `TRANSACTION TYPE : ${isPartial ? "PARTIALLY USED TICKET REFUND" : "UNUSED TICKET REFUND (FULL)"}`,
        `REFUND NOTICE NO : ${noticeNo}`,
        `TICKET NUMBER    : ${tkt.ticketNumber}`,
        `PASSENGER        : 1.1 ${tkt.paxName}`,
        `ORIGINAL GROSS   : BDT ${grossFare}`,
        `ORIGINAL TAXES   : ${(tkt.taxes || []).map(tax => `${tax.code} BDT ${tax.amount}`).join(" | ") || `BDT ${taxesPaid}`}`,
        isPartial ? `LESS FLOWN FARE  : BDT ${flownFare} (USED SECTOR RETAINED)` : null,
        isPartial ? `LESS FLOWN TAXES : BDT ${flownTaxes} (USED TAXES RETAINED)` : null,
        `CANCELLATION FEE : BDT ${penalty} (CP / CAT 16 PENALTY)`,
        opts.waiver ? `WAIVER CODE      : ${opts.waiver}` : null,
        `BASE FARE BALANCE: BDT ${availableBase}`,
        `LESS PENALTY     : BDT ${penalty}`,
        `REFUNDABLE TAXES : BDT ${refundableTaxes} (subject to coupon use and tax rules)`,
        `NET REFUND TO PAX: BDT ${netRefund}`,
        `STATUS           : ${tkt.status}`,
        "TRAINING MODE    : SIMULATED REFUND NOTICE - NO BSP TRANSACTION",
        "**********************************************************************"
      ].filter(Boolean);

      return {
        ok: true,
        lines,
        kind: "refund-ok",
        noticeNo,
        netRefund,
        status: tkt.status
      };
    }

    processAssistedExchange(opts) {
      const isPartial = opts.exchangeType === "partial";
      const tkt = this.findTicket(opts.ticketNumber);
      if (!tkt) return { ok: false, lines: ["TICKET NOT FOUND - RETRIEVE A TICKETED PNR OR ENTER A VALID TRAINING TICKET NUMBER"], kind: "error" };
      const hasFlownCoupon = (tkt.coupons || []).some(coupon => coupon.status === "F");
      const hasOpenCoupon = (tkt.coupons || []).some(coupon => coupon.status === "O");
      if (isPartial ? (!hasFlownCoupon || !hasOpenCoupon) : !ticketIsOpenForRefund(tkt)) {
        return { ok: false, lines: [`CANNOT EXCHANGE TICKET: STATUS IS ${tkt.status}`], kind: "error" };
      }
      const carrier = (tkt && tkt.carrier) || ((opts.ticketNumber && opts.ticketNumber.startsWith("235")) ? "TK" : "BG");
      const prefix = carrier === "TK" ? "235" : "997";
      const oldTktNum = (tkt && tkt.ticketNumber) || opts.ticketNumber || `${prefix}-8910482910`;
      const newTktNum = `${prefix}-${Math.floor(1000000000 + Math.random()*9000000000)}`;
      const pax = (tkt && tkt.paxName) || opts.paxName || "RAHMAN/MD HAFIZUR MR";

      if (tkt) {
        tkt.status = isPartial ? "PARTIALLY EXCHANGED" : "EXCHANGED";
        tkt.exchangeReference = newTktNum;
        (tkt.coupons || []).forEach(coupon => {
          if (isPartial && coupon.status === "F") coupon.statusDesc = "FLOWN / USED - RETAINED ON ORIGINAL TICKET";
          else { coupon.status = "E"; coupon.statusDesc = "EXCHANGED / SURRENDERED"; }
        });
      }

      const replacementSegments = (this.state.segments || []).filter(segment => !isPartial || (!segment.flown && segment.status !== "USED"));
      const newCoupons = replacementSegments.length
        ? replacementSegments.map((segment, index) => ({
            cpn: index + 1,
            route: `${segment.origin}-${segment.destination}`,
            carrier: segment.carrier || carrier,
            flightNumber: segment.number || segment.flightNumber || "",
            class: segment.soldClass || segment.bookingClass || "Y",
            date: segment.date || "",
            status: "O",
            statusDesc: "OPEN FOR USE"
          }))
        : (tkt && tkt.coupons && tkt.coupons.length)
          ? clone(tkt.coupons).filter(c => !isPartial || c.status !== "F").map((c, i) => Object.assign({}, c, { cpn: i + 1, status: "O", statusDesc: "OPEN FOR USE" }))
          : [{ cpn: 1, route: (this.state.segments[0] ? this.state.segments[0].origin + "-" + this.state.segments[0].destination : "DAC-DXB"), carrier: carrier, class: "Y", date: "05JAN", status: "O", statusDesc: "OPEN FOR USE" }];

      const newTkt = {
        ticketNumber: newTktNum,
        ticketNumberRaw: newTktNum.replace(/-/g, ""),
        issueDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" }).toUpperCase().replace(/ /g, ""),
        voidDeadline: sameDayVoidDeadline(),
        carrier: carrier,
        paxName: pax,
        baseFare: opts.newBase ?? ((opts.originalBase || 43225) + (opts.fareDiff || 0)),
        taxes: opts.newTaxes !== undefined ? [{ num: 1, amount: opts.newTaxes, code: "XT", desc: "Repriced taxes (training aggregate)" }] : (tkt && tkt.taxes ? clone(tkt.taxes) : []),
        currency: "BDT",
        total: (opts.newFare || 58225),
        status: "OPEN FOR USE",
        exchangedTicket: oldTktNum,
        addCollect: Math.max(0, opts.addCollect || 0),
        residualValue: Math.max(0, -(opts.addCollect || 0)),
        penalty: opts.penalty || 0,
        coupons: newCoupons,
        fop: opts.fop || "EXCH + CASH"
      };

      this.state.issuedTicket = newTkt;
      const oldTktKey = ticketKey(oldTktNum);
      const oldIdx = (this.state.issuedTickets || []).findIndex(item => ticketKey(item.ticketNumber) === oldTktKey);
      let newIssuedTickets = (this.state.issuedTickets || []).filter(item => ticketKey(item.ticketNumber) !== ticketKey(newTktNum) && ticketKey(item.ticketNumber) !== oldTktKey);
      if (oldIdx >= 0) {
        newIssuedTickets.splice(oldIdx, 0, newTkt);
      } else {
        newIssuedTickets.unshift(newTkt);
      }
      if (tkt) {
        newIssuedTickets.push(tkt);
      }
      this.state.issuedTickets = newIssuedTickets;
      this.state.ticketHistory = (this.state.ticketHistory || []).filter(item => ticketKey(item.ticketNumber) !== oldTktKey).concat(tkt ? [tkt] : []);
      this.state.issued = true;
      this.state.exchangeTicket = oldTktNum;
      this.lastSavedPnr = clone(this.state);

      const lines = [
        "OK 0001",
        "***************** ASSISTED TICKETING — EXCHANGE NOTICE *****************",
        `TRANSACTION TYPE : ${isPartial ? "PARTIALLY USED TICKET REISSUE (HISTORICAL/HALF-RT)" : "UNUSED TICKET EXCHANGE (FULL REISSUE)"}`,
        `ORIGINAL TICKET  : ${oldTktNum} (STATUS: ${isPartial ? "PARTIALLY EXCHANGED" : "EXCHANGED"})`,
        `NEW TICKET NO    : ${newTktNum} (STATUS: OPEN FOR USE)`,
        `PASSENGER        : 1.1 ${pax}`,
        `BASE FARE DIFF   : BDT ${opts.fareDiff || 0}`,
        `TAX DIFFERENCE   : BDT ${opts.taxDiff || 0}`,
        `CHANGE PENALTY   : BDT ${opts.penalty || 0} (CP / CAT 16/31)`,
        `${(opts.addCollect || 0) >= 0 ? "ADD COLLECT" : "RESIDUAL VALUE"}       : BDT ${Math.abs(opts.addCollect || 0)}`,
        `${(opts.addCollect || 0) >= 0 ? "PAYMENT METHOD" : "REFUND METHOD"}     : ${opts.fop || "EXCH + CASH"}`,
        "TRAINING MODE    : SIMULATED EXCHANGE NOTICE - NO BSP TRANSACTION",
        "************************************************************************"
      ];

      return {
        ok: true,
        lines,
        kind: "reissue-ok",
        oldTicket: oldTktNum,
        newTicket: newTktNum,
        addCollect: opts.addCollect,
        status: newTkt.status
      };
    }

    processAssistedVoid(opts) {
      const tkt = this.findTicket(opts.ticketNumber);
      if (!tkt) return { ok: false, lines: ["TICKET NOT FOUND - RETRIEVE A TICKETED PNR OR ENTER A VALID TRAINING TICKET NUMBER"], kind: "error" };
      const voidCheck = ticketCanBeVoided(tkt);
      if (!voidCheck.ok) return { ok: false, lines: [`CANNOT VOID TICKET: ${voidCheck.reason}`], kind: "error" };
      this.state.issuedTicket = tkt;
      tkt.status = "VOID";
      (tkt.coupons || []).forEach(c => { c.status = "V"; c.statusDesc = "VOID"; });

      const carrier = tkt.carrier || "BG";
      const prefix = carrier === "TK" ? "235" : "997";
      const voidNoticeNo = `VOID-${prefix}-${Math.floor(100000 + Math.random() * 900000)}`;
      this.state.voidNotice = voidNoticeNo;

      const lines = [
        "OK 0001",
        "**************** ASSISTED TICKETING — VOID NOTICE ****************",
        "TRANSACTION TYPE : ELECTRONIC TICKET VOID (SAME-DAY CANCELLATION)",
        `VOID NOTICE NO   : ${voidNoticeNo}`,
        `TICKET NUMBER    : ${tkt.ticketNumber}`,
        `PASSENGER        : 1.1 ${tkt.paxName}`,
        `ORIGINAL AMOUNT  : BDT ${tkt.total.toLocaleString()}`,
        `VOID REASON      : ${opts.reason || "AGENCY BOOKING ERROR / CUSTOMER REQUEST"}`,
        "CANCELLATION FEE : BDT 0 (NO PENALTY - VOID ON SAME DAY)",
        "TICKET STATUS    : VOID (ALL COUPONS MARKED AS V)",
        "REPORTING SYSTEM : BSP / ARC SALES LOG CANCELLED SUCCESSFULLY",
        "******************************************************************"
      ];

      return {
        ok: true,
        lines,
        kind: "void-ok",
        noticeNo: voidNoticeNo,
        status: "VOID"
      };
    }

    error(msg) { return { lines: [msg], kind: "error" }; }
  }

  GalileoCommandEngine.PAGE_SIZE = 15;

  global.GalileoCommandEngine = GalileoCommandEngine;
  global.GalileoSteps = STEPS;
}(window));
