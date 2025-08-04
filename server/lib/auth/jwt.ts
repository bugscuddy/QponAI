export interface JwtPayload {
  userId: string;
  email: string;
  // Add any additional JWT payload fields here
  // For example:
  // role?: string;
  // iat?: number;
  // exp?: number;
}

export const JWT_CONFIG = {
  // These should come from environment variables in production
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: '15m', // Access token expiry
  refreshExpiresIn: '7d', // Refresh token expiry
};
