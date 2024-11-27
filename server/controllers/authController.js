import { User } from "../models/userModel.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const signUp = async (req, res, next) => {
  const { name, email, password, isAdmin, isTeamMember } = req.body;
  if (!name || !email || !password) {
    return next(errorHandler("all fields are required", 400));
  }
  const existUser = await User.findOne({ email });
  if (existUser) {
    return next(errorHandler("user with this email already exist", 409));
  }
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({
    name,
    email,
    isAdmin,
    isTeamMember,
    password: hashPassword,
  });
  try {
    await newUser.save();
    res.status(201).json({ message: "user created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  const { password, email } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler("user not found", 404));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler("wrong credential", 404));
    }
    const token = jwt.sign(
      {
        id: validUser._id,
        isAdmin: validUser.isAdmin,
        isTeamMember: validUser.isTeamMember,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2d" }
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
