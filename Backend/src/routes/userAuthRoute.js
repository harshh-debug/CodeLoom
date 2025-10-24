import express from "express";
import {
	adminRegister,
	deleteProfile,
	loginUser,
	logoutUser,
	registerUser,
	updateUserAvatar,
} from "../controllers/authControllers.js";
import { userMiddleware } from "../middleware/userMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { checkUserMiddleware } from "../middleware/checkUserMiddleware.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", userMiddleware, logoutUser);
authRouter.post("/admin/register", adminMiddleware, adminRegister);
authRouter.delete("/profile/delete", userMiddleware, deleteProfile);
authRouter.patch("/avatar", userMiddleware, updateUserAvatar);
authRouter.get("/check", checkUserMiddleware, (req, res) => {
	if (req.result) {
		const reply = {
			firstName: req.result.firstName,
			...(req.result?.lastName && { lastName: req.result.lastName }),
			emailId: req.result.emailId,
			_id: req.result._id,
			role: req.result.role,
			avatar: req.result.avatar || null,
		};
		return res.status(200).json({ user: reply, message: "Valid User" });
	} else {
		return res.status(200).json({ user: null, message: "Not Authenticated" });
	}
});
// authRouter.get('/profile',getUserProfile);

export default authRouter;
