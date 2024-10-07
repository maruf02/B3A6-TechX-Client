"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  useFollowUserMutation,
  useGetAllPostsQuery,
  useGetPaymentByUserIdQuery,
} from "@/Redux/api/baseApi";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import HomePostCreate from "./HomePostCreate";
import Swal from "sweetalert2";
import { verifyPayment } from "../Payments/Isverify";
import { useRouter } from "next/navigation";
import { message } from "antd";

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const router = useRouter();
  const { data: fetchedPosts, isFetching, isError } = useGetAllPostsQuery(page);
  const [followUser] = useFollowUserMutation();
  const [followedUsers, setFollowedUsers] = useState<string[]>([]);

  useEffect(() => {
    if (fetchedPosts && fetchedPosts.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
      if (fetchedPosts.length < 10) setHasMore(false);
    }
  }, [fetchedPosts]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isFetching || !hasMore) return;

    if (observer.current) observer.current.disconnect();

    const callback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(callback);
    if (lastPostElementRef.current) {
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [isFetching, hasMore]);

  const token = localStorage.getItem("accessToken");
  const userId = token ? jwtDecode(token)._id : null;

  const { data: payments } = useGetPaymentByUserIdQuery(userId || "", {
    skip: !userId,
  });

  const payment = payments?.data || [];

  useEffect(() => {
    let filtered = posts;

    if (searchTerm) {
      filtered = filtered.filter((post) =>
        post.post.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((post) => post.category === selectedCategory);
    }

    // Sort by most likes
    if (sortOption === "mostLikes") {
      filtered = [...filtered].sort(
        (a: any, b: any) => (b.likes?.length || 0) - (a.likes?.length || 0)
      );
    }

    setFilteredPosts(filtered);
  }, [searchTerm, posts, selectedCategory, sortOption]);

  const handleReset = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setSortOption("");
    setFilteredPosts(posts);
  };
  const isVerified = verifyPayment(payment.endTime);
  const handlePremium = (post: any) => {
    const postUserID = post.userId;
    const myId = userId;
    // console.log("postUserID", postUserID.profileImage);
    console.log("myId", myId);

    if (post.type === "Premium") {
      if (postUserID !== myId) {
        // router.push("/");
        Swal.fire("this is not my post");
        const isVerified = verifyPayment(payment.endTime);
        if (isVerified === "No") {
          Swal.fire({
            title: "Premium Content",
            text: "This is premium content. Please Pay to your profile into payment option.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Proceed to Pay",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/profile/user");
            }
          });
        } else {
          router.push(`/postDetails/${post._id}`);
        }
      } else {
        Swal.fire("this is my post");
        router.push(`/postDetails/${post._id}`);
      }
    } else {
      router.push(`/postDetails/${post._id}`);
    }

    // ******************************
  };

  const handlefollow = async (post: any) => {
    const postUserID = post.userId;
    const myUserId = userId;

    if (!myUserId) {
      message.error("You need to be logged in to follow a user.");
      return;
    }
    console.log("myUserId", myUserId);
    try {
      const response = await followUser({
        userId: postUserID,
        followerId: myUserId,
      }).unwrap();

      message.success("Successfully followed the user!");
      setFollowedUsers((prevFollowedUsers) => [
        ...prevFollowedUsers,
        postUserID,
      ]);

      // refetchUserData();
    } catch (error) {
      message.error("Failed to follow the user.");
    }
  };

  return (
    <div className="mx-auto my-2 max-w-3xl mt-5">
      <div>
        <HomePostCreate />
      </div>
      {/* Search Input Field */}

      <div className="flex gap-5 w-full">
        <div className="mb-4 flex justify-between">
          <input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full mr-2"
          />
        </div>
        {/* Category Dropdown */}
        <div className="mb-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input input-bordered w-full"
          >
            <option value="">All Categories</option>
            <option value="Web">Web</option>
            <option value="Software">Software</option>
            <option value="Engineering">Engineering</option>
            <option value="AI">AI</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="mb-4">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="input input-bordered w-full"
          >
            <option value="">Sort By</option>
            <option value="mostLikes">Most Likes</option>
          </select>
        </div>
        <button onClick={handleReset} className="btn btn-secondary ml-2">
          Reset
        </button>
      </div>

      {/* Display posts */}
      {filteredPosts.map((post: any, index: number) => (
        <div
          key={`${post._id}-${index}`}
          className="card card-compact bg-gray-500 w-full shadow-xl mb-4"
        >
          <div className="flex justify-between">
            <div className="flex items-center mb-4 p-4">
              <img
                className="h-10 w-10 rounded-full"
                src={
                  post.userIdP.profileImage || "https://via.placeholder.com/150"
                }
                alt="User"
              />
              <div className="ml-3">
                <Link href={`/profileView/${post.userId}`}>
                  <h2 className="text-lg font-semibold">{post.name}</h2>
                </Link>
                <p className="">
                  {post.category} | {post.type}
                </p>
              </div>
            </div>
            <div className="card-actions justify-end items-center mr-5">
              <button
                onClick={() => handlefollow(post)}
                className="btn btn-primary"
                disabled={followedUsers.includes(post.userId)}
              >
                {followedUsers.includes(post.userId) ? "Followed" : "Follow"}
              </button>
            </div>
          </div>
          <div className="px-4">
            <div
              className="mb-4 text-gray-800 py-5"
              dangerouslySetInnerHTML={{ __html: post.post }}
            />
          </div>
          {post.images && (
            <figure className="w-full">
              <img
                src={post.images || "https://via.placeholder.com/600"}
                alt="Post Image"
                className="w-full h-64 object-cover"
              />
            </figure>
          )}
          <div className="card-body">
            <div className="mb-2 flex gap-2 text-xl">
              <h1 className="font-semibold">{post.likes?.length} Likes</h1>
              <h1 className="font-semibold">
                {post.dislikes?.length || 0} Dislikes
              </h1>
            </div>
            {/* <Link href={`/postDetails/${post._id}`}> */}
            <div className="card-actions justify-end">
              <button
                onClick={() => handlePremium(post)}
                className="btn btn-primary"
              >
                See Details
              </button>
            </div>
            {/* </Link> */}
          </div>
        </div>
      ))}

      {/* Loading Spinner */}
      {isFetching && (
        <div className="flex justify-center items-center py-4">
          <div className="spinner-border text-blue-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      <div ref={lastPostElementRef} />

      {!hasMore && <p className="text-center text-gray-500">No more posts</p>}
    </div>
  );
};

export default HomePage;
