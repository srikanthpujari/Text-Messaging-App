import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ChatLoading from "../miscellaneous/ChatLoading";
import GroupChatModal from "../miscellaneous/GroupChatModal";
import { getSender } from "./ChatLogics";

const MyChats = ({ fetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const { data } = await axios.get("/api/chat", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setChats(data);
    } catch (error) {
      toast({
        title: "Error while fetching the chats",
        description: "failed to load the chats",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userData")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      alignItems="center"
      flexDir="column"
      bg="white"
      width={{ base: "100%", md: "30%" }}
      p={3}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        fontSize={{ base: "22px", md: "26px" }}
        width="100%"
        pb={3}
        px={3}
        fontFamily="Roboto"
      >
        My Chats
        <GroupChatModal>
          <Button
            colorScheme="teal"
            rightIcon={<AddIcon />}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        w="100%"
        h="100%"
        p={3}
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                key={chat._id}
                cursor="pointer"
                onClick={() => setSelectedChat(chat)}
                bg={selectedChat === chat ? "#11a9c8" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
