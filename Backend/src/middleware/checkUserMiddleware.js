import jwt from "jsonwebtoken";
import { redisClient } from "../config/redis.js";
import User from "../models/user.js";
export const checkUserMiddleware = async (req, res, next) => {
	try {
		const { token } = req.cookies;
		if (!token) {
			// throw new Error("No token provided");
			console.error("No token provided");
            req.result = null; 
      return next();
		}

        const payload = jwt.verify(token, process.env.JWT_SECRET)
        if (!payload) {
            // throw new Error("Invalid token");
            console.error("Invalid token");
            req.result = null; // invalid token
      return next();
        }
        const {_id}= payload
        if(!_id) {
            // throw new Error("Invalid token ");
            console.error("Invalid token ");
            req.result = null; // invalid token
      return next();
        }
        const result = await User.findById(_id); 

        if (!result) {
            // throw new Error("User not found");
            console.error("User not found");
            req.result = null; // user not found
      return next();
        }
        const isBlocked = await redisClient.exists(`token:${token}`);
        if (isBlocked) {
            // throw new Error("Invalid token");
            console.error("Invalid token");
            req.result = null; // token blocked
            return next();
        }
        req.result = result;
        next();

	} catch (error) {
        console.error("User middleware error:", error);
        // res.status(401).send("Unauthorized: " + error.message);
        req.result = null;
        next();
    }
};
