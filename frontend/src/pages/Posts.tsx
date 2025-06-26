import React, { useState, useEffect } from 'react';

import MessageCard from '../components/MessageCard';
import SkeletonMessageCard from '../components/SkeletonMessageCard';
import PostSearchPane, { SearchRequestBody } from '../components/PostSearchPane';
import CreatePost from '../components/CreatePost';
import FollowedUsersSection from '../components/FollowedUsersSection';
import { useApi } from '../hooks/useApi';
import { useAppSelector } from '../store/hooks';
import { PostWithAuthor, PostsResponse } from '../@types/post';
import { BASE_URL } from '../constants/config';

const POSTS_FETCH_LIMIT = 5;

function PostsWithSkeleton() {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<(PostWithAuthor | null)[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [offset, setOffset] = useState(0);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const [searchPaneFolded, setSearchPaneFolded] = useState(true);
    const [searchRequestBody, setSearchRequestBody] = useState<SearchRequestBody>({
        content: '',
        authors: [],
        tags: [],
        subscribedOnly: false,
    });
    const { apiCall } = useApi();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    // Paginated fetchPosts function
    const fetchPosts = async (fetchOffset = 0, append = false) => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const response = await apiCall(`${BASE_URL}/api/posts/search`, {
                method: 'POST',
                body: JSON.stringify({
                    limit: POSTS_FETCH_LIMIT,
                    offset: fetchOffset,
                    ...searchRequestBody,
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch posts');
            }

            const data: PostsResponse = await response.json();

            setTotalCount(data.totalCount);
            setOffset(fetchOffset + data.count);

            if (append) {
                setPosts((prev) => {
                    let newPosts: (PostWithAuthor | null)[] = prev.concat(data.posts);
                    newPosts = newPosts.filter((post) => post !== null);
                    return newPosts;
                });
            } else {
                setPosts(data.posts);
            }
        } catch (err) {
            console.error('Error fetching posts:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch posts');
            setPosts((prevPosts) => prevPosts.filter((p) => p !== null));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(0, false);
    }, [apiCall, isAuthenticated, searchRequestBody]);

    const handleSearch = (searchRequest: SearchRequestBody) => {
        setSearchRequestBody(searchRequest);
        setPosts([]);
        setOffset(0);
    };

    // Show loading or error state if not authenticated
    if (!isAuthenticated) {
        return (
            <div className='bg-gray-100 dark:bg-gray-800 min-h-screen flex flex-col'>
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                    <div className="lg:col-span-3">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">What&apos;s new ?</h1>
                            </div>
                            <div className="scrollbar-hide p-4">
                                <div className="text-center py-8">
                                    <p className="text-gray-500 dark:text-gray-400">Please log in to view posts.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <FollowedUsersSection />
                </div>
            </div>
        );
    }

    return (
        <div className='bg-gray-100 dark:bg-gray-800'>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 p-4">
                <div className="lg:col-span-3 h-full">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm scrollbar-hide">
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">What&apos;s new ?</h1>
                        </div>
                        {/* Search Pane UI */}
                        <PostSearchPane onFoldChange={setSearchPaneFolded} onSearch={handleSearch} />
                        {/* Add PostHeader component */}
                        <CreatePost onPostCreated={() => fetchPosts(0, false)} />
                        {/* Posts */}
                        <div className="p-4">
                            {loading && posts.length === 0 ? (
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
                                    {posts.map((post, i) => (
                                        post ? (
                                            <MessageCard
                                                key={post._id}
                                                post={post}
                                                onPostUpdated={() => fetchPosts(0, false)}
                                                onPostDeleted={() => fetchPosts(0, false)}
                                            />
                                        ) : (
                                            <SkeletonMessageCard key={i} />
                                        )
                                    ))}
                                    {/* Load more button */}
                                    {(!totalCount || posts.length < totalCount) ? (
                                        <div className="flex justify-center">
                                            <button
                                                className="px-4 py-2 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                onClick={() => {
                                                    // Show skeletons while loading
                                                    setPosts(posts.concat(Array.from({ length: 2 }).map((_, i) => null)));
                                                    fetchPosts(offset, true);
                                                }}
                                                disabled={loading}
                                            >
                                                {loading ? 'Loading...' : 'Load more'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex justify-center">
                                            <p className="text-gray-500 dark:text-gray-400">No more posts to load.</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="hidden lg:block lg:col-span-1">
                    <FollowedUsersSection />
                </div>
            </div>
        </div>
    );
}

export default PostsWithSkeleton;