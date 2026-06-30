import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { formatNumbers } from "../../utils/helpers";
import {
  LuHeart,
  LuMessageCircle, // comments
  LuBookmark, // bookmark
  LuSend,
} from "react-icons/lu";
import { updatePost } from "../../server/postsApi";

function PostStats({ id, post }) {
  // State 🧠
  const [isLiked, setIsLiked] = useState(true); // true or false
  const [numOfLikes, setNumOfLikes] = useState(12); // 0, 1 etc.
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [numOfBookmarks, setNumOfBookmarks] = useState(123);
  const [numOfComments, setNumOfComments] = useState(12);

  // Refs 🧊
  const prevLiked = useRef(null);
  const prevLikes = useRef(null);
  const prevBookmarked = useRef(null);
  const prevBookmarks = useRef(null);

  // Effect 🌀
  useEffect(
    function () {
      // Update post stats as soon it mounts
      setIsLiked(post?.postLiked);
      setNumOfLikes(post?.postLikes);
      setIsBookmarked(post?.postBookmarked);
      setNumOfBookmarks(post?.postBookmarks);
    },
    [post],
  );

  // Handlers 🖱️
  async function handleLike() {
    // Snapshot 📸
    prevLiked.current = isLiked;
    prevLikes.current = numOfLikes;

    // 0. Toggle like state
    const liked = !isLiked;
    setIsLiked(liked);

    // 1. Update the likes count
    const likes = isLiked ? numOfLikes - 1 : numOfLikes + 1;
    setNumOfLikes(likes);

    // 2. Update the server
    try {
      await updatePost(id || post.id, {
        postLikes: likes,
        postLiked: liked,
      });
    } catch (err) {
      // Rollback if there's an error
      setIsLiked(prevLiked.current);
      setNumOfLikes(prevLikes.current);
    }
  }

  async function handleBookmark() {
    // 0. Snapshot 📸
    prevBookmarks.current = numOfBookmarks;
    prevBookmarked.current = isBookmarked;

    // 1. Toggle the bookmarks state
    const bookmarked = !isBookmarked;
    setIsBookmarked(bookmarked);

    // 2. Update the bookmarks count
    const bookmarks = isBookmarked ? numOfBookmarks - 1 : numOfBookmarks + 1;
    setNumOfBookmarks(bookmarks);

    // 3. Update the server
    try {
      await updatePost(id || post.id, {
        postBookmarks: bookmarks,
        postBookmarked: bookmarked,
      });
    } catch (err) {
      // Rollback if there's an error
      //   setNumOfBookmarks(prevBookmarks.current);
    }
  }

  return (
    <div className="mt-2 flex w-full items-center justify-between gap-2 px-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={handleLike}
            className="flex items-center justify-center gap-1"
          >
            <span className="cursor-pointer">
              <LuHeart
                className={
                  isLiked ? "fill-red-400 stroke-red-400" : "stroke-gray-100"
                }
              />
            </span>

            <h5 className="text-xs font-semibold text-gray-100">
              {numOfLikes > 0 && formatNumbers(numOfLikes)}
            </h5>
          </button>
        </div>

        <div className="flex items-center justify-center gap-1">
          <span className="cursor-pointer">
            {id ? (
              <Link to={`/?post=${id}`} mask={`/post/${id}`} preventScrollReset>
                <LuMessageCircle className="stroke-gray-100" />
              </Link>
            ) : (
              <LuMessageCircle className="stroke-gray-100" />
            )}
          </span>
          <h5 className="text-xs font-semibold text-gray-100">
            {formatNumbers(numOfComments)}
          </h5>
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-1"
          onClick={handleBookmark}
        >
          <span className="cursor-pointer">
            <LuBookmark
              className={`${isBookmarked && "fill-blue-400 stroke-blue-400"} text-gray-100`}
            />
          </span>
          <h5 className="text-xs font-semibold text-gray-100">
            {formatNumbers(numOfBookmarks)}
          </h5>
        </button>
      </div>

      <div className="cursor-pointer">
        <button type="button">
          <LuSend className="cursor-pointer stroke-gray-100" />
        </button>
      </div>
    </div>
  );
}

export default PostStats;
