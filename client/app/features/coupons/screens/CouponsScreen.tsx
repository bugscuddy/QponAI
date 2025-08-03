import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  RefreshControl, 
  ActivityIndicator,
  Alert,
  TextInput,
  FlatList 
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Coupon, couponService } from '../services/CouponService';
import CouponList from '../components/CouponList';
import { useCart } from '../../../../hooks/useCart';

// Mock data for categories
const categories = [
  { id: 'all', name: 'All Deals' },
  { id: 'grocery', name: 'Grocery' },
  { id: 'dairy', name: 'Dairy' },
  { id: 'meat', name: 'Meat & Seafood' },
  { id: 'produce', name: 'Produce' },
  { id: 'beverages', name: 'Beverages' },
  { id: 'snacks', name: 'Snacks' },
];

// Mock coupon data - in a real app, this would come from an API
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

interface CouponsScreenProps {
  navigation: any; // You might want to properly type this with your navigation type
}

export const CouponsScreen: React.FC<CouponsScreenProps> = ({ navigation }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
  const [appliedCouponIds, setAppliedCouponIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const { cartItems } = useCart();
  
  // Mock user ID - in a real app, this would come from auth context
  const userId = 'user-123';

  // Load coupons on component mount
  useEffect(() => {
    loadCoupons();
  }, []);

  // Filter coupons when category or search query changes
  useEffect(() => {
    filterCoupons();
  }, [selectedCategory, searchQuery, coupons]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would fetch coupons from your API
      // const availableCoupons = await couponService.getAvailableCoupons(userId);
      // const appliedCoupons = await getAppliedCoupons(userId);
      
      // Mock data for now
      setTimeout(() => {
        setCoupons(mockCoupons);
        setAppliedCouponIds(['3', '4']); // Mock some applied coupons
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Failed to load coupons:', error);
      setLoading(false);
    }
  };

  const filterCoupons = () => {
    let result = [...coupons];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(coupon => coupon.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        coupon => 
          coupon.title.toLowerCase().includes(query) ||
          coupon.description.toLowerCase().includes(query)
      );
    }
    
    setFilteredCoupons(result);
  };

  const handleApplyCoupon = async (couponId: string) => {
    try {
      // In a real app, you would call the API to apply the coupon
      // const result = await couponService.applyCoupon(couponId, userId);
      
      // Mock implementation for now
      setAppliedCouponIds(prev => [...prev, couponId]);
      
      // Show success message
      Alert.alert('Success', 'Coupon applied successfully!');
      
    } catch (error) {
      console.error('Error applying coupon:', error);
      Alert.alert('Error', 'Failed to apply coupon. Please try again.');
    }
  };

  const handleFindBestDeals = async () => {
    try {
      setLoading(true);
      
      // In a real app, you would call the API to find best deals
      // const bestCoupons = await couponService.getBestCouponsForCart(cartItems, userId);
      
      // Mock implementation for now
      setTimeout(() => {
        // Filter coupons that match items in the cart
        const bestCoupons = mockCoupons.filter(coupon => 
          coupon.isAutoApplied || 
          coupon.category === 'dairy' || // Mock: prioritize dairy coupons
          coupon.discount > 10 // Mock: prioritize higher discounts
        );
        
        setCoupons(bestCoupons);
        setSelectedCategory('all');
        setSearchQuery('');
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error finding best deals:', error);
      setLoading(false);
      Alert.alert('Error', 'Failed to find best deals. Please try again.');
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadCoupons().then(() => setRefreshing(false));
  };

  interface CategoryItem {
    id: string;
    name: string;
  }

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={[
        styles.categoryItem,
        selectedCategory === item.id && styles.categoryItemSelected,
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item.id && styles.categoryTextSelected,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Available Deals</Text>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => navigation.navigate('ScanReceipt')}
        >
          <MaterialIcons name="qr-code-scanner" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for deals..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>
      
      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      {/* Find Best Deals Button */}
      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.findDealsButton}
          onPress={handleFindBestDeals}
          disabled={loading}
        >
          <MaterialIcons name="flash-on" size={20} color="white" />
          <Text style={styles.findDealsText}>Find Best Deals for My Cart</Text>
        </TouchableOpacity>
      )}
      
      {/* Coupon List */}
      <View style={styles.couponsContainer}>
        {loading && coupons.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Loading deals...</Text>
          </View>
        ) : filteredCoupons.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="tag" size={64} color="#e0e0e0" />
            <Text style={styles.emptyText}>No deals found</Text>
            <Text style={styles.emptySubtext}>
              {searchQuery 
                ? 'Try a different search term' 
                : 'Check back later for new deals'}
            </Text>
            <TouchableOpacity 
              style={styles.continueButton}
              onPress={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
            >
              <Text style={styles.continueButtonText}>View All Deals</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <CouponList
            coupons={filteredCoupons}
            appliedCouponIds={appliedCouponIds}
            onApplyCoupon={handleApplyCoupon}
            loading={loading}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoriesList: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: '#f5f5f5',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  categoryItemSelected: {
    backgroundColor: '#e8f5e9',
    borderColor: '#4CAF50',
  },
  categoryText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextSelected: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  findDealsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 14,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  findDealsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  couponsContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  continueButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  continueButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CouponsScreen;
