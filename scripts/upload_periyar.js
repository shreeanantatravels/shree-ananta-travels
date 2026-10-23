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

async function upload() {
  const url = 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Periyar_National_Park%2C_Kerala.jpg';
  console.log('Fetching Periyar...');
  const resp = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!resp.ok) throw new Error('Fetch failed: ' + resp.status);
  const buf = Buffer.from(await resp.arrayBuffer());
  const res = await new Promise((resolve, reject) => {
    const s = cloudinary.uploader.upload_stream(
      { folder: 'ananda-travel/packages', format: 'webp', transformation: [{ width: 1600, crop: 'limit', quality: 'auto' }] },
      (err, r) => err ? reject(err) : resolve(r)
    );
    s.end(buf);
  });
  console.log('PERIYAR_UPLOADED_URL:', res.secure_url);
}

upload().catch(console.error);
