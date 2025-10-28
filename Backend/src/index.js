import "./loadenv.js";

import express from "express";
import cookieParser from "cookie-parser";

import { dbconnect } from "./config/db.js";
import { redisClient } from "./config/redis.js";
import authRouter from "./routes/userAuthRoute.js";
import { problemRouter } from "./routes/problemsRoute.js";
import { submitRouter } from "./routes/submitRoute.js";
import cors from "cors";
import { aiChattingRouter } from "./routes/aiChatting.js";
import videoRouter from "./routes/videoRoute.js";

const app = express();

app.use(
	cors({
		origin: [
			"https://codeloom-platform.vercel.app",
			"http://localhost:5173",
			"http://localhost:3000",
			"http://localhost:5174",
		],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
		exposedHeaders: ["Set-Cookie"],
	})
);

app.use(cookieParser());
app.use(express.json());

app.get("/ping", (req, res) => {
  res.status(200).json({ message: "Server is awake" });
});

app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use("/submission", submitRouter);
app.use("/ai", aiChattingRouter);
app.use("/video", videoRouter);

const initializeConnection = async () => {
	try {
		await Promise.all([dbconnect(), redisClient.connect()]);
		console.log("Database connection established successfully.");
		const PORT = process.env.PORT || 3000;
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		console.error("Error establishing connections:", error);
	}
};

initializeConnection();
