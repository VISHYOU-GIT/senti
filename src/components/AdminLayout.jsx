import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Breadcrumbs from './Breadcrumbs';
import LoadingSpinner from './LoadingSpinner';

import useStore from '../store';

export default function AdminLayout() {
  const location = useLocation();
  const { isLoading, setLoading } = useStore();

  useEffect(() => {
    // Simulate loading on route change
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [location.pathname, setLoading]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="p-6">
            <Breadcrumbs />
            <Outlet />
          </div>
        </div>
      </main>
      <LoadingSpinner isLoading={isLoading} />
    </div>
  );
}