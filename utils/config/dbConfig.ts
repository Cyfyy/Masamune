import mongoose from 'mongoose';

export async function connect() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in the environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    mongoose.connection.on('connected', () => {
      console.log('MongoDB Connected');
    });

    mongoose.connection.on('error', (error) => {
      console.log('MongoDB error: ' + error);
      process.exit(1);
    });

  } catch (error: any) {
    console.log('Error connecting to MongoDB:', error);
    throw error;
  }
}