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

noteRoutes.get("/", authenticate, checkVerified, getNotesHandler);
noteRoutes.get("/:id", authenticate, checkVerified, getNoteHandler);
noteRoutes.post("/", authenticate, createNoteHandler);
noteRoutes.put("/:id", authenticate, updateNoteHandler);
noteRoutes.delete("/:id", authenticate, deleteNoteHandler);

export default noteRoutes;
