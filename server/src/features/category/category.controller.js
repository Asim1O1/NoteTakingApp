import { z } from "zod";
import { CREATED, OK } from "../../constants/http.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  addCategoriesToNote,
  createCategory,
  filterNotesByCategory,
  getAllUserCategories,
  getCategories,
} from "./category.service.js";

const categorySchema = z.object({
  categoryNames: z.array(z.string().min(1)),
});

export const createCategoryHandler = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const category = await createCategory(name);
  res.status(CREATED).json({
    success: true,
    data: category,
    message: "Category created successfully",
  });
});

export const getCategoriesHandler = asyncHandler(async (req, res) => {
  const categories = await getCategories();
  res.status(CREATED).json({
    success: true,
    data: categories,
    message: "Categories retrieved successfully",
  });
});

export const addCategoriesHandler = asyncHandler(async (req, res) => {
  const { categoryNames } = categorySchema.parse(req.body);
  const note = await addCategoriesToNote(
    req.params.noteId,
    req.user.id,
    categoryNames
  );
  res.status(OK).json({
    success: true,
    data: note,
    message: "Categories added successfully",
  });
});

export const filterNotesHandler = asyncHandler(async (req, res) => {
  const notes = await filterNotesByCategory(req.user.id, req.query.category);
  res.status(OK).json({
    success: true,
    data: notes,
    message: "Notes filtered successfully",
  });
});

export const getUserCategoriesHandler = asyncHandler(async (req, res) => {
  const categories = await getAllUserCategories(req.user.id);
  res.status(OK).json({
    success: true,
    data: categories,
    message: "User categories retrieved successfully",
  });
});
