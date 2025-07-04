export interface Post {
  _id: string;
  content: string;
  authorId: string;
  tags: string[];
  likes: string[];
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  videoUrl?: string;
  commentsCount?: number;
}

export interface PostAuthor {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profilePictureUrl?: string;
}

export interface PostWithAuthor extends Omit<Post, 'authorId'> {
  author: PostAuthor;
  authorId: string;
}

export interface PostsResponse {
  message: string;
  count: number;
  totalCount: number;
  limit: number;
  offset: number;
  posts: PostWithAuthor[];
}