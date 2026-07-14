import express from "express";

import {
  uploadResume,
  getMyResumes,
  getResumeAnalysis,
  getDashboardStats,
  deleteResume,
  getSecureDownloadUrl,
} from "../controllers/resumeController.js";

import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router();

// Upload Resume
router.post(
  "/upload",
  authMiddleware,
  upload.single("resume"),
  uploadResume
);

// Get All User Resumes
router.get(
  "/my-resumes",
  authMiddleware,
  getMyResumes
);

// Dashboard Statistics
router.get(
  "/dashboard",
  authMiddleware,
  getDashboardStats
);

// Secure Download
router.get(
  "/download/:id",
  authMiddleware,
  getSecureDownloadUrl
);

// AI Analysis
router.get(
  "/analysis/:id",
  authMiddleware,
  getResumeAnalysis
);

// Delete Resume
router.delete(
  "/:id",
  authMiddleware,
  deleteResume
);

export default router;