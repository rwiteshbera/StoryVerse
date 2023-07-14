import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ title }) => {
  let navigate = useNavigate();

  const [loginState, setLoginState] = useState({
    emailOrUsername: "",
    password: "",
  });

  const handleValueChange = (fieldName, value) => {
    setLoginState((loginState) => ({
      ...loginState,
      [fieldName]: value,
    }));
  };

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
    },
    withCredentials: true,
  };

  const LoginFunction = async () => {
    // Check if all the fields are filled
    if (!loginState.emailOrUsername || !loginState.password) {
      console.log({ message: "Please fill all the fields" });
      return;
    }

    try {
      const { data } = await axios.post("/v1/login", loginState, axiosConfig);
      if (!data.success) {
        return console.log(data);
      }
     console.log(data)
    } catch (error) {
      console.log(error?.response?.data.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      LoginFunction();
    }
  };

  return (
    <>
      <div className="flex flex-col gap-y-2 h-96 w-80 border-2 justify-center items-center border-gray-600 rounded-md p-4 ">
        <h2 className="text-center font-semibold text-3xl mb-1">{title}</h2>
        <input
          placeholder="Email or Username"
          className="rounded-md min-w-36 h-8 px-2 text-md"
          value={loginState.emailOrUsername}
          onChange={(e) => handleValueChange("emailOrUsername", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <input
          placeholder="Password"
          className="rounded-md min-w-36 h-8 px-2 text-md"
          type="password"
          value={loginState.password}
          onChange={(e) => handleValueChange("password", e.target.value)}
          onKeyDown={(e) => handleKeyDown(e)}
        />
        <button
          className="rounded-md bg-first hover:bg-second px-3 py-1"
          onClick={() => {
            LoginFunction();
          }}
        >
          Login
        </button>
        <div className="flex flex-row justify-center items-center gap-2 pt-3 ">
          <p className="text-xs">Don't have an account?</p>
          <Link to="/signup">Sign up</Link>
        </div>
      </div>
    </>
  );
};

export default Login;
