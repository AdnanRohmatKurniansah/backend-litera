import { type Request, type Response } from 'express'
import { deleteFromCloudinary, uploadToCloudinary } from '../lib/cloudinary'
import { slugify } from '../utils/help-func'
import { errorResponse, logError, successResponse } from '../utils/response'
import {
  CreateArticle,
  DeleteArticle,
  GetAllArticle,
  GetArticle,
  GetUniqueArticle,
  UpdateArticle
} from '../services/article.service'
import { ArticleCreateSchema, ArticleUpdateSchema } from '../validations/article.validation'

export const GetAll = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)

    const { data, total } = await GetAllArticle(page, limit)

    return successResponse(res, "Article's Data", {
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
    const categoryId = String(req.params.categoryId)

    const data = await GetArticle(categoryId)

    return successResponse(res, "Article's Detail Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetBySlug = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug)

    const data = await GetUniqueArticle(slug)

    return successResponse(res, "Article's Detail Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Create = async (req: Request, res: Response) => {
  try {
    const requestData = await req.body
    const imageFile = req.file

    const validationData = ArticleCreateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    if (!imageFile) {
      return errorResponse(res, 'Image is required', 400)
    }

    const imageUrl = await uploadToCloudinary(imageFile, 'articles')
    const slug = slugify(validationData.data.title)

    const existArticle = await GetUniqueArticle(slug)

    if (existArticle) {
      return errorResponse(res, 'Article already exist', 409)
    }

    const article = await CreateArticle({
      ...validationData.data,
      slug,
      image_url: imageUrl
    })

    return successResponse(res, 'Article data created successfully', article)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Update = async (req: Request, res: Response) => {
  try {
    const articleId = String(req.params.articleId)

    const requestData = await req.body
    const imageFile = req.file

    const existArticle = await GetArticle(articleId)

    if (!existArticle) {
      return errorResponse(res, 'Article not found', 404)
    }

    const validationData = ArticleUpdateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    let imageUrl = existArticle.image_url
    if (imageFile) {
      await deleteFromCloudinary(existArticle.image_url)

      imageUrl = await uploadToCloudinary(imageFile, 'articles')
    }

    let slug = existArticle.slug

    if (validationData.data.title && validationData.data.title !== existArticle.title) {
      slug = slugify(validationData.data.title)

      const slugExist = await GetUniqueArticle(slug)

      if (slugExist && slugExist.id !== articleId) {
        return errorResponse(res, 'Article already exist', 409)
      }
    }

    const updatedArticle = await UpdateArticle(articleId, {
      ...validationData.data,
      slug,
      image_url: imageUrl
    })

    return successResponse(res, 'Article data updated successfully', updatedArticle)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Delete = async (req: Request, res: Response) => {
  try {
    const articleId = String(req.params.articleId)

    const existArticle = await GetArticle(articleId)

    if (!existArticle) {
      return errorResponse(res, 'Article data not found', 404)
    }

    await deleteFromCloudinary(existArticle.image_url)

    const response = await DeleteArticle(articleId)

    return successResponse(res, 'Article data deleted successfully', response)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}
