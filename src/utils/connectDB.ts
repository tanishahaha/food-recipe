import mongoose from 'mongoose';

let cachedConnection: mongoose.Connection | null = null;

const connectDB = async (): Promise<mongoose.Connection> => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log('MongoDB connected successfully');
    cachedConnection = connection.connection;  // Storing the connection instance
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    throw error;
  }
};

export default connectDB;
