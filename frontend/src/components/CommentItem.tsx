import React, { useState } from 'react';
import { AiOutlineHeart, AiFillHeart, AiOutlinePlus } from 'react-icons/ai';
import { formatTimeAgo } from '../utils/displayNumbers';
import { CommentWithAuthor } from '../@types/comment';

interface CommentItemProps {
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
}

const CommentItem: React.FC<CommentItemProps> = ({
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

export default CommentItem; 