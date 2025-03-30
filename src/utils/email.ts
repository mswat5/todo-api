import sgMail from "@sendgrid/mail";
import { config } from "dotenv";

config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
  name: string
) => {
  const resetLink = `${process.env.FRONTEND_URL}//reset-password?token=${resetToken}`;
  const msg = {
    to: email,
    from: process.env.FROM_EMAIL!,
    subject: "Password Reset Request",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
        <p>To reset your password, click the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" 
             style="background-color: #4CAF50; color: white; padding: 14px 20px; 
                    text-decoration: none; border-radius: 4px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p>This link will expire in 1 hour.</p>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${resetLink}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This is an automated email. Please do not reply to this message.
        </p>
      </div>
    `,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.error("Email sending error:", error);
    throw new Error("Failed to send password reset email");
  }
};
