# Book Store Litera API Documentation

RESTful API untuk aplikasi toko buku online yang dibangun dengan Node.js, Express, Prisma ORM, dan MongoDB.

## Base URL
```
http://localhost:{PORT}/api/v1
```

## Tech Stack

- **Runtime**: Node.js dengan TypeScript
- **Framework**: Express.js v5
- **Database**: MongoDB
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: Bcrypt
- **Upload File**: Cloudinary
- **Validation**: Zod
- **Testing**: Jest

---

## Table of Contents

1. [Authentication](#authentication)
2. [Admin Management](#admin-management)
3. [User Management](#user-management)
4. [Books](#books)
5. [Categories](#categories)
6. [Articles](#articles)
7. [Cart](#cart)
8. [Address](#address)
9. [Orders](#orders)
10. [Error Responses](#error-responses)

---

## Authentication

### Admin Login
Login untuk admin atau staff.

**Endpoint:** `POST /admin/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Validation Rules:**
- `username`: Required, max 70 characters
- `password`: Required, minimum 6 characters

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Admin doesnt exist"
}
```

---

### User Register
Registrasi user baru dengan email dan password.

**Endpoint:** `POST /user/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Required, valid email format, max 150 characters
- `password`: Required, minimum 6 characters

**Response Success (200):**
```json
{
  "success": true,
  "message": "User Data created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "user",
    "provider": "Email",
    "profile": null,
    "phone": null,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Email already exist"
}
```

---

### User Login
Login untuk user dengan email dan password.

**Endpoint:** `POST /user/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Required, valid email format, max 150 characters
- `password`: Required, minimum 6 characters

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "User doesnt exist"
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

---

### Google Login
Login menggunakan Google OAuth.

**Endpoint:** `POST /user/login-google`

**Request Body:**
```json
{
  "id_token": "google_id_token_here"
}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Login with Google successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Google token is required"
}
```

**Response Error (500):**
```json
{
  "success": false,
  "message": "Google login failed"
}
```

---

## Admin Management

### Get Admin Profile
Mendapatkan profil admin yang sedang login.

**Endpoint:** `GET /admin/profile`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Admin data",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin Name",
    "username": "admin",
    "email": "admin@example.com",
    "profile": "https://cloudinary.com/profile.jpg",
    "phone": "08123456789",
    "role": "Superadmin",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Admin not found"
}
```

---

### Update Admin Profile
Update profil admin yang sedang login.

**Endpoint:** `POST /admin/update-profile`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name` (optional): string, max 150 characters
- `phone` (optional): string, max 30 characters
- `profile` (optional): image file

**Response Success (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Updated Admin Name",
    "username": "admin",
    "email": "admin@example.com",
    "profile": "https://cloudinary.com/new-profile.jpg",
    "phone": "08123456789",
    "role": "Superadmin"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Admin not found"
}
```

---

### Change Admin Password
Mengubah password admin yang sedang login.

**Endpoint:** `POST /admin/change-password`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "old_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

**Validation Rules:**
- `old_password`: Required, minimum 6 characters
- `new_password`: Required, minimum 6 characters

**Response Success (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin Name",
    "username": "admin"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

---

### Logout Admin
Logout admin dan invalidate token.

**Endpoint:** `POST /admin/logout`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logout Successfully"
}
```

---

### Get All Admins (Superadmin Only)
Mendapatkan daftar semua admin (kecuali admin yang sedang login).

**Endpoint:** `GET /admin?page=1&limit=10`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` (optional): number, default 1
- `limit` (optional): number, default 10

**Response Success (200):**
```json
{
  "success": true,
  "message": "Admin's Data",
  "data": {
    "data": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Staff Name",
        "username": "staff1",
        "email": "staff@example.com",
        "profile": null,
        "phone": null,
        "role": "Staff",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 10
  }
}
```

---

### Get Admin By ID (Superadmin Only)
Mendapatkan detail admin berdasarkan ID.

**Endpoint:** `PUT /admin/:adminId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Admin's Detail Data",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Admin Name",
    "username": "admin2",
    "email": "admin2@example.com",
    "password": "$2b$10$...",
    "profile": null,
    "phone": null,
    "role": "Staff",
    "tokenVersion": 0,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Create Admin (Superadmin Only)
Membuat admin baru.

**Endpoint:** `POST /admin/create`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "New Admin",
  "username": "newadmin",
  "email": "newadmin@example.com",
  "password": "password123",
  "role": "Staff"
}
```

**Validation Rules:**
- `name`: Required, max 150 characters
- `username`: Required, max 70 characters
- `email`: Optional, valid email, max 100 characters
- `password`: Required, minimum 6 characters
- `role`: Optional, default "Staff"

**Response Success (200):**
```json
{
  "success": true,
  "message": "Admin Data created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "New Admin",
    "username": "newadmin",
    "email": "newadmin@example.com",
    "role": "Staff",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Username already exist"
}
```

---

### Update Admin (Superadmin Only)
Update data admin.

**Endpoint:** `PUT /admin/update/:adminId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Updated Admin Name",
  "username": "updatedadmin",
  "email": "updated@example.com",
  "password": "newpassword123",
  "role": "Staff"
}
```

**Validation Rules:**
- All fields are optional
- `name`: max 150 characters
- `username`: max 70 characters
- `email`: valid email, max 100 characters
- `password`: minimum 6 characters

**Response Success (200):**
```json
{
  "success": true,
  "message": "Admin data updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Updated Admin Name",
    "username": "updatedadmin",
    "email": "updated@example.com",
    "role": "Staff"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Admin data not found"
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Username already exist"
}
```

---

### Delete Admin (Superadmin Only)
Menghapus admin.

**Endpoint:** `DELETE /admin/delete/:adminId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Admin data deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "name": "Deleted Admin"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Admin data not found"
}
```

---

## User Management

### Get User Profile
Mendapatkan profil user yang sedang login.

**Endpoint:** `GET /user/profile`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "User data",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "User Name",
    "profile": "https://cloudinary.com/profile.jpg",
    "phone": "08123456789",
    "provider": "Email",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### Update User Profile
Update profil user yang sedang login.

**Endpoint:** `POST /user/update-profile`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name` (optional): string, max 150 characters
- `phone` (optional): string, max 30 characters
- `profile` (optional): image file

**Response Success (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "Updated User Name",
    "profile": "https://cloudinary.com/new-profile.jpg",
    "phone": "08123456789"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "User not found"
}
```

---

### Change User Password
Mengubah password user yang sedang login.

**Endpoint:** `POST /user/change-password`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "old_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

**Validation Rules:**
- `old_password`: Required, minimum 6 characters
- `new_password`: Required, minimum 6 characters

**Response Success (200):**
```json
{
  "success": true,
  "message": "Password changed successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Current password is incorrect"
}
```

**Response Error (403):**
```json
{
  "success": false,
  "message": "Password change is not allowed for Google account"
}
```

---

### Logout User
Logout user dan invalidate token.

**Endpoint:** `POST /user/logout`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Logout Successfully"
}
```

---

## Books

### Get All Books
Mendapatkan daftar semua buku dengan pagination.

**Endpoint:** `GET /book?page=1&limit=10`

**Query Parameters:**
- `page` (optional): number, default 1
- `limit` (optional): number, default 10

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book's Data",
  "data": {
    "data": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Book Title",
        "slug": "book-title",
        "desc": "Book description",
        "author": "Author Name",
        "publisher": "Publisher Name",
        "published_at": "2024-01-01",
        "language": "Indonesia",
        "page": 200,
        "length": 21.0,
        "width": 14.0,
        "weight": 300,
        "price": 100000,
        "discount_price": 85000,
        "qty": 50,
        "image_url": "https://cloudinary.com/book.jpg",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

---

### Get Book By ID
Mendapatkan detail buku berdasarkan ID.

**Endpoint:** `GET /book/:bookId`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book's Detail Data",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Book Title",
    "slug": "book-title",
    "desc": "Book description",
    "author": "Author Name",
    "publisher": "Publisher Name",
    "published_at": "2024-01-01",
    "language": "Indonesia",
    "page": 200,
    "length": 21.0,
    "width": 14.0,
    "weight": 300,
    "price": 100000,
    "discount_price": 85000,
    "qty": 50,
    "image_url": "https://cloudinary.com/book.jpg",
    "category": {
      "id": "507f1f77bcf86cd799439012",
      "name": "Fiction",
      "slug": "fiction"
    },
    "bookImages": [],
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get Book By Slug
Mendapatkan detail buku berdasarkan slug.

**Endpoint:** `GET /book/slug/:slug`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book's Detail Data",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Book Title",
    "slug": "book-title",
    "desc": "Book description",
    "author": "Author Name",
    "publisher": "Publisher Name",
    "published_at": "2024-01-01",
    "language": "Indonesia",
    "page": 200,
    "length": 21.0,
    "width": 14.0,
    "weight": 300,
    "price": 100000,
    "discount_price": 85000,
    "qty": 50,
    "image_url": "https://cloudinary.com/book.jpg"
  }
}
```

---

### Get Books By Filter
Mendapatkan buku dengan filter dan sorting.

**Endpoint:** `GET /book/filter?keyword=&category=&language=&minPrice=&maxPrice=&page=1&sortBy=newest&limit=10`

**Query Parameters:**
- `keyword` (optional): string, search by book name
- `category` (optional): string, filter by category slug
- `language` (optional): string, filter by language
- `minPrice` (optional): number, minimum price
- `maxPrice` (optional): number, maximum price
- `page` (optional): number, default 1
- `sortBy` (optional): string (newest, oldest, price-asc, price-desc, name-asc, name-desc), default "newest"
- `limit` (optional): number, default 10

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book's Filter Data",
  "data": {
    "data": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Book Title",
        "slug": "book-title",
        "price": 100000,
        "discount_price": 85000,
        "image_url": "https://cloudinary.com/book.jpg"
      }
    ],
    "page": 1,
    "limit": 10
  }
}
```

---

### Get Discounted Books
Mendapatkan buku dengan diskon (top 30).

**Endpoint:** `GET /book/discounted`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Discounted Book's Data",
  "data": {
    "data": [
      {
        "id": "507f1f77bcf86cd799439011",
        "name": "Book Title",
        "slug": "book-title",
        "price": 100000,
        "discount_price": 85000,
        "image_url": "https://cloudinary.com/book.jpg"
      }
    ]
  }
}
```

---

### Create Book (Admin Only)
Membuat buku baru.

**Endpoint:** `POST /book/create`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name`: string, required, max 200 characters
- `categoryId`: string, required
- `desc`: string, required
- `author`: string, required, max 150 characters
- `publisher`: string, required, max 150 characters
- `published_at`: string, required
- `language`: string, required, max 80 characters
- `page`: number, required, max 255
- `length`: number, required
- `width`: number, required
- `weight`: number, required
- `price`: number, required
- `discount_price`: number, optional, default 0
- `qty`: number, required
- `image_url`: image file, required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book data created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Book Title",
    "slug": "book-title",
    "desc": "Book description",
    "author": "Author Name",
    "publisher": "Publisher Name",
    "published_at": "2024-01-01",
    "language": "Indonesia",
    "page": 200,
    "length": 21.0,
    "width": 14.0,
    "weight": 300,
    "price": 100000,
    "discount_price": 85000,
    "qty": 50,
    "image_url": "https://cloudinary.com/book.jpg"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Image is required"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Book already exist"
}
```

---

### Update Book (Admin Only)
Update data buku.

**Endpoint:** `PUT /book/update/:bookId`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
All fields are optional:
- `name`: string, max 200 characters
- `categoryId`: string
- `desc`: string
- `author`: string, max 150 characters
- `publisher`: string, max 150 characters
- `published_at`: string
- `language`: string, max 80 characters
- `page`: number, max 255
- `length`: number
- `width`: number
- `weight`: number
- `price`: number
- `discount_price`: number
- `qty`: number
- `image_url`: image file

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book data updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Updated Book Title",
    "slug": "updated-book-title",
    "price": 120000,
    "discount_price": 95000
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Book data not found"
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Book already exist"
}
```

---

### Delete Book (Admin Only)
Menghapus buku.

**Endpoint:** `DELETE /book/delete/:bookId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book data deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Deleted Book"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Book data not found"
}
```

---

### Get Book Images
Mendapatkan semua gambar dari sebuah buku.

**Endpoint:** `GET /book/images/:bookId`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book's Images Data",
  "data": [
    {
      "id": "507f1f77bcf86cd799439013",
      "bookId": "507f1f77bcf86cd799439011",
      "title": "Book Image 1",
      "image_url": "https://cloudinary.com/book-image-1.jpg",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Book data not found"
}
```

---

### Create Book Image (Admin Only)
Menambahkan gambar baru untuk buku.

**Endpoint:** `POST /book/images/:bookId`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `title`: string, required, max 200 characters
- `image_url`: image file, required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book image data created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "bookId": "507f1f77bcf86cd799439011",
    "title": "Book Image 1",
    "image_url": "https://cloudinary.com/book-image-1.jpg"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Image is required"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Book data not found"
}
```

---

### Update Book Image (Admin Only)
Update gambar buku.

**Endpoint:** `PUT /book/images/update/:imageId`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `title` (optional): string, max 200 characters
- `image_url` (optional): image file

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book data updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Updated Book Image",
    "image_url": "https://cloudinary.com/updated-image.jpg"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Book image data not found"
}
```

---

### Delete Book Image (Admin Only)
Menghapus gambar buku.

**Endpoint:** `DELETE /book/images/delete/:imageId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Book image data deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439013",
    "title": "Deleted Image"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Book image data not found"
}
```

---

## Categories

### Get All Categories
Mendapatkan daftar semua kategori dengan pagination.

**Endpoint:** `GET /category?page=1&limit=10`

**Query Parameters:**
- `page` (optional): number, default 1
- `limit` (optional): number, default 10

**Response Success (200):**
```json
{
  "success": true,
  "message": "Category's Data",
  "data": {
    "data": [
      {
        "id": "507f1f77bcf86cd799439012",
        "name": "Fiction",
        "slug": "fiction",
        "image_url": "https://cloudinary.com/category.jpg",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 20,
    "page": 1,
    "limit": 10
  }
}
```

---

### Get Category By ID
Mendapatkan detail kategori berdasarkan ID.

**Endpoint:** `GET /category/:categoryId`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Category's Detail Data",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Fiction",
    "slug": "fiction",
    "image_url": "https://cloudinary.com/category.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get Category By Slug
Mendapatkan detail kategori berdasarkan slug.

**Endpoint:** `GET /category/slug/:slug`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Category's Detail Data",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Fiction",
    "slug": "fiction",
    "image_url": "https://cloudinary.com/category.jpg",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Create Category (Admin Only)
Membuat kategori baru.

**Endpoint:** `POST /category/create`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name`: string, required, max 80 characters
- `image_url`: image file, required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Category data created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Fiction",
    "slug": "fiction",
    "image_url": "https://cloudinary.com/category.jpg"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Image is required"
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Category already exist"
}
```

---

### Update Category (Admin Only)
Update data kategori.

**Endpoint:** `PUT /category/update/:categoryId`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `name` (optional): string, max 80 characters
- `image_url` (optional): image file

**Response Success (200):**
```json
{
  "success": true,
  "message": "Category data updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Updated Fiction",
    "slug": "updated-fiction",
    "image_url": "https://cloudinary.com/updated-category.jpg"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Category not found"
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Category already exist"
}
```

---

### Delete Category (Admin Only)
Menghapus kategori.

**Endpoint:** `DELETE /category/delete/:categoryId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Category data deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439012",
    "name": "Deleted Category"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Category data not found"
}
```

---

## Articles

### Get All Articles
Mendapatkan daftar semua artikel dengan pagination.

**Endpoint:** `GET /article?page=1&limit=10`

**Query Parameters:**
- `page` (optional): number, default 1
- `limit` (optional): number, default 10

**Response Success (200):**
```json
{
  "success": true,
  "message": "Article's Data",
  "data": {
    "data": [
      {
        "id": "507f1f77bcf86cd799439014",
        "title": "Article Title",
        "slug": "article-title",
        "content": "Article content...",
        "image_url": "https://cloudinary.com/article.jpg",
        "published_at": "2024-01-01",
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 10
  }
}
```

---

### Get Article By ID
Mendapatkan detail artikel berdasarkan ID.

**Endpoint:** `GET /article/:articleId`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Article's Detail Data",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "title": "Article Title",
    "slug": "article-title",
    "content": "Article content...",
    "image_url": "https://cloudinary.com/article.jpg",
    "published_at": "2024-01-01",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Get Article By Slug
Mendapatkan detail artikel berdasarkan slug.

**Endpoint:** `GET /article/slug/:slug`

**Response Success (200):**
```json
{
  "success": true,
  "message": "Article's Detail Data",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "title": "Article Title",
    "slug": "article-title",
    "content": "Article content...",
    "image_url": "https://cloudinary.com/article.jpg",
    "published_at": "2024-01-01"
  }
}
```

---

### Create Article (Admin Only)
Membuat artikel baru.

**Endpoint:** `POST /article/create`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `title`: string, required, max 200 characters
- `content`: string, required
- `published_at`: string, required
- `image_url`: image file, required

**Response Success (200):**
```json
{
  "success": true,
  "message": "Article data created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "title": "Article Title",
    "slug": "article-title",
    "content": "Article content...",
    "image_url": "https://cloudinary.com/article.jpg",
    "published_at": "2024-01-01"
  }
}
```

**Response Error (400):**
```json
{
  "success": false,
  "message": "Image is required"
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Article already exist"
}
```

---

### Update Article (Admin Only)
Update data artikel.

**Endpoint:** `PUT /article/update/:articleId`

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `title` (optional): string, max 200 characters
- `content` (optional): string
- `published_at` (optional): string
- `image_url` (optional): image file

**Response Success (200):**
```json
{
  "success": true,
  "message": "Article data updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "title": "Updated Article Title",
    "slug": "updated-article-title",
    "content": "Updated content...",
    "image_url": "https://cloudinary.com/updated-article.jpg"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Article not found"
}
```

**Response Error (409):**
```json
{
  "success": false,
  "message": "Article already exist"
}
```

---

### Delete Article (Admin Only)
Menghapus artikel.

**Endpoint:** `DELETE /article/delete/:articleId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Article data deleted successfully",
  "data": {
    "id": "507f1f77bcf86cd799439014",
    "title": "Deleted Article"
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Article data not found"
}
```

---

## Cart

### Get User Cart
Mendapatkan keranjang belanja user.

**Endpoint:** `GET /cart`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cart data",
  "data": {
    "id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "id": "507f1f77bcf86cd799439016",
        "qty": 2,
        "book": {
          "id": "507f1f77bcf86cd799439011",
          "name": "Book Title",
          "price": 100000,
          "discount_price": 85000,
          "image_url": "https://cloudinary.com/book.jpg"
        }
      }
    ],
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Add Item to Cart
Menambahkan item ke keranjang.

**Endpoint:** `POST /cart/add`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "bookId": "507f1f77bcf86cd799439011",
  "qty": 2
}
```

**Validation Rules:**
- `bookId`: Required, string
- `qty`: Required, integer, minimum 1

**Response Success (200):**
```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": "507f1f77bcf86cd799439016",
    "cartId": "507f1f77bcf86cd799439015",
    "bookId": "507f1f77bcf86cd799439011",
    "qty": 2
  }
}
```

---

### Update Cart Item
Update jumlah item di keranjang.

**Endpoint:** `PUT /cart/item/:cartItemId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "qty": 3
}
```

**Validation Rules:**
- `qty`: Required, integer, minimum 1

**Response Success (200):**
```json
{
  "success": true,
  "message": "Cart item updated",
  "data": {
    "id": "507f1f77bcf86cd799439016",
    "qty": 3
  }
}
```

---

### Delete Cart Item
Menghapus item dari keranjang.

**Endpoint:** `DELETE /cart/item/delete/:cartItemId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "id": "507f1f77bcf86cd799439016"
  }
}
```

---

## Address

### Get User Addresses
Mendapatkan semua alamat user.

**Endpoint:** `GET /address`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Address data",
  "data": [
    {
      "id": "507f1f77bcf86cd799439017",
      "userId": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "phone": "08123456789",
      "province": "Jawa Tengah",
      "city": "Surakarta",
      "district": "Laweyan",
      "street": "Jl. Slamet Riyadi No. 123",
      "zip": "57100",
      "is_primary": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### Get Address By ID
Mendapatkan detail alamat berdasarkan ID.

**Endpoint:** `GET /address/:addressId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Address detail data",
  "data": {
    "id": "507f1f77bcf86cd799439017",
    "name": "John Doe",
    "phone": "08123456789",
    "province": "Jawa Tengah",
    "city": "Surakarta",
    "district": "Laweyan",
    "street": "Jl. Slamet Riyadi No. 123",
    "zip": "57100",
    "is_primary": true
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Address not found"
}
```

---

### Create Address
Membuat alamat baru.

**Endpoint:** `POST /address/create`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "John Doe",
  "phone": "08123456789",
  "province": "Jawa Tengah",
  "city": "Surakarta",
  "district": "Laweyan",
  "street": "Jl. Slamet Riyadi No. 123",
  "zip": "57100",
  "is_primary": false
}
```

**Validation Rules:**
- `name`: Required, max 150 characters
- `phone`: Required, max 30 characters
- `province`: Required
- `city`: Required
- `district`: Required
- `street`: Required
- `zip`: Required
- `is_primary`: Optional, boolean (auto set to true if first address)

**Response Success (200):**
```json
{
  "success": true,
  "message": "New Address has been added",
  "data": {
    "id": "507f1f77bcf86cd799439017",
    "name": "John Doe",
    "phone": "08123456789",
    "province": "Jawa Tengah",
    "city": "Surakarta",
    "district": "Laweyan",
    "street": "Jl. Slamet Riyadi No. 123",
    "zip": "57100",
    "is_primary": true
  }
}
```

---

### Update Address
Update data alamat.

**Endpoint:** `PUT /address/update/:addressId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "name": "Jane Doe",
  "phone": "08198765432",
  "province": "Jawa Tengah",
  "city": "Surakarta",
  "district": "Banjarsari",
  "street": "Jl. Dr. Radjiman No. 456",
  "zip": "57100"
}
```

**Validation Rules:**
All fields are optional:
- `name`: max 150 characters
- `phone`: max 30 characters
- `province`: string
- `city`: string
- `district`: string
- `street`: string
- `zip`: string
- `is_primary`: boolean

**Response Success (200):**
```json
{
  "success": true,
  "message": "Address has been updated",
  "data": {
    "id": "507f1f77bcf86cd799439017",
    "name": "Jane Doe",
    "phone": "08198765432",
    "province": "Jawa Tengah",
    "city": "Surakarta",
    "district": "Banjarsari",
    "street": "Jl. Dr. Radjiman No. 456",
    "zip": "57100"
  }
}
```

---

### Change Primary Address
Mengubah alamat utama.

**Endpoint:** `PUT /address/change-primary/:addressId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Primary address has been updated",
  "data": {
    "id": "507f1f77bcf86cd799439017",
    "is_primary": true
  }
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Address not found"
}
```

---

### Delete Address
Menghapus alamat.

**Endpoint:** `DELETE /address/delete/:addressId`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response Success (200):**
```json
{
  "success": true,
  "message": "Address has been deleted",
  "data": {
    "id": "507f1f77bcf86cd799439017"
  }
}
```

**Response Error (401):**
```json
{
  "success": false,
  "message": "Cant delete primary address"
}
```

**Response Error (404):**
```json
{
  "success": false,
  "message": "Address not found"
}
```

---

## Orders

### Get Shipping Cost
Menghitung biaya pengiriman.

**Endpoint:** `POST /order/cost`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "origin": "501",
  "destination": "114",
  "weight": 1000,
  "courier": "jne"
}
```

**Validation Rules:**
- `origin`: Required, string (city code)
- `destination`: Required, string (city code)
- `weight`: Required, number, minimum 1 (in grams)
- `courier`: Required, enum ["jne", "pos", "tiki", "jnt", "sicepat", "ninja", "pos"]

**Response Success (200):**
```json
{
  "success": true,
  "message": "Shipping cost retrieved",
  "data": {
    "origin": "501",
    "destination": "114",
    "weight": 1000,
    "courier": "jne",
    "costs": [
      {
        "service": "REG",
        "description": "Layanan Reguler",
        "cost": [
          {
            "value": 15000,
            "etd": "2-3",
            "note": ""
          }
        ]
      },
      {
        "service": "YES",
        "description": "Yakin Esok Sampai",
        "cost": [
          {
            "value": 25000,
            "etd": "1-1",
            "note": ""
          }
        ]
      }
    ]
  }
}
```

---

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": {
      "_errors": ["Invalid email format"]
    },
    "password": {
      "_errors": ["Password must be at least 6 characters"]
    }
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### Forbidden (403)
```json
{
  "success": false,
  "message": "Access denied, no token provided"
}
```

or

```json
{
  "success": false,
  "message": "Access denied. Required role: Superadmin or Staff"
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "message": "Resource already exist"
}
```

### Internal Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## Authorization

API menggunakan JWT (JSON Web Tokens) untuk authentication. Setelah login, token akan dikirim dalam response dan harus disertakan dalam header untuk endpoint yang memerlukan authentication:

```
Authorization: Bearer {your-jwt-token}
```

### Token Invalidation
Token akan menjadi invalid ketika:
1. User/Admin melakukan logout (tokenVersion bertambah)
2. Token expired
3. Token dimanipulasi

### Role-Based Access Control

**Admin Roles:**
- **Superadmin**: Full access ke semua endpoint admin
- **Staff**: Access terbatas (tidak bisa CRUD admin lain)

**Protected Routes:**
- Admin routes: Memerlukan admin authentication
- User routes: Memerlukan user authentication
- Create/Update/Delete operations: Hanya admin (Superadmin/Staff)

---

## File Upload

### Supported Image Formats
- JPG/JPEG
- PNG
- GIF
- WebP

### Upload Limits
- Max file size: Sesuai konfigurasi Cloudinary
- Field name untuk upload: `image_url` atau `profile`

### Cloudinary Folders
- `admin-images`: Profile admin
- `user-images`: Profile user
- `books`: Cover buku
- `book-images`: Gambar tambahan buku
- `categories`: Gambar kategori
- `articles`: Gambar artikel

---

## Pagination

Endpoint yang mendukung pagination menggunakan query parameters:
- `page`: Nomor halaman (default: 1)
- `limit`: Jumlah item per halaman (default: 10)

Response format:
```json
{
  "success": true,
  "message": "Data retrieved",
  "data": {
    "data": [...],
    "total": 100,
    "page": 1,
    "limit": 10
  }
}
```

---

## Notes

1. Semua endpoint yang memerlukan file upload menggunakan `multipart/form-data`
2. Token JWT harus disertakan dalam header `Authorization` dengan format `Bearer {token}`
3. Semua response menggunakan format JSON
4. Timestamp menggunakan format ISO 8601
5. Password di-hash menggunakan bcrypt dengan salt rounds 10
6. Slug otomatis di-generate dari nama/title
7. Primary address tidak bisa dihapus, harus diganti dulu ke alamat lain

---

## Development

### Prerequisites
- Node.js v24
- MongoDB
- Cloudinary account
- RajaOngkir API key (untuk shipping cost)

### Environment Variables
```env
NODE_ENV=development/production
PORT=3000
BASE_URL=http://localhost:3000
DATABASE_URL=mongodb://localhost:27017/bookstore
JWT_ACCESS_TOKEN=your-secret-key
JWT_REFRESH_TOKEN=your-refresh-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
RAJAONGKIR_BASE_URL=https://rajaongkir.komerce.id/api/v1
RAJAONGKIR_API_KEY=your-rajaongkir-key
```

### Scripts
```bash
npm run dev          # Development server
npm run build        # Build production
npm start            # Production server
npm test             # Run tests
npm run format       # Format & lint
npm run seed         # Seed database
```

---

## License
MIT

## Contributors
- Adnan Rohmat Kurniansah

## Support
Untuk pertanyaan atau issue, silakan buat issue di repository GitHub.
