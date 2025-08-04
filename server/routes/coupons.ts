import { PrismaClient } from '@prisma/client';
import { Elysia } from 'elysia';

const prisma = new PrismaClient();

// Types
type Coupon = {
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
};

type ApplyCouponRequest = {
  couponId: string;
  userId: string;
};

type FindBestDealsRequest = {
  cartItems: Array<{
    id: string;
    name: string;
    quantity: number;
  }>;
  userId: string;
};

// Mock data - in a real app, this would come from a database
const mockCoupons: Coupon[] = [
  {
    id: '1',
    title: '20% Off Fresh Produce',
    description: 'Save on all fresh fruits and vegetables',
    discount: 20,
    discountType: 'percentage',
    validUntil: '2023-12-31',
    category: 'produce',
    productIds: [],
    storeId: 'shoprite',
    isAutoApplied: false,
  },
  {
    id: '2',
    title: '$1 Off Milk',
    description: 'Any brand, any size',
    discount: 1,
    discountType: 'fixed',
    validUntil: '2023-11-15',
    category: 'dairy',
    productIds: [],
    storeId: 'shoprite',
    code: 'MILK123',
    isAutoApplied: false,
  },
  {
    id: '3',
    title: 'Buy 1 Get 1 Free',
    description: 'Selected bakery items',
    discount: 50,
    discountType: 'percentage',
    validUntil: '2023-12-15',
    category: 'bakery',
    productIds: [],
    storeId: 'shoprite',
    isAutoApplied: true,
  },
  {
    id: '4',
    title: '15% Off Organic Products',
    description: 'All organic products in store',
    discount: 15,
    discountType: 'percentage',
    validUntil: '2023-12-31',
    category: 'grocery',
    productIds: [],
    storeId: 'shoprite',
    isAutoApplied: true,
  },
  {
    id: '5',
    title: '$3 Off $50 Purchase',
    description: 'Minimum $50 purchase required',
    discount: 3,
    discountType: 'fixed',
    validUntil: '2023-11-30',
    category: 'grocery',
    productIds: [],
    storeId: 'shoprite',
    code: 'SAVE3',
    isAutoApplied: false,
  },
];

export const couponRoutes = new Elysia({ prefix: '/api/coupons' })
  // Get all available coupons
  .get('/', () => {
    return {
      success: true,
      data: mockCoupons,
    };
  })

  // Get coupon by ID
  .get('/:id', ({ params }) => {
    const coupon = mockCoupons.find(c => c.id === params.id);

    if (!coupon) {
      return {
        success: false,
        message: 'Coupon not found',
      };
    }

    return {
      success: true,
      data: coupon,
    };
  })

  // Apply a coupon
  .post('/apply', async ({ body }) => {
    const { couponId, userId } = body as ApplyCouponRequest;

    // In a real app, you would:
    // 1. Validate the coupon exists and is valid
    // 2. Check if the user has already used this coupon
    // 3. Apply the coupon to the user's cart/order

    const coupon = mockCoupons.find(c => c.id === couponId);

    if (!coupon) {
      return {
        success: false,
        message: 'Invalid coupon',
      };
    }

    // Check if coupon is expired
    if (new Date(coupon.validUntil) < new Date()) {
      return {
        success: false,
        message: 'This coupon has expired',
      };
    }

    // In a real app, you would save this to the database
    // await prisma.appliedCoupon.create({
    //   data: {
    //     couponId,
    //     userId,
    //     appliedAt: new Date(),
    //   },
    // });

    return {
      success: true,
      message: 'Coupon applied successfully',
      data: {
        couponId,
        discount: coupon.discount,
        discountType: coupon.discountType,
        description: coupon.title,
      },
    };
  })

  // Find best coupons for cart
  .post('/best-match', async ({ body }) => {
    const { cartItems, userId } = body as FindBestDealsRequest;

    // In a real app, you would:
    // 1. Analyze the cart items
    // 2. Find coupons that match the items
    // 3. Return the best matching coupons

    // Simple matching logic for demo purposes
    const matchedCoupons = mockCoupons.filter(coupon => {
      // Auto-applied coupons
      if (coupon.isAutoApplied) return true;

      // Category-based matching
      const cartCategories = cartItems.map(item => item.name.toLowerCase());
      if (cartCategories.some(cat => coupon.category.toLowerCase().includes(cat))) {
        return true;
      }

      // Product ID matching (if we had product IDs)
      if (coupon.productIds.length > 0) {
        return cartItems.some(item => coupon.productIds.includes(item.id));
      }

      return false;
    });

    // Sort by discount amount (highest first)
    matchedCoupons.sort((a, b) => b.discount - a.discount);

    return {
      success: true,
      data: matchedCoupons.slice(0, 5), // Return top 5 matches
    };
  })

  // Get user's applied coupons
  .get('/user/:userId/applied', ({ params }) => {
    // In a real app, you would fetch this from the database
    // const appliedCoupons = await prisma.appliedCoupon.findMany({
    //   where: { userId: params.userId },
    //   include: { coupon: true },
    // });

    // Return mock data for now
    return {
      success: true,
      data: [
        { id: '3', appliedAt: new Date().toISOString() },
        { id: '4', appliedAt: new Date().toISOString() },
      ],
    };
  });
