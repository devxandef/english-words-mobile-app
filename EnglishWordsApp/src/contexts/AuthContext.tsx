import React, { createContext, useState, useEffect, useContext } from 'react';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { authService } from '../services/auth';
import { storageService } from '../services/storage';

type User = FirebaseAuthTypes.User;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        // User logged in - set userId and sync data
        storageService.setUserId(authUser.uid);
        try {
          // Load and merge data from Firestore
          await storageService.loadFromFirestore();
        } catch (error) {
          console.error('Error loading data from Firestore:', error);
        }
      } else {
        // User logged out - clear userId
        storageService.setUserId(null);
      }
      setUser(authUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password);
    // Data sync happens in onAuthStateChanged
  };

  const signUp = async (email: string, password: string) => {
    await authService.signUp(email, password);
    // Data sync happens in onAuthStateChanged
  };

  const signOut = async () => {
    // Sync data to Firestore before logout
    if (user) {
      try {
        await storageService.syncToFirestore();
      } catch (error) {
        console.error('Error syncing data before logout:', error);
      }
    }
    await authService.signOut();
    storageService.setUserId(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

