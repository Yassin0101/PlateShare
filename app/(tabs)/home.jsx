import React, { useState, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  Dimensions, 
  StyleSheet, 
  TextInput, 
  Pressable, 
  ScrollView, 
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import FastImage from 'react-native-fast-image';
import { db, auth } from '../services/firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import ThemedScreen from '../../components/ThemedScreen';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, 
      (currentUser) => {
        if (!currentUser) {
          router.replace('/login');
        } else {
          setUser(currentUser);
          fetchRestaurants();
        }
      },
      (authError) => {
        setError('Authentication error. Please login again.');
        console.error("Auth error:", authError);
        router.replace('/login');
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch restaurants data
  const fetchRestaurants = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "restaurants"));
      const restaurantsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRestaurants(restaurantsData);
      setError('');
    } catch (err) {
      setError('Failed to load restaurants. Please try again.');
      console.error("Firestore error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchRestaurants();
  };

  // Handle user sign out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      Alert.alert('Sign Out Error', error.message);
    }
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [restaurants, searchQuery]);

  // Don't render anything if no user
  if (!user) return null;

  return (
    <ThemedScreen>
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F46E5"
          />
        }
      >
        {/* Header with User Info */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Plate Share</Text>
            <Text style={styles.subtitle}>
              {user.displayName 
                ? `Welcome, ${user.displayName}`
                : user.email
                ? `Welcome, ${user.email}`
                : 'Turning surplus into smiles 🥗❤️'}
            </Text>
          </View>
          <Pressable 
            onPress={() => router.push(user ? '/profile' : '/login')}
            accessibilityLabel={user ? "User profile" : "Login"}
            accessibilityRole="button"
          >
            {user.photoURL ? (
              <FastImage
                source={{ uri: user.photoURL }}
                style={styles.profileImage}
              />
            ) : (
              <Ionicons name="person-circle-outline" size={32} color="#4F46E5" />
            )}
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search restaurants"
          />
          {searchQuery.length > 0 && (
            <Pressable 
              onPress={() => setSearchQuery('')}
              accessibilityLabel="Clear search"
              accessibilityRole="button"
            >
              <MaterialIcons name="cancel" size={20} color="#6B7280" />
            </Pressable>
          )}
        </View>

        {/* Content Section */}
        {error ? (
          <View style={styles.errorContainer}>
            <MaterialIcons name="error-outline" size={24} color="#DC2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color="#4F46E5" style={styles.loader} />
        ) : (
          <>
            {/* Featured Restaurants */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Restaurants</Text>
              <Pressable 
                onPress={() => router.push('/restaurant')}
                accessibilityRole="button"
              >
                <Text style={styles.seeAll}>See all</Text>
              </Pressable>
            </View>

            {filteredRestaurants.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No restaurants found</Text>
              </View>
            ) : (
              <Carousel
                loop
                width={width * 0.85}
                height={280}
                autoPlay
                data={filteredRestaurants}
                scrollAnimationDuration={1000}
                renderItem={({ item }) => (
                  <Pressable 
                    style={styles.card}
                    onPress={() => router.push({
                      pathname: '/restaurant',
                      params: { restaurantId: item.id }
                    })}
                    accessibilityLabel={`View ${item.name} details`}
                    accessibilityRole="button"
                  >
                    <FastImage
                      source={{ uri: item.imageUrl }}
                      style={styles.image}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                    <View style={styles.cardContent}>
                      <Text style={styles.name}>{item.name}</Text>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FBBF24" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                        <Text style={styles.distanceText}>• {item.distance}</Text>
                      </View>
                    </View>
                  </Pressable>
                )}
                mode="parallax"
                modeConfig={{
                  parallaxScrollingScale: 0.9,
                  parallaxScrollingOffset: 60,
                }}
              />
            )}

            {/* Categories */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Categories</Text>
            </View>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.categoriesContainer}
            >
              {['Burger', 'Pizza', 'Salad', 'Pasta', 'Dessert', 'Vegan'].map((category) => (
                <Pressable 
                  key={category} 
                  style={styles.categoryItem}
                  accessibilityRole="button"
                >
                  <Text style={styles.categoryText}>{category}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {/* Impact Message */}
            <Pressable 
              style={styles.impactContainer} 
              onPress={() => router.push('/donate-food')}
              accessibilityRole="button"
            >
              <View style={styles.impactContent}>
                <Text style={styles.impactTitle}>🌍 Make a Difference Today</Text>
                <Text style={styles.impactText}>
                  Every donated meal helps nourish a child in need. Tap here to share your surplus and spread joy.
                </Text>
                <View style={styles.impactButton}>
                  <Text style={styles.impactButtonText}>Donate Now</Text>
                  <MaterialIcons name="arrow-forward" size={16} color="#fff" />
                </View>
              </View>
            </Pressable>
          </>
        )}
      </ScrollView>
    </ThemedScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111827',
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '100%',
    height: 50,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#111827',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  seeAll: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
  },
  cardContent: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#111827',
    marginLeft: 4,
    marginRight: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoriesContainer: {
    paddingBottom: 8,
    marginBottom: 24,
  },
  categoryItem: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryText: {
    color: '#4F46E5',
    fontWeight: '600',
  },
  impactContainer: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  impactContent: {
    alignItems: 'center',
  },
  impactTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  impactText: {
    fontSize: 15,
    color: '#E0E7FF',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 16,
  },
  impactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4338CA',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  impactButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 8,
  },
  loader: {
    marginVertical: 40
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16
  },
  errorText: {
    color: '#DC2626',
    marginLeft: 8
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200
  },
  emptyText: {
    color: '#6B7280',
    fontSize: 16
  }
});