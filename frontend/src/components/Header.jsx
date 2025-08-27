import React from "react";
// import { assests } from "../assets/assets";
import header_img from "../assets/header_img.png";
import hand_wave from "../assets/hand_wave.png";

const Header = () => {
  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2">
        Hey Food Lover
        <img className="w-8 aspect-square" src={hand_wave} alt="" />
      </h1>
      <h2 className="text-3xl sm:text-5xl font-semibold mb-4">
        Welcome to our app
      </h2>
    </div>
  );
};

export default Header;
