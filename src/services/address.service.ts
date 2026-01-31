import { prisma } from '../lib/prisma'
import { AddressDto } from '../types'

export const GetAddressByUser = async (userId: string) => {
  return prisma.address.findMany({
    where: {
      userId
    },
    orderBy: {
      created_at: 'desc'
    }
  })
}

export const CreateNew = async (userId: string, payload: AddressDto) => {
  return await prisma.address.create({
    data: {
      ...payload,
      userId
    }
  })
}

export const GetAddressById = async (id: string) => {
  return await prisma.address.findUnique({
    where: {
      id
    }
  })
}

export const UpdateAddress = async (id: string, payload: Partial<AddressDto>) => {
  return await prisma.address.update({
    where: {
      id
    },
    data: payload
  })
}

export const DeleteAddress = async (id: string) => {
  return await prisma.address.delete({
    where: {
      id
    }
  })
}
