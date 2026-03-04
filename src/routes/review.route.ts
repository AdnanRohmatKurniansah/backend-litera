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


ReviewRoute.get('/my-reviews', userAuthenticate, GetUserReviewsController)

ReviewRoute.get('/admin', adminAuthenticate, checkRole(['Superadmin', 'Staff']), AdminGetUserReviewsController)

ReviewRoute.post('/create', userAuthenticate, CreateReviewController)

ReviewRoute.get('/:reviewId', userAuthenticate, GetReviewById)
ReviewRoute.put('/update/:reviewId', userAuthenticate, UpdateReviewController)
ReviewRoute.delete('/delete/:reviewId', userAuthenticate, DeleteReviewController)


ReviewRoute.get('/admin/detail/reviewId', adminAuthenticate, checkRole(['Superadmin', 'Staff']), GetReviewById)
ReviewRoute.delete('/admin/delete/:reviewId', adminAuthenticate, checkRole(['Superadmin', 'Staff']), AdminDeleteReviewController)
