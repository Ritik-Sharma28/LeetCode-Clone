import express from "express";
import { userMiddleware } from "../middleware/userMiddleware.js";
import { createProblem } from "../controllers/userProblem.js";
const problemRouter = express.Router()


problemRouter.post("/create",userMiddleware, createProblem)
// problemRouter.put("/update/:id", updateProblem)
// problemRouter.delete("/delete/:id" , deleteProblem)

// problemRouter.get("/problemById/:id" , getProblemById)
// problemRouter.get("/getAllProblem" , getAllProblem)
// problemRouter.get("/problemSolvedByUser" , solvedAllProblembyUser)
// problemRouter.get("/submittedProblem/:pid" , submittedProblem)


export default problemRouter

