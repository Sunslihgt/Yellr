export const copyToClipboard = async (shareUrl: string) => {
    try {
        await navigator.clipboard.writeText(shareUrl);
    } catch (err) {
        console.error('Failed to copy URL:', err);
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
    }
};