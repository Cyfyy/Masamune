import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables.');
  }

  try {
    // Check if already connected to avoid unnecessary reconnections
    if (mongoose.connection.readyState >= 1) {
      console.log('Already connected to MongoDB');
      return;
    }

    // Connect to MongoDB without useNewUrlParser and useUnifiedTopology
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'masamune', // Replace with your database name
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw new Error('Failed to connect to the database.');
  }
};

export default connectToDatabase;
