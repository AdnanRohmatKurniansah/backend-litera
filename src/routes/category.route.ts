import { Router } from 'express'
import { Create, Delete, GetAll, GetById, GetBySlug, Update } from '../controllers/category.controller'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'
import { upload } from '../middlewares/upload.middleware'

export const CategoryRoute: Router = Router()

CategoryRoute.get('/', GetAll)
CategoryRoute.get('/slug/:slug', GetBySlug)
CategoryRoute.get('/:categoryId', GetById)

// Protected Routes
CategoryRoute.use(adminAuthenticate, checkRole(['Superadmin', 'Staff']))

CategoryRoute.post('/create', upload.single('image_url'), Create)
CategoryRoute.put('/update/:categoryId', upload.single('image_url'), Update)
CategoryRoute.delete('/delete/:categoryId', Delete)
