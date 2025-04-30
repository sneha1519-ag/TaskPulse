import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/taskpulse';

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
}
/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
export async function dbConnect() {
    /**
     * Check if we have a connection to the database.
     * If yes, then simply return the connection.
     */
    if (cached.conn) {
        return cached.conn;
    }
    /**
     * If there's no connection to the database,
     * let's try to connect to it.
     */
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
    }
    /**
     * Wait for the connection to be established,
     * and return the connection.
     */
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }
    return cached.conn;
}