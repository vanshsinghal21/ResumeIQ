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
  let uploadedFileName = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const fileName = `${Date.now()}-${req.file.originalname}`;

    uploadedFileName = fileName;

    // ==================================================
    // Upload Resume To S3
    // ==================================================

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      })
    );

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    // ==================================================
    // Extract Resume Text
    // ==================================================

    const resumeText = await extractResumeText(
      req.file.buffer
    );

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({
        success: false,
        message:
          "Unable to extract enough readable text from this resume.",
      });
    }

    // ==================================================
    // AI Analysis
    // ==================================================

    const aiResult = await analyzeResume(
      resumeText
    );

    if (!aiResult) {
      throw new Error(
        "AI analysis returned no result."
      );
    }

    // ==================================================
    // Create Resume Record
    // ==================================================

    const resume = await Resume.create({
      user: req.user.id,

      title:
        req.body.title ||
        req.file.originalname.replace(
          /\.[^/.]+$/,
          ""
        ),

      fileName,
      fileUrl,

      // ==================================================
      // Overall AI Analysis
      // ==================================================

      score:
        typeof aiResult.score === "number"
          ? aiResult.score
          : 0,

      summary:
        aiResult.summary || "",

      // ==================================================
      // Resume Context
      // ==================================================

      detectedDomain:
        aiResult.detectedDomain || "",

      targetRoles:
        Array.isArray(aiResult.targetRoles)
          ? aiResult.targetRoles
          : [],

      // ==================================================
      // Score Breakdown
      // ==================================================

      scoreBreakdown:
        aiResult.scoreBreakdown || {
          technicalSkills: 0,
          experience: 0,
          projects: 0,
          education: 0,
          certifications: 0,
          achievements: 0,
          keywords: 0,
          atsCompatibility: 0,
        },

      // ==================================================
      // Detailed Feedback
      // ==================================================

      strengths:
        Array.isArray(aiResult.strengths)
          ? aiResult.strengths
          : [],

      weaknesses:
        Array.isArray(aiResult.weaknesses)
          ? aiResult.weaknesses
          : [],

      missingSkills:
        Array.isArray(aiResult.missingSkills)
          ? aiResult.missingSkills
          : [],

      suggestions:
        Array.isArray(aiResult.suggestions)
          ? aiResult.suggestions
          : [],

      analysisStatus: "Completed",

      analysisError: "",
    });

    // ==================================================
    // Success Response
    // ==================================================

    return res.status(201).json({
      success: true,
      message: "Resume uploaded and analyzed successfully.",
      resume,
    });

  } catch (error) {

    console.error(
      "Upload Resume Error:",
      error
    );

    // ==================================================
    // Cleanup S3 File If Analysis/Database Fails
    // ==================================================

    if (uploadedFileName) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket:
              process.env.AWS_BUCKET_NAME,
            Key: uploadedFileName,
          })
        );

        console.log(
          "S3 cleanup completed after upload failure."
        );

      } catch (cleanupError) {

        console.error(
          "S3 Cleanup Error:",
          cleanupError
        );
      }
    }

    // ==================================================
    // AI Analysis Error
    // ==================================================

    if (
      error.message?.includes(
        "AI resume analysis failed"
      )
    ) {
      return res.status(502).json({
        success: false,
        message:
          "Resume uploaded, but AI analysis failed. Please try again.",
      });
    }

    // ==================================================
    // PDF Extraction Error
    // ==================================================

    if (
      error.message?.includes(
        "Failed to parse PDF"
      ) ||
      error.message?.includes(
        "Unable to extract"
      )
    ) {
      return res.status(422).json({
        success: false,
        message:
          "Unable to read the uploaded PDF. Please upload a text-based PDF.",
      });
    }

    // ==================================================
    // Generic Error
    // ==================================================

    return res.status(500).json({
      success: false,
      message:
        "Failed to upload and analyze resume.",
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

    return res.status(200).json({
      success: true,
      resumes,
    });

  } catch (error) {

    console.error(
      "Get Resumes Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch resumes.",
    });
  }
};

// ======================================================
// Get Resume Analysis
// ======================================================

export const getResumeAnalysis = async (
  req,
  res
) => {
  try {

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          "Resume not found.",
      });
    }

    return res.status(200).json({
      success: true,
      resume,
    });

  } catch (error) {

    console.error(
      "Resume Analysis Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to fetch resume analysis.",
    });
  }
};

// ======================================================
// Dashboard Statistics
// ======================================================

export const getDashboardStats = async (
  req,
  res
) => {
  try {

    const resumes = await Resume.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    const totalResumes =
      resumes.length;

    const completedResumes =
      resumes.filter(
        (resume) =>
          resume.analysisStatus ===
          "Completed"
      );

    const completedCount =
      completedResumes.length;

    const averageScore =
      completedCount > 0
        ? Math.round(
            completedResumes.reduce(
              (sum, resume) =>
                sum +
                (resume.score || 0),
              0
            ) / completedCount
          )
        : 0;

    const bestScore =
      completedCount > 0
        ? Math.max(
            ...completedResumes.map(
              (resume) =>
                resume.score || 0
            )
          )
        : 0;

    const pendingAnalysis =
      resumes.filter(
        (resume) =>
          resume.analysisStatus ===
          "Pending"
      ).length;

    const failedAnalysis =
      resumes.filter(
        (resume) =>
          resume.analysisStatus ===
          "Failed"
      ).length;

    const totalSuggestions =
      completedResumes.reduce(
        (count, resume) =>
          count +
          (resume.suggestions
            ?.length || 0),
        0
      );

    const latestResume =
      totalResumes > 0
        ? resumes[0]
        : null;

    return res.status(200).json({
      success: true,

      totalResumes,

      completedAnalysis:
        completedCount,

      pendingAnalysis,

      failedAnalysis,

      averageScore,

      bestScore,

      totalSuggestions,

      latestResume,

      resumes,
    });

  } catch (error) {

    console.error(
      "Dashboard Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to load dashboard statistics.",
    });
  }
};

// ======================================================
// Delete Resume
// ======================================================

export const deleteResume = async (
  req,
  res
) => {
  try {

    const resume =
      await Resume.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          "Resume not found.",
      });
    }

    await s3.send(
      new DeleteObjectCommand({
        Bucket:
          process.env.AWS_BUCKET_NAME,
        Key: resume.fileName,
      })
    );

    await Resume.findByIdAndDelete(
      resume._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Resume deleted successfully.",
    });

  } catch (error) {

    console.error(
      "Delete Resume Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to delete resume.",
    });
  }
};

// ======================================================
// Secure Download Resume
// ======================================================

export const getSecureDownloadUrl = async (
  req,
  res
) => {
  try {

    const resume =
      await Resume.findOne({
        _id: req.params.id,
        user: req.user.id,
      });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message:
          "Resume not found.",
      });
    }

    const command =
      new GetObjectCommand({
        Bucket:
          process.env.AWS_BUCKET_NAME,
        Key: resume.fileName,
      });

    const signedUrl =
      await getSignedUrl(
        s3,
        command,
        {
          expiresIn: 300,
        }
      );

    return res.status(200).json({
      success: true,
      url: signedUrl,
      expiresIn: 300,
    });

  } catch (error) {

    console.error(
      "Secure Download Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to generate secure download link.",
    });
  }
};