import React from 'react';
import { Transaction } from '@/contexts/WalletContext';

interface TransactionDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  isOpen, 
  onClose, 
  transaction 
}) => {
  if (!isOpen || !transaction) return null;

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  // Determine transaction type styling
  const getTypeStyles = () => {
    switch (transaction.type) {
      case 'deposit':
        return {
          bgColor: 'bg-green-600 bg-opacity-10',
          textColor: 'text-green-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'withdraw':
        return {
          bgColor: 'bg-red-600 bg-opacity-10',
          textColor: 'text-red-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          )
        };
      case 'bet':
        return {
          bgColor: 'bg-blue-600 bg-opacity-10',
          textColor: 'text-blue-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          )
        };
      default:
        return {
          bgColor: 'bg-gray-600 bg-opacity-10',
          textColor: 'text-gray-500',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" clipRule="evenodd" />
            </svg>
          )
        };
    }
  };

  const { bgColor, textColor, icon } = getTypeStyles();

  // Access any additional data stored in transaction
  const betDetails = (transaction as any).betDetails;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose}></div>
      
      <div className="bg-[#1a1f2c] rounded-lg p-6 w-full max-w-md mx-4 z-10">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="flex items-center mb-6">
          <div className={`w-12 h-12 rounded-full ${bgColor} flex items-center justify-center ${textColor} mr-4`}>
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              {transaction.type === 'deposit' && 'Deposit'}
              {transaction.type === 'withdraw' && 'Withdrawal'}
              {transaction.type === 'bet' && 'Bet Placed'}
            </h2>
            <p className="text-sm text-gray-400">
              Transaction ID: <span className="text-xs font-mono">{transaction.id.substring(0, 8)}...</span>
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="bg-[#2a3040] rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Amount</p>
                <p className={`text-lg font-bold ${
                  transaction.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {transaction.type === 'deposit' ? '+' : '-'}${transaction.amount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Status</p>
                <p className={`text-sm font-medium px-2 py-1 rounded inline-block ${
                  transaction.status === 'completed' ? 'bg-green-900 bg-opacity-30 text-green-400' : 
                  transaction.status === 'pending' ? 'bg-yellow-900 bg-opacity-30 text-yellow-400' : 
                  'bg-red-900 bg-opacity-30 text-red-400'
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-[#2a3040] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-2">Transaction Date</p>
            <p className="text-white">{formatDate(transaction.timestamp)}</p>
          </div>
          
          {transaction.description && (
            <div className="bg-[#2a3040] rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Description</p>
              <p className="text-white">{transaction.description}</p>
            </div>
          )}
          
          {/* For bet transactions, show bet details if available */}
          {transaction.type === 'bet' && betDetails && (
            <div className="bg-[#2a3040] rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-2">Bet Details</p>
              <p className="text-white mb-2">
                <span className="text-gray-400">Type:</span> {betDetails.mode === 'single' ? 'Single Bets' : 'Multi Bet'}
              </p>
              
              {betDetails.mode === 'multi' && (
                <p className="text-white mb-2">
                  <span className="text-gray-400">Total Odds:</span> {betDetails.totalOdds.toFixed(2)}
                </p>
              )}
              
              <div className="mt-3">
                <p className="text-sm text-gray-400 mb-2">Selections:</p>
                <div className="space-y-2">
                  {betDetails.selections.map((selection: any, index: number) => (
                    <div key={index} className="bg-[#1a1f2c] p-2 rounded">
                      <p className="text-white text-sm">{selection.match}</p>
                      <div className="flex justify-between mt-1">
                        <p className="text-gray-400 text-xs">{selection.selection}</p>
                        <div className="flex items-center">
                          <span className="text-green-400 text-xs font-bold mr-2">{selection.odds.toFixed(2)}</span>
                          {betDetails.mode === 'single' && selection.stake && (
                            <span className="text-xs text-gray-400">${selection.stake.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetails; 