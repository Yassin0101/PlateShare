import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ScrollView,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Dynamic styles function outside component
function getDynamicStyles(darkMode) {
  return StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: darkMode ? '#121212' : '#fff',
      padding: 20,
      paddingBottom: 40,
    },
    card: {
      backgroundColor: darkMode ? '#1E1E1E' : '#fff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: darkMode ? 0.1 : 0.05,
      shadowRadius: 6,
      elevation: 2,
    },
    text: {
      color: darkMode ? '#E0E0E0' : '#333',
    },
    label: {
      color: darkMode ? '#9E9E9E' : '#666',
      fontSize: 14,
      marginBottom: 4,
    },
    input: {
      backgroundColor: darkMode ? '#2D2D2D' : '#f5f5f5',
      color: darkMode ? '#fff' : '#333',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      fontSize: 16,
    },
    sectionTitle: {
      color: darkMode ? '#BB86FC' : '#4F46E5',
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 12,
    },
    dangerButton: {
      color: '#FF5252',
      fontWeight: '600',
      fontSize: 16,
      paddingVertical: 12,
    },
  });
}

const staticStyles = StyleSheet.create({
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ddd',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
    marginVertical: 4,
  },
});

export default function Profile() {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [phone, setPhone] = useState('+1234567890');
  const [dob, setDob] = useState('1990-01-01');
  const [isEditing, setIsEditing] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'We need access to your photos to change your profile picture.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => router.push('/login') }
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This will permanently delete your account and all data. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: () => {
            router.push('/');
          }
        }
      ]
    );
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      Alert.alert('Profile Updated', 'Your changes have been saved.');
    }
    setIsEditing(!isEditing);
  };

  const dynamicStyles = getDynamicStyles(darkMode);

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView 
          style={{ flex: 1 }}
          contentContainerStyle={dynamicStyles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={dynamicStyles.text.color} />
            </TouchableOpacity>
            <Text style={[dynamicStyles.text, { fontSize: 20, fontWeight: 'bold' }]}>My Profile</Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Avatar Section */}
          <View style={[dynamicStyles.card, { alignItems: 'center' }]}>
            <TouchableOpacity onPress={pickImage}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={avatar ? { uri: avatar } : require('../../assets/images/react-logo.png')}
                  style={staticStyles.avatar}
                />
                <View style={[staticStyles.editIcon, { backgroundColor: darkMode ? '#BB86FC' : '#4F46E5' }]}>
                  <Ionicons name="camera" size={16} color="#fff" />
                </View>
              </View>
              <Text style={[dynamicStyles.text, { marginTop: 8, color: '#4F46E5' }]}>Change Photo</Text>
            </TouchableOpacity>
          </View>

          {/* Personal Info Section */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.sectionTitle}>Personal Information</Text>
            
            <Text style={dynamicStyles.label}>Full Name</Text>
            <TextInput
              editable={isEditing}
              style={dynamicStyles.input}
              value={name}
              onChangeText={setName}
              placeholderTextColor={darkMode ? '#757575' : '#999'}
              returnKeyType="done"
              blurOnSubmit={true}
            />

            <Text style={dynamicStyles.label}>Email</Text>
            <TextInput
              editable={isEditing}
              style={dynamicStyles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor={darkMode ? '#757575' : '#999'}
              returnKeyType="done"
              blurOnSubmit={true}
            />

            <Text style={dynamicStyles.label}>Phone Number</Text>
            <TextInput
              editable={isEditing}
              style={dynamicStyles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholderTextColor={darkMode ? '#757575' : '#999'}
              returnKeyType="done"
              blurOnSubmit={true}
            />

            <Text style={dynamicStyles.label}>Date of Birth</Text>
            <TextInput
              editable={isEditing}
              style={dynamicStyles.input}
              value={dob}
              onChangeText={setDob}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={darkMode ? '#757575' : '#999'}
              returnKeyType="done"
              blurOnSubmit={true}
            />

            <TouchableOpacity 
              style={[
                staticStyles.editButton, 
                { 
                  backgroundColor: darkMode ? '#BB86FC' : '#4F46E5',
                  marginTop: 8
                }
              ]} 
              onPress={handleToggleEdit}
            >
              <Text style={staticStyles.editButtonText}>
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.sectionTitle}>Account</Text>
            
            <TouchableOpacity 
              style={staticStyles.menuItem} 
              onPress={() => router.push('/orders')}
            >
              <Ionicons name="receipt-outline" size={20} color={dynamicStyles.text.color} />
              <Text style={[dynamicStyles.text, { marginLeft: 12, flex: 1 }]}>My Orders</Text>
              <Ionicons name="chevron-forward" size={20} color={dynamicStyles.label.color} />
            </TouchableOpacity>

            <View style={staticStyles.divider} />

            <TouchableOpacity 
              style={staticStyles.menuItem} 
              onPress={() => router.push('/donations')}
            >
              <Ionicons name="heart-outline" size={20} color={dynamicStyles.text.color} />
              <Text style={[dynamicStyles.text, { marginLeft: 12, flex: 1 }]}>Donation History</Text>
              <Ionicons name="chevron-forward" size={20} color={dynamicStyles.label.color} />
            </TouchableOpacity>
          </View>

          {/* Settings Section */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.sectionTitle}>Settings</Text>
            
            <TouchableOpacity 
              style={staticStyles.menuItem} 
              onPress={() => router.push('/contact')}
            >
              <Ionicons name="help-circle-outline" size={20} color={dynamicStyles.text.color} />
              <Text style={[dynamicStyles.text, { marginLeft: 12, flex: 1 }]}>Contact Support</Text>
              <Ionicons name="chevron-forward" size={20} color={dynamicStyles.label.color} />
            </TouchableOpacity>

            <View style={staticStyles.divider} />

            <View style={staticStyles.menuItem}>
              <Ionicons name="moon-outline" size={20} color={dynamicStyles.text.color} />
              <Text style={[dynamicStyles.text, { marginLeft: 12, flex: 1 }]}>Dark Mode</Text>
              <Switch 
                value={darkMode} 
                onValueChange={toggleDarkMode}
                thumbColor={darkMode ? '#BB86FC' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#3700B3' }}
              />
            </View>

            <View style={staticStyles.divider} />

            <View style={staticStyles.menuItem}>
              <Ionicons name="information-circle-outline" size={20} color={dynamicStyles.text.color} />
              <Text style={[dynamicStyles.text, { marginLeft: 12 }]}>App Version: 1.0.0</Text>
            </View>
          </View>

          {/* Legal Section */}
          <View style={dynamicStyles.card}>
            <Text style={dynamicStyles.sectionTitle}>Legal</Text>
            
            <TouchableOpacity style={staticStyles.menuItem}>
              <Text style={[dynamicStyles.text, { flex: 1 }]}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={20} color={dynamicStyles.label.color} />
            </TouchableOpacity>

            <View style={staticStyles.divider} />

            <TouchableOpacity style={staticStyles.menuItem}>
              <Text style={[dynamicStyles.text, { flex: 1 }]}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color={dynamicStyles.label.color} />
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View style={dynamicStyles.card}>
            <Text style={[dynamicStyles.sectionTitle, { color: '#FF5252' }]}>Danger Zone</Text>
            
            <TouchableOpacity 
              style={staticStyles.menuItem} 
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={20} color="#FF5252" />
              <Text style={[dynamicStyles.dangerButton, { marginLeft: 12, flex: 1 }]}>Sign Out</Text>
            </TouchableOpacity>

            <View style={staticStyles.divider} />

            <TouchableOpacity 
              style={staticStyles.menuItem} 
              onPress={handleDeleteAccount}
            >
              <MaterialIcons name="delete-outline" size={20} color="#FF5252" />
              <Text style={[dynamicStyles.dangerButton, { marginLeft: 12, flex: 1 }]}>Delete Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}