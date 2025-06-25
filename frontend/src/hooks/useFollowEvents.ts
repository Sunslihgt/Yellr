import { useEffect, useCallback } from 'react';

type FollowEventType = 'follow' | 'unfollow';

interface FollowEvent {
    type: FollowEventType;
    userId: string;
    targetUserId: string;
}

class FollowEventManager {
    private listeners: ((event: FollowEvent) => void)[] = [];

    subscribe(listener: (event: FollowEvent) => void) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    emit(event: FollowEvent) {
        this.listeners.forEach(listener => listener(event));
    }
}

// Singleton instance
const followEventManager = new FollowEventManager();

export const useFollowEvents = () => {
    const emitFollowEvent = useCallback((type: FollowEventType, userId: string, targetUserId: string) => {
        followEventManager.emit({ type, userId, targetUserId });
    }, []);

    const subscribeToFollowEvents = useCallback((listener: (event: FollowEvent) => void) => {
        return followEventManager.subscribe(listener);
    }, []);

    return {
        emitFollowEvent,
        subscribeToFollowEvents
    };
}; 