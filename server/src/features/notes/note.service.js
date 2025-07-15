import { NOT_FOUND } from "../../constants/http.js";
import appAssert from "../../utils/appAssert.js";
import prisma from "../../utils/prisma.js";

export const createNote = async ({
  title,
  content,
  categories = [],
  authorId,
}) => {
  try {
    const existingNote = await prisma.note.findFirst({
      where: { title, authorId },
    });

    if (existingNote) {
      appAssert(false, NOT_FOUND, "Note with this title already exists");
    }

    const processedCategoryIds = [
      ...new Set(
        categories.filter((id) => typeof id === "string" && id.length === 36) // UUID validation
      ),
    ];
    console.log("[Note Service] Validated category IDs:", processedCategoryIds);

    if (processedCategoryIds.length > 0) {
      const existingCategories = await prisma.category.findMany({
        where: { id: { in: processedCategoryIds } },
      });

      if (existingCategories.length !== processedCategoryIds.length) {
        const missing = processedCategoryIds.filter(
          (id) => !existingCategories.some((c) => c.id === id)
        );

        appAssert(false, NOT_FOUND, "One or more categories not found");
      }
    }

    const createData = {
      title,
      content,
      author: { connect: { id: authorId } },
    };

    if (processedCategoryIds.length > 0) {
      createData.noteCategories = {
        create: processedCategoryIds.map((categoryId) => ({
          category: { connect: { id: categoryId } },
        })),
      };
    }

    const note = await prisma.note.create({
      data: createData,
      include: {
        noteCategories: {
          include: { category: true },
        },
      },
    });

    return {
      success: true,
      data: {
        ...note,
        categories: note.noteCategories?.map((nc) => nc.category) || [],
      },
      message: "Note created successfully",
    };
  } catch (error) {
    console.error("[Note Service] Error:", error.message);
    console.error("[Note Service] Stack:", error.stack);
    throw error;
  }
};

export const getNoteById = async (id, userId) => {
  const note = await prisma.note.findUnique({
    where: {
      id,
      authorId: userId,
    },
    include: {
      noteCategories: {
        select: {
          category: true,
        },
      },
    },
  });

  appAssert(note, NOT_FOUND, "Note not found");

  return {
    id: note.id,
    title: note.title,
    content: note.content,
    authorId: note.authorId,
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
    categories: note.noteCategories.map(({ category }) => ({
      id: category.id,
      name: category.name,
    })),
  };
};

export const getNotes = async (userId, filters = {}, paginationParams = {}) => {
  try {
    const { category, search, ...otherFilters } = filters;

    const {
      page = 1,
      limit = 10,
      orderBy = "createdAt",
      order = "desc",
    } = paginationParams;

    // Validate and sanitize inputs
    const pageNumber = Math.max(1, parseInt(page));
    const limitNumber = Math.min(100, Math.max(1, parseInt(limit)));
    const validOrderFields = ["createdAt", "updatedAt", "title"];
    const safeOrderBy = validOrderFields.includes(orderBy)
      ? orderBy
      : "createdAt";
    const sortOrder = order.toLowerCase() === "asc" ? "asc" : "desc";

    // Build the where clause
    const whereClause = {
      authorId: userId,
      ...(category && {
        noteCategories: {
          some: {
            category: {
              name: {
                equals: category,
                mode: "insensitive", // Case-insensitive category matching
              },
            },
          },
        },
      }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { content: { contains: search, mode: "insensitive" } },
          {
            noteCategories: {
              some: {
                category: {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        ],
      }),
      ...otherFilters,
    };

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        where: whereClause,
        include: {
          noteCategories: {
            include: { category: true },
          },
        },
        orderBy: { [safeOrderBy]: sortOrder },
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      }),
      prisma.note.count({ where: whereClause }),
    ]);

    // Transform the data
    const transformedNotes = notes.map((note) => ({
      ...note,
      categories: note.noteCategories.map((nc) => nc.category),
      // Remove the join table reference if not needed
      noteCategories: undefined,
    }));

    return {
      items: transformedNotes,
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
        hasNext: pageNumber * limitNumber < total,
        hasPrev: pageNumber > 1,
      },
    };
  } catch (error) {
    console.error("Error in getNotes:", error);
    throw error;
  }
};

export const updateNote = async (
  noteId,
  authorId,
  { title, content, categories = [] }
) => {
  try {
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        authorId: authorId,
      },
    });
    appAssert(existingNote, NOT_FOUND, "Note not found");

    const processedCategoryIds = [
      ...new Set(
        categories.filter((id) => typeof id === "string" && id.length === 36)
      ),
    ];

    const updateData = {
      ...(title && { title }), // Only include if provided
      ...(content && { content }), // Only include if provided
      ...(processedCategoryIds.length > 0 && {
        noteCategories: {
          deleteMany: {}, // Clear existing categories
          create: processedCategoryIds.map((categoryId) => ({
            category: { connect: { id: categoryId } },
          })),
        },
      }),
    };

    const updatedNote = await prisma.note.update({
      where: { id: noteId },
      data: updateData,
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
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
};

export const deleteNote = async (id, userId) => {
  const note = await prisma.note.findUnique({
    where: { id, authorId: userId },
  });
  appAssert(note, NOT_FOUND, "Note not found");

  await prisma.noteCategory.deleteMany({
    where: { noteId: id },
  });

  await prisma.note.delete({
    where: { id },
  });
};
