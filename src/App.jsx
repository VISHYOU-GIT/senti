import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Compose from './pages/Compose';
import Posts from './pages/Posts';
import Feedbacks from './pages/Feedbacks';

import Sidebar from './components/Sidebar';
import Breadcrumbs from './components/Breadcrumbs';
import LoadingSpinner from './components/LoadingSpinner';

import useStore from './store';

function AdminRoutes() {
  const location = useLocation();
  const { setLoading } = useStore();

  useEffect(() => {
    // Simulate loading on route change
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/compose" element={<Compose />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/feedbacks" element={<Feedbacks />} />
      <Route path="/login" element={<Navigate to="/dashboard" />} />
      <Route path="/register" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default function App() {
  const { isAuthenticated, isLoading, fetchData } = useStore();

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

  // Auth pages layout
  if (!isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} />
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
            <AdminRoutes />
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
