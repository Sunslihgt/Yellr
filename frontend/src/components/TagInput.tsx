import React, { useState } from 'react';
import { AiFillCloseCircle } from 'react-icons/ai';

interface TagInputProps {
    tags: string[];
    setTags: (tags: string[]) => void;
    placeholder?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, setTags, placeholder = 'Tags...' }) => {
    const [tagInput, setTagInput] = useState('');

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ' ' || e.key === ',') && tagInput.trim()) {
            e.preventDefault();
            const newTag = tagInput.trim();
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag]);
            }
            setTagInput('');
        } else if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
            // Remove last tag if input is empty and backspace is pressed
            setTags(tags.slice(0, -1));
        }
    };

    const removeTag = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    return (
        <div className="flex-1 flex flex-wrap items-center gap-2 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
            {tags.map((tag, idx) => (
                <span
                    key={tag}
                    className="flex items-center bg-blue-100 text-blue-800 pl-3 pr-2 rounded-full text-s"
                >
                    {tag}
                    <button
                        type="button"
                        className="ml-1 text-blue-500 hover:text-red-500 focus:outline-none"
                        onClick={() => removeTag(idx)}
                        aria-label={`Remove tag ${tag}`}
                    >
                        <AiFillCloseCircle />
                    </button>
                </span>
            ))}
            <input
                type="text"
                className="flex-1 min-w-[100px] bg-transparent outline-none text-gray-900 dark:text-white"
                placeholder={placeholder}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
            />
        </div>
    );
};

export default TagInput;