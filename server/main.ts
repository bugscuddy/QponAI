import { Elysia } from 'elysia';
import { authRoutes } from './routes/auth';
import { cartRoutes } from './routes/cart';
import { receiptRoutes } from './routes/receipt';
import { smartListRoutes } from './routes/smartlist';
import { couponRoutes } from './routes/coupons';

const app = new Elysia()
  .onRequest(({ request, set }) => {
    console.log(`${request.method} ${new URL(request.url).pathname}`);

    // Add CORS headers
    set.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
  })
  .options('*', ({ set }) => {
    // Handle preflight requests
    set.headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };
    return new Response(null, { status: 204 });
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
  .use(couponRoutes)
  .onError(({ code, error }) => {
    console.log('Error:', code, error);
    if (code === 'NOT_FOUND') {
      return { error: 'Route not found' };
    }
    return { error: 'Internal server error' };
  })

app.listen(3000)
console.log("🧠 QponAI backend running on http://localhost:3000")