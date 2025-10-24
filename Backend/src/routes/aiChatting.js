import express from "express";
import { userMiddleware } from "../middleware/userMiddleware.js";
import { solveDoubt } from "../controllers/solveDoubt.js";
import { learnTopic } from "../controllers/learnTopic.js";
export const aiChattingRouter = express.Router();

aiChattingRouter.post("/chat", userMiddleware, solveDoubt);
aiChattingRouter.post("/learn", userMiddleware, learnTopic);