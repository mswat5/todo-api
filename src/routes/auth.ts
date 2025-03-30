import { Router } from "express";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  verifyToken,
} from "../controllers/authController";
import { loginLimiter, passwordResetLimiter } from "../middleware/rateLimiter";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController";

const router = Router();
router.post("/login", loginLimiter, loginUser);
router.post("/register", loginLimiter, registerUser);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);
router.post("/logout", verifyToken, logoutUser);
router.get("/profile", verifyToken, getUserProfile);
router.patch("/profile", verifyToken, updateUserProfile);
export default router;
