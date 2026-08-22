import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    // ==================================================
    // AI Analysis
    // ==================================================

    score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    summary: {
      type: String,
      default: "",
    },

    // ==================================================
    // Resume Context
    // ==================================================

    detectedDomain: {
      type: String,
      default: "",
    },

    targetRoles: {
      type: [String],
      default: [],
    },

    // ==================================================
    // ATS Score Breakdown
    // ==================================================

    scoreBreakdown: {
      technicalSkills: {
        type: Number,
        min: 0,
        max: 20,
        default: 0,
      },

      experience: {
        type: Number,
        min: 0,
        max: 20,
        default: 0,
      },

      projects: {
        type: Number,
        min: 0,
        max: 15,
        default: 0,
      },

      education: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },

      certifications: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },

      achievements: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },

      keywords: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
      },

      atsCompatibility: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
    },

    // ==================================================
    // Detailed AI Feedback
    // ==================================================

    strengths: {
      type: [String],
      default: [],
    },

    weaknesses: {
      type: [String],
      default: [],
    },

    missingSkills: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    // ==================================================
    // Analysis Status
    // ==================================================

    analysisStatus: {
      type: String,
      enum: ["Pending", "Completed", "Failed"],
      default: "Pending",
    },

    analysisError: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Resume", resumeSchema);