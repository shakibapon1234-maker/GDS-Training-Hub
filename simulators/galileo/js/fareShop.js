(function (global) {
  // Results are stored as complete itineraries.  A connection cannot be
  // relabelled as a non-stop flight simply because KUL was searched.
  const ROUTES = {
    "DAC-KUL": [
      { total:32405, cls:"W", suffix:"WLOSV", legs:[
        {carrier:"TG",number:"322",origin:"DAC",destination:"BKK",depart:"1340",arrive:"1710",equip:"333"},
        {carrier:"TG",number:"415",origin:"BKK",destination:"KUL",depart:"1850",arrive:"2205",equip:"320"}], returnLegs:[
        {carrier:"TG",number:"416",origin:"KUL",destination:"BKK",depart:"0850",arrive:"0955",equip:"320"},
        {carrier:"TG",number:"321",origin:"BKK",destination:"DAC",depart:"1050",arrive:"1230",equip:"333"}] },
      { total:34012, cls:"T", suffix:"TBDTHO", legs:[{carrier:"MH",number:"197",origin:"DAC",destination:"KUL",depart:"0050",arrive:"0650",equip:"332"}], returnLegs:[{carrier:"MH",number:"196",origin:"KUL",destination:"DAC",depart:"1950",arrive:"2150",equip:"332"}] },
      { total:39053, cls:"V", suffix:"VSE0WCSF", legs:[
        {carrier:"SQ",number:"447",origin:"DAC",destination:"SIN",depart:"2355",arrive:"#0605",equip:"787"},
        {carrier:"SQ",number:"106",origin:"SIN",destination:"KUL",depart:"0745",arrive:"0845",equip:"738"}], returnLegs:[
        {carrier:"SQ",number:"105",origin:"KUL",destination:"SIN",depart:"1015",arrive:"1120",equip:"738"},
        {carrier:"SQ",number:"446",origin:"SIN",destination:"DAC",depart:"2015",arrive:"2205",equip:"787"}] }
    ],
    "DAC-BKK": [
      { total:29850, cls:"V", suffix:"VBRSTN2", legs:[{carrier:"TG",number:"340",origin:"DAC",destination:"BKK",depart:"0200",arrive:"0530",equip:"320"}], returnLegs:[{carrier:"TG",number:"339",origin:"BKK",destination:"DAC",depart:"2315",arrive:"#0050",equip:"320"}] },
      { total:32405, cls:"W", suffix:"WLOSV", legs:[{carrier:"TG",number:"322",origin:"DAC",destination:"BKK",depart:"1340",arrive:"1710",equip:"333"}], returnLegs:[{carrier:"TG",number:"321",origin:"BKK",destination:"DAC",depart:"1050",arrive:"1230",equip:"333"}] },
      { total:34012, cls:"T", suffix:"TBDTHO", legs:[{carrier:"BS",number:"315",origin:"DAC",destination:"BKK",depart:"0825",arrive:"1420",equip:"333"}], returnLegs:[{carrier:"BS",number:"316",origin:"BKK",destination:"DAC",depart:"1510",arrive:"1640",equip:"333"}] },
      { total:35200, cls:"K", suffix:"KBDTHO", legs:[{carrier:"BG",number:"088",origin:"DAC",destination:"BKK",depart:"1145",arrive:"1515",equip:"738"}], returnLegs:[{carrier:"BG",number:"089",origin:"BKK",destination:"DAC",depart:"1615",arrive:"1800",equip:"738"}] },
      { total:36980, cls:"V", suffix:"VSE0WCSF", legs:[
        {carrier:"SQ",number:"447",origin:"DAC",destination:"SIN",depart:"2355",arrive:"#0605",equip:"787"},
        {carrier:"SQ",number:"972",origin:"SIN",destination:"BKK",depart:"0810",arrive:"0940",equip:"359"}], returnLegs:[
        {carrier:"SQ",number:"975",origin:"BKK",destination:"SIN",depart:"1215",arrive:"1545",equip:"359"},
        {carrier:"SQ",number:"446",origin:"SIN",destination:"DAC",depart:"2015",arrive:"2205",equip:"787"}] }
    ],
    "BKK-SIN": [
      { total:18329, cls:"V", suffix:"VBRSTN2", legs:[{carrier:"TG",number:"403",origin:"BKK",destination:"SIN",depart:"0745",arrive:"1115",equip:"359"}] },
      { total:19150, cls:"V", suffix:"VSE0WCSF", legs:[{carrier:"SQ",number:"973",origin:"BKK",destination:"SIN",depart:"0945",arrive:"1310",equip:"359"}] },
      { total:20200, cls:"K", suffix:"TRAINING", legs:[
        {carrier:"MH",number:"785",origin:"BKK",destination:"KUL",depart:"1320",arrive:"1630",equip:"738"},
        {carrier:"MH",number:"601",origin:"KUL",destination:"SIN",depart:"1740",arrive:"1845",equip:"738"}] },
      { total:16500, cls:"T", suffix:"TBDTHO", legs:[{carrier:"TR",number:"625",origin:"BKK",destination:"SIN",depart:"1050",arrive:"1425",equip:"320"}] },
      { total:18900, cls:"V", suffix:"VBRSTN2", legs:[{carrier:"TG",number:"413",origin:"BKK",destination:"SIN",depart:"1115",arrive:"1445",equip:"359"}] }
    ],
    "SIN-BKK": [
      { total:18329, cls:"V", suffix:"VBRSTN2", legs:[{carrier:"TG",number:"410",origin:"SIN",destination:"BKK",depart:"2100",arrive:"2220",equip:"359"}] },
      { total:19150, cls:"V", suffix:"VSE0WCSF", legs:[{carrier:"SQ",number:"972",origin:"SIN",destination:"BKK",depart:"0810",arrive:"0940",equip:"359"}] },
      { total:20200, cls:"K", suffix:"TRAINING", legs:[
        {carrier:"MH",number:"602",origin:"SIN",destination:"KUL",depart:"1640",arrive:"1755",equip:"738"},
        {carrier:"MH",number:"782",origin:"KUL",destination:"BKK",depart:"0900",arrive:"1010",equip:"738"}] },
      { total:16500, cls:"T", suffix:"TBDTHO", legs:[{carrier:"TR",number:"624",origin:"SIN",destination:"BKK",depart:"0830",arrive:"1005",equip:"320"}] },
      { total:18900, cls:"V", suffix:"VBRSTN2", legs:[{carrier:"TG",number:"404",origin:"SIN",destination:"BKK",depart:"1225",arrive:"1345",equip:"359"}] }
    ],
    "SIN-DAC": [
      { total:42000, cls:"V", suffix:"VBRSTN2", legs:[
        {carrier:"TG",number:"410",origin:"SIN",destination:"BKK",depart:"2100",arrive:"2220",equip:"359"},
        {carrier:"TG",number:"339",origin:"BKK",destination:"DAC",depart:"2315",arrive:"#0050",equip:"320"}] },
      { total:44000, cls:"V", suffix:"VSE0WCSF", legs:[{carrier:"SQ",number:"446",origin:"SIN",destination:"DAC",depart:"2015",arrive:"2205",equip:"787"}] },
      { total:41800, cls:"K", suffix:"TRAINING", legs:[
        {carrier:"MH",number:"602",origin:"SIN",destination:"KUL",depart:"1640",arrive:"1755",equip:"738"},
        {carrier:"MH",number:"196",origin:"KUL",destination:"DAC",depart:"1950",arrive:"2150",equip:"332"}] },
      { total:39500, cls:"T", suffix:"TBDTHO", legs:[{carrier:"BS",number:"308",origin:"SIN",destination:"DAC",depart:"1530",arrive:"1730",equip:"738"}] },
      { total:40500, cls:"L", suffix:"LBD3M", legs:[{carrier:"BG",number:"585",origin:"SIN",destination:"DAC",depart:"1545",arrive:"1745",equip:"788"}] }
    ],
    "DAC-SIN": [
      { total:42000, cls:"V", suffix:"VBRSTN2", legs:[
        {carrier:"TG",number:"340",origin:"DAC",destination:"BKK",depart:"0200",arrive:"0530",equip:"320"},
        {carrier:"TG",number:"403",origin:"BKK",destination:"SIN",depart:"0745",arrive:"1115",equip:"359"}] },
      { total:44000, cls:"V", suffix:"VSE0WCSF", legs:[{carrier:"SQ",number:"447",origin:"DAC",destination:"SIN",depart:"2355",arrive:"#0605",equip:"787"}] },
      { total:41800, cls:"K", suffix:"TRAINING", legs:[
        {carrier:"MH",number:"197",origin:"DAC",destination:"KUL",depart:"0050",arrive:"0650",equip:"332"},
        {carrier:"MH",number:"601",origin:"KUL",destination:"SIN",depart:"0830",arrive:"0945",equip:"738"}] },
      { total:39500, cls:"T", suffix:"TBDTHO", legs:[{carrier:"BS",number:"307",origin:"DAC",destination:"SIN",depart:"0730",arrive:"1345",equip:"738"}] },
      { total:40500, cls:"L", suffix:"LBD3M", legs:[{carrier:"BG",number:"584",origin:"DAC",destination:"SIN",depart:"0830",arrive:"1445",equip:"788"}] }
    ],
    "DAC-JED": [
      { total:49218, cls:"K", suffix:"KBD3M", legs:[{carrier:"BG",number:"135",origin:"DAC",destination:"JED",depart:"1535",arrive:"2245",equip:"773"}] },
      { total:50762, cls:"K", suffix:"KBD3M", legs:[
        {carrier:"BG",number:"611",origin:"DAC",destination:"CGP",depart:"1800",arrive:"1845",equip:"738"},
        {carrier:"BG",number:"135",origin:"CGP",destination:"JED",depart:"2030",arrive:"2245",equip:"773"}] },
      { total:52250, cls:"L", suffix:"LBD3M", legs:[{carrier:"SV",number:"805",origin:"DAC",destination:"JED",depart:"0115",arrive:"0535",equip:"77W"}] },
      { total:54175, cls:"Q", suffix:"QBD3M", legs:[
        {carrier:"EY",number:"253",origin:"DAC",destination:"AUH",depart:"1645",arrive:"2015",equip:"789"},
        {carrier:"EY",number:"311",origin:"AUH",destination:"JED",depart:"2200",arrive:"#0015",equip:"320"}] },
      { total:56200, cls:"V", suffix:"VBD3M", legs:[
        {carrier:"EK",number:"585",origin:"DAC",destination:"DXB",depart:"0140",arrive:"0430",equip:"77W"},
        {carrier:"EK",number:"803",origin:"DXB",destination:"JED",depart:"0730",arrive:"0930",equip:"77W"}] }
    ],
    "MED-DAC": [
      { total:49218, cls:"K", suffix:"KBD3M", legs:[{carrier:"BG",number:"338",origin:"MED",destination:"DAC",depart:"2330",arrive:"#0830",equip:"788"}] },
      { total:50762, cls:"K", suffix:"KBD3M", legs:[{carrier:"BG",number:"338",origin:"MED",destination:"DAC",depart:"2330",arrive:"#0830",equip:"788"}] },
      { total:52250, cls:"L", suffix:"LBD3M", legs:[
        {carrier:"SV",number:"802",origin:"MED",destination:"JED",depart:"1800",arrive:"1900",equip:"320"},
        {carrier:"SV",number:"804",origin:"JED",destination:"DAC",depart:"2030",arrive:"#0515",equip:"77W"}] },
      { total:54175, cls:"Q", suffix:"QBD3M", legs:[
        {carrier:"EY",number:"344",origin:"MED",destination:"AUH",depart:"1615",arrive:"2000",equip:"320"},
        {carrier:"EY",number:"258",origin:"AUH",destination:"DAC",depart:"2130",arrive:"#0410",equip:"789"}] },
      { total:56200, cls:"V", suffix:"VBD3M", legs:[
        {carrier:"EK",number:"802",origin:"MED",destination:"DXB",depart:"1715",arrive:"2045",equip:"77W"},
        {carrier:"EK",number:"582",origin:"DXB",destination:"DAC",depart:"2230",arrive:"#0510",equip:"77W"}] }
    ],
    "DAC-MED": [
      { total:49218, cls:"K", suffix:"KBD3M", legs:[{carrier:"BG",number:"337",origin:"DAC",destination:"MED",depart:"1715",arrive:"2130",equip:"788"}] },
      { total:52250, cls:"L", suffix:"LBD3M", legs:[
        {carrier:"SV",number:"805",origin:"DAC",destination:"JED",depart:"0115",arrive:"0535",equip:"77W"},
        {carrier:"SV",number:"801",origin:"JED",destination:"MED",depart:"0800",arrive:"0900",equip:"320"}] },
      { total:54175, cls:"Q", suffix:"QBD3M", legs:[
        {carrier:"EY",number:"253",origin:"DAC",destination:"AUH",depart:"1645",arrive:"2015",equip:"789"},
        {carrier:"EY",number:"343",origin:"AUH",destination:"MED",depart:"2230",arrive:"#0045",equip:"320"}] },
      { total:56200, cls:"V", suffix:"VBD3M", legs:[
        {carrier:"EK",number:"585",origin:"DAC",destination:"DXB",depart:"0140",arrive:"0430",equip:"77W"},
        {carrier:"EK",number:"801",origin:"DXB",destination:"MED",depart:"0815",arrive:"1015",equip:"77W"}] },
      { total:58100, cls:"W", suffix:"WBD3M", legs:[
        {carrier:"QR",number:"639",origin:"DAC",destination:"DOH",depart:"0400",arrive:"0650",equip:"77W"},
        {carrier:"QR",number:"1166",origin:"DOH",destination:"MED",depart:"0855",arrive:"1135",equip:"320"}] }
    ],
    "JED-DAC": [
      { total:49218, cls:"K", suffix:"KBD3M", legs:[{carrier:"BG",number:"136",origin:"JED",destination:"DAC",depart:"0045",arrive:"#0945",equip:"773"}] },
      { total:52250, cls:"L", suffix:"LBD3M", legs:[{carrier:"SV",number:"804",origin:"JED",destination:"DAC",depart:"2030",arrive:"#0515",equip:"77W"}] },
      { total:54175, cls:"Q", suffix:"QBD3M", legs:[
        {carrier:"EY",number:"312",origin:"JED",destination:"AUH",depart:"1700",arrive:"2030",equip:"320"},
        {carrier:"EY",number:"258",origin:"AUH",destination:"DAC",depart:"2130",arrive:"#0410",equip:"789"}] },
      { total:56200, cls:"V", suffix:"VBD3M", legs:[
        {carrier:"EK",number:"804",origin:"JED",destination:"DXB",depart:"1745",arrive:"2135",equip:"77W"},
        {carrier:"EK",number:"582",origin:"DXB",destination:"DAC",depart:"2230",arrive:"#0510",equip:"77W"}] },
      { total:58100, cls:"W", suffix:"WBD3M", legs:[
        {carrier:"QR",number:"1189",origin:"JED",destination:"DOH",depart:"1930",arrive:"2145",equip:"77W"},
        {carrier:"QR",number:"640",origin:"DOH",destination:"DAC",depart:"2300",arrive:"#0700",equip:"77W"}] }
    ],
    "DAC-DMK": [
      { total:28650, cls:"Y", suffix:"TRAINING", legs:[{carrier:"FD",number:"181",origin:"DAC",destination:"DMK",depart:"0130",arrive:"0345",equip:"320"}], returnLegs:[{carrier:"FD",number:"182",origin:"DMK",destination:"DAC",depart:"2215",arrive:"2330",equip:"320"}] }
    ]
  };

  // Fare-shop results must be complete routings, never a copied flight number
  // with a new destination.  These are training itineraries, arranged through
  // the carrier's normal gateway (for example TG through BKK and SQ through
  // SIN).  A carrier is only offered where that gateway gives a continuous
  // itinerary from Dhaka.
  const GATEWAY_OPTIONS = {
    domestic: [
      { carrier:"BS", hub:"DAC", outbound:["101","0800","0900","AT7"], inbound:["102","1800","1900","AT7"], onward:["101","0800","0900","AT7"], back:["102","1800","1900","AT7"], fare:6500 },
      { carrier:"BG", hub:"DAC", outbound:["411","0730","0815","738"], inbound:["412","1730","1815","738"], onward:["411","0730","0815","738"], back:["412","1730","1815","738"], fare:5800 },
      { carrier:"2A", hub:"DAC", outbound:["201","0930","1020","AT7"], inbound:["202","1630","1720","AT7"], onward:["201","0930","1020","AT7"], back:["202","1630","1720","AT7"], fare:6200 },
      { carrier:"BS", hub:"DAC", outbound:["105","1400","1500","AT7"], inbound:["106","2000","2100","AT7"], onward:["105","1400","1500","AT7"], back:["106","2000","2100","AT7"], fare:6700 },
      { carrier:"BG", hub:"DAC", outbound:["611","1800","1845","738"], inbound:["612","2100","2145","738"], onward:["611","1800","1845","738"], back:["612","2100","2145","738"], fare:5900 }
    ],
    southeast: [
      { carrier:"TG", hub:"BKK", outbound:["340","0200","0530","320"], inbound:["339","2315","0050","320"], onward:["403","0745","1115","359"], back:["410","2100","2220","359"], fare:42000 },
      { carrier:"SQ", hub:"SIN", outbound:["447","2355","#0605","787"], inbound:["446","2015","2205","787"], onward:["972","0810","0940","359"], back:["975","1215","1545","359"], fare:44500 },
      { carrier:"MH", hub:"KUL", outbound:["197","0050","0650","332"], inbound:["196","1950","2150","332"], onward:["601","0830","0945","738"], back:["602","1640","1755","738"], fare:41500 },
      { carrier:"BS", hub:"DAC", outbound:["315","0825","1420","333"], inbound:["316","1510","1640","333"], onward:["307","0730","1345","738"], back:["308","1530","1730","738"], fare:39500 },
      { carrier:"BG", hub:"DAC", outbound:["088","1145","1515","738"], inbound:["089","1615","1800","738"], onward:["584","0830","1445","788"], back:["585","1545","1745","788"], fare:40500 }
    ],
    southAsia: [
      { carrier:"BG", hub:"DAC", outbound:["391","0830","0945","738"], inbound:["392","1930","2045","738"], onward:["393","1100","1230","738"], back:["394","1400","1530","738"], fare:22500 },
      { carrier:"6E", hub:"CCU", outbound:["1862","1015","1100","320"], inbound:["1861","0730","0815","320"], onward:["205","1300","1530","320"], back:["204","1800","2030","320"], fare:19800 },
      { carrier:"BS", hub:"DAC", outbound:["201","1130","1215","738"], inbound:["202","1700","1745","738"], onward:["205","1400","1630","738"], back:["206","1830","2100","738"], fare:21000 },
      { carrier:"AI", hub:"DEL", outbound:["230","1430","1700","320"], inbound:["229","0900","1130","320"], onward:["102","1900","2115","320"], back:["103","0600","0815","320"], fare:24500 },
      { carrier:"UL", hub:"CMB", outbound:["190","1245","1555","320"], inbound:["189","0720","1145","320"], onward:["101","1730","1900","320"], back:["102","0830","1000","320"], fare:26800 }
    ],
    eastAsia: [
      { carrier:"BG", hub:"DAC", outbound:["366","1430","2045","788"], inbound:["367","2200","#0430","788"], onward:["366","1430","2045","788"], back:["367","2200","#0430","788"], fare:48500 },
      { carrier:"CX", hub:"HKG", outbound:["662","0230","0615","359"], inbound:["661","2210","2345","359"], onward:["500","0830","1325","333"], back:["501","1530","1910","333"], fare:52000 },
      { carrier:"SQ", hub:"SIN", outbound:["447","2355","#0605","787"], inbound:["446","2015","2205","787"], onward:["12","0920","1710","359"], back:["11","1930","#0130","359"], fare:55000 },
      { carrier:"TG", hub:"BKK", outbound:["340","0200","0530","320"], inbound:["339","2315","#0050","320"], onward:["600","0800","1540","333"], back:["601","1700","2130","333"], fare:49500 },
      { carrier:"MH", hub:"KUL", outbound:["197","0050","0650","332"], inbound:["196","1950","2150","332"], onward:["88","0900","1650","333"], back:["89","1020","1630","333"], fare:47500 }
    ],
    gulf: [
      { carrier:"BG", hub:"DAC", outbound:["135","1535","2245","773"], inbound:["338","2330","0830","788"], onward:["135","1535","2245","773"], back:["338","2330","0830","788"], fare:49218 },
      { carrier:"SV", hub:"JED", outbound:["805","0115","0535","77W"], inbound:["804","2030","0515","77W"], onward:["802","1800","1900","320"], back:["803","0900","1000","320"], fare:52250 },
      { carrier:"EY", hub:"AUH", outbound:["253","1645","2015","789"], inbound:["258","2130","0410","789"], onward:["311","2200","0015","320"], back:["344","1615","2000","320"], fare:54175 },
      { carrier:"QR", hub:"DOH", outbound:["639","0400","0650","77W"], inbound:["640","1850","0245","77W"], onward:["100","0930","1130","789"], back:["101","1400","1600","789"], fare:55800 },
      { carrier:"EK", hub:"DXB", outbound:["585","0140","0430","77W"], inbound:["586","1630","2300","77W"], onward:["800","0730","0930","388"], back:["801","1230","1430","388"], fare:56200 },
      { carrier:"GF", hub:"BAH", outbound:["251","0955","1230","789"], inbound:["250","0015","0745","789"], onward:["150","1500","1700","320"], back:["151","1900","2100","320"], fare:48900 }
    ],
    europe: [
      { carrier:"BG", hub:"DAC", outbound:["201","0945","1530","788"], inbound:["202","1830","#0845","788"], onward:["201","0945","1530","788"], back:["202","1830","#0845","788"], fare:88500 },
      { carrier:"TK", hub:"IST", outbound:["713","0650","1250","333"], inbound:["714","2000","#0550","333"], onward:["1980","1510","1730","321"], back:["1981","1930","2250","321"], fare:92000 },
      { carrier:"QR", hub:"DOH", outbound:["639","0400","0650","77W"], inbound:["640","1850","#0245","77W"], onward:["3","0830","1400","359"], back:["4","1600","2330","359"], fare:95500 },
      { carrier:"EK", hub:"DXB", outbound:["585","0140","0430","77W"], inbound:["586","1630","2300","77W"], onward:["1","0820","1300","77W"], back:["2","1430","#0010","77W"], fare:98000 },
      { carrier:"SV", hub:"JED", outbound:["805","0115","0535","77W"], inbound:["804","2030","#0515","77W"], onward:["115","0900","1330","77W"], back:["116","1530","2145","77W"], fare:89900 },
      { carrier:"GF", hub:"BAH", outbound:["251","0955","1230","789"], inbound:["250","0015","0745","789"], onward:["3","1400","1830","789"], back:["4","0930","1300","789"], fare:86500 }
    ],
    americas: [
      { carrier:"QR", hub:"DOH", outbound:["639","0400","0650","77W"], inbound:["640","1850","#0245","77W"], onward:["701","0830","1600","359"], back:["702","2100","#1800","359"], fare:128500 },
      { carrier:"EK", hub:"DXB", outbound:["585","0140","0430","77W"], inbound:["586","1630","2300","77W"], onward:["201","0900","1600","388"], back:["202","2200","#1900","388"], fare:132000 },
      { carrier:"TK", hub:"IST", outbound:["713","0650","1250","333"], inbound:["714","2000","#0550","333"], onward:["11","1530","2020","789"], back:["12","2300","#1700","789"], fare:126000 },
      { carrier:"EY", hub:"AUH", outbound:["253","1645","2015","789"], inbound:["258","2130","#0410","789"], onward:["101","2230","#0645","789"], back:["100","2200","#1930","789"], fare:134500 },
      { carrier:"SV", hub:"JED", outbound:["805","0115","0535","77W"], inbound:["804","2030","#0515","77W"], onward:["21","0900","1530","777"], back:["22","2130","#1545","777"], fare:124000 }
    ],
    oceania: [
      { carrier:"SQ", hub:"SIN", outbound:["447","2355","#0605","787"], inbound:["446","2015","2205","787"], onward:["221","0940","1950","359"], back:["222","2130","#0340","359"], fare:98500 },
      { carrier:"MH", hub:"KUL", outbound:["197","0050","0650","332"], inbound:["196","1950","2150","332"], onward:["123","0920","1940","333"], back:["124","2210","#0420","333"], fare:95000 },
      { carrier:"TG", hub:"BKK", outbound:["340","0200","0530","320"], inbound:["339","2315","#0050","320"], onward:["471","0800","2030","359"], back:["472","1000","1620","359"], fare:92000 },
      { carrier:"EK", hub:"DXB", outbound:["585","0140","0430","77W"], inbound:["586","1630","2300","77W"], onward:["414","0830","#0600","388"], back:["415","1600","#0030","388"], fare:105000 },
      { carrier:"QR", hub:"DOH", outbound:["639","0400","0650","77W"], inbound:["640","1850","#0245","77W"], onward:["906","0810","#0600","359"], back:["907","1530","#2300","359"], fare:102000 }
    ]
  };
  const DESTINATION_GROUPS = {
    domestic: ["CGP","ZYL","CXB","JSR","SPD","BZL","RJH"],
    southeast: ["BKK","DMK","SIN","KUL","PEN","CGK","DPS","MNL","SGN","HAN","HKT"],
    southAsia: ["DEL","BOM","CCU","MAA","BLR","HYD","COK","KTM","CMB","MLE","PBH","ISB","LHE","KHI","MUX"],
    eastAsia: ["NRT","HND","KIX","ICN","CAN","HKG","PVG","PEK","PKX","TPE"],
    gulf: ["DXB","AUH","SHJ","DOH","JED","MED","RUH","DMM","KWI","BAH","MCT"],
    europe: ["LHR","LGW","MAN","BHX","IST","SAW","CDG","FRA","FCO","MXP","AMS"],
    americas: ["JFK","EWR","IAD","ORD","LAX","SFO","DFW","IAH","MIA","BOS","ATL","SEA","YYZ","YVR","YUL"],
    oceania: ["SYD","MEL","BNE","PER","AKL"]
  };

  function groupFor(destination) {
    return Object.keys(DESTINATION_GROUPS).find(group => DESTINATION_GROUPS[group].includes(destination));
  }
  function leg(carrier, number, origin, destination, values, date) {
    return { carrier, number, origin, destination, depart:values[1], arrive:values[2], equip:values[3], date };
  }
  function connectedOptions(origin, destination, outboundDate, returnDate) {
    if (origin !== "DAC") return [];
    const group = groupFor(destination);
    if (!group) return [];
    return GATEWAY_OPTIONS[group].map((route, index) => {
      // A gateway that is the requested city is a genuine non-stop sector.
      const isDirect = route.hub === destination || route.hub === origin || group === "domestic";
      const outbound = isDirect
        ? [leg(route.carrier, route.outbound[0], origin, destination, route.outbound, outboundDate)]
        : [leg(route.carrier, route.outbound[0], origin, route.hub, route.outbound, outboundDate), leg(route.carrier, route.onward[0], route.hub, destination, route.onward, outboundDate)];
      const inbound = isDirect
        ? [leg(route.carrier, route.inbound[0], destination, origin, route.inbound, returnDate)]
        : [leg(route.carrier, route.back[0], destination, route.hub, route.back, returnDate), leg(route.carrier, route.inbound[0], route.hub, origin, route.inbound, returnDate)];
      const total = route.fare || (39325 + index * 2350);
      return { total, cls:["W","T","V","K","L","Q"][index % 6], suffix:"TRAINING", legs:outbound, returnLegs:inbound };
    });
  }

  function interCityOptions(origin, destination, outboundDate, returnDate) {
    const origGroup = groupFor(origin);
    const destGroup = groupFor(destination);

    // 1. Both in domestic Bangladesh
    if (origGroup === "domestic" && destGroup === "domestic") {
      const domesticCarriers = [
        { carrier:"BS", flNum:"103", dep:"0900", arr:"1000", equip:"AT7", total:6200 },
        { carrier:"BG", flNum:"413", dep:"1130", arr:"1220", equip:"738", total:5900 },
        { carrier:"2A", flNum:"203", dep:"1400", arr:"1450", equip:"AT7", total:6100 },
        { carrier:"BS", flNum:"107", dep:"1630", arr:"1730", equip:"AT7", total:6500 },
        { carrier:"BG", flNum:"613", dep:"1900", arr:"1945", equip:"738", total:6000 }
      ];
      return domesticCarriers.map((c, idx) => ({
        total: c.total,
        cls: ["Y","K","M","Q","L"][idx % 5],
        suffix: "TRAINING",
        legs: [leg(c.carrier, c.flNum, origin, destination, [c.flNum, c.dep, c.arr, c.equip], outboundDate)],
        returnLegs: returnDate ? [leg(c.carrier, String(parseInt(c.flNum)+1), destination, origin, [String(parseInt(c.flNum)+1), "1800", "1900", c.equip], returnDate)] : []
      }));
    }

    // 2. Both in Gulf
    if (origGroup === "gulf" && destGroup === "gulf") {
      const gulfCarriers = [
        { carrier:"EK", flNum:"845", dep:"0800", arr:"0915", equip:"77W", total:18500 },
        { carrier:"QR", flNum:"101", dep:"1030", arr:"1145", equip:"789", total:17900 },
        { carrier:"SV", flNum:"552", dep:"1300", arr:"1430", equip:"320", total:16800 },
        { carrier:"FZ", flNum:"105", dep:"1530", arr:"1645", equip:"738", total:14500 },
        { carrier:"GF", flNum:"502", dep:"1800", arr:"1915", equip:"320", total:16200 }
      ];
      return gulfCarriers.map((c, idx) => ({
        total: c.total,
        cls: ["Y","K","M","Q","L"][idx % 5],
        suffix: "TRAINING",
        legs: [leg(c.carrier, c.flNum, origin, destination, [c.flNum, c.dep, c.arr, c.equip], outboundDate)],
        returnLegs: returnDate ? [leg(c.carrier, String(parseInt(c.flNum)+1), destination, origin, [String(parseInt(c.flNum)+1), "1900", "2015", c.equip], returnDate)] : []
      }));
    }

    // 3. Both in Southeast Asia
    if (origGroup === "southeast" && destGroup === "southeast") {
      const seaCarriers = [
        { carrier:"TG", flNum:"403", dep:"0800", arr:"1115", equip:"359", total:18300 },
        { carrier:"SQ", flNum:"973", dep:"1015", arr:"1330", equip:"359", total:19200 },
        { carrier:"MH", flNum:"785", dep:"1300", arr:"1615", equip:"738", total:17500 },
        { carrier:"TR", flNum:"625", dep:"1530", arr:"1845", equip:"320", total:15000 },
        { carrier:"AK", flNum:"880", dep:"1800", arr:"2110", equip:"320", total:14200 }
      ];
      return seaCarriers.map((c, idx) => ({
        total: c.total,
        cls: ["Y","K","M","Q","L"][idx % 5],
        suffix: "TRAINING",
        legs: [leg(c.carrier, c.flNum, origin, destination, [c.flNum, c.dep, c.arr, c.equip], outboundDate)],
        returnLegs: returnDate ? [leg(c.carrier, String(parseInt(c.flNum)+1), destination, origin, [String(parseInt(c.flNum)+1), "1900", "2215", c.equip], returnDate)] : []
      }));
    }

    // 4. Both in Europe
    if (origGroup === "europe" && destGroup === "europe") {
      const euroCarriers = [
        { carrier:"BA", flNum:"304", dep:"0815", arr:"1030", equip:"320", total:22000 },
        { carrier:"AF", flNum:"1681", dep:"1100", arr:"1315", equip:"321", total:23500 },
        { carrier:"LH", flNum:"901", dep:"1345", arr:"1620", equip:"320", total:24000 },
        { carrier:"TK", flNum:"1980", dep:"1510", arr:"1730", equip:"321", total:21000 },
        { carrier:"KL", flNum:"1008", dep:"1730", arr:"1945", equip:"738", total:22800 }
      ];
      return euroCarriers.map((c, idx) => ({
        total: c.total,
        cls: ["Y","K","M","Q","L"][idx % 5],
        suffix: "TRAINING",
        legs: [leg(c.carrier, c.flNum, origin, destination, [c.flNum, c.dep, c.arr, c.equip], outboundDate)],
        returnLegs: returnDate ? [leg(c.carrier, String(parseInt(c.flNum)+1), destination, origin, [String(parseInt(c.flNum)+1), "1800", "2015", c.equip], returnDate)] : []
      }));
    }

    // 5. Both in South Asia
    if (origGroup === "southAsia" && destGroup === "southAsia") {
      const saCarriers = [
        { carrier:"6E", flNum:"205", dep:"0800", arr:"1015", equip:"320", total:14000 },
        { carrier:"AI", flNum:"102", dep:"1130", arr:"1345", equip:"320", total:15500 },
        { carrier:"UK", flNum:"975", dep:"1400", arr:"1615", equip:"320", total:16000 },
        { carrier:"BS", flNum:"205", dep:"1630", arr:"1845", equip:"738", total:13500 },
        { carrier:"BG", flNum:"393", dep:"1900", arr:"2115", equip:"738", total:14500 }
      ];
      return saCarriers.map((c, idx) => ({
        total: c.total,
        cls: ["Y","K","M","Q","L"][idx % 5],
        suffix: "TRAINING",
        legs: [leg(c.carrier, c.flNum, origin, destination, [c.flNum, c.dep, c.arr, c.equip], outboundDate)],
        returnLegs: returnDate ? [leg(c.carrier, String(parseInt(c.flNum)+1), destination, origin, [String(parseInt(c.flNum)+1), "1800", "2015", c.equip], returnDate)] : []
      }));
    }

    // 6. Between Gulf and Europe (e.g. DXB to LHR, JED to CDG, etc.)
    if ((origGroup === "gulf" && destGroup === "europe") || (origGroup === "europe" && destGroup === "gulf")) {
      const gulfEuro = [
        { carrier:"EK", flNum:"001", dep:"0745", arr:"1215", equip:"388", total:48500 },
        { carrier:"BA", flNum:"106", dep:"0915", arr:"1350", equip:"789", total:52000 },
        { carrier:"QR", flNum:"003", dep:"1130", arr:"1605", equip:"359", total:47000 },
        { carrier:"TK", flNum:"761", dep:"1400", arr:"1845", equip:"333", total:44000 },
        { carrier:"EY", flNum:"019", dep:"1630", arr:"2100", equip:"789", total:49500 }
      ];
      return gulfEuro.map((c, idx) => ({
        total: c.total,
        cls: ["Y","K","M","Q","L"][idx % 5],
        suffix: "TRAINING",
        legs: [leg(c.carrier, c.flNum, origin, destination, [c.flNum, c.dep, c.arr, c.equip], outboundDate)],
        returnLegs: returnDate ? [leg(c.carrier, String(parseInt(c.flNum)+1), destination, origin, [String(parseInt(c.flNum)+1), "1900", "#0330", c.equip], returnDate)] : []
      }));
    }

    // 7. Universal fallback for ANY pair of airports anywhere in the world
    const globalAirlines = [
      { carrier:"EK", flNum:"501", dep:"0800", arr:"1230", equip:"77W", total:65000 },
      { carrier:"QR", flNum:"601", dep:"1015", arr:"1445", equip:"359", total:63500 },
      { carrier:"TK", flNum:"701", dep:"1300", arr:"1730", equip:"333", total:61000 },
      { carrier:"SQ", flNum:"801", dep:"1545", arr:"2015", equip:"787", total:67000 },
      { carrier:"BG", flNum:"901", dep:"1830", arr:"2300", equip:"788", total:58000 }
    ];
    return globalAirlines.map((c, idx) => ({
      total: c.total + (idx * 2100),
      cls: ["Y","K","Q","L","M"][idx % 5],
      suffix: "TRAINING",
      legs: [leg(c.carrier, c.flNum, origin, destination, [c.flNum, c.dep, c.arr, c.equip], outboundDate)],
      returnLegs: returnDate ? [leg(c.carrier, String(parseInt(c.flNum)+1), destination, origin, [String(parseInt(c.flNum)+1), "1900", "#0400", c.equip], returnDate)] : []
    }));
  }

  function dated(leg, date) { return Object.assign({}, leg, { date: date || "16DEC" }); }
  function reverseRouteOptions(origin, destination, outboundDate, returnDate) {
    const source = ROUTES[destination + "-" + origin];
    if (!source) return [];
    return source.map(template => {
      // The return sectors of a DAC-origin template are the real outbound
      // sectors when a fare shop starts from its overseas city (e.g. BKK-DAC).
      const legs = (template.returnLegs || []).map(leg => dated(leg, outboundDate));
      const returnLegs = template.legs.map(leg => dated(leg, returnDate));
      return Object.assign({}, template, legs[0], { legs, returnLegs });
    }).filter(option => option.legs.length);
  }
  function reverseConnectedOptions(origin, destination, outboundDate, returnDate) {
    // Connected training fares are authored from Dhaka.  Reuse their complete
    // inbound sectors when the fare search starts overseas, rather than
    // inventing a one-way or discontinuous return itinerary.
    if (destination !== "DAC") return [];
    const source = connectedOptions("DAC", origin, returnDate, outboundDate);
    return source.map(option => {
      const legs = (option.returnLegs || []).map(leg => dated(leg, outboundDate));
      const returnLegs = (option.legs || []).map(leg => dated(leg, returnDate));
      return Object.assign({}, option, legs[0], { legs, returnLegs });
    }).filter(option => option.legs.length);
  }
  function soldFlightOption(segment, returnDate) {
    if (!segment || !segment.carrier || !segment.number) return [];
    const outbound = dated({ carrier:segment.carrier, number:String(segment.number), origin:segment.origin, destination:segment.destination, depart:segment.depart || "----", arrive:segment.arrive || "----", equip:segment.equip || "---" }, segment.date);
    const inbound = dated({ carrier:segment.carrier, number:String(segment.number), origin:segment.destination, destination:segment.origin, depart:segment.returnDepart || "----", arrive:segment.returnArrive || "----", equip:segment.equip || "---" }, returnDate);
    return [{ total:39325, cls:segment.soldClass || "Y", suffix:"TRAINING", legs:[outbound], returnLegs:returnDate ? [inbound] : [], ...outbound }];
  }
  function pricingOptions(segment, returnDate) {
    const origin = segment && segment.origin || "DAC", destination = segment && segment.destination || "BKK";
    const templates = ROUTES[origin + "-" + destination];
    if (templates) return expandOptions(templates.map((template, index) => {
      const legs = template.legs.map(leg => dated(leg, segment && segment.date));
      // Older authored one-way templates are paired with the matching reverse
      // route when the search includes a return date.  This keeps every fare
      // option continuous instead of silently issuing an outbound-only trip.
      const reverseTemplate = (ROUTES[destination + "-" + origin] || [])[index];
      const authoredReturn = (template.returnLegs && template.returnLegs.length)
        ? template.returnLegs
        : (returnDate && reverseTemplate ? reverseTemplate.legs : []);
      const returnLegs = authoredReturn.map(leg => dated(leg, returnDate));
      return Object.assign({}, template, legs[0], { legs, returnLegs });
    }));
    const reverse = reverseRouteOptions(origin, destination, segment && segment.date, returnDate);
    if (reverse.length) return expandOptions(reverse);
    const reverseConnections = reverseConnectedOptions(origin, destination, segment && segment.date, returnDate);
    if (reverseConnections.length) return expandOptions(reverseConnections);
    const connections = connectedOptions(origin, destination, segment && segment.date, returnDate);
    if (connections.length) return expandOptions(connections.map(option => Object.assign({}, option, option.legs[0])));
    const interCity = interCityOptions(origin, destination, segment && segment.date, returnDate);
    if (interCity.length) return expandOptions(interCity);
    // A segment sold from availability is itself a valid fare-shop route.
    // This is deliberately last: bare FS searches never invent a direct flight.
    return expandOptions(soldFlightOption(segment, returnDate));
  }

  // A fare display normally has several fare-basis choices. Keep every
  // itinerary continuous, while ensuring five choices for every supported
  // city even if its source schedule has fewer operating patterns.
  function expandOptions(options) {
    const expanded = options.slice();
    const classes = ["Y", "K", "Q", "L", "M"];
    let variant = 0;
    while (expanded.length && expanded.length < 5) {
      const source = options[variant % options.length];
      expanded.push(Object.assign({}, source, {
        total: source.total + 1850 * (variant + 1),
        cls: classes[variant % classes.length],
        suffix: "TRAINING",
        legs: source.legs.map(leg => Object.assign({}, leg)),
        returnLegs: (source.returnLegs || []).map(leg => Object.assign({}, leg))
      }));
      variant++;
    }
    return expanded;
  }
  function quote(segment, returnDate) {
    const options = pricingOptions(segment, returnDate), total = options.length ? options[0].total : 0;
    const base = Math.round(total / 1.21);
    return { base, taxes:total - base, total, currency:"BDT", reference:"YOWBD", options };
  }

  // Fare-load commands price a booked itinerary, not just its first sector.
  // Prefer an authored through-fare only when its full routing exactly matches
  // the sold sectors. Otherwise combine the published training fare for every
  // sold sector so a connection/multi-city booking can never inherit sector 1.
  function quoteItinerary(segments) {
    const itinerary = (segments || []).filter(segment => segment && segment.origin && segment.destination);
    if (itinerary.length <= 1) return quote(itinerary[0] || {});

    const first = itinerary[0];
    const last = itinerary[itinerary.length - 1];
    const throughKey = first.origin + "-" + last.destination;
    const throughSegment = Object.assign({}, first, { destination:last.destination });
    const throughOptions = ROUTES[throughKey] ? pricingOptions(throughSegment) : [];
    const matchedThroughFare = throughOptions.find(option => {
      const legs = option.legs || [];
      return legs.length === itinerary.length && legs.every((leg, index) => {
        const sold = itinerary[index];
        return leg.origin === sold.origin && leg.destination === sold.destination &&
          (!sold.carrier || leg.carrier === sold.carrier);
      });
    });

    if (matchedThroughFare) {
      const total = matchedThroughFare.total;
      const base = Math.round(total / 1.21);
      return {
        base, taxes:total - base, total, currency:"BDT", reference:"THRUFARE",
        options:[matchedThroughFare], itinerary, throughFare:true
      };
    }

    const sectorQuotes = itinerary.map(segment => quote(segment));
    const base = sectorQuotes.reduce((sum, fare) => sum + fare.base, 0);
    const taxes = sectorQuotes.reduce((sum, fare) => sum + fare.taxes, 0);
    return {
      base, taxes, total:base + taxes, currency:"BDT", reference:"MULTISEG",
      options:[], itinerary, throughFare:false, sectorQuotes
    };
  }

  global.GalileoFareShop = { quote, quoteItinerary, pricingOptions };
}(window));
