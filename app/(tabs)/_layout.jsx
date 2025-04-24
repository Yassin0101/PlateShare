import { Tabs } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

// Reusable Icon Wrapper Component
const TabIconWrapper = ({ children, badgeCount }) => (
  <View style={styles.iconContainer}>
    {children}
    {badgeCount > 0 && (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{badgeCount}</Text>
      </View>
    )}
  </View>
);

// Tab Icons with Improved Accessibility
const HomeIcon = ({ color, focused }) => (
  <Ionicons 
    name={focused ? "home" : "home-outline"} 
    size={24} 
    color={color} 
    accessibilityLabel={focused ? "Home (current)" : "Home"}
  />
);

const RestaurantIcon = ({ color, focused }) => (
  <Ionicons 
    name={focused ? "restaurant" : "restaurant-outline"} 
    size={24} 
    color={color}
    accessibilityLabel={focused ? "Restaurants (current)" : "Restaurants"}
  />
);

const CartIcon = ({ color, focused }) => (
  <TabIconWrapper badgeCount={3}>
    <Ionicons 
      name={focused ? "cart" : "cart-outline"} 
      size={24} 
      color={color}
      accessibilityLabel={`Cart ${focused ? '(current)' : ''}`}
    />
  </TabIconWrapper>
);

const DonateIcon = ({ color, focused }) => (
  <View style={[
    styles.donateButton, 
    focused && styles.donateButtonActive
  ]}>
    <Ionicons 
      name={focused ? "heart" : "heart-outline"} 
      size={20} 
      color={focused ? "#fff" : color}
      accessibilityLabel={focused ? "Donate (current)" : "Donate"}
    />
  </View>
);

const CharityIcon = ({ color, focused }) => (
  <View style={{ alignItems: 'center' }}>
    <FontAwesome5
      name="hands-helping"
      size={20}
      color={color}
      solid={focused}
      accessibilityLabel={focused ? "Charity (current)" : "Charity"}
    />
    {focused && <View style={styles.activeIndicator} />}
  </View>
);

const ProfileIcon = ({ color, focused }) => (
  <Ionicons 
    name={focused ? "person" : "person-outline"} 
    size={24} 
    color={color}
    accessibilityLabel={focused ? "Profile (current)" : "Profile"}
  />
);

// Tab Configuration with Additional Options
const tabScreenConfigs = [
  {
    name: 'home',
    options: {
      title: 'Home',
      tabBarIcon: HomeIcon,
      href: '/home'
    }
  },
  {
    name: 'restaurant',
    options: {
      title: 'Restaurants',
      tabBarIcon: RestaurantIcon,
      href: '/restaurant'
    }
  },
  {
    name: 'cart',
    options: {
      title: 'Cart',
      tabBarIcon: CartIcon,
      href: '/cart'
    }
  },
  {
    name: 'donate-food',
    options: {
      title: '',
      tabBarIcon: DonateIcon,
      href: '/donate-food'
    }
  },
  {
    name: 'orphanages',
    options: {
      title: 'Charity',
      tabBarIcon: CharityIcon,
      href: '/orphanages'
    }
  },
  {
    name: 'profile',
    options: {
      title: 'Profile',
      tabBarIcon: ProfileIcon,
      href: '/profile'
    }
  }
];

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarHideOnKeyboard: true,
      }}
    >
      {tabScreenConfigs.map(({ name, options }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            ...options,
            tabBarAccessibilityLabel: options.title || 'Donate'
          }}
        />
      ))}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff',
    height: 60,
    paddingBottom: 5,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
    includeFontPadding: false,
  },
  donateButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    padding: 6,
    marginTop: -10,
  },
  donateButtonActive: {
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    padding: 6,
    marginTop: -10,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#4F46E5',
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});