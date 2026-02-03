import { prisma } from '../lib/prisma'

export const GetOrCreateWishlist = async (userId: string) => {
  let wishlist = await prisma.wishlist.findUnique({
    where: { userId }
  })

  if (!wishlist) {
    wishlist = await prisma.wishlist.create({
      data: { userId }
    })
  }

  return wishlist
}

export const GetWishlistByUser = async (userId: string) => {
  return prisma.wishlist.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          book: true
        }
      }
    }
  })
}

export const AddItemToWishlist = async (wishlistId: string, bookId: string) => {
  return prisma.wishlistItem.create({
    data: {
      wishlistId,
      bookId
    }
  })
}

export const DeleteWishlistItem = async (wishlistItemId: string) => {
  return prisma.wishlistItem.delete({
    where: { id: wishlistItemId }
  })
}
