import mongoose from "mongoose";
let isConnected = false; // Keep track of the connection status

async function connectToDatabase() {
  if (!isConnected) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      isConnected = true;
      console.log("Database connected");
    } catch (error) {
      console.error("Database connection error:", error);
      throw new Error("Database connection failed");
    }
  }
}

export default connectToDatabase;