const url = "http://localhost:5000";

export async function getPosts() {
  try {
    console.log("📡 FETCHING POSTS");

    const res = await fetch(`${url}/posts`);
    if (!res.ok) throw new Error("Failed to fetch posts 😥");
    const data = await res.json();
    return data;
  } catch (err) {
    throw err.message;
  }
}

export async function getPost(id) {
  try {
    const res = await fetch(`${url}/posts/${id}`);
    const data = await res.json();
    return data;
  } catch (err) {
    throw err.message;
  }
}

export async function updatePost(id, post) {
  try {
    const res = await fetch(`${url}/posts/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(post),
    });
    if (!res.ok) throw new Error("Failed to update the post 😔");
    const data = await res.json();
    return data;
  } catch (err) {
    throw err.message;
  }
}

export async function getComments() {
  try {
    const res = await fetch(`${url}/comments`);
    if (!res.ok) throw new Error("Failed to fetch comments 😥");
    const data = await res.json();
    return data;
  } catch (err) {
    throw err.message;
  }
}

export async function addComment(newComment) {
  try {
    const res = await fetch(`${url}/comments`, {
      method: "POST",
      body: JSON.stringify(newComment),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to add the comment 😥");
    const data = await res.json();
    return data;
  } catch (err) {
    throw err.message;
  }
}
