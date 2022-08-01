import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import "./Login.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const PostData = async () => {
    try {
      if(!email || !password) {
        return;
      }
      const axiosConfig = {
        headers: {
          'Content-type':"application/json"
        }
      }
  
      const {data} = await axios.post('http://localhost:5050/signin', {email, password}, axiosConfig);
  
      localStorage.setItem("token", `Bearer ${data.token}`)

      console.log("Logged in successfully!")

      navigate('/');
    } catch (error) {
      console.log("ERROR" + error);
    }
  }
  return (
    <>
        <input type="email" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button onClick={PostData}>Login</button>
      <Link to="/signup"><div>Don't Have an account?</div></Link>
    </>
  )
}

export default Login