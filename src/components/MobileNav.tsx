import React, { useState } from 'react';

interface MobileNavProps {
  onSelectView: (view: 'matches' | 'sports' | 'betslip') => void;
  activeBets: number;
}

const MobileNav: React.FC<MobileNavProps> = ({ onSelectView, activeBets }) => {
  const [activeTab, setActiveTab] = useState<'matches' | 'sports' | 'betslip'>('matches');
  
  const handleTabClick = (tab: 'matches' | 'sports' | 'betslip') => {
    setActiveTab(tab);
    onSelectView(tab);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1a1f2c] border-t border-[#2a3040] md:hidden">
      <div className="flex items-center justify-around">
        <button
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'sports' ? 'text-blue-400' : 'text-gray-400'}`}
          onClick={() => handleTabClick('sports')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-xs mt-1">Sports</span>
        </button>
        
        <button
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'matches' ? 'text-blue-400' : 'text-gray-400'}`}
          onClick={() => handleTabClick('matches')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs mt-1">Matches</span>
        </button>
        
        <button
          className={`flex flex-col items-center py-3 px-4 ${activeTab === 'betslip' ? 'text-blue-400' : 'text-gray-400'} relative`}
          onClick={() => handleTabClick('betslip')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {activeBets > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeBets}
            </span>
          )}
          <span className="text-xs mt-1">Bet Slip</span>
        </button>
      </div>
    </div>
  );
};

export default MobileNav; 