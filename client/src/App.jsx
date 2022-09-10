import React, {useEffect} from "react";
import Navbar from "./components/Navbar/Navbar";
import {Route, Routes, useNavigate} from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Profile from "./components/Profile/Profile";
import UserProfile from "./components/UserProfile/UserProfile";
import CreatePost from "./components/Home/CreatePost";
import NotFound from "./components/404NotFound/NotFound";


const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if(user) {
      // navigate('/');
    } else {
      navigate('/login');
    }
  }, [])

  return (
    <>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/create" element={<CreatePost />}></Route>
          <Route exact path="/profile" element={<Profile />}></Route>
          <Route path="/profile/:userid" element={<UserProfile />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
    </>
  );
};

export default App;
