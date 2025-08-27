import React from "react";
import Navbar from "./Navbar";
import Header from "./Header";
// import MealPage from "../pages/MealPage";
import MealDisplay from "../pages/MealPage";

const MainPage = () => {
  return (
    <div>
      <Navbar />
      {/* <Header /> */}
      <MealDisplay />
    </div>
  );
};

export default MainPage;
