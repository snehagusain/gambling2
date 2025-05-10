import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

// Define transaction type
export interface Transaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'bet';
  amount: number;
  timestamp: Date;
  description?: string;
  status: 'completed' | 'pending' | 'failed';
}

// Define wallet context type
interface WalletContextType {
  balance: number;
  loading: boolean;
  error: string | null;
  transactions: Transaction[];
  loadingTransactions: boolean;
  deposit: (amount: number) => Promise<void>;
  withdraw: (amount: number) => Promise<void>;
  getBalance: () => Promise<number>;
  getTransactions: () => Promise<Transaction[]>;
}

// Create context
const WalletContext = createContext<WalletContextType | undefined>(undefined);

// Custom hook to use wallet context
export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

interface WalletProviderProps {
  children: ReactNode;
}

// Wallet provider component
export function WalletProvider({ children }: WalletProviderProps) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);
  const { currentUser } = useAuth();

  // Initialize or fetch user wallet when authenticated
  useEffect(() => {
    if (currentUser) {
      getBalance().catch(error => {
        setError('Failed to load wallet balance');
        console.error(error);
      });
      getTransactions().catch(error => {
        console.error('Failed to load transactions:', error);
      });
    } else {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
    }
  }, [currentUser]);

  // Get user's balance
  async function getBalance(): Promise<number> {
    if (!currentUser) {
      setLoading(false);
      return 0;
    }

    setLoading(true);
    setError(null);
    
    try {
      const walletRef = doc(db, 'wallets', currentUser.uid);
      const walletDoc = await getDoc(walletRef);
      
      if (walletDoc.exists()) {
        const walletData = walletDoc.data();
        setBalance(walletData.balance || 0);
        setLoading(false);
        return walletData.balance || 0;
      } else {
        // If no wallet exists, create one with 0 balance
        await setDoc(walletRef, { balance: 0 });
        setBalance(0);
        setLoading(false);
        return 0;
      }
    } catch (error: any) {
      setError('Failed to get balance');
      setLoading(false);
      console.error('Error getting balance:', error);
      return balance; // Return current state balance on error
    }
  }

  // Get user's transactions
  async function getTransactions(): Promise<Transaction[]> {
    if (!currentUser) {
      return [];
    }

    setLoadingTransactions(true);
    
    try {
      const transactionsQuery = query(
        collection(db, 'transactions'),
        where('userId', '==', currentUser.uid),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(transactionsQuery);
      const transactionsList: Transaction[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        transactionsList.push({
          id: doc.id,
          type: data.type,
          amount: data.amount,
          timestamp: data.timestamp.toDate(),
          description: data.description || '',
          status: data.status
        });
      });
      
      setTransactions(transactionsList);
      setLoadingTransactions(false);
      return transactionsList;
    } catch (error) {
      console.error('Error getting transactions:', error);
      setLoadingTransactions(false);
      return [];
    }
  }

  // Deposit funds to user's wallet
  async function deposit(amount: number): Promise<void> {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than 0');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const walletRef = doc(db, 'wallets', currentUser.uid);
      const walletDoc = await getDoc(walletRef);
      
      if (walletDoc.exists()) {
        const newBalance = (walletDoc.data().balance || 0) + amount;
        await updateDoc(walletRef, { balance: newBalance });
        setBalance(newBalance);
      } else {
        await setDoc(walletRef, { balance: amount });
        setBalance(amount);
      }

      // Record the transaction
      await addDoc(collection(db, 'transactions'), {
        userId: currentUser.uid,
        type: 'deposit',
        amount: amount,
        timestamp: Timestamp.now(),
        description: 'Deposit to wallet',
        status: 'completed'
      });

      // Refresh transactions
      getTransactions();
    } catch (error: any) {
      setError('Failed to deposit funds');
      console.error('Error depositing funds:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  // Withdraw funds from user's wallet
  async function withdraw(amount: number): Promise<void> {
    if (!currentUser) {
      throw new Error('User not authenticated');
    }
    
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be greater than 0');
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const walletRef = doc(db, 'wallets', currentUser.uid);
      const walletDoc = await getDoc(walletRef);
      
      if (!walletDoc.exists()) {
        throw new Error('Wallet not found');
      }
      
      const currentBalance = walletDoc.data().balance || 0;
      
      if (currentBalance < amount) {
        throw new Error('Insufficient funds');
      }
      
      const newBalance = currentBalance - amount;
      await updateDoc(walletRef, { balance: newBalance });
      setBalance(newBalance);

      // Record the transaction
      await addDoc(collection(db, 'transactions'), {
        userId: currentUser.uid,
        type: 'withdraw',
        amount: amount,
        timestamp: Timestamp.now(),
        description: 'Withdrawal from wallet',
        status: 'completed'
      });

      // Refresh transactions
      getTransactions();
    } catch (error: any) {
      setError(error.message || 'Failed to withdraw funds');
      console.error('Error withdrawing funds:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  const value = {
    balance,
    loading,
    error,
    transactions,
    loadingTransactions,
    deposit,
    withdraw,
    getBalance,
    getTransactions
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
} 