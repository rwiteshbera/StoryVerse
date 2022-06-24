import React, { useState } from "react";
import "./signup.css";
import { Link } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const PostData = () => {
    
  }

  return (
    <>
      <form>
        <input type="text" placeholder="full name" value={name} onChange={(e)=>setName(e.target.value)}></input>
        <input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)}></input>
        <input type="password" placeholder="password" value={password}  onChange={(e)=>setPassword(e.target.value)}></input>
        <button onClick={PostData}>Signup</button>
        <Link to="/login">
          <div>Already have an account?</div>
        </Link>
      </form>
    </>
  );
};

export default Signup;
