import { useState, useEffect } from 'react';
import { 
  MdPeople, 
  MdSearch, 
  MdMail, 
  MdPhone, 
  MdAdminPanelSettings, 
  MdPerson, 
  MdCheckCircle, 
  MdCancel 
} from 'react-icons/md';
import api from '../utils/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search) ||
      user.phone?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-t-2 border-teal-500 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-r-2 border-emerald-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-outfit font-bold text-white mb-2 bg-gradient-to-r from-teal-400 to-emerald-600 bg-clip-text text-transparent">
            User Management
          </h1>
          <p className="text-gray-400 flex items-center gap-2 font-medium">
            <MdPeople size={20} className="text-teal-500" />
            Manage {users.length} registered accounts
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MdSearch size={24} className="text-gray-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-3 bg-obsidian-900/50 border border-gray-700 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-white placeholder-gray-500 transition-all outline-none"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users List */}
      <div className="glass-card rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">User</th>
                <th className="px-6 py-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">Contact Info</th>
                <th className="px-6 py-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">Role</th>
                <th className="px-6 py-5 text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border border-teal-500/30 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          {user.role === 'admin' ? (
                            <MdAdminPanelSettings size={24} className="text-teal-400" />
                          ) : (
                            <MdPerson size={24} className="text-emerald-400" />
                          )}
                        </div>
                        <div>
                          <div className="text-white font-bold text-lg">{user.name}</div>
                          <div className="text-gray-500 text-sm">Joined recently</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center text-gray-300 text-sm">
                          <MdMail size={16} className="text-gray-500 mr-2" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-gray-300 text-sm">
                          <MdPhone size={16} className="text-gray-500 mr-2" />
                          {user.phone || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        user.role === 'admin'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : user.role === 'salonOwner'
                          ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        user.isActive !== false
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {user.isActive !== false ? (
                          <>
                            <MdCheckCircle size={14} className="mr-1" />
                            Active
                          </>
                        ) : (
                          <>
                            <MdCancel size={14} className="mr-1" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <MdPeople size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg font-medium">No users found</p>
                    <p className="text-gray-500 text-sm mt-1">Try adjusting your search criteria</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
