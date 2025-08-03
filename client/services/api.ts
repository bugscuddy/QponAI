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
  name: string;
  email: string;
  createdAt: string;
}

export interface Receipt {
  id: string;
  imageUrl: string;
  userId: string;
}

export const API = process.env.API_BASE_URL || '';

export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getCartItems(): Promise<CartItem[]> {
    const response = await fetch(`${this.baseUrl}/cart`);
    if (!response.ok) {
      throw new Error('Failed to fetch cart items');
    }
    return response.json();
  }

  async getSmartLists(): Promise<SmartList[]> {
    const response = await fetch(`${this.baseUrl}/smartlist`);
    if (!response.ok) {
      throw new Error('Failed to fetch smart lists');
    }
    return response.json();
  }

  async login(email: string, password: string): Promise<{ success: boolean; user?: User }> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return { success: false };
    }

    const data = await response.json();
    return { success: true, user: data.user };
  }

  async uploadReceipt(imageUrl: string, userId: string): Promise<Receipt> {
    const response = await fetch(`${this.baseUrl}/receipts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl, userId }),
    });

    if (!response.ok) {
      throw new Error('Failed to upload receipt');
    }

    return response.json();
  }
}

export const apiService = new ApiService(API);
