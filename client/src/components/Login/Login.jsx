import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import "./Login.css";
import axios from "axios";
import { useNavigate } from 'react-router-dom';


const Login = () => {
  let navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const LoginUser = async () => {
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
      console.log("Logged in successfully!")
      localStorage.setItem("token", `Bearer ${data.token}`)
      localStorage.setItem("user", `${data.name}`)
      localStorage.setItem("id", `${data.userId}`)

      navigate('/');

      Notification.requestPermission().then(perm => {
        if(perm === 'granted') {
          new Notification("Logged in");
        }
      })
      
    } catch (error) {
      console.log("ERROR" + error);
    }
  }

  useEffect(() => {
    Notification.requestPermission();
  },[])

  return (
    <>
        <input type="email" placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <input type="password" placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)}></input>
        <button onClick={LoginUser}>Login</button>
      <Link to="/signup"><div>Don't Have an account?</div></Link>
    </>
  )
}

export default Login