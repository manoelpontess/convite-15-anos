// ===================================
// FIREBASE CONFIGURATION
// ===================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot, where, getCountFromServer, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';

// Firebase config - will be loaded from dados.txt or set directly
const firebaseConfig = {
  apiKey: window.FIREBASE_CONFIG?.apiKey || "SUA_API_KEY_AQUI",
  authDomain: window.FIREBASE_CONFIG?.authDomain || "SEU_PROJETO.firebaseapp.com",
  projectId: window.FIREBASE_CONFIG?.projectId || "SEU_PROJECT_ID",
  storageBucket: window.FIREBASE_CONFIG?.storageBucket || "SEU_PROJETO.appspot.com",
  messagingSenderId: window.FIREBASE_CONFIG?.messagingSenderId || "SEU_SENDER_ID",
  appId: window.FIREBASE_CONFIG?.appId || "SEU_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Export for use in other modules
export { db, auth, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, onSnapshot, where, getCountFromServer, serverTimestamp, signInWithEmailAndPassword, signOut, onAuthStateChanged };
