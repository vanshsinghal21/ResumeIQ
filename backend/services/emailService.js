import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
  try {
    const { data, error } = await resend.emails.send({
      from: `ResumeIQ Team <${process.env.EMAIL_FROM}>`,
      to: [to],
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend API Error:", error);
      throw new Error(error.message || "Failed to send email");
    }

    console.log("✅ Email Sent Successfully");
    console.log("Message ID:", data?.id);
    console.log("To:", to);

    return data;
  } catch (error) {
    console.error("❌ Email Error:", error);
    throw error;
  }
};