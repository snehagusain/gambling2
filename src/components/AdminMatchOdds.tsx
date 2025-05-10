import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import Button from './Button';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

// Define match type
interface MatchData {
  id: string;
  matchId: number;
  sport: string;
  match: string;
  teamA: string;
  teamB: string;
  time: string;
  league: string;
  odds: {
    teamA: number;
    draw: number;
    teamB: number;
  };
  status: 'upcoming' | 'live' | 'completed';
}

const AdminMatchOdds: React.FC = () => {
  const { matches, fetchMatches, loadingData, updateMatch } = useAdmin();
  const [filter, setFilter] = useState('');
  const [editingMatch, setEditingMatch] = useState<MatchData | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMatch, setNewMatch] = useState<Omit<MatchData, 'id'>>({
    matchId: Date.now(),
    sport: 'football',
    match: '',
    teamA: '',
    teamB: '',
    time: '',
    league: '',
    odds: {
      teamA: 1.5,
      draw: 3.5,
      teamB: 2.5
    },
    status: 'upcoming'
  });

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const filteredMatches = matches.filter(match => 
    match.match?.toLowerCase().includes(filter.toLowerCase()) ||
    match.league?.toLowerCase().includes(filter.toLowerCase()) ||
    match.sport?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleUpdateOdds = async () => {
    if (!editingMatch) return;
    
    try {
      await updateMatch(editingMatch.id, {
        odds: editingMatch.odds,
        status: editingMatch.status
      });
      setEditingMatch(null);
    } catch (error) {
      console.error('Error updating match odds:', error);
    }
  };

  const handleAddMatch = async () => {
    if (!db) {
      console.error('Database is not available');
      return;
    }
    
    try {
      await addDoc(collection(db, 'matches'), {
        ...newMatch,
        // Generate a unique matchId
        matchId: Date.now()
      });
      
      // Reset form and fetch latest matches
      setNewMatch({
        matchId: Date.now(),
        sport: 'football',
        match: '',
        teamA: '',
        teamB: '',
        time: '',
        league: '',
        odds: {
          teamA: 1.5,
          draw: 3.5,
          teamB: 2.5
        },
        status: 'upcoming'
      });
      setShowAddForm(false);
      fetchMatches();
    } catch (error) {
      console.error('Error adding match:', error);
    }
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;
    
    if (!db) {
      console.error('Database is not available');
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'matches', matchId));
      fetchMatches();
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  // Helper function to render odds editing form
  const renderOddsForm = (match: MatchData) => (
    <div className="p-4 bg-[#232836] rounded-lg mt-2">
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            {match.teamA} Odds
          </label>
          <input
            type="number"
            step="0.1"
            min="1.01"
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={match.odds.teamA}
            onChange={(e) => setEditingMatch({
              ...match,
              odds: {
                ...match.odds,
                teamA: parseFloat(e.target.value)
              }
            })}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Draw Odds
          </label>
          <input
            type="number"
            step="0.1"
            min="1.01"
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={match.odds.draw}
            onChange={(e) => setEditingMatch({
              ...match,
              odds: {
                ...match.odds,
                draw: parseFloat(e.target.value)
              }
            })}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            {match.teamB} Odds
          </label>
          <input
            type="number"
            step="0.1"
            min="1.01"
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={match.odds.teamB}
            onChange={(e) => setEditingMatch({
              ...match,
              odds: {
                ...match.odds,
                teamB: parseFloat(e.target.value)
              }
            })}
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">
          Match Status
        </label>
        <select
          className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={match.status}
          onChange={(e) => setEditingMatch({
            ...match,
            status: e.target.value as 'upcoming' | 'live' | 'completed'
          })}
        >
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          className="text-sm py-1 px-3 bg-red-600 hover:bg-red-700"
          onClick={() => setEditingMatch(null)}
        >
          Cancel
        </Button>
        <Button
          className="text-sm py-1 px-3 bg-green-600 hover:bg-green-700"
          onClick={handleUpdateOdds}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );

  // Helper function to render new match form
  const renderAddMatchForm = () => (
    <div className="bg-[#232836] rounded-lg p-4 mb-6">
      <h3 className="text-white font-medium mb-4">Add New Match</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Sport</label>
          <select
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={newMatch.sport}
            onChange={(e) => setNewMatch({...newMatch, sport: e.target.value})}
          >
            <option value="football">Football</option>
            <option value="cricket">Cricket</option>
            <option value="tennis">Tennis</option>
            <option value="basketball">Basketball</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">League</label>
          <input
            type="text"
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={newMatch.league}
            onChange={(e) => setNewMatch({...newMatch, league: e.target.value})}
            placeholder="e.g. Premier League"
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">Match</label>
        <input
          type="text"
          className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={newMatch.match}
          onChange={(e) => setNewMatch({...newMatch, match: e.target.value})}
          placeholder="e.g. Team A vs Team B"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Team A</label>
          <input
            type="text"
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={newMatch.teamA}
            onChange={(e) => setNewMatch({...newMatch, teamA: e.target.value})}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Team B</label>
          <input
            type="text"
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={newMatch.teamB}
            onChange={(e) => setNewMatch({...newMatch, teamB: e.target.value})}
          />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-xs text-gray-400 mb-1">Time</label>
        <input
          type="text"
          className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={newMatch.time}
          onChange={(e) => setNewMatch({...newMatch, time: e.target.value})}
          placeholder="e.g. 19:30"
        />
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            {newMatch.teamA || 'Team A'} Odds
          </label>
          <input
            type="number"
            step="0.1"
            min="1.01"
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={newMatch.odds.teamA}
            onChange={(e) => setNewMatch({
              ...newMatch,
              odds: {
                ...newMatch.odds,
                teamA: parseFloat(e.target.value)
              }
            })}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            Draw Odds
          </label>
          <input
            type="number"
            step="0.1"
            min="1.01"
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={newMatch.odds.draw}
            onChange={(e) => setNewMatch({
              ...newMatch,
              odds: {
                ...newMatch.odds,
                draw: parseFloat(e.target.value)
              }
            })}
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">
            {newMatch.teamB || 'Team B'} Odds
          </label>
          <input
            type="number"
            step="0.1"
            min="1.01"
            className="w-full bg-[#2a3040] border border-[#3a4050] text-white px-3 py-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={newMatch.odds.teamB}
            onChange={(e) => setNewMatch({
              ...newMatch,
              odds: {
                ...newMatch.odds,
                teamB: parseFloat(e.target.value)
              }
            })}
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button
          className="text-sm py-1 px-3 bg-gray-600 hover:bg-gray-700"
          onClick={() => setShowAddForm(false)}
        >
          Cancel
        </Button>
        <Button
          className="text-sm py-1 px-3 bg-green-600 hover:bg-green-700"
          onClick={handleAddMatch}
          disabled={!newMatch.match || !newMatch.teamA || !newMatch.teamB}
        >
          Add Match
        </Button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#1a1f2c] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">Match Odds Management</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <input
              type="text"
              className="bg-[#2a3040] border border-[#3a4050] text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Filter matches..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <Button 
            className="text-sm py-1 px-3 bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Hide Form' : 'Add Match'}
          </Button>
        </div>
      </div>

      {showAddForm && renderAddMatchForm()}

      {loadingData ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredMatches.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {filter ? 'No matches found matching your filter' : 'No matches found'}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMatches.map(match => (
            <div key={match.id} className="bg-[#21273a] rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs text-gray-400">{match.sport.charAt(0).toUpperCase() + match.sport.slice(1)}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{match.league}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">{match.time}</span>
                    {match.status && (
                      <>
                        <span className="text-xs text-gray-400">•</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          match.status === 'live' ? 'bg-red-900 bg-opacity-30 text-red-400' :
                          match.status === 'completed' ? 'bg-gray-600 bg-opacity-30 text-gray-300' :
                          'bg-green-900 bg-opacity-30 text-green-400'
                        }`}>
                          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-white font-medium">{match.match}</h3>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    className="text-xs py-1 px-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => setEditingMatch(match as MatchData)}
                  >
                    Edit Odds
                  </Button>
                  <Button 
                    className="text-xs py-1 px-2 bg-red-600 hover:bg-red-700"
                    onClick={() => handleDeleteMatch(match.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>

              <div className="flex justify-between mt-3">
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-400 mb-1">{match.teamA}</div>
                  <div className="text-white font-bold">{match.odds.teamA.toFixed(2)}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-400 mb-1">Draw</div>
                  <div className="text-white font-bold">{match.odds.draw.toFixed(2)}</div>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-xs text-gray-400 mb-1">{match.teamB}</div>
                  <div className="text-white font-bold">{match.odds.teamB.toFixed(2)}</div>
                </div>
              </div>

              {editingMatch && editingMatch.id === match.id && renderOddsForm(editingMatch)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminMatchOdds; 