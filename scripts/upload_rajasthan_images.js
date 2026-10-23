const fs = require('fs');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

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
  const info = pages[pageId].imageinfo[0];
  return info.thumburl || info.url;
}

function uploadBufferToCloudinary(buffer, folder = 'ananda-travel/packages') {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
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

async function uploadImages() {
  const images = [
    {
      name: 'Mehrangarh Fort Jodhpur',
      wikiFile: 'A view of the Mehrangarh Fort, Jodhpur, Rajasthan.jpg'
    },
    {
      name: 'Sam Sand Dunes Jaisalmer',
      wikiFile: 'Jaisalmer Sam Sand Dunes.jpg'
    },
    {
      name: 'Lake Pichola City Palace Udaipur',
      wikiFile: '20191207 Lake Pichola, City Palace, Udaipur, 1516 7254.jpg'
    }
  ];

  const results = [];
  for (const item of images) {
    console.log(`\nFetching 1920px image URL for ${item.name}...`);
    const directUrl = await getWikimediaImageUrl(item.wikiFile, 1920);
    console.log(`Direct thumb URL: ${directUrl}`);
    console.log(`Downloading image data into buffer...`);
    const imgRes = await fetch(directUrl, {
      headers: { 'User-Agent': 'ShreeAnantaTravels/1.0 (contact@shreeanantatravels.com)' }
    });
    if (!imgRes.ok) throw new Error(`Failed to download ${item.name}: ${imgRes.statusText}`);
    const arrayBuffer = await imgRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(`Downloaded ${buffer.length} bytes (~${Math.round(buffer.length / 1024)} KB). Uploading to Cloudinary as WebP...`);
    const secureUrl = await uploadBufferToCloudinary(buffer);
    console.log(`✓ Success! Uploaded ${item.name} -> ${secureUrl}`);
    results.push({ name: item.name, url: secureUrl });
  }

  console.log('\n=============================================');
  console.log('UPLOAD COMPLETE. CLOUDINARY WEBP URLS:');
  console.log(JSON.stringify(results, null, 2));
  console.log('=============================================\n');

  // Save to json file for reference
  fs.writeFileSync(path.join(__dirname, 'uploaded_urls.json'), JSON.stringify(results, null, 2));
}

uploadImages().catch(err => {
  console.error('Upload failed:', err);
  process.exit(1);
});
