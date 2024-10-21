"use client";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  useDislikePostMutation,
  useGetCommentsByPostIdQuery,
  useGetPostByPostIdQuery,
  useLikePostMutation,
  usePostCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useAddViewToPostMutation,
  useReplyCommentMutation,
  useReplyCommentByCIDQuery,
} from "@/Redux/api/baseApi";
import Swal from "sweetalert2";
import { TComment, TLoginUser } from "@/types";
import Link from "next/link";
import { GrFormView } from "react-icons/gr";
import { useRouter } from "next/navigation";

type TPostDetailsParams = {
  postDetails: string;
};

const PostDetails = ({ params }: { params: TPostDetailsParams }) => {
  const router = useRouter();
  const postId = params.postDetails;

  const token = localStorage.getItem("accessToken");
  let userId = null;
  let name = null;

  if (token) {
    const decodedToken = jwtDecode<TLoginUser>(token);
    userId = decodedToken._id;
    name = decodedToken.name;
  } else {
    router.push("/login");
  }

  const {
    data: post,
    error,
    isLoading,
    refetch,
  } = useGetPostByPostIdQuery(postId, { skip: !postId });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useGetCommentsByPostIdQuery(postId, { skip: !postId });

  const [addViewToPost] = useAddViewToPostMutation();
  const [replyComment] = useReplyCommentMutation();

  const [commentText, setCommentText] = useState("");
  const [editCommentId, setEditCommentId] = useState<string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState("");
  const [postComment, { isLoading: isPosting }] = usePostCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const [likePost] = useLikePostMutation();
  const [dislikePost] = useDislikePostMutation();

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    const newComment = {
      userId,
      userIdP: userId,
      name,
      postId,
      comment: commentText,
    };
    try {
      await postComment(newComment).unwrap();
      setCommentText("");
      Swal.fire("Comment posted successfully");
      refetchComments();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editedCommentText.trim()) return;
    try {
      await updateComment({ commentId, comment: editedCommentText }).unwrap();
      setEditCommentId(null);
      setEditedCommentText("");
      Swal.fire("Comment updated successfully");
      refetchComments();
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteComment(commentId).unwrap();
      Swal.fire("Comment deleted successfully");
      refetchComments();
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  const handleLikePost = async () => {
    try {
      await likePost({ postId, userId }).unwrap();
      setIsLiked(true);
      setIsDisliked(false);
      Swal.fire("Liked");
      refetch();
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleDislikePost = async () => {
    try {
      await dislikePost({ postId, userId }).unwrap();
      setIsDisliked(true);
      setIsLiked(false);
      Swal.fire("Disliked");
      refetch();
    } catch (error) {
      console.error("Failed to dislike post:", error);
    }
  };

  // view portion
  useEffect(() => {
    if (userId && postId) {
      // Call the addViewToPost mutation when the component mounts
      addViewToPost({ postId, userId })
        .unwrap()
        .then(() => console.log("View added successfully"))
        .catch((error) => console.error("Failed to add view:", error));
    }
  }, [userId, postId, addViewToPost]);

  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(
    null
  );
  const [replyingCommentId, setReplyingCommentId] = useState<string | null>(
    null
  );

  const [replyText, setReplyText] = useState("");
  const { data: replies, refetch: refetchReplies } =
    useReplyCommentByCIDQuery(replyingCommentId);

  console.log("repliesCommentId", replyingCommentId);
  console.log("replies", replies);
  const handleReplyClick = (commentId: string) => {
    setReplyingToCommentId(
      commentId === replyingToCommentId ? null : commentId
    );
  };

  // const handleReplyChange = (e) => {
  //   setReplyText(e.target.value); // Update the reply text
  // };
  const handleSubmitReply = async (commentId: string) => {
    const replyData = {
      userId,
      userIdP: userId,
      name,
      postId,
      commentId,
      commentIdP: commentId,
      repliesComment: replyText,
    };
    try {
      await replyComment(replyData).unwrap();
      setReplyText(""); // Clear the input after submission
      setReplyingToCommentId(null);
      refetchReplies();
    } catch (error) {
      console.error("Failed to post comment:", error);
    }

    // Swal.fire(`Reply submitted for comment ID: ${commentId},${replyText}`);
    // setReplyText(""); // Clear the input after submission
    // setReplyingToCommentId(null); // Close the input box after submission
  };

  const [showReplies, setShowReplies] = useState(false);
  console.log(showReplies);
  const handleShowReplies = (commentId: string) => {
    setReplyingCommentId(commentId);
    setShowReplies(true);
    // Swal.fire(`Reply submitted for comment ID: ${commentId} `);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post details</div>;

  return (
    <div className="container mx-auto mt-10 pb-28">
      {post ? (
        <div className="max-w-2xl mx-auto bg-[#B7B7B7]  border rounded-lg shadow-md p-5">
          <div className="flex items-center mb-4">
            <img
              className="h-10 w-10 rounded-full"
              src={
                post.userIdP.profileImage ||
                "https://png.pngtree.com/png-vector/20230304/ourmid/pngtree-male-avator-icon-vector-png-image_6631112.png"
              }
              alt={`${post.name}'s profile`}
            />
            <div className="ml-3">
              <Link href={`/profileView/${post.userId}`}>
                <h2 className="text-lg font-semibold text-blue-700">
                  {post.name}
                </h2>
              </Link>
              <p className="text-black">
                {post.category} | {post.type}
              </p>
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div
            className="mb-4 text-gray-800 py-5"
            dangerouslySetInnerHTML={{ __html: post.post }}
          />

          <img
            src={post.images}
            alt="Post"
            className="w-full h-60 object-cover mb-4 rounded-md"
          />

          <div className="mb-2 flex gap-2 text-black">
            <h1 className="font-semibold">{post.likes?.length} Upvote </h1>
            <h1 className="font-semibold">{post.dislikes?.length} Downvote </h1>
            <h1 className="font-semibold flex justify-center align-middle">
              <span>
                <GrFormView className="  h-8 w-8" />
              </span>
              <span>{post.views?.length || 0}</span>
            </h1>
          </div>

          <div className="flex gap-5 mb-4">
            <button
              className={`${
                isLiked ? "bg-green-500" : "bg-gray-400"
              } text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300`}
              onClick={handleLikePost}
            >
              {isLiked ? "Upvoted" : "Upvote "}
            </button>
            <button
              className={`${
                isDisliked ? "bg-red-600" : "bg-red-500"
              } text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-300`}
              onClick={handleDislikePost}
            >
              {isDisliked ? "Downvoted" : "Downvote"}
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-4 ">
            <h2 className="text-xl font-semibold mb-2 text-black">Comments</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Type your comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="input input-bordered input-info w-full bg-white text-black"
              />
              <button
                className="btn btn-primary"
                onClick={handlePostComment}
                disabled={isPosting}
              >
                {isPosting ? "Posting..." : "Post Comment"}
              </button>
            </div>
            {isCommentsLoading ? (
              <div>Loading comments...</div>
            ) : commentsError ? (
              <div>Error loading comments</div>
            ) : (
              <div>
                {comments && comments.length > 0 ? (
                  comments.map((comment: TComment) => (
                    <div key={comment._id} className="mb-2">
                      {editCommentId === comment._id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedCommentText}
                            onChange={(e) =>
                              setEditedCommentText(e.target.value)
                            }
                            placeholder="Write your reply"
                            className="input input-bordered input-sm w-full input-info bg-white text-black"
                          />
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleUpdateComment(comment._id)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              setEditCommentId(null);
                              setEditedCommentText("");
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p>
                              <span className="text-blue-500 pr-2">
                                {comment.userIdP.name}:
                              </span>
                              <span className="text-black">
                                {" "}
                                {comment.comment}
                              </span>
                            </p>
                            {/*  Replies portion */}
                            <div className="pl-12">
                              <span>
                                <button
                                  onClick={() => handleReplyClick(comment._id)}
                                >
                                  {replyingToCommentId === comment._id ? (
                                    <button className="text-blue-700">
                                      Cancel
                                    </button>
                                  ) : (
                                    <button className="text-blue-700">
                                      Reply
                                    </button>
                                  )}
                                </button>
                                {replyingToCommentId === comment._id && (
                                  <div>
                                    <input
                                      type="text"
                                      value={replyText}
                                      onChange={(e) =>
                                        setReplyText(e.target.value)
                                      }
                                      placeholder="Type your reply..."
                                      className="input input-bordered input-sm input-info bg-white text-black"
                                    />
                                    <button
                                      onClick={() =>
                                        handleSubmitReply(comment._id)
                                      }
                                      className="btn btn-sm btn-primary ml-2"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                )}
                              </span>
                              {/*  Replies portion */}
                              <span>
                                <button
                                  className="pl-5"
                                  onClick={() => handleShowReplies(comment._id)}
                                >
                                  {/* {showReplies ? "Hide" : "Show All"} */}
                                  {replyingCommentId === comment._id ? (
                                    ""
                                  ) : (
                                    <button className="text-blue-700">
                                      Show Replies
                                    </button>
                                  )}
                                </button>
                                {replyingCommentId === comment._id && (
                                  <>
                                    {replies && replies.length > 0 ? (
                                      replies.map((reply: TComment) => (
                                        <p
                                          key={reply._id}
                                          className="pl-4 text-black"
                                        >
                                          <span className="text-blue-700">
                                            Replied:{" "}
                                            <span className="px-2">
                                              {reply.name}:
                                            </span>
                                          </span>
                                          {reply.repliesComment}
                                        </p>
                                      ))
                                    ) : (
                                      <p className="pl-4 text-black">
                                        No replies yet
                                      </p>
                                    )}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>
                          {comment.userId === userId && (
                            <div className="flex gap-2">
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => {
                                  setEditCommentId(comment._id);
                                  setEditedCommentText(comment.comment);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => handleDeleteComment(comment._id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div>No comments yet</div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>No post found</div>
      )}
    </div>
  );
};

export default PostDetails;
