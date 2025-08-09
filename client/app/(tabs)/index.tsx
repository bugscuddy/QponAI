import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useColorScheme, Dimensions, ImageSourcePropType, TextStyle, ViewStyle, ImageStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Coupon {
  id: string;
  title: string;
  description: string;
  expiry: string;
  brand: string;
  image: string;
  isClipped: boolean;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  route: string;
}

// Mock data - replace with actual data from your API
const featuredCoupons: Coupon[] = [
  {
    id: '1',
    title: '20% Off Fresh Produce',
    description: 'On all fresh fruits and vegetables',
    expiry: 'Expires in 3 days',
    brand: 'ShopRite',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    isClipped: false
  },
  {
    id: '2',
    title: '$2 Off Any $10 Purchase',
    description: 'Minimum $10 purchase required',
    expiry: 'Expires in 5 days',
    brand: 'ShopRite',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    isClipped: true
  },
  {
    id: '3',
    title: 'Buy One Get One Free',
    description: 'On selected cereal brands',
    expiry: 'Expires in 2 days',
    brand: 'Kellogg\'s',
    image: 'https://images.unsplash.com/photo-1616628188527-1e4b56285f5d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    isClipped: false
  },
];

const quickActions: QuickAction[] = [
  { id: '1', title: 'Scan Receipt', icon: 'receipt', color: '#FF6B6B', route: '/(tabs)/scan' },
  { id: '2', title: 'My List', icon: 'format-list-checks', color: '#4CAF50', route: '/(tabs)/list' },
  { id: '3', title: 'Deals', icon: 'tag-multiple', color: '#2196F3', route: '/(tabs)/deals' },
  { id: '4', title: 'Stores', icon: 'store', color: '#9C27B0', route: '/(tabs)/stores' },
];

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const renderCouponCard = (coupon: typeof featuredCoupons[0]) => (
    <View key={coupon.id} style={styles.couponCard}>
      <Image 
        source={{ uri: coupon.image }} 
        style={styles.couponImage}
        resizeMode="cover"
      />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.couponGradient}
      />
      <View style={styles.couponContent}>
        <View>
          <Text style={styles.couponBrand}>{coupon.brand}</Text>
          <Text style={styles.couponTitle}>{coupon.title}</Text>
          <Text style={styles.couponDescription}>{coupon.description}</Text>
          <Text style={styles.couponExpiry}>{coupon.expiry}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.clipButton, coupon.isClipped && styles.clippedButton]}
          onPress={() => console.log('Clip coupon', coupon.id)}
        >
          <MaterialIcons 
            name={coupon.isClipped ? 'check' : 'add'} 
            size={20} 
            color="#fff" 
          />
          <Text style={styles.clipButtonText}>
            {coupon.isClipped ? 'Clipped' : 'Clip'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, isDark && styles.darkContainer]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>Alex</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <MaterialIcons name="notifications-none" size={24} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity 
          style={[styles.searchBar, isDark && styles.darkSearchBar]}
          onPress={() => router.push('/(tabs)/search' as any)}
        >
          <MaterialIcons name="search" size={24} color="#888" />
          <Text style={[styles.searchText, isDark && { color: '#ccc' }]}>Search for coupons and deals...</Text>
        </TouchableOpacity>

        {/* Featured Coupons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && { color: '#fff' }]}>Featured Coupons</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.couponsContainer}
          >
            {featuredCoupons.map(renderCouponCard)}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDark && { color: '#fff' }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <TouchableOpacity 
                key={action.id} 
                style={[styles.gridActionButton, { backgroundColor: action.color }]}
                onPress={() => router.push(action.route as any)}
              >
                <MaterialCommunityIcons name={action.icon as any} size={28} color="#fff" />
                <Text style={styles.actionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Personalized Deals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, isDark && { color: '#fff' }]}>For You</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.personalizedCard}>
            <View style={styles.personalizedContent}>
              <Text style={styles.personalizedTitle}>Personalized Deals</Text>
              <Text style={styles.personalizedText}>Based on your shopping history, we found special offers just for you!</Text>
              <TouchableOpacity style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View Deals</Text>
              </TouchableOpacity>
            </View>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80' }} 
              style={styles.personalizedImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

interface Styles {
  container: ViewStyle;
  darkContainer: ViewStyle;
  scrollContainer: ViewStyle;
  header: ViewStyle;
  greeting: TextStyle;
  darkGreeting: TextStyle;
  userName: TextStyle;
  darkUserName: TextStyle;
  profileButton: ViewStyle;
  darkProfileButton: ViewStyle;
  searchBar: ViewStyle;
  darkSearchBar: ViewStyle;
  searchText: TextStyle;
  section: ViewStyle;
  sectionHeader: ViewStyle;
  sectionTitle: TextStyle;
  seeAll: TextStyle;
  couponsContainer: ViewStyle;
  couponCard: ViewStyle;
  couponImage: ImageStyle;
  couponGradient: ViewStyle;
  couponContent: ViewStyle;
  couponBrand: TextStyle;
  couponTitle: TextStyle;
  couponDescription: TextStyle;
  couponExpiry: TextStyle;
  clipButton: ViewStyle;
  clippedButton: ViewStyle;
  clipButtonText: TextStyle;
  actionsGrid: ViewStyle;
  gridActionButton: ViewStyle;
  listActionButton: ViewStyle;
  actionText: TextStyle;
  personalizedCard: ViewStyle;
  personalizedContent: ViewStyle;
  personalizedTitle: TextStyle;
  personalizedText: TextStyle;
  viewButton: ViewStyle;
  viewButtonText: TextStyle;
  personalizedImage: ImageStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  darkGreeting: {
    color: '#aaa',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  darkUserName: {
    color: '#fff',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkProfileButton: {
    backgroundColor: '#333',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkSearchBar: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
  },
  searchText: {
    marginLeft: 10,
    color: '#888',
    fontSize: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    color: '#FF6B6B',
    fontWeight: '600',
  },
  couponsContainer: {
    paddingVertical: 8,
  },
  couponCard: {
    width: width * 0.8,
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginRight: 16,
    position: 'relative',
  },
  couponImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  couponGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  couponContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  couponBrand: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  couponTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  couponDescription: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginBottom: 4,
  },
  couponExpiry: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    marginTop: 4,
  },
  clipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B6B',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  clippedButton: {
    backgroundColor: '#4CAF50',
  },
  clipButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridActionButton: {
    width: '48%',
    height: 100,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
  },

  personalizedCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    height: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  personalizedContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  personalizedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  personalizedText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  viewButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  viewButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  personalizedImage: {
    width: '40%',
    height: '100%',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listActionButton: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
