import { Post } from "../types"
import { api } from "./api"

export const postApi = api.injectEndpoints({
  endpoints: builder => ({
    createPost: builder.mutation<Post, { postData: FormData }>({
      query: ({ postData }) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["allPosts"],
    }),

    getAllPosts: builder.query<Post[], void>({
      query: () => ({
        url: "/posts",
        method: "GET",
      }),
      providesTags: ["allPosts"],
    }),

    getFeedPosts: builder.query<Post[], void>({
      query: () => ({
        url: "/posts/feed",
        method: "GET",
      }),
      providesTags: ["allPosts"],
    }),

    getPostById: builder.query<Post, string>({
      query: id => ({
        url: `/posts/${id}`,
        method: "GET",
      }),
      providesTags: ["currentPost"],
    }),

    deletePost: builder.mutation<void, string>({
      query: id => ({
        url: `/posts/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["allPosts"],
    }),
  }),
})

export const {
  useCreatePostMutation,
  useGetAllPostsQuery,
  useLazyGetAllPostsQuery,
  useGetFeedPostsQuery,
  useLazyGetFeedPostsQuery,
  useGetPostByIdQuery,
  useLazyGetPostByIdQuery,
  useDeletePostMutation,
  usePrefetch,
} = postApi

export const {
  endpoints: { createPost, getFeedPosts, getAllPosts, getPostById, deletePost },
} = postApi
