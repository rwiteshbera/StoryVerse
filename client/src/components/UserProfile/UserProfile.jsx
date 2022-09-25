import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";
import "./UserProfile.css";
import Navbar from "../Navbar/Navbar";

import { Box, Center, Flex, Image, Text, Button } from "@chakra-ui/react";

// import ProfilePic from "./profile.jpg";

const Profile = () => {
  const [userPhotos, setUserPhotos] = useState([]); // User's posts
  const [userData, setUserData] = useState({}); // User's data : _id, name, email

  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);

  let token = localStorage.getItem("token");
  let id = localStorage.getItem("id");

  const { userid } = useParams();

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      responseType: "json",
      Authorization: token,
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
      setFollowers(data.user.followers);
      setFollowing(data.user.following);
    } catch (e) {
      console.log(e);
    }
  };

  const followUser = (id) => {
    axios
      .put("http://localhost:5050/follow", { followId: id }, axiosConfig)
      .then((res) => {
        fetchUserImage();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const unFollowUser = (id) => {
    axios
      .put("http://localhost:5050/unfollow", { unfollowId: id }, axiosConfig)
      .then((res) => {
        fetchUserImage();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    fetchUserImage();
  }, []);

  return (
    <>
      <Navbar />
      <Center marginTop={"1rem"}>
        <Flex>
          <Image
            src={userData.profilePhoto}
            w={"10rem"}
            borderRadius={"50%"}
            cursor={"pointer"}
          />
          <Box>
            <Text fontSize="4xl" fontWeight={"bold"} margin={"0.2rem 2rem"}>
              {userData.name}
            </Text>
            <Box>
              <Flex gap={"2rem"} marginLeft={"2rem"}>
                <Text fontSize="2xl">{userPhotos.length} Posts</Text>
                <Text fontSize="2xl">{following.length} Following</Text>
                <Text fontSize="2xl">{followers.length} Followers</Text>
              </Flex>
            </Box>
            {userid === id ? (
              <></>
            ) : (
              <Flex marginLeft={"2rem"} marginTop={"1rem"} gap={"1.1em"}>
                <Button
                  onClick={() => {
                    followUser(userData._id);
                  }}
                  colorScheme={"green"}
                >
                  Follow
                </Button>
                <Button
                  onClick={() => {
                    unFollowUser(userData._id);
                  }}
                  colorScheme={"red"}
                >
                  Unfollow
                </Button>
              </Flex>
            )}
          </Box>
        </Flex>
      </Center>
      <Center marginTop={"4rem"}>
        <Flex
          gap={"0.5rem"}
          border={"2px solid #e4e6e7"}
          flexWrap={"wrap"}
          padding={"0.4rem"}
          borderRadius="10px"
        >
          {userPhotos.map((item, key) => {
            return <Image src={item.photo} w={"30%"} key={key} />;
          })}
        </Flex>
      </Center>
    </>
  );
};

export default Profile;
