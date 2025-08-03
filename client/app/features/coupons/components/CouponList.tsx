import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Coupon } from '../services/CouponService';
import CouponCard from './CouponCard';

interface CouponListProps {
  coupons: Coupon[];
  appliedCouponIds: string[];
  onApplyCoupon: (couponId: string) => Promise<void>;
  loading?: boolean;
}

const CouponList: React.FC<CouponListProps> = ({
  coupons,
  appliedCouponIds,
  onApplyCoupon,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'applicable' | 'applied'>('all');
  const [applyingCouponId, setApplyingCouponId] = useState<string | null>(null);

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const isApplied = appliedCouponIds.includes(coupon.id);
    
    if (activeFilter === 'applied') return isApplied && matchesSearch;
    if (activeFilter === 'applicable') return !isApplied && matchesSearch;
    return matchesSearch;
  });

  const handleApplyCoupon = async (couponId: string) => {
    try {
      setApplyingCouponId(couponId);
      await onApplyCoupon(couponId);
    } finally {
      setApplyingCouponId(null);
    }
  };

  if (loading && coupons.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>Loading coupons...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search coupons..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.filterContainer}>
        <FilterButton
          label="All"
          isActive={activeFilter === 'all'}
          onPress={() => setActiveFilter('all')}
        />
        <FilterButton
          label="Applicable"
          isActive={activeFilter === 'applicable'}
          onPress={() => setActiveFilter('applicable')}
        />
        <FilterButton
          label="Applied"
          isActive={activeFilter === 'applied'}
          onPress={() => setActiveFilter('applied')}
        />
      </View>

      {filteredCoupons.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No coupons match your search' : 'No coupons available'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredCoupons}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CouponCard
              coupon={item}
              onApply={handleApplyCoupon}
              isApplied={appliedCouponIds.includes(item.id)}
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{ height: 20 }} />}
        />
      )}
    </View>
  );
};

const FilterButton: React.FC<{
  label: string;
  isActive: boolean;
  onPress: () => void;
}> = ({ label, isActive, onPress }) => (
  <TouchableOpacity
    style={[styles.filterButton, isActive && styles.activeFilterButton]}
    onPress={onPress}
  >
    <Text style={[styles.filterButtonText, isActive && styles.activeFilterButtonText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
    boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
    elevation: 2,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginHorizontal: 4,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    color: '#666',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: 'white',
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default CouponList;
