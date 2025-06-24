import React, { useState } from 'react';
import ToggleButton from './ToggleButton';
import TagInput from './TagInput';
import { AiFillCaretDown, AiFillCaretUp } from 'react-icons/ai';

interface PostSearchPaneProps {
    onFoldChange?: (folded: boolean) => void;
}

const PostSearchPane: React.FC<PostSearchPaneProps> = ({ onFoldChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [authors, setAuthors] = useState<string[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    const [subscribedOnly, setSubscribedOnly] = useState(false);
    const [folded, setFolded] = useState(true);

    const handleFoldChange = (newFolded: boolean) => {
        setFolded(newFolded);
        onFoldChange?.(newFolded);
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement> | null) => {
        if (e) {
            e.preventDefault();
        }
        console.log('Search query:', searchQuery);
        console.log('Author query:', authors);
        console.log('Tags:', tags);
        console.log('Subscribed only:', subscribedOnly);
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
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                        {/* Author selector search bar (improved multi-tag input) */}
                        <TagInput tags={authors} setTags={setAuthors} placeholder="Authors..." />
                        {/* Tags selector search bar (improved multi-tag input) */}
                        <TagInput tags={tags} setTags={setTags} placeholder="Tags..." />
                        {/* Subscribers only toggle button */}
                        <ToggleButton
                            checked={subscribedOnly}
                            onChange={setSubscribedOnly}
                            label="Subscribed only"
                        />
                    </div>
                </form>
            )}
        </div>
    );
};

export default PostSearchPane;