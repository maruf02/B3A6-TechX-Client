// src/redux/services/baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include", // include credentials (cookies)
  }),
  tagTypes: ["Auth", "Post"],

  endpoints: (builder) => ({
    getAllCars: builder.query({
      query: () => "/cars",
    }),

    loginUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/signin",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"], // Invalidate cache after login
    }),

    refreshToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "POST",
      }),
      // providesTags: ["Auth"], // Use this to revalidate tokens
    }),
    updatePassword: builder.mutation({
      query: ({ email, password }) => ({
        url: `/auth/usersPass/${email}`,
        method: "PUT",
        body: { password },
      }),
    }),
    GetUserEmail: builder.query({
      query: (email: string) => ({
        url: `/auth/usersEmail/${email}`,
        method: "GET",
      }),
    }),

    registerUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),

    updateUserById: builder.mutation({
      query: ({ id, updatedUser }) => ({
        url: `auth/usersInfo/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
    }),

    getAllPostsMain: builder.query({
      query: () => "/posts",
    }),

    getAllPosts: builder.query({
      query: ({ page, limit }) => `/posts?page=${page}&limit=${limit}`, // Support pagination
    }),

    createPost: builder.mutation({
      query: (postData) => ({
        url: "/posts",
        method: "POST",
        body: postData,
      }),
    }),
    updatePostById: builder.mutation({
      query: ({ postId, updatePost }) => ({
        url: `posts/${postId}`,
        method: "PUT",
        body: updatePost,
      }),
    }),
    deletePostById: builder.mutation({
      query: (id) => ({
        url: `posts/${id}`,
        method: "DELETE",
      }),
    }),

    followUser: builder.mutation({
      query: ({ userId, followerId }) => ({
        url: `/follow/${userId}`,
        method: "POST",
        body: { followerId, userId },
      }),
    }),
    postComment: builder.mutation({
      query: (commentData) => ({
        url: `/comments`,
        method: "POST",
        body: commentData,
      }),
    }),

    likePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `posts/${postId}/like`,
        method: "POST",
        body: { userId, postId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ], // Invalidate the specific post
    }),

    dislikePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `posts/${postId}/dislike`,
        method: "POST",
        body: { userId, postId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ], // Invalidate the specific post
    }),

    updateComment: builder.mutation({
      query: ({ commentId, comment }) => ({
        url: `comments/${commentId}`,
        method: "PUT",
        body: { comment },
      }),
    }),
    deleteComment: builder.mutation({
      query: (commentId) => ({
        url: `comments/${commentId}`,
        method: "DELETE",
      }),
    }),

    createPayment: builder.mutation({
      query: (BookingData) => ({
        url: "/payment",
        method: "POST",
        body: BookingData,
      }),
    }),

    getPaymentByUserId: builder.query({
      query: (userId: string) => `/payments/user/${userId}`, // Adjust the endpoint if needed
    }),
    getUserById: builder.query({
      query: (userId) => `/auth/usersId/${userId}`,
    }),

    getPostByUserId: builder.query({
      query: (userId) => `/posts/user/${userId}`,
    }),
    getPostByPostId: builder.query({
      query: (id) => `/posts/${id}`, // Adjust this to use the post ID
    }),
    getCommentsByPostId: builder.query({
      query: (postId) => `comments/${postId}`,
    }),
  }),
});

export const {
  useGetAllCarsQuery,
  useLoginUserMutation,
  useUpdatePasswordMutation,
  useGetUserEmailQuery,
  useUpdateUserByIdMutation,
  useRegisterUserMutation,
  useRefreshTokenMutation,
  useCreatePostMutation,
  useUpdatePostByIdMutation,
  useDeletePostByIdMutation,
  useGetAllPostsMainQuery,
  useGetAllPostsQuery,
  useGetPostByUserIdQuery,
  useGetPostByPostIdQuery,
  usePostCommentMutation,
  useGetCommentsByPostIdQuery,
  useDislikePostMutation,
  useLikePostMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetUserByIdQuery,
  useCreatePaymentMutation,
  useGetPaymentByUserIdQuery,
  useFollowUserMutation,
} = baseApi;
