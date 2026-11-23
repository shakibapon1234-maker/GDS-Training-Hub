(function (global) {
  // Reference catalog imported from the Amadeus training project.
  const airports = {
    DAC:{name:"Hazrat Shahjalal Intl",city:"Dhaka",country:"Bangladesh"}, CGP:{name:"Shah Amanat Intl",city:"Chittagong",country:"Bangladesh"}, ZYL:{name:"Osmani Intl",city:"Sylhet",country:"Bangladesh"}, CXB:{name:"Cox's Bazar Intl",city:"Cox's Bazar",country:"Bangladesh"}, JSR:{name:"Jashore Airport",city:"Jashore",country:"Bangladesh"}, SPD:{name:"Saidpur Airport",city:"Saidpur",country:"Bangladesh"}, BZL:{name:"Barishal Airport",city:"Barishal",country:"Bangladesh"}, RJH:{name:"Shah Makhdum Airport",city:"Rajshahi",country:"Bangladesh"},
    BKK:{name:"Suvarnabhumi Intl",city:"Bangkok",country:"Thailand"}, DMK:{name:"Don Mueang Intl",city:"Bangkok",country:"Thailand"}, HKT:{name:"Phuket Intl",city:"Phuket",country:"Thailand"}, SIN:{name:"Singapore Changi Intl",city:"Singapore",country:"Singapore"}, KUL:{name:"Kuala Lumpur Intl",city:"Kuala Lumpur",country:"Malaysia"}, PEN:{name:"Penang Intl",city:"Penang",country:"Malaysia"}, CGK:{name:"Soekarno-Hatta Intl",city:"Jakarta",country:"Indonesia"}, DPS:{name:"Ngurah Rai Intl",city:"Bali",country:"Indonesia"}, MNL:{name:"Ninoy Aquino Intl",city:"Manila",country:"Philippines"}, SGN:{name:"Tan Son Nhat Intl",city:"Ho Chi Minh City",country:"Vietnam"}, HAN:{name:"Noi Bai Intl",city:"Hanoi",country:"Vietnam"},
    NRT:{name:"Narita Intl",city:"Tokyo",country:"Japan"}, HND:{name:"Haneda Intl",city:"Tokyo",country:"Japan"}, KIX:{name:"Kansai Intl",city:"Osaka",country:"Japan"}, ICN:{name:"Incheon Intl",city:"Seoul",country:"South Korea"}, CAN:{name:"Baiyun Intl",city:"Guangzhou",country:"China"}, HKG:{name:"Hong Kong Intl",city:"Hong Kong",country:"Hong Kong"}, PVG:{name:"Pudong Intl",city:"Shanghai",country:"China"}, PEK:{name:"Capital Intl",city:"Beijing",country:"China"}, PKX:{name:"Daxing Intl",city:"Beijing",country:"China"}, TPE:{name:"Taoyuan Intl",city:"Taipei",country:"Taiwan"},
    DXB:{name:"Dubai Intl",city:"Dubai",country:"UAE"}, AUH:{name:"Zayed Intl",city:"Abu Dhabi",country:"UAE"}, SHJ:{name:"Sharjah Intl",city:"Sharjah",country:"UAE"}, DOH:{name:"Hamad Intl",city:"Doha",country:"Qatar"}, JED:{name:"King Abdulaziz Intl",city:"Jeddah",country:"Saudi Arabia"}, MED:{name:"Prince Mohammad Intl",city:"Medina",country:"Saudi Arabia"}, RUH:{name:"King Khalid Intl",city:"Riyadh",country:"Saudi Arabia"}, DMM:{name:"King Fahd Intl",city:"Dammam",country:"Saudi Arabia"}, KWI:{name:"Kuwait Intl",city:"Kuwait City",country:"Kuwait"}, BAH:{name:"Bahrain Intl",city:"Manama",country:"Bahrain"}, MCT:{name:"Muscat Intl",city:"Muscat",country:"Oman"},
    LHR:{name:"Heathrow Intl",city:"London",country:"UK"}, LGW:{name:"Gatwick Intl",city:"London",country:"UK"}, MAN:{name:"Manchester Airport",city:"Manchester",country:"UK"}, BHX:{name:"Birmingham Airport",city:"Birmingham",country:"UK"}, IST:{name:"Istanbul Airport",city:"Istanbul",country:"Turkey"}, SAW:{name:"Sabiha Gokcen Intl",city:"Istanbul",country:"Turkey"}, CDG:{name:"Charles de Gaulle Intl",city:"Paris",country:"France"}, FRA:{name:"Frankfurt Airport",city:"Frankfurt",country:"Germany"}, FCO:{name:"Fiumicino Leonardo da Vinci",city:"Rome",country:"Italy"}, MXP:{name:"Malpensa Airport",city:"Milan",country:"Italy"}, AMS:{name:"Schiphol Airport",city:"Amsterdam",country:"Netherlands"},
    JFK:{name:"John F. Kennedy Intl",city:"New York",country:"USA"}, EWR:{name:"Newark Liberty Intl",city:"Newark",country:"USA"}, IAD:{name:"Dulles Intl",city:"Washington",country:"USA"}, ORD:{name:"O'Hare Intl",city:"Chicago",country:"USA"}, LAX:{name:"Los Angeles Intl",city:"Los Angeles",country:"USA"}, SFO:{name:"San Francisco Intl",city:"San Francisco",country:"USA"}, DFW:{name:"Dallas/Fort Worth Intl",city:"Dallas",country:"USA"}, IAH:{name:"George Bush Intercontinental",city:"Houston",country:"USA"}, MIA:{name:"Miami Intl",city:"Miami",country:"USA"}, BOS:{name:"Logan Intl",city:"Boston",country:"USA"}, ATL:{name:"Hartsfield-Jackson Intl",city:"Atlanta",country:"USA"}, SEA:{name:"Seattle-Tacoma Intl",city:"Seattle",country:"USA"}, YYZ:{name:"Toronto Pearson Intl",city:"Toronto",country:"Canada"}, YVR:{name:"Vancouver Intl",city:"Vancouver",country:"Canada"}, YUL:{name:"Pierre Elliott Trudeau",city:"Montreal",country:"Canada"},
    SYD:{name:"Kingsford Smith Intl",city:"Sydney",country:"Australia"}, MEL:{name:"Melbourne Airport",city:"Melbourne",country:"Australia"}, BNE:{name:"Brisbane Airport",city:"Brisbane",country:"Australia"}, PER:{name:"Perth Airport",city:"Perth",country:"Australia"}, AKL:{name:"Auckland Airport",city:"Auckland",country:"New Zealand"},
    DEL:{name:"Indira Gandhi Intl",city:"Delhi",country:"India"}, BOM:{name:"Chhatrapati Shivaji Intl",city:"Mumbai",country:"India"}, CCU:{name:"Netaji Subhash Chandra Bose",city:"Kolkata",country:"India"}, MAA:{name:"Chennai Intl",city:"Chennai",country:"India"}, BLR:{name:"Kempegowda Intl",city:"Bangalore",country:"India"}, HYD:{name:"Rajiv Gandhi Intl",city:"Hyderabad",country:"India"}, COK:{name:"Cochin Intl",city:"Kochi",country:"India"}, KTM:{name:"Tribhuvan Intl",city:"Kathmandu",country:"Nepal"}, CMB:{name:"Bandaranaike Intl",city:"Colombo",country:"Sri Lanka"}, MLE:{name:"Velana Intl",city:"Male",country:"Maldives"}, PBH:{name:"Paro Intl",city:"Paro",country:"Bhutan"}, ISB:{name:"Islamabad Intl",city:"Islamabad",country:"Pakistan"}, LHE:{name:"Allama Iqbal Intl",city:"Lahore",country:"Pakistan"}, KHI:{name:"Jinnah Intl",city:"Karachi",country:"Pakistan"}, MUX:{name:"Multan Intl",city:"Multan",country:"Pakistan"}
  };

  const airlines = {
    "6E": { name: "INDIGO", num: "312", country: "INDIA" },
    "2A": { name: "AIR ASTRA", num: "610", country: "BANGLADESH" },
    "9W": { name: "JET AIRWAYS", num: "589", country: "INDIA" },
    "AC": { name: "AIR CANADA", num: "014", country: "CANADA" },
    "AF": { name: "AIR FRANCE", num: "057", country: "FRANCE" },
    "AI": { name: "AIR INDIA", num: "098", country: "INDIA" },
    "AK": { name: "AIRASIA", num: "807", country: "MALAYSIA" },
    "AT": { name: "ROYAL AIR MAROC", num: "147", country: "MOROCCO" },
    "BA": { name: "BRITISH AIRWAYS", num: "125", country: "UNITED KINGDOM" },
    "BG": { name: "BIMAN BANGLADESH AIRLINES", num: "997", country: "BANGLADESH" },
    "BI": { name: "ROYAL BRUNEI AIRLINES", num: "672", country: "BRUNEI" },
    "BS": { name: "US-BANGLA AIRLINES", num: "779", country: "BANGLADESH" },
    "CX": { name: "CATHAY PACIFIC", num: "160", country: "HONG KONG" },
    "CZ": { name: "CHINA SOUTHERN", num: "784", country: "CHINA" },
    "EK": { name: "EMIRATES", num: "176", country: "UNITED ARAB EMIRATES" },
    "EY": { name: "ETIHAD AIRWAYS", num: "607", country: "UNITED ARAB EMIRATES" },
    "FD": { name: "THAI AIRASIA", num: "264", country: "THAILAND" },
    "FZ": { name: "FLYDUBAI", num: "141", country: "UNITED ARAB EMIRATES" },
    "G9": { name: "AIR ARABIA", num: "514", country: "UNITED ARAB EMIRATES" },
    "GF": { name: "GULF AIR", num: "072", country: "BAHRAIN" },
    "GP": { name: "APG AIRLINES", num: "275", country: "FRANCE" },
    "H9": { name: "HIMALAYA AIRLINES", num: "769", country: "NEPAL" },
    "J9": { name: "JAZEERA AIRWAYS", num: "486", country: "KUWAIT" },
    "KL": { name: "KLM ROYAL DUTCH AIRLINES", num: "074", country: "NETHERLANDS" },
    "KU": { name: "KUWAIT AIRWAYS", num: "229", country: "KUWAIT" },
    "LH": { name: "LUFTHANSA", num: "220", country: "GERMANY" },
    "MH": { name: "MALAYSIA AIRLINES", num: "232", country: "MALAYSIA" },
    "MS": { name: "EGYPTAIR", num: "077", country: "EGYPT" },
    "MU": { name: "CHINA EASTERN", num: "781", country: "CHINA" },
    "OD": { name: "BATIK AIR MALAYSIA", num: "816", country: "MALAYSIA" },
    "OV": { name: "SALAM AIR", num: "960", country: "OMAN" },
    "QR": { name: "QATAR AIRWAYS", num: "157", country: "QATAR" },
    "SQ": { name: "SINGAPORE AIRLINES", num: "618", country: "SINGAPORE" },
    "SV": { name: "SAUDI ARABIAN AIRLINES", num: "065", country: "SAUDI ARABIA" },
    "TG": { name: "THAI AIRWAYS", num: "217", country: "THAILAND" },
    "TK": { name: "TURKISH AIRLINES", num: "235", country: "TURKEY" },
    "UK": { name: "VISTARA", num: "228", country: "INDIA" },
    "UL": { name: "SRILANKAN AIRLINES", num: "603", country: "SRI LANKA" },
    "VQ": { name: "NOVOAIR", num: "N/A", country: "BANGLADESH" },
    "WY": { name: "OMAN AIR", num: "910", country: "OMAN" },
    "XY": { name: "FLYNAS", num: "593", country: "SAUDI ARABIA" },
    "TRN": { name: "TRAINING CONNECTION", num: "000", country: "GLOBAL" }
  };

  const countries = {
    BD: { code: "BD", name: "BANGLADESH", capital: "DHAKA", currency: "BDT", region: "ASIA / SUB-CONTINENT" },
    IN: { code: "IN", name: "INDIA", capital: "NEW DELHI", currency: "INR", region: "ASIA / SUB-CONTINENT" },
    PK: { code: "PK", name: "PAKISTAN", capital: "ISLAMABAD", currency: "PKR", region: "ASIA / SUB-CONTINENT" },
    AE: { code: "AE", name: "UNITED ARAB EMIRATES", capital: "ABU DHABI", currency: "AED", region: "MIDDLE EAST" },
    SA: { code: "SA", name: "SAUDI ARABIA", capital: "RIYADH", currency: "SAR", region: "MIDDLE EAST" },
    QA: { code: "QA", name: "QATAR", capital: "DOHA", currency: "QAR", region: "MIDDLE EAST" },
    KW: { code: "KW", name: "KUWAIT", capital: "KUWAIT CITY", currency: "KWD", region: "MIDDLE EAST" },
    OM: { code: "OM", name: "OMAN", capital: "MUSCAT", currency: "OMR", region: "MIDDLE EAST" },
    BH: { code: "BH", name: "BAHRAIN", capital: "MANAMA", currency: "BHD", region: "MIDDLE EAST" },
    MY: { code: "MY", name: "MALAYSIA", capital: "KUALA LUMPUR", currency: "MYR", region: "SOUTHEAST ASIA" },
    SG: { code: "SG", name: "SINGAPORE", capital: "SINGAPORE", currency: "SGD", region: "SOUTHEAST ASIA" },
    TH: { code: "TH", name: "THAILAND", capital: "BANGKOK", currency: "THB", region: "SOUTHEAST ASIA" },
    TR: { code: "TR", name: "TURKEY", capital: "ANKARA", currency: "TRY", region: "EUROPE / ASIA" },
    GB: { code: "GB", name: "UNITED KINGDOM", capital: "LONDON", currency: "GBP", region: "EUROPE" },
    UK: { code: "UK", name: "UNITED KINGDOM", capital: "LONDON", currency: "GBP", region: "EUROPE" },
    US: { code: "US", name: "UNITED STATES", capital: "WASHINGTON D.C.", currency: "USD", region: "NORTH AMERICA" },
    CA: { code: "CA", name: "CANADA", capital: "OTTAWA", currency: "CAD", region: "NORTH AMERICA" },
    AU: { code: "AU", name: "AUSTRALIA", capital: "CANBERRA", currency: "AUD", region: "OCEANIA" },
    JP: { code: "JP", name: "JAPAN", capital: "TOKYO", currency: "JPY", region: "EAST ASIA" },
    CN: { code: "CN", name: "CHINA", capital: "BEIJING", currency: "CNY", region: "EAST ASIA" },
    NP: { code: "NP", name: "NEPAL", capital: "KATHMANDU", currency: "NPR", region: "ASIA / SUB-CONTINENT" },
    LK: { code: "LK", name: "SRI LANKA", capital: "COLOMBO", currency: "LKR", region: "ASIA / SUB-CONTINENT" },
    MV: { code: "MV", name: "MALDIVES", capital: "MALE", currency: "MVR", region: "ASIA / SUB-CONTINENT" },
    EG: { code: "EG", name: "EGYPT", capital: "CAIRO", currency: "EGP", region: "AFRICA / MIDDLE EAST" },
    FR: { code: "FR", name: "FRANCE", capital: "PARIS", currency: "EUR", region: "EUROPE" },
    DE: { code: "DE", name: "GERMANY", capital: "BERLIN", currency: "EUR", region: "EUROPE" },
    IT: { code: "IT", name: "ITALY", capital: "ROME", currency: "EUR", region: "EUROPE" },
    NL: { code: "NL", name: "NETHERLANDS", capital: "AMSTERDAM", currency: "EUR", region: "EUROPE" },
    ES: { code: "ES", name: "SPAIN", capital: "MADRID", currency: "EUR", region: "EUROPE" },
    CH: { code: "CH", name: "SWITZERLAND", capital: "BERN", currency: "CHF", region: "EUROPE" },
    ID: { code: "ID", name: "INDONESIA", capital: "JAKARTA", currency: "IDR", region: "SOUTHEAST ASIA" },
    PH: { code: "PH", name: "PHILIPPINES", capital: "MANILA", currency: "PHP", region: "SOUTHEAST ASIA" },
    VN: { code: "VN", name: "VIETNAM", capital: "HANOI", currency: "VND", region: "SOUTHEAST ASIA" },
    KR: { code: "KR", name: "SOUTH KOREA", capital: "SEOUL", currency: "KRW", region: "EAST ASIA" },
    TW: { code: "TW", name: "TAIWAN", capital: "TAIPEI", currency: "TWD", region: "EAST ASIA" },
    HK: { code: "HK", name: "HONG KONG", capital: "HONG KONG", currency: "HKD", region: "EAST ASIA" },
    NZ: { code: "NZ", name: "NEW ZEALAND", capital: "WELLINGTON", currency: "NZD", region: "OCEANIA" },
    BT: { code: "BT", name: "BHUTAN", capital: "THIMPHU", currency: "BTN", region: "ASIA / SUB-CONTINENT" },
    RU: { code: "RU", name: "RUSSIA", capital: "MOSCOW", currency: "RUB", region: "EUROPE / ASIA" }
  };

  global.GalileoAirports = {
    find(code) { return airports[code.trim().toUpperCase()] || null; },
    airline(code) {
      const entry = airlines[code.trim().toUpperCase()];
      return entry ? (typeof entry === "string" ? entry : entry.name) : null;
    },
    findAirline(code) {
      const val = code.trim().toUpperCase();
      if (airlines[val]) return { code: val, ...airlines[val] };
      const found = Object.entries(airlines).find(([c, a]) => a.num === val || a.name.includes(val));
      return found ? { code: found[0], ...found[1] } : null;
    },
    findCountry(query) {
      const val = query.trim().toUpperCase();
      if (countries[val]) return countries[val];
      const found = Object.values(countries).find(c => c.name.includes(val) || c.capital.toUpperCase().includes(val));
      return found || null;
    },
    encode(query) {
      const value = query.trim().toUpperCase();
      return Object.entries(airports).filter(([, airport]) => airport.city.toUpperCase().includes(value) || airport.name.toUpperCase().includes(value));
    },
    decode(code) {
      const value = code.trim().toUpperCase();
      return airports[value] ? { code: value, ...airports[value] } : null;
    }
  };
}(window));
