import { Router } from 'express'
import {
  Login,
  Create,
  Delete,
  GetAll,
  Update,
  Logout,
  UpdateProfile,
  ChangePassword,
  GetProfile,
  GetById
} from '../controllers/admin.controller'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'
import { upload } from '../middlewares/upload.middleware'

export const AdminRoute: Router = Router()

AdminRoute.post('/login', Login)

AdminRoute.use(adminAuthenticate)

AdminRoute.get('/profile', GetProfile)
AdminRoute.post('/update-profile', checkRole(['Superadmin', 'Staff']), upload.single('profile'), UpdateProfile)
AdminRoute.post('/change-password', checkRole(['Superadmin', 'Staff']), ChangePassword)
AdminRoute.post('/logout', checkRole(['Superadmin', 'Staff']), Logout)

AdminRoute.use(checkRole(['Superadmin']))

AdminRoute.get('/', GetAll)
AdminRoute.get('/:adminId', GetById)
AdminRoute.post('/create', Create)
AdminRoute.put('/update/:adminId', Update)
AdminRoute.delete('/delete/:adminId', Delete)
