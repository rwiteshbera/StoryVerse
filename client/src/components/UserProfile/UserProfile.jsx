import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./UserProfile.css";

// import ProfilePic from "./profile.jpg";

const Profile = () => {
  const [userPhotos, setUserPhotos] = useState([]); // User's posts
  
  const [userData, setUserData] = useState({}); // User's data : _id, name, email

  let token = localStorage.getItem("token");

  const {userid}  = useParams();

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      "responseType": "json",
    //   "Authorization": token,
    },
  };

  const fetchUserImage = async () => {
    try {
        const { data } = await axios.get(
            `http://localhost:5050/user/${userid}`,
            axiosConfig
          );
          setUserPhotos(data.posts);
          setUserData(data.user);
    }catch(e) {
        console.log(e)
    }
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
            
            style={{ borderRadius: "50%", margin: "2rem 4rem" }}
          />

          <div>
            <h4>{userData.name}</h4>
            <div style={{ display: "flex", gap: "1rem"}}>
              <h5>Post: {userPhotos.length}</h5>
              <h5>40 Following</h5>
              <h5>40 Followers</h5>
            </div>
          </div>
        </div>

        <div style={{ display: "flex" }} id="gallery">
          {userPhotos.map((item, key) => {
            return (
              <>
                <img src={item.photo} key={item._id} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Profile;
