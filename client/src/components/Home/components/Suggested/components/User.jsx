import React from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";

const User = () => {
  let navigate = useNavigate();

  return (
    <section
      className="md:flex md:flex-row hidden gap-2 items-center  rounded-lg h-fit  py-2 hover:cursor-pointer"
      onClick={() => navigate("/home/user")}
    >
      <CgProfile size={24} />
      <div className="flex flex-col">
        <p className="text-base">Rwitesh Bera</p>
        <p className="text-xs">@rwitesh</p>
      </div>
    </section>
  );
};

export default User;