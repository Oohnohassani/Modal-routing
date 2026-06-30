import { createBrowserRouter, RouterProvider } from "react-router";

import AppLayout from "./ui/AppLayout";
import Posts from "./features/posts/Posts";
import Error from "./ui/Error";
import PostViewer from "./features/posts/PostViewer";
import { loader as postsLoader } from "./features/posts/Posts";
import { action as postAction } from "./features/posts/Post";
import {
  loader as postLoader,
  action as postViewerAction,
} from "./features/posts/PostViewer";
import PostOptimistic from "./features/posts/PostOptimistic";
import Home from "./ui/Home";

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    errorElement: <Error />,

    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            index: true,
            element: <Posts />,
            loader: postsLoader,
            action: postAction,

            // Stop revalidation for these actions
            shouldRevalidate({ formData }) {
              const intent = formData?.get("intent");

              // If it was a like or bookmark action, do NOT reload
              if (intent === "like" || intent === "bookmark") return false;

              // For everything else (comments), DO reload to get fresh data
              return true;
            },
          },
        ],
      },

      {
        path: "/post/:id",
        element: <PostViewer />,
        loader: postLoader,
        action: postViewerAction,
      },
      {
        path: "/demo",
        element: <PostOptimistic />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
