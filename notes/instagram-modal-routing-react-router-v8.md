# Instagram-Style Modal Routing in React Router v8

How to show a post as a modal on top of your feed — and as a full page when opened directly in a new tab.

---

## The Problem

You have a social feed. When a user clicks a post, you want two things to happen at the same time:

1. The post opens as a **modal** floating on top of the feed (feed still visible in the background)
2. The URL in the address bar changes to `/post/1` (so the link is shareable)
3. When someone opens that `/post/1` link in a **new tab**, it opens as a normal **full page** — no modal, no feed behind it

This is exactly how Instagram works. And getting it right in React Router v8 is surprisingly tricky if you don't know about one specific feature.

---

## Why Your Feed Disappears (The Root Cause)

Before fixing anything, it helps to understand _why_ the feed disappears in the first place.

Think of `<Outlet />` in your layout like a **single TV screen**. Only one channel plays at a time. React Router looks at the URL, picks the matching route, and shows _only that one_ on screen.

If your routes look like this:

```jsx
children: [
  { index: true, element: <Posts /> },         // channel 1: the feed
  { path: "/post/:id", element: <PostViewer /> }, // channel 2: the post page
],
```

These two routes are **siblings** — they sit side by side, not one inside the other. When you navigate from `/` to `/post/1`, React Router switches the TV from channel 1 to channel 2. `Posts` isn't hidden behind something — it's **completely removed from the screen**, like changing the channel.

That's the whole reason the feed vanishes. It's not a bug in your code. It's just what routing does by default.

---

## The Solution: React Router v8's `mask` Prop

React Router v8 ships a feature called **`mask`** — and it exists specifically to solve this problem.

Normally, the URL and the actual route are glued together. One address, one place. `mask` lets you **unglue them** for a specific link.

A single `<Link>` with `mask` can do two different things at the same time:

- **`to`** — where you _actually_ go (the real destination React Router uses behind the scenes)
- **`mask`** — what the address bar _shows_ (a display-only address, just for looks)

Think of it like a hotel with two doors:

- **Door A** (`to`) is the real entrance — it leads into the **feed page**, with a tiny note attached: `?post=1`. The feed stays alive. The loader runs. Everything keeps working.
- **Door B** (`mask`) has a sign saying `/post/1` — this is what the address bar shows, and it's what gets copied when you share the link.

When a user clicks from inside the feed → they go through Door A (feed stays, modal appears).
When a user pastes `/post/1` in a new tab → there's no "Door A" trick, they go straight to the real `/post/1` route → full page, no modal.

---

## Project Setup

Here's the file structure we're working with:

```
src/
├── features/
│   └── posts/
│       ├── Post.jsx          ← individual post card in the feed
│       ├── Posts.jsx         ← the feed page (list of all posts)
│       ├── PostCard.jsx      ← reusable post detail UI (used in modal AND full page)
│       └── PostViewer.jsx    ← the full-page post view (for direct/new-tab visits)
├── server/
│   └── postsApi.js           ← API functions (getPosts, getPost, getComments...)
└── App.jsx                   ← router config
```

And the router config in `App.jsx`:

```jsx
import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./ui/AppLayout";
import Posts from "./features/posts/Posts";
import PostViewer from "./features/posts/PostViewer";
import { loader as postsLoader } from "./features/posts/Posts";
import { action as postAction } from "./features/posts/Post";
import {
  loader as postLoader,
  action as postViewerAction,
} from "./features/posts/PostViewer";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Posts />,
        loader: postsLoader,
        action: postAction,
      },
      {
        path: "/post/:id",
        element: <PostViewer />,
        loader: postLoader,
        action: postViewerAction,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

> Note: In React Router v8, `react-router-dom` was removed. Everything now lives in `react-router`. If you still have `react-router-dom` in your `package.json`, you can safely remove it with `npm uninstall react-router-dom`.

---

## Step 1 — Write the "Note" on the Link (`Post.jsx`)

The very first thing to change is the link that opens the modal. Find your comment icon link in `Post.jsx`:

**Before:**

```jsx
<Link
  to={`/post/${id}`}
  state={{
    modal: true,
    backgroundLocation: location,
  }}
>
  <LuMessageCircle />
</Link>
```

**After:**

```jsx
<Link to={`/?post=${id}`} mask={`/post/${id}`} preventScrollReset>
  <LuMessageCircle />
</Link>
```

Three things changed here:

**`to={`/?post=${id}`}`**
This is "Door A" — where you're _really_ going. You're sending the user to `/` (the feed page) with a tiny note stuck on: `?post=1`. That `?post=1` part is called a **query parameter**. You've probably seen it before on URLs like `google.com/search?q=cats`. It's just a way of tucking a small hint into a URL without changing the route itself.

**Wait...Where's the `/?post=1` in the Url?**

You're right, you only see `/post/1`. It's hidden on purpose — that's the whole point of mask.
Go back to the "two doors" picture: mask makes the address bar lie to you (nicely!). The real address (`/?post=1`, "Door A") never shows up anywhere visually — React Router keeps it tucked away internally so it can use it for routing and loaders, while only ever showing you the fake one (`/post/1`, "Door B").

**`mask={`/post/${id}`}`**
This is "Door B" — what the address bar _displays_. Visitors see `/post/1` in the browser. This is also what gets copied if someone shares the link.

**`preventScrollReset`**
By default, every time React Router navigates to a new URL, it scrolls back to the top of the page — just like a browser normally would on a full page load. That's useful most of the time, but not here. If the user is scrolled down to post #7 and clicks it, you don't want the page to jump back to the top. `preventScrollReset` tells React Router: "navigate, but leave the scroll position exactly where it is."

---

## Step 2 — Teach the Feed to Read the Note (`Posts.jsx` loader)

The loader is the function React Router runs _before_ showing your page, to go fetch whatever data the page needs. Right now your `Posts.jsx` loader fetches posts and comments. We need to also teach it to check for that `?post=` note — and if it's there, fetch that specific post's details too.

First, add `getPost` (singular) to your imports:

```jsx
import { getComments, getPost, getPosts } from "../../server/postsApi";
```

Then update the loader:

**Before:**

```jsx
export async function loader() {
  const [posts, comments] = await Promise.all([getPosts(), getComments()]);
  return { posts, comments };
}
```

**After:**

```jsx
export async function loader({ request }) {
  const url = new URL(request.url);
  const modalPostId = url.searchParams.get("post");

  const [posts, comments] = await Promise.all([getPosts(), getComments()]);
  const modalPost = modalPostId ? await getPost(modalPostId) : null;

  return { posts, comments, modalPost };
}
```

Line by line:

- `{ request }` — React Router passes the real URL (the "Door A" one: `/?post=1`) into your loader as `request`.
- `new URL(request.url)` — turns that raw URL string into an object we can pick pieces out of.
- `url.searchParams.get("post")` — this is the "opening the note" step. It looks for a `?post=...` part in the URL and grabs the number after it. If there's no `?post=` in the URL (normal feed visit, no modal), it returns `null`.
- The last line: if there was a note (`modalPostId` has a value), fetch that post's full details. If not, just set `modalPost` to `null`.

---

## Step 3 — Show the Modal (`Posts.jsx` component)

Now the loader is fetching `modalPost`, but we haven't told the component to display it yet. Two small changes in `Posts.jsx`:

**Change 1** — grab `modalPost` from the loader data:

```jsx
const { posts, comments, modalPost } = useLoaderData();
```

**Change 2** — conditionally render the modal at the bottom of your feed:

```jsx
return (
  <div className="relative my-8 flex flex-col items-center justify-center gap-4 bg-white">
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

    {modalPost && (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        onClick={() => navigate("/", { preventScrollReset: true })}
      >
        <PostCard post={modalPost} comments={comments} />
      </div>
    )}
  </div>
);
```

`{modalPost && (...)}` means: "only put this on screen if `modalPost` isn't empty." Since `modalPost` only gets filled in when there's a `?post=` note in the URL, this overlay stays invisible on a normal feed visit, and appears only when a post is clicked.

**Closing the modal:**
Clicking the dark backdrop calls `navigate("/", { preventScrollReset: true })`. This navigates back to the clean feed URL (no `?post=` note), which makes `modalPost` become `null` again, and the `{modalPost && (...)}` line automatically hides the overlay.

The `{ preventScrollReset: true }` option here is the same idea as the `preventScrollReset` prop on `<Link>` — it tells React Router not to jump back to the top of the page when closing the modal. Without it, the feed would scroll back to the top every time you close a modal.

---

## Step 4 — Create a Reusable `PostCard.jsx`

Right now the full post detail UI (image, profile, comments, stats, add-comment input) lives inside `PostViewer.jsx`. We want to use that same UI in two places:

- Inside the modal (inside `Posts.jsx`)
- On the full standalone page (inside `PostViewer.jsx`)

The cleanest way is to pull that UI out into its own reusable component — `PostCard.jsx`. Think of it as a LEGO brick: once it's its own piece, you can snap it into both places.

```jsx
// PostCard.jsx
import {
  LuBadgeCheck,
  LuBookmark,
  LuEllipsis,
  LuHeart,
  LuMessageCircle,
  LuSend,
} from "react-icons/lu";
import Comment from "../comments/Comment";
import { formatNumbers, formatBigNumbers } from "../../utils/helpers";
import { highlightHashtags } from "./PostViewer";

function PostCard({ post, comments }) {
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

  const currentPostComments = comments?.filter(
    (comment) => Number(comment.postId) === Number(id),
  );

  return (
    <div
      className="flex items-center justify-center overflow-hidden rounded-sm sm:h-100 sm:w-200 md:h-150 md:w-250"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Post Image */}
      <div className="flex h-full w-1/2 items-center justify-center overflow-hidden">
        <img className="w-full object-cover" src={postImg} alt="" />
      </div>

      {/* Post details, comments, stats */}
      <div className="flex h-full w-1/2 flex-col items-start justify-between gap-1 bg-gray-50 p-2">
        {/* ...your full post detail markup here... */}
      </div>
    </div>
  );
}

export default PostCard;
```

Two things worth noting:

**`onClick={(e) => e.stopPropagation()}`** on the outer card div — without this, clicking _anywhere inside_ the card would bubble up to the dark backdrop's `onClick`, immediately closing the modal. `stopPropagation()` tells the click event: "stop here, don't travel up to the parent."

**`currentPostComments`** — `PostCard` receives the full `comments` array (all comments for all posts) and filters it down itself to just the ones matching the current post's `id`. This means you can safely pass the whole list from `Posts.jsx` without pre-filtering.

---

## Step 5 — Simplify `PostViewer.jsx`

`PostViewer.jsx` used to contain the modal UI, the `isModal` check, and the "Hi there, this is not the modal" placeholder. Now that all of that lives in `PostCard.jsx` and `Posts.jsx`, `PostViewer.jsx` has one simple job: **show a clean full-page post when someone visits `/post/1` directly.**

Replace the entire file with this:

```jsx
import { useLoaderData } from "react-router";
import { getComments, getPost } from "../../server/postsApi";
import PostCard from "./PostCard";

function PostViewer() {
  const { post, comments } = useLoaderData();

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white">
      <PostCard post={post} comments={comments} />
    </div>
  );
}

// Highlight hashtags helper (imported by PostCard too)
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

export async function loader({ params }) {
  const { id } = params;
  const [post, comments] = await Promise.all([getPost(id), getComments()]);
  return { post, comments };
}

export async function action({ request, params }) {
  return null;
}

export default PostViewer;
```

Now when someone pastes `/post/1` into a new tab, they get a centred post card on a white background. No modal, no dark overlay, no placeholder text. Just the post.

---

## Step 6 — Lock Background Scroll When Modal is Open

When the modal is open, the feed behind it should not be scrollable. Previously you had a `useEffect` in `PostViewer.jsx` for this. Now that the modal lives in `Posts.jsx`, the scroll lock moves there too.

Add `useEffect` to your React import:

```jsx
import { useEffect } from "react";
```

Then add this inside your `Posts` function:

```jsx
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
```

Line by line:

- `[modalPost]` at the end is the **dependency array**. It tells React: "re-run this effect every time `modalPost` changes." So it fires when the modal opens (modalPost gets a value) and when it closes (modalPost becomes null).
- `overflow: hidden` disables scrolling on the page body.
- `return () => {...}` is the **cleanup function** — it runs when the component unmounts or before the effect runs again. It makes sure scroll is always restored even if something unexpected happens.

### The Layout Shift Fix

There's a subtle visual bug that comes with scroll locking: your scrollbar takes up a small amount of space on the right side of the screen (usually 15–17px). When you set `overflow: hidden`, the scrollbar disappears — and the content suddenly gets that space back, shifting everything slightly to the right.

The fix is to measure the scrollbar's width and immediately replace it with an equal amount of padding, so the content never actually moves:

```jsx
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
document.body.style.paddingRight = `${scrollbarWidth}px`;
```

- `window.innerWidth` — the full browser window width, **including** the scrollbar
- `document.documentElement.clientWidth` — the page content width, **excluding** the scrollbar
- The difference = exactly the scrollbar's width

When the modal closes, you set `paddingRight` back to `"0px"` and the scrollbar returns, perfectly balanced.

---

## How It All Fits Together

Here's the complete flow from start to finish:

### Clicking a post in the feed

1. User clicks the comment icon `<Link to="/?post=1" mask="/post/1" preventScrollReset>`
2. React Router navigates to `/?post=1` behind the scenes (feed route stays active)
3. The address bar shows `/post/1` (because of `mask`)
4. The feed's `loader` runs, reads `?post=1` from the URL, fetches that post's data
5. `modalPost` is now populated → `{modalPost && (...)}` renders the dark overlay + `<PostCard>`
6. The `useEffect` fires → scroll is locked, layout shift is prevented

### Closing the modal

1. User clicks the dark backdrop → `navigate("/", { preventScrollReset: true })`
2. React Router navigates back to `/` (no `?post=` note)
3. The `loader` runs again, `modalPostId` is `null`, `modalPost` is `null`
4. `{modalPost && (...)}` hides the overlay
5. The `useEffect` fires again → scroll is restored, padding is reset

### Opening the link directly in a new tab

1. User pastes `/post/1` into a new tab
2. React Router matches the real `/post/:id` route — no `mask` trick involved
3. `PostViewer.jsx` renders → its own loader fetches the post → `<PostCard>` on a clean white page

---

## The Complete `Posts.jsx`

```jsx
import { useEffect } from "react";
import { useFetcher, useLoaderData, useNavigate } from "react-router";
import Post from "./Post";
import PostCard from "./PostCard";
import { getComments, getPost, getPosts } from "../../server/postsApi";

function Posts() {
  const { posts, comments, modalPost } = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();

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

  return (
    <div className="relative my-8 flex flex-col items-center justify-center gap-4 bg-white">
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

      {modalPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => navigate("/", { preventScrollReset: true })}
        >
          <PostCard post={modalPost} comments={comments} />
        </div>
      )}
    </div>
  );
}

export async function loader({ request }) {
  const url = new URL(request.url);
  const modalPostId = url.searchParams.get("post");

  const [posts, comments] = await Promise.all([getPosts(), getComments()]);
  const modalPost = modalPostId ? await getPost(modalPostId) : null;

  return { posts, comments, modalPost };
}

export default Posts;
```

---

## Key Concepts Recap

| Concept                                        | What it does                                                           |
| ---------------------------------------------- | ---------------------------------------------------------------------- |
| `mask` on `<Link>`                             | Navigates to one URL, displays a different one in the address bar      |
| `to="/?post=1"`                                | The real URL — keeps the feed route active                             |
| `mask="/post/1"`                               | The display URL — what the address bar shows                           |
| `preventScrollReset` on `<Link>`               | Stops the page from jumping to the top when opening the modal          |
| `{ preventScrollReset: true }` on `navigate()` | Stops the page from jumping to the top when closing the modal          |
| `url.searchParams.get("post")`                 | Reads the `?post=1` hint out of the real URL in the loader             |
| `{modalPost && (...)}`                         | Only renders the overlay when there's a post to show                   |
| `stopPropagation()` on the card                | Prevents clicks inside the card from bubbling up and closing the modal |
| `scrollbarWidth` padding fix                   | Prevents the layout from shifting when the scrollbar disappears        |

---

## Why This Pattern Matters

The old way of doing this (before `mask`) used `location.state.backgroundLocation` — you stored the previous location in a link's `state`, then rendered two separate `<Routes>` trees, one using the real location and one using the stashed background location. It worked in declarative (non-data) mode, but it was never supported properly with data routers, loaders, or `useLoaderData`. It was a community workaround, not an official API.

`mask` is the first-class, officially supported solution — it works natively with loaders, `useLoaderData`, actions, and everything else the data router provides. No workarounds, no hacks.

---

_Built with React Router v8 and React 19._
