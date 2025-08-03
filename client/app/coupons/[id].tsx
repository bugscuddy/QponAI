import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

type Coupon = {
  id: string;
  title: string;
  description: string;
  expiryDate: string;
  discount: string;
  terms: string;
  code?: string;
};

// Mock data - in a real app, this would come from an API
const MOCK_COUPONS: Record<string, Coupon> = {
  '1': {
    id: '1',
    title: '20% Off Fresh Produce',
    description: 'Get 20% off on all fresh fruits and vegetables',
    expiryDate: 'December 31, 2023',
    discount: '20%',
    terms: 'Valid on all fresh produce. One coupon per transaction. Cannot be combined with other offers.',
    code: 'FRESH20'
  },
  '2': {
    id: '2',
    title: '$5 Off $50 Purchase',
    description: 'Save $5 when you spend $50 or more',
    expiryDate: 'November 30, 2023',
    discount: '$5',
    terms: 'Minimum purchase of $50 before tax required. One coupon per transaction.',
    code: 'SAVE5'
  },
  '3': {
    id: '3',
    title: 'Buy One Get One Free',
    description: 'Buy one item, get the second one free of equal or lesser value',
    expiryDate: 'October 15, 2023',
    discount: 'BOGO',
    terms: 'Buy one item at regular price, get second item of equal or lesser value free. Valid on select items only.'
  },
};

export default function CouponDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const coupon = MOCK_COUPONS[id as string];

  if (!coupon) {
    return (
      <View style={styles.container}>
        <Text>Coupon not found</Text>
      </View>
    );
  }

  const handleAddToWallet = () => {
    // In a real app, this would add the coupon to the user's wallet
    Alert.alert('Added to Wallet', `${coupon.title} has been added to your wallet.`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coupon Details</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.couponContainer}>
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{coupon.discount}</Text>
        </View>

        <Text style={styles.title}>{coupon.title}</Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MaterialIcons name="description" size={20} color="#4CAF50" />
            <Text style={styles.detailText}>{coupon.description}</Text>
          </View>

          <View style={styles.detailRow}>
            <MaterialIcons name="event" size={20} color="#4CAF50" />
            <Text style={styles.detailText}>Expires: {coupon.expiryDate}</Text>
          </View>

          {coupon.code && (
            <View style={styles.detailRow}>
              <MaterialIcons name="confirmation-number" size={20} color="#4CAF50" />
              <Text style={styles.codeText}>Code: {coupon.code}</Text>
            </View>
          )}
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsTitle}>Terms & Conditions</Text>
          <Text style={styles.termsText}>{coupon.terms}</Text>
        </View>

        <TouchableOpacity
          style={styles.addToWalletButton}
          onPress={handleAddToWallet}
        >
          <Text style={styles.addToWalletText}>Add to Wallet</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#4CAF50',
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  headerRight: {
    width: 30,
  },
  couponContainer: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    alignItems: 'center',
  },
  discountBadge: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  discountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
    flex: 1,
  },
  codeText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#4CAF50',
    fontWeight: '600',
    flex: 1,
  },
  termsContainer: {
    width: '100%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  addToWalletButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
  },
  addToWalletText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
