import jwt from "jsonwebtoken";
import { ZodError } from "zod";
import {
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
  UNAUTHORIZED,
} from "../constants/http.js";
import { REFRESH_PATH } from "../constants/path.js";
import AppError from "../utils/AppError.js";
import { clearAuthCookies } from "../utils/cookiee.js";
import { logger } from "../utils/logger.js";

const handleZodError = (res, error) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));

  logger.warn("Zod validation failed", { errors });

  return res.status(BAD_REQUEST).json({
    success: false,
    message: "Validation failed",
    errors,
    code: "VALIDATION_ERROR",
  });
};

const handleAppError = (res, error) => {
  logger.warn("Handled AppError", {
    message: error.message,
    code: error.errorCode,
    statusCode: error.statusCode,
    details: error.details || null,
  });

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    code: error.errorCode,
    ...(error.details && { details: error.details }),
  });
};

const handleJwtError = (res) => {
  logger.warn("JWT Error: Invalid token");

  return res.status(UNAUTHORIZED).json({
    success: false,
    message: "Invalid token",
    code: "INVALID_TOKEN",
  });
};

const errorHandler = (error, req, res, next) => {
  const context = {
    method: req.method,
    path: req.path,
    ...(process.env.NODE_ENV === "development" && {
      body: req.body,
      params: req.params,
      stack: error.stack,
    }),
  };

  // Clear auth cookies if refresh path fails
  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
    logger.info("Cleared auth cookies due to refresh path error", context);
  }

  if (error instanceof ZodError) {
    return handleZodError(res, error);
  }

  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return handleJwtError(res);
  }

  logger.error("Unhandled internal server error", {
    message: error.message,
    ...context,
  });

  return res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal server error",
    code: "INTERNAL_ERROR",
    ...(process.env.NODE_ENV === "development" && {
      error: error.message,
      stack: error.stack,
    }),
  });
};

export default errorHandler;
