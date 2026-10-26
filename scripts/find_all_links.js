const mongoose = require('mongoose');
const fs = require('fs');

const env = fs.readFileSync('.env.local', 'utf8');
const match = env.match(/MONGODB_URI=["']?([^"'\r\n]+)/);
const uri = match[1];

async function run() {
  await mongoose.connect(uri);
  const Blog = mongoose.model('Blog', new mongoose.Schema({}, { strict: false }));
  const post = await Blog.findOne({ slug: 'kailash-mansarovar-yatra-2027-nepal-flood-route-update' });

  if (!post) {
    console.log('Post not found!');
  } else {
    console.log('Post found:', post.title);
    const lines = post.content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('sansad') || line.includes('http')) {
        console.log(`Line ${idx + 1}: ${line.trim()}`);
      }
    });
  }

  await mongoose.disconnect();
}

run().catch(console.error);
