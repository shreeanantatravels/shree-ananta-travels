const mongoose = require('mongoose');

const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

async function check() {
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
  const pkgs = await Package.find({}, 'title slug discountedPrice category packageType');
  console.log('Total packages in DB:', pkgs.length);
  pkgs.forEach(p => console.log(`${p._id} | ${p.slug} | ₹${p.discountedPrice} | ${p.title}`));
  await mongoose.disconnect();
}

check().catch(console.error);
