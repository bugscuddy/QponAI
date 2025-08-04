import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

// Load environment variables
import 'dotenv/config';

// Import routes
import { authRoutes } from './routes/auth';
import { cartRoutes } from './routes/cart';
import { couponRoutes } from './routes/coupons';
import { receiptRoutes } from './routes/receipt';
import { smartListRoutes } from './routes/smartlist';

// Create the Elysia app with basic configuration
const app = new Elysia()
  // Add Swagger documentation
  .use(
    swagger({
      documentation: {
        info: {
          title: 'QponAI API',
          version: '1.0.0',
          description: 'API documentation for QponAI',
        },
        tags: [
          { name: 'Auth', description: 'Authentication endpoints' },
          { name: 'Cart', description: 'Shopping cart endpoints' },
          { name: 'Coupons', description: 'Coupon management endpoints' },
        ],
      },
    })
  )

  // Enable CORS
  .use(
    cors({
      origin: process.env.CLIENT_URL || /http:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0):[0-9]+/,
      credentials: true,
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      exposeHeaders: ['Authorization'],
    })
  )

  // Health check endpoint
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  }))

  // Root endpoint
  .get('/', () => ({
    message: 'QponAI API is running!',
    documentation: '/swagger',
  }))

  // Add API routes
  .use(authRoutes)
  .use(cartRoutes)
  .use(smartListRoutes)
  .use(receiptRoutes)
  .use(couponRoutes)

  // Global error handler
  .onError(({ code, error, set }) => {
    const isError = (e: unknown): e is Error => e instanceof Error;
    const errorMessage = isError(error) ? error.message : 'An unknown error occurred';

    console.error('API Error:', {
      code,
      message: errorMessage,
      timestamp: new Date().toISOString(),
    });

    // Handle different error types
    if (code === 'VALIDATION') {
      set.status = 400;
      return { success: false, message: 'Validation error' };
    }

    if (code === 'NOT_FOUND') {
      set.status = 404;
      return { success: false, message: 'Resource not found' };
    }

    // Default error response
    set.status = 500;
    return {
      success: false,
      message: 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && { details: errorMessage })
    };
  });

// Start the server
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const host = process.env.HOST || '0.0.0.0';

app.listen(port, () => {
  console.log(`
🚀 QponAI API is running at http://${host}:${port}
📚 API Documentation: http://${host}:${port}/swagger
🌍 Environment: ${process.env.NODE_ENV || 'development'}
`);
});