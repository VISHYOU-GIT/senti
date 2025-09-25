import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiMapPin, 
  FiCalendar, 
  FiClock,
  FiActivity,
  FiEdit,
  FiKey,
  FiArrowLeft,
  FiUserCheck,
  FiUserX,
  FiExternalLink,
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiTrendingUp,
  FiBarChart
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import useStore from '../store';

export default function UserDetail() {
  const { userId } = useParams();
  const { users, setUsers, posts } = useStore();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);

  const user = users.find(u => u.id === parseInt(userId));

  if (!user) {
    return (
      <div className="text-center py-12">
        <FiUser className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">User not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The user you're looking for doesn't exist.
        </p>
        <Link
          to="/users"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Link>
      </div>
    );
  }

  // Avatar component
  const Avatar = ({ user, size = 'lg' }) => {
    const sizeClasses = {
      sm: 'w-8 h-8 text-sm',
      md: 'w-12 h-12 text-base',
      lg: 'w-20 h-20 text-xl',
      xl: 'w-32 h-32 text-3xl'
    };

    if (user.avatar) {
      return (
        <img
          src={user.avatar}
          alt={user.firstName}
          className={`${sizeClasses[size]} rounded-full object-cover`}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      );
    }

    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || user.username?.[0]?.toUpperCase() || 'U';
    
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold`}>
        {initials}
      </div>
    );
  };

  // Calculate average active hours
  const avgActiveHours = useMemo(() => {
    if (!user.todayActiveHours || !Array.isArray(user.todayActiveHours)) {
      return user.avgActiveHours || 0;
    }
    const totalMinutes = user.todayActiveHours.reduce((sum, hour) => sum + (hour.minutes || 0), 0);
    return (totalMinutes / 60).toFixed(1);
  }, [user.todayActiveHours, user.avgActiveHours]);

  // Get user's recent posts interactions
  const recentInteractions = useMemo(() => {
    return user.recentInteractions.map(interaction => {
      const post = posts.find(p => p.id === interaction.postId);
      return {
        ...interaction,
        post: post || { title: 'Post not found', author: 'Unknown' }
      };
    });
  }, [user.recentInteractions, posts]);

  // Activity chart data
  const chartData = useMemo(() => {
    if (!user.todayActiveHours || !Array.isArray(user.todayActiveHours)) {
      return [];
    }
    return user.todayActiveHours.map((hourData) => ({
      hour: hourData.hour,
      activity: hourData.minutes || 0,
      label: `${hourData.hour.toString().padStart(2, '0')}:00`
    }));
  }, [user.todayActiveHours]);

  const maxActivity = chartData.length > 0 ? Math.max(...chartData.map(d => d.activity)) : 0;

  const handleToggleUserStatus = () => {
    const updatedUsers = users.map(u =>
      u.id === user.id ? { ...u, isEnabled: !u.isEnabled } : u
    );
    setUsers(updatedUsers);
    toast.success(`User ${user.isEnabled ? 'disabled' : 'enabled'} successfully`);
  };

  const getStatusBadge = (user) => {
    if (!user.isEnabled) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <FiUserX className="w-4 h-4 mr-2" />
          Disabled
        </span>
      );
    }
    
    if (user.isOnline) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          Online
        </span>
      );
    }
    
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
        <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
        Offline
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-purple-100 text-purple-800',
      moderator: 'bg-blue-100 text-blue-800',
      user: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${styles[role] || styles.user}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatInteractionTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getInteractionIcon = (type) => {
    switch (type) {
      case 'like': return <FiHeart className="w-4 h-4 text-red-500" />;
      case 'comment': return <FiMessageCircle className="w-4 h-4 text-blue-500" />;
      case 'share': return <FiShare2 className="w-4 h-4 text-green-500" />;
      default: return <FiActivity className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/users"
            className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-md transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <p className="text-gray-600">Comprehensive user information and analytics</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEditModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiEdit className="w-4 h-4 mr-2" />
            Edit User
          </button>
          <button
            onClick={() => setShowResetPasswordModal(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <FiKey className="w-4 h-4 mr-2" />
            Reset Password
          </button>
          <button
            onClick={handleToggleUserStatus}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              user.isEnabled
                ? 'text-white bg-red-600 hover:bg-red-700'
                : 'text-white bg-green-600 hover:bg-green-700'
            }`}
          >
            {user.isEnabled ? (
              <>
                <FiUserX className="w-4 h-4 mr-2" />
                Disable User
              </>
            ) : (
              <>
                <FiUserCheck className="w-4 h-4 mr-2" />
                Enable User
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar user={user} size="xl" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-600">@{user.username}</p>
            <div className="mt-3 flex items-center justify-center space-x-2">
              {getStatusBadge(user)}
              {getRoleBadge(user.role)}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center">
              <FiMail className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{user.email}</span>
            </div>
            <div className="flex items-center">
              <FiPhone className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{user.phone}</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">
                {user.city}, {user.state}, {user.country}
              </span>
            </div>
            <div className="flex items-center">
              <FiCalendar className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">
                Joined {formatDate(user.registeredDate || user.joinDate)}
              </span>
            </div>
            <div className="flex items-center">
              <FiClock className="w-5 h-5 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">
                Last active {formatDate(user.lastActive)}
              </span>
            </div>
          </div>
        </div>

        {/* Activity Overview */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiActivity className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Avg Active Hours</p>
                  <p className="text-2xl font-semibold text-gray-900">{avgActiveHours}h</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiHeart className="w-6 h-6 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Likes</p>
                  <p className="text-2xl font-semibold text-gray-900">{user.stats?.totalLikes || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiMessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Comments</p>
                  <p className="text-2xl font-semibold text-gray-900">{user.stats?.totalComments || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiShare2 className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Shares</p>
                  <p className="text-2xl font-semibold text-gray-900">{user.stats?.totalShares || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">Today's Activity Hours</h3>
              <FiBarChart className="w-5 h-5 text-gray-400" />
            </div>
            <div className="relative h-64">
              {chartData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">No activity data available</p>
                </div>
              ) : (
                <div className="flex items-end justify-between h-full">
                  {chartData.map((data, index) => (
                    <div key={index} className="flex flex-col items-center" style={{ width: `${100/24}%` }}>
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm transition-all duration-300 hover:from-blue-600 hover:to-blue-500 mx-0.5"
                        style={{
                          height: maxActivity > 0 ? `${(data.activity / maxActivity) * 100}%` : '0px',
                          minHeight: data.activity > 0 ? '4px' : '0px'
                        }}
                        title={`${data.label}: ${data.activity} minutes`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-1 writing-mode-vertical-lr text-orientation-mixed transform rotate-0" style={{ fontSize: '10px' }}>
                        {index % 6 === 0 ? data.label : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex items-center justify-center mt-2">
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                  <span>Activity Level (minutes)</span>
                </div>
                <div>Peak: {maxActivity} minutes</div>
                <div>Average: {avgActiveHours}h</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Interactions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Post Interactions</h3>
          <p className="text-sm text-gray-600">Latest activities and engagements</p>
        </div>
        <div className="divide-y divide-gray-200">
          {recentInteractions.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FiActivity className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent interactions</h3>
              <p className="mt-1 text-sm text-gray-500">This user hasn't interacted with any posts recently.</p>
            </div>
          ) : (
            recentInteractions.map((interaction, index) => (
              <div key={index} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getInteractionIcon(interaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {interaction.type.charAt(0).toUpperCase() + interaction.type.slice(1)}d post
                      </p>
                      <p className="text-sm text-gray-600 truncate max-w-md">
                        "{interaction.post.title}"
                      </p>
                      <p className="text-xs text-gray-500">
                        by {interaction.post.author} • {formatInteractionTime(interaction.timestamp)}
                      </p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      to={`/posts/${interaction.postId}`}
                      className="text-primary-600 hover:text-primary-900 p-1"
                    >
                      <FiExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modals would be implemented here */}
      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit User Details</h3>
              <p className="text-sm text-gray-600 mb-4">
                User edit functionality would be implemented here with form fields for updating user information.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {showResetPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reset Password</h3>
              <p className="text-sm text-gray-600 mb-4">
                This will send a password reset link to {user.email}.
              </p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowResetPasswordModal(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    toast.success('Password reset link sent successfully!');
                    setShowResetPasswordModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Send Reset Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}