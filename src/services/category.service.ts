import { prisma } from '../lib/prisma'
import { CategoryDto } from '../types'

export const GetAllCategory = async (page: number, limit: number) => {
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.categories.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.categories.count()
  ])

  return { data, total }
}

export const GetCategory = async (id: string) => {
  return await prisma.categories.findUnique({
    where: {
      id
    }
  })
}

export const GetUniqueCategory = async (slug: string) => {
  return await prisma.categories.findUnique({
    where: {
      slug
    }
  })
}

export const CreateCategory = async (payload: CategoryDto) => {
  return await prisma.categories.create({
    data: payload
  })
}

export const UpdateCategory = async (id: string, payload: Partial<CategoryDto>) => {
  return await prisma.categories.update({
    where: {
      id
    },
    data: payload
  })
}

export const DeleteCategory = async (id: string) => {
  return await prisma.categories.delete({
    where: {
      id
    }
  })
}
