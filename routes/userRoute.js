import express  from 'express'
import { userRegister , userLogin, userLogout, getMyProfile, getUserById, userDelete, userUpdate , resetPassword, updatePassword} from '../controllers/userController.js'
import {isAuth} from '../middlewares/auth.js'

const userRouter = express.Router()


userRouter.post('/register' , userRegister)
userRouter.post('/login' , userLogin)
userRouter.get('/logout' , userLogout)
userRouter.get('/myprofile' , isAuth , getMyProfile)
userRouter.get('/:id', getUserById)
userRouter.delete('/delete/:id', userDelete)
userRouter.put('/update/:id', isAuth , userUpdate)

userRouter.post('/reset-password', isAuth , resetPassword)
userRouter.post('/update-password/:id', isAuth , updatePassword)

export default userRouter