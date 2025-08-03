import { Elysia } from 'elysia';
import { authRoutes } from './routes/auth';
import { cartRoutes } from './routes/cart';
import { smartListRoutes } from './routes/smartlist';
import { receiptRoutes } from './routes/receipt';

const app = new Elysia()
  .use(authRoutes)
  .use(cartRoutes)
  .use(smartListRoutes)
  .use(receiptRoutes)

app.listen(3000)
console.log("🧠 QponAI backend running on http://localhost:3000")