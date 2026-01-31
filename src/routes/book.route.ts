import { Router } from 'express'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'
import { upload } from '../middlewares/upload.middleware'
import {
  Create,
  CreateImage,
  Delete,
  DeleteImage,
  GetAll,
  GetAllImages,
  GetById,
  GetBySlug,
  Update,
  UpdateImage
} from '../controllers/book.controller'

export const BookRoute: Router = Router()

BookRoute.get('/', GetAll)
BookRoute.get('/:bookId', GetById)
BookRoute.get('/slug/:slug', GetBySlug)
BookRoute.get('/images/:bookId', GetAllImages)

// Protected Routes
BookRoute.use(adminAuthenticate, checkRole(['Superadmin', 'Staff']))

BookRoute.post('/create', upload.single('image_url'), Create)
BookRoute.put(
  '/update/:bookId',
  adminAuthenticate,
  checkRole(['Superadmin', 'Staff']),
  upload.single('image_url'),
  Update
)
BookRoute.delete('/delete/:bookId', Delete)

BookRoute.post('/images/:bookId', upload.single('image_url'), CreateImage)
BookRoute.put(
  '/images/update/:imageId',
  adminAuthenticate,
  checkRole(['Superadmin', 'Staff']),
  upload.single('image_url'),
  UpdateImage
)
BookRoute.delete('/images/delete/:imageId', DeleteImage)
