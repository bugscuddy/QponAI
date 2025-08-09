import { Tabs } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { TouchableOpacity, Text, View, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, radius, shadow } from '../../styles/theme';

export default function TabLayout() {
  const { signOut } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarItemStyle: { gap: 2 },
        tabBarStyle: {
          position: 'absolute',
          left: spacing.lg,
          right: spacing.lg,
          bottom: Platform.select({ ios: spacing.xl, android: spacing.lg, default: spacing.lg }) as number,
          height: 65,
          borderRadius: radius.full,
          backgroundColor: colors.cardBg,
          borderColor: colors.border,
          borderWidth: 1,
          paddingHorizontal: spacing.md,
          overflow: 'visible',
          zIndex: 1,
          ...shadow.card,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
          ),
          tabBarButton: (props: any) => {
            const focused = props?.accessibilityState?.selected;
            return (
              <TouchableOpacity
                {...props}
                accessibilityRole="button"
                accessibilityLabel="Home"
                style={[
                  props.style,
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: focused ? colors.subtle : 'transparent',
                  }}
                >
                  {props.children}
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tabs.Screen
        name="coupons"
        options={{
          title: 'Coupons',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? 'ticket' : 'ticket-outline'} size={24} color={color} />
          ),
          tabBarButton: (props: any) => {
            const focused = props?.accessibilityState?.selected;
            return (
              <TouchableOpacity
                {...props}
                accessibilityRole="button"
                accessibilityLabel="Deals"
                style={[
                  props.style,
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: focused ? colors.subtle : 'transparent',
                  }}
                >
                  {props.children}
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarLabel: '',
          tabBarIcon: () => (
            <MaterialCommunityIcons name="barcode-scan" size={32} color="white" />
          ),
          tabBarButton: (props: any) => (
            <TouchableOpacity
              {...props}
              accessibilityRole="button"
              accessibilityLabel="Scan Barcode"
              style={[
                props.style,
                {
                  position: 'absolute',
                  top: -24,
                  left: 0,
                  right: 0,
                  width: 64,
                  height: 64,
                  borderRadius: 32,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  ...shadow.card,
                },
              ]}
            >
              <MaterialCommunityIcons name="barcode-scan" size={32} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? 'cart' : 'cart-outline'} size={26} color={color} />
          ),
          tabBarButton: (props: any) => {
            const focused = props?.accessibilityState?.selected;
            return (
              <TouchableOpacity
                {...props}
                accessibilityRole="button"
                accessibilityLabel="Cart"
                style={[
                  props.style,
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: focused ? colors.subtle : 'transparent',
                  }}
                >
                  {props.children}
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: true,
          headerTitle: 'Profile',
          headerShadowVisible: false,
          headerRight: () => (
            <TouchableOpacity
              onPress={() => signOut()}
              style={{ marginRight: spacing.lg }}
            >
              <Text style={{ color: colors.primary, fontWeight: '700' }}>Sign Out</Text>
            </TouchableOpacity>
          ),
          tabBarIcon: ({ color, focused }: { color: string; focused: boolean }) => (
            <Ionicons name={focused ? 'person-circle' : 'person-circle-outline'} size={26} color={color} />
          ),
          tabBarButton: (props: any) => {
            const focused = props?.accessibilityState?.selected;
            return (
              <TouchableOpacity
                {...props}
                accessibilityRole="button"
                accessibilityLabel="Profile"
                style={[
                  props.style,
                  {
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  },
                ]}
              >
                <View
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 20,
                    backgroundColor: focused ? colors.subtle : 'transparent',
                  }}
                >
                  {props.children}
                </View>
              </TouchableOpacity>
            );
          },
        }}
      />
    </Tabs>
  );
}