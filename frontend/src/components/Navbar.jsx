import React from "react";
import logo from "../assets/logo.jfif";
import arrow from "../assets/arrow_icon.svg";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Logout from "../pages/Logout";

const Navbar = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-2 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Logo" className="w-24 sm:w-28 rounded-full" />
        </div>

        {/* Authentication Buttons */}

        <div className="flex items-center space-x-4">
          {console.log(isLoggedIn)}
          {isLoggedIn && <a href="/profile">Profile</a>}
          {isLoggedIn ? (
            <Logout />
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 border border-gray-500 rounded-full px-4 py-1 text-gray-800 hover:bg-gray-100 transition-all"
            >
              <img src={arrow} alt="Arrow Icon" className="w-4 h-4" />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
