import z from 'zod'

export const AddToCartSchema = z.object({
  bookId: z.string().min(1, 'Book ID is required'),
  qty: z.number().int().min(1, 'Minimum quantity is 1')
})

export const UpdateCartItemSchema = z.object({
  qty: z.number().int().min(1, 'Minimum quantity is 1')
})
