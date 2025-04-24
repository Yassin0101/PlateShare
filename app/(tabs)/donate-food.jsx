import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

export default function DonateFood() {
  const [restaurantName, setRestaurantName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [foodDescription, setFoodDescription] = useState('');

  const handleDonate = () => {
    if (!restaurantName || !contactInfo || !foodDescription) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    Alert.alert('Donation Submitted', 'Thank you for donating food!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Donate Surplus Food</Text>

      <Text style={styles.label}>Restaurant Name</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. Joe's Pizza"
        value={restaurantName}
        onChangeText={setRestaurantName}
      />

      <Text style={styles.label}>Contact Info</Text>
      <TextInput
        style={styles.input}
        placeholder="Phone or Email"
        value={contactInfo}
        onChangeText={setContactInfo}
      />

      <Text style={styles.label}>Available Food Description</Text>
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="List items, quantity, and best before time"
        value={foodDescription}
        onChangeText={setFoodDescription}
        multiline
      />

      <TouchableOpacity onPress={handleDonate} style={styles.button}>
        <Text style={styles.buttonText}>Submit Donation</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  messageInput: {
    height: 120, // Adjust for multiline input
  },
  button: {
    backgroundColor: 'black',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
});
