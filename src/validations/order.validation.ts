import z from 'zod'

export const GetCostSchema = z.object({
  origin: z.string().min(1),
  destination: z.string().min(1),
  weight: z.number().min(1),
  courier: z.enum(['jne', 'pos', 'tiki', 'jnt', 'sicepat', 'ninja', 'pos'])
})

export type GetCostType = z.infer<typeof GetCostSchema>
