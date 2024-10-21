// "use client";
// import { useEffect, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import {
//   useDislikePostMutation,
//   useGetCommentsByPostIdQuery,
//   useGetPostByPostIdQuery,
//   useLikePostMutation,
//   usePostCommentMutation,
//   useUpdateCommentMutation,
//   useDeleteCommentMutation,
//   useAddViewToPostMutation,
// } from "@/Redux/api/baseApi";
// import Swal from "sweetalert2";
// import { TComment, TLoginUser } from "@/types";
// import Link from "next/link";
// import { GrFormView } from "react-icons/gr";
// import { useRouter } from "next/navigation";

// type TPostDetailsParams = {
//   postDetails: string;
// };

// const PostDetails = ({ params }: { params: TPostDetailsParams }) => {
//   const router = useRouter();
//   const postId = params.postDetails;

//   const token = localStorage.getItem("accessToken");
//   let userId = null;
//   let name = null;

//   if (token) {
//     const decodedToken = jwtDecode<TLoginUser>(token);
//     userId = decodedToken._id;
//     name = decodedToken.name;
//   } else {
//     router.push("/login");
//   }

//   const {
//     data: post,
//     error,
//     isLoading,
//     refetch,
//   } = useGetPostByPostIdQuery(postId, { skip: !postId });

//   const {
//     data: comments,
//     isLoading: isCommentsLoading,
//     error: commentsError,
//     refetch: refetchComments,
//   } = useGetCommentsByPostIdQuery(postId, { skip: !postId });

//   const [addViewToPost] = useAddViewToPostMutation();

//   const [commentText, setCommentText] = useState("");
//   const [editCommentId, setEditCommentId] = useState<string | null>(null);
//   const [editedCommentText, setEditedCommentText] = useState("");
//   const [postComment, { isLoading: isPosting }] = usePostCommentMutation();
//   const [updateComment] = useUpdateCommentMutation();
//   const [deleteComment] = useDeleteCommentMutation();

//   const [likePost] = useLikePostMutation();
//   const [dislikePost] = useDislikePostMutation();

//   const [isLiked, setIsLiked] = useState(false);
//   const [isDisliked, setIsDisliked] = useState(false);

//   const [isReplying, setIsReplying] = useState(false);
//   const [replyText, setReplyText] = useState("");

//   const handlePostComment = async () => {
//     if (!commentText.trim()) return;
//     const newComment = {
//       userId,
//       userIdP: userId,
//       name,
//       postId,
//       comment: commentText,
//     };
//     try {
//       await postComment(newComment).unwrap();
//       setCommentText("");
//       Swal.fire("Comment posted successfully");
//       refetchComments();
//     } catch (error) {
//       console.error("Failed to post comment:", error);
//     }
//   };

//   const handleUpdateComment = async (commentId: string) => {
//     if (!editedCommentText.trim()) return;
//     try {
//       await updateComment({ commentId, comment: editedCommentText }).unwrap();
//       setEditCommentId(null);
//       setEditedCommentText("");
//       Swal.fire("Comment updated successfully");
//       refetchComments();
//     } catch (error) {
//       console.error("Failed to update comment:", error);
//     }
//   };

//   const handleDeleteComment = async (commentId: string) => {
//     try {
//       await deleteComment(commentId).unwrap();
//       Swal.fire("Comment deleted successfully");
//       refetchComments();
//     } catch (error) {
//       console.error("Failed to delete comment:", error);
//     }
//   };

//   const handleLikePost = async () => {
//     try {
//       await likePost({ postId, userId }).unwrap();
//       setIsLiked(true);
//       setIsDisliked(false);
//       Swal.fire("Liked");
//       refetch();
//     } catch (error) {
//       console.error("Failed to like post:", error);
//     }
//   };

//   const handleDislikePost = async () => {
//     try {
//       await dislikePost({ postId, userId }).unwrap();
//       setIsDisliked(true);
//       setIsLiked(false);
//       Swal.fire("Disliked");
//       refetch();
//     } catch (error) {
//       console.error("Failed to dislike post:", error);
//     }
//   };

//   // view portion
//   useEffect(() => {
//     if (userId && postId) {
//       // Call the addViewToPost mutation when the component mounts
//       addViewToPost({ postId, userId })
//         .unwrap()
//         .then(() => console.log("View added successfully"))
//         .catch((error) => console.error("Failed to add view:", error));
//     }
//   }, [userId, postId, addViewToPost]);

//   const handleReplyClick = () => {
//     setIsReplying(!isReplying); // Toggle the input box
//   };

//   const handleReplyChange = (e) => {
//     setReplyText(e.target.value); // Update the reply text
//   };

//   const handleSubmitReply = () => {
//     // Handle the reply submission (e.g., send it to a server)
//     console.log("Reply submitted:", replyText);
//     setReplyText(""); // Clear the input after submission
//     setIsReplying(false); // Optionally close the input box
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error loading post details</div>;

//   return (
//     <div className="container mx-auto">
//       {post ? (
//         <div className="max-w-2xl mx-auto bg-white border rounded-lg shadow-md p-5">
//           <div className="flex items-center mb-4">
//             <img
//               className="h-10 w-10 rounded-full"
//               src={
//                 post.userIdP.profileImage ||
//                 "https://png.pngtree.com/png-vector/20230304/ourmid/pngtree-male-avator-icon-vector-png-image_6631112.png"
//               }
//               alt={`${post.name}'s profile`}
//             />
//             <div className="ml-3">
//               <Link href={`/profileView/${post.userId}`}>
//                 <h2 className="text-lg font-semibold text-blue-700">
//                   {post.name}
//                 </h2>
//               </Link>
//               <p className="text-gray-500">
//                 {post.category} | {post.type}
//               </p>
//             </div>
//           </div>

//           <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
//           <div
//             className="mb-4 text-gray-800 py-5"
//             dangerouslySetInnerHTML={{ __html: post.post }}
//           />

//           <img
//             src={post.images}
//             alt="Post"
//             className="w-full h-60 object-cover mb-4 rounded-md"
//           />

//           <div className="mb-2 flex gap-2">
//             <h1 className="font-semibold">{post.likes?.length} Upvote </h1>
//             <h1 className="font-semibold">{post.dislikes?.length} Downvote </h1>
//             <h1 className="font-semibold flex justify-center align-middle">
//               <span>
//                 <GrFormView className="  h-8 w-8" />
//               </span>
//               <span>{post.views?.length || 0}</span>
//             </h1>
//           </div>

//           <div className="flex gap-5 mb-4">
//             <button
//               className={`${
//                 isLiked ? "bg-green-500" : "bg-gray-400"
//               } text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300`}
//               onClick={handleLikePost}
//             >
//               {isLiked ? "Upvoted" : "Upvote "}
//             </button>
//             <button
//               className={`${
//                 isDisliked ? "bg-red-600" : "bg-red-500"
//               } text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-300`}
//               onClick={handleDislikePost}
//             >
//               {isDisliked ? "Downvoted" : "Downvote"}
//             </button>
//           </div>

//           {/* Comments Section */}
//           <div className="mt-4">
//             <h2 className="text-xl font-semibold mb-2">Comments</h2>
//             <div className="flex gap-2 mb-4">
//               <input
//                 type="text"
//                 placeholder="Type your comment"
//                 value={commentText}
//                 onChange={(e) => setCommentText(e.target.value)}
//                 className="input input-bordered input-info w-full bg-white"
//               />
//               <button
//                 className="btn btn-primary"
//                 onClick={handlePostComment}
//                 disabled={isPosting}
//               >
//                 {isPosting ? "Posting..." : "Post Comment"}
//               </button>
//             </div>
//             {isCommentsLoading ? (
//               <div>Loading comments...</div>
//             ) : commentsError ? (
//               <div>Error loading comments</div>
//             ) : (
//               <div>
//                 {comments && comments.length > 0 ? (
//                   comments.map((comment: TComment) => (
//                     <div key={comment._id} className="mb-2">
//                       {editCommentId === comment._id ? (
//                         <div className="flex gap-2">
//                           <input
//                             type="text"
//                             value={editedCommentText}
//                             onChange={(e) =>
//                               setEditedCommentText(e.target.value)
//                             }
//                             className="input input-bordered w-full"
//                           />
//                           <button
//                             className="btn btn-primary"
//                             onClick={() => handleUpdateComment(comment._id)}
//                           >
//                             Update
//                           </button>
//                           <button
//                             className="btn btn-secondary"
//                             onClick={() => {
//                               setEditCommentId(null);
//                               setEditedCommentText("");
//                             }}
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p>
//                               <span className="text-blue-500 pr-2">
//                                 {comment.userIdP.name}:
//                               </span>
//                               {comment.comment}{" "}
//                               <span>
//                                 <button onClick={handleReplyClick}>
//                                   {isReplying ? "Cancel" : "Reply"}
//                                 </button>
//                                 {isReplying && (
//                                   <div>
//                                     <input
//                                       type="text"
//                                       value={replyText}
//                                       onChange={handleReplyChange}
//                                       placeholder="Type your reply..."
//                                       className="bg-white text-black"
//                                     />
//                                     <button onClick={handleSubmitReply}>
//                                       Submit
//                                     </button>
//                                   </div>
//                                 )}
//                               </span>
//                             </p>
//                           </div>
//                           {comment.userId === userId && (
//                             <div className="flex gap-2">
//                               <button
//                                 className="btn btn-sm btn-secondary"
//                                 onClick={() => {
//                                   setEditCommentId(comment._id);
//                                   setEditedCommentText(comment.comment);
//                                 }}
//                               >
//                                 Edit
//                               </button>
//                               <button
//                                 className="btn btn-sm btn-danger"
//                                 onClick={() => handleDeleteComment(comment._id)}
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <div>No comments yet</div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       ) : (
//         <div>No post found</div>
//       )}
//     </div>
//   );
// };

// export default PostDetails;
