import express from "express";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import {
  getMe,
  login,
  register,
  verifyEmail,
} from "../controllers/auth.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";
const AuthRouter = express.Router();

AuthRouter.post("/register", registerValidator, register);

AuthRouter.post("/login",loginValidator ,login);

AuthRouter.get("/get-me",authUser ,getMe);

AuthRouter.get("/verify-email", verifyEmail);

export default AuthRouter;
