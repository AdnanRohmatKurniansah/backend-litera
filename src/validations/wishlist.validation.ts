import z from 'zod'

export const AddToWishlistSchema = z.object({
  bookId: z.string().min(1, 'Book Id is required')
})
