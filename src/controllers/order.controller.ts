import { OrderStatus, PaymentStatus } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { CalculateShippingCost, CheckoutService, DeleteOrder, GetAllOrder, GetOrder } from '../services/order.service'
import { UserToken } from '../types'
import { errorResponse, logError, successResponse } from '../utils/response'
import { CheckoutSchema, GetCostSchema } from '../validations/order.validation'
import { type Request, type Response } from 'express'
import crypto from 'crypto'
import { MIDTRANS_SERVER_KEY } from '../config'

export const GetAll = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)

    const { data, total } = await GetAllOrder(page, limit)

    return successResponse(res, "Order's Data", {
      data,
      total,
      page,
      limit
    })
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetById = async (req: Request, res: Response) => {
  try {
    const orderId = String(req.params.orderId)

    const data = await GetOrder(orderId)

    return successResponse(res, "Order's Detail Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Delete = async (req: Request, res: Response) => {
  try {
    const orderId = String(req.params.orderId)

    const existOrder = await GetOrder(orderId)

    if (!existOrder) {
      return errorResponse(res, 'Order data not found', 404)
    }

    const response = await DeleteOrder(orderId)

    return successResponse(res, 'Order data deleted successfully', response)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetShippingCost = async (req: Request, res: Response) => {
  try {
    const requestData = await req.body

    const validationData = GetCostSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    const data = await CalculateShippingCost(validationData.data)

    return successResponse(res, 'Shipping cost retrieved', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Checkout = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id

    const requestData = await req.body

    const validation = CheckoutSchema.safeParse(requestData)

    if (!validation.success) {
      return errorResponse(res, 'Validation error', 400, validation.error.format())
    }

    const data = await CheckoutService(userId, validation.data)

    return successResponse(res, 'Checkout success', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const PaymentCallback = async (req: Request, res: Response) => {
  try {
    const { 
      order_id, 
      status_code, 
      gross_amount, 
      signature_key, 
      transaction_status,
      payment_type,
      fraud_status 
    } = req.body

    const serverKey = MIDTRANS_SERVER_KEY || ''
    const input = order_id + status_code + gross_amount + serverKey
    const hash = crypto.createHash('sha512').update(input).digest('hex')

    if (hash !== signature_key) {
      return errorResponse(res, 'Invalid signature key', 403)
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: order_id },
      include: {
        payment: true,
        items: {
          include: { book: true }
        }
      }
    })

    if (!existingOrder) {
      return errorResponse(res, 'Order not found', 404)
    }

    if (existingOrder.payment?.status === 'Paid') {
      return successResponse(res, 'Payment already processed')
    }

    let orderStatus: OrderStatus = "Pending"
    let paymentStatus: PaymentStatus = "Pending"

    if (transaction_status === 'capture') {
      if (fraud_status === 'accept') {
        orderStatus = OrderStatus.Paid
        paymentStatus = PaymentStatus.Paid
      }
    } else if (transaction_status === 'settlement') {
      orderStatus = OrderStatus.Paid
      paymentStatus = PaymentStatus.Paid
    } else if (transaction_status === 'cancel' || 
               transaction_status === 'deny' || 
               transaction_status === 'expire') {
      orderStatus = OrderStatus.Failed
      paymentStatus = PaymentStatus.Failed
    } else if (transaction_status === 'pending') {
      orderStatus = OrderStatus.Pending
      paymentStatus = PaymentStatus.Pending
    }

    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: order_id },
        data: { status: orderStatus }
      })

      await tx.payment.update({
        where: { orderId: order_id },
        data: { 
          status: paymentStatus,
          method: payment_type,
          paid_at: paymentStatus === 'Paid' ? new Date() : null
        }
      })

      if (paymentStatus === 'Paid') {
        for (const item of existingOrder.items) {
          const book = await tx.books.findUnique({
            where: { id: item.bookId }
          })

          await tx.books.update({
            where: { id: item.bookId },
            data: { qty: { decrement: item.qty } }
          })
        }
      }
    })

    return successResponse(res, 'Payment callback processed successfully')
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}


