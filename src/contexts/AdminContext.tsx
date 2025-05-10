import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, collection, getDocs, query, where, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Define admin role type
interface AdminUser {
  uid: string;
  email: string;
  role: 'admin' | 'superadmin';
}

// Define admin context type
interface AdminContextType {
  isAdmin: boolean;
  isLoading: boolean;
  adminData: AdminUser | null;
  users: any[];
  matches: any[];
  bets: any[];
  loadingData: boolean;
  fetchUsers: () => Promise<void>;
  fetchMatches: () => Promise<void>;
  fetchBets: () => Promise<void>;
  updateMatch: (matchId: string, data: any) => Promise<void>;
}

// Create context
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Custom hook to use admin context
export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}

interface AdminProviderProps {
  children: ReactNode;
}

// Admin provider component
export function AdminProvider({ children }: AdminProviderProps) {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [adminData, setAdminData] = useState<AdminUser | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [bets, setBets] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState<boolean>(false);
  const { currentUser } = useAuth();

  // Check if current user is an admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setAdminData(null);
        setIsLoading(false);
        return;
      }

      if (!db) {
        setIsAdmin(false);
        setAdminData(null);
        setIsLoading(false);
        console.error('Database not available');
        return;
      }

      try {
        setIsLoading(true);
        const adminRef = doc(db, 'admins', currentUser.uid);
        const adminDoc = await getDoc(adminRef);

        if (adminDoc.exists()) {
          const data = adminDoc.data();
          setIsAdmin(true);
          setAdminData({
            uid: currentUser.uid,
            email: currentUser.email || '',
            role: data.role || 'admin'
          });
        } else {
          setIsAdmin(false);
          setAdminData(null);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        setAdminData(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser]);

  // Fetch all users
  const fetchUsers = async () => {
    if (!isAdmin) return;
    if (!db) {
      console.error('Database not available');
      return;
    }
    
    setLoadingData(true);
    try {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList: any[] = [];
      
      usersSnapshot.forEach((doc) => {
        usersList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setUsers(usersList);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch all matches
  const fetchMatches = async () => {
    if (!isAdmin) return;
    if (!db) {
      console.error('Database not available');
      return;
    }
    
    setLoadingData(true);
    try {
      const matchesCollection = collection(db, 'matches');
      const matchesSnapshot = await getDocs(matchesCollection);
      const matchesList: any[] = [];
      
      matchesSnapshot.forEach((doc) => {
        matchesList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setMatches(matchesList);
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Fetch all bets
  const fetchBets = async () => {
    if (!isAdmin) return;
    if (!db) {
      console.error('Database not available');
      return;
    }
    
    setLoadingData(true);
    try {
      const betsQuery = query(
        collection(db, 'transactions'),
        where('type', '==', 'bet')
      );
      
      const betsSnapshot = await getDocs(betsQuery);
      const betsList: any[] = [];
      
      betsSnapshot.forEach((doc) => {
        betsList.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setBets(betsList);
    } catch (error) {
      console.error('Error fetching bets:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Update match data
  const updateMatch = async (matchId: string, data: any) => {
    if (!isAdmin) throw new Error('Unauthorized');
    
    if (!db) throw new Error('Database not available');
    
    try {
      const matchRef = doc(db, 'matches', matchId);
      await updateDoc(matchRef, data);
      // Refresh matches after update
      await fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
      throw error;
    }
  };

  const value = {
    isAdmin,
    isLoading,
    adminData,
    users,
    matches,
    bets,
    loadingData,
    fetchUsers,
    fetchMatches,
    fetchBets,
    updateMatch
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
} 