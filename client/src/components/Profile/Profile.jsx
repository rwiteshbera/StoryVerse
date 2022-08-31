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
      "responseType": "json",
      "Authorization": token,
    },
  };

  const fetchUserImage = async () => {
    const { data } = await axios.get(
      "http://localhost:5050/mypost",
      axiosConfig
    );
    setMyPhotos(data);
    // console.log(data)
  };

  const deletePost =  (postId, userId) => {
    if(userId === localStorage.getItem("id")) {
     axios.delete(`http://localhost:5050/delete/${postId}`, axiosConfig)
     .then((res) => console.log(res))
     .catch((e) => console.log(e))
    } else {
        console.log("Unable to delete the post!");
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
            return (
              <>
              {/* <span onClick={deletePost()}>Delete</span> */}
                <button onClick={() => deletePost(item._id, item.postedBy)}>Delete</button>
                <img src={item.photo} key={key} />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Profile;
