import { Task } from "../models/taskModel.js";
import { errorHandler } from "../utils/error.js";
import nodemailer from "nodemailer";

export const createTask = async (req, res, next) => {
  const {
    title,
    description,
    subtasks,
    category,
    assignedTo,
    dueDate,
  } = req.body;
  if (
    !title ||
    !description ||
    !subtasks ||
    !category ||
    !assignedTo ||
    !dueDate
  ) {
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
      dueDate,
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    const mailOption = {
      from: process.env.EMAIL_USER,
      to: assignedTo,
      subject: "New task assign",
      text: `You have been assigned a new task: "${title}".\n\nDescription: ${description}\n\nTo start working on this task, please sign up on our homepage:\n${process.env.FRONTEND_URL}/signup\n\nOnce you sign up, you will be able to access and manage your tasks.\n\nBest regards,\nThe Task Management Team`,
    };

    await transporter.sendMail(mailOption);
    res.status(201).json({ message: "task successfully created", newTask });
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const task = await Task.find().populate("assignedTo", "name email").exec();
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTaskInfo = async (req, res, next) => {
  const { id } = req.param;
  try {
    const taskInfo = await Task.findById(id);
    if (!taskInfo) {
      return next(errorHandler("info not found", 404));
    }
    res.status(200).json(taskInfo);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { taskid } = req.params;
    const { status, subtasks } = req.body;
    const task = await Task.findById(taskid);
    if (!task) {
      return next(errorHandler("task not found", 404));
    }
    task.status = status;
    task.subtasks = subtasks;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return next(errorHandler("Task notfound task", 404));
    }

    if (req.user.isAdmin) {
      await Task.findByIdAndDelete(taskId);
      return res.status(200).json({ message: "task successfully deleted" });
    } else {
      return next(errorHandler("you are not permitted", 403));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};
