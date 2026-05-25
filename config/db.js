import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Safely drop legacy unique username index if it exists on the users collection
    try {
      await conn.connection.db.collection('users').dropIndex('username_1');
      console.log('🧹 Legacy unique username index successfully dropped.');
    } catch (err) {
      if (err.code === 27 || err.message.includes('index not found')) {
        console.log('ℹ️ Legacy username index already removed or not present.');
      } else {
        console.warn('⚠️ Non-critical error clean-up legacy index:', err.message);
      }
    }
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
