"use client";
import { useState } from "react";
import { Segmented } from "antd";
import MyPost from "@/components/MyPost/MyPost";
import Profile from "@/components/Profile";
import Analytics from "@/components/Analytics/Analytics";
import Payments from "@/components/Payments/Payments";
import Followers from "@/components/Followers/Followers";
import Following from "@/components/Following/Following";

import { jwtDecode } from "jwt-decode";
import ShowPost from "@/components/MyPost/ShowPost";

const UserProfilePage = () => {
  // State to track the selected option
  const [selectedOption, setSelectedOption] = useState<string>("Post");
  const token = localStorage.getItem("accessToken");
  const userName = token ? jwtDecode(token).name : null;
  // Function to render content based on selected option
  const renderContent = () => {
    switch (selectedOption) {
      case "Post":
        return (
          <div>
            <MyPost />
          </div>
        );
      case "Profile":
        return (
          <div>
            <ShowPost />
          </div>
        );
      case "Analytics":
        return (
          <div>
            <Analytics />
          </div>
        );
      case "Payments":
        return (
          <div>
            <Payments />
          </div>
        );
      case "Followers":
        return (
          <div>
            <Followers />
          </div>
        );
      case "Following":
        return (
          <div>
            <Following />
          </div>
        );
      default:
        return (
          <div>
            <MyPost />
          </div>
        );
    }
  };

  return (
    <div>
      <div className="w-full h-full min-h-screen border border-2 border-red-600 ">
        {/* cover image */}
        <div className="w-full h-96 border border-2 border-green-600 ">
          <img
            src="https://images.pexels.com/photos/751005/pexels-photo-751005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            className="w-full h-full"
          />
        </div>
        {/* profile image */}
        <div className="w-60 h-60 rounded-2xl border border-2 border-blue-600 relative -top-28 left-10">
          <img
            src="https://images.pexels.com/photos/751005/pexels-photo-751005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            alt=""
            className="w-full h-full"
          />
        </div>
        {/* different option */}
        <div className="w-full lg:w-4/12 h-28 border border-2 border-green-600 relative lg:left-[18%] -top-24 lg:-top-56">
          <div className="text-4xl font-bold px-10 border border-2 border-blue-600 h-1/2">
            {userName}
          </div>
          <div className="border border-2 border-blue-600 h-1/2">
            <Segmented<string>
              options={[
                "Post",
                "Profile",
                "Analytics",
                "Payments",
                "Followers",
                "Following",
              ]}
              value={selectedOption}
              onChange={(value) => setSelectedOption(value)} // Update state on change
            />
          </div>
        </div>
        {/* main box */}
        <div className="flex flex-col lg:flex-row w-full h-screen border border-2 border-green-600 relative lg:-top-40 ">
          <div className="w-full border border-2 border-blue-600 p-4">
            {/* Render content dynamically based on selected option */}
            {renderContent()}
          </div>
        </div>
        {/* main box */}
      </div>
    </div>
  );
};

export default UserProfilePage;
