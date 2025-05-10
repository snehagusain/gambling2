import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';

interface BetStat {
  title: string;
  value: string | number;
  change?: number;
  color: string;
}

interface PopularMatch {
  match: string;
  bets: number;
  amount: number;
}

const AdminBetStats: React.FC = () => {
  const { bets, fetchBets, loadingData } = useAdmin();
  const [stats, setStats] = useState<BetStat[]>([]);
  const [popularMatches, setPopularMatches] = useState<PopularMatch[]>([]);
  const [dateRange, setDateRange] = useState<'today' | 'week' | 'month' | 'all'>('week');

  // Fetch bets data
  useEffect(() => {
    fetchBets();
  }, [fetchBets]);

  // Calculate statistics when bets change
  useEffect(() => {
    if (bets.length === 0) return;

    // Calculate date boundaries
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'all':
        startDate = new Date(0); // Beginning of time
        break;
    }

    // Filter bets by date range
    const filteredBets = bets.filter(bet => {
      const betDate = bet.timestamp.toDate();
      return betDate >= startDate && betDate <= now;
    });

    // Calculate total wagered
    const totalAmount = filteredBets.reduce((sum, bet) => sum + bet.amount, 0);
    
    // Calculate total number of bets
    const totalBets = filteredBets.length;
    
    // Calculate average bet amount
    const avgBetAmount = totalBets > 0 ? totalAmount / totalBets : 0;
    
    // Calculate most popular match types
    const matchCounts: { [key: string]: { bets: number, amount: number } } = {};
    
    filteredBets.forEach(bet => {
      if (bet.betDetails && bet.betDetails.selections) {
        bet.betDetails.selections.forEach((selection: any) => {
          if (!matchCounts[selection.match]) {
            matchCounts[selection.match] = { bets: 0, amount: 0 };
          }
          
          matchCounts[selection.match].bets += 1;
          
          // For multi bets, we can't attribute the exact amount to each selection,
          // so we just count the occurrence
          if (bet.betDetails.mode === 'single') {
            matchCounts[selection.match].amount += selection.stake || 0;
          } else {
            // For multi bets, we divide the stake among selections
            const selectionCount = bet.betDetails.selections.length;
            matchCounts[selection.match].amount += bet.amount / selectionCount;
          }
        });
      }
    });
    
    // Convert to array and sort
    const matchesArray = Object.entries(matchCounts).map(([match, data]) => ({
      match,
      bets: data.bets,
      amount: data.amount
    }));
    
    const sortedMatches = matchesArray.sort((a, b) => b.bets - a.bets).slice(0, 5);
    
    // Set stats
    setStats([
      {
        title: 'Total Wagered',
        value: `$${totalAmount.toFixed(2)}`,
        color: 'bg-blue-600'
      },
      {
        title: 'Total Bets',
        value: totalBets,
        color: 'bg-green-600'
      },
      {
        title: 'Average Bet',
        value: `$${avgBetAmount.toFixed(2)}`,
        color: 'bg-purple-600'
      },
      {
        title: 'Single Bets',
        value: filteredBets.filter(bet => bet.betDetails?.mode === 'single').length,
        color: 'bg-yellow-600'
      },
      {
        title: 'Multi Bets',
        value: filteredBets.filter(bet => bet.betDetails?.mode === 'multi').length,
        color: 'bg-red-600'
      }
    ]);
    
    setPopularMatches(sortedMatches);
  }, [bets, dateRange]);

  return (
    <div className="bg-[#1a1f2c] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Betting Statistics</h2>
        <div className="flex space-x-1 bg-[#2a3040] rounded-md p-1">
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              dateRange === 'today' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-[#343b4f]'
            }`}
            onClick={() => setDateRange('today')}
          >
            Today
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              dateRange === 'week' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-[#343b4f]'
            }`}
            onClick={() => setDateRange('week')}
          >
            Week
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              dateRange === 'month' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-[#343b4f]'
            }`}
            onClick={() => setDateRange('month')}
          >
            Month
          </button>
          <button
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              dateRange === 'all' 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-300 hover:bg-[#343b4f]'
            }`}
            onClick={() => setDateRange('all')}
          >
            All Time
          </button>
        </div>
      </div>

      {loadingData ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : bets.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No betting data available
        </div>
      ) : (
        <>
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#21273a] rounded-lg p-4">
                <div className={`w-8 h-8 ${stat.color} rounded-full flex items-center justify-center mb-2`}>
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div className="text-xs text-gray-400 mb-1">{stat.title}</div>
                <div className="text-white font-bold text-xl">{stat.value}</div>
                {stat.change !== undefined && (
                  <div className={`text-xs mt-1 ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Popular Matches */}
          <h3 className="text-white font-medium mb-3">Most Popular Matches</h3>
          <div className="bg-[#21273a] rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 uppercase bg-[#2a3040]">
                <tr>
                  <th className="px-4 py-3 text-left">Match</th>
                  <th className="px-4 py-3 text-right">Total Bets</th>
                  <th className="px-4 py-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {popularMatches.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-400">
                      No match data available for this period
                    </td>
                  </tr>
                ) : (
                  popularMatches.map((match, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-[#2a3040] hover:bg-[#2a3040]"
                    >
                      <td className="px-4 py-3 text-white">{match.match}</td>
                      <td className="px-4 py-3 text-right text-gray-300">{match.bets}</td>
                      <td className="px-4 py-3 text-right text-gray-300">${match.amount.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminBetStats; 