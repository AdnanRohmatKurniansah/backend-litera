import z from 'zod'

export const BookCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  categoryId: z.string().min(1, 'Category Id is required'),
  desc: z.string().min(1, 'Desc is required'),
  author: z.string().min(1, 'Author is required').max(150),
  publisher: z.string().min(1, 'Publisher is required').max(150),
  published_at: z.string().min(1, 'Published At is required').transform((val) => {
    return new Date(val).toISOString()
  }),
  language: z.string().min(1, 'Language is required').max(80),
  page: z.coerce.number().min(1, 'Page is required').max(255),
  length: z.coerce.number().min(1, 'Length is required'),
  width: z.coerce.number().min(1, 'Width is required'),
  weight: z.coerce.number().min(1, 'Weight is required'),
  price: z.coerce.number().min(1, 'Price is required'),
  discount_price: z.coerce.number().min(0, 'Discount Price is required').optional(),
  qty: z.coerce.number().min(0, 'Qty is required')
})

export const BookUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200).optional(),
  categoryId: z.string().min(1, 'Category Id is required').optional(),
  desc: z.string().min(1, 'Desc is required').optional(),
  author: z.string().min(1, 'Author is required').max(150).optional(),
  publisher: z.string().min(1, 'Publisher is required').max(150).optional(),
  published_at: z.string().min(1, 'Published At is required').transform((val) => {
      return new Date(val).toISOString()
  }).optional(),
  language: z.string().min(1, 'Language is required').max(80).optional(),
  page: z.coerce.number().min(1, 'Page is required').max(255).optional(),
  length: z.coerce.number().min(1, 'Length is required').optional(),
  width: z.coerce.number().min(1, 'Width is required').optional(),
  weight: z.coerce.number().min(1, 'Weight is required').optional(),
  price: z.coerce.number().min(1, 'Price is required').optional(),
  discount_price: z.coerce.number().min(0, 'Discount Price is required').optional(),
  qty: z.coerce.number().min(0, 'Qty is required').optional()
})

export const BookImageCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200)
})

export const BookImageUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional()
})
