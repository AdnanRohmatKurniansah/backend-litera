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
  GetBookRating,
  AdminGetUserReviewsController
} from '../controllers/review.controller'

export const ReviewRoute: Router = Router()

// Public routes
ReviewRoute.get('/book/:bookId', GetBookReviewsController)
ReviewRoute.get('/book/:bookId/rating', GetBookRating)

// Protected routes - User

ReviewRoute.get('/my-reviews', userAuthenticate, GetUserReviewsController)
ReviewRoute.get('/:reviewId', userAuthenticate, GetReviewById)
ReviewRoute.post('/create', userAuthenticate, CreateReviewController)
ReviewRoute.put('/update/:reviewId', userAuthenticate, UpdateReviewController)
ReviewRoute.delete('/delete/:reviewIdx', userAuthenticate, DeleteReviewController)

// Protected routes - Admin

ReviewRoute.get('/admin/review', adminAuthenticate, checkRole(['Superadmin', 'Staff']), AdminGetUserReviewsController)
ReviewRoute.delete('/admin/delete/:reviewId', adminAuthenticate, checkRole(['Superadmin', 'Staff']), AdminDeleteReviewController)
