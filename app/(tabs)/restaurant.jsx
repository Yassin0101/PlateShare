import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext';

// Restaurant data with menu items including restaurant info
const restaurantData = [
  {
    id: '1',
    name: 'Burger Palace',
    description: 'Best burgers in town',
    icon: 'hamburger',
    image: require('../../assets/Restaurants/Burger.jpg'),
    menu: [
      { id: '101', name: 'Classic Burger', price: 8.99, restaurantId: '1', restaurantName: 'Burger Palace' },
      { id: '102', name: 'Cheese Burger', price: 9.99, restaurantId: '1', restaurantName: 'Burger Palace' },
      { id: '103', name: 'Bacon Burger', price: 10.99, restaurantId: '1', restaurantName: 'Burger Palace' },
    ]
  },
  {
    id: '2',
    name: 'Pizza Heaven',
    description: 'Authentic Italian pizzas',
    icon: 'pizza-slice',
    image: require('../../assets/Restaurants/Pizza.jpg'),
    menu: [
      { id: '201', name: 'Margherita', price: 12.99, restaurantId: '2', restaurantName: 'Pizza Heaven' },
      { id: '202', name: 'Pepperoni', price: 14.99, restaurantId: '2', restaurantName: 'Pizza Heaven' },
      { id: '203', name: 'Vegetarian', price: 13.99, restaurantId: '2', restaurantName: 'Pizza Heaven' },
    ]
  },
  {
    id: '3',
    name: 'Sushi World',
    description: 'Fresh Japanese sushi',
    icon: 'fish',
    image: require('../../assets/Restaurants/japanese.jpg'),
    menu: [
      { id: '301', name: 'California Roll', price: 6.99, restaurantId: '3', restaurantName: 'Sushi World' },
      { id: '302', name: 'Salmon Nigiri', price: 8.99, restaurantId: '3', restaurantName: 'Sushi World' },
      { id: '303', name: 'Dragon Roll', price: 12.99, restaurantId: '3', restaurantName: 'Sushi World' },
    ]
  },
  {
    id: '4',
    name: 'Taco Fiesta',
    description: 'Mexican street food',
    icon: 'pepper-hot',
    image: require('../../assets/Restaurants/Taco.jpg'),
    menu: [
      { id: '401', name: 'Beef Taco', price: 3.99, restaurantId: '4', restaurantName: 'Taco Fiesta' },
      { id: '402', name: 'Chicken Quesadilla', price: 7.99, restaurantId: '4', restaurantName: 'Taco Fiesta' },
      { id: '403', name: 'Nachos', price: 5.99, restaurantId: '4', restaurantName: 'Taco Fiesta' },
    ]
  }
];

export default function RestaurantScreen() {
  const router = useRouter();
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const { cart, addToCart, clearCart, currentRestaurant } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const toastOpacity = new Animated.Value(0);

  useEffect(() => {
    if (showSuccessMessage) {
      Animated.timing(toastOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      const timer = setTimeout(() => {
        Animated.timing(toastOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowSuccessMessage(false));
      }, 2700);
      
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleAddToCart = async (item) => {
    setIsAddingToCart(true);
    try {
      if (!item || !item.id || !item.name || !item.price || !item.restaurantId || !item.restaurantName) {
        throw new Error('Invalid item structure');
      }
      
      await addToCart(item);
      setSuccessMessage(`${item.name} added to cart ✓`);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setSuccessMessage('Failed to add item to cart ✗');
      setShowSuccessMessage(true);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleRestaurantSelect = (restaurant) => {
    if (currentRestaurant && currentRestaurant.id !== restaurant.id) {
      setSuccessMessage(`Cleared cart to browse ${restaurant.name}`);
      clearCart();
      setShowSuccessMessage(true);
    }
    setSelectedRestaurant(restaurant);
  };

  const goBackToRestaurants = () => {
    setSelectedRestaurant(null);
  };

  if (selectedRestaurant) {
    return (
      <View style={styles.container}>
        {/* Success Message Toast */}
        {showSuccessMessage && (
          <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
            <Text style={styles.toastText}>{successMessage}</Text>
          </Animated.View>
        )}

        {/* Restaurant Details View */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Back Button and Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={goBackToRestaurants}
            >
              <Ionicons name="arrow-back" size={24} color="#4F46E5" />
              <Text style={styles.backButtonText}>All Restaurants</Text>
            </TouchableOpacity>
          </View>

          {/* Restaurant Hero Section */}
          <View style={styles.heroContainer}>
            <Image 
              source={selectedRestaurant.image} 
              style={styles.heroImage}
            />
            <View style={styles.heroOverlay}>
              <View style={styles.restaurantBadge}>
                <FontAwesome name={selectedRestaurant.icon} size={20} color="#fff" />
              </View>
              <Text style={styles.heroTitle}>{selectedRestaurant.name}</Text>
              <Text style={styles.heroSubtitle}>{selectedRestaurant.description}</Text>
            </View>
          </View>

          {/* Menu Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Menu</Text>
            <View style={styles.menuContainer}>
              {selectedRestaurant.menu.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemName}>{item.name}</Text>
                    <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.addButton, isAddingToCart && styles.disabledButton]}
                    onPress={() => handleAddToCart(item)}
                    disabled={isAddingToCart}
                  >
                    <Text style={styles.addButtonText}>
                      {isAddingToCart ? 'Adding...' : 'Add'}
                    </Text>
                    <MaterialIcons name="add" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Floating Cart Button */}
        {cart.length > 0 && (
          <TouchableOpacity
            style={styles.floatingCart}
            onPress={() => router.push('/cart')}
          >
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>
                {cart.reduce((total, item) => total + (item.quantity || 1), 0)}
              </Text>
            </View>
            <Text style={styles.floatingCartText}>View Cart</Text>
            <MaterialIcons name="shopping-cart" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Success Message Toast */}
      {showSuccessMessage && (
        <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
          <Text style={styles.toastText}>{successMessage}</Text>
        </Animated.View>
      )}

      {/* Restaurant List View */}
      <Text style={styles.pageTitle}>Nearby Restaurants</Text>
      <Text style={styles.pageSubtitle}>Discover places to share surplus food</Text>
      
      <FlatList
        data={restaurantData}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.restaurantCard}
            onPress={() => handleRestaurantSelect(item)}
          >
            <Image 
              source={item.image} 
              style={styles.cardImage}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={styles.iconContainer}>
                  <FontAwesome name={item.icon} size={16} color="#fff" />
                </View>
                <Text style={styles.restaurantName}>{item.name}</Text>
              </View>
              <Text style={styles.restaurantDescription}>{item.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.viewMenuText}>Browse menu</Text>
                <MaterialIcons name="arrow-forward" size={18} color="#4F46E5" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginTop: 24,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 24,
  },
  restaurantCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    backgroundColor: '#4F46E5',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  restaurantDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  viewMenuText: {
    color: '#4F46E5',
    fontWeight: '600',
    fontSize: 14,
  },
  heroContainer: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: 240,
    borderRadius: 16,
  },
  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 16,
  },
  restaurantBadge: {
    backgroundColor: '#4F46E5',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
  },
  sectionContainer: {
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  menuItemPrice: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#A5B4FC',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  floatingCart: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4F46E5',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cartBadge: {
    backgroundColor: '#fff',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cartBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  floatingCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 12,
  },
  toastContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 16,
    marginHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});