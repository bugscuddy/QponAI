import { MaterialIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../context/AuthContext';

type MenuItem = {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
};

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const menuItems: MenuItem[] = [
    {
      id: '1',
      title: 'My Orders',
      icon: 'shopping-bag',
      onPress: () => console.log('Orders pressed'),
    },
    {
      id: '2',
      title: 'Saved Coupons',
      icon: 'bookmark',
      onPress: () => console.log('Saved Coupons pressed'),
    },
    {
      id: '3',
      title: 'Payment Methods',
      icon: 'credit-card',
      onPress: () => console.log('Payment Methods pressed'),
    },
    {
      id: '4',
      title: 'Settings',
      icon: 'settings',
      onPress: () => console.log('Settings pressed'),
    },
    {
      id: '5',
      title: 'Help & Support',
      icon: 'help-outline',
      onPress: () => console.log('Help pressed'),
    },
    {
      id: '6',
      title: 'Logout',
      icon: 'logout',
      onPress: logout,
    },
  ];

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.menuItem} onPress={item.onPress}>
      <View style={styles.menuItemLeft}>
        <MaterialIcons name={item.icon as any} size={24} color="#4CAF50" />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#999" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileHeader}>
          <Image
            source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.email?.split('@')[0] || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'No email'}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <View key={item.id}>
            {renderMenuItem({ item })}
            {item.id !== menuItems[menuItems.length - 1].id && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    // For iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
  },
  menuContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 5,
    elevation: 3,
    // For iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 60,
  },
});
