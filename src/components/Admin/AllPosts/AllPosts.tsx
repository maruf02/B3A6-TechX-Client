import {
  useGetAllPostsMainQuery,
  useDeletePostByIdMutation,
} from "@/Redux/api/baseApi";
import { message } from "antd";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const AllPosts = () => {
  const {
    data: posts,
    error,
    isLoading,
    refetch,
  } = useGetAllPostsMainQuery(undefined);
  const [deletePostById] = useDeletePostByIdMutation();
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);

  const handleDelete = async (postId: string) => {
    try {
      await deletePostById(postId).unwrap();
      message.success("Post deleted successfully!");
      refetch();
    } catch (error) {
      message.error("Failed to delete post.");
    }
  };

  useEffect(() => {
    let filtered = posts || [];

    if (searchTerm) {
      filtered = filtered.filter((post: any) =>
        post.post.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (post: any) => post.category === selectedCategory
      );
    }

    if (sortOption === "mostLikes") {
      filtered = [...filtered].sort(
        (a: any, b: any) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
    }

    setFilteredPosts(filtered);
  }, [posts, searchTerm, selectedCategory, sortOption]);

  // Reset filter options
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("");
    setFilteredPosts(posts || []);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading posts</div>;

  return (
    <div>
      <h1>All Posts</h1>

      {/* Search, Category, and Sorting */}
      <div className="flex gap-5 w-full mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full mr-2"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input input-bordered w-full"
        >
          <option value="">All Categories</option>
          <option value="Web">Web</option>
          <option value="Software">Software</option>
          <option value="Engineering">Engineering</option>
          <option value="AI">AI</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="input input-bordered w-full"
        >
          <option value="">Sort By</option>
          <option value="mostLikes">Most Likes</option>
        </select>

        <button onClick={handleReset} className="btn btn-secondary ml-2">
          Reset
        </button>
      </div>

      {/* Render filtered posts */}
      {filteredPosts.map((post: any) => (
        <div
          key={post._id}
          className="card card-compact bg-gray-500 w-full shadow-xl mb-4"
        >
          <div className="flex justify-between">
            <div className="flex items-center mb-4 p-4">
              <img
                className="h-10 w-10 rounded-full"
                src={
                  post.user?.profileImage || "https://via.placeholder.com/150"
                }
                alt="User"
              />
              <div className="ml-3">
                <Link href={`/profileView/${post.userId}`}>
                  <h2 className="text-lg font-semibold">{post.name}</h2>
                </Link>
                <p>{post.category}</p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(post._id)}
              className="btn btn-danger mt-5 mr-5"
            >
              Unpublish
            </button>
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
              <h1 className="font-semibold">{post.likes?.length || 0} Likes</h1>
              <h1 className="font-semibold">
                {post.dislikes?.length || 0} Dislikes
              </h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllPosts;
