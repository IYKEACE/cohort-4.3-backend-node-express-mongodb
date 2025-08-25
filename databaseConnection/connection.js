import mongoose from "mongoose";

// database connection
export const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Database connected successfully");
  } catch (error) {
    console.log(error);
  }
};
