(function (global) {
  'use strict';

  // Airline metadata catalog
  const AIRLINE_INFO = {
    EK: { name: "EMIRATES", brand: true, flag: "C*E" },
    FZ: { name: "FLYDUBAI", brand: false, flag: " *E" },
    BG: { name: "BIMAN BANGLADESH AIRLINES", brand: true, flag: " *E" },
    BS: { name: "US-BANGLA AIRLINES", brand: true, flag: "C*E" },
    QR: { name: "QATAR AIRWAYS", brand: true, flag: "C*E" },
    SV: { name: "SAUDI ARABIAN AIRLINES", brand: true, flag: "C*E" },
    SQ: { name: "SINGAPORE AIRLINES", brand: true, flag: "C*E" },
    MH: { name: "MALAYSIA AIRLINES", brand: true, flag: "C*E" },
    TG: { name: "THAI AIRWAYS", brand: true, flag: "C*E" },
    TK: { name: "TURKISH AIRLINES", brand: true, flag: "C*E" },
    KU: { name: "KUWAIT AIRWAYS", brand: true, flag: "C*E" },
    GF: { name: "GULF AIR", brand: true, flag: "C*E" },
    WY: { name: "OMAN AIR", brand: true, flag: "C*E" },
    EY: { name: "ETIHAD AIRWAYS", brand: true, flag: "C*E" },
    AI: { name: "AIR INDIA", brand: true, flag: "C*E" },
    "6E": { name: "INDIGO", brand: false, flag: " *E" },
    G9: { name: "AIR ARABIA", brand: false, flag: " *E" },
    J9: { name: "JAZEERA AIRWAYS", brand: false, flag: " *E" },
    XY: { name: "FLYNAS", brand: false, flag: " *E" },
    AK: { name: "AIRASIA", brand: false, flag: " *E" },
    OD: { name: "BATIK AIR", brand: false, flag: " *E" },
    TR: { name: "SCOOT", brand: false, flag: " *E" },
    VZ: { name: "THAI VIETJET", brand: false, flag: " *E" },
    UL: { name: "SRILANKAN AIRLINES", brand: true, flag: "C*E" },
    H9: { name: "HIMALAYA AIRLINES", brand: false, flag: " *E" },
    BA: { name: "BRITISH AIRWAYS", brand: true, flag: "C*E" },
    AC: { name: "AIR CANADA", brand: true, flag: "C*E" },
    VQ: { name: "NOVOAIR", brand: false, flag: " *E" }
  };

  function airlineName(code) {
    const clean = String(code || '').replace('@', '');
    return (AIRLINE_INFO[clean] && AIRLINE_INFO[clean].name) || clean + " AIRLINES";
  }

  function airlineFlag(code, equip) {
    const clean = String(code || '').replace('@', '');
    if (AIRLINE_INFO[clean]) return AIRLINE_INFO[clean].flag;
    return equip === '7M8' ? ' *E' : 'C*E';
  }

  function airlineBrand(code) {
    const clean = String(code || '').replace('@', '');
    return (AIRLINE_INFO[clean] && AIRLINE_INFO[clean].brand) !== false;
  }

  // Helper for generating standard class maps
  function standardClasses(type) {
    if (type === 'full') {
      return {
        classes: { J: 9, C: 9, D: 9, I: 9, Y: 9, B: 9, M: 9, H: 9, Q: 9, K: 9 },
        rows: ["T9 K9 S9 V9 W9 LC"]
      };
    }
    if (type === 'ek') {
      return {
        classes: { J: "C", C: "C", I: "C", O: "C", Y: 9, R: 9, X: 9, M: 9, B: 9, U: 9 },
        rows: ["KC QC LC VC"]
      };
    }
    if (type === 'bg') {
      return {
        classes: { J: 4, C: 4, D: "R", Y: 9, B: 9, M: 9, K: 9, H: 9, Q: 9, T: 9 },
        rows: ["LC NC RC SC"]
      };
    }
    if (type === 'bs') {
      return {
        classes: { Y: 9, B: 9, H: 9, M: 9, R: 9, U: 9, N: 9, V: 9, X: 9, T: 9 },
        rows: ["TC O9 IC KC EC SC GC L5"]
      };
    }
    if (type === 'fz') {
      return {
        classes: { J: "C", C: "C", I: "C", O: "C", H: "C", Y: 9, R: 9, X: 9, M: 9, B: 9 },
        rows: ["U9 KC QC LC TC VC"]
      };
    }
    if (type === 'qr') {
      return {
        classes: { J: 9, C: 9, D: 9, I: 9, R: 9, P: 9, Y: 9, B: 9, H: 9, K: 9 },
        rows: ["M9 L9 V9 S9 N9 Q9 T9 O9", "WC"]
      };
    }
    if (type === 'sv') {
      return {
        classes: { J: 9, C: 9, D: 9, I: 9, Y: 9, E: 9, B: 9, M: 9, K: 9, H: 9 },
        rows: ["LC QC TC NC VC"]
      };
    }
    return {
      classes: { Y: 9, B: 9, M: 9, H: 9, Q: 9, K: 9, V: 9, L: 9, S: 9, T: 9 },
      rows: ["U9 W9 G9"]
    };
  }

  // Pre-compiled comprehensive flight database
  const ROUTE_DATA = {};

  /* ══════════════════════════════════════════════════════
     1. DUBAI <-> DHAKA (DXB - DAC & DAC - DXB)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DXB-DAC"] = [
    // Direct Flights
    { carrier: "EK", number: "582", depart: "0145", arrive: "0840", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "FZ", number: "501", depart: "0105", arrive: "0710", equip: "7M8", termOrig: "2", termDest: "1", clsType: "fz" },
    { carrier: "EK", number: "2332", isCodeshare: true, codeshareCarrier: "EK", codeshareNumber: "2332", depart: "0105", arrive: "0710", equip: "7M8", termOrig: "2", termDest: "1", clsType: "ek", notes: ["OPERATED BY FLYDUBAI FZ501"] },
    { carrier: "BG", number: "048", depart: "2300", arrive: "#0545", equip: "788", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "342", depart: "2340", arrive: "#0620", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "EK", number: "586", depart: "1030", arrive: "1655", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "EK", number: "584", depart: "1300", arrive: "1925", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "FZ", number: "523", depart: "1400", arrive: "2030", equip: "7M8", termOrig: "2", termDest: "1", clsType: "fz" },
    // Connecting / Transit Flights
    { carrier: "QR", number: "1003", origin: "DXB", destination: "DOH", depart: "0530", arrive: "0545", equip: "789", termOrig: "1", termDest: "1", clsType: "qr", notes: ["CONNECTING FLIGHT VIA DOH TO DAC"] },
    { carrier: "QR", number: "640", origin: "DOH", destination: "DAC", depart: "0830", arrive: "1600", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr", notes: ["CONNECTING FLIGHT FROM DOH TO DAC"] },
    { carrier: "EK", number: "506", origin: "DXB", destination: "BOM", depart: "0910", arrive: "1350", equip: "77W", termOrig: "3", termDest: "2", clsType: "ek", notes: ["CONNECTING FLIGHT VIA BOM"] },
    { carrier: "AI", number: "2183", origin: "BOM", destination: "DAC", depart: "1530", arrive: "1845", equip: "32N", termOrig: "2", termDest: "1", clsType: "full", notes: ["CONNECTING FLIGHT FROM BOM TO DAC"] },
    { carrier: "WY", number: "604", origin: "DXB", destination: "MCT", depart: "0715", arrive: "0830", equip: "738", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING FLIGHT VIA MCT"] },
    { carrier: "WY", number: "311", origin: "MCT", destination: "DAC", depart: "0945", arrive: "1615", equip: "738", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING FLIGHT FROM MCT TO DAC"] },
    { carrier: "KU", number: "672", origin: "DXB", destination: "KWI", depart: "1410", arrive: "1500", equip: "320", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING FLIGHT VIA KWI"] },
    { carrier: "KU", number: "283", origin: "KWI", destination: "DAC", depart: "1800", arrive: "#0230", equip: "77W", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING FLIGHT FROM KWI TO DAC"] },
    { carrier: "GF", number: "503", origin: "DXB", destination: "BAH", depart: "1200", arrive: "1215", equip: "321", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING FLIGHT VIA BAH"] },
    { carrier: "GF", number: "250", origin: "BAH", destination: "DAC", depart: "1430", arrive: "2245", equip: "789", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING FLIGHT FROM BAH TO DAC"] }
  ];

  ROUTE_DATA["DAC-DXB"] = [
    // Direct Flights
    { carrier: "EK", number: "585", depart: "0140", arrive: "0430", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "FZ", number: "502", depart: "0810", arrive: "1125", equip: "7M8", termOrig: "1", termDest: "2", clsType: "fz" },
    { carrier: "EK", number: "2331", isCodeshare: true, codeshareCarrier: "EK", codeshareNumber: "2331", depart: "0810", arrive: "1125", equip: "7M8", termOrig: "1", termDest: "2", clsType: "ek", notes: ["OPERATED BY FLYDUBAI FZ502"] },
    { carrier: "EK", number: "583", depart: "1015", arrive: "1315", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "BG", number: "347", depart: "1845", arrive: "2205", equip: "788", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "EK", number: "587", depart: "1845", arrive: "2145", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "BS", number: "341", depart: "1915", arrive: "2235", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "FZ", number: "524", depart: "2200", arrive: "#0120", equip: "7M8", termOrig: "1", termDest: "2", clsType: "fz" },
    { carrier: "EK", number: "2287", isCodeshare: true, codeshareCarrier: "EK", codeshareNumber: "2287", depart: "2200", arrive: "#0120", equip: "7M8", termOrig: "1", termDest: "2", clsType: "ek", notes: ["OPERATED BY FLYDUBAI FZ524"] },
    // Connecting / Transit Flights
    { carrier: "AI", number: "2184", origin: "DAC", destination: "BOM", depart: "1145", arrive: "1430", equip: "32N", termOrig: "1", termDest: "2", clsType: "full", notes: ["CONNECTING VIA BOM"] },
    { carrier: "EK", number: "507", origin: "BOM", destination: "DXB", depart: "1600", arrive: "1735", equip: "77W", termOrig: "2", termDest: "3", clsType: "ek", notes: ["CONNECTING BOM TO DXB"] },
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr", notes: ["CONNECTING VIA DOH"] },
    { carrier: "QR", number: "1006", origin: "DOH", destination: "DXB", depart: "1530", arrive: "1745", equip: "789", termOrig: "1", termDest: "1", clsType: "qr", notes: ["CONNECTING DOH TO DXB"] },
    { carrier: "WY", number: "312", origin: "DAC", destination: "MCT", depart: "1715", arrive: "2030", equip: "738", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING VIA MCT"] },
    { carrier: "WY", number: "601", origin: "MCT", destination: "DXB", depart: "2200", arrive: "2315", equip: "738", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING MCT TO DXB"] },
    { carrier: "KU", number: "284", origin: "DAC", destination: "KWI", depart: "0345", arrive: "0700", equip: "77W", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING VIA KWI"] },
    { carrier: "KU", number: "671", origin: "KWI", destination: "DXB", depart: "0915", arrive: "1205", equip: "320", termOrig: "1", termDest: "1", clsType: "full", notes: ["CONNECTING KWI TO DXB"] }
  ];

  /* ══════════════════════════════════════════════════════
     2. JEDDAH <-> DHAKA (JED - DAC & DAC - JED)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DAC-JED"] = [
    { carrier: "SV", number: "803", depart: "0235", arrive: "0615", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "SV", number: "811", depart: "0555", arrive: "0935", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "SV", number: "809", depart: "1320", arrive: "1700", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "BG", number: "335", depart: "2015", arrive: "#0045", equip: "77W", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "361", depart: "1605", arrive: "2110", equip: "333", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "037", depart: "0930", arrive: "1400", equip: "788", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "XY", number: "352", depart: "2230", arrive: "#0315", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "EK", number: "585", origin: "DAC", destination: "DXB", depart: "0140", arrive: "0430", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "803", origin: "DXB", destination: "JED", depart: "0710", arrive: "0915", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "1184", origin: "DOH", destination: "JED", depart: "1550", arrive: "1825", equip: "789", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "WY", number: "312", origin: "DAC", destination: "MCT", depart: "1715", arrive: "2030", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "WY", number: "673", origin: "MCT", destination: "JED", depart: "2210", arrive: "#0050", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "KU", number: "284", origin: "DAC", destination: "KWI", depart: "0345", arrive: "0700", equip: "77W", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "KU", number: "785", origin: "KWI", destination: "JED", depart: "0930", arrive: "1145", equip: "320", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  ROUTE_DATA["JED-DAC"] = [
    { carrier: "SV", number: "802", depart: "0130", arrive: "1120", equip: "77W", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "SV", number: "804", depart: "0530", arrive: "1520", equip: "77W", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "SV", number: "808", depart: "1410", arrive: "2355", equip: "77W", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "BG", number: "336", depart: "0100", arrive: "1050", equip: "77W", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "362", depart: "2245", arrive: "#0830", equip: "333", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "038", depart: "1630", arrive: "#0215", equip: "788", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "XY", number: "351", depart: "1230", arrive: "2130", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "EK", number: "804", origin: "JED", destination: "DXB", depart: "1100", arrive: "1455", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "584", origin: "DXB", destination: "DAC", depart: "1655", arrive: "2325", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "QR", number: "1185", origin: "JED", destination: "DOH", depart: "0600", arrive: "0820", equip: "789", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "640", origin: "DOH", destination: "DAC", depart: "1030", arrive: "1800", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "WY", number: "674", origin: "JED", destination: "MCT", depart: "0230", arrive: "0655", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "WY", number: "311", origin: "MCT", destination: "DAC", depart: "0945", arrive: "1615", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "KU", number: "786", origin: "JED", destination: "KWI", depart: "1300", arrive: "1510", equip: "320", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "KU", number: "283", origin: "KWI", destination: "DAC", depart: "1800", arrive: "#0230", equip: "77W", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  /* ══════════════════════════════════════════════════════
     3. DOHA <-> DHAKA (DOH - DAC & DAC - DOH)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DAC-DOH"] = [
    { carrier: "QR", number: "639", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "641", depart: "2000", arrive: "2245", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "643", depart: "0350", arrive: "0635", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "BG", number: "025", depart: "1830", arrive: "2130", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "337", depart: "1930", arrive: "2240", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "EK", number: "585", origin: "DAC", destination: "DXB", depart: "0140", arrive: "0430", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "FZ", number: "001", origin: "DXB", destination: "DOH", depart: "0630", arrive: "0640", equip: "7M8", termOrig: "2", termDest: "1", clsType: "fz" },
    { carrier: "WY", number: "312", origin: "DAC", destination: "MCT", depart: "1715", arrive: "2030", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "WY", number: "663", origin: "MCT", destination: "DOH", depart: "2200", arrive: "2240", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "GF", number: "251", origin: "DAC", destination: "BAH", depart: "0540", arrive: "0900", equip: "789", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "GF", number: "532", origin: "BAH", destination: "DOH", depart: "1115", arrive: "1205", equip: "320", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  ROUTE_DATA["DOH-DAC"] = [
    { carrier: "QR", number: "640", depart: "0210", arrive: "0950", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "642", depart: "1850", arrive: "#0245", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "638", depart: "0920", arrive: "1700", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "BG", number: "026", depart: "2245", arrive: "#0630", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "338", depart: "2355", arrive: "#0745", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "FZ", number: "002", origin: "DOH", destination: "DXB", depart: "0745", arrive: "0955", equip: "7M8", termOrig: "1", termDest: "2", clsType: "fz" },
    { carrier: "EK", number: "586", origin: "DXB", destination: "DAC", depart: "1030", arrive: "1655", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "WY", number: "664", origin: "DOH", destination: "MCT", depart: "0510", arrive: "0755", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "WY", number: "311", origin: "MCT", destination: "DAC", depart: "0945", arrive: "1615", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "GF", number: "533", origin: "DOH", destination: "BAH", depart: "0730", arrive: "0820", equip: "320", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "GF", number: "250", origin: "BAH", destination: "DAC", depart: "1430", arrive: "2245", equip: "789", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  /* ══════════════════════════════════════════════════════
     4. SINGAPORE <-> DHAKA (SIN - DAC & DAC - SIN)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DAC-SIN"] = [
    { carrier: "SQ", number: "447", depart: "2355", arrive: "#0605", equip: "787", termOrig: "1", termDest: "2", clsType: "full" },
    { carrier: "BG", number: "584", depart: "0825", arrive: "1430", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "307", depart: "2215", arrive: "#0430", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "TR", number: "867", depart: "0015", arrive: "0630", equip: "788", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "SQ", number: "5447", isCodeshare: true, codeshareCarrier: "SQ", codeshareNumber: "5447", depart: "0015", arrive: "0630", equip: "788", termOrig: "1", termDest: "1", clsType: "full", notes: ["OPERATED BY SCOOT TR867"] },
    // Connecting
    { carrier: "MH", number: "197", origin: "DAC", destination: "KUL", depart: "0050", arrive: "0650", equip: "332", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "MH", number: "603", origin: "KUL", destination: "SIN", depart: "0850", arrive: "0955", equip: "738", termOrig: "1", termDest: "2", clsType: "full" },
    { carrier: "TG", number: "322", origin: "DAC", destination: "BKK", depart: "1340", arrive: "1710", equip: "333", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TG", number: "409", origin: "BKK", destination: "SIN", depart: "1855", arrive: "2225", equip: "359", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "6E", number: "1106", origin: "DAC", destination: "CCU", depart: "1445", arrive: "1515", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "6E", number: "1051", origin: "CCU", destination: "SIN", depart: "1830", arrive: "#0115", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" }
  ];

  ROUTE_DATA["SIN-DAC"] = [
    { carrier: "SQ", number: "446", depart: "2035", arrive: "2240", equip: "787", termOrig: "2", termDest: "1", clsType: "full" },
    { carrier: "BG", number: "585", depart: "1545", arrive: "1750", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "308", depart: "0530", arrive: "0735", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "TR", number: "866", depart: "2045", arrive: "2250", equip: "788", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "MH", number: "604", origin: "SIN", destination: "KUL", depart: "1630", arrive: "1735", equip: "738", termOrig: "2", termDest: "1", clsType: "full" },
    { carrier: "MH", number: "196", origin: "KUL", destination: "DAC", depart: "1950", arrive: "2150", equip: "332", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TG", number: "410", origin: "SIN", destination: "BKK", depart: "0740", arrive: "0905", equip: "359", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TG", number: "321", origin: "BKK", destination: "DAC", depart: "1035", arrive: "1235", equip: "333", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  /* ══════════════════════════════════════════════════════
     5. KUALA LUMPUR <-> DHAKA (KUL - DAC & DAC - KUL)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DAC-KUL"] = [
    { carrier: "MH", number: "197", depart: "0050", arrive: "0650", equip: "332", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "OD", number: "162", depart: "1045", arrive: "1645", equip: "7M8", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BS", number: "217", depart: "0935", arrive: "1310", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "388", depart: "1115", arrive: "1500", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "AK", number: "075", depart: "2200", arrive: "#0400", equip: "320", termOrig: "1", termDest: "2", clsType: "bs" },
    { carrier: "MH", number: "103", depart: "1230", arrive: "1840", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "BG", number: "386", depart: "2330", arrive: "#0530", equip: "788", termOrig: "1", termDest: "1", clsType: "bg" },
    // Connecting
    { carrier: "SQ", number: "447", origin: "DAC", destination: "SIN", depart: "2355", arrive: "#0605", equip: "787", termOrig: "1", termDest: "2", clsType: "full" },
    { carrier: "SQ", number: "106", origin: "SIN", destination: "KUL", depart: "0830", arrive: "0935", equip: "738", termOrig: "2", termDest: "1", clsType: "full" },
    { carrier: "TG", number: "322", origin: "DAC", destination: "BKK", depart: "1340", arrive: "1710", equip: "333", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TG", number: "415", origin: "BKK", destination: "KUL", depart: "1905", arrive: "2215", equip: "77W", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  ROUTE_DATA["KUL-DAC"] = [
    { carrier: "MH", number: "196", depart: "1950", arrive: "2150", equip: "332", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "OD", number: "163", depart: "1730", arrive: "1930", equip: "7M8", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BS", number: "218", depart: "1400", arrive: "1540", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "389", depart: "1600", arrive: "1745", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "AK", number: "076", depart: "2000", arrive: "2155", equip: "320", termOrig: "2", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "SQ", number: "107", origin: "KUL", destination: "SIN", depart: "1035", arrive: "1140", equip: "738", termOrig: "1", termDest: "2", clsType: "full" },
    { carrier: "SQ", number: "446", origin: "SIN", destination: "DAC", depart: "2035", arrive: "2240", equip: "787", termOrig: "2", termDest: "1", clsType: "full" },
    { carrier: "TG", number: "416", origin: "KUL", destination: "BKK", depart: "1310", arrive: "1420", equip: "77W", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TG", number: "339", origin: "BKK", destination: "DAC", depart: "2355", arrive: "#0150", equip: "330", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  /* ══════════════════════════════════════════════════════
     6. BANGKOK <-> DHAKA (BKK - DAC & DAC - BKK)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DAC-BKK"] = [
    { carrier: "TG", number: "322", depart: "1340", arrive: "1710", equip: "333", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TG", number: "340", depart: "0200", arrive: "0530", equip: "330", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "BS", number: "315", depart: "0825", arrive: "1420", equip: "333", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "388", depart: "1115", arrive: "1445", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "VZ", number: "307", depart: "1730", arrive: "2100", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "TG", number: "4716", isCodeshare: true, codeshareCarrier: "TG", codeshareNumber: "4716", depart: "1620", arrive: "1950", equip: "7M8", termOrig: "1", termDest: "1", clsType: "full" },
    // Connecting
    { carrier: "MH", number: "197", origin: "DAC", destination: "KUL", depart: "0050", arrive: "0650", equip: "332", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "MH", number: "784", origin: "KUL", destination: "BKK", depart: "0900", arrive: "1015", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "SQ", number: "447", origin: "DAC", destination: "SIN", depart: "2355", arrive: "#0605", equip: "787", termOrig: "1", termDest: "2", clsType: "full" },
    { carrier: "SQ", number: "706", origin: "SIN", destination: "BKK", depart: "0710", arrive: "0835", equip: "787", termOrig: "2", termDest: "1", clsType: "full" },
    { carrier: "6E", number: "1106", origin: "DAC", destination: "CCU", depart: "1445", arrive: "1515", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "6E", number: "1057", origin: "CCU", destination: "BKK", depart: "1720", arrive: "2135", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" }
  ];

  ROUTE_DATA["BKK-DAC"] = [
    { carrier: "TG", number: "321", depart: "1035", arrive: "1235", equip: "333", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TG", number: "339", depart: "0145", arrive: "0350", equip: "330", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "BS", number: "316", depart: "1530", arrive: "1735", equip: "333", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "389", depart: "1545", arrive: "1750", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "VZ", number: "306", depart: "1210", arrive: "1415", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "MH", number: "785", origin: "BKK", destination: "KUL", depart: "1105", arrive: "1420", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "MH", number: "196", origin: "KUL", destination: "DAC", depart: "1950", arrive: "2150", equip: "332", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "SQ", number: "707", origin: "BKK", destination: "SIN", depart: "0930", arrive: "1300", equip: "787", termOrig: "1", termDest: "2", clsType: "full" },
    { carrier: "SQ", number: "446", origin: "SIN", destination: "DAC", depart: "2035", arrive: "2240", equip: "787", termOrig: "2", termDest: "1", clsType: "full" }
  ];

  /* ══════════════════════════════════════════════════════
     7. LONDON HEATHROW <-> DHAKA (LHR - DAC & DAC - LHR)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DAC-LHR"] = [
    { carrier: "BG", number: "201", depart: "1005", arrive: "1615", equip: "788", termOrig: "1", termDest: "4", clsType: "bg", notes: ["NON-STOP DHAKA TO LONDON HEATHROW"] },
    { carrier: "BG", number: "207", depart: "0830", arrive: "1650", equip: "788", termOrig: "1", termDest: "4", clsType: "bg", notes: ["ONE STOP VIA SYLHET (ZYL)"] },
    // Connections
    { carrier: "EK", number: "585", origin: "DAC", destination: "DXB", depart: "0140", arrive: "0430", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "001", origin: "DXB", destination: "LHR", depart: "0745", arrive: "1225", equip: "388", termOrig: "3", termDest: "3", clsType: "ek", notes: ["EMIRATES A380 FLAGSHIP"] },
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "007", origin: "DOH", destination: "LHR", depart: "1505", arrive: "2010", equip: "388", termOrig: "1", termDest: "4", clsType: "qr", notes: ["QATAR AIRWAYS A380"] },
    { carrier: "TK", number: "713", origin: "DAC", destination: "IST", depart: "2255", arrive: "#0540", equip: "333", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TK", number: "1979", origin: "IST", destination: "LHR", depart: "0805", arrive: "1010", equip: "321", termOrig: "1", termDest: "2", clsType: "full" },
    { carrier: "SV", number: "803", origin: "DAC", destination: "JED", depart: "0235", arrive: "0615", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "SV", number: "115", origin: "JED", destination: "LHR", depart: "0830", arrive: "1255", equip: "773", termOrig: "1", termDest: "4", clsType: "sv" },
    { carrier: "KU", number: "284", origin: "DAC", destination: "KWI", depart: "0345", arrive: "0700", equip: "77W", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "KU", number: "101", origin: "KWI", destination: "LHR", depart: "0950", arrive: "1440", equip: "77W", termOrig: "1", termDest: "4", clsType: "full" },
    { carrier: "GF", number: "251", origin: "DAC", destination: "BAH", depart: "0540", arrive: "0900", equip: "789", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "GF", number: "003", origin: "BAH", destination: "LHR", depart: "1030", arrive: "1530", equip: "789", termOrig: "1", termDest: "4", clsType: "full" }
  ];

  ROUTE_DATA["LHR-DAC"] = [
    { carrier: "BG", number: "202", depart: "1815", arrive: "#1015", equip: "788", termOrig: "4", termDest: "1", clsType: "bg", notes: ["NON-STOP LHR-DAC"] },
    { carrier: "BA", number: "143", depart: "2045", arrive: "#1250", equip: "789", termOrig: "5", termDest: "1", clsType: "full" },
    // Connections
    { carrier: "EK", number: "002", origin: "LHR", destination: "DXB", depart: "1415", arrive: "#0030", equip: "388", termOrig: "3", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "582", origin: "DXB", destination: "DAC", depart: "0145", arrive: "0840", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "QR", number: "008", origin: "LHR", destination: "DOH", depart: "1600", arrive: "#0115", equip: "388", termOrig: "4", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "640", origin: "DOH", destination: "DAC", depart: "0210", arrive: "0950", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "TK", number: "1980", origin: "LHR", destination: "IST", depart: "1130", arrive: "1725", equip: "321", termOrig: "2", termDest: "1", clsType: "full" },
    { carrier: "TK", number: "712", origin: "IST", destination: "DAC", depart: "2030", arrive: "#0515", equip: "333", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "SV", number: "116", origin: "LHR", destination: "JED", depart: "1530", arrive: "2335", equip: "773", termOrig: "4", termDest: "1", clsType: "sv" },
    { carrier: "SV", number: "802", origin: "JED", destination: "DAC", depart: "0130", arrive: "1120", equip: "77W", termOrig: "1", termDest: "1", clsType: "sv" }
  ];

  /* ══════════════════════════════════════════════════════
     8. NORTH AMERICA (JFK / YYZ / ORD / LAX)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DAC-JFK"] = [
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "701", origin: "DOH", destination: "JFK", depart: "1535", arrive: "2200", equip: "351", termOrig: "1", termDest: "8", clsType: "qr" },
    { carrier: "EK", number: "585", origin: "DAC", destination: "DXB", depart: "0140", arrive: "0430", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "201", origin: "DXB", destination: "JFK", depart: "0830", arrive: "1425", equip: "388", termOrig: "3", termDest: "4", clsType: "ek" },
    { carrier: "TK", number: "713", origin: "DAC", destination: "IST", depart: "2255", arrive: "#0540", equip: "333", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TK", number: "003", origin: "IST", destination: "JFK", depart: "0725", arrive: "1130", equip: "77W", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "SV", number: "803", origin: "DAC", destination: "JED", depart: "0235", arrive: "0615", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "SV", number: "021", origin: "JED", destination: "JFK", depart: "0850", arrive: "1435", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "KU", number: "284", origin: "DAC", destination: "KWI", depart: "0345", arrive: "0700", equip: "77W", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "KU", number: "117", origin: "KWI", destination: "JFK", depart: "0930", arrive: "1625", equip: "77W", termOrig: "1", termDest: "4", clsType: "full" },
    { carrier: "EY", number: "257", origin: "DAC", destination: "AUH", depart: "1945", arrive: "2315", equip: "789", termOrig: "1", termDest: "3", clsType: "full" },
    { carrier: "EY", number: "101", origin: "AUH", destination: "JFK", depart: "0230", arrive: "0830", equip: "789", termOrig: "3", termDest: "4", clsType: "full" }
  ];

  ROUTE_DATA["JFK-DAC"] = [
    { carrier: "QR", number: "702", origin: "JFK", destination: "DOH", depart: "2100", arrive: "#1645", equip: "351", termOrig: "8", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "642", origin: "DOH", destination: "DAC", depart: "1850", arrive: "#0245", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "EK", number: "202", origin: "JFK", destination: "DXB", depart: "2300", arrive: "#1945", equip: "388", termOrig: "4", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "582", origin: "DXB", destination: "DAC", depart: "0145", arrive: "0840", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "TK", number: "004", origin: "JFK", destination: "IST", depart: "1315", arrive: "#0600", equip: "77W", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TK", number: "712", origin: "IST", destination: "DAC", depart: "2030", arrive: "#0515", equip: "333", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "SV", number: "020", origin: "JFK", destination: "JED", depart: "1730", arrive: "#1145", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "SV", number: "808", origin: "JED", destination: "DAC", depart: "1410", arrive: "2355", equip: "77W", termOrig: "1", termDest: "1", clsType: "sv" }
  ];

  ROUTE_DATA["DAC-YYZ"] = [
    { carrier: "BG", number: "305", depart: "0330", arrive: "1330", equip: "789", termOrig: "1", termDest: "3", clsType: "bg", notes: ["ONE STOP TECHNICAL CALL VIA IST"] },
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "763", origin: "DOH", destination: "YYZ", depart: "0830", arrive: "1520", equip: "359", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "EK", number: "585", origin: "DAC", destination: "DXB", depart: "0140", arrive: "0430", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "241", origin: "DXB", destination: "YYZ", depart: "0330", arrive: "0930", equip: "388", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "TK", number: "713", origin: "DAC", destination: "IST", depart: "2255", arrive: "#0540", equip: "333", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TK", number: "017", origin: "IST", destination: "YYZ", depart: "1400", arrive: "1740", equip: "359", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "SV", number: "803", origin: "DAC", destination: "JED", depart: "0235", arrive: "0615", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "SV", number: "061", origin: "JED", destination: "YYZ", depart: "0900", arrive: "1545", equip: "773", termOrig: "1", termDest: "3", clsType: "sv" },
    { carrier: "BG", number: "201", origin: "DAC", destination: "LHR", depart: "1005", arrive: "1615", equip: "788", termOrig: "1", termDest: "4", clsType: "bg" },
    { carrier: "AC", number: "857", origin: "LHR", destination: "YYZ", depart: "1800", arrive: "2045", equip: "789", termOrig: "2", termDest: "1", clsType: "full" }
  ];

  ROUTE_DATA["YYZ-DAC"] = [
    { carrier: "BG", number: "306", depart: "1930", arrive: "#2145", equip: "789", termOrig: "3", termDest: "1", clsType: "bg" },
    { carrier: "QR", number: "764", origin: "YYZ", destination: "DOH", depart: "2015", arrive: "#1630", equip: "359", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "642", origin: "DOH", destination: "DAC", depart: "1850", arrive: "#0245", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "EK", number: "242", origin: "YYZ", destination: "DXB", depart: "1430", arrive: "#1115", equip: "388", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "586", origin: "DXB", destination: "DAC", depart: "1030", arrive: "1655", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "TK", number: "018", origin: "YYZ", destination: "IST", depart: "2145", arrive: "#1445", equip: "359", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "TK", number: "712", origin: "IST", destination: "DAC", depart: "2030", arrive: "#0515", equip: "333", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  /* ══════════════════════════════════════════════════════
     9. MIDDLE EAST (RUH / DMM / MED / KWI / MCT / BAH / AUH / SHJ)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DAC-RUH"] = [
    { carrier: "SV", number: "805", depart: "0045", arrive: "0340", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "BG", number: "339", depart: "2315", arrive: "#0330", equip: "77W", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "XY", number: "356", depart: "2130", arrive: "#0215", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "1164", origin: "DOH", destination: "RUH", depart: "1530", arrive: "1700", equip: "359", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "EK", number: "585", origin: "DAC", destination: "DXB", depart: "0140", arrive: "0430", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "819", origin: "DXB", destination: "RUH", depart: "0655", arrive: "0800", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" },
    { carrier: "GF", number: "251", origin: "DAC", destination: "BAH", depart: "0540", arrive: "0900", equip: "789", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "GF", number: "167", origin: "BAH", destination: "RUH", depart: "1045", arrive: "1155", equip: "320", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  ROUTE_DATA["RUH-DAC"] = [
    { carrier: "SV", number: "806", depart: "0200", arrive: "1030", equip: "773", termOrig: "1", termDest: "1", clsType: "sv" },
    { carrier: "BG", number: "340", depart: "2315", arrive: "#0730", equip: "77W", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "XY", number: "355", depart: "1130", arrive: "2030", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "QR", number: "1165", origin: "RUH", destination: "DOH", depart: "1800", arrive: "1930", equip: "359", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "642", origin: "DOH", destination: "DAC", depart: "2200", arrive: "#0550", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "EK", number: "820", origin: "RUH", destination: "DXB", depart: "0945", arrive: "1240", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "586", origin: "DXB", destination: "DAC", depart: "1030", arrive: "1655", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" }
  ];

  ROUTE_DATA["DAC-KWI"] = [
    { carrier: "KU", number: "284", depart: "0345", arrive: "0700", equip: "77W", termOrig: "1", termDest: "4", clsType: "full" },
    { carrier: "BG", number: "043", depart: "1915", arrive: "2235", equip: "77W", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "J9", number: "532", depart: "2145", arrive: "#0105", equip: "320", termOrig: "1", termDest: "5", clsType: "bs" },
    // Connecting
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "1078", origin: "DOH", destination: "KWI", depart: "1530", arrive: "1700", equip: "320", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "EK", number: "585", origin: "DAC", destination: "DXB", depart: "0140", arrive: "0430", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "857", origin: "DXB", destination: "KWI", depart: "0830", arrive: "0920", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" }
  ];

  ROUTE_DATA["KWI-DAC"] = [
    { carrier: "KU", number: "283", depart: "1800", arrive: "#0230", equip: "77W", termOrig: "4", termDest: "1", clsType: "full" },
    { carrier: "BG", number: "044", depart: "2355", arrive: "#0800", equip: "77W", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "J9", number: "531", depart: "1330", arrive: "2045", equip: "320", termOrig: "5", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "QR", number: "1079", origin: "KWI", destination: "DOH", depart: "1815", arrive: "1940", equip: "320", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "642", origin: "DOH", destination: "DAC", depart: "2200", arrive: "#0550", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" }
  ];

  ROUTE_DATA["DAC-MCT"] = [
    { carrier: "WY", number: "312", depart: "1715", arrive: "2030", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "BG", number: "021", depart: "2130", arrive: "#0045", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "321", depart: "2030", arrive: "2345", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "OV", number: "402", depart: "2355", arrive: "#0255", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "1132", origin: "DOH", destination: "MCT", depart: "1530", arrive: "1800", equip: "320", termOrig: "1", termDest: "1", clsType: "qr" }
  ];

  ROUTE_DATA["MCT-DAC"] = [
    { carrier: "WY", number: "311", depart: "0945", arrive: "1615", equip: "738", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "BG", number: "022", depart: "0200", arrive: "0830", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "322", depart: "0100", arrive: "0730", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "OV", number: "401", depart: "1700", arrive: "2300", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" }
  ];

  ROUTE_DATA["DAC-BAH"] = [
    { carrier: "GF", number: "251", depart: "0540", arrive: "0900", equip: "789", termOrig: "1", termDest: "1", clsType: "full" },
    // Connecting
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "1108", origin: "DOH", destination: "BAH", depart: "1545", arrive: "1630", equip: "320", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "EK", number: "585", origin: "DAC", destination: "DXB", depart: "0140", arrive: "0430", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "835", origin: "DXB", destination: "BAH", depart: "0650", arrive: "0705", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" }
  ];

  ROUTE_DATA["BAH-DAC"] = [
    { carrier: "GF", number: "250", depart: "1430", arrive: "2245", equip: "789", termOrig: "1", termDest: "1", clsType: "full" },
    // Connecting
    { carrier: "EK", number: "836", origin: "BAH", destination: "DXB", depart: "0830", arrive: "1045", equip: "77W", termOrig: "1", termDest: "3", clsType: "ek" },
    { carrier: "EK", number: "584", origin: "DXB", destination: "DAC", depart: "1300", arrive: "1925", equip: "77W", termOrig: "3", termDest: "1", clsType: "ek" }
  ];

  ROUTE_DATA["DAC-AUH"] = [
    { carrier: "EY", number: "257", depart: "1945", arrive: "2315", equip: "789", termOrig: "1", termDest: "3", clsType: "full" },
    { carrier: "BG", number: "027", depart: "2015", arrive: "2345", equip: "788", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "349", depart: "1830", arrive: "2200", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "3L", number: "051", depart: "2100", arrive: "#0045", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    // Connecting
    { carrier: "QR", number: "639", origin: "DAC", destination: "DOH", depart: "1100", arrive: "1345", equip: "77W", termOrig: "1", termDest: "1", clsType: "qr" },
    { carrier: "QR", number: "1056", origin: "DOH", destination: "AUH", depart: "1530", arrive: "1735", equip: "320", termOrig: "1", termDest: "1", clsType: "qr" }
  ];

  ROUTE_DATA["AUH-DAC"] = [
    { carrier: "EY", number: "256", depart: "1230", arrive: "1910", equip: "789", termOrig: "3", termDest: "1", clsType: "full" },
    { carrier: "BG", number: "028", depart: "0100", arrive: "0745", equip: "788", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "350", depart: "2300", arrive: "#0530", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "3L", number: "052", depart: "1400", arrive: "2030", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" }
  ];

  /* ══════════════════════════════════════════════════════
     10. INDIAN SUBCONTINENT (DEL, BOM, CCU, MAA, KTM, CMB)
  ══════════════════════════════════════════════════════ */
  ROUTE_DATA["DAC-CCU"] = [
    { carrier: "BS", number: "201", depart: "0930", arrive: "0955", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "391", depart: "1045", arrive: "1115", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "6E", number: "1106", depart: "1445", arrive: "1515", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BS", number: "203", depart: "1630", arrive: "1700", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "393", depart: "1930", arrive: "2000", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "6E", number: "1108", depart: "2130", arrive: "2200", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" }
  ];
  ROUTE_DATA["CCU-DAC"] = [
    { carrier: "BS", number: "202", depart: "1040", arrive: "1105", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "392", depart: "1200", arrive: "1230", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "6E", number: "1107", depart: "1600", arrive: "1630", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BS", number: "204", depart: "1745", arrive: "1815", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "394", depart: "2045", arrive: "2115", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" }
  ];

  ROUTE_DATA["DAC-DEL"] = [
    { carrier: "BG", number: "397", depart: "1015", arrive: "1235", equip: "738", termOrig: "1", termDest: "3", clsType: "bg" },
    { carrier: "6E", number: "1104", depart: "1215", arrive: "1445", equip: "320", termOrig: "1", termDest: "3", clsType: "bs" },
    { carrier: "BS", number: "211", depart: "1410", arrive: "1630", equip: "738", termOrig: "1", termDest: "3", clsType: "bs" },
    { carrier: "AI", number: "238", depart: "1730", arrive: "1955", equip: "320", termOrig: "1", termDest: "3", clsType: "full" },
    { carrier: "6E", number: "1118", depart: "2045", arrive: "2315", equip: "320", termOrig: "1", termDest: "3", clsType: "bs" }
  ];
  ROUTE_DATA["DEL-DAC"] = [
    { carrier: "BG", number: "398", depart: "1335", arrive: "1645", equip: "738", termOrig: "3", termDest: "1", clsType: "bg" },
    { carrier: "6E", number: "1105", depart: "1530", arrive: "1850", equip: "320", termOrig: "3", termDest: "1", clsType: "bs" },
    { carrier: "BS", number: "212", depart: "1715", arrive: "2025", equip: "738", termOrig: "3", termDest: "1", clsType: "bs" },
    { carrier: "AI", number: "239", depart: "2040", arrive: "2355", equip: "320", termOrig: "3", termDest: "1", clsType: "full" }
  ];

  ROUTE_DATA["DAC-KTM"] = [
    { carrier: "BG", number: "371", depart: "0830", arrive: "0955", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "231", depart: "1015", arrive: "1140", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "H9", number: "561", depart: "1245", arrive: "1410", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "373", depart: "1530", arrive: "1655", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "233", depart: "1820", arrive: "1945", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" }
  ];
  ROUTE_DATA["KTM-DAC"] = [
    { carrier: "BG", number: "372", depart: "1055", arrive: "1220", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "232", depart: "1240", arrive: "1405", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "H9", number: "562", depart: "1510", arrive: "1635", equip: "320", termOrig: "1", termDest: "1", clsType: "bs" },
    { carrier: "BG", number: "374", depart: "1755", arrive: "1920", equip: "738", termOrig: "1", termDest: "1", clsType: "bg" },
    { carrier: "BS", number: "234", depart: "2045", arrive: "2210", equip: "738", termOrig: "1", termDest: "1", clsType: "bs" }
  ];

  ROUTE_DATA["DAC-CMB"] = [
    { carrier: "UL", number: "190", depart: "1250", arrive: "1540", equip: "320", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "UL", number: "192", depart: "2350", arrive: "#0240", equip: "333", termOrig: "1", termDest: "1", clsType: "full" }
  ];
  ROUTE_DATA["CMB-DAC"] = [
    { carrier: "UL", number: "189", depart: "0740", arrive: "1100", equip: "320", termOrig: "1", termDest: "1", clsType: "full" },
    { carrier: "UL", number: "191", depart: "1830", arrive: "2150", equip: "333", termOrig: "1", termDest: "1", clsType: "full" }
  ];

  /* ══════════════════════════════════════════════════════
     11. BANGLADESH DOMESTIC ROUTES (CGP, CXB, ZYL, JSR, SPD, RJH, BZL)
  ══════════════════════════════════════════════════════ */
  const DOMESTIC_TIMINGS = [
    ["0715", "0800"], ["0930", "1015"], ["1145", "1230"],
    ["1400", "1445"], ["1615", "1700"], ["1830", "1915"], ["2045", "2130"]
  ];
  ["CGP", "CXB", "ZYL", "JSR", "SPD", "RJH", "BZL"].forEach(function(dest) {
    ROUTE_DATA["DAC-" + dest] = DOMESTIC_TIMINGS.map(function(t, idx) {
      const c = idx % 3 === 0 ? "BG" : (idx % 3 === 1 ? "BS" : "VQ");
      const num = String(101 + idx * 7);
      return {
        carrier: c, number: num, depart: t[0], arrive: t[1], equip: idx % 2 === 0 ? "738" : "AT7",
        termOrig: "DOM", termDest: "DOM", clsType: c === "BG" ? "bg" : "bs"
      };
    });
    ROUTE_DATA[dest + "-DAC"] = DOMESTIC_TIMINGS.map(function(t, idx) {
      const c = idx % 3 === 0 ? "BG" : (idx % 3 === 1 ? "BS" : "VQ");
      const num = String(102 + idx * 7);
      return {
        carrier: c, number: num, depart: t[1], arrive: t[0], equip: idx % 2 === 0 ? "738" : "AT7",
        termOrig: "DOM", termDest: "DOM", clsType: c === "BG" ? "bg" : "bs"
      };
    });
  });

  /* ══════════════════════════════════════════════════════
     INTELLIGENT GLOBAL FALLBACK (Real Airlines via Hubs)
  ══════════════════════════════════════════════════════ */
  function generateGlobalHubFlights(origin, destination, reqDate, reqFreq) {
    // When searching from DAC or to DAC, construct realistic multi-carrier transit connections
    const isOutbound = origin === "DAC";
    const foreign = isOutbound ? destination : origin;

    // Major international hub gateways
    const hubs = [
      { hub: "DXB", al1: "EK", fl1: "585", t1: "0140", t2: "0430", eq1: "77W", al2: "EK", fl2: "301", t3: "0830", t4: "1345", eq2: "77W", cls: "ek" },
      { hub: "DOH", al1: "QR", fl1: "639", t1: "1100", t2: "1345", eq1: "77W", al2: "QR", fl2: "411", t3: "1545", t4: "2100", eq2: "789", cls: "qr" },
      { hub: "IST", al1: "TK", fl1: "713", t1: "2255", t2: "#0540", eq1: "333", al2: "TK", fl2: "801", t3: "0815", t4: "1230", eq2: "359", cls: "full" },
      { hub: "SIN", al1: "SQ", fl1: "447", t1: "2355", t2: "#0605", eq1: "787", al2: "SQ", fl2: "221", t3: "0915", t4: "1530", eq2: "359", cls: "full" },
      { hub: "KUL", al1: "MH", fl1: "197", t1: "0050", t2: "0650", eq1: "332", al2: "MH", fl2: "123", t3: "0900", t4: "1415", eq2: "738", cls: "full" },
      { hub: "BKK", al1: "TG", fl1: "322", t1: "1340", t2: "1710", eq1: "333", al2: "TG", fl2: "622", t3: "1915", t4: "2350", eq2: "77W", cls: "full" },
      { hub: "JED", al1: "SV", fl1: "803", t1: "0235", t2: "0615", eq1: "773", al2: "SV", fl2: "551", t3: "0850", t4: "1315", eq2: "773", cls: "sv" },
      { hub: "KWI", al1: "KU", fl1: "284", t1: "0345", t2: "0700", eq1: "77W", al2: "KU", fl2: "311", t3: "0930", t4: "1420", eq2: "320", cls: "full" }
    ];

    const results = [];
    hubs.forEach(function(h) {
      if (isOutbound) {
        // Leg 1: DAC -> Hub
        results.push({
          carrier: h.al1, number: h.fl1, origin: "DAC", destination: h.hub,
          depart: h.t1, arrive: h.t2, equip: h.eq1, termOrig: "1", termDest: "1", clsType: h.cls,
          notes: ["CONNECTING VIA " + h.hub + " TO " + foreign]
        });
        // If the requested city is this hub, the first leg is already direct.
        if (h.hub !== foreign) results.push({
          carrier: h.al2, number: h.fl2, origin: h.hub, destination: foreign,
          depart: h.t3, arrive: h.t4, equip: h.eq2, termOrig: "1", termDest: "1", clsType: h.cls,
          notes: ["ONWARD CONNECTION TO " + foreign]
        });
      } else {
        // If the origin is already this hub, do not invent a self-route.
        if (foreign !== h.hub) results.push({
          carrier: h.al2, number: h.fl2, origin: foreign, destination: h.hub,
          depart: h.t1, arrive: h.t2, equip: h.eq2, termOrig: "1", termDest: "1", clsType: h.cls,
          notes: ["CONNECTING VIA " + h.hub + " TO DAC"]
        });
        // Inbound: Hub -> DAC
        results.push({
          carrier: h.al1, number: h.fl1, origin: h.hub, destination: "DAC",
          depart: h.t3, arrive: h.t4, equip: h.eq1, termOrig: "1", termDest: "1", clsType: h.cls,
          notes: ["ONWARD CONNECTION FROM " + h.hub + " TO DAC"]
        });
      }
    });

    return results;
  }

  /* ══════════════════════════════════════════════════════
     MAIN SEARCH FUNCTION
  ══════════════════════════════════════════════════════ */
  function search(opts) {
    const orig = String(opts.origin || "DAC").toUpperCase();
    const dest = String(opts.destination || "DXB").toUpperCase();
    if (!global.GalileoAirports.find(orig) || !global.GalileoAirports.find(dest)) return [];
    if (orig === dest) return [];
    const carrier = opts.carrier ? String(opts.carrier).toUpperCase() : null;
    const reqDate = opts.date ? opts.date.slice(0, 5) : "22JUN";
    const reqFreq = reqDate.slice(0, 2);

    const pairKey = orig + "-" + dest;
    let rawList = ROUTE_DATA[pairKey];

    if (!rawList || !rawList.length) {
      rawList = generateGlobalHubFlights(orig, dest, reqDate, reqFreq);
    }

    // Materialize full flight records
    let list = rawList.map(function(item, idx) {
      const clsData = standardClasses(item.clsType || "full");
      const c = item.carrier;
      const num = item.number;
      const fltOrig = item.origin || orig;
      const fltDest = item.destination || dest;

      return {
        line: idx + 1,
        carrier: c,
        number: num,
        isCodeshare: !!item.isCodeshare,
        codeshareCarrier: item.codeshareCarrier,
        codeshareNumber: item.codeshareNumber,
        date: reqDate,
        freq: reqFreq,
        origin: fltOrig,
        destination: fltDest,
        depart: item.depart,
        arrive: item.arrive,
        equip: item.equip || "77W",
        termOrig: item.termOrig || "1",
        termDest: item.termDest || "1",
        airline_full: airlineName(c),
        classes: item.classes || clsData.classes,
        rows: item.rows || clsData.rows,
        brand: airlineBrand(c),
        flag: airlineFlag(c, item.equip),
        notes: item.notes || ["DEPARTS " + fltOrig + " TERMINAL " + (item.termOrig || "1") + " - ARRIVES " + fltDest + " TERMINAL " + (item.termDest || "1")]
      };
    });

    // Apply carrier filter if user specified e.g. *EK or *BG
    if (carrier) {
      list = list.filter(function(f) {
        return f.carrier === carrier || f.codeshareCarrier === carrier;
      });
    }

    // Re-index lines 1..N
    return list.map(function(f, idx) {
      return Object.assign({}, f, { line: idx + 1 });
    });
  }

  function byLine(lineNum, results) {
    const list = results || [];
    return list.find(function(f) { return f.line === lineNum; }) || null;
  }

  function formatClasses(cls) {
    return Object.entries(cls || {}).slice(0, 10).map(function(pair) {
      return pair[0] + pair[1];
    }).join(' ');
  }

  function formatParts(f) {
    const times = f.arrive && f.arrive.startsWith("#") ? (f.depart + f.arrive) : (f.depart + " " + f.arrive);
    const flt = f.isCodeshare
      ? (" @" + (f.codeshareCarrier || f.carrier) + (f.codeshareNumber || f.number))
      : (String(f.number).length >= 4
          ? ("  " + f.carrier + f.number)
          : ("  " + f.carrier + " " + String(f.number).padStart(3, " ")));
    return {
      ln: String(f.line).padStart(2, " "),
      orig: (f.origin || "DAC").padEnd(3, " "),
      dest: (f.destination || "DXB").padEnd(3, " "),
      depart: f.depart,
      arrive: f.arrive,
      times: times.padEnd(9, " "),
      carrier: f.carrier,
      number: String(f.number).padStart(3, " "),
      flt: flt,
      classes: formatClasses(f.classes),
      equip: (f.equip || "77W").padStart(3, " "),
      flag: f.flag || (f.equip === "7M8" && f.carrier === "FZ" ? " *E" : "C*E")
    };
  }

  function formatLine(f) {
    const p = formatParts(f);
    return p.ln + " " + p.orig + " " + p.dest + " " + p.times + p.flt + " " + p.classes + " " + p.equip + " " + p.flag;
  }

  global.GalileoFlights = {
    search: search,
    byLine: byLine,
    formatLine: formatLine,
    formatParts: formatParts,
    formatClasses: formatClasses,
    all: []
  };

})(typeof window !== 'undefined' ? window : global);
