import {
  createTask,
  getTask,
  getTaskInfo,
} from "../controllers/taskController.js";
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createTask);
router.get("/tasks", verifyToken, getTask);
router.get("/tasks/:taskid", verifyToken, getTaskInfo);

export default router;
