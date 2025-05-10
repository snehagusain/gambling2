import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/config';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signup: (email: string, password: string, displayName: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  async function signup(email: string, password: string, displayName: string): Promise<User> {
    try {
      if (!auth) throw new Error('Authentication service unavailable');
      
      const userCredential = await createUserWithEmailAndPassword(auth as any, email, password);
      // Update profile after successful signup
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
      return userCredential.user;
    } catch (error: any) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function login(email: string, password: string): Promise<User> {
    try {
      if (!auth) throw new Error('Authentication service unavailable');
      
      const userCredential = await signInWithEmailAndPassword(auth as any, email, password);
      return userCredential.user;
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout(): Promise<void> {
    try {
      if (!auth) throw new Error('Authentication service unavailable');
      
      await signOut(auth as any);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  async function resetPassword(email: string): Promise<void> {
    try {
      if (!auth) throw new Error('Authentication service unavailable');
      
      await sendPasswordResetEmail(auth as any, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw error;
    }
  }

  async function updateUserProfile(displayName: string): Promise<void> {
    if (!currentUser) throw new Error('No user logged in');
    return await updateProfile(currentUser, { displayName });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 