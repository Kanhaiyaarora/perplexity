import express from "express";
import AuthRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", AuthRouter);

export default app;
