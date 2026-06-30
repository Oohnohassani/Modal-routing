import { LuEllipsis, LuArrowUp, LuBadgeCheck } from "react-icons/lu";
import Comments from "../comments/Comments";
import { useFetcher } from "react-router";
import { addComment, getPost, updatePost } from "../../server/postsApi";
import { useState } from "react";
import { highlightHashtags } from "./PostViewer";
import SkeletonLoadingPost from "../../ui/SkeletonLoadingPost";
import PostStats from "./PostStats";

function Post({ post, comments, isLoadingComments }) {
  // State 🧠
  const [isLoading, setIsLoading] = useState(false);

  // Destructuring
  const {
    id,
    username,
    postImg,
    post: postTxt,
    userImg,
    postDate,
    verified,
    // postLikes,
    // postBookmarks,
    // postComments,
    // postLiked,
  } = post;

  const commentFetcher = useFetcher();

  // Loading 🔃
  if (isLoading) return <SkeletonLoadingPost />;

  return (
    <div className="flex w-120 flex-col items-center justify-center gap-2 rounded-lg bg-neutral-800 p-3">
      {/* Profile */}
      <div className="flex h-full w-full items-center justify-between gap-2">
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
            <p className="text-xs text-gray-400">{postDate}</p>
          </div>
        </div>

        <div>
          <span className="inline-block rotate-90 cursor-pointer text-gray-100">
            <LuEllipsis />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="my-4">
        <p className="text-sm text-gray-100">{highlightHashtags(postTxt)}</p>
      </div>

      {/* Post Picture */}
      <div className="flex h-[40%] w-full items-center justify-center overflow-hidden rounded-lg">
        <img
          className="w-full object-contain"
          draggable="false"
          src={postImg}
          alt=""
        />
      </div>

      {/* Stats */}
      <PostStats id={id} post={post} />

      {/* Add comment */}
      <commentFetcher.Form
        method="POST"
        preventScrollReset // 🚨 Important!
        className="my-4 flex w-full items-center justify-start gap-2 px-3"
      >
        <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full">
          <img
            draggable="false"
            src="https://i.pravatar.cc/300?img=23"
            alt=""
          />
        </div>

        <div className="flex-1">
          <input
            type="text"
            name="comment"
            placeholder="Write your comment"
            className="w-full rounded-full bg-neutral-800 px-4 py-1 text-sm text-gray-400 outline outline-neutral-700 placeholder:text-sm"
            // value={value}
            // onChange={}
          />

          {/* Hidden input for data collection */}
          <input type="hidden" name="id" value={JSON.stringify(+id)} />
        </div>

        <button
          type="submit"
          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-neutral-700 p-1 text-gray-50"
        >
          <LuArrowUp />
        </button>
      </commentFetcher.Form>

      {/* Divider */}
      {/* {comments.length > 0 && (
        <div className="h-[1px] w-[90%] border-t border-neutral-700"></div>
      )} */}

      {/* Comments */}
      {comments.length > 0 && (
        <Comments comments={comments} isLoadingComments={isLoadingComments} />
      )}
    </div>
  );
}

// Random name generator
const firstNames = ["Alex", "Sam", "Jordan", "Taylor", "Chris"];
const lastNames = ["Smith", "Johnson", "Brown", "Lee", "Walker"];

function getRandomName() {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${first} ${last}`;
}

export async function action({ request, params }) {
  // 0. Get the form data
  const formData = await request.formData();

  // 1. Prepare the data
  const data = Object.fromEntries(formData);
  const { id } = data;

  // return null;

  // Adding a like
  if (data.intent === "like") {
    const liked = data.liked === "true";

    const currentPost = await getPost(data.id);

    await updatePost(data.id, {
      postLiked: liked,
      postLikes: liked
        ? currentPost.postLikes + 1
        : Math.max(0, currentPost.postLikes - 1),
    });

    return null;
  }

  // Add bookmark

  // Adding a new comment
  const randomImg = `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 56 + 1)}`;

  // Verified random propaility
  const verification = function () {
    return Math.random() > 0.5;
  };

  const newComment = {
    ...data,
    postId: id,
    username: getRandomName(),
    userImg: randomImg,
    createdAt: `${new Date().getMinutes()} minutes ago`,
    verified: verification(),
  };

  if (!data.comment) return null;

  // 2. Send the data to the Api
  await addComment(newComment);

  return null;
}

export default Post;

/*
        // action
// export async function action({ request, params }) {
//   // 0. Get the form data
//   const formData = await request.formData();

//   // 1. Prepare the data
//   const data = Object.fromEntries(formData);
//   const { id } = data;

//   // return null;

//   // Adding a like
//   if (data.intent === "like") {
//     const isCurrentlyLiked = data.liked === "true";

//     const likes = isCurrentlyLiked
//       ? Number(data.postLikes) + 1 // was liked → unlike
//       : Number(data.postLikes) - 1; // was not liked → like

//     await updatePost(data.id, {
//       postLikes: Math.max(0, likes), // safety net, never go below 0
//       postLiked: isCurrentlyLiked, // flip it
//     });

//     return null; // 👈 return early, don't fall through to the comment logic
//   }

//   // Add bookmark

//   // Adding a new comment
//   const randomImg = `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 56 + 1)}`;

//   const newComment = {
//     ...data,
//     postId: id,
//     username: getRandomName(),
//     userImg: randomImg,
//     createdAt: `${new Date().getMinutes()} minutes ago`,
//     verified: true,
//   };

//   // console.log(newComment);

//   if (!data.comment) return null;

//   // 2. Send the data to the Api
//   await addComment(newComment);

//   return null;
// }

          <likesFetcher.Form method="patch"> 
          Hidden inputs to collect data 
           <input type="hidden" name="intent" value="like" />
          <input type="hidden" name="postLikes" value={postLikes} />
          <input type="hidden" name="id" value={id} /> 
           <input type="hidden" name="postLikes" value={postLiked} /> 
           <input type="hidden" name="liked" value={liked} /> 

           <button
              type="submit"
              onClick={() => setLiked((like) => !like)} // toggle likes
              className="flex items-center justify-center gap-1"
            >
              <span className="cursor-pointer">
                <LuHeart
                  className={`${(isLiking ? newOptimisticLiked : postLiked) && "fill-red-400 stroke-red-400"}`}
                />
              </span>
              <h5 className="text-xs font-semibold text-gray-900">
                {(isLiking ? newOptimisticLikesCount : postLikes) > 0 &&
                  formatNumbers(isLiking ? newOptimisticLikesCount : postLikes)}
              </h5>
            </button>
          </likesFetcher.Form> 


           <bookmarkFetcher.Form method="patch">
            <input type="hidden" name="intent" value="bookmark" />
            <input type="hidden" name="postBookmarks" value={postBookmarks} />
            <input type="hidden" name="id" value={id} />

            <button
              type="submit"
              className="flex items-center justify-center gap-1"
            >
              <span className="cursor-pointer">
                <LuBookmark className="fill-blue-400 stroke-blue-400" />
              </span>
              <h5 className="text-xs font-semibold text-gray-100">
                {formatNumbers(postBookmarks)}
              </h5>
            </button>
          </bookmarkFetcher.Form>

*/
