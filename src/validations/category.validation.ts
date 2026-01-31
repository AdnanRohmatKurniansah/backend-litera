import { z } from 'zod'

export const CategoryCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80)
})

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(80).optional()
})
