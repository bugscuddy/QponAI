export type RootStackParamList = {
  Home: undefined;
  Coupons: undefined;
  Cart: undefined;
  Profile: undefined;
  ScanCoupon: undefined;
  // Add other screen params as needed
};

export type CouponStackParamList = {
  CouponList: undefined;
  CouponDetails: { couponId: string };
  // Add other coupon-related screens as needed
};
