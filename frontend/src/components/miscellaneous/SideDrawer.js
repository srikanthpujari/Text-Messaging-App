import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import { Avatar } from "@chakra-ui/avatar";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../userComponents/UserListItem";
import { getSender } from "../chatComponents/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userData");

    history.push("/");
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const { data } = await axios.post(
        "/api/chat",
        {
          userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (!chats.find((chat) => chat._id === data._id)) {
        setChats([data, ...chats]);
      }

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error while fetching the chat",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setLoadingChat(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);

    if (!search) {
      toast({
        title: "Please search for user",
        status: "warning",
        duration: 5000,
        position: "top-left",
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(`/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setSearchResult(data);

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to fetch the User",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        background="white"
        width="100%"
        borderwidth="10px"
        p="5px 10px 5px 10px"
      >
        <Tooltip label="Search Users" hasArrow>
          <Button variant="ghost" onClick={onOpen}>
            <SearchIcon />
            <Text
              d={{ base: "none", md: "flex" }}
              p={3}
              fontSize="md"
              fontStyle="Roboto"
            >
              Search Users
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize="large" fontFamily="Roboto">
          TEXT-MESSAGING-APP
        </Text>

        <Box>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="x-large" m={1} />
            </MenuButton>
            <MenuList paddingLeft={2}>
              {!notification.length && "No New Messages"}

              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New message in ${notif.chat.chatName}`
                    : `New messgae from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} variant="ghost">
              <Avatar size="sm" name={user.name} src={user.pic} />
              <ChevronDownIcon fontSize="x-large" m={1} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Search User</DrawerHeader>

          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search users to chat with"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((u) => (
                <UserListItem
                  key={u._id}
                  user={u}
                  handleFunction={() => accessChat(u._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
