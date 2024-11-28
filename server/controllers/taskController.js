import { Task } from "../models/taskModel.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";

export const createTask = async (req, res, next) => {
  const { title, description, subtasks, category, assignedTo } = req.body;
  if (!title || !description || !subtasks || !category || !assignedTo) {
    return next(errorHandler("all fields are required", 400));
  }
  if (!req.user.isAdmin) {
    return next(errorHandler("you are not allowed", 403));
  }
  try {
    const newTask = await Task.create({
      title,
      description,
      subtasks,
      category,
      assignedTo,
    });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });
    const mailOption = {
      from: process.env.EMAIL_USER,
      to: assignedTo,
      subject: "New task assign",
      text: `You have been assigned a new task: "${title}".\n\nDescription: ${description}\n\nClick the link below to view the task:\n${process.env.FRONTEND_URL}/tasks/${task._id}`,
    };
    await transporter.sendMail(mailOption);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};
