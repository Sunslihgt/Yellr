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

const SkeletonUserCard: React.FC = () => (
    <div className="bg-white dark:bg-gray-800 p-4 pr-20 pl-20 border-b border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full rainbow-skeleton" />

            {/* Content + Actions (même colonne) */}
            <div className="flex-1 min-w-0">
                {/* Header simulation */}
                <div className="h-4 rounded w-1/2 mb-2 rainbow-skeleton" />
                <div className="h-3 rounded w-1/3 mb-3 rainbow-skeleton" />
            </div>
        </div>
    </div>
);

export default SkeletonUserCard;

