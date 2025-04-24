import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Modal, Pressable, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';

const orphanages = [
  { 
    id: '1', 
    name: 'Sunshine Orphanage', 
    address: '123 Love Lane, Hope City',
    distance: '2.5 km away',
    rating: 4.8,
    image: require('../../assets/orphanages/sunshine.jpg'),
    location: { latitude: 12.3456, longitude: 98.7654 }
  },
  { 
    id: '2', 
    name: 'Hope Haven', 
    address: '456 Care St, Kindville',
    distance: '3.1 km away',
    rating: 4.6,
    image: require('../../assets/orphanages/hope.jpg'),
    location: { latitude: 23.4567, longitude: 87.6543 }
  },
  { 
    id: '3', 
    name: 'Angels Home', 
    address: '789 Peace Rd, Blessington',
    distance: '5.2 km away',
    rating: 4.9,
    image: require('../../assets/orphanages/angels.jpg'),
    location: { latitude: 34.5678, longitude: 76.5432 }
  },
];

export default function Orphanages() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handlePress = (item) => {
    router.push({
      pathname: '/orphanage-details',
      params: { 
        id: item.id,
        name: item.name,
        address: item.address
      }
    });
  };

  const handleLocationPress = (location) => {
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const openInGoogleMaps = () => {
    if (selectedLocation) {
      const url = `https://www.google.com/maps/search/?api=1&query=${selectedLocation.latitude},${selectedLocation.longitude}`;
      Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.orphanageCard}>
      <Image source={item.image} style={styles.orphanageImage} />
      <View style={styles.orphanageInfo}>
        <View style={styles.headerRow}>
          <Text style={styles.orphanageName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <View style={styles.addressRow}>
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text style={styles.orphanageAddress}>{item.address}</Text>
        </View>
        <View style={styles.distanceRow}>
          <MaterialIcons name="directions-walk" size={16} color="#4F46E5" />
          <Text style={styles.distanceText}>{item.distance}</Text>
        </View>
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => handleLocationPress(item.location)}
          >
            <Ionicons name="map-outline" size={16} color="#4F46E5" />
            <Text style={styles.locationButtonText}>Check Location</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => handlePress(item)}
          >
            <Text style={styles.detailsButtonText}>View Details</Text>
            <Ionicons name="chevron-forward" size={16} color="#4F46E5" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Partner Orphanages</Text>
      <Text style={styles.pageSubtitle}>Find nearby orphanages to support</Text>
      
      <FlatList
        data={orphanages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="home-outline" size={48} color="#9CA3AF" />
            <Text style={styles.emptyText}>No orphanages available in your area</Text>
          </View>
        }
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Orphanage Location</Text>
            
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: selectedLocation?.latitude || 0,
                  longitude: selectedLocation?.longitude || 0,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                {selectedLocation && (
                  <Marker
                    coordinate={{
                      latitude: selectedLocation.latitude,
                      longitude: selectedLocation.longitude,
                    }}
                    title="Orphanage Location"
                  />
                )}
              </MapView>
            </View>
            
            <View style={styles.modalButtonContainer}>
              <Pressable
                style={[styles.modalButton, styles.secondaryButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.secondaryButtonText}>Close</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.primaryButton]}
                onPress={openInGoogleMaps}
              >
                <View style={styles.buttonContent}>
                  <Ionicons name="open-outline" size={16} color="white" />
                  <Text style={styles.primaryButtonText}>Google Maps</Text>
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  listContainer: {
    paddingBottom: 24,
  },
  orphanageCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  orphanageImage: {
    width: '100%',
    height: 150,
  },
  orphanageInfo: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orphanageName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginLeft: 4,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  orphanageAddress: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  distanceText: {
    fontSize: 14,
    color: '#4F46E5',
    marginLeft: 8,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  locationButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    marginLeft: 8,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailsButtonText: {
    color: '#4F46E5',
    fontWeight: '600',
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#111827',
  },
  mapContainer: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  primaryButton: {
    backgroundColor: '#4F46E5',
  },
  secondaryButton: {
    backgroundColor: '#E5E7EB',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  secondaryButtonText: {
    color: '#4B5563',
    fontWeight: '600',
    fontSize: 14,
  },
});