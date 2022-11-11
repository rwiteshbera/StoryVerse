import React from "react";
import {
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [newPassword, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [message, setMessage] = useState(); // response message after rest password action

  let {id, token} = useParams();

  const resetPasswordFunc = async () => {
    const axiosConfig = {
        headers: {
          "Content-type": "application/json",
        },
      };

    const {data} = await axios.post(`/reset_password/${id}/${token}`, {newPassword}, axiosConfig)
    setMessage(data.message)
  }

  return (
    <>
      <Container
        w="50vmax"
        m="auto"
        marginTop="15%"
        border="2px solid grey"
        padding="2rem"
        borderRadius="10px"
      >
        <Center>
          <FormControl>
            <FormLabel textAlign="center">New Password</FormLabel>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormControl>
        </Center>
        <Center marginTop="10px">
          <FormControl>
            <FormLabel textAlign="center">Confirm Password</FormLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>
        </Center>
        <Center marginTop="10px">
          <Button colorScheme="red" onClick={resetPasswordFunc}>Reset Password</Button>
        </Center>
        <Text textAlign="center" marginTop="2em">{message}</Text>
      </Container>
    </>
  );
};

export default ResetPassword;
