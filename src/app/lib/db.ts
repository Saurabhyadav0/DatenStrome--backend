import mongoose, { Mongoose } from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("Please add MONGO_URI to .env.local");
}

// Define a type for our cached mongoose connection
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Extend NodeJS global type to include mongoose cache
declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((m) => m);
  }

  cached.conn = await cached.promise;
  global.mongooseCache = cached;

  return cached.conn;
}
