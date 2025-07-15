import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, JWT_SECRET } from "../constants/env.js";

// Token configuration
const TOKEN_CONFIG = {
  access: {
    expiresIn: "15m",
    secret: JWT_SECRET,
  },
  refresh: {
    expiresIn: "30d",
    secret: JWT_REFRESH_SECRET,
  },
};

// Default signing options
const DEFAULT_SIGN_OPTIONS = {
  issuer: "NoteTakingApp",
  audience: "users",
};

export const signToken = (payload, options = {}) => {
  const { type = "access", jwtOptions = {} } = options;
  const config = TOKEN_CONFIG[type];

  if (!config) {
    throw new Error(`Invalid token type: ${type}`);
  }

  const { secret, expiresIn } = config;

  return jwt.sign(payload, secret, {
    ...DEFAULT_SIGN_OPTIONS,
    expiresIn,
    ...jwtOptions,
  });
};

export const verifyToken = (token, type = "access") => {
  try {
    const { secret } = TOKEN_CONFIG[type];

    const payload = jwt.verify(token, secret, DEFAULT_SIGN_OPTIONS);
    return { payload };
  } catch (error) {
    return {
      error: error.message,
      expired: error instanceof jwt.TokenExpiredError,
    };
  }
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
