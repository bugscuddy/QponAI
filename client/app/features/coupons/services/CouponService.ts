import { CartItem } from '../../../../types/cart';

export interface Coupon {
  id: string;
  title: string;
  description: string;
  discount: number;
  discountType: 'percentage' | 'fixed';
  validUntil: string;
  category: string;
  productIds: string[];
  storeId: string;
  code?: string;
  isAutoApplied: boolean;
}

class CouponService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAvailableCoupons(userId: string): Promise<Coupon[]> {
    try {
      const response = await fetch(`${this.baseUrl}/coupons?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch coupons');
      return response.json();
    } catch (error) {
      console.error('Error fetching coupons:', error);
      return [];
    }
  }

  async getBestCouponsForCart(cartItems: CartItem[], userId: string): Promise<Coupon[]> {
    try {
      const response = await fetch(`${this.baseUrl}/coupons/best-match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems, userId })
      });
      if (!response.ok) throw new Error('Failed to get best coupons');
      return response.json();
    } catch (error) {
      console.error('Error finding best coupons:', error);
      return [];
    }
  }

  async applyCoupon(couponId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseUrl}/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couponId, userId })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to apply coupon');
      return { success: true, message: 'Coupon applied successfully' };
    } catch (error) {
      console.error('Error applying coupon:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Failed to apply coupon' };
    }
  }
}

const couponService = new CouponService('http://localhost:3000');

export { couponService };
export default CouponService;
