import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useApi } from '../hooks/useApi';
import MessageCard from '../components/MessageCard';
import SkeletonMessageCard from '../components/SkeletonMessageCard';
import { PostWithAuthor } from '../@types/post';

interface UserStats {
    postsCount: number;
    followersCount: number;
    followingCount: number;
}

const Profile: React.FC = () => {
    const { user, isAuthenticated, updateUser } = useAuth();
    const { apiCall } = useApi();

    const [userPosts, setUserPosts] = useState<PostWithAuthor[]>([]);
    const [stats, setStats] = useState<UserStats>({
        postsCount: 0,
        followersCount: 0,
        followingCount: 0
    });
    const [activeTab, setActiveTab] = useState<'posts' | 'likes'>('posts');
    const [isLoadingPosts, setIsLoadingPosts] = useState(true);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [imageError, setImageError] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editForm, setEditForm] = useState({
        profilePictureUrl: '',
        bio: ''
    });
    const [isUpdating, setIsUpdating] = useState(false);
    const [imagePreviewError, setImagePreviewError] = useState(false);

    const fetchUserPosts = async () => {
        if (!user?._id) return;

        setIsLoadingPosts(true);
        try {
            const response = await apiCall(`/api/posts/user/${user._id}`, {
                method: 'GET'
            });
            const data = await response.json();

            if (data.posts) {
                const postsWithAuthor = data.posts.map((post: any) => ({
                    ...post,
                    author: {
                        _id: user._id,
                        username: user.username,
                        email: user.email,
                        bio: user.bio,
                        profilePictureUrl: user.profilePictureUrl
                    }
                }));
                setUserPosts(postsWithAuthor);
                setStats(prev => ({ ...prev, postsCount: data.count || 0 }));
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    const fetchUserStats = async () => {
        if (!user?._id) return;

        setIsLoadingStats(true);
        try {
            const followersResponse = await apiCall(`/api/follow/followers/${user._id}`, {
                method: 'GET'
            });
            const followersData = await followersResponse.json();

            const followingResponse = await apiCall(`/api/follow/following/${user._id}`, {
                method: 'GET'
            });
            const followingData = await followingResponse.json();

            setStats(prev => ({
                ...prev,
                followersCount: Array.isArray(followersData) ? followersData.length : 0,
                followingCount: Array.isArray(followingData) ? followingData.length : 0
            }));
        } catch (error) {
            console.error('Error fetching user stats:', error);
        } finally {
            setIsLoadingStats(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user) {
            fetchUserPosts();
            fetchUserStats();
            setEditForm({
                profilePictureUrl: user.profilePictureUrl || '',
                bio: user.bio || ''
            });
        }
    }, [isAuthenticated, user]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
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

    const handleImageError = () => {
        setImageError(true);
    };

    const handleEditProfile = () => {
        setShowEditModal(true);
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setEditForm({
            profilePictureUrl: user?.profilePictureUrl || '',
            bio: user?.bio || ''
        });
    };

    const handleUpdateProfile = async () => {
        if (!user?._id) return;

        setIsUpdating(true);
        try {
            const profilePictureUrl = editForm.profilePictureUrl.trim();

            if (profilePictureUrl && !isValidImageUrl(profilePictureUrl)) {
                alert('Please enter a valid image URL or base64 image.');
                setIsUpdating(false);
                return;
            }

            console.log('Updating profile with:', {
                profilePictureUrl: profilePictureUrl ? `${profilePictureUrl.substring(0, 50)}...` : 'empty',
                bio: editForm.bio.trim(),
                userId: user._id
            });

            const response = await apiCall(`/api/users/${user._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    profilePictureUrl: profilePictureUrl,
                    bio: editForm.bio.trim()
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                console.log('Profile updated successfully:', updatedUser);

                updateUser(updatedUser);

                setImageError(false);
                setImagePreviewError(false);

                setShowEditModal(false);
            } else {
                const errorData = await response.json();
                console.error('Error updating profile:', errorData);
                alert(`Error updating profile: ${errorData.message || 'Please try again.'}`);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        Please log in to view your profile
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        You need to be authenticated to access this page.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Profile Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-2xl mx-auto px-4 py-6">
                    {/* Back Button */}
                    <div className="flex items-center mb-6">
                        <button
                            onClick={() => window.history.back()}
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
                                className="h-24 w-24 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                                src={imageError || !user.profilePictureUrl ? '/assets/default-avatar.jpg' : user.profilePictureUrl}
                                alt={`${user.username} avatar`}
                                onError={handleImageError}
                            />
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {user.username}
                                    </h1>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        @{user.username}
                                    </p>
                                </div>

                                {/* Edit Profile Button */}
                                <button
                                    onClick={handleEditProfile}
                                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                >
                                    Edit Profile
                                </button>
                            </div>

                            {/* Bio */}
                            {user.bio && (
                                <p className="mt-3 text-gray-900 dark:text-white">
                                    {user.bio}
                                </p>
                            )}

                            {/* Join Date */}
                            <div className="flex items-center mt-3 text-gray-500 dark:text-gray-400">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Joined {formatDate(user.createdAt.toString())}
                            </div>

                            {/* Stats */}
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
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-2xl mx-auto">
                    <nav className="flex">
                        <button
                            onClick={() => setActiveTab('posts')}
                            className={`flex-1 py-4 px-1 text-center text-sm font-medium border-b-2 ${
                                activeTab === 'posts'
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                            } transition-colors`}
                        >
                            Posts
                        </button>
                        <button
                            onClick={() => setActiveTab('likes')}
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
                            // Loading skeletons
                            <div>
                                {[...Array(3)].map((_, index) => (
                                    <SkeletonMessageCard key={index} />
                                ))}
                            </div>
                        ) : userPosts.length > 0 ? (
                            // User posts
                            <div>
                                {userPosts.map((post) => (
                                    <MessageCard key={post._id} post={post} />
                                ))}
                            </div>
                        ) : (
                            // Empty state
                            <div className="text-center py-16">
                                <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                    No posts yet
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    When you post something, it will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'likes' && (
                    <div className="text-center py-16">
                        <svg className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            No likes yet
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400">
                            When you like posts, they will appear here.
                        </p>
                    </div>
                )}
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
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

                                {/* URL Input */}
                                <textarea
                                    id="profilePictureUrl"
                                    rows={3}
                                    value={editForm.profilePictureUrl}
                                    onChange={(e) => {
                                        setEditForm(prev => ({ ...prev, profilePictureUrl: e.target.value }));
                                        setImagePreviewError(false);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                                    placeholder="https://example.com/your-photo.jpg ou data:image/jpeg;base64,..."
                                />
                                <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    <p className="mb-1">Accepted formats:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Image file (max 5MB): JPEG, PNG, GIF, WebP</li>
                                        <li>Image URL: https://example.com/photo.jpg</li>
                                        <li>Base64 image: data:image/jpeg;base64,/9j/4AAQ...</li>
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
                </div>
            )}
        </div>
    );
};

export default Profile;