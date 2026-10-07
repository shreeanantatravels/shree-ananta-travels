import mongoose from 'mongoose';

declare global {
  // Allow global `_mongoose` across hot reloads in dev
  var _mongoose: { conn: mongoose.Connection | null; promise: Promise<mongoose.Connection> | null };
}

const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGO_URI environment variable in .env.local');
}

let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

async function connectDB(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 15000,
      family: 4,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((m) => m.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
