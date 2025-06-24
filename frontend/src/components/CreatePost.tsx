import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { BASE_URL } from '../constants/config';

interface CreatePostProps {
    onPostCreated?: () => void;
}

const MAX_POST_LENGTH = 280;

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { apiCall } = useApi();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            console.log('Attempting to create post with content:', content);
            const response = await apiCall(`${BASE_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content }),
            });

            const data = await response.json();
            console.log('API Response:', data);

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create post');
            }

            setContent('');
            if (onPostCreated) {
                console.log('Calling onPostCreated callback');
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

    return (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-3">
                    <textarea
                        value={content}
                        onChange={handleInputChange}
                        placeholder="What's on your mind?"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg
                                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                 bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                                 placeholder-gray-500 dark:placeholder-gray-400
                                 resize-none"
                        rows={3}
                        maxLength={MAX_POST_LENGTH}
                    />
                    <div className="flex space-x-4 items-center">
                        <button
                            type="submit"
                            disabled={isSubmitting || !content.trim()}
                            className={`px-6 py-2 rounded-lg text-white whitespace-nowrap bg-blue-500
                                    ${isSubmitting || !content.trim()
                                    ? 'cursor-not-allowed'
                                    : 'hover:bg-blue-600'}`}
                        >
                            {isSubmitting ? 'Posting...' : 'Post'}
                        </button>
                        <div className={`text-sm ${content.length === MAX_POST_LENGTH ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
                            {content.length}/{MAX_POST_LENGTH}
                        </div>
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