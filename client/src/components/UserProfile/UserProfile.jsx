import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Posts from "./Posts/Posts";
import axios from "axios";
import useSWR, { useSWRConfig } from "swr";
import { useParams } from "react-router-dom";
import ViewFollowingFollowersModal from "../Modal/ViewFollowingFollowersModal";

const UserProfile = ({}) => {
  // const { mutate } = useSWRConfig();
  const [profileData, setUserProfileData] = useState();
  const [post, setUserPostsData] = useState([]);
  const [FollowState, setFollowState] = useState(false);

  // Modal State Handling
  const [FollowersModal, setFollowersModal] = useState(false);
  const [FollowingModal, setFollowingModal] = useState(false);

  // Get the username from the params
  const { username } = useParams();

  // Follow or Unfollow user
  const FollowHandler = async () => {
    mutate("/v1/user");
    mutate(profileData.following);

    // If already followed : FollowState === true already
    // Unfollow user
    if (FollowState) {
      try {
        await axios.put(`/v1/unfollow/${profileData.username}`);
        setFollowState(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      // Otherwise follow
      try {
        await axios.put(`/v1/follow/${profileData.username}`);
        setFollowState(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const fetcher = (url) =>
    axios
      .get(url)
      .then((res) => {
        setUserProfileData(res.data?.user);
        setUserPostsData(res.data?.posts);
        setFollowState(res.data?.isFollowedByAdmin);
      })
      .catch((e) => {
        navigate("/");
      });

  const { data, mutate,error, isLoading } = useSWR(`/v1/user/${username}`, fetcher, {
    revalidateIfStale: true,
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
        <button
          className="absolute right-0 top-0 rounded-md bg-black border border-gray-600 hover:bg-second px-3 py-1 w-28"
          onClick={() => {
            FollowHandler();
          }}
        >
          {FollowState ? "Unfollow" : "Follow"}
        </button>
        <button className="absolute right-0 top-10 rounded-md bg-black border border-gray-600  hover:bg-red-600 px-3 py-1  w-28">
          Block
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
