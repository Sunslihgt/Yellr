import React, { useState, useEffect } from 'react';

function NotificationsWithSkeleton() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-800">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
        <div className="lg:col-span-3 col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden flex items-center justify-center">
            <div className="text-center px-4">
              {loading ? (
                <p className="text-gray-500 dark:text-gray-300 text-xl">Loading...</p>
              ) : (
                <>
                  <img
                    src="https://www.loverboymagazine.com/wp-content/uploads/1979-david_hodo.jpg"
                    alt="Under Construction"
                    className="mx-auto w-1/2 sm:w-1/3 mb-6 rounded-lg shadow-md"
                  />
                  <h1 className="mt-4 text-5xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                    Work in Progress.
                  </h1>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 hidden lg:block">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden flex items-center justify-center">
            <p className="text-gray-400 dark:text-gray-500">Sidebar (optional)</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsWithSkeleton;
