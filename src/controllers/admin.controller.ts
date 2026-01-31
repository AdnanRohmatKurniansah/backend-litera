import { type Request, type Response } from 'express'
import {
  AdminLoginSchema,
  AdminCreateSchema,
  AdminUpdateSchema,
  AdminProfileUpdateSchema,
  AdminChangePasswordSchema
} from '../validations/admin.validation'
import { compare, hash } from 'bcrypt'
import { AdminAccessToken } from '../utils/generateToken'
import {
  GetUniqueAdmin,
  CreateAdmin,
  GetAdmin,
  DeleteAdmin,
  GetAllAdmin,
  UpdateAdmin,
  GetAdminWithPassword
} from '../services/admin.service'
import { AdminToken } from '../types'
import { prisma } from '../lib/prisma'
import { errorResponse, logError, successResponse } from '../utils/response'
import { deleteFromCloudinary, uploadToCloudinary } from '../lib/cloudinary'

export const Login = async (req: Request, res: Response) => {
  try {
    const requestData = await req.body

    const validationData = AdminLoginSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    const adminExist = await GetUniqueAdmin(requestData.username)

    if (!adminExist) {
      return errorResponse(res, 'Admin doesnt exist', 404)
    }

    const auth = await compare(requestData.password, adminExist.password)

    if (auth) {
      const access_token: string = AdminAccessToken({
        id: adminExist.id,
        name: adminExist.name,
        username: adminExist.username,
        email: adminExist.email,
        profile: adminExist.profile,
        phone: adminExist.phone,
        role: adminExist.role,
        tokenVersion: adminExist.tokenVersion
      })

      return successResponse(res, 'Login successfully', {
        access_token
      })
    } else {
      return errorResponse(res, 'Invalid credentials', 401)
    }
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Logout = async (req: Request, res: Response) => {
  const extendedReq = req as Request & { admin: AdminToken }

  await prisma.admin.update({
    where: {
      id: extendedReq.admin.id
    },
    data: {
      tokenVersion: extendedReq.admin.tokenVersion + 1
    }
  })

  return successResponse(res, 'Logout Successfully')
}

export const GetProfile = async (req: Request, res: Response) => {
  try {
    const extendedReq = req as Request & { admin: AdminToken }

    const admin = await GetAdmin(extendedReq.admin.id)

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404)
    }

    return successResponse(res, 'Admin data', admin)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const UpdateProfile = async (req: Request, res: Response) => {
  try {
    const extendedReq = req as Request & { admin: AdminToken }
    const adminId = extendedReq.admin.id

    const requestData = req.body
    const imageFile = req.file

    const validationData = AdminProfileUpdateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    const admin = await GetAdmin(adminId)

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404)
    }

    let profileUrl = admin.profile

    if (imageFile) {
      if (admin.profile) {
        await deleteFromCloudinary(admin.profile)
      }
      profileUrl = await uploadToCloudinary(imageFile, 'admin-images')
    }

    const payload = {
      name: validationData.data.name ?? admin.name,
      phone: validationData.data.phone ?? admin.phone,
      profile: profileUrl
    }

    const updatedAdmin = await UpdateAdmin(adminId, payload)

    return successResponse(res, 'Profile updated successfully', updatedAdmin)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const ChangePassword = async (req: Request, res: Response) => {
  try {
    const extendedReq = req as Request & {
      admin: AdminToken
    }
    const adminId = extendedReq.admin.id

    const requestData = await req.body

    const validationData = AdminChangePasswordSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    const admin = await GetAdminWithPassword(adminId)

    if (!admin) {
      return errorResponse(res, 'Admin not found', 404)
    }

    const auth = await compare(requestData.old_password, admin.password)

    if (!auth) {
      return errorResponse(res, 'Current password is incorrect', 401)
    }

    const hashedPassword = await hash(requestData.new_password, 10)

    const payload = {
      password: hashedPassword
    }

    const updatedAdmin = await UpdateAdmin(adminId, payload)

    return successResponse(res, 'Password changed successfully', updatedAdmin)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

// CRUD Operations - Superadmin only
export const GetAll = async (req: Request, res: Response) => {
  try {
    const extendedReq = req as Request & {
      admin: AdminToken
    }
    const currentAdminId = extendedReq.admin.id

    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)

    const { data, total } = await GetAllAdmin(currentAdminId, page, limit)

    return successResponse(res, "Admin's Data", {
      data,
      total,
      page,
      limit
    })
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetById = async (req: Request, res: Response) => {
  try {
    const adminId = String(req.params.adminId)

    const data = await GetAdminWithPassword(adminId)

    return successResponse(res, "Admin's Detail Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Create = async (req: Request, res: Response) => {
  try {
    const requestData = await req.body

    const validationData = AdminCreateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    const adminExist = await GetUniqueAdmin(requestData.username)

    if (adminExist) {
      return errorResponse(res, 'Username already exist', 409)
    }

    const hashedPassword = await hash(requestData.password, 10)

    requestData.password = hashedPassword
    const admin = await CreateAdmin(requestData)

    return successResponse(res, 'Admin Data created successfully', admin)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Update = async (req: Request, res: Response) => {
  try {
    const adminId = String(req.params.adminId)

    const existAdmin = await GetAdminWithPassword(adminId)

    if (!existAdmin) {
      return errorResponse(res, 'Admin data not found', 404)
    }

    const requestData = await req.body

    const validationData = AdminUpdateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    if (requestData.username !== existAdmin.username) {
      const adminExist = await GetUniqueAdmin(requestData.username)

      if (adminExist) {
        return errorResponse(res, 'Username already exist', 409)
      }
    }

    if (requestData.password) {
      const hashedPassword = await hash(requestData.password, 10)
      requestData.password = hashedPassword
    }

    const payload = {
      name: requestData.name ?? existAdmin.name,
      username: requestData.username ?? existAdmin.username,
      email: requestData.email ?? existAdmin.email,
      password: requestData.password ?? existAdmin.password,
      role: requestData.role ?? existAdmin.role
    }

    const updatedAdmin = await UpdateAdmin(adminId, payload)

    return successResponse(res, 'Admin data updated successfully', updatedAdmin)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Delete = async (req: Request, res: Response) => {
  try {
    const adminId = String(req.params.adminId)

    const admin = await GetAdmin(adminId)

    if (!admin) {
      return errorResponse(res, 'Admin data not found', 404)
    }

    const response = await DeleteAdmin(adminId)

    return successResponse(res, 'Admin data deleted successfully', response)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}
