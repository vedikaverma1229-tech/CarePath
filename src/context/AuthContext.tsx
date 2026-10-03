import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  signInWithGoogle,
  logOut,
  onAuthStateChanged,
  FirebaseUser,
  db,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from '../lib/firebase';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  signIn: () => Promise<FirebaseUser>;
  signOut: () => Promise<void>;
  userAppointments: any[];
  loadUserAppointments: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {
    throw new Error('Auth not ready');
  },
  signOut: async () => {},
  userAppointments: [],
  loadUserAppointments: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [userAppointments, setUserAppointments] = useState<any[]>([]);

  const loadUserAppointments = async () => {
    if (!user) {
      setUserAppointments([]);
      return;
    }
    try {
      const q = query(
        collection(db, 'appointments'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUserAppointments(list);
    } catch (err) {
      console.warn('Could not load user appointments from Firestore:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) {
        try {
          const q = query(
            collection(db, 'appointments'),
            where('userId', '==', currentUser.uid)
          );
          const snapshot = await getDocs(q);
          const list = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
          setUserAppointments(list);
        } catch (e) {
          console.warn('Initial appointments load warning:', e);
        }
      } else {
        setUserAppointments([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const loggedUser = await signInWithGoogle();
    setUser(loggedUser);
    return loggedUser;
  };

  const handleSignOut = async () => {
    await logOut();
    setUser(null);
    setUserAppointments([]);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signOut: handleSignOut,
        userAppointments,
        loadUserAppointments,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
