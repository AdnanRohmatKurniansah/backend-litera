import { Response } from 'express'

export const successResponse = (res: Response, message: string, data?: unknown, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  })
}

export const errorResponse = (res: Response, message: string, statusCode = 500, errors?: unknown) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors
  })
}

export const logError = (error: unknown) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(error)
  }
}
