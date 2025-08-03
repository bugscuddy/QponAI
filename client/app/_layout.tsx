import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Entypo, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

// Import screens
import { CouponsScreen } from './features/coupons/screens/CouponsScreen';
import HomeScreen from './screens/HomeScreen';
import CartScreen from './screens/CartScreen';
import ProfileScreen from './screens/ProfileScreen';
import { RootStackParamList } from '../types/navigation';

const Tab = createBottomTabNavigator<RootStackParamList>();

// Temporary placeholder components for screens we'll implement later
function PlaceholderScreen({ name }: { name: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{name} Screen</Text>
      <Text style={styles.hint}>This screen is under construction</Text>
    </View>
  );
}

// Set up the main tab navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = 'home';
            return <Entypo name={iconName} size={size} color={color} />;
          } else if (route.name === 'Coupons') {
            iconName = 'price-tag';
            return <Entypo name={iconName} size={size} color={color} />;
          } else if (route.name === 'Cart') {
            iconName = 'shopping-cart';
            return <FontAwesome name={iconName} size={size} color={color} />;
          } else if (route.name === 'Profile') {
            iconName = 'user';
            return <FontAwesome name={iconName} size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingTop: 5,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginBottom: 5,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen || (() => <PlaceholderScreen name="Home" />)} 
      />
      <Tab.Screen 
        name="Coupons" 
        component={CouponsScreen} 
        options={{
          title: 'Deals',
          tabBarBadge: 3, // Example badge for new deals
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen || (() => <PlaceholderScreen name="Cart" />)} 
        options={{
          tabBarBadge: 3, // Example cart item count
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen || (() => <PlaceholderScreen name="Profile" />)} 
      />
    </Tab.Navigator>
  );
}

export default function RootLayout() {
  return <TabNavigator />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  hint: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});
