import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const API_BASE_URL = 'http://localhost:3000';

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

class ApiService {
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
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login request failed');
    }

    return response.json();
  }

  async uploadReceipt(imageUrl: string, userId: string): Promise<Receipt> {
    const response = await fetch(`${this.baseUrl}/receipt`, {
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

export const apiService = new ApiService(API_BASE_URL);

export default function Index() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [smartLists, setSmartLists] = useState<SmartList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch cart items
      const cartResponse = await fetch(`${API_BASE_URL}/cart`);
      const cartData = await cartResponse.json();

      // Fetch smart lists
      const listsResponse = await fetch(`${API_BASE_URL}/smartlist`);
      const listsData = await listsResponse.json();

      setCartItems(cartData);
      setSmartLists(listsData);
    } catch (err) {
      setError('Failed to fetch data from server');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text>Loading data from server...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        QponAI Dashboard
      </Text>

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Cart Items ({cartItems.length})
      </Text>

      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: '#f0f0f0',
              padding: 10,
              marginVertical: 5,
              borderRadius: 5
            }}>
              <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
              <Text>Quantity: {item.quantity}</Text>
            </View>
          )}
          style={{ maxHeight: 200 }}
        />
      ) : (
        <Text style={{ fontStyle: 'italic', marginBottom: 20 }}>
          No cart items found
        </Text>
      )}

      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
        Smart Lists ({smartLists.length})
      </Text>

      {smartLists.length > 0 ? (
        <FlatList
          data={smartLists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{
              backgroundColor: '#e8f4fd',
              padding: 10,
              marginVertical: 5,
              borderRadius: 5
            }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>Items: {item.items.join(', ')}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={{ fontStyle: 'italic' }}>
          No smart lists found
        </Text>
      )}
    </View>
  )
}
