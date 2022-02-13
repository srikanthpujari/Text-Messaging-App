import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      width={{ base: "100%", md: "69%" }}
      backgroundColor="white"
      borderRadius="lg"
      borderWidth="1px"
      px={3}
      pb={3}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
