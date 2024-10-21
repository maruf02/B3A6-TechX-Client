import {
  useGetAllPostsMainQuery,
  useDeletePostByIdMutation,
} from "@/Redux/api/baseApi";
import { TPost } from "@/types";
import { message } from "antd";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { GrFormView } from "react-icons/gr";

const AllPosts = () => {
  const {
    data: posts,
    error,
    isLoading,
    refetch,
  } = useGetAllPostsMainQuery(undefined);
  const [deletePostById] = useDeletePostByIdMutation();
  // const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const handleDelete = async (postId: string) => {
    try {
      await deletePostById(postId).unwrap();
      message.success("Post deleted successfully!");
      refetch();
    } catch {
      message.error("Failed to delete post.");
    }
  };

  useEffect(() => {
    let filtered = posts || [];

    if (searchTerm) {
      filtered = filtered.filter((post: TPost) =>
        post.post.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(
        (post: TPost) => post.category === selectedCategory
      );
    }

    if (sortOption === "mostLikes") {
      filtered = [...filtered].sort(
        (a: TPost, b: TPost) => (b.likes?.length || 0) - (a.likes?.length || 0)
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

  console.log("filteredPosts", filteredPosts);
  return (
    <div className="mx-auto my-2 max-w-3xl mt-5">
      <h1 className="text-black text-4xl text-center font-bold pb-10 underline">
        All Posts
      </h1>

      {/* Search, Category, and Sorting */}
      <div className="flex gap-5 w-full mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input input-bordered w-full mr-2 input-primary input-sm text-black bg-[#705C53]"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input input-bordered w-full input-primary input-sm text-black bg-[#705C53]"
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
          className="input input-bordered w-full input-primary input-sm text-black bg-[#705C53]"
        >
          <option value="">Sort By</option>
          <option value="mostLikes">Most Likes</option>
        </select>

        <button onClick={handleReset} className="btn btn-secondary ml-2 btn-sm">
          Reset
        </button>
      </div>

      {/* Render filtered posts */}
      {filteredPosts.map((post: TPost) => (
        <div
          key={post._id}
          className="card card-compact bg-[#B7B7B7] w-full shadow-xl mb-4"
        >
          <div className="flex justify-between">
            <div className="flex items-center mb-4 p-4">
              <img
                className="h-10 w-10 rounded-full"
                src={
                  post.userIdP.profileImage || "https://via.placeholder.com/150"
                }
                alt="User"
              />
              <div className="ml-3">
                <Link href={`/profileView/${post.userId}`}>
                  <h2 className="text-lg font-semibold text-blue-700 uppercase">
                    {post.name}
                  </h2>
                </Link>
                <p className="text-black">
                  {post.category} | {post.type}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(post._id)}
              className="btn btn-secondary btn-sm mt-5 mr-5"
            >
              Unpublish
            </button>
          </div>
          <div className="px-4">
            <div
              className="mb-4 text-black py-5"
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
          <div className="card-body text-black">
            <div className="mb-2 flex gap-2 text-xl">
              <h1 className="font-semibold">{post.likes?.length || 0} Likes</h1>
              <h1 className="font-semibold">
                {post.dislikes?.length || 0} Dislikes
              </h1>
              <h1 className="font-semibold flex justify-center align-middle">
                <span>
                  <GrFormView className="  h-8 w-8" />
                </span>
                <span>{post.views?.length || 0}</span>
              </h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllPosts;
