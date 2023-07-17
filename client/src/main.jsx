import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Components
import Accounts from "./components/Account/Account";
import Error from "./components/Error/Error";
import Signup from "./components/Account/Signup/Signup";
import App from "./App";
import AdminProfile from "./components/AdminProfile/AdminProfile";
import UserProfile from "./components/UserProfile/UserProfile"

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
    path: "/home/*",
    element: <App />,
    errorElement: <Error />,
    children: [
      {
        path: "user",
        element: <AdminProfile />,
      },
      {
        path: ":username",
        element: <UserProfile />
      }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <RouterProvider router={router} />
);
