import React, { useEffect, useState } from 'react';
import { CommentWithAuthor } from '../@types/comment';
import { useApi } from '../hooks/useApi';
import { useAppSelector } from '../store/hooks';
import { BASE_URL } from '../constants/config';
import CommentItem from './CommentItem';
import { extractHashtags } from '../utils/hashtags';

interface CommentSectionProps {
    postId: string;
    commentsCount: number;
    setCommentsCount: (count: number) => void;
}

const MAX_COMMENT_LENGTH = 280;

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
    const [imageErrors, setImageErrors] = useState<{ [commentId: string]: boolean }>({});

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
    }, [postId]); // eslint-disable-line react-hooks/exhaustive-deps

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
            console.error(err);
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
            if (replyingTo) {
                url = `${BASE_URL}/api/comments/reply/${replyingTo}`;
            } else {
                url = `${BASE_URL}/api/comments/post/${postId}`;
            }
            const res = await apiCall(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });
            if (!res.ok) throw new Error('Failed to submit comment');
            setNewComment('');
            setReplyingTo(null);
            await fetchComments();
            setCommentsCount(commentsCount + 1);
        } catch (err) {
            console.error(err);
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
            console.error(err);
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
                    {/* Display extracted hashtags */}
                    {extractHashtags(newComment).length > 0 && (
                        <div className="text-sm mt-2 text-blue-600 dark:text-blue-100 flex flex-wrap gap-1">
                            {extractHashtags(newComment).map((tag, idx) => (
                                <span key={idx} className="font-medium bg-blue-100 dark:bg-blue-900 rounded px-1.5 py-0.5 break-words max-w-full">{tag}</span>
                            ))}
                        </div>
                    )}
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
