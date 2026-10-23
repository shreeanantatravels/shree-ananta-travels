const mongoose = require('mongoose');

const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

// Helper function to convert "X Days / Y Nights" or "X Days Y Nights" or "XD YN" to "Y Nights / X Days"
function swapDaysNights(text) {
  if (!text) return text;

  // Match e.g. "6 Days / 5 Nights" -> "5 Nights / 6 Days"
  let res = text.replace(/(\d+)\s*(?:Days?|D)\s*(?:\/|\&|\s+)\s*(\d+)\s*(?:Nights?|N)/gi, '$2 Nights / $1 Days');
  
  // Clean up any double spaces or bad spacing
  res = res.replace(/\s+/g, ' ').trim();
  return res;
}

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));

  const pkgs = await Package.find({});
  console.log(`Found ${pkgs.length} packages. Converting titles & durations to "Nights / Days"...`);

  for (const pkg of pkgs) {
    const oldTitle = pkg.title;
    const oldDuration = pkg.duration;

    const newTitle = swapDaysNights(oldTitle);
    const newDuration = swapDaysNights(oldDuration);

    const updateFields = {
      title: newTitle,
      duration: newDuration,
      updatedAt: new Date()
    };

    if (pkg.seo && pkg.seo.title) {
      updateFields['seo.title'] = swapDaysNights(pkg.seo.title);
    }
    if (pkg.seo && pkg.seo.description) {
      updateFields['seo.description'] = swapDaysNights(pkg.seo.description);
    }

    await Package.findByIdAndUpdate(pkg._id, { $set: updateFields });

    console.log(`-----------------------------------------------------`);
    console.log(`ID: ${pkg._id}`);
    console.log(`  TITLE:    ${oldTitle}  ==>  ${newTitle}`);
    console.log(`  DURATION: ${oldDuration}  ==>  ${newDuration}`);
  }

  console.log('\n=====================================================');
  console.log('ALL PACKAGES UPDATED TO "NIGHTS / DAYS" FORMAT!');
  console.log('=====================================================');

  await mongoose.disconnect();
}

run().catch(err => {
  console.error('Failed to update:', err);
  process.exit(1);
});
