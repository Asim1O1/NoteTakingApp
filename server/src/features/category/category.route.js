import { Router } from "express";
import { authenticate, requireRole } from "../../middlewares/authenticate.js";
import {
  addCategoriesHandler,
  createCategoryHandler,
  getCategoriesHandler,
} from "./category.controller.js";

const categoryRoutes = Router();
/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management endpoints
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category (Admin only)
 *     tags: [Categories]
 *     description: Creates a new category. Requires ADMIN role.
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "Programming"
 *     responses:
 *       201:
 *         description: Category created successfully
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
 *                       example: "clx4a9z8e0000v2xk0q1q2w3r"
 *                     name:
 *                       type: string
 *                       example: "Programming"
 *                 message:
 *                   type: string
 *                   example: "Category created successfully"
 *       400:
 *         description: Bad request (invalid name or category exists)
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
 *                   example: "Category name already exists"
 *       401:
 *         description: Unauthorized (missing/invalid auth cookie or not admin)
 *       403:
 *         description: Forbidden (user doesn't have ADMIN role)
 */
categoryRoutes.post(
  "/",
  authenticate(),
  requireRole("ADMIN"),
  createCategoryHandler
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     description: Returns all available categories
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "clx4a9z8e0000v2xk0q1q2w3r"
 *                       name:
 *                         type: string
 *                         example: "Programming"
 *                 message:
 *                   type: string
 *                   example: "Categories retrieved successfully"
 *       401:
 *         description: Unauthorized (missing/invalid auth cookie)
 */
categoryRoutes.get("/", authenticate(), getCategoriesHandler);

/**
 * @swagger
 * /api/categories/{noteId}/categories:
 *   post:
 *     summary: Add categories to a note
 *     tags: [Categories]
 *     description: Associates categories with a specific note
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: noteId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the note to add categories to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryNames
 *             properties:
 *               categoryNames:
 *                 type: array
 *                 items:
 *                   type: string
 *                   example: "Programming"
 *     responses:
 *       200:
 *         description: Categories added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/NoteWithCategories'
 *                 message:
 *                   type: string
 *                   example: "Categories added successfully"
 *       400:
 *         description: Bad request (invalid categories or note doesn't belong to user)
 *       401:
 *         description: Unauthorized (missing/invalid auth cookie)
 *       404:
 *         description: Note not found or doesn't belong to user
 */
categoryRoutes.post(
  "/:noteId/categories",
  authenticate(),
  addCategoriesHandler
);

export default categoryRoutes;
