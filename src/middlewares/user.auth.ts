import { type Response, type Request, type NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { JWT_ACCESS_TOKEN } from '../config'
import { UserToken } from '../types'
import { errorResponse } from '../utils/response'
import { GetUser } from '../services/user.service'

export const userAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authorizationHeader: string | undefined = req?.headers.authorization

  if (!authorizationHeader) {
    return errorResponse(res, 'Access denied, no token provided', 403)
  }

  const token = authorizationHeader.split(' ')[1]

  try {
    const decoded: any = jwt.verify(token, JWT_ACCESS_TOKEN as string)

    const user = await GetUser(decoded.id)

    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return errorResponse(res, 'Token expired or invalid', 401)
    }

    const extendedReq = req as Request & {
      user?: UserToken
    }

    extendedReq.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      profile: user.profile,
      tokenVersion: user.tokenVersion
    }

    next()
  } catch (error) {
    return errorResponse(res, 'Invalid token', 401, error)
  }
}
