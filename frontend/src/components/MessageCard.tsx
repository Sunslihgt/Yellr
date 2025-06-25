import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PostWithAuthor } from '../@types/post';
import { BASE_URL } from '../constants/config';
import { useApi } from '../hooks/useApi';
import { useAppSelector } from '../store/hooks';
import { AiOutlineComment, AiOutlineHeart, AiOutlinePlus, AiFillHeart, AiOutlineShareAlt, AiOutlineMore, AiOutlineClose } from 'react-icons/ai';
import { displayCount, formatTimeAgo } from '../utils/displayNumbers';
import CommentSection from './CommentSection';

interface MessageCardProps {
    post: PostWithAuthor;
    onPostUpdated?: () => void;
    onPostDeleted?: () => void;
}

const MessageCard: React.FC<MessageCardProps> = ({ post, onPostUpdated, onPostDeleted }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    const [showCopiedMessage, setShowCopiedMessage] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);
    const { apiCall } = useApi();
    const { user } = useAppSelector((state) => state.auth);
    const [isLiking, setIsLiking] = useState(false);
    const [userHasLiked, setUserHasLiked] = useState(
        user ? post.likes.includes(user._id) : false
    );
    const [likesCount, setLikesCount] = useState(post.likes.length);
    const [likesDisplayed, setLikesDisplayed] = useState('0');
    const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
    const [commentsDisplayed, setCommentsDisplayed] = useState('0');
    const [showCommentSection, setShowCommentSection] = useState(false);

    // Display count with K, M, B for likes and comments
    useEffect(() => {
        setCommentsDisplayed(displayCount(commentsCount));
    }, [commentsCount]);

    useEffect(() => {
        setLikesDisplayed(displayCount(likesCount));
    }, [likesCount]);

    const handleImageError = () => {
        setImageError(true);
    };

    const handleUserClick = () => {
        navigate(`/user/${post.author.username}`);
    };

    const handleShare = async () => {
        const shareUrl = `${BASE_URL}/posts/${post._id}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setShowCopiedMessage(true);

            setTimeout(() => {
                setShowCopiedMessage(false);
            }, 2000);
        } catch (err) {
            console.error('Failed to copy URL:', err);
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);

            setShowCopiedMessage(true);
            setTimeout(() => {
                setShowCopiedMessage(false);
            }, 2000);
        }
    };

    const handleEdit = async () => {
        setIsEditing(true);
        setShowDropdown(false);
    };

    const handleSaveEdit = async () => {
        try {
            const response = await apiCall(`${BASE_URL}/api/posts/${post._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editedContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to update post');
            }

            setIsEditing(false);
            if (onPostUpdated) {
                onPostUpdated();
            }
        } catch (error) {
            console.error('Error updating post:', error);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const response = await apiCall(`${BASE_URL}/api/posts/${post._id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    throw new Error('Failed to delete post');
                }

                if (onPostDeleted) {
                    onPostDeleted();
                }
            } catch (error) {
                console.error('Error deleting post:', error);
            }
        }
        setShowDropdown(false);
    };

    const handleLike = async () => {
        if (!user || isLiking) return;
        setIsLiking(true);
        try {
            const response = await apiCall(`${BASE_URL}/api/posts/${post._id}/like`, {
                method: 'POST',
            });
            if (!response.ok) throw new Error('Failed to like/unlike post');
            const data = await response.json();
            setUserHasLiked(data.userHasLiked);
            setLikesCount(data.likesCount);
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const isAuthor = user?._id === post.author._id;

    return (
        <article className="border-b border-gray-200 dark:border-gray-700 py-2 lg:py-4 px-2 sm:px-2 md:px-8 lg:px-20 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors relative">
            {isAuthor && (
                <div className="absolute top-4 right-4">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                    >
                        <AiOutlineMore className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                    </button>
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                                <button
                                    onClick={handleEdit}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Modify
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="flex space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img
                        className="h-14 w-14 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                        src={imageError || !post.author.profilePictureUrl ? '/assets/default-avatar.jpg' : post.author.profilePictureUrl}
                        alt={`${post.author.username} avatar`}
                        onError={handleImageError}
                        onClick={handleUserClick}
                    />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-lg text-gray-900 dark:text-white hover:underline cursor-pointer" onClick={handleUserClick}>
                            {post.author.username}
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">· {formatTimeAgo(post.createdAt)}
                        </span>
                        {post.updatedAt && post.updatedAt > post.createdAt && (
                            <span className="text-gray-500 dark:text-gray-400">· Edited {formatTimeAgo(post.updatedAt)}</span>
                        )}
                    </div>

                    {/* Message content */}
                    {isEditing ? (
                        <div className="mb-3">
                            <textarea
                                value={editedContent}
                                onChange={(e) => setEditedContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg
                                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                         resize-none"
                                rows={3}
                            />
                            <div className="flex justify-end space-x-2 mt-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-900 dark:text-white text-base leading-relaxed mb-3">
                            {post.content}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Like */}
                        <button
                            onClick={handleLike}
                            disabled={!user || isLiking}
                            className={`flex items-center space-x-2 transition-colors group ${userHasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                            aria-pressed={userHasLiked}
                        >
                            {userHasLiked ? (
                                <AiFillHeart className="w-5 h-5 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 rounded-full p-1"/>
                            ) : (
                                <AiOutlineHeart className="w-5 h-5 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 rounded-full p-1"/>
                            )}
                            <span className="text-sm">{likesDisplayed}</span>
                        </button>

                        {/* Comments */}
                        <button
                            onClick={() => setShowCommentSection(!showCommentSection)}
                            className={`flex items-center space-x-2 hover:text-blue-500 transition-colors group ${showCommentSection ? 'text-blue-500' : 'text-gray-500'}`}
                        >
                            {showCommentSection ? (
                                <AiOutlineClose />
                            ) : (
                                <AiOutlineComment />
                            )}
                            <span className="text-sm">{commentsDisplayed}</span>
                        </button>

                        {/* Share */}
                        <button
                            onClick={handleShare}
                            className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group relative"
                        >
                            <AiOutlineShareAlt />
                            {showCopiedMessage && (
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
                                    Copied to clipboard!
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </div>
            {showCommentSection && (
                <div className="flex items-center justify-between max-w-full">
                    <CommentSection postId={post._id} commentsCount={commentsCount} setCommentsCount={setCommentsCount} />
                </div>
            )}
        </article>
    );
};

export default MessageCard;