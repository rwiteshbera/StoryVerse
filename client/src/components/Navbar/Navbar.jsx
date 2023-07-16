import React, { useState } from "react";
import { createPortal } from "react-dom";
import { ImHome } from "react-icons/im";
import { FaBell } from "react-icons/fa";
import { IoIosCreate } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import CreateNewPostModal from "../Modal/CreateNewPostModal";

const Navbar = () => {
  let navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div
        className="border-b pb-2 border-gray-600  grid grid-cols-5 items-center gap-x-5 "
        id="navbar"
      >
        <input
          className="col-span-3 px-4 py-2 m-1 rounded-2xl"
          placeholder="Search user"
        />
        <div
          className="flex flex-row justify-center items-center lg:gap-6 gap-2"
          draggable="false"
        >
          <ImHome
            className="hover:cursor-pointer hover:text-second"
            onClick={() => navigate("/home")}
            size={24}
          />
          <FaBell
            className="hover:cursor-pointer hover:text-second"
            size={24}
          />
          <IoIosCreate
            className="hover:cursor-pointer hover:text-second"
            size={24}
            onClick={() => {
              setShowModal(true);
            }}
          />
          <CgProfile
            className="hover:cursor-pointer hover:text-second"
            size={24}
            onClick={() => navigate("/home/user")}
          />
        </div>
        <p
          className="text-center text-3xl m-1 select-none hover:cursor-pointer"
          onClick={() => navigate("/home")}
        >
          PixBy
        </p>
      </div>

      {showModal &&
        createPortal(
          <CreateNewPostModal onClose={() => setShowModal(false)} />,
          document.body
        )}
    </>
  );
};

export default Navbar;
