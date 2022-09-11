import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const LoggedIn = () => {
  let navigate = useNavigate();

  let token = localStorage.getItem("token");

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("id");

  };

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      responseType: "json",
      Authorization: token,
    },
  };

  const search = async (e) => {
    const { data } = await axios.post(
      "http://localhost:5050/search",
      {query: e.target.value},
      axiosConfig
    );

    console.log(data)
    // console.log(e.target.value)
  }

  return (
    <>
      <nav>
        <div className="nav-wrapper white">
          <Link to="/" className="brand-logo left">
            Logo
          </Link>
          <div style={{ marginLeft: "10rem" }}>
            <input type="text" style={{ width: "370px" }} onChange={search}/>
          </div>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li onClick={logOut}>
              <Link to="/login">Logout</Link>
            </li>
            <li>
              <Link to="/create">Create</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

const NotLoggedIn = () => {
  return (
    <>
      <nav>
        <div className="nav-wrapper white">
          <Link to="/" className="brand-logo left">
            Logo
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

const Navbar = () => {
  const user = localStorage.getItem("user");

  return user === null ? <NotLoggedIn /> : <LoggedIn />;
};

export default Navbar;
