import { CheerioAPI, load } from 'cheerio';
import crypto from 'crypto';
import { Elysia } from 'elysia';
import { chromium } from 'playwright';
import { prisma } from '../lib/prisma';

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

// External scrapes
couponRoutes.get('/external/shoprite', async () => {
  const url = 'https://www.shoprite.com/sm/planning/rsid/604/digital-coupon?srsltid=AfmBOopnt47IvhPBIakCm8TL6XeQkCo6K3Ywrr8S4Cp3Z9LPI1xoiQyS';

  // Check cache: coupons from this store created in the last hour
  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
  const cached = await prisma.coupon.findMany({
    where: { storeId: 'shoprite', createdAt: { gte: oneHourAgo } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  if (cached.length > 0) {
    return { success: true, data: cached };
  }

  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'QponAI/1.0 (+https://github.com)' } });
    if (!res.ok) {
      return { success: false, message: `Failed to fetch: ${res.status}` };
    }

    const html = await res.text();
    const $: CheerioAPI = load(html);

    // Attempt to parse coupon-like elements
    const coupons: Array<Partial<Coupon>> = [];

    $('.coupon-card, .digital-coupon, .couponItem, .coupon').each((i, el) => {
      const title = $(el).find('.coupon-title, .title, h3').first().text().trim();
      const description = $(el).find('.coupon-desc, .description, p').first().text().trim();
      const code = $(el).find('.coupon-code, .code').first().text().trim() || undefined;
      const discountText = $(el).find('.discount, .amount').first().text().trim();

      let discount = 0;
      let discountType: any = 'fixed';
      if (discountText.includes('%')) {
        discountType = 'percentage';
        const n = parseFloat(discountText.replace('%', '').replace(/[^0-9.\-]/g, ''));
        if (!isNaN(n)) discount = n;
      } else {
        const n = parseFloat(discountText.replace(/[^0-9.\-\.]/g, ''));
        if (!isNaN(n)) discount = n;
      }

      coupons.push({
        title: title || description || `Coupon ${i}`,
        description: description || '',
        discount,
        discountType,
        validUntil: '',
        category: '',
        productIds: [],
        storeId: 'shoprite',
        code,
        isAutoApplied: false,
      });
    });

    // If nothing found with selectors, try to detect JS challenge or render issues
    if (coupons.length === 0) {
      // The saved HTML shows a Cloudflare JS challenge page. We can't render JS here.
      // Return empty but informative message.
      return { success: true, data: [], message: 'No coupons found (page may require JS or be blocked by Cloudflare)' };
    }

    // Upsert parsed coupons into DB to cache them
    const upserted = [] as any[];
    for (const c of coupons) {
      const codeKey = c.code || c.title || crypto.randomUUID();
      const slug = String(codeKey).slice(0, 191);

      const up = await prisma.coupon.upsert({
        where: { code: slug },
        create: {
          title: c.title || 'Untitled',
          description: c.description || '',
          code: slug,
          discount: c.discount || 0,
          discountType: c.discountType || 'fixed',
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // default 30 days
          category: c.category || null,
          productIds: c.productIds || [],
          storeId: 'shoprite',
          isAutoApplied: c.isAutoApplied || false,
        },
        update: {
          title: c.title || 'Untitled',
          description: c.description || '',
          discount: c.discount || 0,
          discountType: c.discountType || 'fixed',
          updatedAt: new Date(),
          isActive: true,
        },
      });

      upserted.push(up);
    }

    return { success: true, data: upserted };
  } catch (err: any) {
    return { success: false, message: String(err) };
  }
});

// Rendered scraping using Playwright to bypass JS challenges
couponRoutes.get('/external/shoprite/render', async () => {
  const url = 'https://www.shoprite.com/sm/planning/rsid/604/digital-coupon?srsltid=AfmBOopnt47IvhPBIakCm8TL6XeQkCo6K3Ywrr8S4Cp3Z9LPI1xoiQyS';

  // Check cache first (1 hour)
  const oneHourAgo = new Date(Date.now() - 1000 * 60 * 60);
  const cached = await prisma.coupon.findMany({
    where: { storeId: 'shoprite', createdAt: { gte: oneHourAgo } },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  if (cached.length > 0) return { success: true, data: cached, cached: true };

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30_000 });

    // Wait briefly for potential content. Adjust selector if we know a coupon container.
    try {
      await page.waitForSelector('.coupon-card, .digital-coupon, .couponItem, .coupon', { timeout: 8000 });
    } catch (e) {
      // continue; maybe content uses different selectors
    }

    const html = await page.content();
    const $ = load(html);

    const found: Array<Partial<Coupon>> = [];
    $('.coupon-card, .digital-coupon, .couponItem, .coupon').each((i, el) => {
      const title = $(el).find('.coupon-title, .title, h3').first().text().trim();
      const description = $(el).find('.coupon-desc, .description, p').first().text().trim();
      const code = $(el).find('.coupon-code, .code').first().text().trim() || undefined;
      const discountText = $(el).find('.discount, .amount').first().text().trim();

      let discount = 0;
      let discountType: any = 'fixed';
      if (discountText.includes('%')) {
        discountType = 'percentage';
        const n = parseFloat(discountText.replace('%', '').replace(/[^0-9.\-]/g, ''));
        if (!isNaN(n)) discount = n;
      } else {
        const n = parseFloat(discountText.replace(/[^0-9.\-\.]/g, ''));
        if (!isNaN(n)) discount = n;
      }

      found.push({
        title: title || description || `Coupon ${i}`,
        description: description || '',
        discount,
        discountType,
        validUntil: '',
        category: '',
        productIds: [],
        storeId: 'shoprite',
        code,
        isAutoApplied: false,
      });
    });

    if (found.length === 0) {
      await browser.close();
      return { success: true, data: [], message: 'No coupons found after rendering' };
    }

    const upserted: any[] = [];
    for (const c of found) {
      const codeKey = c.code || c.title || crypto.randomUUID();
      const slug = String(codeKey).slice(0, 191);

      const up = await prisma.coupon.upsert({
        where: { code: slug },
        create: {
          title: c.title || 'Untitled',
          description: c.description || '',
          code: slug,
          discount: c.discount || 0,
          discountType: c.discountType || 'fixed',
          endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          category: c.category || null,
          productIds: c.productIds || [],
          storeId: 'shoprite',
          isAutoApplied: c.isAutoApplied || false,
        },
        update: {
          title: c.title || 'Untitled',
          description: c.description || '',
          discount: c.discount || 0,
          discountType: c.discountType || 'fixed',
          updatedAt: new Date(),
          isActive: true,
        },
      });

      upserted.push(up);
    }

    await browser.close();
    return { success: true, data: upserted, rendered: true };
  } catch (err: any) {
    await browser.close();
    return { success: false, message: String(err) };
  }
});
