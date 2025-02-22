import express from 'express';
import { loginUser, registerUser }  from '../controllers/userController.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)
// userRouter.post('/logout', logoutUser)
// userRouter.post('/admin', adminLogin)

export default userRouter;