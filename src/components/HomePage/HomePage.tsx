"use client";
import React, { useState, useEffect, useRef } from "react";
import { useGetAllPostsQuery } from "@/Redux/api/baseApi"; // Replace with the correct import path
import Link from "next/link";

const HomePage = () => {
  const [page, setPage] = useState(1); // Initial page set to 1
  const [posts, setPosts] = useState<any[]>([]); // State to store all posts
  const [hasMore, setHasMore] = useState(true); // Keep track if there are more posts to load

  const { data: fetchedPosts, isFetching, isError } = useGetAllPostsQuery(page); // Fetch posts based on current page

  // Effect to append newly fetched posts to the existing posts
  useEffect(() => {
    if (fetchedPosts && fetchedPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]); // Append new posts to the list
      if (fetchedPosts.length < 10) setHasMore(false); // If fewer than 10 posts are fetched, stop loading
    }
  }, [fetchedPosts]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  // Effect to trigger the next page load when the last post comes into view
  useEffect(() => {
    if (isFetching || !hasMore) return; // Don't observe if fetching or no more posts

    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1); // Increment the page to load next posts
      }
    };

    observer.current = new IntersectionObserver(callback);
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isFetching, hasMore]);

  return (
    <div className="mx-auto my-2 max-w-3xl mt-5">
      {/* Display posts */}
      {posts.map((post: any, index: number) => (
        <div
          key={post._id}
          className="card card-compact bg-gray-500 w-full shadow-xl mb-4"
        >
          <div className="flex justify-between">
            <div className="flex items-center mb-4 p-4">
              <img
                className="h-10 w-10 rounded-full"
                src={post.userImage || "https://via.placeholder.com/150"}
                alt="User"
              />
              <div className="ml-3">
                <h2 className="text-lg font-semibold">{post.name}</h2>
                <p className="">
                  {post.category} | {post.type}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4">
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

      {/* Loading Spinner */}
      {isFetching && (
        <div className="flex justify-center items-center py-4">
          <div className="spinner-border text-blue-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Reference to the last post element */}
      <div ref={lastPostElementRef} />

      {/* No more posts message */}
      {!hasMore && <p className="text-center text-gray-500">No more posts</p>}
    </div>
  );
};

export default HomePage;
