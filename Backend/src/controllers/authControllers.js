import { redisClient } from "../config/redis.js";
import User from "../models/user.js";
import { validateUserInput } from "../utils/validateUserInput.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
	try {
		validateUserInput(req.body);
		const { firstName, emailId, password } = req.body;

		req.body.password = await bcrypt.hash(password, 10);
		req.body.role = "user";

		const user = await User.create(req.body);
		const reply={
			firstName:user.firstName,
			...(user?.lastName && { lastName: user.lastName }),
			emailId:user.emailId,
			_id:user._id

		}
		const token = jwt.sign(
			{ _id: user._id, emailId: emailId, role: "user" },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

		res.status(201).json({
			user: reply,
			message: "User Registered Successfully",
		});
	} catch (error) {
		res.status(400).send(error.message);
	}
};

export const loginUser = async (req, res) => {
	try {
		const { emailId, password } = req.body;
		if (!emailId || !password) {
			return res.status(400).send("Email and password are required");
		}

		const user = await User.findOne({ emailId });
		if (!user) {
			return res.status(404).send("User not found");
		}
		const match = await bcrypt.compare(password, user.password);

		if (!match) {
			return res.status(401).send("Invalid email or password");
		}
		const reply={
			firstName:user.firstName,
			...(user?.lastName && { lastName: user.lastName }),
			emailId:user.emailId,
			_id:user._id

		}
		const token = jwt.sign(
			{ _id: user._id, emailId: emailId, role: user.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
		res.status(201).json({
			user: reply,
			message: "Login Successfully",
		});
	} catch (error) {
		res.status(401).send("Error logging in user: " + error.message);
	}
};

export const logoutUser = async (req, res) => {
	try {
		const { token } = req.cookies;
		const payload = jwt.decode(token);
		await redisClient.set(`token:${token}`, "Blocked");
		await redisClient.expire(`token:${token}`, payload.exp);

		res.cookie("token", null, { expires: new Date(Date.now()) });
		res.status(200).send("Logged out successfully");
	} catch (error) {
		res.status(500).send("Error logging out user: " + error.message);
	}
};

export const adminRegister = async (req, res) => {
	try {
		validateUserInput(req.body);
		const { firstName, emailId, password } = req.body;

		req.body.password = await bcrypt.hash(password, 10);
		// req.body.role = "admin";

		const user = await User.create(req.body);
		const token = jwt.sign(
			{ _id: user._id, emailId: emailId, role: req.body.role },
			process.env.JWT_SECRET,
			{ expiresIn: "1h" }
		);
		res.cookie("token", token, { maxAge: 60 * 60 * 1000 });

		res.status(201).send(`${user.role} Registered Successfully`);
	} catch (error) {
		res.status(400).send(error.message);
	}
};

export const deleteProfile = async (req, res) => {
	try {
		const userId = req.result._id;
		await User.findByIdAndDelete(userId);
	} catch (error) {
		res.status(500).send("Internal server Error : " + error);
	}
};
