import { createTask } from "../controllers/taskController.js";
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createTask);

export default router;
