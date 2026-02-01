import { Router } from 'express'
import { userAuthenticate } from '../middlewares/user.auth'
import { AddToWishlist, DeleteWishlist, GetWishlist } from '../controllers/wishlist.controller'

export const WishlistRoute: Router = Router()

// Protected Routes
WishlistRoute.use(userAuthenticate)

WishlistRoute.get('/', GetWishlist)
WishlistRoute.post('/add', AddToWishlist)
WishlistRoute.delete('/item/delete/:wishlistItemId', DeleteWishlist)
