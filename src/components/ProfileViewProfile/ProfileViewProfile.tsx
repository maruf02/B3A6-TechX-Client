"use client";

import { useGetUserByIdQuery } from "@/Redux/api/baseApi";
interface ProfilePostProps {
  userId: string;
}
const ProfileViewProfile: React.FC<ProfilePostProps> = ({ userId }) => {
  const {
    data: userData,
    error,
    isLoading,
  } = useGetUserByIdQuery(userId, { skip: !userId });
  console.log("object", userData?.data?.follower?.length);
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
          <h2 className="card-title">
            Total Followers: {userData?.data?.follower?.length || 0}
          </h2>
          <h1 className="card-title">
            Total Following: {userData?.data?.following?.length || 0}
          </h1>
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
      </div>
    </div>
  );
};

export default ProfileViewProfile;
