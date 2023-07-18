import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Posts from "./Posts/Posts";
import axios from "axios";
import useSWR from "swr/immutable";
import { useParams } from "react-router-dom";
import ViewFollowingFollowersModal from "../Modal/ViewFollowingFollowersModal";

const UserProfile = ({}) => {
  const [profileData, setUserProfileData] = useState([]);
  const [post, setUserPostsData] = useState([]);

  // Modal State Handling
  const [FollowersModal, setFollowersModal] = useState(false);
  const [FollowingModal, setFollowingModal] = useState(false);

  // Get the username from the params
  const { username } = useParams();

  const fetcher = (url) =>
    axios
      .get(url)
      .then((res) => {
        setUserProfileData(res.data?.user);
        setUserPostsData(res.data?.posts);
      })
      .catch((e) => {
        navigate("/");
      });

  const { data, error, isLoading } = useSWR(`/v1/user/${username}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  if (error) {
    window.location.reload();
  }

  if (isLoading) {
    return <section className="mt-10 text-2xl text-center">Loading...</section>;
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
            <p
              className="hover:cursor-pointer"
              onClick={() => setFollowingModal(true)}
            >
              {profileData?.following?.length} Following{" "}
            </p>
            <p
              className="hover:cursor-pointer"
              onClick={() => setFollowersModal(true)}
            >
              {profileData?.followers?.length} Followers{" "}
            </p>
          </div>
        </div>
      </div>
      <p className="py-5 mx-10">{profileData?.bio}</p>
      <Posts data={post} />

      <>
        {FollowersModal &&
          createPortal(
            <ViewFollowingFollowersModal
              data={profileData}
              type="followers"
              onClose={() => setFollowersModal(false)}
            />,
            document.body
          )}
        {FollowingModal &&
          createPortal(
            <ViewFollowingFollowersModal
              data={profileData}
              type="following"
              onClose={() => setFollowingModal(false)}
            />,
            document.body
          )}
      </>
    </section>
  );
};

export default UserProfile;
