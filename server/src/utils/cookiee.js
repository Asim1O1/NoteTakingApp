import { REFRESH_PATH } from "../constants/path.js";

// Environment-based secure flag
const secure = process.env.NODE_ENV === "production";

const defaults = {
  sameSite: "strict",
  httpOnly: true,
  secure,
  path: "/",
};

// Access token specific options (shorter lifespan)
const getAccessTokenCookieOptions = () => ({
  ...defaults,
  maxAge: 15 * 60 * 1000, // 15 minutes
});

// Refresh token specific options (longer lifespan, httpOnly)
const getRefreshTokenCookieOptions = () => ({
  ...defaults,
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  path: REFRESH_PATH, // Only sent to refresh endpoint
});

export const setAuthCookies = ({ res, accessToken, refreshToken }) =>
  res
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res) =>
  res
    .clearCookie("accessToken", {
      ...defaults,
      path: "/",
    })
    .clearCookie("refreshToken", {
      ...defaults,
      path: REFRESH_PATH,
    });
