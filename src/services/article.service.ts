import { prisma } from '../lib/prisma'
import { ArticleDto } from '../types'

export const GetAllArticle = async (page: number, limit: number) => {
  const offset = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.articles.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.articles.count()
  ])

  return { data, total }
}

export const GetPublishedArticle = async (page: number, limit: number) => {
  const offset = (page - 1) * limit
  const now = new Date()

  const [data, total] = await Promise.all([
    prisma.articles.findMany({
      where: {
        published_at: {
          gte: now
        }
      },
      skip: offset,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.articles.count({
      where: {
        published_at: {
          gte: now
        }
      }
    })
  ])

  return { data, total }
}

export const GetArticle = async (id: string) => {
  return await prisma.articles.findUnique({
    where: {
      id
    }
  })
}

export const GetUniqueArticle = async (slug: string) => {
  return await prisma.articles.findUnique({
    where: {
      slug
    }
  })
}

export const CreateArticle = async (payload: ArticleDto) => {
  return await prisma.articles.create({
    data: payload
  })
}

export const UpdateArticle = async (id: string, payload: Partial<ArticleDto>) => {
  return await prisma.articles.update({
    where: {
      id
    },
    data: payload
  })
}

export const DeleteArticle = async (id: string) => {
  return await prisma.articles.delete({
    where: {
      id
    }
  })
}
