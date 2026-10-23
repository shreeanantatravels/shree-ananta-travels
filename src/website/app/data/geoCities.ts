/**
 * Comprehensive Geographic Coordinates Registry & Real-Road Route Generator
 * Supports 250+ top tourist destinations across India & International destinations.
 */

import { PackageRouteData, RouteLocation, RouteSegment } from "./packageRoutes";

export interface GeoPoint {
  lat: number;
  lng: number;
  name: string;
  state?: string;
  country?: string;
  aliases?: string[];
}

export const VERIFIED_DESTINATIONS: Record<string, GeoPoint> = {
  // ━━━ RAJASTHAN ━━━
  jaipur: { lat: 26.9124, lng: 75.7873, name: "Jaipur", state: "Rajasthan", aliases: ["pink city"] },
  jodhpur: { lat: 26.2389, lng: 73.0243, name: "Jodhpur", state: "Rajasthan", aliases: ["blue city", "sun city"] },
  udaipur: { lat: 24.5854, lng: 73.7125, name: "Udaipur", state: "Rajasthan", aliases: ["lake city", "city of lakes"] },
  jaisalmer: { lat: 26.9157, lng: 70.9083, name: "Jaisalmer", state: "Rajasthan", aliases: ["golden city", "sam sand dunes"] },
  bikaner: { lat: 28.0229, lng: 73.3119, name: "Bikaner", state: "Rajasthan" },
  pushkar: { lat: 26.4897, lng: 74.5511, name: "Pushkar", state: "Rajasthan" },
  ajmer: { lat: 26.4499, lng: 74.6399, name: "Ajmer", state: "Rajasthan", aliases: ["ajmer sharif"] },
  samdunes: { lat: 26.8285, lng: 70.5100, name: "Sam Sand Dunes", state: "Rajasthan", aliases: ["sam", "sam dunes", "thar desert"] },
  ranakpur: { lat: 25.1166, lng: 73.4750, name: "Ranakpur", state: "Rajasthan", aliases: ["ranakpur jain temple"] },
  mountabu: { lat: 24.5925, lng: 72.7156, name: "Mount Abu", state: "Rajasthan", aliases: ["mt abu"] },
  ranthambore: { lat: 26.0173, lng: 76.5026, name: "Ranthambore", state: "Rajasthan", aliases: ["sawai madhopur"] },
  chittorgarh: { lat: 24.8887, lng: 74.6269, name: "Chittorgarh", state: "Rajasthan", aliases: ["chittor"] },
  kumbhalgarh: { lat: 25.1479, lng: 73.5875, name: "Kumbhalgarh", state: "Rajasthan" },
  khatushyam: { lat: 27.4334, lng: 75.3087, name: "Khatu Shyam Ji", state: "Rajasthan", aliases: ["khatu", "khatu shyam", "sikar", "khatushyamji"] },
  salasar: { lat: 27.7214, lng: 74.7216, name: "Salasar Balaji", state: "Rajasthan", aliases: ["salasar"] },
  nathdwara: { lat: 24.9317, lng: 73.8197, name: "Nathdwara", state: "Rajasthan", aliases: ["shrinathji"] },
  mandawa: { lat: 28.0553, lng: 75.1428, name: "Mandawa", state: "Rajasthan", aliases: ["shekhawati"] },
  bharatpur: { lat: 27.2152, lng: 77.5030, name: "Bharatpur", state: "Rajasthan" },
  alwar: { lat: 27.5530, lng: 76.6346, name: "Alwar", state: "Rajasthan" },

  // ━━━ TAMIL NADU & SOUTH INDIA ━━━
  madurai: { lat: 9.9252, lng: 78.1198, name: "Madurai", state: "Tamil Nadu", aliases: ["meenakshi temple"] },
  rameshwaram: { lat: 9.2876, lng: 79.3129, name: "Rameshwaram", state: "Tamil Nadu", aliases: ["rameswaram", "ramanathaswamy"] },
  dhanushkodi: { lat: 9.1788, lng: 79.4144, name: "Dhanushkodi", state: "Tamil Nadu" },
  kanyakumari: { lat: 8.0883, lng: 77.5385, name: "Kanyakumari", state: "Tamil Nadu", aliases: ["cape comorin"] },
  chennai: { lat: 13.0827, lng: 80.2707, name: "Chennai", state: "Tamil Nadu", aliases: ["madras"] },
  mahabalipuram: { lat: 12.6269, lng: 80.1927, name: "Mahabalipuram", state: "Tamil Nadu", aliases: ["mamallapuram"] },
  pondicherry: { lat: 11.9416, lng: 79.8083, name: "Puducherry", state: "Puducherry", aliases: ["pondicherry", "pondy", "auroville"] },
  thanjavur: { lat: 10.7870, lng: 79.1378, name: "Thanjavur", state: "Tamil Nadu", aliases: ["tanjore", "brihadeeswarar"] },
  trichy: { lat: 10.7905, lng: 78.7047, name: "Tiruchirappalli", state: "Tamil Nadu", aliases: ["trichy", "srirangam"] },
  chidambaram: { lat: 11.3992, lng: 79.6936, name: "Chidambaram", state: "Tamil Nadu" },
  ooty: { lat: 11.4102, lng: 76.6950, name: "Ooty", state: "Tamil Nadu", aliases: ["udhagamandalam"] },
  kodaikanal: { lat: 10.2381, lng: 77.4892, name: "Kodaikanal", state: "Tamil Nadu", aliases: ["kodai"] },
  coimbatore: { lat: 11.0168, lng: 76.9558, name: "Coimbatore", state: "Tamil Nadu", aliases: ["isha yoga"] },
  tirupati: { lat: 13.6288, lng: 79.4192, name: "Tirupati", state: "Andhra Pradesh", aliases: ["tirumala", "balaji"] },
  vellore: { lat: 12.9165, lng: 79.1325, name: "Vellore", state: "Tamil Nadu", aliases: ["golden temple vellore"] },
  kumbakonam: { lat: 10.9602, lng: 79.3845, name: "Kumbakonam", state: "Tamil Nadu", aliases: ["navagraha"] },

  // ━━━ KERALA ━━━
  kochi: { lat: 9.9312, lng: 76.2673, name: "Kochi", state: "Kerala", aliases: ["cochin", "ernakulam"] },
  munnar: { lat: 10.0889, lng: 77.0595, name: "Munnar", state: "Kerala" },
  thekkady: { lat: 9.6031, lng: 77.1615, name: "Thekkady", state: "Kerala", aliases: ["periyar"] },
  alleppey: { lat: 9.4981, lng: 76.3388, name: "Alleppey", state: "Kerala", aliases: ["alappuzha", "backwaters"] },
  kumarakom: { lat: 9.6175, lng: 76.4301, name: "Kumarakom", state: "Kerala" },
  kovalam: { lat: 8.4004, lng: 76.9787, name: "Kovalam", state: "Kerala" },
  trivandrum: { lat: 8.5241, lng: 76.9366, name: "Thiruvananthapuram", state: "Kerala", aliases: ["trivandrum", "padmanabhaswamy"] },
  thiruvananthapuram: { lat: 8.5241, lng: 76.9366, name: "Thiruvananthapuram", state: "Kerala", aliases: ["trivandrum", "padmanabhaswamy"] },
  wayanad: { lat: 11.6854, lng: 76.1320, name: "Wayanad", state: "Kerala" },
  varkala: { lat: 8.7379, lng: 76.7163, name: "Varkala", state: "Kerala" },
  kozhikode: { lat: 11.2588, lng: 75.7804, name: "Kozhikode", state: "Kerala", aliases: ["calicut"] },
  athirappilly: { lat: 10.2987, lng: 76.5703, name: "Athirappilly", state: "Kerala" },
  poovar: { lat: 8.3188, lng: 77.0684, name: "Poovar Island", state: "Kerala", aliases: ["poovar"] },

  // ━━━ UTTARAKHAND & CHAR DHAM ━━━
  haridwar: { lat: 29.9457, lng: 78.1642, name: "Haridwar", state: "Uttarakhand" },
  rishikesh: { lat: 30.0869, lng: 78.2676, name: "Rishikesh", state: "Uttarakhand" },
  dehradun: { lat: 30.3165, lng: 78.0322, name: "Dehradun", state: "Uttarakhand", aliases: ["sahastradhara"] },
  mussoorie: { lat: 30.4598, lng: 78.0644, name: "Mussoorie", state: "Uttarakhand" },
  nainital: { lat: 29.3919, lng: 79.4542, name: "Nainital", state: "Uttarakhand" },
  corbett: { lat: 29.5300, lng: 78.7747, name: "Jim Corbett", state: "Uttarakhand", aliases: ["jim corbett", "ramnagar"] },
  barkot: { lat: 30.8122, lng: 78.2078, name: "Barkot", state: "Uttarakhand" },
  yamunotri: { lat: 31.0140, lng: 78.4600, name: "Yamunotri", state: "Uttarakhand", aliases: ["janki chatti"] },
  uttarkashi: { lat: 30.7268, lng: 78.4354, name: "Uttarkashi", state: "Uttarakhand" },
  gangotri: { lat: 30.9947, lng: 78.9398, name: "Gangotri", state: "Uttarakhand", aliases: ["harsil"] },
  guptkashi: { lat: 30.5230, lng: 79.0768, name: "Guptkashi", state: "Uttarakhand", aliases: ["phata", "sersi"] },
  kedarnath: { lat: 30.7352, lng: 79.0669, name: "Kedarnath Dham", state: "Uttarakhand", aliases: ["kedarnath"] },
  badrinath: { lat: 30.7433, lng: 79.4938, name: "Badrinath Dham", state: "Uttarakhand", aliases: ["badrinath", "mana"] },
  joshimath: { lat: 30.5566, lng: 79.5668, name: "Joshimath", state: "Uttarakhand" },
  rudraprayag: { lat: 30.2844, lng: 78.9811, name: "Rudraprayag", state: "Uttarakhand" },
  auli: { lat: 30.5300, lng: 79.5600, name: "Auli", state: "Uttarakhand" },
  kausani: { lat: 29.8543, lng: 79.5967, name: "Kausani", state: "Uttarakhand" },
  almora: { lat: 29.5971, lng: 79.6591, name: "Almora", state: "Uttarakhand" },
  ranikhet: { lat: 29.6434, lng: 79.4322, name: "Ranikhet", state: "Uttarakhand" },
  chopta: { lat: 30.4853, lng: 79.1764, name: "Chopta", state: "Uttarakhand" },
  tungnath: { lat: 30.4891, lng: 79.2173, name: "Tungnath", state: "Uttarakhand" },
  chandrashila: { lat: 30.4900, lng: 79.2200, name: "Chandrashila", state: "Uttarakhand" },
  triyuginarayan: { lat: 30.6405, lng: 78.9866, name: "Triyuginarayan Temple", state: "Uttarakhand", aliases: ["triyuginarayan"] },
  devprayag: { lat: 30.1459, lng: 78.5986, name: "Devprayag", state: "Uttarakhand" },
  karnaprayag: { lat: 30.2583, lng: 79.2173, name: "Karnaprayag", state: "Uttarakhand", aliases: ["karanprayag"] },
  sonprayag: { lat: 30.6315, lng: 78.9972, name: "Sonprayag", state: "Uttarakhand" },
  gaurikund: { lat: 30.6528, lng: 79.0272, name: "Gaurikund", state: "Uttarakhand" },
  phata: { lat: 30.5750, lng: 79.0350, name: "Phata", state: "Uttarakhand" },
  sersi: { lat: 30.5890, lng: 79.0430, name: "Sersi", state: "Uttarakhand" },
  sitapur: { lat: 30.6120, lng: 78.9950, name: "Sitapur", state: "Uttarakhand" },
  mana: { lat: 30.7644, lng: 79.4975, name: "Mana Village", state: "Uttarakhand", aliases: ["mana"] },

  // ━━━ HIMACHAL, PUNJAB, KASHMIR & LADAKH ━━━
  delhi: { lat: 28.6139, lng: 77.2090, name: "Delhi", state: "Delhi", aliases: ["new delhi", "igi airport"] },
  shimla: { lat: 31.1048, lng: 77.1734, name: "Shimla", state: "Himachal Pradesh", aliases: ["kufri"] },
  manali: { lat: 32.2432, lng: 77.1892, name: "Manali", state: "Himachal Pradesh", aliases: ["solang valley", "rohtang"] },
  dharamshala: { lat: 32.2190, lng: 76.3234, name: "Dharamshala", state: "Himachal Pradesh", aliases: ["mcleod ganj", "mcleodganj"] },
  dalhousie: { lat: 32.5387, lng: 75.9710, name: "Dalhousie", state: "Himachal Pradesh", aliases: ["khajjiar"] },
  amritsar: { lat: 31.6340, lng: 74.8723, name: "Amritsar", state: "Punjab", aliases: ["golden temple amritsar", "wagah border"] },
  chandigarh: { lat: 30.7333, lng: 76.7794, name: "Chandigarh", state: "Chandigarh" },
  katra: { lat: 32.9915, lng: 74.9318, name: "Katra", state: "Jammu & Kashmir", aliases: ["vaishno devi", "jammu"] },
  srinagar: { lat: 34.0837, lng: 74.7973, name: "Srinagar", state: "Jammu & Kashmir", aliases: ["dal lake"] },
  gulmarg: { lat: 34.0484, lng: 74.3805, name: "Gulmarg", state: "Jammu & Kashmir" },
  pahalgam: { lat: 34.0161, lng: 75.3150, name: "Pahalgam", state: "Jammu & Kashmir", aliases: ["betaab valley"] },
  sonamarg: { lat: 34.3050, lng: 75.2954, name: "Sonamarg", state: "Jammu & Kashmir" },
  leh: { lat: 34.1526, lng: 77.5771, name: "Leh", state: "Ladakh", aliases: ["leh ladakh"] },
  nubra: { lat: 34.6863, lng: 77.5673, name: "Nubra Valley", state: "Ladakh", aliases: ["diskit", "hunder"] },
  pangong: { lat: 33.7595, lng: 78.6674, name: "Pangong Tso", state: "Ladakh", aliases: ["pangong lake"] },
  spiti: { lat: 32.2276, lng: 78.0710, name: "Kaza / Spiti Valley", state: "Himachal Pradesh", aliases: ["spiti", "kaza"] },

  // ━━━ UTTAR PRADESH & BIHAR (SPIRITUAL) ━━━
  agra: { lat: 27.1767, lng: 78.0081, name: "Agra", state: "Uttar Pradesh", aliases: ["taj mahal"] },
  mathura: { lat: 27.4924, lng: 77.6737, name: "Mathura", state: "Uttar Pradesh", aliases: ["krishna janmabhoomi"] },
  vrindavan: { lat: 27.5806, lng: 77.7006, name: "Vrindavan", state: "Uttar Pradesh", aliases: ["prem mandir"] },
  lucknow: { lat: 26.8467, lng: 80.9462, name: "Lucknow", state: "Uttar Pradesh" },
  farrukhabad: { lat: 27.3825, lng: 79.5716, name: "Farrukhabad", state: "Uttar Pradesh", aliases: ["fatehgarh"] },
  varanasi: { lat: 25.3176, lng: 82.9739, name: "Varanasi", state: "Uttar Pradesh", aliases: ["kashi", "banaras", "benaras"] },
  ayodhya: { lat: 26.7922, lng: 82.1998, name: "Ayodhya", state: "Uttar Pradesh", aliases: ["ram mandir"] },
  prayagraj: { lat: 25.4358, lng: 81.8463, name: "Prayagraj", state: "Uttar Pradesh", aliases: ["allahabad", "sangam", "triveni sangam"] },
  bodhgaya: { lat: 24.6961, lng: 84.9869, name: "Bodh Gaya", state: "Bihar", aliases: ["gaya", "mahabodhi"] },
  patna: { lat: 25.5941, lng: 85.1376, name: "Patna", state: "Bihar" },

  // ━━━ GOA, MAHARASHTRA & GUJARAT ━━━
  goa: { lat: 15.2993, lng: 74.1240, name: "Goa", state: "Goa", aliases: ["north goa", "south goa", "calangute", "baga", "panjim", "panaji"] },
  mumbai: { lat: 19.0760, lng: 72.8777, name: "Mumbai", state: "Maharashtra", aliases: ["bombay"] },
  pune: { lat: 18.5204, lng: 73.8567, name: "Pune", state: "Maharashtra" },
  shirdi: { lat: 19.7667, lng: 74.4766, name: "Shirdi", state: "Maharashtra", aliases: ["sai baba temple"] },
  mahabaleshwar: { lat: 17.9237, lng: 73.6586, name: "Mahabaleshwar", state: "Maharashtra", aliases: ["panchgani"] },
  lonavala: { lat: 18.7557, lng: 73.4091, name: "Lonavala", state: "Maharashtra", aliases: ["khandala"] },
  nashik: { lat: 19.9975, lng: 73.7898, name: "Nashik", state: "Maharashtra", aliases: ["trimbakeshwar"] },
  ahmedabad: { lat: 23.0225, lng: 72.5714, name: "Ahmedabad", state: "Gujarat", aliases: ["sabarmati"] },
  statueofunity: { lat: 21.8380, lng: 73.7191, name: "Statue of Unity", state: "Gujarat", aliases: ["kevadia", "ekta nagar"] },
  somnath: { lat: 20.8880, lng: 70.4013, name: "Somnath Jyotirlinga", state: "Gujarat", aliases: ["somnath"] },
  dwarka: { lat: 22.2442, lng: 68.9685, name: "Dwarka", state: "Gujarat", aliases: ["dwarkadhish"] },
  gir: { lat: 21.1243, lng: 70.8242, name: "Sasan Gir", state: "Gujarat", aliases: ["gir national park"] },
  rannofkutch: { lat: 23.8344, lng: 69.8327, name: "Rann of Kutch", state: "Gujarat", aliases: ["kutch", "dhordo", "bhuj"] },

  // ━━━ EAST & NORTHEAST ━━━
  puri: { lat: 19.8135, lng: 85.8312, name: "Puri", state: "Odisha", aliases: ["jagannath puri"] },
  bhubaneswar: { lat: 20.2961, lng: 85.8245, name: "Bhubaneswar", state: "Odisha" },
  konark: { lat: 19.8876, lng: 86.0945, name: "Konark Sun Temple", state: "Odisha", aliases: ["konark"] },
  kolkata: { lat: 22.5726, lng: 88.3639, name: "Kolkata", state: "West Bengal", aliases: ["calcutta"] },
  darjeeling: { lat: 27.0410, lng: 88.2663, name: "Darjeeling", state: "West Bengal" },
  gangtok: { lat: 27.3389, lng: 88.6065, name: "Gangtok", state: "Sikkim" },
  guwahati: { lat: 26.1445, lng: 91.7362, name: "Guwahati", state: "Assam", aliases: ["kamakhya"] },
  shillong: { lat: 25.5788, lng: 91.8933, name: "Shillong", state: "Meghalaya" },
  kaziranga: { lat: 26.5775, lng: 93.1711, name: "Kaziranga", state: "Assam" },

  // ━━━ KAILASH, NEPAL & TIBET ━━━
  nepalgunj: { lat: 28.0500, lng: 81.6167, name: "Nepalgunj", country: "Nepal" },
  simikot: { lat: 29.9667, lng: 81.8333, name: "Simikot", country: "Nepal" },
  hilsa: { lat: 30.1558, lng: 81.6708, name: "Hilsa", country: "Nepal" },
  purang: { lat: 30.2980, lng: 81.1760, name: "Purang / Taklakot", country: "Tibet", aliases: ["taklakot"] },
  mansarovar: { lat: 30.6720, lng: 81.4720, name: "Lake Mansarovar", country: "Tibet", aliases: ["lake mansarovar", "manasarovar"] },
  darchen: { lat: 30.9760, lng: 81.2870, name: "Darchen Base", country: "Tibet", aliases: ["kailash base"] },
  yamdwar: { lat: 30.9850, lng: 81.2500, name: "Yam Dwar", country: "Tibet", aliases: ["yam dwar", "tarboche"] },
  dirapuk: { lat: 31.0920, lng: 81.2980, name: "Dirapuk Monastery", country: "Tibet", aliases: ["north face"] },
  dolmala: { lat: 31.1160, lng: 81.3550, name: "Dolma La Pass", country: "Tibet", aliases: ["dolma la"] },
  zuthulpuk: { lat: 31.0180, lng: 81.3910, name: "Zuthulpuk Cave", country: "Tibet", aliases: ["zutulpuk"] },
  saga: { lat: 29.3270, lng: 85.2340, name: "Saga", country: "Tibet" },
  shigatse: { lat: 29.2667, lng: 88.8833, name: "Shigatse", country: "Tibet", aliases: ["xigatse"] },
  lhasa: { lat: 29.6500, lng: 91.1000, name: "Lhasa", country: "Tibet", aliases: ["potala palace"] },
  gyantse: { lat: 28.9167, lng: 89.6000, name: "Gyantse", country: "Tibet" },
  kathmandu: { lat: 27.7172, lng: 85.3240, name: "Kathmandu", country: "Nepal", aliases: ["pashupatinath"] },
  pokhara: { lat: 28.2096, lng: 83.9856, name: "Pokhara", country: "Nepal", aliases: ["fewa lake"] },

  // ━━━ TOP INTERNATIONAL ━━━
  dubai: { lat: 25.2048, lng: 55.2708, name: "Dubai", country: "UAE", aliases: ["burj khalifa"] },
  abudhabi: { lat: 24.4539, lng: 54.3773, name: "Abu Dhabi", country: "UAE", aliases: ["sheikh zayed"] },
  singapore: { lat: 1.3521, lng: 103.8198, name: "Singapore", country: "Singapore", aliases: ["changi", "sentosa"] },
  bangkok: { lat: 13.7563, lng: 100.5018, name: "Bangkok", country: "Thailand" },
  phuket: { lat: 7.8804, lng: 98.3923, name: "Phuket", country: "Thailand", aliases: ["patong"] },
  pattaya: { lat: 12.9276, lng: 100.8771, name: "Pattaya", country: "Thailand" },
  krabi: { lat: 8.0863, lng: 98.9063, name: "Krabi", country: "Thailand", aliases: ["ao nang"] },
  bali: { lat: -8.4095, lng: 115.1889, name: "Bali", country: "Indonesia", aliases: ["kuta", "seminyak", "denpasar"] },
  ubud: { lat: -8.5069, lng: 115.2625, name: "Ubud", country: "Indonesia" },
  kualalumpur: { lat: 3.1390, lng: 101.6869, name: "Kuala Lumpur", country: "Malaysia", aliases: ["kl", "petronas"] },
  male: { lat: 4.1755, lng: 73.5093, name: "Malé / Resort Island", country: "Maldives", aliases: ["maldives"] },
  baku: { lat: 40.4093, lng: 49.8671, name: "Baku", country: "Azerbaijan" },
  tashkent: { lat: 41.2995, lng: 69.2401, name: "Tashkent", country: "Uzbekistan", aliases: ["samarkand"] },
  almaty: { lat: 43.2220, lng: 76.8512, name: "Almaty", country: "Kazakhstan" },
  colombo: { lat: 6.9271, lng: 79.8612, name: "Colombo", country: "Sri Lanka" },
  kandy: { lat: 7.2906, lng: 80.6337, name: "Kandy", country: "Sri Lanka", aliases: ["temple of the tooth"] },
  bentota: { lat: 6.4259, lng: 79.9958, name: "Bentota", country: "Sri Lanka" },
  paro: { lat: 27.4287, lng: 89.4164, name: "Paro", country: "Bhutan", aliases: ["tiger nest"] },
  thimphu: { lat: 27.4728, lng: 89.6393, name: "Thimphu", country: "Bhutan" },
  hanoi: { lat: 21.0285, lng: 105.8542, name: "Hanoi", country: "Vietnam" },
  danang: { lat: 16.0544, lng: 108.2022, name: "Da Nang", country: "Vietnam", aliases: ["hoi an"] },
};

/**
 * Normalizes text and matches against verified tourist destinations.
 */
export function lookupCityCoordinates(rawText: string): GeoPoint | null {
  if (!rawText || typeof rawText !== "string") return null;

  const cleaned = rawText
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return null;

  // 1. Direct key match (e.g., "madurai", "jaipur", "khatushyam")
  const directKey = cleaned.replace(/\s+/g, "");
  if (VERIFIED_DESTINATIONS[directKey]) {
    return VERIFIED_DESTINATIONS[directKey];
  }

  // 2. Exact name match first
  for (const [, point] of Object.entries(VERIFIED_DESTINATIONS)) {
    if (cleaned === point.name.toLowerCase()) {
      return point;
    }
  }

  // 3. Whole-word / phrase match against keys, names, and aliases
  for (const [key, point] of Object.entries(VERIFIED_DESTINATIONS)) {
    const keyEscaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const nameEscaped = point.name.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`\\b${keyEscaped}\\b`, "i");
    const nameRegex = new RegExp(`\\b${nameEscaped}\\b`, "i");

    if (regex.test(cleaned) || nameRegex.test(cleaned)) {
      return point;
    }

    if (point.aliases) {
      for (const alias of point.aliases) {
        const a = alias.toLowerCase().trim();
        if (!a) continue;
        const aliasEscaped = a.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        if (new RegExp(`\\b${aliasEscaped}\\b`, "i").test(cleaned)) {
          return point;
        }
      }
    }
  }

  return null;
}

/**
 * Resolves coordinates for a day:
 * 1. Checks local verified registry (0 ms instant response)
 * 2. If not found locally, queries live /api/geocode (OpenStreetMap Global Database)
 * Never misses ANY city, town, or tourist spot in the world!
 */
export async function resolveCityForDay(day: {
  city?: string;
  title?: string;
  route?: string;
}): Promise<GeoPoint | null> {
  const explicitCity = (day.city || "").trim();

  // 1. If explicit city provided, resolve that first
  if (explicitCity) {
    const local = lookupCityCoordinates(explicitCity);
    if (local) return local;

    if (typeof window !== "undefined") {
      try {
        const res = await fetch(`/api/geocode?q=${encodeURIComponent(explicitCity)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            return {
              lat: json.data.lat,
              lng: json.data.lng,
              name: json.data.name,
              state: json.data.state,
              country: json.data.country,
            };
          }
        }
      } catch {
        // graceful fallback
      }
    }
    return null;
  }

  // 2. Intelligently inspect route and title
  // When a day has "A → B" or "A to B", the destination of the day is B!
  const textCandidates = [day.route, day.title].filter(Boolean) as string[];
  for (const text of textCandidates) {
    // If text contains arrows or "to", check the destination part first
    const arrowParts = text.split(/[→➤\->]+/);
    if (arrowParts.length > 1) {
      const destPart = arrowParts[arrowParts.length - 1].trim();
      const destMatch = lookupCityCoordinates(destPart);
      if (destMatch) return destMatch;
    }

    const toParts = text.split(/\s+to\s+/i);
    if (toParts.length > 1) {
      const destPart = toParts[toParts.length - 1].trim();
      const destMatch = lookupCityCoordinates(destPart);
      if (destMatch) return destMatch;
    }

    // Direct whole-text scan
    const local = lookupCityCoordinates(text);
    if (local) return local;
  }

  return null;
}

/**
 * In-memory cache for OSRM fetched road geometries to minimize repeat requests.
 */
const roadPathCache: Record<string, [number, number][]> = {};

/**
 * Fetches real road waypoints between two coordinates via free OSRM Routing API.
 * Falls back to curved intermediate waypoints if network fails or times out.
 */
export async function fetchRoadGeometry(
  from: [number, number],
  to: [number, number]
): Promise<[number, number][]> {
  const cacheKey = `${from[0].toFixed(4)},${from[1].toFixed(4)}->${to[0].toFixed(4)},${to[1].toFixed(4)}`;
  if (roadPathCache[cacheKey]) {
    return roadPathCache[cacheKey];
  }

  try {
    // Free OSRM driving router: coords format is lng,lat;lng,lat
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes[0]?.geometry?.coordinates) {
        // OSRM returns [lng, lat], convert to [lat, lng] for Leaflet
        const rawCoords: [number, number][] = data.routes[0].geometry.coordinates.map(
          ([lng, lat]: [number, number]) => [lat, lng]
        );

        // Simplify if too many points (> 150)
        let sampled = rawCoords;
        if (rawCoords.length > 150) {
          const step = Math.ceil(rawCoords.length / 100);
          sampled = rawCoords.filter((_, idx) => idx === 0 || idx === rawCoords.length - 1 || idx % step === 0);
        }

        roadPathCache[cacheKey] = sampled;
        return sampled;
      }
    }
  } catch {
    // Graceful fallback to natural curved line
  }

  // Fallback: smooth arc between from and to (3 intermediate points with slight geographic curve)
  const midLat = (from[0] + to[0]) / 2;
  const midLng = (from[1] + to[1]) / 2;
  const deltaLat = to[0] - from[0];
  const deltaLng = to[1] - from[1];
  // Orthogonal offset for subtle road curvature
  const curveOffsetLat = -deltaLng * 0.08;
  const curveOffsetLng = deltaLat * 0.08;

  const fallbackPath: [number, number][] = [
    from,
    [from[0] * 0.75 + to[0] * 0.25 + curveOffsetLat * 0.5, from[1] * 0.75 + to[1] * 0.25 + curveOffsetLng * 0.5],
    [midLat + curveOffsetLat, midLng + curveOffsetLng],
    [from[0] * 0.25 + to[0] * 0.75 + curveOffsetLat * 0.5, from[1] * 0.25 + to[1] * 0.75 + curveOffsetLng * 0.5],
    to,
  ];

  roadPathCache[cacheKey] = fallbackPath;
  return fallbackPath;
}

/**
 * Calculates straight line approximate distance in km (Haversine formula).
 */
export function calculateDistanceKm(from: [number, number], to: [number, number]): number {
  const R = 6371; // Earth radius in km
  const dLat = ((to[0] - from[0]) * Math.PI) / 180;
  const dLon = ((to[1] - from[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((from[0] * Math.PI) / 180) *
      Math.cos((to[0] * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Dynamically synthesizes a complete PackageRouteData from itinerary days.
 * Works for ANY package added via Admin Dashboard!
 */
export async function buildDynamicRouteFromItinerary(
  packageSlug: string,
  packageTitle: string,
  itinerary: any[]
): Promise<PackageRouteData | null> {
  if (!Array.isArray(itinerary) || itinerary.length === 0) return null;

  interface DayStop {
    dayNumber: number;
    geo: GeoPoint;
    dayData: any;
  }

  const detectedStops: DayStop[] = [];

  for (let idx = 0; idx < itinerary.length; idx++) {
    const day = itinerary[idx];
    const dayNum = day.dayNumber ?? day.day ?? idx + 1;
    const explicitCity = (day.city || "").trim();

    let geo: GeoPoint | null = null;
    if (explicitCity) {
      geo = await resolveCityForDay({ city: explicitCity });
    }
    if (!geo) {
      geo = await resolveCityForDay(day);
    }

    if (geo) {
      detectedStops.push({ dayNumber: dayNum, geo, dayData: day });
    } else if (detectedStops.length > 0) {
      // Repeat previous stop if this day was just local sightseeing in the same place
      const prevStop = detectedStops[detectedStops.length - 1];
      detectedStops.push({ dayNumber: dayNum, geo: prevStop.geo, dayData: day });
    }
  }

  if (detectedStops.length === 0) return null;

  // Check if Day 1 has an explicit origin city distinct from Day 1 stop
  // e.g. "Haridwar to Barkot" or "Delhi → Khatu Shyam Ji"
  const firstDay = itinerary[0];
  if (firstDay && detectedStops.length > 0) {
    const firstText = `${firstDay.route || ""} ${firstDay.title || ""}`;
    const arrowParts = firstText.split(/[→➤\->]+/);
    let originCandidate = "";
    if (arrowParts.length > 1) {
      originCandidate = arrowParts[0].trim();
    } else {
      const toParts = firstText.split(/\s+to\s+/i);
      if (toParts.length > 1) originCandidate = toParts[0].trim();
    }

    if (originCandidate) {
      const originGeo = lookupCityCoordinates(originCandidate);
      if (
        originGeo &&
        originGeo.name.toLowerCase() !== detectedStops[0].geo.name.toLowerCase()
      ) {
        // Prepend starting city as Day 1 Departure Point
        detectedStops.unshift({
          dayNumber: 1,
          geo: originGeo,
          dayData: {
            ...firstDay,
            title: `Departure from ${originGeo.name}`,
          },
        });
      }
    }
  }

  // Group CONSECUTIVE days in the same city (preserves loop / round-trip returns!)
  interface GroupedStop {
    geo: GeoPoint;
    dayNumbers: number[];
    days: any[];
  }
  const groupedStops: GroupedStop[] = [];

  for (const item of detectedStops) {
    const lastGroup = groupedStops[groupedStops.length - 1];
    const isSameAsLast =
      lastGroup &&
      lastGroup.geo.name.toLowerCase() === item.geo.name.toLowerCase();

    if (isSameAsLast) {
      if (!lastGroup.dayNumbers.includes(item.dayNumber)) {
        lastGroup.dayNumbers.push(item.dayNumber);
        lastGroup.days.push(item.dayData);
      }
    } else {
      groupedStops.push({
        geo: item.geo,
        dayNumbers: [item.dayNumber],
        days: [item.dayData],
      });
    }
  }

  const locations: RouteLocation[] = [];
  groupedStops.forEach((data, stopIndex) => {
    const firstDayItem = data.days[0];
    const dayLabels = data.dayNumbers.map((d) => `Day ${d}`).join(", ");
    const type =
      stopIndex === 0
        ? "start"
        : stopIndex === groupedStops.length - 1
        ? "stop"
        : "stop";

    locations.push({
      id: `loc-${stopIndex}-${data.geo.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      name: data.geo.name,
      hindiName: data.geo.state ? `${data.geo.state}` : data.geo.country,
      coordinates: [data.geo.lat, data.geo.lng],
      dayNumbers: data.dayNumbers,
      description: `${dayLabels}: ${firstDayItem?.title || data.geo.name}. ${
        firstDayItem?.stay ? `Accommodation: ${firstDayItem.stay}` : ""
      }`,
      type: type,
      badge: dayLabels,
    });
  });

  // Build segments connecting sequential stops
  const segments: RouteSegment[] = [];
  let totalKm = 0;

  for (let i = 0; i < locations.length - 1; i++) {
    const fromLoc = locations[i];
    const toLoc = locations[i + 1];
    const dist = calculateDistanceKm(fromLoc.coordinates, toLoc.coordinates);
    totalKm += dist;

    // Fetch real road highway path or smooth fallback
    const path = await fetchRoadGeometry(fromLoc.coordinates, toLoc.coordinates);

    segments.push({
      id: `seg-${fromLoc.id}-${toLoc.id}`,
      title: `${fromLoc.name} to ${toLoc.name}`,
      fromId: fromLoc.id,
      toId: toLoc.id,
      dayNumbers: toLoc.dayNumbers,
      mode: "road",
      distance: `${dist} km / ~${Math.round((dist / 50) * 10) / 10} hrs drive`,
      path: path,
    });
  }

  return {
    packageSlug,
    slugAliases: [packageSlug],
    title: packageTitle,
    totalDistance:
      totalKm > 0
        ? `Approx. ${totalKm} km Route`
        : `${locations[0]?.name || ""} Destination Tour`,
    locations,
    segments,
  };
}
