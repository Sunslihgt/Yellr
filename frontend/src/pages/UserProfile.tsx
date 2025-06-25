import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import { useAppContext } from '../contexts/AppContext';
import MessageCard from '../components/MessageCard';
import SkeletonMessageCard from '../components/SkeletonMessageCard';
import FollowButton from '../components/FollowButton';
import { PostWithAuthor } from '../@types/post';
import { User } from '../@types/user';

interface UserStats {
    postsCount: number;
    followersCount: number;
    followingCount: number;
}

const UserProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user: currentUser, isAuthenticated } = useAuth();
    const { apiCall } = useApi();
    const { followersCount, updateFollowersCount, refreshLikedPosts, triggerLikedPostsRefresh } = useAppContext();
    
    const [profileUser, setProfileUser] = useState<User | null>(null);
    const [userPosts, setUserPosts] = useState<PostWithAuthor[]>([]);
    const [likedPosts, setLikedPosts] = useState<PostWithAuthor[]>([]);
    const [stats, setStats] = useState<UserStats>({
        postsCount: 0,
        followersCount: 0,
        followingCount: 0
    });
    const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');
    const [isLoadingUser, setIsLoadingUser] = useState(true);
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingLikes, setIsLoadingLikes] = useState(true);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [userNotFound, setUserNotFound] = useState(false);

    const fetchUserByUsername = async () => {
        if (!username) return;
        
        if (currentUser && username === currentUser.username) {
            navigate('/profile', { replace: true });
            return;
        }
        
        setIsLoadingUser(true);
        try {
            const response = await apiCall(`/api/users`, {
                method: 'GET'
            });
            
            if (response.ok) {
                const users = await response.json();
                const foundUser = users.find((u: User) => u.username === username);
                
                if (foundUser) {
                    setProfileUser(foundUser);
                    setUserNotFound(false);
                } else {
                    setUserNotFound(true);
                }
            } else {
                setUserNotFound(true);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            setUserNotFound(true);
        } finally {
            setIsLoadingUser(false);
        }
    };

    const fetchUserPosts = async () => {
        if (!profileUser?._id) return;
        
        setIsLoadingPosts(true);
        try {
            const response = await apiCall(`/api/posts/user/${profileUser._id}`, {
                method: 'GET'
            });
            const data = await response.json();
            
            if (data.posts) {
                const postsWithAuthor = data.posts.map((post: any) => ({
                    ...post,
                    author: {
                        _id: profileUser._id,
                        username: profileUser.username,
                        email: profileUser.email,
                        bio: profileUser.bio,
                        profilePictureUrl: profileUser.profilePictureUrl
                    }
                }));
                setUserPosts(postsWithAuthor);
                setStats(prev => ({ ...prev, postsCount: data.count || 0 }));
            }
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    const fetchUserLikedPosts = async () => {
        if (!profileUser?._id) return;
        
        setIsLoadingLikes(true);
        try {
            const response = await apiCall(`/api/posts/user/${profileUser._id}/liked`, {
                method: 'GET'
            });
            const data = await response.json();
            
            if (data.posts) {
                setLikedPosts(data.posts);
            }
        } catch (error) {
            console.error('Error fetching liked posts:', error);
        } finally {
            setIsLoadingLikes(false);
        }
    };

    const fetchUserStats = async () => {
        if (!profileUser?._id) return;
        
        setIsLoadingStats(true);
        try {
            const followersResponse = await apiCall(`/api/follow/followers/${profileUser._id}`, {
                method: 'GET'
            });
            const followersData = await followersResponse.json();
            
            const followingResponse = await apiCall(`/api/follow/following/${profileUser._id}`, {
                method: 'GET'
            });
            const followingData = await followingResponse.json();
            
            setStats(prev => ({
                ...prev,
                followersCount: Array.isArray(followersData) ? followersData.length : 0,
                followingCount: Array.isArray(followingData) ? followingData.length : 0
            }));
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    useEffect(() => {
        fetchUserByUsername();
    }, [username, currentUser]);

    useEffect(() => {
        if (profileUser) {
            fetchUserPosts();
            fetchUserLikedPosts();
            fetchUserStats();
        }
    }, [profileUser]);

    useEffect(() => {
        if (!currentUser || !profileUser) return;
        
        fetchUserLikedPosts();
    }, [currentUser, profileUser, refreshLikedPosts]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const handlePostUpdated = () => {
        fetchUserPosts();
        fetchUserLikedPosts();
    };

    const handlePostDeleted = () => {
        fetchUserPosts();
        fetchUserLikedPosts();
    };

    const handleFollowChange = (isFollowing: boolean) => {
        setStats(prev => ({
            ...prev,
            followersCount: isFollowing ? prev.followersCount + 1 : prev.followersCount - 1
        }));
    };

    const handleBackClick = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Please log in to view this profile
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You need to be authenticated to access this page.
                    </p>
                </div>
            </div>
        );
    }

    if (isLoadingUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (userNotFound) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        User not found
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        The user {username} does not exist.
                    </p>
                    <button
                        onClick={() => navigate('/')}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    if (!profileUser) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
            {/* Profile Header */}
            <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-2xl mx-auto px-4 py-6">
                    {/* Back Button */}
                    <div className="flex items-center mb-6">
                        <button 
                            onClick={handleBackClick}
                            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    </div>

                    {/* Profile Info */}
                    <div className="flex items-start space-x-4">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <img
                                className="h-16 w-16 lg:h-24 lg:w-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                                src={imageError || !profileUser.profilePictureUrl ? '/assets/default-avatar.jpg' : profileUser.profilePictureUrl}
                                alt={`${profileUser.username} avatar`}
                                onError={handleImageError}
                            />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-col md:flex-row lg:flex-row flex-wrap items-start gap-x-4 gap-y-2 md:justify-between lg:justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white break-words">
                                        {profileUser.username}
                                    </h1>
                                </div>
                                {currentUser && currentUser._id !== profileUser._id && (
                                    <FollowButton
                                        userId={profileUser._id}
                                        className="mt-2 md:mt-0 md:ml-4 lg:mt-0 lg:ml-4"
                                        onFollowChange={handleFollowChange}
                                    />
                                )}
                            </div>

                            {/* Bio, Join Date, Stats for md+ screens */}
                            <div className="hidden md:block">
                                {profileUser.bio && (
                                    <p className="mt-3 text-gray-900 dark:text-white">
                                        {profileUser.bio}
                                    </p>
                                )}
                                <div className="flex items-center mt-3 text-gray-500 dark:text-gray-400">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Joined {formatDate(profileUser.createdAt.toString())}
                                </div>
                                <div className="flex items-center space-x-6 mt-4">
                                    <div className="text-sm">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {isLoadingStats ? '...' : stats.postsCount}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Posts</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {isLoadingStats ? '...' : stats.followingCount}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {isLoadingStats ? '...' : stats.followersCount}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio, Join Date, Stats for small screens */}
                    <div className="block md:hidden mt-4 w-full">
                        {profileUser.bio && (
                            <p className="text-gray-900 dark:text-white">
                                {profileUser.bio}
                            </p>
                        )}
                        <div className="flex items-center mt-3 text-gray-500 dark:text-gray-400">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Joined {formatDate(profileUser.createdAt.toString())}
                        </div>
                        <div className="flex flex-row flex-wrap gap-x-4 gap-y-2 mt-4">
                            <div className="text-sm">
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {isLoadingStats ? '...' : stats.postsCount}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1">Posts</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {isLoadingStats ? '...' : stats.followingCount}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1">Following</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {isLoadingStats ? '...' : stats.followersCount}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1">Followers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-2xl mx-auto">
                    <nav className="flex">
                        <button
                            onClick={() => {
                                setActiveTab('posts');
                                fetchUserPosts();
                            }}
                            className={`flex-1 py-4 px-1 text-center text-sm font-medium border-b-2 ${
                                activeTab === 'posts'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            } transition-colors`}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('likes');
                                fetchUserLikedPosts();
                            }}
                            className={`flex-1 py-4 px-1 text-center text-sm font-medium border-b-2 ${
                                activeTab === 'likes'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            } transition-colors`}
                        >
                            Likes
                        </button>
                    </nav>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto">
                {activeTab === 'posts' && (
                    <div>
                        {isLoadingPosts ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <SkeletonMessageCard key={i} />
                            ))
                        ) : userPosts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    {profileUser.username} hasn't posted anything yet.
                                </p>
                            </div>
                        ) : (
                            userPosts.map((post) => (
                                <MessageCard
                                    key={post._id}
                                    post={post}
                                    onPostUpdated={handlePostUpdated}
                                    onPostDeleted={handlePostDeleted}
                                />
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'likes' && (
                    <div>
                        {isLoadingLikes ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <SkeletonMessageCard key={i} />
                            ))
                        ) : likedPosts.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    {profileUser.username} hasn't liked any posts yet.
                                </p>
                            </div>
                        ) : (
                            likedPosts.map((post) => (
                                <MessageCard
                                    key={post._id}
                                    post={post}
                                    onPostUpdated={handlePostUpdated}
                                    onPostDeleted={handlePostDeleted}
                                />
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;