import { useLoaderData, useLocation, useNavigate } from "react-router";
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
import { useEffect } from "react";

function PostViewer() {
  const { post, comments } = useLoaderData();
  const navigate = useNavigate();
  const location = useLocation();
  console.log("⚡ ", location.state?.modal);

  const isModal = location.state?.modal;

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

  // Get current post's comment
  const currentPostComments = comments?.filter(
    (comment) => Number(comment.postId) === Number(id),
  );

  // Effect 🌀
  useEffect(() => {
    // Disable scrolling when the modal is open (PostViewer.jsx inside Posts.jsx)
    document.body.style.overflow = "hidden";

    // Cleanup 🧹 - Note: the cleanup function runs before and after the effect runs and also after the component unmounts!
    return () => {
      // Re-enable scrolling when modal closes
      document.body.style.overflow = "auto";
    };
  }, []);

  // if not a modal
  if (!isModal)
    return (
      <div className="absolute inset-0 h-screen w-full overflow-hidden bg-red-400">
        <img className="w-full" src={postImg} alt="" />
      </div>
    );

  return (
    <div
      className="fixed inset-0 z-50 flex h-screen w-full items-center justify-center bg-black/60"
      onClick={() => {
        navigate(-1); // Note: This one preserves the scroll position automatically, but on a new tab, it goes out of the app when the modal is closed!

        // navigate("/");
      }}
    >
      <div
        className="flex items-center justify-center overflow-hidden rounded-sm sm:h-100 sm:w-200 md:h-150 md:w-250"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Post Image or Video */}
        <div className="flex h-full w-1/2 items-center justify-center overflow-hidden">
          <img className="w-full object-cover" src={postImg} alt="" />
        </div>

        {/* About the post */}
        <div className="flex h-full w-1/2 flex-col items-start justify-between gap-1 bg-gray-50 p-2">
          {/* user details */}
          <div className="flex w-full items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
                <img draggable="false" src={userImg} alt="" />
              </div>

              <div className="flex flex-col items-start justify-center">
                <div className="flex items-center justify-center gap-1">
                  <h4 className="text-sm font-semibold text-gray-700">
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
              <span className="inline-block rotate-90 cursor-pointer text-gray-600">
                <LuEllipsis />
              </span>
            </div>
          </div>

          {/* Comments */}
          <div className="scrollbar-hide flex w-full flex-1 flex-col items-start justify-start gap-1 overflow-y-scroll p-2">
            {/* Post */}

            <div>
              {/* Profile */}
              <div className="flex items-center justify-start gap-2">
                <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                  <img draggable="false" src={userImg} alt="" />
                </div>

                <div className="flex items-center justify-start gap-2">
                  <h4 className="text-xs font-semibold text-gray-700">
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
              <div className="ml-3 border-l border-gray-200 pl-5">
                <p className="mb-2 text-xs text-gray-600">
                  {highlightHashtags(postText)}
                </p>
              </div>
            </div>

            {/* Comment item */}
            {currentPostComments?.map((comment) => (
              <Comment comment={comment} key={comment.id} />
            ))}
          </div>

          {/* Stats and comment input */}
          <div className="flex w-full flex-col items-start justify-center">
            {/* Stats */}
            <div className="flex w-full flex-col items-start justify-center gap-2.5">
              <div className="flex w-full items-center justify-between gap-2 border-t border-gray-100 px-2 pt-4">
                <div className="flex items-center justify-between gap-2">
                  {/* Likes form */}
                  {/* <likesFetcher.Form method="patch"> */}
                  {/* Hidden inputs to collect data */}
                  <input type="hidden" name="intent" value="like" />
                  <input type="hidden" name="postLikes" value={postLikes} />
                  <input type="hidden" name="id" value={id} />
                  {/* <input type="hidden" name="liked" value={liked} /> */}

                  <button
                    type="submit"
                    //   onClick={() => setLiked((like) => !like)} // toggle likes
                    className="flex items-center justify-center gap-1"
                  >
                    <span className="cursor-pointer">
                      <LuHeart
                        className={`${postLiked && "fill-red-400 stroke-red-400"}`}
                      />
                    </span>
                    <h5 className="text-xs font-semibold text-gray-900">
                      {postLikes > 0 && formatNumbers(postLikes)}
                    </h5>
                  </button>
                  {/* </likesFetcher.Form> */}

                  <div className="flex items-center justify-center gap-1">
                    <span className="cursor-pointer">
                      <LuMessageCircle />
                    </span>
                    <h5 className="text-xs font-semibold text-gray-900">
                      {formatNumbers(postComments)}
                    </h5>
                  </div>

                  {/* <bookmarkFetcher.Form method="patch"> */}
                  {/* Hidden inputs to collect data */}
                  <input type="hidden" name="intent" value="bookmark" />
                  <input
                    type="hidden"
                    name="postBookmarks"
                    value={postBookmarks}
                  />
                  <input type="hidden" name="id" value={id} />

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-1"
                  >
                    <span className="cursor-pointer">
                      <LuBookmark className="fill-blue-400 stroke-blue-400" />
                    </span>
                    <h5 className="text-xs font-semibold text-gray-900">
                      {formatNumbers(postBookmarks)}
                    </h5>
                  </button>
                  {/* </bookmarkFetcher.Form> */}
                </div>

                <div className="cursor-pointer">
                  <span>
                    {/* <LuShare /> */}
                    <LuSend />
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-start justify-start gap-0.5 px-2 pb-4">
                <h5 className="text-xs font-semibold text-gray-500">
                  {formatBigNumbers(postLikes)} likes
                </h5>
                <p className="text-xs text-gray-400">{postDate}</p>
              </div>
            </div>

            {/* Add a comment */}
            <div className="flex w-full items-center justify-between gap-2 border-t border-gray-100 px-2 py-3">
              <div className="flex h-6 w-6 items-center justify-center overflow-hidden rounded-full">
                <img src={userImg} alt="" />
              </div>
              <div className="flex-1">
                <input
                  className="w-full border-0 px-2 py-1 text-sm text-gray-500 outline-0 placeholder:text-sm"
                  type="text"
                  placeholder="Add a comment..."
                  name="comment"
                />
              </div>
              <button className="cursor-pointer text-sm font-semibold text-gray-500">
                Post
              </button>
            </div>
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
