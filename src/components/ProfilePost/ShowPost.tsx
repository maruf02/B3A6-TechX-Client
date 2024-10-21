"use client";
import { useGetPostByUserIdQuery } from "@/Redux/api/baseApi";
import { TPost } from "@/types";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

import Link from "next/link";
import { GrFormView } from "react-icons/gr";
interface ProfilePostProps {
  userId: string;
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

  const generatePdf = (post: TPost) => {
    const doc = new jsPDF();

    const convertHtmlToPlainText = (html: string) => {
      const tempElement = document.createElement("div");
      tempElement.innerHTML = html;
      return tempElement.innerText || "";
    };

    doc.setFontSize(16);
    doc.text("Post Details", 20, 20);

    doc.setFontSize(14);
    doc.text(`Title: ${post.name}`, 20, 30);

    doc.setFontSize(12);
    doc.text(`Category: ${post.category}`, 20, 40);
    doc.text(`Type: ${post.type}`, 20, 50);

    doc.setFontSize(12);
    doc.text("Content:", 20, 60);

    const plainTextContent = convertHtmlToPlainText(post.post);
    const contentLines = doc.splitTextToSize(plainTextContent, 180);
    doc.text(contentLines, 20, 70);

    if (post.images) {
      const imageYPosition = 100 + 72;
      doc.addImage(post.images, "JPEG", 20, imageYPosition, 160, 90);
    }

    doc.setFontSize(10);
    doc.text(
      "Generated on: " + new Date().toLocaleString(),
      20,
      doc.internal.pageSize.height - 10
    );

    doc.save(`${post.name}.pdf`);
  };

  return (
    <div className="mx-auto my-2 max-w-3xl mt-5   min-h-screen">
      {reversedPosts.map((post: TPost) => (
        <motion.div
          key={post._id}
          className=" mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 2 }}
        >
          <div
            key={post._id}
            className="card card-compact bg-[#B7B7B7]  w-full shadow-xl mb-4"
          >
            <div className="flex justify-between">
              <div className="flex items-center mb-4 p-4">
                <img
                  className="h-10 w-10 rounded-full"
                  src={
                    post.userIdP.profileImage ||
                    "https://via.placeholder.com/150"
                  }
                  alt="User"
                />
                <div className="ml-3">
                  <h2 className="text-lg font-semibold text-blue-700">
                    {post.name}
                  </h2>
                  <p className="text-black">
                    {post.category} | {post.type}
                  </p>
                </div>
              </div>
              <div className="p-5">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => generatePdf(post)}
                >
                  pdf
                </button>
              </div>
            </div>
            <div className="px-4">
              <div
                className="mb-4 text-black py-5"
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
            <div className="card-body text-black">
              <div className="mb-2 flex gap-2 text-xl">
                <h1 className="font-semibold">{post.likes?.length} Upvote </h1>
                <h1 className="font-semibold">
                  {post.dislikes?.length || 0} Downvote
                </h1>
                <h1 className="font-semibold flex justify-center align-middle">
                  <span>
                    <GrFormView className="  h-8 w-8" />
                  </span>
                  <span>{post.views?.length || 0}</span>
                </h1>
              </div>
              <Link href={`/postDetails/${post._id}`}>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">See Details</button>
                </div>
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ShowPost;
