import React from 'react'
import Post from './components/Post'

const Feed = () => {
  return (
    <div className='col-span-3'>
        <Post />
        <Post />
        <Post />
        <Post />
    </div>
  )
}

export default Feed