import { Router } from 'express'
import { Create, Delete, GetAll, GetById, Update } from '../controllers/category.controller'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'
import { upload } from '../middlewares/upload.middleware'
import { GetBySlug } from '../controllers/article.controller'

export const ArticleRoute: Router = Router()

ArticleRoute.get('/', GetAll)
ArticleRoute.get('/:articleId', GetById)
ArticleRoute.get('/slug/:slug', GetBySlug)

// Protected Routes
ArticleRoute.use(adminAuthenticate, checkRole(['Superadmin', 'Staff']))

ArticleRoute.post('/create', upload.single('image_url'), Create)
ArticleRoute.put('/update/:articleId', upload.single('image_url'), Update)
ArticleRoute.delete('/delete/:articleId', Delete)
