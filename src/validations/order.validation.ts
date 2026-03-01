import z from 'zod'

export const GetCostSchema = z.object({
  destination: z.string().min(1, 'Destination Id is required'),
  weight: z.number().min(1, 'Weight is required'),
  courier: z.enum(['jne', 'pos', 'tiki', 'jnt', 'sicepat', 'ninja'])
})

export type GetCostType = z.infer<typeof GetCostSchema>

export const CheckoutSchema = z.object({
  addressId: z.string().min(1, 'Address Id is required'),
  courier: z.enum(['jne', 'pos', 'tiki', 'jnt', 'sicepat', 'ninja']),
  service: z.string().min(1, 'Service is required'),
  note: z.string().optional(),
  itemIds: z.array(z.string()).optional()
})

export type CheckoutType = z.infer<typeof CheckoutSchema>

