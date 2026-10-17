import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || '';

let isConnected = false;

export async function connectToDatabase() {
  if (isConnected) return mongoose.connection;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is missing.');
  }

  const opts = {
    serverSelectionTimeoutMS: 8000,
  };

  const conn = await mongoose.connect(MONGODB_URI, opts);
  isConnected = true;
  console.log('✅ Connected to MongoDB Atlas successfully.');
  return conn;
}
