import { type Request, type Response } from 'express'
import {
  CreateCategory,
  GetCategory,
  DeleteCategory,
  GetAllCategory,
  UpdateCategory,
  GetUniqueCategory
} from '../services/category.service'
import { CategoryCreateSchema, CategoryUpdateSchema } from '../validations/category.validation'
import { deleteFromCloudinary, uploadToCloudinary } from '../lib/cloudinary'
import { slugify } from '../utils/help-func'
import { errorResponse, logError, successResponse } from '../utils/response'

export const GetAll = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)

    const { data, total } = await GetAllCategory(page, limit)

    return successResponse(res, "Category's Data", {
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

    const data = await GetCategory(categoryId)

    return successResponse(res, "Category's Detail Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetBySlug = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug)

    const data = await GetUniqueCategory(slug)

    return successResponse(res, "Category's Detail Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Create = async (req: Request, res: Response) => {
  try {
    const requestData = await req.body
    const imageFile = req.file

    const validationData = CategoryCreateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    if (!imageFile) {
      return errorResponse(res, 'Image is required', 400)
    }

    const imageUrl = await uploadToCloudinary(imageFile, 'categories')
    const slug = slugify(validationData.data.name)

    const existCategory = await GetUniqueCategory(slug)

    if (existCategory) {
      return errorResponse(res, 'Category already exist', 409)
    }

    const category = await CreateCategory({
      ...validationData.data,
      slug,
      image_url: imageUrl
    })

    return successResponse(res, 'Category data created successfully', category)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Update = async (req: Request, res: Response) => {
  try {
    const categoryId = String(req.params.categoryId)

    const requestData = await req.body
    const imageFile = req.file

    const existCategory = await GetCategory(categoryId)

    if (!existCategory) {
      return errorResponse(res, 'Category not found', 404)
    }

    const validationData = CategoryUpdateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    let imageUrl = existCategory.image_url

    if (imageFile) {
      await deleteFromCloudinary(existCategory.image_url)

      imageUrl = await uploadToCloudinary(imageFile, 'categories')
    }

    let slug = existCategory.slug

    if (validationData.data.name && validationData.data.name !== existCategory.name) {
      slug = slugify(validationData.data.name)

      const slugExist = await GetUniqueCategory(slug)

      if (slugExist && slugExist.id !== categoryId) {
        return errorResponse(res, 'Category already exist', 409)
      }
    }

    const updatedCategory = await UpdateCategory(categoryId, {
      ...validationData.data,
      slug,
      image_url: imageUrl
    })

    return successResponse(res, 'Category data updated successfully', updatedCategory)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Delete = async (req: Request, res: Response) => {
  try {
    const categoryId = String(req.params.categoryId)

    const existCategory = await GetCategory(categoryId)

    if (!existCategory) {
      return errorResponse(res, 'Category data not found', 404)
    }

    await deleteFromCloudinary(existCategory.image_url)

    const response = await DeleteCategory(categoryId)

    return successResponse(res, 'Category data deleted successfully', response)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}
