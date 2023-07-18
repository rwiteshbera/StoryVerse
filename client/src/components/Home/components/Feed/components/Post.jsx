import axios from "axios";
import React, { useState } from "react";
import { AiOutlineHeart, AiOutlineComment, AiFillHeart } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const Post = ({ data }) => {
  let navigate = useNavigate();
  const [likeCount, setLikeCount] = useState(data.likes?.length);

  const viewProfileFunction = async (username) => {
    try {
      navigate(`/home/${username}`);
    } catch (error) {
      navigate("/home");
    }
  };

  const LikeHandler = async () => {
    const imageId = data._id;

    if (!data.adminLiked) {
      try {
        await axios.put(`/v1/like/check?id=${imageId}`);
        data.adminLiked = true;
        setLikeCount(likeCount + 1);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await axios.put(`/v1/like/uncheck?id=${imageId}`);
        data.adminLiked = false;
        setLikeCount(likeCount - 1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const uncheckLike = () => {
    console.log("disliked");
  };
  return (
    <>
      <div className="flex flex-col p-2 border-b border-r border-gray-600">
        <div
          className="flex flex-row items-center mx-4 gap-x-4 hover:cursor-pointer"
          onClick={() => viewProfileFunction(data?.postedBy?.username)}
        >
          <img
            src={data.postedBy?.profilePhoto}
            width={32}
            className="rounded-full"
          />
          <p>{data.postedBy?.username}</p>
        </div>
        <img src={data?.photo} className="my-2 select-none" draggable="false" />
        <p className="mx-4">{data?.captions}</p>
        <div className="flex flex-row justify-center items-center gap-x-2 mt-2 ">
          {!data.adminLiked ? (
            <AiOutlineHeart
              size={32}
              className="hover:cursor-pointer hover:text-red-600 select-none"
              onClick={() => LikeHandler()}
            />
          ) : (
            <AiFillHeart
              size={32}
              className="hover:cursor-pointer text-red-600 hover:text-red-600 select-none"
              onClick={() => LikeHandler()}
            />
          )}
          <span className="mr-3 select-none">{likeCount}</span>
          <AiOutlineComment
            size={32}
            className="hover:cursor-pointer hover:text-second select-none"
          />
          <span className="mr-3 select-none"> </span>
        </div>
      </div>
    </>
  );
};

export default Post;
