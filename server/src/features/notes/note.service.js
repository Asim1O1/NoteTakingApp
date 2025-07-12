import { NOT_FOUND } from "../../constants/http.js";
import appAssert from "../../utils/appAssert.js";
import prisma from "../../utils/prisma.js";

/**
 * Creates a new note with optional categories
 */
export const createNote = async ({
  title,
  content,
  categoryNames = [],
  authorId,
}) => {
  // 1. Check if a note with the same title already exists for this user
  const existingNote = await prisma.note.findFirst({
    where: {
      title,
      authorId,
    },
  });

  // 2. If duplicate exists, throw an error (or handle it as needed)
  appAssert(!existingNote, NOT_FOUND, "Note with this title already exists");

  // 3. If no duplicate, proceed with creation
  const note = await prisma.note.create({
    data: {
      title,
      content,
      authorId,
      noteCategories: {
        create: categoryNames.map((name) => ({
          category: {
            connectOrCreate: {
              where: { name },
              create: { name },
            },
          },
        })),
      },
    },
    include: {
      noteCategories: {
        include: { category: true },
      },
    },
  });

  // 4. Transform and return the response
  return {
    ...note,
    categories: note.noteCategories.map((nc) => nc.category),
  };
};

/**
 * Retrieves a single note by ID, ensuring it belongs to the requesting user
 */
export const getNoteById = async (id, userId) => {
  const note = await prisma.note.findFirst({
    where: { id, authorId: userId },
    include: {
      noteCategories: {
        include: { category: true },
      },
    },
  });

  appAssert(note, NOT_FOUND, "Note not found");

  return {
    ...note,
    categories: note.noteCategories.map((nc) => nc.category),
  };
};

/**
 * Retrieves all notes for a user, with optional category filter
 */

export const getNotes = async (userId, filters = {}, paginationParams = {}) => {
  const {
    category,
    search, // New: search query
    ...otherFilters
  } = filters;

  const {
    page = 1,
    limit = 10,
    orderBy = "createdAt", // Can be: 'createdAt', 'updatedAt', 'title'
    order = "desc", // 'asc' or 'desc'
  } = paginationParams;

  // Build the where clause with all filters
  const whereClause = {
    authorId: userId,
    // Category filter (existing)
    ...(category && {
      noteCategories: {
        some: { category: { name: category } },
      },
    }),
    // Search filter (new)
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ],
    }),
    // Other filters can be added here
    ...otherFilters,
  };

  // Validate orderBy field to prevent SQL injection
  const validOrderFields = ["createdAt", "updatedAt", "title"];
  const safeOrderBy = validOrderFields.includes(orderBy)
    ? orderBy
    : "createdAt";

  // Get paginated notes
  const notes = await prisma.note.findMany({
    where: whereClause,
    include: {
      noteCategories: {
        include: { category: true },
      },
    },
    orderBy: { [safeOrderBy]: order },
    skip: (page - 1) * limit,
    take: limit,
  });

  // Get total count matching filters
  const total = await prisma.note.count({
    where: whereClause,
  });

  // Transform categories
  const transformedNotes = notes.map((note) => ({
    ...note,
    categories: note.noteCategories.map((nc) => nc.category),
  }));

  // Return formatted pagination response
  return {
    items: transformedNotes,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  };
};

/**
 * Updates a note and its categories
 */
export const updateNote = async (id, userId, updateData) => {
  const { categoryNames, ...rest } = updateData;

  // 1. Verify note exists and belongs to user
  const note = await prisma.note.findUnique({
    where: { id, authorId: userId },
  });
  appAssert(note, NOT_FOUND, "Note not found");

  // 2. Validate categoryNames format
  appAssert(
    !categoryNames || Array.isArray(categoryNames),
    BAD_REQUEST,
    "categoryNames must be an array if provided"
  );

  // 3. Clear existing categories (only if new ones are provided)
  if (categoryNames) {
    await prisma.noteCategory.deleteMany({
      where: { noteId: id },
    });
  }

  // 4. Update note with new categories (if any)
  const updatedNote = await prisma.note.update({
    where: { id },
    data: {
      ...rest,
      ...(categoryNames && {
        noteCategories: {
          create: categoryNames.map((name) => {
            appAssert(
              typeof name === "string" && name.trim(),
              BAD_REQUEST,
              "Category name must be a non-empty string"
            );
            return {
              category: {
                connectOrCreate: {
                  where: { name },
                  create: { name },
                },
              },
            };
          }),
        },
      }),
    },
    include: {
      noteCategories: {
        include: { category: true },
      },
    },
  });

  // 5. Transform and return
  return {
    ...updatedNote,
    categories: updatedNote.noteCategories.map((nc) => nc.category),
  };
};

/**
 * Deletes a note
 */
export const deleteNote = async (id, userId) => {
  // 1. Check if note exists and belongs to user
  const note = await prisma.note.findUnique({
    where: { id, authorId: userId },
  });
  appAssert(note, NOT_FOUND, "Note not found");

  // 2. Delete the note
  await prisma.note.deleteMany({
    where: { id, authorId: userId },
  });
};
