import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

// Types
export type JwtPayload = {
  userId: string;
  email: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

type UserResponse = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  emailVerified: boolean;
  cart?: { id: string } | null;
  cartId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name?: string | null;
  phone?: string | null;
};

export type LoginInput = {
  email: string;
  password: string;
};

export interface IJwtService {
  sign: (payload: JwtPayload) => Promise<string>;
  verify: (token: string) => Promise<JwtPayload | null>;
}

export interface IAuthService {
  register(input: RegisterInput): Promise<{ user: UserResponse; tokens: AuthTokens }>;
  login(input: LoginInput): Promise<{ user: UserResponse; tokens: AuthTokens }>;
  refreshToken(token: string): Promise<AuthTokens>;
  getCurrentUser(userId: string): Promise<UserResponse | null>;
  verifyEmail(token: string): Promise<{ success: boolean }>;
  requestPasswordReset(email: string): Promise<{ success: boolean }>;
  resetPassword(token: string, newPassword: string): Promise<{ success: boolean }>;
}

// Prisma client
const prisma = new PrismaClient();

// JWT utilities
const jwt: IJwtService = {
  sign: async (payload: JwtPayload) => {
    // Implement JWT signing logic here
    return 'signed-token';
  },
  verify: async (token: string) => {
    // Implement JWT verification logic here
    return { userId: 'user-id', email: 'user@example.com' } as JwtPayload;
  }
};

const refreshJwt: IJwtService = {
  sign: async (payload: JwtPayload) => {
    // Implement refresh token signing logic here
    return 'refresh-token';
  },
  verify: async (token: string) => {
    // Implement refresh token verification logic here
    return { userId: 'user-id', email: 'user@example.com' } as JwtPayload;
  }
};

type UserWithCart = {
  id: string;
  email: string;
  password: string;
  name: string | null;
  phone: string | null;
  emailVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpiry?: Date | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  cart: { id: string } | null;
};

// Helper function to map database user to response format
const toUserResponse = (user: UserWithCart): UserResponse => {
  const { 
    password, 
    verificationToken, 
    verificationTokenExpiry, 
    resetToken, 
    resetTokenExpiry,
    cart,
    ...userData 
  } = user;
  
  const response: UserResponse = {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    emailVerified: user.emailVerified,
    cart: cart ? { id: cart.id } : null,
    cartId: cart?.id || null,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
  
  return response;
};

export class AuthService implements IAuthService {
  constructor(
    private jwt: IJwtService,
    private refreshJwt: IJwtService
  ) {}

  private async generateTokens(payload: JwtPayload): Promise<AuthTokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.sign(payload),
      this.refreshJwt.sign(payload),
    ]);

    if (!accessToken || !refreshToken) {
      throw new Error('Failed to generate tokens');
    }

    return { accessToken, refreshToken };
  }

  async register({ email, password, name, phone }: RegisterInput) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4();

    // Create user with verification token in a transaction
    const user = await prisma.$transaction(async (tx) => {
      // 1. First create the user with basic info
      // Create user with basic info first
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          ...(name && { name }),
          ...(phone && { phone }),
        },
      });

      // Update with verification token using raw SQL to handle mapped fields
      await tx.$executeRaw`
        UPDATE users 
        SET verification_token = ${verificationToken},
            verification_token_expiry = ${new Date(Date.now() + 24 * 60 * 60 * 1000)}
        WHERE id = ${newUser.id}
      `;

      // 2. Create a cart for the user
      const cart = await (tx as any).cart.create({
        data: {
          userId: newUser.id,
        },
      });

      // 3. Use the helper method to get the full user with cart
      const userWithCart = await this.getUserWithCart(newUser.id);
      if (!userWithCart) {
        throw new Error('Failed to create user');
      }

      return userWithCart;
    });

    // Generate tokens using the created user
    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email,
    });

    // TODO: Send verification email
    
    return { 
      user: toUserResponse(user as UserWithCart), 
      tokens 
    };
  }

  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const userWithCart = await this.getUserWithCart(user.id);
    if (!userWithCart) {
      throw new Error('User data could not be loaded');
    }

    const tokens = await this.generateTokens({
      userId: user.id,
      email: user.email,
    });

    return { 
      user: toUserResponse(userWithCart), 
      tokens 
    };
  }

  async refreshToken(token: string) {
    try {
      const payload = await this.refreshJwt.verify(token);
      if (!payload) {
        throw new Error('Invalid refresh token');
      }

      const user = await this.getUserWithCart(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }

      return this.generateTokens({
        userId: user.id,
        email: user.email,
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  private async getUserWithCart(userId: string): Promise<UserWithCart | null> {
    // Use a raw query to get all required fields in one go
    const [userData] = await prisma.$queryRaw<Array<{
      id: string;
      email: string;
      password: string;
      name: string | null;
      phone: string | null;
      created_at: Date;
      updated_at: Date | null;
      cart_id: string | null;
    }>>`
      SELECT 
        u.id, u.email, u.password, u.name, u.phone, 
        u.created_at, u.updated_at, c.id as cart_id
      FROM users u
      LEFT JOIN carts c ON c.user_id = u.id
      WHERE u.id = ${userId}
    `;

    if (!userData) return null;

    return {
      id: userData.id,
      email: userData.email,
      password: userData.password,
      name: userData.name,
      phone: userData.phone,
      emailVerified: false,
      verificationToken: null,
      verificationTokenExpiry: null,
      resetToken: null,
      resetTokenExpiry: null,
      createdAt: userData.created_at,
      updatedAt: userData.updated_at || userData.created_at,
      cart: userData.cart_id ? { id: userData.cart_id } : null
    };
  }

  async getCurrentUser(userId: string) {
    const user = await this.getUserWithCart(userId);
    return user ? toUserResponse(user) : null;
  }

  async verifyEmail(token: string) {
    // Find user with matching verification token that hasn't expired
    const [user] = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM users 
      WHERE verification_token = ${token}
      AND verification_token_expiry > NOW()
    `;

    if (!user) {
      throw new Error('Invalid or expired verification token');
    }

    // Update user using raw SQL to handle mapped fields
    await prisma.$executeRaw`
      UPDATE users 
      SET 
        email_verified = true,
        verification_token = NULL,
        verification_token_expiry = NULL
      WHERE id = ${user.id}
    `;

    return { success: true };
  }

  async requestPasswordReset(email: string) {
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true }
    });
    
    if (!user) {
      // Don't reveal if user exists for security
      return { success: true };
    }

    const resetToken = uuidv4();
    const expiryDate = new Date(Date.now() + 3600000); // 1 hour from now
    
    // Use raw SQL to update reset token fields
    await prisma.$executeRaw`
      UPDATE users 
      SET 
        reset_token = ${resetToken},
        reset_token_expiry = ${expiryDate}
      WHERE id = ${user.id}
    `;

    // TODO: Send password reset email with resetToken
    
    return { success: true };
  }

  async resetPassword(token: string, newPassword: string) {
    // Find user with matching reset token that hasn't expired
    const [user] = await prisma.$queryRaw<Array<{ id: string }>>`
      SELECT id FROM users 
      WHERE reset_token = ${token}
      AND reset_token_expiry > NOW()
    `;

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset token using raw SQL
    await prisma.$executeRaw`
      UPDATE users 
      SET 
        password = ${hashedPassword},
        reset_token = NULL,
        reset_token_expiry = NULL
      WHERE id = ${user.id}
    `;

    return { success: true };
  }
}

// Export the auth service instance
export const authService = new AuthService(jwt, refreshJwt);

export default AuthService;
