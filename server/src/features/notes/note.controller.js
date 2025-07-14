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
    console.log("[Note Creation] Handler started");
    console.log("[Note Creation] User:", req.user.id);
    console.log("[Note Creation] Request body:", JSON.stringify(req.body));

    // 1. Validate input
    console.log("[Note Creation] Validating input...");
    const input = createNoteSchema.parse(req.body);
    console.log("[Note Creation] Input validated:", {
      ...input,
      content: input.content ? "[redacted]" : null,
    });

    // 2. Create note
    console.log("[Note Creation] Calling createNote service...");
    const note = await createNote({
      ...input,
      authorId: req.user.id,
    });
    console.log(
      "[Note Creation] Note created successfully. Note ID:",
      note.data.id
    );
    console.log(
      "[Note Creation] Categories attached:",
      note.data.categories?.length || 0
    );

    // 3. Send response
    console.log("[Note Creation] Sending response...");
    res.status(CREATED).json({
      success: true,
      data: note,
      message: "Note created successfully",
    });
    console.log("[Note Creation] Handler completed successfully");
  } catch (error) {
    console.error("[Note Creation] Handler failed:", error.message);
    console.error("[Note Creation] Error stack:", error.stack);
    console.error("[Note Creation] User context:", req.user?.id);
    console.error("[Note Creation] Input that failed:", req.body);

    // Let asyncHandler handle the error response
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
