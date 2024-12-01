import {
  createTask,
  getTask,
  getTaskInfo,
  updateStatus,
  deleteTask,
} from "../controllers/taskController.js";
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createTask);
router.get("/tasks", verifyToken, getTask);
router.get("/tasks/:taskid", verifyToken, getTaskInfo);
router.patch("/tasks/update-status/:taskid", verifyToken, updateStatus);
router.delete("/delete-tasks/:taskId", verifyToken, deleteTask);

export default router;
