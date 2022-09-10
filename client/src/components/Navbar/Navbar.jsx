import React from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const LoggedIn = () => {
  let navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id');
    localStorage.removeItem('following');
    localStorage.removeItem('followers');
  }
  return (
    <>
      <nav>
        <div className="nav-wrapper white">
          <Link to="/" className="brand-logo left">
            Logo
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li onClick={logOut}>
              <Link to='/login'>Logout</Link>
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
}

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
}

const Navbar = () => {
  const user = localStorage.getItem('user');
  
  return (
    (user === null ? <NotLoggedIn/> : <LoggedIn/>)
  )
};

export default Navbar;
