import express from "express";
import {
  signOut,
  signUp,
  singin,
  updateBMR,
  userData,
} from "../controllers/userControllers.js";
import userAuth from "../middleware/userAuth.js";

const userRoute = express.Router();

userRoute.post("/signup", signUp);
userRoute.post("/signin", singin);
userRoute.put("/calculatebmr", userAuth, updateBMR);
userRoute.post("/logout", userAuth, signOut);
userRoute.get("/getuserdata", userAuth, userData);
export default userRoute;
