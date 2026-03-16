import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import toast from 'react-hot-toast';
import { Trash2, Users, UserCog, LogOut, RefreshCw } from 'lucide-react';

function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [activeCategory, setActiveCategory] = useState('ALL');

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      toast.error('Only admins can access this page');
      navigate('/');
      return;
    }
    fetchUsers('ALL');
  }, [user, navigate]);

  const fetchUsers = async (category = activeCategory) => {
    setLoading(true);
    try {
      let response;
      if (category === 'ALL') {
        response = await adminApi.getAllUsers();
      } else {
        response = await adminApi.getUsersByRole(category);
      }

      const roleUsers = response.data?.data || response.data || [];
      setUsers(roleUsers);

      if (category === 'ALL') {
        setAllUsers(roleUsers);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete ${userName}?`)) {
      return;
    }

    setDeleting(userId);
    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setAllUsers(allUsers.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const stats = {
    total: allUsers.length,
    doctors: allUsers.filter(u => u.role === 'DOCTOR').length,
    patients: allUsers.filter(u => u.role === 'PATIENT').length,
    admins: allUsers.filter(u => u.role === 'ADMIN').length,
  };

  const categoryTabs = [
    { key: 'ALL', label: 'All Users', count: stats.total },
    { key: 'DOCTOR', label: 'Doctors', count: stats.doctors },
    { key: 'PATIENT', label: 'Patients', count: stats.patients },
    { key: 'ADMIN', label: 'Admins', count: stats.admins },
  ];

  const handleCategoryChange = async (category) => {
    setActiveCategory(category);
    await fetchUsers(category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <UserCog size={32} />
                Admin Dashboard
              </h1>
              <p className="text-slate-400 mt-1">Manage system users and settings</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white font-semibold">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: stats.total, color: 'from-blue-500 to-blue-600' },
            { label: 'Doctors', value: stats.doctors, color: 'from-green-500 to-green-600' },
            { label: 'Patients', value: stats.patients, color: 'from-purple-500 to-purple-600' },
            { label: 'Admins', value: stats.admins, color: 'from-orange-500 to-orange-600' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-gradient-to-br ${stat.color} rounded-lg shadow-lg p-6 text-white`}>
              <p className="text-sm font-medium opacity-90">{stat.label}</p>
              <p className="text-4xl font-bold mt-2">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-slate-700 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-slate-800 px-6 py-4 border-b border-slate-600 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Users size={24} />
              {categoryTabs.find((tab) => tab.key === activeCategory)?.label || 'Users'}
            </h2>
            <button
              onClick={() => fetchUsers(activeCategory)}
              disabled={loading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white px-4 py-2 rounded transition"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>

          <div className="px-6 py-4 border-b border-slate-600 bg-slate-750">
            <div className="flex flex-wrap gap-2">
              {categoryTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleCategoryChange(tab.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    activeCategory === tab.key
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              <p className="text-white mt-4">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <p>No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-800 border-b border-slate-600">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Joined</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Last Updated</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-600 hover:bg-slate-600 transition">
                      <td className="px-6 py-3 text-slate-200">{u.id}</td>
                      <td className="px-6 py-3 text-white font-medium">{u.name}</td>
                      <td className="px-6 py-3 text-slate-300">{u.email}</td>
                      <td className="px-6 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          u.role === 'DOCTOR' ? 'bg-green-500/20 text-green-400' :
                          u.role === 'PATIENT' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-slate-300 text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-3 text-slate-300 text-sm">
                        {u.updatedAt ? new Date(u.updatedAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          disabled={deleting === u.id || u.id === user?.id}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white px-3 py-1 rounded text-sm transition"
                        >
                          <Trash2 size={16} />
                          {deleting === u.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-slate-700 rounded-lg p-6 border-l-4 border-blue-500">
          <h3 className="text-lg font-bold text-white mb-3">Admin Features</h3>
          <ul className="text-slate-300 space-y-2">
            <li>✓ View all users in the system</li>
            <li>✓ Delete users (except yourself)</li>
            <li>✓ Monitor doctors and patients</li>
            <li>✓ Manage admin accounts</li>
            <li>✓ System statistics and overview</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
