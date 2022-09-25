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
    axios.get("http://localhost:5050/feedposts", axiosConfig).then((res) => {
      setFeedData(res.data.posts.reverse());
    });
  }, []);

  return (
    <>
      <Navbar className="home"/>
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
                        <FiHeart
                          onClick={() => likePost(item._id)}
                          cursor={"pointer"}
                        />
                        <FaHeart
                          onClick={() => unLikePost(item._id)}
                          cursor={"pointer"}
                          color={"red"}
                        />
                      </Flex>
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
