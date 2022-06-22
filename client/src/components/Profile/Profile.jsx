import React from "react";
import "./Profile.css";

import ProfilePic from "./profile.jpg";

const Profile = () => {
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
            <h4>Mr. XYZ</h4>
            <div style={{ display: "flex" }}>
              <h5>40 Posts</h5>
              <h5>40 Following</h5>
              <h5>40 Followers</h5>
            </div>
          </div>
        </div>
        <div style={{ display: "flex"}} id="gallery">
          <img src={ProfilePic}/>
          <img src={ProfilePic}/>
          <img src={ProfilePic}/>
          <img src={ProfilePic}/>
        </div>
      </div>
    </>
  );
};

export default Profile;
