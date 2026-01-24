import express from "express"
import { register, login, logout } from "../controllers/authControl.js"

export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
