import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";
import User from "../models/user.js";
export const userMiddleware = async (req, res, next) => {
	try {
		const { token } = req.cookies;
		if (!token) {
			throw new Error("No token provided");
		}

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if (!payload) {
            throw new Error("Invalid token");
        }
        const {_id}= payload
        if(!_id) {
            throw new Error("Invalid token ");
        }
        const result = await User.findById(_id); 

        if (!result) {
            throw new Error("User not found");
        }
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            throw new Error("Invalid token");
        }
        req.result = result;
        next();

	} catch (error) {
        console.error("User middleware error:", error);
        res.status(401).send("Unauthorized: " + error.message);
    }
};
