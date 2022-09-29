import React, { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import UserProfile from "./components/UserProfile/UserProfile";
import CreatePost from "./components/Home/CreatePost";
import NotFound from "./components/404NotFound/NotFound";
import Settings from "./settings/Settings";

import EditProfile from "./settings/utility/EditProfile";
import PrivacySecurity from "./settings/utility/PrivacySecurity";
import LoginActivity from "./settings/utility/LoginActivity"
import ManageAccount from "./settings/utility/ManageAccount"

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      // navigate('/');
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route exact path="/login" element={<Login />}></Route>
        <Route exact path="/create" element={<CreatePost />}></Route>
        <Route exact path="/profile" element={<Profile />}></Route>
        <Route exact path="/profile/:userid" element={<UserProfile />}></Route>
        <Route exact path="/settings" element={<Settings />}>
          <Route path="/settings" element={<EditProfile />} />
          <Route path="/settings/privacy&security" element={<PrivacySecurity/>}/>
          <Route path="/settings/login&activity" element={<LoginActivity/>}/>
          <Route path="/settings/account&management" element={<ManageAccount/>}/>
        </Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
};

export default App;
