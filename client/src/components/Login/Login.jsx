import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser } from "react-icons/fa";
import { GrMail } from "react-icons/gr";
import {Text} from "@chakra-ui/react"

import Social_Bio from "./images/social_bio.svg";
import Social_Share from "./images/social_share.svg";

const Login = () => {
  let navigate = useNavigate();
  // Login State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signUpMode, setSignUpMode] = useState(false);

  // Signup State
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
    },
  };

  // Login user
  const LoginUser = async () => {
    if (!email || !password) {
      return;
    } else {
      try {
        const { data } = await axios.post(
          "http://localhost:5050/signin",
          { email, password },
          axiosConfig
        );
        console.log("Logged in successfully!");
        localStorage.setItem("token", `Bearer ${data.token}`);
        localStorage.setItem("user", `${data.name}`);
        localStorage.setItem("id", `${data.userId}`);

        navigate("/");

        Notification.requestPermission().then((perm) => {
          if (perm === "granted") {
            new Notification("Logged in");
          }
        });
      } catch (err) {
        console.log("ERROR" + err);
      } finally {
        setEmail("");
        setPassword("");
      }
    }
  };

  // Register as a new user
  const Signup = async () => {
    try {
      if (!name || !username || !email || !password) {
        return;
      }

      const { data } = await axios.post(
        "http://localhost:5050/signup",
        { name, username, email, password },
        axiosConfig
      );

      console.log(JSON.stringify(data));
      // navigate("/");

      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification("Registered");
        }
      });
    } catch (error) {
      console.log("ERROR" + error);
    } finally {
      setName("");
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  const signup_handler = () => {
    setSignUpMode(true);
  };

  const login_handler = () => {
    setSignUpMode(false);
  };

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  return (
    <>
      <div className={signUpMode ? "container sign-up-mode" : "container"}>
        <div className="forms-container">
          <div className="login-signup">

            {/* Login */}
            <div className="log-in-form">
              <h2 className="title">Login</h2>
              <div className="input-field">
                <FaUser className="i" />
                <input
                  type="text"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <FaLock className="i" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button onClick={LoginUser} className="btn login">
                Login
              </button>
              <Link to="/forget_password"><Text color="black" cursor="pointer" textDecoration="underline">Forget Password</Text></Link>
            </div>

            {/* Signup  */}
            <div action="" className="sign-up-form">
              <h2 className="title">Signup</h2>
              <div className="input-field">
                <FaUser className="i" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-field">
                <FaUser className="i" />
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="input-field">
                <GrMail className="i" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <FaLock className="i" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button onClick={Signup} type="submit" className="btn signup">
                Signup
              </button>
            </div>
          </div>
        </div>

        <div className="panels-container">
          <div className="panel left-panel">
            <div className="content">
              <h3>New here?</h3>
              <p>Don't Have an account?</p>
              <button
                className="btn btn-transparent"
                id="sign-up-btn"
                onClick={signup_handler}
              >
                Signup
              </button>
            </div>
            <img src={Social_Bio} className="image" />
          </div>
          <div className="panel right-panel">
            <div className="content">
              <h3>One of us?</h3>
              <p>Already have an account?</p>
              <button
                className="btn btn-transparent"
                id="log-in-btn"
                onClick={login_handler}
              >
                Login
              </button>
            </div>
            <img src={Social_Share} className="image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
