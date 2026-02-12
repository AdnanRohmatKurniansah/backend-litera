import { type Request, type Response } from 'express'
import { deleteFromCloudinary, uploadToCloudinary } from '../lib/cloudinary'
import { slugify } from '../utils/help-func'
import {
  CreateBook,
  CreateBookImage,
  DeleteBook,
  DeleteBookImage,
  GetAllBook,
  GetBook,
  GetBookByFilter,
  GetBookImageById,
  GetBookImages,
  GetDiscountedBook,
  GetUniqueBook,
  UpdateBook,
  UpdateBookImage
} from '../services/book.service'
import {
  BookCreateSchema,
  BookImageCreateSchema,
  BookImageUpdateSchema,
  BookUpdateSchema
} from '../validations/book.validation'
import { GetCategory } from '../services/category.service'
import { errorResponse, logError, successResponse } from '../utils/response'

export const GetAll = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page || 1)
    const limit = Number(req.query.limit || 10)

    const { data, total } = await GetAllBook(page, limit)

    return successResponse(res, "Book's Data", {
      data,
      total,
      page,
      limit
    })
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error')
  }
}

export const GetById = async (req: Request, res: Response) => {
  try {
    const bookId = String(req.params.bookId)

    const data = await GetBook(bookId)

    return successResponse(res, "Book's Detail Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error')
  }
}

export const GetBySlug = async (req: Request, res: Response) => {
  try {
    const slug = String(req.params.slug)

    const data = await GetUniqueBook(slug)

    return successResponse(res, "Book's Detail Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetByFilter = async (req: Request, res: Response) => {
  try {
    const { keyword = '', category, language, minPrice, maxPrice, page = 1, sortBy = 'newest', limit = 10 } = req.query

    const data = await GetBookByFilter(
      String(keyword),
      String(category || ''),
      String(language || ''),
      Number(minPrice),
      Number(maxPrice),
      Number(page),
      String(sortBy),
      Number(limit)
    )

    return successResponse(res, "Book's Filter Data", {
      data,
      page: Number(page),
      limit: Number(limit)
    })
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetDiscounted = async (req: Request, res: Response) => {
  try {
    const data = await GetDiscountedBook(30)

    return successResponse(res, "Discounted Book's Data", {
      data
    })
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Create = async (req: Request, res: Response) => {
  try {
    const requestData = await req.body
    const imageFile = req.file

    const validationData = BookCreateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    if (!imageFile) {
      return errorResponse(res, 'Image is required', 400)
    }

    const existCategory = await GetCategory(requestData.categoryId)

    if (!existCategory) {
      return errorResponse(res, 'Category not found', 404)
    }

    const imageUrl = await uploadToCloudinary(imageFile, 'books')
    const slug = slugify(validationData.data.name)

    const existBook = await GetUniqueBook(slug)

    if (existBook) {
      return errorResponse(res, 'Book already exist', 409)
    }

    const book = await CreateBook({
      ...validationData.data,
      slug,
      image_url: imageUrl
    })

    return successResponse(res, 'Book data created successfully', book)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error')
  }
}

export const Update = async (req: Request, res: Response) => {
  try {
    const bookId = String(req.params.bookId)

    const requestData = await req.body
    const imageFile = req.file

    const existBook = await GetBook(bookId)

    if (!existBook) {
      return errorResponse(res, 'Book data not found', 404)
    }

    const validationData = BookUpdateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 404, validationData.error.format())
    }

    let imageUrl = existBook.image_url

    if (imageFile) {
      await deleteFromCloudinary(existBook.image_url)

      imageUrl = await uploadToCloudinary(imageFile, 'books')
    }

    const existCategory = await GetCategory(requestData.categoryId)

    if (!existCategory) {
      return errorResponse(res, 'Category not found', 404)
    }

    let slug = existBook.slug

    if (validationData.data.name && validationData.data.name !== existBook.name) {
      slug = slugify(validationData.data.name)

      const slugExist = await GetUniqueBook(slug)

      if (slugExist && slugExist.id !== bookId) {
        return errorResponse(res, 'Book already exist', 409)
      }
    }

    const updatedBook = await UpdateBook(bookId, {
      ...validationData.data,
      slug,
      image_url: imageUrl
    })

    return successResponse(res, 'Book data updated successfully', updatedBook)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const Delete = async (req: Request, res: Response) => {
  try {
    const bookId = String(req.params.bookId)

    const existBook = await GetBook(bookId)

    if (!existBook) {
      return errorResponse(res, 'Book data not found', 404)
    }

    await deleteFromCloudinary(existBook.image_url)

    const response = await DeleteBook(bookId)

    return successResponse(res, 'Book data deleted successfully', response)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetAllImages = async (req: Request, res: Response) => {
  try {
    const bookId = String(req.params.bookId)

    const existBook = await GetBook(bookId)

    if (!existBook) {
      return errorResponse(res, 'Book data not found', 404)
    }

    const data = await GetBookImages(bookId)

    return successResponse(res, "Book's Images Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const GetImageById = async (req: Request, res: Response) => {
  try {
    const imageId = String(req.params.imageId)

    const data = await GetBookImageById(imageId)

    return successResponse(res, "Book's Image Detail Data", data)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error')
  }
}

export const CreateImage = async (req: Request, res: Response) => {
  try {
    const bookId = String(req.params.bookId)

    const requestData = await req.body
    const imageFile = req.file

    const existBook = await GetBook(bookId)

    if (!existBook) {
      return errorResponse(res, 'Book data not found', 404)
    }

    const validationData = BookImageCreateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    if (!imageFile) {
      return errorResponse(res, 'Image is required', 400)
    }

    const imageUrl = await uploadToCloudinary(imageFile, 'book-images')

    const bookImage = await CreateBookImage({
      ...validationData.data,
      bookId,
      image_url: imageUrl
    })

    return successResponse(res, 'Book image data created successfully', bookImage)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const UpdateImage = async (req: Request, res: Response) => {
  try {
    const imageId = String(req.params.imageId)

    const requestData = await req.body
    const imageFile = req.file

    const existImage = await GetBookImageById(imageId)

    if (!existImage) {
      return errorResponse(res, 'Book image data not found', 404)
    }

    const validationData = BookImageUpdateSchema.safeParse(requestData)

    if (!validationData.success) {
      return errorResponse(res, 'Validation failed', 400, validationData.error.format())
    }

    let imageUrl = existImage.image_url

    if (imageFile) {
      await deleteFromCloudinary(existImage.image_url)

      imageUrl = await uploadToCloudinary(imageFile, 'book-images')
    }

    const updatedBook = await UpdateBookImage(imageId, {
      ...validationData.data,
      image_url: imageUrl
    })

    return successResponse(res, 'Book data updated successfully', updatedBook)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}

export const DeleteImage = async (req: Request, res: Response) => {
  try {
    const imageId = String(req.params.imageId)

    const existImage = await GetBookImageById(imageId)

    if (!existImage) {
      return errorResponse(res, 'Book image data not found', 404)
    }

    await deleteFromCloudinary(existImage.image_url)

    const response = await DeleteBookImage(imageId)

    return successResponse(res, 'Book image data deleted successfully', response)
  } catch (error) {
    logError(error)
    return errorResponse(res, 'Internal server error', 500)
  }
}
