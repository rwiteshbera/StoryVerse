import React, { useState } from "react";
import Post from "./components/Post";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";
import axios from "axios";

const Feed = () => {
  let navigate = useNavigate();
  const [feedPosts, setFeedPosts] = useState();

  const fetcher = (url) =>
    axios
      .get(url)
      .then((res) => {
        setFeedPosts(res.data.reverse());
      })
      .catch((e) => {
        navigate("/");
      });

  const { data, error, isLoading } = useSWR("/v1/feed", fetcher);
  if (isLoading) {
    return (
      <div className="col-span-3">
        <h1 className="text-center text-2xl mt-10">Loading...</h1>
      </div>
    );
  }
  if (error) {
    return (
      <div className="col-span-3">
        <h1 className="text-center text-2xl mt-10">Unable to load</h1>
      </div>
    );
  }

  return (
    <div className="col-span-3">
      {feedPosts &&
        feedPosts.map((post, key) => {
          return <Post key={key} data={post} />;
        })}
    </div>
  );
};

export default Feed;
