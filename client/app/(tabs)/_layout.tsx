import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { TouchableOpacity, Text } from 'react-native';

export default function TabLayout() {
  const { signOut } = useAuth();

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="index" 
        options={{
          title: 'Home',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color }}>🏠</Text>,
        }} 
      />
      {/* Add your other tabs here */}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }: { color: string }) => <Text style={{ color }}>👤</Text>,
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity 
              onPress={() => signOut()}
              style={{ marginRight: 15 }}
            >
              <Text style={{ color: '#007AFF' }}>Sign Out</Text>
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}