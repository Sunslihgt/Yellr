import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { BASE_URL } from '../constants/config';
import { extractHashtags } from '../utils/hashtags';

interface CreatePostProps {
    onPostCreated?: () => void;
}

const MAX_POST_LENGTH = 280;

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { apiCall } = useApi();
    const [isFocused, setIsFocused] = useState(false);

    // Extract hashtags from content
    const hashtags = extractHashtags(content);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await apiCall(`${BASE_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content,
                    tags: hashtags,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create post');
            }

            setContent('');
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (error) {
            console.error('Error creating post:', error);
            setError(error instanceof Error ? error.message : 'Failed to create post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        // Remove line break characters
        const sanitizedValue = e.target.value.replace(/[\r\n]/g, '');
        setContent(sanitizedValue);
    };

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    <textarea
                        value={content}
                        onChange={handleInputChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder="What's on your mind?"
                        className={`w-full p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all duration-200 ${isFocused || content ? 'border border-gray-300 dark:border-gray-600' : 'border-b border-b-gray-200 dark:border-b-gray-700 border-x-0 border-t-0'}`}
                        rows={(isFocused || content) ? 3 : 1}
                        maxLength={MAX_POST_LENGTH}
                    />
                    {hashtags.length > 0 && (
                        <div className="text-sm mt-1 text-blue-600 dark:text-blue-100 flex flex-wrap gap-2">
                            {hashtags.map((tag, idx) => (
                                <span key={idx} className="font-semibold bg-blue-100 dark:bg-blue-900 rounded px-2 py-0.5 break-words max-w-full">{tag}</span>
                            ))}
                        </div>
                    )}
                </div>
                <div className={`flex space-x-4 items-center ${isFocused || content ? '' : ' hidden'}`}>
                    <button
                        type="submit"
                        disabled={isSubmitting || !content.trim()}
                        className={`px-6 py-2 rounded-lg text-white whitespace-nowrap bg-blue-500 ${isSubmitting || !content.trim() ? 'cursor-not-allowed' : 'hover:bg-blue-600'}`}
                    >
                        {isSubmitting ? 'Posting...' : 'Post'}
                    </button>
                    <div className={`text-sm ${content.length === MAX_POST_LENGTH ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                        {content.length}/{MAX_POST_LENGTH}
                    </div>
                </div>
                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}
            </form>
        </div>
    );
};

export default CreatePost;