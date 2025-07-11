import { Router } from "express";
import {
  createUserHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
  resendVerificationHandler,
  verifyEmailHandler,
} from "./auth.controller.js";

import authenticate from "../../middlewares/authenticate.js";

const authRoutes = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     description: Registers a user, returns user info along with access and refresh tokens.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 20
 *                 pattern: "^[a-zA-Z0-9_]+$"
 *                 example: johndoe_99
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Pass@1234
 *               fullname:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 pattern: "^[a-zA-Z\\s'-]+$"
 *                 example: John Doe
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "true"
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe_99
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     fullname:
 *                       type: string
 *                       example: John Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-10T08:30:00.000Z
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *       409:
 *         description: Email or username already in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: string
 *                   example: "false"
 *                 message:
 *                   type: string
 *                   example: Email or username already in use
 *       400:
 *         description: Validation error
 */
authRoutes.post("/register", createUserHandler);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     description: Authenticates a user with email and password, returns user info and sets secure authentication cookies.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Pass@1234
 *     responses:
 *       200:
 *         description: Login successful
 *         headers:
 *           Set-Cookie:
 *             description: Authentication cookies (accessToken and refreshToken)
 *             schema:
 *               type: string
 *               example: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "12345"
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     username:
 *                       type: string
 *                       example: johndoe_99
 *                     fullname:
 *                       type: string
 *                       example: John Doe
 *                     isVerified:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-10T08:30:00.000Z
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: 2025-07-10T08:30:00.000Z
 *                 message:
 *                   type: string
 *                   example: Login successful
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Validation failed
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: email
 *                       message:
 *                         type: string
 *                         example: Invalid email format
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       429:
 *         description: Too many requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Too many login attempts. Please try again later.
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error occurred
 */
authRoutes.post("/login", loginHandler);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     description: Logs out the user by clearing cookies.
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
authRoutes.post("/logout", logoutHandler);

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Generates a new access token using the refresh token from cookies. Also issues a new refresh token and updates stored refresh token.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *         headers:
 *           Set-Cookie:
 *             description: Updated authentication cookies (new accessToken and refreshToken)
 *             schema:
 *               type: string
 *               example: accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Token refreshed successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           example: "12345"
 *                         username:
 *                           type: string
 *                           example: johndoe_99
 *                         email:
 *                           type: string
 *                           example: johndoe@example.com
 *                         fullname:
 *                           type: string
 *                           example: John Doe
 *                         isVerified:
 *                           type: boolean
 *                           example: true
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                           example: 2025-07-10T08:30:00.000Z
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMjM0NSIsImVtYWlsIjoiam9obmRvZUBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoiam9obmRvZV85OSIsImlzVmVyaWZpZWQiOnRydWUsInR5cGUiOiJhY2Nlc3MiLCJpYXQiOjE3MjA2MDk4MDAsImV4cCI6MTcyMDYxMDcwMH0.example_signature
 *       401:
 *         description: Unauthorized - Invalid or missing refresh token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   oneOf:
 *                     - example: Refresh token is required
 *                     - example: Invalid or expired refresh token
 *                     - example: User not found
 *                     - example: Invalid refresh token
 *                     - example: Refresh token expired
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Internal server error occurred
 *
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: refreshToken
 *       description: JWT refresh token stored in HTTP-only cookie
 */
authRoutes.post("/refresh", refreshHandler);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     tags: [Auth]
 *     summary: Verify user's email address
 *     description: Endpoint to verify email using token sent to user's email
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT verification token
 *     responses:
 *       302:
 *         description: Redirects to dashboard on success
 *         headers:
 *           Set-Cookie:
 *             schema:
 *               type: string
 *               example: accessToken=abc123; Path=/; HttpOnly
 *       400:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoutes.get("/verify-email", verifyEmailHandler);

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     tags: [Auth]
 *     summary: Resend verification email
 *     description: Resends email verification link to authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verification email resent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized (missing/invalid token)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
authRoutes.post(
  "/resend-verification",
  authenticate,
  resendVerificationHandler
);

export default authRoutes;
