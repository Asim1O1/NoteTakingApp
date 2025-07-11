import { APP_BASE_URL } from "../constants/env.js";
import { INTERNAL_SERVER_ERROR } from "../constants/http.js";
import AppError from "./AppError.js";
import { signToken } from "./jwt.js";
import { logger } from "./logger.js";
import { sendEmail } from "./sendEmail.js";

export const sendVerificationEmail = async (user) => {
  try {
    const verificationToken = signToken(
      { userId: user.id },
      { expiresIn: "24h" }
    );

    const verificationLink = `${APP_BASE_URL}/api/auth/verify-email?token=${verificationToken}`;
    logger.info(
      `Sending verification email to userId=${user.id}, email=${user.email}, link=${verificationLink}`
    );
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px;">
          <h2>Welcome to Note Taking App!</h2>
          <p>Click below to verify your email:</p>
          <a href="${verificationLink}"
             style="background: #2563eb; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">
            Verify Email
          </a>
          <p style="color: #6b7280; margin-top: 20px;">
            Link expires in 24 hours. If you didn't request this, please ignore.
          </p>
        </div>
      `,
    });

    return { token: verificationToken, expiry: expiryDate };
  } catch (error) {
    logger.error(
      `Failed to send verification email for userId=${user?.id}, email=${
        user?.email
      }, error=${
        error instanceof Error ? error.message : String(error)
      }, stack=${error instanceof Error ? error.stack : "N/A"}`
    );
    throw new AppError(
      INTERNAL_SERVER_ERROR,
      "Failed to send verification email"
    );
  }
};
