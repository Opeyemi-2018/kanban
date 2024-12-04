import { User } from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
export const getUser = async (req, res, next) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "tasks",
          localField: "_id",
          foreignField: "assignedTo",
          as: "tasks",
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          isAdmin: 1,
          image: 1,
          taskCountCompleted: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $eq: ["$$task.status", "done"] },
              },
            },
          },
          taskCountUndone: {
            $size: {
              $filter: {
                input: "$tasks",
                as: "task",
                cond: { $in: ["$$task.status", ["todo", "doing"]] },
              },
            },
          },
        },
      },
    ]);

    if (!users || users.length === 0) {
      return next(errorHandler("No users found", 404));
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
      return next(errorHandler("User not found", 404));
    }

    await User.findByIdAndDelete(userId);
    return res.status(200).json({ message: "User successfully deleted" });
  } catch (error) {
    next(errorHandler(error.message || "Server Error", 500));
  }
};
