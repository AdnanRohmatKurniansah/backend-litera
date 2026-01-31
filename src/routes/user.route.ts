import { Router } from 'express'
import {
  Login,
  Logout,
  UpdateProfile,
  ChangePassword,
  Register,
  GetProfile,
  GoogleLogin
} from '../controllers/user.controller'
import { upload } from '../middlewares/upload.middleware'
import { userAuthenticate } from '../middlewares/user.auth'

export const UserRoute: Router = Router()

UserRoute.post('/login', Login)
UserRoute.post('/login-google', GoogleLogin)
UserRoute.post('/register', Register)

// Protected Routes
UserRoute.use(userAuthenticate)

UserRoute.get('/profile', GetProfile)
UserRoute.post('/update-profile', upload.single('profile'), UpdateProfile)
UserRoute.post('/change-password', ChangePassword)
UserRoute.post('/logout', Logout)
