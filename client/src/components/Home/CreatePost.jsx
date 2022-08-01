import React from "react";
import { useState } from "react";
import "./CreatePost.css";
import axios from "axios";

const CreatePost = () => {
  const [captions, setCaptions] = useState("");
  const [image, setImage] = useState();
  const [url, setUrl] = useState("");
  let token = localStorage.getItem("token");


  const Upload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "social_media_cloudinary");
    data.append("cloud_name", "dflvpcsin");

    const axiosConfig = {
      headers: {
        "Content-type": "application/json",
        "Authorization": token
      },
    };

    try {
      const imageInfo = await axios.post(
        "https://api.cloudinary.com/v1_1/dflvpcsin/image/upload",
        data
      );

      setUrl(imageInfo.data.secure_url);

      const  info  = await axios.post(
        "http://localhost:5050/createPost",
        { captions, url },
        axiosConfig
      );

      console.log("SUCCESS");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <div className="card input-filled">
        <input
          type="text"
          placeholder="Add Caption"
          value={captions}
          onChange={(e) => setCaptions(e.target.value)}
        />
        <input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" className="createPost" onClick={Upload}>
          Upload
        </button>
      </div>
    </>
  );
};

export default CreatePost;
