import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = ({ title }) => {
  let navigate = useNavigate();
  return (
    <>
      <h2 className="text-center font-semibold text-3xl mb-1">{title}</h2>
      <input
        placeholder="Email or Username"
        className="rounded-md min-w-36 h-8 px-2 text-md"
      />
      <input
        placeholder="Password"
        className="rounded-md min-w-36 h-8 px-2 text-md"
      />
      <button className="rounded-md bg-first hover:bg-second px-3 py-1">
        Login
      </button>
      <div className="flex flex-row justify-center items-center gap-2 pt-3 ">
        <p className="text-xs">Don't have an account?</p>
        <Link to="/signup">Sign up</Link>
      </div>
    </>
  );
};

export default Login;
