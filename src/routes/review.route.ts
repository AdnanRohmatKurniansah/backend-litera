import { Router } from 'express'
import { userAuthenticate } from '../middlewares/user.auth'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'
import {
  GetBookReviewsController,
  GetUserReviewsController,
  GetReviewById,
  CreateReviewController,
  UpdateReviewController,
  DeleteReviewController,
  AdminDeleteReviewController,
  GetBookRating
} from '../controllers/review.controller'

export const ReviewRoute: Router = Router()

// Public routes
ReviewRoute.get('/book/:bookId', GetBookReviewsController)
ReviewRoute.get('/book/:bookId/rating', GetBookRating)

// Protected routes - User
ReviewRoute.use(userAuthenticate)

ReviewRoute.get('/my-reviews', GetUserReviewsController)
ReviewRoute.get('/:reviewId', GetReviewById)
ReviewRoute.post('/create', CreateReviewController)
ReviewRoute.put('/update/:reviewId', UpdateReviewController)
ReviewRoute.delete('/delete/:reviewId', DeleteReviewController)

// Protected routes - Admin
ReviewRoute.use('/admin', adminAuthenticate, checkRole(['Superadmin', 'Staff']))

ReviewRoute.delete('/admin/delete/:reviewId', AdminDeleteReviewController)
