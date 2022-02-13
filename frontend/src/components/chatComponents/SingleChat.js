import { ArrowBackIcon } from "@chakra-ui/icons";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "./ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000"; //"https://text-messaging-app.herokuapp.com/"; //
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      setLoading(true);

      const { data } = await axios.get(`api/message/${selectedChat._id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      setLoading(false);
      setMessages(data);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Error while fetching all the messages",
        //description: error.response.data.message,
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },

          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          }
        );
        console.log(data);

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error while sending the message",
          description: error.response.data.message,
          status: "warning",
          duration: 5000,
          position: "top",
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("messsage recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id != newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
      setMessages([...messages, newMessageRecieved]);
    });
  });

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      let timeNow = new Date().getTime();
      let timeDiff = timeNow - lastTypingTime;

      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            display="flex"
            width="100%"
            alignItems="center"
            justifyContent={{ base: "space-between" }}
            padding={2}
            fontFamily="Roboto"
            fontSize="x-large"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />

            {messages &&
              (!selectedChat?.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}

                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal
                    fetchMessages={fetchMessages}
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                  />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            borderRadius="lg"
            borderWidth="1px"
            overflowY="hidden"
            backgroundColor="#E8E8E8"
            width="100%"
            height="100%"
          >
            {loading ? (
              <Spinner
                size="xl"
                alignSelf="center"
                margin="auto"
                width="20"
                height="20"
              />
            ) : (
              <Box display="flex" flexDir="column" overflowY="scroll">
                <ScrollableChat messages={messages} />
              </Box>
            )}
            <FormControl
              onKeyDown={sendMessage}
              isRequired
              mt={3}
              id="first-name"
            >
              {isTyping ? <Box color="#ADD8E6">Typing....</Box> : <></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
        >
          <Text fontSize="3xl" fontFamily="Roboto" pb={4}>
            Click on a User to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
