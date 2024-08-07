export type User = {
  id: string
  email: string
  password: string
  name?: string
  avatarUrl?: string
  dateOfBirth?: string
  createdAt: Date
  updatedAt: Date
  bio?: string
  location?: string
  posts: Post[]
  following: Follows[]
  followers: Follows[]
  likes: Like[]
  comments: Comment[]
  isFollowing?: boolean
  userPosts: Post[]
}

export type Follows = {
  id: string
  follower: User
  followerId: string
  following: User
  followingId: string
}

export type Post = {
  id: string
  content: string
  author: User
  authorId: string
  likes: Like[]
  comments: Comment[]
  likedByUser: boolean
  createdAt: Date
  updatedAt: Date
  imageUrl?: string
}

export type Like = {
  id: string
  user: User
  userId: string
  post: Post
  postId: string
}

export type Comment = {
  id: string
  content: string
  user: User
  userId: string
  post: Post
  postId: string
  createdAt: Date
  imageUrl?: string
}
