import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js";
import { APP_ORIGIN } from "./constants/env.js";
import { NOT_FOUND, OK } from "./constants/http.js";

import authRoutes from "./features/auth/auth.route.js";
import categoryRoutes from "./features/category/category.route.js";
import noteRoutes from "./features/notes/note.route.js";
import errorHandler from "./middlewares/errorhandler.js";

const app = express();
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check route
app.get("/", (req, res) => {
  res.status(OK).json({
    status: "success",
    message: "Health check successful!",
  });
});

app.use((req, res) => {
  res.status(NOT_FOUND).json({ message: "Route not found" });
});

app.use(errorHandler);

export default app;
