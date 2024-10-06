import React, { useState } from "react";
import { Button, Modal, Select, Space, Spin } from "antd"; // Import Spin for loading spinner
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Quill editor styles
import {
  useCreatePostMutation,
  useGetPostByUserIdQuery,
} from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const HomePostCreate = () => {
  const [editorContent, setEditorContent] = useState(""); // Editor content state
  const [category, setCategory] = useState(""); // Category state
  const [type, setType] = useState(""); // Type state
  const [file, setFile] = useState<File | null>(null); // File state
  const [loading, setLoading] = useState(false); // Loading state for button
  const [createPost] = useCreatePostMutation();

  // Fetch user posts
  const token = localStorage.getItem("accessToken");
  const userId = token ? jwtDecode(token)._id : null;

  const { refetch } = useGetPostByUserIdQuery(userId, {
    skip: !userId, // Skip the query if userId is not available
  });

  // Handler for content changes in Quill editor
  const handleEditorChange = (content: string) => {
    setEditorContent(content); // Save content in state
  };

  // Handler for category selection
  const handleCategoryChange = (value: string) => {
    setCategory(value); // Update category state
  };

  // Handler for type selection
  const handleTypeChange = (value: string) => {
    setType(value); // Update type state
  };

  // Handler for file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]); // Save the selected file
    }
  };

  // Function to get the userId and name from the token stored in localStorage
  const getUserDataFromToken = () => {
    const token = localStorage.getItem("accessToken"); // Get token from localStorage
    if (token) {
      const decodedToken: any = jwtDecode(token);
      return {
        userId: decodedToken._id,
        name: decodedToken.name,
        email: decodedToken.email,
      };
    }
    return null;
  };

  // Function to handle image upload to Cloudinary
  const uploadImageToCloudinary = async () => {
    if (!file) return null; // No file selected

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "frontend_preset"); // Your Cloudinary upload preset

    try {
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dnsqmhk8i/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url; // Return the image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return null; // Return null if upload fails
    }
  };

  // Validation function
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

  // Handler for submit button
  const handleSubmit = async () => {
    const userData = getUserDataFromToken(); // Get userId and name from token
    if (!userData) {
      console.error("User is not authenticated");
      return;
    }

    // Validate form fields
    if (!validateFields()) {
      return; // Stop the submission if validation fails
    }

    setLoading(true); // Start loading

    let imageUrl = ""; // Placeholder for image URL
    if (file) {
      imageUrl = await uploadImageToCloudinary(); // Upload image if selected
    }

    const postData = {
      userId: userData.userId,
      userIdP: userData.userId, // Set the userId dynamically
      name: userData.name, // Set the name dynamically
      email: userData.email, // Set the email dynamically
      post: editorContent,
      category: category,
      type: type || "Free",
      images: imageUrl || "", // Use uploaded image URL or a default value
      likes: [],
      comment: [],
    };

    try {
      const result = await createPost(postData).unwrap();
      console.log("Post created successfully", result);
      Swal.fire("Post created successfully");

      // Refetch the posts after creation
      refetch(); // Refetch the posts

      setLoading(false); // Stop loading
      setOpen(false); // Close modal after submitting
    } catch (error) {
      console.error("Failed to create post:", error);
      setLoading(false); // Stop loading
    }
  };

  // Modal option
  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true); // Open modal
  };

  const handleOk = () => {
    handleSubmit(); // Trigger submit on modal confirm
  };

  const handleCancel = () => {
    setOpen(false); // Close modal
  };

  return (
    <div>
      {/* <h1 className="text-4xl underline text-center py-5">
        Create your Blog Post
      </h1> */}

      {/* Button to open modal */}
      <div className="w-2/4 mx-auto mb-4">
        <Button
          type="primary"
          onClick={showModal}
          className="w-full btn-lg text-4xl"
        >
          Create a New Blog
        </Button>
      </div>

      {/* Modal section */}
      <Modal
        title="Create New Post"
        open={open}
        onOk={handleOk} // Trigger handleOk on modal confirm
        onCancel={handleCancel} // Handle modal close
        okText="Submit"
        cancelText="Cancel"
        width={1000} // Adjust modal width as needed
      >
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" /> {/* Show spinner during loading */}
          </div>
        ) : (
          <>
            {/* Quill Editor */}
            <ReactQuill
              theme="snow" // Using the 'snow' theme
              value={editorContent} // Binding content to state
              onChange={handleEditorChange} // Handling changes
              className="bg-white border rounded-md min-h-32 w-full" // Styling for the editor
              placeholder="Write something about yourself..." // Placeholder
            />

            {/* Options and Upload */}
            <div className="flex gap-5 border w-full h-16 mt-2">
              {/* Category Select */}
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

              {/* Type Select */}
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

              {/* Upload Portion */}
              <div className="flex items-center">
                <input
                  type="file"
                  className="file-input w-full max-w-xs items-center bg-transparent"
                  onChange={handleFileChange} // Handle file change
                />
              </div>
            </div>
          </>
        )}
      </Modal>

      {/* for showing all post */}
    </div>
  );
};

export default HomePostCreate;
