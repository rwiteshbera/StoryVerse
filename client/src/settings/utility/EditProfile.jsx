import React, { useState } from "react";
import {
  Text,
  Box,
  Input,
  FormLabel,
  Divider,
  Select,
  Button,
  Stack,
  Flex,
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";
import { useEffect } from "react";
import axios from "axios";

const EditProfile = () => {
  const [name, setName] = useState();
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [gender, setGender] = useState();

  // Check whether user has changed any state or not
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [isUsernameChanged, setIsUsernameChanged] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [isGenderChanged, setIsGenderChanged] = useState(false);

  const [isEmpty, setIsEmpty] = useState(false);
  const [isUsernameTaken, setIsUsernameTaken] = useState(false);
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);

  let token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      responseType: "json",
      Authorization: token,
    },
  };

  const saveChanges = () => {
    if (name && username && email && gender) {
      setIsEmpty(false);

      // if name or gender changed, then only call
      if (isNameChanged || isGenderChanged) {
        axios
          .post(
            `/settings/edit&profile/name&gender`,
            { name, gender },
            axiosConfig
          )
          .then((res) => {
            setChangesSaved(true);
          })
          .catch((e) => {
            console.log(e);
          });
      }

       // if username changed, then only call
      if (isUsernameChanged) {
        axios
          .post(
            `/settings/edit&profile/username`,
            { username },
            axiosConfig
          )
          .then((res) => {
            if (res.data.message === 1) {
              setIsUsernameTaken(true);
              setChangesSaved(false);
            } else {
              setIsUsernameTaken(false);
              setChangesSaved(true);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }

      //  // if email changed, then only call
      if (isEmailChanged) {
        axios
          .post(
            `/settings/edit&profile/email`,
            { email },
            axiosConfig
          )
          .then((res) => {
            if (res.data.message === 1) {
              setIsEmailTaken(true);
              setChangesSaved(false);
            } else {
              setIsEmailTaken(false);
              setChangesSaved(true);
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    } else {
      setIsEmpty(true);
    }
  };

  // Fetch setttings data
  const fetchData = async () => {
    try {
      const { data } = await axios.get("/me", axiosConfig);
      setName(data.name);
      setUsername(data.username);
      setEmail(data.email);
      setGender(data.gender);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Text fontSize="2xl" fontWeight="semibold">
        Edit Profile
      </Text>

      <Box margin={"0.5rem 0rem"} padding="2 0">
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setIsNameChanged(true);
          }}
        />
        <Text fontSize="xs">
          Help people to discover your profile by your name.
        </Text>
        <Divider height={5} />
        <FormControl isInvalid={isUsernameTaken}>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setIsUsernameChanged(true);
            }}
          />
          <Text fontSize="xs">
            Username needs to be unique. It can't be longer than 30 characters
            and can only contain letters, numbers, periods, and underscores.
          </Text>
          {isUsernameTaken ? (
            <FormErrorMessage>username is already taken.</FormErrorMessage>
          ) : (
            <></>
          )}
        </FormControl>
        <Divider height={5} />
        <FormControl isInvalid={isEmailTaken}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setIsEmailChanged(true);
            }}
          />
          {isEmailTaken ? (
            <FormErrorMessage>Email is already taken.</FormErrorMessage>
          ) : (
            <></>
          )}
        </FormControl>
        <Divider height={5} />
        <FormLabel>Gender</FormLabel>
        <Select
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            setIsGenderChanged(true);
          }}
        >
          <option value="prefer_not_to_say">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
      </Box>
      <Stack height="3vh"></Stack>
      <Flex>
        <Button colorScheme={"blue"} onClick={saveChanges}>
          Save changes
        </Button>
        <Box margin={"2.5"}>
          {isEmpty ? (
            <>
              <Text fontSize="xs" color="red">
                Field cannot be empty
              </Text>
            </>
          ) : changesSaved ? (
            <>
              <Text fontSize="xs" color="green">
                All changes saved
              </Text>
            </>
          ) : (
            <></>
          )}
        </Box>
      </Flex>
    </>
  );
};

export default EditProfile;
