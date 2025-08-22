import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
if (!/^mongodb(\+srv)?:\/\//.test(MONGODB_URI)) {
	throw new Error(
		'Invalid MONGODB_URI. It must start with "mongodb://" or "mongodb+srv://".',
	);
}

let cached = global.__mongoose || { conn: null, promise: null };
global.__mongoose = cached;

export async function dbConnect() {
	if (cached.conn) return cached.conn;
	if (!cached.promise) {
		cached.promise = mongoose
			.connect(MONGODB_URI, {
				dbName: process.env.MONGODB_DB || "portfolio",
			})
			.then((m) => m);
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

export default dbConnect();
