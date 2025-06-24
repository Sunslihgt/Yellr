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
