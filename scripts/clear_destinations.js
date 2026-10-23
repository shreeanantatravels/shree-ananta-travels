const mongoose = require('mongoose');
const uri = "mongodb+srv://shreeanantatravelsadmin_db_user:Nz3w5Vp7UrmCQ1p8@cluster0.l7dlhey.mongodb.net/anantaTravels";

async function clearDestinations() {
  await mongoose.connect(uri);
  const SiteConfig = mongoose.model('SiteConfig', new mongoose.Schema({}, { strict: false }));
  
  const before = await SiteConfig.findOne({ _singleton: true });
  console.log('Current destinations before clear:', before?.destinations?.length || 0);

  const res = await SiteConfig.updateOne(
    { _singleton: true },
    { $set: { destinations: [] } }
  );
  console.log('Update result:', res);

  const after = await SiteConfig.findOne({ _singleton: true });
  console.log('Destinations count after clear:', after?.destinations?.length || 0);

  await mongoose.disconnect();
}

clearDestinations().catch(console.error);
