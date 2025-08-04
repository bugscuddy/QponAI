import { Redirect } from 'expo-router';

// This is the root index file that redirects to the main app
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
