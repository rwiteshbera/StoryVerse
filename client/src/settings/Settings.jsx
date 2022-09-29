import {
  Center,
  Divider,
  Grid,
  GridItem,
  List,
  ListItem,
} from "@chakra-ui/react";
import React from "react";
import { Link, Outlet, Route, Routes, useParams } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

const Settings = () => {
  return (
    <>
      <Navbar />
      <Grid
        templateColumns="repeat(8, 1fr)"
        templateRows="repeat(6, 1fr)"
        gap={2}
        margin="0.5rem auto"
        h="100vh"
        w={"60vmax"}
      >
        <GridItem colSpan={2} rowSpan={3}>
          <Center>
            <List>
              <Link to="/settings">
                <ListItem margin={"3rem 0rem"} cursor={"pointer"}>
                  Edit Profile
                </ListItem>
              </Link>

              <Link to="/settings/privacy&security">
                <ListItem margin={"3rem 0rem"} cursor={"pointer"}>
                  Privacy and Security
                </ListItem>
              </Link>

              <Link to="/settings/login&activity">
                <ListItem margin={"3rem 0rem"} cursor={"pointer"}>
                  Login Activity
                </ListItem>
              </Link>

              <Link to="/settings/account&management">
                <ListItem margin={"0rem 0rem"} cursor={"pointer"}>
                  Manage Account
                </ListItem>
              </Link>
            </List>
          </Center>
        </GridItem>
        <GridItem height={"100vh"} colSpan={1}>
          <Divider orientation="vertical" />
        </GridItem>
        <GridItem colSpan={5} rowSpan={6}>
          <Outlet />
        </GridItem>
      </Grid>
    </>
  );
};

export default Settings;
