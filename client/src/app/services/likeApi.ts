import { Like } from "../types"
import { api } from "./api"

export const likeApi = api.injectEndpoints({
  endpoints: builder => ({
    likePost: builder.mutation<Like, { postId: string }>({
      query: postId => ({
        url: "/likes",
        method: "POST",
        body: postId,
      }),
    }),

    unlikePost: builder.mutation<void, string>({
      query: postId => ({
        url: `/likes/${postId}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { useLikePostMutation, useUnlikePostMutation } = likeApi

export const {
  endpoints: { likePost, unlikePost },
} = likeApi
