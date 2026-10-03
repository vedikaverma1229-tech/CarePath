import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with custom Database ID
export const db = getFirestore(
  app,
  firebaseConfigData.firestoreDatabaseId || '(default)'
);

// Connection test on boot
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error: any) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connectivity check: client is offline or network restricted.');
    }
  }
}
testConnection();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Upsert user profile to Firestore
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(
        userRef,
        {
          userId: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Patient',
          photoURL: user.photoURL || '',
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return user;
  } catch (error: any) {
    console.error('Google Sign-In failed:', error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error('Sign Out failed:', error);
    throw error;
  }
};

export {
  collection,
  doc,
  addDoc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  onAuthStateChanged,
};
export type { FirebaseUser };
