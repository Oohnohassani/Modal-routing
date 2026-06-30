import { useEffect, useRef, useState } from "react";
import { updatePost } from "../../server/postsApi";
import {
  LuBadgeCheck,
  LuBookmark,
  LuHeart,
  LuMessageCircle,
  LuSend,
  LuEllipsis,
} from "react-icons/lu";

// Fake static data — no server, no loader, nothing!
const fakePost = {
  id: "7",
  username: "john_doe",
  verified: true,
  postDate: "2 hours ago",
  userImg: "https://i.pravatar.cc/300?img=8",
  postImg: "https://picsum.photos/id/214/500/300",
  post: "Exploring the beauty of the world one photo at a time. #travel #photography #nature",
  postLikes: 142,
  postBookmarks: 28,
  postComments: 15,
  postLiked: false,
  postBookmarked: false,
};

console.log("📦 MODULE LOADED");

// Fake server call — simulates network delay and random failures
function fakeServerCall() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldFail = Math.random() < 0.4; // fails 40% of the time
      if (shouldFail) {
        reject(new Error("Server failed! 💥"));
      } else {
        resolve("Success! ✅");
      }
    }, 1500); // 1.5 second delay
  });
}

function PostOptimistic() {
  console.log("🔄 RENDER");

  // State 🧠
  const [numOfLikes, setNumOfLikes] = useState(fakePost.postLikes);
  const [isLiked, setIsLiked] = useState(fakePost.postLiked);
  const [numOfBookmarks, setNumOfBookmarks] = useState(fakePost.postBookmarks);
  const [isBookmarked, setIsBookmarked] = useState(fakePost.postBookmarked);
  const [showError, setShowError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ← starts as true!

  // Refs 🚦
  const previousLikesRef = useRef(null);
  const previousIsLikedRef = useRef(null);
  const previousBookmarkRef = useRef(null);
  const previousIsBookmarkedRef = useRef(null);

  window.addEventListener("beforeunload", () => {
    console.log("PAGE IS UNLOADING");
  });

  // Destructuring
  const {
    id,
    username,
    verified,
    postDate,
    userImg,
    postImg,
    post: postTxt,
    postLikes,
    postBookmarks,
    postComments,
    postLiked,
  } = fakePost;

  // Effects 🌀
  // ✅ Fetch real data from server on mount
  useEffect(function () {
    console.log("✅ MOUNTED");
    setIsLoading(true); // ← start loading

    async function fetchPost() {
      const res = await fetch("http://localhost:5000/posts/7");
      const data = await res.json();

      // Update state with REAL server values
      setNumOfLikes(data.postLikes);
      setIsLiked(data.postLiked);
      setNumOfBookmarks(data.postBookmarks);
      setIsBookmarked(data.postBookmarked);

      setIsLoading(false); // ← done loading!
    }

    fetchPost();

    return () => {
      console.log("❌ UNMOUNTED");
    };
  }, []); // ← empty array means "run once when component mounts"

  // Handlers 🖱️
  async function handleLikes() {
    // 0. // 📸 Save snapshot of previous state silently using ref, then update optimistically...
    previousLikesRef.current = numOfLikes;
    previousIsLikedRef.current = isLiked;

    // 1. Update the `isLiked` state 🧠
    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);

    // 2. Calculate the count based on the `isLiked` state 🧠
    const newLikesCount = isLiked ? numOfLikes - 1 : numOfLikes + 1;
    setNumOfLikes(newLikesCount);

    // OLD way 👇 (before JSON server)
    // setIsLiked((liked) => !liked);
    // if (isLiked) setNumOfLikes((n) => n - 1);
    // else setNumOfLikes((n) => n + 1);

    // 3. Quietly call the server in the background
    try {
      await updatePost(id, {
        postLikes: newLikesCount,
        postLiked: newIsLiked,
      });

      // OLD fake server 👇
      // await fakeServerCall();
      console.log(
        "Server said: Success! ✅ Nothing to do, UI already correct!",
      );
    } catch (err) {
      console.error("Server said: Failed! 💥 Rolling back...");

      // 4. Server failed? Restore the previous state from our refs
      setNumOfLikes(previousLikesRef.current);
      setIsLiked(previousIsLikedRef.current);

      // 5. ✅ Show the error notification
      setShowError(true);
    }
  }

  async function handleBookmarks() {
    // 0. store the previous state values for a rollback incase of an error
    previousBookmarkRef.current = numOfBookmarks;
    previousIsBookmarkedRef.current = isBookmarked;

    // 1. Updtate the bookmark state 🧠
    const newIsBookmarked = !isBookmarked; // true or false
    setIsBookmarked(newIsBookmarked);

    // 2. Calculate the bookmarks count 🧠
    const newBookmarksCount = isBookmarked
      ? numOfBookmarks - 1
      : numOfBookmarks + 1;

    setNumOfBookmarks(newBookmarksCount);

    // OLD way before 👇 (JSON server)
    // setIsBookmarked((bookmarked) => !bookmarked);
    // if (isBookmarked) setNumOfBookmarks((n) => n - 1);
    // else setNumOfBookmarks((n) => n + 1);

    // 3. Quietly call the server in the background
    try {
      await updatePost(id, {
        postBookmarks: newBookmarksCount,
        postBookmarked: newIsBookmarked,
      });

      // OLD fake server 👇
      // await fakeServerCall();
      console.log(
        "Server said: Success! ✅ Nothing to do, UI already correct!",
      );
    } catch (err) {
      console.error(err);

      // 4. If server fails, we roll back immediately
      setIsBookmarked(previousIsBookmarkedRef.current);
      setNumOfBookmarks(previousBookmarkRef.current);

      // 5. ✅ Show the error notification
      setShowError(true);
    }
  }

  // Loading...
  if (isLoading) return <PostSkeleton />;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      {/* Error Notification */}
      {showError && <ErrorNotification setShowError={setShowError} />}

      {/* Post */}
      <div className="flex w-105 flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 p-3">
        {/* Profile */}
        <div className="flex h-full w-full items-center justify-between gap-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full">
              <img draggable="false" src={userImg} alt="" />
            </div>

            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center justify-center gap-1">
                <h4 className="text-sm font-semibold text-gray-700">
                  {username}
                </h4>
                {verified && (
                  <LuBadgeCheck className="h-4 w-4 fill-blue-600 text-white" />
                )}
              </div>
              <p className="text-xs text-gray-500">{postDate}</p>
            </div>
          </div>

          <span className="inline-block rotate-90 cursor-pointer text-gray-600">
            <LuEllipsis />
          </span>
        </div>

        {/* Post Text */}
        <div className="my-2 w-full">
          <p className="text-sm text-gray-700">{highlightHashtags(postTxt)}</p>
        </div>

        {/* Post Image */}
        <div className="flex w-full items-center justify-center overflow-hidden rounded-lg">
          <img
            className="w-full object-contain"
            draggable="false"
            src={postImg}
            alt=""
          />
        </div>

        {/* Stats */}
        <div className="mt-2 flex w-full items-center justify-between gap-2 px-2">
          <div className="flex items-center justify-between gap-3">
            {/* Likes */}
            <button
              type="button"
              className="flex items-center justify-center gap-1"
              onClick={handleLikes}
            >
              <LuHeart
                className={`${isLiked && "fill-red-400 stroke-red-400"} cursor-pointer`}
              />
              <h5 className="text-xs font-semibold text-gray-900">
                {numOfLikes}
              </h5>
            </button>

            {/* Comments */}
            <button
              type="button"
              className="flex items-center justify-center gap-1"
            >
              <LuMessageCircle className="cursor-pointer" />
              <h5 className="text-xs font-semibold text-gray-900">
                {postComments}
              </h5>
            </button>

            {/* Bookmarks */}
            <button
              type="button"
              className="flex items-center justify-center gap-1"
              onClick={handleBookmarks}
            >
              <LuBookmark
                className={`${isBookmarked && "fill-blue-400 stroke-blue-400"} cursor-pointer`}
              />
              <h5 className="text-xs font-semibold text-gray-900">
                {numOfBookmarks}
              </h5>
            </button>
          </div>
          {/* Share */}
          <button type="button" className="cursor-pointer">
            <LuSend />
          </button>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader 💀
function PostSkeleton() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
      <div className="flex w-105 flex-col items-center justify-center gap-2 rounded-lg bg-gray-50 p-3">
        {/* Profile skeleton */}
        <div className="flex h-full w-full items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {/* Avatar circle */}
            <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />

            <div className="flex flex-col gap-2">
              {/* Username line */}
              <div className="h-3 w-24 animate-pulse rounded-full bg-gray-200" />
              {/* Date line */}
              <div className="h-2 w-16 animate-pulse rounded-full bg-gray-200" />
            </div>
          </div>
        </div>

        {/* Text skeleton */}
        <div className="my-2 flex w-full flex-col gap-2">
          <div className="h-2 w-full animate-pulse rounded-full bg-gray-200" />
          <div className="h-2 w-3/4 animate-pulse rounded-full bg-gray-200" />
        </div>

        {/* Image skeleton */}
        <div className="h-52 w-full animate-pulse rounded-lg bg-gray-200" />

        {/* Stats skeleton */}
        <div className="mt-2 flex w-full items-center gap-3 px-2">
          <div className="h-4 w-8 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-8 animate-pulse rounded-full bg-gray-200" />
          <div className="h-4 w-8 animate-pulse rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

// Error component 🧩
function ErrorNotification({ setShowError }) {
  // Auto close 3s after the component mounts
  useEffect(
    function () {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);

      // Cleanup 🧹
      return () => {
        clearTimeout(timer);
      };
    },
    [setShowError],
  );

  return (
    <div className="fixed top-5 left-1/2 z-50 flex -translate-x-1/2 items-center justify-between gap-4 rounded-lg bg-gray-900 px-4 py-3 text-white shadow-lg">
      <p className="text-sm">Something went wrong. Please try again.</p>
      <button
        onClick={() => setShowError(false)}
        className="text-gray-400 transition-colors hover:text-white"
      >
        ✕
      </button>
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

export default PostOptimistic;
