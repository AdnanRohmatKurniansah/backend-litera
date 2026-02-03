import { Router } from 'express'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'
import {
  GetDashboardStatsController,
  GetOrderStatsController,
  GetTopProductsController,
  GetLowStockBooksController
} from '../controllers/statistic.controller'

export const StatsRoute = Router()

StatsRoute.use(adminAuthenticate, checkRole(['Superadmin', 'Staff']))

StatsRoute.get('/dashboard', GetDashboardStatsController)
StatsRoute.get('/orders', GetOrderStatsController)
StatsRoute.get('/top-products', GetTopProductsController)
StatsRoute.get('/low-stock', GetLowStockBooksController)
