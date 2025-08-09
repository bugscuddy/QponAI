import { Alert } from 'react-native';

export interface BarcodeResult {
  barcode: string;
  productName?: string;
  brand?: string;
  imageUrl?: string;
  matchingCoupons: Array<{
    id: string;
    title: string;
    description: string;
    discount: string;
    expiryDate: string;
    isClipped: boolean;
  }>;
}

export const barcodeService = {
  async lookupBarcode(barcode: string): Promise<BarcodeResult | null> {
    try {
      // In a real app, this would call your backend API
      // For now, we'll simulate a response
      console.log('Looking up barcode:', barcode);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - replace with actual API call
      const mockData: BarcodeResult = {
        barcode,
        productName: 'Organic Almond Milk',
        brand: 'Silk',
        imageUrl: 'https://via.placeholder.com/150',
        matchingCoupons: [
          {
            id: 'coupon-1',
            title: '20% Off Silk Products',
            description: 'Save 20% on any Silk product',
            discount: '20%',
            expiryDate: '2025-12-31',
            isClipped: false
          },
          {
            id: 'coupon-2',
            title: 'Dairy Free Special',
            description: '$1 off any dairy-free milk alternative',
            discount: '$1.00',
            expiryDate: '2025-11-30',
            isClipped: true
          }
        ]
      };
      
      return mockData;
    } catch (error) {
      console.error('Error looking up barcode:', error);
      Alert.alert('Error', 'Failed to look up product. Please try again.');
      return null;
    }
  },
  
  validateBarcode(barcode: string): boolean {
    // Simple validation for common barcode formats
    // EAN-13: 13 digits, UPC-A: 12 digits, UPC-E: 8 digits
    return /^\d{8,13}$/.test(barcode);
  }
};
