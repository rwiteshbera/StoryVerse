import React, { useContext, useState } from "react";
import Feed from "./components/Feed/Feed";
import User from "./components/User/User";
import Suggested from "./components/Suggested/Suggested";
import { useNavigate } from "react-router-dom";
import useSWR from "swr";

const Home = ({profileData}) => {
  let navigate = useNavigate();
  
  return (
    <>
      <section className="grid grid-cols-4 gap-2 ">
        <Feed />
        <div>
          <User profileData={profileData} />
          <Suggested />
        </div>
      </section>
    </>
  );
};

export default Home;
