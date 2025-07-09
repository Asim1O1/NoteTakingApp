import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { APP_ORIGIN } from "./constants/env.js";
import { OK } from "./constants/http.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  })
);

// Health check route
app.get("/", (req, res) => {
  res.status(OK).json({
    status: "success",
    message: "Health check successful!",
  });
});

export default app;
