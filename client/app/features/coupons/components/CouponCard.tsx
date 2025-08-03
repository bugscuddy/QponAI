import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Coupon } from '../services/CouponService';

interface CouponCardProps {
  coupon: Coupon;
  onApply: (couponId: string) => void;
  isApplied?: boolean;
}

const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onApply,
  isApplied = false,
}) => {
  const formatExpiryDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View style={[styles.card, isApplied && styles.appliedCard]}>
      <View style={styles.discountContainer}>
        <Text style={styles.discountText}>
          {coupon.discountType === 'percentage'
            ? `${coupon.discount}%`
            : `$${coupon.discount.toFixed(2)}`}
        </Text>
        <Text style={styles.offText}>OFF</Text>
      </View>
      
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{coupon.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {coupon.description}
        </Text>
        <Text style={styles.expiry}>
          Expires: {formatExpiryDate(coupon.validUntil)}
        </Text>
        {coupon.code && (
          <View style={styles.codeContainer}>
            <Text style={styles.codeText}>{coupon.code}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.applyButton, isApplied && styles.appliedButton]}
        onPress={() => onApply(coupon.id)}
        disabled={isApplied}
      >
        <Text style={styles.applyButtonText}>
          {isApplied ? 'Applied' : 'Apply'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  appliedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  discountContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 15,
    borderRightWidth: 1,
    borderRightColor: '#eee',
    minWidth: 70,
  },
  discountText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  offText: {
    fontSize: 12,
    color: '#666',
    marginTop: -5,
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  expiry: {
    fontSize: 10,
    color: '#999',
    marginBottom: 4,
  },
  codeContainer: {
    backgroundColor: '#f5f5f5',
    padding: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  codeText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333',
  },
  applyButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 36,
    alignSelf: 'center',
  },
  appliedButton: {
    backgroundColor: '#9E9E9E',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default CouponCard;
