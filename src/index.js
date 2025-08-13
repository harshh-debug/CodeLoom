import "./loadenv.js";

import express from "express";
import cookieParser from "cookie-parser";

import { dbconnect } from "./config/db.js";
import { redisClient } from "./config/redis.js";
import authRouter from "./routes/userAuthRoute.js";
import { problemRouter } from "./routes/problemsRoute.js";
import { submitRouter } from "./routes/submitRoute.js";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use("/user", authRouter);
app.use("/problem", problemRouter);
app.use('/submission', submitRouter)

const initializeConnection = async () => {
	try {
		await Promise.all([dbconnect(), redisClient.connect()]);
		console.log("Database connection established successfully.");
		app.listen(process.env.PORT, () => {
			console.log("Server is running on port " + process.env.PORT);
		});
	} catch (error) {
		console.error("Error establishing connections:", error);
	}
};

initializeConnection();
