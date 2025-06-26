import React from 'react';
import { extractHashtags } from '../utils/hashtags';

interface HashtagContentProps {
    content: string;
}

const HashtagContent: React.FC<HashtagContentProps> = ({ content }) => {
    const hashtags = extractHashtags(content);
    if (hashtags.length === 0) {
        return <span>{content}</span>;
    }

    let result = content;
    hashtags.forEach(tag => {
        const regex = new RegExp(`(${tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'g');
        result = result.replace(regex, '<hashtag>$1</hashtag>');
    });

    const parts = result.split(/(<hashtag>.*?<\/hashtag>)/);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('<hashtag>') && part.endsWith('</hashtag>')) {
                    const tag = part.replace(/<\/?hashtag>/g, '');
                    return (
                        <span key={index} className="font-semibold rounded text-blue-600 dark:text-blue-400">
                            {tag}
                        </span>
                    );
                }
                return <span key={index}>{part}</span>;
            })}
        </>
    );
};

export default HashtagContent;