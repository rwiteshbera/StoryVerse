import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'

const LoginActivity = () => {
  const fetchData= async()=> {
    await axios.get()
  }
  useEffect(() => {
    fetchData();
  }, [])

  return (
    <div>LoginActivity</div>
  )
}

export default LoginActivity