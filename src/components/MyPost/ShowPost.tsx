// src/components/ShowPost.tsx
import { useGetPostByUserIdQuery } from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import React from "react";

const ShowPost = () => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("accessToken"); // Get token from localStorage

  let userId = null;
  if (token) {
    const decodedToken: any = jwtDecode(token);
    userId = decodedToken._id;
  }

  // Use the userId to fetch post data only if userId is available
  const {
    data: posts,
    error,
    isLoading,
  } = useGetPostByUserIdQuery(userId, {
    skip: !userId, // Skip the query if userId is not available
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  if (!posts || posts.length === 0)
    return <div>No posts available for this user.</div>; // Handle case when no posts are found

  return (
    <div className="my-2">
      <div className="max-w-2xl mx-auto my-5 bg-white border rounded-lg shadow-md overflow-hidden">
        {posts.map((post) => (
          <div key={post._id} className="p-4 border-b last:border-b-0">
            {/* User Info */}
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <img
                  className="h-10 w-10 rounded-full"
                  src="https://via.placeholder.com/150"
                  alt={`${post.name}'s profile`}
                />
              </div>
              <div className="ml-3">
                <h2 className="text-lg font-semibold">
                  {post.name} {/* Display the author's name */}
                </h2>
                <p className="text-gray-500">
                  {post.category} | {post.type}
                </p>
              </div>
            </div>

            {/* Post Content (Quill.js content) */}
            <div
              className="mb-4 text-gray-800"
              dangerouslySetInnerHTML={{ __html: post.post }} // Use the HTML content saved from Quill.js
            />

            {/* Post Image */}
            <img
              src={post.images}
              alt="Post"
              className="w-full h-60 object-cover mb-4 rounded-md"
            />

            {/* Likes */}
            <div className="mb-2 flex gap-2">
              {/* Adjust to match your data structure */}
              <h1 className="font-semibold">{post.likes?.length} Likes</h1>
              <h1 className="font-semibold">
                {post.dislikes?.length} Dislikes
              </h1>
            </div>

            {/* Like Button */}
            <div className="flex gap-2">
              <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                Like
              </button>
              <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                Dislike
              </button>
              <Link href={`/postDetails/${post._id}`}>
                <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-300">
                  See all Comments
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowPost;
