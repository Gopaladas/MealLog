import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const calculateBMR = (gender, weight, height, age) => {
  weight = parseFloat(weight);
  height = parseFloat(height);
  age = parseInt(age);

  let bmr;

  if (gender.toLowerCase() === "male") {
    bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
  } else {
    bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
  }

  return Math.round(bmr);
};

const signUp = async (req, res) => {
  const { name, email, password, gender } = req.body;

  if (!name || !email || !password || !gender) {
    return res.json({ success: false, message: "Missing details" });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      gender,
    });

    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.json({
      message: error.message,
    });
  }
};

const singin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({
      success: false,
      message: "Email and password are required",
    });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid email" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.json({
      success: true,
      data: {
        name: user.name,
        email,
        id: user._id,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

const updateBMR = async (req, res) => {
  try {
    const userId = req.userId;
    console.log("hello : " + `${userId}`);
    if (!userId) {
      return res.status(400).json({
        message: "userId is not present",
      });
    }

    const user = await userModel.findById(userId);
    console.log(user._id);
    if (!user) {
      return res.status(400).json({
        message: "user not existed with this id",
      });
    }

    const { height, weight, age } = req.body;

    if (!height || !weight || !age) {
      return res.status(400).json({
        message: "height or weight or age is missing",
      });
    }

    user.height = height;
    user.weight = weight;
    user.age = age;

    const bmrValue = calculateBMR(user?.gender, weight, height, age);
    user.bmr = bmrValue;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "BMR updated successfully",
      data: {
        bmr: user.bmr,
        userInfo: {
          name: user.name,
          age: user.age,
          gender: user.gender,
          height: user.height,
          weight: user.weight,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const signOut = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    return res.json({ success: true, message: "Logged Out" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

const userData = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: "userId is missing",
      });
    }

    const userData = await userModel.findById(userId).select("-password");

    if (!userData) {
      return res.status(400).json({
        message: "user not existed",
      });
    }

    return res.status(200).json({
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { signUp, singin, updateBMR, signOut, userData };
