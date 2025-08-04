import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';

type Coupon = {
  id: string;
  title: string;
  description: string;
  expiryDate: string;
  discount: string;
};

const mockCoupons: Coupon[] = [
  {
    id: '1',
    title: '20% Off Fresh Produce',
    description: 'Get 20% off on all fresh fruits and vegetables',
    expiryDate: '2023-12-31',
    discount: '20%',
  },
  {
    id: '2',
    title: '$5 Off $50 Purchase',
    description: 'Save $5 when you spend $50 or more',
    expiryDate: '2023-11-30',
    discount: '$5',
  },
  {
    id: '3',
    title: 'Buy One Get One Free',
    description: 'Buy one item, get the second one free of equal or lesser value',
    expiryDate: '2023-10-15',
    discount: 'BOGO',
  },
];

export default function CouponsScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    // Simulate API call
    const fetchCoupons = async () => {
      try {
        console.log('Fetching coupons...');
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCoupons(mockCoupons);
      } catch (err) {
        console.error('Failed to fetch coupons:', err);
        setError('Failed to load coupons. Please try again.');
        Alert.alert('Error', 'Failed to load coupons. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  const renderCoupon = ({ item }: { item: Coupon }) => {
    console.log('Rendering coupon:', item.id);
    return (
      <TouchableOpacity 
        style={styles.couponCard}
        onPress={() => {
          console.log('Navigating to coupon:', item.id);
          router.push({
            pathname: "/coupons/[id]",
            params: { id: item.id }
          });
        }}
      >
        <View style={styles.couponHeader}>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{item.discount}</Text>
          </View>
          <View style={styles.couponInfo}>
            <Text style={styles.couponTitle}>{item.title}</Text>
            <Text style={styles.couponDescription}>
              {item.description}
            </Text>
          </View>
        </View>
        <View style={styles.couponFooter}>
          <Text style={styles.expiryText}>
            Expires: {new Date(item.expiryDate).toLocaleDateString()}
          </Text>
          <MaterialIcons name="chevron-right" size={24} color="#4CAF50" />
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading coupons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <MaterialIcons name="error-outline" size={50} color="#f44336" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => {
            setIsLoading(true);
            setError(null);
            setCoupons([]);
            // Retry loading
            setTimeout(() => setCoupons(mockCoupons), 1000);
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log('Rendering coupons list with', coupons.length, 'items');
  
  return (
    <View style={styles.container} testID="coupons-screen">
      <View style={styles.header}>
        <Text style={styles.title}>My Coupons</Text>
        <TouchableOpacity 
          style={styles.scanButton}
          onPress={() => {
            console.log('Navigate to scan screen');
            router.push('/scan');
          }}
          testID="scan-button"
        >
          <MaterialIcons name="qr-code-scanner" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
      {coupons.length === 0 ? (
        <View style={styles.centered}>
          <MaterialIcons name="redeem" size={60} color="#e0e0e0" />
          <Text style={styles.emptyText}>No coupons available</Text>
          <Text style={styles.emptySubtext}>Check back later for new deals!</Text>
        </View>
      ) : (
        <FlatList
          data={coupons}
          renderItem={renderCoupon}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          testID="coupons-list"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    fontSize: 18,
    color: '#9e9e9e',
    marginTop: 16,
    fontWeight: '500',
  },
  emptySubtext: {
    color: '#bdbdbd',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
  listContent: {
    padding: 15,
  },
  couponCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  couponHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  discountBadge: {
    backgroundColor: '#E8F5E9',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  discountText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
  },
  couponInfo: {
    flex: 1,
  },
  couponTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#333',
  },
  couponDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  couponFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  expiryText: {
    fontSize: 14,
    color: '#888',
  },
});
