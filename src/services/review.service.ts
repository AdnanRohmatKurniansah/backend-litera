import { prisma } from '../lib/prisma'
import { CreateReviewType, UpdateReviewType } from '../validations/review.validation'

export const GetBookReviews = async (bookId: string, page: number, limit: number) => {
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where: { bookId },
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: true
          }
        }
      }
    }),
    prisma.review.count({ where: { bookId } })
  ])

  return { data, total }
}

export const GetUserReviews = async (userId: string, page: number, limit: number) => {
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where: { userId },
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        book: {
          select: {
            id: true,
            name: true,
            slug: true,
            image_url: true,
            price: true,
            discount_price: true
          }
        }
      }
    }),
    prisma.review.count({ where: { userId } })
  ])

  return { data, total }
}

export const GetReview = async (id: string) => {
  return await prisma.review.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          profile: true
        }
      },
      book: {
        select: {
          id: true,
          name: true,
          slug: true,
          image_url: true
        }
      }
    }
  })
}

export const CreateReview = async (userId: string, payload: CreateReviewType) => {
  return await prisma.review.create({
    data: {
      userId,
      bookId: payload.bookId,
      rating: payload.rating,
      comment: payload.comment
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          profile: true
        }
      },
      book: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  })
}

export const UpdateReview = async (reviewId: string, userId: string, payload: UpdateReviewType) => {
  return await prisma.review.update({
    where: { id: reviewId },
    data: {
      rating: payload.rating,
      comment: payload.comment
    },
    include: {
      book: {
        select: {
          id: true,
          name: true,
          slug: true
        }
      }
    }
  })
}

export const DeleteReview = async (reviewId: string, userId: string) => {
  return await prisma.review.delete({
    where: { id: reviewId }
  })
}

export const AdminDeleteReview = async (reviewId: string) => {
  return await prisma.review.delete({
    where: { id: reviewId }
  })
}

export const GetBookAverageRating = async (bookId: string) => {
  const result = await prisma.review.aggregate({
    where: { bookId },
    _avg: {
      rating: true
    },
    _count: {
      rating: true
    }
  })

  return {
    averageRating: result._avg.rating || 0,
    totalReviews: result._count.rating
  }
}