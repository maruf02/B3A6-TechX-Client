"use client";
import {
  useGetPostByUserIdQuery,
  useUpdatePostByIdMutation,
  useDeletePostByIdMutation,
} from "@/Redux/api/baseApi";
import { Modal, Select, Space, Spin, message } from "antd";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";
import React, { useState } from "react";
import ReactQuill from "react-quill";
import Swal from "sweetalert2";

const ShowPost = () => {
  const [open, setOpen] = useState(false);
  const [editorContent, setEditorContent] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("accessToken");

  let userId = null;
  if (token) {
    const decodedToken: any = jwtDecode(token);
    userId = decodedToken._id;
  }

  const {
    data: posts,
    isLoading,
    refetch,
  } = useGetPostByUserIdQuery(userId, {
    skip: !userId,
  });

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

  const reversedPosts = posts.slice().reverse();

  // Modal option
  const showModal = (post: any) => {
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
      (post) => post._id === selectedPostId
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
    } catch (error) {
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
    } catch (error) {
      message.error("Failed to delete post.");
    }
  };

  return (
    <div className="mx-auto my-2 max-w-3xl mt-5">
      {reversedPosts.map((post: any) => (
        <div
          key={post._id}
          className="card card-compact bg-gray-500 w-full shadow-xl mb-4"
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
                <h2 className="text-lg font-semibold">{post.name}</h2>
                <p className="">
                  {post.category} | {post.type}
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4">
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
      ))}
    </div>
  );
};

export default ShowPost;
