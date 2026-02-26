import z from 'zod'

export const AddressCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  phone: z.string().min(1, 'Phone is required').max(30, 'Max Character 30'),
  province: z.string().min(1, 'Province is required'),
  city_id: z.string().min(1, 'City Id is required'),
  city: z.string().min(1, 'City is required'),
  district_id: z.string().min(1, 'District Id is required'),
  district: z.string().min(1, 'District is required'),
  street: z.string().min(1, 'Street is required'),
  zip: z.string().min(1, 'Zip is required'),
  is_primary: z.boolean().optional()
})

export const AddressUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150).optional(),
  phone: z.string().min(1, 'Phone is required').max(30, 'Max Character 30').optional(),
  province: z.string().min(1, 'Province is required').optional(),
  city: z.string().min(1, 'City is required').optional(),
  district: z.string().min(1, 'District is required').optional(),
  street: z.string().min(1, 'Street is required').optional(),
  zip: z.string().min(1, 'Zip is required').optional(),
  is_primary: z.boolean().optional()
})
