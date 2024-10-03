"use client";
import { useGetPostByUserIdQuery } from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

import React from "react";

const ShowPost = () => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("accessToken");

  let userId = null;
  if (token) {
    const decodedToken: any = jwtDecode(token);
    userId = decodedToken._id;
  }

  // Fetch posts by userId using RTK Query
  const {
    data: posts,
    error,
    isLoading,
  } = useGetPostByUserIdQuery(userId, {
    skip: !userId, // Skip query if userId is not available
  });
  console.log(posts);
  // Display loading or error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  // Handle case where no posts are available
  if (!posts || posts.length === 0) {
    return <div>No posts available for this user.</div>;
  }

  return (
    <div className="mx-auto my-2 max-w-3xl mt-5">
      {posts.map((post: any) => (
        <div
          key={post._id}
          className="card card-compact bg-gray-500 w-full shadow-xl mb-4"
        >
          <div className="flex items-center mb-4 p-4">
            <img
              className="h-10 w-10 rounded-full"
              src={post.userImage || "https://via.placeholder.com/150"}
              alt="User"
            />
            <div className="ml-3">
              <h2 className="text-lg font-semibold">{post.name}</h2>
              <p className=" ">
                {post.category} | {post.type}
              </p>
            </div>
          </div>
          <div className="px-4">
            {/* <h1 className="text-3xl font-bold mb-4">
              {post.title || "Untitled Post"}
            </h1> */}
            <div
              className="mb-4 text-gray-800 py-5"
              dangerouslySetInnerHTML={{ __html: post.post }}
            />
          </div>
          {post.images && (
            <figure className="w-full">
              <img
                src={post.images || "https://via.placeholder.com/600"}
                alt="Post Image"
                className="w-full h-64 object-cover"
              />
            </figure>
          )}
          <div className="card-body">
            <div className="mb-2 flex gap-2 text-xl">
              <h1 className="font-semibold">{post.likes?.length} Likes</h1>
              <h1 className="font-semibold">
                {post.dislikes?.length || 0} Dislikes
              </h1>
            </div>
            <Link href={`/postDetails/${post._id}`}>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">See Details</button>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowPost;
