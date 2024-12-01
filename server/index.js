import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoute from "./route/authRoute.js";
import taskRoute from "./route/createTaskRoute.js";
import userRoute from "./route/userRoute.js";
dotenv.config();

const app = express();
app.use(express.json({ limit: "10mb" })); // Adjust the size as per your requirement
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(5000, () => {
    console.log("server is connected to DB");
  });
});

app.use("/api/auth", authRoute);
app.use("/api/task", taskRoute);
app.use("/api/user", userRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
