import { createBrowserRouter, RouterProvider } from "react-router";
import AppLayout from "./ui/AppLayout";
import Posts from "./features/posts/Posts";
import Error from "./ui/Error";
// import Comments from "./features/comments/Comments";
import { loader as postsLoader } from "./features/posts/Posts";
import { action } from "./features/posts/Post";
import PostViewer from "./features/posts/PostViewer";
import {
  loader as postLoader,
  action as postAction,
} from "./features/posts/PostViewer";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,

    children: [
      {
        element: <Posts />,
        path: "/",
        loader: postsLoader,
        action: action,
        errorElement: <Error />,
        children: [
          {
            element: <PostViewer />,
            path: "post/:id", // Dynamic route
            loader: postLoader,
            action: postAction,
            errorElement: <Error />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return (
    <RouterProvider router={router}>
      <div className="flex bg-orange-600 text-sm font-semibold"></div>;
    </RouterProvider>
  );
}

export default App;
