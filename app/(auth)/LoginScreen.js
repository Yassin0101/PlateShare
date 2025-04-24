import React, { useState } from 'react';
import { View, TextInput, Button, Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../services/firebase/config'; // Import your Firebase config

const auth = getAuth(app);

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      console.error("Login error:", error);
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (error) => {
    let message = 'Login failed. Please try again.';
    switch (error.code) {
      case 'auth/invalid-email':
        message = 'Invalid email format';
        break;
      case 'auth/user-not-found':
        message = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        message = 'Incorrect password';
        break;
      case 'auth/too-many-requests':
        message = 'Too many attempts. Try again later or reset password';
        break;
    }
    Alert.alert('Login Failed', message);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />

      <Button
        title={isLoading ? "Signing In..." : "Login"}
        onPress={handleLogin}
        disabled={isLoading}
        color="#4F46E5"
      />

      <TouchableOpacity 
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.linkButton}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View style={styles.separator} />

      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>Create New Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center'
  },
  linkText: {
    color: '#4F46E5',
    fontSize: 14
  },
  separator: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 20
  },
  secondaryButton: {
    backgroundColor: '#e2e8f0',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center'
  },
  secondaryButtonText: {
    color: '#4F46E5',
    fontWeight: '500'
  }
});

export default LoginScreen;