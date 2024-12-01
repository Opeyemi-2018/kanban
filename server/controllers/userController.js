import { User } from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

export const getUser = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      return next(errorHandler("no user", 404));
    }
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(errorHandler(error.message || "Server Error", 500));
  }
};

export const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(errorHandler("user not found", 404));
    }

    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "user successfully deleted" });
  } catch (error) {
    next(errorHandler(error.message || "server error", 500));
  }
};
