import { CalculateShippingCost } from '../services/order.service'
import { errorResponse, logError, successResponse } from '../utils/response'
import { GetCostSchema } from '../validations/order.validation'
import { type Request, type Response } from 'express'

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
