import { useState } from 'react';
import { View, TextInput, Button, Picker, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { app } from '../services/firebase/config'; // Import your Firebase configuration

const auth = getAuth(app);
const db = getFirestore(app);

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('charity');
  const [isLoading, setIsLoading] = useState(false);

  const validateFields = () => {
    if (!email || !password || !phone || !username) {
      Alert.alert('Error', 'Please fill in all fields');
      return false;
    }
    if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)) {
      Alert.alert('Error', 'Invalid phone number format');
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;
    
    setIsLoading(true);
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document in Firestore with UID as document ID
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        username: username.trim(),
        role: role,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      Alert.alert('Success', 'Account created successfully!');
      
    } catch (error) {
      console.error("Signup error:", error);
      Alert.alert('Error', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="Phone Number"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        style={styles.input}
      />
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        style={styles.input}
      />
      
      <Picker
        selectedValue={role}
        onValueChange={(itemValue) => setRole(itemValue)}
        style={styles.picker}>
        <Picker.Item label="Charity" value="charity" />
        <Picker.Item label="Restaurant" value="restaurant" />
      </Picker>

      <Button 
        title={isLoading ? "Creating Account..." : "Sign Up"} 
        onPress={handleSignUp} 
        disabled={isLoading}
      />
    </View>
  );
};

const styles = {
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  picker: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5
  }
};

export default SignUpForm;