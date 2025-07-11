import bcrypt from "bcrypt";
import { CONFLICT, UNAUTHORIZED } from "../../constants/http.js";
import appAssert from "../../utils/appAssert.js";
import { sendVerificationEmail } from "../../utils/emailVerification.js";
import { signToken, verifyToken } from "../../utils/jwt.js";
import prisma from "../../utils/prisma.js";

export const createAccount = async ({
  email,
  password,
  username,
  fullname,
}) => {
  // Check for existing user by both email and username
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });
  appAssert(!existingUser, CONFLICT, "Email or username already in use");

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      fullname,
      isVerified: false,
    },
    select: {
      id: true,
      username: true,
      email: true,
      fullname: true,
      createdAt: true,
      isVerified: true,
    },
  });

  await sendVerificationEmail(user);
  // Generate tokens
  const accessToken = signToken({
    userId: user.id,
    email: user.email,
    username: user.username,
    isVerified: false,
  });

  const refreshToken = signToken({ userId: user.id }, { type: "refresh" });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });

  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  const passwordValid = await bcrypt.compare(password, user.password);
  appAssert(passwordValid, UNAUTHORIZED, "Invalid email or password");

  if (process.env.REQUIRE_EMAIL_VERIFICATION === "true") {
    appAssert(user.isVerified, UNAUTHORIZED, "Please verify your email first");
  }

  const accessToken = signToken({ userId: user.id }, { type: "access" });

  const refreshToken = signToken({ userId: user.id }, { type: "refresh" });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken,
      refreshTokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (refreshToken) => {
  appAssert(refreshToken, UNAUTHORIZED, "Refresh token is required");

  // Verify the refresh token
  const decoded = verifyToken(refreshToken, { type: "refresh" });
  appAssert(decoded, UNAUTHORIZED, "Invalid or expired refresh token");

  // Find user and verify stored refresh token
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      username: true,
      email: true,
      fullname: true,
      isVerified: true,
      createdAt: true,
      refreshToken: true,
      refreshTokenExpires: true,
    },
  });

  appAssert(user, UNAUTHORIZED, "User not found");
  appAssert(
    user.refreshToken === refreshToken,
    UNAUTHORIZED,
    "Invalid refresh token"
  );
  appAssert(
    user.refreshTokenExpires && user.refreshTokenExpires > new Date(),
    UNAUTHORIZED,
    "Refresh token expired"
  );

  // Generate new tokens
  const newAccessToken = signToken(
    {
      userId: user.id,
      email: user.email,
      username: user.username,
      isVerified: user.isVerified,
    },
    { type: "access" }
  );

  const newRefreshToken = signToken({ userId: user.id }, { type: "refresh" });

  // Update user with new refresh token
  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken: newRefreshToken,
      refreshTokenExpires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    },
  });

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

export const verifyEmail = async (token) => {
  // Verify token
  const { payload, error, expired } = verifyToken(token);
  if (error || !payload?.userId) {
    throw new AppError(
      expired ? "Verification link expired" : "Invalid token",
      BAD_REQUEST
    );
  }

  // Update user verification status
  const user = await prisma.user.update({
    where: { id: payload.userId },
    data: { isVerified: true },
    select: { id: true, email: true, username: true }, // Essential fields only
  });

  // Generate new access token reflecting verified status
  const accessToken = signToken({
    userId: user.id,
    email: user.email,
    isVerified: true,
  });

  return { user, accessToken };
};

export const resendVerificationEmail = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true },
  });
  appAssert(user, NOT_FOUND, "User not found");

  const newToken = signToken({ userId: user.id }, { expiresIn: "24h" });
  await sendVerificationEmail(user.email, newToken); // Your email service

  return { success: true };
};
