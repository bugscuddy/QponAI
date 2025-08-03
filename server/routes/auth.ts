import { Elysia, t } from 'elysia';
import AuthService from '../lib/auth/service';
import type { JwtPayload } from '../lib/auth/jwt';

// Helper function to handle errors
const handleError = (error: unknown) => ({
  success: false,
  message: error instanceof Error ? error.message : 'An error occurred',
});

// JWT utilities
const jwt = {
  sign: async (payload: JwtPayload) => {
    // In a real app, use your JWT secret from environment variables
    return 'signed-token';
  },
  verify: async (token: string) => {
    // In a real app, verify the JWT token
    return { userId: 'user-id', email: 'user@example.com' } as JwtPayload;
  }
};

const refreshJwt = {
  sign: async (payload: JwtPayload) => {
    // In a real app, use your refresh token secret
    return 'refresh-token';
  },
  verify: async (token: string) => {
    // In a real app, verify the refresh token
    return { userId: 'user-id', email: 'user@example.com' } as JwtPayload;
  }
};

// Create auth service instance
const authService = new AuthService(jwt, refreshJwt);

// Common response schemas
const userResponseSchema = t.Object({
  id: t.String(),
  email: t.String(),
  name: t.Nullable(t.String()),
  phone: t.Nullable(t.String()),
  emailVerified: t.Boolean(),
  cartId: t.Nullable(t.String()),
  createdAt: t.String(),
  updatedAt: t.String(),
});

const tokensResponseSchema = t.Object({
  accessToken: t.String(),
  refreshToken: t.String(),
});

// Create and export auth routes
export const authRoutes = new Elysia({ prefix: '/auth' })
  .decorate('auth', authService)
  .onError(({ error }) => handleError(error))
  
  // Register a new user
  .post(
    '/register',
    async ({ body, auth }) => {
      const result = await auth.register(body);
      // Convert UserResponse to the expected format
      const response = {
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name || null,
            phone: result.user.phone || null,
            emailVerified: result.user.emailVerified,
            cartId: result.user.cartId,
            createdAt: result.user.createdAt,
            updatedAt: result.user.updatedAt,
          },
          tokens: result.tokens,
        },
      };
      return response;
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        name: t.Optional(t.String()),
        phone: t.Optional(t.String()),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            user: t.Object({
              id: t.String(),
              email: t.String(),
              name: t.Nullable(t.String()),
              phone: t.Nullable(t.String()),
              emailVerified: t.Boolean(),
              cartId: t.Nullable(t.String()),
              createdAt: t.String(),
              updatedAt: t.String(),
            }),
            tokens: t.Object({
              accessToken: t.String(),
              refreshToken: t.String(),
            }),
          }),
        }),
      },
    }
  )
  
  // Login user
  .post(
    '/login',
    async ({ body, auth }) => {
      const result = await auth.login(body);
      return { success: true, data: result };
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            user: userResponseSchema,
            tokens: tokensResponseSchema,
          }),
        }),
      },
    }
  )
  
  // Refresh token
  .post(
    '/refresh-token',
    async ({ body, auth }) => {
      const tokens = await auth.refreshToken(body.token);
      return { success: true, data: tokens };
    },
    {
      body: t.Object({
        token: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: tokensResponseSchema,
        }),
      },
    }
  )
  
  // Get current user
  .get(
    '/me',
    async ({ headers, auth }) => {
      const token = headers.authorization?.split(' ')[1];
      if (!token) throw new Error('No token provided');
      
      const payload = await jwt.verify(token);
      if (!payload) throw new Error('Invalid token');
      
      const user = await auth.getCurrentUser(payload.userId);
      if (!user) throw new Error('User not found');
      
      // Convert UserResponse to the expected format
      const response = {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          name: user.name || null,
          phone: user.phone || null,
          emailVerified: user.emailVerified,
          cartId: user.cartId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      };
      return response;
    },
    {
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            id: t.String(),
            email: t.String(),
            name: t.Nullable(t.String()),
            phone: t.Nullable(t.String()),
            emailVerified: t.Boolean(),
            cartId: t.Nullable(t.String()),
            createdAt: t.String(),
            updatedAt: t.String(),
          }),
        }),
      },
    }
  )
  
  // Verify email
  .get(
    '/verify-email/:token',
    async ({ params, auth }) => {
      const { token } = params;
      await auth.verifyEmail(token);
      return { success: true };
    },
    {
      params: t.Object({
        token: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
        }),
      },
    }
  )
  
  // Request password reset
  .post(
    '/request-password-reset',
    async ({ body, auth }) => {
      await auth.requestPasswordReset(body.email);
      return { success: true };
    },
    {
      body: t.Object({
        email: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
        }),
      },
    }
  )
  
  // Reset password
  .post(
    '/reset-password',
    async ({ body, auth }) => {
      const { token, newPassword } = body;
      await auth.resetPassword(token, newPassword);
      return { success: true };
    },
    {
      body: t.Object({
        token: t.String(),
        newPassword: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
        }),
      },
    }
  );
