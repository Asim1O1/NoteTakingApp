import { BAD_REQUEST, NOT_FOUND } from "../../constants/http.js";
import appAssert from "../../utils/appAssert.js";
import prisma from "../../utils/prisma.js";

export const createCategory = async (name) => {
  // Validate category name
  appAssert(
    typeof name === "string" && name.trim(),
    BAD_REQUEST,
    "Category name must be a non-empty string"
  );

  // Create category (Prisma will throw if name exists due to @unique)
  try {
    return await prisma.category.create({
      data: { name },
    });
  } catch (error) {
    if (error.code === "P2002") {
      // Unique constraint violation
      throw new Error("Category name already exists");
    }
    throw error;
  }
};

export const getCategories = async () => {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
};
/**
 * Adds categories to a note by connect or create
 */
export const addCategoriesToNote = async (noteId, userId, categoryNames) => {
  // 1. Verify note exists and belongs to user
  const note = await prisma.note.findFirst({
    where: { id: noteId, authorId: userId },
  });
  appAssert(note, NOT_FOUND, "Note not found");

  // 2. Verify all categories exist in the system
  const existingCategories = await prisma.category.findMany({
    where: {
      name: { in: categoryNames },
    },
  });

  // Check if all requested categories exist
  appAssert(
    existingCategories.length === categoryNames.length,
    BAD_REQUEST,
    "One or more categories don't exist in the system"
  );

  // 3. Create NoteCategory relationships (skip duplicates)
  await prisma.noteCategory.createMany({
    data: existingCategories.map((category) => ({
      noteId,
      categoryId: category.id,
    })),
    skipDuplicates: true, // Skip if relationship already exists
  });

  // 4. Return the updated note with categories
  const updatedNote = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      noteCategories: {
        include: {
          category: true,
        },
      },
    },
  });

  return {
    ...updatedNote,
    categories: updatedNote.noteCategories.map((nc) => nc.category),
  };
};

/**
 * Removes categories from a note
 */
export const removeCategoriesFromNote = async (
  noteId,
  userId,
  categoryNames
) => {
  const note = await prisma.note.findFirst({
    where: { id: noteId, authorId: userId },
  });

  appAssert(note, NOT_FOUND, "Note not found");

  // Find the categories to remove
  const categories = await prisma.category.findMany({
    where: { name: { in: categoryNames } },
  });

  // Remove the NoteCategory relationships
  await prisma.noteCategory.deleteMany({
    where: {
      noteId: noteId,
      categoryId: { in: categories.map((cat) => cat.id) },
    },
  });

  // Return the updated note
  const updatedNote = await prisma.note.findUnique({
    where: { id: noteId },
    include: {
      noteCategories: {
        include: {
          category: true,
        },
      },
    },
  });

  return updatedNote;
};
