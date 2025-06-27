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
import { isImageOnlyUrl, isImageUrlData } from '../utils/image';
import { copyToClipboard } from '../utils/copyToClipboard';
import { createPortal } from 'react-dom';

interface UserStats {
    postsCount: number;
    followersCount: number;
    followingCount: number;
}

const UserProfile: React.FC = () => {
    const { username } = useParams<{ username: string }>();
    const navigate = useNavigate();
    const { user: currentUser, isAuthenticated, updateUser } = useAuth();
    const { apiCall } = useApi();
    const { refreshLikedPosts } = useAppContext();

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
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({ profilePictureUrl: '', bio: '' });
    const [isUpdating, setIsUpdating] = useState(false);
    const [imagePreviewError, setImagePreviewError] = useState(false);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);

    const isOwnProfile = !username || (currentUser && profileUser && currentUser._id === profileUser._id);

    useEffect(() => {
        if (!username) { // Show current user if no username was provided
            if (currentUser) {
                setProfileUser(currentUser);
                setIsLoadingUser(false);
                setUserNotFound(false);
            } else {
                setIsLoadingUser(false);
                setUserNotFound(true);
            }
            return;
        }
        // /user/:username route: fetch by username
        const fetchUserByUsername = async () => {
            setIsLoadingUser(true);
            try {
                const response = await apiCall('/api/users', { method: 'GET' });
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
                setUserNotFound(true);
            } finally {
                setIsLoadingUser(false);
            }
        };
        fetchUserByUsername();
    }, [username, currentUser]);

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

    useEffect(() => {
        if (profileUser) {
            setEditForm({
                profilePictureUrl: profileUser.profilePictureUrl || '',
                bio: profileUser.bio || ''
            });
        }
    }, [profileUser]);

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

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/user/${profileUser?.username}`;
        copyToClipboard(shareUrl);

        setShowCopiedMessage(true);
        setTimeout(() => {
            setShowCopiedMessage(false);
        }, 2000);
    };

    const isValidImageUrl = (url: string): boolean => {
        if (!url) return true;
        if (url.startsWith('data:image/')) {
            const base64Pattern = /^data:image\/(jpeg|jpg|png|gif|webp|svg\+xml);base64,/;
            return base64Pattern.test(url);
        }
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch {
            return false;
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size cannot exceed 5MB.');
            return;
        }
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target?.result as string;
            setEditForm(prev => ({ ...prev, profilePictureUrl: base64String }));
            setImagePreviewError(false);
        };
        reader.onerror = () => {
            alert('Error reading the file.');
        };
        reader.readAsDataURL(file);
    };

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        if (profileUser) {
            setEditForm({
                profilePictureUrl: profileUser.profilePictureUrl || '',
                bio: profileUser.bio || ''
            });
        }
    };

    const handleUpdateProfile = async () => {
        if (!profileUser?._id) return;
        setIsUpdating(true);
        try {
            const profilePictureUrl = editForm.profilePictureUrl.trim();
            if (profilePictureUrl && !isValidImageUrl(profilePictureUrl)) {
                alert('Please enter a valid image URL or base64 image.');
                setIsUpdating(false);
                return;
            }
            const response = await apiCall(`/api/users/${profileUser._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    profilePictureUrl: profilePictureUrl,
                    bio: editForm.bio.trim()
                })
            });
            let updatedUser;
            try {
                updatedUser = await response.json();
            } catch (jsonError) {
                throw new Error('Erreur du serveur. L\'image est peut-être trop volumineuse.');
            }
            if (response.ok) {
                if (currentUser && currentUser._id === updatedUser._id) {
                    updateUser(updatedUser);
                }
                setImageError(false);
                setImagePreviewError(false);
                setShowEditModal(false);
                setProfileUser(updatedUser);
            } else {
                console.error('Error updating profile:', updatedUser);
                alert(`Error updating profile: ${updatedUser.message || 'Veuillez réessayer.'}`);
            }
        } catch (error) {
            alert('Error updating profile. Please try again.');
        } finally {
            setIsUpdating(false);
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
                                <div className="flex items-center gap-2 mt-2 md:mt-0 md:ml-4 lg:mt-0 lg:ml-4">
                                    {/* Share Button */}
                                    <button
                                        onClick={handleShare}
                                        className="relative px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                        title="Share profile"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                        </svg>
                                        {showCopiedMessage && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap z-10">
                                                Copied to clipboard!
                                            </div>
                                        )}
                                    </button>
                                    {isOwnProfile ? (
                                        <button
                                            onClick={handleEditProfile}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            Edit Profile
                                        </button>
                                    ) : (
                                        currentUser && currentUser._id !== profileUser._id && (
                                            <FollowButton
                                                userId={profileUser._id}
                                                onFollowChange={handleFollowChange}
                                            />
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Bio, Join Date, Stats for md+ screens */}
                            <div className="hidden md:block">
                                {profileUser.bio && (
                                    <p className="mt-3 text-gray-900 dark:text-white break-words">
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
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Post{stats.postsCount != 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {isLoadingStats ? '...' : stats.followersCount}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Follower{stats.followersCount != 1 ? 's' : ''}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-bold text-gray-900 dark:text-white">
                                            {isLoadingStats ? '...' : stats.followingCount}
                                        </span>
                                        <span className="text-gray-500 dark:text-gray-400 ml-1">Follow{stats.followingCount != 1 ? 's' : ''}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bio, Join Date, Stats for small screens */}
                    <div className="block md:hidden mt-4 w-full">
                        {profileUser.bio && (
                            <p className="text-gray-900 dark:text-white break-words">
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
                                <span className="text-gray-500 dark:text-gray-400 ml-1">Post{stats.postsCount != 1 ? 's' : ''}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {isLoadingStats ? '...' : stats.followersCount}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1">Follower{stats.followersCount !== 1 ? 's' : ''}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {isLoadingStats ? '...' : stats.followingCount}
                                </span>
                                <span className="text-gray-500 dark:text-gray-400 ml-1">Follow{stats.followingCount != 1 ? 's' : ''}</span>
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
                                    {profileUser.username} hasn&apos;t posted anything yet.
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
                                    {profileUser.username} hasn&apos;t liked any posts yet.
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

            {isOwnProfile && showEditModal && (
                // Create a portal to the body to avoid z-index issues
                createPortal(
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    Edit Profile
                                </h2>
                                <button
                                    onClick={handleCloseModal}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {/* Modal Content */}
                            <div className="p-4 space-y-4">
                                {/* Profile Picture */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Profile Picture
                                    </label>
                                    {/* File Upload Button */}
                                    <div className="mb-3">
                                        <input
                                            type="file"
                                            id="imageUpload"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('imageUpload')?.click()}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                        >
                                            Choose Image
                                        </button>
                                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                                            or paste URL below
                                        </span>
                                    </div>
                                    {/* Clear Image Button */}
                                    {editForm.profilePictureUrl && (!isImageOnlyUrl(editForm.profilePictureUrl) || isValidImageUrl(editForm.profilePictureUrl)) && (
                                        <div className="mb-3">
                                            <button
                                                type="button"
                                                onClick={() => setEditForm(prev => ({ ...prev, profilePictureUrl: '' }))}
                                                className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                                            >
                                                Clear Image
                                            </button>
                                        </div>
                                    )}
                                    {/* URL Input */}
                                    <textarea
                                        id="profilePictureUrl"
                                        rows={3}
                                        value={editForm.profilePictureUrl}
                                        onChange={(e) => {
                                            setEditForm(prev => ({ ...prev, profilePictureUrl: e.target.value }));
                                            setImagePreviewError(false);
                                        }}
                                        className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm resize-none break-all ${isImageUrlData(editForm.profilePictureUrl) ? 'hidden' : ''}`}
                                        placeholder="https://example.com/your-photo.jpg ou data:image/jpeg;base64,..."
                                    />
                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <p className="mb-1">Accepted formats:</p>
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>Image file (max 5MB): JPEG, PNG, GIF, WebP</li>
                                            <li>Image URL: https://example.com/photo.jpg</li>
                                            <li>Base64 image: data:image/jpeg;base64...</li>
                                        </ul>
                                    </div>
                                </div>
                                {/* Preview */}
                                {editForm.profilePictureUrl && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
                                        <div className="flex items-center space-x-4">
                                            <img
                                                src={editForm.profilePictureUrl}
                                                alt="Profile preview"
                                                className="w-20 h-20 rounded-full border-2 border-gray-300 dark:border-gray-600 object-cover"
                                                onError={() => setImagePreviewError(true)}
                                                onLoad={() => setImagePreviewError(false)}
                                                style={{ display: imagePreviewError ? 'none' : 'block' }}
                                            />
                                            {imagePreviewError && (
                                                <div className="w-20 h-20 rounded-full border-2 border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                                                    <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                {imagePreviewError ? (
                                                    <p className="text-sm text-red-600 dark:text-red-400">
                                                        Cannot load image. Please check URL or format.
                                                    </p>
                                                ) : (
                                                    <p className="text-sm text-green-600 dark:text-green-400">
                                                        Valid image ✓
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {/* Bio */}
                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        value={editForm.bio}
                                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                                        placeholder="Tell us about yourself..."
                                        maxLength={200}
                                    />
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        {editForm.bio.length}/200 characters
                                    </p>
                                </div>
                            </div>
                            {/* Modal Footer */}
                            <div className="flex items-center justify-end space-x-3 p-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateProfile}
                                    disabled={isUpdating}
                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isUpdating ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>,
                    document.body
                )
            )}
        </div>
    );
};

export default UserProfile;