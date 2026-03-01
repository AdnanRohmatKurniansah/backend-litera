import { Router } from 'express'
import { userAuthenticate } from '../middlewares/user.auth'
import {
  Arrived,
  Cancel,
  Checkout,
  Delete,
  GetAll,
  GetById,
  GetMyOrders,
  GetShippingCost,
  PaymentCallback,
  Process
} from '../controllers/order.controller'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'

export const OrderRoute: Router = Router()

OrderRoute.post('/callback', PaymentCallback)

// Protected Routes User
OrderRoute.use(userAuthenticate)

OrderRoute.get('/my-orders', GetMyOrders)
OrderRoute.post('/cost', GetShippingCost)
OrderRoute.post('/checkout', Checkout)
OrderRoute.put('/arrived/:orderId', Arrived)
OrderRoute.put('/cancel/:orderId', Cancel)

// Protected Routes Admin
OrderRoute.use(adminAuthenticate, checkRole(['Superadmin', 'Staff']))

OrderRoute.get('/', GetAll)
OrderRoute.get('/detail/:orderId', GetById)
OrderRoute.get('/process/:orderId', Process)
OrderRoute.delete('/delete/:orderId', Delete)
