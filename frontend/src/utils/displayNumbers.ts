export const displayCount = (count: number) => {
    if (count > 1_000_000_000) {
        return `${Math.floor(count / 1_000_000_000)}B`;
    } else if (count > 1_000_000) {
        return `${Math.floor(count / 1_000_000)}M`;
    } else if (count > 1_000) {
        return `${Math.floor(count / 1_000)}K`;
    } else {
        return `${count}`;
    }
}

export const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds <= 3) return 'just now';
    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}d`;
}