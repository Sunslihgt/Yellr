import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../@types/user';
import FollowButton from './FollowButton';

interface UserCardProps {
    user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    const navigate = useNavigate();
    const [imageError, setImageError] = useState(false);
    
    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
        setImageError(true);
    };

    const handleUserClick = () => {
        navigate(`/user/${user.username}`);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
            <div className="flex items-center space-x-3">
                <img
                    className="w-14 h-14 rounded-full cursor-pointer hover:opacity-80 transition-opacity"
                    src={imageError || !user.profilePictureUrl ? '/assets/default-avatar.jpg' : user.profilePictureUrl}
                    alt={`${user.username} profile picture`}
                    onError={handleImageError}
                    onClick={handleUserClick}
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white truncate hover:underline cursor-pointer" onClick={handleUserClick}>
                        {user.username}
                    </h3>
                </div>
                <FollowButton userId={user._id} />
            </div>
        </div>
    );
};

export default UserCard;