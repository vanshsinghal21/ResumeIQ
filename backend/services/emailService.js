import transporter from "../config/mailer.js";

export const sendEmail = async (to, subject, html) => {
  try {

    const info = await transporter.sendMail({
      from: `"ResumeIQ Team" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", info.messageId);
    console.log("Accepted:", info.accepted);
    console.log("Rejected:", info.rejected);

  } catch (error) {

    console.log("❌ Email Error:", error);

    throw error;

  }
};