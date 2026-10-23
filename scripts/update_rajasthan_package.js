const mongoose = require('mongoose');

const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";
const targetPackageId = '6ab3cf68402dcb770495e4bf';

const packageUpdate = {
  // STEP 1: Basic Details
  title: "Rajasthan Tour Package from Jaipur: Jaipur, Pushkar, Jodhpur, Jaisalmer & Udaipur – 9 Days / 8 Nights",
  slug: "rajasthan-tour-package-from-jaipur-9-days-8-nights",
  redirectFromSlugs: [
    "rajasthan-the-royal-journey",
    "rajasthan-royal-journey",
    "rajasthan-tour-8-nights-9-days",
    "rajasthan-tour"
  ],
  location: "Jaipur, Pushkar, Jodhpur, Jaisalmer, Udaipur",
  duration: "9 Days / 8 Nights",
  category: "domestic",
  packageType: "Cultural / Heritage Tour",
  description: "This is a private road trip through five of Rajasthan’s best-known places. You begin in Jaipur with the Hawa Mahal, City Palace and Amber Fort, then go to Pushkar for the Brahma Temple and the evening aarti at the lake. Next is Jodhpur and its Mehrangarh Fort, followed by two nights in Jaisalmer, including a camel ride in the Sam Sand Dunes and a night at a desert camp. The trip ends in Udaipur with a sunset boat ride on Lake Pichola and a visit to the City Palace. It is an exclusive tour by car, not a group tour, and you can customise pick-up locations, hotels and sightseeing.",

  // STEP 2: Highlights Bar & Route Details
  route: "Jaipur (2N) → Pushkar (1N) → Jodhpur (1N) → Jaisalmer (2N) → Udaipur (2N)",
  departure: "Jaipur",
  tourStyle: "Private Heritage & Cultural Road Trip",
  routeBannerTitle: "Rajasthan: The Royal Journey",
  routeBannerSubtitle: "Jaipur • Pushkar • Jodhpur • Jaisalmer • Udaipur",
  enableRouteMap: true,
  enableAltitude: false,

  // Images: First image kept original as instructed; 3 new high-quality authentic WebP images of the exact places uploaded
  imageUrl1: "https://res.cloudinary.com/v42elzsz/image/upload/v1792703760/ananda-travel/packages/uxqjsgk3bn9xex1xzszf.webp",
  imageUrl2: "https://res.cloudinary.com/v42elzsz/image/upload/v1792788835/ananda-travel/packages/cyp0ugpee4gwbtueznjf.webp",
  imageUrl3: "https://res.cloudinary.com/v42elzsz/image/upload/v1792788839/ananda-travel/packages/jicjatudfrkgphwnfnds.webp",
  imageUrl4: "https://res.cloudinary.com/v42elzsz/image/upload/v1792788844/ananda-travel/packages/vmpocbzvn8h9cymlxk87.webp",

  // STEP 3: Day-by-Day Itinerary
  itinerary: [
    {
      dayNumber: 1,
      city: "Jaipur",
      title: "Hawa Mahal, City Palace & Jantar Mantar",
      route: "Jaipur local sightseeing",
      altitude: "",
      stay: "Jaipur",
      meals: "CP Plan (Breakfast included)",
      transport: "Dedicated private vehicle (Dzire / Innova / Tempo Traveller)",
      description: "• Start with the Hawa Mahal (Palace of Winds), built so that the royal women could watch street life without being seen.\n• Visit the City Palace, which still houses the royal family, and see the Mubarak Mahal and the Armoury.\n• Finish the afternoon at Jantar Mantar, a collection of huge astronomical instruments.\n• In the evening, walk through Johari Bazaar and Bapu Bazaar. Look for artisans making Meenakari (enamel work) jewellery and Bandhani (tie-dye) textiles.\n• Food tip: try the Pyaaz Kachori at Rawat Misthan Bhandar.\n• Places Covered: Hawa Mahal, City Palace, Jantar Mantar, Johari Bazaar, Bapu Bazaar.\n• Overnight stay in Jaipur."
    },
    {
      dayNumber: 2,
      city: "Jaipur",
      title: "Amber Fort, Jal Mahal & Nahargarh Fort",
      route: "Jaipur local sightseeing",
      altitude: "",
      stay: "Jaipur",
      meals: "CP Plan (Breakfast included)",
      transport: "Dedicated private vehicle",
      description: "• Head out early to Amber Fort and explore its grand courtyards and the Sheesh Mahal (Mirror Palace), where a single candle lights up the whole room.\n• On the way back, stop at Panna Meena ka Kund, an old geometric stepwell, and take a photo of Jal Mahal floating in the lake.\n• Visit the Anokhi Museum of Hand Printing near Amber Fort to see traditional block printing.\n• End the day watching the sunset from the ramparts of Nahargarh Fort.\n• Food tip: have a Rajasthani thali with Dal Baati Churma at Chokhi Dhani or a local heritage restaurant.\n• Places Covered: Amber Fort, Sheesh Mahal, Panna Meena ka Kund, Jal Mahal, Anokhi Museum of Hand Printing, Nahargarh Fort.\n• Overnight stay in Jaipur."
    },
    {
      dayNumber: 3,
      city: "Pushkar",
      title: "Brahma Temple & Pushkar Lake Ghats",
      route: "Jaipur → Pushkar",
      altitude: "",
      stay: "Pushkar",
      meals: "CP Plan (Breakfast included)",
      transport: "Dedicated private vehicle",
      description: "• Drive to Pushkar. If time permits, stop briefly at the Ajmer Sharif Dargah (Sufi shrine) on the way.\n• In Pushkar, visit the Brahma Temple, one of the few temples in the world dedicated to the creator god.\n• Before sunset, walk down to the Pushkar Lake Ghats and watch the evening Maha Aarti. Please remove your shoes near the lake.\n• Food tip: try the Pushkar Malpua and hot Rabdi near Gau Ghat.\n• Places Covered: Ajmer Sharif Dargah (if time permits), Brahma Temple, Pushkar Lake Ghats.\n• Overnight stay in Pushkar."
    },
    {
      dayNumber: 4,
      city: "Jodhpur",
      title: "Mehrangarh Fort, Jaswant Thada & the Blue City",
      route: "Pushkar → Jodhpur",
      altitude: "",
      stay: "Jodhpur",
      meals: "CP Plan (Breakfast included)",
      transport: "Dedicated private vehicle",
      description: "• Drive to Jodhpur and go straight up to Mehrangarh Fort, which stands on a cliff above the city. The fort museum has a great collection of royal palanquins and cradles.\n• On the way down, visit Jaswant Thada, a peaceful white marble cenotaph built in memory of the Maharaja.\n• Walk through the old city lanes around the Clock Tower (Ghanta Ghar), where the houses are painted in shades of indigo blue.\n• Food tip: try the saffron Makhaniya Lassi at Shri Mishrilal Hotel.\n• Places Covered: Mehrangarh Fort, Jaswant Thada, Clock Tower (Ghanta Ghar), Old City lanes.\n• Overnight stay in Jodhpur."
    },
    {
      dayNumber: 5,
      city: "Jaisalmer",
      title: "Gadisar Lake & Patwon ki Haveli",
      route: "Jodhpur → Jaisalmer",
      altitude: "",
      stay: "Jaisalmer",
      meals: "CP Plan (Breakfast included)",
      transport: "Dedicated private vehicle",
      description: "• Travel across the desert landscape to Jaisalmer.\n• In the late afternoon, visit Gadisar Lake, a rainwater lake surrounded by shrines and carved gateways (Tillon ki Prol).\n• Walk through Patwon ki Haveli, a group of five grand mansions built by wealthy traders, famous for their yellow sandstone lattice screens (jalis).\n• Food tip: try Ker Sangri, a desert dish made from wild berries and beans.\n• Places Covered: Gadisar Lake, Patwon ki Haveli.\n• Overnight stay in Jaisalmer."
    },
    {
      dayNumber: 6,
      city: "Jaisalmer",
      title: "Jaisalmer Fort, Kuldhara & Desert Camp Night",
      route: "Jaisalmer local sightseeing → Sam Sand Dunes",
      altitude: "",
      stay: "Desert camp, Sam Sand Dunes (Jaisalmer)",
      meals: "CP Plan (Breakfast included)",
      transport: "Dedicated private vehicle & Desert Camel Ride",
      description: "• Spend the morning inside Jaisalmer Fort (Sonar Qila). It is a “living fort”, where a quarter of the city’s population still lives. Explore the Jain temples inside.\n• On the way to the desert, stop at the abandoned ruins of Kuldhara Village.\n• At the Sam Sand Dunes, switch from your car to a camel ride into the dunes for sunset.\n• Spend the night at a desert camp, with a bonfire, Kalbelia dance and folk music by the Manganiyar community.\n• Places Covered: Jaisalmer Fort (Sonar Qila), Jain Temples, Kuldhara Village, Sam Sand Dunes.\n• Stay: Desert camp, Sam Sand Dunes (Jaisalmer)."
    },
    {
      dayNumber: 7,
      city: "Udaipur",
      title: "Ranakpur Jain Temple & Lake Pichola Boat Ride",
      route: "Jaisalmer → Udaipur (long drive)",
      altitude: "",
      stay: "Udaipur",
      meals: "CP Plan (Breakfast included)",
      transport: "Dedicated private vehicle & Sunset Boat Ride",
      description: "• It is a long drive south to Udaipur. Break the journey at Ranakpur, home to a large 15th-century Jain Temple held up by 1,444 uniquely carved marble pillars.\n• In Udaipur, head to Lake Pichola for a sunset boat ride. The white marble palaces, like the Lake Palace, glow on the water at twilight.\n• Food tip: try fresh lake fish (Laal Maas or Mewari style) at a rooftop restaurant by the water.\n• Places Covered: Ranakpur Jain Temple, Lake Pichola.\n• Overnight stay in Udaipur."
    },
    {
      dayNumber: 8,
      city: "Udaipur",
      title: "Mewari Royalty, City Palace & Saheliyon-ki-Bari",
      route: "Udaipur local sightseeing",
      altitude: "",
      stay: "Udaipur",
      meals: "CP Plan (Breakfast included)",
      transport: "Dedicated private vehicle",
      description: "• Explore the Udaipur City Palace, a large complex of courtyards, pavilions and mirrors overlooking the lake.\n• Walk to the nearby Jagdish Temple to see its detailed carvings.\n• Finish with a stroll through Saheliyon-ki-Bari (Courtyard of the Maidens), known for its fountains, lotus pools and marble elephants.\n• You can also visit Nathdwara Ji for darshan, to and fro, in the evening or early morning. The vehicle cost for this is extra.\n• If time permits, browse the local markets for Pichwai paintings and silver handicrafts.\n• Places Covered: Udaipur City Palace, Jagdish Temple, Saheliyon-ki-Bari, Nathdwara Ji (optional).\n• Overnight stay in Udaipur."
    },
    {
      dayNumber: 9,
      city: "Udaipur",
      title: "Departure Day",
      route: "Udaipur → onward journey",
      altitude: "",
      stay: "Tour ends",
      meals: "CP Plan (Breakfast included)",
      transport: "Dedicated private vehicle transfer",
      description: "• Enjoy a relaxed morning in Udaipur and take a short stroll nearby.\n• Check out from the hotel and leave for your onward journey.\n• Places Covered: Udaipur.\n• Stay: Tour ends."
    }
  ],

  // STEP 4: Pricing (Price is on request in the PDF)
  originalPrice: 0,
  discountedPrice: 0,
  conciergeTitle: "Rajasthan Travel Specialist",
  conciergeSubtitle: "Per person, price on request as per hotel and local transport demand. 5% GST extra.",

  // STEP 5: Inclusions
  inclusions: [
    "Accommodation as per itinerary, inclusive of all taxes",
    "Breakfast only (CP Plan)",
    "A vehicle as per itinerary (Dzire / Innova / Tempo Traveller), a private car or bigger vehicle depending on the number of travellers",
    "All inner line permits, toll taxes, parking and fuel charges",
    "Driver allowances",
    "Sightseeing as per itinerary",
    "Boating and other activities where specified"
  ],

  // STEP 6: Exclusions
  exclusions: [
    "5% GST",
    "Train or airfare",
    "Personal expenses like entry charges, telephone, fax, internet, laundry, etc.",
    "Any extra meals",
    "Any extra excursions or sightseeing apart from the tour itinerary",
    "Boating and other activities not specified in the itinerary",
    "Any entry fees for museums, parks, jeep safari or anything else",
    "Room heater charges",
    "Insurance",
    "Anything not included in the inclusions",
    "Extra vehicle cost for the optional Nathdwara Ji visit"
  ],

  // STEP 7: Terms & Conditions
  termsAndConditions: [
    "This is an exclusive private tour by car or a bigger vehicle as per the number of family members travelling. It is not a group tour.",
    "Customisation of pick-up locations, hotels and sightseeing is available.",
    "The booking amount is 10% of the total amount. The rest is paid as per the dates plan discussed.",
    "Expenses caused by factors beyond our control, such as rail and flight delays, roadblocks, vehicle malfunctions and political disturbances, are not covered.",
    "We are not responsible for any delays or changes in the programme, or expenses incurred directly or indirectly, due to natural hazards, flight cancellations, weather, sickness, landslides, political closures (strike, hartal, bandh) or any untoward incident.",
    "Cancellation Policy: Up to 30 days: free cancellation, only the booking amount (10%) is forfeited.",
    "Cancellation Policy: Between 20 and 30 days: 20% of the amount is charged as cancellation charge.",
    "Cancellation Policy: 0 to 20 days: 100% of the booking amount is charged as cancellation charge."
  ],

  // STEP 8: Package Tags
  tags: [
    "Rajasthan Tour Package",
    "Rajasthan Tour from Jaipur",
    "Rajasthan Private Tour",
    "9 Days Rajasthan",
    "Jaipur Pushkar Jodhpur Jaisalmer Udaipur",
    "Royal Rajasthan",
    "Jaisalmer Desert Camp",
    "Mehrangarh Fort",
    "Lake Pichola",
    "Family Tour"
  ],

  // STEP 9: SEO Settings
  seo: {
    title: "Rajasthan Tour Package from Jaipur 9 Days / 8 Nights | Shree Ananta Travels",
    description: "9 days / 8 nights private Rajasthan tour from Jaipur covering Pushkar, Jodhpur, Jaisalmer and Udaipur, with car, driver and breakfast.",
    focusKeyword: "rajasthan tour package from jaipur",
    relatedKeywords: [
      "9 days rajasthan tour",
      "jaipur jodhpur jaisalmer udaipur tour",
      "rajasthan private tour"
    ]
  },

  trustFeatures: [
    "100% Private Tour: Dedicated vehicle exclusively for your family or group",
    "CP Meal Plan: Daily breakfast included at all verified hotels and desert camp",
    "Zero Surprise Fees: All tolls, parking, fuel, and driver allowances fully covered",
    "Flexible Customization: Hotels, pick-up points, and sightseeing can be tailored on request"
  ],

  isActive: true,
  isTrending: true,
  hasOffer: false,
  badges: ["bestseller"],
  updatedAt: new Date()
};

async function updatePackage() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

  console.log(`Updating package ${targetPackageId}...`);
  const updated = await Package.findByIdAndUpdate(
    targetPackageId,
    { $set: packageUpdate },
    { new: true }
  );

  if (!updated) {
    console.error('Target package not found!');
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('RAJASTHAN PACKAGE SUCCESSFULLY UPDATED IN MONGODB:');
  console.log(`ID: ${updated._id}`);
  console.log(`Title: ${updated.title}`);
  console.log(`Slug: ${updated.slug}`);
  console.log(`Duration: ${updated.duration}`);
  console.log(`Category: ${updated.category}`);
  console.log(`Package Type: ${updated.packageType}`);
  console.log(`Location: ${updated.location}`);
  console.log(`Route: ${updated.route}`);
  console.log(`Images:`);
  console.log(`  1: ${updated.imageUrl1}`);
  console.log(`  2: ${updated.imageUrl2}`);
  console.log(`  3: ${updated.imageUrl3}`);
  console.log(`  4: ${updated.imageUrl4}`);
  console.log(`Itinerary: ${updated.itinerary.length} Days`);
  console.log(`Inclusions: ${updated.inclusions.length}`);
  console.log(`Exclusions: ${updated.exclusions.length}`);
  console.log(`Terms: ${updated.termsAndConditions.length}`);
  console.log(`Tags: ${updated.tags.join(', ')}`);
  console.log(`SEO Title: ${updated.seo.title}`);
  console.log(`SEO Description: ${updated.seo.description}`);
  console.log('======================================================\n');

  await mongoose.disconnect();
}

updatePackage().catch(err => {
  console.error('Update failed:', err);
  process.exit(1);
});

