import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define parameter lists for each navigator
export type RootStackParamList = {
  MainTabs: undefined;
  // Add other screens that should be accessible outside the tab navigator
};

export type RootTabParamList = {
  Home: undefined;
  Coupons: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type CouponStackParamList = {
  CouponsList: undefined;
  ScanCoupon: undefined;
};

// Create navigation props types
export type CouponStackNavigationProp = NativeStackNavigationProp<CouponStackParamList>;

// Re-export types that might be needed in components
export * from '@react-navigation/native';
export * from '@react-navigation/native-stack';
