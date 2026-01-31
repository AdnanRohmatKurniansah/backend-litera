import { type Response, type Request, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_ACCESS_TOKEN } from '../config'
import { AdminToken } from '../types'
import { GetAdmin } from '../services/admin.service'
import { errorResponse } from '../utils/response'

export const adminAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader: string | undefined = req?.headers.authorization

  if (!authorizationHeader) {
    return errorResponse(res, 'Access denied, no token provided', 403)
  }

  const token = authorizationHeader.split(' ')[1]

  try {
    const decoded: any = jwt.verify(token, JWT_ACCESS_TOKEN as string)

    const admin = await GetAdmin(decoded.id)

    if (!admin || admin.tokenVersion !== decoded.tokenVersion) {
      return errorResponse(res, 'Token expired or invalid', 401)
    }

    const extendedReq = req as Request & {
      admin?: AdminToken
    }

    extendedReq.admin = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      profile: admin.profile,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
      tokenVersion: admin.tokenVersion
    }

    next()
  } catch (error) {
    return errorResponse(res, 'Invalid token', 401, error)
  }
}

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const extendedReq = req as Request & {
      admin?: AdminToken
    }

    if (!extendedReq.admin) {
      return errorResponse(res, 'Unauthorized', 401)
    }

    const userRole = extendedReq.admin.role

    if (roles.includes(userRole)) {
      return next()
    }

    return errorResponse(res, `Access denied. Required role: ${roles.join(' or ')}`, 403)
  }
}
