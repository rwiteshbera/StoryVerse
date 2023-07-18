import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useSWR from "swr/immutable";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ViewFollowingFollowersModal = ({ data, type, onClose }) => {
  let navigate = useNavigate();
  const [List, setList] = useState([]);

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
    },
    withCredentials: true,
  };

  const fetcher = (url) =>
    axios
      .get(url, axiosConfig)
      .then((res) => {
        setList(res.data?.[type]);
      })
      .catch((e) => {
        navigate("/");
      });

  const { error } = useSWR(`/v1/${data.username}/${type}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnReconnect: false,
    revalidateOnFocus: false,
  });

  // Close modal handler
  const modalCloseHandler = () => {
    onClose();
  };

  return (
    <>
      <div className="bg-black absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col rounded-2xl py-2 px-5 w-72 h-[50%]">
        <AiOutlineCloseCircle
          size={24}
          onClick={() => modalCloseHandler()}
          className="absolute top-2 right-2 hover:cursor-pointer"
        />
        <h1 className="p-5 text-xl capitalize font-bold">{type}</h1>
        <div className="overflow-auto">
          {List &&
            List.map((element, key) => {
              return (
                <div
                  className="flex flex-row gap-4 hover:cursor-pointer "
                  key={key}
                  onClick={() => {
                    navigate(`/home/${element.username}`);
                    modalCloseHandler();
                  }}
                >
                  <img
                    src={element.profilePhoto}
                    width={40}
                    className="m-2 rounded-full"
                  />
                  <div className="flex flex-col">
                    <p className="text-xl">{element.name}</p>
                    <p className="text-sm">{element.username}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ViewFollowingFollowersModal;
