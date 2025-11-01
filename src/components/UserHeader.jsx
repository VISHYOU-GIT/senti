import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiList, FiUser, FiLogOut, FiLogIn } from 'react-icons/fi';
import useStore from '../store';

export default function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isUserAuthenticated, userInfo, userLogout } = useStore();

  const handleLogout = () => {
    userLogout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              <span className="text-blue-600">Senti</span>
              <span className="text-gray-900">Post</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiHome className="w-5 h-5" />
              Home
            </Link>
            <Link
              to="/user/posts"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive('/user/posts')
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FiList className="w-5 h-5" />
              Posts
            </Link>
          </nav>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isUserAuthenticated ? (
              <>
                <div className="hidden md:flex items-center gap-2 text-gray-700">
                  <FiUser className="w-5 h-5" />
                  <span className="font-medium">{userInfo?.name || 'User'}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  <span className="hidden md:inline">Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/user/login"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiLogIn className="w-5 h-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center gap-4 pb-3 overflow-x-auto">
          <Link
            to="/"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              isActive('/')
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600'
            }`}
          >
            <FiHome className="w-5 h-5" />
            Home
          </Link>
          <Link
            to="/user/posts"
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              isActive('/user/posts')
                ? 'bg-blue-50 text-blue-600 font-semibold'
                : 'text-gray-600'
            }`}
          >
            <FiList className="w-5 h-5" />
            Posts
          </Link>
        </nav>
      </div>
    </header>
  );
}
