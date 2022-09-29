import React from "react";
import { Text, Box, Flex } from "@chakra-ui/react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const PrivacySecurity = () => {
  const [password, setPassowrd] = useState();
  let token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      responseType: "json",
      Authorization: token,
    },
  };

  return (
    <>
      <Text fontSize="2xl" fontWeight="semibold">
        Privacy and Security
      </Text>

      <Box margin={"0.5rem 0rem"} padding="2 0">
        {password}
      </Box>
    </>
  );
};

export default PrivacySecurity;
