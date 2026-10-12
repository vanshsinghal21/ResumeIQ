
import User from "../models/User.js";
import s3 from "../config/s3.js";
import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";

const MAX_AVATAR_SIZE = 2 * 1024 * 1024;

const getUserId = (req) => req.user?._id || req.user?.id;

const getImageExtension = (buffer, mimetype) => {
  if (
    mimetype === "image/jpeg" &&
    buffer.length >= 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  ) {
    return "jpg";
  }

  if (
    mimetype === "image/png" &&
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
    )
  ) {
    return "png";
  }

  if (
    mimetype === "image/webp" &&
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "webp";
  }

  return null;
};

const createAvatarUrl = async (avatarKey) => {
  if (!avatarKey) return "";

  return getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: avatarKey,
    }),
    { expiresIn: 3600 }
  );
};

export const getMyProfile = async (req, res) => {
  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const avatar = user.avatarKey
      ? await createAvatarUrl(user.avatarKey)
      : user.avatar || "";

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar,
        createdAt: user.createdAt,
        isVerified: user.isVerified,
        hasPassword: Boolean(user.password),
      },
    });
  } catch (error) {
    console.error("Get profile error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to load your profile.",
    });
  }
};

export const uploadAvatar = async (req, res) => {
  let uploadedKey = "";

  try {
    const userId = getUserId(req);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image to upload.",
      });
    }

    if (req.file.size > MAX_AVATAR_SIZE) {
      return res.status(400).json({
        success: false,
        message: "The image must be 2 MB or smaller.",
      });
    }

    const extension = getImageExtension(
      req.file.buffer,
      req.file.mimetype
    );

    if (!extension) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid image content. Upload a valid JPG, PNG, or WebP image.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!process.env.AWS_BUCKET_NAME) {
      return res.status(500).json({
        success: false,
        message: "Avatar storage is not configured.",
      });
    }

    const previousKey = user.avatarKey || "";
    uploadedKey = `avatars/${user._id}/${randomUUID()}.${extension}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: uploadedKey,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        CacheControl: "private, max-age=3600",
      })
    );

    user.avatarKey = uploadedKey;
    user.avatar = "";
    await user.save();

    // Delete the previous uploaded avatar only after the database update.
    if (previousKey && previousKey !== uploadedKey) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: previousKey,
          })
        );
      } catch (cleanupError) {
        // The new avatar is already saved; cleanup can be retried later.
        console.error(
          "Previous avatar cleanup failed:",
          cleanupError.message
        );
      }
    }

    const avatar = await createAvatarUrl(uploadedKey);

    return res.status(200).json({
      success: true,
      message: "Profile photo updated successfully.",
      user: {
        _id: user._id,
        id: user._id,
        name: user.name,
        email: user.email,
        avatar,
        createdAt: user.createdAt,
        isVerified: user.isVerified,
        hasPassword: Boolean(user.password),
      },
    });
  } catch (error) {
    // If the database update failed after the S3 upload, remove the orphan.
    if (uploadedKey) {
      try {
        await s3.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: uploadedKey,
          })
        );
      } catch (cleanupError) {
        console.error(
          "Failed to clean up incomplete avatar upload:",
          cleanupError.message
        );
      }
    }

    console.error("Avatar upload error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to update your profile photo. Please try again.",
    });
  }
};
