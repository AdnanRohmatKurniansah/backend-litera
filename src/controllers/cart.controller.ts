import { AddItemToCart, DeleteCartItem, GetCartByUser, GetOrCreateCart, UpdateCartItem } from '../services/cart.service'
import { UserToken } from '../types'
import { errorResponse, logError, successResponse } from '../utils/response'
import { type Request, type Response } from 'express'
import { AddToCartSchema, UpdateCartItemSchema } from '../validations/cart.validation'

export const GetCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id

    const cart = await GetCartByUser(userId)

    return successResponse(res, 'Cart data', cart)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const AddToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id
    const validation = AddToCartSchema.safeParse(req.body)

    if (!validation.success) {
      return errorResponse(res, 'Validation failed', 400, validation.error.format())
    }

    const { bookId, qty } = validation.data

    const cart = await GetOrCreateCart(userId)

    const item = await AddItemToCart(cart.id, bookId, qty)

    return successResponse(res, 'Item added to cart', item)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const UpdateCart = async (req: Request, res: Response) => {
  try {
    const cartItemId = String(req.params.cartItemId)
    const validation = UpdateCartItemSchema.safeParse(req.body)

    if (!validation.success) {
      return errorResponse(res, 'Validation failed', 400, validation.error.format())
    }

    const updated = await UpdateCartItem(cartItemId, validation.data.qty)

    return successResponse(res, 'Cart item updated', updated)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const DeleteCart = async (req: Request, res: Response) => {
  try {
    const cartItemId = String(req.params.cartItemId)

    const cartItem = await DeleteCartItem(cartItemId)

    return successResponse(res, 'Item removed from cart', cartItem)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}
