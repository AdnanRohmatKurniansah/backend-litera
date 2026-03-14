import express, { type Request, type Application, type Response, type NextFunction } from 'express'
import cors from 'cors'
import { AdminRoute } from '../routes/admin.route'
import { CategoryRoute } from '../routes/category.route'
import { BookRoute } from '../routes/book.route'
import { UserRoute } from '../routes/user.route'
import { CartRoute } from '../routes/cart.route'
import { AddressRoute } from '../routes/address.route'
import { OrderRoute } from '../routes/order.route'
import { ArticleRoute } from '../routes/article.route'
import { WishlistRoute } from '../routes/wishlist.route'
import { ReviewRoute } from '../routes/review.route'
import { StatsRoute } from '../routes/statistic.route'
import fs from 'fs'
import path from 'path'

const createServer = () => {
  const swaggerFile = fs.readFileSync(path.join(__dirname, '../../docs/swagger.json'), 'utf-8')
  const swaggerDocument = JSON.parse(swaggerFile)

  const app: Application = express()

  app.use(express.urlencoded({ extended: false }))

  app.use(express.json())

  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://dash-litera.vercel.app',
        'https://litera-hazel.vercel.app',
      ],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  )

  app.get('/api-docs/swagger.json', (_req: Request, res: Response) => {
    res.json(swaggerDocument)
  })
 
  app.get('/api-docs', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html')
    res.send(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Book Store Litera - API Docs</title>
          <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css" />
          <style>
            html { box-sizing: border-box; overflow-y: scroll; }
            *, *:before, *:after { box-sizing: inherit; }
            body { margin: 0; background: #fafafa; }
          </style>
        </head>
        <body>
          <div id="swagger-ui"></div>
          <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js" crossorigin></script>
          <script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-standalone-preset.js" crossorigin></script>
          <script>
            window.onload = function () {
              SwaggerUIBundle({
                url: '/api-docs/swagger.json',
                dom_id: '#swagger-ui',
                presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
                plugins: [SwaggerUIBundle.plugins.DownloadUrl],
                layout: 'StandaloneLayout',
                persistAuthorization: true,
                deepLinking: true,
                displayRequestDuration: true,
                filter: true,
              })
            }
          </script>
        </body>
      </html>`)
  })

  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Welcome to Litera Books API',
      status: 'OK',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    })
  })

  app.use('/api/v1/admin', AdminRoute)
  app.use('/api/v1/category', CategoryRoute)
  app.use('/api/v1/book', BookRoute)
  app.use('/api/v1/article', ArticleRoute)

  app.use('/api/v1/user', UserRoute)
  app.use('/api/v1/cart', CartRoute)
  app.use('/api/v1/wishlist', WishlistRoute)
  app.use('/api/v1/address', AddressRoute)
  app.use('/api/v1/order', OrderRoute)
  app.use('/api/v1/review', ReviewRoute)
  app.use('/api/v1/statistic', StatsRoute)

  // app.get('/api/protected', authenticate, (req: Request, res: Response) => {
  //   res.send('Welcome to the protected route')
  // })

  return app
}

export default createServer
