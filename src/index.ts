import { PORT } from './config'
import createServer from './lib/server'

const app = createServer()

app.listen(PORT, () => {
  console.log(`Server is running in port ${PORT}`)
})
