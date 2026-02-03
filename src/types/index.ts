import { Courier, Role } from '@prisma/client'

export interface AdminToken {
  id: string
  name: string
  username: string
  email: string | null
  profile: string | null
  phone: string | null
  role: Role
  tokenVersion: number
}

export interface UserToken {
  id: string
  name?: string | null
  email: string
  profile: string | null
  phone: string | null
  tokenVersion: number
}

export type AdminDto = {
  name: string
  username: string
  email?: string | null
  phone?: string | null
  profile?: string | null
  password: string
  role: Role
}

export type UserDto = {
  name?: string | null
  email: string
  phone?: string | null
  profile?: string | null
  provider: 'Email' | 'Google'
  password: string
}

export type CategoryDto = {
  name: string
  slug: string
  image_url: string
}

export type BookDto = {
  name: string
  slug: string
  desc: string
  author: string
  publisher: string
  published_at: string
  language: string
  page: number
  length: number
  width: number
  weight: number
  price: number
  discount_price?: number
  qty?: number
  categoryId: string
  image_url: string
}

export type ArticleDto = {
  title: string
  slug: string
  content: string
  published_at: string
  image_url: string
}

export type BookImageDto = {
  title: string
  bookId: string
  image_url: string
}

export type AddressDto = {
  name: string
  phone: string
  province: string
  city: string
  district: string
  street: string
  zip: string
  is_primary?: boolean
}

export const courierMap: Record<string, Courier> = {
  jne: Courier.JNE,
  pos: Courier.POS,
  tiki: Courier.Tiki,
  jnt: Courier.JNT,
  sicepat: Courier.SiCepat,
  ninja: Courier.Ninja
}
