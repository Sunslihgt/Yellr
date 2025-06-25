import React from 'react';

// const SkeletonUserCard: React.FC = () => (
//   <div className="bg-white dark:bg-gray-800 p-4 pr-20 pl-20 animate-pulse border-b border-gray-200 dark:border-gray-700">
//     <div className="flex space-x-3">
//       {/* Avatar */}
//       <div className="w-12 h-12 animate-pulse  rounded-full bg-gray-300 dark:bg-gray-600" />

//       {/* Content + Actions (même colonne) */}
//       <div className="flex-1 min-w-0">
//         {/* Header simulation */}
//         <div className="h-4 animate-pulse bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2" />
//         <div className="h-3 animate-pulse bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-3" />
//       </div>
//     </div>
//   </div>
// );

// export default SkeletonUserCard;

// MODE PRIDE

const SkeletonMessageCard: React.FC = () => (
    <article className="border-b border-gray-200 dark:border-gray-700 py-2 lg:py-4 px-2 sm:px-2 md:px-8 lg:px-20">
        <div className="flex space-x-3">
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="h-10 w-10 md:h-14 md:w-14 rounded-full rainbow-skeleton" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center space-x-2 mb-1 w-full flex-wrap pr-7">
                    <div className="h-5 rounded w-24 rainbow-skeleton" />
                    <div className="h-4 rounded w-20 rainbow-skeleton" />
                </div>

                {/* Message content */}
                <div className="mb-3">
                    <div className="h-4 rounded w-full mb-2 rainbow-skeleton" />
                    <div className="h-4 rounded w-3/4 mb-2 rainbow-skeleton" />
                    <div className="h-4 rounded w-1/2 rainbow-skeleton" />
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full rainbow-skeleton" />
                        <div className="h-4 rounded w-8 rainbow-skeleton" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full rainbow-skeleton" />
                        <div className="h-4 rounded w-8 rainbow-skeleton" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 rounded-full rainbow-skeleton" />
                    </div>
                </div>
            </div>
        </div>
    </article>
);

export default SkeletonMessageCard;

