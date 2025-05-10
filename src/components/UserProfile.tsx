import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = async () => {
    try {
      setError('');
      setLoading(true);
      await logout();
      onClose();
    } catch (error: any) {
      setError('Failed to log out: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName.trim()) {
      return setError('Display name cannot be empty');
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updateUserProfile(displayName);
      setSuccess('Profile updated successfully');
      setIsEditing(false);
    } catch (error: any) {
      setError('Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !currentUser) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-75" onClick={onClose}></div>
      
      <div className="bg-[#1a1f2c] rounded-lg p-6 w-full max-w-md mx-4 z-10">
        <button 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-white mb-6">Your Profile</h2>
        
        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-200 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-500 bg-opacity-20 text-green-200 p-3 rounded mb-4 text-sm">
            {success}
          </div>
        )}

        <div className="mb-6">
          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            {currentUser.displayName 
              ? currentUser.displayName.charAt(0).toUpperCase() 
              : currentUser.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          
          {isEditing ? (
            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  className="w-full bg-[#2a3040] text-white rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2">
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                  onClick={() => {
                    setIsEditing(false);
                    setDisplayName(currentUser.displayName || '');
                  }}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <h3 className="text-xl font-bold text-white">
                {currentUser.displayName || 'User'}
              </h3>
              <p className="text-gray-400 mb-4">{currentUser.email}</p>
              
              <button
                className="px-4 py-2 bg-[#2a3040] text-white rounded hover:bg-[#343b4f] transition-colors mb-4"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-[#2a3040] pt-4">
          <h3 className="text-lg font-semibold text-white mb-3">Account Information</h3>
          
          <div className="mb-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Email verified:</span>
              <span className={currentUser.emailVerified ? 'text-green-400' : 'text-red-400'}>
                {currentUser.emailVerified ? 'Yes' : 'No'}
              </span>
            </div>
            
            <div className="flex justify-between mb-2">
              <span className="text-gray-400">Account created:</span>
              <span className="text-white">
                {currentUser.metadata.creationTime 
                  ? new Date(currentUser.metadata.creationTime).toLocaleDateString() 
                  : 'Unknown'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-400">Last sign in:</span>
              <span className="text-white">
                {currentUser.metadata.lastSignInTime 
                  ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() 
                  : 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            className="w-full px-4 py-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Log Out'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 