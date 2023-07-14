import React from "react";
import { AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
const Post = () => {
  return (
    <>
      <div className="flex flex-col p-2 border-b border-r border-gray-600">
        <div className="flex flex-row items-center mx-4 gap-x-4 hover:cursor-pointer">
          <CgProfile size={32} />
          <p>Username</p>
        </div>
        <img src="/unsamples/image-2.jpg" className="my-2" draggable="false" />
        <p className="mx-4">loremText</p>
        <div className="flex flex-row justify-center items-center gap-x-2 mt-2 ">
          <AiOutlineHeart size={32} className="hover:cursor-pointer" />
          <AiOutlineComment size={32} className="hover:cursor-pointer" />
        </div>
      </div>
    </>
  );
};

export default Post;
