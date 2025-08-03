import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';

// Debug component to show current route
function DebugRouter() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    console.log('Current route segments:', segments);
  }, [segments]);

  if (__DEV__) {
    return (
      <View style={{
        position: 'absolute',
        bottom: 80,
        left: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 8,
        borderRadius: 8,
        zIndex: 1000,
      }}>
        <TouchableOpacity onPress={() => router.push('/(tabs)')}>
          <Text style={{ color: 'white' }}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/coupons')}>
          <Text style={{ color: 'white' }}>Coupons</Text>
        </TouchableOpacity>
        <Text style={{ color: 'white', marginTop: 5 }}>Route: {segments.join('/')}</Text>
      </View>
    );
  }
  return null;
}

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="coupons/[id]" 
          options={{ 
            title: 'Coupon Details',
            headerShown: false,
            presentation: 'modal',
          }} 
        />
      </Stack>
      <DebugRouter />
    </View>
  );
}
