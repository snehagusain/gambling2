// Test script for Firebase connectivity
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Check if Firebase config is available
if (!firebaseConfig.apiKey) {
  console.error('Firebase API key is missing. Make sure you have .env.local file with required variables.');
  process.exit(1);
}

console.log('Testing Firebase connectivity...');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Test authentication
async function testAuth() {
  try {
    const userCredential = await signInAnonymously(auth);
    console.log('✅ Anonymous authentication successful:', userCredential.user.uid);
    return true;
  } catch (error) {
    console.error('❌ Authentication error:', error.code, error.message);
    return false;
  }
}

// Test Firestore
async function testFirestore() {
  try {
    // Try to list some collections
    const snapshot = await getDocs(collection(db, 'users'));
    console.log(`✅ Firestore connection successful. Found ${snapshot.size} users.`);
    return true;
  } catch (error) {
    console.error('❌ Firestore error:', error.code, error.message);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Firebase Configuration:');
  console.log('- API Key:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing');
  console.log('- Auth Domain:', firebaseConfig.authDomain ? '✅ Set' : '❌ Missing');
  console.log('- Project ID:', firebaseConfig.projectId ? '✅ Set' : '❌ Missing');
  console.log('- Storage Bucket:', firebaseConfig.storageBucket ? '✅ Set' : '❌ Missing');
  
  const authSuccess = await testAuth();
  const firestoreSuccess = await testFirestore();
  
  if (authSuccess && firestoreSuccess) {
    console.log('✅ All Firebase connectivity tests passed!');
    process.exit(0);
  } else {
    console.error('❌ Some Firebase connectivity tests failed');
    process.exit(1);
  }
}

runTests(); 