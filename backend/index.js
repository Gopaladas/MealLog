import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/mongodb.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    //origin: "http://localhost:5173", // Your frontend URL
    origin:"https://meal-log-beta.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Allow credentials
  })
);
app.use(express.json());
app.use(cookieParser());

//mongoDB connection
connectDB();

//Routes
import userRoute from "./routes/userRoutes.js";
import { mealRoutes } from "./routes/mealRoutes.js";
app.use("/api/v1/user", userRoute);
app.use("/api/v1/meal", mealRoutes);

app.listen(process.env.PORT, () => {
  console.log(`server running successful in port ${process.env.PORT}`);
});
