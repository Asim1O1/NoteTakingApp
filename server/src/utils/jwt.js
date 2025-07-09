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

/**
 * Signs a JWT token
 * @param {object} payload - Data to include in token
 * @param {object} options - Options object
 * @param {'access'|'refresh'} [options.type='access'] - Token type
 * @param {object} [options.jwtOptions] - Additional jwt options
 * @returns {string} Signed token
 */
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

/**
 * Verifies a JWT token
 * @param {string} token - Token to verify
 * @param {string} type - Expected token type ('access' or 'refresh')
 * @returns {{
 *   payload?: object,
 *   error?: string,
 *   expired?: boolean
 * }} Verification result
 */
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

/**
 * Decodes a token without verification
 * @param {string} token
 * @returns {object|null} Decoded payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
