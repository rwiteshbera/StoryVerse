import React from "react";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Box,
  useToast,
  FormHelperText,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

const ForgetPassword = () => {
  const toast = useToast();

  const [email, setEmail] = useState();
  const [isEmpty, setIsEmpty] = useState(false);

  const emailHandler = (e) => {
    setEmail(e.target.value);
    e.target.value === "" ? setIsEmpty(true) : setIsEmpty(false);
  };
  const sendResetLink = async () => {
    const axiosConfig = {
      headers: {
        "Content-type": "application/json",
      },
    };

    if (!isEmpty) {
      const { data } = await axios.post(
        "http://localhost:5050/reset_password",
        { email },
        axiosConfig
      );

      toast({
        position: "bottom-left",
        render: () => (
          <Box color="white" p={3} bg="blue.500">
            Reset link has been sent to your email.
          </Box>
        ),
      });
    }
  };

  return (
    <>
      <Center w="50vmax" m="auto" marginTop="15%">
        <FormControl isInvalid={isEmpty}>
          <FormLabel textAlign="center">Email</FormLabel>
          <Input type="email" value={email} onChange={(e) => emailHandler(e)} />
          {!isEmpty ? (
            <FormHelperText textAlign="center">
              Enter the email and we'll send you a link to get back into your
              account.
            </FormHelperText>
          ) : (
            <FormErrorMessage>Email is required.</FormErrorMessage>
          )}
        </FormControl>
      </Center>
      <Center marginTop="10px">
        <Button onClick={sendResetLink}>Send Reset Link</Button>
      </Center>
    </>
  );
};

export default ForgetPassword;
