import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import React from "react";

import ScrollableFeed from "react-scrollable-feed";
import { ChatState } from "../../context/ChatProvider";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./ChatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <Box display="flex" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <Tooltip
                label={m.sender.name}
                cursor="pointer"
                placement="bottom-start"
              >
                <Avatar
                  src={m.sender.pic}
                  name={m.sender.name}
                  size="sm"
                  mt="7px"
                  mr={1}
                />
                {/* <Text>{m.content}</Text> */}
              </Tooltip>
            )}

            <Box
              backgroundColor={
                m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
              }
              borderRadius="75px"
              padding="5px 15px"
              maxWidth="75%"
              marginLeft={isSameSenderMargin(messages, m, i, user._id)}
              marginTop={isSameUser(messages, m, i, user._id) ? 2 : 0}
            >
              {m.content}
            </Box>
          </Box>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
