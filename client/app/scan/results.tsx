import { useCallback, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  Dimensions,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function ScanResultsScreen() {
  const { barcodeData: barcodeDataParam } = useLocalSearchParams<{ barcodeData: string }>();
  const router = useRouter();
  
  // Get screen dimensions
  const { width: SCREEN_WIDTH } = Dimensions.get('window');
  const CARD_PADDING = 16;
  const CARD_WIDTH = SCREEN_WIDTH - (CARD_PADDING * 2);
  
  // State for product data and loading states
  const [productData, setProductData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Parse the barcode data when the component mounts or when the param changes
  const loadProductData = useCallback(async () => {
    try {
      setIsLoading(true);
      const parsedData = JSON.parse(barcodeDataParam || '{}');
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 500));
      setProductData(parsedData);
    } catch (error) {
      console.error('Error parsing barcode data:', error);
      Alert.alert('Error', 'Failed to load product data');
      setProductData({});
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [barcodeDataParam]);
  
  useEffect(() => {
    loadProductData();
  }, [loadProductData]);
  
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    loadProductData();
  }, [loadProductData]);

  const handleClipCoupon = useCallback((couponId: string) => {
    // In a real app, this would call an API to clip the coupon
    Alert.alert(
      'Coupon Clipped', 
      'The coupon has been added to your account.',
      [
        { 
          text: 'OK',
          style: 'default',
          onPress: () => {
            // Update the UI to show the coupon as clipped
            setProductData((currentData: any) => {
              if (!currentData?.matchingCoupons) return currentData;
              
              const updatedCoupons = currentData.matchingCoupons.map((coupon: any) => 
                coupon.id === couponId ? { ...coupon, isClipped: true } : coupon
              );
              
              return { ...currentData, matchingCoupons: updatedCoupons };
            });
          }
        }
      ]
    );
  }, []);

  // Loading state
  if (isLoading && !isRefreshing) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading product information...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          hitSlop={{ top: 20, left: 20, right: 20, bottom: 20 }}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {productData?.productName || 'Scan Results'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.productCard}>
          {productData.imageUrl ? (
            <Image 
              source={{ uri: productData.imageUrl }} 
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <MaterialIcons name="image-not-supported" size={48} color={colors.muted} />
            </View>
          )}
          
          <Text style={styles.productName}>
            {productData.productName || 'Product Name Not Available'}
          </Text>
          {productData.brand && (
            <Text style={styles.productBrand}>{productData.brand}</Text>
          )}
          <Text style={styles.barcodeText}>
            Barcode: {productData.barcode || 'N/A'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Coupons</Text>
          
          {productData.matchingCoupons?.length > 0 ? (
            productData.matchingCoupons.map((coupon: any) => (
              <View key={coupon.id} style={styles.couponCard}>
                <View style={styles.couponContent}>
                  <Text style={styles.couponTitle}>{coupon.title}</Text>
                  <Text style={styles.couponDescription}>{coupon.description}</Text>
                  <View style={styles.couponFooter}>
                    <Text style={styles.couponDiscount}>{coupon.discount} OFF</Text>
                    <Text style={styles.couponExpiry}>Expires: {coupon.expiryDate}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.clipButton,
                    coupon.isClipped && styles.clippedButton
                  ]}
                  onPress={() => handleClipCoupon(coupon.id)}
                  disabled={coupon.isClipped}
                >
                  <Text style={styles.clipButtonText}>
                    {coupon.isClipped ? 'Clipped' : 'Clip'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.noCouponsContainer}>
              <MaterialIcons name="tag" size={48} color={colors.muted} />
              <Text style={styles.noCouponsText}>No coupons available for this product</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={[styles.scanAgainButton, { width: CARD_WIDTH }]}
        onPress={() => {
          // Reset the scan state when going back
          router.replace({
            pathname: '/(tabs)/scan',
            params: { resetScan: Date.now() } // Add a timestamp to force reset
          });
        }}
        activeOpacity={0.8}
      >
        <MaterialIcons name="camera-alt" size={20} color="white" style={styles.scanAgainIcon} />
        <Text style={styles.scanAgainText}>Scan Another Item</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    color: colors.muted,
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    backgroundColor: colors.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerRight: {
    width: 24,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    padding: spacing.md,
  },
  productCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
    ...shadow.soft,
  },
  productImage: {
    width: 200,
    height: 200,
    maxWidth: '100%',
    marginBottom: spacing.md,
    borderRadius: radius.md,
  },
  placeholderImage: {
    backgroundColor: colors.muted + '20',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  productName: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  productBrand: {
    fontSize: 16,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  barcodeText: {
    fontSize: 14,
    color: colors.muted,
    fontFamily: 'monospace',
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  couponCard: {
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow.soft,
  },
  couponContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  couponDescription: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: spacing.sm,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  couponDiscount: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
  },
  couponExpiry: {
    fontSize: 12,
    color: colors.muted,
  },
  clipButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    minWidth: 80,
    alignItems: 'center',
  },
  clippedButton: {
    backgroundColor: colors.success,
  },
  clipButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  noCouponsContainer: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.cardBg,
    borderRadius: radius.md,
    ...shadow.soft,
  },
  noCouponsText: {
    marginTop: spacing.md,
    color: colors.muted,
    textAlign: 'center',
  },
  scanAgainButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    padding: spacing.md,
    margin: spacing.md,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    ...shadow.card,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  scanAgainIcon: {
    marginRight: spacing.sm,
  },
  scanAgainText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
