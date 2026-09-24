import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

export class DatabaseNotConfiguredError extends Error {
  constructor() {
    super('MONGODB_URI is not set');
    this.name = 'DatabaseNotConfiguredError';
  }
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Connects to MongoDB Atlas (cached across hot reloads / requests).
 * Only called when the app is NOT in demo mode. It never falls back to sample data:
 * if the database is missing or unreachable it throws, and the API answers with a clear 503.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) throw new DatabaseNotConfiguredError();

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 8000,
    });
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
