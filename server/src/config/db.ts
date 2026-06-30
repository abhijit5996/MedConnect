import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connString = process.env.MONGODB_URI || "mongodb://localhost:27017/medconnect";
    await mongoose.connect(connString);
    console.log(`📡 MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${(error as Error).message}`);
    process.exit(1);
  }
};
