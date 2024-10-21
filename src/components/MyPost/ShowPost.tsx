"use client";
import {
  useGetPostByUserIdQuery,
  useUpdatePostByIdMutation,
  useDeletePostByIdMutation,
} from "@/Redux/api/baseApi";
import { TLoginUser, TPost } from "@/types";
import { Modal, Select, Space, Spin, message } from "antd";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic"; // Import dynamic from Next.js
import "react-quill/dist/quill.snow.css";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import { motion } from "framer-motion";
import { GrFormView } from "react-icons/gr";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const ShowPost = () => {
  const [open, setOpen] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  console.log(filteredPosts);
  // const token = localStorage.getItem("accessToken");

  const {
    data: posts,
    isLoading,
    refetch,
  } = useGetPostByUserIdQuery(userId, {
    skip: !userId,
  });
  // let userId = null;
  // if (token) {
  //   const decodedToken = jwtDecode<TLoginUser>(token);
  //   userId = decodedToken._id;
  // }
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode<TLoginUser>(token);
      setUserId(decodedToken._id);
    }
  }, []);

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

  console.log("userId", userId);
  const [updatePostById] = useUpdatePostByIdMutation();
  const [deletePostById] = useDeletePostByIdMutation();

  if (isLoading) return <div>Loading...</div>;

  if (!posts || posts.length === 0) {
    return (
      <div className="text-4xl text-center py-10">
        No posts available for this user.
      </div>
    );
  }

  // const reversedPosts = posts.slice().reverse();
  const reversedPosts = filteredPosts.slice().reverse();

  // Modal option
  const showModal = (post: TPost) => {
    setSelectedPostId(post._id);
    setEditorContent(post.post);
    setCategory(post.category);
    setType(post.type);
    setOpen(true);
  };

  const uploadImageToCloudinary = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "frontend_preset");

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dnsqmhk8i/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  const handleOk = async () => {
    setLoading(true);
    const previousImage = posts.find(
      (post: TPost) => post._id === selectedPostId
    )?.images;

    let imageUrl = "";
    if (file) {
      imageUrl = await uploadImageToCloudinary();
    }

    try {
      await updatePostById({
        postId: selectedPostId,
        updatePost: {
          post: editorContent,
          category,
          type,
          images: imageUrl || previousImage,
        },
      }).unwrap();
      message.success("Post updated successfully!");
      refetch();
      Swal.fire("Post updated successfully!");
    } catch {
      message.error("Failed to update post.");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleEditorChange = (content: string) => {
    setEditorContent(content);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleDelete = async (postId: string) => {
    try {
      await deletePostById(postId).unwrap();
      message.success("Post deleted successfully!");
      refetch();
    } catch {
      message.error("Failed to delete post.");
    }
  };

  const truncateContent = (content: string, wordLimit: number) => {
    const words = content.split(" ");
    if (words.length <= wordLimit) {
      return content;
    }
    return words.slice(0, wordLimit).join(" ") + "............";
  };

  const handleSeeMore = () => {
    Swal.fire(
      "For seeing full content with like, post, comment please hit the see details Button"
    );
  };

  // pdf generator
  // const generatePdf = () => {
  //   Swal.fire("pdf");
  // };
  // const generatePdf = (post: TPost) => {
  //   const doc = new jsPDF();
  //   doc.setFontSize(12);
  //   doc.text("Post Details", 20, 20);
  //   doc.text(`Title: ${post.name}`, 20, 30);
  //   doc.text(`Category: ${post.category}`, 20, 40);
  //   doc.text(`Type: ${post.type}`, 20, 50);
  //   doc.text("Content:", 20, 60);
  //   doc.text(post.post, 20, 70);

  //   if (post.images) {
  //     doc.addImage(post.images, "JPEG", 20, 80, 160, 90);
  //   }

  //   doc.save(`${post.name}.pdf`);
  // };

  const generatePdf = (post: TPost) => {
    const doc = new jsPDF();

    const convertHtmlToPlainText = (html: string) => {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = html;
      return tempElement.innerText || "";
    };

    doc.setFontSize(16);
    doc.text("Post Details", 20, 20);

    doc.setFontSize(14);
    doc.text(`Title: ${post.name}`, 20, 30);

    doc.setFontSize(12);
    doc.text(`Category: ${post.category}`, 20, 40);
    doc.text(`Type: ${post.type}`, 20, 50);

    doc.setFontSize(12);
    doc.text("Content:", 20, 60);

    const plainTextContent = convertHtmlToPlainText(post.post);
    const contentLines = doc.splitTextToSize(plainTextContent, 180);
    doc.text(contentLines, 20, 70);

    if (post.images) {
      const imageYPosition = 100 + 72;
      doc.addImage(post.images, "JPEG", 20, imageYPosition, 160, 90);
    }

    doc.setFontSize(10);
    doc.text(
      "Generated on: " + new Date().toLocaleString(),
      20,
      doc.internal.pageSize.height - 10
    );

    doc.save(`${post.name}.pdf`);
  };

  // Reset filter options
  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("");
    setFilteredPosts(posts || []);
  };

  return (
    <div className="mx-auto my-2 max-w-3xl mt-5">
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

        <button
          onClick={handleReset}
          className="btn btn-secondary ml-2   btn-sm"
        >
          Reset
        </button>
      </div>
      {reversedPosts.map((post: TPost) => (
        <motion.div
          key={post._id}
          className=" mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 2 }}
        >
          <div
            key={post._id}
            className="card card-compact bg-[#B7B7B7] w-full shadow-xl mb-4"
          >
            <div className="flex justify-between">
              <div className="flex items-center mb-4 p-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={
                    post.userIdP.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt="User"
                />
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-blue-700 uppercase">
                    {post.name}
                  </h2>
                  <p className="text-black">
                    {post.category} | {post.type}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-4">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => generatePdf(post)}
                >
                  pdf
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => showModal(post)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="px-4 py-5 text-black">
              <div
                // className="mb-4 text-gray-800 py-5"
                // dangerouslySetInnerHTML={{ __html: post.post }}
                dangerouslySetInnerHTML={{
                  __html: truncateContent(post.post, 50),
                }}
              />
              {post.post.split(" ").length > 50 && (
                <button
                  onClick={handleSeeMore}
                  className="text-blue-500 hover:underline ml-2"
                >
                  See More
                </button>
              )}
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
                <h1 className="font-semibold">{post.likes?.length} Upvote</h1>
                <h1 className="font-semibold">
                  {post.dislikes?.length || 0} Downvote
                </h1>
                <h1 className="font-semibold flex justify-center align-middle">
                  <span>
                    <GrFormView className="  h-8 w-8" />
                  </span>
                  <span>{post.views?.length || 0}</span>
                </h1>
              </div>
              <Link href={`/postDetails/${post._id}`}>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">See Details</button>
                </div>
              </Link>
            </div>

            {/* Modal for Editing Post */}
            <Modal
              title="Edit Post"
              open={open}
              onOk={handleOk}
              onCancel={handleCancel}
              okText="Submit"
              cancelText="Cancel"
              width={1000}
            >
              {loading ? (
                <div className="flex justify-center items-center">
                  <Spin size="large" />
                </div>
              ) : (
                <>
                  {/* Quill Editor */}
                  <ReactQuill
                    theme="snow"
                    value={editorContent}
                    onChange={handleEditorChange}
                    className="bg-white border rounded-md min-h-32 w-full"
                    placeholder="Write something about yourself..."
                  />

                  {/* Options and Upload */}
                  <div className="flex gap-5 border w-full h-16 mt-2">
                    {/* Category Select */}
                    <div className="flex gap-1 items-center">
                      <h1>Select Category</h1>
                      <Space wrap>
                        <Select
                          defaultValue={category}
                          style={{ width: 120 }}
                          onChange={handleCategoryChange}
                          options={[
                            { value: "Web", label: "Web" },
                            { value: "Software", label: "Software" },
                            { value: "Engineering", label: "Engineering" },
                            { value: "AI", label: "AI" },
                          ]}
                        />
                      </Space>
                    </div>

                    {/* Type Select */}
                    <div className="flex gap-1 items-center">
                      <h1>Select Type</h1>
                      <Space wrap>
                        <Select
                          defaultValue={type}
                          style={{ width: 120 }}
                          onChange={handleTypeChange}
                          options={[
                            { value: "Free", label: "Free" },
                            { value: "Premium", label: "Premium" },
                          ]}
                        />
                      </Space>
                    </div>

                    {/* <p>
                    abc:{" "}
                    {posts.find((post) => post._id === selectedPostId)?.images}
                  </p> */}
                    {/* File Upload */}
                    <div className="flex items-center">
                      <input
                        type="file"
                        className="file-input w-full max-w-xs items-center bg-transparent"
                        onChange={handleFileChange}
                      />
                    </div>
                  </div>
                </>
              )}
            </Modal>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShowPost;
