import React from 'react'
import { Navigate } from 'react-router-dom'

const NotFound = () => {
  return (
    // <div><h1>NotFound</h1></div>
    <Navigate to="/" /> // It will navigate to the Homepage
  )
}

export default NotFound