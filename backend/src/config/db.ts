import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoMemoryServer: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/splitlease';

  try {
    mongoose.set('strictQuery', true);
    // Attempt standard connection first with 3s timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected successfully to ${uri}`);
  } catch (error: any) {
    console.warn(`[MongoDB] Could not connect to primary URI (${uri}): ${error.message}`);
    console.log('[MongoDB] Launching in-memory MongoDB server fallback...');

    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      await mongoose.connect(memUri);
      console.log(`[MongoDB] Connected to in-memory database at ${memUri}`);
    } catch (memError) {
      console.error('[MongoDB] Failed to launch in-memory database:', memError);
      process.exit(1);
    }
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.disconnect();
  if (mongoMemoryServer) {
    await mongoMemoryServer.stop();
  }
};
