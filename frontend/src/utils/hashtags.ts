export function extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w-]+/g;
    return text.match(hashtagRegex) || [];
}
