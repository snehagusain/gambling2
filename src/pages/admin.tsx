import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import AdminLogin from '@/components/AdminLogin';
import AdminUsersList from '@/components/AdminUsersList';
import AdminMatchOdds from '@/components/AdminMatchOdds';
import AdminBetStats from '@/components/AdminBetStats';
import { AdminProvider } from '@/contexts/AdminContext';

const AdminPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'matches'>('dashboard');

  return (
    <AdminProvider>
      <div className="min-h-screen bg-[#151921] text-white">
        <AdminContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </AdminProvider>
  );
};

interface AdminContentProps {
  activeTab: 'dashboard' | 'users' | 'matches';
  setActiveTab: (tab: 'dashboard' | 'users' | 'matches') => void;
}

const AdminContent: React.FC<AdminContentProps> = ({ activeTab, setActiveTab }) => {
  const { isAdmin, isLoading, adminData } = useAdmin();
  const { currentUser } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Dashboard</h1>
        <AdminLogin onSuccess={() => {}} />
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12 text-center">
        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-400 mb-6">
          You do not have permission to access the admin dashboard. 
          Please contact the system administrator if you believe this is an error.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin Header */}
      <header className="bg-[#1a1f2c] border-b border-[#2a3040] px-4 py-4">
        <div className="container mx-auto max-w-7xl flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold mr-2">Admin Dashboard</h1>
            <span className="px-2 py-1 text-xs bg-blue-600 rounded-md">
              {adminData?.role || 'admin'}
            </span>
          </div>
          <div className="text-sm text-gray-400">
            Logged in as <span className="text-white">{adminData?.email}</span>
          </div>
        </div>
      </header>
      
      {/* Admin Navigation */}
      <div className="bg-[#21273a] border-b border-[#2a3040]">
        <div className="container mx-auto max-w-7xl px-4">
          <nav className="flex space-x-1">
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'dashboard' 
                  ? 'border-blue-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users' 
                  ? 'border-blue-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'matches' 
                  ? 'border-blue-500 text-white' 
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('matches')}
            >
              Match Odds
            </button>
          </nav>
        </div>
      </div>
      
      {/* Admin Content */}
      <main className="flex-1 bg-[#151921] py-6">
        <div className="container mx-auto max-w-7xl px-4">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <AdminBetStats />
            </div>
          )}
          
          {activeTab === 'users' && (
            <AdminUsersList />
          )}
          
          {activeTab === 'matches' && (
            <AdminMatchOdds />
          )}
        </div>
      </main>
      
      {/* Admin Footer */}
      <footer className="bg-[#1a1f2c] border-t border-[#2a3040] px-4 py-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} Betting Platform Admin Dashboard
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage; 