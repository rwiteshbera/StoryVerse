import React, { useState } from "react";
import axios from "axios";
import useSWR from "swr/immutable";
import { AiOutlineCloseCircle } from "react-icons/ai";

const ViewFollowingFollowersModal = ({ data, type, onClose }) => {
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
      <div className="bg-black absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] flex flex-col justify-center items-center rounded-2xl py-2 w-[50%] h-[50%]">
        <AiOutlineCloseCircle size={24} onClick={() => modalCloseHandler()} className="absolute top-2 right-2 hover:cursor-pointer"/>
        <h1 className="p-5">{type}</h1>
        <div className="">
          {List &&
            List.map((element, key) => {
              return (
                <div
                  className="flex flex-row gap-2 items-center hover:cursor-pointer"
                  key={key}
                >
                  <img src={element.profilePhoto} width={24} className="m-1 rounded-full" />
                  <p>{element.username}</p>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default ViewFollowingFollowersModal;
