import { jwt as createJwt } from '@elysiajs/jwt';
import { randomUUID } from 'crypto';
import { Elysia, t } from 'elysia';
import { db } from '../lib/db';

// JWT configuration
const jwt = createJwt({
  name: 'jwt',
  secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
  exp: '7d'
});

const refreshJwt = createJwt({
  name: 'refreshJwt',
  secret: process.env.REFRESH_TOKEN_SECRET || 'your-super-secret-refresh-key',
  exp: '30d'
});

// Auth service
class AuthService {
  constructor(
    private jwt: any,
    private refreshJwt: any
  ) { }

  async register(email: string, password: string, phone?: string) {
    // Check if user already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already in use');
    }

    // Create user with a new cart
    const user = await db.user.create({
      data: {
        id: randomUUID(),
        email,
        password, // In production, make sure to hash the password
        phone,
        emailVerified: false,
        cart: {
          create: {}
        }
      },
      include: {
        cart: true
      }
    });

    // Extract only the necessary user data to return
    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      cartId: user.cart?.id || null
    };

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return { user: userData, tokens };
  }

  async login(email: string, password: string) {
    // Find user with cart
    const user = await db.user.findUnique({
      where: { email },
      include: {
        cart: true
      }
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password (in production, use bcrypt.compare)
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Extract only the necessary user data to return
    const userData = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      cartId: user.cart?.id || null
    };

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return { user: userData, tokens };
  }

  private async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.sign({ userId, email }),
      this.refreshJwt.sign({ userId, email })
    ]);

    return { accessToken, refreshToken };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.refreshJwt.verify(token);
      if (!payload) throw new Error('Invalid refresh token');

      return this.generateTokens(payload.userId, payload.email);
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async getCurrentUser(userId: string) {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        cart: true
      }
    });

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      emailVerified: user.emailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      cartId: user.cart?.id || null
    };
  }
}

// Helper function to handle errors
const handleError = (error: unknown) => ({
  success: false,
  message: error instanceof Error ? error.message : 'An error occurred',
});

// Create auth service instance
const authService = new AuthService(jwt, refreshJwt);

// Common response schemas
const userResponseSchema = t.Object({
  id: t.String(),
  email: t.String(),
  phone: t.Optional(t.Nullable(t.String())),
  emailVerified: t.Boolean(),
  cartId: t.Optional(t.Nullable(t.String())),
  createdAt: t.String(),
  updatedAt: t.String(),
});

const tokensResponseSchema = t.Object({
  accessToken: t.String(),
  refreshToken: t.String(),
});

// Create and export auth routes
export const authRoutes = new Elysia({ prefix: '/api/auth' })
  .use(jwt)
  .use(refreshJwt)
  .onError(({ error }) => handleError(error))

  // Register a new user
  .post(
    '/register',
    async ({ body, jwt, refreshJwt, set }) => {
      try {
        // Check if user already exists
        const existingUser = await db.user.findUnique({ where: { email: body.email } });
        if (existingUser) {
          set.status = 400;
          return { success: false, message: 'Email already in use' };
        }

        // Create user with a new cart
        const user = await db.user.create({
          data: {
            id: randomUUID(),
            email: body.email,
            password: body.password, // In production, make sure to hash the password
            phone: body.phone,
            emailVerified: false,
            cart: {
              create: {}
            }
          },
          include: {
            cart: true
          }
        });

        // Generate tokens
        const [accessToken, refreshToken] = await Promise.all([
          jwt.sign({ userId: user.id, email: user.email }),
          refreshJwt.sign({ userId: user.id, email: user.email })
        ]);

        return {
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              phone: user.phone || null,
              emailVerified: user.emailVerified,
              cartId: user.cart?.id || null,
              createdAt: user.createdAt.toISOString(),
              updatedAt: user.updatedAt.toISOString(),
            },
            tokens: { accessToken, refreshToken },
          },
        };
      } catch (error) {
        set.status = 400;
        return handleError(error);
      }
    },
    {
      body: t.Object({
        email: t.String(),
        password: t.String(),
        phone: t.Optional(t.String()),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: t.Object({
            user: userResponseSchema,
            tokens: tokensResponseSchema,
          }),
        }),
        400: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    }
  )

  // Login user
  .post(
    '/login',
    async ({ body, jwt, refreshJwt, set }) => {
      try {
        // Find user with cart
        const user = await db.user.findUnique({
          where: { email: body.email },
          include: {
            cart: true
          }
        });

        if (!user) {
          set.status = 400;
          return { success: false, message: 'Invalid email or password' };
        }

        // Verify password (in production, use bcrypt.compare)
        if (user.password !== body.password) {
          set.status = 400;
          return { success: false, message: 'Invalid email or password' };
        }

        // Generate tokens
        const [accessToken, refreshToken] = await Promise.all([
          jwt.sign({ userId: user.id, email: user.email }),
          refreshJwt.sign({ userId: user.id, email: user.email })
        ]);

        return {
          success: true,
          data: {
            user: {
              id: user.id,
              email: user.email,
              phone: user.phone || null,
              emailVerified: user.emailVerified,
              cartId: user.cart?.id || null,
              createdAt: user.createdAt.toISOString(),
              updatedAt: user.updatedAt.toISOString(),
            },
            tokens: { accessToken, refreshToken },
          },
        };
      } catch (error) {
        set.status = 400;
        return handleError(error);
      }
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
        400: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    }
  )

  // Refresh token
  .post(
    '/refresh-token',
    async ({ body, set }) => {
      try {
        const tokens = await authService.refreshToken(body.token);
        return { success: true, data: tokens };
      } catch (error) {
        set.status = 401;
        return handleError(error);
      }
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
        401: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    }
  )

  // Get current user
  .use(jwt)
  .get(
    '/me',
    async ({ jwt, headers, set }) => {
      try {
        const token = headers.authorization?.split(' ')[1];
        if (!token) {
          set.status = 401;
          return { success: false, message: 'Unauthorized' };
        }

        const payload = await jwt.verify(token);
        if (!payload || !payload.userId) {
          set.status = 401;
          return { success: false, message: 'Invalid token' };
        }

        const userId = String(payload.userId);
        const user = await authService.getCurrentUser(userId);
        if (!user) {
          set.status = 404;
          return { success: false, message: 'User not found' };
        }

        return {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            phone: user.phone || null,
            emailVerified: user.emailVerified,
            cartId: user.cartId,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
          },
        };
      } catch (error) {
        set.status = 500;
        return handleError(error);
      }
    },
    {
      response: {
        200: t.Object({
          success: t.Boolean(),
          data: userResponseSchema,
        }),
        401: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
        404: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
        500: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    }
  )

  // Verify email
  .post(
    '/verify-email',
    async ({ body, set }) => {
      try {
        // Implement email verification logic here
        return { success: true };
      } catch (error) {
        set.status = 400;
        return handleError(error);
      }
    },
    {
      body: t.Object({
        token: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
        }),
        400: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    }
  )

  // Request password reset
  .post(
    '/forgot-password',
    async ({ body, set }) => {
      try {
        // Implement password reset request logic here
        return { success: true };
      } catch (error) {
        set.status = 400;
        return handleError(error);
      }
    },
    {
      body: t.Object({
        email: t.String(),
      }),
      response: {
        200: t.Object({
          success: t.Boolean(),
        }),
        400: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    }
  )

  // Reset password
  .post(
    '/reset-password',
    async ({ body, set }) => {
      try {
        // Implement password reset logic here
        return { success: true };
      } catch (error) {
        set.status = 400;
        return handleError(error);
      }
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
        400: t.Object({
          success: t.Boolean(),
          message: t.String(),
        }),
      },
    }
  );
