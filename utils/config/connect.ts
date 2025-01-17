import mongoose from 'mongoose';

const connectToDatabase = async () => {
  if (mongoose.connections[0].readyState) {
    return; // If already connected, no need to connect again
  }

  try {
    await mongoose.connect(process.env.MONGO_URI!); // Ensure MONGO_URI is set in your .env
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw new Error("Database connection failed.");
  }
};

export default connectToDatabase;
