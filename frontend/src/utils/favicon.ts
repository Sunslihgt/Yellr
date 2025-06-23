// Function to update favicon based on color scheme
export function updateFavicon() {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const favicon: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');

    if (favicon) {
        if (isDarkMode) {
            favicon.href = 'logos/Yellman.svg';
        } else {
            favicon.href = 'logos/YellmanDark.svg';
        }
    }
}

// Initialize favicon management
export function initializeFavicon() {
    // Update favicon on page load
    updateFavicon();

    // Listen for changes in color scheme preference
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateFavicon);
    }
}