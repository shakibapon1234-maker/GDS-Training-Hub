/**
 * GDS Training Hub — Live Terminal Demo Engine (v2.1)
 * Strict Cryptic Terminal Validation for Amadeus, Galileo, and Sabre
 * Rejects invalid commands with authentic GDS error messages.
 * (C) GDS Training Hub — Educational Aviation Simulator
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

  const sessionState = {
    amadeus: { hasSearch: false, lastRoute: null, lastDate: null, lastFlights: null, org: null, dst: null },
    galileo: { hasSearch: false, lastRoute: null, lastDate: null, lastFlights: null, org: null, dst: null },
    sabre:   { hasSearch: false, lastRoute: null, lastDate: null, lastFlights: null, org: null, dst: null }
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
      // Fallback only if both airports exist in DB
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

  // ==========================================
  // 1. AMADEUS ENGINE
  // ==========================================
  function parseAmadeus(rawCmd) {
    const clean = rawCmd.trim().toUpperCase();

    // Flight search: AN 15OCT DACDXB or AN15OCTDACDXB or AN 15OCT DACDXB/AEK or AN15OCTDACDXB/AEK
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

      sessionState.amadeus = {
        hasSearch: true,
        lastRoute: `${org}-${dst}`,
        lastDate: validDate,
        lastFlights: flights,
        org, dst
      };

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
      if (!sessionState.amadeus.hasSearch) {
        return {
          type: 'error',
          lines: [
            `NO ACTIVE AVAILABILITY — ENTER AN 15OCT DACDXB FIRST`,
            `প্রথমে ফ্লাইট সার্চ করুন, তারপর সিট হোল্ড কমান্ড দিন।`
          ]
        };
      }
      const paxCount = ssMatch[1];
      const cls = ssMatch[2];
      const lineNum = ssMatch[3] ? parseInt(ssMatch[3], 10) : 1;

      const st = sessionState.amadeus;
      const fl = (st.lastFlights && st.lastFlights[lineNum - 1]) || st.lastFlights[0];
      if (!fl) {
        return {
          type: 'error',
          lines: [`LINE ${lineNum} NOT FOUND IN ACTIVE AVAILABILITY`]
        };
      }

      const lines = [];
      lines.push(`--- PNR ITINERARY SEGMENT (AMADEUS) ---`);
      lines.push(` 1  ${fl.al} ${fl.fn.padEnd(4, ' ')} ${cls}  ${st.lastDate}  ${st.org}${st.dst}  HK${paxCount}   ${fl.dep} ${fl.arr}   ${fl.eq} /E`);
      lines.push(` `);
      lines.push(`✓ SEAT HOLD CONFIRMED: ${paxCount} SEAT (${cls} CLASS) - STATUS: HK${paxCount}`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 অভিনন্দন! সিট সফলভাবে হোল্ড হয়েছে।`);
      lines.push(`👉 পুরো PNR তৈরি (NM1...), ফেয়ার প্রাইসিং (FXP) ও টিকিট ইস্যু ফুল সিমুলেটরে সংরক্ষিত।`);
      return { type: 'seathold', lines };
    }

    // PNR / Ticketing commands (LOCKED)
    if (/^(NM|AP|TK|FQ|FXP|FP|RT|ET|ER|XI|XE)/.test(clean)) {
      return {
        type: 'restricted',
        lines: [
          `>> ⚠️ [DEMO MODE LIMITATION]`,
          `>> "${clean}" — PNR CREATION / PRICING IS LOCKED IN FREE DEMO.`,
          `>> `,
          `>> আপনি সফলভাবে ফ্লাইট সার্চ ও সিট হোল্ড (HK1) পরীক্ষা করেছেন!`,
          `>> সম্পূর্ণ PNR তৈরি, অটো-প্রাইসিং (TST), ব্যাগেজ রুলস, রি-ইস্যু ও`,
          `>> আসল টিকিট ইস্যু শিখতে আমাদের ফুল ট্রেনিং সিমুলেটরের লাইসেন্স নিন।`
        ]
      };
    }

    // Anything else is an INVALID FORMAT in Amadeus
    return {
      type: 'error',
      lines: [
        `INVALID FORMAT`,
        `Amadeus commands: AN 15OCT DACDXB (ফ্লাইট সার্চ) অথবা SS 1 Y 1 (সিট হোল্ড)`
      ]
    };
  }

  // ==========================================
  // 2. GALILEO ENGINE
  // ==========================================
  function parseGalileo(rawCmd) {
    const clean = rawCmd.trim().toUpperCase();

    // Flight search: A15OCTDACDXB or A15OCTDACDXB*EK
    const aMatch = clean.replace(/\s+/g, '').match(/^A(?:(\d{1,2}[A-Z]{3}))?([A-Z]{3})([A-Z]{3})(?:[*#\/]([A-Z0-9]{2}))?$/);
    if (aMatch) {
      const rawDate = aMatch[1];
      const org = aMatch[2];
      const dst = aMatch[3];
      const al = aMatch[4] || null;

      if (!AIRPORTS[org] || !AIRPORTS[dst]) {
        return {
          type: 'error',
          lines: [
            `CHECK ENTRY - AIRPORT NOT FOUND - ${(!AIRPORTS[org] ? org : dst)}`,
            `Use 3-letter IATA code: e.g. DAC, DXB, JED, LHR, SIN, BKK`
          ]
        };
      }
      if (org === dst) {
        return {
          type: 'error',
          lines: [`ORIGIN AND DESTINATION MUST DIFFER`]
        };
      }

      const validDate = rawDate ? parseDateStrict(rawDate) : '15OCT';
      if (rawDate && !validDate) {
        return {
          type: 'error',
          lines: [`CHECK ENTRY - INVALID DATE FORMAT - USE DDMMM (E.G. 15OCT)`]
        };
      }

      const day = getDayOfWeek(validDate);
      const flights = getFlights(org, dst, al);
      const dom = validDate.slice(0, 2);

      sessionState.galileo = {
        hasSearch: true,
        lastRoute: `${org}-${dst}`,
        lastDate: validDate,
        lastFlights: flights,
        org, dst
      };

      const lines = [];
      lines.push(`       ${day} ${validDate}         ${org}${dst}      ${dom}/0000 ${dom}/2359`);

      flights.forEach((fl, idx) => {
        const lineNum = String(idx + 1);
        const alCode = fl.al.padEnd(2, ' ');
        const fnCode = fl.fn.padStart(4, ' ');
        const clsPart = fl.classes.padEnd(30, ' ');

        if (fl.via) {
          lines.push(`${lineNum}   ${alCode} ${fnCode}  ${clsPart} ${org} ${fl.dep}   ${fl.via} ${fl.arr}   ${fl.eq}   0   E`);
          const conxAl = fl.conxAl.padEnd(2, ' ');
          const conxFn = fl.conxFn.padStart(4, ' ');
          lines.push(`    ${conxAl} ${conxFn}  ${clsPart} ${fl.via} ${fl.conxDep}   ${dst} ${fl.conxArr}   ${fl.conxEq}   0   E`);
        } else {
          lines.push(`${lineNum}   ${alCode} ${fnCode}  ${clsPart} ${org} ${fl.dep}   ${dst} ${fl.arr}   ${fl.eq}   0   E`);
        }
      });

      lines.push(` `);
      lines.push(`👉 পরবর্তী ধাপ (সিট হোল্ড): টাইপ করুন N1Y1`);
      return { type: 'availability', lines };
    }

    // Seat Hold: N1Y1 or N1K1 or 01Y1
    const nMatch = clean.replace(/\s+/g, '').match(/^(?:N|0)(\d+)([A-Z])(\d+)?$/);
    if (nMatch) {
      if (!sessionState.galileo.hasSearch) {
        return {
          type: 'error',
          lines: [
            `NO AVAILABILITY DISPLAYED — ENTER A15OCTDACDXB FIRST`,
            `আগে গ্যালিলিওতে ফ্লাইট সার্চ করুন, তারপর সিট বিক্রি কমান্ড দিন।`
          ]
        };
      }
      const paxCount = nMatch[1];
      const cls = nMatch[2];
      const lineNum = nMatch[3] ? parseInt(nMatch[3], 10) : 1;

      const st = sessionState.galileo;
      const fl = (st.lastFlights && st.lastFlights[lineNum - 1]) || st.lastFlights[0];
      if (!fl) {
        return {
          type: 'error',
          lines: [`LINE ${lineNum} NOT FOUND IN AVAILABILITY`]
        };
      }

      const lines = [];
      lines.push(`--- BOOKING FILE ITINERARY (GALILEO) ---`);
      lines.push(`1. ${fl.al} ${fl.fn.padStart(4, ' ')} ${cls} ${st.lastDate} ${st.org}${st.dst} HK${paxCount}  ${fl.dep} ${fl.arr}  ${fl.eq}  E`);
      lines.push(` `);
      lines.push(`✓ SEAT SOLD: ${paxCount} SEAT (${cls} CLASS) - STATUS: HK${paxCount} CONFIRMED`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 অভিনন্দন! গ্যালিলিওতে সিট সফলভাবে হোল্ড হয়েছে।`);
      lines.push(`👉 নাম এন্ট্রি (N.SURNAME/NAME), ফেয়ার (FQ) ও টিকিট ইস্যু ফুল সিমুলেটরে সংরক্ষিত।`);
      return { type: 'seathold', lines };
    }

    // PNR commands (LOCKED)
    if (/^(N\.|P\.|T\.|FQ|TMU|ER|IR|TKPDTD|X\d)/.test(clean)) {
      return {
        type: 'restricted',
        lines: [
          `>> ⚠️ [DEMO MODE LIMITATION]`,
          `>> "${clean}" — PNR BOOKING FILE CREATION IS LOCKED IN FREE DEMO.`,
          `>> `,
          `>> আপনি সফলভাবে ফ্লাইট সার্চ ও সিট হোল্ড (HK1) পরীক্ষা করেছেন!`,
          `>> প্যাসেঞ্জার নাম, ফোন ফিল্ড, অটো-ফেয়ার ও টিকিট ইস্যু শিখতে ফুল সিমুলেটর নিন।`
        ]
      };
    }

    // Anything else is an INVALID ENTRY in Galileo
    return {
      type: 'error',
      lines: [
        `CHECK ENTRY - FORMAT ERROR`,
        `Galileo commands: A15OCTDACDXB (ফ্লাইট সার্চ) অথবা N1Y1 (সিট হোল্ড)`
      ]
    };
  }

  // ==========================================
  // 3. SABRE ENGINE
  // ==========================================
  function parseSabre(rawCmd) {
    const clean = rawCmd.trim().toUpperCase();

    // Flight search: 115OCTDACDXB or 115OCTDACDXB‡EK or 115OCTDACDXB/EK
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

      sessionState.sabre = {
        hasSearch: true,
        lastRoute: `${org}-${dst}`,
        lastDate: validDate,
        lastFlights: flights,
        org, dst
      };

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

    // Seat Hold: 01Y1 or 01K1 or 0Y1
    const s0Match = clean.replace(/\s+/g, '').match(/^0(\d+)?([A-Z])(\d+)?$/);
    if (s0Match) {
      if (!sessionState.sabre.hasSearch) {
        return {
          type: 'error',
          lines: [
            `NO PRIOR AVAILABILITY DISPLAYED — ENTER 115OCTDACDXB FIRST`,
            `প্রথমে সেবরে ফ্লাইট সার্চ করুন, তারপর ০ দিয়ে সিট হোল্ড কমান্ড দিন।`
          ]
        };
      }
      const paxCount = s0Match[1] || '1';
      const cls = s0Match[2];
      const lineNum = s0Match[3] ? parseInt(s0Match[3], 10) : 1;

      const st = sessionState.sabre;
      const fl = (st.lastFlights && st.lastFlights[lineNum - 1]) || st.lastFlights[0];
      if (!fl) {
        return {
          type: 'error',
          lines: [`LINE ${lineNum} NOT FOUND IN SABRE AVAILABILITY`]
        };
      }

      const lines = [];
      lines.push(`--- SABRE ITINERARY SEGMENT ---`);
      lines.push(`1 ${fl.al} ${fl.fn}${cls} ${st.lastDate} W ${st.org}${st.dst} HK${paxCount}  ${fl.dep} ${fl.arr} /${fl.eq} /E`);
      lines.push(` `);
      lines.push(`✓ SEAT HOLD CONFIRMED: ${paxCount} SEAT ${cls} CLASS (STATUS: HK${paxCount})`);
      lines.push(`-------------------------------------------------------------------`);
      lines.push(`👉 অভিনন্দন! সেবরে সিট সফলভাবে হোল্ড হয়েছে।`);
      lines.push(`👉 সম্পূর্ণ PNR তৈরি (-NAME/9/6P/7T), ফেয়ার কোটেশন ও টিকেটিং ফুল সিমুলেটরে পাবেন।`);
      return { type: 'seathold', lines };
    }

    // PNR commands (LOCKED)
    if (/^(-|9|6|7|WP|WFR|ER|IR|\*|WCA|X\d)/.test(clean)) {
      return {
        type: 'restricted',
        lines: [
          `>> ⚠️ [DEMO MODE LIMITATION]`,
          `>> "${clean}" — PNR CREATION / PRICING IS LOCKED IN FREE DEMO.`,
          `>> `,
          `>> আপনি সফলভাবে ফ্লাইট সার্চ ও সিট হোল্ড পরীক্ষা করেছেন!`,
          `>> সম্পূর্ণ PNR তৈরি, অটো-প্রাইসিং ও টিকিট ইস্যু শিখতে ফুল সিমুলেটর নিন।`
        ]
      };
    }

    // Anything else is FORMAT in Sabre
    return {
      type: 'error',
      lines: [
        `FORMAT`,
        `Sabre commands: 115OCTDACDXB (ফ্লাইট সার্চ) অথবা 01Y1 (সিট হোল্ড)`
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
    getDayOfWeek
  };

})();
