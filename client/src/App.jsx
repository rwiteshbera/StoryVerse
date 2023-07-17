import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";

import Home from "./components/Home/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminProfile from "./components/AdminProfile/AdminProfile";
import UserProfile from "./components/UserProfile/UserProfile";
import axios from "axios";
import useSWR from "swr/immutable";

const App = () => {
  const [profileData, setProfileData] = useState();
  const [post, setPost] = useState([]);

  const {
    data: user,
    error: err1,
    isLoading: loading1,
  } = useSWR(
    "/v1/user",
    () => {
      axios
        .get("/v1/user", {
          headers: { "Content-type": "application/json" },
          withCredentials: true,
        })
        .then((res) => setProfileData(res.data?.message));
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
    }
  );
  if (err1) {
    console.log(err1);
  }

  const {
    data: posts,
    error: err2,
    isLoading: loading2,
  } = useSWR("/v1/user/posts", () => {
    axios
      .get("/v1/user/posts", {
        headers: "application/json",
        withCredentials: true,
      })
      .then((res) => {
        setPost(res.data?.message.reverse());
      });
  });
  if (err2) {
    console.log(err1);
  }

  return (
    <>
      <div className="h-screen md:mt-2 md:w-2/3 mt-1 w-screen m-auto">
        <Navbar />
        <Routes>
          <Route index element={<Home profileData={profileData} />} />
          <Route
            path="/user"
            element={<AdminProfile profileData={profileData} post={post} />}
          />
          <Route path="/:username" element={<UserProfile />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
