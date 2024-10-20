"use client";
import {
  useGetAllPostsMainQuery,
  useGetTotalDisLikesMainQuery,
  useGetTotalLikesMainQuery,
} from "@/Redux/api/baseApi";
import React from "react";

const OverviewSummary = () => {
  const { data: posts = [] } = useGetAllPostsMainQuery(undefined);
  const { data: Likes = [] } = useGetTotalLikesMainQuery(undefined);
  const { data: DisLike = [] } = useGetTotalDisLikesMainQuery(undefined);
  return (
    <div className="flex justify-between mb-10">
      {/* total post */}
      <div>
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Total Post</h2>
            <h2 className="card-title">{posts.length}</h2>
          </div>
        </div>
      </div>
      {/* total post */}

      {/* total Likes */}
      <div>
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Total Likes</h2>
            <h2 className="card-title">{Likes.totalLikes}</h2>
          </div>
        </div>
      </div>
      {/* total Likes */}

      {/* total DisLikes */}
      <div>
        <div className="card bg-base-100 w-96 shadow-xl">
          <div className="card-body items-center text-center">
            <h2 className="card-title">Total Dislikes</h2>
            <h2 className="card-title">{DisLike.totalDislikes}</h2>
          </div>
        </div>
      </div>
      {/* total DisLikes */}
    </div>
  );
};

export default OverviewSummary;
