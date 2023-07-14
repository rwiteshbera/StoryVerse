import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = ({ title }) => {
  let navigate = useNavigate();
  return (
    <>
        <h2 className="text-center font-semibold text-3xl mb-1">{title}</h2>
        <input
          placeholder="Email"
          className="rounded-md min-w-36 h-8 px-2 text-md"
        />
        <input
          placeholder="Name"
          className="rounded-md min-w-36 h-8 px-2 text-md"
        />
        <input
          placeholder="Username"
          className="rounded-md min-w-36 h-8 px-2 text-md"
        />
        <input
          placeholder="Password"
          className="rounded-md min-w-36 h-8 px-2 text-md"
        />
        <div className="py-2">
          <p className="text-xs text-center">
            By signing up, you agree to our Terms , Privacy Policy and Cookies
            Policy .
          </p>
        </div>
        <button className="rounded-md bg-first hover:bg-second px-3 py-1">
          Sign up
        </button>
        <div className="flex flex-row justify-center items-center gap-2 pt-3">
          <p className="text-xs">Have an account?</p>
          <Link to="/">Login</Link>
        </div>
    </>
  );
};

export default Signup;
