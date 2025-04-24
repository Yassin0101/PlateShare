import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Image, Dimensions } from 'react-native';
import { useCart } from '../../context/CartContext';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function Cart() {
  const { cart, removeFromCart, clearCart } = useCart();
  const router = useRouter();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [trackingStage, setTrackingStage] = useState(0); // 0: Preparing, 1: On the way, 2: Delivered

  // Sample restaurant location (replace with actual data from your context/API)
  const restaurantLocation = {
    latitude: 37.78825,
    longitude: -122.4324,
  };

  // Sample user location
  const userLocation = {
    latitude: 37.7749,
    longitude: -122.4194,
  };

  const formatPrice = (price) => `$${price.toFixed(2)}`;

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  };

  const handlePlaceOrder = () => {
    // In a real app, you would send this to your backend
    setOrderPlaced(true);
    
    // Simulate order tracking progress
    setTimeout(() => setTrackingStage(1), 3000); // On the way after 3 sec
    setTimeout(() => setTrackingStage(2), 8000); // Delivered after 8 sec
  };

  const TrackingProgress = () => {
    const stages = ['Preparing', 'On the way', 'Delivered'];
    
    return (
      <View style={styles.trackingContainer}>
        {stages.map((stage, index) => (
          <View key={index} style={styles.trackingStep}>
            <View style={[
              styles.trackingDot,
              index <= trackingStage && styles.activeDot,
              index < trackingStage && styles.completedDot
            ]}>
              {index < trackingStage && (
                <Ionicons name="checkmark" size={12} color="#fff" />
              )}
            </View>
            <Text style={[
              styles.trackingText,
              index <= trackingStage && styles.activeText
            ]}>
              {stage}
            </Text>
            {index < stages.length - 1 && (
              <View style={[
                styles.trackingLine,
                index < trackingStage && styles.activeLine
              ]} />
            )}
          </View>
        ))}
      </View>
    );
  };

  if (orderPlaced) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => {
            setOrderPlaced(false);
            clearCart();
            router.push('/home');
          }}>
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </Pressable>
          <Text style={styles.title}>Order Tracking</Text>
          <View style={{ width: 24 }} />
        </View>

        <TrackingProgress />

        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: (restaurantLocation.latitude + userLocation.latitude) / 2,
              longitude: (restaurantLocation.longitude + userLocation.longitude) / 2,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          >
            <Marker
              coordinate={restaurantLocation}
              title="Restaurant"
              pinColor="#4F46E5"
            />
            <Marker
              coordinate={userLocation}
              title="Your Location"
              pinColor="#10B981"
            />
          </MapView>
        </View>

        <View style={styles.deliveryInfo}>
          <View style={styles.driverInfo}>
            <Image 
              source={{ uri: '../../assets/random-driver.jpg' }} 
              style={styles.driverImage}
            />
            <View style={styles.driverDetails}>
              <Text style={styles.driverName}>John D. (Your driver)</Text>
              <Text style={styles.vehicleInfo}>Toyota Prius • ABC123</Text>
            </View>
            <Pressable style={styles.callButton}>
              <Ionicons name="call" size={20} color="#4F46E5" />
            </Pressable>
          </View>

          <View style={styles.estimatedTime}>
            <Ionicons name="time-outline" size={20} color="#6B7280" />
            <Text style={styles.timeText}>
              {trackingStage === 0 ? '10-15 min' : trackingStage === 1 ? '5-8 min' : 'Delivered'}
            </Text>
          </View>
        </View>

        <Pressable 
          style={styles.backToHomeButton}
          onPress={() => {
            setOrderPlaced(false);
            clearCart();
            router.push('/home');
          }}
        >
          <Text style={styles.backToHomeText}>Back to Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#4F46E5" />
        </Pressable>
        <Text style={styles.title}>Your Cart</Text>
        <View style={{ width: 24 }} />
      </View>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image 
            source={require('../../assets/empty-cart.png')} 
            style={styles.emptyImage}
          />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>Browse restaurants and add items to get started</Text>
          <Pressable 
            style={styles.browseButton}
            onPress={() => router.push('/home')}
          >
            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.cartItemText}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>{formatPrice(item.price)}</Text>
                  {item.quantity > 1 && (
                    <Text style={styles.quantityText}>× {item.quantity}</Text>
                  )}
                </View>
                <Pressable 
                  style={styles.removeButton}
                  onPress={() => removeFromCart(item.id)}
                >
                  <MaterialIcons name="delete-outline" size={20} color="#EF4444" />
                </Pressable>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListFooterComponent={
              <>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>Subtotal</Text>
                  <Text style={styles.totalAmount}>{formatPrice(calculateTotal())}</Text>
                </View>
                <View style={styles.totalContainer}>
                  <Text style={styles.totalText}>Delivery Fee</Text>
                  <Text style={styles.totalAmount}>$2.99</Text>
                </View>
                <View style={[styles.totalContainer, styles.grandTotal]}>
                  <Text style={styles.grandTotalText}>Total</Text>
                  <Text style={styles.grandTotalAmount}>{formatPrice(calculateTotal() + 2.99)}</Text>
                </View>
              </>
            }
          />

          <Pressable 
            style={styles.checkoutButton}
            onPress={handlePlaceOrder}
          >
            <Text style={styles.checkoutButtonText}>Place Order</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  itemInfo: {
    flex: 1,
  },
  cartItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#6B7280',
  },
  quantityText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  grandTotal: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 8,
  },
  totalText: {
    fontSize: 16,
    color: '#6B7280',
  },
  totalAmount: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },
  grandTotalText: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
  },
  grandTotalAmount: {
    fontSize: 18,
    color: '#111827',
    fontWeight: '700',
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  trackingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  trackingStep: {
    alignItems: 'center',
    position: 'relative',
  },
  trackingDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  activeDot: {
    borderColor: '#4F46E5',
  },
  completedDot: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  trackingText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  activeText: {
    color: '#4F46E5',
  },
  trackingLine: {
    position: 'absolute',
    top: 11,
    left: '50%',
    width: width - 160,
    height: 2,
    backgroundColor: '#E5E7EB',
    zIndex: -1,
  },
  activeLine: {
    backgroundColor: '#4F46E5',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  deliveryInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  driverImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  driverDetails: {
    flex: 1,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#6B7280',
  },
  callButton: {
    padding: 8,
  },
  estimatedTime: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  timeText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 8,
  },
  backToHomeButton: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backToHomeText: {
    color: '#111827',
    fontWeight: '600',
    fontSize: 16,
  },
});