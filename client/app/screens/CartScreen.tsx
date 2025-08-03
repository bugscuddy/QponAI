import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useCart } from '../../hooks/useCart';
import { MaterialIcons } from '@expo/vector-icons';

const CartScreen = () => {
  const { 
    cartItems, 
    updateCartItem, 
    removeFromCart, 
    clearCart, 
    getCartTotal 
  } = useCart();
  
  const [promoCode, setPromoCode] = useState('');
  const [appliedCoupons, setAppliedCoupons] = useState<string[]>([]);
  
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
    } else {
      updateCartItem(itemId, { quantity: newQuantity });
    }
  };
  
  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => removeFromCart(itemId)
        },
      ]
    );
  };
  
  const handleApplyPromoCode = () => {
    // In a real app, you would validate the promo code with your backend
    if (promoCode.trim() === '') return;
    
    // Mock validation
    if (promoCode.toUpperCase() === 'SAVE10') {
      setAppliedCoupons([...appliedCoupons, promoCode]);
      Alert.alert('Success', 'Promo code applied successfully!');
      setPromoCode('');
    } else {
      Alert.alert('Invalid Code', 'The promo code you entered is not valid.');
    }
  };
  
  const handleCheckout = () => {
    // In a real app, you would navigate to the checkout screen
    Alert.alert('Checkout', 'Proceeding to checkout...');
  };
  
  const calculateDiscount = () => {
    // In a real app, this would be calculated based on the applied coupons
    return appliedCoupons.includes('SAVE10') ? getCartTotal() * 0.1 : 0;
  };
  
  const calculateTotal = () => {
    return getCartTotal() - calculateDiscount();
  };
  
  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImage}>
        <Text style={styles.itemImagePlaceholder}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemPrice}>${(item.price || 3.99).toFixed(2)} each</Text>
        
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemTotalContainer}>
        <Text style={styles.itemTotal}>
          ${((item.price || 3.99) * item.quantity).toFixed(2)}
        </Text>
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.id)}
        >
          <MaterialIcons name="delete-outline" size={20} color="#f44336" />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  if (cartItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <MaterialIcons name="remove-shopping-cart" size={64} color="#e0e0e0" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <Text style={styles.emptySubtext}>Add items to get started</Text>
        <TouchableOpacity style={styles.continueShoppingButton}>
          <Text style={styles.continueShoppingText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <FlatList
        data={cartItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headerText}>Your Cart ({cartItems.length})</Text>
            <TouchableOpacity onPress={() => clearCart()}>
              <Text style={styles.clearCartText}>Clear All</Text>
            </TouchableOpacity>
          </View>
        }
      />
      
      <View style={styles.summaryContainer}>
        <View style={styles.promoCodeContainer}>
          <TextInput
            style={styles.promoCodeInput}
            placeholder="Enter promo code"
            value={promoCode}
            onChangeText={setPromoCode}
            placeholderTextColor="#999"
          />
          <TouchableOpacity 
            style={styles.applyButton}
            onPress={handleApplyPromoCode}
            disabled={!promoCode.trim()}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
        
        {appliedCoupons.length > 0 && (
          <View style={styles.appliedCoupons}>
            <Text style={styles.appliedCouponsTitle}>Applied Coupons:</Text>
            {appliedCoupons.map((code, index) => (
              <View key={index} style={styles.appliedCoupon}>
                <Text style={styles.appliedCouponCode}>{code}</Text>
                <TouchableOpacity 
                  onPress={() => setAppliedCoupons(appliedCoupons.filter(c => c !== code))}
                  style={styles.removeCouponButton}
                >
                  <MaterialIcons name="close" size={16} color="#f44336" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${getCartTotal().toFixed(2)}</Text>
        </View>
        
        {calculateDiscount() > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={[styles.summaryValue, styles.discountText]}>-${calculateDiscount().toFixed(2)}</Text>
          </View>
        )}
        
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${calculateTotal().toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  clearCartText: {
    color: '#f44336',
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemImagePlaceholder: {
    fontSize: 24,
    color: '#9e9e9e',
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    alignSelf: 'flex-start',
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
    elevation: 1,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#4CAF50',
    lineHeight: 20,
    marginTop: -2,
  },
  quantityText: {
    width: 30,
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  itemTotalContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  removeButton: {
    padding: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  continueShoppingText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  summaryContainer: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    padding: 16,
    boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  promoCodeInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
    marginRight: 8,
  },
  applyButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  appliedCoupons: {
    marginBottom: 16,
  },
  appliedCouponsTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  appliedCoupon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  appliedCouponCode: {
    color: '#2e7d32',
    fontWeight: '500',
    marginRight: 8,
  },
  removeCouponButton: {
    padding: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
  },
  summaryValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  discountText: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CartScreen;
