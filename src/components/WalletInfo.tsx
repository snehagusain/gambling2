import React from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';

interface WalletInfoProps {
  totalStake: number;
}

const WalletInfo: React.FC<WalletInfoProps> = ({ totalStake }) => {
  const { balance, loading } = useWallet();
  const { currentUser } = useAuth();

  if (!currentUser) {
    return (
      <div className="bg-[#2a3040] rounded-md p-3 mb-3">
        <div className="text-center">
          <p className="text-sm text-gray-400 mb-1">
            Please log in to place bets
          </p>
        </div>
      </div>
    );
  }

  const insufficientFunds = totalStake > balance;

  return (
    <div className="bg-[#2a3040] rounded-md p-3 mb-3">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">Wallet Balance:</span>
        <span className="text-white font-medium">
          {loading ? '...' : `$${balance.toFixed(2)}`}
        </span>
      </div>
      
      {totalStake > 0 && (
        <>
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-400">Total Stake:</span>
            <span className="text-white">${totalStake.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center mt-1">
            <span className="text-sm text-gray-400">Remaining Balance:</span>
            <span className={`font-medium ${insufficientFunds ? 'text-red-400' : 'text-green-400'}`}>
              ${(balance - totalStake).toFixed(2)}
            </span>
          </div>
          
          {insufficientFunds && (
            <div className="mt-2 text-xs text-red-400 bg-red-400 bg-opacity-10 p-2 rounded">
              Insufficient funds. Please deposit to place this bet.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WalletInfo; 