const { v2: cloudinary } = require('cloudinary');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = (match[2] || '').trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    process.env[match[1]] = value;
  }
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function getWikimediaImageUrl(filename, width = 1920) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=File:${encodeURIComponent(filename)}&prop=imageinfo&iiprop=url&iiurlwidth=${width}&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'ShreeAnantaTravels/1.0 (contact@shreeanantatravels.com)' } });
  const data = await res.json();
  const pages = data.query.pages;
  const pageId = Object.keys(pages)[0];
  if (pageId === '-1') throw new Error(`File not found: ${filename}`);
  const info = pages[pageId].imageinfo[0];
  return info.thumburl || info.url;
}

function uploadBufferToCloudinary(buffer, publicIdPrefix = '') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'ananda-travel/packages',
        format: 'webp',
        quality: 'auto:good'
      },
      (error, result) => {
        if (error) return reject(error);
        if (result && result.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Failed to get secure URL from Cloudinary'));
        }
      }
    );
    uploadStream.end(buffer);
  });
}

// Definition of packages and their 4 curated high quality images
const packageImagesConfig = {
  // 1. South Yatra (with Trivandrum, ₹41,000)
  south_with_trivandrum: [
    { pos: 1, name: "Vivekananda Rock Memorial & Thiruvalluvar Statue Kanyakumari", wiki: "Vivekananda rock Memorial and Thiruvalluvar Statue.jpg" },
    { pos: 2, name: "Meenakshi Amman Temple Madurai", wiki: "Sri Meenakshi Devasthanam Temple (east-exposure).jpg" },
    { pos: 3, name: "Pamban Railway Bridge Rameshwaram", wiki: "Pamban railway bridge, rameswaram.jpg" },
    { pos: 4, name: "Sree Padmanabhaswamy Temple Trivandrum", wiki: "Sree Padmanabhaswamy Temple Lakshadeepam.jpg" }
  ],

  // 2. South Yatra (without Trivandrum, ₹30,000)
  south_without_trivandrum: [
    { pos: 1, name: "Vivekananda Rock Memorial & Thiruvalluvar Statue Kanyakumari", wiki: "Statue of Thiruvalluvar and Vivekananda Rock Memorial.jpg" },
    { pos: 2, name: "Meenakshi Amman Temple Madurai", wiki: "Temple de Mînâkshî01.jpg" },
    { pos: 3, name: "Pamban Bridge Rameshwaram", wiki: "Pamban Bridge, Rameswaram 1.jpg" },
    { pos: 4, name: "Ramanathaswamy Temple 1000 Pillar Corridor Rameshwaram", wiki: "Ramanathaswamy Temple corridor 01.jpg" }
  ],

  // 3. Char Dham Yatra (Haridwar 10 Days / 9 Nights)
  char_dham: [
    { pos: 1, name: "Kedarnath Temple with snow-capped Himalayas", wiki: "Kedarnath temple, Uttrakhand 02.jpg" },
    { pos: 2, name: "Badrinath Temple Uttarakhand", wiki: "Badrinath temple - Uttarakhand 1.jpg" },
    { pos: 3, name: "Gangotri Town & Bhagirathi River", wiki: "Gangotri Town.jpg" },
    { pos: 4, name: "Yamunotri Shrine Himalayas", wiki: "Yamunotri shrine.jpg" }
  ],

  // 4. Do Dham Yatra (Haridwar: Kedarnath & Badrinath – 6 Days / 5 Nights)
  do_dham: [
    { pos: 1, name: "Kedarnath Temple Himalayas", wiki: "Kedarnath Temple and himalayas.jpg" },
    { pos: 2, name: "Badrinath Temple Uttarakhand", wiki: "Badrinath temple - Uttarakhand 2.jpg" },
    { pos: 3, name: "Har Ki Pauri Ganga Aarti Haridwar", wiki: "Aarti at Har-ki-Pauri, Haridwar.jpg" },
    { pos: 4, name: "Chopta Tungnath Meadows", wiki: "Chandrasila RohiniBugiyal view.jpg" }
  ],

  // 5. Rajasthan Tour Package (Jaipur, Pushkar, Jodhpur, Jaisalmer, Udaipur – 9 Days / 8 Nights)
  rajasthan: [
    { pos: 1, name: "Hawa Mahal Jaipur Facade", wiki: "Hawa Mahal east facade (14-07-2022).jpg" },
    { pos: 2, name: "Sam Sand Dunes Jaisalmer Sunset", wiki: "Sunset Sand Dunes Jaisalmer Dec14 DSC 6540.jpg" },
    { pos: 3, name: "Mehrangarh Fort Jodhpur", wiki: "2 Mehrangarh fort Jodhpur Rajasthan.jpg" },
    { pos: 4, name: "Lake Pichola & City Palace Udaipur Night", wiki: "Udaipur City Palace at Night.jpg" }
  ],

  // 6. Kerala Tour Package (Delhi: Munnar, Thekkady, Alleppey, Kochi – 6 Days / 5 Nights)
  kerala: [
    { pos: 1, name: "Alleppey Houseboat on Backwaters", wiki: "Houseboat on Alleppey backwaters (Kerala, India 2023) (52704577484).jpg" },
    { pos: 2, name: "Munnar Tea Gardens", wiki: "Munnar Tea Gardens.jpg" },
    { pos: 3, name: "Thekkady Periyar Lake Boat Safari", wiki: "Periyar National Park-Thekkady Lake - Jalakanyaka-WUS07796.jpg" },
    { pos: 4, name: "Kochi Chinese Fishing Nets Sunset", wiki: "Kochi chinese fishing-net-20080215-01a.jpg" }
  ]
};

async function verifyAllWikiUrls() {
  console.log('Verifying all 24 Wikimedia image URLs...\n');
  for (const [key, items] of Object.entries(packageImagesConfig)) {
    console.log(`Checking ${key}...`);
    for (const item of items) {
      try {
        const url = await getWikimediaImageUrl(item.wiki);
        console.log(`  ✓ [${item.pos}] ${item.name} -> ${url.slice(0, 70)}...`);
      } catch (e) {
        console.error(`  ✗ [${item.pos}] ${item.name} (${item.wiki}): ${e.message}`);
      }
    }
  }
}

verifyAllWikiUrls().catch(console.error);
