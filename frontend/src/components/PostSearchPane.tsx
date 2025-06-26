import React, { useState, forwardRef, useImperativeHandle } from 'react';
import ToggleButton from './ToggleButton';
import TagInput from './TagInput';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';

interface PostSearchPaneProps {
    onFoldChange?: (folded: boolean) => void;
    onSearch?: (searchRequest: SearchRequestBody) => void;
}

export interface SearchRequestBody {
    content: string;
    authors: string[];
    tags: string[];
    subscribedOnly: boolean;
}

const PostSearchPane = forwardRef<{ getSearchRequest: () => SearchRequestBody }, PostSearchPaneProps>(
    (
        { onFoldChange, onSearch }, ref
    ) => {
        const [content, setContent] = useState('');
        const [author, setAuthor] = useState('');
        const [tags, setTags] = useState<string[]>([]);
        const [subscribedOnly, setSubscribedOnly] = useState(false);
        const [folded, setFolded] = useState(true);

        useImperativeHandle(ref, () => ({
            getSearchRequest: () => ({
                content,
                authors: [author],
                tags,
                subscribedOnly,
            }),
        }), [content, author, tags, subscribedOnly]);

        const handleFoldChange = (newFolded: boolean) => {
            setFolded(newFolded);
            onFoldChange?.(newFolded);
        };

        const handleSearch = (e: React.FormEvent<HTMLFormElement> | null) => {
            if (e) {
                e.preventDefault();
            }
            const searchRequest: SearchRequestBody = {
                content,
                authors: [author],
                tags,
                subscribedOnly,
            };
            if (onSearch) {
                onSearch(searchRequest);
            }
        };

        return (
            <div className="border-b border-gray-200 dark:border-gray-700">
                {/* Header bar with fold/unfold button */}
                <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => handleFoldChange(!folded)}>
                    <span className="text-gray-900 dark:text-white hover:text-blue-500 font-semibold text-lg">Search Filters</span>
                    <button
                        type="button"
                        className="text-gray-500 hover:text-blue-500 focus:outline-none"
                        aria-label={folded ? 'Expand search filters' : 'Collapse search filters'}
                        onClick={e => { e.stopPropagation(); handleFoldChange(!folded); }}
                    >
                        {folded ? (
                            <AiFillCaretDown className="text-gray-600 dark:text-white hover:text-blue-500" />
                        ) : (
                            <AiFillCaretUp className="text-gray-600 dark:text-white hover:text-blue-500" />
                        )}
                    </button>
                </div>
                {/* Foldable content */}
                {!folded && (
                    <form className="flex flex-col gap-4 p-4 pt-0" onSubmit={handleSearch}>
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* Main search bar - full width */}
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search posts..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(null);
                                    }
                                }}
                            />
                            {/* Search button */}
                            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                            Search
                            </button>
                        </div>
                        {/* Second row: checkbox and post selector */}
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            {/* Author search input */}
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Author..."
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSearch(null);
                                    }
                                }}
                            />
                            {/* Tags selector search bar (improved multi-tag input) */}
                            <TagInput tags={tags} setTags={setTags} placeholder="Tags..." />
                            {/* Subscribers only toggle button */}
                            <ToggleButton
                                checked={subscribedOnly}
                                onChange={setSubscribedOnly}
                                label="Followed only"
                            />
                        </div>
                    </form>
                )}
            </div>
        );
    });

PostSearchPane.displayName = "PostSearchPane";

export default PostSearchPane;