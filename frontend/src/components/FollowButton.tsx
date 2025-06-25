import React, { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAppContext } from '../contexts/AppContext';
import { useAppSelector } from '../store/hooks';
import { BASE_URL } from '../constants/config';
import { FollowedByCurrentUserResponse } from '../@types/follow';
import { AiOutlineCheck, AiOutlinePlus } from 'react-icons/ai';

interface FollowButtonProps {
    userId: string;
    className?: string;
    onFollowChange?: (isFollowing: boolean) => void;
}

const FollowButton: React.FC<FollowButtonProps> = ({ userId, className = "", onFollowChange }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { apiCall } = useApi();
    const { updateFollowersCount, addFollowedUser, removeFollowedUser } = useAppContext();
    const { user } = useAppSelector((state) => state.auth);

    const fetchIsFollowing = async () => {
        const response = await apiCall(`${BASE_URL}/api/follow/followed/${userId}`, {
            method: 'GET',
        });
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching is following:', errorData);
            return;
        }
        const data: FollowedByCurrentUserResponse = await response.json();
        setIsFollowing(data.isFollowed);
    };

    useEffect(() => {
        fetchIsFollowing();
    }, [userId, fetchIsFollowing]);

    const handleFollow = async (action: 'follow' | 'unfollow') => {
        if (!user) return;
        
        setIsLoading(true);
        try {
            const response = await apiCall(`${BASE_URL}/api/follow/${userId}`, {
                method: action === 'follow' ? 'POST' : 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error following user:', errorData);
                return;
            }
            const newFollowingState = action === 'follow';
            setIsFollowing(newFollowingState);
            
            // Notify parent component of the change
            if (onFollowChange) {
                onFollowChange(newFollowingState);
            }
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getButtonClasses = () => {
        const baseClasses = 'text-xs px-4 py-2 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
        if (isLoading) {
            return `${baseClasses} bg-gray-300 text-gray-600 cursor-not-allowed`;
        }
        if (isFollowing) {
            return `${baseClasses} bg-gray-100 hover:bg-red-500 text-gray-700 hover:text-white hover:shadow-md focus:ring-gray-500`;
        }
        return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white shadow-sm hover:shadow-md focus:ring-blue-500`;
    };

    const getButtonText = () => {
        if (isLoading) {
            return isFollowing ? 'Unfollowing...' : 'Following...';
        }
        return isFollowing ? 'Following' : 'Follow';
    };

    const getButtonIcon = () => {
        if (isLoading) {
            return (
                <svg className="animate-spin -ml-1 mr-2 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            );
        }

        if (isFollowing) {
            return (
                <AiOutlineCheck className="w-3 h-3 mr-1" />
            );
        }

        return (
            <AiOutlinePlus className="w-3 h-3 mr-1" />
        );
    };

    return (
        <button
            className={`${getButtonClasses()} ${className}`}
            onClick={() => handleFollow(isFollowing ? 'unfollow' : 'follow')}
            disabled={isLoading}
            aria-label={isFollowing ? 'Unfollow' : 'Follow'}
            aria-pressed={isFollowing}
        >
            <span className="flex items-center">
                {getButtonIcon()}
                {getButtonText()}
            </span>
        </button>
    );
};

export default FollowButton;