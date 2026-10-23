const mongoose = require('mongoose');
const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

async function check() {
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
  const pkgs = await Package.find({});
  console.log('Total packages in DB:', pkgs.length);
  pkgs.forEach((p, idx) => {
    console.log(`[${idx+1}] ID: ${p._id}`);
    console.log(`    Title: ${p.title}`);
    console.log(`    Slug: ${p.slug}`);
    console.log(`    Price: ₹${p.discountedPrice} (Orig: ₹${p.originalPrice})`);
    console.log(`    Location: ${p.location}`);
    console.log(`    Duration: ${p.duration}`);
    console.log(`    Image 1: ${p.imageUrl1}`);
    console.log(`    Image 2: ${p.imageUrl2}`);
    console.log(`    Image 3: ${p.imageUrl3}`);
    console.log(`    Image 4: ${p.imageUrl4}`);
  });
  await mongoose.disconnect();
}

check().catch(console.error);
