import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true, unique: true },
    subtasks: [{ type: String }],
    category: { type: String, required: true },
    status: { type: String, enum: ["todo", "doing", "done"] },
    assignedTo: { type: String, required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
