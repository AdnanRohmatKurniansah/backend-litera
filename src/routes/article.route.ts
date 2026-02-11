import { Router } from 'express'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'
import { upload } from '../middlewares/upload.middleware'
import { Create, Delete, GetAll, GetById, GetBySlug, GetPublished, Update } from '../controllers/article.controller'

export const ArticleRoute: Router = Router()

ArticleRoute.get('/', GetAll)
ArticleRoute.get('/published', GetPublished)
ArticleRoute.get('/slug/:slug', GetBySlug)
ArticleRoute.get('/:articleId', GetById)

// Protected Routes
ArticleRoute.use(adminAuthenticate, checkRole(['Superadmin', 'Staff']))

ArticleRoute.post('/create', upload.single('image_url'), Create)
ArticleRoute.put('/update/:articleId', upload.single('image_url'), Update)
ArticleRoute.delete('/delete/:articleId', Delete)
