"use client";
import AllPosts from "@/components/Admin/AllPosts/AllPosts";
import AllUsers from "@/components/Admin/AllUsers/AllUsers";
import GraphSummary from "@/components/Admin/GraphSummary/GraphSummary";
import PaymentHistory from "@/components/Admin/PaymentHistory/PaymentHistory";
import { useGetUserByIdQuery } from "@/Redux/api/baseApi";
import { TLoginUser } from "@/types";
import { Segmented } from "antd";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

const AdminHomePage = () => {
  const [selectedOption, setSelectedOption] = useState<string>("Post");
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwtDecode<TLoginUser>(token);
      setUserId(decodedToken._id);
      setUserName(decodedToken.name);
    }
  }, []);
  // const token = localStorage.getItem("accessToken");
  // const userName = token ? jwtDecode<TLoginUser>(token).name : null;

  // let userId = null;
  // if (token) {
  //   const decodedToken = jwtDecode<TLoginUser>(token);
  //   userId = decodedToken._id;
  // }
  // console.log(userId);

  const {
    data: userData,
    error,
    isLoading,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });
  //   const userData = userDataa.data;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data</div>;

  const renderContent = () => {
    switch (selectedOption) {
      case "Post":
        return (
          <div>
            <AllPosts />
          </div>
        );
      case "Users":
        return (
          <div>
            <AllUsers />
          </div>
        );
      case "Payment":
        return (
          <div>
            <PaymentHistory />
          </div>
        );
      case "Summary":
        return (
          <div>
            <GraphSummary />
          </div>
        );

      default:
        return (
          <div>
            <AllPosts />
          </div>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="w-full h-full min-h-screen  ">
        {/* cover image */}
        <div className="w-full h-96  rounded-2xl">
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
            className="w-full h-full rounded-2xl "
          />
        </div>
        {/* different option */}
        <div className="w-full lg:w-4/12 h-28   relative lg:left-[24%] -top-24 lg:-top-56">
          <div className="text-4xl font-bold px-10   h-1/2">{userName}</div>
          <div className="  h-1/2">
            <Segmented<string>
              options={[
                "Post",
                "Users",
                "Payment",
                "Summary",
                // "Follow",
                // "Following",
              ]}
              value={selectedOption}
              onChange={(value) => setSelectedOption(value)}
            />
          </div>
        </div>
        {/* main box */}
        <div className="flex flex-col lg:flex-row w-full h-screen   relative lg:-top-40 ">
          <div className="w-full   p-4">{renderContent()}</div>
        </div>
        {/* main box */}
      </div>
    </div>
  );
};

export default AdminHomePage;
