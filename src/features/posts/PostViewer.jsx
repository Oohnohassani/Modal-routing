import { useLoaderData } from "react-router";
import { getComments, getPost } from "../../server/postsApi";
import Comment from "../comments/Comment";
import {
  LuBadgeCheck,
  LuBookmark,
  LuEllipsis,
  LuHeart,
  LuMessageCircle,
  LuSend,
} from "react-icons/lu";

import { formatNumbers, formatBigNumbers } from "../../utils/helpers";
import { useEffect, useState } from "react";
import SkeletonLoadingPostViewer from "../../ui/SkeletonLoadingPostViewer";
import PostStats from "./PostStats";
import AddComment from "../comments/AddComment";
import Comments from "../comments/Comments";

function PostViewer() {
  // State 🧠
  const [isLoading, setIsLoading] = useState(false);
  const { post, comments } = useLoaderData();
  const [currComments, setCurrComments] = useState([]);

  const {
    id,
    post: postText,
    postDate,
    postImg,
    userImg,
    username,
    verified,
    postLiked,
    postLikes,
    postBookmarks,
    postComments,
  } = post;

  // Effect 🌀
  useEffect(() => {
    // Get current post's comment
    const currentPostComments = comments?.filter(
      (comment) => Number(comment.postId) === Number(id),
    );

    setCurrComments(currentPostComments);
  }, []);

  if (isLoading) return <SkeletonLoadingPostViewer />;

  return (
    <div className="absolute inset-0 z-10 flex h-screen w-full items-center justify-center">
      <div
        className="flex items-center justify-center overflow-hidden bg-neutral-800 sm:h-100 sm:w-200 md:h-150 md:w-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Post Image or Video */}
        <div className="flex h-full w-1/2 items-center justify-center overflow-hidden">
          <img className="w-full object-cover" src={postImg} alt="" />
        </div>

        {/* About the post */}
        <div className="flex h-full w-1/2 flex-col items-start justify-between gap-1 p-2">
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
          <div className="custom-scrollbar flex w-full flex-1 flex-col items-start justify-start gap-1 overflow-y-scroll p-2">
            {/* Post */}

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

            {/* Comments item */}
            <Comments comments={currComments} />
          </div>

          {/* Stats and comment input */}
          <div className="flex w-full flex-col items-start justify-center">
            {/* Stats */}
            <div className="flex w-full flex-col items-start justify-center gap-2.5">
              <div className="flex w-full items-center justify-between gap-2 border-t border-neutral-700 px-2 pt-4">
                <PostStats post={post} />
              </div>

              <div className="flex flex-col items-start justify-start gap-0.5 px-2 pb-4">
                <h5 className="text-xs font-semibold text-gray-500">
                  {formatBigNumbers(postLikes)} likes
                </h5>
                <p className="text-xs text-gray-400">{postDate}</p>
              </div>
            </div>

            {/* Add a comment */}
            <AddComment post={post} setComments={setCurrComments} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Highlight hashtags
export function highlightHashtags(post) {
  return post.split(" ").map((word, index) => {
    const searchTerm = encodeURIComponent(word);

    return word.startsWith("#") ? (
      <a
        key={index}
        href={`https://www.google.com/search?q=${searchTerm}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        {word}{" "}
      </a>
    ) : (
      word + " "
    );
  });
}

// loader
export async function loader({ params }) {
  // Get the id
  const { id } = params;

  // Get Post and comments all at once
  const [post, comments] = await Promise.all([getPost(id), getComments()]);

  //   const data = await getPost(id);
  return { post, comments };
}

// action
export async function action({ resquest, params }) {
  return null;
}

export default PostViewer;
