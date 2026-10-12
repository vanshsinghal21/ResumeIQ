
import express from "express";

import {
  signup,
  login,
  verifyOTP,
  resendOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  googleLogin,
} from "../controllers/authController.js";

import {
  getMyProfile,
  uploadAvatar,
} from "../controllers/avatarController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import avatarUpload from "../config/avatarUpload.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);
router.post("/login", login);
router.post("/google", googleLogin);

// Authenticated profile endpoints.
router.get("/profile", authMiddleware, getMyProfile);
router.post(
  "/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  uploadAvatar
);

export default router;
