import React from 'react';
import { useBetSlip, MatchOdds } from '@/contexts/BetSlipContext';

interface MatchOddsButtonProps {
  matchOdds: MatchOdds;
  type: 'teamA' | 'draw' | 'teamB';
  className?: string;
}

const MatchOddsButton: React.FC<MatchOddsButtonProps> = ({ 
  matchOdds, 
  type, 
  className = ''
}) => {
  const { addSelection, selections } = useBetSlip();
  
  // Check if this selection is already in the betslip
  const isSelected = selections.some(
    selection => selection.id === `${matchOdds.matchId}_${type}`
  );
  
  // Get the odds value based on selection type
  const oddsValue = 
    type === 'teamA' ? matchOdds.odds.teamA : 
    type === 'draw' ? matchOdds.odds.draw : 
    matchOdds.odds.teamB;
  
  // Get the label based on selection type
  const label = 
    type === 'teamA' ? matchOdds.teamA : 
    type === 'draw' ? 'Draw' : 
    matchOdds.teamB;
  
  // Handle click on odds button
  const handleClick = () => {
    addSelection(matchOdds, type);
  };
  
  return (
    <button
      className={`px-3 py-2 rounded-md flex flex-col items-center transition-colors ${
        isSelected
          ? 'bg-blue-600 text-white'
          : 'bg-[#2a3040] text-gray-300 hover:bg-[#343b4f] hover:text-white'
      } ${className}`}
      onClick={handleClick}
    >
      <span className="text-xs mb-1 opacity-70">{label}</span>
      <span className="font-bold">{oddsValue.toFixed(2)}</span>
    </button>
  );
};

export default MatchOddsButton; 