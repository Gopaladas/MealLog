import React, { useState } from "react";
import axios from "axios";
import { userApi, mealApi, backendApi } from "../mainApi";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin, setLoading } from "../redux/authSlice";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    dispatch(setLoading(true));
    try {
      const data = await axios.post(`${userApi}/signin`, formData, {
        withCredentials: true,
      });

      console.log(data);
      if (data?.data?.success === true) {
        dispatch(setLogin(data?.data?.data));
        // toast.success("Logged in successfully!");
        navigate("/mainPage");
      } else {
        // toast.error(data.data.message);
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-grey-300 via-grey-400 to-grey-300">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login to Your Account
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-all duration-300"
          >
            Sign In
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <a href={"/register"} className="text-purple-600 hover:underline">
            Register here
          </a>
        </p>
        <p className="text-sm text-center text-gray-600 mt-4">
          <a href={"/admin-login"} className="text-purple-600 hover:underline">
            Admin Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
