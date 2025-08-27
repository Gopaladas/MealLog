import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainPage from "./components/MainPage";
import Logout from "./pages/Logout";
import UserProfile from "./pages/UserProfile";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </div>
  );
};

export default App;
