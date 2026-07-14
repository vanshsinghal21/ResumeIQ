import express from "express";

import {
  signup,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  getProfile,
} from "../controllers/authController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/verify-otp", verifyOTP);

router.post(
  "/resend-otp",
  resendOTP
);
router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/verify-reset-otp",
  verifyResetOTP
);

router.post(
  "/reset-password",
  resetPassword
);

router.post("/login", login);

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

export default router;