import { useEffect, useState } from 'react';
import { auth, db } from '../app/services/firebase';
import { doc, getDoc } from 'firebase/firestore';

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchRole = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUserRole(docSnap.data().role);
        }
      }
    };

    fetchRole();
  }, [user]);

  return userRole;
};

// Usage in component:
const userRole = useUserRole();

if (userRole === 'charity') {
  // Show charity dashboard
} else if (userRole === 'restaurant') {
  // Show restaurant dashboard
}