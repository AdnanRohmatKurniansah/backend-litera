import { prisma } from '../lib/prisma'
import { UserDto } from '../types'

export const GetUser = async (id: string) => {
  return await prisma.users.findUnique({
    where: {
      id
    },
    omit: {
      password: true
    }
  })
}

export const GetUserWithPassword = async (id: string) => {
  return await prisma.users.findUnique({
    where: {
      id
    }
  })
}

export const GetUniqueUser = async (email: string) => {
  return await prisma.users.findUnique({
    where: {
      email
    }
  })
}

export const CreateUser = async (payload: UserDto) => {
  return await prisma.users.create({
    data: payload,
    omit: {
      password: true
    }
  })
}

export const CreateUserWithPassword = async (payload: UserDto) => {
  return await prisma.users.create({
    data: payload
  })
}

export const UpdateUser = async (id: string, payload: Partial<UserDto>) => {
  return await prisma.users.update({
    where: {
      id
    },
    data: payload,
    omit: {
      password: true
    }
  })
}
