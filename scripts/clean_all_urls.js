const mongoose = require('mongoose');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=["']?([^"'\r\n]+)/);
const uri = match[1];

async function run() {
  await mongoose.connect(uri);
  const Blog = mongoose.model('Blog', new mongoose.Schema({}, { strict: false }));
  const post = await Blog.findOne({ slug: 'kailash-mansarovar-yatra-2027-nepal-flood-route-update' });

  let content = post.content;

  // Replacements
  const replacements = [
    {
      find: /Read Nepal[’']s Ministry of Home Affairs update\s*\(https\\?:\/\/www\.moha\.gov\.np[^\)]+\)/g,
      replace: `[Read Nepal’s Ministry of Home Affairs Disaster Update ↗](https://www.moha.gov.np/en/post/ha-ra-tha-ka-apa-l-11)`
    },
    {
      find: /Read the report\s*\(https\\?:\/\/kathmandupost\.com\/money\/2026\/09\/29\/all-three-major-nepal-china-crossings-hit-by-monsoon-disruptions-ahead-of-dashain\)/g,
      replace: `[Read the Kathmandu Post Crossing Disruption Report ↗](https://kathmandupost.com/money/2026/09/29/all-three-major-nepal-china-crossings-hit-by-monsoon-disruptions-ahead-of-dashain)`
    },
    {
      find: /Read the report\s*\(https\\?:\/\/kathmandupost\.com\/national\/2026\/10\/11\/bailey-bridge-restores-road-link-between-rasuwa-and-nuwakot-after-six-weeks\)/g,
      replace: `[Read the Kathmandu Post Bailey Bridge Restoration Report ↗](https://kathmandupost.com/national/2026/10/11/bailey-bridge-restores-road-link-between-rasuwa-and-nuwakot-after-six-weeks)`
    },
    {
      find: /Read the report\s*\(https\\?:\/\/kathmandupost\.com\/national\/2026\/10\/17\/beijing-s-security-concerns-cloud-nepal-s-push-to-reopen-tatopani\)/g,
      replace: `[Read the Kathmandu Post Tatopani Reopening Report ↗](https://kathmandupost.com/national/2026/10/17/beijing-s-security-concerns-cloud-nepal-s-push-to-reopen-tatopani)`
    },
    {
      find: /Read Nepal News[’'] report\s*\(https\\?:\/\/english\.nepalnews\.com[^\)]+\)/g,
      replace: `[Read the Nepal News Hilsa Snowfall Report ↗](https://english.nepalnews.com/s/travel-tourism/snowfall-strands-41-nepalis-at-hilsa-border-kailash-mansarovar-route-closes/)`
    },
    {
      find: /official Kailash Manasarovar Yatra portal\s*\(https\\?:\/\/www\.kmy\.gov\.in\/?\)/g,
      replace: `official [Government of India Kailash Manasarovar Yatra Portal (kmy.gov.in) ↗](https://www.kmy.gov.in/)`
    },
    {
      find: /Read the official response\s*\(https\\?:\/\/sansad\.in\/getFile\/annex\/270\/AU4410\\?_RsaY24\.pdf\?source=pqars\)/g,
      replace: `[Read the Official MEA Parliamentary Response (PDF) ↗](https://sansad.in/getFile/annex/270/AU4410_RsaY24.pdf?source=pqars)`
    },
    {
      find: /Embassy of India in Kathmandu[’']s Kailash Mansarovar guidance\s*\(https\\?:\/\/www\.indembkathmandu\.gov\.in\/kailash-mansorvar-yatra-via-nepal\)/g,
      replace: `[Embassy of India in Kathmandu’s Official Kailash Mansarovar Guidance ↗](https://www.indembkathmandu.gov.in/kailash-mansorvar-yatra-via-nepal)`
    }
  ];

  let changeCount = 0;
  for (const r of replacements) {
    if (r.find.test(content)) {
      content = content.replace(r.find, r.replace);
      changeCount++;
    } else {
      console.log('Not matched:', r.find);
    }
  }

  console.log(`Matched and replaced ${changeCount} of ${replacements.length} raw URL patterns.`);

  const updateRes = await Blog.updateOne(
    { _id: post._id },
    { $set: { content } }
  );

  console.log('Update result:', updateRes);
  await mongoose.disconnect();
}

run().catch(console.error);
