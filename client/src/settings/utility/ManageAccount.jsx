import React from "react";
import { Box, Button, Flex, Spacer, Text } from "@chakra-ui/react";

const ManageAccount = () => {
  return (
    <>
      {" "}
      <Text fontSize="2xl" fontWeight="semibold">
        Edit Profile
      </Text>
      <Box margin={"1rem 0rem"} padding="2 0">
        <Flex alignItems="center" marginBottom="10">
          <Box>
            <Text fontSize="1xl" fontWeight="semibold">
              Temporarily Deactivate Your account
            </Text>
            <Text fontSize="xs" fontWeight="semibold" color="#aeb1c1">
              This means your account will be hidden until you reactivate it by
              logging back in.
            </Text>
          </Box>
          <Spacer />
          <Button colorScheme='teal' size='sm' padding="5px 2.5vmin">Deactivate</Button>
        </Flex>
        <Flex alignItems="center">
          <Box>
            <Text fontSize="1xl" fontWeight="semibold">
              Delete Account
            </Text>
            <Text fontSize="xs" fontWeight="semibold" color="#aeb1c1">
              If you deleted your account, you may not be able to recover the
              data in your account.
            </Text>
          </Box>
          <Spacer />
          <Button colorScheme="red" size='sm'>Delete</Button>
        </Flex>
      </Box>
    </>
  );
};

export default ManageAccount;
