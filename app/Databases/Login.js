import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Create "charities" collection with a document
const createCharityProfile = async (userId, data) => {
  const db = getFirestore();
  
  await setDoc(doc(db, 'charities', userId), {
    name: "Food Bank Network",
    address: "123 Charity Street",
    contactEmail: "contact@foodbank.org",
    createdAt: new Date(),
    // Add other charity-specific fields
  });
};

// Create "restaurants" collection with a document
const createRestaurantProfile = async (userId, data) => {
  const db = getFirestore();
  
  await setDoc(doc(db, 'restaurants', userId), {
    name: "Tasty Bites",
    cuisine: "Italian",
    openingHours: "9AM - 10PM",
    location: new firebase.firestore.GeoPoint(40.7128, -74.0060),
    // Add other restaurant-specific fields
  });
};