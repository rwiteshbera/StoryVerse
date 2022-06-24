import React from 'react'
import "./CreatePost.css";

const CreatePost = () => {
  return (
    <>
        <div className='card input-filled'>
           <form>
           <input type="text" placeholder='Add Caption'/>
            <input type="file"/>
            <button type='submit' className='createPost'>Upload</button>
           </form>
        </div>
    </>
  )
}

export default CreatePost