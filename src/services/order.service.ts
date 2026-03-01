import { RAJAONGKIR_ORIGIN } from '../config'
import { snap } from '../lib/midtrans'
import { prisma } from '../lib/prisma'
import { rajaOngkir } from '../lib/rajaongkir'
import { courierMap } from '../types'
import { CheckoutType, GetCostType } from '../validations/order.validation'

export const GetAllOrder = async (page: number, limit: number) => {
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.order.count()
  ])

  return { data, total }
}

export const GetOrder = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      items: { include: { book: true } },
      payment: true,
      shipping: true,
      address: true
    }
  })
}

export const GetUserOrders = async (userId: string, page: number, limit: number) => {
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        items: { include: { book: true } },
        payment: true,
        shipping: true,
        address: true
      }
    }),
    prisma.order.count({ where: { userId } })
  ])

  return { data, total }
}

export const DeleteOrder = async (id: string) => {
  return await prisma.order.delete({
    where: { id }
  })
}

export const CancelOrder = async (id: string, userId: string) => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { payment: true }
  })

  if (!order) throw new Error('Order not found')
  if (order.userId !== userId) throw new Error('Unauthorized')
  if (!['Pending', 'Paid'].includes(order.status)) {
    throw new Error('Order cannot be cancelled at this stage')
  }

  return await prisma.$transaction(async (tx) => {
    await tx.order.update({
      where: { id },
      data: { status: 'Cancelled' }
    })

    if (order.payment) {
      await tx.payment.update({
        where: { orderId: id },
        data: { status: 'Failed' }
      })
    }

    return { message: 'Order cancelled successfully' }
  })
}

export const CalculateShippingCost = async (payload: GetCostType) => {
  const response = await rajaOngkir.post('/calculate/domestic-cost', {
    origin: RAJAONGKIR_ORIGIN,
    destination: payload.destination,
    weight: payload.weight,
    courier: payload.courier
  })

  return response.data
}

export const CheckoutService = async (userId: string, payload: CheckoutType) => {
  const prismaCourier = courierMap[payload.courier]

  const userAddress = await prisma.address.findUnique({
    where: { id: payload.addressId },
    include: { user: true }
  })

  if (!userAddress) throw new Error('User address not found')

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { book: true } } }
  })

  if (!cart || cart.items.length === 0) throw new Error('Cart is empty')

  const checkoutItems = payload.itemIds
    ? cart.items.filter((item) => payload.itemIds!.includes(item.id))
    : cart.items

  if (checkoutItems.length === 0) throw new Error('No items selected for checkout')

  for (const item of checkoutItems) {
    if (item.book.qty < item.qty) {
      throw new Error(`Insufficient "${item.book.name}" book stock`)
    }
  }

  let totalWeight = 0
  let subtotal = 0

  checkoutItems.forEach((item) => {
    totalWeight += item.book.weight * item.qty
    subtotal += (item.book.discount_price ?? item.book.price) * item.qty
  })

  const shipping = await CalculateShippingCost({
    destination: userAddress.city_id,
    weight: Math.ceil(totalWeight),
    courier: payload.courier
  })

  const selectedService = shipping.data.find((s: any) => s.service === payload.service)
  if (!selectedService) throw new Error('Shipping service not found')

  const shippingCost = selectedService.cost
  const total = subtotal + shippingCost

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        userId,
        addressId: payload.addressId,
        total,
        note: payload.note,
        items: {
          create: checkoutItems.map((item) => ({
            bookId: item.bookId,
            qty: item.qty,
            price: item.book.discount_price ?? item.book.price
          }))
        },
        shipping: {
          create: {
            courier: prismaCourier,
            service: payload.service,
            description: selectedService.description,
            cost: shippingCost,
            etd: selectedService.etd
          }
        }
      }
    })

    const parameter = {
      transaction_details: {
        order_id: createdOrder.id,
        gross_amount: total
      },
      credit_card: { secure: true },
      customer_details: {
        first_name: userAddress.name,
        email: userAddress.user.email,
        phone: userAddress.phone
      }
    }

    const transaction = await snap.createTransaction(parameter)

    await tx.payment.create({
      data: {
        orderId: createdOrder.id,
        token: transaction.token
      }
    })

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        id: { in: checkoutItems.map((i) => i.id) }
      }
    })

    return { createdOrder, transaction }
  })

  return {
    orderId: order.createdOrder.id,
    snapToken: order.transaction.token,
    redirectUrl: order.transaction.redirect_url
  }
}

export const ProcessOrder = async (id: string, receipt_number: string) => {
  return prisma.order.update({
    where: { id },
    data: {
      receipt_number,
      status: 'Processing'
    }
  })
}

export const ItemsArrived = async (id: string) => {
  return prisma.order.update({
    where: { id },
    data: { status: 'Completed' }
  })
}