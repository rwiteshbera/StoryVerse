import React, { useState } from "react";
import Posts from "./Posts/Posts";
import axios from "axios";
import useSWR, { preload } from "swr";

const Profile = () => {
  const [profileData, setProfileData] = useState();
  const [post, setPost] = useState([]);

  const {
    data: user,
    error: err1,
    isLoading: loading1,
  } = useSWR("/v1/user", () => {
    axios
      .get("/v1/user", { headers: "application/json", withCredentials: true })
      .then((res) => setProfileData(res.data?.message));
  });
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
        setPost(res.data?.message);
      });
  });
  if (err2) {
    console.log(err1);
  }

  return (
    <section className="mt-10">
      <div className="flex flex-row relative items-centerborder mx-10">
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
