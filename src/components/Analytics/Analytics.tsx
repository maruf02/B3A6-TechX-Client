"use client";
import { useGetAllPostsQuery } from "@/Redux/api/baseApi";
import React from "react";

const Analytics = () => {
  const { data: posts, error, isLoading } = useGetAllPostsQuery(undefined);
  console.log(posts);
  if (isLoading) {
    return <div>Loading posts...</div>; // Show a loading message while fetching
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>; // Show an error message if there's an error
  }

  return (
    <div>
      <h1>All Posts</h1>
      {posts && posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <h2>{post.name}</h2>{" "}
              {/* Adjust the field according to your post structure */}
              <p>{post.post}</p> {/* Adjust this as well */}
              {/* You can add more fields here based on your post structure */}
            </li>
          ))}
        </ul>
      ) : (
        <div>No posts available.</div>
      )}
    </div>
  );
};

export default Analytics;
