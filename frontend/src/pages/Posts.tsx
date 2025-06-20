import React, { useState, useEffect } from 'react';

import MessageCard from '../components/MessageCard';
import UserCard from '../components/UserCard';
import SkeletonMessageCard from '../components/SkeletonMessageCard';
import SkeletonUserCard from '../components/SkeletonUserCard';

function PostsWithSkeleton() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className='bg-gray-100 dark:bg-gray-800 min-h-screen flex flex-col'>
            {/* <Navbar /> */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">What&apos;s new ?</h1>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-4rem)] scrollbar-hide p-4">
                            {loading ? (
                                Array.from({ length: 2 }).map((_, i) => <SkeletonMessageCard key={i} />)
                            ) : (
                                <>
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <MessageCard key={i} />
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Friends</h1>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 scrollbar-hide">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => <SkeletonUserCard key={i} />)
                            ) : (
                                <>
                                    {Array.from({ length: 3 }).map((_, i) => (
                                        <UserCard key={i} />
                                    ))}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostsWithSkeleton;