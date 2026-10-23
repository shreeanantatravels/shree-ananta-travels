const mongoose = require('mongoose');
const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

// Mock or import geoCities logic
// Let's read geoCities definitions
const fs = require('fs');
const path = require('path');

async function testAll() {
  await mongoose.connect(uri);
  const Package = mongoose.model('Package', new mongoose.Schema({}, { strict: false }));
  const pkgs = await Package.find({});

  console.log(`Testing all ${pkgs.length} packages for route map generation:`);

  // We can test each package's itinerary
  for (let i = 0; i < pkgs.length; i++) {
    const p = pkgs[i];
    console.log(`\n--------------------------------------------------`);
    console.log(`[${i+1}] ${p.title} (${p.slug})`);
    console.log(`enableRouteMap in DB: ${p.enableRouteMap}`);
    console.log(`Total days: ${p.itinerary?.length || 0}`);
    
    const itinerary = p.itinerary || [];
    const citiesFound = itinerary.map((d, di) => {
      return {
        day: d.dayNumber || di + 1,
        city: d.city,
        route: d.route,
        title: d.title
      };
    });
    console.log('Days info:', JSON.stringify(citiesFound, null, 2));
  }

  await mongoose.disconnect();
}

testAll().catch(console.error);
