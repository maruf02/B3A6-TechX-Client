import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    credentials: "include",
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
      invalidatesTags: ["Auth"],
    }),

    // refreshToken: builder.mutation({
    //   query: () => ({
    //     url: "/auth/refresh-token",
    //     method: "POST",
    //   }),
    //   // providesTags: ["Auth"], // Use this to revalidate tokens
    // }),
    updatePassword: builder.mutation({
      query: ({ email, password }) => ({
        url: `/auth/usersPass/${email}`,
        method: "PUT",
        body: { password },
      }),
    }),
    GetAllUser: builder.query({
      query: () => ({
        url: "/auth/users",
        method: "GET",
      }),
    }),

    addUser: builder.mutation({
      query: (userData) => ({
        url: "/auth/signup",
        method: "POST",
        body: userData,
      }),
    }),

    updateUser: builder.mutation({
      query: ({ userId, userModifyData }) => ({
        url: `/auth/usersInfo/${userId}`,
        method: "PUT",
        body: userModifyData,
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
    getAllPayment: builder.query({
      query: () => "/payments",
    }),

    getAllPosts: builder.query({
      query: ({ page, limit }) => `/posts?page=${page}&limit=${limit}`,
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
      ],
    }),

    dislikePost: builder.mutation({
      query: ({ postId, userId }) => ({
        url: `posts/${postId}/dislike`,
        method: "POST",
        body: { userId, postId },
      }),
      invalidatesTags: (result, error, { postId }) => [
        { type: "Post", id: postId },
      ],
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
      query: (userId: string) => `/payments/user/${userId}`,
    }),
    getUserById: builder.query({
      query: (userId) => `/auth/usersId/${userId}`,
    }),

    getPostByUserId: builder.query({
      query: (userId) => `/posts/user/${userId}`,
    }),
    getPostByPostId: builder.query({
      query: (id) => `/posts/${id}`,
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
  useAddUserMutation,
  useUpdateUserMutation,
  useGetUserEmailQuery,
  useGetAllUserQuery,
  useUpdateUserByIdMutation,
  useRegisterUserMutation,
  // useRefreshTokenMutation,
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
  useGetAllPaymentQuery,
  useCreatePaymentMutation,
  useGetPaymentByUserIdQuery,
  useFollowUserMutation,
} = baseApi;
