import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  userId: string;
}

export interface SmartList {
  id: string;
  title: string;
  items: string[];
  userId: string;
}

export interface User {
  id: string;
  email: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  imageUrl: string;
  userId: string;
}

// Base URL for API requests
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

// Storage keys for auth tokens
const AUTH_TOKENS_KEY = 'auth_tokens';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface UserResponse {
  id: string;
  email: string;
  phone: string | null;
  emailVerified: boolean;
  cartId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  validUntil: string;
  category: string;
  isAutoApplied: boolean;
  productIds: string[];
}

export class ApiService {
  private baseUrl: string;
  private tokens: AuthTokens | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.loadTokens();
  }

  private async loadTokens() {
    if (typeof window === 'undefined') return; // Avoid SSR issues
    try {
      const tokens = await AsyncStorage.getItem(AUTH_TOKENS_KEY);
      if (tokens) this.tokens = JSON.parse(tokens);
    } catch (error) {
      console.error('Failed to load auth tokens', error);
    }
  }

  private async saveTokens(tokens: AuthTokens) {
    this.tokens = tokens;
    if (typeof window === 'undefined') return;
    try {
      await AsyncStorage.setItem(AUTH_TOKENS_KEY, JSON.stringify(tokens));
    } catch (error) {
      console.error('Failed to save auth tokens', error);
    }
  }

  private async refreshToken(): Promise<boolean> {
    if (!this.tokens?.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: this.tokens.refreshToken }),
      });

      if (!response.ok) return false;

      const { data } = await response.json();
      await this.saveTokens(data);
      return true;
    } catch (error) {
      console.error('Failed to refresh token', error);
      return false;
    }
  }

  private async authFetch(input: RequestInfo, init?: RequestInit): Promise<Response> {
    const request = async () => {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(init?.headers as Record<string, string> || {}),
      };

      if (this.tokens?.accessToken) {
        headers['Authorization'] = `Bearer ${this.tokens.accessToken}`;
      }

      return fetch(`${this.baseUrl}${input}`, {
        ...init,
        headers,
      });
    };

    let response = await request();

    // If unauthorized, try to refresh token and retry once
    if (response.status === 401 && this.tokens?.refreshToken) {
      const refreshed = await this.refreshToken();
      if (refreshed) {
        response = await request();
      }
    }

    return response;
  }

  // Auth methods
  async register(email: string, password: string, phone?: string) {
    const response = await this.authFetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, phone }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Registration failed');
    }

    const { data } = await response.json();
    await this.saveTokens(data.tokens);
    return data.user;
  }

  async login(email: string, password: string): Promise<UserResponse> {
    const response = await this.authFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Login failed');
    }

    const { data } = await response.json();
    await this.saveTokens(data.tokens);
    return data.user;
  }

  async logout() {
    this.tokens = null;
    if (typeof window !== 'undefined') {
      await AsyncStorage.removeItem(AUTH_TOKENS_KEY);
    }
  }

  async getCurrentUser(): Promise<UserResponse | null> {
    const response = await this.authFetch('/api/auth/me');
    if (!response.ok) return null;
    const { data } = await response.json();
    return data;
  }

  // Cart methods
  async getCartItems(): Promise<CartItem[]> {
    const response = await this.authFetch('/api/cart');
    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }
    return response.json();
  }

  // Smart List methods
  async getSmartLists(): Promise<SmartList[]> {
    const response = await this.authFetch('/api/smartlist');
    if (!response.ok) {
      throw new Error('Failed to fetch smart lists');
    }
    return response.json();
  }

  // Receipt methods
  async uploadReceipt(imageUrl: string): Promise<Receipt> {
    const response = await this.authFetch('/api/receipt', {
      method: 'POST',
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload receipt');
    }

    return response.json();
  }

  // Coupon methods
  async getAvailableCoupons(): Promise<Coupon[]> {
    const response = await this.authFetch('/api/coupons');
    if (!response.ok) {
      throw new Error('Failed to fetch available coupons');
    }
    const { data } = await response.json();
    return data;
  }

  async applyCoupon(couponId: string): Promise<{ success: boolean; message: string }> {
    const response = await this.authFetch('/api/coupons/apply', {
      method: 'POST',
      body: JSON.stringify({ couponId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to apply coupon');
    }

    return response.json();
  }

  async findBestCoupons(cartItems: { id: string; name: string }[]) {
    const response = await this.authFetch('/api/coupons/best-match', {
      method: 'POST',
      body: JSON.stringify({ cartItems }),
    });

    if (!response.ok) {
      throw new Error('Failed to find best coupons');
    }

    const { data } = await response.json();
    return data;
  }

  async getAppliedCoupons(userId: string) {
    const response = await this.authFetch(`/api/coupons/user/${userId}/applied`);
    if (!response.ok) {
      throw new Error('Failed to fetch applied coupons');
    }
    const { data } = await response.json();
    return data;
  }
}

export const apiService = new ApiService(API_BASE_URL);
