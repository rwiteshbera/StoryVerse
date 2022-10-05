import React, { useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Profile from "./components/Profile/Profile";
import UserProfile from "./components/UserProfile/UserProfile";
import CreatePost from "./components/Home/CreatePost";
import NotFound from "./components/404NotFound/NotFound";
import Settings from "./settings/Settings";

import EditProfile from "./settings/utility/EditProfile";
import PrivacySecurity from "./settings/utility/PrivacySecurity";
import LoginActivity from "./settings/utility/LoginActivity";
import ManageAccount from "./settings/utility/ManageAccount";
import ForgetPassword from "./components/Login/ForgetPassword/ForgetPassword";
import ResetPassword from "./components/Login/ResetPassword/ResetPassword";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const user = localStorage.getItem("user");

    // If user is not loggedin, then redirect to login page
    // If user want to go to reset password or forget password page, by default he is not logged in, hence don't redirect to login

    if (!user && location.pathname === "/forget_password") {
      navigate("/forget_password");
    } else if (!user && !location.pathname.startsWith("/reset_password")) {
      navigate("/login");
    } else if (!user && location.pathname.startsWith("/reset_password")) {
      // Do nothing
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
          <Route
            path="/settings/privacy&security"
            element={<PrivacySecurity />}
          />
          <Route path="/settings/login&activity" element={<LoginActivity />} />
          <Route
            path="/settings/account&management"
            element={<ManageAccount />}
          />
        </Route>
        <Route exact path="/forget_password" element={<ForgetPassword />} />
        <Route
          exact
          path="/reset_password/:id/:token"
          element={<ResetPassword />}
        />
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </>
  );
};

export default App;
