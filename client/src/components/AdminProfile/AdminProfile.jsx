import React, { useState } from "react";
import Posts from "./Posts/Posts";
import axios from "axios";
import useSWR, { preload } from "swr";
import { useNavigate } from "react-router-dom";

const Profile = ({ profileData, post }) => {
  let navigate = useNavigate();
  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
    },
    withCredentials: true,
  };

  const logoutHandler = async () => {
      try {
        await axios.post("/v1/logout", {}, axiosConfig);
        navigate("/")
      } catch (error) {
        window.location.reload();
      } 
  }

  return (
    <section className="mt-10">
      <div className="flex flex-row relative items-centerborder mx-10">
        <button className="absolute right-0 top-0 rounded-md bg-black border border-gray-600 hover:bg-second px-3 py-1 w-28">
          Edit Profile
        </button>
        <button className="absolute right-0 top-10 rounded-md bg-black border border-gray-600  hover:bg-second px-3 py-1  w-28" onClick={() => logoutHandler()}>
          Logout
        </button>
        <img
          src={profileData?.profilePhoto}
          className="rounded-full w-32 h-32"
          draggable="false"
        />

        <div className="ml-10">
          <p className="text-3xl">{profileData?.name}</p>
          <p className="text-base">@{profileData?.username}</p>

          <div className="flex flex-row gap-x-16 mt-5">
            <p className="hover:cursor-pointer">{post.length} Posts</p>
            <p className="hover:cursor-pointer">
              {profileData?.following?.length} Following{" "}
            </p>
            <p className="hover:cursor-pointer">
              {profileData?.followers?.length} Followers{" "}
            </p>
          </div>
        </div>
      </div>
      <p className="py-5 mx-10">{profileData?.bio}</p>
      <Posts data={post} />
    </section>
  );
};

export default Profile;
