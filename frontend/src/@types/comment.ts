export interface CommentAuthor {
    _id: string;
    username: string;
    email: string;
    bio?: string;
    profilePictureUrl?: string | null;
}

export interface CommentWithAuthor {
    _id: string;
    content: string;
    author: CommentAuthor;
    authorId: string;
    postId: string;
    parentCommentId?: string | null;
    likes: string[];
    createdAt: string;
    updatedAt: string;
    replies: CommentWithAuthor[];
}