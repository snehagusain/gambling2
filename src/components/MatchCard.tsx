import React from 'react';
import { MatchOdds } from '@/contexts/BetSlipContext';
import MatchOddsButton from './MatchOddsButton';

interface MatchCardProps {
  match: MatchOdds;
  className?: string;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, className = '' }) => {
  return (
    <div className={`bg-[#1a1f2c] rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs text-gray-400">
          {match.league}
        </div>
        <div className="text-xs text-gray-400 flex items-center">
          <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
          </svg>
          {match.time}
        </div>
      </div>
      
      <div className="text-sm text-white font-medium mb-3">
        {match.match}
      </div>
      
      {/* Sport icon */}
      <div className="flex items-center text-xs text-gray-400 mb-3">
        {match.sport === 'football' ? (
          <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
            <path d="M12 2V6" stroke="currentColor" strokeWidth="2" />
            <path d="M19.0711 5L16.0711 8" stroke="currentColor" strokeWidth="2" />
            <path d="M22 12H18" stroke="currentColor" strokeWidth="2" />
            <path d="M19.0711 19L16.0711 16" stroke="currentColor" strokeWidth="2" />
            <path d="M12 22V18" stroke="currentColor" strokeWidth="2" />
            <path d="M5 19L8 16" stroke="currentColor" strokeWidth="2" />
            <path d="M2 12H6" stroke="currentColor" strokeWidth="2" />
            <path d="M5 5L8 8" stroke="currentColor" strokeWidth="2" />
          </svg>
        ) : match.sport === 'cricket' ? (
          <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
            <path d="M5.5 17L8 7.5L12.5 11.5L16.5 6L18.5 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg className="w-4 h-4 mr-1 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" />
          </svg>
        )}
        <span>{match.sport.charAt(0).toUpperCase() + match.sport.slice(1)}</span>
      </div>
      
      {/* Odds buttons */}
      <div className="grid grid-cols-3 gap-2">
        <MatchOddsButton matchOdds={match} type="teamA" />
        <MatchOddsButton matchOdds={match} type="draw" />
        <MatchOddsButton matchOdds={match} type="teamB" />
      </div>
    </div>
  );
};

export default MatchCard; 