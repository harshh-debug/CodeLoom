import express from "express"
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { allProblemSolvedbyUser, createProblem, deleteProblem, getAllProblem, getProblemById,updateProblem } from "../controllers/problemControllers.js";
import { userMiddleware } from "../middleware/userMiddleware.js";


export const problemRouter = express.Router()

//admin access routes
problemRouter.post('/create',adminMiddleware,createProblem);
problemRouter.put("/update/:id",adminMiddleware, updateProblem);
problemRouter.delete("/delete/:id",adminMiddleware,deleteProblem);


problemRouter.get("/getProblemById/:id",userMiddleware, getProblemById);
problemRouter.get("/getAllProblem",userMiddleware, getAllProblem);
problemRouter.get("/problemSolvedbyUser",userMiddleware, allProblemSolvedbyUser);
