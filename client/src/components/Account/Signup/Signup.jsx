import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const Signup = ({ title }) => {
  let navigate = useNavigate();

  const [signupState, setSignupState] = useState({
    email: "",
    name: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  // Toast Message
  const notify = (message) => {
    toast(message);
  };

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
    },
  };

  const handleValueChange = (fieldName, value) => {
    setSignupState((signupState) => ({
      ...signupState,
      [fieldName]: value,
    }));
  };

  const SignupFunction = async () => {
    // Check if all the fields are filled
    if (
      !signupState.email ||
      !signupState.email ||
      !signupState.username ||
      !signupState.password ||
      !signupState.confirmPassword
    ) {
      toast.warn("Please fill all the fields");
      return;
    }

    // Confirm password === confirm Password
    if (signupState.password !== signupState.confirmPassword) {
      toast.warn("Password doesn't match");
      return;
    }

    try {
      const emailOrUsername = signupState.email || signupState.username;
      const password = signupState.password;
      const { data } = await axios.post("/v1/signup", signupState, axiosConfig);
      if (!data.success) {
        return toast(data.message);
      }
      toast.success("Registration Successful");
      axios
        .post("/v1/login", { emailOrUsername, password }, axiosConfig)
        .then((res) => {
          if (!res.data?.success) {
            return toast(data.message);
          }
          if (data) {
            const { avatar, name, username } = res.data;
            console.log(data);
            localStorage.setItem(
              "user",
              JSON.stringify({ avatar, name, username })
            );
            setTimeout(() => {
              navigate("/home");
            }, 3000);
          }
        })
        .catch((e) => {
          navigate("/");
        });
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data.message);
      return;
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={true}
      />
      <div className="flex flex-col gap-y-2 h-96 w-80 border-2 justify-center items-center border-gray-600 rounded-md p-4 ">
        <h2 className="text-center font-semibold text-3xl mb-1">{title}</h2>
        <input
          placeholder="Email"
          className="rounded-md min-w-36 h-8 px-2 text-md"
          value={signupState.email}
          onChange={(e) => handleValueChange("email", e.target.value)}
        />
        <input
          placeholder="Name"
          className="rounded-md min-w-36 h-8 px-2 text-md"
          value={signupState.name}
          onChange={(e) => handleValueChange("name", e.target.value)}
        />
        <input
          placeholder="Username"
          className="rounded-md min-w-36 h-8 px-2 text-md"
          value={signupState.username}
          onChange={(e) => handleValueChange("username", e.target.value)}
        />
        <input
          placeholder="Password"
          className="rounded-md min-w-36 h-8 px-2 text-md"
          value={signupState.password}
          type="password"
          onChange={(e) => handleValueChange("password", e.target.value)}
        />
        <input
          placeholder="Confirm Password"
          className="rounded-md min-w-36 h-8 px-2 text-md"
          value={signupState.confirmPassword}
          type="password"
          onChange={(e) => handleValueChange("confirmPassword", e.target.value)}
        />
        <div className="py-2">
          <p className="text-xs text-center">
            By signing up, you agree to our Terms , Privacy Policy and Cookies
            Policy .
          </p>
        </div>
        <button
          className="rounded-md bg-first hover:bg-second px-3 py-1"
          onClick={() => SignupFunction()}
        >
          Sign up
        </button>
        <div className="flex flex-row justify-center items-center gap-2 pt-3">
          <p className="text-xs">Have an account?</p>
          <Link to="/">Login</Link>
        </div>
      </div>
    </>
  );
};

export default Signup;
