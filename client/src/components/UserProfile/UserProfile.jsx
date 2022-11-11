import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import "./UserProfile.css";
import Navbar from "../Navbar/Navbar";
import {
  Box,
  Center,
  Flex,
  Image,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  List,
  ListItem,
} from "@chakra-ui/react";

// import ProfilePic from "./profile.jpg";

const Profile = () => {
  let navigate = useNavigate();

  const [userPhotos, setUserPhotos] = useState([]); // User's posts
  const [userData, setUserData] = useState({}); // User's data : _id, name, email

  // Chakra Modal Open Close Handler
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [following, setFollowing] = useState(0);
  const [followers, setFollowers] = useState(0);

  const [myFollowingDetails, setMyFollowingDetails] = useState([]);
  const [myFollowersDetails, setMyFollowersDetails] = useState([]);
  // Modal State
  const [modalHeaderText, setModalHeaderText] = useState();

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
      if (id === userid) navigate("/profile");

      const { data } = await axios.get(
        `/user/${userid}`,
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
      .put("/follow", { followId: id }, axiosConfig)
      .then((res) => {
        fetchUserImage();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const unFollowUser = (id) => {
    axios
      .put("/unfollow", { unfollowId: id }, axiosConfig)
      .then((res) => {
        fetchUserImage();
        onClose();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const getFollowing = async () => {
    const info = await axios.post(
      `/get_following`,
      { following },
      axiosConfig
    );
    setMyFollowingDetails(info.data.users);
  };

  const getFollowers = async () => {
    const info = await axios.post(
      `/get_followers`,
      { followers },
      axiosConfig
    );
    setMyFollowersDetails(info.data.users);
  };

  const modalHandler = (e) => {
    try {
      if (e === "profile_photo") {
        setModalHeaderText("Change Profile Photo");
      } else if (e === "following") {
        setModalHeaderText("Following");
        getFollowing();
      } else if (e === "followers") {
        setModalHeaderText("Followers");
        getFollowers();
      } else if (e === "Unfollow_Modal") {
        setModalHeaderText("Unfollow");
      }
    } catch (e) {
      console.log(e);
    } finally {
      onOpen();
    }
  };

  useEffect(() => {
    fetchUserImage();
  }, [userid]);

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
                <Text
                  fontSize="2xl"
                  onClick={() => modalHandler("following")}
                  cursor={"pointer"}
                >
                  {following.length} Following
                </Text>
                <Text
                  fontSize="2xl"
                  onClick={() => modalHandler("followers")}
                  cursor={"pointer"}
                >
                  {followers.length} Followers
                </Text>
              </Flex>
            </Box>
            {userid === id ? (
              <></>
            ) : (
              <Flex marginLeft={"2rem"} marginTop={"1rem"} gap={"1.1em"}>
                {userData.followers?.includes(id) ? (
                  <Button
                    onClick={() => {
                      modalHandler("Unfollow_Modal");
                    }}
                    colorScheme={"blue"}
                  >
                    following
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      followUser(userData._id);
                    }}
                    colorScheme={"green"}
                  >
                    Follow
                  </Button>
                )}
              </Flex>
            )}
          </Box>
        </Flex>
      </Center>
      <Center margin={"4rem 15%"}>
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

      {/* Followers and Following List  */}
      {/* Change Profile Photo  */}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {modalHeaderText !== "Unfollow"
              ? modalHeaderText
              : `${modalHeaderText} @${userData.username}?`}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* If you have triggered Change Profile Photo  */}
            {/* Self-invoking javascript function is used here that renders dynamic content on the modal box */}
            {(function () {
              switch (modalHeaderText) {
                case "Following":
                  return (
                    <List spacing={3} marginTop={"2"} marginBottom={"2"}>
                      {myFollowingDetails.map((item, key) => {
                        return (
                          <Link to={`/profile/${item._id}`} key={key}>
                            <ListItem marginBottom={"0.5rem"}>
                              <Flex gap={"0 1rem"}>
                                <Image
                                  src={item.profilePhoto}
                                  w={"30px"}
                                  borderRadius={"50%"}
                                />
                                <Text>{item.username}</Text>
                              </Flex>
                            </ListItem>
                          </Link>
                        );
                      })}
                    </List>
                  );

                case "Followers":
                  return (
                    <List spacing={3} marginTop={"2"} marginBottom={"2"}>
                      {myFollowersDetails.map((item, key) => {
                        return (
                          <Link to={`/profile/${item._id} `} key={key}>
                            <ListItem marginBottom={"0.5rem"}>
                              <Flex gap={"0 1rem"}>
                                <Image
                                  src={item.profilePhoto}
                                  w={"30px"}
                                  borderRadius={"50%"}
                                />
                                <Text>{item.username}</Text>
                              </Flex>
                            </ListItem>
                          </Link>
                        );
                      })}
                    </List>
                  );

                case "Unfollow":
                  return (
                    <Center marginBottom={"1rem"}>
                      <Flex gap={"0.5rem"}>
                        <Button
                          onClick={() => unFollowUser(userData._id)}
                          colorScheme={"red"}
                        >
                          Unfollow
                        </Button>

                        <Button onClick={onClose} backgroundColor={"#aeb1c1"}>
                          Cancel
                        </Button>
                      </Flex>
                    </Center>
                  );
              }
            })()}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profile;
