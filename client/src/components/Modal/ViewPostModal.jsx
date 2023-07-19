import axios from "axios";
import React, { useState } from "react";
import {
  AiFillHeart,
  AiOutlineCloseCircle,
  AiOutlineComment,
  AiOutlineHeart,
} from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useSWRConfig } from "swr";
const ViewPostModal = ({ onClose, image }) => {
  const [likeCount, setLikeCount] = useState(image.likes?.length);
  const [confirmDeleteBtnState, setConfirmDeleteBtnState] = useState(false);
  const { mutate } = useSWRConfig();

  let navigate = useNavigate();
  const modalCloseHandler = () => {
    onClose();
    setConfirmDeleteBtnState(false);
  };

  // Delete a post handler
  const deleteHandler = async () => {
    const postId = image._id;
    if (!postId) {
      return;
    }
    try {
      const { data } = await axios.delete(`/v1/post?id=${postId}`);
      mutate("/v1/user/posts");
      modalCloseHandler();
    } catch (error) {
      console.log(error);
    }
  };

  // Like Handler
  const LikeHandler = async () => {
    if (!image.adminLiked) {
      try {
        await axios.put(`/v1/like/check?id=${image._id}`);
        image.adminLiked = true;
        setLikeCount(likeCount + 1);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await axios.put(`/v1/like/uncheck?id=${image._id}`);
        image.adminLiked = false;
        setLikeCount(likeCount - 1);
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div className="bg-black absolute top-[40%] left-[50%] translate-x-[-50%] translate-y-[-40%] rounded-2xl  md:w-[40vw] w-screen">

      <AiOutlineCloseCircle
        size={24}
        onClick={() => modalCloseHandler()}
        className="absolute top-1 right-1 hover:cursor-pointer text-white w-max h-max"
      />
      <div
        className="flex flex-row items-center hover:cursor-pointer p-2"
        onClick={() => {
          navigate(`/home/${image.author?.username}`);
        }}
      >
        <img
          src={image.author?.profilePhoto}
          width={24}
          className="m-1 rounded-full"
        />
        <span>{image.author?.username}</span>
      </div>
      <img src={image.photo?.url} className="w-fit" />
      <div className="flex flex-col bg-black">
        <div className="flex flex-row justify-center items-center gap-x-2 mt-2">
          {!image.adminLiked ? (
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
          <div className="flex justify-center absolute right-1">
            {confirmDeleteBtnState ? (
              <>
                <div>
                  <button
                    className="bg-red-600 hover:bg-red-800 border"
                    onClick={() => deleteHandler()}
                  >
                    Confirm Delete
                  </button>
                  <button
                    className="bg-red-600 hover:bg-red-800 border"
                    onClick={() => setConfirmDeleteBtnState(false)}
                  >
                    X
                  </button>
                </div>
              </>
            ) : (
              <>
                {" "}
                <MdDeleteForever
                  onClick={() => setConfirmDeleteBtnState(true)}
                  className="hover:cursor-pointer hover:text-red-600 select-none "
                  size={32}
                />
              </>
            )}
          </div>
        </div>
        <textarea
          className="p-2 resize-none text-sm"
          placeholder={image.captions}
          rows={3}
          disabled
        />
      </div>
    </div>
  );
};

export default ViewPostModal;
