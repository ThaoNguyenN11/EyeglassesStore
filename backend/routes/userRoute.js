import express from 'express';
import { loginUser, registerUser, adminLogin, updateUser, getUserProfile, getUser, logoutUser }  from '../controllers/userController.js'
import authMiddleware from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadAvatar.js';

const userRouter = express.Router()

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);
userRouter.put('/update', authMiddleware, upload.single("avatar"), updateUser);
userRouter.get('/profile', authMiddleware, getUserProfile);
userRouter.get('/admin/getInfo', getUser);
userRouter.post("/logout", logoutUser); // API đăng xuất

export default userRouter;