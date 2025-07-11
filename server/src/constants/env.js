import dotenv from "dotenv";
dotenv.config();

const getEnv = (key, defaultValue) => {
  const value = process.env[key] ?? defaultValue;

  if (value === undefined) {
    throw new Error(`Environment variable ${key} is not defined`);
  }
  return value;
};

export const PORT = getEnv("PORT");
export const APP_BASE_URL = getEnv("APP_BASE_URL", "http://localhost:3301");
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const JWT_SECRET = getEnv("JWT_SECRET");
export const JWT_REFRESH_SECRET = getEnv("JWT_REFRESH_SECRET");
export const SMTP_CONFIG = {
  host: getEnv("SMTP_HOST"),
  port: parseInt(getEnv("SMTP_PORT", "465")),
  secure: getEnv("SMTP_SECURE", "false") === "true",
  user: getEnv("SMTP_USER"),
  pass: getEnv("SMTP_PASS"),
};

export const EMAIL_FROM = getEnv("EMAIL_FROM", "no-reply@example.com");
export const APP_NAME = getEnv("APP_NAME", "Note Taking App");
