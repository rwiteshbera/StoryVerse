import React from "react";
import "./signup.css";
import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <>
      <form>
        <input type="text" placeholder="full name"></input>
        <input type="email" placeholder="email"></input>
        <input type="password" placeholder="password"></input>
        <button type="submit">Login</button>
        <Link to="/login">
          <div>Already have an account?</div>
        </Link>
      </form>
    </>
  );
};

export default Signup;
