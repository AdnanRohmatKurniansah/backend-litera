import { z } from 'zod'

export const AdminCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150, 'Max Character 150'),
  username: z.string().min(1, 'Username is required').max(70, 'Max Character 70'),
  email: z.email().max(100, 'Max Character 100').optional(),
  role: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const AdminUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150, 'Max Character 150').optional(),
  username: z.string().min(1, 'Username is required').max(70, 'Max Character 70').optional(),
  email: z.email().max(100, 'Max Character 100').optional(),
  role: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional()
})

export const AdminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required').max(70, 'Max Character 70'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const AdminProfileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150).optional(),
  phone: z.string().min(1, 'Phone is required').max(30, 'Max Character 30').optional()
})

export const AdminChangePasswordSchema = z.object({
  old_password: z.string().min(6, 'Old Password must be at least 6 characters'),
  new_password: z.string().min(6, 'New Password must be at least 6 characters')
})
