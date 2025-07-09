import { Router } from "express";
import {
  createUserHandler,
  loginHandler,
  logoutHandler,
  refreshHandler,
} from "./auth.controller.js";

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", createUserHandler);
authRoutes.post("/login", loginHandler);
authRoutes.post("/logout", logoutHandler);
authRoutes.post("/refresh", refreshHandler);

export default authRoutes;
