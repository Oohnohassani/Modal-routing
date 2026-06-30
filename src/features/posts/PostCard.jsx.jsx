import { useEffect, useRef, useState } from "react";
import { LuBadgeCheck, LuEllipsis } from "react-icons/lu";
import { formatBigNumbers } from "../../utils/helpers";
import { highlightHashtags } from "./PostViewer";
import PostStats from "./PostStats";
import SkeletonLoadingPostCard from "../../ui/SkeletonLoadingPostCard";
import AddComment from "../comments/AddComment";
import Comments from "../comments/Comments";

function PostCard({ post, comments }) {
  // State 🧠
  const [isLoading, setIsLoading] = useState(false);
  const [currComments, setComments] = useState([]);

  // Refs
  const prevComments = useRef(null);

  // Destructure
  const {
    id,
    post: postText,
    postDate,
    postImg,
    userImg,
    username,
    verified,
    postLikes,
  } = post;

  // Effect 🌀
  useEffect(
    function () {
      // Update the local comments state on mount
      const currentPostComments = comments?.filter(
        (comment) => Number(comment.postId) === Number(id),
      );

      setComments(currentPostComments);
      prevComments.current = currComments;
    },
    [comments, id],
  );

  if (isLoading) return <SkeletonLoadingPostCard />;

  return (
    <div
      className="flex w-96 flex-col items-center justify-center overflow-hidden rounded-sm bg-neutral-800 sm:h-100 sm:w-170 sm:flex-row md:flex md:h-150 md:w-220"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Post Image or Video */}
      <div className="flex h-full items-center justify-center overflow-hidden sm:w-1/2 md:w-[55%]">
        <img
          className="w-full object-cover"
          src={postImg}
          alt={`${username}'s post from ${postDate}`}
          draggable="false"
        />
      </div>

      {/* About the post */}
      <div className="flex h-full flex-col items-start justify-between gap-1 bg-neutral-800 p-2 sm:w-1/2 md:w-[45%]">
        {/* user details */}
        <div className="flex w-full items-center justify-between gap-2 border-b border-neutral-700 pb-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
              <img draggable="false" src={userImg} alt="" />
            </div>

            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center justify-center gap-1">
                <h4 className="text-sm font-semibold text-gray-100">
                  {username}
                </h4>
                <span>
                  {verified && (
                    <LuBadgeCheck className="h-4 w-4 fill-blue-600 text-white" />
                  )}
                </span>
              </div>
              <p className="text-xs text-gray-500">{postDate}</p>
            </div>
          </div>

          <div>
            <span className="inline-block rotate-90 cursor-pointer text-gray-100">
              <LuEllipsis />
            </span>
          </div>
        </div>

        {/* Comments */}
        <div className="scrollbar-hide flex w-full flex-1 flex-col items-start justify-start gap-1 overflow-y-scroll p-2">
          {/* Post Content */}
          <div>
            {/* Profile */}
            <div className="flex items-center justify-start gap-2">
              <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                <img draggable="false" src={userImg} alt="" />
              </div>

              <div className="flex items-center justify-start gap-2">
                <h4 className="text-xs font-semibold text-gray-100">
                  {username}
                </h4>

                {verified && (
                  <span>
                    <LuBadgeCheck className="h-4 w-4 fill-blue-600 text-white" />
                  </span>
                )}

                <p className="mt-0.5 text-[11px] text-gray-500">{postDate}</p>
              </div>
            </div>

            {/* post content */}
            <div className="ml-3 pl-5">
              <p className="mb-2 text-xs text-gray-300">
                {highlightHashtags(postText)}
              </p>
            </div>
          </div>

          {/* Comments */}
          <Comments comments={currComments} />
        </div>

        {/* Stats and comment input */}
        <div className="flex w-full flex-col items-start justify-center">
          {/* Stats */}
          <div className="flex w-full flex-col items-start justify-center gap-2.5 border-t border-neutral-700">
            <PostStats post={post} />

            <div className="flex flex-col items-start justify-start gap-0.5 px-2 pb-4">
              <h5 className="text-xs font-semibold text-gray-500">
                {formatBigNumbers(postLikes)} likes
              </h5>
              <p className="text-xs text-gray-400">{postDate}</p>
            </div>
          </div>

          {/* Add a comment */}
          <AddComment
            post={post}
            setComments={setComments}
            prevComments={prevComments}
          />
        </div>
      </div>
    </div>
  );
}

export default PostCard;

/*

  Here is what we want to happen when we like, comment or bookmark:

  1. The Ui should update instantly without reloading the page or flickering. 👈 (our biggest problem right now.)
  2. The database i.e; the JSON server database should reflect the update(i.e; likes, bookmarks and comments) through our Api.
  3. These operations should NOT make our application heavy or unresponsive

  Now the question becomes, "How do we achieve these goals?" Do we need a local Ui state management tools such as redux? If so, how do we wire up or implement redux?

*/
