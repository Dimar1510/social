import { Comment } from "../types"
import { api } from "./api"

export const commentApi = api.injectEndpoints({
  endpoints: builder => ({
    createComment: builder.mutation<Comment, { commentData: FormData }>({
      query: ({ commentData }) => ({
        url: "/comments",
        method: "POST",
        body: commentData,
      }),
    }),

    deleteComment: builder.mutation<void, string>({
      query: id => ({
        url: `/comments/${id}`,
        method: "DELETE",
      }),
    }),
  }),
})

export const { useCreateCommentMutation, useDeleteCommentMutation } = commentApi

export const {
  endpoints: { createComment, deleteComment },
} = commentApi
