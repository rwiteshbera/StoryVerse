import React from 'react'
import "./Home.css";
import imageFile from "./Image.png";

const Home = () => {
  return (
    <div className='home'>
      <div className='card home-card'>
        <h5>Rwitesh</h5>
        <div className='card-image'>
          <img src={imageFile} alt='image'/>
        </div>
        <div className='card-content'>
          <button className='like-btn'>Like</button>
          <p>This is amazing post</p>
          <input type="text" placeholder='Add comment'/>
        </div>
      </div>
    </div>
  )
}

export default Home