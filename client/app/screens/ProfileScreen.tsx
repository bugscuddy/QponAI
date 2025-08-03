import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons, FontAwesome, Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  // Mock user data - in a real app, this would come from your auth context
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    memberSince: 'January 2023',
    totalSavings: 245.67,
    avatar: null,
  });

  const menuItems = [
    { 
      id: 'savings', 
      title: 'My Savings', 
      icon: 'savings',
      color: '#4CAF50',
      onPress: () => console.log('Navigate to Savings')
    },
    { 
      id: 'orders', 
      title: 'My Orders', 
      icon: 'shopping-bag',
      color: '#2196F3',
      onPress: () => console.log('Navigate to Orders')
    },
    { 
      id: 'favorites', 
      title: 'Favorites', 
      icon: 'favorite',
      color: '#F44336',
      onPress: () => console.log('Navigate to Favorites')
    },
    { 
      id: 'addresses', 
      title: 'Saved Addresses', 
      icon: 'location-on',
      color: '#9C27B0',
      onPress: () => console.log('Navigate to Addresses')
    },
    { 
      id: 'payment', 
      title: 'Payment Methods', 
      icon: 'payment',
      color: '#FF9800',
      onPress: () => console.log('Navigate to Payment')
    },
    { 
      id: 'settings', 
      title: 'Settings', 
      icon: 'settings',
      color: '#607D8B',
      onPress: () => console.log('Navigate to Settings')
    },
    { 
      id: 'help', 
      title: 'Help & Support', 
      icon: 'help-outline',
      color: '#00BCD4',
      onPress: () => console.log('Navigate to Help')
    },
    { 
      id: 'about', 
      title: 'About Us', 
      icon: 'info-outline',
      color: '#795548',
      onPress: () => console.log('Navigate to About')
    },
  ];

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // In a real app, you would handle the logout logic here
            console.log('User logged out');
          }
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>
                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </Text>
            </View>
          )}
          <TouchableOpacity style={styles.editButton}>
            <MaterialIcons name="edit" size={16} color="#4CAF50" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>${user.totalSavings.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Total Savings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.memberSince}</Text>
            <Text style={styles.statLabel}>Member Since</Text>
          </View>
        </View>
      </View>
      
      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity 
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress}
          >
            <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
              <MaterialIcons 
                name={item.icon as any} 
                size={24} 
                color={item.color} 
              />
            </View>
            <Text style={styles.menuText}>{item.title}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#BDBDBD" />
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#f44336" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      {/* App Version */}
      <Text style={styles.versionText}>QponAI v1.0.0</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#81C784',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    padding: 15,
    width: '100%',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 5,
  },
  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  logoutText: {
    color: '#f44336',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  versionText: {
    textAlign: 'center',
    color: '#9E9E9E',
    fontSize: 12,
    marginBottom: 20,
  },
});

export default ProfileScreen;
