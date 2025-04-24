// services/firebase/auth.js
import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
  } from 'firebase/auth';
  import { auth, db } from './config';
  import { doc, setDoc } from 'firebase/firestore';
  
  // Auth service functions
  const registerWithEmail = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), userData);
      return userCredential.user;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  const loginWithEmail = async (email, password) => {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  };
  
  // Export as default object
  const authService = {
    registerWithEmail,
    loginWithEmail,
    logout
  };
  
  export default authService;