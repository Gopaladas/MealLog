import mongoose from "mongoose";

const User = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true, // Make gender required for BMR
    enum: ["male", "female"],
    lowercase: true,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
  height: {
    type: Number,
  },
  weight: {
    type: Number,
  },
  bmr: {
    type: Number, // Will store calculated BMR
    default: 0,
  },
});

const userModel = mongoose.model("user", User);
export default userModel;
