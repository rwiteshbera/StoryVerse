import React from "react";
import Feed from "./components/Feed/Feed";
import User from "./components/User/User";
import Suggested from "./components/Suggested/Suggested";

const Home = () => {
  return (
    <>
      <section className="grid grid-cols-4 gap-2 ">
        <Feed />
        <div>
          <User />
          <Suggested />
        </div>
      </section>
    </>
  );
};

export default Home;
