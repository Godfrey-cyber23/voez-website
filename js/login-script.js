
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
// DOM Elements
const userLoginBtn = document.getElementById('user-login-btn');
const adminLoginBtn = document.getElementById('admin-login-btn');
const userLoginForm = document.getElementById('user-login-form');
const adminLoginForm = document.getElementById('admin-login-form');
const userErrorMessage = document.getElementById('user-error-message');
const adminErrorMessage = document.getElementById('admin-error-message');


const firebaseConfig = {
  apiKey: "AIzaSyBpPeaZRJvlOR-UDDrREE0Y-1osmyPP6yo",
  authDomain: "voice-of-ecclezia-zambia.firebaseapp.com",
  projectId: "voice-of-ecclezia-zambia",
  storageBucket: "voice-of-ecclezia-zambia.appspot.com",
  messagingSenderId: "865692602825",
  appId: "1:865692602825:web:96dddc980456517dd39818",
  measurementId: "G-2EJ2NDH2V4"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Toggle between user and admin login
userLoginBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (this.classList.contains('active')) return;

  this.classList.add('active');
  adminLoginBtn.classList.remove('active');
  userLoginForm.classList.remove('hidden');
  adminLoginForm.classList.add('hidden');
  clearErrorMessages();
});

adminLoginBtn.addEventListener('click', function (e) {
  e.preventDefault();
  if (this.classList.contains('active')) return;

  this.classList.add('active');
  userLoginBtn.classList.remove('active');
  adminLoginForm.classList.remove('hidden');
  userLoginForm.classList.add('hidden');
  clearErrorMessages();
});

// Clear all error messages
function clearErrorMessages() {
  userErrorMessage.classList.add('hidden');
  adminErrorMessage.classList.add('hidden');
}

// User Login Form Handling
userLoginForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('user-email').value;
  const password = document.getElementById('user-password').value;

  // Reset error message
  userErrorMessage.classList.add('hidden');

  // Basic validation
  if (!email || !password) {
    userErrorMessage.textContent = 'Please fill in all fields.';
    userErrorMessage.classList.remove('hidden');
    return;
  }

  try {

    // Firebase authentication (v10 syntax)
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Check if user exists in Firestore (v10 syntax)
    const userDocRef = doc(db, "users", userCredential.user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {  // Note: exists() is now a method
      throw new Error("User record not found");
    }

    const userData = userDoc.data();

    // Store user data and redirect
    localStorage.setItem('user', JSON.stringify({
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userData.name,
      isAdmin: userData.isAdmin || false
    }));

    window.location.href = 'user-dashboard.html';

  } catch (error) {
    console.error('Login error:', error);
    handleLoginError(error, 'user');
  }
});

// Admin Login Form Handling
adminLoginForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('admin-email').value;
  const password = document.getElementById('admin-password').value;
  const key = document.getElementById('admin-key').value;

  // Reset error message
  adminErrorMessage.classList.add('hidden');

  // Basic validation
  if (!email || !password || !key) {
    showAdminError('Please fill in all fields.');
    return;
  }

  try {
    const validAdminKey = 'VOEZ2023ADMIN';
    if (key !== validAdminKey) {
      throw new Error("Invalid security key");
    }

    // Firebase authentication
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Check if user is admin in Firestore
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (!userDoc.exists() || !userDoc.data().isAdmin) {
      await signOut(auth);
      throw new Error("Admin access denied");
    }

    const userData = userDoc.data();

    // Store admin data and redirect
    storeUserSession(userCredential.user, userData, true);
    redirectUser(true);

  } catch (error) {
    handleLoginError(error, 'admin');
  }
});

// Social Login Providers Configuration
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// Add additional scopes
googleProvider.addScope('email');
googleProvider.addScope('profile');
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Social Login Handlers
document.getElementById('googleSignIn')?.addEventListener('click', () => handleSocialLogin(googleProvider));
document.getElementById('facebookSignIn')?.addEventListener('click', () => handleSocialLogin(facebookProvider));
document.getElementById('twitterSignIn')?.addEventListener('click', () => handleSocialLogin(twitterProvider));

// Unified social login handler
async function handleSocialLogin(provider) {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user exists in Firestore
    const userRef = db.collection('users').doc(user.uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists()) {
      // Create new user record
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        provider: provider.providerId,
        createdAt: serverTimestamp(),
        isAdmin: false // Default to non-admin for social logins
      });
    }

    const userData = userDoc.exists() ? userDoc.data() : {
      email: user.email,
      name: user.displayName,
      isAdmin: false
    };

    // Store user data and redirect
    storeUserSession(user, userData);
    redirectUser(userData.isAdmin);

  } catch (error) {
    handleLoginError(error, document.querySelector('.form:not(.hidden)').id.includes('admin') ? 'admin' : 'user');
  }
}

// Helper Functions

function storeUserSession(user, userData, isAdmin = false) {
  const storageKey = isAdmin ? 'admin' : 'user';

  localStorage.setItem(storageKey, JSON.stringify({
    uid: user.uid,
    email: user.email,
    name: userData.name || user.displayName,
    photoURL: user.photoURL || userData.photoURL,
    isAdmin: userData.isAdmin || false
  }));
}

function redirectUser(isAdmin) {
  window.location.href = isAdmin ? 'admins-dashboard.html' : 'user-dashboard.html';
}

function showUserError(message) {
  userErrorMessage.textContent = message;
  userErrorMessage.classList.remove('hidden');
}

function showAdminError(message) {
  adminErrorMessage.textContent = message;
  adminErrorMessage.classList.remove('hidden');
}

function handleLoginError(error, type = 'user') {
  console.error(`${type} login error:`, error);
  let errorMessage = `An error occurred during ${type} login.`;

  // Handle specific errors
  if (error.message === "Invalid security key") {
    errorMessage = "Invalid security key";
  } else if (error.message === "Admin access denied") {
    errorMessage = "You don't have admin privileges";
  } else if (error.message === "User record not found") {
    errorMessage = "Account not found. Please register first.";
  } else {
    // Handle Firebase errors
    switch (error.code) {
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      case 'auth/user-disabled':
        errorMessage = 'This account has been disabled.';
        break;
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        errorMessage = 'Invalid email or password.';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many login attempts. Please try again later.';
        break;
      case 'auth/account-exists-with-different-credential':
        errorMessage = 'An account already exists with this email using a different provider.';
        break;
      case 'auth/auth-domain-config-required':
        errorMessage = 'Authentication domain configuration required.';
        break;
      case 'auth/cancelled-popup-request':
        errorMessage = 'Popup request cancelled.';
        break;
      case 'auth/operation-not-allowed':
        errorMessage = 'This operation is not allowed.';
        break;
      case 'auth/popup-blocked':
        errorMessage = 'Popup was blocked by the browser.';
        break;
      case 'auth/popup-closed-by-user':
        errorMessage = 'Popup was closed before completing authentication.';
        break;
      case 'auth/unauthorized-domain':
        errorMessage = 'This domain is not authorized for authentication.';
        break;
      case 'auth/invalid-credential':
        errorMessage = 'Invalid authentication credentials. Please try again.';
        break;
    }
  }

  if (type === 'admin') {
    showAdminError(errorMessage);
  } else {
    showUserError(errorMessage);
  }
}

// Initialize auth state listener
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("User is logged in:", user.email);
    
    // Check if current page is admin page
    const isAdminPage = window.location.pathname.includes('admin');
    
    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists() && isAdminPage && !userDoc.data().isAdmin) {
        // Redirect non-admins trying to access admin pages
        window.location.href = 'user-dashboard.html';
      }
    } catch (error) {
      console.error("Error checking user admin status:", error);
    }
  } else {
    console.log("User is logged out");
  }
});