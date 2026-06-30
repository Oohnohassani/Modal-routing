import { useEffect, useState } from "react";
import Profile from "./Profile";
import { getPosts } from "../../server/postsApi";

function Status() {
  const [posts, setPosts] = useState([]);

  // Effect 🌀
  useEffect(function () {
    async function fetchPosts() {
      const data = await getPosts();
      setPosts(data);
    }

    fetchPosts();

    return () => {};
  }, []);

  return (
    <div className="flex w-full items-center justify-center gap-2 md:w-[80%]">
      {posts.map((post, index) => (
        <Profile userImg={post.userImg} key={index} />
      ))}
    </div>
  );
}

export default Status;
