import { prisma } from '../lib/prisma'

export const GetDashboardStats = async () => {
  const [
    totalUsers,
    totalBooks,
    totalOrders,
    totalRevenue,
    pendingOrders,
    completedOrders,
    lowStockBooks,
    recentOrders
  ] = await Promise.all([
    prisma.users.count(),
    prisma.books.count(),
    prisma.order.count(),

    prisma.order.aggregate({
      where: {
        status: {
          in: ['Paid', 'Processing', 'Completed']
        }
      },
      _sum: {
        total: true
      }
    }),

    prisma.order.count({
      where: { status: 'Pending' }
    }),

    prisma.order.count({
      where: { status: 'Completed' }
    }),

    prisma.books.count({
      where: { qty: { lt: 10 } }
    }),

    prisma.order.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        receipt_number: true,
        status: true,
        total: true,
        created_at: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })
  ])

  return {
    overview: {
      totalUsers,
      totalBooks,
      totalOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      pendingOrders,
      completedOrders,
      lowStockBooks
    },
    recentOrders
  }
}

export const GetOrderStats = async () => {
  const statusCounts = await prisma.order.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  })

  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const ordersLast6Months = await prisma.order.findMany({
    where: {
      created_at: {
        gte: sixMonthsAgo
      }
    },
    select: {
      created_at: true,
      total: true
    }
  })

  const monthlyMap = new Map<string, { count: number; revenue: number }>()

  ordersLast6Months.forEach((order) => {
    const month = order.created_at.toISOString().substring(0, 7) // YYYY-MM
    const existing = monthlyMap.get(month) || { count: 0, revenue: 0 }
    monthlyMap.set(month, {
      count: existing.count + 1,
      revenue: existing.revenue + order.total
    })
  })

  const monthly = Array.from(monthlyMap.entries())
    .map(([month, data]) => ({
      month,
      count: data.count,
      revenue: data.revenue
    }))
    .sort((a, b) => b.month.localeCompare(a.month))
    .slice(0, 6)

  return {
    byStatus: statusCounts,
    monthly
  }
}

export const GetTopProducts = async (limit: number = 5) => {
  const topBooks = await prisma.orderItem.groupBy({
    by: ['bookId'],
    _sum: {
      qty: true
    },
    orderBy: {
      _sum: {
        qty: 'desc'
      }
    },
    take: limit
  })

  const bookIds = topBooks.map((item) => item.bookId)
  const books = await prisma.books.findMany({
    where: {
      id: { in: bookIds }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      image_url: true,
      price: true,
      discount_price: true,
      qty: true
    }
  })

  return topBooks.map((item) => {
    const book = books.find((b) => b.id === item.bookId)
    return {
      book,
      totalSold: item._sum.qty || 0
    }
  })
}

export const GetLowStockBooks = async (threshold: number = 10) => {
  return await prisma.books.findMany({
    where: {
      qty: { lt: threshold }
    },
    select: {
      id: true,
      name: true,
      slug: true,
      image_url: true,
      qty: true,
      price: true
    },
    orderBy: {
      qty: 'asc'
    },
    take: 10
  })
}
