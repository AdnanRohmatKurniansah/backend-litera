import {
  AddItemToWishlist,
  DeleteWishlistItem,
  GetWishlistByUser,
  GetOrCreateWishlist
} from '../services/wishlist.service'
import { UserToken } from '../types'
import { errorResponse, logError, successResponse } from '../utils/response'
import { type Request, type Response } from 'express'
import { AddToWishlistSchema } from '../validations/wishlist.validation'

export const GetWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id

    const wishlist = await GetWishlistByUser(userId)

    return successResponse(res, 'Wishlist data', wishlist)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const AddToWishlist = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id
    const validation = AddToWishlistSchema.safeParse(req.body)

    if (!validation.success) {
      return errorResponse(res, 'Validation failed', 400, validation.error.format())
    }

    const { bookId } = validation.data

    const wishlist = await GetOrCreateWishlist(userId)

    const item = await AddItemToWishlist(wishlist.id, bookId)

    return successResponse(res, 'Item added to wishlist', item)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const DeleteWishlist = async (req: Request, res: Response) => {
  try {
    const wishlistItemId = String(req.params.wishlistItemId)

    const wishlistItem = await DeleteWishlistItem(wishlistItemId)

    return successResponse(res, 'Item removed from wishlist', wishlistItem)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}
