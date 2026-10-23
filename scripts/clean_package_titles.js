const mongoose = require('mongoose');

const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

// Clean, professional titles following TravelGrow style (no city clutter, clean casing, duration attached)
const titleUpdates = [
  {
    id: "6ab3cf68402dcb770495e4bf",
    oldTitle: "Rajasthan Tour Package from Jaipur: Jaipur, Pushkar, Jodhpur, Jaisalmer & Udaipur – 9 Days / 8 Nights",
    newTitle: "Rajasthan: The Royal Journey – 9 Days / 8 Nights",
    newSlug: "rajasthan-the-royal-journey"
  },
  {
    id: "6ab3d567402dcb770495e5fb",
    oldTitle: "Madurai Rameshwaram Kanyakumari Trivandrum Tour Package – 6 Days / 5 Nights",
    newTitle: "South Yatra: Sacred Temple Tour – 6 Days / 5 Nights",
    newSlug: "south-yatra-sacred-temple-tour-6-days"
  },
  {
    id: "6adbccfba2f9959f3554bc0b",
    oldTitle: "Kerala Tour Package from Delhi: Munnar, Thekkady, Alleppey & Kochi – 6 Days / 5 Nights",
    newTitle: "Kerala Tour Package from Delhi – 6 Days / 5 Nights",
    newSlug: "kerala-tour-package-from-delhi-6-days"
  },
  {
    id: "6adbc11887f8dacf63abf3b8",
    oldTitle: "Do Dham Yatra from Haridwar: Kedarnath & Badrinath – 6 Days / 5 Nights",
    newTitle: "Do Dham Yatra from Haridwar – 6 Days / 5 Nights",
    newSlug: "do-dham-yatra-from-haridwar-6-days"
  },
  {
    id: "6aad4213fe63fe6d87ef8ca5",
    oldTitle: "PUSHKAR & KHATU SHYAM JI YATRA",
    newTitle: "Pushkar & Khatu Shyam Ji Yatra – 3 Days / 2 Nights",
    newSlug: "pushkar-khatu-shyam-ji-yatra-3-days"
  },
  {
    id: "6aad4714fe63fe6d87ef8cc8",
    oldTitle: "Do Dham Yatra by Helicopter",
    newTitle: "Do Dham Yatra by Helicopter – 4 Days / 3 Nights",
    newSlug: "do-dham-yatra-by-helicopter-4-days"
  },
  {
    id: "6aac0011fe63fe6d87ef87e6",
    oldTitle: "Kailash Mansarovar Yatra Via Lhasa – Air Route",
    newTitle: "Kailash Mansarovar Yatra via Lhasa – 15 Days / 14 Nights",
    newSlug: "kailash-mansarovar-yatra-via-lhasa"
  },
  {
    id: "6aac02a5fe63fe6d87ef882f",
    oldTitle: "KAILASH MANSAROVAR VIA LUCKNOW",
    newTitle: "Kailash Mansarovar Yatra via Lucknow – 11 Days / 10 Nights",
    newSlug: "kailash-mansarovar-yatra-via-lucknow-11-days"
  },
  {
    id: "6ad8b6ca918d66fc81dc0dad",
    oldTitle: "KAILASH MANSAROVAR VIA LUCKNOW",
    newTitle: "Kailash Mansarovar Yatra via Lucknow Route – 11 Days / 10 Nights",
    newSlug: "kailash-mansarovar-yatra-via-lucknow-route"
  },
  {
    id: "6aba77f9dc2983cb66db583e",
    oldTitle: "Exclusive Himalayan Expedition",
    newTitle: "Exclusive Himalayan Expedition – 4 Days / 3 Nights",
    newSlug: "exclusive-himalayan-expedition-4-days"
  },
  {
    id: "6aba7cc2dc2983cb66db5879",
    oldTitle: "South India Darshan",
    newTitle: "South India Darshan – 6 Days / 5 Nights",
    newSlug: "south-india-darshan-6-days"
  },
  {
    id: "6aa940f06f2ad26b2c82d172",
    oldTitle: "Kailash",
    newTitle: "Kailash Mansarovar Yatra – 7 Days / 6 Nights",
    newSlug: "kailash-mansarovar-yatra-7-days"
  },
  {
    id: "6aa943136f2ad26b2c82d1a7",
    oldTitle: "Kailash Mansarovar",
    newTitle: "Kailash Mansarovar Overland Tour – 7 Days / 6 Nights",
    newSlug: "kailash-mansarovar-overland-tour-7-days"
  }
];

async function updateTitles() {
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

  console.log('UPDATING PACKAGE TITLES TO CLEAN TRAVELGROW STYLE...\n');

  for (const item of titleUpdates) {
    const pkg = await Package.findById(item.id);
    if (!pkg) {
      console.warn(`Package not found: ${item.id}`);
      continue;
    }

    // Preserve all previous slugs in redirectFromSlugs so no link breaks
    const existingRedirects = Array.isArray(pkg.redirectFromSlugs) ? pkg.redirectFromSlugs : [];
    const updatedRedirects = Array.from(new Set([
      ...existingRedirects,
      pkg.slug,
      item.newSlug
    ])).filter(s => s && s !== item.newSlug);

    const updateFields = {
      title: item.newTitle,
      slug: item.newSlug,
      redirectFromSlugs: updatedRedirects,
      updatedAt: new Date()
    };

    // If SEO title was set, update it cleanly without dumping places
    if (pkg.seo) {
      updateFields['seo.title'] = `${item.newTitle} | Shree Ananta Travels`;
    }

    await Package.findByIdAndUpdate(item.id, { $set: updateFields });
    console.log(`✓ [${item.id}]`);
    console.log(`   OLD: ${pkg.title}`);
    console.log(`   NEW: ${item.newTitle}`);
    console.log(`   SLUG: ${item.newSlug}`);
    console.log(`   REDIRECTS: ${updatedRedirects.join(', ')}`);
    console.log('---------------------------------------------------------');
  }

  await mongoose.disconnect();
  console.log('\nALL PACKAGE TITLES SUCCESSFULLY UPDATED!');
}

updateTitles().catch(err => {
  console.error('FAILED TO UPDATE TITLES:', err);
  process.exit(1);
});
