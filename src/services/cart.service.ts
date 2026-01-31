import { prisma } from '../lib/prisma'

export const GetOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId }
  })

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    })
  }

  return cart
}

export const GetCartByUser = async (userId: string) => {
  return prisma.cart.findUnique({
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

export const AddItemToCart = async (cartId: string, bookId: string, qty: number) => {
  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId,
      bookId
    }
  })

  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        qty: existingItem.qty + qty
      }
    })
  }

  return prisma.cartItem.create({
    data: {
      cartId,
      bookId,
      qty
    }
  })
}

export const UpdateCartItem = async (cartItemId: string, qty: number) => {
  return prisma.cartItem.update({
    where: { id: cartItemId },
    data: { qty }
  })
}

export const DeleteCartItem = async (cartItemId: string) => {
  return prisma.cartItem.delete({
    where: { id: cartItemId }
  })
}
