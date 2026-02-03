import { type Request, type Response } from 'express'
import {
  CreateReview,
  GetBookReviews,
  GetUserReviews,
  GetReview,
  UpdateReview,
  DeleteReview,
  AdminDeleteReview,
  GetBookAverageRating
} from '../services/review.service'
import { CreateReviewSchema, UpdateReviewSchema } from '../validations/review.validation'
import { errorResponse, logError, successResponse } from '../utils/response'
import { UserToken } from '../types'
import { prisma } from '../lib/prisma'

export const GetBookReviewsController = async (req: Request, res: Response) => {
  try {
    const bookId = String(req.params.bookId)
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)

    const { data, total } = await GetBookReviews(bookId, page, limit)

    return successResponse(res, "Book's Reviews", {
      data,
      total,
      page,
      limit
    })
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetUserReviewsController = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)

    const { data, total } = await GetUserReviews(userId, page, limit)

    return successResponse(res, 'Your Reviews', {
      data,
      total,
      page,
      limit
    })
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetReviewById = async (req: Request, res: Response) => {
  try {
    const reviewId = String(req.params.reviewId)

    const data = await GetReview(reviewId)

    if (!data) {
      return errorResponse(res, 'Review not found', 404)
    }

    return successResponse(res, 'Review Detail', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const CreateReviewController = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id
    const requestData = req.body

    const validation = CreateReviewSchema.safeParse(requestData)

    if (!validation.success) {
      return errorResponse(res, 'Validation error', 400, validation.error.format())
    }

    const book = await prisma.books.findUnique({
      where: { id: requestData.bookId }
    })

    if (!book) {
      return errorResponse(res, 'Book not found', 404)
    }

    const existingReview = await prisma.review.findFirst({
      where: {
        userId,
        bookId: requestData.bookId
      }
    })

    if (existingReview) {
      return errorResponse(res, 'You have already reviewed this book', 409)
    }

    const hasCompletedOrder = await prisma.order.findFirst({
      where: {
        userId,
        status: 'Completed',
        items: {
          some: {
            bookId: requestData.bookId
          }
        }
      }
    })

    if (!hasCompletedOrder) {
      return errorResponse(res, 'You can only review books you have purchased', 403)
    }

    const data = await CreateReview(userId, validation.data)

    return successResponse(res, 'Review created successfully', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const UpdateReviewController = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id
    const reviewId = String(req.params.reviewId)
    const requestData = req.body

    const validation = UpdateReviewSchema.safeParse(requestData)

    if (!validation.success) {
      return errorResponse(res, 'Validation error', 400, validation.error.format())
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return errorResponse(res, 'Review not found', 404)
    }

    if (review.userId !== userId) {
      return errorResponse(res, 'You can only update your own review', 403)
    }

    const data = await UpdateReview(reviewId, validation.data)

    return successResponse(res, 'Review updated successfully', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const DeleteReviewController = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id
    const reviewId = String(req.params.reviewId)

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return errorResponse(res, 'Review not found', 404)
    }

    if (review.userId !== userId) {
      return errorResponse(res, 'You can only update your own review', 403)
    }

    const data = await DeleteReview(reviewId, userId)

    return successResponse(res, 'Review deleted successfully', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const AdminDeleteReviewController = async (req: Request, res: Response) => {
  try {
    const reviewId = String(req.params.reviewId)

    const review = await prisma.review.findUnique({
      where: { id: reviewId }
    })

    if (!review) {
      return errorResponse(res, 'Review not found', 404)
    }

    const data = await AdminDeleteReview(reviewId)

    return successResponse(res, 'Review deleted successfully', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetBookRating = async (req: Request, res: Response) => {
  try {
    const bookId = String(req.params.bookId)

    const data = await GetBookAverageRating(bookId)

    return successResponse(res, "Book's Rating", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}
