import express from "express";
import { signup, verifyOTP, login, getMe } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js"; // Import Middleware

const router = express.Router();

// Public Routes
router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);

// Protected Route (Requires valid JWT Token)
router.get("/me", protect, getMe);

export default router;