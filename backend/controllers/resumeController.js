import Resume from "../models/Resume.js";
import s3 from "../config/s3.js";

import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { extractResumeText } from "../services/resumeParser.js";
import { analyzeResume } from "../services/geminiService.js";

// ======================================================
// Upload Resume
// ======================================================

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // Extract resume text
    const resumeText = await extractResumeText(req.file.buffer);

    // AI Analysis
    const aiResult = await analyzeResume(resumeText);

    const resume = await Resume.create({
      user: req.user.id,

      title:
        req.body.title ||
        req.file.originalname.replace(/\.[^/.]+$/, ""),

      fileName,
      fileUrl,

      score: aiResult.score || 0,
      summary: aiResult.summary || "",

      strengths: aiResult.strengths || [],
      weaknesses: aiResult.weaknesses || [],
      missingSkills: aiResult.missingSkills || [],
      suggestions: aiResult.suggestions || [],

      analysisStatus: "Completed",
    });

    res.status(201).json({
      success: true,
      message: "Resume uploaded successfully.",
      resume,
    });

  } catch (error) {

    console.error("Upload Resume Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload resume.",
    });

  }
};

// ======================================================
// Get My Resumes
// ======================================================

export const getMyResumes = async (req, res) => {
  try {

    const resumes = await Resume.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      resumes,
    });

  } catch (error) {

    console.error("Get Resumes Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resumes.",
    });

  }
};

// ======================================================
// Get Resume Analysis
// ======================================================

export const getResumeAnalysis = async (req, res) => {
  try {

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {

    console.error("Resume Analysis Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume analysis.",
    });

  }
};
// ======================================================
// Dashboard Statistics
// ======================================================

export const getDashboardStats = async (req, res) => {
  try {
    const resumes = await Resume.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    const totalResumes = resumes.length;

    const averageScore =
      totalResumes > 0
        ? Math.round(
            resumes.reduce(
              (sum, resume) => sum + (resume.score || 0),
              0
            ) / totalResumes
          )
        : 0;

    const bestScore =
      totalResumes > 0
        ? Math.max(
            ...resumes.map(
              (resume) => resume.score || 0
            )
          )
        : 0;

    const pendingAnalysis = resumes.filter(
      (resume) =>
        resume.analysisStatus !== "Completed"
    ).length;

    const totalSuggestions = resumes.reduce(
      (count, resume) =>
        count + (resume.suggestions?.length || 0),
      0
    );

    const latestResume =
      totalResumes > 0 ? resumes[0] : null;

    res.status(200).json({
      success: true,
      totalResumes,
      averageScore,
      bestScore,
      pendingAnalysis,
      totalSuggestions,
      latestResume,
      resumes,
    });

  } catch (error) {

    console.error("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load dashboard statistics.",
    });

  }
};

// ======================================================
// Delete Resume
// ======================================================

export const deleteResume = async (req, res) => {
  try {

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: resume.fileName,
      })
    );

    await Resume.findByIdAndDelete(
      resume._id
    );

    res.status(200).json({
      success: true,
      message: "Resume deleted successfully.",
    });

  } catch (error) {

    console.error("Delete Resume Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete resume.",
    });

  }
};
// ======================================================
// Secure Download Resume
// ======================================================

export const getSecureDownloadUrl = async (req, res) => {
  try {

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: resume.fileName,
    });

    const signedUrl = await getSignedUrl(
      s3,
      command,
      {
        expiresIn: 300, // 5 Minutes
      }
    );

    res.status(200).json({
      success: true,
      url: signedUrl,
      expiresIn: 300,
    });

  } catch (error) {

    console.error(
      "Secure Download Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to generate secure download link.",
    });

  }
};