// =====================================================================
// COMPREENSIVE AIRPORT CATALOG (84 Major Commercial Hubs)
// Every entry carries the geographic data the schedule engine needs:
//   lat / lon  -> great-circle distance, so block times are realistic
//   region     -> hub selection, so Dhaka-Chittagong is never routed via Doha
// =====================================================================
const AIRPORTS = {
  // Bangladesh Domestic
  DAC: { name:"Hazrat Shahjalal Intl", city:"Dhaka", country:"Bangladesh", lat:23.844, lon:90.398, region:"BD" },
  CGP: { name:"Shah Amanat Intl", city:"Chittagong", country:"Bangladesh", lat:22.335, lon:91.813, region:"BD" },
  ZYL: { name:"Osmani Intl", city:"Sylhet", country:"Bangladesh", lat:24.899, lon:91.881, region:"BD" },
  CXB: { name:"Cox's Bazar Intl", city:"Cox's Bazar", country:"Bangladesh", lat:21.450, lon:91.979, region:"BD" },
  JSR: { name:"Jashore Airport", city:"Jashore", country:"Bangladesh", lat:23.129, lon:89.408, region:"BD" },
  SPD: { name:"Saidpur Airport", city:"Saidpur", country:"Bangladesh", lat:25.253, lon:89.364, region:"BD" },
  BZL: { name:"Barishal Airport", city:"Barishal", country:"Bangladesh", lat:22.702, lon:90.337, region:"BD" },
  RJH: { name:"Shah Makhdum Airport", city:"Rajshahi", country:"Bangladesh", lat:24.378, lon:88.401, region:"BD" },

  // Southeast Asia
  BKK: { name:"Suvarnabhumi Intl", city:"Bangkok", country:"Thailand", lat:13.690, lon:100.750, region:"SEA" },
  DMK: { name:"Don Mueang", city:"Bangkok", country:"Thailand", lat:13.912, lon:100.607, region:"SEA" },
  HKT: { name:"Phuket Intl", city:"Phuket", country:"Thailand", lat:8.113, lon:98.317, region:"SEA" },
  SIN: { name:"Singapore Changi Intl", city:"Singapore", country:"Singapore", lat:1.359, lon:103.989, region:"SEA" },
  KUL: { name:"Kuala Lumpur Intl", city:"Kuala Lumpur", country:"Malaysia", lat:2.746, lon:101.708, region:"SEA" },
  PEN: { name:"Penang Intl", city:"Penang", country:"Malaysia", lat:5.297, lon:100.277, region:"SEA" },
  CGK: { name:"Soekarno-Hatta Intl", city:"Jakarta", country:"Indonesia", lat:-6.126, lon:106.656, region:"SEA" },
  DPS: { name:"Ngurah Rai Intl", city:"Bali", country:"Indonesia", lat:-8.748, lon:115.167, region:"SEA" },
  MNL: { name:"Ninoy Aquino Intl", city:"Manila", country:"Philippines", lat:14.509, lon:121.020, region:"SEA" },
  SGN: { name:"Tan Son Nhat Intl", city:"Ho Chi Minh City", country:"Vietnam", lat:10.819, lon:106.652, region:"SEA" },
  HAN: { name:"Noi Bai Intl", city:"Hanoi", country:"Vietnam", lat:21.221, lon:105.807, region:"SEA" },

  // East Asia
  NRT: { name:"Narita Intl", city:"Tokyo", country:"Japan", lat:35.765, lon:140.386, region:"EA" },
  HND: { name:"Haneda Intl", city:"Tokyo", country:"Japan", lat:35.553, lon:139.781, region:"EA" },
  KIX: { name:"Kansai Intl", city:"Osaka", country:"Japan", lat:34.427, lon:135.244, region:"EA" },
  ICN: { name:"Incheon Intl", city:"Seoul", country:"South Korea", lat:37.460, lon:126.441, region:"EA" },
  CAN: { name:"Baiyun Intl", city:"Guangzhou", country:"China", lat:23.392, lon:113.299, region:"EA" },
  HKG: { name:"Hong Kong Intl", city:"Hong Kong", country:"Hong Kong", lat:22.308, lon:113.918, region:"EA" },
  PVG: { name:"Pudong Intl", city:"Shanghai", country:"China", lat:31.144, lon:121.808, region:"EA" },
  PEK: { name:"Capital Intl", city:"Beijing", country:"China", lat:40.080, lon:116.585, region:"EA" },
  PKX: { name:"Daxing Intl", city:"Beijing", country:"China", lat:39.509, lon:116.411, region:"EA" },
  TPE: { name:"Taoyuan Intl", city:"Taipei", country:"Taiwan", lat:25.078, lon:121.233, region:"EA" },

  // Middle East
  DXB: { name:"Dubai Intl", city:"Dubai", country:"UAE", lat:25.253, lon:55.365, region:"ME" },
  AUH: { name:"Zayed Intl", city:"Abu Dhabi", country:"UAE", lat:24.433, lon:54.651, region:"ME" },
  SHJ: { name:"Sharjah Intl", city:"Sharjah", country:"UAE", lat:25.329, lon:55.517, region:"ME" },
  DOH: { name:"Hamad Intl", city:"Doha", country:"Qatar", lat:25.273, lon:51.608, region:"ME" },
  JED: { name:"King Abdulaziz Intl", city:"Jeddah", country:"Saudi Arabia", lat:21.680, lon:39.157, region:"ME" },
  MED: { name:"Prince Mohammad Intl", city:"Medina", country:"Saudi Arabia", lat:24.553, lon:39.705, region:"ME" },
  RUH: { name:"King Khalid Intl", city:"Riyadh", country:"Saudi Arabia", lat:24.958, lon:46.700, region:"ME" },
  DMM: { name:"King Fahd Intl", city:"Dammam", country:"Saudi Arabia", lat:26.471, lon:49.798, region:"ME" },
  KWI: { name:"Kuwait Intl", city:"Kuwait City", country:"Kuwait", lat:29.227, lon:47.969, region:"ME" },
  BAH: { name:"Bahrain Intl", city:"Manama", country:"Bahrain", lat:26.271, lon:50.634, region:"ME" },
  MCT: { name:"Muscat Intl", city:"Muscat", country:"Oman", lat:23.593, lon:58.284, region:"ME" },

  // Europe
  LHR: { name:"Heathrow Intl", city:"London", country:"UK", lat:51.470, lon:-0.454, region:"EU" },
  LGW: { name:"Gatwick Intl", city:"London", country:"UK", lat:51.148, lon:-0.182, region:"EU" },
  MAN: { name:"Manchester Airport", city:"Manchester", country:"UK", lat:53.365, lon:-2.272, region:"EU" },
  BHX: { name:"Birmingham Airport", city:"Birmingham", country:"UK", lat:52.454, lon:-1.748, region:"EU" },
  IST: { name:"Istanbul Airport", city:"Istanbul", country:"Turkey", lat:41.275, lon:28.752, region:"EU" },
  SAW: { name:"Sabiha Gokcen Intl", city:"Istanbul", country:"Turkey", lat:40.899, lon:29.309, region:"EU" },
  CDG: { name:"Charles de Gaulle Intl", city:"Paris", country:"France", lat:49.010, lon:2.548, region:"EU" },
  FRA: { name:"Frankfurt Airport", city:"Frankfurt", country:"Germany", lat:50.037, lon:8.562, region:"EU" },
  FCO: { name:"Fiumicino Leonardo da Vinci", city:"Rome", country:"Italy", lat:41.800, lon:12.239, region:"EU" },
  MXP: { name:"Malpensa Airport", city:"Milan", country:"Italy", lat:45.630, lon:8.728, region:"EU" },
  AMS: { name:"Schiphol Airport", city:"Amsterdam", country:"Netherlands", lat:52.309, lon:4.764, region:"EU" },

  // North America
  JFK: { name:"John F. Kennedy Intl", city:"New York", country:"USA", lat:40.640, lon:-73.779, region:"NA" },
  EWR: { name:"Newark Liberty Intl", city:"New York", country:"USA", lat:40.692, lon:-74.169, region:"NA" },
  IAD: { name:"Dulles Intl", city:"Washington", country:"USA", lat:38.953, lon:-77.457, region:"NA" },
  ORD: { name:"O'Hare Intl", city:"Chicago", country:"USA", lat:41.978, lon:-87.905, region:"NA" },
  LAX: { name:"Los Angeles Intl", city:"Los Angeles", country:"USA", lat:33.942, lon:-118.408, region:"NA" },
  SFO: { name:"San Francisco Intl", city:"San Francisco", country:"USA", lat:37.619, lon:-122.375, region:"NA" },
  DFW: { name:"Dallas/Fort Worth Intl", city:"Dallas", country:"USA", lat:32.899, lon:-97.040, region:"NA" },
  IAH: { name:"George Bush Intercontinental", city:"Houston", country:"USA", lat:29.984, lon:-95.342, region:"NA" },
  MIA: { name:"Miami Intl", city:"Miami", country:"USA", lat:25.795, lon:-80.287, region:"NA" },
  BOS: { name:"Logan Intl", city:"Boston", country:"USA", lat:42.363, lon:-71.006, region:"NA" },
  ATL: { name:"Hartsfield-Jackson Intl", city:"Atlanta", country:"USA", lat:33.637, lon:-84.428, region:"NA" },
  SEA: { name:"Seattle-Tacoma Intl", city:"Seattle", country:"USA", lat:47.450, lon:-122.309, region:"NA" },
  YYZ: { name:"Toronto Pearson Intl", city:"Toronto", country:"Canada", lat:43.677, lon:-79.631, region:"NA" },
  YVR: { name:"Vancouver Intl", city:"Vancouver", country:"Canada", lat:49.194, lon:-123.184, region:"NA" },
  YUL: { name:"Pierre Elliott Trudeau", city:"Montreal", country:"Canada", lat:45.470, lon:-73.740, region:"NA" },

  // Australia & New Zealand
  SYD: { name:"Kingsford Smith Intl", city:"Sydney", country:"Australia", lat:-33.940, lon:151.175, region:"ANZ" },
  MEL: { name:"Melbourne Airport", city:"Melbourne", country:"Australia", lat:-37.669, lon:144.841, region:"ANZ" },
  BNE: { name:"Brisbane Airport", city:"Brisbane", country:"Australia", lat:-27.384, lon:153.117, region:"ANZ" },
  PER: { name:"Perth Airport", city:"Perth", country:"Australia", lat:-31.940, lon:115.967, region:"ANZ" },
  AKL: { name:"Auckland Airport", city:"Auckland", country:"New Zealand", lat:-37.008, lon:174.792, region:"ANZ" },

  // South Asia
  DEL: { name:"Indira Gandhi Intl", city:"Delhi", country:"India", lat:28.556, lon:77.100, region:"SA" },
  BOM: { name:"Chhatrapati Shivaji Intl", city:"Mumbai", country:"India", lat:19.089, lon:72.868, region:"SA" },
  CCU: { name:"Netaji Subhash Chandra Bose", city:"Kolkata", country:"India", lat:22.654, lon:88.447, region:"SA" },
  MAA: { name:"Chennai Intl", city:"Chennai", country:"India", lat:12.990, lon:80.169, region:"SA" },
  BLR: { name:"Kempegowda Intl", city:"Bangalore", country:"India", lat:13.199, lon:77.709, region:"SA" },
  HYD: { name:"Rajiv Gandhi Intl", city:"Hyderabad", country:"India", lat:17.240, lon:78.429, region:"SA" },
  KTM: { name:"Tribhuvan Intl", city:"Kathmandu", country:"Nepal", lat:27.697, lon:85.359, region:"SA" },
  CMB: { name:"Bandaranaike Intl", city:"Colombo", country:"Sri Lanka", lat:7.181, lon:79.884, region:"SA" },
  MLE: { name:"Velana Intl", city:"Male", country:"Maldives", lat:4.192, lon:73.529, region:"SA" },
  PBH: { name:"Paro Intl", city:"Paro", country:"Bhutan", lat:27.403, lon:89.415, region:"SA" },
  ISB: { name:"Islamabad Intl", city:"Islamabad", country:"Pakistan", lat:33.549, lon:72.826, region:"SA" },
  LHE: { name:"Allama Iqbal Intl", city:"Lahore", country:"Pakistan", lat:31.522, lon:74.404, region:"SA" },
  KHI: { name:"Jinnah Intl", city:"Karachi", country:"Pakistan", lat:24.907, lon:67.161, region:"SA" }
};

// -------------------------------------------------------------------------
// ISO 3166-1 alpha-2 codes.  The catalog keeps readable country names, but the
// Amadeus availability header carries the two letter code ("DXB DUBAI.AE"), and
// truncating the name would give UAE->UA, United Kingdom->UK, Sri Lanka->SR.
// -------------------------------------------------------------------------
const AIRPORT_COUNTRY_ISO = {
  "Bangladesh": "BD", "Thailand": "TH", "Singapore": "SG", "Malaysia": "MY",
  "Indonesia": "ID", "Philippines": "PH", "Vietnam": "VN", "Japan": "JP",
  "South Korea": "KR", "China": "CN", "Hong Kong": "HK", "Taiwan": "TW",
  "UAE": "AE", "Qatar": "QA", "Saudi Arabia": "SA", "Kuwait": "KW",
  "Bahrain": "BH", "Oman": "OM", "Turkey": "TR", "UK": "GB", "France": "FR",
  "Germany": "DE", "Italy": "IT", "Netherlands": "NL", "USA": "US",
  "Canada": "CA", "Australia": "AU", "New Zealand": "NZ", "India": "IN",
  "Nepal": "NP", "Sri Lanka": "LK", "Maldives": "MV", "Bhutan": "BT",
  "Pakistan": "PK"
};

function countryIso(name){
  const n = String(name || '');
  if(!n) return 'XX';
  return AIRPORT_COUNTRY_ISO[n] || n.slice(0, 2).toUpperCase();
}

// -------------------------------------------------------------------------
// Shared display helpers.  app.js (AN header), airSearch.js (GUI labels) and
// fareShop.js (pricing) all used to keep their own private 14-entry city
// table, so every city outside that list printed as "CGP CGP.INTL".
// One helper, driven by the catalog above, keeps them consistent.
// -------------------------------------------------------------------------
function airportInfo(code){
  const c = String(code || '').toUpperCase();
  return (typeof AIRPORTS !== 'undefined' && AIRPORTS[c]) ? AIRPORTS[c] : null;
}

function isKnownAirport(code){
  return !!airportInfo(code);
}

// "KUL KUALA LUMPUR.MY" - the Amadeus availability header city field.
function formatCityHeader(code){
  const info = airportInfo(code);
  if(!info) return `${String(code || '').toUpperCase()} UNKNOWN`;
  const city = String(info.city || code).toUpperCase().replace(/[^A-Z0-9 ]/g, '');
  return `${String(code).toUpperCase()} ${city}.${countryIso(info.country)}`;
}

// "Hazrat Shahjalal Intl" - full airport name for headers and labels.
function formatAirportName(code){
  const info = airportInfo(code);
  if(!info) return String(code || '').toUpperCase();
  return `${info.name}, ${info.city}`;
}

// Human readable city name for the GUI search boxes.
function formatCityLabel(code){
  const info = airportInfo(code);
  return info ? info.city : String(code || '').toUpperCase();
}

// -------------------------------------------------------------------------
// Geography.  flights.js needs two things from the catalog: how far apart two
// airports are (so a block time is not the same "4:15" for CGP-CGP and DAC-JFK)
// and which world region each airport belongs to (so a connection is never sold
// through a hub on the wrong side of the planet).
// -------------------------------------------------------------------------
const EARTH_RADIUS_KM = 6371;
const LONG_HAUL_KM = 800;
const SHORT_HAUL_CRUISE_KMH = 650;  // regional jets cruise slower than widebodies
const LONG_HAUL_CRUISE_KMH = 810;
const BLOCK_OVERHEAD_MIN = 30;      // taxi, climb and descent on top of cruise time
const MIN_BLOCK_MIN = 40;

// Great-circle distance in km, or null when a code is not in the catalog.
function airportDistanceKm(from, to){
  const a = airportInfo(from);
  const b = airportInfo(to);
  if(!a || !b) return null;
  const rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h = Math.sin(dLat / 2) ** 2
          + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h)));
}

// "2:45" style block time for a sector of the given length.
function blockTimeFor(km){
  if(km === null || km === undefined) return null;
  const cruise = (km < LONG_HAUL_KM) ? SHORT_HAUL_CRUISE_KMH : LONG_HAUL_CRUISE_KMH;
  const mins = Math.max(MIN_BLOCK_MIN, Math.round((km / cruise * 60 + BLOCK_OVERHEAD_MIN) / 5) * 5);
  return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, '0')}`;
}

// Block time between two airport codes, null when either is unknown.
function blockTimeBetween(from, to){
  return blockTimeFor(airportDistanceKm(from, to));
}

// World region code ("BD", "SEA", "ME", ...) or null when unknown.
function airportRegion(code){
  const info = airportInfo(code);
  return info ? (info.region || null) : null;
}
