import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10)

  const existingAdmin = await prisma.admin.findFirst({
    where: {
      role: 'Superadmin'
    }
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
    console.log('SuperAdmin created successfully.')
  } else {
    console.log('SuperAdmin is exist')
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
