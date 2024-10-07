import { useGetUserByIdQuery } from "@/Redux/api/baseApi";
import { jwtDecode } from "jwt-decode";
import React from "react";

const Followers = () => {
  const token = localStorage.getItem("accessToken");
  let userId: string | null = null;

  if (token) {
    const decodedToken: any = jwtDecode(token);
    userId = decodedToken._id;
  }

  const {
    data: userData,
    error,
    isLoading,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });
  console.log("object", userData);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!userData) return <div>No user data found</div>;

  return (
    <div>
      <div>
        <h1>Total Followers: {userData.follower?.data?.length || 0}</h1>
      </div>
      <div>
        <h1>Total Following: {userData.following?.data?.length || 0}</h1>
      </div>
    </div>
  );
};

export default Followers;
