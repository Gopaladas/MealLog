import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  createMeal,
  getMealsByDate,
  getMealsById,
} from "../controllers/mealControllers.js";

const mealRoutes = express.Router();

mealRoutes.post("/addmeal", userAuth, createMeal);
mealRoutes.get("/getmeal", userAuth, getMealsByDate);
mealRoutes.get("/getmealbyid", userAuth, getMealsById);
export { mealRoutes };
