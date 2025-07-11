import nodemailer from "nodemailer";
import { APP_NAME, EMAIL_FROM, SMTP_CONFIG } from "../constants/env.js";
import { INTERNAL_SERVER_ERROR } from "../constants/http.js";
import AppError from "./AppError.js";
import { logger } from "./logger.js";

/**
 * Email transport configuration
 */
const transporter = nodemailer.createTransport({
  host: SMTP_CONFIG.host,
  port: SMTP_CONFIG.port,
  secure: SMTP_CONFIG.secure,
  auth: {
    user: SMTP_CONFIG.user,
    pass: SMTP_CONFIG.pass,
  },
});

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"${APP_NAME}" <${EMAIL_FROM}>`,
      to: Array.isArray(to) ? to.join(", ") : to,
      subject,
      text: text || stripHtml(html).result,
      html,
    });

    return {
      messageId: info.messageId,
      accepted: info.accepted,
    };
  } catch (error) {
    logger.error(
      `Email send failed to ${Array.isArray(to) ? to.join(", ") : to}: error=${
        error instanceof Error ? error.message : String(error)
      }, stack=${error instanceof Error ? error.stack : "N/A"}`
    );
    throw new AppError(INTERNAL_SERVER_ERROR, "Failed to send email");
  }
};

// Helper to strip HTML tags for text fallback
const stripHtml = (html) => {
  // Simple HTML-to-text conversion (use 'html-to-text' package for better results)
  return {
    result: html.replace(/<[^>]*>?/gm, ""),
  };
};
