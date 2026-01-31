import { Router } from 'express'
import { userAuthenticate } from '../middlewares/user.auth'
import { AddToCart, DeleteCart, GetCart, UpdateCart } from '../controllers/cart.controller'

export const CartRoute: Router = Router()

// Protected Routes
CartRoute.use(userAuthenticate)

CartRoute.get('/', GetCart)
CartRoute.post('/add', AddToCart)
CartRoute.put('/item/:cartItemId', UpdateCart)
CartRoute.delete('/item/delete/:cartItemId', DeleteCart)
