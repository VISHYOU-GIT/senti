import React from 'react';
import { ClipLoader } from 'react-spinners';

export default function LoadingSpinner({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <div className="flex flex-col items-center space-y-4">
          <ClipLoader color="#0ea5e9" size={40} />
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    </div>
  );
}