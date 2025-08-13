import express from 'express';
import { adminRegister, deleteProfile, loginUser, logoutUser, registerUser } from '../controllers/authControllers.js';
import { userMiddleware } from '../middleware/userMiddleware.js';
import { adminMiddleware } from '../middleware/adminMiddleware.js';

const authRouter=express.Router();

authRouter.post('/register',registerUser);
authRouter.post('/login',loginUser);
authRouter.post('/logout',userMiddleware,logoutUser);
authRouter.post('/admin/register',adminMiddleware,adminRegister)
authRouter.delete('/profile/delete',userMiddleware,deleteProfile)
// authRouter.get('/profile',getUserProfile);

export default authRouter;