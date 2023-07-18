import React from "react";
import { useNavigate } from "react-router-dom";

const User = ({data}) => {
  let navigate = useNavigate();

  return (
    <section
      className="md:flex md:flex-row gap-2 items-center rounded-lg py-2 hover:cursor-pointer"
      onClick={() => navigate(`/home/${data.username}`)}
    >
      <img src={data.profilePhoto} width={32} className="rounded-full"/>
      <div className="flex flex-col">
        <p className="text-base">{data.name}</p>
        <p className="text-xs">@{data.username}</p>
      </div>
    </section>
  );
};

export default User;
