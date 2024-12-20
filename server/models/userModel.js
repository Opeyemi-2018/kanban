import mongoose from "mongoose";

const userChema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    isTeamMember: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userChema);
