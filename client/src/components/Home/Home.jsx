import React, { useState } from "react";
import { useEffect } from "react";
import "./Home.css";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { Box, Button, Flex, Image, Spacer, Text } from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

const Home = () => {
  const [feedData, setFeedData] = useState([]);
  let token = localStorage.getItem("token");
  let loggedIn_userId = localStorage.getItem("id");

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      Authorization: token,
    },
  };

  // Post like handler
  const likePost = (id) => {
    axios
      .put("/like", { postId: id }, axiosConfig)
      .then((res) => {
        getFeedPosts();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Post unlike handler
  const unLikePost = (id) => {
    axios
      .put("/unlike", { postId: id }, axiosConfig)
      .then((res) => {
        getFeedPosts();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // Get feed posts handler
  const getFeedPosts = () => {
    try {
      axios.get("/feedposts", axiosConfig).then((res) => {
        setFeedData(res.data?.posts.reverse());
      });
    } catch (e) {
      console.log("Unable to fetch latest posts.");
    }
  };
  useEffect(() => {
    getFeedPosts();
  }, []);

  return (
    <>
      <Navbar className="home" />
      <Flex className="card home-card" flexFlow={"column"} gap={"0.6rem"}>
        {feedData.map((item, key) => {
          return (
            <Box
              className="card"
              w={"32vw"}
              border={"2px solid #efefef"}
              borderRadius={"1.5%"}
              key={key}
            >
              <Flex padding={"0.5rem 0.8rem"}>
                <Link to={`/profile/${item.postedBy._id}`}>
                  {" "}
                  <Image
                    src={item.postedBy.profilePhoto}
                    w={"1.5rem"}
                    borderRadius={"50%"}
                    marginRight={"1em"}
                  />
                </Link>
                <Link to={`/profile/${item.postedBy._id}`}>
                  <Text>{item.postedBy.name}</Text>
                </Link>
              </Flex>

              <Image src={item.photo} />
              <Box padding={"0.2rem 0.8rem"}>
                <Text>{item.captions}</Text>
                <Flex>
                  <Text>{item.likes.length} Likes</Text>
                
                  <Flex margin={"0.3rem 1rem"}>
                    {item.likes.includes(loggedIn_userId) ? (
                      <FaHeart
                        onClick={() => unLikePost(item._id)}
                        cursor={"pointer"}
                        color="red"
                      />
                    ) : (
                      <FiHeart
                        onClick={() => likePost(item._id)}
                        cursor={"pointer"}
                      />
                    )}
                    <br/>
                     
                  </Flex>
                  <Text><b>Comments</b></Text>
                </Flex>
              </Box>
            </Box>
          );
        })}
      </Flex>
    </>
  );
};

export default Home;
