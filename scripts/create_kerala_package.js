const mongoose = require('mongoose');

const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

const packageData = {
  // STEP 1: Basic Details
  title: "Kerala Tour Package from Delhi: Munnar, Thekkady, Alleppey & Kochi – 6 Days / 5 Nights",
  slug: "kerala-tour-package-from-delhi-munnar-thekkady-alleppey-kochi-6-days",
  redirectFromSlugs: [
    "kerala-tour-package",
    "kerala-tour-from-delhi",
    "munnar-thekkady-alleppey-kochi",
    "kerala-6-days-5-nights"
  ],
  location: "Munnar, Thekkady, Alleppey, Kochi",
  duration: "6 Days / 5 Nights",
  category: "domestic",
  packageType: "leisure",
  description: "This trip covers the best of Kerala in six days. You fly from Delhi to Kochi and drive up to Munnar, stopping at the Cheeyappara and Valara waterfalls on the way. After a day of tea estates, Eravikulam National Park and Mattupetty Dam, you go down to Thekkady for a boat safari on Periyar Lake and a Kathakali or Kalaripayattu show. The next day you board a private deluxe houseboat in Alleppey and cruise the backwaters, and you finish in Kochi at Fort Kochi, the Chinese Fishing Nets and Jewish Town before flying back to Delhi.",

  // STEP 2: Highlights Bar & Route Details
  route: "Delhi → Kochi → Munnar → Thekkady → Alleppey → Kochi → Delhi",
  departure: "Delhi (flight) / Kochi Airport (driver meets you on arrival)",
  tourStyle: "Nature, Backwaters & Culture Road Trip",
  routeBannerTitle: "Munnar, Thekkady, Alleppey & Kochi",
  routeBannerSubtitle: "Tea Hills • Wildlife • Houseboat Stay • Fort Kochi",

  enableRouteMap: true,
  enableAltitude: false,

  // STEP 4: Pricing
  originalPrice: 0,
  discountedPrice: 32500,
  isActive: true,
  isTrending: true,
  hasOffer: false,
  badges: ["bestseller"],

  trustFeatures: [
    "Private Deluxe Houseboat: Exclusive traditional Kettuvallam cruise with all meals on board",
    "Handpicked Resorts: Verified 3-star hill resorts in Munnar & Thekkady with breakfast",
    "Dedicated Private Vehicle: Dedicated AC vehicle with experienced driver throughout Kerala",
    "100% Transparent: All tolls, parking, fuel charges, and driver allowances included"
  ],
  conciergeTitle: "Kerala Travel Specialist",
  conciergeSubtitle: "Need flight tickets from Delhi, luxury pool villa upgrades, or custom family dates? Connect directly with our Kerala itinerary desk.",

  // STEP 3: Day-by-Day Itinerary
  itinerary: [
    {
      dayNumber: 1,
      title: "Fly to Kochi & Drive to Munnar",
      city: "Munnar",
      route: "Delhi → Kochi (flight) → Munnar (road)",
      altitude: "",
      stay: "Resort in Munnar",
      meals: "Dinner included",
      transport: "Dedicated AC vehicle (Dzire / Innova / Tempo Traveller)",
      description: "• Take an early morning flight from Delhi to Kochi.\n• On arrival, meet your driver and head straight into the hills towards Munnar.\n• On the way, stop at the Cheeyappara and Valara waterfalls.\n• Overnight stay in a Munnar resort."
    },
    {
      dayNumber: 2,
      title: "Tea Estates, Eravikulam National Park & Mattupetty Dam",
      city: "Munnar",
      route: "Munnar local sightseeing",
      altitude: "",
      stay: "Munnar",
      meals: "Breakfast and dinner",
      transport: "Dedicated AC vehicle",
      description: "• Spend the day among the green valleys and tea estates of Munnar.\n• Visit Eravikulam National Park, home to the endangered Nilgiri Tahr.\n• See the Mattupetty Dam.\n• Take a walk through a large tea estate museum.\n• Overnight stay in Munnar."
    },
    {
      dayNumber: 3,
      title: "Periyar Lake Boat Safari & Kathakali / Kalaripayattu Show",
      city: "Thekkady",
      route: "Munnar → Thekkady",
      altitude: "",
      stay: "Thekkady",
      meals: "Breakfast and dinner",
      transport: "Dedicated AC vehicle",
      description: "• Drive down to Thekkady (approx. 3 to 4 hours).\n• In the afternoon, enjoy a boat safari on Periyar Lake and look out for wild elephants and birds.\n• In the evening, watch a traditional Kathakali dance or Kalaripayattu martial arts show.\n• Overnight stay in Thekkady."
    },
    {
      dayNumber: 4,
      title: "Alleppey Backwaters & Houseboat Stay",
      city: "Alleppey",
      route: "Thekkady → Alleppey",
      altitude: "",
      stay: "Private deluxe houseboat in Alleppey",
      meals: "Lunch, evening tea/snacks & dinner on houseboat",
      transport: "Dedicated AC vehicle + Private Deluxe Houseboat",
      description: "• Drive to Alleppey (approx. 4 hours).\n• Board your private, deluxe Kerala houseboat by midday.\n• Cruise through the quiet canals, past coconut groves and local villages.\n• Overnight stay and meals on the houseboat."
    },
    {
      dayNumber: 5,
      title: "Fort Kochi, Chinese Fishing Nets & Jewish Town",
      city: "Kochi",
      route: "Alleppey → Kochi",
      altitude: "",
      stay: "Kochi",
      meals: "Breakfast",
      transport: "Dedicated AC vehicle",
      description: "• Get off the houseboat after breakfast and drive to Kochi.\n• Spend the afternoon exploring historic Fort Kochi and see the Chinese Fishing Nets.\n• Stroll through Jewish Town.\n• Overnight stay in Kochi."
    },
    {
      dayNumber: 6,
      title: "Departure from Kochi",
      city: "Kochi",
      route: "Kochi → Cochin International Airport → Delhi (flight)",
      altitude: "",
      stay: "Tour ends",
      meals: "Breakfast",
      transport: "Dedicated vehicle transfer to Airport + Return flight to Delhi",
      description: "• Pick up your souvenirs, pack up and head to Cochin International Airport.\n• Take the return flight to Delhi."
    }
  ],

  // STEP 5: Inclusions
  inclusions: [
    "Stay as per itinerary: resort in Munnar, a private deluxe houseboat in Alleppey, and hotels in Thekkady and Kochi",
    "Meals on the houseboat (lunch, evening tea/snacks, dinner & breakfast)",
    "Daily breakfast at hotels & resorts",
    "Vehicle with driver from Kochi airport arrival until departure (Dzire / Innova / Tempo Traveller)",
    "Sightseeing as per itinerary",
    "All toll taxes, parking charges, and fuel charges included",
    "Driver night allowances and day batta included",
    "All inner line and state road permits"
  ],

  // STEP 6: Exclusions
  exclusions: [
    "5% GST",
    "Train or airfare (Delhi to Kochi return flights can be arranged at actuals on request)",
    "Personal expenses like entry charges, telephone, internet, laundry, etc.",
    "Any extra meals",
    "Any extra excursions or sightseeing apart from the itinerary",
    "Any entry fees for museums, parks or anything else (e.g. Periyar boat safari, Kathakali show tickets)",
    "Room heater charges",
    "Insurance",
    "Anything not included in the inclusions",
    "Expenses caused by factors beyond our control like rail and flight delays, roadblocks, vehicle malfunctions, political disturbances, etc."
  ],

  // STEP 7: Terms & Conditions
  termsAndConditions: [
    "Booking amount is 10% of the total amount. The rest is paid as per the dates plan discussed.",
    "Other hotels/resorts can be arranged in any category at discounted prices, with extra charges for 5-star or luxury pool villa upgrades.",
    "Houseboat check-in is at 12:00 PM and check-out is at 09:00 AM. AC in bedrooms operates from 09:00 PM to 06:00 AM in standard deluxe houseboats.",
    "We are not responsible for delays or changes in the programme, or expenses incurred, due to natural hazards, flight cancellations, weather, sickness, landslides, political closures (strike, hartal, bandh) or any untoward incident.",
    "Cancellation Policy: Up to 30 days prior to departure: free cancellation, only the booking amount (10%) is forfeited.",
    "Cancellation Policy: Between 20 and 30 days prior to departure: 20% of the total amount is charged as cancellation charge.",
    "Cancellation Policy: 0 to 20 days prior to departure: 100% of the booking amount is charged as cancellation charge."
  ],

  // STEP 8: Package Tags
  tags: [
    "Kerala Tour Package",
    "Kerala Tour from Delhi",
    "Munnar Thekkady Alleppey",
    "6 Days Kerala",
    "Alleppey Houseboat",
    "Munnar Tea Estates",
    "Periyar Boat Safari",
    "Fort Kochi",
    "Family Tour",
    "Honeymoon Package"
  ],

  // STEP 9: SEO Settings
  seo: {
    title: "Kerala Tour Package from Delhi 6 Days / 5 Nights: Munnar, Thekkady, Alleppey | Shree Ananta Travels",
    description: "6 days / 5 nights Kerala tour from Delhi covering Munnar, Thekkady, Alleppey houseboat stay and Fort Kochi, with driver and sightseeing.",
    focusKeyword: "kerala tour package from delhi",
    relatedKeywords: [
      "kerala tour package from delhi",
      "munnar thekkady alleppey 6 days",
      "kerala houseboat tour package",
      "delhi to kerala tour package",
      "munnar tea garden tour",
      "kerala holiday package 5 nights 6 days"
    ]
  },

  // 4 High Quality Photos
  imageUrl1: "https://res.cloudinary.com/v42elzsz/image/upload/v1792789631/ananda-travel/packages/eemwfzxvevi4thkvho9v.webp", // Munnar Tea Hills
  imageUrl2: "https://res.cloudinary.com/v42elzsz/image/upload/v1792789637/ananda-travel/packages/yont3kszuj2jg5pd7zqn.webp", // Alleppey Houseboat
  imageUrl3: "https://res.cloudinary.com/v42elzsz/image/upload/v1792789701/ananda-travel/packages/ytipdcv08v4znruue4bz.webp", // Thekkady Periyar Lake
  imageUrl4: "https://res.cloudinary.com/v42elzsz/image/upload/v1792789646/ananda-travel/packages/gzcvngymfm9f8pv2kvcj.webp"  // Kochi Chinese Fishing Nets
};

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

  // Check if a package with this slug already exists to update it, or create new
  let existing = await Package.findOne({ slug: packageData.slug });
  if (!existing) {
    existing = await Package.findOne({ title: packageData.title });
  }

  let result;
  if (existing) {
    console.log('Found existing package, updating ID:', existing._id);
    packageData.updatedAt = new Date();
    result = await Package.findByIdAndUpdate(existing._id, { $set: packageData }, { new: true });
  } else {
    console.log('Creating new package...');
    packageData.createdAt = new Date();
    packageData.updatedAt = new Date();
    result = await Package.create(packageData);
  }

  console.log('----------------------------------------------------');
  console.log('KERALA PACKAGE SAVED SUCCESSFULLY:');
  console.log(`ID: ${result._id}`);
  console.log(`Title: ${result.title}`);
  console.log(`Slug: ${result.slug}`);
  console.log(`Duration: ${result.duration}`);
  console.log(`Location: ${result.location}`);
  console.log(`Price: ₹${result.discountedPrice}`);
  console.log(`Itinerary Count: ${result.itinerary.length} Days`);
  console.log(`Images:`);
  console.log(`  1: ${result.imageUrl1}`);
  console.log(`  2: ${result.imageUrl2}`);
  console.log(`  3: ${result.imageUrl3}`);
  console.log(`  4: ${result.imageUrl4}`);
  console.log('----------------------------------------------------');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('FAILED TO SAVE KERALA PACKAGE:', err);
  process.exit(1);
});
