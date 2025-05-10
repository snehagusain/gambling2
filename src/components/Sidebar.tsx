import React, { useState } from 'react';
import {
  CricketIcon,
  FootballIcon,
  BasketballIcon,
  CasinoIcon,
  TennisIcon,
  HorseRacingIcon,
  GreyhoundIcon,
  LotteryIcon,
  MultiMarketIcon,
  AirplaneIcon
} from './SportIcons';

interface SportCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  isLive?: boolean;
  count?: number;
}

const sportsCategories: SportCategory[] = [
  { id: 1, name: 'Cricket', icon: <CricketIcon />, isLive: true, count: 24 },
  { id: 2, name: 'Football', icon: <FootballIcon />, isLive: true, count: 48 },
  { id: 3, name: 'Basketball', icon: <BasketballIcon />, isLive: true, count: 16 },
  { id: 4, name: 'Live Casino', icon: <CasinoIcon />, count: 32 },
  { id: 5, name: 'Tennis', icon: <TennisIcon />, count: 12 },
  { id: 6, name: 'Horse Racing', icon: <HorseRacingIcon />, count: 8 },
  { id: 7, name: 'Greyhound Racing', icon: <GreyhoundIcon />, count: 6 },
  { id: 8, name: 'Lottery', icon: <LotteryIcon />, count: 4 },
  { id: 9, name: 'Multi Markets', icon: <MultiMarketIcon />, count: 20 },
  { id: 10, name: 'Vimaan', icon: <AirplaneIcon />, count: 10 },
];

const Sidebar = () => {
  const [activeCategory, setActiveCategory] = useState<number>(1);
  
  return (
    <aside className="w-64 bg-[#1a1f2c] h-full overflow-y-auto flex-shrink-0 hidden md:block shadow-lg">
      <div className="p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white px-3 py-2">Sports</h2>
        </div>
        
        <nav>
          <ul className="space-y-1">
            {sportsCategories.map(sport => (
              <li key={sport.id}>
                <a 
                  href="#" 
                  className={`flex items-center px-3 py-3 rounded-md transition-colors border-l-4 
                    ${activeCategory === sport.id 
                      ? 'bg-[#2a3040] text-white border-blue-500' 
                      : 'text-gray-300 hover:bg-[#2a3040] hover:text-white border-transparent hover:border-blue-500'
                    }`}
                  onClick={() => setActiveCategory(sport.id)}
                >
                  <div className={`flex items-center justify-center w-8 h-8 mr-3 rounded-md 
                    ${activeCategory === sport.id ? 'bg-blue-500 bg-opacity-20' : 'bg-[#2a3040]'}`}>
                    <span className={`text-xl ${activeCategory === sport.id ? 'text-blue-400' : 'text-gray-300'}`}>
                      {sport.icon}
                    </span>
                  </div>
                  <span className="font-medium">{sport.name}</span>
                  {sport.isLive && (
                    <span className="ml-auto bg-green-500 text-xs text-white px-2 py-1 rounded-full">
                      LIVE
                    </span>
                  )}
                  {!sport.isLive && sport.count && (
                    <span className="ml-auto text-xs text-gray-400">
                      {sport.count}
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-8 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md text-white">
          <h3 className="font-bold mb-2">Special Bonus</h3>
          <p className="text-sm mb-2">Get 100% up to $500 on your first deposit!</p>
          <button className="bg-white text-blue-600 text-sm font-medium px-3 py-1.5 rounded-md w-full hover:bg-gray-100 transition-colors">
            Claim Now
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar; 