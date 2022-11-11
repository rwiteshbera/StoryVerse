import React, { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { Box, ListIcon, ListItem, OrderedList } from "@chakra-ui/react";
import { RiDeviceFill } from "react-icons/ri";

const LoginActivity = () => {
  const [loggedInData, setLoggedInData] = useState([]);

  let token = localStorage.getItem("token");

  // Fetch login activity
  const fetchData = async () => {
    try {
      const axiosConfig = {
        headers: {
          "Content-type": "application/json",
          responseType: "json",
          Authorization: token,
        },
      };

      const { data } = await axios.get("/me", axiosConfig);
      setLoggedInData(data.loggedInActivity.reverse().slice(0, 5));
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box marginTop="10">
        <OrderedList>
          {loggedInData.map((item, key) => {
            return (
              <ListItem key={key} fontSize="1.3rem" marginBottom="3">
                <ListIcon as={RiDeviceFill} marginRight="6" />
                {item.replaceAll('"', "")}
                {key === 0 ? (
                  <span
                    style={{
                      color: "green",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      marginLeft: "2rem",
                    }}
                  >
                    Active
                  </span>
                ) : (
                  <></>
                )}
              </ListItem>
            );
          })}
        </OrderedList>
      </Box>
    </>
  );
};

export default LoginActivity;
