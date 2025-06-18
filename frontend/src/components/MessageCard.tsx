const MessageCard = () => {
    return (
        <article className="border-b border-gray-200 dark:border-gray-700 p-4 pr-20 pl-20 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
            <div className="flex space-x-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <img 
                        className="h-12 w-12 rounded-full" 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqPDwMWlLtyFk9XGrH-KyIiBuqUEuL4EkwyA&s" 
                        alt="User avatar"
                    />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">
                            Fan de Tennis
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">
                            @fan2tennis
                        </span>
                        <span className="text-gray-500 dark:text-gray-400">·</span>
                        <span className="text-gray-500 dark:text-gray-400 hover:underline cursor-pointer">
                            2h
                        </span>
                    </div>
                    
                    {/* Message content */}
                    <p className="text-gray-900 dark:text-white text-base leading-relaxed mb-3">
                        J'aime très beaucoup le tennis.
                    </p>
                    
                    {/* Actions */}
                    <div className="flex items-center justify-between max-w-md">
                        {/* Reply */}
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group">
                            <svg className="w-5 h-5 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span className="text-sm">12</span>
                        </button>
                        
                        {/* Retweet */}
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors group">
                            <svg className="w-5 h-5 group-hover:bg-green-50 dark:group-hover:bg-green-900/20 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            <span className="text-sm">5</span>
                        </button>
                        
                        {/* Like */}
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors group">
                            <svg className="w-5 h-5 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            <span className="text-sm">24</span>
                        </button>
                        
                        {/* Share */}
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors group">
                            <svg className="w-5 h-5 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 rounded-full p-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </article>
    );
};

export default MessageCard;