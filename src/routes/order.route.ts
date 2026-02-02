import { Router } from 'express'
import { userAuthenticate } from '../middlewares/user.auth'
import { Checkout, Delete, GetAll, GetById, GetShippingCost, PaymentCallback } from '../controllers/order.controller'
import { adminAuthenticate, checkRole } from '../middlewares/admin.auth'

export const OrderRoute: Router = Router()

OrderRoute.post('/callback', PaymentCallback)

// Protected Routes User
OrderRoute.use(userAuthenticate)

OrderRoute.post('/cost', GetShippingCost)
OrderRoute.post('/checkout', Checkout)

// Protected Routes Admin
OrderRoute.use(adminAuthenticate, checkRole(['Superadmin', 'Staff']))

OrderRoute.get('/', GetAll)
OrderRoute.get('/detail/:orderId', GetById)
OrderRoute.delete('/delete/:orderId', Delete)