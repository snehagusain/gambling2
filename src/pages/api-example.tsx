import React from 'react';
import Head from 'next/head';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import MatchList from '@/components/MatchList';
import BetSlip from '@/components/BetSlip';

export default function ApiExamplePage() {
  return (
    <>
      <Head>
        <title>BetMaster - Live Sports API</title>
        <meta name="description" content="Live sports betting with TheSportsDB API integration" />
      </Head>

      <div className="flex h-screen bg-[#0f121a] text-white overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Live Sports API Integration</h1>
                <p className="text-gray-400">Showing live cricket and football matches from TheSportsDB API</p>
              </div>
              <MatchList />
            </div>
            <div className="w-80 border-l border-gray-700">
              <BetSlip />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 