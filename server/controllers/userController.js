import { User } from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";

export const getUser = async (req, res, next) => {
  try {
    const users = await User.find({});
    if (!users) {
      return next(errorHandler("no user", 404));
    }
  } catch (error) {}
};
