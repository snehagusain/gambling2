// src/components/Sidebar.tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { useAdmin } from '@/contexts/AdminContext';
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
  AirplaneIcon,
} from './SportIcons';

interface SportCategory {
  id: number;
  name: string;
  icon: React.ReactNode;
  href: string;
  isLive?: boolean;
  count?: number;
}

const sportsCategories: SportCategory[] = [
  { id: 1, name: 'Cricket', icon: <CricketIcon />, href: '/cricket', isLive: true, count: 24 },
  { id: 2, name: 'Football', icon: <FootballIcon />, href: '/football', isLive: true, count: 48 },
  { id: 3, name: 'Basketball', icon: <BasketballIcon />, href: '/basketball', isLive: true, count: 16 },
  { id: 4, name: 'Live Casino', icon: <CasinoIcon />, href: '/casino', count: 32 },
  { id: 5, name: 'Tennis', icon: <TennisIcon />, href: '/tennis', count: 12 },
  { id: 6, name: 'Horse Racing', icon: <HorseRacingIcon />, href: '/horse-racing', count: 8 },
  { id: 7, name: 'Greyhound Racing', icon: <GreyhoundIcon />, href: '/greyhound', count: 6 },
  { id: 8, name: 'Lottery', icon: <LotteryIcon />, href: '/lottery', count: 4 },
  { id: 9, name: 'Multi Markets', icon: <MultiMarketIcon />, href: '/multi-markets', count: 20 },
  { id: 10, name: 'Vimaan', icon: <AirplaneIcon />, href: '/vimaan', count: 10 },
];

const Sidebar: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<number>(1);
  const { isAdmin } = useAdmin();

  return (
    <aside className="w-60 bg-[#0f121a] h-full overflow-y-auto hidden md:block shadow-lg">
      {/* Brand */}
      <Link
        href="/"
        className="block px-4 py-5 border-b border-gray-800 hover:bg-gray-900"
      >
        <span className="text-2xl font-bold text-white">BetPro</span>
      </Link>

      {/* Navigation */}
      <nav className="px-4 py-6 space-y-4">
        {sportsCategories.map((sport) => (
          <Link
            key={sport.id}
            href={sport.href}
            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
              activeCategory === sport.id
                ? 'bg-[#1f5533] border-l-4 border-[#25b95f] text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
            onClick={() => setActiveCategory(sport.id)}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 mr-3 rounded-md ${
                activeCategory === sport.id ? 'bg-[#25b95f]/20' : 'bg-[#1a1f2c]'
              }`}
            >
              {sport.icon}
            </div>
            <span className="font-medium">{sport.name}</span>
            {sport.isLive ? (
              <span className="ml-auto bg-[#25b95f] text-xs px-2 py-0.5 rounded">LIVE</span>
            ) : (
              sport.count && (
                <span className="ml-auto text-xs text-gray-500">{sport.count}</span>
              )
            )}
          </Link>
        ))}
        
        {/* Admin Link at the bottom - only shown for admin users */}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex items-center px-3 py-2 rounded-lg transition-colors text-green-400 hover:bg-gray-800 hover:text-green-300 mt-6 border-t border-gray-800 pt-6"
          >
            <div className="flex items-center justify-center w-8 h-8 mr-3 rounded-md bg-[#1a1f2c]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <span className="font-medium">Admin Dashboard</span>
          </Link>
        )}
      </nav>

      {/* Promo Card */}
      <div className="mt-auto p-4 mx-4 bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-lg">
        <p className="font-semibold">100% Bonus Up to $500</p>
        <button className="mt-2 w-full bg-white text-[#0f121a] py-1 rounded">Claim Now</button>
      </div>
    </aside>
  );
};

export default Sidebar;
