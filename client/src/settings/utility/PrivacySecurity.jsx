import React from "react";
import { Text, Box, Flex, Input, Divider, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";

const PrivacySecurity = () => {
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassowrd] = useState();
  const [confirmNewPassword, setConfirmNewPassword] = useState();
  const [updateResponseMessage, setUpdateResponseMessage] = useState();
  const [showUpdateResponse, setShowUpdateResponse] = useState(false);
  const [responseMessageColor, setResponseMessageColor] = useState("red");

  const updatePassword = () => {
    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setShowUpdateResponse(true);
      setUpdateResponseMessage("Input field cannot be empty.");
    } else {
      if (oldPassword === newPassword) {
        setShowUpdateResponse(true);
        setUpdateResponseMessage(
          "New password cannot be same as your old password."
        );
      } else {
        if (newPassword === confirmNewPassword) {
          setShowUpdateResponse(true);
          // Make update password api call

          const token = localStorage.getItem("token");

          const axiosConfig = {
            headers: {
              "Content-type": "application/json",
              responseType: "json",
              Authorization: token,
            },
          };

          axios
            .post(
              `/settings/privacy&security/password`,
              { oldPassword, newPassword },
              axiosConfig
            )
            .then((res) => {
              setShowUpdateResponse(true);
              setResponseMessageColor("green");
              setUpdateResponseMessage(res.data.message);
              localStorage.setItem("token", `Bearer ${res.data.token}`);
              setOldPassword("");
              setNewPassowrd("");
              setConfirmNewPassword("");
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          setShowUpdateResponse(true);
          setUpdateResponseMessage("Confirm your password correctly.");
        }
      }
    }
  };

  return (
    <>
      <Text fontSize="2xl" fontWeight="semibold">
        Privacy and Security
      </Text>

      <Box margin={"0.5rem 0rem"} padding="2 0">
        <Text>Old Password</Text>
        <Input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <Divider h={"5"} />
        <Text>New Password</Text>
        <Input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassowrd(e.target.value)}
        />
        <Divider h={"5"} />
        <Text>Confirm new password</Text>
        <Input
          type="password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
        />
        <Flex>
          <Button marginTop={"5"} onClick={updatePassword}>
            Update
          </Button>
          <Box margin={2.5}>
            {showUpdateResponse ? (
              <>
                <Text
                  fontSize="xs"
                  color={responseMessageColor}
                  marginTop={2.5}
                >
                  {updateResponseMessage}
                </Text>
              </>
            ) : (
              <></>
            )}
          </Box>
        </Flex>
      </Box>
    </>
  );
};

export default PrivacySecurity;
