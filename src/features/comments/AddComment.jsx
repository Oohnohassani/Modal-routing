import { useState } from "react";
import { addComment } from "../../server/postsApi";

function AddComment({ post, setComments, prevComments }) {
  // State 🧠
  const [newComment, setNewComment] = useState("");

  // Handler 🖱️
  async function handleAddComment() {
    // 0. Create comment
    const comment = {
      id: post.id,
      postId: post.id,
      username: post.username,
      userImg: post.userImg,
      comment: newComment,
      createdAt: "8 minutes ago",
      verified: post.verified,
    };

    // 1. Update the local comments state 🧠
    setComments((curr) => [...curr, comment]);

    // 2. Update the server
    try {
      await addComment(comment);
    } catch (err) {
      setComments(prevComments.current);
    }
  }

  return (
    <div className="flex w-full items-center justify-between gap-2 border-t border-neutral-700 px-2 py-3">
      <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
        <img src={post.userImg} alt="" />
      </div>
      <div className="flex-1">
        <input
          className="w-full border-0 px-2 py-1 text-sm text-gray-500 outline-0 placeholder:text-sm"
          type="text"
          placeholder="Add a comment..."
          name="comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
      </div>
      <button
        className="cursor-pointer text-sm font-semibold text-gray-500"
        onClick={handleAddComment}
      >
        Post
      </button>
    </div>
  );
}

export default AddComment;
