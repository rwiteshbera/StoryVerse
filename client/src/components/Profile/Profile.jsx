import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import "./Profile.css";

import ProfilePic from "./profile.jpg";

const Profile = () => {
  const [myPhotos, setMyPhotos] = useState([]);
 

  let token = localStorage.getItem("token");
  let userName = localStorage.getItem("user");

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      responseType: "json",
      Authorization: token,
    },
  };

  const fetchUserImage = async () => {
    const { data } = await axios.get(
      "http://localhost:5050/mypost",
      axiosConfig
    );
    setMyPhotos(data);
    // console.log(photos.data)
  };


  useEffect(() => {
    fetchUserImage();
  }, []);

  return (
    <>
      <div>
        <div style={{ display: "flex" }}>
          <img
            id="profile-image"
            src={ProfilePic}
            style={{ borderRadius: "50%", margin: "2rem 4rem" }}
          />

          <div>
            <h4>{userName}</h4>
            <div style={{ display: "flex" }}>
              <h5>40 Posts</h5>
              <h5>40 Following</h5>
              <h5>40 Followers</h5>
            </div>
          </div>
        </div>

        <div style={{ display: "flex" }} id="gallery">
          {myPhotos.map((item, key) => {
            return <img src={item.photo}
             key={key} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Profile;
