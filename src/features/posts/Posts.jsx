import Post from "./Post";
import { getComments, getPosts } from "../../server/postsApi";
import { Link, Outlet, useFetcher, useLoaderData } from "react-router";
// import { useEffect, useState } from "react";
function Posts() {
  const { posts, comments } = useLoaderData();

  const fetcher = useFetcher();

  // Loading the ('/') data with fetcher
  // useEffect(() => {
  //   if (!fetcher.data && fetcher.state === "idle") fetcher.load("/");
  // }, [fetcher]); // Runs on mount after fetcher updates

  return (
    <>
      <div className="my-8 flex flex-col items-center justify-center gap-4 bg-white">
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
      </div>

      {/* PostViewer.jsx as a child component and modal */}
      <Outlet />
    </>
  );
}

export async function loader() {
  const [posts, comments] = await Promise.all([getPosts(), getComments()]);

  return { posts, comments };
}

export default Posts;
