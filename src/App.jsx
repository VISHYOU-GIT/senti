import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Compose from './pages/Compose';
import Posts from './pages/Posts';
import Feedbacks from './pages/Feedbacks';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';

// User Pages
import HomePage from './pages/user/HomePage';
import UserLogin from './pages/user/UserLogin';
import UserRegister from './pages/user/UserRegister';
import PostsList from './pages/user/PostsList';
import PostDetail from './pages/user/PostDetail';

// Admin Components
import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';

// User Components
import UserHeader from './components/UserHeader';
import UserFooter from './components/UserFooter';

import LoadingSpinner from './components/LoadingSpinner';
import useStore from './store';

export default function App() {
  const location = useLocation();
  const { isAuthenticated, isLoading, fetchData } = useStore();

  // Check if current route is admin route
  const isAdminRoute = location.pathname.startsWith('/admin') || 
                       location.pathname === '/login' || 
                       location.pathname === '/register';

  useEffect(() => {
    // Fetch initial data
    const loadData = async () => {
      await Promise.all([
        fetchData('users'),
        fetchData('posts'),
        fetchData('tags'),
        fetchData('interactions'),
        fetchData('comments')
      ]);
    };
    loadData();
  }, [fetchData]);

  // Admin routes
  if (isAdminRoute) {
    // Admin auth pages
    if (!isAuthenticated) {
      return (
        <>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/*" element={<Navigate to="/login" />} />
          </Routes>
          <LoadingSpinner isLoading={isLoading} />
          <ToastContainer 
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </>
      );
    }

    // Admin layout
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="p-6">
              <Breadcrumbs />
              <Routes>
                <Route path="/login" element={<Navigate to="/admin/dashboard" />} />
                <Route path="/register" element={<Navigate to="/admin/dashboard" />} />
                <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/compose" element={<Compose />} />
                <Route path="/admin/posts" element={<Posts />} />
                <Route path="/admin/users" element={<Users />} />
                <Route path="/admin/users/:userId" element={<UserDetail />} />
                <Route path="/admin/feedbacks" element={<Feedbacks />} />
              </Routes>
            </div>
          </div>
        </main>
        <LoadingSpinner isLoading={isLoading} />
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }

  // User-facing layout
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/user/posts" element={<PostsList />} />
          <Route path="/user/post/:id" element={<PostDetail />} />
        </Routes>
      </main>
      <UserFooter />
      <LoadingSpinner isLoading={isLoading} />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}
