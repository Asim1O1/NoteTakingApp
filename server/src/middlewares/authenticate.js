import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env.js";
import { FORBIDDEN, UNAUTHORIZED } from "../constants/http.js";
import { logger } from "../utils/logger.js";
import prisma from "../utils/prisma.js";

export const authenticate = (options = {}) => {
  return async (req, res, next) => {
    const startTime = Date.now();
    let currentStep = "init";

    try {
      currentStep = "token_extraction";
      logger.debug(
        `[Auth] Starting authentication for ${req.method} ${req.originalUrl}`
      );

      // 1. Token extraction with timeout check
      const token =
        req.cookies?.accessToken ||
        req.headers["x-access-token"] ||
        req.headers.authorization?.replace("Bearer ", "");

      if (!token) {
        logger.warn("[Auth] No token provided");
        return res.status(UNAUTHORIZED).json({
          success: false,
          message: "Authentication required",
          code: "MISSING_TOKEN",
        });
      }

      // 2. JWT verification with timeout
      currentStep = "jwt_verification";
      let decoded;
      try {
        decoded = await new Promise((resolve, reject) => {
          jwt.verify(token, JWT_SECRET, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          });
        });
      } catch (jwtError) {
        logger.error("[Auth] JWT verification failed", {
          error: jwtError.message,
        });
        throw jwtError;
      }

      // 3. Database query with timeout protection
      currentStep = "db_query";
      const user = await Promise.race([
        prisma.user.findUnique({
          where: { id: decoded.userId },
          select: {
            id: true,
            username: true,
            email: true,
            isVerified: true,
            role: true,
          },
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Database timeout")), 5000)
        ),
      ]);

      currentStep = "user_validation";
      if (!user) {
        logger.warn("[Auth] User not found", { userId: decoded.userId });
        return res.status(UNAUTHORIZED).json({
          success: false,
          message: "User account not found",
          code: "USER_NOT_FOUND",
        });
      }

      // 4. Attach user and check roles
      currentStep = "role_verification";
      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
      };

      if (options.requiredRole && user.role !== options.requiredRole) {
        logger.warn("[Auth] Role check failed", {
          userId: user.id,
          required: options.requiredRole,
          actual: user.role,
        });
        return res.status(FORBIDDEN).json({
          success: false,
          message: `Insufficient permissions. Required role: ${options.requiredRole}`,
          code: "INSUFFICIENT_PERMISSIONS",
        });
      }

      logger.debug(`[Auth] Authentication successful`, {
        userId: user.id,
        duration: Date.now() - startTime,
      });
      next();
    } catch (error) {
      logger.error(`[Auth] Failed at step: ${currentStep}`, {
        error: error.message,
        stack: error.stack,
        endpoint: req.originalUrl,
        method: req.method,
        duration: Date.now() - startTime,
      });

      if (error.message === "Database timeout") {
        return res.status(504).json({
          success: false,
          message: "Authentication service timeout",
          code: "AUTH_TIMEOUT",
        });
      }

      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(UNAUTHORIZED).json({
          success: false,
          message: "Invalid or expired token",
          code: "INVALID_TOKEN",
        });
      }

      // Pass to error handler middleware
      next(error);
    }
  };
};

export const requireRole = (role) => {
  return authenticate({ requiredRole: role });
};
