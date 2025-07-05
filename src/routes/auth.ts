import { Router } from "express";
import { loginLimiter } from "../middleware/rateLimiter";
import { verifyToken } from "../middleware/auth";
import {
  loginUser,
  registerUser,
  logoutUser,
} from "../controllers/authController";

const router = Router();

router.post("/login", loginLimiter, loginUser);
router.post("/register", registerUser);
router.post("/logout", verifyToken, logoutUser);

export default router;
