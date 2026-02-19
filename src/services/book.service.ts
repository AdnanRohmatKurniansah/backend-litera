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

export const GetBookByFilter = async (
  keyword: string,
  categorySlug: string,
  language: string,
  minPrice: number,
  maxPrice: number,
  page: number,
  sortBy: string,
  limit: number
) => {
  const offset = (page - 1) * limit

  const where: any = {}

  if (keyword) {
    where.OR = [
      {
        name: {
          contains: keyword,
          mode: 'insensitive'
        }
      },
      {
        desc: {
          contains: keyword,
          mode: 'insensitive'
        }
      }
    ]
  }

  if (categorySlug) {
    where.category = {
      slug: categorySlug
    }
  }

  if (language) {
    where.language = language
  }

  if (minPrice || maxPrice) {
    const priceFilter = [
      {
        discount_price: {
          not: null,
          ...(minPrice ? { gte: minPrice } : {}),
          ...(maxPrice ? { lte: maxPrice } : {})
        }
      },
      {
        discount_price: null,
        price: {
          ...(minPrice ? { gte: minPrice } : {}),
          ...(maxPrice ? { lte: maxPrice } : {})
        }
      }
    ]

    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: priceFilter }]
      delete where.OR
    } else {
      where.OR = priceFilter
    }
  }

  let orderBy: any[] = []

  switch (sortBy) {
    case 'price_low':
      orderBy = [{ discount_price: 'asc' }, { price: 'asc' }]
      break
    case 'price_high':
      orderBy = [{ discount_price: 'desc' }, { price: 'desc' }]
      break
    case 'name_asc':
      orderBy = [{ name: 'asc' }]
      break
    case 'name_desc':
      orderBy = [{ name: 'desc' }]
      break
    case 'oldest':
      orderBy = [{ created_at: 'desc' }]
      break
    case 'newest':
    default:
      orderBy = [{ created_at: 'desc' }]
      break
  }

  return await prisma.books.findMany({
    where,
    orderBy,
    skip: offset,
    take: limit,
    include: {
      category: true
    }
  })
}

export const GetDiscountedBook = async (limit: number) => {
  return await prisma.books.findMany({
    where: {
      discount_price: {
        not: null
      }
    },
    orderBy: {
      created_at: 'desc'
    },
    take: limit
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
