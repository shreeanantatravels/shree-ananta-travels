const mongoose = require('mongoose');
const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

// Read geoCities.ts and extract VERIFIED_DESTINATIONS
const fs = require('fs');
const content = fs.readFileSync('src/website/app/data/geoCities.ts', 'utf8');

// Quick evaluator to test city resolution
async function run() {
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
  const pkgs = await Package.find({});

  console.log(`Checking ${pkgs.length} packages:\n`);

  for (let i = 0; i < pkgs.length; i++) {
    const p = pkgs[i];
    console.log(`[${i+1}] ${p.title} (${p.slug})`);
    console.log(`    Location field: "${p.location || ''}"`);
    console.log(`    enableRouteMap: ${p.enableRouteMap}`);
    console.log(`    Days: ${p.itinerary?.length || 0}`);
    const daysWithCity = (p.itinerary || []).filter(d => d.city && d.city.trim());
    console.log(`    Days with explicit city: ${daysWithCity.length}/${p.itinerary?.length || 0}`);
    if (daysWithCity.length > 0) {
      console.log(`    Cities: ${daysWithCity.map(d => `D${d.dayNumber || ''}:${d.city}`).join(', ')}`);
    } else {
      console.log(`    NO explicit cities! Titles: ${(p.itinerary || []).map(d => d.title).slice(0, 3).join(' | ')}`);
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
