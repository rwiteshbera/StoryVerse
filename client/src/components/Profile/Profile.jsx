import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

import "./Profile.css";
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

const Profile = () => {
  let navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [myName, setMyName] = useState();
  const [myProfilePhoto, setMyProfilePhoto] = useState();
  const [profilePicState, setProfilePicState] = useState();
  const [myPhotos, setMyPhotos] = useState([]);
  const [myFollowing, setMyFollowing] = useState([]);
  const [myFollowers, setMyFollowers] = useState([]);

  const [myFollowingDetails, setMyFollowingDetails] = useState([]);
  const [myFollowersDetails, setMyFollowersDetails] = useState([]);

  // Modal State
  const [modalHeaderText, setModalHeaderText] = useState();

  let token = localStorage.getItem("token");
  let userid = localStorage.getItem("id");

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
    setMyPhotos(data.reverse());
  };

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get("http://localhost:5050/me", axiosConfig);
      setMyName(data.name);
      setMyFollowing(data.following);
      setMyFollowers(data.followers);
      setMyProfilePhoto(data.profilePhoto);
    } catch (e) {
      console.log(e);
    }
  };

  const deletePost = async (postId, userId) => {
    if (userId === localStorage.getItem("id")) {
      const res = await axios.delete(
        `http://localhost:5050/delete/${postId}`,
        axiosConfig
      );
      console.log("Deleted");
    } else {
      console.log("Unable to delete the post!");
    }
  };

  const changeProfilePhoto = () => {
    const axiosConfig = {
      headers: {
        "Content-type": "multipart/form-data",
        Authorization: token,
      },
    };

    try {
      const imageData = new FormData();
      imageData.append("file", profilePicState);
      axios
        .patch(
          "http://localhost:5050/change_profile_pic",
          imageData,
          axiosConfig
        )
        .then((data) => {
          return console.log(data);
        })
        .catch((e) => {
          return console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const getFollowing = async () => {
    const info = await axios.post(
      `http://localhost:5050/get_following`,
      { following: myFollowing },
      axiosConfig
    );
    setMyFollowingDetails(info.data.users);
  };

  const getFollowers = async () => {
    try {
      const info = await axios.post(
        `http://localhost:5050/get_followers`,
        { followers: myFollowers },
        axiosConfig
      );
      setMyFollowersDetails(info.data.users);
    } catch (e) {
      console.log(e);
    } finally {
      console.log(myFollowersDetails);
    }
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
      }
    } catch (e) {
      console.log(e);
    } finally {
      onOpen();
    }
  };

  useEffect(() => {
    fetchUserImage();
    fetchUserData();
  }, [myProfilePhoto]); // Re-render when profile photo has been updated or uploaded new pics
  return (
    <>
      <Navbar />
      <Center marginTop={"1rem"}>
        <Flex>
          <Image
            src={myProfilePhoto}
            w={"10rem"}
            borderRadius={"50%"}
            onClick={() => modalHandler("profile_photo")}
            cursor={"pointer"}
          />
          <Box>
            <Text fontSize="4xl" fontWeight={"bold"} margin={"0.2rem 2rem"}>
              {myName}
            </Text>
            <Box>
              <Flex gap={"2rem"} marginLeft={"2rem"}>
                <Text fontSize="2xl">{myPhotos.length} Posts</Text>
                <Text
                  fontSize="2xl"
                  onClick={() => modalHandler("following")}
                  cursor={"pointer"}
                >
                  {myFollowing.length} Following
                </Text>
                <Text
                  fontSize="2xl"
                  onClick={() => modalHandler("followers")}
                  cursor={"pointer"}
                >
                  {myFollowers.length} Followers
                </Text>
              </Flex>
            </Box>
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
          {myPhotos.map((item, key) => {
            return (
              <Image src={item.photo} w={"30%"} key={key} />
              // <>
              //   <button onClick={() => deletePost(item._id, item.postedBy)}>
              //     Delete
              //   </button>
              //   <img src={item.photo} key={item._id} />
              // </>
            );
          })}
        </Flex>
      </Center>

      {/* Change Profile Photo  */}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeaderText}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* If you have triggered Change Profile Photo  */}
            {/* Self-invoking javascript function is used here that renders dynamic content on the modal box */}
            {(function () {
              switch (modalHeaderText) {
                case "Change Profile Photo":
                  return (
                    <input
                      type="file"
                      name=""
                      id=""
                      onChange={(e) => setProfilePicState(e.target.files[0])}
                    />
                  );

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
              }
            })()}
          </ModalBody>

          {modalHeaderText === "Change Profile Photo" ? (
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button colorScheme="green" onClick={changeProfilePhoto}>
                Update
              </Button>
            </ModalFooter>
          ) : (
            <></>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profile;
