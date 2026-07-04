import { Router } from "express";
import {
  getSession,
  postLogin,
  postLogout,
  postRegister,
  putProfile
} from "../controllers/authController.js";

export const authRoutes = Router();

authRoutes.get("/session", getSession);
authRoutes.post("/login", postLogin);
authRoutes.post("/register", postRegister);
authRoutes.post("/logout", postLogout);
authRoutes.put("/profile", putProfile);