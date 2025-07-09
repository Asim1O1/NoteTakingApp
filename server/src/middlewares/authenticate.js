import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants/env.js";
import { UNAUTHORIZED } from "../constants/http.js";
import prisma from "../utils/prisma.js";

/**
 * Authentication middleware that verifies JWT and attaches basic user info
 */

const authenticate = async (req, res, next) => {
  try {
    // 1. Get token from cookies OR header (flexibility)
    let token = req.cookies?.accessToken;

    // Fallback to Authorization header if no cookie
    if (!token) {
      token = req.headers.authorization?.split(" ")[1];
    }

    if (!token) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
        code: "MISSING_TOKEN",
      });
    }

    // 2. Verify token using ACCESS secret (not generic JWT_SECRET)
    const decoded = jwt.verify(token, JWT_SECRET);

    // 3. Get basic user info
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
      },
    });

    if (!user) {
      return res.status(UNAUTHORIZED).json({
        success: false,
        message: "User account not found",
        code: "USER_NOT_FOUND",
      });
    }

    // 4. Attach user info to request
    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
    };

    next();
  } catch (error) {
    logger.error("Authentication error", {
      message: error.message,
    });
    next(error);
  }
};

export default authenticate;
