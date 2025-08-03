import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useCart } from '../../hooks/useCart';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
  const { cartItems, getCartTotal } = useCart();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userName, setUserName] = useState('Valued Customer');
  
  // In a real app, you would fetch the user's name from your auth context
  useEffect(() => {
    // Mock user data - in a real app, this would come from your auth context
    setUserName('Alex');
  }, []);

  const quickActions = [
    { 
      id: 'find-deals', 
      title: 'Find Deals', 
      icon: 'price-tag',
      onPress: () => navigation.navigate('Coupons') 
    },
    { 
      id: 'scan-receipt', 
      title: 'Scan Receipt', 
      icon: 'camera',
      onPress: () => console.log('Scan Receipt') 
    },
    { 
      id: 'shopping-list', 
      title: 'My Lists', 
      icon: 'list',
      onPress: () => console.log('My Lists') 
    },
    { 
      id: 'savings', 
      title: 'My Savings', 
      icon: 'dollar',
      onPress: () => console.log('My Savings') 
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userName}!</Text>
        <Text style={styles.subtitle}>Find the best deals at Shoprite</Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          {quickActions.map((action) => (
            <TouchableOpacity 
              key={action.id} 
              style={styles.actionButton}
              onPress={action.onPress}
            >
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>
                  {action.icon === 'price-tag' && '🏷️'}
                  {action.icon === 'camera' && '📷'}
                  {action.icon === 'list' && '📋'}
                  {action.icon === 'dollar' && '💰'}
                </Text>
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Current Cart Summary */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Cart</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Cart')}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        
        {cartItems.length > 0 ? (
          <View style={styles.cartSummary}>
            <View style={styles.cartItems}>
              {cartItems.slice(0, 3).map((item, index) => (
                <View key={item.id} style={styles.cartItem}>
                  <Text style={styles.cartItemName} numberOfLines={1}>
                    {item.quantity}x {item.name}
                  </Text>
                  {index < Math.min(2, cartItems.length - 1) && <View style={styles.divider} />}
                </View>
              ))}
              {cartItems.length > 3 && (
                <Text style={styles.moreItems}>+{cartItems.length - 3} more items</Text>
              )}
            </View>
            <View style={styles.cartTotal}>
              <Text style={styles.totalText}>Total:</Text>
              <Text style={styles.totalAmount}>${getCartTotal().toFixed(2)}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.emptyCart}>
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => console.log('Start Shopping')}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Featured Deals */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Deals</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Coupons')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.featuredDeals}>
          <View style={styles.featuredDeal}>
            <View style={styles.dealBadge}>
              <Text style={styles.dealBadgeText}>30% OFF</Text>
            </View>
            <Text style={styles.dealTitle}>Organic Produce</Text>
            <Text style={styles.dealDescription}>Selected organic fruits and vegetables</Text>
          </View>
          
          <View style={[styles.featuredDeal, styles.featuredDealHighlight]}>
            <View style={[styles.dealBadge, styles.highlightBadge]}>
              <Text style={[styles.dealBadgeText, styles.highlightBadgeText]}>BEST VALUE</Text>
            </View>
            <Text style={[styles.dealTitle, styles.highlightText]}>Buy 1 Get 1 Free</Text>
            <Text style={[styles.dealDescription, styles.highlightText]}>On selected bakery items</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#4CAF50',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  seeAll: {
    color: '#4CAF50',
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    alignItems: 'center',
    width: '23%',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e8f5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionIconText: {
    fontSize: 24,
  },
  actionText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#333',
  },
  cartSummary: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  cartItems: {
    marginBottom: 12,
  },
  cartItem: {
    marginBottom: 4,
  },
  cartItemName: {
    fontSize: 14,
    color: '#555',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 6,
  },
  moreItems: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 4,
  },
  cartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 8,
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  emptyCart: {
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 16,
  },
  shopButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  featuredDeals: {
    marginTop: 8,
  },
  featuredDeal: {
    backgroundColor: '#f0f7ff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  featuredDealHighlight: {
    backgroundColor: '#4CAF50',
  },
  dealBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#ffc107',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  highlightBadge: {
    backgroundColor: '#ffeb3b',
  },
  dealBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  highlightBadgeText: {
    color: '#4CAF50',
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 4,
  },
  highlightText: {
    color: 'white',
  },
  dealDescription: {
    fontSize: 14,
    color: '#555',
  },
});

export default HomeScreen;
