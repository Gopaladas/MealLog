import React, { useState, useEffect } from "react";
import axios from "axios";
import { mealApi } from "../mainApi";
import { foodDB } from "../foodDB";

const MealDisplay = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    mealType: "",
    foodItems: "",
    loggedAt: new Date().toISOString().slice(0, 16),
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    filterMealsByDate();
  }, [searchDate, meals]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(`${mealApi}/getmealbyid`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMeals(response.data.data);
        setFilteredMeals(response.data.data);
      } else {
        setError(
          "Failed to load meal data: " +
            (response.data.message || "Unknown error")
        );
      }
    } catch (err) {
      console.error("Error fetching meals:", err);
      setError("Failed to load meal data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filterMealsByDate = () => {
    if (!searchDate) {
      setFilteredMeals(meals);
      return;
    }

    const filtered = meals.filter((meal) => {
      const mealDate = new Date(meal.loggedAt).toISOString().split("T")[0];
      return mealDate === searchDate;
    });

    setFilteredMeals(filtered);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddMeal = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Convert foodItems string to array
      const foodItemsArray = formData.foodItems
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item);

      if (foodItemsArray.length === 0) {
        alert("Please enter at least one food item");
        return;
      }

      const mealData = {
        mealType: formData.mealType,
        foodItems: foodItemsArray,
        loggedAt: formData.loggedAt,
      };

      const response = await axios.post(`${mealApi}/addmeal`, mealData, {
        withCredentials: true,
      });

      if (response.data.success) {
        alert("Meal added successfully!");
        setShowAddForm(false);
        setFormData({
          mealType: "",
          foodItems: "",
          loggedAt: new Date().toISOString().slice(0, 16),
        });
        fetchMeals(); // Refresh the meal list
      } else {
        alert("Failed to add meal: " + response.data.message);
      }
    } catch (err) {
      console.error("Error adding meal:", err);
      alert("Failed to add meal. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading meals...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Your Meal Records
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex-1 max-w-md">
          <label
            htmlFor="searchDate"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Search by Date:
          </label>
          <input
            type="date"
            id="searchDate"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
        >
          + Add New Meal
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          <strong>Error: </strong> {error}
        </div>
      )}

      {/* Add Meal Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Add New Meal
              </h2>

              <form onSubmit={handleAddMeal}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Meal Type *
                  </label>
                  <select
                    name="mealType"
                    value={formData.mealType}
                    onChange={handleInputChange}
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Meal Type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Food Items *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-md">
                    {Object.keys(foodDB).map((food) => (
                      <label key={food} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          value={food}
                          checked={formData.foodItems.includes(food)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            const currentItems = formData.foodItems
                              .split(",")
                              .filter((item) => item.trim() !== "");

                            if (isChecked) {
                              setFormData((prev) => ({
                                ...prev,
                                foodItems: [...currentItems, food].join(", "),
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                foodItems: currentItems
                                  .filter((item) => item !== food)
                                  .join(", "),
                              }));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">
                          {food}{" "}
                          <span className="text-gray-500">
                            ({foodDB[food].calories} cal)
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Selected items display */}
                  {formData.foodItems && (
                    <div className="mt-2">
                      <p className="text-sm font-medium text-gray-700">
                        Selected Items:
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.foodItems
                          .split(",")
                          .filter((item) => item.trim() !== "")
                          .map((item, index) => (
                            <span
                              key={index}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {item.trim()}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    name="loggedAt"
                    value={formData.loggedAt}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {submitting ? "Adding..." : "Add Meal"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      {searchDate && (
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredMeals.length} meal
            {filteredMeals.length !== 1 ? "s" : ""} for {formatDate(searchDate)}
          </p>
        </div>
      )}

      {/* Meals List */}
      {filteredMeals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-500 text-xl mb-4">
            {searchDate ? "No meals found for this date" : "No meals found"}
          </div>
          <p className="text-gray-600">
            {searchDate
              ? "Try a different date or add a new meal."
              : "You haven't logged any meals yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMeals.map((meal) => (
            <div
              key={meal._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Meal Type Header */}
              <div className="bg-blue-500 text-white px-4 py-3">
                <h2 className="text-xl font-semibold">
                  {capitalizeFirstLetter(meal.mealType)}
                </h2>
              </div>

              <div className="p-5">
                {/* Date and Time */}
                <div className="mb-4">
                  <div className="flex items-center text-gray-600 mb-1">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{formatDate(meal.loggedAt)}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{formatTime(meal.loggedAt)}</span>
                  </div>
                </div>

                {/* Food Items */}
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0A1.5 1.5 0 013 15.546V5a2 2 0 012-2h14a2 2 0 012 2v10.546z"
                      />
                    </svg>
                    Food Items
                  </h3>
                  <ul className="list-disc list-inside pl-2">
                    {meal.foodItems.map((item, index) => (
                      <li key={index} className="text-gray-700">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Nutrition Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Nutrition
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-100 p-2 rounded">
                      <div className="text-sm text-gray-600">Calories</div>
                      <div className="font-semibold">
                        {meal.nutrition.calories || 0}
                      </div>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                      <div className="text-sm text-gray-600">Protein</div>
                      <div className="font-semibold">
                        {meal.nutrition.protein || 0}g
                      </div>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                      <div className="text-sm text-gray-600">Carbs</div>
                      <div className="font-semibold">
                        {meal.nutrition.carbs || 0}g
                      </div>
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                      <div className="text-sm text-gray-600">Fiber</div>
                      <div className="font-semibold">
                        {meal.nutrition.fiber || 0}g
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealDisplay;
