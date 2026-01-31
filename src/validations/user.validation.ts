import z from 'zod'

export const UserLoginSchema = z.object({
  email: z.email().min(1, 'Email is required').max(150, 'Max Character 150'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const UserRegisterSchema = z.object({
  email: z.email().min(1, 'Email is required').max(150, 'Max Character 150'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

export const UserProfileUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150).optional(),
  phone: z.string().min(1, 'Phone is required').max(30, 'Max Character 30').optional()
})

export const UserChangePasswordSchema = z.object({
  old_password: z.string().min(6, 'Old Password must be at least 6 characters'),
  new_password: z.string().min(6, 'New Password must be at least 6 characters')
})
