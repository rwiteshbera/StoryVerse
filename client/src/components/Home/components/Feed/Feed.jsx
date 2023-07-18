import React, { useState } from "react";
import Post from "./components/Post";
import { useNavigate } from "react-router-dom";
import { TbReload } from "react-icons/tb";
import useSWR from "swr/immutable";
import axios from "axios";

const Feed = () => {
  let navigate = useNavigate();
  const [feedPosts, setFeedPosts] = useState([]);

  const fetcher = (url) =>
    axios
      .get(url)
      .then((res) => {
        const feed = res.data?.message.map((post) => {
          if (post.likes.some((like) => like.username === "rwitesh")) {
            return { ...post, adminLiked: true };
          }
          return post;
        });
        setFeedPosts(feed.reverse());
      })
      .catch((e) => {
        navigate("/");
      });

  const { data, error, isLoading } = useSWR("/v1/feed", fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  if (isLoading) {
    return (
      <div className="col-span-3">
        <h1 className="text-center text-2xl mt-10">Loading...</h1>
      </div>
    );
  }
  if (error || feedPosts.length === 0) {
    return (
      <div className="col-span-3 flex flex-col justify-center items-center">
        <h1 className="text-center text-2xl mt-10">Unable to load</h1>
        <TbReload
          className="text-center mt-6 hover:cursor-pointer"
          size={32}
          onClick={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="col-span-3">
      {feedPosts.length &&
        feedPosts.map((post, key) => {
          return <Post key={key} data={post} />;
        })}
    </div>
  );
};

export default Feed;
