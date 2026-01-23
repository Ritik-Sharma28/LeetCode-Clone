const express = require("express")
import register from "../controllers/authControl"

const authRouter = express.Router();

authRouter.post("/register",register);
authRouter.post("/login", );
authRouter.post("/logout");

module.exports = authRouter;
