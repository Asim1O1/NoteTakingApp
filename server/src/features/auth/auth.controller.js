import { CREATED, OK } from "../../constants/http.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { setAuthCookies } from "../../utils/cookiee.js";
import { loginSchema, registerSchema } from "../../validations/auth.schema.js";
import {
  createAccount,
  loginUser,
  refreshAccessToken,
} from "./auth.service.js";

export const createUserHandler = asyncHandler(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
  });

  const { user, accessToken, refreshToken } = await createAccount(request);

  return setAuthCookies({ res, accessToken, refreshToken })
    .status(CREATED)
    .json({
      success: "true",
      data: user,
      message: "User created successfully",
    });
});

export const loginHandler = asyncHandler(async (req, res) => {
  // 1. Validate request (throws 400 if invalid)
  const { email, password } = loginSchema.parse(req.body);

  // 2. Authenticate user (throws 401 if invalid)
  const { user, accessToken, refreshToken } = await loginUser({
    email: email.toLowerCase(),
    password,
  });

  // 3. Set secure cookies and return response
  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    success: true,
    data: user,
    message: "Login successful",
  });
});

export const logoutHandler = asyncHandler(async (req, res) => {
  // Clear cookies
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.status(OK).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const refreshHandler = asyncHandler(async (req, res) => {
  // 1. Get refresh token from cookies
  const { refreshToken } = req.cookies;

  // 2. Generate new tokens (throws 401 if invalid)
  const {
    user,
    accessToken,
    refreshToken: newRefreshToken,
  } = await refreshAccessToken(refreshToken);

  // 3. Set new secure cookies and return response
  return setAuthCookies({ res, accessToken, refreshToken: newRefreshToken })
    .status(OK)
    .json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        user,
        accessToken,
      },
    });
});
