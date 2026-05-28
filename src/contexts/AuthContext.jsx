import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase/config';
import { getSubscriberByEmail } from '../services/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut as firebaseSignOut 
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isApprovedMember, setIsApprovedMember] = useState(false);
  const [loading, setLoading] = useState(true);

  // The UID of the Admin user
  const adminUid = process.env.REACT_APP_ADMIN_UID || '';

  useEffect(() => {
    // Fallback timeout: if auth takes too long (e.g. App Check fails/network drop), force UI to load
    const timeoutId = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      clearTimeout(timeoutId); // Clear timeout if auth resolves normally
      setCurrentUser(user);
      
      const isAdminUser = user && user.uid === adminUid;
      if (isAdminUser) {
        setIsApprovedMember(true);
      } else if (user && user.email) {
        try {
          const subscriber = await getSubscriberByEmail(user.email);
          setIsApprovedMember(subscriber?.status === 'approved');
        } catch (error) {
          console.error("Error checking subscriber status:", error);
          setIsApprovedMember(false);
        }
      } else {
        setIsApprovedMember(false);
      }
      
      setLoading(false);
    });

    return () => {
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, [adminUid]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const signOut = () => {
    return firebaseSignOut(auth);
  };

  const isAdmin = currentUser && currentUser.uid === adminUid;

  const value = {
    currentUser,
    isAdmin,
    isApprovedMember,
    signInWithGoogle,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
