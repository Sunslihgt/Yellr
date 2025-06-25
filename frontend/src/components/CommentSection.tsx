import React, { useEffect, useState } from 'react';
import { CommentWithAuthor } from '../@types/comment';
import { useApi } from '../hooks/useApi';
import { useAppSelector } from '../store/hooks';
import { BASE_URL } from '../constants/config';
import { AiOutlineHeart, AiFillHeart, AiOutlinePlus } from 'react-icons/ai';
import { formatTimeAgo } from '../utils/displayNumbers';

interface CommentSectionProps {
    postId: string;
    commentsCount: number;
    setCommentsCount: (count: number) => void;
}

const MAX_COMMENT_LENGTH = 280;

const CommentItem: React.FC<{
    comment: CommentWithAuthor;
    depth: number;
    user: any;
    liking: string | null;
    editingCommentId: string | null;
    editContent: string;
    setEditContent: React.Dispatch<React.SetStateAction<string>>;
    setEditingCommentId: React.Dispatch<React.SetStateAction<string | null>>;
    handleEdit: (comment: CommentWithAuthor) => void;
    handleEditCancel: () => void;
    handleEditSubmit: (e: React.FormEvent) => void;
    handleLike: (commentId: string) => void;
    handleReply: (commentId: string | null) => void;
    replyingTo: string | null;
    newComment: string;
    setNewComment: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (e: React.FormEvent) => void;
    setReplyingTo: React.Dispatch<React.SetStateAction<string | null>>;
    submitting: boolean;
}> = ({
    comment,
    depth,
    user,
    liking,
    editingCommentId,
    editContent,
    setEditContent,
    setEditingCommentId,
    handleEdit,
    handleEditCancel,
    handleEditSubmit,
    handleLike,
    handleReply,
    replyingTo,
    newComment,
    setNewComment,
    handleSubmit,
    setReplyingTo,
    submitting,
}) => {
    const userHasLiked = user ? comment.likes.includes(user._id) : false;
    const isAuthor = user && comment.author._id === user._id;
    const isEditing = editingCommentId === comment._id;
    const [imageError, setImageError] = useState(false);
    const handleImageError = () => setImageError(true);

    return (
        <li key={comment._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div className="flex items-start space-x-3">
                <img
                    src={imageError || !comment.author.profilePictureUrl ? '/assets/default-avatar.jpg' : comment.author.profilePictureUrl}
                    alt={comment.author.username}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={handleImageError}
                />
                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{comment.author.username}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">· {formatTimeAgo(comment.createdAt)}</span>
                        {comment.updatedAt && comment.updatedAt > comment.createdAt && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">· Edited {formatTimeAgo(comment.updatedAt)}</span>
                        )}
                    </div>
                    {/* Edit form or comment content */}
                    {isEditing ? (
                        <form onSubmit={handleEditSubmit} className="mt-1 mb-2 flex flex-col space-y-2">
                            <textarea
                                value={editContent}
                                onChange={e => setEditContent(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                rows={2}
                                maxLength={280}
                                disabled={submitting}
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={handleEditCancel}
                                    className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !editContent.trim()}
                                    className="px-3 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-gray-900 dark:text-gray-100 text-sm mt-1 mb-2">{comment.content}</div>
                    )}
                    {/* Actions */}
                    <div className="flex items-center space-x-4 text-xs">
                        <button
                            onClick={() => handleLike(comment._id)}
                            disabled={!user || liking === comment._id}
                            className={`flex items-center space-x-1 group ${userHasLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'}`}
                            aria-pressed={userHasLiked}
                        >
                            {userHasLiked ? <AiFillHeart className="w-4 h-4" /> : <AiOutlineHeart className="w-4 h-4" />}
                            <span>{comment.likes.length}</span>
                        </button>
                        <button
                            onClick={() => handleReply(comment._id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-blue-500"
                        >
                            <AiOutlinePlus className="w-4 h-4" />
                            <span>Reply</span>
                        </button>
                        {/* Edit button for author */}
                        {isAuthor && !isEditing && (
                            <button
                                onClick={() => handleEdit(comment)}
                                className="flex items-center space-x-1 text-gray-500 hover:text-green-500"
                            >
                                <span>Edit</span>
                            </button>
                        )}
                    </div>
                    {/* Reply form for this comment */}
                    {replyingTo === comment._id && user && !isEditing && (
                        <form onSubmit={handleSubmit} className="mt-2 flex flex-col space-y-2">
                            <textarea
                                value={newComment}
                                onChange={e => setNewComment(e.target.value)}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                rows={2}
                                placeholder="Write a reply..."
                                maxLength={280}
                                disabled={submitting}
                            />
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setReplyingTo(null)}
                                    className="px-2 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting || !newComment.trim()}
                                    className="px-3 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded"
                                >
                                    Reply
                                </button>
                            </div>
                        </form>
                    )}
                    {/* Render replies recursively */}
                    {comment.replies && comment.replies.length > 0 && (
                        <ul className={depth === 0 ? 'space-y-4' : 'ml-6 space-y-2'}>
                            {comment.replies.map(reply => (
                                <CommentItem
                                    key={reply._id}
                                    comment={reply}
                                    depth={depth + 1}
                                    user={user}
                                    liking={liking}
                                    editingCommentId={editingCommentId}
                                    editContent={editContent}
                                    setEditContent={setEditContent}
                                    setEditingCommentId={setEditingCommentId}
                                    handleEdit={handleEdit}
                                    handleEditCancel={handleEditCancel}
                                    handleEditSubmit={handleEditSubmit}
                                    handleLike={handleLike}
                                    handleReply={handleReply}
                                    replyingTo={replyingTo}
                                    newComment={newComment}
                                    setNewComment={setNewComment}
                                    handleSubmit={handleSubmit}
                                    setReplyingTo={setReplyingTo}
                                    submitting={submitting}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </li>
    );
};

const CommentSection: React.FC<CommentSectionProps> = ({ postId, commentsCount, setCommentsCount }) => {
    const { apiCall } = useApi();
    const { user } = useAppSelector((state) => state.auth);
    const [comments, setComments] = useState<CommentWithAuthor[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [replyingTo, setReplyingTo] = useState<string | null>(null); // commentId or null for post
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [liking, setLiking] = useState<string | null>(null); // commentId being liked
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState('');

    const fetchComments = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiCall(`${BASE_URL}/api/comments/post/${postId}`);
            if (!res.ok) throw new Error('Failed to fetch comments');
            const data = await res.json();
            setComments(data.comments || []);
        } catch (err: any) {
            setError(err.message || 'Error fetching comments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const handleLike = async (commentId: string) => {
        if (!user || liking) return;
        setLiking(commentId);
        try {
            const res = await apiCall(`${BASE_URL}/api/comments/${commentId}/like`, {
                method: 'PUT',
            });
            if (!res.ok) throw new Error('Failed to like/unlike comment');
            await fetchComments();
        } catch (err) {
            // Optionally show error
        } finally {
            setLiking(null);
        }
    };

    const handleReply = (commentId: string | null) => {
        setReplyingTo(commentId);
        setNewComment('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;
        setSubmitting(true);
        try {
            let url = '';
            let method = 'POST';
            if (replyingTo) {
                url = `${BASE_URL}/api/comments/reply/${replyingTo}`;
            } else {
                url = `${BASE_URL}/api/comments/post/${postId}`;
            }
            const res = await apiCall(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });
            if (!res.ok) throw new Error('Failed to submit comment');
            setNewComment('');
            setReplyingTo(null);
            await fetchComments();
            setCommentsCount(commentsCount + 1);
        } catch (err) {
            // Optionally show error
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (comment: CommentWithAuthor) => {
        setEditingCommentId(comment._id);
        setEditContent(comment.content);
    };

    const handleEditCancel = () => {
        setEditingCommentId(null);
        setEditContent('');
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !editContent.trim() || !editingCommentId) return;
        setSubmitting(true);
        try {
            const url = `${BASE_URL}/api/comments/${editingCommentId}/edit`;
            const res = await apiCall(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent }),
            });
            if (!res.ok) throw new Error('Failed to edit comment');
            setEditingCommentId(null);
            setEditContent('');
            await fetchComments();
        } catch (err) {
            // Optionally show error
        } finally {
            setSubmitting(false);
        }
    };

    const renderComments = (comments: CommentWithAuthor[], depth = 0) => (
        <ul className={depth === 0 ? 'space-y-4' : 'ml-6 space-y-2'}>
            {comments.map(comment => (
                <CommentItem
                    key={comment._id}
                    comment={comment}
                    depth={depth}
                    user={user}
                    liking={liking}
                    editingCommentId={editingCommentId}
                    editContent={editContent}
                    setEditContent={setEditContent}
                    setEditingCommentId={setEditingCommentId}
                    handleEdit={handleEdit}
                    handleEditCancel={handleEditCancel}
                    handleEditSubmit={handleEditSubmit}
                    handleLike={handleLike}
                    handleReply={handleReply}
                    replyingTo={replyingTo}
                    newComment={newComment}
                    setNewComment={setNewComment}
                    handleSubmit={handleSubmit}
                    setReplyingTo={setReplyingTo}
                    submitting={submitting}
                />
            ))}
        </ul>
    );

    return (
        <div className="w-full mt-4">
            <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Comments</h4>
            {loading ? (
                <div className="text-gray-500 dark:text-gray-400">Loading comments...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : comments.length === 0 ? (
                <div className="text-gray-500 dark:text-gray-400">No comments yet. Be the first to comment!</div>
            ) : (
                renderComments(comments)
            )}
            {/* New comment form (for post, not a reply) */}
            {user && replyingTo === null && (
                <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-2">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        rows={2}
                        placeholder="Write a comment..."
                        maxLength={MAX_COMMENT_LENGTH}
                        disabled={submitting}
                    />
                    <div className="flex items-center space-x-2">
                        <button
                            type="submit"
                            disabled={submitting || !newComment.trim()}
                            className="px-4 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
                        >
                            Comment
                        </button>
                        <div className={`text-sm ${newComment.length === MAX_COMMENT_LENGTH ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            {newComment.length}/{MAX_COMMENT_LENGTH}
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default CommentSection;