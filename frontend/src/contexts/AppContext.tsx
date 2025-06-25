import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../@types/user';

interface AppContextType {
    followersCount: Record<string, number>;
    updateFollowersCount: (userId: string, count: number) => void;
    
    followedUsers: User[];
    setFollowedUsers: (users: User[]) => void;
    addFollowedUser: (user: User) => void;
    removeFollowedUser: (userId: string) => void;
    
    refreshLikedPosts: Record<string, boolean>;
    triggerLikedPostsRefresh: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

interface AppProviderProps {
    children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
    const [followersCount, setFollowersCount] = useState<Record<string, number>>({});
    const [followedUsers, setFollowedUsers] = useState<User[]>([]);
    const [refreshLikedPosts, setRefreshLikedPosts] = useState<Record<string, boolean>>({});

    const updateFollowersCount = (userId: string, count: number) => {
        setFollowersCount(prev => ({
            ...prev,
            [userId]: count
        }));
    };

    const addFollowedUser = (user: User) => {
        setFollowedUsers(prev => {
            const exists = prev.some(u => u._id === user._id);
            if (!exists) {
                return [...prev, user];
            }
            return prev;
        });
    };

    const removeFollowedUser = (userId: string) => {
        setFollowedUsers(prev => prev.filter(user => user._id !== userId));
    };

    const triggerLikedPostsRefresh = (userId: string) => {
        setRefreshLikedPosts(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    const value: AppContextType = {
        followersCount,
        updateFollowersCount,
        followedUsers,
        setFollowedUsers,
        addFollowedUser,
        removeFollowedUser,
        refreshLikedPosts,
        triggerLikedPostsRefresh
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}; 