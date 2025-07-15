import express from "express";
import { authenticate } from "../../middlewares/authenticate.js";
import checkVerified from "../../middlewares/checkVerified.js";
import {
  createNoteHandler,
  deleteNoteHandler,
  getNoteHandler,
  getNotesHandler,
  updateNoteHandler,
} from "../notes/note.controller.js";

const noteRoutes = express.Router();
/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Note management endpoints
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Get all notes for the authenticated user
 *     tags: [Notes]
 *     description: Retrieves paginated notes with optional filtering and sorting
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: orderBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, title]
 *           default: createdAt
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term to filter notes by title/content/category
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter notes by category name
 *     responses:
 *       200:
 *         description: Successfully retrieved notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedNotes'
 *                 message:
 *                   type: string
 *                   example: "Notes retrieved successfully"
 *       401:
 *         description: Unauthorized (missing/invalid auth cookie)
 *       403:
 *         description: Forbidden (user not verified)
 */

noteRoutes.get("/", authenticate(), checkVerified, getNotesHandler);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     description: Creates a new note with optional categories
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *                 message:
 *                   type: string
 *                   example: "Note created successfully"
 *       400:
 *         description: Bad request (invalid input or duplicate title)
 *       401:
 *         description: Unauthorized (missing/invalid auth cookie)
 */

noteRoutes.post("/", authenticate(), createNoteHandler);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Update a note
 *     tags: [Notes]
 *     description: Updates an existing note (must belong to the authenticated user)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NoteInput'
 *     responses:
 *       200:
 *         description: Note updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *                 message:
 *                   type: string
 *                   example: "Note updated successfully"
 *       400:
 *         description: Bad request (invalid input)
 *       401:
 *         description: Unauthorized (missing/invalid auth cookie)
 *       403:
 *         description: Forbidden (user not verified)
 *       404:
 *         description: Note not found or doesn't belong to user
 */
noteRoutes.put("/:id", authenticate(), checkVerified, updateNoteHandler);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     tags: [Notes]
 *     description: Deletes a note (must belong to the authenticated user)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Note deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: null
 *                 message:
 *                   type: string
 *                   example: "Note deleted successfully"
 *       401:
 *         description: Unauthorized (missing/invalid auth cookie)
 *       403:
 *         description: Forbidden (user not verified)
 *       404:
 *         description: Note not found or doesn't belong to user
 */
noteRoutes.delete("/:id", authenticate(), checkVerified, deleteNoteHandler);

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get a specific note
 *     tags: [Notes]
 *     description: Retrieves a single note by ID (must belong to the authenticated user)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Note ID
 *     responses:
 *       200:
 *         description: Successfully retrieved note
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Note'
 *                 message:
 *                   type: string
 *                   example: "Note retrieved successfully"
 *       401:
 *         description: Unauthorized (missing/invalid auth cookie)
 *       403:
 *         description: Forbidden (user not verified)
 *       404:
 *         description: Note not found or doesn't belong to user
 */

noteRoutes.get("/:id", authenticate(), checkVerified, getNoteHandler);

export default noteRoutes;
