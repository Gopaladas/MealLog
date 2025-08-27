import React from "react";
import arrow from "../assets/arrow_icon.svg";
import { useSelector, useDispatch } from "react-redux";
import { setLoading, setLogin, setLogout } from "../redux/authSlice";
// import { authApi } from "../mainApi";
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userApi } from "../mainApi";
const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
      const data = await axios.post(
        `${userApi}/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log(data);

      if (data?.data?.success === true) {
        dispatch(setLogout());
        // toast.success("loggedOut successfully");
        navigate("/");
      } else {
        // toast.error(data?.data?.message);
      }
    } catch (error) {
      //   toast.error("Server error");
      navigate("/");
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
      >
        <img src={arrow} alt="" />
        LogOut
      </button>
    </div>
  );
};

export default Logout;
