import React from "react";
import {
  Box,
  Button,
  Flex,
  Spacer,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  FormErrorMessage,
  FormControl,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageAccount = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  let navigate = useNavigate();

  const [modalHeader, setModalHeaderText] = useState();
  const [modalBody, setModalBodyText] = useState();
  const [modalButtonText, setModalButtonText] = useState();
  const [password, setPassword] = useState();
  const [isPasswordEmpty, setIsPasswordEmpty] = useState(true);

  let token = localStorage.getItem("token");

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      responseType: "json",
      Authorization: token,
    },
  };

  const deleteAccountModalHandler = () => {
    setModalHeaderText("Delete your account");
    setModalBodyText(
      "If you deleted your account, you may not be able to recover the data in your account."
    );
    setModalButtonText("Delete");
    onOpen();
  };

  const deactivateAccountModalHandler = () => {
    try {
      setModalHeaderText("Deactivate your account");
      setModalBodyText(
        "This means your account will be hidden until you reactivate it by logging back in."
      );
      setModalButtonText("Deactivate");
    } catch (e) {
      console.log(e);
    } finally {
      onOpen();
    }
  };

  // Deactivate or Delete Account
  const deactivateOrDelete = async () => {
    // If password isn't empty
    if (!isPasswordEmpty) {
      try {
        const { data } = await axios.post(
          `/settings/manage&account/${modalButtonText.toLowerCase()}`,
          {password},
          axiosConfig
        );
        console.log(data)
        localStorage.clear();
        navigate("/login");
      } catch (e) {
        console.log(e);
      }
    }
  };

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
          <Button
            colorScheme="teal"
            size="sm"
            padding="5px 2.5vmin"
            onClick={deactivateAccountModalHandler}
          >
            Deactivate
          </Button>
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
          <Button
            colorScheme="red"
            size="sm"
            onClick={deleteAccountModalHandler}
          >
            Delete
          </Button>
        </Flex>
      </Box>
      {/* Modal for confirmation to delete or deactivate account  */}
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalHeader}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {modalBody}
            <FormControl isInvalid={isPasswordEmpty}>
              <Input
                marginTop="1em"
                value={password}
                type="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  e.target.value !== ""
                    ? setIsPasswordEmpty(false)
                    : setIsPasswordEmpty(true);
                }}
                placeholder="Confirm password"
              />
              {isPasswordEmpty ? (
                <FormErrorMessage>Enter your password</FormErrorMessage>
              ) : (
                <></>
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={deactivateOrDelete}>
              {modalButtonText}
            </Button>
            <Button
              onClick={() => {
                onClose();
                setPassword(""); // Delete the password if you close the modal
              }}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ManageAccount;
