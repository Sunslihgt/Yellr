import React, { useState, useEffect } from 'react';
import WorkInProgress from './WorkInProgress';

function ProfileWithSkeleton() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <WorkInProgress />
    );
}

export default ProfileWithSkeleton;