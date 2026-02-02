import z from 'zod'

export const CreateReviewSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5"),
  comment: z.string().optional()
})

export type CreateReviewType = z.infer<typeof CreateReviewSchema>

export const UpdateReviewSchema = z.object({
  rating: z.number().min(1, "Rating must be at least 1").max(5, "Rating must be at most 5").optional(),
  comment: z.string().optional()
})

export type UpdateReviewType = z.infer<typeof UpdateReviewSchema>