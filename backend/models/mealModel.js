import mongoose from "mongoose";
import { foodDB } from "../utils/foodDB.js";

const meal = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    mealType: {
      type: String,
      required: true,
      enum: ["breakfast", "lunch", "dinner"],
      lowercase: true,
    },
    foodItems: [
      {
        type: String,
        required: true,
      },
    ],
    nutrition: {
      calories: {
        type: Number,
        default: 0,
      },
      protein: {
        type: Number,
        default: 0,
      },
      carbs: {
        type: Number,
        default: 0,
      },
      fiber: {
        type: Number,
        default: 0,
      },
    },
    loggedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

meal.pre("save", function (next) {
  if (this.isModified("foodItems")) {
    this.nutrition = this.foodItems.reduce(
      (total, foodItem) => {
        const foodData = foodDB[foodItem];
        if (foodData) {
          total.calories += foodData.calories || 0;
          total.protein += foodData.protein || 0;
          total.carbs += foodData.carbs || 0;
          total.fiber += foodData.fiber || 0;
        }
        return total;
      },
      { calories: 0, protein: 0, carbs: 0, fiber: 0 }
    );
  }
  next();
});

const mealModel = mongoose.model("meal", meal);
export default mealModel;
