import { User } from '@prisma/client';

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

export type UserResponse = Omit<User, 'password' | 'verificationToken' | 'resetToken' | 'resetTokenExpiry'>;

export type TokenPayload = {
  userId: string;
  email: string;
};

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export interface IAuthService {
  register(input: RegisterInput): Promise<{ user: UserResponse; tokens: AuthTokens }>;
  login(input: LoginInput): Promise<{ user: UserResponse; tokens: AuthTokens }>;
  refreshToken(token: string): Promise<{ user: UserResponse; tokens: AuthTokens }>;
  getCurrentUser(userId: string): Promise<UserResponse | null>;
  verifyEmail(token: string): Promise<boolean>;
  requestPasswordReset(email: string): Promise<boolean>;
  resetPassword(token: string, newPassword: string): Promise<boolean>;
}
