import {
  UserChangePasswordSchema,
  UserLoginSchema,
  UserProfileUpdateSchema,
  UserRegisterSchema
} from './../validations/user.validation'
import { type Request, type Response } from 'express'
import { compare, hash } from 'bcrypt'
import { UserAccessToken } from '../utils/generateToken'
import { prisma } from '../lib/prisma'
import { errorResponse, logError, successResponse } from '../utils/response'
import {
  CreateUser,
  CreateUserWithPassword,
  GetUniqueUser,
  GetUser,
  GetUserWithPassword,
  UpdateUser
} from '../services/user.service'
import { UserToken } from '../types'
import { deleteFromCloudinary, uploadToCloudinary } from '../lib/cloudinary'
import { generateNameFromEmail } from '../utils/help-func'
import { verifyGoogleToken } from '../lib/google-auth'
import crypto from 'crypto'

export const Register = async (req: Request, res: Response) => {
  try {
    const requestData = await req.body

    const validationData = UserRegisterSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    const userExist = await GetUniqueUser(requestData.email)

    if (userExist) {
      return errorResponse(res, 'Email already exist', 409)
    }

    const hashedPassword = await hash(requestData.password, 10)

    const name = generateNameFromEmail(requestData.email)

    const user = await CreateUser({
      ...requestData,
      name,
      password: hashedPassword
    })
    return successResponse(res, 'User Data created successfully', user)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Login = async (req: Request, res: Response) => {
  try {
    const requestData = await req.body

    const validationData = UserLoginSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    const userExist = await GetUniqueUser(requestData.email)

    if (!userExist) {
      return errorResponse(res, 'User doesnt exist', 404)
    }

    const auth = await compare(requestData.password, userExist.password)

    if (auth) {
      const access_token: string = UserAccessToken({
        id: userExist.id,
        name: userExist.name,
        email: userExist.email,
        profile: userExist.profile,
        phone: userExist.phone,
        tokenVersion: userExist.tokenVersion
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

export const GoogleLogin = async (req: Request, res: Response) => {
  try {
    const { id_token } = req.body

    if (!id_token) {
      return errorResponse(res, 'Google token is required', 400)
    }

    const googleUser = await verifyGoogleToken(id_token)

    let user = await GetUniqueUser(googleUser.email)

    if (!user) {
      user = await CreateUserWithPassword({
        email: googleUser.email,
        name: googleUser.name || generateNameFromEmail(googleUser.email),
        profile: googleUser.picture,
        provider: 'Google',
        password: ''
      })
    }

    const access_token = UserAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
      profile: user.profile,
      phone: user.phone,
      tokenVersion: user.tokenVersion
    })

    return successResponse(res, 'Login with Google successfully', {
      access_token
    })
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Google login failed', 500)
  }
}

export const GetProfile = async (req: Request, res: Response) => {
  try {
    const extendedReq = req as Request & { user: UserToken }

    const user = await GetUser(extendedReq.user.id)

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    return successResponse(res, 'User data', user)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Logout = async (req: Request, res: Response) => {
  const extendedReq = req as Request & { user: UserToken }

  await prisma.users.update({
    where: {
      id: extendedReq.user.id
    },
    data: {
      tokenVersion: extendedReq.user.tokenVersion + 1
    }
  })

  return successResponse(res, 'Logout Successfully')
}

export const UpdateProfile = async (req: Request, res: Response) => {
  try {
    const extendedReq = req as Request & { user: UserToken }
    const userId = extendedReq.user.id

    const requestData = req.body
    const imageFile = req.file

    const validationData = UserProfileUpdateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    const user = await GetUser(userId)

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    let profileUrl = user.profile

    if (imageFile) {
      if (user.profile) {
        await deleteFromCloudinary(user.profile)
      }
      profileUrl = await uploadToCloudinary(imageFile, 'user-images')
    }

    const payload = {
      name: validationData.data.name ?? user.name,
      phone: validationData.data.phone ?? user.phone,
      profile: profileUrl
    }

    const updatedUser = await UpdateUser(userId, payload)

    return successResponse(res, 'Profile updated successfully', updatedUser)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const ChangePassword = async (req: Request, res: Response) => {
  try {
    const extendedReq = req as Request & {
      user: UserToken
    }
    const userId = extendedReq.user.id

    const requestData = await req.body

    const validationData = UserChangePasswordSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    const user = await GetUserWithPassword(userId)

    if (!user) {
      return errorResponse(res, 'User not found', 404)
    }

    if (user.provider === 'Google') {
      return errorResponse(res, 'Password change is not allowed for Google account', 403)
    }

    const auth = await compare(requestData.old_password, user.password)

    if (!auth) {
      return errorResponse(res, 'Current password is incorrect', 401)
    }

    const hashedPassword = await hash(requestData.new_password, 10)

    const payload = {
      password: hashedPassword
    }

    const updatedUser = await UpdateUser(userId, payload)

    return successResponse(res, 'Password changed successfully', updatedUser)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}
