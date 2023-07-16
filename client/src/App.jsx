import React, { useState } from "react";
import Navbar from "./components/Navbar/Navbar";

import Home from "./components/Home/Home";
import { Route, Routes, json } from "react-router-dom";
import Profile from "./components/Profile/Profile";
import Footer from "./components/Footer/Footer";
import axios from "axios";
import useSWR, { preload } from "swr";

const App = () => {
  return (
    <>
      <div className="h-screen md:mt-2 md:w-2/3 mt-1 w-screen m-auto">
        <Navbar />
        <Routes>
          <Route index element={<Home />} />
          <Route path="/user" element={<Profile />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default App;
