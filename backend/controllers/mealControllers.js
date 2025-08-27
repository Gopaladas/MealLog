import mealModel from "../models/mealModel.js";
import userModel from "../models/userModel.js";

const createMeal = async (req, res) => {
  try {
    const userId = req.userId;
    const { mealType, foodItems, loggedAt } = req.body;

    if (!userId || !mealType || !foodItems || !Array.isArray(foodItems)) {
      return res.status(400).json({
        success: false,
        message: "UserId,mealType,and foodItems array are required",
      });
    }

    if (foodItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one food item is requires",
      });
    }

    const newMeal = new mealModel({
      userId,
      mealType: mealType.toLowerCase(),
      foodItems,
      loggedAt: loggedAt ? new Date(loggedAt) : new Date(),
    });

    const savedMeal = await newMeal.save();
    await savedMeal.populate("userId", "name email");

    return res.status(201).json({
      success: true,
      message: "Meal logged successfully",
      meal: savedMeal,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMealsByDate = async (req, res) => {
  try {
    const userId = req.userId;
    const { date } = req.query;

    if (!date || !userId) {
      return res.status(400).json({
        success: false,
        message: "Date and userId are required as query parameters",
      });
    }

    const targetDate = new Date(date);
    if (isNaN(targetDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format. Use YYYY-MM-DD",
      });
    }

    const startOfDay = new Date(targetDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(targetDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const meals = await mealModel
      .find({
        userId: userId,
        loggedAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      })
      .sort({ loggedAt: 1 }); // Sort by time

    const dailyTotals = meals.reduce(
      (totals, meal) => {
        totals.calories += meal.nutrition.calories;
        totals.protein += meal.nutrition.protein;
        totals.carbs += meal.nutrition.carbs;
        totals.fiber += meal.nutrition.fiber;
        return totals;
      },
      { calories: 0, protein: 0, carbs: 0, fiber: 0 }
    );

    res.status(200).json({
      success: true,
      message: `Meals for ${date}`,
      data: {
        date: date,
        totalMeals: meals.length,
        dailyTotals: dailyTotals,
        meals: meals,
      },
    });
  } catch (error) {
    console.error("Get meals error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid userId format",
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMealsById = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: "userId is not present",
      });
    }

    const mealData = await mealModel.find({ userId: userId });
    // console.log(mealData);
    return res.status(200).json({ success: true, data: mealData });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
export { createMeal, getMealsByDate, getMealsById };
