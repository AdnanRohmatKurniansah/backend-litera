import { type Request, type Response } from 'express'
import { UserToken } from '../types'
import { CreateNew, DeleteAddress, GetAddressById, GetAddressByUser, UpdateAddress } from '../services/address.service'
import { errorResponse, logError, successResponse } from '../utils/response'
import { AddressCreateSchema, AddressUpdateSchema } from '../validations/address.validation'
import { rajaOngkir } from '../lib/rajaongkir'

export const GetAll = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id

    const address = await GetAddressByUser(userId)

    return successResponse(res, 'Address data', address)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Create = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id

    const validation = AddressCreateSchema.safeParse(req.body)

    if (!validation.success) {
      return errorResponse(res, 'Validation failed', 400, validation.error.format())
    }

    const existAddress = await GetAddressByUser(userId)

    if (existAddress.length === 0) {
      validation.data.is_primary = true
    }

    const item = await CreateNew(userId, validation.data)

    return successResponse(res, 'New Address has been added', item)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetById = async (req: Request, res: Response) => {
  try {
    const addressId = String(req.params.addressId)

    const address = await GetAddressById(addressId)

    if (!address) {
      return errorResponse(res, 'Address not found', 404)
    }

    return successResponse(res, 'Address detail data', address)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Update = async (req: Request, res: Response) => {
  try {
    const addressId = String(req.params.addressId)

    const validation = AddressUpdateSchema.safeParse(req.body)

    if (!validation.success) {
      return errorResponse(res, 'Validation failed', 400, validation.error.format())
    }

    const updated = await UpdateAddress(addressId, validation.data)

    return successResponse(res, 'Address has been updated', updated)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const ChangePrimary = async (req: Request, res: Response) => {
  try {
    const userId = (req as Request & { user: UserToken }).user.id

    const addressId = String(req.params.addressId)

    const address = await GetAddressById(addressId)

    if (!address) {
      return errorResponse(res, 'Address not found', 404)
    }

    const userAddresses = await GetAddressByUser(userId)

    for (const addr of userAddresses) {
      if (addr.id === addressId) {
        const updated = await UpdateAddress(addr.id, {
          is_primary: true
        })

        return successResponse(res, 'Primary address has been updated', updated)
      } else if (addr.is_primary) {
        await UpdateAddress(addr.id, { is_primary: false })
      }
    }
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Delete = async (req: Request, res: Response) => {
  try {
    const addressId = String(req.params.addressId)

    const existAddress = await GetAddressById(addressId)

    if (!existAddress) {
      return errorResponse(res, 'Address not found', 404)
    }

    if (existAddress.is_primary) {
      return errorResponse(res, 'Cant delete primary address', 422)
    }

    const deleted = await DeleteAddress(addressId)

    return successResponse(res, 'Address has been deleted', deleted)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetProvinces = async (req: Request, res: Response) => {
  try {
    const { data } = await rajaOngkir.get("/destination/province")
    return successResponse(res, 'Provinces data retrieved', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetCities = async (req: Request, res: Response) => {
  try {
    const { provinceId } = req.params
    const { data } = await rajaOngkir.get(`/destination/city/${provinceId}`)
    return successResponse(res, 'Cities data retrieved', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetDistricts = async (req: Request, res: Response) => {
  try {
    const { cityId } = req.params
    const { data } = await rajaOngkir.get(`/destination/district/${cityId}`)
    return successResponse(res, 'Districts data retrieved', data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}