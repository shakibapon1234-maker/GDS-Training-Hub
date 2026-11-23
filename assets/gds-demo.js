/**
 * GDS Training Hub — Live Terminal Demo Engine (v3.0)
 * Authentic Cryptic Terminal Engine for Amadeus, Galileo, and Sabre
 * Supports flight search, seat sell, passenger name, contact, ticketing,
 * End Record (PNR Creation) and Ticket Issue (FXP / FQ / WP).
 * Reissue and Refund commands are restricted with educational demo limitations.
 * (C) GDS Training Hub — Professional Aviation Simulator
 */

(function () {
  'use strict';

  // --- Airport & City Database (Valid 3-letter IATA codes) ---
  const AIRPORTS = {
    DAC: { city: 'DHAKA', country: 'BANGLADESH', tz: 'BST', offset: 6 },
    CGP: { city: 'CHITTAGONG', country: 'BANGLADESH', tz: 'BST', offset: 6 },
    CXB: { city: 'COX S BAZAR', country: 'BANGLADESH', tz: 'BST', offset: 6 },
    ZYL: { city: 'SYLHET', country: 'BANGLADESH', tz: 'BST', offset: 6 },
    DXB: { city: 'DUBAI', country: 'UNITED ARAB EMIRATES', tz: 'GST', offset: 4 },
    AUH: { city: 'ABU DHABI', country: 'UNITED ARAB EMIRATES', tz: 'GST', offset: 4 },
    SHJ: { city: 'SHARJAH', country: 'UNITED ARAB EMIRATES', tz: 'GST', offset: 4 },
    DOH: { city: 'DOHA', country: 'QATAR', tz: 'AST', offset: 3 },
    JED: { city: 'JEDDAH', country: 'SAUDI ARABIA', tz: 'AST', offset: 3 },
    MED: { city: 'MEDINA', country: 'SAUDI ARABIA', tz: 'AST', offset: 3 },
    RUH: { city: 'RIYADH', country: 'SAUDI ARABIA', tz: 'AST', offset: 3 },
    DMM: { city: 'DAMMAM', country: 'SAUDI ARABIA', tz: 'AST', offset: 3 },
    KWI: { city: 'KUWAIT', country: 'KUWAIT', tz: 'AST', offset: 3 },
    MCT: { city: 'MUSCAT', country: 'OMAN', tz: 'GST', offset: 4 },
    BAH: { city: 'BAHRAIN', country: 'BAHRAIN', tz: 'AST', offset: 3 },
    BKK: { city: 'BANGKOK', country: 'THAILAND', tz: 'ICT', offset: 7 },
    SIN: { city: 'SINGAPORE', country: 'SINGAPORE', tz: 'SGT', offset: 8 },
    KUL: { city: 'KUALA LUMPUR', country: 'MALAYSIA', tz: 'MYT', offset: 8 },
    DEL: { city: 'DELHI', country: 'INDIA', tz: 'IST', offset: 5.5 },
    CCU: { city: 'KOLKATA', country: 'INDIA', tz: 'IST', offset: 5.5 },
    BOM: { city: 'MUMBAI', country: 'INDIA', tz: 'IST', offset: 5.5 },
    KTM: { city: 'KATHMANDU', country: 'NEPAL', tz: 'NPT', offset: 5.75 },
    CMB: { city: 'COLOMBO', country: 'SRI LANKA', tz: 'IST', offset: 5.5 },
    IST: { city: 'ISTANBUL', country: 'TURKEY', tz: 'TRT', offset: 3 },
    LHR: { city: 'LONDON HEATHROW', country: 'UNITED KINGDOM', tz: 'GMT', offset: 0 },
    MAN: { city: 'MANCHESTER', country: 'UNITED KINGDOM', tz: 'GMT', offset: 0 },
    JFK: { city: 'NEW YORK JFK', country: 'UNITED STATES', tz: 'EST', offset: -5 },
    YYZ: { city: 'TORONTO', country: 'CANADA', tz: 'EST', offset: -5 },
    SYD: { city: 'SYDNEY', country: 'AUSTRALIA', tz: 'AEDT', offset: 11 }
  };

  const VALID_MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  const AIRLINE_PREFIXES = {
    EK: '176', BG: '997', SV: '065', QR: '157', FZ: '141',
    BS: '779', SQ: '618', TG: '217', TK: '235', EY: '607',
    G9: '514', GF: '072', J9: '486', KU: '229', WY: '910'
  };

  // Standard Route Presets
  const ROUTE_DATA = {
    'DAC-DXB': [
      { al: 'EK', fn: '585', dep: '0100', arr: '0430', eq: '77W', classes: 'J4 C4 D4 I2 Y9 B9 M9 H9 K9 Q9' },
      { al: 'BG', fn: '047', dep: '1930', arr: '2315', eq: '788', classes: 'J2 C2 D0 Y9 B9 M9 K9 H9 V9 L9' },
      { al: 'FZ', fn: '584', dep: '1130', arr: '1530', eq: '738', classes: 'C4 J4 Y9 B9 M9 K9 V9 S9 N9 Q9' },
      { al: 'BS', fn: '341', dep: '1840', arr: '2230', eq: '738', classes: 'Y9 B9 M9 K9 H9 V9 L9' },
      { al: 'EK', fn: '587', dep: '1945', arr: '2315', eq: '77W', classes: 'J4 C4 D4 I0 Y9 B9 M9 H9 K9' }
    ],
    'DAC-JED': [
      { al: 'SV', fn: '805', dep: '0320', arr: '0740', eq: '77W', classes: 'J4 C4 D4 Y9 B9 M9 H9 K9 L9' },
      { al: 'BG', fn: '335', dep: '2045', arr: '0115+1', eq: '77W', classes: 'J2 C2 Y9 B9 M9 H9 K9' },
      { al: 'SV', fn: '803', dep: '1430', arr: '1850', eq: '77W', classes: 'J4 C4 D4 Y9 B9 M9 H9 K9' },
      { al: 'EK', fn: '585', dep: '0100', arr: '0430', eq: '77W', via: 'DXB', conxAl: 'EK', conxFn: '803', conxDep: '0700', conxArr: '0910', conxEq: '77W', classes: 'J4 C4 D4 Y9 B9 M9 H9 K9' },
      { al: 'QR', fn: '643', dep: '2000', arr: '2250', eq: '789', via: 'DOH', conxAl: 'QR', conxFn: '1184', conxDep: '0130+1', conxArr: '0405+1', conxEq: '359', classes: 'J4 C4 D4 Y9 B9 M9' }
    ],
    'DAC-LHR': [
      { al: 'BG', fn: '201', dep: '1015', arr: '1615', eq: '789', classes: 'J2 C2 D1 Y9 B9 M9 H9 K9' },
      { al: 'EK', fn: '585', dep: '0100', arr: '0430', eq: '77W', via: 'DXB', conxAl: 'EK', conxFn: '001', conxDep: '0745', conxArr: '1140', conxEq: '388', classes: 'J4 C4 D4 Y9 B9 M9 H9 K9' },
      { al: 'QR', fn: '639', dep: '1050', arr: '1340', eq: '788', via: 'DOH', conxAl: 'QR', conxFn: '007', conxDep: '1505', conxArr: '1940', conxEq: '388', classes: 'J4 C4 D4 Y9 B9 M9 H9' },
      { al: 'TK', fn: '713', dep: '0655', arr: '1325', eq: '77W', via: 'IST', conxAl: 'TK', conxFn: '1971', conxDep: '1500', conxArr: '1610', conxEq: '321', classes: 'J4 C4 D4 Y9 B9 M9 H9' }
    ],
    'DAC-SIN': [
      { al: 'SQ', fn: '447', dep: '2355', arr: '0605+1', eq: '359', classes: 'J4 C4 U4 Y9 B9 M9 H9 W9 K9' },
      { al: 'BG', fn: '584', dep: '0830', arr: '1440', eq: '738', classes: 'J2 C2 Y9 B9 M9 K9 H9' },
      { al: 'BS', fn: '307', dep: '2245', arr: '0500+1', eq: '738', classes: 'Y9 B9 M9 K9 H9 V9' },
      { al: 'SQ', fn: '449', dep: '1325', arr: '1935', eq: '359', classes: 'J4 C4 U4 Y9 B9 M9 H9 W9' }
    ],
    'DAC-BKK': [
      { al: 'TG', fn: '322', dep: '1335', arr: '1700', eq: '777', classes: 'C4 J4 Y9 B9 M9 H9 Q9 T9 K9' },
      { al: 'BG', fn: '088', dep: '1130', arr: '1500', eq: '738', classes: 'J2 C2 Y9 B9 M9 K9 H9' },
      { al: 'BS', fn: '213', dep: '0940', arr: '1310', eq: '738', classes: 'Y9 B9 M9 K9 H9 V9' }
    ]
  };

  function createEmptyPnrState() {
    return {
      hasSearch: false,
      lastRoute: null,
      lastDate: null,
      lastFlights: null,
      org: null,
      dst: null,
      heldFlight: null,
      heldClass: 'Y',
      paxCount: 1,
      passengers: [], // ['CHOWDHURY/RAHIM MR']
      phone: null,
      ticketing: null,
      receivedFrom: null,
      locator: null,
      isPnrEnded: false,
      isTicketIssued: false,
      ticketNumber: null
    };
  }

  const sessionState = {
    amadeus: createEmptyPnrState(),
    galileo: createEmptyPnrState(),
    sabre:   createEmptyPnrState()
  };

  function parseDateStrict(rawDate) {
    if (!rawDate) return null;
    const clean = rawDate.trim().toUpperCase();
    const m = clean.match(/^(\d{1,2})([A-Z]{3})$/);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const month = m[2];
    if (day < 1 || day > 31) return null;
    if (!VALID_MONTHS.includes(month)) return null;
    return String(day).padStart(2, '0') + month;
  }

  function getDayOfWeek(dateStr) {
    const m = (dateStr || "15OCT").match(/^(\d{1,2})([A-Z]{3})/i);
    if (!m) return "WE";
    const day = parseInt(m[1], 10);
    const monthIdx = VALID_MONTHS.indexOf(m[2].toUpperCase());
    const year = new Date().getFullYear();
    const d = new Date(year, monthIdx >= 0 ? monthIdx : 9, day);
    const days = ['SU','MO','TU','WE','TH','FR','SA'];
    return days[d.getDay()];
  }

  function getFlights(org, dst, carrierFilter) {
    const key = `${org}-${dst}`;
    let list = ROUTE_DATA[key];
    if (!list) {
      const alList = carrierFilter ? [carrierFilter] : ['BG', 'EK', 'QR', 'SV'];
      list = alList.map((al, idx) => ({
        al: al,
        fn: String(100 + idx * 115),
        dep: String(6 + idx * 4).padStart(2, '0') + '30',
        arr: String(10 + idx * 4).padStart(2, '0') + '45',
        eq: '77W',
        classes: 'J4 C4 D4 Y9 B9 M9 H9 K9 Q9'
      }));
    }
    if (carrierFilter) {
      const filtered = list.filter(f => f.al.toUpperCase() === carrierFilter.toUpperCase());
      return filtered.length ? filtered : list;
    }
    return list;
  }

  function generateRandomLocator() {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const digits = '23456789';
    const pick = chars => chars.charAt(Math.floor(Math.random() * chars.length));
    const chars = [pick(letters), pick(digits)];
    const all = letters + digits;
    while (chars.length < 6) chars.push(pick(all));
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  }

  function generateTicketNumber(airlineCode) {
    const prefix = AIRLINE_PREFIXES[airlineCode] || '176';
    const random10 = String(Math.floor(1000000000 + Math.random() * 9000000000));
    return `${prefix}-${random10}`;
  }

  function getSampleFare(route) {
    if (route === 'DAC-DXB') return { base: 45200, tax: 9850, total: 55050 };
    if (route === 'DAC-JED') return { base: 49500, tax: 10500, total: 60000 };
    if (route === 'DAC-LHR') return { base: 78000, tax: 17500, total: 95500 };
    if (route === 'DAC-SIN') return { base: 36000, tax: 7200, total: 43200 };
    return { base: 42000, tax: 8500, total: 50500 };
  }

  // ==========================================
  // 1. AMADEUS ENGINE
  // ==========================================
  function parseAmadeus(rawCmd) {
    const clean = rawCmd.trim().toUpperCase();
    const st = sessionState.amadeus;

    // Reset / Ignore
    if (clean === 'IG' || clean === 'IR') {
      sessionState.amadeus = createEmptyPnrState();
      return {
        type: 'info',
        lines: [
          `IGN`,
          `-------------------------------------------------------------------`,
          `✓ AMADEUS WORKSPACE RESET. আপনি নতুন করে PNR প্র্যাকটিস করতে পারেন।`,
          `কমান্ড লিখুন: AN 15OCT DACDXB`
        ]
      };
    }

    // Flight search: AN 15OCT DACDXB
    const anMatch = clean.replace(/\s+/g, '').match(/^AN(?:(\d{1,2}[A-Z]{3}))?([A-Z]{3})([A-Z]{3})(?:\/A?([A-Z0-9]{2}))?$/);
    if (anMatch) {
      const rawDate = anMatch[1];
      const org = anMatch[2];
      const dst = anMatch[3];
      const al = anMatch[4] || null;

      if (!AIRPORTS[org] || !AIRPORTS[dst]) {
        return {
          type: 'error',
          lines: [
            `INVALID FORMAT — AIRPORT CODE NOT FOUND`,
            `Check 3-letter IATA city code (e.g. DAC, DXB, JED, LHR, SIN, BKK)`
          ]
        };
      }
      if (org === dst) {
        return {
          type: 'error',
          lines: [`INVALID FORMAT — ORIGIN AND DESTINATION CANNOT BE SAME`]
        };
      }

      const validDate = rawDate ? parseDateStrict(rawDate) : '15OCT';
      if (rawDate && !validDate) {
        return {
          type: 'error',
          lines: [`INVALID FORMAT — CHECK DATE (e.g. 15OCT, 20NOV, 10DEC)`]
        };
      }

      const d = AIRPORTS[dst];
      const day = getDayOfWeek(validDate);
      const destCity = d.city.padEnd(20, ' ');
      const flights = getFlights(org, dst, al);

      st.hasSearch = true;
      st.lastRoute = `${org}-${dst}`;
      st.lastDate = validDate;
      st.lastFlights = flights;
      st.org = org;
      st.dst = dst;

      const lines = [];
      lines.push(`** AMADEUS AVAILABILITY - AN ** ${destCity} ${validDate} ${day} 0000`);

      flights.forEach((fl, idx) => {
        const lineNum = String(idx + 1).padStart(2, ' ');
        const alPad = `${fl.al} ${fl.fn.padEnd(4, ' ')}`;
        const clsPart = fl.classes.slice(0, 21).padEnd(21, ' ');

        if (fl.via) {
          lines.push(`${lineNum}  ${alPad}  ${clsPart} /${org} ${fl.via}   ${fl.dep}   ${fl.arr}   ${fl.eq}  0 /E`);
          const conxAlPad = `${fl.conxAl} ${fl.conxFn.padEnd(4, ' ')}`;
          lines.push(`    ${conxAlPad}  ${clsPart} /${fl.via} ${dst}   ${fl.conxDep}   ${fl.conxArr}   ${fl.conxEq}  0 /E`);
        } else {
          lines.push(`${lineNum}  ${alPad}  ${clsPart} /${org} ${dst}   ${fl.dep}   ${fl.arr}   ${fl.eq}  0 /E`);
        }
      });

      lines.push(` `);
      lines.push(`👉 পরবর্তী ধাপ (সিট হোল্ড): টাইপ করুন SS 1 Y 1`);
      return { type: 'availability', lines };
    }

    // Seat Hold: SS 1 Y 1 or SS1Y1 or SS 1 K 1
    const ssMatch = clean.replace(/\s+/g, '').match(/^SS(\d+)([A-Z])(\d+)?$/);
    if (ssMatch) {
      if (!st.hasSearch) {
        return {
          type: 'error',
          lines: [
            `NO ACTIVE AVAILABILITY — ENTER AN 15OCT DACDXB FIRST`,
            `প্রথমে ফ্লাইট সার্চ করুন, তারপর সিট হোল্ড কমান্ড দিন।`
          ]
        };
      }
      const paxCount = parseInt(ssMatch[1], 10);
      const cls = ssMatch[2];
      const lineNum = ssMatch[3] ? parseInt(ssMatch[3], 10) : 1;

      const fl = (st.lastFlights && st.lastFlights[lineNum - 1]) || st.lastFlights[0];
      if (!fl) {
        return {
          type: 'error',
          lines: [`LINE ${lineNum} NOT FOUND IN ACTIVE AVAILABILITY`]
        };
      }

      st.heldFlight = fl;
      st.heldClass = cls;
      st.paxCount = paxCount;

      const lines = [];
      lines.push(`--- PNR ITINERARY SEGMENT (AMADEUS) ---`);
      lines.push(` 1  ${fl.al} ${fl.fn.padEnd(4, ' ')} ${cls}  ${st.lastDate}  ${st.org}${st.dst}  HK${paxCount}   ${fl.dep} ${fl.arr}   ${fl.eq} /E`);
      lines.push(` `);
      lines.push(`✓ SEAT HOLD CONFIRMED: ${paxCount} SEAT (${cls} CLASS) - STATUS: HK${paxCount}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (যাত্রীর নাম): টাইপ করুন NM1CHOWDHURY/RAHIM MR`);
      return { type: 'seathold', lines };
    }

    // Passenger Name: NM1SURNAME/FIRST TITLE
    const nmMatch = clean.match(/^NM(\d+)([A-Z ]+)\/([A-Z .]+?)\s+(MR|MRS|MS|MSTR|MISS)$/);
    if (nmMatch) {
      if (!st.heldFlight) {
        return {
          type: 'error',
          lines: [`NO ACTIVE SEGMENT — PLEASE HOLD SEAT FIRST (e.g. SS 1 Y 1)`]
        };
      }
      const surname = nmMatch[2].trim();
      const first = nmMatch[3].trim();
      const title = nmMatch[4];
      const fullName = `${surname}/${first} ${title}`;
      st.passengers = [fullName];

      const lines = [];
      lines.push(` 1.${fullName}`);
      lines.push(`✓ PASSENGER NAME ADDED: ${fullName}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (কন্টাক্ট ফিল্ড): টাইপ করুন AP DAC 01711000000`);
      return { type: 'pnr_building', lines };
    }

    // Contact field: AP ...
    if (clean.startsWith('AP')) {
      const contactVal = clean.replace(/^AP\s*/, '').trim() || 'DAC 01711000000';
      st.phone = contactVal;
      const lines = [];
      lines.push(`AP ${contactVal}`);
      lines.push(`✓ CONTACT (AP) ADDED: ${contactVal}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (টিকেট টাইম-লিমিট): টাইপ করুন TK TL${st.lastDate || '15OCT'}`);
      return { type: 'pnr_building', lines };
    }

    // Ticketing field: TK ...
    if (clean.startsWith('TK')) {
      const tkVal = clean.replace(/^TK\s*/, '').trim() || `TL${st.lastDate || '15OCT'}/DAC1A0980`;
      st.ticketing = tkVal;
      const lines = [];
      lines.push(`TK ${tkVal}`);
      lines.push(`✓ TICKETING ELEMENT (TK) ADDED`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (রিসিভড ফ্রম): টাইপ করুন RF BAYEZID`);
      return { type: 'pnr_building', lines };
    }

    // Received From: RF ...
    if (clean.startsWith('RF')) {
      const rfVal = clean.replace(/^RF\s*/, '').trim() || 'BAYEZID';
      st.receivedFrom = rfVal;
      const lines = [];
      lines.push(`RF ${rfVal}`);
      lines.push(`✓ RECEIVED FROM SAVED`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (পিএনআর সম্পন্ন ও রেকর্ড লোকেটর তৈরি): টাইপ করুন ER`);
      return { type: 'pnr_building', lines };
    }

    // End of Record: ER or ET
    if (clean === 'ER' || clean === 'ET') {
      if (!st.heldFlight) {
        return {
          type: 'error',
          lines: [`NO ITINERARY TO END RECORD — PLEASE HOLD SEAT FIRST (SS 1 Y 1)`]
        };
      }
      if (!st.passengers.length) {
        return {
          type: 'error',
          lines: [`NEED PASSENGER NAME — ENTER NM1SURNAME/FIRST MR`]
        };
      }
      if (!st.phone) {
        return {
          type: 'error',
          lines: [`NEED CONTACT (AP) — ENTER AP DAC 01711000000`]
        };
      }
      if (!st.ticketing) {
        return {
          type: 'error',
          lines: [`NEED TICKETING ARRANGEMENT — ENTER TK TL${st.lastDate || '15OCT'}`]
        };
      }
      if (!st.receivedFrom) {
        return {
          type: 'error',
          lines: [`NEED RECEIVED FROM — ENTER RF BAYEZID`]
        };
      }

      if (!st.locator) {
        st.locator = generateRandomLocator();
      }
      st.isPnrEnded = true;

      const fl = st.heldFlight;
      const now = new Date();
      const yr = String(now.getFullYear()).slice(-2);
      const lines = [];
      lines.push(`RP/DAC1A0980/0001AA                     ${st.lastDate || '15OCT'}${yr}/1435Z   ${st.locator}`);
      lines.push(`  1.${st.passengers[0]}`);
      lines.push(`  2  ${fl.al} ${fl.fn.padEnd(4, ' ')} ${st.heldClass} ${st.lastDate} 3 ${st.org}${st.dst} HK1  ${fl.dep} ${fl.arr}   ${fl.eq} E  ${fl.al}/${st.locator}`);
      lines.push(`  3 AP ${st.phone} - A`);
      lines.push(`  4 TK ${st.ticketing}`);
      lines.push(`  5 OP DAC1A0980/${st.lastDate}`);
      lines.push(` `);
      lines.push(`✓ PNR RECORD CREATED SUCCESSFULLY! RECORD LOCATOR: ${st.locator}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 চূড়ান্ত ধাপ (ফেয়ার প্রাইসিং ও টিকিট ইস্যু): টাইপ করুন FXP অথবা TTP`);
      return { type: 'pnr_confirmed', lines };
    }

    // Pricing & Ticket Issue: FXP or TTP or FXB
    if (/^(FXP|TTP|FXB|FXR|FXX)/.test(clean)) {
      if (!st.isPnrEnded) {
        return {
          type: 'error',
          lines: [
            `NO CONFIRMED PNR ACTIVE — ENTER ER TO COMPLETE PNR FIRST`,
            `আগে ER দিয়ে PNR রেকর্ড তৈরি করুন, তারপর টিকেট ইস্যু (FXP) কমান্ড দিন।`
          ]
        };
      }

      const fl = st.heldFlight;
      const fare = getSampleFare(st.lastRoute);
      if (!st.ticketNumber) {
        st.ticketNumber = generateTicketNumber(fl.al);
      }
      st.isTicketIssued = true;

      const lines = [];
      lines.push(`--- AMADEUS ELECTRONIC TICKET ISSUE CONFIRMATION ---`);
      lines.push(`TICKET NUMBER  : ${st.ticketNumber} / C1`);
      lines.push(`PNR LOCATOR    : ${st.locator}`);
      lines.push(`PASSENGER      : ${st.passengers[0]} (ADT)`);
      lines.push(`FLIGHT         : ${fl.al} ${fl.fn} (${st.heldClass}) ${st.lastDate} ${st.org}-${st.dst}`);
      lines.push(`FARE CALC      : BDT ${fare.base.toLocaleString()} + TAX BDT ${fare.tax.toLocaleString()}`);
      lines.push(`TOTAL AMOUNT   : BDT ${fare.total.toLocaleString()}`);
      lines.push(`STATUS         : OK / ELECTRONIC TICKET ISSUED`);
      lines.push(`FORM OF PAYMENT: CASH / NON-REF`);
      lines.push(`END OF TRANSACTION COMPLETE.`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`🎉 অভিনন্দন! Amadeus-এ টিকিট সফলভাবে ইস্যু করা হয়েছে!`);

      return {
        type: 'ticket_issued',
        lines,
        ticket: {
          gds: 'Amadeus',
          pnr: st.locator,
          ticketNumber: st.ticketNumber,
          pax: st.passengers[0],
          flight: `${fl.al} ${fl.fn} (${st.heldClass}) ${st.org}-${st.dst}`,
          amount: `BDT ${fare.total.toLocaleString()}`
        }
      };
    }

    // RT - Retrieve PNR
    if (clean === 'RT' || clean.startsWith('RT')) {
      if (!st.locator) {
        return { type: 'error', lines: [`NO ACTIVE PNR RECORD LOCATOR FOUND`] };
      }
      const fl = st.heldFlight;
      const yr = String(new Date().getFullYear()).slice(-2);
      const lines = [];
      lines.push(`RP/DAC1A0980/0001AA                     ${st.lastDate || '15OCT'}${yr}/1435Z   ${st.locator}`);
      lines.push(`  1.${st.passengers[0]}`);
      lines.push(`  2  ${fl.al} ${fl.fn.padEnd(4, ' ')} ${st.heldClass} ${st.lastDate} 3 ${st.org}${st.dst} HK1  ${fl.dep} ${fl.arr}   ${fl.eq} E  ${fl.al}/${st.locator}`);
      lines.push(`  3 AP ${st.phone} - A`);
      lines.push(`  4 TK ${st.ticketing}`);
      if (st.ticketNumber) {
        lines.push(`  5 FA PAX ${st.ticketNumber}/ETEK/BDT${getSampleFare(st.lastRoute).total}`);
      }
      return { type: 'pnr_display', lines };
    }

    // Reissue / Refund commands (RESTRICTED AS REQUESTED)
    if (/^(FO|FE|TRDC|TRNE|TTF|TTS|TTR|TRF|WFR)/.test(clean)) {
      return {
        type: 'restricted_reissue',
        lines: [
          `>> ⚠️ [ডেমো লিমিটেশন — রি-ইস্যু ও রিফান্ড লকড]`,
          `>> "${clean}" কমান্ডটি শুধুমাত্র ফুল লাইসেন্সড সিমুলেটরে উপলব্ধ।`,
          `>> আমাদের লাইভ ট্রায়ালটি শুধুমাত্র 'PNR তৈরি ও টিকিট ইস্যু' পর্যন্ত অনুমোদিত।`,
          `>> ফুল ভার্সনে Re-issue, Refund ও Penalty Calculation আজীবন প্র্যাকটিস করতে ফুল বান্ডেল কিনুন।`
        ]
      };
    }

    // Anything else invalid
    return {
      type: 'error',
      lines: [
        `INVALID COMMAND FORMAT`,
        `কমান্ড গাইড: AN 15OCT DACDXB (ফ্লাইট সার্চ), SS 1 Y 1 (সিট হোল্ড), NM1... (নাম), AP (ফোন), TK (টিকেট), RF (রিসিভড), ER (পিএনআর), FXP (টিকেট ইস্যু)`
      ]
    };
  }

  // ==========================================
  // 2. GALILEO ENGINE
  // ==========================================
  function parseGalileo(rawCmd) {
    const clean = rawCmd.trim().toUpperCase();
    const st = sessionState.galileo;

    // Reset / Ignore
    if (clean === 'I' || clean === 'IR' || clean === 'IG') {
      sessionState.galileo = createEmptyPnrState();
      return {
        type: 'info',
        lines: [
          `I`,
          `-------------------------------------------------------------------`,
          `✓ GALILEO SMARTPOINT WORKSPACE RESET. নতুন করে প্র্যাকটিস শুরু করতে পারেন।`,
          `কমান্ড লিখুন: A15OCTDACDXB`
        ]
      };
    }

    // Flight search: A15OCTDACDXB or A15OCTDACDXB*EK
    const galMatch = clean.replace(/\s+/g, '').match(/^A(?:(\d{1,2}[A-Z]{3}))?([A-Z]{3})([A-Z]{3})(?:\*([A-Z0-9]{2}))?$/);
    if (galMatch) {
      const rawDate = galMatch[1];
      const org = galMatch[2];
      const dst = galMatch[3];
      const al = galMatch[4] || null;

      if (!AIRPORTS[org] || !AIRPORTS[dst]) {
        return {
          type: 'error',
          lines: [
            `CHECK ENTRY - INVALID CITY/AIRPORT CODE`,
            `Check 3-letter IATA city code (e.g. DAC, DXB, JED, LHR, SIN, BKK)`
          ]
        };
      }
      if (org === dst) {
        return {
          type: 'error',
          lines: [`CHECK ENTRY - ORIGIN AND DESTINATION CANNOT BE SAME`]
        };
      }

      const validDate = rawDate ? parseDateStrict(rawDate) : '15OCT';
      if (rawDate && !validDate) {
        return {
          type: 'error',
          lines: [`CHECK ENTRY - INVALID DATE FORMAT (Use e.g. 15OCT, 20NOV)`]
        };
      }

      const o = AIRPORTS[org];
      const d = AIRPORTS[dst];
      const day = getDayOfWeek(validDate);
      const flights = getFlights(org, dst, al);

      st.hasSearch = true;
      st.lastRoute = `${org}-${dst}`;
      st.lastDate = validDate;
      st.lastFlights = flights;
      st.org = org;
      st.dst = dst;

      const lines = [];
      lines.push(`${validDate} ${day} ${org}${dst} *GALILEO AVAILABILITY*`);

      flights.forEach((fl, idx) => {
        const lineNum = String(idx + 1);
        const alCode = fl.al.padEnd(2, ' ');
        const fnCode = fl.fn.padStart(4, ' ');
        const clsPart = fl.classes.slice(0, 24).padEnd(24, ' ');

        if (fl.via) {
          lines.push(`${lineNum}  ${alCode} ${fnCode} ${clsPart} ${org}${fl.via}  ${fl.dep}  ${fl.arr}  ${fl.eq} /E`);
          const conxAl = fl.conxAl.padEnd(2, ' ');
          const conxFn = fl.conxFn.padStart(4, ' ');
          lines.push(`    ${conxAl} ${conxFn} ${clsPart} ${fl.via}${dst}  ${fl.conxDep}  ${fl.conxArr}  ${fl.conxEq} /E`);
        } else {
          lines.push(`${lineNum}  ${alCode} ${fnCode} ${clsPart} ${org}${dst}  ${fl.dep}  ${fl.arr}  ${fl.eq} /E`);
        }
      });

      lines.push(` `);
      lines.push(`👉 পরবর্তী ধাপ (সিট হোল্ড): টাইপ করুন N.1Y1 অথবা 01Y1`);
      return { type: 'availability', lines };
    }

    // Seat Hold: N.1Y1 or N1Y1 or 01Y1
    const nMatch = clean.replace(/\s+/g, '').match(/^(?:N\.?|0)(\d+)([A-Z])(\d+)?$/);
    if (nMatch) {
      if (!st.hasSearch) {
        return {
          type: 'error',
          lines: [
            `NO ACTIVE AVAILABILITY — ENTER A15OCTDACDXB FIRST`,
            `প্রথমে গ্যালিলিও ফ্লাইট সার্চ করুন, তারপর সিট হোল্ড কমান্ড দিন।`
          ]
        };
      }
      const paxCount = parseInt(nMatch[1], 10);
      const cls = nMatch[2];
      const lineNum = nMatch[3] ? parseInt(nMatch[3], 10) : 1;

      const fl = (st.lastFlights && st.lastFlights[lineNum - 1]) || st.lastFlights[0];
      if (!fl) {
        return {
          type: 'error',
          lines: [`LINE ${lineNum} NOT FOUND IN ACTIVE AVAILABILITY`]
        };
      }

      st.heldFlight = fl;
      st.heldClass = cls;
      st.paxCount = paxCount;

      const lines = [];
      lines.push(`--- GALILEO BOOKING FILE SEGMENT ---`);
      lines.push(` 1. ${fl.al} ${fl.fn} ${cls} ${st.lastDate} ${st.org}${st.dst} HK${paxCount} ${fl.dep} ${fl.arr} *--`);
      lines.push(` `);
      lines.push(`✓ SEAT SELL CONFIRMED: HK${paxCount} IN ${cls} CLASS`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (যাত্রীর নাম): টাইপ করুন N.CHOWDHURY/RAHIM MR`);
      return { type: 'seathold', lines };
    }

    // Name: N.SURNAME/FIRST TITLE
    const galName = clean.match(/^N\.([A-Z ]+)\/([A-Z .]+?)\s+(MR|MRS|MS|MSTR|MISS)$/);
    if (galName) {
      if (!st.heldFlight) {
        return {
          type: 'error',
          lines: [`NO AIR ITINERARY — SELL SEAT FIRST (N.1Y1)`]
        };
      }
      const surname = galName[1].trim();
      const first = galName[2].trim();
      const title = galName[3];
      const fullName = `${surname}/${first} ${title}`;
      st.passengers = [fullName];

      const lines = [];
      lines.push(`1.1${fullName}`);
      lines.push(`✓ GALILEO NAME ADDED: ${fullName}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (ফোন ফিল্ড): টাইপ করুন P.DAC*01711000000`);
      return { type: 'pnr_building', lines };
    }

    // Phone: P. ...
    if (clean.startsWith('P.')) {
      const phoneVal = clean.replace(/^P\./, '').trim() || 'DAC*01711000000';
      st.phone = phoneVal;
      const lines = [];
      lines.push(`*P.`);
      lines.push(`✓ PHONE FIELD ADDED: ${phoneVal}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (টিকেট টাইম-লিমিট): টাইপ করুন T.TAU/${st.lastDate || '15OCT'}`);
      return { type: 'pnr_building', lines };
    }

    // Ticketing: T. ...
    if (clean.startsWith('T.')) {
      const tVal = clean.replace(/^T\./, '').trim() || `TAU/${st.lastDate || '15OCT'}`;
      st.ticketing = tVal;
      const lines = [];
      lines.push(`*T.`);
      lines.push(`✓ TICKETING ELEMENT SAVED: ${tVal}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (রিসিভড ফ্রম): টাইপ করুন R.BAYEZID`);
      return { type: 'pnr_building', lines };
    }

    // Received From: R. ...
    if (clean.startsWith('R.')) {
      const rVal = clean.replace(/^R\./, '').trim() || 'BAYEZID';
      st.receivedFrom = rVal;
      const lines = [];
      lines.push(`*R.`);
      lines.push(`✓ RECEIVED FROM SAVED: ${rVal}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (পিএনআর সম্পন্ন ও রেকর্ড লোকেটর তৈরি): টাইপ করুন ER`);
      return { type: 'pnr_building', lines };
    }

    // End Record: ER or E
    if (clean === 'ER' || clean === 'E') {
      if (!st.heldFlight) {
        return { type: 'error', lines: [`NO ACTIVE AIR ITINERARY TO END RECORD`] };
      }
      if (!st.passengers.length) {
        return { type: 'error', lines: [`NAME REQUIRED — ENTER N.SURNAME/FIRST MR`] };
      }
      if (!st.phone) {
        return { type: 'error', lines: [`PHONE REQUIRED — ENTER P.DAC*01711000000`] };
      }
      if (!st.ticketing) {
        return { type: 'error', lines: [`TICKETING REQUIRED — ENTER T.TAU/${st.lastDate || '15OCT'}`] };
      }
      if (!st.receivedFrom) {
        return { type: 'error', lines: [`RECEIVED FIELD REQUIRED — ENTER R.BAYEZID`] };
      }

      if (!st.locator) {
        st.locator = generateRandomLocator();
      }
      st.isPnrEnded = true;

      const fl = st.heldFlight;
      const lines = [];
      lines.push(`${st.locator}/60 HA89MD AG 9999999 ${st.lastDate}`);
      lines.push(`1.1${st.passengers[0]}`);
      lines.push(`1. ${fl.al} ${fl.fn} ${st.heldClass} ${st.lastDate} ${st.org}${st.dst} HK1 ${fl.dep} ${fl.arr} *--`);
      lines.push(`FONE-DAC*${st.phone}`);
      lines.push(`TKTG-T.${st.ticketing}`);
      lines.push(`RCVD-R.${st.receivedFrom}`);
      lines.push(` `);
      lines.push(`✓ GALILEO BOOKING FILE CREATED! LOCATOR: ${st.locator}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 চূড়ান্ত ধাপ (ফেয়ার প্রাইসিং ও টিকিট ইস্যু): টাইপ করুন FQ`);
      return { type: 'pnr_confirmed', lines };
    }

    // Fare Quote & Ticket Issue: FQ or *FF
    if (clean === 'FQ' || clean.startsWith('FQ') || clean === '*FF') {
      if (!st.isPnrEnded) {
        return {
          type: 'error',
          lines: [
            `NO FILED BOOKING — ENTER ER FIRST TO COMPLETE GALILEO RECORD`,
            `আগে ER দিয়ে গ্যালিলিও PNR সম্পন্ন করুন, তারপর FQ টিকেট কোটেশন দিন।`
          ]
        };
      }

      const fl = st.heldFlight;
      const fare = getSampleFare(st.lastRoute);
      if (!st.ticketNumber) {
        st.ticketNumber = generateTicketNumber(fl.al);
      }
      st.isTicketIssued = true;

      const lines = [];
      lines.push(`--- GALILEO SMARTPOINT TICKET ISSUE CONFIRMATION ---`);
      lines.push(`ETKT NUMBER   : ${st.ticketNumber} P1`);
      lines.push(`LOCATOR       : ${st.locator}`);
      lines.push(`NAME          : ${st.passengers[0]}`);
      lines.push(`ITINERARY     : ${fl.al} ${fl.fn} ${st.heldClass} ${st.org}-${st.dst}`);
      lines.push(`FARE / TAX    : BDT ${fare.base.toLocaleString()} / BDT ${fare.tax.toLocaleString()}`);
      lines.push(`TOTAL PRICE   : BDT ${fare.total.toLocaleString()}`);
      lines.push(`STATUS        : TICKET ISSUED / CONFIRMED`);
      lines.push(`FORM OF PYMT  : CASH`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`🎉 অভিনন্দন! Galileo-তে টিকিট সফলভাবে ইস্যু করা হয়েছে!`);

      return {
        type: 'ticket_issued',
        lines,
        ticket: {
          gds: 'Galileo',
          pnr: st.locator,
          ticketNumber: st.ticketNumber,
          pax: st.passengers[0],
          flight: `${fl.al} ${fl.fn} (${st.heldClass}) ${st.org}-${st.dst}`,
          amount: `BDT ${fare.total.toLocaleString()}`
        }
      };
    }

    // *R - Display PNR
    if (clean === '*R' || clean === '*ALL') {
      if (!st.locator) return { type: 'error', lines: [`NO ACTIVE BOOKING FILE TO DISPLAY`] };
      const fl = st.heldFlight;
      const lines = [];
      lines.push(`${st.locator}/60 HA89MD AG 9999999 ${st.lastDate}`);
      lines.push(`1.1${st.passengers[0]}`);
      lines.push(`1. ${fl.al} ${fl.fn} ${st.heldClass} ${st.lastDate} ${st.org}${st.dst} HK1 ${fl.dep} ${fl.arr} *--`);
      lines.push(`FONE-DAC*${st.phone}`);
      lines.push(`TKTG-T.${st.ticketing}`);
      return { type: 'pnr_display', lines };
    }

    // Reissue / Refund commands (RESTRICTED AS REQUESTED)
    if (/^(TRNE|TRDC|F\.R|FR|H\/REISSUE)/.test(clean)) {
      return {
        type: 'restricted_reissue',
        lines: [
          `>> ⚠️ [ডেমো লিমিটেশন — রি-ইস্যু ও রিফান্ড লকড]`,
          `>> "${clean}" কমান্ডটি শুধুমাত্র ফুল লাইসেন্সড সিমুলেটরে উপলব্ধ।`,
          `>> আমাদের লাইভ ট্রায়ালটি শুধুমাত্র 'PNR তৈরি ও টিকিট ইস্যু' পর্যন্ত অনুমোদিত।`,
          `>> ফুল ভার্সনে Re-issue, Refund ও Penalty Calculation আজীবন প্র্যাকটিস করতে ফুল বান্ডেল কিনুন।`
        ]
      };
    }

    return {
      type: 'error',
      lines: [
        `CHECK ENTRY - FORMAT ERROR`,
        `Galileo commands: A15OCTDACDXB (সার্চ), N.1Y1 (সিট), N. (নাম), P. (ফোন), T.TAU (টিকেট), R. (রিসিভড), ER (পিএনআর), FQ (টিকেট ইস্যু)`
      ]
    };
  }

  // ==========================================
  // 3. SABRE ENGINE
  // ==========================================
  function parseSabre(rawCmd) {
    const clean = rawCmd.trim().toUpperCase();
    const st = sessionState.sabre;

    // Reset / Ignore
    if (clean === 'I' || clean === 'IR' || clean === 'IG') {
      sessionState.sabre = createEmptyPnrState();
      return {
        type: 'info',
        lines: [
          `I`,
          `-------------------------------------------------------------------`,
          `✓ SABRE WORKSPACE RESET. নতুন করে প্র্যাকটিস শুরু করতে পারেন।`,
          `কমান্ড লিখুন: 115OCTDACDXB`
        ]
      };
    }

    // Flight search: 115OCTDACDXB
    const sabMatch = clean.replace(/\s+/g, '').match(/^1(?:(\d{1,2}[A-Z]{3}))?([A-Z]{3})([A-Z]{3})(?:[‡¥☨\/*#]([A-Z0-9]{2}))?$/);
    if (sabMatch) {
      const rawDate = sabMatch[1];
      const org = sabMatch[2];
      const dst = sabMatch[3];
      const al = sabMatch[4] || null;

      if (!AIRPORTS[org] || !AIRPORTS[dst]) {
        return {
          type: 'error',
          lines: [
            `UNABLE TO BUILD AVAILABILITY - ${(!AIRPORTS[org] ? org : dst)} NOT IN DATABASE`,
            `Enter valid 3-letter airport code (e.g. DAC, DXB, JED, LHR, SIN, BKK)`
          ]
        };
      }
      if (org === dst) {
        return {
          type: 'error',
          lines: [`ORIGIN AND DESTINATION CANNOT BE THE SAME`]
        };
      }

      const validDate = rawDate ? parseDateStrict(rawDate) : '15OCT';
      if (rawDate && !validDate) {
        return {
          type: 'error',
          lines: [`FORMAT: 1<DDMMM><ORG><DST> e.g. 115OCTDACDXB`]
        };
      }

      const o = AIRPORTS[org];
      const d = AIRPORTS[dst];
      const day = getDayOfWeek(validDate);
      const flights = getFlights(org, dst, al);

      st.hasSearch = true;
      st.lastRoute = `${org}-${dst}`;
      st.lastDate = validDate;
      st.lastFlights = flights;
      st.org = org;
      st.dst = dst;

      const lines = [];
      lines.push(`${validDate} ${day} ${org}/${o.tz} ${dst}/${d.tz}`);

      flights.forEach((fl, idx) => {
        const lineNum = String(idx + 1);
        const alCode = fl.al.padEnd(2, ' ');
        const fnCode = fl.fn.padStart(4, ' ');
        const clsPart = fl.classes.slice(0, 29).padEnd(29, ' ');

        if (fl.via) {
          lines.push(`${lineNum}${alCode} ${fnCode} ${clsPart}/${org} ${fl.via}  ${fl.dep}   ${fl.arr} /${fl.eq} /E`);
          const conxAl = fl.conxAl.padEnd(2, ' ');
          const conxFn = fl.conxFn.padStart(4, ' ');
          lines.push(` ${conxAl} ${conxFn} ${clsPart}/${fl.via} ${dst}  ${fl.conxDep}   ${fl.conxArr} /${fl.conxEq} /E`);
        } else {
          lines.push(`${lineNum}${alCode} ${fnCode} ${clsPart}/${org} ${dst}  ${fl.dep}   ${fl.arr} /${fl.eq} /E`);
        }
      });

      lines.push(` `);
      lines.push(`👉 পরবর্তী ধাপ (সিট হোল্ড): টাইপ করুন 01Y1`);
      return { type: 'availability', lines };
    }

    // Seat Hold: 01Y1
    const s0Match = clean.replace(/\s+/g, '').match(/^0(\d+)?([A-Z])(\d+)?$/);
    if (s0Match) {
      if (!st.hasSearch) {
        return {
          type: 'error',
          lines: [
            `NO PRIOR AVAILABILITY DISPLAYED — ENTER 115OCTDACDXB FIRST`,
            `প্রথমে সেবরে ফ্লাইট সার্চ করুন, তারপর ০ দিয়ে সিট হোল্ড কমান্ড দিন।`
          ]
        };
      }
      const paxCount = parseInt(s0Match[1] || '1', 10);
      const cls = s0Match[2];
      const lineNum = s0Match[3] ? parseInt(s0Match[3], 10) : 1;

      const fl = (st.lastFlights && st.lastFlights[lineNum - 1]) || st.lastFlights[0];
      if (!fl) {
        return {
          type: 'error',
          lines: [`LINE ${lineNum} NOT FOUND IN SABRE AVAILABILITY`]
        };
      }

      st.heldFlight = fl;
      st.heldClass = cls;
      st.paxCount = paxCount;

      const lines = [];
      lines.push(`--- SABRE ITINERARY SEGMENT ---`);
      lines.push(`1 ${fl.al} ${fl.fn}${cls} ${st.lastDate} W ${st.org}${st.dst} HK${paxCount}  ${fl.dep} ${fl.arr} /${fl.eq} /E`);
      lines.push(` `);
      lines.push(`✓ SEAT HOLD CONFIRMED: ${paxCount} SEAT ${cls} CLASS (STATUS: HK${paxCount})`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (যাত্রীর নাম): টাইপ করুন -CHOWDHURY/RAHIM MR`);
      return { type: 'seathold', lines };
    }

    // Name: -SURNAME/FIRST TITLE
    const sabName = clean.match(/^-(?:1)?([A-Z ]+)\/([A-Z .]+?)\s+(MR|MRS|MS|MSTR|MISS)$/);
    if (sabName) {
      if (!st.heldFlight) {
        return {
          type: 'error',
          lines: [`NO AIR SEGMENT SOLD — ENTER 01Y1 TO HOLD SEAT FIRST`]
        };
      }
      const surname = sabName[1].trim();
      const first = sabName[2].trim();
      const title = sabName[3];
      const fullName = `${surname}/${first} ${title}`;
      st.passengers = [fullName];

      const lines = [];
      lines.push(`*-`);
      lines.push(`1.1${fullName}`);
      lines.push(`✓ SABRE PASSENGER NAME ADDED: ${fullName}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (ফোন ফিল্ড): টাইপ করুন 901711000000-A`);
      return { type: 'pnr_building', lines };
    }

    // Phone: 9 ...
    if (clean.startsWith('9')) {
      const phoneVal = clean.replace(/^9/, '').trim() || '01711000000-A';
      st.phone = phoneVal;
      const lines = [];
      lines.push(`*9`);
      lines.push(`✓ SABRE PHONE FIELD ADDED: ${phoneVal}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (টিকেট টাইম-লিমিট): টাইপ করুন 7TAW${st.lastDate || '15OCT'}/`);
      return { type: 'pnr_building', lines };
    }

    // Ticketing: 7 ...
    if (clean.startsWith('7')) {
      const tVal = clean.replace(/^7/, '').trim() || `TAW${st.lastDate || '15OCT'}/`;
      st.ticketing = tVal;
      const lines = [];
      lines.push(`*7`);
      lines.push(`✓ SABRE TICKETING ARRANGEMENT SAVED: ${tVal}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (রিসিভড ফ্রম): টাইপ করুন 6BAYEZID`);
      return { type: 'pnr_building', lines };
    }

    // Received From: 6 ...
    if (clean.startsWith('6')) {
      const rVal = clean.replace(/^6/, '').trim() || 'BAYEZID';
      st.receivedFrom = rVal;
      const lines = [];
      lines.push(`*6`);
      lines.push(`✓ SABRE RECEIVED FROM SAVED: ${rVal}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 পরবর্তী ধাপ (পিএনআর সম্পন্ন ও রেকর্ড লোকেটর তৈরি): টাইপ করুন ER`);
      return { type: 'pnr_building', lines };
    }

    // End Record: ER or E
    if (clean === 'ER' || clean === 'E') {
      if (!st.heldFlight) {
        return { type: 'error', lines: [`NO ITINERARY SEGMENTS TO END RECORD`] };
      }
      if (!st.passengers.length) {
        return { type: 'error', lines: [`NEED NAME — ENTER -SURNAME/FIRST MR`] };
      }
      if (!st.phone) {
        return { type: 'error', lines: [`NEED PHONE — ENTER 901711000000-A`] };
      }
      if (!st.ticketing) {
        return { type: 'error', lines: [`NEED TICKETING — ENTER 7TAW${st.lastDate || '15OCT'}/`] };
      }
      if (!st.receivedFrom) {
        return { type: 'error', lines: [`NEED RECEIVED FROM — ENTER 6BAYEZID`] };
      }

      if (!st.locator) {
        st.locator = generateRandomLocator();
      }
      st.isPnrEnded = true;

      const fl = st.heldFlight;
      const lines = [];
      lines.push(`${st.locator}`);
      lines.push(`1.1${st.passengers[0]}`);
      lines.push(`1 ${fl.al} ${fl.fn}${st.heldClass} ${st.lastDate} W ${st.org}${st.dst} HK1  ${fl.dep} ${fl.arr} /${fl.eq} /E`);
      lines.push(`9. ${st.phone}`);
      lines.push(`7. ${st.ticketing}`);
      lines.push(`6. ${st.receivedFrom}`);
      lines.push(` `);
      lines.push(`✓ SABRE PNR CREATED SUCCESSFULLY! RECORD LOCATOR: ${st.locator}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 চূড়ান্ত ধাপ (ফেয়ার প্রাইসিং ও টিকিট ইস্যু): টাইপ করুন WP`);
      return { type: 'pnr_confirmed', lines };
    }

    // Work Pricing & Ticket Issue: WP or WPNI
    if (clean === 'WP' || clean.startsWith('WP') || clean === 'W#') {
      if (!st.isPnrEnded) {
        return {
          type: 'error',
          lines: [
            `NO RECORD LOCATOR — ENTER ER TO COMPLETE SABRE PNR FIRST`,
            `আগে ER দিয়ে সেবরে PNR সম্পন্ন করুন, তারপর WP দিয়ে টিকিট প্রাইসিং ও ইস্যু করুন।`
          ]
        };
      }

      const fl = st.heldFlight;
      const fare = getSampleFare(st.lastRoute);
      if (!st.ticketNumber) {
        st.ticketNumber = generateTicketNumber(fl.al);
      }
      st.isTicketIssued = true;

      const lines = [];
      lines.push(`--- SABRE RED 360 TICKET ISSUE CONFIRMATION ---`);
      lines.push(`TICKET NUMBER  : ${st.ticketNumber} P1`);
      lines.push(`RECORD LOCATOR : ${st.locator}`);
      lines.push(`PASSENGER      : ${st.passengers[0]}`);
      lines.push(`ITINERARY      : ${fl.al} ${fl.fn} ${st.heldClass} ${st.lastDate} ${st.org}-${st.dst}`);
      lines.push(`BASE FARE      : BDT ${fare.base.toLocaleString()}`);
      lines.push(`TAXES / FEES   : BDT ${fare.tax.toLocaleString()}`);
      lines.push(`TOTAL AMOUNT   : BDT ${fare.total.toLocaleString()}`);
      lines.push(`STATUS         : ETKT ISSUED / OK`);
      lines.push(`PAYMENT        : CASH / NON-REF`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`🎉 অভিনন্দন! Sabre-এ টিকিট সফলভাবে ইস্যু করা হয়েছে!`);

      return {
        type: 'ticket_issued',
        lines,
        ticket: {
          gds: 'Sabre',
          pnr: st.locator,
          ticketNumber: st.ticketNumber,
          pax: st.passengers[0],
          flight: `${fl.al} ${fl.fn} (${st.heldClass}) ${st.org}-${st.dst}`,
          amount: `BDT ${fare.total.toLocaleString()}`
        }
      };
    }

    // *A - Display PNR
    if (clean === '*A' || clean === '*N' || clean === '*I') {
      if (!st.locator) return { type: 'error', lines: [`NO ACTIVE PNR RECORD LOCATOR`] };
      const fl = st.heldFlight;
      const lines = [];
      lines.push(`${st.locator}`);
      lines.push(`1.1${st.passengers[0]}`);
      lines.push(`1 ${fl.al} ${fl.fn}${st.heldClass} ${st.lastDate} W ${st.org}${st.dst} HK1  ${fl.dep} ${fl.arr} /${fl.eq} /E`);
      lines.push(`9. ${st.phone}`);
      lines.push(`7. ${st.ticketing}`);
      return { type: 'pnr_display', lines };
    }

    // Reissue / Refund commands (RESTRICTED AS REQUESTED)
    if (/^(WFR|WETR\*R|WFRF|WFR\*)/.test(clean)) {
      return {
        type: 'restricted_reissue',
        lines: [
          `>> ⚠️ [ডেমো লিমিটেশন — রি-ইস্যু ও রিফান্ড লকড]`,
          `>> "${clean}" কমান্ডটি শুধুমাত্র ফুল লাইসেন্সড সিমুলেটরে উপলব্ধ।`,
          `>> আমাদের লাইভ ট্রায়ালটি শুধুমাত্র 'PNR তৈরি ও টিকিট ইস্যু' পর্যন্ত অনুমোদিত।`,
          `>> ফুল ভার্সনে Re-issue, Refund ও Penalty Calculation আজীবন প্র্যাকটিস করতে ফুল বান্ডেল কিনুন।`
        ]
      };
    }

    return {
      type: 'error',
      lines: [
        `FORMAT`,
        `Sabre commands: 115OCTDACDXB (সার্চ), 01Y1 (সিট), - (নাম), 9 (ফোন), 7 (টিকেট), 6 (রিসিভড), ER (পিএনআর), WP (টিকেট ইস্যু)`
      ]
    };
  }

  function processCommand(gds, rawCmd) {
    if (!rawCmd || !rawCmd.trim()) return null;
    if (gds === 'amadeus') return parseAmadeus(rawCmd);
    if (gds === 'galileo') return parseGalileo(rawCmd);
    if (gds === 'sabre') return parseSabre(rawCmd);
    return null;
  }

  // Expose to window
  window.GdsDemoEngine = {
    AIRPORTS,
    processCommand,
    getDayOfWeek,
    sessionState
  };

})();
