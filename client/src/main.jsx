import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components

import Accounts from "./components/Account/Account";
import Error from "./components/Error/Error";
import Signup from "./components/Account/Signup/Signup";
import App from "./App";
import Profile from "./components/Profile/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Accounts />,
    errorElement: <Error />,
    children: [
      {
        path: "signup",
        element: <Signup />,
      },
    ],
  },
  {
    path: "/home",
    element: <App />,
    children: [
      {
        path: "user",
        element: <Profile />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
