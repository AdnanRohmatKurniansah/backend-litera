import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const PLACEHOLDER_IMAGE =
  'https://placehold.co/800x1200'

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const existingAdmin = await prisma.admin.findFirst({
    where: { role: 'Superadmin' }
  })

  if (!existingAdmin) {
    await prisma.admin.create({
      data: {
        name: 'Adnan Pundong',
        username: 'mugetsu',
        email: 'superadmin@example.com',
        password: hashedPassword,
        role: 'Superadmin'
      }
    })
  }

  const userPassword = await bcrypt.hash('user123', 10)

  await prisma.users.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'User Demo',
      email: 'user@example.com',
      password: userPassword,
      provider: 'Email'
    }
  })

  const categoriesData = [
    { name: 'Novel', slug: 'novel' },
    { name: 'Komik', slug: 'komik' },
    { name: 'Pendidikan', slug: 'pendidikan' },
    { name: 'Teknologi', slug: 'teknologi' },
    { name: 'Anak', slug: 'anak' }
  ]

  const categories = []

  for (const cat of categoriesData) {
    const category = await prisma.categories.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug,
        image_url: PLACEHOLDER_IMAGE
      }
    })
    categories.push(category)
  }

  const booksData = [
    {
      name: 'Belajar TypeScript',
      slug: 'belajar-typescript',
      desc: 'Panduan lengkap TypeScript',
      author: 'Adnan',
      publisher: 'Alpha Books',
      language: 'Indonesia',
      price: 120000,
      discount_price: 95000
    },
    {
      name: 'Express.js Mastery',
      slug: 'expressjs-mastery',
      desc: 'Backend Express modern',
      author: 'Noritoshi',
      publisher: 'Alpha Books',
      language: 'English',
      price: 150000
    },
    {
      name: 'MongoDB untuk Pemula',
      slug: 'mongodb-pemula',
      desc: 'Belajar MongoDB dari nol',
      author: 'Noritoshi',
      publisher: 'Alpha Books',
      language: 'Indonesia',
      price: 100000
    },
    {
      name: 'Clean Code',
      slug: 'clean-code',
      desc: 'Menulis kode yang bersih',
      author: 'Robert C. Martin',
      publisher: 'Prentice Hall',
      language: 'English',
      price: 200000
    }
  ]

  for (let i = 0; i < booksData.length; i++) {
    await prisma.books.upsert({
      where: { slug: booksData[i].slug },
      update: {},
      create: {
        ...booksData[i],
        categoryId: categories[i % categories.length].id,
        published_at: new Date('2024-01-01'),
        page: 300,
        length: 20,
        width: 14,
        weight: 0.5,
        image_url: PLACEHOLDER_IMAGE
      }
    })
  }

  const articlesData = [
    {
      title: 'Kenapa Harus Baca Buku?',
      slug: 'kenapa-harus-baca-buku'
    }
  ]

  for (const article of articlesData) {
    await prisma.articles.upsert({
      where: { slug: article.slug },
      update: {},
      create: {
        title: article.title,
        slug: article.slug,
        content: 'Ini adalah konten artikel contoh.',
        image_url: PLACEHOLDER_IMAGE,
        published_at: new Date()
      }
    })
  }

  console.log('Seeding finished')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
