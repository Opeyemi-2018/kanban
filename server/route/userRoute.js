import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getUser, deleteUser } from "../controllers/userController.js";

const router = express.Router();

router.get("/get-users", verifyToken, getUser);
router.delete("/delete-user/:userId", verifyToken, deleteUser);

export default router;
