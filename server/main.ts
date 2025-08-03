import { Elysia } from 'elysia';
import { authRoutes } from './routes/auth';
import { cartRoutes } from './routes/cart';
import { receiptRoutes } from './routes/receipt';
import { smartListRoutes } from './routes/smartlist';

const app = new Elysia()
  .onRequest(({ request }) => {
    console.log(`${request.method} ${new URL(request.url).pathname}`);
  })
  .get('/favicon.ico', () => {
    console.log('Favicon requested');
    return new Response(null, { status: 204 });
  })
  .get('/', () => {
    return { message: 'QponAI API is running!' };
  })
  .use(authRoutes)
  .use(cartRoutes)
  .use(smartListRoutes)
  .use(receiptRoutes)
  .onError(({ code, error }) => {
    console.log('Error:', code, error);
    if (code === 'NOT_FOUND') {
      return { error: 'Route not found' };
    }
    return { error: 'Internal server error' };
  })

app.listen(3000)
console.log("🧠 QponAI backend running on http://localhost:3000")