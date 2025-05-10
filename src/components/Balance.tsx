import React, { useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import { useAuth } from '../contexts/AuthContext';
import WalletModal from './WalletModal';

interface BalanceProps {
  className?: string;
}

const Balance: React.FC<BalanceProps> = ({ className = '' }) => {
  const { balance, loading } = useWallet();
  const { currentUser } = useAuth();
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  if (!currentUser) {
    return null;
  }

  return (
    <>
      <div 
        className={`flex items-center cursor-pointer ${className}`}
        onClick={() => setIsWalletModalOpen(true)}
      >
        <div className="flex flex-col mr-2">
          <span className="text-xs text-gray-400">Balance</span>
          <span className="font-bold text-white">
            {loading ? '...' : `$${balance.toFixed(2)}`}
          </span>
        </div>
        <div className="bg-green-500 rounded-full p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
      </div>

      <WalletModal 
        isOpen={isWalletModalOpen} 
        onClose={() => setIsWalletModalOpen(false)} 
      />
    </>
  );
};

export default Balance; 