const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const { v2: cloudinary } = require('cloudinary');

// 1. Read environment variables from .env.local
const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = (match[2] || '').trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

// 2. Helper to fetch 1920px Wikimedia image
async function getWikimediaImageUrl(filename, width = 1920) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ShreeAnantaTravels/1.0 (contact@shreeanantatravels.com)' } });
  const data = await res.json();
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  if (pageId === '-1') throw new Error(`File not found: ${filename}`);
  const info = pages[pageId].imageinfo[0];
  return info.thumburl || info.url;
}

// 3. Helper to upload image buffer to Cloudinary
function uploadBufferToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ananda-travel/packages',
        format: 'webp',
        quality: 'auto:good'
      },
      (error, result) => {
        if (error) return reject(error);
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Failed to get secure URL from Cloudinary'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

// Cache to prevent duplicate uploads if the same wiki image is referenced
const uploadCache = {};

async function fetchAndUploadWikiImage(filename, label) {
  if (uploadCache[filename]) {
    console.log(`[Cache Hit] ${label} (${filename})`);
    return uploadCache[filename];
  }
  console.log(`Fetching 1920px image for: ${label} (${filename})...`);
  const directUrl = await getWikimediaImageUrl(filename, 1920);
  const resp = await fetch(directUrl, { headers: { 'User-Agent': 'ShreeAnantaTravels/1.0 (contact@shreeanantatravels.com)' } });
  if (!resp.ok) throw new Error(`Failed to download ${filename}: ${resp.status} ${resp.statusText}`);
  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  console.log(`Uploading to Cloudinary (WebP)...`);
  const secureUrl = await uploadBufferToCloudinary(buffer);
  console.log(`✓ Uploaded: ${secureUrl}`);
  uploadCache[filename] = secureUrl;
  return secureUrl;
}

// 4. Data configurations for all 6 packages
const packageConfigs = [
  // -------------------------------------------------------------
  // 1. South Yatra (with Trivandrum, ₹41,000)
  // -------------------------------------------------------------
  {
    key: "south_with_trivandrum",
    id: "6ab3d567402dcb770495e5fb",
    images: [
      { pos: 1, label: "Vivekananda Rock Memorial & Thiruvalluvar Statue Kanyakumari", wiki: "Vivekananda rock Memorial and Thiruvalluvar Statue.jpg" },
      { pos: 2, label: "Meenakshi Amman Temple Madurai", wiki: "Sri Meenakshi Devasthanam Temple (east-exposure).jpg" },
      { pos: 3, label: "Pamban Railway Bridge Rameshwaram", wiki: "Pamban railway bridge, rameswaram.jpg" },
      { pos: 4, label: "Sree Padmanabhaswamy Temple Trivandrum", wiki: "Sree Padmanabhaswamy Temple Lakshadeepam.jpg" }
    ],
    updateFields: {
      discountedPrice: 41000,
      isActive: true
    }
  },

  // -------------------------------------------------------------
  // 2. South Yatra (without Trivandrum, ₹30,000)
  // -------------------------------------------------------------
  {
    key: "south_without_trivandrum",
    id: "6aba7cc2dc2983cb66db5879",
    images: [
      { pos: 1, label: "Vivekananda Rock Memorial & Thiruvalluvar Statue Kanyakumari", wiki: "Statue of Thiruvalluvar and Vivekananda Rock Memorial.jpg" },
      { pos: 2, label: "Meenakshi Amman Temple Madurai", wiki: "Temple de Mînâkshî01.jpg" },
      { pos: 3, label: "Pamban Bridge Rameshwaram", wiki: "Pamban Bridge, Rameswaram 1.jpg" },
      { pos: 4, label: "Ramanathaswamy Temple 1000 Pillar Corridor Rameshwaram", wiki: "Ramanathaswamy Temple corridor 01.jpg" }
    ],
    updateFields: {
      title: "Madurai Rameshwaram Kanyakumari Tour Package – 5 Nights / 6 Days",
      slug: "madurai-rameshwaram-kanyakumari-tour-package-6-days",
      redirectFromSlugs: [
        "south-india-darshan-6-days",
        "south-india-darshan",
        "south-yatra-30000"
      ],
      location: "Madurai, Rameshwaram, Kanyakumari",
      duration: "5 Nights / 6 Days",
      category: "domestic",
      packageType: "pilgrimage",
      description: "A sacred journey through the revered temple shrines and coastal heritage of South India. The tour begins in Madurai with darshan at the Meenakshi Amman Temple and Koodal Azhagar Temple, then travels to Rameshwaram for the Ramanathaswamy Temple (one of the twelve Jyotirlingas), the Pamban Bridge, Agnitheertham and Dhanushkodi. In Kanyakumari you visit Triveni Sangam, the sunset and sunrise points, Vivekananda Rock Memorial, Thiruvalluvar Statue, Bhagavathy Amman Temple and Padmanabhapuram Palace before completing your return departure transfer to Madurai.",
      route: "Madurai → Rameshwaram → Kanyakumari → Madurai",
      departure: "Madurai Airport / Railway Station",
      tourStyle: "Spiritual & Coastal Road Trip",
      routeBannerTitle: "Madurai, Rameshwaram & Kanyakumari",
      routeBannerSubtitle: "Meenakshi Temple • Pamban Bridge • Ramanathaswamy • Vivekananda Rock",
      enableRouteMap: true,
      enableAltitude: false,
      originalPrice: 0,
      discountedPrice: 30000,
      isActive: true,
      isTrending: true,
      hasOffer: false,
      badges: ["bestseller"],
      trustFeatures: [
        "3-Star Hotel Stay: Inclusive of all taxes with daily breakfast and dinner included",
        "Dedicated Private Vehicle: Dzire / Innova / Tempo Traveller throughout the road trip",
        "Sacred Jyotirlinga & Ocean Sangam: Meenakshi Amman, Ramanathaswamy & Vivekananda Rock",
        "100% Transparent: All tolls, parking, fuel charges, and driver allowances included"
      ],
      conciergeTitle: "South Yatra Pilgrimage Specialist",
      conciergeSubtitle: "Looking for 5-star hotel upgrades, special puja assistance, or custom family dates? Speak directly with our South India tour desk.",
      itinerary: [
        {
          dayNumber: 1,
          title: "Arrival in Madurai – Temple & Heritage Exploration",
          city: "Madurai",
          route: "Madurai Airport / Railway Station → Hotel → Madurai temples",
          altitude: "",
          stay: "Madurai (3-star hotel)",
          meals: "Dinner included",
          transport: "Dedicated vehicle (Dzire / Innova / Tempo Traveller)",
          description: "• Upon arrival at Madurai Airport or Railway Station, transfer to your hotel and complete check-in formalities.\n• Begin your sightseeing with a visit to the magnificent Meenakshi Amman Temple, taking blessings of Lord Shiva and Goddess Meenakshi.\n• Later, visit the sacred Koodal Azhagar Temple, one of the city's most revered Vaishnavite shrines.\n• Spend the evening soaking in the spiritual charm and cultural richness of Madurai.\n• Overnight stay in Madurai."
        },
        {
          dayNumber: 2,
          title: "Madurai to Rameswaram (Pamban Bridge & Ramanathaswamy Temple)",
          city: "Rameshwaram",
          route: "Madurai → Rameshwaram",
          altitude: "",
          stay: "Rameshwaram (3-star hotel)",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle",
          description: "• Depart from Madurai towards Rameswaram. En route, witness the iconic Pamban Bridge, an engineering marvel connecting Rameswaram Island to mainland India.\n• Upon arrival, visit Agnitheertham in the evening, a sacred seafront pilgrimage site where devotees perform holy rituals.\n• Continue to the revered Ramanathaswamy Temple, one of the twelve Jyotirlingas.\n• The temple features 22 sacred wells (kunds or theerthams), representing the 22 arrows in Lord Rama's quiver.\n• Overnight stay in Rameswaram."
        },
        {
          dayNumber: 3,
          title: "Rameswaram Sightseeing, Dhanushkodi & Ram Setu View Point",
          city: "Rameshwaram",
          route: "Rameshwaram local sightseeing",
          altitude: "",
          stay: "Rameshwaram (3-star hotel)",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle",
          description: "• Begin the day with morning darshan at Ramanathaswamy Temple and visit the Panchamukhi Hanuman Temple with its unique five-faced idol of Lord Hanuman.\n• Explore Dhanushkodi Beach, where history, mythology and natural beauty converge.\n• Stop at Kothandaramaswamy Temple, believed to be where Vibhishana sought refuge with Lord Rama.\n• End sightseeing at the Ram Setu View Point, offering vistas of the legendary bridge from the Ramayana, along with the floating stones.\n• Overnight stay in Rameswaram."
        },
        {
          dayNumber: 4,
          title: "Rameswaram to Kanyakumari (Southernmost Tip of India)",
          city: "Kanyakumari",
          route: "Rameshwaram → Kanyakumari",
          altitude: "",
          stay: "Kanyakumari (3-star hotel)",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle",
          description: "• Drive from Rameswaram to Kanyakumari. Upon arrival, check in to your hotel and unwind.\n• In the evening, visit Kanyakumari Beach and experience India's southernmost coastline.\n• Explore Triveni Sangam, the sacred confluence where the Arabian Sea, the Bay of Bengal, and the Indian Ocean meet.\n• Conclude the evening taking in sunset views at Sunset Point.\n• Overnight stay in Kanyakumari."
        },
        {
          dayNumber: 5,
          title: "Kanyakumari Sightseeing (Monuments, Temples & Royal Palace)",
          city: "Kanyakumari",
          route: "Kanyakumari local sightseeing",
          altitude: "",
          stay: "Kanyakumari (3-star hotel)",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle",
          description: "• Witness the golden sunrise at Sunrise Point.\n• Visit the iconic Vivekananda Rock Memorial offshore where Swami Vivekananda meditated, and view the grand Thiruvalluvar Statue.\n• Continue to the sacred Bhagavathy Amman Temple, dedicated to Goddess Kanya Kumari.\n• Visit the Gandhi Memorial Mandapam at the site where Mahatma Gandhi's ashes were placed.\n• Explore the historic Padmanabhapuram Palace showcasing traditional architectural woodwork.\n• Overnight stay in Kanyakumari."
        },
        {
          dayNumber: 6,
          title: "Checkout & Return Departure Transfer to Madurai",
          city: "Madurai",
          route: "Kanyakumari → Madurai Airport / Railway Station",
          altitude: "",
          stay: "Departure",
          meals: "Breakfast included",
          transport: "Dedicated vehicle",
          description: "• Complete checkout formalities at your hotel in Kanyakumari.\n• Board your dedicated vehicle and proceed towards Madurai Airport or Madurai Railway Station for your onward journey.\n• Your tour concludes with wonderful memories and divine blessings."
        }
      ],
      tags: [
        "South Yatra",
        "Madurai Rameshwaram Kanyakumari",
        "South India Tour Package",
        "Ramanathaswamy Temple",
        "Meenakshi Amman Temple",
        "Vivekananda Rock Memorial",
        "Pamban Bridge"
      ],
      seo: {
        title: "Madurai Rameshwaram Kanyakumari Tour Package 6 Days / 5 Nights | Shree Ananta Travels",
        description: "Book 6 Days / 5 Nights South Yatra tour covering Madurai Meenakshi Temple, Rameshwaram Jyotirlinga, Dhanushkodi and Kanyakumari with 3-star hotel & private vehicle.",
        focusKeyword: "madurai rameshwaram kanyakumari tour package",
        relatedKeywords: [
          "madurai rameshwaram kanyakumari tour package 6 days",
          "south yatra without trivandrum",
          "rameshwaram kanyakumari tour package",
          "south india temple tour from madurai"
        ]
      }
    }
  },

  // -------------------------------------------------------------
  // 3. Char Dham: Char Dham Yatra from Haridwar – 10 Days / 9 Nights
  // -------------------------------------------------------------
  {
    key: "char_dham",
    slug: "char-dham-yatra-from-haridwar-10-days",
    images: [
      { pos: 1, label: "Kedarnath Temple with snow-capped Himalayas", wiki: "Kedarnath temple, Uttrakhand 02.jpg" },
      { pos: 2, label: "Badrinath Temple Uttarakhand", wiki: "Badrinath temple - Uttarakhand 1.jpg" },
      { pos: 3, label: "Gangotri Town & Bhagirathi River", wiki: "Gangotri Town.jpg" },
      { pos: 4, label: "Yamunotri Shrine Himalayas", wiki: "Yamunotri shrine.jpg" }
    ],
    fullDoc: {
      title: "Char Dham Yatra from Haridwar – 9 Nights / 10 Days",
      slug: "char-dham-yatra-from-haridwar-10-days",
      redirectFromSlugs: [
        "char-dham-yatra",
        "char-dham-yatra-from-haridwar",
        "char-dham-10-days",
        "yamunotri-gangotri-kedarnath-badrinath"
      ],
      location: "Haridwar, Yamunotri, Gangotri, Kedarnath, Badrinath",
      duration: "9 Nights / 10 Days",
      category: "domestic",
      packageType: "pilgrimage",
      description: "The Char Dham Yatra is one of the most venerated spiritual pilgrimages in the world, nestling high among the majestic peaks of the Indian Himalayas in Uttarakhand. Encompassing four holy shrines—Yamunotri, Gangotri, Kedarnath, and Badrinath—this journey transcends mere sightseeing to offer a profound voyage of devotion, inner reflection, and spiritual renewal with private transport and comfortable stays.",
      route: "Haridwar → Barkot → Yamunotri → Uttarkashi → Gangotri → Guptkashi → Kedarnath → Badrinath → Rudraprayag → Rishikesh → Haridwar",
      departure: "Haridwar Railway Station / Dehradun Airport",
      tourStyle: "Sacred Himalayan Pilgrimage",
      routeBannerTitle: "Char Dham Yatra from Haridwar",
      routeBannerSubtitle: "Yamunotri • Gangotri • Kedarnath • Badrinath",
      enableRouteMap: true,
      enableAltitude: true,
      originalPrice: 0,
      discountedPrice: 0,
      isActive: true,
      isTrending: true,
      hasOffer: false,
      badges: ["featured", "bestseller"],
      trustFeatures: [
        "Complete 4 Dhams: Comprehensive darshan of Yamunotri, Gangotri, Kedarnath & Badrinath",
        "Dedicated Vehicle: Comfortable vehicle with experienced Himalayan mountain drivers",
        "Hotel & Camp Accommodations: Verified twin-sharing stays with daily breakfast and dinner included",
        "100% Transparent: All toll taxes, hill state permits, fuel charges and driver allowances included"
      ],
      conciergeTitle: "Char Dham Pilgrimage Desk",
      conciergeSubtitle: "Looking for helicopter tickets, VIP darshan assistance, or customized family departure dates? Contact our Himalayan yatra specialists directly.",
      itinerary: [
        {
          dayNumber: 1,
          title: "Haridwar to Barkot via Mussoorie (En-Route Kempty Falls)",
          city: "Barkot",
          route: "Haridwar → Mussoorie → Barkot",
          altitude: "2,118 m",
          stay: "Hotel / Camp in Barkot",
          meals: "Dinner included",
          transport: "Dedicated vehicle (Innova / Tempo Traveller)",
          description: "• Upon arrival at Haridwar Railway Station, receive a warm pickup and commence your scenic drive towards Barkot at the foot of Yamunotri.\n• En-route, subject to local administration approval, visit the renowned Kempty Falls in Mussoorie.\n• Check in to your hotel or camp in Barkot for an evening at leisure amidst lush valley vistas.\n• Overnight stay in Barkot."
        },
        {
          dayNumber: 2,
          title: "Barkot to Yamunotri Dham Darshan & Return to Barkot",
          city: "Yamunotri",
          route: "Barkot → Jankichatti (44 km) → Yamunotri trek (6 km) → Barkot",
          altitude: "3,291 m",
          stay: "Hotel / Camp in Barkot",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle + mountain trek",
          description: "• Early morning drive from Barkot to Jankichatti (44 km).\n• From Jankichatti, begin your 6 km trek to the holy shrine of Yamunotri along the picturesque Yamuna valley.\n• Upon reaching the temple, perform holy rituals and offer prayers at the black marble idol of Goddess Yamuna.\n• Trek back to Jankichatti and drive back to Barkot.\n• Overnight stay in Barkot."
        },
        {
          dayNumber: 3,
          title: "Barkot to Uttarkashi (Shiva Cave, Kashi Vishwanath & Shakti Peeth)",
          city: "Uttarkashi",
          route: "Barkot → Uttarkashi (approx. 100 km / 4 hrs)",
          altitude: "1,158 m",
          stay: "Hotel in Uttarkashi",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle",
          description: "• After breakfast, drive from Barkot towards Uttarkashi.\n• En-route, visit the revered Prakateshwar Mahadev Temple (Shiva Cave).\n• In Uttarkashi, visit the historic Kashi Vishwanath Temple featuring the Akhand Jyoti, and the Shakti Temple with its massive 6-meter Trishul.\n• Check in to your hotel and spend the evening relaxing by the holy Bhagirathi river.\n• Overnight stay in Uttarkashi."
        },
        {
          dayNumber: 4,
          title: "Uttarkashi to Gangotri Dham Darshan & Return to Uttarkashi",
          city: "Gangotri",
          route: "Uttarkashi → Harsil → Gangotri (100 km each way) → Uttarkashi",
          altitude: "3,100 m",
          stay: "Hotel in Uttarkashi",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle",
          description: "• Early morning drive towards Gangotri passing through scenic landscapes including Gangnani hot springs, Jhala Valley, Bhairon Ghati, and apple orchards of Harsil.\n• At Gangotri, perform Pooja, Darshan and holy rituals along the sacred banks of River Bhagirathi.\n• Return to Uttarkashi in the evening.\n• Overnight stay in Uttarkashi."
        },
        {
          dayNumber: 5,
          title: "Uttarkashi to Guptkashi / Sitapur / Rampur via Chaurangi Khal",
          city: "Guptkashi",
          route: "Uttarkashi → Chaurangi Khal → Guptkashi / Sitapur / Rampur",
          altitude: "1,319 m",
          stay: "Hotel / Camp in Guptkashi or Sitapur",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle",
          description: "• Depart after breakfast for your journey towards Guptkashi / Sitapur / Rampur.\n• Drive through the captivating mountain pass of Chaurangi Khal with views of the Mandakini river valley.\n• Visit the ancient Ardhnareshwar Temple in Guptkashi.\n• Check in to your hotel/camp and rest early to prepare for the Kedarnath trek.\n• Overnight stay in Guptkashi / Sitapur / Rampur."
        },
        {
          dayNumber: 6,
          title: "Guptkashi to Kedarnath Dham (Holy Trek & Evening Darshan)",
          city: "Kedarnath",
          route: "Guptkashi → Sonprayag → Gaurikund → 18 km trek to Kedarnath",
          altitude: "3,583 m",
          stay: "Govt. Camps / Lodges in Kedarnath",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle + local shuttle + mountain trek",
          description: "• Early morning drive to Sonprayag, then board a local shared shuttle to Gaurikund.\n• Commence the sacred 18 km trek to Kedarnath through rugged mountain trails with views of snow-capped peaks.\n• Check in at Government Camps / Lodges in Kedarnath.\n• Attend the evening Aarti and Darshan at the sacred Kedarnath Temple dedicated to Lord Shiva.\n• Overnight stay in Kedarnath."
        },
        {
          dayNumber: 7,
          title: "Kedarnath Morning Abhishek, Descent to Gaurikund & Drive to Guptkashi",
          city: "Guptkashi",
          route: "Kedarnath → Gaurikund (18 km descent) → Sonprayag → Guptkashi / Sitapur",
          altitude: "1,319 m",
          stay: "Hotel in Guptkashi / Sitapur / Rampur",
          meals: "Breakfast and dinner",
          transport: "Mountain trek + local shuttle + dedicated vehicle",
          description: "• Arise before dawn to attend the morning Abhishek and Darshan at Kedarnath Temple.\n• Begin the descent trek back to Gaurikund.\n• Board the local shuttle to Sonprayag where your personal vehicle awaits.\n• Drive back to your hotel in Guptkashi / Sitapur / Rampur to relax and recover.\n• Overnight stay in Guptkashi / Sitapur."
        },
        {
          dayNumber: 8,
          title: "Guptkashi to Badrinath via Chopta & Joshimath (Evening Darshan)",
          city: "Badrinath",
          route: "Guptkashi → Chopta → Joshimath → Badrinath (approx. 190 km)",
          altitude: "3,133 m",
          stay: "Hotel in Badrinath",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle",
          description: "• Drive towards Badrinath via the lush alpine meadows of Chopta and Joshimath (visiting Narsingh Temple).\n• Arrive in Badrinath, check into your hotel, and take a holy dip in the natural thermal springs of Tapt Kund.\n• Attend evening Darshan and Aarti at the sacred Badrinath Temple dedicated to Lord Badri Narayan.\n• Overnight stay in Badrinath."
        },
        {
          dayNumber: 9,
          title: "Badrinath Morning Darshan, Mana Village Sightseeing & Drive to Rudraprayag",
          city: "Rudraprayag",
          route: "Badrinath → Mana Village → Joshimath → Karanprayag → Rudraprayag",
          altitude: "895 m",
          stay: "Hotel in Rudraprayag",
          meals: "Breakfast and dinner",
          transport: "Dedicated vehicle",
          description: "• Attend morning Darshan at Badrinath Temple.\n• Explore Mana Village—the last Indian village before the Tibet border—visiting Vyas Gufa, Ganesh Gufa, and Mata Murti Temple.\n• Drive to Rudraprayag via Joshimath, witnessing the holy river confluence at Karanprayag (Alaknanda & Pindar rivers).\n• Check in to your hotel in Rudraprayag.\n• Overnight stay in Rudraprayag."
        },
        {
          dayNumber: 10,
          title: "Rudraprayag to Haridwar via Rishikesh (Ram Jhula & Departure)",
          city: "Haridwar",
          route: "Rudraprayag → Rishikesh → Haridwar (approx. 160 km)",
          altitude: "314 m",
          stay: "Departure",
          meals: "Breakfast included",
          transport: "Dedicated vehicle",
          description: "• Following breakfast, drive towards Haridwar via Rishikesh, the Yoga Capital of the World.\n• En-route, visit landmark Rishikesh attractions including Ram Jhula, Laxman Jhula, and the holy banks of River Ganga.\n• Continue your drive to Haridwar for final drop-off at Haridwar Railway Station / designated location, completing your sacred pilgrimage."
        }
      ],
      inclusions: [
        "Accommodation on Twin-Sharing basis in hotels/camps/lodges as per itinerary",
        "Daily Breakfast and Dinner at hotel/camp places of stay",
        "Transportation using dedicated vehicle (AC effective till Rishikesh only, non-AC in hill terrain)",
        "All vehicle fuel costs, driver allowances, toll taxes, and hill state permit taxes included",
        "Sightseeing as per itinerary across Yamunotri, Gangotri, Kedarnath and Badrinath"
      ],
      exclusions: [
        "5% GST",
        "Palki, Pony, Horse, or Porter charges for Yamunotri and Kedarnath treks",
        "Local shared shuttle / jeep charges between Sonprayag and Gaurikund (both ways)",
        "Sightseeing points explicitly excluded in operational notes (Triyogi Narayan, Kalimath, etc.)",
        "Personal expenses such as laundry, phone calls, tips, or extra meals/beverages",
        "Expenses arising due to landslides, roadblocks, severe weather, or unforeseen diversions"
      ],
      termsAndConditions: [
        "AC Operation: AC operates strictly in the plains up to Rishikesh and is switched off in hill terrain or stationary vehicle.",
        "Mountain Shuttle: As per Uttarakhand administration regulations, private vehicles stop at Sonprayag. Gaurikund shuttle is via local jeeps at own cost.",
        "Trek Options: Pony, horse, palki, and helicopter tickets for Kedarnath/Yamunotri are payable directly on-site.",
        "Advance Payment: 10% advance required to confirm booking; balance as per confirmed payment schedule."
      ],
      tags: [
        "Char Dham Yatra",
        "Char Dham from Haridwar",
        "Kedarnath",
        "Badrinath",
        "Gangotri",
        "Yamunotri",
        "Uttarakhand Pilgrimage",
        "Himalayan Tour"
      ],
      seo: {
        title: "Char Dham Yatra from Haridwar 10 Days / 9 Nights | Shree Ananta Travels",
        description: "Book complete 10 Days / 9 Nights Char Dham Yatra package from Haridwar covering Yamunotri, Gangotri, Kedarnath & Badrinath with hotels, meals & transfers.",
        focusKeyword: "char dham yatra from haridwar",
        relatedKeywords: [
          "char dham yatra 10 days package",
          "haridwar to char dham yatra",
          "kedarnath badrinath yamunotri gangotri package",
          "char dham yatra 2026 itinerary"
        ]
      }
    }
  },

  // -------------------------------------------------------------
  // 4. Do Dham: Do Dham Yatra from Haridwar: Kedarnath & Badrinath – 6 Days / 5 Nights
  // -------------------------------------------------------------
  {
    key: "do_dham",
    id: "6adbc11887f8dacf63abf3b8",
    images: [
      { pos: 1, label: "Kedarnath Temple Himalayas", wiki: "Kedarnath Temple and himalayas.jpg" },
      { pos: 2, label: "Badrinath Temple Uttarakhand", wiki: "Badrinath temple - Uttarakhand 2.jpg" },
      { pos: 3, label: "Har Ki Pauri Ganga Aarti Haridwar", wiki: "Aarti at Har-ki-Pauri, Haridwar.jpg" },
      { pos: 4, label: "Chopta Tungnath Meadows", wiki: "Chandrasila RohiniBugiyal view.jpg" }
    ],
    updateFields: {
      discountedPrice: 36000,
      isActive: true
    }
  },

  // -------------------------------------------------------------
  // 5. Rajasthan: Rajasthan Tour Package from Jaipur: Jaipur, Pushkar, Jodhpur, Jaisalmer & Udaipur – 9 Days / 8 Nights
  // -------------------------------------------------------------
  {
    key: "rajasthan",
    id: "6ab3cf68402dcb770495e4bf",
    images: [
      { pos: 1, label: "Hawa Mahal Jaipur Facade", wiki: "Hawa Mahal east facade (14-07-2022).jpg" },
      { pos: 2, label: "Sam Sand Dunes Jaisalmer Sunset", wiki: "Sunset Sand Dunes Jaisalmer Dec14 DSC 6540.jpg" },
      { pos: 3, label: "Mehrangarh Fort Jodhpur", wiki: "2 Mehrangarh fort Jodhpur Rajasthan.jpg" },
      { pos: 4, label: "Lake Pichola & City Palace Udaipur Night", wiki: "Udaipur City Palace at Night.jpg" }
    ],
    updateFields: {
      isActive: true
    }
  },

  // -------------------------------------------------------------
  // 6. Kerala: Kerala Tour Package from Delhi: Munnar, Thekkady, Alleppey & Kochi – 6 Days / 5 Nights
  // -------------------------------------------------------------
  {
    key: "kerala",
    id: "6adbccfba2f9959f3554bc0b",
    images: [
      { pos: 1, label: "Alleppey Houseboat on Backwaters", wiki: "Houseboat on Alleppey backwaters (Kerala, India 2023) (52704577484).jpg" },
      { pos: 2, label: "Munnar Tea Gardens", wiki: "Munnar Tea Gardens.jpg" },
      { pos: 3, label: "Thekkady Periyar Lake Boat Safari", wiki: "Periyar National Park-Thekkady Lake - Jalakanyaka-WUS07796.jpg" },
      { pos: 4, label: "Kochi Chinese Fishing Nets Sunset", wiki: "Kochi chinese fishing-net-20080215-01a.jpg" }
    ],
    updateFields: {
      discountedPrice: 32500,
      isActive: true
    }
  }
];

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

  console.log('\n============================================================');
  console.log('STARTING IMAGE UPLOADS AND PACKAGE UPDATES FOR 6 PACKAGES');
  console.log('============================================================\n');

  for (const pkgConf of packageConfigs) {
    console.log(`\n>>> Processing package: ${pkgConf.key.toUpperCase()} <<<`);
    
    // 1. Upload 4 images to Cloudinary
    const uploadedUrls = {};
    for (const imgItem of pkgConf.images) {
      try {
        const secureUrl = await fetchAndUploadWikiImage(imgItem.wiki, imgItem.label);
        uploadedUrls[`imageUrl${imgItem.pos}`] = secureUrl;
      } catch (err) {
        console.error(`ERROR uploading ${imgItem.label}:`, err.message);
      }
    }

    console.log(`Image URLs for ${pkgConf.key}:`, uploadedUrls);

    // 2. Update or Create in DB
    if (pkgConf.id) {
      const updateData = {
        ...pkgConf.updateFields,
        ...uploadedUrls,
        updatedAt: new Date()
      };
      const updated = await Package.findByIdAndUpdate(pkgConf.id, { $set: updateData }, { new: true });
      console.log(`✓ Package updated in DB: [${updated._id}] "${updated.title}"`);
    } else if (pkgConf.fullDoc) {
      // Find existing by slug or create
      let existing = await Package.findOne({ slug: pkgConf.fullDoc.slug });
      if (!existing) {
        existing = await Package.findOne({ title: pkgConf.fullDoc.title });
      }

      const fullData = {
        ...pkgConf.fullDoc,
        ...uploadedUrls,
        updatedAt: new Date()
      };

      let result;
      if (existing) {
        console.log(`Found existing document for ${pkgConf.key}, updating ID: ${existing._id}`);
        result = await Package.findByIdAndUpdate(existing._id, { $set: fullData }, { new: true });
      } else {
        console.log(`Creating new package document for ${pkgConf.key}...`);
        fullData.createdAt = new Date();
        result = await Package.create(fullData);
      }
      console.log(`✓ Char Dham Package saved in DB: [${result._id}] "${result.title}"`);
    }
  }

  console.log('\n============================================================');
  console.log('ALL 6 PACKAGES UPDATED WITH 4 HIGH QUALITY IMAGES!');
  console.log('============================================================\n');

  // Verify and print summary
  console.log('CURRENT STATUS OF ALL 6 PACKAGES:');
  const allIdsOrSlugs = [
    '6ab3d567402dcb770495e5fb',
    '6aba7cc2dc2983cb66db5879',
    'char-dham-yatra-from-haridwar-10-days',
    '6adbc11887f8dacf63abf3b8',
    '6ab3cf68402dcb770495e4bf',
    '6adbccfba2f9959f3554bc0b'
  ];

  for (const item of allIdsOrSlugs) {
    let p;
    if (item.length === 24 && !item.includes('-')) {
      p = await Package.findById(item);
    } else {
      p = await Package.findOne({ slug: item });
    }
    if (!p) continue;
    console.log(`\n------------------------------------------------------------`);
    console.log(`ID:       ${p._id}`);
    console.log(`Title:    ${p.title}`);
    console.log(`Slug:     ${p.slug}`);
    console.log(`Price:    ₹${p.discountedPrice}`);
    console.log(`Duration: ${p.duration}`);
    console.log(`Location: ${p.location}`);
    console.log(`Active:   ${p.isActive}`);
    console.log(`Image 1 (HERO): ${p.imageUrl1}`);
    console.log(`Image 2:        ${p.imageUrl2}`);
    console.log(`Image 3:        ${p.imageUrl3}`);
    console.log(`Image 4:        ${p.imageUrl4}`);
  }

  await mongoose.disconnect();
  console.log('\nFinished and disconnected.');
}

run().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
