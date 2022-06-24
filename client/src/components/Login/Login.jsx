import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import "./Login.css";


const Login = () => {
  return (
    <>
      <form>
        <input type="email" placeholder='email'></input>
        <input type="password" placeholder='password'></input>
        <button type='submit'>Login</button>
      <Link to="/signup"><div>Don't Have an account?</div></Link>
      </form>
    </>
  )
}

export default Login