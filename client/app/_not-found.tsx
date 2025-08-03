import { Text, View } from 'react-native';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: '600' }}>Page Not Found</Text>
        <Text style={{ textAlign: 'center', marginBottom: 20, color: '#666' }}>
          The page you're looking for doesn't exist or has been moved.
        </Text>
        <Link 
          href="/(tabs)" 
          style={{ 
            backgroundColor: '#4CAF50', 
            padding: 12, 
            borderRadius: 8,
            minWidth: 200,
            textAlign: 'center'
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>Go to Home</Text>
        </Link>
      </View>
    </>
  );
}
