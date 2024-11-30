import mongoose from "mongoose";

const SubtaskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  completed: { type: Boolean, default: false }, // Default to false
});

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    subtasks: [SubtaskSchema],
    category: { type: String, required: true },
    status: { type: String, enum: ["todo", "doing", "done"], default: "todo" },
    assignedTo: { type: String, required: true },
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
