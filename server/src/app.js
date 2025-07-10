import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js";
import { APP_ORIGIN } from "./constants/env.js";
import { OK } from "./constants/http.js";

import authRoutes from "./features/auth/auth.route.js";
import errorHandler from "./middlewares/errorhandler.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", authRoutes);

app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Health check route
app.get("/", (req, res) => {
  res.status(OK).json({
    status: "success",
    message: "Health check successful!",
  });
});

app.use("/api/auth", authRoutes);

app.use(errorHandler);

export default app;
