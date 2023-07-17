import React from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const User = ({ profileData }) => {
  let navigate = useNavigate();

  return (
    <section
      className="md:flex md:flex-row hidden gap-4 items-center border-b border-gray-600 h-fit p-2  hover:cursor-pointer"
      onClick={() => navigate("/home/user")}
    >
      <img
        src={profileData?.profilePhoto}
        width={32}
        className="rounded-full"
      />
      <div className="flex flex-col">
        <p className="text-xl">{profileData?.name}</p>
        <p className="text-xs">@{profileData?.username}</p>
      </div>
    </section>
  );
};

export default User;
