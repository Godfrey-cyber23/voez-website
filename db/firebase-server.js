import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import {
  getAuth, 
  signInWithPopup, 
  GithubAuthProvider,
  GoogleAuthProvider,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import {
  getFirestore, 
  collection, 
  doc,
  setDoc,
  addDoc, 
  getDoc,
  getDocs, 
  query, 
  where,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import {
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL,
  deleteObject
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBpPeaZRJvlOR-UDDrREE0Y-1osmyPP6yo",
  authDomain: "voice-of-ecclezia-zambia.firebaseapp.com",
  projectId: "voice-of-ecclezia-zambia",
  storageBucket: "voice-of-ecclezia-zambia.appspot.com",
  messagingSenderId: "865692602825",
  appId: "1:865692602825:web:96dddc980456517dd39818",
  measurementId: "G-2EJ2NDH2V4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

// Authentication providers
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

// Make services available globally
window.firebaseServices = {
  // Auth
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  
  // Firestore
  db,
  collection,
  doc,
  setDoc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  arrayUnion,
  
  // Storage
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  
  // Providers
  githubProvider,
  googleProvider
};

// ========================
// Authentication Functions
// ========================

/**
 * Register a new user with email/password
 */
async function registerUser(email, password, name) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Create user document in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email,
      name,
      isAdmin: false,
      purchasedSongs: [],
      createdAt: new Date()
    });

    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    return userCredential.user;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

/**
 * Login with email/password
 */
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * GitHub login
 */
async function loginWithGitHub() {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    const user = result.user;
    
    // Check if user exists in Firestore, if not create record
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName || "GitHub User",
        isAdmin: false,
        purchasedSongs: [],
        createdAt: new Date()
      });
    }
    
    return user;
  } catch (error) {
    console.error("GitHub login error:", error);
    throw error;
  }
}

// =================
// Music Functions
// =================

/**
 * Add a new song to the database
 */
async function addSong(songData, coverImageFile, audioFile) {
  try {
    // Upload cover image
    const coverRef = ref(storage, `covers/${Date.now()}-${coverImageFile.name}`);
    await uploadBytes(coverRef, coverImageFile);
    const coverUrl = await getDownloadURL(coverRef);

    // Upload audio file
    const audioRef = ref(storage, `audio/${Date.now()}-${audioFile.name}`);
    await uploadBytes(audioRef, audioFile);
    const audioUrl = await getDownloadURL(audioRef);

    // Add song to Firestore
    const docRef = await addDoc(collection(db, "songs"), {
      ...songData,
      coverUrl,
      audioUrl,
      createdAt: new Date()
    });

    return { id: docRef.id, ...songData, coverUrl, audioUrl };
  } catch (error) {
    console.error("Error adding song:", error);
    throw error;
  }
}

/**
 * Get all songs (optionally filtered by category)
 */
async function getSongs(category = null) {
  try {
    let q;
    if (category) {
      q = query(collection(db, "songs"), where("category", "==", category));
    } else {
      q = collection(db, "songs");
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting songs:", error);
    throw error;
  }
}

// =================
// Payment Functions
// =================

/**
 * Process a payment and grant song access
 */
async function processPayment(userId, songId, amount, method = 'mobile_money') {
  try {
    // Create payment record
    const paymentRef = await addDoc(collection(db, "payments"), {
      userId,
      songId,
      amount,
      method,
      status: 'completed',
      date: new Date()
    });

    // Add song to user's purchased songs
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      purchasedSongs: arrayUnion(songId)
    });

    return { success: true, paymentId: paymentRef.id };
  } catch (error) {
    console.error("Payment processing error:", error);
    throw error;
  }
}

// =================
// User Functions
// =================

/**
 * Check if user has purchased a song
 */
async function hasPurchasedSong(userId, songId) {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return userData.purchasedSongs.includes(songId);
    }
    return false;
  } catch (error) {
    console.error("Error checking purchase:", error);
    throw error;
  }
}

// Initialize auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    // Update UI or redirect as needed
  } else {
    console.log("User is logged out");
    // Update UI or redirect to login
  }
});

// Make functions available globally
window.firebaseHelpers = {
  registerUser,
  loginUser,
  loginWithGitHub,
  addSong,
  getSongs,
  processPayment,
  hasPurchasedSong
};
