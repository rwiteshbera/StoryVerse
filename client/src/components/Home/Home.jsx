import React, { useState } from "react";
import { useEffect } from "react";
import "./Home.css";
import imageFile from "./Image.png";
import axios from "axios";

const Home = () => {
  const [feedData, setFeedData] = useState([]);
  let token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
  };

  const likePost = (id) => {
    axios
      .put("http://localhost:5050/like", { postId: id }, axiosConfig)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const unLikePost = (id) => {
    axios
      .put("http://localhost:5050/unlike", { postId: id }, axiosConfig)
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    axios.get("http://localhost:5050/allposts", axiosConfig).then((res) => {
      setFeedData(res.data.posts);
    });
  }, []);

  return (
    <div className="home">
      <div className="card home-card">
        {feedData.map((item, key) => {
          return (
            <>
              {/* <h5>{item.postedBy.name}</h5> */}
              <div className="card-image">
                <img src={item.photo} alt="image" />
              </div>
              <div className="card-content">
                {item.likes.length} Likes
                <button className="like-btn" onClick={() => likePost(item._id)}>
                  Like
                </button>
                <button
                  className="unlike-btn"
                  onClick={() => unLikePost(item._id)}
                >
                  Unlike
                </button>
                <p>{item.captions}</p>
              </div>
            </>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
