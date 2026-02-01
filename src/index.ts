import { NODE_ENV, PORT } from './config'
import createServer from './lib/server'

const app = createServer()

if (NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
