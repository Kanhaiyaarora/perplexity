import express from "express";
import { registerValidator } from "../validators/auth.validator.js";
import { register } from "../controllers/auth.controller.js";
const AuthRouter = express.Router();

AuthRouter.post("/register", registerValidator, register);

export default AuthRouter;
