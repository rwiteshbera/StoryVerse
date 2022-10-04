import React from "react";
import {
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState();
  co

  return (
    <>
      <Center w="50vmax" m="auto" marginTop="15%">
        <FormControl>
          <FormLabel textAlign="center">Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
      </Center>
      <Center marginTop="10px">
        <Button>Send Reset Link</Button>
      </Center>
    </>
  );
};

export default ForgetPassword;
