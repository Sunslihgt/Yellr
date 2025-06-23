import React, { useState, useEffect } from 'react';

import MessageCard from '../components/MessageCard';
import UserCard from '../components/UserCard';
import SkeletonMessageCard from '../components/SkeletonMessageCard';
import SkeletonUserCard from '../components/SkeletonUserCard';
import { useApi } from '../hooks/useApi';
import { useAppSelector } from '../store/hooks';
import { PostWithAuthor, PostsResponse } from '../@types/post';
import { BASE_URL } from '../constants/config';

function PostsWithSkeleton() {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<PostWithAuthor[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { apiCall } = useApi();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        let isMounted = true;

        const fetchPosts = async () => {
            // Don't fetch posts if user is not authenticated
            if (!isAuthenticated) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                
                const response = await apiCall(`${BASE_URL}/api/posts`);
                
                if (!isMounted) return;
                
                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }
                
                const data: PostsResponse = await response.json();
                setPosts(data.posts);
            } catch (err) {
                if (!isMounted) return;
                console.error('Error fetching posts:', err);
                setError(err instanceof Error ? err.message : 'Failed to fetch posts');
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchPosts();

        return () => {
            isMounted = false;
        };
    }, [apiCall, isAuthenticated]); // Add isAuthenticated to dependencies

    // Show loading or error state if not authenticated
    if (!isAuthenticated) {
        return (
            <div className='bg-gray-100 dark:bg-gray-800 min-h-screen flex flex-col'>
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">What&apos;s new ?</h1>
                            </div>
                            <div className="overflow-y-auto h-[calc(100%-4rem)] scrollbar-hide p-4">
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">Please log in to view posts.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Friends</h1>
                            </div>
                            <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 scrollbar-hide">
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">Please log in to view friends.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='bg-gray-100 dark:bg-gray-800'>
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
                            ) : error ? (
                                <div className="text-center py-8">
                                    <p className="text-red-500 dark:text-red-400">{error}</p>
                                    <button 
                                        onClick={() => window.location.reload()} 
                                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                    >
                                        Retry
                                    </button>
                                </div>
                            ) : posts.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">No posts yet. Be the first to share something!</p>
                                </div>
                            ) : (
                                <>
                                    {posts.map((post) => (
                                        <MessageCard key={post._id} post={post} />
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