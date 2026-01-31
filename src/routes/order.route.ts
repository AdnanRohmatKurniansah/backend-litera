import { Router } from 'express'
import { userAuthenticate } from '../middlewares/user.auth'
import { GetShippingCost } from '../controllers/order.controller'

export const OrderRoute = Router()

OrderRoute.post('/cost', userAuthenticate, GetShippingCost)
