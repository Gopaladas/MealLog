import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // console.log(process.env.MONGODB);
    const connect = await mongoose.connect(process.env.MONGODB);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
