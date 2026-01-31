import z from 'zod'

export const ArticleCreateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().min(1, 'Content is required'),
  published_at: z.string().min(1, 'Published At is required').max(80)
})

export const ArticleUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200).optional(),
  content: z.string().min(1, 'Content is required').optional(),
  published_at: z.string().min(1, 'Published At is required').max(80).optional()
})
