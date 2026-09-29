// ===================================
// FIREBASE CONFIGURATION
// ===================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot, where, getCountFromServer, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// Firebase config
const firebaseConfig = {
  apiKey: window.FIREBASE_CONFIG?.apiKey || "AIzaSyCgg4U7SYprv56KUSzb2OStQbSVL3re_a0",
  authDomain: window.FIREBASE_CONFIG?.authDomain || "convite-bianca-15anos.firebaseapp.com",
  projectId: window.FIREBASE_CONFIG?.projectId || "convite-bianca-15anos",
  storageBucket: window.FIREBASE_CONFIG?.storageBucket || "convite-bianca-15anos.firebasestorage.app",
  messagingSenderId: window.FIREBASE_CONFIG?.messagingSenderId || "335395927539",
  appId: window.FIREBASE_CONFIG?.appId || "1:335395927539:web:f180b3f84dc9db03d90e86"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in other modules
export { db, auth, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot, where, getCountFromServer, serverTimestamp, signInWithEmailAndPassword, signOut, onAuthStateChanged };
