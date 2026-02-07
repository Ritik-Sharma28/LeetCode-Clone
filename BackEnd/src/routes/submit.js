import express from 'express'
const submitRouter = express.Router();
import { userMiddleware } from "../middleware/userMiddleware.js";
import { submitCode , runCode } from '../controllers/userSubmission.js';


submitRouter.post("/submit/:id", userMiddleware, submitCode);
 submitRouter.post("/run/:id",userMiddleware,runCode);

export default submitRouter;
