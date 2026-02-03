import { type Request, type Response } from 'express'
import { GetDashboardStats, GetOrderStats, GetTopProducts, GetLowStockBooks } from '../services/statistic.service'
import { errorResponse, logError, successResponse } from '../utils/response'

export const GetDashboardStatsController = async (req: Request, res: Response) => {
  try {
    const data = await GetDashboardStats()

    return successResponse(res, 'Dashboard statistics', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetOrderStatsController = async (req: Request, res: Response) => {
  try {
    const data = await GetOrderStats()

    return successResponse(res, 'Order statistics', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetTopProductsController = async (req: Request, res: Response) => {
  try {
    const limit = Number(req.query.limit || 5)
    const data = await GetTopProducts(limit)

    return successResponse(res, 'Top selling products', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetLowStockBooksController = async (req: Request, res: Response) => {
  try {
    const threshold = Number(req.query.threshold || 10)
    const data = await GetLowStockBooks(threshold)

    return successResponse(res, 'Low stock books', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}
