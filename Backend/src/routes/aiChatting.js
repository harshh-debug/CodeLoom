import express from "express";
import { userMiddleware } from "../middleware/userMiddleware.js";
import { solveDoubt } from "../controllers/solveDoubt.js";
export const aiChattingRouter = express.Router();

aiChattingRouter.post("/chat", userMiddleware, solveDoubt);