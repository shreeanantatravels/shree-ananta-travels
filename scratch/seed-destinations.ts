import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("No MONGO_URI found in .env.local");
  process.exit(1);
}

const REAL_DESTINATIONS = [
  { name: 'Kashmir', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&q=80' },
  { name: 'Kerala', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80' },
  { name: 'Goa', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80' },
  { name: 'Rajasthan', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80' },
  { name: 'Manali & Himachal', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1588083949404-c4f1ed1323b3?w=800&q=80' },
  { name: 'Ladakh', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80' },
  { name: 'Golden Triangle', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80' },
  { name: 'Andaman & Nicobar', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?w=800&q=80' },
  { name: 'Varanasi', category: 'domestic', active: true, trending: true, image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80' },
  { name: 'Dubai', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80' },
  { name: 'Maldives', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80' },
  { name: 'Bali', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80' },
  { name: 'Switzerland', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&q=80' },
  { name: 'Thailand', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800&q=80' },
  { name: 'Singapore', category: 'international', active: true, trending: true, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&q=80' },
];

async function run() {
  await mongoose.connect(MONGO_URI!);
  console.log("Connected to MongoDB");

  const db = mongoose.connection.db;
  if (!db) {
    console.error("DB not ready");
    process.exit(1);
  }

  const siteconfigs = db.collection('siteconfigs');
  const result = await siteconfigs.updateOne(
    { _singleton: true },
    { $set: { destinations: REAL_DESTINATIONS } },
    { upsert: true }
  );

  console.log("Seeded siteconfig destinations in MongoDB:", result);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
