import React from 'react';

const SkeletonUserCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4 animate-pulse">
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600" />
      <div className="flex-1 min-w-0">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
      </div>
      <div className="w-16 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
    </div>
  </div>
);

export default SkeletonUserCard;
