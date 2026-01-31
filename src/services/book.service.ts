import { prisma } from '../lib/prisma'
import { BookDto, BookImageDto } from '../types'

export const GetAllBook = async (page: number, limit: number) => {
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.books.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.books.count()
  ])

  return { data, total }
}

export const GetBook = async (id: string) => {
  return await prisma.books.findUnique({
    where: {
      id: id
    }
  })
}

export const GetUniqueBook = async (slug: string) => {
  return await prisma.books.findUnique({
    where: {
      slug
    }
  })
}

export const CreateBook = async (payload: BookDto) => {
  const { categoryId, ...rest } = payload

  return prisma.books.create({
    data: {
      ...rest,
      category: {
        connect: {
          id: categoryId
        }
      }
    }
  })
}

export const UpdateBook = async (id: string, payload: Partial<BookDto>) => {
  return await prisma.books.update({
    where: {
      id
    },
    data: payload
  })
}

export const DeleteBook = async (id: string) => {
  return await prisma.books.delete({
    where: {
      id
    }
  })
}

export const GetBookImages = async (bookId: string) => {
  return await prisma.bookImages.findMany({
    where: {
      bookId
    }
  })
}

export const GetBookImageById = async (id: string) => {
  return await prisma.bookImages.findUnique({
    where: {
      id
    }
  })
}

export const CreateBookImage = async (payload: BookImageDto) => {
  return await prisma.bookImages.create({
    data: payload
  })
}

export const UpdateBookImage = async (id: string, payload: Partial<BookImageDto>) => {
  return await prisma.bookImages.update({
    where: {
      id
    },
    data: payload
  })
}

export const DeleteBookImage = async (id: string) => {
  return await prisma.bookImages.delete({
    where: {
      id
    }
  })
}
