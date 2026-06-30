import Post from "./Post";
import { getComments, getPost, getPosts } from "../../server/postsApi";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import PostCard from "./PostCard.jsx";
import { useEffect } from "react";

// import { useEffect, useState } from "react";
function Posts() {
  const { posts, comments, modalPost } = useLoaderData();

  const fetcher = useFetcher();
  const navigate = useNavigate();

  // Prevent the page width shifting after before and after modal.
  useEffect(() => {
    if (modalPost) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    };
  }, [modalPost]);

  // Loading the ('/') data with fetcher
  // useEffect(() => {
  //   if (!fetcher.data && fetcher.state === "idle") fetcher.load("/");
  // }, [fetcher]); // Runs on mount after fetcher updates

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-6 md:w-[80%]">
      {posts.map((post) => (
        <Post
          post={post}
          key={post.id}
          comments={
            comments?.filter((comment) => +comment.postId === +post.id) || []
          }
          isLoadingComments={fetcher.state === "loading"}
        />
      ))}

      {/* Modal */}
      {modalPost && (
        <div
          className="fixed inset-0 z-50 flex w-full items-center justify-center bg-black/60"
          onClick={() => navigate("/", { preventScrollReset: true })}
        >
          <PostCard post={modalPost} comments={comments} />
        </div>
      )}
    </div>
  );
}

export async function loader({ request }) {
  console.log("🔥 POSTS LOADER RUNNING");

  const url = new URL(request.url);
  const modalPostId = url.searchParams.get("post");

  const [posts, comments] = await Promise.all([getPosts(), getComments()]);
  const modalPost = modalPostId ? await getPost(modalPostId) : null;

  return { posts, comments, modalPost };
}

export default Posts;
