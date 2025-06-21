export interface User {
  _id: string;
  username: string;
  email: string;
  bio: string;
  createdAt: Date;
  role: string;
  profilePictureUrl: string;
}