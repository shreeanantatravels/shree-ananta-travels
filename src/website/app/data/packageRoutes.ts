export interface RouteLocation {
  id: string;
  name: string;
  hindiName?: string;
  coordinates: [number, number]; // [lat, lng]
  altitude?: string;
  dayNumbers: number[];
  description: string;
  type: "start" | "stop" | "sacred_site" | "mountain_pass" | "camp" | "airport";
  badge?: string;
}

export interface RouteSegment {
  id: string;
  title: string;
  fromId: string;
  toId: string;
  dayNumbers: number[];
  mode: "road" | "flight" | "helicopter" | "trek";
  distance?: string;
  path: [number, number][]; // Array of [lat, lng] waypoints
}

export interface PackageRouteData {
  packageSlug: string;
  slugAliases: string[];
  title: string;
  totalDistance?: string;
  maxAltitude?: string;
  locations: RouteLocation[];
  segments: RouteSegment[];
}

/**
 * Real geographic coordinates & roadmap database for Shree Ananta Travels packages.
 */
export const PACKAGE_ROUTES: PackageRouteData[] = [
  {
    packageSlug: "kailash-mansarovar-via-lucknow-route",
    slugAliases: ["kailash-mansarovar-via-lucknow", "kailash-lucknow", "lucknow-kailash"],
    title: "Kailash Mansarovar Yatra via Lucknow & Hilsa Helicopter Route",
    totalDistance: "Approx. 1,480 km (Round Trip)",
    maxAltitude: "5,630 m / 18,600 ft (Dolma La Pass)",
    locations: [
      {
        id: "lucknow",
        name: "Lucknow",
        hindiName: "लखनऊ",
        coordinates: [26.8467, 80.9462],
        altitude: "123 m",
        dayNumbers: [1, 2, 10, 11],
        description: "Arrival, gathering point & orientation in the City of Nawabs.",
        type: "start",
        badge: "Yatra Starting Point",
      },
      {
        id: "nepalgunj",
        name: "Nepalgunj",
        hindiName: "नेपालगंज",
        coordinates: [28.05, 81.6167],
        altitude: "150 m",
        dayNumbers: [2, 3, 10],
        description: "Nepal-India border transit hub & gateway airport to western Nepal.",
        type: "airport",
        badge: "Nepal Gateway",
      },
      {
        id: "simikot",
        name: "Simikot",
        hindiName: "सिमिकोट",
        coordinates: [29.967, 81.823],
        altitude: "2,910 m",
        dayNumbers: [3, 10],
        description: "High mountain district headquarters of Humla with dramatic scenic runway.",
        type: "airport",
        badge: "Mountain Airstrip",
      },
      {
        id: "hilsa",
        name: "Hilsa Border",
        hindiName: "हिल्सा",
        coordinates: [30.1583, 81.65],
        altitude: "3,700 m",
        dayNumbers: [3, 4, 10],
        description: "Suspension bridge border post crossing between Nepal & Tibet on Karnali River.",
        type: "stop",
        badge: "Tibet Border Checkpost",
      },
      {
        id: "purang",
        name: "Purang (Taklakot)",
        hindiName: "पुरांग (तकलाकोट)",
        coordinates: [30.3, 81.1833],
        altitude: "4,025 m",
        dayNumbers: [4, 5, 9, 10],
        description: "Tibetan immigration center & acclimatization stop in the shadow of Gurla Mandhata.",
        type: "stop",
        badge: "Acclimatization Hub",
      },
      {
        id: "mansarovar",
        name: "Lake Mansarovar",
        hindiName: "मानसरोवर झील",
        coordinates: [30.6667, 81.5],
        altitude: "4,590 m",
        dayNumbers: [5, 6],
        description: "Sacred, highest freshwater lake created by Lord Brahma with Chiu Gompa monastery.",
        type: "sacred_site",
        badge: "Holy Bath & Hawan",
      },
      {
        id: "darchen",
        name: "Darchen",
        hindiName: "दार्चेन",
        coordinates: [30.975, 81.286],
        altitude: "4,575 m",
        dayNumbers: [6, 7, 9],
        description: "Pilgrimage base village situated directly at the southern foot of Mount Kailash.",
        type: "camp",
        badge: "Parikrama Basecamp",
      },
      {
        id: "yam-dwar",
        name: "Yam Dwar (Tarboche)",
        hindiName: "यम द्वार (तारबोचे)",
        coordinates: [31.025, 81.24],
        altitude: "4,700 m",
        dayNumbers: [7],
        description: "Gateway of the Gods of Death; sacred entrance where the walking parikrama begins.",
        type: "sacred_site",
        badge: "Parikrama Starting Gate",
      },
      {
        id: "dirapuk",
        name: "Dirapuk Monastery",
        hindiName: "दिरापुक",
        coordinates: [31.111, 81.306],
        altitude: "4,890 m",
        dayNumbers: [7, 8],
        description: "Historic monastery offering awe-inspiring close-up vistas of Mount Kailash North Face.",
        type: "camp",
        badge: "North Face Viewpoint",
      },
      {
        id: "dolma-la",
        name: "Dolma La Pass",
        hindiName: "डोलमा ला दर्रा",
        coordinates: [31.103, 81.35],
        altitude: "5,630 m",
        dayNumbers: [8],
        description: "Highest, most sacred pass guarded by Goddess Tara; overlooks holy Gauri Kund.",
        type: "mountain_pass",
        badge: "Highest Elevation Point",
      },
      {
        id: "zuthulpuk",
        name: "Zuthulpuk Monastery",
        hindiName: "जुथुलपुक",
        coordinates: [31.02, 81.365],
        altitude: "4,760 m",
        dayNumbers: [8, 9],
        description: "Cave of Miracles where Saint Milarepa meditated during the legendary kora.",
        type: "camp",
        badge: "Miracle Cave Monastery",
      },
    ],
    segments: [
      {
        id: "lucknow-nepalgunj",
        title: "Lucknow to Nepalgunj (Road via NH927)",
        fromId: "lucknow",
        toId: "nepalgunj",
        dayNumbers: [2, 10],
        mode: "road",
        distance: "180 km / 4–5 hrs",
        path: [
          [26.8467, 80.9462], // Lucknow
          [26.9288, 81.1873], // Barabanki
          [27.5744, 81.5973], // Bahraich
          [27.8633, 81.5033], // Nanpara
          [27.9944, 81.6033], // Rupaidiha Border
          [28.05, 81.6167],   // Nepalgunj
        ],
      },
      {
        id: "nepalgunj-simikot",
        title: "Nepalgunj to Simikot (Mountain Flight)",
        fromId: "nepalgunj",
        toId: "simikot",
        dayNumbers: [3, 10],
        mode: "flight",
        distance: "Approx. 215 km flight / 45 mins",
        path: [
          [28.05, 81.6167],   // Nepalgunj Airport
          [28.35, 81.62],     // Surkhet approach
          [28.85, 81.68],     // Karnali gorge
          [29.45, 81.75],     // Humla valley
          [29.967, 81.823],   // Simikot Airstrip
        ],
      },
      {
        id: "simikot-hilsa",
        title: "Simikot to Hilsa (Helicopter Transfer)",
        fromId: "simikot",
        toId: "hilsa",
        dayNumbers: [3, 10],
        mode: "helicopter",
        distance: "Approx. 52 km / 20–25 mins flight",
        path: [
          [29.967, 81.823],   // Simikot
          [30.04, 81.79],     // Kermi
          [30.08, 81.74],     // Yalbang
          [30.13, 81.69],     // Muchu
          [30.1583, 81.65],   // Hilsa Border
        ],
      },
      {
        id: "hilsa-purang",
        title: "Hilsa to Purang (Border Crossing & Road)",
        fromId: "hilsa",
        toId: "purang",
        dayNumbers: [4, 10],
        mode: "road",
        distance: "30 km / 45 mins",
        path: [
          [30.1583, 81.65],   // Hilsa bridge
          [30.163, 81.644],   // Tibet border customs
          [30.22, 81.25],     // Tibetan mountain road
          [30.3, 81.1833],    // Purang (Taklakot)
        ],
      },
      {
        id: "purang-mansarovar",
        title: "Purang to Lake Mansarovar (Overland Highway)",
        fromId: "purang",
        toId: "mansarovar",
        dayNumbers: [5],
        mode: "road",
        distance: "80 km / 2 hrs",
        path: [
          [30.3, 81.1833],    // Purang
          [30.45, 81.22],     // Gurla Mandhata pass route
          [30.6, 81.26],      // Rakshas Tal viewpoint
          [30.6667, 81.5],    // Lake Mansarovar (Chiu Gompa)
        ],
      },
      {
        id: "mansarovar-darchen",
        title: "Lake Mansarovar to Darchen (Scenic Road)",
        fromId: "mansarovar",
        toId: "darchen",
        dayNumbers: [6],
        mode: "road",
        distance: "40 km / 45 mins",
        path: [
          [30.6667, 81.5],    // Lake Mansarovar
          [30.82, 81.36],     // Barkha Plain
          [30.975, 81.286],   // Darchen Basecamp
        ],
      },
      {
        id: "darchen-yamdwar",
        title: "Darchen to Yam Dwar (Transfer to Parikrama Start)",
        fromId: "darchen",
        toId: "yam-dwar",
        dayNumbers: [7],
        mode: "road",
        distance: "12 km / 20 mins",
        path: [
          [30.975, 81.286],   // Darchen
          [31.0, 81.26],      // Sershong
          [31.025, 81.24],    // Yam Dwar
        ],
      },
      {
        id: "yamdwar-dirapuk",
        title: "Yam Dwar to Dirapuk (Day 1 Parikrama Trek)",
        fromId: "yam-dwar",
        toId: "dirapuk",
        dayNumbers: [7],
        mode: "trek",
        distance: "14 km / 5–6 hrs sacred trek",
        path: [
          [31.025, 81.24],    // Yam Dwar
          [31.06, 81.27],     // Kangkyam
          [31.09, 81.295],    // Lha Chu valley
          [31.111, 81.306],   // Dirapuk Monastery
        ],
      },
      {
        id: "dirapuk-dolmala",
        title: "Dirapuk to Dolma La Pass (Ascent Trek)",
        fromId: "dirapuk",
        toId: "dolma-la",
        dayNumbers: [8],
        mode: "trek",
        distance: "6.5 km / 4 hrs ascent to 5,630m",
        path: [
          [31.111, 81.306],   // Dirapuk
          [31.115, 81.33],    // Jarok Donkhang
          [31.103, 81.35],    // Dolma La Pass
        ],
      },
      {
        id: "dolmala-zuthulpuk",
        title: "Dolma La Pass via Gauri Kund to Zuthulpuk (Descent Trek)",
        fromId: "dolma-la",
        toId: "zuthulpuk",
        dayNumbers: [8],
        mode: "trek",
        distance: "15.5 km / 6–7 hrs descent",
        path: [
          [31.103, 81.35],    // Dolma La Pass
          [31.095, 81.355],   // Gauri Kund View
          [31.05, 81.36],     // Lham Chu riverside
          [31.02, 81.365],    // Zuthulpuk Monastery
        ],
      },
      {
        id: "zuthulpuk-darchen",
        title: "Zuthulpuk to Darchen (Final Parikrama Trek Segment)",
        fromId: "zuthulpuk",
        toId: "darchen",
        dayNumbers: [9],
        mode: "trek",
        distance: "8 km / 3 hrs trek completion",
        path: [
          [31.02, 81.365],    // Zuthulpuk
          [30.99, 81.33],     // Dzongzerbu gorge
          [30.975, 81.286],   // Darchen basecamp
        ],
      },
      {
        id: "darchen-purang-return",
        title: "Darchen to Purang (Return Overland Coach)",
        fromId: "darchen",
        toId: "purang",
        dayNumbers: [9],
        mode: "road",
        distance: "120 km / 2.5 hrs",
        path: [
          [30.975, 81.286],   // Darchen
          [30.6667, 81.5],    // Mansarovar highway bypass
          [30.45, 81.22],     // Gurla pass
          [30.3, 81.1833],    // Purang
        ],
      },
    ],
  },
  {
    packageSlug: "kailash-mansarovar-yatra-via-lhasa-air-route",
    slugAliases: ["kailash-lhasa", "lhasa-route"],
    title: "Kailash Mansarovar Yatra via Lhasa Air Route",
    totalDistance: "Approx. 2,200 km (Flight + Overland)",
    maxAltitude: "5,630 m / 18,600 ft (Dolma La Pass)",
    locations: [
      {
        id: "kathmandu",
        name: "Kathmandu",
        hindiName: "काठमांडू",
        coordinates: [27.7172, 85.324],
        altitude: "1,400 m",
        dayNumbers: [1, 2, 14, 15],
        description: "Capital of Nepal; Pashupatinath & sacred preparatory darshan.",
        type: "start",
        badge: "Nepal Capital Gateway",
      },
      {
        id: "lhasa",
        name: "Lhasa",
        hindiName: "ल्हासा",
        coordinates: [29.6525, 91.1392],
        altitude: "3,656 m",
        dayNumbers: [3, 4, 13],
        description: "Historic Tibetan spiritual capital; Potala Palace & Jokhang Temple.",
        type: "stop",
        badge: "Potala Palace City",
      },
      {
        id: "shigatse",
        name: "Shigatse",
        hindiName: "शिगात्से",
        coordinates: [29.268, 88.881],
        altitude: "3,840 m",
        dayNumbers: [5, 12],
        description: "Second largest city in Tibet, home to Tashilhunpo Monastery.",
        type: "stop",
        badge: "Tashilhunpo Seat",
      },
      {
        id: "saga",
        name: "Saga",
        hindiName: "सागा",
        coordinates: [29.328, 85.234],
        altitude: "4,450 m",
        dayNumbers: [6, 11],
        description: "Key high-altitude Tibetan overland trading post along the Yarlung Tsangpo.",
        type: "stop",
        badge: "High Plateau Hub",
      },
      {
        id: "mansarovar-lhasa",
        name: "Lake Mansarovar",
        hindiName: "मानसरोवर झील",
        coordinates: [30.6667, 81.5],
        altitude: "4,590 m",
        dayNumbers: [7, 10],
        description: "Divine sacred lake of Lord Brahma for holy dip and prayers.",
        type: "sacred_site",
        badge: "Holy Lake Darshan",
      },
      {
        id: "darchen-lhasa",
        name: "Darchen Basecamp",
        hindiName: "दार्चेन",
        coordinates: [30.975, 81.286],
        altitude: "4,575 m",
        dayNumbers: [8, 10],
        description: "Mount Kailash south-side parikrama starting and staging village.",
        type: "camp",
        badge: "Parikrama Base",
      },
    ],
    segments: [
      {
        id: "ktm-lhasa",
        title: "Kathmandu to Lhasa (Himalayan Flight)",
        fromId: "kathmandu",
        toId: "lhasa",
        dayNumbers: [3],
        mode: "flight",
        distance: "600 km flight over Mt. Everest",
        path: [
          [27.7172, 85.324],
          [28.0, 86.85], // Over Everest range
          [29.3, 89.5],
          [29.6525, 91.1392],
        ],
      },
      {
        id: "lhasa-shigatse",
        title: "Lhasa to Shigatse (Highway / Bullet Train)",
        fromId: "lhasa",
        toId: "shigatse",
        dayNumbers: [5],
        mode: "road",
        distance: "270 km / 4 hrs",
        path: [
          [29.6525, 91.1392],
          [29.38, 90.0],
          [29.268, 88.881],
        ],
      },
      {
        id: "shigatse-saga",
        title: "Shigatse to Saga (Tibetan Highway G219)",
        fromId: "shigatse",
        toId: "saga",
        dayNumbers: [6],
        mode: "road",
        distance: "450 km / 7 hrs",
        path: [
          [29.268, 88.881],
          [29.2, 87.0],
          [29.328, 85.234],
        ],
      },
      {
        id: "saga-mansarovar",
        title: "Saga to Lake Mansarovar (Overland Drive)",
        fromId: "saga",
        toId: "mansarovar-lhasa",
        dayNumbers: [7],
        mode: "road",
        distance: "490 km / 8 hrs",
        path: [
          [29.328, 85.234],
          [29.6, 83.5],
          [30.2, 82.2],
          [30.6667, 81.5],
        ],
      },
      {
        id: "mansarovar-darchen-lhasa",
        title: "Lake Mansarovar to Darchen Basecamp",
        fromId: "mansarovar-lhasa",
        toId: "darchen-lhasa",
        dayNumbers: [8],
        mode: "road",
        distance: "40 km / 45 mins",
        path: [
          [30.6667, 81.5],
          [30.82, 81.36],
          [30.975, 81.286],
        ],
      },
    ],
  },
  {
    packageSlug: "do-dham-yatra-by-helicopter",
    slugAliases: ["do-dham", "kedarnath-badrinath-helicopter"],
    title: "Do Dham Yatra by Helicopter (Kedarnath & Badrinath)",
    totalDistance: "Approx. 420 km Flight Circuit",
    maxAltitude: "3,583 m (Kedarnath Temple)",
    locations: [
      {
        id: "dehradun",
        name: "Dehradun (Sahastradhara Helipad)",
        hindiName: "देहरादून (सहस्त्रधारा)",
        coordinates: [30.3872, 78.1158],
        altitude: "640 m",
        dayNumbers: [1, 2, 4],
        description: "Starting base for VIP helicopter charters to the Himalayan shrines.",
        type: "start",
        badge: "Charter Helipad",
      },
      {
        id: "kedarnath",
        name: "Kedarnath Ji",
        hindiName: "केदारनाथ जी",
        coordinates: [30.7352, 79.0669],
        altitude: "3,583 m",
        dayNumbers: [2],
        description: "Eternal Jyotirlinga of Lord Shiva amidst snow-clad Garhwal peaks.",
        type: "sacred_site",
        badge: "Jyotirlinga Darshan",
      },
      {
        id: "badrinath",
        name: "Badrinath Ji",
        hindiName: "बद्रीनाथ जी",
        coordinates: [30.7433, 79.4938],
        altitude: "3,133 m",
        dayNumbers: [3],
        description: "Sacred abode of Lord Vishnu situated along the Alaknanda River.",
        type: "sacred_site",
        badge: "Maha Vishnu Dham",
      },
    ],
    segments: [
      {
        id: "dehradun-kedarnath",
        title: "Dehradun to Kedarnath (VIP Helicopter)",
        fromId: "dehradun",
        toId: "kedarnath",
        dayNumbers: [2],
        mode: "helicopter",
        distance: "Approx. 110 km direct flight / 35 mins",
        path: [
          [30.3872, 78.1158], // Sahastradhara
          [30.45, 78.5],      // Tehri approach
          [30.6, 78.85],      // Mandakini gorge
          [30.7352, 79.0669], // Kedarnath
        ],
      },
      {
        id: "kedarnath-badrinath",
        title: "Kedarnath to Badrinath (Helicopter Transfer)",
        fromId: "kedarnath",
        toId: "badrinath",
        dayNumbers: [3],
        mode: "helicopter",
        distance: "Approx. 45 km mountain flight / 20 mins",
        path: [
          [30.7352, 79.0669],
          [30.75, 79.28],
          [30.7433, 79.4938],
        ],
      },
      {
        id: "badrinath-dehradun",
        title: "Badrinath back to Dehradun (Return Flight)",
        fromId: "badrinath",
        toId: "dehradun",
        dayNumbers: [4],
        mode: "helicopter",
        distance: "Approx. 150 km flight / 45 mins",
        path: [
          [30.7433, 79.4938],
          [30.55, 78.8],
          [30.3872, 78.1158],
        ],
      },
    ],
  },
  {
    packageSlug: "pushkar-and-khatu-shyam-ji-yatra",
    slugAliases: ["pushkar-khatu-shyam"],
    title: "Pushkar & Khatu Shyam Ji Sacred Pilgrimage",
    totalDistance: "Approx. 850 km Road Circuit",
    maxAltitude: "450 m",
    locations: [
      {
        id: "delhi",
        name: "New Delhi",
        hindiName: "नई दिल्ली",
        coordinates: [28.6139, 77.209],
        altitude: "216 m",
        dayNumbers: [1, 3],
        description: "National capital start and return destination.",
        type: "start",
        badge: "Circuit Start",
      },
      {
        id: "khatu-shyam",
        name: "Khatu Shyam Ji",
        hindiName: "खाटू श्याम जी",
        coordinates: [27.4334, 75.3087],
        altitude: "410 m",
        dayNumbers: [1, 2],
        description: "Revered temple of Barbarika (Hare Ka Sahara).",
        type: "sacred_site",
        badge: "Shyam Baba Mandir",
      },
      {
        id: "ajmer",
        name: "Ajmer",
        hindiName: "अजमेर",
        coordinates: [26.4499, 74.6399],
        altitude: "480 m",
        dayNumbers: [2],
        description: "Historic city surrounded by the Aravalli hills.",
        type: "stop",
        badge: "Heritage Stop",
      },
      {
        id: "pushkar",
        name: "Pushkar",
        hindiName: "पुष्कर",
        coordinates: [26.4897, 74.5511],
        altitude: "510 m",
        dayNumbers: [2, 3],
        description: "World famous Brahma Temple & sacred Pushkar Sarovar ghats.",
        type: "sacred_site",
        badge: "Brahma Temple & Sarovar",
      },
    ],
    segments: [
      {
        id: "delhi-khatu",
        title: "Delhi to Khatu Shyam Ji (Highway NH48)",
        fromId: "delhi",
        toId: "khatu-shyam",
        dayNumbers: [1],
        mode: "road",
        distance: "300 km / 5.5 hrs",
        path: [
          [28.6139, 77.209],
          [28.4595, 77.0266], // Gurgaon
          [28.1928, 76.6191], // Rewari
          [27.6853, 75.7892], // Ringas
          [27.4334, 75.3087], // Khatu
        ],
      },
      {
        id: "khatu-ajmer-pushkar",
        title: "Khatu Shyam Ji to Pushkar via Ajmer",
        fromId: "khatu-shyam",
        toId: "pushkar",
        dayNumbers: [2],
        mode: "road",
        distance: "175 km / 3.5 hrs",
        path: [
          [27.4334, 75.3087],
          [26.9124, 75.7873], // Jaipur bypass
          [26.4499, 74.6399], // Ajmer
          [26.4897, 74.5511], // Pushkar
        ],
      },
      {
        id: "pushkar-delhi",
        title: "Pushkar to Delhi (Return Highway)",
        fromId: "pushkar",
        toId: "delhi",
        dayNumbers: [3],
        mode: "road",
        distance: "410 km / 7 hrs",
        path: [
          [26.4897, 74.5511],
          [26.9124, 75.7873],
          [28.4595, 77.0266],
          [28.6139, 77.209],
        ],
      },
    ],
  },
];

/**
 * Helper to match any package slug or title with available route datasets.
 */
export function findPackageRoute(slugOrId: string, title?: string): PackageRouteData | null {
  const cleanSlug = (slugOrId || "").toLowerCase().trim();
  const cleanTitle = (title || "").toLowerCase().trim();

  // 1. Direct slug match
  const directMatch = PACKAGE_ROUTES.find(
    (r) =>
      r.packageSlug === cleanSlug ||
      r.slugAliases.some((alias) => cleanSlug.includes(alias) || alias.includes(cleanSlug))
  );
  if (directMatch) return directMatch;

  // 2. Keyword fallback for Lucknow Kailash
  if (cleanSlug.includes("lucknow") || cleanTitle.includes("lucknow")) {
    return PACKAGE_ROUTES[0];
  }

  // 3. Keyword fallback for Lhasa Kailash
  if (cleanSlug.includes("lhasa") || cleanTitle.includes("lhasa")) {
    return PACKAGE_ROUTES[1];
  }

  // 4. Do Dham by Helicopter
  if (cleanSlug.includes("do-dham") || cleanTitle.includes("do dham")) {
    return PACKAGE_ROUTES[2];
  }

  // 5. Pushkar & Khatu Shyam
  if (cleanSlug.includes("pushkar") || cleanSlug.includes("khatu") || cleanTitle.includes("pushkar")) {
    return PACKAGE_ROUTES[3];
  }

  return null;
}
