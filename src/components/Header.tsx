import React, { useState } from 'react';
import Button from './Button';
import { useAuth } from '@/contexts/AuthContext';
import { useAdmin } from '@/contexts/AdminContext';
import Balance from './Balance';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import UserProfile from './UserProfile';
import Link from 'next/link';

const Header = () => {
  const { currentUser } = useAuth();
  const { isAdmin } = useAdmin();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <header className="bg-[#1a1f2c] px-4 py-3 flex justify-between items-center shadow-lg border-b border-[#2a3040]">
      {/* Left section with logo/title */}
      <div className="flex items-center">
        <div className="flex flex-shrink-0 items-center mr-4">
          <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.2" />
            <path d="M15.5 9L15.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M12 10.5V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8.5 12V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <path d="M8.5 9L8.5 9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1 className="ml-2 text-xl font-bold text-white tracking-tight">BetMaster</h1>
        </div>
        
        {/* Navigation - visible on larger screens */}
        <nav className="hidden md:flex space-x-6 ml-6">
          <Link href="/" className="text-white font-medium hover:text-blue-400 transition-colors">Sports</Link>
          <a href="#" className="text-gray-400 font-medium hover:text-white transition-colors">Live</a>
          <a href="#" className="text-gray-400 font-medium hover:text-white transition-colors">Casino</a>
          <a href="#" className="text-gray-400 font-medium hover:text-white transition-colors">Promotions</a>
          {isAdmin && (
            <Link href="/admin" className="text-green-400 font-medium hover:text-green-300 transition-colors">
              Admin
            </Link>
          )}
        </nav>
      </div>
      
      {/* Right section with balance and actions */}
      <div className="flex items-center space-x-3">
        {/* Balance display */}
        {currentUser && (
          <Balance className="mr-3" />
        )}
        
        {/* Action buttons */}
        {currentUser ? (
          <div className="flex items-center">
            <button 
              className="flex items-center space-x-2 bg-[#2a3040] hover:bg-[#343b4f] rounded-full px-3 py-1.5 transition-colors"
              onClick={() => setIsProfileModalOpen(true)}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {currentUser.displayName 
                  ? currentUser.displayName.charAt(0).toUpperCase() 
                  : currentUser.email?.charAt(0).toUpperCase()}
              </div>
              <span className="text-white font-medium hidden md:block">
                {currentUser.displayName || 'User'}
              </span>
              {isAdmin && (
                <span className="ml-1 text-xs bg-green-800 text-green-300 px-1.5 py-0.5 rounded-full hidden md:inline-block">
                  Admin
                </span>
              )}
            </button>
          </div>
        ) : (
          <div className="flex space-x-2">
            <Button 
              className="bg-transparent border border-[#2a3040] hover:bg-[#2a3040] text-sm font-medium px-3 py-1.5"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Login
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-sm font-medium px-3 py-1.5 hidden sm:block"
              onClick={() => setIsSignupModalOpen(true)}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
      
      {/* Modals */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onSwitchToSignup={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }} 
      />
      
      <SignupModal 
        isOpen={isSignupModalOpen} 
        onClose={() => setIsSignupModalOpen(false)} 
        onSwitchToLogin={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }} 
      />
      
      <UserProfile 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </header>
  );
};

export default Header; 