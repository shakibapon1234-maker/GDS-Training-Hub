function sbGetSabreDate() {
  const d = new Date();
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const day = String(d.getDate()).padStart(2, '0');
  const mon = months[d.getMonth()];
  return `${day}${mon}`;
}

// Fixed training allowances, not live airline policy.  Keeping this with the
// sold segment ensures the value survives ticket issue, reissue and WETR.
function sbTrainingBaggageAllowance(carrier) {
  return String(carrier || '').toUpperCase() === 'BG' ? '30K' : '20K';
}

/* =========================================================================
   SABRE TRAINING SIMULATOR — COMMAND PROCESSOR & TERMINAL ENGINE
   Updated to match Sabre 2025 Lecture Sheet specifications
   ========================================================================= */

/* ---------------------------------------------------------------------
   W/-... / W/*... / HCCC/... / HCC...  — Encode & Decode
   Sabre 2025 Lecture Sheet:
   City Encode:    W/-CCDHAKA          City Decode:    W/*DAC
   Airport Encode: W/-APNARITA         Airport Decode: W/*NRT
   Carrier Encode: W/-ALBIMAN BANGLADESH Carrier Decode: W/*BG
   Aircraft:       W/EQ-MCDONNELL DOUGLAS Decode:      W/EQ*D10
   Country:        HCCC/BANGLADESH     Country Decode: HCCC/BD
   US State:       HCCFLORIDA          State Decode:   HCCFL
--------------------------------------------------------------------- */
function cmdEncodeDecode(raw) {
  const cmd = (raw || '').trim().toUpperCase();

  // Country encode / decode: HCCC/BANGLADESH or HCCC/BD
  if (cmd.startsWith('HCCC/')) {
    const val = cmd.replace(/^HCCC\//, '').trim();
    if (typeof SB_COUNTRY_CODES !== 'undefined') {
      if (SB_COUNTRY_CODES[val]) {
        sbPrint(`HCCC/${val}`);
        sbPrint(`${val} - ${SB_COUNTRY_CODES[val]}`);
        return;
      }
      const foundCode = Object.keys(SB_COUNTRY_CODES).find(c => SB_COUNTRY_CODES[c] === val);
      if (foundCode) {
        sbPrint(`HCCC/${val}`);
        sbPrint(`${val} - ${foundCode}`);
        return;
      }
    }
    sbWarn(`COUNTRY NOT FOUND - ${val}`);
    return;
  }

  // US State encode / decode: HCCFLORIDA or HCCFL
  if (cmd.startsWith('HCC')) {
    const val = cmd.replace(/^HCC\s*/, '').trim();
    if (typeof SB_US_STATES !== 'undefined') {
      if (SB_US_STATES[val]) {
        sbPrint(`HCC${val}`);
        sbPrint(`${val} - ${SB_US_STATES[val]}`);
        return;
      }
      const foundState = Object.keys(SB_US_STATES).find(s => SB_US_STATES[s] === val);
      if (foundState) {
        sbPrint(`HCC${val}`);
        sbPrint(`${val} - ${foundState}`);
        return;
      }
    }
    sbWarn(`STATE NOT FOUND - ${val}`);
    return;
  }

  // Aircraft encode / decode: W/EQ-MCDONNELL DOUGLAS or W/EQ*D10
  if (cmd.startsWith('W/EQ') || cmd.startsWith('EQ')) {
    const rest = cmd.replace(/^(?:W\/)?EQ/, '');
    const isDecode = rest.startsWith('*');
    const val = rest.replace(/^[-*]/, '').trim();
    if (typeof SB_AIRCRAFT_CODES !== 'undefined') {
      if (isDecode || SB_AIRCRAFT_CODES[val]) {
        const desc = SB_AIRCRAFT_CODES[val] || val;
        sbPrint('EQUIPMENT DECODE');
        sbPrint(`${val}  ${desc}`);
        return;
      }
      const foundEq = Object.keys(SB_AIRCRAFT_CODES).find(k => SB_AIRCRAFT_CODES[k].toUpperCase().includes(val));
      if (foundEq) {
        sbPrint('EQUIPMENT ENCODE');
        sbPrint(`${SB_AIRCRAFT_CODES[foundEq]} - ${foundEq}`);
        return;
      }
    }
    sbPrint(`EQUIPMENT ${val}`);
    return;
  }

  // Country / City encode: W/-CCBANGLADESH or W/-CCDHAKA
  if (cmd.startsWith('W/-CC') || cmd.startsWith('-CC')) {
    const val = cmd.replace(/^(?:W\/)?-CC/, '').trim();
    if (typeof SB_COUNTRY_CODES !== 'undefined') {
      const foundCode = Object.keys(SB_COUNTRY_CODES).find(c => SB_COUNTRY_CODES[c].toUpperCase() === val || c.toUpperCase() === val);
      if (foundCode) {
        sbPrint(`HCCC/${val}`);
        sbPrint(`${val} - ${foundCode}`);
        return;
      }
    }
    const match = Object.entries(SB_AIRPORTS).find(([code, apt]) => apt.city.toUpperCase() === val || apt.city.toUpperCase().includes(val));
    if (match) {
      sbPrint(`CITY ENCODE - ${val}`);
      sbPrint(`${match[0]}  ${match[1].city}/${match[1].country}`);
      return;
    }
    sbWarn(`COUNTRY/CITY NOT FOUND - ${val}`);
    return;
  }

  // Airport encode: W/-APNARITA
  if (cmd.startsWith('W/-AP') || cmd.startsWith('-AP')) {
    const val = cmd.replace(/^(?:W\/)?-AP/, '').trim();
    const match = Object.entries(SB_AIRPORTS).find(([code, apt]) => apt.name.toUpperCase().includes(val) || apt.city.toUpperCase().includes(val));
    if (match) {
      sbPrint(`AIRPORT ENCODE - ${val}`);
      sbPrint(`${match[0]}  ${match[1].name} / ${match[1].city} / ${match[1].country}`);
      return;
    }
    sbWarn(`AIRPORT NOT FOUND - ${val}`);
    return;
  }

  // Carrier encode: W/-ALBIMAN BANGLADESH
  if (cmd.startsWith('W/-AL') || cmd.startsWith('-AL')) {
    const val = cmd.replace(/^(?:W\/)?-AL/, '').trim();
    const match = Object.entries(SB_AIRLINES).find(([code, al]) => al.name.toUpperCase().includes(val));
    if (match) {
      sbPrint(`CARRIER ENCODE - ${val}`);
      sbPrint(`${match[0]}  ${match[1].name}`);
      return;
    }
    sbWarn(`CARRIER NOT FOUND - ${val}`);
    return;
  }

  // Decode carrier or city/airport: W/*DAC or W/*BG
  if (cmd.startsWith('W/*') || cmd.startsWith('*')) {
    const val = cmd.replace(/^(?:W\/)?\*/, '').trim();
    // Carrier decode
    if (SB_AIRLINES[val]) {
      sbPrint(`CARRIER DECODE - ${val}`);
      sbPrint(`${val}  ${SB_AIRLINES[val].name}`);
      return;
    }
    // Airport decode
    if (SB_AIRPORTS[val]) {
      const info = SB_AIRPORTS[val];
      sbPrint(`AIRPORT/CITY DECODE - ${val}`);
      sbPrint(`${val}  ${info.city} / ${info.name} / ${info.country}`);
      return;
    }
    sbWarn(`CODE NOT FOUND - ${val}`);
    return;
  }

  // Generic encode/decode query
  const query = cmd.replace(/^(?:W\/)?[-*]/, '').trim();
  if (query === 'COUNTRIES' || query === 'COUNTRY LIST') {
    sbPrint('TRAINING COUNTRY CODES (ISO)');
    Object.entries(SB_COUNTRY_CODES).forEach(([code, country]) => sbPrint(`${code}  ${country}`));
    return;
  }
  if (SB_AIRPORTS[query]) {
    const info = SB_AIRPORTS[query];
    sbPrint(`${query}  ${info.city}/${info.name}/${info.country}`);
    return;
  }
  if (SB_AIRLINES[query]) {
    sbPrint(`${query}  ${SB_AIRLINES[query].name}`);
    return;
  }
  const matches = Object.entries(SB_AIRPORTS)
    .filter(([, airport]) => airport.city.toUpperCase().includes(query) || airport.name.toUpperCase().includes(query))
    .slice(0, 10);
  if (matches.length) {
    sbPrint(`CODE SEARCH - ${query}`);
    matches.forEach(([code, airport]) => sbPrint(`${code}  ${airport.city} / ${airport.name} / ${airport.country}`));
    return;
  }
  sbWarn(`NO MATCH - ${query} NOT FOUND`);
}

/* ---------------------------------------------------------------------
   Time Calculator — Sabre 2025 Lecture Sheet:
   • T¤FEB       → View calendar for February
   • T¤25FEB¥80  → View date 80 days from 25FEB
--------------------------------------------------------------------- */
function cmdTimeCalc(raw) {
  const clean = raw.trim().toUpperCase().replace(/^T[¤*]/, '');
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  // Current system / global time: T* or T¤
  if (!clean || clean === '*' || clean === 'NOW') {
    const now = new Date();
    sbPrint(`SABRE SYSTEM TIME: ${now.toUTCString().toUpperCase()}`);
    sbPrint(`HDQ TIME: ${String(now.getUTCHours()).padStart(2, '0')}${String(now.getUTCMinutes()).padStart(2, '0')} GMT`);
    return;
  }

  // Local city time: T*CDAC, T*CDXB, etc.
  const cityMatch = clean.match(/^C([A-Z]{3})$/);
  if (cityMatch) {
    const city = cityMatch[1];
    const cityNames = { DAC: "DHAKA", DXB: "DUBAI", SIN: "SINGAPORE", BKK: "BANGKOK", LHR: "LONDON", KUL: "KUALA LUMPUR", JED: "JEDDAH" };
    const offsets = { DAC: 6, DXB: 4, SIN: 8, BKK: 7, LHR: 0, KUL: 8, JED: 3 };
    const offset = offsets[city] !== undefined ? offsets[city] : 6;
    const now = new Date();
    const utcHours = now.getUTCHours();
    const localHours = (utcHours + offset + 24) % 24;
    const localTimeStr = String(localHours).padStart(2, '0') + String(now.getUTCMinutes()).padStart(2, '0');
    sbPrint(`LOCAL TIME - ${cityNames[city] || city} (${city}): ${localTimeStr} (GMT${offset >= 0 ? '+' + offset : offset})`);
    return;
  }

  // Date + Days offset: e.g. 25FEB¥80, 25FEB*80, 25FEB+80
  const offsetMatch = clean.match(/^(\d{2})([A-Z]{3})[¥☨‡§*+](\d+)$/);
  if (offsetMatch) {
    const day = parseInt(offsetMatch[1], 10);
    const monStr = offsetMatch[2];
    const daysToAdd = parseInt(offsetMatch[3], 10);
    const monIdx = months.indexOf(monStr);
    if (monIdx === -1) { sbWarn(`INVALID MONTH ${monStr}`); return; }
    const now = new Date();
    const d = new Date(now.getFullYear(), monIdx, day);
    d.setDate(d.getDate() + daysToAdd);
    const dayName = ['SUN','MON','TUE','WED','THU','FRI','SAT'][d.getDay()];
    const resDay = String(d.getDate()).padStart(2, '0');
    const resMon = months[d.getMonth()];
    const resYr = String(d.getFullYear()).slice(2);
    sbPrint(`TIME CALCULATOR: ${offsetMatch[1]}${monStr} + ${daysToAdd} DAYS`);
    sbPrint(`RESULT: ${dayName} ${resDay}${resMon}${resYr}`);
    return;
  }

  // Month calendar: e.g. FEB
  const monQuery = clean.slice(0, 3);
  const monIndex = months.indexOf(monQuery);
  if (monIndex !== -1) {
    const year = new Date().getFullYear();
    const monthNames = ['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
    sbPrint(`CALENDAR - ${monthNames[monIndex]} ${year}`);
    sbPrint('  SU  MO  TU  WE  TH  FR  SA');
    const firstDay = new Date(year, monIndex, 1).getDay();
    const daysInMonth = new Date(year, monIndex + 1, 0).getDate();
    let row = ' '.repeat(firstDay * 4);
    for (let day = 1; day <= daysInMonth; day++) {
      row += String(day).padStart(3, ' ') + ' ';
      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        sbPrint(row);
        row = '';
      }
    }
    return;
  }

  sbWarn('FORMAT: T¤<MONTH>  e.g. T¤FEB  |  T¤<DATE>¥<DAYS>  e.g. T¤25FEB¥80');
}

/* ---------------------------------------------------------------------
   Sign In / Sign Out — Sabre 2025 Lecture Sheet:
   • SI*1001 → Sign in all areas
   • SI1002  → Sign in previous area
   • SO*     → Sign out all areas
   • SO      → Sign out current area
--------------------------------------------------------------------- */
function cmdSignIn(raw) {
  const upper = raw.trim().toUpperCase();
  const sine = upper.replace(/^SI\*?/, '').trim() || '1001';
  sbState.agentSine = sine;
  if (upper.includes('*')) {
    sbPrint(`* SIGNED IN ALL AREAS - ${sine}/AGENT  ${sbState.officeId}`);
  } else {
    sbPrint(`* SIGNED IN AREA A - ${sine}/AGENT  ${sbState.officeId}`);
  }
}
function cmdSignOut(raw) {
  const upper = raw.trim().toUpperCase();
  if (upper.includes('*')) {
    sbPrint('* SIGNED OUT ALL AREAS');
  } else {
    sbPrint('* SIGNED OUT AREA A');
  }
}

/* ---------------------------------------------------------------------
   Availability Commands — Sabre 2025 Lecture Sheet:
   • 120DECJEDAUH        → Basic availability
   • 120DECJEDAUH¥EY     → Availability by airline EY
   • 120DECJEDAUH0800BAH → Availability via BAH with time 0800
   • 120DECJEDAUH-Q      → Availability for Q class
   • 120DECJEDAUH¤EY     → Direct Access Availability (DCA) on EY
--------------------------------------------------------------------- */
function cmdAvailability(raw) {
  const upper = raw.trim().toUpperCase();

  // Return availability: 1R or 1R25JAN
  const retMatch = upper.match(/^1R(\d{2}[A-Z]{3})?$/i);
  if (retMatch) {
    const last = sbState._lastAvail || (sbState.booked && sbState.booked[0] ? { org: sbState.booked[0].dep, dst: sbState.booked[0].arr } : null);
    if (!last) {
      sbWarn('NO PRIOR AVAILABILITY DISPLAYED — ENTER 1<DATE><ORG><DST> FIRST');
      return;
    }
    const retDate = retMatch[1] || '25OCT';
    return cmdAvailability(`1${retDate}${last.dst}${last.org}`);
  }

  // Regex to extract date, org, dst, and any qualifiers
  const baseMatch = upper.match(/^1(\d{2}[A-Z]{3})([A-Z]{3})([A-Z]{3})(.*)$/);
  if (!baseMatch) {
    sbWarn('FORMAT: 1<DDMMM><ORG><DST>  e.g. 120DECJEDAUH');
    return;
  }
  const [, date, org, dst, extra] = baseMatch;
  if (org === dst) { sbWarn('ORIGIN AND DESTINATION CANNOT BE THE SAME'); return; }
  if (!SB_AIRPORTS[org] || !SB_AIRPORTS[dst]) {
    sbWarn(`UNABLE TO BUILD AVAILABILITY - ${(!SB_AIRPORTS[org] ? org : dst)} NOT IN TRAINING DATABASE`);
    return;
  }

  // Parse qualifiers from extra
  let reqCarrier = '';
  let reqClass = '';
  let reqTime = '';
  let reqVia = '';
  let isDCA = false;

  if (extra) {
    if (extra.includes('¤')) {
      isDCA = true;
      reqCarrier = extra.split('¤')[1]?.slice(0, 2);
    }
    const alMatch = extra.match(/[¥☨‡§*]([A-Z0-9]{2})/);
    if (alMatch) reqCarrier = alMatch[1];

    const clsMatch = extra.match(/-([A-Z])/);
    if (clsMatch) reqClass = clsMatch[1];

    const timeViaMatch = extra.match(/(\d{4})([A-Z]{3})/);
    if (timeViaMatch) {
      reqTime = timeViaMatch[1];
      reqVia = timeViaMatch[2];
    }
  }

  let options = sbGenerateAvailability(org, dst, date);
  if (!options || !options.length) { sbWarn(`NO SERVICE FOUND ${org}${dst} ${date}`); return; }

  // The automatic-ADC lesson is a fixed Biman Bangladesh exercise.  Its
  // replacement seat must remain on BG throughout availability, sell,
  // redisplay and the exchange mask; a generic board can otherwise select a
  // different carrier and teach the wrong workflow.
  const isAdcReissueLesson = Boolean(
    sbState.reissueTrainingNewFare && sbState.ticketed && sbState.reissueNeedsPricing &&
    org === 'DAC' && dst === 'SIN'
  );
  if (isAdcReissueLesson) {
    const firstLeg = options[0]?.legs?.[0];
    if (firstLeg) {
      Object.assign(firstLeg, {
        al: 'BG', fn: '584', dep: 'DAC', arr: 'SIN',
        depT: '0830', arrT: '1440', eq: '738', baggage: '30K',
        // C must be sellable with the lesson entry 01C1.
        cls: 'C9 D9 Y9 B9 M9 H9 K9 Q9'
      });
    }
  }

  // Filter or adapt for requested carrier
  if (reqCarrier) {
    options.forEach(opt => {
      opt.legs.forEach(leg => {
        leg.al = reqCarrier;
      });
    });
  }

  // Filter or ensure requested class
  if (reqClass) {
    options.forEach(opt => {
      opt.legs.forEach(leg => {
        if (!leg.cls.includes(reqClass)) {
          leg.cls = `${reqClass}7 ${leg.cls}`;
        }
      });
    });
  }

  // If via airport specified
  if (reqVia) {
    options.forEach(opt => {
      if (opt.legs.length === 1) {
        const leg1 = { ...opt.legs[0], arr: reqVia, arrT: '1030' };
        const leg2 = { ...opt.legs[0], dep: reqVia, depT: '1200', arr: dst, fn: String(Number(leg1.fn) + 1) };
        opt.legs = [leg1, leg2];
      }
    });
  }

  sbState._availCache = options.map(opt => ({
    date, dep: opt.legs[0].dep, arr: opt.legs[opt.legs.length - 1].arr, legs: opt.legs
  }));
  sbState._lastAvail = { date, org, dst, extra };

  if (isDCA) {
    sbPrint(`DIRECT ACCESS AVAILABILITY - ${reqCarrier || 'CARRIER'}`);
  }

  if (typeof sbRenderAvailabilityBoard === 'function') {
    sbRenderAvailabilityBoard(options, date);
    return;
  }

  const weekDays = ['', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const displayDay = weekDays[Number(options[0]?.legs[0]?.day)] || '---';
  sbPrint(`${date} ${displayDay} ${org} ${dst}`);
  options.forEach((opt, i) => {
    opt.legs.forEach((leg, li) => {
      const lineNo = li === 0 ? String(i + 1) : ' ';
      const dayOverTag = leg.dayOver ? `+${leg.dayOver}` : '';
      const classes = leg.cls.split(' ');
      sbPrint(` ${lineNo.padStart(2)} ${leg.al.padEnd(5)} ${leg.fn.padEnd(4)} ${classes.slice(0, 9).join(' ').padEnd(27)} ${leg.dep.padEnd(4)} ${leg.arr.padEnd(4)} ${leg.depT}  ${leg.arrT}${dayOverTag.padStart(3)}  ${leg.eq}`);
      if (classes.length > 9) sbPrint(`          ${classes.slice(9).join(' ')}`);
    });
    if (opt.legs.length > 1) sbPrint(`   CONNECTION VIA ${opt.legs[0].arr} — 2 SEGMENTS WILL BE SOLD TOGETHER`, 'line-warn');
  });
}

/* ---------------------------------------------------------------------
   Sell Flight / ARNK Segment — Sabre 2025 Lecture Sheet:
   • 01Y1 / 0Y1  → Sell seats
   • 0AA         → Add ARNK segment
   • ,3          → Increase party size to 3
--------------------------------------------------------------------- */
/* ---------------------------------------------------------------------
   Sell from FareShop / Bargain Finder (BFM / JR / WPNI) — Sabre Standard:
   • 0J1   → Sell 1 seat from ITINERARY OPTION 1
   • 01J1  → Sell 1 seat from ITINERARY OPTION 1
   • 02J1  → Sell 2 seats from ITINERARY OPTION 1
   • 0J2   → Sell 1 seat from ITINERARY OPTION 2
--------------------------------------------------------------------- */
/* ---------------------------------------------------------------------
   Sell from FareShop / Bargain Finder (BFM / JR / WPNI) — Sabre Standard:
   • 0J1 / 0J2  → Rejects with ¥FORMAT¥ (seat count mandatory in Sabre)
   • 01J1       → Sell 1 seat from ITINERARY OPTION 1
   • 02J1       → Sell 2 seats from ITINERARY OPTION 1
   • 01J2       → Sell 1 seat from ITINERARY OPTION 2
--------------------------------------------------------------------- */
function cmdSellBfm(raw) {
  const upper = raw.trim().toUpperCase();
  // In Sabre, typing 0J1 or 0J2 without seat count returns ¥FORMAT¥
  if (/^0J\d+$/i.test(upper)) {
    sbWarn('¥FORMAT¥');
    return false;
  }
  const m = upper.match(/^0(\d+)J(\d+)$/i);
  if (!m) {
    sbWarn('¥FORMAT¥');
    return false;
  }
  const qty = parseInt(m[1], 10);
  const optNum = parseInt(m[2], 10);
  if (typeof sbSellBfmOption === 'function') {
    return sbSellBfmOption(optNum, qty);
  }
  sbWarn('NO AVAIL.');
  return false;
}

// Long sell entry used by the Sabre terminal, for example
// 0BS217K23NOVDACBKKN1 (carrier, flight, class, date, route, seats).
// Resolve it against the same training availability data used by the display;
// never invent a confirmed segment when that flight/class is not available.
function cmdSellLong(raw) {
  const m = raw.trim().toUpperCase().match(/^0([A-Z0-9]{2})(\d+)([A-Z])(\d{2}[A-Z]{3})([A-Z]{6})N{1,2}(\d+)$/);
  if (!m) return false;
  const [, carrier, flight, bookingClass, date, route, seatsText] = m;
  const origin = route.slice(0, 3);
  const destination = route.slice(3, 6);
  const seats = Number(seatsText);
  if (!seats) { sbWarn('FORMAT: ENTER A VALID NUMBER OF SEATS'); return true; }

  // JR/FareShop options are the source for long sells entered immediately
  // after a fare search. Match that displayed option before checking the
  // regular availability board, since the two use separate training data.
  const bfmOptions = (typeof window !== 'undefined' && window._sbBfmOptions) || sbState._bfmOptions || [];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const bfmIndex = bfmOptions.findIndex(option => {
    const legs = option.legs || [];
    if (legs.length !== 1) return false;
    const leg = legs[0];
    const legDate = leg.dtStr || (leg.d instanceof Date
      ? String(leg.d.getDate()).padStart(2, '0') + monthNames[leg.d.getMonth()]
      : '');
    return String(leg.al || option.carrier).toUpperCase() === carrier &&
      String(leg.fn) === flight && String(leg.cls).toUpperCase() === bookingClass &&
      String(legDate).toUpperCase() === date &&
      String(leg.org).toUpperCase() === origin && String(leg.dst).toUpperCase() === destination;
  });
  if (bfmIndex >= 0 && typeof sbSellBfmOption === 'function') {
    sbSellBfmOption(bfmIndex + 1, seats, true);
    return true;
  }

  const options = typeof sbGenerateAvailability === 'function'
    ? sbGenerateAvailability(origin, destination, date) : [];
  const option = (options || []).find(item => item.legs?.length === 1 &&
    item.legs[0].al === carrier && String(item.legs[0].fn) === flight &&
    String(item.date || date).toUpperCase() === date &&
    String(item.legs[0].dep).toUpperCase() === origin &&
    String(item.legs[0].arr).toUpperCase() === destination &&
    String(item.legs[0].cls || '').split(/\s+/).some(bucket => bucket[0] === bookingClass && Number(bucket.slice(1)) >= seats));
  if (!option) { sbWarn('NO AVAIL.'); return true; }

  sbState._availCache = [{ date, dep: origin, arr: destination, legs: option.legs }];
  cmdSell(`0${seats > 1 ? seats : ''}${bookingClass}1`, seats);
  return true;
}

function cmdSell(raw, quantity = 1, classes = null) {
  const m = raw.match(/^0(\d+)?([A-Z])(\d+)\*?$/);
  if (!m) { sbWarn('FORMAT: 0<CLASS><LINE>  e.g. 0Y1  or 01Y1'); return false; }
  const qty = m[1] ? parseInt(m[1], 10) : quantity;
  const cls = m[2];
  const lineStr = m[3];
  const idx = parseInt(lineStr, 10) - 1;

  if (!sbState._availCache || !sbState._availCache[idx]) {
    sbWarn(`NO AVAILABILITY DISPLAYED FOR LINE ${lineStr} - RUN 1DDMMMCITYCITY FIRST`);
    return false;
  }
  const opt = sbState._availCache[idx];
  const requestedClasses = opt.legs.map((leg, legIdx) =>
    (Array.isArray(classes) && classes[legIdx]) || cls);
  for (let legIdx = 0; legIdx < opt.legs.length; legIdx++) {
    const leg = opt.legs[legIdx];
    const bookingClass = requestedClasses[legIdx];
    const bucket = String(leg.cls || '').split(/\s+/)
      .find(item => item.charAt(0) === bookingClass);
    const offeredSeats = bucket ? parseInt(bucket.slice(1), 10) : 0;
    const alreadyHeld = (sbState.booked || []).reduce((total, segment) => {
      if (segment.al !== leg.al || segment.fn !== leg.fn || segment.date !== opt.date ||
          segment.cls !== bookingClass) return total;
      return total + (parseInt((segment.status || '').match(/^(?:SS|HK)(\d+)/)?.[1] || '0', 10));
    }, 0);
    const remainingSeats = Math.max(0, offeredSeats - alreadyHeld);
    if (!bucket || remainingSeats < qty) {
      sbWarn(!bucket || offeredSeats === 0
        ? `NO AVAILABILITY IN ${bookingClass} CLASS FOR LINE ${lineStr}`
        : `ONLY ${remainingSeats} SEAT(S) AVAILABLE IN ${bookingClass} CLASS FOR LINE ${lineStr}`);
      return false;
    }
  }
  const weekDays = ['', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  opt.legs.forEach((leg, legIdx) => {
    const legCls = requestedClasses[legIdx];
    const newSegment = {
      al: leg.al, fn: leg.fn, cls: legCls, date: opt.date, dep: leg.dep, arr: leg.arr,
      status: `SS${qty}`, depT: leg.depT || '----', arrT: leg.arrT || '----',
      eq: leg.eq, day: leg.day, dayOver: leg.dayOver,
      baggage: leg.baggage || sbTrainingBaggageAllowance(leg.al)
    };
    if (sbState.ticketed && Number.isInteger(sbState.reissueInsertIndex)) {
      const insertAt = Math.min(sbState.reissueInsertIndex, sbState.booked.length);
      sbState.booked.splice(insertAt, 0, newSegment);
      sbState.reissueInsertIndex = insertAt + 1;
    } else {
      sbState.booked.push(newSegment);
    }
    const s = newSegment;
    // Sabre confirms only the segment(s) from the current sell action.  It
    // does not redisplay the accumulated itinerary until ER, IR or *I.
    const day = weekDays[Number(s.day)] || '';
    const depTime = String(s.depT || '----').replace(/^(\d{2})(\d{2})$/, '$1:$2');
    const arrTime = String(s.arrT || '----').replace(/^(\d{2})(\d{2})$/, '$1:$2');
    const dayOver = s.dayOver ? ` +${s.dayOver}` : '';
    const segmentNumber = sbState.booked.indexOf(s) + 1;
    if (legIdx === 0) sbPrint('BOOKING STATUS: SEGMENTS ADDED TO PNR', 'sb-booking-status');
    sbPrint(` ${segmentNumber} ${s.al} ${s.fn} ${s.cls} ${s.date} ${day} ${s.dep} ${s.arr} ${s.status} ${depTime} ${arrTime}${dayOver}`);
  });
  return true;
}

function cmdSellARNK() {
  const lastSeg = sbState.booked[sbState.booked.length - 1];
  const dep = lastSeg ? lastSeg.arr : '----';
  sbState.booked.push({
    al: '--', fn: 'ARNK', cls: '--', date: '----', dep, arr: '----',
    status: 'HK', depT: '----', arrT: '----', eq: 'SURFACE'
  });
  sbPrint(` ${sbState.booked.length}  -- ARNK`);
  sbPrint('*');
}

function cmdChangeParty(raw) {
  const qty = raw.replace(/^[.,]+/, '').trim();
  if (!qty || !/^\d+$/.test(qty)) { sbWarn('FORMAT: ,<NUMBER>  e.g. ,3'); return; }
  if (!sbState.booked.length) { sbWarn('NO SEGMENTS IN PNR TO MODIFY PARTY SIZE'); return; }
  sbState.booked.forEach(s => {
    s.status = s.status.slice(0, 2) + qty;
  });
  sbPrint(`PARTY SIZE CHANGED TO ${qty}`);
}

/* ---------------------------------------------------------------------
   Name field — Sabre 2025 Lecture Sheet:
   • Adult:  -KHAN/ABDULLAH MR
   • Child:  -KHAN/SONIA MISS*C10   (age after *C)
   • Infant: -I/KHAN/ALI MSTR*I17  (starts with -I/, age after *I)
--------------------------------------------------------------------- */
function sbCalculateAgeFromDob(dobStr) {
  if (!dobStr) return null;
  const s = String(dobStr).trim().toUpperCase();
  const months = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };

  let birthDate = null;
  let ddmmyy = null;
  const now = new Date();

  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    birthDate = new Date(parseInt(isoMatch[1], 10), parseInt(isoMatch[2], 10) - 1, parseInt(isoMatch[3], 10));
  } else {
    ddmmyy = s.match(/^(\d{1,2})([A-Z]{3})(\d{2,4})$/);
    if (ddmmyy) {
      const d = parseInt(ddmmyy[1], 10);
      const mon = months[ddmmyy[2]];
      if (mon === undefined) return null;
      let yr = parseInt(ddmmyy[3], 10);
      if (yr < 100) {
        const cur2 = now.getFullYear() % 100;
        yr = (yr <= cur2 + 1) ? (2000 + yr) : (1900 + yr);
      }
      birthDate = new Date(yr, mon, d);
    }
  }

  if (!birthDate || isNaN(birthDate.getTime()) ||
      birthDate.getFullYear() < 1900 ||
      (isoMatch && (birthDate.getFullYear() !== Number(isoMatch[1]) ||
        birthDate.getMonth() !== Number(isoMatch[2]) - 1 ||
        birthDate.getDate() !== Number(isoMatch[3]))) ||
      (!isoMatch && ddmmyy &&
        (birthDate.getDate() !== Number(ddmmyy[1]) ||
         birthDate.getMonth() !== months[ddmmyy[2]]))) return null;
  if (birthDate > now) return null;

  let years = now.getFullYear() - birthDate.getFullYear();
  let mDiff = now.getMonth() - birthDate.getMonth();
  if (mDiff < 0 || (mDiff === 0 && now.getDate() < birthDate.getDate())) {
    years--;
  }

  let totalMonths = (now.getFullYear() - birthDate.getFullYear()) * 12 + (now.getMonth() - birthDate.getMonth());
  if (now.getDate() < birthDate.getDate()) {
    totalMonths--;
  }

  return { years, totalMonths, birthDate };
}

function sbIsFutureDob(dobStr) {
  const s = String(dobStr || '').trim().toUpperCase();
  const months = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
  const now = new Date();
  let year, month, day;
  const isoMatch = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    year = Number(isoMatch[1]);
    month = Number(isoMatch[2]) - 1;
    day = Number(isoMatch[3]);
  } else {
    const dateMatch = s.match(/^(\d{1,2})([A-Z]{3})(\d{2,4})$/);
    if (!dateMatch || months[dateMatch[2]] === undefined) return false;
    day = Number(dateMatch[1]);
    month = months[dateMatch[2]];
    year = Number(dateMatch[3]);
    if (year < 100) {
      const cur2 = now.getFullYear() % 100;
      year = year <= cur2 + 1 ? 2000 + year : 1900 + year;
    }
  }
  const date = new Date(year, month, day);
  if (isNaN(date.getTime()) || date.getFullYear() !== year || date.getMonth() !== month || date.getDate() !== day) return false;
  return date > now;
}
if (typeof window !== 'undefined') window.sbCalculateAgeFromDob = sbCalculateAgeFromDob;

function cmdName(raw) {
  let body = raw.trim();
  if (body.startsWith('-')) body = body.slice(1).trim();

  // Support chained entries: -NAME1-NAME2
  const parts = body.split(/(?=(?:^|[^-])-)/);
  const namesToAdd = parts.length > 1 ? parts.map(p => p.replace(/^-/, '').trim()) : [body];

  for (const item of namesToAdd) {
    let text = item.trim().toUpperCase();
    let isInfant = false;
    let infantHasSeat = false;
    let isChild = false;
    let age = '';
    let dob = '';

    // Infant: starts with I/ or contains *I
    if (text.startsWith('I/')) {
      isInfant = true;
      text = text.slice(2).trim();
    }
    const infantSeatAgeMatch = text.match(/\*IS(\d+)/);
    const infantAgeMatch = text.match(/\*I(\d+)/);
    const infantDobMatch = isInfant ? text.match(/\*(\d{1,2}[A-Z]{3}\d{2,4})\b/) : null;
    if ((infantAgeMatch || infantSeatAgeMatch) && infantDobMatch) {
      sbWarn('ENTER INFANT AGE OR DOB, NOT BOTH');
      return;
    }
    if (infantSeatAgeMatch) {
      isInfant = true;
      infantHasSeat = true;
      const mVal = parseInt(infantSeatAgeMatch[1], 10);
      if (mVal < 1 || mVal >= 24) {
        sbPrint('INFANT AGE DATA REQUIRED USE *IS1/*IS23 FOR INFANT WITH A SEAT');
        return;
      }
      age = String(mVal).padStart(2, '0');
      text = text.replace(/\*IS\d+/, '').trim();
    } else if (infantAgeMatch) {
      isInfant = true;
      const mVal = parseInt(infantAgeMatch[1], 10);
      if (mVal < 1 || mVal >= 24) {
        sbPrint('INFANT AGE DATA REQUIRED USE *I1/I01-*I23.NOT ENT BGNG WITH');
        return;
      }
      age = String(mVal).padStart(2, '0');
      text = text.replace(/\*I\d+/, '').trim();
    } else if (infantDobMatch) {
      isInfant = true;
      const ageInfo = sbCalculateAgeFromDob(infantDobMatch[1]);
      if (!ageInfo || ageInfo.totalMonths >= 24) {
        sbPrint('INFANT AGE DATA REQUIRED — DOB MUST INDICATE UNDER 2 YEARS');
        return;
      }
      age = String(ageInfo.totalMonths).padStart(2, '0');
      dob = infantDobMatch[1];
      text = text.replace(/\*\d{1,2}[A-Z]{3}\d{2,4}\b/, '').trim();
    }

    // Child: accepts *C<age> or CHD/<DOB>.
    const childAgeMatch = text.match(/\*C(\d+)/);
    const childDobMatch = text.match(/\bCHD\/(\d{1,2}[A-Z]{3}\d{2,4})\b/);
    if (childAgeMatch && childDobMatch) {
      sbWarn('ENTER CHILD AGE OR DOB, NOT BOTH');
      return;
    }
    if (childAgeMatch) {
      isChild = true;
      const cVal = parseInt(childAgeMatch[1], 10);
      if (cVal < 2 || cVal >= 12) {
        sbPrint('VERIFY AGE - CHILD MUST BE 02-11 YEARS');
        return;
      }
      age = String(cVal).padStart(2, '0');
      text = text.replace(/\*C\d+/, '').trim();
    } else if (childDobMatch) {
      isChild = true;
      const ageInfo = sbCalculateAgeFromDob(childDobMatch[1]);
      if (!ageInfo || ageInfo.years < 2 || ageInfo.years >= 12) {
        sbPrint('VERIFY AGE - CHILD DOB MUST INDICATE 02-11 YEARS');
        return;
      }
      age = String(ageInfo.years).padStart(2, '0');
      dob = childDobMatch[1];
      text = text.replace(/\s*CHD\/\d{1,2}[A-Z]{3}\d{2,4}\b/, '').trim();
    } else if (/\*C\b|\bCHD\b|\bCNN\b/.test(text)) {
      isChild = true;
      text = text.replace(/\*C\b|\bCHD\b|\bCNN\b/, '').trim();
    }

    if (isInfant && isChild) {
      sbWarn('PASSENGER CANNOT BE BOTH CHILD AND INFANT');
      return;
    }
    if ((isInfant || isChild) && !age) {
      sbWarn(isInfant
        ? 'INFANT AGE OR DOB REQUIRED — USE *I01-*I23 OR *DDMMMYY'
        : 'CHILD AGE OR DOB REQUIRED — USE *C02-*C11 OR CHD/DDMMMYY');
      return;
    }

    text = text.replace(/[\s/]+$/, '');

    const nm = text.match(/^([A-Z' -]+)\/([A-Z' ]+?)(?:\s+(MR|MRS|MS|MSTR|MISS|DR|INF|CNN))?$/);
    if (!nm) {
      sbWarn('FORMAT: -SURNAME/FIRSTNAME MR  |  -SURNAME/CHILD MISS*C10  |  -I/SURNAME/INFANT MSTR*I17');
      return;
    }

    const surname = nm[1].trim();
    const first = nm[2].trim();
    const paxType = isInfant ? 'INF' : (isChild ? 'CHD' : 'ADT');
    const title = (nm[3] || (paxType === 'INF' ? 'MSTR' : paxType === 'CHD' ? 'MISS' : 'MR')).toUpperCase();
    const rawDisplay = isInfant ? `I/${surname}/${first} ${title}*${infantHasSeat ? 'IS' : 'I'}${age}` :
                       isChild ? `${surname}/${first} ${title}*C${age}` :
                       `${surname}/${first} ${title}`;

    sbState.names.push({
      raw: rawDisplay,
      surname,
      first,
      title,
      paxType,
      infantHasSeat,
      age,
      dob
    });
  }
  sbPrint('*');
}

function sbPaxMultiplier(pax) { return pax?.paxType === 'INF' ? (pax.infantHasSeat ? 0.75 : 0.10) : pax?.paxType === 'CHD' ? 0.75 : 1; }
function sbPaxLabel(pax) { return pax?.paxType || 'ADT'; }
function sbBuildFareQuote(fare) {
  const passengers = sbState.names.length ? sbState.names : [{ paxType: 'ADT' }];
  const usdMultiplier = passengers.reduce((sum, pax) => sum + sbPaxMultiplier(pax), 0);
  const breakdown = passengers.map((pax, index) => {
    const multiplier = sbPaxMultiplier(pax);
    const base = Math.round(fare.baseBdt * multiplier);
    const tax = Math.round(fare.tax * multiplier);
    return { index: index + 1, type: sbPaxLabel(pax), base, tax, total: base + tax };
  });
  return { base: breakdown.reduce((sum, item) => sum + item.base, 0), tax: breakdown.reduce((sum, item) => sum + item.tax, 0), total: breakdown.reduce((sum, item) => sum + item.total, 0), currency: 'BDT', pax: passengers.length, breakdown, baseUsd: Number.isFinite(fare.baseUsd) ? Number((fare.baseUsd * usdMultiplier).toFixed(2)) : null, rate: fare.rate || null };
}

/* ---------------------------------------------------------------------
   Mandatory PNR Fields:
   • 9<PHONE>      — Phone field
   • 6<NAME>       — Received from field (e.g. 6P)
   • 7TAW/ or 7T-  — Ticketing arrangement
--------------------------------------------------------------------- */
function cmdPhone(raw) {
  const body = raw.replace(/^9\s*/, '').trim();
  if (!body) { sbWarn('FORMAT: 9 <PHONE/AGENCY/CONTACT DETAILS>'); return; }
  sbState.phones.push({ raw: body.toUpperCase() });
  sbPrint('*');
}

function cmdReceivedFrom(raw) {
  const body = raw.replace(/^6\s*/, '').trim();
  if (!body) { sbWarn('FORMAT: 6<AGENT/PASSENGER NAME>  e.g. 6P'); return; }

  // Verify child/infant age validity
  for (const p of (sbState.names || [])) {
    if (p.paxType === 'CHD' && p.age) {
      const c = parseInt(p.age, 10);
      if (c < 2 || c >= 12) {
        sbPrint('VERIFY AGE - CHILD MUST BE 02-11 YEARS');
        return;
      }
    }
    if (p.paxType === 'INF' && p.age) {
      const m = parseInt(p.age, 10);
      if (m < (p.dob ? 0 : 1) || m >= 24) {
        sbPrint('INFANT AGE DATA REQUIRED USE *I1/I01-*I23.NOT ENT BGNG WITH');
        return;
      }
    }
  }

  sbState.receivedFrom = body.toUpperCase();
  sbState.receivedFromRequired = false;
  sbPrint('*');
}

function cmdTicketingArrangement(raw) {
  const body = raw.replace(/^7\s*/, '').trim();
  if (!body) { sbWarn('FORMAT: 7TAW/  or  7TAW/20DEC  or  7T-'); return; }
  sbState.ticketingArrangement = body.toUpperCase();
  sbPrint('*');
}

/* ---------------------------------------------------------------------
   OSI & SSR Entries — Sabre 2025 Lecture Sheet:
   • 3CTCM/8801731808182-1           → Mobile for Pax 1
   • 3CTCE/email//gmail.com-1        → Email
   • 3AVML2-1                        → AVML for Pax 1 on seg 2
   • 3CHLD/02FEB20-2.1               → Child SSR message
   • 3INFT/ KHAN/ALI MSTR/01JAN24-1.1→ Infant SSR message
   • 3OSI SV CTCM 966552576776       → OSI message
   • 32.XX                           → Delete document/SSR line 2
--------------------------------------------------------------------- */
function sbParsePaxAssociations(text) {
  const m = text.match(/-((?:\d+(?:\.\d+)?)(?:[,\-](?:\d+(?:\.\d+)?))*)$/);
  if (!m) return null;
  const listStr = m[1];
  const refs = new Set();

  if (listStr.includes('-') && !listStr.includes(',')) {
    const parts = listStr.split('-');
    const start = parseInt(parts[0], 10);
    const end = parseInt(parts[1], 10);
    if (!isNaN(start) && !isNaN(end)) {
      for (let i = start; i <= end; i++) refs.add(i);
    }
  } else if (listStr.includes(',')) {
    const parts = listStr.split(',');
    parts.forEach(p => {
      const num = parseInt(p.trim(), 10);
      if (!isNaN(num)) refs.add(num);
    });
  } else {
    const dotMatch = listStr.match(/^(\d+)(?:\.(\d+))?$/);
    if (dotMatch) {
      const itemNum = parseInt(dotMatch[1], 10);
      const subNum = dotMatch[2] ? parseInt(dotMatch[2], 10) : 1;
      if (itemNum === 1 && subNum > 1 && sbState.names && sbState.names.length >= subNum) {
        refs.add(subNum);
      } else {
        refs.add(itemNum);
      }
    }
  }
  const result = Array.from(refs);
  return result.length ? result : null;
}

function sbPaxRefFromAssociation(text) {
  const parsed = sbParsePaxAssociations(text);
  if (parsed && parsed.length) return parsed[0];
  const association = text.match(/-(\d+)(?:\.(\d+))?$/);
  if (association) {
    const itemNum = Number(association[1]);
    const subNum = association[2] ? Number(association[2]) : 1;
    if (itemNum === 1 && subNum > 1 && sbState.names && sbState.names.length >= subNum) return subNum;
    return itemNum;
  }
  return null;
}

function sbSeatedPaxByRef(paxRef) {
  return (sbState.names || []).filter(pax => pax.paxType !== 'INF')[Number(paxRef) - 1] || null;
}

function sbPnrRefForPax(pax) {
  if (pax?.paxType === 'INF') return Number(pax.associatedAdultRef) || 1;
  return (sbState.names || []).filter(name => name.paxType !== 'INF').indexOf(pax) + 1;
}

function cmdSSR(raw) {
  const upper = raw.trim().toUpperCase();

  // Document/SSR line delete: 32.XX or 31.XX
  const delMatch = upper.match(/^3(\d+)\.XX$/);
  if (delMatch) {
    const idx = parseInt(delMatch[1], 10) - 1;
    if (sbState.documents && sbState.documents[idx]) {
      sbState.documents.splice(idx, 1);
      sbPrint('*');
      return;
    }
    if (sbState.ssrEntries && sbState.ssrEntries[idx]) {
      sbState.ssrEntries.splice(idx, 1);
      sbPrint('*');
      return;
    }
    sbPrint('*');
    return;
  }

  const body = upper.replace(/^3/, '').trim();
  if (!body) { sbWarn('FORMAT: 3<SSRCODE>/...  e.g. 3CTCM/8801731808182-1.1'); return; }

  // OSI: 3OSI ...
  if (body.startsWith('OSI ')) {
    const carrier = sbState.booked[0]?.al || '1B';
    sbState.ssrEntries.push({ text: `OSI ${body.replace(/^OSI\s+/, '')}`, paxRef: 1 });
    sbPrint('*');
    return;
  }

  // Contact fields: associated entries use -1.1; a general PNR contact may omit it.
  // Amadeus-style /P1 suffixes remain invalid in a Sabre entry.
  if (/^CTC[MER]/i.test(body)) {
    const codeMatch = body.match(/^(CTC[MER])/i);
    const ssrCode = codeMatch[1].toUpperCase();

    const assocList = sbParsePaxAssociations(body);
    if (/\/P\d+$/i.test(body)) {
      sbPrint(`.NAME ASSOCIATION NUMBER IS REQUIRED.NOT ENT BGNG WITH \n${upper}`);
      return;
    }

    const totalPax = (sbState.names || []).length;
    const invalidRef = (assocList || []).find(ref => ref < 1 || ref > totalPax);
    if (invalidRef) {
      sbPrint(`.NO NAMES MATCH NUMBER ENTERED.NOT ENT BGNG WITH \n${upper}`);
      return;
    }

    const carrier = sbState.privateFare?.carrier || sbState.booked[0]?.al || 'SQ';
    const contactData = body
      .replace(/^CTC[MER]\/?/i, '')
      .replace(/-((?:\d+(?:\.\d+)?)(?:[,\-](?:\d+(?:\.\d+)?))*)$/, '')
      .trim();

    (assocList || [null]).forEach(paxRef => {
      let ssrLine = '';
      if (ssrCode === 'CTCM') {
        ssrLine = `SSR CTCM ${carrier} HK1/${contactData}${paxRef ? `-${paxRef}.1` : ''}`;
      } else if (ssrCode === 'CTCE') {
        ssrLine = `SSR CTCE ${carrier} HK1/${contactData}${paxRef ? `-${paxRef}.1` : ''}`;
      } else {
        ssrLine = `SSR CTCR ${carrier} HK1/${contactData || 'REFUSED'}${paxRef ? `-${paxRef}.1` : ''}`;
      }
      sbState.ssrEntries.push({
        text: ssrLine,
        code: ssrCode,
        carrier,
        body: contactData,
        paxRef
      });
    });

    sbPrint('*');
    return;
  }

  // DOCO travel-document SSR (for example, a visa entry).
  if (body.startsWith('DOCO/')) {
    const parsedRefs = sbParsePaxAssociations(body);
    if (!parsedRefs) {
      sbPrint(`.NAME ASSOCIATION NUMBER IS REQUIRED.NOT ENT BGNG WITH \n${upper}`);
      return;
    }
    const paxRef = parsedRefs[0];
    const pax = sbSeatedPaxByRef(paxRef);
    const rawBody = body.replace(/-((?:\d+(?:\.\d+)?)(?:[,-](?:\d+(?:\.\d+)?))*)$/, '');
    const fields = rawBody.slice(5).split('/');
    if (!pax) {
      sbPrint(`.NO NAMES MATCH NUMBER ENTERED.NOT ENT BGNG WITH \n${upper}`);
      return;
    }
    if (fields.length < 8 || !fields[0] || !fields[1] || !fields[2]) {
      sbWarn('INVALID DOCO - ENTER ISSUING COUNTRY, DOCUMENT TYPE, AND DOCUMENT NUMBER');
      return;
    }
    const carrier = sbState.privateFare?.carrier || sbState.booked[0]?.al || '1B';
    sbState.documents.push({ raw: rawBody, carrier, paxRef, subjectPaxRef: paxRef, code: 'DOCO' });
    sbPrint('*');
    return;
  }

  // Documents: 3DOCS/...
  if (body.startsWith('DOCS/')) {
    const carrier = sbState.privateFare?.carrier || sbState.booked[0]?.al || 'MH';
    const parsedRefs = sbParsePaxAssociations(body);
    if (!parsedRefs) {
      sbPrint(`.NAME ASSOCIATION NUMBER IS REQUIRED.NOT ENT BGNG WITH \n${upper}`);
      return;
    }
    const paxRef = parsedRefs[0];
    const pax = sbSeatedPaxByRef(paxRef);
    const docBody = body.replace(/-((?:\d+(?:\.\d+)?)(?:[,\-](?:\d+(?:\.\d+)?))*)$/, '').replace(/\/P\d+$/i, '');
    const docFields = docBody.split('/');
    const passportNumber = (docFields[3] || '').trim().toUpperCase();
    const dob = docFields[5] || '';
    const ageInfo = sbCalculateAgeFromDob(dob);
    if (!pax) {
      sbPrint(`.NO NAMES MATCH NUMBER ENTERED.NOT ENT BGNG WITH \n${upper}`);
      return;
    }
    if (sbIsFutureDob(dob)) {
      sbWarn('INVALID DOCS — FUTURE DOB IS NOT ALLOWED');
      return;
    }
    if (!passportNumber || !ageInfo) {
      sbWarn('INVALID DOCS — PASSPORT NUMBER AND VALID DOB ARE REQUIRED');
      return;
    }
    if (sbState.documents.some(doc =>
      (doc.passportNumber || doc.raw?.replace(/-((?:\d+(?:\.\d+)?)(?:[,\-](?:\d+(?:\.\d+)?))*)$/, '').split('/')[3] || '')
        .trim().toUpperCase() === passportNumber)) {
      sbWarn('PASSPORT NUMBER ALREADY EXISTS — DOCS NOT ADDED');
      return;
    }
    const docsSurname = (docFields[8] || '').trim().replace(/\s+/g, ' ').toUpperCase();
    const docsGiven = (docFields[9] || '').trim()
      .replace(/\s+(?:MR|MRS|MS|MSTR|MISS|DR)$/i, '').replace(/\s+/g, ' ').toUpperCase();
    const nameMatches = sbState.names.filter(name =>
      (name.surname || '').toUpperCase() === docsSurname && (name.first || '').toUpperCase() === docsGiven);
    if (nameMatches.length > 1) {
      sbWarn('DOCS PASSENGER NAME IS AMBIGUOUS — VERIFY THE NAME');
      return;
    }
    const documentPax = nameMatches[0] || pax;
    if (nameMatches.length === 1 && documentPax !== pax && documentPax.paxType !== 'INF') {
      sbWarn(`DOCS PASSENGER NAME DOES NOT MATCH PAX ${paxRef}`);
      return;
    }
    if (documentPax.paxType === 'INF' &&
        (!pax || pax.paxType !== 'ADT' ||
         (documentPax.associatedAdultRef && documentPax.associatedAdultRef !== paxRef))) {
      sbWarn('INFANT DOCS MUST BE ASSOCIATED WITH THE ASSIGNED ADULT');
      return;
    }
    const ageMatchesType = documentPax.paxType === 'INF'
      ? ageInfo.totalMonths < 24
      : documentPax.paxType === 'CHD'
        ? ageInfo.years >= 2 && ageInfo.years < 12
        : ageInfo.years >= 12;
    if (!ageMatchesType) {
      sbWarn(`DOCS DOB DOES NOT MATCH PAX ${paxRef} TYPE OR AGE`);
      return;
    }
    const subjectPaxRef = sbState.names.indexOf(documentPax) + 1;
    if (documentPax.paxType === 'INF') {
      documentPax.associatedAdultRef = paxRef;
    } else if (!documentPax.dob) {
      documentPax.dob = dob;
      documentPax.age = documentPax.paxType === 'CHD'
        ? String(ageInfo.years).padStart(2, '0')
        : String(ageInfo.years);
    }
    sbState.documents.push({ raw: body, carrier, paxRef, subjectPaxRef, passportNumber, dob });
    sbPrint('*');
    return;
  }

  const paxRef = sbPaxRefFromAssociation(body) || 1;
  const carrier = sbState.privateFare?.carrier || sbState.booked[0]?.al || '1B';

  // Age verification on 3CHLD and 3INFT manual SSR entry
  if (/^CHLD\//i.test(body)) {
    const chldDobMatch = body.match(/^CHLD\/(\d{1,2}[A-Z]{3}\d{2})/i);
    if (chldDobMatch) {
      const aInfo = sbCalculateAgeFromDob(chldDobMatch[1]);
      if (aInfo && (aInfo.years < 2 || aInfo.years >= 12)) {
        sbPrint('VERIFY AGE - CHILD MUST BE 02-11 YEARS');
        return;
      }
    }
  }
  if (/^INFT/i.test(body)) {
    const inftDobMatch = body.match(/(\d{1,2}[A-Z]{3}\d{2})/i);
    if (inftDobMatch) {
      const aInfo = sbCalculateAgeFromDob(inftDobMatch[1]);
      if (aInfo && (aInfo.totalMonths >= 24 || aInfo.years >= 2)) {
        sbPrint('INFANT AGE DATA REQUIRED USE *I1/I01-*I23.NOT ENT BGNG WITH');
        return;
      }
    }
    const infantFields = body.replace(/^INFT\d*\//i, '').split('/');
    const infantGiven = (infantFields[1] || '').replace(/\s+(?:MR|MRS|MS|MSTR|MISS|DR)$/i, '');
    const infant = sbState.names.find(pax => pax.paxType === 'INF' &&
      `${pax.surname}/${pax.first}`.replace(/\s+/g, ' ').toUpperCase() ===
      `${infantFields[0] || ''}/${infantGiven}`.replace(/\s+/g, ' ').toUpperCase());
    if (infant) {
      const adult = sbSeatedPaxByRef(paxRef);
      if (!adult || adult.paxType !== 'ADT' ||
          (infant.associatedAdultRef && infant.associatedAdultRef !== paxRef)) {
        sbWarn('INFANT SSR MUST LINK TO THE ASSIGNED ADULT');
        return;
      }
      infant.associatedAdultRef = paxRef;
    }
  }

  sbState.ssrEntries.push({ text: `SSR ${body}`, paxRef });
  if (/^CHLD\/|^INFT/i.test(body)) {
    sbPrint(upper);
  }
  sbPrint('*');
}

/* ---------------------------------------------------------------------
   Modify Booking — Sabre 2025 Lecture Sheet:
   • WCAJ          → Change all segments to J class
   • WC1-2J/3-4Y   → Segment class changes
   • WC1HK         → Change status code
   • X1¤0025DEC    → Rebook segment 1 to 25DEC
--------------------------------------------------------------------- */
function cmdChangeStatus(raw) {
  const upper = raw.trim().toUpperCase();

  // WCAJ -> Change all segments to class J
  const wcaMatch = upper.match(/^WCA([A-Z])$/);
  if (wcaMatch) {
    const cls = wcaMatch[1];
    if (!sbState.booked.length) { sbWarn('NO BOOKED SEGMENTS IN PNR'); return; }
    sbState.booked.forEach(s => s.cls = cls);
    sbPrint(`ALL SEGMENTS CHANGED TO ${cls} CLASS`);
    return;
  }

  // Segment class changes: WC1-2J/3-4Y or WC1J
  const classChangeMatch = upper.match(/^WC(\d+(?:-\d+)?)([A-Z])(?:\/(\d+(?:-\d+)?)([A-Z]))?$/);
  if (classChangeMatch && !['HK','SS','HL','UC','WL','GK','SA','PN','NO'].includes(upper.slice(-2))) {
    const applyChunk = (rangeStr, cls) => {
      if (!rangeStr) return;
      const parts = rangeStr.split('-').map(Number);
      const start = parts[0] - 1;
      const end = parts.length > 1 ? parts[1] - 1 : start;
      for (let i = start; i <= end && i < sbState.booked.length; i++) {
        sbState.booked[i].cls = cls;
      }
    };
    applyChunk(classChangeMatch[1], classChangeMatch[2]);
    applyChunk(classChangeMatch[3], classChangeMatch[4]);
    sbPrint('SEGMENT CLASS CHANGE PROCESSED');
    return;
  }

  // Status code change: WC1HK
  const m = upper.match(/^WC(\d+)([A-Z]{2})$/);
  if (!m) { sbWarn('FORMAT: WCA<CLASS>  |  WC<SEG><CLASS>  |  WC<N><STATUS>'); return; }
  const idx = parseInt(m[1], 10) - 1;
  const newStatus = m[2];
  const validStatuses = ['HK','SS','HL','UC','WL','GK','SA','PN','NO'];
  if (!validStatuses.includes(newStatus)) {
    sbWarn(`INVALID STATUS ${newStatus} — VALID: ${validStatuses.join(' ')}`);
    return;
  }
  if (!sbState.booked.length || idx < 0 || idx >= sbState.booked.length) {
    sbWarn(`SEGMENT ${m[1]} NOT FOUND`);
    return;
  }
  const seg = sbState.booked[idx];
  seg.status = newStatus + '1';
  sbPrint(`SEGMENT ${m[1]} STATUS CHANGED TO ${newStatus}`);
  sbPrint(`${seg.al}${seg.fn} ${seg.date} ${seg.dep}${seg.arr} ${seg.status}`);
}

function cmdRebookSegment(raw) {
  // Sabre keyboards may enter the date-change separator as ¤, *, or ¥.
  // Accept each form as one command rather than treating ¥ as a command chain.
  const m = raw.trim().toUpperCase().match(/^X(\d+)(?:[\u00A4*\u00A5]|\u00C2\u00A5)0*(\d{2}[A-Z]{3})$/);
  if (m) {
    const idx = parseInt(m[1], 10) - 1;
    const newDate = m[2];
    if (!sbState.booked[idx]) { sbWarn(`SEGMENT ${m[1]} NOT FOUND`); return; }
    sbState.booked[idx].date = newDate;
    if (sbState.ticketed) sbState.reissueNeedsPricing = true;
    // A date change is a PNR modification. Require a fresh Received From
    // entry and ER before a ticket exchange can proceed.
    sbState.receivedFromRequired = true;
    sbState.ended = false;
    sbPrint(`SEGMENT ${m[1]} REBOOKED TO ${newDate}`);
    sbPrint(`${sbState.booked[idx].al}${sbState.booked[idx].fn} ${newDate} ${sbState.booked[idx].dep}${sbState.booked[idx].arr}`);
    return;
  }
  sbWarn('FORMAT: X<SEG>¤00<DATE>  e.g. X1¤0025DEC');
}

/* ---------------------------------------------------------------------
   Cancel Booking — Sabre 2025 Lecture Sheet:
   • XI    → Cancel all flights
   • X1-2  → Cancel segments 1 & 2
   • X1    → Cancel segment 1
--------------------------------------------------------------------- */
function cmdCancelFlights(raw) {
  const upper = raw.trim().toUpperCase();
  if (upper === 'XI') {
    if (!sbState.booked.length) { sbWarn('NO SEGMENTS TO CANCEL'); return; }
    sbState.booked = [];
    // Keep the existing price quote until PQD-ALL.  This is required by the
    // Sabre exchange sequence: after XI / 6R / ER the PNR still shows the
    // autopriced PQ, which the trainee explicitly deletes before WFRF.
    if (sbState.ticketed) {
      sbState.reissueNeedsPricing = true;
      sbState.reissueInsertIndex = 0;
    }
    sbState.receivedFromRequired = true;
    sbPrint('SUCCESS', 'sb-command-success');
    sbState.ended = false;
    sbSyncSidePanel();
    return;
  }

  // Range cancel: X1-2
  const rangeMatch = upper.match(/^X(\d+)-(\d+)$/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1], 10) - 1;
    const end = parseInt(rangeMatch[2], 10) - 1;
    if (start < 0 || end >= sbState.booked.length || start > end) {
      sbWarn(`INVALID SEGMENT RANGE ${rangeMatch[1]}-${rangeMatch[2]}`);
      return;
    }
    const count = end - start + 1;
    sbState.booked.splice(start, count);
    if (sbState.ticketed) {
      sbState.reissueNeedsPricing = true;
      sbState.reissueInsertIndex = start;
    }
    sbState.receivedFromRequired = true;
    sbPrint('SUCCESS', 'sb-command-success');
    sbState.ended = false;
    sbSyncSidePanel();
    return;
  }

  // Single cancel: X1, XE1, XK1
  const singleMatch = upper.match(/^X[EK]?(\d+)$/);
  if (singleMatch) {
    const idx = parseInt(singleMatch[1], 10) - 1;
    if (!sbState.booked[idx]) { sbWarn(`SEGMENT ${singleMatch[1]} NOT FOUND`); return; }
    sbState.booked.splice(idx, 1);
    if (sbState.ticketed) {
      sbState.reissueNeedsPricing = true;
      sbState.reissueInsertIndex = idx;
    }
    sbState.receivedFromRequired = true;
    sbPrint('SUCCESS', 'sb-command-success');
    sbState.ended = false;
    sbSyncSidePanel();
    return;
  }
}

/* ---------------------------------------------------------------------
   Remarks — Sabre 2025 Lecture Sheet:
   • Add:     5PSGR ADV FARE SAR 1500
   • History: 5HPSGR ...
   • Delete:  *P5 then 51¤
--------------------------------------------------------------------- */
function cmdRemarks(raw) {
  const upper = raw.trim().toUpperCase();

  // Delete remark: 51¤ or 51/
  const delMatch = upper.match(/^5(\d+)[¤*\/]$/);
  if (delMatch) {
    const idx = parseInt(delMatch[1], 10) - 1;
    if (sbState.remarks && sbState.remarks[idx]) {
      sbState.remarks.splice(idx, 1);
      sbPrint('*');
      return;
    }
    sbWarn(`REMARK ${delMatch[1]} NOT FOUND`);
    return;
  }

  const body = raw.replace(/^5(?:C\/|H)?\s*/i, '').trim();
  if (!body) { sbWarn('FORMAT: 5<REMARK TEXT>  e.g. 5PSGR ADV FARE SAR 1500'); return; }
  if (!sbState.remarks) sbState.remarks = [];
  sbState.remarks.push(body.toUpperCase());
  sbPrint('*');
}

function cmdDisplayRemarks() {
  if (!sbState.remarks || !sbState.remarks.length) { sbWarn('NO REMARKS IN PNR'); return; }
  sbPrint('GENERAL REMARKS');
  sbState.remarks.forEach((r, i) => sbPrint(` ${i + 1}.${r}`));
}

/* ---------------------------------------------------------------------
   Frequent Flyer — Sabre 2025 Lecture Sheet:
   • Add:    FFGF123456-1
   • Delete: *FF then FF1¤
--------------------------------------------------------------------- */
function cmdFF(raw) {
  const upper = raw.trim().toUpperCase();

  // Delete: FF1¤
  const delMatch = upper.match(/^FF(\d+)[¤*]$/);
  if (delMatch) {
    const idx = parseInt(delMatch[1], 10) - 1;
    if (sbState.frequentFlyers && sbState.frequentFlyers[idx]) {
      sbState.frequentFlyers.splice(idx, 1);
      sbPrint('*');
      return;
    }
    sbWarn(`FREQUENT FLYER ${delMatch[1]} NOT FOUND`);
    return;
  }

  const m = upper.match(/^FF([A-Z0-9]{2})([A-Z0-9]+)(?:-([0-9.]+))?$/);
  if (!m) { sbWarn('FORMAT: FF<CARRIER><NUMBER>-<PAX>  e.g. FFGF123456-1'); return; }
  if (!sbState.frequentFlyers) sbState.frequentFlyers = [];
  sbState.frequentFlyers.push({
    carrier: m[1],
    number: m[2],
    paxRef: m[3] || '1',
    raw: upper
  });
  sbPrint('*');
}

function cmdDisplayFF() {
  if (!sbState.frequentFlyers || !sbState.frequentFlyers.length) {
    sbWarn('NO FREQUENT FLYER DATA IN PNR');
    return;
  }
  sbPrint('FREQUENT FLYER DATA:');
  sbState.frequentFlyers.forEach((ff, i) => {
    sbPrint(` ${i + 1}.FF ${ff.carrier} ${ff.number}-1.${ff.paxRef}`);
  });
}

/* ---------------------------------------------------------------------
   Email — Sabre 2025 Lecture Sheet:
   • Add:    PE¥email@gmail.com¥-1
   • Delete: *PE then PE1¤
--------------------------------------------------------------------- */
function cmdEmail(raw) {
  const upper = raw.trim().toUpperCase();

  // Delete: PE1¤
  const delMatch = upper.match(/^PE(\d+)[¤*]$/);
  if (delMatch) {
    const idx = parseInt(delMatch[1], 10) - 1;
    if (sbState.emails && sbState.emails[idx]) {
      sbState.emails.splice(idx, 1);
      sbPrint('*');
      return;
    }
    sbWarn(`EMAIL ${delMatch[1]} NOT FOUND`);
    return;
  }

  const emailMatch = raw.match(/^PE[¥☨‡§*]([^\s¥☨‡§*]+)(?:[¥☨‡§*]-?(\d+))?/i);
  if (!emailMatch) { sbWarn('FORMAT: PE¥<EMAIL>¥-1  e.g. PE¥email@gmail.com¥-1'); return; }
  if (!sbState.emails) sbState.emails = [];
  sbState.emails.push({
    email: emailMatch[1].trim(),
    paxRef: emailMatch[2] || '1',
    raw: raw.trim()
  });
  sbPrint('*');
}

function cmdDisplayEmail() {
  if (!sbState.emails || !sbState.emails.length) {
    sbWarn('NO PASSENGER EMAIL DATA IN PNR');
    return;
  }
  sbPrint('PASSENGER EMAIL ADDRESSES:');
  sbState.emails.forEach((em, i) => {
    sbPrint(` ${i + 1}.PE ${em.email} - 1.${em.paxRef}`);
  });
}

/* ---------------------------------------------------------------------
   Split PNR — Sabre 2025 Lecture Sheet:
   • D2       → Divide PAX 2
   • 6P, then F, then ER
--------------------------------------------------------------------- */
function cmdDivide(raw) {
  const m = raw.trim().toUpperCase().match(/^D(\d+)$/);
  if (!m) { sbWarn('FORMAT: D<PAX NUMBER>  e.g. D2'); return; }
  const paxNum = parseInt(m[1], 10);
  if (!sbState.names.length || paxNum < 1 || paxNum > sbState.names.length) {
    sbWarn(`PAX ${paxNum} NOT FOUND IN PNR`);
    return;
  }
  sbState.splitPax = paxNum;
  sbPrint(`DIVIDE IN PROGRESS - PASSENGER ${paxNum} DIVIDED`);
  sbPrint('ENTER 6<NAME>, THEN F TO FILE, THEN ER');
}

function cmdFileSplit() {
  if (!sbState.splitPax) { sbWarn('NO SPLIT IN PROGRESS - ENTER D<PAX> FIRST'); return; }
  const newLocator = sbRandomLocator();
  const dividedName = sbState.names[sbState.splitPax - 1];
  sbPrint('SPLIT RECORD FILED');
  sbPrint(`NEW RECORD LOCATOR: ${newLocator}`);
  sbPrint(`PASSENGER: ${dividedName?.raw || 'PAX'}`);
  sbState.splitPax = null;
}

/* ---------------------------------------------------------------------
   Clone PNR — Sabre 2025 Lecture Sheet:
   • IC   → Clone itinerary
   • ICX1 → Clone except segment 1
--------------------------------------------------------------------- */
function cmdClone(raw) {
  const upper = raw.trim().toUpperCase();
  if (!sbState.booked.length) { sbWarn('NO ITINERARY IN CURRENT PNR TO CLONE'); return; }
  const exceptMatch = upper.match(/^ICX(\d+)$/);
  const exceptIdx = exceptMatch ? parseInt(exceptMatch[1], 10) - 1 : -1;
  const cloned = sbState.booked
    .filter((_, i) => i !== exceptIdx)
    .map(s => ({ ...s, status: 'SS1' }));

  sbState.locator = null;
  sbState.names = [];
  sbState.ticketed = false;
  sbState.invoiced = false;
  sbState.eticketNumber = null;
  sbState.ticketNumbers = [];
  sbState.fareQuote = null;
  sbState.ended = false;
  sbState.booked = cloned;

  sbPrint(exceptIdx >= 0 ? `ITINERARY CLONED EXCEPT SEGMENT ${exceptMatch[1]}` : 'ITINERARY CLONED TO WORK AREA');
  sbPrint(sbRenderPNR());
  sbPrintTicketReceiptButton(sbState.eticketNumber);
  sbSyncSidePanel();
}

/* ---------------------------------------------------------------------
   Fare Quote — Sabre 2025 Lecture Sheet:
   • FQJEDKHI24JAN-SV → Basic fare
--------------------------------------------------------------------- */
function cmdFareQuote(raw) {
  const upper = raw.trim().toUpperCase();
  const m = upper.match(/^FQ([A-Z]{3})([A-Z]{3})(\d{2}[A-Z]{3})?(?:-([A-Z0-9]{2}))?$/);
  if (!m) { sbWarn('FORMAT: FQ<ORG><DST><DATE>-<CARRIER>  e.g. FQJEDKHI24JAN-SV'); return; }
  const [, org, dst, date, al] = m;
  const carrier = al || 'SV';
  const queryDate = date || '24JAN';
  sbPrint(`FQ${org}${dst}${queryDate}-${carrier}`);
  sbPrint(`${queryDate}  ${org}-${dst}  ${carrier}`);
  sbPrint('LN FARE BASIS   OW/RT  CURR   FARE      EFF    EXP    R');
  sbPrint('01 YIFSA        OW     SAR    1250.00   ----   ----   R');
  sbPrint('02 YRT          RT     SAR    2100.00   ----   ----   R');
  sbPrint('03 JIFSA        OW     SAR    2800.00   ----   ----   R');
  sbPrint('04 JRT          RT     SAR    4900.00   ----   ----   R');
  sbPrint('05 FIFSA        OW     SAR    3900.00   ----   ----   R');
}

/* ---------------------------------------------------------------------
   Pricing PNR & Issue Ticket — Sabre 2025 Lecture Sheet:
   • WPABG or WP          → Price PNR
   • WPNCB                → Book Best Price
   • PQ, then ER          → Save fare
   • W¥PQ1¥AEY¥FCA¥KP0    → Issue ticket for PQ1
   • WV2                  → Void ticket on line 2
   • WV*                  → Void report
   • DQB*                 → Today's sales
   • DQB*17JAN            → Sales on specific date
--------------------------------------------------------------------- */
function cmdPriceQuote() {
  const carrier = (sbState.booked.length > 0 && sbState.booked[0].al) || 'MH';
  cmdWpa('WPA' + carrier);
}

function sbFindAirline(query) {
  const q = query.trim().toUpperCase();
  if (SB_AIRLINES[q]) return { code: q, ...SB_AIRLINES[q] };
  for (const [code, al] of Object.entries(SB_AIRLINES)) {
    if (al.name.toUpperCase().includes(q)) return { code, ...al };
  }
  return null;
}

function sbGetFareForCarrier(carrierCode) {
  const carrier = (carrierCode || 'MH').toUpperCase();
  const cInfo = SB_AIRLINES[carrier];
  const cName = cInfo ? cInfo.name : 'MALAYSIA AIRLINES';
  const fares = {
    MH: { baseUsd: 310.00, rate: 122.25, baseBdt: 37898, tax: 6994, total: 44892, fareBasis: 'QLW1YM4' },
    BG: { baseUsd: 280.00, rate: 122.25, baseBdt: 34230, tax: 6500, total: 40730, fareBasis: 'YEE1M' },
    BS: { baseUsd: 270.00, rate: 122.25, baseBdt: 33008, tax: 6200, total: 39208, fareBasis: 'WEE1M' },
    TG: { baseUsd: 350.00, rate: 122.25, baseBdt: 42788, tax: 7800, total: 50588, fareBasis: 'VEE3M' },
    SQ: { baseUsd: 420.00, rate: 122.25, baseBdt: 51345, tax: 8900, total: 60245, fareBasis: 'KEE6M' },
    EK: { baseUsd: 460.00, rate: 122.25, baseBdt: 56235, tax: 9200, total: 65435, fareBasis: 'TEE3M' },
    QR: { baseUsd: 450.00, rate: 122.25, baseBdt: 55013, tax: 9100, total: 64113, fareBasis: 'OEE3M' },
    EY: { baseUsd: 440.00, rate: 122.25, baseBdt: 53790, tax: 8900, total: 62690, fareBasis: 'VEE3M' },
    SV: { baseUsd: 430.00, rate: 122.25, baseBdt: 52568, tax: 8500, total: 61068, fareBasis: 'QEE3M' },
    GF: { baseUsd: 400.00, rate: 122.25, baseBdt: 48900, tax: 8200, total: 57100, fareBasis: 'GEE3M' },
    KU: { baseUsd: 390.00, rate: 122.25, baseBdt: 47678, tax: 8100, total: 55778, fareBasis: 'VEE3M' },
    AI: { baseUsd: 290.00, rate: 122.25, baseBdt: 35453, tax: 6400, total: 41853, fareBasis: 'TEE1M' }
  };
  const f = fares[carrier] || {
    baseUsd: 300.00, rate: 122.25, baseBdt: 36675, tax: 6800, total: 43475, fareBasis: 'YEE1M'
  };
  return {
    carrier, carrierName: cName, ...f,
    route: `${carrier} DAC KUL 270.00${carrier} DAC 40.00NUC310.00END ROE1.000000`
  };
}

// Pricing an availability-built itinerary must include every air segment.
// JR/Fare Shop supplies one through-fare itself; this helper is for the
// normal availability -> sell -> WPNCB/WP workflow.
function sbGetBookedItineraryFare(defaultCarrier) {
  const airSegments = (sbState.booked || []).filter(segment => segment.al && segment.al !== 'ARNK');
  if (airSegments.length <= 1) return sbGetFareForCarrier(defaultCarrier);

  const legFares = airSegments.map(segment => sbGetFareForCarrier(segment.al || defaultCarrier));
  const first = legFares[0];
  const baseUsd = legFares.reduce((sum, fare) => sum + fare.baseUsd, 0);
  const baseBdt = legFares.reduce((sum, fare) => sum + fare.baseBdt, 0);
  const tax = legFares.reduce((sum, fare) => sum + fare.tax, 0);
  const total = baseBdt + tax;
  return {
    ...first,
    baseUsd,
    baseBdt,
    tax,
    total,
    route: airSegments.map(segment => `${segment.al}${segment.fn} ${segment.dep}-${segment.arr}`).join(' / '),
    fareBasis: `${first.fareBasis}/MC`
  };
}

function cmdWpa(raw) {
  let carrier = '';
  const clean = (raw || '').trim().toUpperCase();

  if (clean.startsWith('WPA')) {
    const after = clean.slice(3).trim();
    if (after.length === 2) {
      if (!SB_AIRLINES[after]) {
        sbWarn(`UNKNOWN AIRLINE CODE: ${after}`);
        return;
      }
      carrier = after;
    } else if (after.length > 0) {
      const found = sbFindAirline(after);
      if (!found) {
        sbWarn(`UNKNOWN AIRLINE: ${after}`);
        return;
      }
      carrier = found.code;
    }
  }

  if (!carrier) {
    if (sbState.booked.length > 0 && sbState.booked[0].al) {
      carrier = sbState.booked[0].al;
    } else {
      carrier = 'MH';
    }
  }

  const fare = sbGetBookedItineraryFare(carrier);
  sbState.privateFare = fare;
  sbState.pqPriced = true;
  sbState.pqPending = false;
  sbState.pqStoredInPNR = false;
  sbState.fareQuote = sbBuildFareQuote(fare);
  if (sbState.ticketed && sbState.reissueNeedsPricing && sbState.partialUsedPractice && sbState.issuedFare) {
    sbState.fareQuote = JSON.parse(JSON.stringify(sbState.issuedFare));
  }
  if (sbState.ticketed && sbState.eticketNumber && sbState.reissueNeedsPricing) {
    sbState.reissueNeedsPricing = false;
    sbState.reissuePricedFare = JSON.parse(JSON.stringify(sbState.fareQuote));
  }

  const printFare = text => sbPrint(text, 'fare-output');
  printFare('');
  printFare('          BASE FARE      EQUIV AMOUNT    TAXES/FEES/CHARGES');
  printFare(`1-        USD${fare.baseUsd.toFixed(2)}          BDT${sbState.fareQuote.base}             BDT${sbState.fareQuote.tax}XT      BDT${sbState.fareQuote.total}ADT           TOTAL:   BDT${sbState.fareQuote.total}`);
  printFare('     XT       500BD            4000UT                25000W             447E5');
  printFare('             4328YQ            1237P8                1237P7');
  printFare(`             ${fare.baseUsd.toFixed(2)}             ${fare.baseBdt}                 ${fare.tax}`);
  printFare('                                                   FOP FEES PER TICKET MAY APPLY');
  printFare('');
  printFare(`ADT-1     ${fare.fareBasis}`);
  printFare(fare.route);
  printFare(`RATE USED 1USD-${fare.rate.toFixed(2)}BDT`);
  printFare('CHNG FEE APPLY/REFUND FEE/APPLY/NO SHOW FEE APPLY');
  printFare(`VALIDATING CARRIER SPECIFIED - ${fare.carrier}`);
  printFare('BRANDED FARE /ECONOMY VALUE-ECONOMY VALUE');
  printFare('FORM OF PAYMENT FEES PER TICKET MAY APPLY');
  // Keep FOP rows on fixed terminal columns so FEE and TKT TOTAL remain
  // aligned even when the description length changes.
  const fopRow = (adt, description, fee, total) =>
    String(adt || '').padEnd(14) + String(description || '').padEnd(48) +
    String(fee ?? '').padStart(7) + String(total ?? '').padStart(16);
  printFare(fopRow('ADT', 'DESCRIPTION', 'FEE', 'TKT TOTAL'));
  printFare(fopRow('', '0BFCA - CC FEES', 0, 0));
  printFare(fopRow('', '0BFCA - CC NBR BEGINS WITH 223529', 0, fare.total));
  if (sbState.fareQuote.pax > 1) {
    sbState.fareQuote.breakdown.forEach(item => printFare(`P${item.index} ${item.type}  BASE BDT${item.base}  TAX BDT${item.tax}  TOTAL BDT${item.total}`));
  }
}

function sbAutoPriceReissue() {
  const carrier = sbState.booked.find(segment => segment.al && segment.al !== '--')?.al || 'MH';
  const issuedSegments = (() => {
    try { return JSON.parse(sbState.issuedItinerary || '[]'); } catch (e) { return []; }
  })();
  const classChanged = (sbState.booked || []).some((segment, index) =>
    issuedSegments[index] && issuedSegments[index].cls && segment.cls &&
    issuedSegments[index].cls !== segment.cls
  );
  const fare = sbState.reissueTrainingNewFare
    ? { ...sbGetFareForCarrier(carrier), ...sbState.reissueTrainingNewFare, carrier }
    : sbGetBookedItineraryFare(carrier);
  // Synthetic training premium: a replacement booked in a different class
  // must produce an ADC even when the carrier's base fare table is unchanged.
  // Same-class exchanges continue to use the exact same fare.
  if (classChanged) {
    const premium = Math.round(Number(fare.baseBdt || 0) * 0.1);
    fare.baseBdt = Number(fare.baseBdt || 0) + premium;
    fare.total = fare.baseBdt + Number(fare.tax || 0);
    fare.baseUsd = Number(fare.baseUsd || 0) * 1.1;
  }
  sbState.privateFare = fare;
  sbState.pqPriced = true;
  sbState.pqPending = false;
  sbState.pqStoredInPNR = false;
  sbState.fareQuote = sbBuildFareQuote(fare);
  if (sbState.partialUsedPractice && sbState.issuedFare) {
    sbState.fareQuote = JSON.parse(JSON.stringify(sbState.issuedFare));
  }
  sbState.reissueNeedsPricing = false;
  sbState.reissuePricedFare = JSON.parse(JSON.stringify(sbState.fareQuote));
}

// Training fare-rule display. The simulator keeps fares synthetic, but exposes
// the same useful rule categories a trainee needs to inspect after pricing.
function cmdFareRules(raw) {
  if (!sbState.fareQuote || !sbState.privateFare || !sbState.pqPriced) {
    sbWarn('NO PRICED FARE ON FILE - ENTER WP FIRST');
    return;
  }

  const upper = String(raw || '').trim().toUpperCase();
  const selector = upper.slice('WPRD*'.length);
  const fare = sbState.privateFare;
  const segments = (sbState.booked || []).filter(s => s.al && s.al !== 'ARNK');
  const first = segments[0] || {};
  const origin = first.dep || 'DAC';
  const destination = segments[segments.length - 1]?.arr || 'SIN';
  const carrier = fare.carrier || first.al || 'XX';
  const fareBasis = fare.fareBasis || 'TRAINING';
  const paxType = sbState.fareQuote.breakdown?.[0]?.type || 'ADT';
  const menu = [
    ['01', 'ELIGIBILITY'], ['02', 'DAY/TIME'], ['03', 'SEASONALITY'],
    ['04', 'FLIGHT APPLICATION'], ['05', 'ADVANCE RESERVATIONS/TICKETING'],
    ['06', 'MINIMUM STAY'], ['07', 'MAXIMUM STAY'], ['08', 'STOPOVERS'],
    ['09', 'TRANSFERS'], ['10', 'COMBINATIONS'], ['11', 'BLACKOUT DATES'],
    ['12', 'SURCHARGES'], ['13', 'ACCOMPANIED TRAVEL'],
    ['14', 'TRAVEL RESTRICTIONS'], ['15', 'SALES RESTRICTIONS'],
    ['16', 'PENALTIES'], ['17', 'HIP/MILEAGE EXCEPTIONS'],
    ['18', 'TICKET ENDORSEMENTS'], ['19', 'CHILDREN/INFANT DISCOUNTS'],
    ['20', 'TOUR CONDUCTOR DISCOUNTS'], ['21', 'AGENT DISCOUNTS'],
    ['22', 'OTHER DISCOUNTS'], ['23', 'MISCELLANEOUS PROVISIONS'],
    ['25', 'FARE BY RULE'], ['26', 'GROUPS'], ['27', 'TOURS'],
    ['28', 'VISIT ANOTHER COUNTRY'], ['29', 'DEPOSITS'],
    ['31', 'VOLUNTARY CHANGES'], ['33', 'VOLUNTARY REFUNDS'],
    ['35', 'NEGOTIATED FARES'], ['50', 'RULE APPLICATION AND OTHER CONDITIONS']
  ];

  if (selector === 'M') {
    sbPrint(`FARE RULE MENU - ${carrier} ${origin}-${destination} ${fareBasis}`);
    menu.forEach(([number, title]) => sbPrint(`${number} ${title}`));
    sbPrint('DISPLAY A CATEGORY: WPRD*C16  |  FULL RULE: WPRD*');
    return;
  }

  const categoryMatch = selector.match(/^C(\d{1,2})(?:\*P(ADT|CHD|INF))?$/);
  const passengerMatch = selector.match(/^P(ADT|CHD|INF)$/);
  if (selector && !categoryMatch && !passengerMatch) {
    sbWarn('FORMAT: WPRD*  (MENU)  |  WPRD*C16  |  WPRD*PCHD');
    return;
  }

  const category = categoryMatch ? categoryMatch[1].padStart(2, '0') : '';
  const selectedPax = categoryMatch?.[2] || passengerMatch?.[1] || paxType;
  if (category && !menu.some(([number]) => number === category)) {
    sbWarn(`RULE CATEGORY ${category} NOT AVAILABLE IN TRAINING DATA`);
    return;
  }

  const print = text => sbPrint(text, 'fare-output');
  if (!selector) {
    const baseFare = Number(fare.baseUsd || 0).toFixed(2);
    print('V  FARE BASIS   AP  FARE-OW  FARE-RT  BK  SEASON  MINMAX  RTG');
    print(` 1  ${fareBasis.padEnd(10)} -   ${baseFare.padStart(7)}          M¥    ---     -/  -   EH01`);
    print(`PASSENGER TYPE-${selectedPax}                 AUTO PRICE-YES`);
    print(`FROM-${origin} TO-${destination}    CXR-${carrier}    TVL-${first.date || '---'}  RULE-TRAINING`);
    print(`FARE BASIS-${fareBasis}           SPECIAL FARE  DIS-E  VENDOR-TRAINING`);
    print('FARE TYPE-XOX      OW-ECONOMY CLASS ONE WAY EXCURSION FARE');
    print(`USD   ${baseFare}  TRAINING  FC-${fareBasis}  FN-TRAINING`);
    print('SYSTEM DATES - TRAINING DATA; NOT VALIDATED FOR AUTOPRICING');
    print('');
  }
  print(`FARE RULE - ${carrier}  ${origin}-${destination}  TVL-${first.date || '---'}`);
  print(`FARE BASIS-${fareBasis}  PASSENGER TYPE-${selectedPax}  TRAINING RULES`);
  print('NOTE - TRAINING RULE SUMMARY; CONDITIONS ARE NOT VALIDATED FOR PRICING.');

  const allCategories = !category;
  const wants = number => allCategories || category === number;
  const heading = (number, title) => print(`${number}.${title}`);
  const lines = values => values.forEach(line => print(`   ${line}`));
  const applicable = [origin, destination, carrier, fareBasis];

  if (wants('50')) {
    heading('50', 'RULE APPLICATION AND OTHER CONDITIONS');
    if (carrier === 'SQ') {
      lines([
        'NOTE - THE FOLLOWING TEXT IS INFORMATIONAL AND NOT',
        'VALIDATED FOR AUTOPRICING.',
        'SINGAPORE AIRLINES PUBLISHED FARES',
        'APPLICATION',
        'AREA',
        'THESE FARES APPLY FROM BANGLADESH TO AREA 1/AREA 2/AREA 3.',
        'CLASS OF SERVICE',
        'THESE FARES APPLY FOR ECONOMY CLASS SERVICE.',
        'TYPES OF TRANSPORTATION',
        'THIS RULE GOVERNS ONE-WAY AND ROUND-TRIP FARES.',
        'FARES MAY BE USED TO CREATE ONE-WAY/ROUND-TRIP/CIRCLE-TRIP/',
        'SINGLE OPEN-JAW/DOUBLE OPEN-JAW JOURNEYS.',
        'CAPACITY LIMITATIONS',
        'CARRIER MAY LIMIT PASSENGERS AND SEATS AVAILABLE AT THESE FARES;',
        'THE FARES MAY NOT BE AVAILABLE ON ALL FLIGHTS.',
        'OTHER CONDITIONS',
        'FOR AN INFANT WITH A SEAT ON SQ-OPERATED FLIGHTS, CONTACT THE',
        'SQ CALL CENTRE TO PURCHASE THE SEAT.',
        'ON SCOOT-OPERATED SEGMENTS, A SEAT FOR AN INFANT IS NOT AVAILABLE.',
        'FOR AN UNACCOMPANIED CHILD/MINOR ON SQ/TR-OPERATED FLIGHTS,',
        'CONTACT THE SQ CALL CENTRE ABOUT UNACCOMPANIED MINOR SERVICES.'
      ]);
    } else {
      lines([
        'TRAINING FARE APPLIES TO THE BOOKED ITINERARY.',
        `ORIGIN ${origin}  DESTINATION ${destination}  CARRIER ${carrier}.`,
        'FARE FAMILY AND BOOKING CLASS MAY AFFECT BAGGAGE AND FLEXIBILITY.',
        'CHECK THE PRICED FARE AND PASSENGER TYPE BEFORE CONTINUING.'
      ]);
    }
  }
  if (wants('01')) { heading('01', 'ELIGIBILITY'); lines(['NO ADDITIONAL ELIGIBILITY REQUIREMENTS IN THIS TRAINING FARE.']); }
  if (wants('02')) { heading('02', 'DAY/TIME'); lines(['NO DAY OR TIME RESTRICTIONS IN THIS TRAINING FARE.']); }
  if (wants('03')) { heading('03', 'SEASONALITY'); lines(['NO SEASONAL RESTRICTIONS IN THIS TRAINING FARE.']); }
  if (wants('04')) { heading('04', 'FLIGHT APPLICATION'); lines([`BOOKED SECTORS: ${applicable.join(' / ')}.`, 'VALIDATING CARRIER MUST MATCH THE PRICED FARE.']); }
  if (wants('05')) { heading('05', 'ADVANCE RESERVATIONS/TICKETING'); lines(['CONFIRMED RESERVATIONS ARE REQUIRED FOR ALL SECTORS.']); }
  if (wants('06')) { heading('06', 'MINIMUM STAY'); lines(['NO MINIMUM STAY REQUIREMENTS APPLY.']); }
  if (wants('07')) { heading('07', 'MAXIMUM STAY'); lines(['NO MAXIMUM STAY REQUIREMENTS APPLY.']); }
  if (wants('08')) {
    heading('08', 'STOPOVERS');
    if (carrier === 'SQ') {
      lines(['UNLIMITED FREE STOPOVERS PERMITTED ON THE PRICING UNIT', 'AT ANY POINT.']);
    } else {
      lines(['ONE STOPOVER PER PRICING UNIT PERMITTED IN THIS GENERIC', 'TRAINING PROFILE; ADDITIONAL STOPOVERS MAY INCUR A CHARGE.']);
    }
  }
  if (wants('09')) {
    heading('09', 'TRANSFERS');
    if (carrier === 'SQ') {
      lines([
        'UNLIMITED TRANSFERS PERMITTED ON THE PRICING UNIT.',
        'FARE BREAK AND EMBEDDED SURFACE SECTORS NOT PERMITTED',
        'ON THE FARE COMPONENT.'
      ]);
    } else {
      lines(['TRANSFERS FOLLOW THE BOOKED ROUTING; LIMITS MAY APPLY IN THIS', 'GENERIC TRAINING PROFILE.']);
    }
  }
  if (wants('10')) {
    heading('10', 'COMBINATIONS');
    if (carrier === 'SQ') {
      lines([
        'SINGLE/DOUBLE OPEN JAWS/ROUND TRIPS/CIRCLE TRIPS NOT',
        'PERMITTED.',
        'END-ON-END NOT PERMITTED. SIDE TRIPS NOT PERMITTED.'
      ]);
    } else {
      lines(['COMBINATIONS WITH OTHER FARES REQUIRE REPRICING IN THIS', 'GENERIC TRAINING PROFILE.']);
    }
  }
  if (wants('11')) { heading('11', 'BLACKOUT DATES'); lines(['NO BLACKOUT DATES APPLY.']); }
  if (wants('12')) {
    heading('12', 'SURCHARGES');
    if (carrier === 'SQ') lines(['NO SURCHARGE REQUIREMENTS APPLY.']);
    else lines(['CARRIER OR PAYMENT SURCHARGES MAY APPLY IN THIS', 'GENERIC TRAINING PROFILE.']);
  }
  if (wants('13')) {
    heading('13', 'ACCOMPANIED TRAVEL');
    if (carrier === 'SQ') lines(['ACCOMPANIED TRAVEL NOT REQUIRED.']);
    else lines(['CHILDREN AND INFANTS MUST FOLLOW THE AGE AND ACCOMPANYING ADULT REQUIREMENTS.']);
  }
  if (wants('14')) {
    heading('14', 'TRAVEL RESTRICTIONS');
    if (carrier === 'SQ') lines(['VALID FOR TRAVEL COMMENCING ON/AFTER 01DEC23.']);
    else lines(['TRAVEL DATES MUST MATCH THE BOOKED ITINERARY AND TRAINING FARE VALIDITY.']);
  }
  if (wants('15')) {
    heading('15', 'SALES RESTRICTIONS');
    if (carrier === 'SQ') {
      lines([
        'FOOTNOTE RULE',
        'TICKETS MUST BE ISSUED ON/AFTER 01DEC23.',
        '',
        'GENERAL RULE - APPLY UNLESS OTHERWISE SPECIFIED',
        'TICKETS MUST BE ISSUED ON THE STOCK OF SQ AND MAY ONLY',
        'BE SOLD IN BANGLADESH.',
        'TICKETS MUST BE ISSUED BY ELECTRONIC TICKETING.',
        'NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
        'SEQUENTIAL USE OF FLIGHT COUPONS - THIS FARE IS ONLY',
        'VALID IF THE FLIGHTS ARE TAKEN IN THE BOOKED SEQUENCE;',
        'OTHERWISE THE FARE WILL BE RECALCULATED BASED ON THE',
        'ACTUAL FLIGHT ROUTING.'
      ]);
    } else {
      lines(['TICKETING AND SALES RESTRICTIONS FOLLOW THE GENERIC', 'TRAINING FARE CONFIGURATION.']);
    }
  }
  if (wants('16')) {
    heading('16', 'PENALTIES');
    if (carrier !== 'SQ') {
      lines([
        `${carrier} TRAINING RULE PROFILE - DEFAULT SAMPLE, NOT AIRLINE-PUBLISHED RULES.`,
        'CANCELLATION: USD 100.00 SAMPLE FEE.',
        'CHANGES/REISSUE: USD 20.00 SAMPLE FEE PLUS ANY FARE DIFFERENCE.',
        'NO-SHOW: SAMPLE FEE MAY APPLY.',
        'CHECK THE SELECTED CARRIER FARE CONDITIONS BEFORE REISSUE OR REFUND.'
      ]);
    } else {
    lines([
      'CANCELLATIONS',
      '',
      'ANY TIME',
      'CHARGE USD 100.00 FOR CANCEL.',
      'NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
      '--------------------------------------------------',
      'FOR ALL JOURNEYS BEFORE/AFTER FIRST FLIGHT DEPARTURE - USD 100.',
      '--------------------------------------------------',
      'APPLICABLE FEES ARE TO BE CONVERTED INTO LOCAL CURRENCY AT THE',
      'BANKERS SELLING RATE.',
      '--------------------------------------------------',
      'FEES ARE NOT APPLICABLE FOR INFANT WITHOUT A SEAT.',
      '--------------------------------------------------',
      'IN CASE OF TICKET UPGRADE THE ORIGINAL NON-REFUNDABLE AMOUNT',
      'REMAINS NON-REFUNDABLE.',
      '--------------------------------------------------',
      'YR IS NON-REFUNDABLE FOR ALL FARES.',
      '--------------------------------------------------',
      'IN CASES OF NO-SHOW CHARGE NO-SHOW FEE OF USD 100 AND',
      'CANCELLATION FEE OF USD 100 FOR CANCEL.',
      '--------------------------------------------------',
      'FOR ANY CANCELLATIONS THE STRICTER FARE CONDITIONS WILL APPLY',
      'TO THE ENTIRE JOURNEY.',
      '--------------------------------------------------',
      '',
      'CHANGES',
      '',
      'ANY TIME',
      'CHARGE USD 20.00 FOR REISSUE/REVALIDATION.',
      'NOTE - TEXT BELOW NOT VALIDATED FOR AUTOPRICING.',
      '--------------------------------------------------',
      'FOR ANY TICKET CHANGES CHARGE THE HIGHEST FEE OF ALL CHANGED',
      'FARE COMPONENTS.',
      '--------------------------------------------------',
      'APPLICABLE FEES ARE TO BE CONVERTED INTO LOCAL CURRENCY AT THE',
      'BANKERS SELLING RATE.',
      '--------------------------------------------------',
      'FEES ARE NOT APPLICABLE FOR INFANT WITHOUT A SEAT.',
      '--------------------------------------------------',
      'FOR ANY FARE COMPONENT TICKETED IN ECONOMY OR PREMIUM ECONOMY',
      'CABIN AND UPGRADED TO BUSINESS OR FIRST CABIN, REBOOKING FEE',
      'FOR REISSUANCE/REVALIDATION IS WAIVED.',
      '--------------------------------------------------',
      'FOR ANY FARE COMPONENT TICKETED IN BUSINESS CABIN AND UPGRADED',
      'TO FIRST CABIN, REBOOKING FEE FOR REISSUANCE/REVALIDATION IS',
      'WAIVED.',
      '--------------------------------------------------',
      'THE NEW BASE FARE MUST BE EQUAL OR HIGHER THAN THE ORIGINAL',
      'BASE FARE FOLLOWING ANY TICKET CHANGES.',
      '--------------------------------------------------',
      'IN CASE OF TICKET UPGRADE THE ORIGINAL NON-REFUNDABLE AMOUNT',
      'REMAINS NON-REFUNDABLE.',
      '--------------------------------------------------',
      'IN CASES OF NO-SHOW CHARGE THE HIGHER OF THE TWO - NO-SHOW FEE',
      'USD 100 OR THE HIGHEST REBOOKING FEE AMONG ALL CHANGED FARE',
      'COMPONENTS - FOR REISSUE/REVALIDATION.',
      '--------------------------------------------------'
    ]);
    }
  }
  if (wants('17')) { heading('17', 'HIP/MILEAGE EXCEPTIONS'); lines(['NO HIP OR MILEAGE EXCEPTIONS APPLY.']); }
  if (wants('18')) {
    heading('18', 'TICKET ENDORSEMENTS');
    if (carrier === 'SQ') {
      lines([
        'THE ORIGINAL AND THE REISSUED TICKET MUST BE ANNOTATED',
        '- CHNG FEE APPLY/REFUND FEE - AND - APPLY/NO SHOW FEE',
        'APPLY - IN THE ENDORSEMENT BOX.'
      ]);
    } else {
      lines(['ENDORSEMENT: CHANGE FEE, REFUND FEE AND NO-SHOW FEE', 'APPLY AS REQUIRED BY THIS GENERIC TRAINING FARE.']);
    }
  }
  if (wants('19')) {
    heading('19', 'CHILDREN DISCOUNTS');
    if (carrier !== 'SQ') {
      lines([
        `${carrier} GENERIC TRAINING PASSENGER TYPE GUIDE - NOT AIRLINE-PUBLISHED RULES.`,
        'ACCOMPANIED CHILD AGE 2-11: 75 PERCENT OF ADULT BASE FARE.',
        'UNACCOMPANIED CHILD AGE 5-11: 100 PERCENT OF ADULT BASE FARE.',
        'INFANT UNDER 2 WITH A SEAT: 75 PERCENT OF ADULT BASE FARE.',
        'INFANT UNDER 2 WITHOUT A SEAT: 10 PERCENT OF ADULT BASE FARE.',
        'CHILD/INFANT ACCOMPANIMENT AND TICKET DESIGNATORS VARY BY CARRIER.'
      ]);
    } else {
    lines([
      'CNN/ACCOMPANIED CHILD PSGR 2-11 - CHARGE 75 PERCENT OF THE FARE.',
      '   TICKET DESIGNATOR - CH25.',
      '   MUST BE ACCOMPANIED ON ALL FLIGHTS IN THE SAME COMPARTMENT BY',
      '   ADULT PSGR 18 OR OLDER.',
      'OR - UNN/UNACCOMPANIED CHILD PSGR 5-11 - CHARGE 100 PERCENT OF THE FARE.',
      '   TICKET DESIGNATOR - CH.',
      'OR - INS/INFANT WITH A SEAT PSGR UNDER 2 - CHARGE 75 PERCENT OF THE FARE.',
      '   TICKET DESIGNATOR - IN25.',
      '   MUST BE ACCOMPANIED ON ALL FLIGHTS IN THE SAME COMPARTMENT BY',
      '   ADULT PSGR 18 OR OLDER.',
      'OR - INF/INFANT WITHOUT A SEAT PSGR UNDER 2 - CHARGE 10 PERCENT OF THE FARE.',
      '   TICKET DESIGNATOR - IN90.',
      '   MUST BE ACCOMPANIED ON ALL FLIGHTS IN THE SAME COMPARTMENT BY',
      '   ADULT PSGR 18 OR OLDER.',
      'TRAINING PRICER APPLIES THE CHILD AND INFANT FARE RATIOS TO THE QUOTE.'
    ]);
    }
  }
  if (wants('20')) { heading('20', 'TOUR CONDUCTOR DISCOUNTS'); lines(['NO DISCOUNTS FOR TOUR CONDUCTORS.']); }
  if (wants('21')) { heading('21', 'AGENT DISCOUNTS'); lines(['NO DISCOUNTS FOR SALE AGENTS.']); }
  if (wants('22')) { heading('22', 'ALL OTHER DISCOUNTS'); lines(['NO DISCOUNTS FOR OTHERS.']); }
  if (wants('23')) {
    heading('23', 'MISCELLANEOUS PROVISIONS');
    if (carrier === 'SQ') {
      lines([
        'THIS FARE MAY BE USED TO CONSTRUCT UNPUBLISHED FARES.',
        'THIS FARE MUST NOT BE USED AS THROUGH FARE WITH A',
        'DIFFERENTIAL AND/OR TO CALCULATE DIFFERENTIAL.'
      ]);
    } else {
      lines(['FARE IS FOR TRAINING AND DOES NOT AUTHORIZE REAL TICKETING.']);
    }
  }
  if (wants('25')) { heading('25', 'FARE BY RULE'); lines(['NOT APPLICABLE.']); }
  if (wants('26')) { heading('26', 'GROUPS'); lines(['NO GROUP PROVISIONS APPLY.']); }
  if (wants('27')) { heading('27', 'TOURS'); lines(['NO TOUR PROVISIONS APPLY.']); }
  if (wants('28')) { heading('28', 'VISIT ANOTHER COUNTRY'); lines(['NO VISIT ANOTHER COUNTRY PROVISIONS APPLY.']); }
  if (wants('29')) { heading('29', 'DEPOSITS'); lines(['NO DEPOSIT PROVISIONS APPLY.']); }
  if (wants('31')) {
    heading('31', 'VOLUNTARY CHANGES');
    if (carrier === 'SQ') {
      lines([
        'CHANGES MUST BE MADE WITHIN TICKET VALIDITY.',
        'SQ INTERNATIONAL FARE PROVISIONS MAY OVERRIDE DOMESTIC',
        'REISSUE RULES. LAP INFANT PROVISIONS MAY DIFFER.',
        'BEFORE ORIGINAL FLIGHT: USD 20 OR HIGHEST CHANGED-COMPONENT FEE.',
        'AFTER ORIGINAL FLIGHT: USD 100 OR HIGHEST CHANGED-COMPONENT FEE.',
        'REVALIDATION: USD 20 BEFORE / USD 100 AFTER ORIGINAL FLIGHT,',
        'OR HIGHEST CHANGED-COMPONENT FEE, SUBJECT TO CONDITIONS.',
        'REPRICE USING FARES IN EFFECT TODAY OR, FOR REVALIDATION AND',
        'SOME REISSUES, FARES IN EFFECT WHEN THE TICKET WAS ISSUED.',
        'GENERAL REISSUE CONDITIONS:',
        '- WHEN NO INTERNATIONAL COUPONS REMAIN, NEW TRAVEL MUST BE DOMESTIC.',
        '- NO FARE-BREAK CHANGE UP TO THE FIRST CHANGED COMPONENT.',
        '- NEW TICKET VALUE MUST BE EQUAL TO OR HIGHER THAN PREVIOUS TICKET.',
        '- PUBLIC/PRIVATE TARIFF TYPE AND APPLICABLE MI/SQ FARE FAMILY,',
        '  FARE CLASS, RULE AND BOOKING-CODE CONDITIONS MUST BE MET.',
        '- ADVANCE RESERVATION IS MEASURED FROM REISSUE DATE OR ORIGINAL',
        '  TICKET DATE, AS APPLICABLE, TO PRICING-UNIT DEPARTURE.',
        'REVALIDATION CONDITIONS MAY ALSO REQUIRE NO CHANGE TO STOPOVERS,',
        'CONNECTIONS OR FARE BREAKS.',
        'AFTER DEPARTURE, FULLY FLOWN FARE COMPONENTS CANNOT BE REPRICED',
        'TO A FURTHER POINT; ALL APPLICABLE FARE AND TICKET RULES APPLY.',
        'REFUND ANY RESIDUAL AMOUNT TO ORIGINAL FORM OF PAYMENT.',
        'ENDORSEMENT BOX: HIGHER NON-REFUNDABLE AMOUNT AND NEW ENDORSEMENTS.',
        'ANYTIME: CHANGES EXCEPT RBD ARE NOT PERMITTED TO THE JOURNEY.'
      ]);
    } else {
      lines([
        `${carrier} GENERIC TRAINING CHANGE PROFILE - NOT AIRLINE-PUBLISHED RULES.`,
        'SAMPLE FEE BEFORE ORIGINAL FLIGHT: USD 20 OR HIGHEST COMPONENT FEE.',
        'SAMPLE FEE AFTER ORIGINAL FLIGHT: USD 100 OR HIGHEST COMPONENT FEE.',
        'NO CHANGE FEE FOR INFANT WITHOUT A SEAT IN THIS TRAINING PROFILE.',
        'COLLECT ANY FARE DIFFERENCE; REPRICE AND VERIFY BOOKING CLASS.'
      ]);
    }
  }
  if (wants('33')) {
    heading('33', 'VOLUNTARY REFUNDS');
    if (carrier === 'SQ') {
      lines([
        'REFUND MUST BE REQUESTED BEFORE DEPARTURE OF JOURNEY.',
        'BEFORE FIRST UNUSED FLIGHT: USD 100 PER PRICING UNIT.',
        'AFTER FIRST UNUSED FLIGHT TIME / NO-SHOW: USD 200 PER PRICING UNIT.',
        'AFTER DEPARTURE: USD 100 BEFORE OR USD 200 AFTER FIRST UNUSED',
        'FLIGHT TIME, PER PRICING UNIT.',
        'IF MULTIPLE PENALTIES APPLY PER PRICING UNIT, COLLECT HIGHEST.',
        'NO REFUND FEE FOR INFANT WITHOUT A SEAT.',
        'BEFORE-DEPARTURE REPRICING: FULLY FLOWN FARE BREAKS CANNOT CHANGE;',
        'FOR PARTIALLY FLOWN COMPONENTS, ONLY DESTINATION BREAK MAY CHANGE.',
        'NEW FARE FOR A FULLY FLOWN COMPONENT MUST BE EQUAL TO OR HIGHER;',
        'REPLACEMENT RBD MUST BE EQUAL TO OR HIGHER THAN PREVIOUS RBD.',
        'AFTER-DEPARTURE REPRICING USES FARES EFFECTIVE ON TICKET ISSUE DATE.',
        'QUALIFIED PRIVATE/PUBLIC FARES, ANY RULE, FARE CLASS/FAMILY,',
        'FARE TYPE AND NORMAL/SPECIAL ONE-WAY/ROUND-TRIP FARES MAY APPLY.',
        'FULLY FLOWN FARE BREAKS CANNOT CHANGE; PARTIALLY FLOWN COMPONENTS',
        'MAY CHANGE DESTINATION BREAK ONLY. NEW FARE AND RBD MUST MEET RULE.',
        'ONLY THE VALIDATING CARRIER MAY REFUND THE TICKET.',
        'REFUND VIA EMD.'
      ]);
    } else {
      lines([
        `${carrier} GENERIC TRAINING REFUND PROFILE - NOT AIRLINE-PUBLISHED RULES.`,
        'SAMPLE REFUND FEE: USD 100 BEFORE DEPARTURE; USD 200 AFTER',
        'DEPARTURE OR NO-SHOW, PER PRICING UNIT.',
        'REQUEST BEFORE THE FIRST UNUSED FLIGHT; LAP INFANT HAS NO SAMPLE FEE.',
        'REPRICE UNUSED COUPONS; NEW FARE/RBD CONDITIONS MAY APPLY.',
        'REFUND METHOD AND VALIDATING-CARRIER RULE VARY BY CARRIER.'
      ]);
    }
  }
  if (wants('35')) { heading('35', 'NEGOTIATED FARES'); lines(['NOT APPLICABLE.']); }
}

function cmdPq() {
  if (!sbState.privateFare || !sbState.pqPriced) {
    sbWarn('NO FARE QUOTE ON FILE - ENTER WPA <AIRLINE> FIRST');
    return;
  }
  sbState.pqPending = true;
  sbState.pqStoredInPNR = false;
  cmdPrintPqRecord();
}

function cmdPrintPqRecord() {
  if (!sbState.privateFare && !sbState.fareQuote) {
    sbWarn('NO FARE RECORD EXISTS');
    return;
  }
  const fq = sbState.fareQuote;
  const fare = sbState.privateFare || {
    carrier: sbState.booked[0]?.al || 'MH',
    baseUsd: 310.00, baseBdt: fq.base, tax: fq.tax, total: fq.total,
    fareBasis: 'QLW1YM4'
  };
  const printFare = text => sbPrint(text, 'fare-output');
  const passengers = sbState.names.length ? sbState.names : [{ raw: 'ADT', paxType: 'ADT' }];
  const passengerType = fq.breakdown?.[0]?.type || passengers[0]?.paxType || 'ADT';
  const usdMultiplier = (fq.breakdown || []).reduce((sum, item) => {
    const multiplier = item.type === 'INF' ? 0.10 : item.type === 'CHD' ? 0.75 : 1;
    return sum + multiplier;
  }, 0) || Number(fq.pax) || 1;
  const usdBase = Number.isFinite(fare.baseUsd) ? fare.baseUsd * usdMultiplier : null;
  const segments = (sbState.booked || []).filter(segment => segment.al && segment.al !== '--' && segment.fn !== 'ARNK');

  printFare('');
  printFare(sbState.pqStoredInPNR ? 'PRICE QUOTE RECORD RETAINED' : 'PRICE QUOTE RECORD - PENDING ER');
  printFare(`FARE RECORD-${passengerType}-AUTO PRICED     -ATPC`);
  printFare(`PQ 1                                            INPUT PTC - ${passengerType}`);
  passengers.forEach((pax, index) => {
    const name = pax.raw || [pax.surname, pax.first, pax.title].filter(Boolean).join('/');
    printFare(`${index + 1}.1${name || passengerType}`);
  });
  printFare('');
  printFare(`VALIDATING CARRIER - ${fare.carrier}`);
  segments.forEach((segment, index) => {
    const status = /^(?:SS|HK)/.test(segment.status || '') ? 'OK' : (segment.status || 'OK');
    const flight = `${segment.fn || ''}${segment.cls || ''}`;
    printFare(` ${index + 1} OD${segment.dep || '---'} ${segment.al} ${flight} ${segment.date || '---'} ${segment.depT || '----'} ${fare.fareBasis || ''} ${status} ${segment.date || '---'}${segment.arrT || '----'}`);
    printFare(`    ${segment.arr || '---'}`);
  });
  printFare('');
  printFare('      BASE FARE       EQUIV AMT    TAXES/FEES/CHARGES       TOTAL');
  printFare(`      ${usdBase === null ? 'USD---.--' : `USD${usdBase.toFixed(2)}`}       BDT${fq.base}         BDT${fq.tax}XT             BDT${fq.total}`);
  printFare(`FARE ROUTING: ${segments.map(segment => `${segment.dep || '---'} ${segment.al} ${segment.arr || '---'}`).join(' / ') || 'NOT AVAILABLE'}`);
  printFare(`FARE BASIS: ${fare.fareBasis || 'NOT AVAILABLE'}     RATE USED 1USD-${fare.rate?.toFixed(2) || '---'}BDT`);
  printFare('CHNG FEE APPLY/REFUND FEE/APPLY/NO SHOW FEE APPLY');
  printFare('FORM OF PAYMENT FEES PER TICKET MAY APPLY');
  printFare('PTC      DESCRIPTION                              FEE       TKT TOTAL');
  if (fq.pax > 1) {
    fq.breakdown.forEach(item => printFare(`${item.type}-${item.index}  OBFCA - ANY CC                         0       ${item.total}`));
  } else {
    printFare(`${passengerType}-${fq.breakdown?.[0]?.index || 1}  OBFCA - ANY CC                         0       ${fq.total}`);
  }
  printFare('      OBFCA - CC NBR BEGINS WITH 223529       0       ' + fq.total);
  if (fq.pax > 1) {
    fq.breakdown.forEach(item => printFare(`P${item.index} ${item.type}  BASE BDT${item.base}  TAX BDT${item.tax}  TOTAL BDT${item.total}`));
  }
}

function cmdDisplayPq() {
  cmdPrintPqRecord();
}

/* ---------------------------------------------------------------------
   Issue Ticket — Sabre 2025 Lecture Sheet:
   • W¥PQ1¥AEY¥FCA¥KP0  (or WT / WTP)
--------------------------------------------------------------------- */
function cmdIssueTicket(raw) {
  if (!sbState.locator || !sbState.ended) { sbWarn('PNR NOT SAVED - END TRANSACTION (E) FIRST'); return; }
  if (!sbState.fareQuote) { sbWarn('NO FARE ON FILE - PRICE THE PNR FIRST (WPNCB)'); return; }
  if (!sbState.printerAssigned || !sbState.printerDesignated) {
    sbWarn('PRINTER NOT ASSIGNED / DESIGNATED - USE W*BD, DSIV<PRINTER ID>, THEN PTR/<PRINTER ID>');
    return;
  }
  // The simulated PQ has one validating carrier. Do not let an issue
  // qualifier silently replace it; the simulator has no interline-agreement
  // data with which to authorize a different validating carrier.
  const validatingCarrierMatch = String(raw || '').match(/[¥☨‡§]A([A-Z0-9]{2})(?=[¥☨‡§]|$)/i);
  const requestedCarrier = validatingCarrierMatch?.[1]?.toUpperCase();
  const pricedCarrier = sbState.privateFare?.carrier || sbState.booked.find(segment => segment.al && segment.al !== 'ARNK')?.al;
  if (requestedCarrier && !SB_AIRLINES[requestedCarrier]) {
    sbWarn(`UNKNOWN VALIDATING CARRIER: ${requestedCarrier}`);
    return;
  }
  if (requestedCarrier && pricedCarrier && requestedCarrier !== pricedCarrier) {
    sbWarn(`VALIDATING CARRIER ${requestedCarrier} DOES NOT MATCH PRICE QUOTE ${pricedCarrier} - REPRICE WITH WPA${requestedCarrier} IF PERMITTED`);
    return;
  }
  if (sbState.ticketed) { sbWarn('ALREADY TICKETED - ' + sbState.eticketNumber); return; }

  sbState.ticketed = true;
  sbState.invoiced = true;
  sbState.eticketNumber = '618-' + Math.floor(1000000000 + Math.random() * 8999999999).toString().slice(0, 10);
  const passengerCount = Math.max(sbState.names.length, 1);
  sbState.ticketNumbers = Array.from({ length: passengerCount }, (_, index) => index === 0
    ? sbState.eticketNumber.replace('-', '')
    : '618' + Math.floor(1000000000 + Math.random() * 8999999999).toString().slice(0, 10));
  sbState.issuedItinerary = JSON.stringify(sbState.booked);
  sbState.issuedFare = JSON.parse(JSON.stringify(sbState.fareQuote));
  sbState.ticketCoupons = sbState.booked.map(segment => ({ ...segment, ticketStatus: 'ACTL' }));
  sbState.exchangedCoupons = [];
  sbPnrStorePut(sbState);

  // Persist sales independently of the active PNR so DQB* survives app restarts.
  sbRecordTicketSales(sbState);

  sbPrint(`OK     ${sbState.fareQuote.total}`);
  sbPrint('ETR MESSAGE PROCESSED');
  if (sbState.locator) sbPrint(sbState.locator);
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

function cmdDisplayTicket() {
  if ((!sbState.ticketed && !sbState.voidedTicketNumbers?.length) || !sbState.eticketNumber) { sbWarn('NO TICKET RECORD EXISTS'); return; }
  sbPrint('TKT/TIME LIMIT');
  if (sbState.exchangedTicketNo) sbPrint(`EXCHANGED TICKET ${sbState.exchangedTicketNo} - REPLACED`);
  sbPrint(` 1.${sbState.ticketingArrangement || 'T-AWAITING TICKET TIME LIMIT'}`);
  const tickets = sbState.ticketNumbers?.length ? sbState.ticketNumbers : [sbState.eticketNumber.replace('-', '')];
  tickets.forEach((ticketNo, index) => {
    const pax = sbState.names[index]?.surname || sbState.names[index]?.raw || 'PASSENGER';
    const type = sbPaxLabel(sbState.names[index]);
    if (!(sbState.voidedTicketNumbers || []).includes(ticketNo)) sbPrintTicketReceiptButton(ticketNo);
    const ticketLine = index + (sbState.exchangedTicketNo ? 3 : 2);
    if (index === 0 && sbState.exchangedTicketNo) {
      sbPrint(` 2.TE ${sbState.exchangedTicketNo}-BD ${pax} ${type} ${sbState.officeId}*ATW ${sbSabreFooterStamp()}*E`);
    }
    sbPrint(` ${ticketLine}.TE ${ticketNo}-BD ${pax} ${type} ${sbState.officeId}*ATW ${sbSabreFooterStamp()}*I`);
    if ((sbState.voidedTicketNumbers || []).includes(ticketNo)) {
      sbPrint(`    TV ${ticketNo}-BD *VOID* ${sbState.officeId}*ATW ${sbSabreFooterStamp()}*E`);
    }
  });
  (sbState.ticketCoupons || []).forEach((coupon, index) => {
    sbPrint(` COUPON ${index + 1} ${coupon.al}${coupon.fn} ${coupon.date} ${coupon.dep}${coupon.arr} ${coupon.ticketStatus || 'ACTL'}`);
  });
  (sbState.exchangedCoupons || []).forEach((coupon, index) => {
    sbPrint(` EXCHANGED COUPON ${index + 1} ${coupon.al}${coupon.fn} ${coupon.date} ${coupon.dep}${coupon.arr}`);
  });
}

function cmdElectronicTicketRecord(raw) {
  const commandMatch = String(raw).match(/^WETR\*(T)?(\d+)$/i);
  const isTicketNumber = Boolean(commandMatch?.[1]);
  const explicitTicketNo = isTicketNumber ? commandMatch[2].replace(/-/g, '') : '';
  const lineNum = isTicketNumber ? null : Number(commandMatch?.[2] || 2);
  const hasExchangeHistory = Boolean(sbState.exchangedTicketNo);
  const tickets = sbState.ticketNumbers?.length ? sbState.ticketNumbers : [String(sbState.eticketNumber || '').replace(/-/g, '')];
  if (isTicketNumber && !tickets.includes(explicitTicketNo)) {
    const storedPnr = Object.values(sbPnrStoreLoad()).find(record => {
      const storedTickets = record.ticketNumbers?.length
        ? record.ticketNumbers
        : [String(record.eticketNumber || '').replace(/-/g, '')];
      return storedTickets.includes(explicitTicketNo) ||
        String(record.exchangedTicketNo || '').replace(/-/g, '') === explicitTicketNo;
    });
    if (storedPnr) {
      const activeState = sbState;
      sbState = JSON.parse(JSON.stringify(storedPnr));
      try { cmdElectronicTicketRecord(raw); }
      finally { sbState = activeState; }
      return;
    }
  }
  if (hasExchangeHistory && (lineNum === 2 || explicitTicketNo === String(sbState.exchangedTicketNo).replace(/-/g, ''))) {
    sbPrint('ELECTRONIC TICKET RECORD');
    sbPrint(`CRS CODE: 7766     PNR: ${sbState.locator || '---'}`);
    sbPrint(`TKT: ${sbState.exchangedTicketNo}     ISSUED: ${sbGetSabreDate()}     PCC: ${sbState.officeId}`);
    sbPrint(`NAME: ${sbState.names[0]?.raw || 'PASSENGER'}`);
    sbPrint('CPN  A/L  FLT   CLS  DATE    BRDOFF  ST   F/B       STAT');
    (sbState.exchangedCoupons || []).forEach((coupon, index) => sbPrint(`${index + 1}    ${coupon.al}   ${coupon.fn}   ${coupon.cls}    ${coupon.date}   ${coupon.dep} ${coupon.arr}  OK   ---     EXCH`));
    sbPrint('TICKET STATUS: EXCHANGED');
    return;
  }
  const ticketIndex = isTicketNumber
    ? tickets.indexOf(explicitTicketNo)
    : lineNum - (hasExchangeHistory ? 3 : 2);
  const ticketNo = tickets[ticketIndex];
  if (!ticketNo) {
    sbWarn(isTicketNumber ? `TICKET ${explicitTicketNo} NOT FOUND IN ACTIVE PNR` : `NO TICKET EXISTS ON TKT/TIME LIMIT LINE ${lineNum}`);
    return;
  }
  const pax = sbState.names[ticketIndex];
  const voided = (sbState.voidedTicketNumbers || []).includes(ticketNo);
  const coupons = sbState.ticketCoupons || [];
  const fare = sbState.fareQuote || {};
  sbPrint('ELECTRONIC TICKET RECORD');
  sbPrint(`CRS CODE: 7766     PNR: ${sbState.locator || '---'}`);
  sbPrint(`TKT: ${ticketNo}     ISSUED: ${sbGetSabreDate()}     PCC: ${sbState.officeId}`);
  sbPrint(`NAME: ${pax?.raw || pax?.surname || 'PASSENGER'}`);
  sbPrint(`FORM OF PAYMENT                 ${sbState.exchangeMask?.formOfPayment || 'CASH'}     FCI: 4`);
  sbPrint('CPN  A/L  FLT   CLS  DATE    BRDOFF  TIME  ST  F/B       STAT');
  coupons.forEach((coupon, index) => {
    sbPrint(`${String(index + 1).padEnd(5)}${String(coupon.al || '').padEnd(5)}${String(coupon.fn || '').padEnd(6)}${String(coupon.cls || '').padEnd(5)}${String(coupon.date || '').padEnd(8)}${String(coupon.dep || '').padEnd(4)}${coupon.arr || ''}  ${coupon.depT || '----'}  OK  ${coupon.fareBasis || '---'}    ${voided ? 'VOID' : coupon.ticketStatus || 'OPEN'}`);
    const baggage = coupon.baggage || sbTrainingBaggageAllowance(coupon.al);
    sbPrint(`      NVB:        NVA:${coupon.date || '---'} BAG:${baggage}`);
  });
  sbPrint(`FARE ${fare.currency || 'BDT'} ${Number(fare.base || 0).toFixed(2)}   TOTAL ${fare.currency || 'BDT'} ${Number(fare.total || 0).toFixed(2)}`);
  if (hasExchangeHistory) sbPrint(`TOTAL ${fare.currency || 'BDT'} ${Number(fare.total || 0).toFixed(2)}   EQUIVALENT FARE PAID   ${fare.currency || 'BDT'} ${Number(fare.base || 0).toFixed(2)}`);
  sbPrint('FARE CALCULATION');
  sbPrint(fare.route || (coupons.length ? coupons.map(c => `${c.dep}${c.al}${c.arr}`).join(' ') : 'ITINERARY AS BOOKED'));
  if (hasExchangeHistory) {
    sbPrint(`ORIGINAL ISSUE: ${sbState.exchangedTicketNo}`);
    sbPrint('ORIGINAL FORM OF PAYMENT: CASH');
    sbPrint(`EXCHANGE TKT: ${String(sbState.eticketNumber || '').replace(/-/g, '')}   1`);
    sbPrint(`ADD COLLECT AMOUNT: ${fare.currency || 'BDT'} ${Number(sbState.exchangeCollect || 0).toFixed(2)}`);
  }
  sbPrint(`TICKET STATUS: ${voided ? 'VOIDED' : 'OPEN'}`);
}

/* ---------------------------------------------------------------------
   Void Ticket & Reports — Sabre 2025 Lecture Sheet:
   • WV2         → Void ticket on line 2
   • WV*         → Void report
   • DQB*        → Today's sales
   • DQB*17JAN   → Sales on specific date
--------------------------------------------------------------------- */
function cmdVoidTicket(raw) {
  const upper = raw.trim().toUpperCase();

  // WV* -> Void report
  if (upper === 'WV*') {
    const voids = window._sbGlobalVoids || [];
    sbPrint('VOID REPORT - WV*');
    sbPrint(`AGENT: ${sbState.agentSine}/${sbState.officeId}    DATE: ${sbGetSabreDate()}`);
    if (!voids.length) {
      sbPrint('NO VOIDED TRANSACTIONS TODAY');
      return;
    }
    sbPrint('LINE  TICKET NO         PAX NAME              TIME');
    voids.forEach((v, i) => {
      sbPrint(` ${String(i + 1).padStart(2)}   ${v.ticketNo.padEnd(16)} ${(v.pax || 'PASSENGER').padEnd(20)} ${v.time}`);
    });
    sbPrint(`TOTAL VOIDED TICKETS: ${voids.length}`);
    return;
  }

  if ((!sbState.ticketed && !sbState.voidedTicketNumbers?.length) || !sbState.eticketNumber) {
    sbWarn('NO TICKET ON FILE TO VOID — ISSUE A TICKET FIRST');
    return;
  }

  const lineMatch = upper.match(/^WV(\d+)$/);
  let targetTicket = '';
  let ticketIndex = 0;
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1], 10);
    ticketIndex = lineNum - 2; // line 1 is the ticketing arrangement; first ticket is line 2.
    if (ticketIndex < 0 || !sbState.ticketNumbers?.[ticketIndex]) {
      sbWarn(`NO TICKET EXISTS ON TKT/TIME LIMIT LINE ${lineNum}`);
      return;
    }
    targetTicket = sbState.ticketNumbers[ticketIndex];
  } else {
    targetTicket = (sbState.eticketNumber || '').replace('-', '');
    ticketIndex = Math.max(0, (sbState.ticketNumbers || []).indexOf(targetTicket));
  }

  if ((sbState.voidedTicketNumbers || []).includes(targetTicket)) {
    sbWarn(`TICKET ${targetTicket} IS ALREADY VOIDED`);
    return;
  }

  if (sbState.pendingVoidTicketNo !== targetTicket) {
    sbState.pendingVoidTicketNo = targetTicket;
    if (typeof sbPnrStorePut === 'function') sbPnrStorePut(sbState);
    sbWarn(`REENT TE ${targetTicket} IS TO BE VOIDED-0028`);
    return;
  }

  sbState.voided = true;
  sbState.voidedTicketNo = targetTicket;
  sbState.pendingVoidTicketNo = null;
  sbState.voidedTicketNumbers = [...(sbState.voidedTicketNumbers || []), targetTicket];
  const activeTickets = (sbState.ticketNumbers || []).filter(ticket => !sbState.voidedTicketNumbers.includes(ticket));
  sbState.ticketed = activeTickets.length > 0;
  sbState.invoiced = activeTickets.length > 0;

  if (!window._sbGlobalVoids) window._sbGlobalVoids = [];
  window._sbGlobalVoids.push({
    ticketNo: targetTicket,
    pax: sbState.names[ticketIndex]?.raw || 'PASSENGER',
    time: sbNowStamp().split('/')[1] || '1200Z'
  });

  sbPrint('VOID MSG SENT IF WITHIN BSP APPROVED GUIDELINES');
  if (sbState.locator) {
    sbPrint(sbState.locator);
    sbPrint(sbRenderPNR(false));
  }
  if (typeof sbPnrStorePut === 'function') sbPnrStorePut(sbState);
  sbSyncSidePanel();
}

const SB_TICKET_SALES_KEY = 'sabre_ticket_sales';
const SB_TICKET_SALES_RETENTION_DAYS = 30;

function sbSalesDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function sbLoadTicketSales() {
  try {
    const stored = JSON.parse(localStorage.getItem(SB_TICKET_SALES_KEY) || '[]');
    const sales = Array.isArray(stored) ? stored : [];
    const cutoff = new Date();
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setDate(cutoff.getDate() - (SB_TICKET_SALES_RETENTION_DAYS - 1));
    const cutoffKey = sbSalesDateKey(cutoff);
    const retained = sales.filter(sale => !sale.issueDate || sale.issueDate >= cutoffKey);
    if (retained.length !== sales.length) localStorage.setItem(SB_TICKET_SALES_KEY, JSON.stringify(retained));
    window._sbGlobalSales = retained;
    return retained;
  } catch (e) {
    window._sbGlobalSales = window._sbGlobalSales || [];
    return window._sbGlobalSales;
  }
}

function sbRecordTicketSales(state) {
  const sales = sbLoadTicketSales();
  const ticketNumbers = state.ticketNumbers?.length
    ? state.ticketNumbers
    : [String(state.eticketNumber || '').replace(/-/g, '')];
  const passengerCount = Math.max(ticketNumbers.length, 1);
  const issueDate = sbSalesDateKey();
  ticketNumbers.forEach((ticketNo, index) => {
    if (!ticketNo || sales.some(sale => sale.ticketNo === ticketNo)) return;
    sales.push({
      ticketNo,
      pax: state.names[index]?.raw || 'PASSENGER',
      fop: 'CASH',
      base: Math.round(Number(state.fareQuote?.base || 0) / passengerCount),
      tax: Math.round(Number(state.fareQuote?.tax || 0) / passengerCount),
      total: Math.round(Number(state.fareQuote?.total || 0) / passengerCount),
      currency: state.fareQuote?.currency || 'BDT',
      issueDate,
      issueDateLabel: sbGetSabreDate(),
      issuedAt: new Date().toISOString(),
      officeId: state.officeId || '',
      agentSine: state.agentSine || ''
    });
  });
  window._sbGlobalSales = sales;
  try { localStorage.setItem(SB_TICKET_SALES_KEY, JSON.stringify(sales)); } catch (e) {}
}

function cmdSalesReport(raw) {
  const upper = raw.trim().toUpperCase();
  const dateMatch = upper.match(/^DQB\*(?:(\d{2})([A-Z]{3})(\d{4})?)?$/);
  if (!dateMatch) { sbWarn('FORMAT: DQB* OR DQB*DDMMM (OPTIONAL YEAR: DQB*DDMMMYYYY)'); return; }
  const requestedLabel = dateMatch[1] ? `${dateMatch[1]}${dateMatch[2]}` : sbGetSabreDate();
  const year = dateMatch[3] ? Number(dateMatch[3]) : new Date().getFullYear();
  const monthIndex = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'].indexOf(dateMatch[2] || '');
  const dateYear = dateMatch[3] ? year : 2024;
  const daysInMonth = monthIndex >= 0 ? new Date(dateYear, monthIndex + 1, 0).getDate() : 0;
  if (dateMatch[1] && (monthIndex < 0 || Number(dateMatch[1]) < 1 || Number(dateMatch[1]) > daysInMonth)) {
    sbWarn('INVALID SALES REPORT DATE');
    return;
  }
  const requestedDateKey = dateMatch[1] && dateMatch[3]
    ? `${year}-${String(monthIndex + 1).padStart(2, '0')}-${dateMatch[1]}`
    : (!dateMatch[1] ? sbSalesDateKey() : '');
  const displayDate = dateMatch[3] ? `${requestedLabel}${dateMatch[3]}` : requestedLabel;

  sbPrint('DAILY SALES REPORT - DQB*');
  sbPrint(`AGENT: ${sbState.agentSine}/${sbState.officeId}      DATE: ${displayDate}`);
  sbPrint('----------------------------------------------------------------------');
  sbPrint('TKT NO         PAX NAME              FORM/PAY    BASE        TAX       TOTAL');

  let allSales = sbLoadTicketSales();
  // Recover a currently loaded ticket once if it predates the sales ledger.
  if ((!requestedDateKey || requestedDateKey === sbSalesDateKey()) && requestedLabel === sbGetSabreDate() && sbState.ticketed && sbState.eticketNumber) {
    sbRecordTicketSales(sbState);
    allSales = sbLoadTicketSales();
  }
  const sales = allSales.filter(sale => requestedDateKey
    ? sale.issueDate === requestedDateKey || (!sale.issueDate && (sale.issueDateLabel || sbGetSabreDate()) === requestedLabel)
    : (sale.issueDateLabel || (sale.issueDate ? `${sale.issueDate.slice(8, 10)}${['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'][Number(sale.issueDate.slice(5, 7)) - 1]}` : sbGetSabreDate())) === requestedLabel);

  if (!sales.length) {
    sbPrint('NO SALES RECORDED FOR THIS DATE');
    sbPrint('----------------------------------------------------------------------');
    sbPrint('TOTAL TICKETS: 0   CASH: 0   CREDIT: 0   TOTAL SALES: 0');
    return;
  }

  let totalBase = 0;
  let totalTax = 0;
  let grandTotal = 0;
  sales.forEach(s => {
    sbPrint(`${String(s.ticketNo || '').padEnd(14)} ${(s.pax || 'PASSENGER').slice(0, 20).padEnd(21)} ${(s.fop || 'CASH').padEnd(11)} ${String(s.base).padEnd(11)} ${String(s.tax).padEnd(9)} ${s.total}`);
    totalBase += Number(s.base) || 0;
    totalTax += Number(s.tax) || 0;
    grandTotal += Number(s.total) || 0;
  });
  sbPrint('----------------------------------------------------------------------');
  sbPrint(`TOTAL TICKETS: ${sales.length}   TOTAL BASE: ${totalBase}   TAX: ${totalTax}   TOTAL SALES: ${grandTotal}`);
}

/* ---------------------------------------------------------------------
   Journey Record (JR) — Sabre 2025 Lecture Sheet:
   • JR                                              → Interactive mask
   • JR.JED/S-OYBOM15MAY                             → One-way search
   • JR.JED/S-OYBOM15MAY/S-OYJED25MAY/P-2ADT1C05     → RT search
--------------------------------------------------------------------- */
function cmdJR(raw) {
  const upper = raw.trim().toUpperCase();
  if (upper === 'JR') {
    if (typeof cmdFareShopJR === 'function') return cmdFareShopJR();
  }



  const m = upper.match(/^JR\.([A-Z]{3})\/S-O?([A-Z])([A-Z]{3})(\d{2}[A-Z]{3})(?:\/S-O?([A-Z])([A-Z]{3})(\d{2}[A-Z]{3}))?(?:\/P-(.*))?$/);
  if (m) {
    const org = m[1];
    const cls = m[2];
    const dst = m[3];
    const date = m[4];
    sbPrint('BARGAIN FINDER PLUS / JOURNEY RECORD SEARCH');
    sbPrint(`OUTBOUND: ${date} ${org} TO ${dst} CLASS ${cls}`);
    if (m[5]) {
      sbPrint(`INBOUND:  ${m[7]} ${m[6]} TO ${org} CLASS ${m[5]}`);
    }
    if (m[8]) {
      sbPrint(`PASSENGERS: ${m[8]}`);
    }
    sbPrint('----------------------------------------------------------------------');
    const options = sbGenerateAvailability(org, dst, date);
    if (options && options.length) {
      options.slice(0, 3).forEach((opt, i) => {
        const leg = opt.legs[0];
        sbPrint(`OPTION ${i + 1}: ${leg.al} ${leg.fn} ${cls} ${date} ${leg.dep} ${leg.arr} ${leg.depT} ${leg.arrT}  FARE: BDT ${32000 + i * 4500}`);
      });
    }
    return;
  }
  if (typeof cmdFareShopJR === 'function') return cmdFareShopJR();
}

/* ---------------------------------------------------------------------
   Queue Management — Sabre 2025 Lecture Sheet:
   • QC/           → Count queues
   • Q/9           → Access Q9
   • QP/PCC100/11  → Place PNR in queue
--------------------------------------------------------------------- */
function cmdQueuePlace(raw) {
  const upper = raw.trim().toUpperCase();
  if (upper === 'QR') {
    sbPrint('PNR REMOVED FROM QUEUE');
    sbPrint('END OF QUEUE');
    return;
  }
  if (upper === 'QXI') {
    sbPrint('SIGNED OFF QUEUE');
    return;
  }
  if (upper === 'QC/' || upper === 'QC' || upper === 'Q/') {
    sbPrint('QUEUE COUNTS:');
    sbPrint('QUEUE  COUNT  CATEGORY/DESCRIPTION');
    sbPrint(`  0      ${sbState.locator ? '1' : '0'}    GENERAL QUEUE`);
    sbPrint('  9      2    CONFIRMATION QUEUE');
    sbPrint(` 14      ${sbState.ticketed ? '0' : (sbState.locator ? '1' : '0')}    TICKETING QUEUE`);
    sbPrint(' 50      0    SCHEDULE CHANGE');
    return;
  }
  if (/^Q\/\d+$/.test(upper)) {
    const qNum = upper.replace(/^Q\//, '');
    sbPrint(`WORKING QUEUE ${qNum} - 1 OF 2 PNRs`);
    if (sbState.locator) {
      sbPrint(`PNR ${sbState.locator} ACCESSED FROM QUEUE ${qNum}`);
      sbPrint(sbRenderPNR());
    } else {
      sbPrint('QUEUE 9 ENTRY: 1.1KHAN/ABDULLAH MR  MH 102 Y 20NOV DAC KUL HK1');
    }
    return;
  }
  if (upper.startsWith('QP/')) {
    const parts = upper.split('/');
    const pcc = parts[1] || 'PCC100';
    const qNum = parts[2] || '11';
    sbPrint(`PNR ${sbState.locator || 'ACTIVE'} PLACED ON QUEUE ${qNum} AT ${pcc}`);
    sbPrint(`${sbState.officeId}.${sbState.officeId}*ATW ${sbSabreFooterStamp()} ${sbState.locator || 'PNR'} H M`);
    return;
  }

  const qNum = raw.match(/^QS(\d+)$/)?.[1] || raw.match(/^QEP(?:(\d+))?$/)?.[1] || '14';
  sbPrint(`PNR ${sbState.locator || 'ACTIVE'} PLACED ON QUEUE ${qNum}`);
  sbPrint(`${sbState.officeId}.${sbState.officeId}*ATW ${sbSabreFooterStamp()} ${sbState.locator || 'PNR'} H M`);
}

/* ---------------------------------------------------------------------
   Display Commands — Sabre 2025 Lecture Sheet:
   • *A   → All PNR
   • *N   → Names only
   • *I   → Itinerary only
   • *P3D → Documents
   • *PQ  → Price Quotation
--------------------------------------------------------------------- */
function cmdDisplayName() {
  if (!sbState.names.length) { sbWarn('NO NAMES IN PNR'); return; }
  sbPrint('PASSENGER NAMES');
  sbState.names.forEach((n, i) => sbPrint(` 1.${i + 1}${n.raw}`));
}

function cmdDisplayItinerary() {
  if (!sbState.booked.length) { sbWarn('NO ITINERARY SEGMENTS'); return; }
  const weekDays = ['', 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  sbPrint('ITINERARY');
  sbState.booked.forEach((s, i) => {
    const dayName = weekDays[Number(s.day)] || '---';
    const dayOverTag = s.dayOver ? `+${s.dayOver}` : '';
    sbPrint(` ${i + 1} ${s.al.padEnd(4)} ${s.fn.padEnd(4)} ${s.cls} ${s.date} ${dayName}  ${s.dep} ${s.arr} ${s.status}  ${s.depT}  ${s.arrT}${dayOverTag}`);
  });
}

function cmdDisplayPhone() {
  if (!sbState.phones.length) { sbWarn('NO PHONE RECORD'); return; }
  sbPrint('PHONES');
  sbState.phones.forEach((p, i) => sbPrint(` ${i + 1}.${p.raw}`));
}

function cmdDisplayTicketing() {
  if (!sbState.ticketingArrangement) { sbWarn('NO TICKETING ARRANGEMENT'); return; }
  sbPrint('TICKETING ARRANGEMENT');
  sbPrint(` 1.${sbState.ticketingArrangement}`);
}

function cmdDisplayReceived() {
  if (!sbState.receivedFrom) { sbWarn('NO RECEIVED FROM'); return; }
  sbPrint(`RECEIVED FROM - ${sbState.receivedFrom}`);
}

function cmdDisplaySSR() {
  if (!sbState.ssrEntries.length) { sbWarn('NO SSR ENTRIES'); return; }
  sbPrint('SPECIAL SERVICE REQUESTS');
  sbState.ssrEntries.forEach((s, i) => sbPrint(` ${i + 1}.${typeof s === 'string' ? s : s.text}`));
}

function cmdDisplayDocs() {
  if (!sbState.documents.length) { sbWarn('NO APIS/DOCS/DOCO INFORMATION ON FILE — ADD WITH 3DOCS/P/... OR 3DOCO/...'); return; }
  sbPrint('SEC TRAVELER DOC');
  sbState.documents.forEach((doc, index) => {
    const paxRef = doc.paxRef || 1;
    const passengerNumber = doc.subjectPaxRef || paxRef;
    const pax = sbState.names[passengerNumber - 1]?.raw || 'PASSENGER';
    const code = doc.code || 'DOCS';
    const text = doc.raw.replace(new RegExp(`^${code}\\/`, 'i'), '').replace(/-\d+\.\d+$/, '');
    sbPrint(` ${index + 1}.SSR ${code} ${doc.carrier} HK1/${text}  ${passengerNumber}.1 ${pax}`);
  });
}

function cmdDisplayPassengerDetail() {
  if (!sbState.names.length) { sbWarn('NO PASSENGER DATA ON FILE'); return; }
  sbPrint('PASSENGER DETAIL');
  sbState.names.forEach((pax, index) => {
    sbPrint(`PAX ${index + 1}: ${pax.raw}`);
    const doc = sbState.documents.find(d => (d.subjectPaxRef || d.paxRef) === index + 1);
    if (doc) sbPrint(`  DOC: ${doc.raw}`);
  });
}

function sbPaxHasMatchingTypeSsr(pax, paxRef, code) {
  return (sbState.ssrEntries || []).some(entry => {
    const text = (typeof entry === 'string' ? entry : (entry.text || ''))
      .replace(/^SSR\s+/i, '');
    const typePattern = code === 'INFT' ? /^INFT\d*\//i : /^CHLD\//i;
    if (!typePattern.test(text)) return false;

    const associationRef = Number(typeof entry === 'string' ? 1 : (entry.paxRef || 1));
    if (code === 'CHLD' && associationRef !== paxRef) return false;
    if (code === 'INFT') {
      const associatedAdult = sbSeatedPaxByRef(associationRef);
      const infantName = `${pax.surname}/${pax.first}`.replace(/\s+/g, ' ').toUpperCase();
      const infantFields = text.replace(/^INFT\d*\//i, '').split('/');
      const ssrGivenName = (infantFields[1] || '').replace(/\s+(?:MR|MRS|MS|MSTR|MISS|DR)$/i, '');
      const ssrName = `${infantFields[0]}/${ssrGivenName}`
        .replace(/\s+/g, ' ').toUpperCase();
      if (!associatedAdult || associatedAdult.paxType === 'INF' ||
          associatedAdult.paxType === 'CHD' || ssrName !== infantName ||
          (pax.associatedAdultRef && pax.associatedAdultRef !== associationRef)) return false;
    }

    const dob = text.match(/(\d{1,2}[A-Z]{3}\d{2,4})/i)?.[1];
    const ageInfo = sbCalculateAgeFromDob(dob);
    if (!ageInfo) return false;

    const isInfant = code === 'INFT';
    if (isInfant
      ? ageInfo.totalMonths >= 24
      : ageInfo.years < 2 || ageInfo.years >= 12) return false;
    return true;
  });
}

/* ---------------------------------------------------------------------
   Printer Assignment
--------------------------------------------------------------------- */
function cmdPrinterWorkArea() {
  sbPrint('WORK AREA PRINTER STATUS');
  sbPrint(`CURRENT PRINTER ASSIGNED: ${sbState.printerId ? sbState.printerId : 'NONE'}`);
}
function cmdPrinterAssign(raw) {
  const id = raw.slice(4).trim().toUpperCase();
  if (!id) { sbWarn('FORMAT: DSIV<PRINTER ID>'); return; }
  sbState.printerId = id;
  sbState.printerAssigned = true;
  sbPrint(`PRINTER ${id} ASSIGNED TO WORK AREA`);
}
function cmdPrinterDesignate(raw) {
  const id = raw.slice(4).trim().toUpperCase();
  if (!id) { sbWarn('FORMAT: PTR/<PRINTER ID>'); return; }
  if (!sbState.printerAssigned || !sbState.printerId) {
    sbWarn('PRINTER NOT ASSIGNED - ENTER DSIV<PRINTER ID> FIRST');
    return;
  }
  if (sbState.printerId && sbState.printerId !== id) {
    sbWarn(`PRINTER ${id} DOES NOT MATCH ASSIGNED PRINTER ${sbState.printerId}`);
    return;
  }
  sbState.printerId = id;
  sbState.printerDesignated = true;
  sbPrint(`PRINTER ${id} DESIGNATED FOR TICKETING`);
}

/* ---------------------------------------------------------------------
   End / Ignore / Redisplay
--------------------------------------------------------------------- */
function cmdEndTransaction(redisplay) {
  if (!sbState.names.length && !sbState.booked.length) {
    sbWarn('NO CURRENT ITINERARY OR PASSENGER — NOTHING TO STORE');
    return;
  }
  if (!sbState.names.length) { sbWarn('NAME REQUIRED — ENTER -<SURNAME>/<FIRSTNAME>'); return; }
  if (!sbState.phones.length) { sbWarn('PHONE REQUIRED — ENTER 9<PHONE>'); return; }
  if (!sbState.ticketingArrangement) { sbWarn('TICKETING ARRANGEMENT REQUIRED — ENTER 7TAW/ OR 7T-'); return; }
  if (!sbState.receivedFrom) { sbWarn('RECEIVED FROM REQUIRED — ENTER 6<NAME>'); return; }
  if (sbState.receivedFromRequired) { sbWarn('RECEIVED FROM REQUIRED AFTER PNR CHANGE — ENTER 6<NAME>, THEN ER'); return; }
  // During an exchange, XI legitimately leaves a ticketed PNR with no
  // itinerary for a moment. Sabre allows 6<name> + ER to save that
  // cancellation before the replacement segment is sold.
  const savingReissueCancellation = sbState.ticketed && sbState.reissueNeedsPricing;
  if (!sbState.booked.length && !savingReissueCancellation) {
    sbWarn('ITINERARY REQUIRED — SELL A SEGMENT FIRST');
    return;
  }

  // Verify child and infant age limits
  for (const p of (sbState.names || [])) {
    if (p.paxType === 'CHD') {
      const c = parseInt(p.age, 10);
      if (!p.age || c < 2 || c >= 12) {
        sbPrint('VERIFY AGE - CHILD MUST BE 02-11 YEARS');
        return;
      }
    }
    if (p.paxType === 'INF') {
      const m = parseInt(p.age, 10);
      if (!p.age || m < (p.dob ? 0 : 1) || m >= 24) {
        sbPrint('INFANT AGE DATA REQUIRED USE *I1/I01-*I23.NOT ENT BGNG WITH');
        return;
      }
    }
  }

  // Party size validation: Number of seated names must equal reserved seats
  const seatedPaxCount = (sbState.names || []).filter(n => n.paxType !== 'INF').length;
  let reservedSeats = 0;
  for (const seg of (sbState.booked || [])) {
    const m = (seg.status || '').match(/^(?:SS|HK)(\d+)/);
    if (m) {
      reservedSeats = parseInt(m[1], 10);
      break;
    }
  }
  if (reservedSeats > 0 && seatedPaxCount !== reservedSeats) {
    sbPrint('NUMBER OF NAMES NOT EQUAL TO RESERVATIONS');
    return;
  }

  // Child / Infant DOB SSR validation
  const errMessages = [];
  (sbState.names || []).forEach(pax => {
    const pnrPaxRef = sbPnrRefForPax(pax);
    if (pax.paxType === 'CHD' && !sbPaxHasMatchingTypeSsr(pax, pnrPaxRef, 'CHLD')) {
      errMessages.push(`CHILD DOB/AGE SSR REQUIRED FOR PAX ${pnrPaxRef} - ENTER 3CHLD/<DOB>-${pnrPaxRef}`);
    }
    if (pax.paxType === 'INF' && !sbPaxHasMatchingTypeSsr(pax, pnrPaxRef, 'INFT')) {
      const adultRef = pax.associatedAdultRef || 1;
      errMessages.push(`INFANT DOB/AGE SSR REQUIRED — LINK TO ADULT PAX ${adultRef} WITH 3INFT/...-${adultRef}.1`);
    }
  });

  if (errMessages.length > 0) {
    if (typeof sbPrintSsrError === 'function') {
      sbPrintSsrError(errMessages);
    } else {
      errMessages.forEach(m => sbPrint(m, 'line-warn'));
    }
    if (typeof sbOpenChdInfPrompt === 'function') {
      sbOpenChdInfPrompt(true);
    }
    return;
  }

  if (!sbState.locator) {
    sbState.locator = sbRandomLocator();
    sbState.dateStamp = sbSabreFooterStamp();
  }
  sbState.ended = true;
  sbState.booked.forEach(s => {
    s.status = s.status.replace(/^SS/, 'HK');
  });

  if (sbState.pqPending) {
    sbState.pqPending = false;
    sbState.pqStoredInPNR = true;
  }
  sbPnrStorePut(sbState);
  sbPrint(sbState.locator);
  if (redisplay) {
    sbPrint('RECORD LOCATOR REQUESTED');
    sbPrint(sbRenderPNR(true));
    if (typeof sbPrintDcMessage === 'function') {
      sbPrintDcMessage();
    }
  }
  sbSyncSidePanel();
}

function cmdRedisplay() {
  sbPrint(sbRenderPNR(false));
}

function cmdIgnore() {
  // Ignore must also dismiss any interactive FareShop work area.  Leaving its
  // markup behind makes the next JR/FARESHOP command focus the stale mask
  // instead of opening a fresh one.
  if (typeof sbCloseJrMask === 'function') sbCloseJrMask({ silent: true });
  sbState = sbEmptyState();
  sbPrint('OK');
  sbSyncSidePanel();
}

function cmdIgnoreRedisplay() {
  if (sbState.locator) {
    const store = sbPnrStoreLoad();
    if (store[sbState.locator]) {
      sbState = JSON.parse(JSON.stringify(store[sbState.locator]));
      sbPrint(sbState.locator);
      sbPrint(sbRenderPNR(false));
      sbSyncSidePanel();
      return;
    }
  }
  sbState = sbEmptyState();
  sbPrint('OK');
  sbSyncSidePanel();
}

function cmdPqDelete(raw) {
  if (!sbState.fareQuote && !sbState.pqPriced && !sbState.pqPending && !sbState.pqStoredInPNR) {
    sbWarn('NO PRICE QUOTE RECORD EXISTS');
    return;
  }
  sbState.fareQuote = null;
  sbState.privateFare = null;
  sbState.pqPriced = false;
  sbState.pqPending = false;
  sbState.pqStoredInPNR = false;
  if (typeof sbPnrStorePut === 'function' && sbState.locator) sbPnrStorePut(sbState);
  sbPrint(String(raw || '').toUpperCase() === 'PQD-ALL'
    ? 'DONE'
    : 'PRICE QUOTE RECORD DELETED');
}

function cmdRefund(raw) {
  const command = String(raw || '').trim().toUpperCase();
  if (command === 'RFND') {
    sbWarn('RFND NO LONGER VALID - USE WFR/WFRR-0182');
    return;
  }
  sbWarn('REFUND COMMAND NOT VALID - USE WFR/WFRR-0182');
}

function cmdPricePartialRefund() {
  if (!sbState.ticketed || !sbState.eticketNumber) { sbWarn('NO TICKET RECORD EXISTS'); return; }
  const coupons = sbState.ticketCoupons || [];
  const used = coupons.some(coupon => /USED|FLOWN/.test(coupon.ticketStatus || ''));
  const refundable = coupons.some(coupon => /OPEN|ACTL|OK/.test(coupon.ticketStatus || ''));
  if (!used || !refundable) { sbWarn('PARTIAL REFUND REQUIRES AT LEAST ONE USED AND ONE OPEN COUPON'); return; }
  if (!sbState.partialRefundPractice) { sbWarn('AUTOMATED REFUND PRICING IS AVAILABLE FOR THE PARTIAL REFUND PRACTICE PNR'); return; }
  sbState.refundQuote = { currency: 'QAR', fare: 1080, tax: 350, cancelFee: 240, total: 1190, nonRefundableTax: '10.00YR' };
  sbState.refundMaskOpen = false;
  const q = sbState.refundQuote;
  const name = sbState.names[0]?.raw || 'PASSENGER';
  sbPrint('REFUND PRICE RESPONSE');
  sbPrint(`NAME ${name}     TOTAL REFUND ${q.currency} ${q.total.toFixed(2)}`);
  sbPrint(`TKT ${String(sbState.eticketNumber).replace(/-/g, '')}`);
  sbPrint('');
  coupons.forEach((coupon, index) => {
    const status = /USED|FLOWN/.test(coupon.ticketStatus || '') ? 'USED' : 'OK';
    sbPrint(`${index + 1} ${coupon.al} ${coupon.fn} ${coupon.cls} ${coupon.date} ${coupon.dep}${coupon.arr} ${status}`);
  });
  sbPrint(`REFUND AMOUNTS - ${q.currency}`);
  sbPrint(`FARE             ${q.fare.toFixed(2)}`);
  sbPrint(`TAX               ${q.tax.toFixed(2)}`);
  sbPrint(`CANCEL FEE       -${q.cancelFee.toFixed(2)}`);
  sbPrint(`TTL REFUND       ${q.total.toFixed(2)}`);
  sbPrint('REFUNDABLE TAX BREAKDOWN');
  sbPrint('200.00YQ        10.00PZ        10.00T2        100.00OM');
  sbPrint('30.00S6');
  sbPrint('NON REFUNDABLE TAX BREAKDOWN 10.00YR');
  sbPrint('ENTER MD TO REVIEW MANUAL REFUND MASK');
}

function cmdOpenManualRefundMask() {
  if (!sbState.refundQuote) { sbWarn('PRICE THE PARTIAL REFUND FIRST (WFRATR2)'); return; }
  sbState.refundMaskOpen = true;
  const q = sbState.refundQuote;
  sbPrint('MD - MANUAL REFUND MASK');
  sbPrint(`REFUND FARE ${q.currency} ${q.fare.toFixed(2)}   TAX ${q.currency} ${q.tax.toFixed(2)}`);
  sbPrint(`CANCEL FEE ${q.currency} -${q.cancelFee.toFixed(2)}   TOTAL REFUND ${q.currency} ${q.total.toFixed(2)}`);
  sbPrint('NON REFUNDABLE TAX BREAKDOWN');
  sbPrint(q.nonRefundableTax);
  sbPrint('COMM TO REFUND  0.0 PCT');
  sbPrint('TOUR CODE');
  sbPrint('FOP CASH');
  sbPrint('REVIEW THE AMOUNTS, THEN ENTER WFRATR2/REF TO PROCESS');
}

function cmdProcessPartialRefund() {
  if (!sbState.refundQuote || !sbState.refundMaskOpen) { sbWarn('ENTER WFRATR2 THEN MD BEFORE PROCESSING THE REFUND'); return; }
  const q = sbState.refundQuote;
  sbState.refunded = true;
  sbState.refundTransaction = { ...q, type: 'partial', processed: true, ticket: String(sbState.eticketNumber).replace(/-/g, '') };
  sbState.ticketCoupons = (sbState.ticketCoupons || []).map(coupon =>
    /OPEN|ACTL|OK/.test(coupon.ticketStatus || '') ? { ...coupon, ticketStatus: 'REFUNDED' } : coupon
  );
  sbState.refundMaskOpen = false;
  sbPrint('REFUND TRANSACTION PROCESSED');
  sbPrint('REFUND ACCOUNTING DATA CREATED IN ACTIVE PNR');
  sbPrint('ETR REFUND TRANSACTION PROCESSED');
  sbPrint(`REFUND ${q.currency} ${q.total.toFixed(2)} TKT ${sbState.refundTransaction.ticket}`);
  if (typeof sbPnrStorePut === 'function') sbPnrStorePut(sbState);
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

function cmdOpenUnusedRefundMask(raw = 'WFRTR3') {
  if (!sbState.ticketed || !sbState.eticketNumber) { sbWarn('NO TICKET RECORD EXISTS'); return; }
  if (!sbState.unusedRefundPractice || (sbState.ticketCoupons || []).some(coupon => !/OPEN|ACTL|OK/.test(coupon.ticketStatus || ''))) {
    sbWarn('WFRTR3 PRACTICE REQUIRES A TOTALLY UNUSED TICKET');
    return;
  }
  const ticketMatch = String(raw || '').toUpperCase().match(/^WFR(\d+)/);
  if (ticketMatch && ticketMatch[1] !== String(sbState.eticketNumber).replace(/-/g, '')) {
    sbWarn('TICKET NUMBER DOES NOT MATCH THE ACTIVE PRACTICE TICKET');
    return;
  }
  sbState.unusedRefundMask = { stage: 'coupons', codes: [], currency: 'BDT', fare: 61000, taxes: 9881, fee: null, refund: 70881, commissionPct: null, fop: null, refundConfirmed: false };
  sbPrint('WF WFR - EXCH DATABASE TKT - ELECTRONIC / SCREEN 10');
  sbPrint(`TICKET ${String(sbState.eticketNumber).replace(/-/g, '')}  NAME ${sbState.names[0]?.raw || 'PASSENGER'}`);
  sbPrint('ENTER A VALID TRANSACTION CODE: X-EXCH / R-REFUND / F-FLOWN');
  (sbState.ticketCoupons || []).forEach((coupon, index) => {
    sbPrint(`${index + 1} ${coupon.al} ${coupon.fn} ${coupon.cls} ${coupon.date} ${coupon.dep}${coupon.arr} ${coupon.ticketStatus}  CODE [ ]`);
  });
  sbPrint(`BASE USD 500.00  EQV ${sbState.unusedRefundMask.currency} 61000  TTL ${sbState.unusedRefundMask.currency} 70881`);
  sbPrint('ENTER R1 TO MARK THE UNUSED COUPON FOR REFUND, THEN NEXT');
}

function cmdSelectUnusedRefundCoupons(raw) {
  const mask = sbState.unusedRefundMask;
  if (!mask || mask.stage !== 'coupons') { sbWarn('OPEN THE UNUSED-TICKET REFUND MASK FIRST (WFRTR3)'); return; }
  const match = String(raw || '').toUpperCase().match(/^R(\d+)(?:-(\d+))?$/);
  if (!match) { sbWarn('FORMAT: R1-2 TO MARK COUPONS 1 THROUGH 2 FOR REFUND'); return; }
  const start = Number(match[1]);
  const end = Number(match[2] || match[1]);
  if (start < 1 || end > sbState.ticketCoupons.length || end < start) { sbWarn('INVALID REFUND COUPON RANGE'); return; }
  for (let n = start; n <= end; n++) {
    const coupon = sbState.ticketCoupons[n - 1];
    if (!/OPEN|ACTL|OK/.test(coupon.ticketStatus || '')) { sbWarn(`COUPON ${n} IS NOT UNUSED`); return; }
    mask.codes[n - 1] = 'R';
  }
  sbPrint(`REFUND CODE R ENTERED FOR COUPON${start === end ? ` ${start}` : `S ${start}-${end}`}`);
}

function cmdNextUnusedRefundScreen() {
  const mask = sbState.unusedRefundMask;
  if (!mask) return false;
  if (mask.stage === 'coupons') {
    if ((sbState.ticketCoupons || []).some((coupon, index) => mask.codes[index] !== 'R')) {
      sbWarn('ENTER REFUND CODE R FOR EACH UNUSED COUPON BEFORE NEXT');
      return true;
    }
    mask.stage = 'summary';
    sbPrint('WF WFR - COMPARISON SUMMARY / SCREEN 30');
    sbPrint('REISSUE PLACE DOH');
    sbPrint(`EXCHANGE ${mask.currency} 1420.00   REISSUE CUR ${mask.currency}`);
    sbPrint(`BASE                         520.00        -520.00`);
    sbPrint(`TTL TAXES                    900.00        -900.00`);
    sbPrint(`TOTAL                       1420.00       -1420.00`);
    sbPrint('CHG FEE AMOUNT                              [          ]');
    sbPrint(`TOTAL REFUND                                -${mask.refund.toFixed(2)}`);
    sbPrint('ENTER FEE/8540 (SAMPLE CANCELLATION FEE), THEN NEXT');
    return true;
  }
  if (mask.stage === 'summary') {
    if (!Number.isFinite(mask.fee)) {
      sbWarn('ENTER THE CANCELLATION FEE (FEE/8540 IN THIS PRACTICE) BEFORE NEXT');
      return true;
    }
    mask.stage = 'taxes';
    sbPrint('WF WFRST - TAX COMPARISON SUMMARY / SCREEN 31');
    sbPrint('BASE BDT       TAX');
    sbPrint('500.00         BD                         -500.00');
    sbPrint('9381.00        XT                        -9381.00');
    sbPrint('TTL 9881.00                               -9881.00');
    sbPrint('TAX UPDATE: X   ENTER NEXT TO CONTINUE');
    return true;
  }
  if (mask.stage === 'taxes') {
    mask.stage = 'refund-info';
    sbPrint('WF WFR - REFUND INFORMATION / SCREEN 32');
    sbPrint(`TKT ${String(sbState.eticketNumber).replace(/-/g, '')}`);
    sbPrint('D-DOMESTIC REFUND / I-INTERNATIONAL / T-TRANSBORDER REFUND: I');
    sbPrint('COMMISSION ON REFUND AMT [ ] OR PCT [ ]');
    sbPrint('COMMISSION ON PENALTY AMT [ ]');
    sbPrint(`TOTAL REFUND DUE ${mask.currency} -${mask.refund.toFixed(2)}  CASH [ ]  CK [ ]  CC [ ]`);
    sbPrint('TOURCODE [ ]   INVOICE NBR [ ]   FREE TEXT [ ]   REFUND [ ]');
    sbPrint('ENTER COMM/7, FOP/CASH, REFUND/X, THEN ET');
    return true;
  }
  sbWarn('REFUND MASK IS READY - ENTER 6PSER TO PROCESS');
  return true;
}

function cmdSetUnusedRefundFee(raw) {
  const mask = sbState.unusedRefundMask;
  const match = String(raw || '').toUpperCase().match(/^FEE\/(\d+(?:\.\d{1,2})?)$/);
  if (!mask || mask.stage !== 'summary') { sbWarn('OPEN THE REFUND SUMMARY BEFORE ENTERING THE CANCELLATION FEE'); return; }
  if (!match) { sbWarn('FORMAT: FEE/8540'); return; }
  mask.fee = Number(match[1]);
  mask.refund = Math.max(0, mask.fare + mask.taxes - mask.fee);
  sbPrint(`CHG FEE AMOUNT ${mask.currency} ${mask.fee.toFixed(2)}`);
  sbPrint(`TOTAL REFUND ${mask.currency} -${mask.refund.toFixed(2)}`);
  sbPrint('ENTER NEXT TO REVIEW TAX COMPARISON');
}

function cmdSetUnusedRefundDetails(raw) {
  const mask = sbState.unusedRefundMask;
  if (!mask || mask.stage !== 'refund-info') { sbWarn('OPEN REFUND INFORMATION SCREEN 32 FIRST'); return; }
  const upper = String(raw || '').toUpperCase();
  let match = upper.match(/^COMM\/(\d+(?:\.\d+)?)$/);
  if (match) {
    mask.commissionPct = Number(match[1]);
    sbPrint(`COMMISSION ON REFUND AMT - PCT ${mask.commissionPct}`);
    return;
  }
  match = upper.match(/^FOP\/(CASH|CK|CC)$/);
  if (match) {
    mask.fop = match[1];
    sbPrint(`FORM OF PAYMENT ${mask.fop} [X]`);
    return;
  }
  if (upper === 'REFUND/X') {
    mask.refundConfirmed = true;
    sbPrint('REFUND [X]');
    sbPrint('ENTER ET TO PROCESS REFUND');
    return;
  }
  sbWarn('FORMAT: COMM/7, FOP/CASH, OR REFUND/X');
}

function cmdProcessUnusedRefund() {
  const mask = sbState.unusedRefundMask;
  if (!mask || mask.stage !== 'refund-info') { sbWarn('COMPLETE THE REFUND MASK THROUGH SCREEN 32 BEFORE PROCESSING'); return; }
  if (!mask.fop || !mask.refundConfirmed || mask.commissionPct === null) {
    sbWarn('ENTER COMMISSION, FORM OF PAYMENT, AND REFUND CONFIRMATION BEFORE ET');
    return;
  }
  sbState.refunded = true;
  sbState.refundTransaction = { currency: mask.currency, total: mask.refund, type: 'unused', processed: true, ticket: String(sbState.eticketNumber).replace(/-/g, '') };
  sbState.ticketCoupons = (sbState.ticketCoupons || []).map(coupon => ({ ...coupon, ticketStatus: 'REFUNDED' }));
  sbState.unusedRefundMask = null;
  sbPrint('MASK PROCESSING COMPLETE - MASK TERMINATED');
  sbPrint('REFUND TRANSACTION PROCESSED');
  sbPrint('REFUND ACCOUNTING DATA CREATED IN ACTIVE PNR');
  sbPrint('ETR REFUND TRANSACTION PROCESSED');
  if (typeof sbPnrStorePut === 'function') sbPnrStorePut(sbState);
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

function cmdOpenExchangeMask(raw) {
  const entry = String(raw || '').trim().toUpperCase().match(/^WFRF(\d{13})[\u00A5\u2628\u2021\u00A7]A([A-Z0-9]{2})$/);
  if (!sbState.ticketed || !sbState.eticketNumber) {
    sbWarn('NO OPEN TICKET ON FILE TO EXCHANGE');
    return;
  }
  if (!sbState.ended || sbState.receivedFromRequired) {
    sbWarn('PNR CHANGE NOT SAVED — ENTER 6<NAME>, THEN ER BEFORE REISSUE');
    return;
  }
  if (entry && entry[1] !== String(sbState.eticketNumber).replace(/-/g, '')) {
    sbWarn('TICKET NUMBER DOES NOT MATCH THE ACTIVE PNR');
    return;
  }
  if (!sbState.booked.length) {
    sbWarn('NEW ITINERARY REQUIRED - SELL THE REPLACEMENT FLIGHT FIRST');
    return;
  }
  const oldItinerary = sbState.issuedItinerary;
  const newItinerary = JSON.stringify(sbState.booked);
  if (!sbState.reissueNeedsPricing && oldItinerary === newItinerary) {
    sbWarn('NO ITINERARY CHANGE FOUND - REBOOK THE FLIGHT BEFORE REISSUE');
    return;
  }
  // The WFRF automated-exchange entry prices the revised itinerary itself,
  // matching the Sabre Red 360 lesson. WP remains available when a trainee
  // wants to inspect the fare before opening the exchange mask.
  if (sbState.reissueNeedsPricing || !sbState.reissuePricedFare) sbAutoPriceReissue();
  const oldFare = sbState.issuedFare || { base: 0, tax: 0, total: 0, currency: 'BDT' };
  const newFare = sbState.reissuePricedFare;
  const modeMatch = String(entry ? 'WFRFT' : raw || '').trim().toUpperCase().match(/^(WFRFT(?:R\d+\$\d+)?|WFR)(?:\/(\d+))?$/);
  const manual = modeMatch?.[1] === 'WFR';
  const configuredFee = sbState.reissueChangeFee;
  const automaticFee = configuredFee === null || configuredFee === undefined || configuredFee === ''
    ? 3265
    : (Number.isFinite(Number(configuredFee)) && Number(configuredFee) > 0 ? Number(configuredFee) : 3265);
  const fee = modeMatch?.[2] ? Number(modeMatch[2]) : (manual ? 50 : automaticFee);
  const fareCollect = Math.max(0, newFare.total - oldFare.total);
  const collect = manual ? fareCollect : Math.max(0, fareCollect + fee);
  const residual = Math.max(0, oldFare.total - newFare.total - (manual ? 0 : fee));
  const oldTicket = (sbState.eticketNumber || '').replace(/-/g, '');
  sbState.exchangeMask = {
    oldTicket, oldFare: JSON.parse(JSON.stringify(oldFare)),
    newFare: JSON.parse(JSON.stringify(newFare)), fee, collect, residual,
    fareCollect, manual, collectAsTax: false, collectInTotal: false, formEntered: false,
    stage: 'comparison', itinerary: JSON.stringify(sbState.booked), validatingCarrier: entry?.[2] || ''
  };
  if (manual && (sbState.ticketCoupons || []).some(coupon => /USED|EXCH|VOID|REFUND/.test(coupon.ticketStatus || ''))) {
    sbState.exchangeMask = null;
    sbWarn('MANUAL WFR PRACTICE REQUIRES A TOTALLY UNUSED TICKET');
    return;
  }
  sbPnrStorePut(sbState);
  sbRenderExchangeSummary(sbState.exchangeMask, sbState.booked[0]?.dep || 'DAC');
  return true;
}

function sbRenderExchangeSummary(mask, reissuePlace) {
  const term = document.getElementById('termArea');
  if (!term) return;
  term.querySelectorAll('.sb-exchange-screen').forEach(node => node.remove());
  const currency = mask.newFare.currency || mask.oldFare.currency || 'BDT';
  const amount = value => `${currency} ${Number(value || 0).toLocaleString('en-US')}`;
  const delta = (newValue, oldValue) => amount(Number(newValue || 0) - Number(oldValue || 0));
  const baseUsd = Number.isFinite(mask.oldFare.baseUsd)
    ? mask.oldFare.baseUsd
    : (Number(mask.oldFare.base || 0) / Number(mask.oldFare.rate || mask.newFare.rate || 122.25));
  const screen = document.createElement('section');
  screen.className = 'sb-exchange-screen';
  screen.innerHTML = `
    <div class="sb-exchange-title"><span>WF&nbsp;&nbsp;WFRR&nbsp;&nbsp;&nbsp; EXCHANGE SUMMARY</span><span>SCREEN 30</span></div>
    <div class="sb-exchange-place">REISSUE PLACE&nbsp;&nbsp; ${reissuePlace}</div>
    <div class="sb-exchange-base-usd">BASE USD&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ${baseUsd.toFixed(2)}</div>
    <div class="sb-exchange-matrix">
      <div></div><div>EXCHANGE</div><div>NEW AMT</div><div>REISSUE CUR</div>
      <div></div><div>${currency}</div><div>${currency}</div><div>${currency}</div>
      <div>EQV</div><div>${Number(mask.oldFare.base || 0).toLocaleString('en-US')}</div><div>${Number(mask.newFare.base || 0).toLocaleString('en-US')}</div><div>${delta(mask.newFare.base, mask.oldFare.base)}</div>
      <div>TTL TAXES</div><div>${Number(mask.oldFare.tax || 0).toLocaleString('en-US')}</div><div>${Number(mask.newFare.tax || 0).toLocaleString('en-US')}</div><div>${delta(mask.newFare.tax, mask.oldFare.tax)}</div>
      <div class="sb-exchange-total-label">TOTAL</div><div class="sb-exchange-total">${Number(mask.oldFare.total || 0).toLocaleString('en-US')}</div><div class="sb-exchange-total">${Number(mask.newFare.total || 0).toLocaleString('en-US')}</div><div class="sb-exchange-total">${delta(mask.newFare.total, mask.oldFare.total)}</div>
    </div>
    <div class="sb-exchange-fields">
      <div class="sb-exchange-field-row"><span>CHG FEE AMOUNT</span><input type="number" min="0" class="sb-exchange-input sb-exchange-edit-amount" aria-label="Change fee amount" value="${Number(mask.fee || 0)}"></div>
      <div class="sb-exchange-field-row"><span>COLLECT FEE AS TAX</span><input maxlength="2" class="sb-exchange-input sb-exchange-check sb-exchange-edit-collect-tax-code" aria-label="Collect fee as tax code" value="${mask.collectAsTaxCode || ''}"><span>FEE TAX CODE/AMT</span><input maxlength="2" class="sb-exchange-input sb-exchange-check sb-exchange-edit-tax-code" aria-label="Fee tax code" value="${mask.feeTaxCode || ''}"><input type="number" min="0" class="sb-exchange-input sb-exchange-wide sb-exchange-edit-tax-amount" aria-label="Fee tax amount" value="${mask.collectAsTax ? Number(mask.fee || 0) : ''}"></div>
      <div class="sb-exchange-field-row"><span>COLLECT FEE IN TTL</span><input maxlength="1" class="sb-exchange-input sb-exchange-check sb-exchange-edit-check" data-exchange-field="collectInTotal" aria-label="Select collect fee in total" value="${mask.collectInTotal ? 'X' : ''}"><span>FEE TAX CODE/AMT</span><input maxlength="2" class="sb-exchange-input sb-exchange-check sb-exchange-edit-ttl-code" aria-label="Total fee tax code" value="${mask.ttlTaxCode || ''}"><input type="number" min="0" class="sb-exchange-input sb-exchange-wide sb-exchange-edit-ttl-amount" aria-label="Total fee tax amount" value="${mask.collectInTotal ? Number(mask.fee || 0) : ''}"></div>
      <div class="sb-exchange-grand-total"><span>TOTAL ADD COLLECT</span><span>${amount(mask.collect)}</span></div>
    </div>
    <div class="sb-exchange-options"><span>TAX COMPARISON <input maxlength="1" class="sb-exchange-input sb-exchange-check sb-exchange-edit-check" data-exchange-field="taxComparison" aria-label="Tax comparison" value="${mask.taxComparison ? 'X' : ''}"></span><span>MULTIDOCS <input maxlength="1" class="sb-exchange-input sb-exchange-check sb-exchange-edit-check" data-exchange-field="multidocs" aria-label="Multidocs" value="${mask.multidocs ? 'X' : ''}"></span></div>
    <div class="sb-exchange-actions"><span>NEXT <input maxlength="1" class="sb-exchange-input sb-exchange-check sb-exchange-edit-check" data-exchange-field="nextSelected" aria-label="Next screen" value="${mask.nextSelected ? 'X' : ''}"></span><span>VIEW FARE CALCULATION <input maxlength="1" class="sb-exchange-input sb-exchange-check sb-exchange-edit-check" data-exchange-field="viewFareCalculation" aria-label="View fare calculation" value="${mask.viewFareCalculation ? 'X' : ''}"></span><span>QUIT <input maxlength="1" class="sb-exchange-input sb-exchange-check sb-exchange-edit-check" data-exchange-field="quitSelected" aria-label="Quit exchange mask" value="${mask.quitSelected ? 'X' : ''}"></span></div>
    <div class="sb-exchange-warning">REISSUE PRICE NOT GUARANTEED UNTIL RE-TICKETED</div>
    <div class="sb-exchange-prompt">${sbState.reissueTrainingNewFare
      ? 'LOWER FARE FOUND - QUIT TO REBOOK 1D'
      : `LAST DATE TO PURCHASE ${String(sbState.ticketingArrangement || '').replace(/^TAW-?/, '').replace(/\/$/, '')}`}</div>`;
  term.appendChild(screen);
  screen.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    sendCmd();
  });
  term.scrollTop = term.scrollHeight;
  sbPnrStorePut(sbState);
}

function cmdSubmitExchangeForm() {
  const mask = sbState.exchangeMask;
  const screen = document.querySelector('.sb-exchange-screen');
  if (!mask || !screen) return false;
  const field = name => (screen.querySelector(`[data-exchange-field="${name}"]`)?.value || '').trim().toUpperCase();
  const selected = name => field(name) === 'X';
  mask.fee = Math.max(0, Number(screen.querySelector('.sb-exchange-edit-amount')?.value || 0));
  mask.collectAsTaxCode = (screen.querySelector('.sb-exchange-edit-collect-tax-code')?.value || '').trim().toUpperCase();
  mask.collectAsTax = Boolean(mask.collectAsTaxCode);
  mask.collectInTotal = selected('collectInTotal');
  if (mask.collectAsTax && mask.collectInTotal) {
    sbWarn('SELECT ONLY ONE FEE COLLECTION OPTION');
    return true;
  }
  mask.taxComparison = selected('taxComparison');
  mask.multidocs = selected('multidocs');
  mask.nextSelected = selected('nextSelected');
  mask.viewFareCalculation = selected('viewFareCalculation');
  mask.quitSelected = selected('quitSelected');
  mask.feeTaxCode = (screen.querySelector('.sb-exchange-edit-tax-code')?.value || '').trim().toUpperCase();
  mask.ttlTaxCode = (screen.querySelector('.sb-exchange-edit-ttl-code')?.value || '').trim().toUpperCase();
  mask.feeTaxAmount = Math.max(0, Number(screen.querySelector('.sb-exchange-edit-tax-amount')?.value || 0));
  mask.ttlTaxAmount = Math.max(0, Number(screen.querySelector('.sb-exchange-edit-ttl-amount')?.value || 0));
  mask.formEntered = true;
  mask.collect = mask.manual ? mask.fareCollect : Math.max(0, mask.fareCollect + mask.fee);
  sbPnrStorePut(sbState);
  if (mask.quitSelected || mask.nextSelected || mask.taxComparison || mask.viewFareCalculation) {
    cmdNextExchangeScreen();
  } else {
    sbRenderExchangeSummary(mask, sbState.booked[0]?.dep || 'DAC');
  }
  return true;
}

function cmdNextExchangeScreen() {
  if (sbState.unusedRefundMask) return cmdNextUnusedRefundScreen();
  const mask = sbState.exchangeMask;
  if (!mask) { sbWarn('NO EXCHANGE MASK OPEN - ENTER WFR OR WFRFT FIRST'); return; }
  if (mask.itinerary !== JSON.stringify(sbState.booked)) {
    sbState.exchangeMask = null;
    sbWarn('ITINERARY CHANGED - REOPEN THE EXCHANGE MASK');
    return;
  }
  if (mask.quitSelected) {
    sbState.exchangeMask = null;
    sbPnrStorePut(sbState);
    document.querySelectorAll('.sb-exchange-screen').forEach(node => node.remove());
    sbPrint('EXCHANGE MASK QUIT');
    return;
  }
  document.querySelectorAll('.sb-exchange-screen').forEach(node => node.remove());
  if (mask.taxComparison) {
    mask.taxComparison = false;
    mask.stage = 'taxes';
    sbPnrStorePut(sbState);
    sbPrint('WF WFRST - TAX COMPARISON SUMMARY / SCREEN 31');
    sbPrint(`OLD TAXES ${mask.oldFare.currency || 'BDT'} ${Number(mask.oldFare.tax || 0).toLocaleString('en-US')}`);
    sbPrint(`NEW TAXES ${mask.newFare.currency || 'BDT'} ${Number(mask.newFare.tax || 0).toLocaleString('en-US')}`);
    sbPrint(`TAX DIFFERENCE ${mask.newFare.currency || 'BDT'} ${(Number(mask.newFare.tax || 0) - Number(mask.oldFare.tax || 0)).toLocaleString('en-US')}`);
    sbPrint('ENTER NEXT TO CONTINUE TO TICKETING INSTRUCTIONS');
    return;
  }
  if (mask.viewFareCalculation) {
    mask.viewFareCalculation = false;
    sbPnrStorePut(sbState);
    const currency = mask.newFare.currency || 'BDT';
    sbPrint('REISSUE FARE CALCULATION');
    sbPrint(mask.newFare.route || 'REPLACEMENT ITINERARY');
    sbPrint(`BASE ${currency} ${Number(mask.newFare.base || 0).toLocaleString('en-US')}  TAX ${currency} ${Number(mask.newFare.tax || 0).toLocaleString('en-US')}  TOTAL ${currency} ${Number(mask.newFare.total || 0).toLocaleString('en-US')}`);
    sbPrint('ENTER NEXT TO CONTINUE TO TICKETING INSTRUCTIONS');
    return;
  }
  mask.nextSelected = false;
  mask.stage = 'ticketing';
  sbPnrStorePut(sbState);
  if (mask.manual) {
    const currency = mask.newFare.currency || mask.oldFare.currency || 'BDT';
    sbPrint('WFR WFRKT - TICKETING INSTRUCTIONS / SCREEN 40');
    sbPrint(`${mask.fareCollect ? 'ADD COLLECT' : 'EVEN EXCHANGE'}   ${currency} ${mask.fareCollect || mask.fee} ${mask.fareCollect ? 'FARE' : 'CHANGE FEE'}`);
    sbPrint(`ADD COLL COMM AMT: ${currency} ${mask.fareCollect}`);
    sbPrint(`CHG FEE EMD: ${currency} ${mask.fee}`);
    sbPrint('COMM PCT: 0   TOURCODE:');
    sbPrint('FORM OF PAYMENT: CASH X');
    sbPrint('TKT: X   CHG FEE EMD: X');
    sbPrint('ENTER REISSUE TO ISSUE THE EXCHANGED TICKET AND CHANGE-FEE EMD');
    return;
  }
  sbRenderExchangeTicketing(mask);
}

function sbRenderExchangeTicketing(mask) {
  const term = document.getElementById('termArea');
  if (!term) return;
  const currency = mask.newFare.currency || mask.oldFare.currency || 'BDT';
  const baggage = sbState.booked[0]?.baggage || sbTrainingBaggageAllowance(sbState.booked[0]?.al);
  const screen = document.createElement('section');
  screen.className = 'sb-exchange-screen sb-ticketing-screen';
  screen.innerHTML = `
    <div class="sb-exchange-title"><span>WFR&nbsp;&nbsp;WFRKT - TICKETING INSTRUCTIONS</span><span>SCREEN 40</span></div>
    <div class="sb-ticketing-total">TOTAL ${currency} ${Number(mask.collect || 0).toLocaleString('en-US')} ADD COLLECT</div>
    <div class="sb-ticketing-row"><span>ADD COLL COMM AMT</span><input class="sb-exchange-input sb-exchange-wide" aria-label="Add collect commission amount"><span>COMM PCT</span><input maxlength="3" class="sb-exchange-input sb-exchange-check" aria-label="Commission percent"><span>TOURCODE</span><input class="sb-exchange-input sb-exchange-wide" aria-label="Tour code"></div>
    <div class="sb-ticketing-row"><span>BAG ALLOWANCE ${baggage}</span><span>VIEW/MODIFY BAG</span><input maxlength="1" class="sb-exchange-input sb-exchange-check" aria-label="View or modify baggage allowance"></div>
    <div class="sb-ticketing-row"><span>ENDORSEMENTS UPDATE</span><input class="sb-exchange-input sb-exchange-wide" aria-label="Endorsements update"></div>
    <div class="sb-ticketing-row">VALID ON ${mask.validatingCarrier || sbState.booked[0]?.carrier || 'BG'} ONLY/NONEND</div>
    <div class="sb-ticketing-row"><span>CASH</span><input maxlength="1" class="sb-exchange-input sb-exchange-check sb-ticketing-cash" aria-label="Cash form of payment"><span>CK</span><input maxlength="1" class="sb-exchange-input sb-exchange-check" aria-label="Cheque form of payment"><span>CC</span><input maxlength="1" class="sb-exchange-input sb-exchange-check" aria-label="Credit card form of payment"></div>
    <div class="sb-ticketing-row"><span>CC NBR</span><input class="sb-exchange-input sb-exchange-wide" aria-label="Credit card number"><span>CC EXP</span><input class="sb-exchange-input sb-exchange-check" aria-label="Credit card expiry"></div>
    <div class="sb-ticketing-row"><span>MANUAL APPROVAL</span><input class="sb-exchange-input sb-exchange-wide" aria-label="Manual approval"><span>SUPPRESS CC DATA ON INVOICE</span><input maxlength="1" class="sb-exchange-input sb-exchange-check" aria-label="Suppress credit card data on invoice"></div>
    <div class="sb-ticketing-row sb-ticketing-actions"><span>TKT</span><input maxlength="1" class="sb-exchange-input sb-exchange-check sb-ticketing-ticket" aria-label="Ticket exchange"><span>RETAIN</span><input maxlength="1" class="sb-exchange-input sb-exchange-check" aria-label="Retain"><span>PREV</span><input maxlength="1" class="sb-exchange-input sb-exchange-check" aria-label="Previous screen"><span>QUIT</span><input maxlength="1" class="sb-exchange-input sb-exchange-check" aria-label="Quit exchange"></div>
    `;
  term.appendChild(screen);
  // The terminal is horizontally scrollable for long host lines. Always
  // return a newly opened mask to column 1 so its left labels are not cut off.
  term.scrollLeft = 0;
  // Start at the title of Screen 40.  Scrolling to the bottom hid the first
  // rows (add-collect commission, tour code and baggage) from trainees.
  if (typeof screen.getBoundingClientRect === 'function' && typeof term.getBoundingClientRect === 'function') {
    const screenTop = screen.getBoundingClientRect().top - term.getBoundingClientRect().top;
    term.scrollTop = Math.max(0, term.scrollTop + screenTop - 4);
  } else {
    term.scrollTop = Math.max(0, Number(screen.offsetTop || 0) - 4);
  }
  screen.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    sendCmd();
  });
}

function cmdSubmitExchangeTicketingForm() {
  const screen = document.querySelector('.sb-ticketing-screen');
  const mask = sbState.exchangeMask;
  if (!screen || !mask || mask.stage !== 'ticketing') return false;
  const cash = (screen.querySelector('.sb-ticketing-cash')?.value || '').trim().toUpperCase();
  const ticket = (screen.querySelector('.sb-ticketing-ticket')?.value || '').trim().toUpperCase();
  if (cash !== 'X' || ticket !== 'X') {
    sbWarn('ENTER X IN CASH AND TKT TO COMPLETE THE EXCHANGE');
    return true;
  }
  document.querySelectorAll('.sb-ticketing-screen').forEach(node => node.remove());
  mask.formOfPayment = 'CASH';
  cmdReissue();
  return true;
}

function cmdReissue() {
  if (!sbState.exchangeMask) {
    return cmdOpenExchangeMask('WFRFT');
  }
  const mask = sbState.exchangeMask;
  if (mask.stage === 'ticketing' && document.querySelector('.sb-ticketing-screen') && !mask.formOfPayment) {
    sbWarn('COMPLETE SCREEN 40 — ENTER X IN CASH AND TKT, THEN PRESS SEND');
    return;
  }
  if (mask.manual && mask.stage !== 'ticketing') {
    sbWarn('ENTER NEXT TO REVIEW TICKETING INSTRUCTIONS BEFORE REISSUE');
    return;
  }
  if (mask.itinerary !== JSON.stringify(sbState.booked) || mask.oldTicket !== (sbState.eticketNumber || '').replace(/-/g, '')) {
    sbState.exchangeMask = null;
    sbWarn('EXCHANGE DETAILS CHANGED - ENTER WFRFT AGAIN');
    return;
  }
  const { oldTicket, newFare, fee, collect } = mask;
  const exchangeFareCollect = mask.manual ? mask.fareCollect : collect;
  const changeFeeEmd = mask.manual ? fee : 0;
  const oldCoupons = JSON.parse(sbState.issuedItinerary || '[]');
  const sameCoupon = (old, current) => old && current && ['al', 'fn', 'date', 'dep', 'arr', 'cls'].every(key => old[key] === current[key]);
  const exchangedCoupons = oldCoupons.filter((coupon, index) => !sameCoupon(coupon, sbState.booked[index]));
  const knownTickets = new Set([oldTicket, ...(sbState.ticketNumbers || []).map(ticket => String(ticket).replace(/-/g, ''))]);
  Object.values(typeof sbPnrStoreLoad === 'function' ? sbPnrStoreLoad() : {}).forEach(record => {
    (record.ticketNumbers || []).forEach(ticket => knownTickets.add(String(ticket).replace(/-/g, '')));
    if (record.exchangedTicketNo) knownTickets.add(String(record.exchangedTicketNo).replace(/-/g, ''));
  });
  let newTicket;
  do {
    newTicket = '618' + Math.floor(1000000000 + Math.random() * 8999999999).toString().slice(0, 10);
  } while (knownTickets.has(newTicket));
  sbPrint('MASK PROCESSING COMPLETE - MASK TERMINATED');
  sbPrint(`OK ${newFare.total + exchangeFareCollect}`);
  sbPrint('ETR EXCHANGE PROCESSED - REISSUED');
  sbPrint(`NEW TICKET ${newTicket}  (EXCHANGED FROM ${oldTicket})`);
  const emdNo = changeFeeEmd ? `EMD${Math.floor(1000000000 + Math.random() * 8999999999).toString().slice(0, 10)}` : null;
  if (emdNo) sbPrint(`CHANGE FEE EMD ${emdNo}  ${newFare.currency || 'BDT'} ${changeFeeEmd}`);
  sbState.exchangedTicketNo = oldTicket;
  sbState.reissueOriginalFare = JSON.parse(JSON.stringify(mask.oldFare || {}));
  sbState.exchangeCollect = exchangeFareCollect;
  sbState.changeFeeEmd = changeFeeEmd;
  sbState.changeFeeEmdNo = emdNo;
  sbState.eticketNumber = `618-${newTicket.slice(3)}`;
  sbState.ticketNumbers = [newTicket];
  sbState.ticketCoupons = sbState.booked.map(segment => {
    const prior = (sbState.ticketCoupons || []).find(coupon => sameCoupon(coupon, segment));
    return { ...segment, ticketStatus: prior?.ticketStatus || 'ACTL' };
  });
  sbState.exchangedCoupons = exchangedCoupons;
  sbState.issuedItinerary = mask.itinerary;
  sbState.issuedFare = JSON.parse(JSON.stringify(newFare));
  sbState.fareQuote = JSON.parse(JSON.stringify(newFare));
  sbRecordTicketSales(sbState);
  sbState.reissuePricedFare = null;
  sbState.reissueNeedsPricing = false;
  sbState.reissueInsertIndex = null;
  sbState.exchangeMask = null;
  sbState.invoiced = true;
  sbState.ended = true;
  if (typeof sbPnrStorePut === 'function') sbPnrStorePut(sbState);
  if (!window._sbGlobalExchanges) window._sbGlobalExchanges = [];
  window._sbGlobalExchanges.push({ oldTicket, newTicket, amount: exchangeFareCollect + changeFeeEmd });
  sbPrint(sbRenderPNR());
  sbSyncSidePanel();
}

function cmdChangeDocs(raw) {
  cmdSSR(raw);
}

function cmdHelp() {
  sbPrint('SABRE 2025 LECTURE SHEET COMMAND SUMMARY:');
  sbPrint('  AVAILABILITY: 120DECJEDAUH  120DECJEDAUH¥EY  120DECJEDAUH-Q');
  sbPrint('  SELL/ARNK:    0Y1  01Y1  0AA (ARNK)  ,3 (party size)');
  sbPrint('  MODIFY:       WCAJ (all to J)  WC1-2J/3-4Y  X1¤0025DEC (rebook)');
  sbPrint('  NAME:         -KHAN/ABDULLAH MR  -KHAN/SONIA MISS*C10  -I/KHAN/ALI MSTR*I17');
  sbPrint('  MANDATORY:    9<PHONE>  6P  7TAW/ or 7T-');
  sbPrint('  SSR/OSI:      3CTCM/<MOBILE>-1  3CTCE/<EMAIL>-1  3AVML2-1  3CHLD/...');
  sbPrint('  REMARKS:      5PSGR ADV FARE SAR 1500  *P5 (display)  51¤ (delete)');
  sbPrint('  FREQ FLYER:   FFGF123456-1  *FF (display)  FF1¤ (delete)');
  sbPrint('  EMAIL:        PE¥test@gmail.com¥-1  *PE (display)  PE1¤ (delete)');
  sbPrint('  SPLIT:        D2 (divide pax 2)  F (file)  ER');
  sbPrint('  CLONE:        IC (clone itn)  ICX1 (clone except seg 1)');
  sbPrint('  FARE QUOTE:   FQJEDKHI24JAN-SV');
  sbPrint('  FARE RULES:   WPRD* (full rules)  WPRD*M (menu)  WPRD*C16 (penalties)  WPRD*C19 (child/infant)');
  sbPrint('  PRICE/TICKET: WPABG  WPNCB  PQ  W¥PQ1¥AEY¥FCA¥KP0  WV2 (void)  WV* (report)');
  sbPrint('                WETR*2 (display electronic ticket record on TKT/TIME LIMIT line 2)');
  sbPrint('  REISSUE:      LOADREISSUE (no ADC) / LOADREISSUEADC (ADC)');
  sbPrint('                *T  WETR*2  PQD-ALL  IR  XI  1DDMMMCITYCITY  01C1  6NAME  ER');
  sbPrint('                WFRF<TICKET>¥A<CARRIER>¥N1.1  (OD + NEXT X)  (CASH X + TKT X)  *T  WETR*3  DQB*');
  sbPrint('                WFR manual unused-ticket mask; change fee collects on separate EMD');
  sbPrint('                LOADPARTIALREISSUE for one USED + one OPEN coupon practice');
  sbPrint('  REFUND:       LOADPARTIALREFUND  WFRATR2  MD  WFRATR2/REF  *T');
  sbPrint('                WFRATR2 auto-prices; MD reviews; /REF processes refund');
  sbPrint('                LOADUNUSEDREFUND  WFRTR3  R1  NEXT  FEE/8540  NEXT  NEXT');
  sbPrint('                COMM/7  FOP/CASH  REFUND/X  ET  *T (manual unused refund)');
  sbPrint('  SALES:        DQB* (today)  DQB*17JAN (last 30 days retained)');
  sbPrint('  CALENDAR:     T¤FEB  T¤25FEB¥80');
  sbPrint('  SIGN IN/OUT:  SI*1001  SO*');
  sbPrint('  ENCODE/DECODE:W/-CCDHAKA  W/*DAC  W/-APNARITA  W/-ALBIMAN BANGLADESH');
}

/* ---------------------------------------------------------------------
   PNR Local Storage Persistence
--------------------------------------------------------------------- */
function sbPnrStoreLoad() {
  try {
    const raw = localStorage.getItem('sabre_pnr_store');
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function sbPnrStoreSave(store) {
  try { localStorage.setItem('sabre_pnr_store', JSON.stringify(store)); } catch (e) {}
}
function sbPnrStorePut(state) {
  if (!state || !state.locator) return;
  const store = sbPnrStoreLoad();
  store[state.locator] = JSON.parse(JSON.stringify(state));
  sbPnrStoreSave(store);
}
function cmdRetrieve(raw) {
  const locator = raw.trim().toUpperCase().replace(/^\*/, '');
  const store = sbPnrStoreLoad();
  if (store[locator]) {
    sbState = JSON.parse(JSON.stringify(store[locator]));
    sbPrint(sbRenderPNR());
    if (sbState.exchangeMask?.stage === 'comparison') {
      if (!sbState.exchangeMask.formEntered) {
        Object.assign(sbState.exchangeMask, {
          collectAsTax: false, collectInTotal: false, taxComparison: false,
          multidocs: false, nextSelected: false, viewFareCalculation: false,
          quitSelected: false, feeTaxCode: '', ttlTaxCode: ''
        });
      }
      sbRenderExchangeSummary(sbState.exchangeMask, sbState.booked[0]?.dep || 'DAC');
    } else if (sbState.exchangeMask?.stage === 'ticketing') {
      const mask = sbState.exchangeMask;
      sbPrint('WFR WFRKT - TICKETING INSTRUCTIONS / SCREEN 40');
      sbPrint(`TOTAL ${mask.newFare.currency || 'BDT'} ${mask.collect} ADD COLLECT`);
      sbPrint('COMM PCT: 0   FORM OF PAYMENT: CASH   TKT: X');
      sbPrint('ENTER REISSUE TO COMPLETE EXCHANGE');
    }
    sbSyncSidePanel();
    return;
  }
  sbWarn(`RECORD LOCATOR ${locator} NOT FOUND`);
}
function cmdOpenAllPNR() {
  const store = sbPnrStoreLoad();
  const keys = Object.keys(store);
  if (!keys.length) { sbWarn('NO STORED PNRS FOUND'); return; }
  sbPrint('STORED PNRS:');
  keys.forEach((k, i) => {
    const p = store[k];
    const name = p.names?.[0]?.raw || 'NO NAME';
    sbPrint(` ${i + 1}. *${k} - ${name}`);
  });
}
function cmdSharePNR() {
  if (!sbState.locator) { sbWarn('NO ACTIVE SAVED PNR TO SHARE'); return; }
  const payload = btoa(JSON.stringify(sbState));
  const url = `${window.location.origin}${window.location.pathname}#pnr=${payload}`;
  sbPrint(`SHAREABLE PNR URL:`);
  sbPrint(url);
}

/* ---------------------------------------------------------------------
   PARSER — dispatch table, checked in order (most specific first)
--------------------------------------------------------------------- */
function sbParse(raw) {
  const cmd = raw.trim();
  if (!cmd) return;
  const upper = cmd.toUpperCase();
  if (upper === 'LOADREISSUE') return sbLoadReissuePracticePNR();
  if (upper === 'LOADREISSUEADC') return sbLoadReissueAdcPracticePNR();
  if (upper === 'LOADHALFREISSUE') return sbLoadHalfReissuePracticePNR();
  if (upper === 'LOADPARTIALREISSUE') return sbLoadPartialReissuePracticePNR();
  if (upper === 'LOADPARTIALREFUND') return sbLoadPartialRefundPracticePNR();
  if (upper === 'LOADUNUSEDREFUND') return sbLoadUnusedRefundPracticePNR();
  if (upper === 'DU*/SPM') return cmdDisplaySpecialMeals();

  // ── Journey Record (JR) — PDF: JR  JR.JED/S-OYBOM15MAY... ─────────────
  // JR0N (e.g. JR01, JR02, JR03) - Hold itinerary option from FareShop
  if (/^JR0\d+$/i.test(upper)) {
    const optNum = parseInt(upper.slice(3), 10);
    if (typeof sbSellBfmOption === 'function') {
      if (!sbSellBfmOption(optNum, 1)) sbWarn('NO ITINERARY OPTIONS AVAILABLE - RUN FARESHOP/JR FIRST');
    } else { sbWarn('NO ITINERARY OPTIONS AVAILABLE - RUN FARESHOP/JR FIRST'); }
    return;
  }
  if (/^\*?JR(?:\.|\s|$)/i.test(upper)) return cmdJR(upper.replace(/^\*/, ''));

  // ── Time Calculator — PDF: T¤FEB  T¤25FEB¥80 ─────────────────────────
  if (/^T[¤*]/i.test(upper)) return cmdTimeCalc(upper);

  // ── Sign In / Sign Out — PDF: SI*1001  SI1002  SO*  SO ───────────────
  if (/^SI\*?[0-9A-Z]*$/i.test(upper)) return cmdSignIn(upper);
  if (/^SO\*?$/i.test(upper)) return cmdSignOut(upper);

  // ── Encode / Decode — PDF: W/-CC... W/*... W/-AP... W/-AL... HCCC/...
  if (/^(?:W\/[-*]|W\/EQ|HCCC\/|HCC)/i.test(upper)) return cmdEncodeDecode(upper);

  // ── Printer assignment ───────────────────────────────────────────────
  if (/^W\*BD$/.test(upper)) return cmdPrinterWorkArea();
  if (/^DSIV[A-Z0-9]+$/.test(upper)) return cmdPrinterAssign(upper);
  if (/^PTR\/[A-Z0-9]+$/.test(upper)) return cmdPrinterDesignate(upper);

  // ── Issue Ticket — PDF: W¥PQ1¥AEY¥FCA¥KP0  WT  WTP ───────────────────
  if (/^W[¥☨‡§](?:PQ|ET)|^WT$|^WTP$/i.test(upper)) return cmdIssueTicket(upper.replace(/^W[¥☨‡§]ET$/, 'W¥PQ1¥ET'));

  // ── Void / Void Report — PDF: WV2  WV*  VOID ─────────────────────────
  if (/^WV\*$|^WV\d+$|^VOID$|^WV/i.test(upper)) return cmdVoidTicket(upper);

  // ── Sales Report — PDF: DQB*  DQB*17JAN ──────────────────────────────
  if (/^DQB\*/i.test(upper)) return cmdSalesReport(upper);

  // Fare pricing and rule display.
  if (/^WPRD\*/i.test(upper)) return cmdFareRules(upper);
  // ── Fare pricing & Quotes — PDF: WPABG  WP  WPNCB  FQJEDKHI24JAN-SV ──
  if (/^WPNCB$|^WPNI$/.test(upper)) return cmdPriceQuote();
  if (/^WPA(?:[A-Z0-9]{2}|\s+.+)?$/.test(upper) || /^WP$/i.test(upper)) return cmdWpa(upper);
  if (/^(?:WPQD\d*|PQD-ALL)$/.test(upper)) return cmdPqDelete(upper);
  if (/^FQ/i.test(upper)) return cmdFareQuote(upper);

  // ── PQ display & store — PDF: PQ  *PQ ─────────────────────────────────
  if (/^PQ$/i.test(upper)) return cmdPq();
  if (/^\*PQ(?:\s*\d+)?$|^\*PQS$|^3PQ$/i.test(upper)) return cmdDisplayPq();

  // ── Availability — PDF: 120DECJEDAUH  120DECJEDAUH¥EY  120DECJEDAUH-Q 
  if (/^1\d{2}[A-Z]{3}[A-Z]{6}|^1R(?:\d{2}[A-Z]{3})?$/i.test(upper)) return cmdAvailability(upper);

  // ── Sell flight / ARNK / Party — PDF: 0Y1  01Y1  0AA  ,3 ─────────────
  if (/^(?:0AA?|\/0A)$/i.test(upper)) return cmdSellARNK();
  if (/^0[A-Z0-9]{2}\d+[A-Z]\d{2}[A-Z]{3}[A-Z]{6}N{1,2}\d+$/i.test(upper)) return cmdSellLong(upper);
  if (/^0\d?[A-Z]\d+\*?$/i.test(upper)) return cmdSell(upper);
  if (/^(?:\.,|[,.])\d+$/i.test(upper)) return cmdChangeParty(upper.replace(/^[.,]+/, ''));

  // ── Modify Booking — PDF: WCAJ  WC1-2J/3-4Y  X1¤0025DEC ───────────────
  if (/^WCA[A-Z]$|^WC\d/i.test(upper)) return cmdChangeStatus(upper);
  if (/^X\d+(?:[\u00A4*\u00A5]|\u00C2\u00A5)0*\d{2}[A-Z]{3}$/i.test(upper)) return cmdRebookSegment(upper);

  // ── Name field — PDF: -KHAN/ABDULLAH MR  -KHAN/SONIA MISS*C10  -I/... 
  if (/^-/.test(upper)) return cmdName(upper);

  // ── Mandatory PNR fields — PDF: 9...  6P  7TAW/  7T- ─────────────────
  if (/^9/.test(upper)) return cmdPhone(upper);
  if (upper === '6PSER') return cmdProcessUnusedRefund();
  if (/^6/.test(upper)) return cmdReceivedFrom(upper);
  if (/^7/.test(upper)) return cmdTicketingArrangement(upper);

  // ── Frequent Flyer — PDF: FFGF123456-1  *FF  FF1¤ ────────────────────
  if (/^FF\d+[¤*]$|^FF[A-Z0-9]{2}/i.test(upper)) return cmdFF(upper);
  if (/^\*FF$/i.test(upper)) return cmdDisplayFF();

  // ── Email — PDF: PE¥email@gmail.com¥-1  *PE  PE1¤ ────────────────────
  if (/^PE\d+[¤*]$|^PE[¥☨‡§*]/i.test(upper)) return cmdEmail(upper);
  if (/^\*PE$/i.test(upper)) return cmdDisplayEmail();

  // ── Split PNR — PDF: D2  F  ER ───────────────────────────────────────
  if (/^D\d+$/i.test(upper)) return cmdDivide(upper);
  if (/^F$/i.test(upper)) return cmdFileSplit();

  // ── Clone PNR — PDF: IC  ICX1 ────────────────────────────────────────
  if (/^[IE]C|^[IE]CX/i.test(upper)) return cmdClone(upper.replace(/^EC/, 'IC'));

  // ── SSR / OSI / Docs — PDF: 3CTCM/...  3CTCE/...  3AVML2-1  32.XX ────
  if (/^3DOCS\//.test(upper) && sbState.documents.length) return cmdChangeDocs(upper);
  if (/^3/.test(upper)) return cmdSSR(upper);
  if (/^4\//.test(upper)) return cmdOSI(upper);

  // ── Remarks — PDF: 5PSGR ADV FARE SAR 1500  *P5  51¤ ─────────────────
  if (/^5/.test(upper)) return cmdRemarks(upper);

  // ── Void / Refund / Reissue ──────────────────────────────────────────
  if (/^(RFND|REFUND)$/.test(upper)) return cmdRefund(upper);
  if (upper === 'WFRTR3' || /^WFR\d+/.test(upper)) return cmdOpenUnusedRefundMask(upper);
  if (/^R\d+(?:-\d+)?$/.test(upper)) return cmdSelectUnusedRefundCoupons(upper);
  if (/^FEE\/\d+(?:\.\d{1,2})?$/.test(upper)) return cmdSetUnusedRefundFee(upper);
  if (/^(?:COMM\/\d+(?:\.\d+)?|FOP\/(?:CASH|CK|CC)|REFUND\/X)$/.test(upper)) return cmdSetUnusedRefundDetails(upper);
  if (upper === 'ET') return cmdProcessUnusedRefund();
  if (upper === 'WFRATR2') return cmdPricePartialRefund();
  if (/^WFRF\d{13}(?:[\u00A4\u00A5]|\u00C2\u00A5)A[A-Z0-9]{2}(?:(?:[\u00A4\u00A5]|\u00C2\u00A5)N\d+\.\d+)?$/i.test(upper)) {
    // N1.1 is an optional Sabre-style passenger qualifier. This practice
    // record has one passenger, so the exchange is performed for that PNR.
    return cmdOpenExchangeMask(upper.replace(/(?:[\u00A4\u00A5]|\u00C2\u00A5)N\d+\.\d+$/, ''));
  }
  if (upper === 'MD') return cmdOpenManualRefundMask();
  if (upper === 'WFRATR2/REF') return cmdProcessPartialRefund();
  if (/^WFRF\d{13}[\u00A5\u2628\u2021\u00A7]A[A-Z0-9]{2}$/i.test(upper)) return cmdOpenExchangeMask(upper);
  if (/^WFR(?:FT(?:R\d+\$\d+)?(?:\/\d+)?|(?:\/\d+)?)$/.test(upper)) return cmdOpenExchangeMask(upper);
  if (upper === 'NEXT') return cmdNextExchangeScreen();
  if (/^(REISSUE|WREISSUE)$/.test(upper)) return cmdReissue();

  // ── Queue — PDF: QC/  Q/9  QP/PCC100/11 ──────────────────────────────
  if (/^QC\/?$|^Q\/\d+$|^QP\/.+$|^QR$|^QXI$/.test(upper)) return cmdQueuePlace(upper);
  if (/^QEP\d*$|^QS\d+$|^Q\/$/.test(upper)) return cmdQueuePlace(upper);

  // ── Cancel / End / Ignore — PDF: XI  X1-2  X1  ER  IR  I ─────────────
  if (/^XI$|^X\d+/i.test(upper)) return cmdCancelFlights(upper);
  if (/^XE\d+$|^XK\d+$/i.test(upper)) return cmdCancelFlights(upper);
  if (/^ER?$/.test(upper)) return cmdEndTransaction(upper === 'ER');
  if (/^IR$/.test(upper)) return cmdIgnoreRedisplay();
  if (/^I$|^IG$/.test(upper)) return cmdIgnore();

  // ── Display commands — PDF: *A  *N  *I  *P3D  *PQ ────────────────────
  if (/^\*-$|^\*-ALL$|^\*N$/.test(upper)) return cmdDisplayName();
  if (/^\*I$|^\*ITN$/.test(upper)) return cmdDisplayItinerary();
  if (/^\*P$|^\*9$|^\*P9$/.test(upper)) return cmdDisplayPhone();
  if (/^\*7$|^\*P7$/.test(upper)) return cmdDisplayTicketing();
  if (/^\*6$|^\*P6$/.test(upper)) return cmdDisplayReceived();
  if (/^\*P3D$|^\*P4D$/.test(upper)) return cmdDisplayDocs();
  if (/^\*T$/.test(upper)) return cmdDisplayTicket();
  if (/^WETR\*T?\d+$/.test(upper)) return cmdElectronicTicketRecord(upper);
  if (/^\*3$|^\*P3?$|^\*SSR$/.test(upper)) return cmdDisplaySSR();
  if (/^\*5$|^\*RM$|^\*P5$/.test(upper)) return cmdDisplayRemarks();
  if (/^\*PD$|^PD$/.test(upper)) return cmdDisplayPassengerDetail();
  if (/^\*ALL$|^OPEN$|^OPENPNR$/.test(upper)) return cmdOpenAllPNR();
  if (/^SHAREPNR$|^SHARE$/.test(upper)) return cmdSharePNR();
  if (/^\*A$|^\*R$|^\*$/.test(upper)) return cmdRedisplay();
  if (/^\*[A-Z0-9]{5,6}$/.test(upper)) return cmdRetrieve(upper);

  if (/^HELP$|^\?$/.test(upper)) return cmdHelp();
  if (/^ABOUT$|^CONTACT$|^HELPLINE$/i.test(upper)) {
    if (typeof sbOpenAboutModal === 'function') sbOpenAboutModal();
    sbPrint('HELPLINE: 01757208244 (SHAKIB) — WINGS FLY AVIATION ACADEMY');
    return;
  }

  sbWarn(`FORMAT INVALID - ${upper} NOT RECOGNIZED — TYPE HELP FOR COMMAND LIST`);
}

function cmdDisplaySpecialMeals() {
  const meals = [
    ['AVML', 'ASIAN VEGETARIAN MEAL'],
    ['BBML', 'BABY MEAL'],
    ['BLML', 'BLAND MEAL'],
    ['CHML', 'CHILD MEAL'],
    ['DBML', 'DIABETIC MEAL'],
    ['FPML', 'FRUIT PLATTER'],
    ['GFML', 'GLUTEN INTOLERANT'],
    ['HNML', 'HINDU MEAL'],
    ['KSML', 'KOSHER MEAL'],
    ['LCML', 'LOW CALORIE MEAL'],
    ['LFML', 'LOW FAT MEAL'],
    ['LSML', 'LOW SALT MEAL'],
    ['MOML', 'MUSLIM MEAL'],
    ['NLML', 'NON LACTOSE MEAL'],
    ['NOML', 'NO MEAL REQUIRED'],
    ['NSML', 'NO SALT MEAL'],
    ['PFML', 'PEANUT FREE MEAL'],
    ['RVML', 'VEGETARIAN RAW MEAL'],
    ['SFML', 'SEAFOOD MEAL'],
    ['SPML', 'SPECIAL MEAL'],
    ['VGML', 'VEGETARIAN MEAL'],
    ['VJML', 'JAIN VEGETARIAN MEAL'],
    ['VLML', 'LACTO-OVO VEGETARIAN MEAL'],
    ['VOML', 'ORIENTAL VEGETARIAN MEAL']
  ];
  sbPrint('SPEC MEALS TABLE');
  meals.forEach(([code, description]) => sbPrint(`${code.padEnd(6)} ${description}`));
}

/* ---------------------------------------------------------------------
   HOOK INTO SHELL — handles Cross of Lorraine (¥) chaining and qualifiers
--------------------------------------------------------------------- */
function sendCmd() {
  const input = document.getElementById('cmdInput');
  const val = input.value.trim().replace(/«$/, '');
  if (!val) {
    if (typeof cmdSubmitExchangeTicketingForm === 'function' && cmdSubmitExchangeTicketingForm()) return;
    if (typeof cmdSubmitExchangeForm === 'function' && cmdSubmitExchangeForm()) return;
    return;
  }
  if (typeof sbRememberCommand === 'function') sbRememberCommand(val.toUpperCase());

  if (typeof window !== 'undefined') window._sbSuppressScrollToBottom = true;
  let echo = null;
  if (typeof sbEcho === 'function') echo = sbEcho(val);

  try {
    // Check if command uses Cross of Lorraine (¥/☨/‡/§) as an internal qualifier:
    // e.g.:
    // - W¥... (Issue ticket: W¥PQ1¥AEY¥FCA¥KP0)
    // - 1<date><pair>¥... (Availability airline qualifier: 120DECJEDAUH¥EY)
    // - T[¤*]...¥... (Time calc: T¤25FEB¥80)
    // - PE¥... (Passenger email: PE¥email@gmail.com¥-1)
    const isInternalQualifier = /^W[\u00A5\u2628\u2021\u00A7]/i.test(val) ||
                                /^WFRF\d{13}[\u00A5\u2628\u2021\u00A7]A[A-Z0-9]{2}$/i.test(val) ||
                                /^1\d{2}[A-Z]{3}[A-Z]{6}[\u00A5\u2628\u2021\u00A7]/i.test(val) ||
                                /^T[\u00A4*].*[\u00A5\u2628\u2021\u00A7]/i.test(val) ||
                                /^PE[\u00A5\u2628\u2021\u00A7]/i.test(val);

    const isRebookDateChange = /^X\d+(?:[\u00A4*\u00A5]|\u00C2\u00A5)0*\d{2}[A-Z]{3}$/i.test(val);
    const isWfrPassengerQualified = /^WFRF\d{13}(?:[\u00A4\u00A5]|\u00C2\u00A5)A[A-Z0-9]{2}(?:(?:[\u00A4\u00A5]|\u00C2\u00A5)N\d+\.\d+)?$/i.test(val);
    if (isInternalQualifier || isRebookDateChange || isWfrPassengerQualified) {
      sbParse(val);
    } else {
      val.split(/[\u00A5\u2628\u2021\u00A7]/).map(entry => entry.trim()).filter(Boolean).forEach(sbParse);
    }
  } finally {
    if (typeof window !== 'undefined') window._sbSuppressScrollToBottom = false;
    if (typeof sbRefreshPanelView === 'function') sbRefreshPanelView();
  }

  input.value = '';

  if (echo && typeof sbScrollToCommand === 'function') {
    sbScrollToCommand(echo);
  }
}


// Ticket Receipt Modal Bridge for Sabre
function openSabreTicketModal(ticketNumber, documentTitle, hideBookingClass) {
  const tktNo = ticketNumber || sbState.eticketNumber || (sbState.ticketNumbers && sbState.ticketNumbers[0]) || 'NOT ISSUED - PREVIEW';
  const paxName = (sbState.names[0] && (sbState.names[0].raw || sbState.names[0].surname)) || 'PASSENGER';
  const fq = sbState.fareQuote;
  const fareStr = fq?.total ? `${fq.currency || 'BDT'} ${fq.total.toLocaleString()}` : 'Not priced';
  const segs = (sbState.booked || []).filter(segment => segment.fn !== 'ARNK');
  const firstSeg = segs[0] || {};
  const flt = [firstSeg.al, firstSeg.fn].filter(Boolean).join(' ') || '—';
  const depDate = firstSeg.date || '—';
  const dest = firstSeg.arr || '—';
  
  const mappedSegs = segs.map(s => ({
    carrier: s.al,
    flightNumber: s.fn,
    bookingClass: s.cls || 'Y',
    date: s.date,
    origin: s.dep,
    destination: s.arr,
    depart: /^\d{4}$/.test(s.depT || '') ? `${s.depT.slice(0, 2)}:${s.depT.slice(2)}` : '—',
    arrive: /^\d{4}$/.test(s.arrT || '') ? `${s.arrT.slice(0, 2)}:${s.arrT.slice(2)}` : '—',
    status: sbState.ticketed ? 'HK1 (CONFIRMED)' : (s.status || 'PREVIEW'),
    cabin: (s.cls || 'Y').match(/^[FAP]/i) ? 'First' : (s.cls || 'Y').match(/^[CJDI]/i) ? 'Business' : 'Economy',
    baggage: s.baggage || '20 KG'
  }));
  const passengers = (sbState.names || []).map((name, index) => {
    const passengerRef = index + 1;
    const doc = (sbState.documents || []).find(d => d.subjectPaxRef === passengerRef || d.paxRef === passengerRef);
    const ff = (sbState.frequentFlyers || []).find(f => f.paxRef === passengerRef || f.paxRef === String(passengerRef));
    return {
      name: name.raw || [name.surname, name.first, name.title].filter(Boolean).join('/'),
      passport: doc?.passportNumber || '—',
      frequentFlyer: ff?.number || ff?.raw || '—',
      ticket: (sbState.ticketNumbers && sbState.ticketNumbers[index]) || tktNo
    };
  });

  openTicketModal(
    paxName,
    tktNo,
    fareStr,
    flt,
    depDate,
    dest,
    null,
    mappedSegs,
    {
      locator: sbState.locator,
      airlinePnr: (sbState.booked[0] && sbState.booked[0].airlineLocator) || null,
      fop: 'CASH',
      status: sbState.ticketed ? 'OK' : 'PREVIEW',
      passengers,
      issueDate: sbState.dateStamp ? sbState.dateStamp.split('/')[0] : null,
      fareBasis: sbState.privateFare?.fareBasis || '—',
      baseFare: fq?.base ? `${fq.currency || 'BDT'} ${fq.base.toLocaleString()}` : fareStr
    },
    { title: documentTitle, hideBookingClass }
  );
}

function sbPrintTicketReceiptButton(ticketNo) {
  const term = document.getElementById('termArea');
  if (!term) return;
  const wrap = document.createElement('div');
  wrap.style.margin = '8px 0';
  const btn = document.createElement('button');
  btn.className = 'print-ticket-btn';
  btn.innerHTML = '&#128438; Print Electronic Ticket Receipt (' + (ticketNo || 'TKT') + ')';
  btn.onclick = function() { openSabreTicketModal(ticketNo); };
  wrap.appendChild(btn);
  term.appendChild(wrap);
  if (!window._sbSuppressScrollToBottom) {
    term.scrollTop = term.scrollHeight;
  }
}
