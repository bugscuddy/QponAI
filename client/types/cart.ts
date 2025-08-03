export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  userId: string; // Added userId to match the expected type in the application
}
