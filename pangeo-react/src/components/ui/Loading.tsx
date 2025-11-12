import React from 'react';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  type?: 'spinner' | 'skeleton' | 'pulse';
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Loading...',
  size = 'medium',
  type = 'spinner'
}) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  if (type === 'skeleton') {
    return (
      <div className="animate-pulse">
        <div className="space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="animate-pulse flex items-center space-x-4">
        <div className={`bg-gray-300 rounded-full ${sizeClasses[size]}`}></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-24"></div>
          <div className="h-3 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`animate-spin rounded-full border-4 border-gray-300 border-t-emerald-600 ${sizeClasses[size]}`}></div>
      {message && (
        <p className="text-sm text-gray-600 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

// Skeleton components for different content types
export const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="w-full h-48 bg-gray-300 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
    <div className="flex space-x-2">
      <div className="h-8 bg-gray-300 rounded w-20"></div>
      <div className="h-8 bg-gray-300 rounded w-20"></div>
    </div>
  </div>
);

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 3 }) => (
  <div className="space-y-4 animate-pulse">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
    ))}
  </div>
);

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => (
  <div className="space-y-2 animate-pulse">
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={`h-4 bg-gray-300 rounded ${
          i === lines - 1 ? 'w-2/3' : 'w-full'
        }`}
      ></div>
    ))}
  </div>
);

// Enhanced loading overlay for modals
export const LoadingOverlay: React.FC<{
  isVisible: boolean;
  message?: string;
}> = ({ isVisible, message = 'Loading...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <Loading message={message} size="large" />
      </div>
    </div>
  );
};
