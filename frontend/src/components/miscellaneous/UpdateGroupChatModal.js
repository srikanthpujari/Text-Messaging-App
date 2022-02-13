import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  FormControl,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userComponents/UserBadgeItem";
import UserListItem from "../userComponents/UserListItem";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();

  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState();
  const [renameLoading, setRenameLoading] = useState();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setRenameLoading(false);
      setSelectedChat(data);

      setFetchAgain(!fetchAgain);
    } catch (error) {
      toast({
        title: "Error while fetching the chats",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setRenameLoading(false);
    }

    setGroupChatName("");
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
      /* toast({
        title: "Error",
        description: "Please search the Users",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      }); */
    }

    try {
      setLoading(true);

      const { data } = await axios.get(`/api/user?search=${search}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setSearchResults(data);

      setLoading(false);
    } catch (error) {
      toast({
        title: "Error while fetching the Users",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only Admin can remove User from a Group",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        "/api/chat/groupRemove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleGroupUserAdd = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User already part of the Group",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Error",
        description: "Only Admin can add users to Group",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }

    try {
      setLoading(true);

      const { data } = await axios.put(
        "/api/chat/groupAdd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
    setSearchResults([]);
    setSearch("");
  };

  return (
    <>
      <IconButton
        icon={<ViewIcon />}
        display={{ base: "flex" }}
        onClick={onOpen}
      />

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="x-large"
            fontFamily="Roboto"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" width="100%" flexWrap="wrap" padding={3}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
            <FormControl display="flex" padding={1}>
              <Input
                placeholder="New Chat Name"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                mb={3}
              />
              <Button
                ml={1}
                colorScheme="teal"
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add user to Group"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>

            {loading ? (
              <Spinner fontSize="sm" />
            ) : (
              searchResults
                ?.slice(0, 4)
                .map((u) => (
                  <UserListItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleGroupUserAdd(u)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={() => handleRemove(user)} colorScheme="red">
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
