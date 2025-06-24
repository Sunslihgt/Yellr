import React, { useState, useEffect } from 'react';
import UserCard from './UserCard';
import SkeletonUserCard from './SkeletonUserCard';
import { useApi } from '../hooks/useApi';
import { useAppSelector } from '../store/hooks';
import { User } from '../@types/user';
import { BASE_URL } from '../constants/config';

const FollowedUsersSection: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [followedUsers, setFollowedUsers] = useState<User[]>([]);
    const { apiCall } = useApi();
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    const fetchFollowedUsers = async () => {
        if (!isAuthenticated) {
            setLoading(false);
            return;
        }
        
        try {
            setLoading(true);
            const response = await apiCall(`${BASE_URL}/api/follow/following`, {
                method: 'GET',
            });
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error fetching followed users:', errorData);
                return;
            }
            const data: User[] = (await response.json()) || [];
            setFollowedUsers(data);
        } catch (error) {
            console.error('Error fetching followed users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFollowedUsers();
    }, [isAuthenticated]);

    // Show message if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Followed</h1>
                    </div>
                    <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 scrollbar-hide">
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">Please log in to view followed users.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-[calc(100vh-8rem)] overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Followed</h1>
                </div>
                <div className="overflow-y-auto h-[calc(100%-4rem)] p-4 scrollbar-hide">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => <SkeletonUserCard key={i} />)
                    ) : followedUsers.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400">Follow some users to see them here.</p>
                        </div>
                    ) : (
                        <>
                            {followedUsers.map((user, i) => (
                                <UserCard key={i} user={user} />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FollowedUsersSection; 