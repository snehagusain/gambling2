import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import Button from './Button';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';

const AdminUsersList: React.FC = () => {
  const { users, fetchUsers, loadingData } = useAdmin();
  const [filter, setFilter] = useState('');
  const [userToModify, setUserToModify] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(filter.toLowerCase()) ||
    user.displayName?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleModifyUser = async (userId: string, action: 'suspend' | 'activate') => {
    if (!db) {
      console.error('Database not available');
      return;
    }
    
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { 
        status: action === 'suspend' ? 'suspended' : 'active'
      });
      fetchUsers();
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };

  return (
    <div className="bg-[#1a1f2c] rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white">User Management</h2>
        <div className="relative">
          <input
            type="text"
            className="bg-[#2a3040] border border-[#3a4050] text-white px-3 py-1 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Filter users..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      {loadingData ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          {filter ? 'No users found matching your filter' : 'No users found'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase border-b border-[#2a3040]">
              <tr>
                <th className="px-4 py-3">User ID</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr 
                  key={user.id} 
                  className="border-b border-[#2a3040] hover:bg-[#21273a]"
                >
                  <td className="px-4 py-3 text-gray-300 font-mono text-xs">
                    {user.id.substring(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {user.email || 'No email'}
                  </td>
                  <td className="px-4 py-3 text-gray-300">
                    {user.displayName || 'Anonymous'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full 
                      ${user.status === 'suspended' 
                        ? 'bg-red-900 bg-opacity-30 text-red-400' 
                        : 'bg-green-900 bg-opacity-30 text-green-400'}`
                    }>
                      {user.status || 'active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="px-4 py-3">
                    {user.status === 'suspended' ? (
                      <Button 
                        className="text-xs py-1 px-2 bg-green-600 hover:bg-green-700"
                        onClick={() => handleModifyUser(user.id, 'activate')}
                      >
                        Activate
                      </Button>
                    ) : (
                      <Button 
                        className="text-xs py-1 px-2 bg-red-600 hover:bg-red-700"
                        onClick={() => handleModifyUser(user.id, 'suspend')}
                      >
                        Suspend
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList; 