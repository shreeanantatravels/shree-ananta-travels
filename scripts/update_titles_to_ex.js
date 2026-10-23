const mongoose = require('mongoose');

const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

const updates = [
  {
    id: "6adbd2884f650ff85a2f4101",
    newTitle: "Char Dham Yatra Ex-Haridwar – 9 Nights / 10 Days",
    newSlug: "char-dham-yatra-ex-haridwar-10-days",
    newRouteBanner: "Char Dham Yatra Ex-Haridwar",
  },
  {
    id: "6adbccfba2f9959f3554bc0b",
    newTitle: "Kerala Tour Package Ex-Delhi – 5 Nights / 6 Days",
    newSlug: "kerala-tour-package-ex-delhi-6-days",
    newRouteBanner: "Munnar, Thekkady, Alleppey & Kochi",
  },
  {
    id: "6adbc11887f8dacf63abf3b8",
    newTitle: "Do Dham Yatra Ex-Haridwar – 5 Nights / 6 Days",
    newSlug: "do-dham-yatra-ex-haridwar-6-days",
    newRouteBanner: "Kedarnath Ji & Badrinath Ji",
  }
];

async function run() {
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

  console.log('UPDATING PACKAGE TITLES FROM -> EX-...\n');

  for (const item of updates) {
    const pkg = await Package.findById(item.id);
    if (!pkg) {
      console.warn(`Package not found: ${item.id}`);
      continue;
    }

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

    if (item.newRouteBanner) {
      updateFields.routeBannerTitle = item.newRouteBanner;
    }

    if (pkg.seo) {
      updateFields['seo.title'] = `${item.newTitle} | Shree Ananta Travels`;
    }

    await Package.findByIdAndUpdate(item.id, { $set: updateFields });
    console.log(`✓ [${item.id}]`);
    console.log(`   OLD TITLE: ${pkg.title}`);
    console.log(`   NEW TITLE: ${item.newTitle}`);
    console.log(`   OLD SLUG:  ${pkg.slug}`);
    console.log(`   NEW SLUG:  ${item.newSlug}`);
    console.log(`   REDIRECTS: ${updatedRedirects.join(', ')}`);
    console.log('---------------------------------------------------------');
  }

  await mongoose.disconnect();
  console.log('\nALL 3 PACKAGES UPDATED SUCCESSFULLY!');
}

run().catch(err => {
  console.error('FAILED TO UPDATE:', err);
  process.exit(1);
});
