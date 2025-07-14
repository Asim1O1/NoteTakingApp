import { CREATED, OK } from "../../constants/http.js";
import asyncHandler from "../../utils/asyncHandler.js";
import { setAuthCookies } from "../../utils/cookiee.js";
import { loginSchema, registerSchema } from "../../validations/auth.schema.js";
import {
  createAccount,
  getTheCurrentUser,
  loginUser,
  refreshAccessToken,
  resendVerificationEmail,
  verifyEmail,
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
  console.log("request body is", req?.body);
  const { email, password } = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await loginUser({
    email: email.toLowerCase(),
    password,
  });
  return setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    success: true,
    data: user,
    message: "Login successful",
  });
});

export const logoutHandler = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(OK).json({
    success: true,
    message: "Logged out successfully",
  });
});

export const refreshHandler = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  const {
    user,
    accessToken,
    refreshToken: newRefreshToken,
  } = await refreshAccessToken(refreshToken);
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

export const verifyEmailHandler = asyncHandler(async (req, res) => {
  const { token } = req.query;
  const { user, accessToken } = await verifyEmail(token);
  setAuthCookies({ res, accessToken });
  return res.json({ success: true, user });
});

export const resendVerificationHandler = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  await resendVerificationEmail(userId);
  return res.json({ success: true, message: "Verification email resent" });
});

export const getCurrentUser = async (req, res, next) => {
  const userId = req.user?.id;
  const { user, accessToken } = await getTheCurrentUser(userId);
  console.log("The user is", user);

  return setAuthCookies({ res, accessToken }).status(OK).json({
    success: true,
    data: user,
    message: "User retrieved successfully",
  });
};
