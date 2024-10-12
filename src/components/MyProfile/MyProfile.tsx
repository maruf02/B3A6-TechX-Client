"use client";
import React, { useState, useEffect } from "react";
import {
  useGetUserByIdQuery,
  useLoginUserMutation,
  useUpdatePasswordMutation,
  useUpdateUserByIdMutation,
} from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";
import { uploadImageToCloudinary } from "./UploadImageToCloudinary";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { TLoginUser, TUser } from "@/types";

interface ErrorResponse {
  data?: {
    message?: string;
  };
}
const MyProfile = () => {
  // const token = localStorage.getItem("accessToken");
  // let userId = null;

  // if (token) {
  //   const decodedToken = jwtDecode<TLoginUser>(token);
  //   userId = decodedToken._id;
  // }
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode<TLoginUser>(token);
      setUserId(decodedToken._id);
    }
  }, []);

  const {
    data: userData,
    error,
    isLoading,
    refetch,
  } = useGetUserByIdQuery(userId, { skip: !userId });
  const [updateUserById] = useUpdateUserByIdMutation();
  const [loginUser] = useLoginUserMutation();
  const [updatePassword] = useUpdatePasswordMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isFollowerModalOpen, setFollowerModalOpen] = useState(false);
  const [isFollowingModalOpen, setFollowingModalOpen] = useState(false);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);
  const [isConfirmPasswordModalOpen, setConfirmPasswordModalOpen] =
    useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  console.log("userData", userData);
  const { register, handleSubmit, setValue } = useForm<TUser>({
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
      : userData?.data?.profileImage;
    const coverImageUrl = coverImageFile
      ? await uploadImageToCloudinary(coverImageFile)
      : userData?.data?.coverImage;
    return { profileImageUrl, coverImageUrl };
  };

  const onSubmit = async (data: TUser) => {
    const { profileImageUrl, coverImageUrl } = await handleImageUpload();

    const newUserData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      profileImage: profileImageUrl,
      coverImage: coverImageUrl,
    };

    console.log("Updated User Data:", newUserData);

    await updateUserById({ id: userId, updatedUser: newUserData }).unwrap();
    refetch();
    closeModal();
    Swal.fire("updated");
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  const openFollowerModal = () => setFollowerModalOpen(true);
  const closeFollowerModal = () => setFollowerModalOpen(false);
  const openFollowingModal = () => setFollowingModalOpen(true);
  const closeFollowingModal = () => setFollowingModalOpen(false);

  // password portiom
  const openPasswordModal = () => setPasswordModalOpen(true);
  const closePasswordModal = () => setPasswordModalOpen(false);
  const openConfirmPasswordModal = () => setConfirmPasswordModalOpen(true);
  const closeConfirmPasswordModal = () => setConfirmPasswordModalOpen(false);

  const handlePasswordCheck = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    const userInfo = { email, password };
    console.log("userInfo", userInfo);

    try {
      const res = await loginUser(userInfo).unwrap();
      if (res.success) {
        Swal.fire("password match");
        closePasswordModal();
        openConfirmPasswordModal();
      }
      console.log("res", res);
    } catch (err) {
      const error = err as ErrorResponse;
      if (error.data?.message) {
        // console.error("Login error:", err.data.message);
        Swal.fire("Error", error.data.message as string, "error");
      } else {
        // console.error("Login error:", err);
        Swal.fire("Error", "An unexpected error occurred.", "error");
      }
    }

    // closePasswordModal();
    // openConfirmPasswordModal();
  };

  const handlePassChange = async (event: React.FormEvent) => {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const email = form.email.value;
    const password = form.password.value;
    const userInfo = { email, password };
    console.log("userInfo", userInfo);
    try {
      const res = await updatePassword(userInfo).unwrap();
      if (res.success) {
        Swal.fire("Success", "Password updated successfully!", "success");
        setConfirmPasswordModalOpen(false);
      }
    } catch {
      Swal.fire("Error", "Failed to update password.", "error");
    }
  };

  return (
    <div className="mx-auto">
      <div className="card card-compact text-white bg-gray-400 max-w-2xl shadow-xl mx-auto">
        <div className="card-body">
          <h2 className="card-title">
            Name: {userData?.data?.name || "Name not available"}
          </h2>
          <h2 className="card-title">
            Email: {userData?.data?.email || "Email not available"}
          </h2>
          <h2 className="card-title">
            Phone: {userData?.data?.phone || "Phone not available"}
          </h2>
          <h2 className="card-title">
            Total Followers: {userData?.data?.follower?.length || 0}
            <button className="btn btn-sm" onClick={openFollowerModal}>
              see all followers
            </button>
          </h2>
          <h1 className="card-title">
            Total Following: {userData?.data?.following?.length || 0}
            <button className="btn btn-sm" onClick={openFollowingModal}>
              see all following
            </button>
          </h1>
          <h1 className="card-title">
            Change Password:{" "}
            <button onClick={openPasswordModal} className="btn btn-sm">
              Change password
            </button>
          </h1>
          {/* change password modal option */}
          {isPasswordModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <form onSubmit={handlePasswordCheck}>
                <div className="bg-black rounded-lg p-6 w-96">
                  <h2 className="text-2xl font-bold mb-4">
                    Enter New Password
                  </h2>
                  <div>
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      readOnly
                      defaultValue={userData?.data?.email}
                      className="input input-bordered max-w-xl mb-4 bg-white text-black ml-20"
                    />
                  </div>
                  <div>
                    <label>Current Password:</label>
                    <input
                      type="password"
                      name="password"
                      className="input input-bordered max-w-xl mb-4 bg-white text-black ml-2"
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={closePasswordModal}
                      className="mr-4 px-4 py-2 bg-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      // onClick={() => {
                      //   closePasswordModal();
                      //   openConfirmPasswordModal(); // Open second modal
                      // }}
                      // onClick={handlePasswordCheck}
                      className="px-4 py-2 bg-primary text-white rounded-lg"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {isConfirmPasswordModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <form onSubmit={handlePassChange}>
                <div className="bg-black rounded-lg p-6 w-96">
                  <h2 className="text-2xl font-bold mb-4">Update Password</h2>
                  <div>
                    <label>Email</label>
                    <input
                      type="text"
                      name="email"
                      readOnly
                      defaultValue={userData?.data?.email}
                      className="input input-bordered max-w-xl mb-4 bg-white text-black ml-20"
                    />
                  </div>
                  <div>
                    <label>New Password:</label>
                    <input
                      type="newPassword"
                      name="password"
                      className="input input-bordered max-w-xl mb-4 bg-white text-black ml-2"
                      required
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      onClick={closeConfirmPasswordModal}
                      className="mr-4 px-4 py-2 bg-gray-300 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg">
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
          {/* change password modal option */}
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
                  // onChange={(e) => setProfileImageFile(e.target.files[0])}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setProfileImageFile(file);
                  }}
                />
              </div>
              <div className="mt-2">
                <label>Cover Image</label>
                <input
                  type="file"
                  // onChange={(e) => setCoverImageFile(e.target.files[0])}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setCoverImageFile(file);
                  }}
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

      {isFollowerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Followers</h2>
            <div className="space-y-4">
              {userData?.data?.followerP?.length ? (
                userData.data.followerP.map((follower: TUser) => (
                  <div
                    key={follower._id}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={
                        follower.profileImage ||
                        "https://via.placeholder.com/50"
                      }
                      alt="Follower Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <span>{follower.name || "Unknown"}</span>
                  </div>
                ))
              ) : (
                <p>No followers found.</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeFollowerModal}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isFollowingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-2xl font-bold mb-4">Following</h2>
            <div className="space-y-4">
              {userData?.data?.followingP?.length ? (
                userData.data.followingP.map((following: TUser) => (
                  <div
                    key={following._id}
                    className="flex items-center space-x-4"
                  >
                    <img
                      src={
                        following.profileImage ||
                        "https://via.placeholder.com/50"
                      }
                      alt="Following Profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <span>{following.name || "Unknown"}</span>
                  </div>
                ))
              ) : (
                <p>No following found.</p>
              )}
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeFollowingModal}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
