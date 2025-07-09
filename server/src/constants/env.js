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
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:5173");
