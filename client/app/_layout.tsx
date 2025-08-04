import React from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
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

function RootLayoutInner() {
  const { user, initialized } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Redirect logic
  React.useEffect(() => {
    if (!initialized) return; // wait for auth check

    const inAuthGroup = (segments[0] as string) === '(auth)';
    if (!user && !inAuthGroup) {
      (router.replace as any)('/(auth)/login');
    } else if (user && inAuthGroup) {
      (router.replace as any)('/(tabs)');
    }
  }, [user, initialized, segments]);

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen
          name="coupons/[id]"
          options={{ title: 'Coupon Details', headerShown: false, presentation: 'modal' }}
        />
      </Stack>
      <DebugRouter />
    </View>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutInner />
    </AuthProvider>
  );
}
