import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import axios from "axios";
import { Center, Flex, Input } from "@chakra-ui/react";
import { BsPlusCircle } from "react-icons/bs";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { AiOutlineHome } from "react-icons/ai";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  useDisclosure,
  List,
  ListItem,
  Image,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuGroup,
  MenuItem,
  Button,
  MenuDivider,
} from "@chakra-ui/react";
import { useState } from "react";

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [SearchInput, setSearchInput] = useState();
  const [SearchResult, setSearchResult] = useState([]);

  let token = localStorage.getItem("token");
  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("id");
  };

  const axiosConfig = {
    headers: {
      "Content-type": "application/json",
      responseType: "json",
      Authorization: token,
    },
  };

  const search = async (e) => {
    setSearchInput(e.target.value);

    onOpen();
    try {
      const { data } = await axios.post(
        "http://localhost:5050/search",
        { query: e.target.value },
        axiosConfig
      );
      if (e.target.value === "") {
        setSearchResult([]);
      } else {
        setSearchResult(data.user);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <nav>
      <Center bg="#fff" w="100%" p={4} color="black">
        <Flex id="nav-mobile" className="">
          <Link to="/" className="brand-logo left">
            Logo
          </Link>
          <Input
            type="text"
            id="search_bar"
            // onChange={search}
            onClick={search}
            onChange={search}
            bg="#efefef"
            marginLeft={"5vw"}
            placeholder={"Search"}
            value={SearchInput}
            autoComplete={"off"}
          />
          <Flex margin={"0.2rem 2rem"}>
            <li>
              <Link to="/">
                <AiOutlineHome fontSize={"1.5rem"} />
              </Link>
            </li>
            <li>
              <Link to="/create">
                <BsPlusCircle fontSize={"1.5rem"} />
              </Link>
            </li>
            <li>
              <Menu>
                <MenuButton>
                  <CgProfile fontSize={"1.5rem"} />
                </MenuButton>
                <MenuList>
                  <MenuGroup title="Profile">
                    <Link to="/profile">
                      <MenuItem>My Account</MenuItem>
                    </Link>
                    <Link to="/settings">
                      <MenuItem>Settings</MenuItem>
                    </Link>
                    <Link to="/login">
                      <MenuItem onClick={logOut}>Logout</MenuItem>
                    </Link>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup title="Help">
                    <MenuItem>Docs</MenuItem>
                    <MenuItem>FAQ</MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
            </li>
          </Flex>
        </Flex>
      </Center>

      {/* <SearchModal /> */}
      <Modal blockScrollOnMount={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <Input
              type="text"
              onChange={search}
              bg="#efefef"
              placeholder={"Search"}
              value={SearchInput}
            />

            <List spacing={3} marginTop={"2"} marginBottom={"2"}>
              {SearchResult.map((item, key) => {
                return (
                  <Link to={`/profile/${item._id}`} key={key}>
                    <ListItem>
                      <Flex gap={"0 1rem"}>
                        <Image
                          src={item.profilePhoto}
                          w={"30px"}
                          borderRadius={"50%"}
                        />
                        <Text>{item.username}</Text>
                      </Flex>
                    </ListItem>
                  </Link>
                );
              })}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </nav>
  );
};

export default Navbar;
