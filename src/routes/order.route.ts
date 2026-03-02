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

OrderRoute.get('/my-orders', userAuthenticate, GetMyOrders)
OrderRoute.post('/cost', userAuthenticate, GetShippingCost)
OrderRoute.post('/checkout', userAuthenticate, Checkout)
OrderRoute.put('/arrived/:orderId', userAuthenticate, Arrived)
OrderRoute.put('/cancel/:orderId', userAuthenticate, Cancel)

OrderRoute.get('/', adminAuthenticate, checkRole(['Superadmin', 'Staff']), GetAll)
OrderRoute.get('/detail/:orderId', adminAuthenticate, checkRole(['Superadmin', 'Staff']), GetById)
OrderRoute.put('/process/:orderId', adminAuthenticate, checkRole(['Superadmin', 'Staff']), Process)
OrderRoute.delete('/delete/:orderId', adminAuthenticate, checkRole(['Superadmin', 'Staff']), Delete)