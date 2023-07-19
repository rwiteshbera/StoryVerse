import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";

import Home from "./components/Home/Home";
import { Route, Routes, useNavigate } from "react-router-dom";
import AdminProfile from "./components/AdminProfile/AdminProfile";
import UserProfile from "./components/UserProfile/UserProfile";

const App = () => {

  return (
    <>
      <div className="h-screen md:mt-2 md:w-2/3 mt-1 w-screen m-auto">
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/user" element={<AdminProfile />} />
          <Route path="/:username" element={<UserProfile />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
