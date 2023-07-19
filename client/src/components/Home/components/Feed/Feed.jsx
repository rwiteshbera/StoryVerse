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
      .then((response) => {
        setFeedPosts(response.data?.message.reverse());
      })
      .catch((e) => {
        console.log(e)
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
  if (error) {
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
    <div className="lg:col-span-3 col-span-5">
      {feedPosts &&
        feedPosts.map((post, key) => {
          return <Post key={key} data={post} />;
        })}
    </div>
  );
};

export default Feed;
