"use client";
import React, { useState, useEffect } from "react";
import {
  useGetUserByIdQuery,
  useUpdateUserByIdMutation,
} from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";
import { uploadImageToCloudinary } from "./UploadImageToCloudinary";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const MyProfile = () => {
  const token = localStorage.getItem("accessToken");
  let userId = null;

  if (token) {
    const decodedToken: any = jwtDecode(token);
    userId = decodedToken._id;
  }

  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useGetUserByIdQuery(userId, { skip: !userId });
  const [updateUserById] = useUpdateUserByIdMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: {
      name: "",
      email: userData?.data?.email || "",
      phone: "",
    },
  });

  useEffect(() => {
    if (userData) {
      setValue("name", userData.data.name);
      setValue("phone", userData.data.phone);
    }
  }, [userData, setValue]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleImageUpload = async () => {
    const profileImageUrl = profileImageFile
      ? await uploadImageToCloudinary(profileImageFile)
      : userData?.data?.profileImage; // Use existing image if none is uploaded
    const coverImageUrl = coverImageFile
      ? await uploadImageToCloudinary(coverImageFile)
      : userData?.data?.coverImage; // Use existing image if none is uploaded
    return { profileImageUrl, coverImageUrl };
  };

  const onSubmit = async (data: any) => {
    const { profileImageUrl, coverImageUrl } = await handleImageUpload();

    const newUserData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      profileImage: profileImageUrl,
      coverImage: coverImageUrl,
    };

    console.log("Updated User Data:", newUserData);
    // Perform the update
    await updateUserById({ id: userId, updatedUser: newUserData }).unwrap();
    refetch();
    closeModal();
    Swal.fire("updated"); // Close the modal after the update
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  return (
    <div className="mx-auto">
      <div className="card card-compact text-white bg-gray-400 max-w-2xl shadow-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title">
            {userData?.data?.name || "Name not available"}
          </h2>
          <h2 className="card-title">
            {userData?.data?.email || "Email not available"}
          </h2>
          <h2 className="card-title">
            {userData?.data?.phone || "Phone not available"}
          </h2>
          <img
            src={
              userData?.data?.profileImage || "https://via.placeholder.com/150"
            }
            alt="Profile"
            className="w-32 h-32 rounded-full"
          />
          <img
            src={
              userData?.data?.coverImage ||
              "https://via.placeholder.com/300x100"
            }
            alt="Cover"
            className="w-full h-32 object-cover mt-4"
          />
        </div>
        <button
          onClick={openModal}
          className="w-full h-10 my-5 bg-primary rounded-lg"
        >
          Update
        </button>
      </div>

      {/* Simple Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="text-black">
              <div>
                <label>Name</label>
                <input
                  type="text"
                  {...register("name", { required: true })}
                  className="input input-bordered max-w-xl mb-4 bg-white text-black"
                />
              </div>
              <div>
                <label>Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="input input-bordered max-w-xl mb-4 bg-white text-black"
                  readOnly
                />
              </div>
              <div>
                <label>Phone</label>
                <input
                  type="text"
                  {...register("phone", { required: true })}
                  className="input input-bordered max-w-xl mb-4 bg-white text-black"
                />
              </div>
              <div>
                <label>Profile Image</label>
                <input
                  type="file"
                  onChange={(e) => setProfileImageFile(e.target.files[0])}
                />
              </div>
              <div className="mt-2">
                <label>Cover Image</label>
                <input
                  type="file"
                  onChange={(e) => setCoverImageFile(e.target.files[0])}
                />
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={closeModal}
                  className="mr-4 px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
