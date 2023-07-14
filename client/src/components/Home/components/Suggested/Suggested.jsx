import React from "react";

import User from "./components/User";
const Suggested = () => {
  return (
    <section className="mt-4 mx-2">
      <p className="text-gray-400">Suggested For You</p>
      <User />
      <User />
      <User />
      <User />
      <User />
    </section>
  );
};

export default Suggested;
