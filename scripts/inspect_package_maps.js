const mongoose = require('mongoose');
const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

async function inspect() {
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
  const pkgs = await Package.find({});
  console.log('Total packages in DB:', pkgs.length);
  pkgs.forEach((p, i) => {
    console.log(`\n==============================`);
    console.log(`[${i+1}] ${p.title} (${p.slug})`);
    console.log(`Location: ${p.location}`);
    console.log(`enableRouteMap: ${p.enableRouteMap}`);
    console.log(`Itinerary days count: ${p.itinerary?.length || 0}`);
    p.itinerary?.forEach((day, di) => {
      console.log(`  Day ${day.dayNumber || di+1}: city="${day.city || ''}" | route="${day.route || ''}" | title="${day.title || ''}"`);
    });
  });
  await mongoose.disconnect();
}

inspect().catch(console.error);
