import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI');

let cached = global.__mongoose || { conn: null, promise: null };
global.__mongoose = cached;

export async function dbConnect() {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		cached.promise = mongoose.connect(MONGODB_URI, {
			dbName: process.env.MONGODB_DB || 'portfolio',
		}).then(m => m);
	}
	cached.conn = await cached.promise;
	return cached.conn;
}
