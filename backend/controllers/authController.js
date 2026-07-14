import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { sendEmail } from "../services/emailService.js";
import { generateOTP } from "../utils/generateOTP.js";

// ================== SIGNUP ==================

export const signup = async (req, res) => {
  console.log("✅ Signup Started");

  try {
    const { name, email, password } = req.body;

    console.log("📧 Email:", email);

    const userExists = await User.findOne({ email });

if (userExists) {

  // User already verified
  if (userExists.isVerified) {

    return res.status(400).json({
      success: false,
      message: "User already exists",
    });

  }

  // User exists but not verified
  const otp = generateOTP();

  const hashedOTP = await bcrypt.hash(otp, 10);

  userExists.otp = hashedOTP;
  userExists.otpExpires = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await userExists.save();

  await sendEmail(
  email,
  "Verify your ResumeIQ account",
  `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">

<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;">

<tr>
<td
style="background:#2563eb;padding:30px;text-align:center;color:white;">

<h1 style="margin:0;">
ResumeIQ 🚀
</h1>

<p style="margin-top:10px;">
AI Powered Resume Analyzer
</p>

</td>
</tr>

<tr>
<td style="padding:40px;">

<h2>Hello 👋</h2>

<p>
Thank you for creating your ResumeIQ account.
</p>

<p>
Please verify your email using the One-Time Password below.
</p>

<div
style="
margin:35px auto;
width:220px;
background:#eff6ff;
border:2px dashed #2563eb;
border-radius:10px;
padding:20px;
text-align:center;
">

<h1
style="
margin:0;
font-size:40px;
letter-spacing:8px;
color:#2563eb;
">
${otp}
</h1>

</div>

<p>
This verification code is valid for
<strong>10 minutes</strong>.
</p>

<p>
If you did not request this account,
you can safely ignore this email.
</p>

<hr
style="
margin:35px 0;
border:none;
border-top:1px solid #e5e7eb;
">

<p style="color:#64748b;">
Regards,
</p>

<h3 style="margin:0;color:#2563eb;">
ResumeIQ Team
</h3>

</td>
</tr>

<tr>

<td
style="
background:#f8fafc;
padding:20px;
text-align:center;
font-size:13px;
color:#64748b;
">

ResumeIQ • AI Resume Analysis Platform

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`
);

  return res.status(200).json({
    success: true,
    message: "A new OTP has been sent to your email.",
    email,
  });

}

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = generateOTP();

    console.log("🔢 Generated OTP:", otp);

    const hashedOTP = await bcrypt.hash(otp, 10);

    const otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: false,
      otp: hashedOTP,
      otpExpires,
    });

    console.log("💾 User Created");

    await sendEmail(
      email,
      "ResumeIQ Email Verification",
      `
      <div style="font-family:Arial;padding:20px">

      <h2>Welcome to ResumeIQ 🚀</h2>

      <p>Your verification code is</p>

      <h1 style="letter-spacing:6px">
      ${otp}
      </h1>

      <p>This OTP expires in 10 minutes.</p>

      </div>
      `
    );

    console.log("✅ Email Sent");

    res.status(201).json({
      success: true,
      message: "OTP sent successfully.",
      email,
    });

  } catch (error) {

    console.log("❌ Signup Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= VERIFY OTP =================

export const verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    if (user.isVerified) {

      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });

    }

    if (!user.otp) {

      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });

    }

    if (new Date() > user.otpExpires) {

      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });

    }

    const validOTP = await bcrypt.compare(
      otp,
      user.otp
    );

    if (!validOTP) {

      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });

    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Email verified successfully.",
    });

  } catch (error) {

    console.log("❌ Verify OTP Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= RESEND OTP =================

export const resendOTP = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    if (user.isVerified) {

      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });

    }

    const otp = generateOTP();

    const hashedOTP = await bcrypt.hash(otp, 10);

    user.otp = hashedOTP;

    user.otpExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    await sendEmail(
      email,
      "ResumeIQ - New OTP",
      `
      <h2>Your new OTP</h2>

      <h1>${otp}</h1>

      <p>Valid for 10 minutes.</p>
      `
    );

    res.status(200).json({
      success: true,
      message: "New OTP sent successfully.",
    });

  }

  catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const otp = generateOTP();

    user.resetOTP = await bcrypt.hash(otp, 10);
    user.resetOTPExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendEmail(
      email,
      "ResumeIQ Password Reset",
      `
      <h2>Password Reset Request</h2>

      <p>Your OTP is:</p>

      <h1>${otp}</h1>

      <p>This OTP expires in 10 minutes.</p>
      `
    );

    res.json({
      success: true,
      message: "Password reset OTP sent successfully.",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const verifyResetOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.resetOTP || !user.resetOTPExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP not found",
      });
    }

    if (new Date() > user.resetOTPExpires) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    const valid = await bcrypt.compare(
      otp,
      user.resetOTP
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    res.json({
      success: true,
      message: "OTP Verified",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const resetPassword = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetOTP = null;
    user.resetOTPExpires = null;

    await user.save();

    res.json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= LOGIN =================

export const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    if (!user.isVerified) {

      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in.",
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });

    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });

  } catch (error) {

    console.log("❌ Login Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ================= PROFILE =================

export const getProfile = async (req, res) => {

  try {

    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};