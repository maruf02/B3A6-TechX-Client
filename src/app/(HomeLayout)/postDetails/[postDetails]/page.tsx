"use client";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  useDislikePostMutation,
  useGetCommentsByPostIdQuery,
  useGetPostByPostIdQuery,
  useLikePostMutation,
  usePostCommentMutation,
  useUpdateCommentMutation, // New import for updating a comment
  useDeleteCommentMutation, // New import for deleting a comment
} from "@/Redux/api/baseApi";
import Swal from "sweetalert2";

const PostDetails = ({ params }) => {
  const postId = params.postDetails;

  // Decode access token to get user info
  const token = localStorage.getItem("accessToken");
  let userId = null;
  let name = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken._id;
    name = decodedToken.name;
  }

  // Fetch post details
  const {
    data: post,
    error,
    isLoading,
    refetch, // Destructure refetch function
  } = useGetPostByPostIdQuery(postId, { skip: !postId });

  const {
    data: comments,
    isLoading: isCommentsLoading,
    error: commentsError,
    refetch: refetchComments,
  } = useGetCommentsByPostIdQuery(postId, { skip: !postId });

  const [commentText, setCommentText] = useState("");
  const [editCommentId, setEditCommentId] = useState(null); // State to track which comment is being edited
  const [editedCommentText, setEditedCommentText] = useState(""); // State to hold the edited comment text
  const [postComment, { isLoading: isPosting }] = usePostCommentMutation();
  const [updateComment] = useUpdateCommentMutation(); // Mutation hook for updating a comment
  const [deleteComment] = useDeleteCommentMutation(); // Mutation hook for deleting a comment

  const [likePost] = useLikePostMutation(); // Mutation hook for liking a post
  const [dislikePost] = useDislikePostMutation(); // Mutation hook for disliking a post

  // State to track if the post is liked or disliked
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  // Handle posting comment
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

  // Handle updating comment
  const handleUpdateComment = async (commentId) => {
    if (!editedCommentText.trim()) return;
    try {
      await updateComment({ commentId, comment: editedCommentText }).unwrap();
      setEditCommentId(null); // Reset the edit state
      setEditedCommentText(""); // Reset edited comment text
      Swal.fire("Comment updated successfully");
      refetchComments(); // Refetch comments
    } catch (error) {
      console.error("Failed to update comment:", error);
    }
  };

  // Handle soft delete comment
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId).unwrap();
      Swal.fire("Comment deleted successfully");
      refetchComments(); // Refetch comments
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // Handle like post
  const handleLikePost = async () => {
    try {
      await likePost({ postId, userId }).unwrap();
      setIsLiked(true); // Set the post as liked
      setIsDisliked(false); // Remove dislike if it was previously disliked
      Swal.fire("Liked");
      refetch(); // Refetch post data after liking
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  // Handle dislike post
  const handleDislikePost = async () => {
    try {
      await dislikePost({ postId, userId }).unwrap();
      setIsDisliked(true); // Set the post as disliked
      setIsLiked(false); // Remove like if it was previously liked
      Swal.fire("Disliked");
      refetch(); // Refetch post data after disliking
    } catch (error) {
      console.error("Failed to dislike post:", error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading post details</div>;

  return (
    <div className="container mx-auto">
      {post ? (
        <div className="max-w-2xl mx-auto bg-white border rounded-lg shadow-md p-5">
          <div className="flex items-center mb-4">
            <img
              className="h-10 w-10 rounded-full"
              src="https://via.placeholder.com/150"
              alt={`${post.name}'s profile`}
            />
            <div className="ml-3">
              <h2 className="text-lg font-semibold">{post.name}</h2>
              <p className="text-gray-500">
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

          <div className="mb-2 flex gap-2">
            <h1 className="font-semibold">{post.likes?.length} Likes</h1>
            <h1 className="font-semibold">{post.dislikes?.length} Dislikes</h1>
          </div>

          <div className="flex gap-5 mb-4">
            <button
              className={`${
                isLiked ? "bg-green-500" : "bg-gray-400"
              } text-white font-semibold py-2 px-4 rounded hover:bg-green-600 transition duration-300`}
              onClick={handleLikePost}
            >
              {isLiked ? "Liked" : "Like"}
            </button>
            <button
              className={`${
                isDisliked ? "bg-red-600" : "bg-red-500"
              } text-white font-semibold py-2 px-4 rounded hover:bg-red-700 transition duration-300`}
              onClick={handleDislikePost}
            >
              {isDisliked ? "Disliked" : "Dislike"}
            </button>
          </div>

          {/* Comments Section */}
          <div className="mt-4">
            <h2 className="text-xl font-semibold mb-2">Comments</h2>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Type your comment"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="input input-bordered input-info w-full bg-white"
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
                  comments.map((comment) => (
                    <div key={comment._id} className="mb-2">
                      {editCommentId === comment._id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editedCommentText}
                            onChange={(e) =>
                              setEditedCommentText(e.target.value)
                            }
                            className="input input-bordered w-full"
                          />
                          <button
                            className="btn btn-primary"
                            onClick={() => handleUpdateComment(comment._id)}
                          >
                            Update
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setEditCommentId(null); // Cancel edit
                              setEditedCommentText(""); // Clear text
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <p>
                            <span className="text-red-400">
                              {comment.userIdP.name}
                            </span>
                            {comment.comment}
                          </p>
                          {comment.userId === userId && (
                            <div className="flex gap-2">
                              <button
                                className="btn btn-secondary"
                                onClick={() => {
                                  setEditCommentId(comment._id); // Set comment to edit
                                  setEditedCommentText(comment.comment); // Set current text to edit
                                }}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-danger"
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
