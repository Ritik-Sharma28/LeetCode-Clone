import express from "express"
import { register, login, logout, deleteProfile , adminRegister} from "../controllers/authControl.js"
import { userMiddleware } from "../middleware/userMiddleware.js"
export const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", userMiddleware, logout);
authRouter.post("/delete", userMiddleware, deleteProfile);
authRouter.post("/adminRegister", userMiddleware, adminRegister);

