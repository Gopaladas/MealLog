import React, { useState } from "react";
import axios from "axios";
import { userApi } from "../mainApi";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../redux/authSlice";
import { useDispatch } from "react-redux";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleGenderChange = (gender) => {
    setFormData((prev) => ({
      ...prev,
      gender: gender,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    try {
      const data = await axios.post(`${userApi}/signup`, formData, {
        withCredentials: true,
      });
      console.log(data.data.data);
      if (data.data.success === true) {
        dispatch(setLogin(data?.data?.data));
        // toast.success("Successfully registered");
        alert("Successfully registered");
        navigate("/mainPage");
      } else {
        // toast.error(data.data.message);
        alert(data.data.message);
      }
    } catch (error) {
      console.log("error:", error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-white-300 via-white-300 to-white-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700"
            >
              User Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleOnchange}
              placeholder="Pavan Gopaldas"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleOnchange}
              placeholder="example@mail.com"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleOnchange}
              placeholder="********"
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Gender
            </label>
            <div className="flex gap-6">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === "male"}
                  onChange={() => handleGenderChange("male")}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-2 flex items-center justify-center ${
                    formData.gender === "male"
                      ? "border-purple-600 bg-purple-100"
                      : "border-gray-300"
                  }`}
                >
                  {formData.gender === "male" && (
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  )}
                </div>
                <span className="text-gray-700">Male</span>
              </label>

              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  checked={formData.gender === "female"}
                  onChange={() => handleGenderChange("female")}
                  className="sr-only"
                />
                <div
                  className={`w-6 h-6 rounded-full border-2 mr-2 flex items-center justify-center ${
                    formData.gender === "female"
                      ? "border-purple-600 bg-purple-100"
                      : "border-gray-300"
                  }`}
                >
                  {formData.gender === "female" && (
                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                  )}
                </div>
                <span className="text-gray-700">Female</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all duration-300 mt-2"
          >
            Sign Up
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-purple-600 hover:underline">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
