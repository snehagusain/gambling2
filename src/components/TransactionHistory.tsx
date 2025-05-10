import React, { useState, useEffect, ReactElement } from 'react';
import { useWallet, Transaction } from '@/contexts/WalletContext';
import { useAuth } from '@/contexts/AuthContext';
import TransactionDetails from './TransactionDetails';

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ isOpen, onClose }) => {
  const { transactions, loadingTransactions, getTransactions } = useWallet();
  const { currentUser } = useAuth();
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdraw' | 'bet'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      getTransactions();
    }
  }, [isOpen, currentUser]);

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  if (!isOpen) return null;

  // Filter transactions based on selected filter
  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(transaction => transaction.type === filter);

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getTransactionIcon = (type: string): ReactElement => {
    switch (type) {
      case 'deposit':
        return (
          <div className="w-8 h-8 rounded-full bg-green-600 bg-opacity-20 flex items-center justify-center text-green-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'withdraw':
        return (
          <div className="w-8 h-8 rounded-full bg-red-600 bg-opacity-20 flex items-center justify-center text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'bet':
        return (
          <div className="w-8 h-8 rounded-full bg-blue-600 bg-opacity-20 flex items-center justify-center text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-gray-600 bg-opacity-20 flex items-center justify-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose}></div>
        
        <div className="bg-[#1a1f2c] rounded-lg p-6 w-full max-w-3xl mx-4 z-10 max-h-[80vh] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Transaction History</h2>
            <button 
              className="text-gray-400 hover:text-white"
              onClick={onClose}
            >
              ✕
            </button>
          </div>
          
          <div className="flex space-x-2 mb-4">
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-[#2a3040] text-gray-300 hover:bg-[#343b4f]'
              }`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'deposit' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-[#2a3040] text-gray-300 hover:bg-[#343b4f]'
              }`}
              onClick={() => setFilter('deposit')}
            >
              Deposits
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'withdraw' 
                  ? 'bg-red-600 text-white' 
                  : 'bg-[#2a3040] text-gray-300 hover:bg-[#343b4f]'
              }`}
              onClick={() => setFilter('withdraw')}
            >
              Withdrawals
            </button>
            <button
              className={`px-3 py-1 text-sm rounded-md transition-colors ${
                filter === 'bet' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-[#2a3040] text-gray-300 hover:bg-[#343b4f]'
              }`}
              onClick={() => setFilter('bet')}
            >
              Bets
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loadingTransactions ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="bg-[#2a3040] rounded-lg p-6 text-center">
                <p className="text-gray-400">No transactions found</p>
                {filter !== 'all' && (
                  <p className="text-sm text-gray-500 mt-2">Try changing the filter or make a transaction</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                  <div 
                    key={transaction.id} 
                    className="bg-[#2a3040] rounded-lg p-4 flex items-center cursor-pointer hover:bg-[#343b4f] transition-colors"
                    onClick={() => handleTransactionClick(transaction)}
                  >
                    {getTransactionIcon(transaction.type)}
                    
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-white font-medium">
                          {transaction.type === 'deposit' && 'Deposit'}
                          {transaction.type === 'withdraw' && 'Withdrawal'}
                          {transaction.type === 'bet' && 'Bet Placed'}
                        </h3>
                        <span className={`font-bold ${
                          transaction.type === 'deposit' ? 'text-green-400' : 
                          transaction.type === 'withdraw' ? 'text-red-400' : 'text-white'
                        }`}>
                          {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm text-gray-400">{formatDate(transaction.timestamp)}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          transaction.status === 'completed' ? 'bg-green-900 bg-opacity-30 text-green-400' : 
                          transaction.status === 'pending' ? 'bg-yellow-900 bg-opacity-30 text-yellow-400' : 
                          'bg-red-900 bg-opacity-30 text-red-400'
                        }`}>
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </div>
                      
                      {transaction.description && (
                        <p className="text-xs text-gray-500 mt-2">{transaction.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <TransactionDetails 
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        transaction={selectedTransaction}
      />
    </>
  );
};

export default TransactionHistory; 