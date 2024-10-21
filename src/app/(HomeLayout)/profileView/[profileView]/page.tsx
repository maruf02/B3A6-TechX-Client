"use client";
import React, { useState } from "react";
import { message, Segmented } from "antd";
import { jwtDecode } from "jwt-decode";
import {
  useFollowUserMutation,
  useGetPaymentByUserIdQuery,
  useGetUserByIdQuery,
} from "@/Redux/api/baseApi";
import { verifyPayment } from "@/components/Payments/Isverify";
import ProfilePost from "@/components/ProfilePost/ProfilePost";
import ProfileViewProfile from "@/components/ProfileViewProfile/ProfileViewProfile";

import { VscVerifiedFilled } from "react-icons/vsc";
import { TLoginUser } from "@/types";
type TPostDetailsParams = {
  profileView: string;
};
const ProfileViewPage = ({ params }: { params: TPostDetailsParams }) => {
  const [selectedOption, setSelectedOption] = useState<string>("Post");
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const userId = params.profileView;
  console.log("userId", userId);
  const {
    data: userData,
    error,
    isLoading,
    refetch: refetchUserData,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  const [followUser] = useFollowUserMutation();

  const { data: payments } = useGetPaymentByUserIdQuery(userId || "", {
    skip: !userId,
  });

  const isVerify = verifyPayment(payments?.data?.endTime);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  const token = localStorage.getItem("accessToken");
  let myUserId = null;

  if (token) {
    const decodedToken = jwtDecode<TLoginUser>(token);
    myUserId = decodedToken._id;
  }

  const handleFollow = async () => {
    if (!myUserId) {
      message.error("You need to be logged in to follow a user.");
      return;
    }
    try {
      await followUser({
        userId: userId,
        followerId: myUserId,
      }).unwrap();

      message.success("Successfully followed the user!");

      refetchUserData();

      setIsFollowing(true);
    } catch {
      message.error("Failed to follow the user.");
    }
  };

  const renderContent = () => {
    switch (selectedOption) {
      case "Post":
        return <ProfilePost userId={userId} />;
      case "Profile":
        return <ProfileViewProfile userId={userId} />;
      // case "Followers":
      //   return <ProfileFollowers userId={userId} />;
      // case "Following":
      //   return <ProfileFollowing userId={userId} />;
      default:
        return <ProfilePost userId={userId} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-[7000px] mt-2 bg-[#705C53] ">
      <div className="w-full h-full min-h-screen  ">
        {/* cover image */}
        <div className="w-full h-96  rounded-2xl  ">
          <img
            src={
              userData?.data?.coverImage ||
              "https://images.pexels.com/photos/751005/pexels-photo-751005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
            alt=""
            className="w-full h-full rounded-2xl"
          />
        </div>
        {/* profile image */}
        <div className="w-60 h-60 rounded-2xl   relative -top-28 left-10">
          <img
            src={
              userData?.data?.profileImage ||
              "https://images.pexels.com/photos/751005/pexels-photo-751005.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
            }
            alt=""
            className="w-full h-full rounded-2xl"
          />
        </div>

        {/* different option */}
        <div className="w-full lg:w-4/12 h-28  relative lg:left-[24%] -top-24 lg:-top-56">
          <div className="flex justify-between">
            <div className="flex text-4xl font-bold pb-4 text-blue-700 uppercase  h-1/2">
              {userData?.data?.name}{" "}
              <span>
                {isVerify === "yes" ? (
                  <>
                    <VscVerifiedFilled className="text-blue-700" />
                  </>
                ) : (
                  " "
                )}
              </span>
            </div>
            <div>
              <button onClick={handleFollow} className="btn btn-sm btn-primary">
                {isFollowing ? "Followed" : "Follow"}
              </button>
            </div>
          </div>
          <div className="  text-center md:text-left h-1/2">
            <Segmented<string>
              options={["Post", "Profile"]}
              value={selectedOption}
              onChange={(value) => setSelectedOption(value)}
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row w-full h-screen   relative lg:-top-40">
          <div className="w-full   p-4">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileViewPage;
