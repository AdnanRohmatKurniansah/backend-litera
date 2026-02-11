import { prisma } from '../lib/prisma'
import { AdminDto } from '../types'

export const GetAllAdmin = async (currentAdminId: string, page: number, limit: number) => {
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.admin.findMany({
      where: {
        id: {
          not: currentAdminId
        },
        role: {
          not: 'Superadmin'
        }
      },
      omit: {
        password: true
      },
      skip: offset,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.admin.count()
  ])

  return { data, total }
}

export const GetAdmin = async (id: string) => {
  return await prisma.admin.findUnique({
    where: {
      id
    },
    omit: {
      password: true
    }
  })
}

export const GetAdminWithPassword = async (id: string) => {
  return await prisma.admin.findUnique({
    where: {
      id
    }
  })
}

export const GetUniqueAdmin = async (username: string) => {
  return await prisma.admin.findUnique({
    where: {
      username
    }
  })
}

export const CreateAdmin = async (payload: AdminDto) => {
  return await prisma.admin.create({
    data: payload,
    omit: {
      password: true
    }
  })
}

export const UpdateAdmin = async (id: string, payload: Partial<AdminDto>) => {
  return await prisma.admin.update({
    where: {
      id
    },
    data: payload,
    omit: {
      password: true
    }
  })
}

export const DeleteAdmin = async (id: string) => {
  return await prisma.admin.delete({
    where: {
      id
    },
    omit: {
      password: true
    }
  })
}
