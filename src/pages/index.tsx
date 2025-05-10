import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import MatchList from '@/components/MatchList';
import BetSlip from '@/components/BetSlip';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex h-screen bg-[#0f121a] text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-6 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Featured Matches</h1>
              <Link href="/api-example">
                <a className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white font-medium transition-colors">
                  Try Live API Demo
                </a>
              </Link>
            </div>
            <MatchList />
          </div>
          <div className="w-80 border-l border-gray-700 p-4">
            <BetSlip />
          </div>
        </div>
      </div>
    </div>
  );
}
