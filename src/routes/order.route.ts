import { Router } from 'express'
import { userAuthenticate } from '../middlewares/user.auth'
import {
  Arrived,
  Checkout,
  Delete,
  GetAll,
  GetById,
  GetShippingCost,
  PaymentCallback,
  Process
} from '../controllers/order.controller'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'

export const OrderRoute: Router = Router()

OrderRoute.post('/callback', PaymentCallback)

// Protected Routes User
OrderRoute.use(userAuthenticate)

OrderRoute.post('/cost', GetShippingCost)
OrderRoute.post('/checkout', Checkout)
OrderRoute.get('/arrived/:orderId', Arrived)

// Protected Routes Admin
OrderRoute.use(adminAuthenticate, checkRole(['Superadmin', 'Staff']))

OrderRoute.get('/', GetAll)
OrderRoute.get('/detail/:orderId', GetById)
OrderRoute.get('/process/:orderId', Process)
OrderRoute.delete('/delete/:orderId', Delete)
