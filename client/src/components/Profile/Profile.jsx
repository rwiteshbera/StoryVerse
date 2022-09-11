import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import "./Profile.css";

const Profile = () => {
  const [myName, setMyName] = useState();
  const [myProfilePhoto, setMyProfilePhoto] = useState();
  const [profilePicState, setProfilePicState] = useState();
  const [myPhotos, setMyPhotos] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const [myFollowers, setMyFollowers] = useState([]);

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
    console.log(data);
  };

  const fetchUserData = async () => {
    try{
      const { data } = await axios.get("http://localhost:5050/me", axiosConfig);
    setMyName(data.name);
    setMyFollowing(data.following);
    setMyFollowers(data.followers);
    setMyProfilePhoto(data.profilePhoto);
    } catch(e) {
      console.log(e);
    } finally {
      // console.log(myProfilePhoto)
    }
  };

  const deletePost = (postId, userId) => {
    if (userId === localStorage.getItem("id")) {
      axios
        .delete(`http://localhost:5050/delete/${postId}`, axiosConfig)
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
    } else {
      console.log("Unable to delete the post!");
    }
  };

  const changeProfilePhoto = async () => {
    const data = new FormData();
    data.append("file", profilePicState);
    data.append("upload_preset", "social_media_cloudinary");
    data.append("cloud_name", "dflvpcsin");

    const axiosConfig = {
      headers: {
        "Content-type": "application/json",
        Authorization: token,
      },
    };

    try {
      const imageInfo = await axios.post(
        "https://api.cloudinary.com/v1_1/dflvpcsin/image/upload",
        data
      );
      
      const info = await axios.patch(
        "http://localhost:5050/change_profile_pic",
        { profilePicURL: imageInfo.data.secure_url },
        axiosConfig
      );

      setMyProfilePhoto(imageInfo.data.secure_url);

    } catch (error) {
      console.log(error);
    } 
  };

  useEffect(() => {
    fetchUserImage();
    fetchUserData();
  }, [myProfilePhoto, myPhotos]); // Re-render when profile photo has been updated or uploaded new pics

  return (
    <>
      <div>
        <div style={{ display: "flex" }}>
          <input
            type="file"
            onChange={(e) => setProfilePicState(e.target.files[0])}
          />

          <img
            id="profile-image"
            src={myProfilePhoto}
            style={{ borderRadius: "50%", margin: "2rem 4rem" }}
            onClick={changeProfilePhoto}
          />

          <div>
            <h4>{myName}</h4>
            <div style={{ display: "flex", gap: "2rem" }}>
              <h5>{myPhotos.length} Posts</h5>
              <h5>{myFollowing.length} Following</h5>
              <h5>{myFollowers.length} Followers</h5>
            </div>
          </div>
        </div>

        <div style={{ display: "flex" }} id="gallery">
          {myPhotos.map((item, key) => {
            return (
              <>
                <button onClick={() => deletePost(item._id, item.postedBy)}>
                  Delete
                </button>
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
