const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Read Cloudinary credentials from .env.local
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

async function uploadFromBuffer(url, name) {
  console.log(`Fetching ${name}...`);
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  if (!resp.ok) throw new Error(`Fetch failed for ${name}: ${resp.status} ${resp.statusText}`);
  const arrayBuffer = await resp.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  console.log(`Uploading ${name} to Cloudinary...`);
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'ananda-travel/packages',
        format: 'webp',
        transformation: [{ width: 1600, crop: 'limit', quality: 'auto' }]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

async function uploadAll() {
  const images = [
    { name: 'Munnar Tea Hills', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/Munnar_Tea_Plantation.jpg' },
    { name: 'Alleppey Houseboat', url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Houseboat%2C_Allepey.jpg' },
    { name: 'Thekkady Periyar', url: 'https://upload.wikimedia.org/wikipedia/commons/2/27/Thekkady_Periyar_National_Park.jpg' },
    { name: 'Kochi Chinese Fishing Nets', url: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Chinese_Fishing_Nets_at_Kochi.jpg' }
  ];

  const results = {};
  for (const item of images) {
    try {
      const secureUrl = await uploadFromBuffer(item.url, item.name);
      console.log(`✓ ${item.name} uploaded:`, secureUrl);
      results[item.name] = secureUrl;
    } catch (err) {
      console.error(`✗ Error on ${item.name}:`, err.message);
    }
  }

  console.log('\nFINAL_URLS:', JSON.stringify(results, null, 2));
}

uploadAll();
