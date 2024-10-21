"use client";
import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Space, Spin } from "antd";
import dynamic from "next/dynamic"; // Import dynamic from Next.js
import "react-quill/dist/quill.snow.css";
import {
  useCreatePostMutation,
  useGetPostByUserIdQuery,
} from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import { TLoginUser } from "@/types";
import ShowPost from "./ShowPost";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const MyPost = () => {
  const [editorContent, setEditorContent] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [createPost] = useCreatePostMutation();
  const [userId, setUserId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Use useEffect to run client-side code
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode<TLoginUser>(token);
      setUserId(decodedToken._id);
    }
  }, []);

  const { refetch } = useGetPostByUserIdQuery(userId, {
    skip: !userId,
  });

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

  const getUserDataFromToken = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode<TLoginUser>(token);
      return {
        userId: decodedToken._id,
        name: decodedToken.name,
        email: decodedToken.email,
      };
    }
    return null;
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

  const validateFields = () => {
    if (!editorContent.trim()) {
      Swal.fire("Editor content is required!");
      return false;
    }
    if (!category) {
      Swal.fire("Please select a category!");
      return false;
    }
    if (!type) {
      Swal.fire("Please select a type!");
      return false;
    }
    if (!file) {
      alert("Please upload an image!");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    const userData = getUserDataFromToken();
    if (!userData) {
      console.error("User is not authenticated");
      return;
    }

    if (!validateFields()) {
      return;
    }

    setLoading(true);

    let imageUrl = "";
    if (file) {
      imageUrl = await uploadImageToCloudinary();
    }

    const postData = {
      userId: userData.userId,
      userIdP: userData.userId,
      name: userData.name,
      email: userData.email,
      post: editorContent,
      category: category,
      type: type || "Free",
      images: imageUrl || "",
      likes: [],
      comment: [],
    };

    try {
      const result = await createPost(postData).unwrap();
      console.log("Post created successfully", result);
      Swal.fire("Post created successfully");

      refetch();
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error("Failed to create post:", error);
      setLoading(false);
    }
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    handleSubmit();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div className="w-full h-fit   bg-[#705C53]">
      <div className="w-2/4 mx-auto mb-4">
        <Button
          type="primary"
          onClick={showModal}
          className="w-full btn-lg text-4xl"
        >
          Create a New Blog
        </Button>
      </div>

      <Modal
        title="Create New Post"
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
            <ReactQuill
              theme="snow"
              value={editorContent}
              onChange={handleEditorChange}
              className="bg-white border rounded-md min-h-32 w-full"
              placeholder="Write something about yourself..."
            />

            <div className="flex gap-5 border w-full h-16 mt-2">
              <div className="flex gap-1 items-center">
                <h1>Select Category</h1>
                <Space wrap>
                  <Select
                    defaultValue="Select"
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

              <div className="flex gap-1 items-center">
                <h1>Select Type</h1>
                <Space wrap>
                  <Select
                    defaultValue="Select"
                    style={{ width: 120 }}
                    onChange={handleTypeChange}
                    options={[
                      { value: "Free", label: "Free" },
                      { value: "Premium", label: "Premium" },
                    ]}
                  />
                </Space>
              </div>

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
      <div>
        <ShowPost />
      </div>
    </div>
  );
};

export default MyPost;
