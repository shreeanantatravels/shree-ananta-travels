const mongoose = require('mongoose');

const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

const targetPackageId = '6ab3d567402dcb770495e5fb';

const updateData = {
  // STEP 1: Basic Details
  title: "Madurai Rameshwaram Kanyakumari Trivandrum Tour Package – 6 Days / 5 Nights",
  slug: "madurai-rameshwaram-kanyakumari-trivandrum-tour-package-6-days",
  redirectFromSlugs: [
    "madurai-rameshwaram-kanyakumari-tour-package-6-days",
    "south-yatra",
    "madurai-rameshwaram-kanyakumari"
  ],
  location: "Madurai, Rameshwaram, Kanyakumari, Thiruvananthapuram (Trivandrum)",
  duration: "6 Days / 5 Nights",
  category: "domestic",
  packageType: "pilgrimage",
  description: "A sacred journey through the temples and coastal heritage of South India. The tour begins in Madurai with darshan at the Meenakshi Amman Temple, then goes to Rameshwaram for the Ramanathaswamy Temple (one of the twelve Jyotirlingas), the Pamban Bridge and Dhanushkodi. In Kanyakumari you see the Triveni Sangam, the sunset and sunrise points and the Vivekananda Rock Memorial. The trip ends in Thiruvananthapuram with morning darshan at the Sree Padmanabhaswamy Temple. Pickup is from Madurai Airport or Railway Station, and the stay is in 3-star hotels with a vehicle and sightseeing as per the itinerary.",

  // STEP 2: Highlights Bar & Route Details
  route: "Madurai → Rameshwaram → Kanyakumari → Thiruvananthapuram",
  departure: "Madurai Airport / Railway Station",
  tourStyle: "Spiritual & Cultural Road Trip",
  routeBannerTitle: "A Sacred Journey Through the Temples & Coastal Heritage of South India",
  routeBannerSubtitle: "Meenakshi Temple • Rameshwaram • Kanyakumari • Sree Padmanabhaswamy Temple",

  enableRouteMap: true,
  enableAltitude: false,

  // STEP 4: Pricing
  originalPrice: 0,
  discountedPrice: 41000,
  isActive: true,
  isTrending: true,
  hasOffer: false,
  badges: ["bestseller"],

  // Trust Features & Concierge
  trustFeatures: [
    "3-Star Hotel Stay: Inclusive of all taxes with daily breakfast and dinner included",
    "Dedicated Private Vehicle: Dzire / Innova / Tempo Traveller throughout the road trip",
    "Sacred Jyotirlinga & Divya Desam: Meenakshi Amman, Ramanathaswamy & Sree Padmanabhaswamy",
    "100% Transparent: All tolls, parking, fuel charges, and driver allowances included"
  ],
  conciergeTitle: "South Yatra Pilgrimage Specialist",
  conciergeSubtitle: "Looking for 5-star hotel upgrades, special puja assistance, or custom family dates? Speak directly with our South India tour desk.",

  // STEP 3: Day-by-Day Itinerary
  itinerary: [
    {
      dayNumber: 1,
      title: "Arrival in Madurai, Meenakshi Amman Temple & Koodal Azhagar Temple",
      city: "Madurai",
      route: "Madurai Airport / Railway Station → Hotel → Madurai temples",
      altitude: "",
      stay: "Madurai (3-star hotel)",
      meals: "Dinner included",
      transport: "Dedicated vehicle (Dzire / Innova / Tempo Traveller)",
      description: "• Arrive at Madurai Airport or Railway Station, transfer to your hotel and complete check-in.\n• Begin your sightseeing at the Meenakshi Amman Temple, with the blessings of Lord Shiva and Mata Parvati in the form of Lord Sundaram and Goddess Meenakshi Devi.\n• Later, visit the Koodal Azhagar Temple, one of the city’s most revered Vaishnavite shrines.\n• Spend the evening enjoying the spiritual charm and culture of Madurai as you wish (not included in sightseeing).\n• Return to the hotel for an overnight stay in Madurai."
    },
    {
      dayNumber: 2,
      title: "Pamban Bridge, Agnitheertham & Ramanathaswamy Temple",
      city: "Rameshwaram",
      route: "Madurai → Rameshwaram",
      altitude: "",
      stay: "Rameshwaram (3-star hotel)",
      meals: "Breakfast and dinner",
      transport: "Dedicated vehicle",
      description: "• Depart from Madurai for Rameshwaram. On the way, see the Pamban Bridge, an engineering marvel that connects Rameshwaram Island to mainland India with stunning sea views.\n• On arrival, visit Agnitheertham in the evening, a sacred seafront pilgrimage site where devotees perform religious rituals.\n• Continue to the Ramanathaswamy Temple, one of the twelve Jyotirlingas, and take the blessings of Lord Rama.\n• The temple has 22 sacred wells (kunds or theerthams), which represent the 22 arrows in Lord Rama’s quiver. It is believed that after the battle, Lord Rama shot his arrows into the ground to create these water sources for sacred ablutions.\n• Return to the hotel for an overnight stay in Rameshwaram."
    },
    {
      dayNumber: 3,
      title: "Panchamukhi Hanuman Temple, Dhanushkodi & Ram Setu View Point",
      city: "Rameshwaram",
      route: "Rameshwaram local sightseeing",
      altitude: "",
      stay: "Rameshwaram (3-star hotel)",
      meals: "Breakfast and dinner",
      transport: "Dedicated vehicle",
      description: "• Begin with a morning darshan at the Ramanathaswamy Temple, then visit the Panchamukhi Hanuman Temple, known for its unique five-faced idol of Lord Hanuman.\n• Explore Dhanushkodi Beach, where history, mythology and natural beauty come together.\n• On the way to Dhanushkodi, you can stop at the Kothandaramaswamy Temple. It is believed to be where Vibhishana, the younger brother of Ravana, asked Rama and his vanara army for refuge.\n• End the sightseeing at the Ram Setu View Point, with views associated with the legendary bridge from the Ramayana. Floating stones are also part of this day.\n• Relax at the hotel for an overnight stay in Rameshwaram."
    },
    {
      dayNumber: 4,
      title: "The Southernmost Tip of India",
      city: "Kanyakumari",
      route: "Rameshwaram → Kanyakumari",
      altitude: "",
      stay: "Kanyakumari (3-star hotel)",
      meals: "Breakfast and dinner",
      transport: "Dedicated vehicle",
      description: "• Drive from Rameshwaram to Kanyakumari. On arrival, check in at the hotel and unwind.\n• In the evening, visit Kanyakumari Beach and enjoy India’s southernmost coastline.\n• Explore the Triveni Sangam, the sacred confluence of the Arabian Sea, Bay of Bengal and Indian Ocean.\n• Conclude the day at Sunset Point.\n• Return to the hotel for an overnight stay in Kanyakumari."
    },
    {
      dayNumber: 5,
      title: "Vivekananda Rock Memorial, Bhagavathy Amman Temple & Padmanabhapuram Palace",
      city: "Thiruvananthapuram",
      route: "Kanyakumari sightseeing → Thiruvananthapuram",
      altitude: "",
      stay: "Thiruvananthapuram (3-star hotel)",
      meals: "Breakfast and dinner",
      transport: "Dedicated vehicle",
      description: "• Visit the Vivekananda Rock Memorial, built on the rock where Swami Vivekananda is believed to have meditated.\n• Continue to the Bhagavathy Amman Temple, an important pilgrimage site associated with Goddess Kanya Kumari.\n• You can also visit the Gandhi Memorial Mandapam, a monument dedicated to Mahatma Gandhi, and the Padmanabhapuram Palace.\n• Drive to Thiruvananthapuram (approx. 2.5 hours) and stay overnight there."
    },
    {
      dayNumber: 6,
      title: "Sree Padmanabhaswamy Temple Darshan & Departure",
      city: "Thiruvananthapuram",
      route: "Hotel → Sree Padmanabhaswamy Temple → Trivandrum Airport / Railway Station",
      altitude: "",
      stay: "Tour ends",
      meals: "Breakfast",
      transport: "Dedicated vehicle transfer to Airport / Railway Station",
      description: "• Head to the Sree Padmanabhaswamy Temple at 06:30 AM and see Lord Vishnu in his reclining Anantha Shayanam posture.\n• Dress code: Men must wear a mundu/dhoti (without shirts). Women must wear a saree or half-saree.\n• In the afternoon, buy local Kerala souvenirs such as Kasavu traditional clothing, banana chips or spices, or take a quick trip to Kovalam Beach if time permits. Check out from the hotel.\n• Head to Trivandrum International Airport (TRV) or the central railway station for your departure."
    }
  ],

  // STEP 5: Inclusions
  inclusions: [
    "Accommodation (3-star), inclusive of all taxes",
    "Breakfast and dinner",
    "A vehicle as per itinerary (Dzire / Innova / Tempo Traveller)",
    "All inner line permits",
    "Toll taxes",
    "Parking",
    "Fuel charges",
    "Driver allowances",
    "Sightseeing as per itinerary"
  ],

  // STEP 6: Exclusions
  exclusions: [
    "5% GST",
    "Train or airfare",
    "Personal expenses like entry charges, telephone, fax, internet, laundry, etc.",
    "Any extra meals",
    "Any extra excursions or sightseeing apart from the tour itinerary",
    "Boating and other activities",
    "Any entry fees for museum, park, jeep safari or anything else",
    "Room heater charges",
    "Insurance",
    "Anything not included in the inclusions",
    "Expenses caused by factors beyond our control like rail and flight delays, roadblocks, vehicle malfunctions, political disturbances, etc."
  ],

  // STEP 7: Terms & Conditions
  termsAndConditions: [
    "Booking amount is 10% of the total amount. The rest is paid as per the dates plan discussed.",
    "Other hotels can be arranged in any category at discounted prices, but extra charges apply if you want 5-star hotels.",
    "Temple dress code applies at the Sree Padmanabhaswamy Temple: men in mundu/dhoti (without shirts), women in saree or half-saree.",
    "We are not responsible for any delays or changes in the programme, or expenses incurred directly or indirectly, due to natural hazards, flight cancellations, weather, sickness, landslides, political closures (strike, hartal, bandh) or any untoward incident.",
    "Cancellation Policy: Up to 30 days: free cancellation, only the booking amount (10%) is forfeited.",
    "Cancellation Policy: Between 20 and 30 days: 20% of the amount is charged as cancellation charge.",
    "Cancellation Policy: 0 to 20 days: 100% of the booking amount is charged as cancellation charge."
  ],

  // STEP 8: Package Tags
  tags: [
    "Madurai Rameshwaram Kanyakumari Trivandrum Tour",
    "South India Temple Tour",
    "Meenakshi Amman Temple",
    "Ramanathaswamy Temple",
    "Dhanushkodi",
    "Kanyakumari",
    "Sree Padmanabhaswamy Temple",
    "Pilgrimage Tour",
    "South Yatra",
    "6 Days 5 Nights",
    "Spiritual Tour"
  ],

  // STEP 9: SEO Settings
  seo: {
    title: "Madurai Rameshwaram Kanyakumari Trivandrum Tour Package 6 Days | Shree Ananta Travels",
    description: "6 days / 5 nights Madurai, Rameshwaram, Kanyakumari & Trivandrum temple tour from ₹41,000 per person. 3-star hotels, vehicle and sightseeing included.",
    focusKeyword: "madurai rameshwaram kanyakumari trivandrum tour package",
    relatedKeywords: [
      "madurai rameshwaram kanyakumari trivandrum tour package",
      "south india temple tour",
      "padmanabhaswamy temple tour",
      "rameshwaram kanyakumari package",
      "meenakshi amman temple",
      "south yatra 6 days"
    ]
  },

  // PHOTOS: 1st preserved, remaining 3 high-quality uploaded to Cloudinary
  imageUrl1: "https://res.cloudinary.com/v42elzsz/image/upload/v1790170467/ananda-travel/packages/pkhnvoftg7ofwuinokts.png", // Pamban Bridge (Preserved original)
  imageUrl2: "https://res.cloudinary.com/v42elzsz/image/upload/v1792788789/ananda-travel/packages/pceakx2pnfotd3ypwhcs.webp", // Madurai Meenakshi Amman Temple (High quality)
  imageUrl3: "https://res.cloudinary.com/v42elzsz/image/upload/v1792788834/ananda-travel/packages/mw1hxp5koaqqnzqasic9.webp", // Kanyakumari Vivekananda Rock Memorial (High quality)
  imageUrl4: "https://res.cloudinary.com/v42elzsz/image/upload/v1792788846/ananda-travel/packages/mfznsv9ntb6ivbkisgcn.webp"  // Thiruvananthapuram Sree Padmanabhaswamy Temple (High quality)
};

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
  
  const existing = await Package.findById(targetPackageId);
  if (!existing) {
    console.error('Target package not found with id:', targetPackageId);
    process.exit(1);
  }

  updateData.updatedAt = new Date();

  const res = await Package.findByIdAndUpdate(targetPackageId, { $set: updateData }, { new: true });
  console.log('----------------------------------------------------');
  console.log('SOUTH YATRA PACKAGE UPDATED SUCCESSFULLY:');
  console.log(`ID: ${res._id}`);
  console.log(`Title: ${res.title}`);
  console.log(`Slug: ${res.slug}`);
  console.log(`Location: ${res.location}`);
  console.log(`Duration: ${res.duration}`);
  console.log(`Route: ${res.route}`);
  console.log(`Price: ₹${res.discountedPrice}`);
  console.log(`Itinerary Count: ${res.itinerary.length} Days`);
  console.log(`Images:`);
  console.log(`  1: ${res.imageUrl1}`);
  console.log(`  2: ${res.imageUrl2}`);
  console.log(`  3: ${res.imageUrl3}`);
  console.log(`  4: ${res.imageUrl4}`);
  console.log('----------------------------------------------------');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('UPDATE_FAILED:', err);
  process.exit(1);
});
