import React from "react";
import Posts from "./Posts/Posts";

const Profile = () => {
  return (
    <section className="mt-10">
      <div className="flex flex-row relative items-centerborder mx-10">
        <img
          src="https://randomuser.me/api/portraits/men/10.jpg"
          className="rounded-full w-32 h-32"
          draggable="false"
        />
        <div className="ml-10">
          <p className="text-3xl">Rwitesh Bera</p>
          <p className="text-base">@rwiteshbera</p>

          <div className="flex flex-row gap-x-16 mt-5">
            <p>Posts: 20</p>
            <p>Following: 100</p>
            <p>Followers: 120</p>
          </div>
        </div>
      </div>
      <p className="py-5 mx-10">
        Student | Developer | Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Voluptate libero maxime animi velit fugit error saepe eveniet
        voluptas possimus est?
      </p>
      <Posts />
    </section>
  );
};

export default Profile;
