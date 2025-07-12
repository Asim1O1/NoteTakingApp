import { Router } from "express";
import { authenticate, requireRole } from "../../middlewares/authenticate.js";
import {
  addCategoriesHandler,
  createCategoryHandler,
  getCategoriesHandler,
  getUserCategoriesHandler,
} from "./category.controller.js";

const categoryRoutes = Router();

// Admin-only endpoints
categoryRoutes.post(
  "/",
  authenticate(), // Basic authentication
  requireRole("ADMIN"), // Role verification
  createCategoryHandler
);

// Authenticated user endpoints
categoryRoutes.get("/", authenticate(), getCategoriesHandler);

categoryRoutes.post(
  "/:noteId/categories",
  authenticate(),
  addCategoriesHandler
);

// User-specific endpoints
categoryRoutes.get(
  "/user/categories",
  authenticate(),
  getUserCategoriesHandler
);

export default categoryRoutes;
