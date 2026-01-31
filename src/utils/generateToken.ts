import jwt from 'jsonwebtoken'
import { JWT_ACCESS_TOKEN } from '../config'
import { AdminToken, UserToken } from '../types'

export const AdminAccessToken = (payload: AdminToken): string => {
  return jwt.sign(payload, JWT_ACCESS_TOKEN as string, {
    expiresIn: '7d'
  })
}

export const UserAccessToken = (payload: UserToken): string => {
  return jwt.sign(payload, JWT_ACCESS_TOKEN as string, {
    expiresIn: '7d'
  })
}
