import React from "react";
import { useState } from "react";
import "./CreatePost.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Input } from "@chakra-ui/react";

const CreatePost = () => {
  let navigate = useNavigate();

  const [captions, setCaptions] = useState("");
  const [imageToUpload, setImage] = useState();
  let token = localStorage.getItem("token");

  const Upload = () => {
    const axiosConfig = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: token,
      },
    };

    try {
      const imageData = new FormData();
      imageData.append("file", imageToUpload);
      imageData.append("captions", captions);

      axios
        .post("http://localhost:5050/upload", imageData, axiosConfig)
        .then((res) => {
          console.log(res.data);
          navigate("/profile");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="card input-filled">
        <input
          type="text"
          placeholder="Add Caption"
          value={captions}
          onChange={(e) => setCaptions(e.target.value)}
        />
        <Input type="file" onChange={(e) => setImage(e.target.files[0])} />
        <button type="submit" className="createPost" onClick={Upload}>
          Upload
        </button>
      </div>
    </>
  );
};

export default CreatePost;
