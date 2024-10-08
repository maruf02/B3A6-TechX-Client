"use client";
import { useGetPostByUserIdQuery } from "@/Redux/api/baseApi";
import { TPost } from "@/types";

import Link from "next/link";
interface ProfilePostProps {
  userId: string; // or 'string | null' if it can also be null
}
const ShowPost: React.FC<ProfilePostProps> = ({ userId }) => {
  const { data: posts, isLoading } = useGetPostByUserIdQuery(userId, {
    skip: !userId,
  });

  if (isLoading) return <div>Loading...</div>;

  if (!posts || posts.length === 0) {
    return (
      <div className="text-4xl text-center py-10">
        No posts available for this user.
      </div>
    );
  }

  const reversedPosts = posts.slice().reverse();

  return (
    <div className="mx-auto my-2 max-w-3xl mt-5">
      {reversedPosts.map((post: TPost) => (
        <div
          key={post._id}
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
                <h2 className="text-lg font-semibold">{post.name}</h2>
                <p className="">
                  {post.category} | {post.type}
                </p>
              </div>
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
            <Link href={`/postDetails/${post._id}`}>
              <div className="card-actions justify-end">
                <button className="btn btn-primary">See Details</button>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ShowPost;
