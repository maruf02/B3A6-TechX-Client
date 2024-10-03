import React from "react";
import { useGetUserByIdQuery } from "@/Redux/api/baseApi"; // Import your RTK query
import { jwtDecode } from "jwt-decode";
// Make sure you import jwtDecode correctly

const MyProfile = () => {
  // Retrieve the token from local storage
  const token = localStorage.getItem("accessToken");

  let userId = null;
  if (token) {
    const decodedToken: any = jwtDecode(token);
    userId = decodedToken._id; // Get the userId from the decoded token
  }
  console.log(userId);
  // Use RTK Query to fetch user data based on userId
  const {
    data: userData,
    error,
    isLoading,
  } = useGetUserByIdQuery(userId, {
    skip: !userId, // Skip the query if userId is not available
  });
  //   const userData = userDataa.data;
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
            {userData?.data?.payment || "Payment details not available"}
          </h2>
          <img
            src={userData?.profileImage || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-32 h-32 rounded-full"
          />
          <img
            src={userData?.coverImage || "https://via.placeholder.com/300x100"}
            alt="Cover"
            className="w-full h-32 object-cover mt-4"
          />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
