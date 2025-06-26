import React, { useState } from 'react';
import { useApi } from '../hooks/useApi';
import { BASE_URL } from '../constants/config';
import { extractHashtags } from '../utils/hashtags';
import { AiOutlineFileImage, AiOutlineVideoCamera, AiOutlineClose } from 'react-icons/ai';

interface CreatePostProps {
    onPostCreated?: () => void;
}

const MAX_POST_LENGTH = 280;
const MAX_FILE_SIZE = 12 * 1024 * 1024;

const CreatePost: React.FC<CreatePostProps> = ({ onPostCreated }) => {
    const [content, setContent] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [mediaPreview, setMediaPreview] = useState<string | null>(null);
    const [mediaType, setMediaType] = useState<'image' | 'video' | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { apiCall } = useApi();
    const [isFocused, setIsFocused] = useState(false);

    // Extract hashtags from content
    const hashtags = extractHashtags(content);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !imageUrl && !videoUrl) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const postData: any = {
                content,
                tags: hashtags,
            };
            if (imageUrl) postData.imageUrl = imageUrl;
            if (videoUrl) postData.videoUrl = videoUrl;

            const response = await apiCall(`${BASE_URL}/api/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });

            let data;
            try {
                data = await response.json();
            } catch (jsonError) {
                throw new Error('Erreur du serveur. Veuillez réessayer avec une image plus petite.');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create post');
            }

            setContent('');
            setImageUrl('');
            setVideoUrl('');
            setMediaPreview(null);
            setMediaType(null);

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

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > MAX_FILE_SIZE) {
            setError('La taille du fichier ne peut pas dépasser 12MB.');
            return;
        }

        const allowedTypes = type === 'image'
            ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
            : ['video/mp4', 'video/webm', 'video/ogg'];

        if (!allowedTypes.includes(file.type)) {
            setError(`Veuillez sélectionner un fichier ${type === 'image' ? 'image' : 'vidéo'} valide.`);
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target?.result as string;
            if (type === 'image') {
                setImageUrl(base64String);
                setVideoUrl('');
            } else {
                setVideoUrl(base64String);
                setImageUrl('');
            }
            setMediaPreview(base64String);
            setMediaType(type);
            setError(null);
        };
        reader.onerror = () => {
            setError('Erreur lors de la lecture du fichier.');
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveMedia = () => {
        setImageUrl('');
        setVideoUrl('');
        setMediaPreview(null);
        setMediaType(null);
    };

    const isFormValid = content.trim() || imageUrl || videoUrl;

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
                    {/* Media Preview */}
                    {mediaPreview && (
                        <div className="relative">
                            {mediaType === 'image' ? (
                                <img
                                    src={mediaPreview}
                                    alt="Preview"
                                    className="max-w-full h-auto max-h-64 rounded-lg object-cover"
                                />
                            ) : (
                                <video
                                    src={mediaPreview}
                                    controls
                                    className="max-w-full h-auto max-h-64 rounded-lg"
                                />
                            )}
                            <button
                                type="button"
                                onClick={handleRemoveMedia}
                                className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-70"
                            >
                                <AiOutlineClose className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center">
                        <div className="flex space-x-2">
                            {/* Image Upload */}
                            <input
                                type="file"
                                id="imageUpload"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'image')}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('imageUpload')?.click()}
                                className="flex items-center space-x-1 px-3 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                disabled={!!mediaPreview}
                            >
                                <AiOutlineFileImage className="w-5 h-5" />
                                <span className="text-sm">Photo</span>
                            </button>

                            {/* Video Upload */}
                            <input
                                type="file"
                                id="videoUpload"
                                accept="video/*"
                                onChange={(e) => handleFileUpload(e, 'video')}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onClick={() => document.getElementById('videoUpload')?.click()}
                                className="flex items-center space-x-1 px-3 py-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                disabled={!!mediaPreview}
                            >
                                <AiOutlineVideoCamera className="w-5 h-5" />
                                <span className="text-sm">Video</span>
                            </button>
                        </div>
                    </div>
                    {hashtags.length > 0 && (
                        <div className="text-sm mt-1 text-blue-600 dark:text-blue-100 flex flex-wrap gap-2">
                            {hashtags.map((tag, idx) => (
                                <span key={idx} className="font-semibold bg-blue-100 dark:bg-blue-900 rounded px-2 py-0.5 break-words max-w-full">{tag}</span>
                            ))}
                        </div>
                    )}
                    <div className={`flex space-x-4 items-center ${isFocused || content || mediaPreview ? '' : ' hidden'}`}>
                        <button
                            type="submit"
                            disabled={isSubmitting || !isFormValid}
                            className={`px-6 py-2 rounded-lg text-white whitespace-nowrap bg-blue-500 ${isSubmitting || !isFormValid ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-600'}`}
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