// Returns true if the url is really a url and not a data url
export const isImageOnlyUrl = (url: string): boolean => {
    return url.startsWith('https://') || url.startsWith('http://');
};

// Returns true if the url is a data url
export const isImageUrlData = (url: string): boolean => {
    return url.startsWith('data:image/')
        || url.startsWith('data:image/jpeg;base64,')
        || url.startsWith('data:image/png;base64,')
        || url.startsWith('data:image/gif;base64,')
        || url.startsWith('data:image/webp;base64,');
};