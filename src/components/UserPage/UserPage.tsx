"use client";
import { useEffect, useState } from "react";
import { Segmented } from "antd";

import Payments from "@/components/Payments/Payments";
import Followers from "@/components/Followers/Followers";
import { jwtDecode } from "jwt-decode";
import MyProfile from "@/components/MyProfile/MyProfile";
import {
  useGetPaymentByUserIdQuery,
  useGetUserByIdQuery,
} from "@/Redux/api/baseApi";
import { TLoginUser } from "@/types";
import MyPost from "../MyPost/MyPost";
import { verifyPayment } from "../Payments/Isverify";
import { VscVerifiedFilled } from "react-icons/vsc";
import { Analytics } from "../Analytics/Analytics";
// import HomePostCreate from "../HomePage/HomePostCreate";

const UserProfilePage = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Post");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        const decodedToken = jwtDecode<TLoginUser>(token);
        setUserId(decodedToken._id);
        setUserName(decodedToken.name);
      }
    }
  }, []);

  const {
    data: userData,
    error,
    isLoading,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });
  const { data: payments } = useGetPaymentByUserIdQuery(userId || "", {
    skip: !userId,
  });

  const isVerify = verifyPayment(payments?.data?.endTime);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  const renderContent = () => {
    switch (selectedOption) {
      case "Post":
        return <MyPost />;
      // return <HomePostCreate />;
      // return <MyProfile />;
      case "Profile":
        return <MyProfile />;
      case "Analytics":
        return <Analytics />;
      case "Payments":
        return <Payments />;
      case "Follow":
        return <Followers />;
      default:
        return <MyPost />;
      // return <MyProfile />;
      // return <HomePostCreate />;
    }
  };
  if (typeof window === "undefined") return;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="w-full h-full min-h-screen">
        {/* cover image */}
        <div className="w-full h-96 rounded-2xl">
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
        <div className="w-60 h-60 rounded-2xl relative -top-28 left-10">
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
        <div className="w-full lg:w-4/12 h-28 relative lg:left-[24%] -top-24 lg:-top-56">
          <div className="flex text-4xl font-bold px-10 h-1/2">
            {userName}
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
          <div className="h-1/2">
            <Segmented<string>
              options={["Post", "Profile", "Analytics", "Payments"]}
              value={selectedOption}
              onChange={(value) => setSelectedOption(value)}
            />
          </div>
        </div>
        {/* main box */}
        <div className="flex flex-col lg:flex-row w-full h-screen relative lg:-top-40">
          <div className="w-full p-4">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
