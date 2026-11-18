/**
 * GDS Training Hub — Live Terminal Demo Engine
 * Real Cryptic Terminal Simulation for Amadeus, Galileo, and Sabre
 * Supports Flight Availability Search & Seat Holding (HK1)
 * (C) GDS Training Hub — Educational Aviation Simulator
 */

(function () {
  'use strict';

  // --- Airport & City Database ---
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

  // --- Major Carriers & Equipment ---
  const AIRLINES = {
    BG: { name: 'BIMAN BANGLADESH', defaultEq: '788' },
    BS: { name: 'US-BANGLA AIRLINES', defaultEq: '738' },
    EK: { name: 'EMIRATES', defaultEq: '77W' },
    FZ: { name: 'FLYDUBAI', defaultEq: '738' },
    QR: { name: 'QATAR AIRWAYS', defaultEq: '359' },
    SV: { name: 'SAUDIA', defaultEq: '77W' },
    TK: { name: 'TURKISH AIRLINES', defaultEq: '789' },
    SQ: { name: 'SINGAPORE AIRLINES', defaultEq: '359' },
    TG: { name: 'THAI AIRWAYS', defaultEq: '777' },
    MH: { name: 'MALAYSIA AIRLINES', defaultEq: '333' },
    KU: { name: 'KUWAIT AIRWAYS', defaultEq: '77W' },
    GF: { name: 'GULF AIR', defaultEq: '789' },
    WY: { name: 'OMAN AIR', defaultEq: '738' },
    G9: { name: 'AIR ARABIA', defaultEq: '320' },
    AI: { name: 'AIR INDIA', defaultEq: '321' },
    "6E": { name: 'INDIGO', defaultEq: '320' }
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

  // State to track last flight search for seat holding
  const sessionState = {
    amadeus: { lastRoute: 'DAC-DXB', lastDate: '15OCT', lastFlights: null },
    galileo: { lastRoute: 'DAC-DXB', lastDate: '15OCT', lastFlights: null },
    sabre:   { lastRoute: 'DAC-DXB', lastDate: '15OCT', lastFlights: null }
  };

  function normalizeDate(raw) {
    if (!raw) {
      const now = new Date(Date.now() + 7 * 86400000);
      const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
      return String(now.getDate()).padStart(2, '0') + months[now.getMonth()];
    }
    const clean = raw.trim().toUpperCase();
    const m = clean.match(/^(\d{1,2})([A-Z]{3})/);
    if (m) {
      return m[1].padStart(2, '0') + m[2];
    }
    return "15OCT";
  }

  function getDayOfWeek(dateStr) {
    const m = (dateStr || "15OCT").match(/^(\d{1,2})([A-Z]{3})/i);
    if (!m) return "WE";
    const day = parseInt(m[1], 10);
    const months = { JAN:0, FEB:1, MAR:2, APR:3, MAY:4, JUN:5, JUL:6, AUG:7, SEP:8, OCT:9, NOV:10, DEC:11 };
    const month = months[m[2].toUpperCase()] !== undefined ? months[m[2].toUpperCase()] : 9;
    const year = new Date().getFullYear();
    const d = new Date(year, month, day);
    const days = ['SU','MO','TU','WE','TH','FR','SA'];
    return days[d.getDay()];
  }

  function generateFallbackRoute(org, dst, carrierFilter) {
    const alList = carrierFilter ? [carrierFilter] : ['BG', 'EK', 'QR', 'SV', 'TK'];
    const results = [];
    alList.forEach((al, idx) => {
      const alInfo = AIRLINES[al] || { name: al, defaultEq: '77W' };
      const depHour = String(6 + idx * 4).padStart(2, '0');
      const arrHour = String(10 + idx * 4).padStart(2, '0');
      results.push({
        al: al,
        fn: String(100 + idx * 115),
        dep: depHour + '30',
        arr: arrHour + '45',
        eq: alInfo.defaultEq || '77W',
        classes: 'J4 C4 D4 Y9 B9 M9 H9 K9 Q9'
      });
    });
    return results;
  }

  function getFlights(org, dst, carrierFilter) {
    const key = `${org}-${dst}`;
    let list = ROUTE_DATA[key];
    if (!list) {
      list = generateFallbackRoute(org, dst, carrierFilter);
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
  function formatAmadeusAvailability(org, dst, dateStr, carrierFilter) {
    const d = AIRPORTS[dst] || { city: dst, tz: 'GST' };
    const day = getDayOfWeek(dateStr);
    const destCity = d.city.padEnd(20, ' ');
    const flights = getFlights(org, dst, carrierFilter);

    sessionState.amadeus = {
      lastRoute: `${org}-${dst}`,
      lastDate: dateStr,
      lastFlights: flights,
      org, dst
    };

    const lines = [];
    lines.push(`** AMADEUS AVAILABILITY - AN ** ${destCity} ${dateStr} ${day} 0000`);

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
    lines.push(`👉 পরবর্তী ধাপ (সিট হোল্ড): টাইপ করুন SS 1 Y 1 অথবা নিচে বাটনে চাপুন`);
    return lines;
  }

  function handleAmadeusSeatHold(cmd) {
    const clean = cmd.replace(/\s+/g, '');
    const m = clean.match(/^SS(\d+)([A-Z])(\d+)$/i) || clean.match(/^SS(\d+)([A-Z])$/i);
    const paxCount = m ? m[1] : '1';
    const cls = m ? m[2].toUpperCase() : 'Y';
    const lineNum = (m && m[3]) ? parseInt(m[3], 10) : 1;

    const state = sessionState.amadeus;
    const flights = state.lastFlights || getFlights('DAC', 'DXB');
    const fl = flights[lineNum - 1] || flights[0];
    const date = state.lastDate || '15OCT';
    const org = state.org || 'DAC';
    const dst = state.dst || 'DXB';

    const lines = [];
    lines.push(`--- PNR ITINERARY SEGMENT (AMADEUS) ---`);
    lines.push(` 1  ${fl.al} ${fl.fn.padEnd(4, ' ')} ${cls}  ${date}  ${org}${dst}  HK${paxCount}   ${fl.dep} ${fl.arr}   ${fl.eq} /E`);
    lines.push(` `);
    lines.push(`✓ SEAT HOLD CONFIRMED: ${paxCount} SEAT (${cls} CLASS) - STATUS: HK${paxCount}`);
    lines.push(`-------------------------------------------------------------------`);
    lines.push(`👉 অভিনন্দন! সিট হোল্ড টেস্ট সফল হয়েছে।`);
    lines.push(`👉 পূর্ণাঙ্গ PNR তৈরি (NM1...), ফেয়ার প্রাইসিং (FXP) ও টিকেট ইস্যু করতে ফুল সিমুলেটর নিন।`);
    return lines;
  }

  // ==========================================
  // 2. GALILEO ENGINE
  // ==========================================
  function formatGalileoAvailability(org, dst, dateStr, carrierFilter) {
    const day = getDayOfWeek(dateStr);
    const flights = getFlights(org, dst, carrierFilter);
    const dom = dateStr.slice(0, 2);

    sessionState.galileo = {
      lastRoute: `${org}-${dst}`,
      lastDate: dateStr,
      lastFlights: flights,
      org, dst
    };

    const lines = [];
    lines.push(`       ${day} ${dateStr}         ${org}${dst}      ${dom}/0000 ${dom}/2359`);

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
    lines.push(`👉 পরবর্তী ধাপ (সিট হোল্ড): টাইপ করুন N1Y1 অথবা নিচে বাটনে চাপুন`);
    return lines;
  }

  function handleGalileoSeatHold(cmd) {
    const clean = cmd.replace(/\s+/g, '');
    const m = clean.match(/^(?:N|0)(\d+)([A-Z])(\d+)?$/i);
    const paxCount = m ? m[1] : '1';
    const cls = m ? m[2].toUpperCase() : 'Y';
    const lineNum = (m && m[3]) ? parseInt(m[3], 10) : 1;

    const state = sessionState.galileo;
    const flights = state.lastFlights || getFlights('DAC', 'DXB');
    const fl = flights[lineNum - 1] || flights[0];
    const date = state.lastDate || '15OCT';
    const org = state.org || 'DAC';
    const dst = state.dst || 'DXB';

    const lines = [];
    lines.push(`--- BOOKING FILE ITINERARY (GALILEO) ---`);
    lines.push(`1. ${fl.al} ${fl.fn.padStart(4, ' ')} ${cls} ${date} ${org}${dst} HK${paxCount}  ${fl.dep} ${fl.arr}  ${fl.eq}  E`);
    lines.push(` `);
    lines.push(`✓ SEAT SOLD: ${paxCount} SEAT (${cls} CLASS) - STATUS: HK${paxCount} CONFIRMED`);
    lines.push(`-------------------------------------------------------------------`);
    lines.push(`👉 অভিনন্দন! গ্যালিলিওতে সিট সফলভাবে হোল্ড হয়েছে।`);
    lines.push(`👉 প্যাসেঞ্জার নেম (N.NAME), ফেয়ার কোটেশন (FQ) ও টিকিট ইস্যু ফুল সিমুলেটরে সংরক্ষিত।`);
    return lines;
  }

  // ==========================================
  // 3. SABRE ENGINE
  // ==========================================
  function formatSabreAvailability(org, dst, dateStr, carrierFilter) {
    const o = AIRPORTS[org] || { tz: 'BST' };
    const d = AIRPORTS[dst] || { tz: 'GST' };
    const day = getDayOfWeek(dateStr);
    const flights = getFlights(org, dst, carrierFilter);

    sessionState.sabre = {
      lastRoute: `${org}-${dst}`,
      lastDate: dateStr,
      lastFlights: flights,
      org, dst
    };

    const lines = [];
    lines.push(`${dateStr} ${day} ${org}/${o.tz} ${dst}/${d.tz}`);

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
    lines.push(`👉 পরবর্তী ধাপ (সিট হোল্ড): টাইপ করুন 01Y1 অথবা নিচে বাটনে চাপুন`);
    return lines;
  }

  function handleSabreSeatHold(cmd) {
    const clean = cmd.replace(/\s+/g, '');
    const m = clean.match(/^0(\d+)?([A-Z])(\d+)?$/i);
    const paxCount = (m && m[1]) ? m[1] : '1';
    const cls = m ? m[2].toUpperCase() : 'Y';
    const lineNum = (m && m[3]) ? parseInt(m[3], 10) : 1;

    const state = sessionState.sabre;
    const flights = state.lastFlights || getFlights('DAC', 'DXB');
    const fl = flights[lineNum - 1] || flights[0];
    const date = state.lastDate || '15OCT';
    const org = state.org || 'DAC';
    const dst = state.dst || 'DXB';

    const lines = [];
    lines.push(`--- SABRE ITINERARY SEGMENT ---`);
    lines.push(`1 ${fl.al} ${fl.fn}${cls} ${date} W ${org}${dst} HK${paxCount}  ${fl.dep} ${fl.arr} /${fl.eq} /E`);
    lines.push(` `);
    lines.push(`✓ SEAT HOLD CONFIRMED: ${paxCount} SEAT ${cls} CLASS (STATUS: HK${paxCount})`);
    lines.push(`-------------------------------------------------------------------`);
    lines.push(`👉 অভিনন্দন! সেবরে সিট সফলভাবে হোল্ড হয়েছে।`);
    lines.push(`👉 পুরো PNR তৈরি (-NAME / 9 / 6P / 7T), WP ও টিকেটিং প্র্যাকটিস করতে ফুল সিমুলেটর নিন।`);
    return lines;
  }

  // ==========================================
  // Command Parser & Processor
  // ==========================================
  function processCommand(gds, rawCmd) {
    const cmd = rawCmd.trim().toUpperCase();
    if (!cmd) return null;

    // Check for Seat Holding Commands (ALLOWED IN DEMO!)
    if (gds === 'amadeus' && /^SS\s*\d+\s*[A-Z]/i.test(cmd)) {
      return {
        type: 'seathold',
        cmd: cmd,
        lines: handleAmadeusSeatHold(cmd)
      };
    }
    if (gds === 'galileo' && /^N\d+[A-Z]/i.test(cmd)) {
      return {
        type: 'seathold',
        cmd: cmd,
        lines: handleGalileoSeatHold(cmd)
      };
    }
    if (gds === 'sabre' && /^0\d*[A-Z]/i.test(cmd)) {
      return {
        type: 'seathold',
        cmd: cmd,
        lines: handleSabreSeatHold(cmd)
      };
    }

    // Check for PNR, Ticketing & Pricing Commands (LOCKED -> SHOWS MODAL)
    const isAmadeusRestricted = /^(NM|AP|TK|FQ|FXP|FP|RT|ET|ER|XI|XE)/i.test(cmd);
    const isGalileoRestricted = /^(N\.|P\.|T\.|FQ|TMU|ER|IR|TKPDTD|X\d)/i.test(cmd);
    const isSabreRestricted = /^(-|9|6|7|WP|WFR|ER|IR|\*|WCA|X\d)/i.test(cmd);

    if (
      (gds === 'amadeus' && isAmadeusRestricted) ||
      (gds === 'galileo' && isGalileoRestricted) ||
      (gds === 'sabre' && isSabreRestricted)
    ) {
      return {
        type: 'restricted',
        cmd: cmd,
        lines: [
          `>> ⚠️ [DEMO MODE LIMITATION]`,
          `>> "${cmd}" — PNR CREATION / PASSENGER DATA / PRICING IS LOCKED IN FREE DEMO.`,
          `>> `,
          `>> আপনি সফলভাবে ফ্লাইট সার্চ ও সিট হোল্ড টেস্ট করেছেন!`,
          `>> সম্পূর্ণ PNR তৈরি, অটো-প্রাইসিং (TST/FQ), ব্যাগেজ রুলস, রি-ইস্যু ও`,
          `>> টিকিট ইস্যু প্র্যাকটিস করতে আমাদের ফুল ট্রেনিং সিমুলেটরের লাইফটাইম প্যাকেজ নিন।`
        ]
      };
    }

    // Amadeus Availability
    if (gds === 'amadeus') {
      const clean = cmd.replace(/\s+/g, '');
      const m = clean.match(/^(?:AN|AD)(\d{1,2}[A-Z]{3})?([A-Z]{3})([A-Z]{3})(?:\/A?([A-Z0-9]{2}))?$/i);
      if (m) {
        const date = normalizeDate(m[1]);
        const org = m[2];
        const dst = m[3];
        const al = m[4] || null;
        return {
          type: 'availability',
          cmd: cmd,
          org, dst, date, al,
          lines: formatAmadeusAvailability(org, dst, date, al)
        };
      }
      if (cmd === 'HELP' || cmd.startsWith('HE')) {
        return {
          type: 'help',
          cmd: cmd,
          lines: [
            `*** AMADEUS COMMAND GUIDE (ফ্লাইট সার্চ ও সিট হোল্ড গাইড) ***`,
            `• AN 15OCT DACDXB        - ঢাকা থেকে দুবাই সব ফ্লাইট সার্চ`,
            `• AN 20NOV DACJED/AEK    - এমিরেটস এয়ারলাইন্সে ঢাকা টু জেদ্দা`,
            `• SS 1 Y 1               - ১ নং ফ্লাইটের Y ক্লাসে ১টি সিট হোল্ড করুন (HK1)`,
            `• NM1RAHMAN/ANIS MR      - প্যাসেঞ্জার নেম (পেইড ভার্সনে আনলক)`,
            `• FXP                    - অটো-ফেয়ার ক্যালকুলেশন ও TST তৈরি (পেইড ভার্সনে)`
          ]
        };
      }
      return {
        type: 'error',
        cmd: cmd,
        lines: [
          `INVALID FORMAT — e.g. AN 15OCT DACDXB or SS 1 Y 1`,
          `সঠিক কমান্ড দেখতে নিচে রেডিমেড বাটনে চাপুন অথবা HELP লিখুন।`
        ]
      };
    }

    // Galileo Availability
    if (gds === 'galileo') {
      const clean = cmd.replace(/\s+/g, '');
      const m = clean.match(/^A(\d{1,2}[A-Z]{3})?([A-Z]{3})([A-Z]{3})(?:[*#\/]([A-Z0-9]{2}))?$/i);
      if (m) {
        const date = normalizeDate(m[1]);
        const org = m[2];
        const dst = m[3];
        const al = m[4] || null;
        return {
          type: 'availability',
          cmd: cmd,
          org, dst, date, al,
          lines: formatGalileoAvailability(org, dst, date, al)
        };
      }
      if (cmd === 'HELP' || cmd.startsWith('H/')) {
        return {
          type: 'help',
          cmd: cmd,
          lines: [
            `*** GALILEO COMMAND GUIDE (ফ্লাইট সার্চ ও সিট হোল্ড গাইড) ***`,
            `• A15OCTDACDXB           - ঢাকা থেকে দুবাই সব ফ্লাইট সার্চ`,
            `• A20NOVDACJED*EK        - এমিরেটস এয়ারলাইন্সে জেদ্দা সার্চ`,
            `• N1Y1                   - ১ নং ফ্লাইটে ১টি Y ক্লাস সিট হোল্ড (HK1)`,
            `• N.RAHMAN/MD MR         - যাত্রী নাম অ্যাড (পেইড ভার্সনে)`,
            `• FQ                     - ফেয়ার কোটেশন ও টিকেট ইস্যু (পেইড ভার্সনে)`
          ]
        };
      }
      return {
        type: 'error',
        cmd: cmd,
        lines: [
          `INVALID ENTRY - e.g. A15OCTDACDXB or N1Y1`,
          `গ্যালিলিও ফরম্যাট দেখতে নিচের বাটনে ক্লিক করুন বা HELP লিখুন।`
        ]
      };
    }

    // Sabre Availability
    if (gds === 'sabre') {
      const clean = cmd.replace(/\s+/g, '');
      const m = clean.match(/^1(\d{1,2}[A-Z]{3})?([A-Z]{3})([A-Z]{3})(?:[‡¥☨\/*#]([A-Z0-9]{2}))?$/i);
      if (m) {
        const date = normalizeDate(m[1]);
        const org = m[2];
        const dst = m[3];
        const al = m[4] || null;
        return {
          type: 'availability',
          cmd: cmd,
          org, dst, date, al,
          lines: formatSabreAvailability(org, dst, date, al)
        };
      }
      if (cmd === 'HELP' || cmd === '1*') {
        return {
          type: 'help',
          cmd: cmd,
          lines: [
            `*** SABRE COMMAND GUIDE (ফ্লাইট সার্চ ও সিট হোল্ড গাইড) ***`,
            `• 115OCTDACDXB           - ঢাকা থেকে দুবাই সব ফ্লাইট সার্চ`,
            `• 120NOVDACJED‡EK        - এমিরেটস এয়ারলাইন্সে জেদ্দা সার্চ`,
            `• 01Y1                   - ১ নং ফ্লাইটে ১টি Y ক্লাস সিট হোল্ড (HK1)`,
            `• -RAHMAN/ANIS MR        - নাম ফিল্ড এন্ট্রি (পেইড ভার্সনে)`,
            `• WP                     - ফেয়ার ক্যালকুলেশন ও টিকেটিং (পেইড ভার্সনে)`
          ]
        };
      }
      return {
        type: 'error',
        cmd: cmd,
        lines: [
          `FORMAT: 1<DDMMM><ORG><DST> e.g. 115OCTDACDXB or 01Y1`,
          `সঠিক কমান্ড জানতে নিচের বাটনে ক্লিক করুন বা HELP লিখুন।`
        ]
      };
    }

    return null;
  }

  // Expose to window
  window.GdsDemoEngine = {
    AIRPORTS,
    AIRLINES,
    processCommand,
    normalizeDate,
    getDayOfWeek
  };

})();
