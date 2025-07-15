import asyncHandler from "../../utils/asyncHandler.js";
import {
  createNoteSchema,
  updateNoteSchema,
} from "../../validations/note.schema.js";
import {
  createNote,
  deleteNote,
  getNoteById,
  getNotes,
  updateNote,
} from "./note.service.js";

import { CREATED, OK } from "../../constants/http.js";

export const createNoteHandler = asyncHandler(async (req, res) => {
  try {
    const input = createNoteSchema.parse(req.body);

    const note = await createNote({
      ...input,
      authorId: req.user.id,
    });

    res.status(CREATED).json({
      success: true,
      data: note,
      message: "Note created successfully",
    });
  } catch (error) {
    throw error;
  }
});

export const getNoteHandler = asyncHandler(async (req, res) => {
  const note = await getNoteById(req.params.id, req.user.id);
  res.status(OK).json({
    success: true,
    data: note,
    message: "Note retrieved successfully",
  });
});

export const getNotesHandler = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    order = "desc",
    search,
    category,
    ...otherFilters
  } = req.query;

  const result = await getNotes(
    req.user.id,
    {
      search,
      category,
      ...otherFilters,
    },
    {
      page: Number(page),
      limit: Number(limit),
      orderBy,
      order,
    }
  );

  res.status(OK).json({
    success: true,
    data: {
      notes: result.items,
      pagination: result.pagination,
      filters: {
        search,
        category,
        orderBy,
        order,
      },
    },
    message: "Notes retrieved successfully",
  });
});

export const updateNoteHandler = asyncHandler(async (req, res) => {
  const input = updateNoteSchema.parse(req.body);
  const note = await updateNote(req.params.id, req.user.id, input);
  res
    .status(OK)
    .json({ success: true, data: note, message: "Note updated successfully" });
});

export const deleteNoteHandler = asyncHandler(async (req, res) => {
  await deleteNote(req.params.id, req.user.id);
  res.status(OK).json({
    success: true,
    data: null,
    message: "Note deleted successfully",
  });
});
