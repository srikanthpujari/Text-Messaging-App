import {
  Box,
  Button,
  FormControl,
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
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../userComponents/UserBadgeItem";
import UserListItem from "../userComponents/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();

  const toast = useToast();

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
        description: "Failed to Load the Search Results",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all fields",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setChats([data, ...chats]);
      onClose();
      setSearch("");
      setSearchResults([]);
      setGroupChatName();
      setSelectedUsers([]);
    } catch (error) {
      toast({
        title: "Error while creating group chat",
        description: error.response.data.message,
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    }
  };

  const handleDelete = (userToBeDeleted) => {
    setSelectedUsers(
      selectedUsers.filter((u) => u._id !== userToBeDeleted._id)
    );
  };

  const handleGroupUserAdd = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            fontSize="25px"
            fontFamily="Roboto"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <VStack spacing="1 em">
              <FormControl>
                <Input
                  value={groupChatName}
                  placeholder="Enter Chat Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Input
                  placeholder="Search Users"
                  onChange={(e) => handleSearch(e.target.value)}
                  mb={2}
                />
              </FormControl>
            </VStack>

            <Box display="flex" flexWrap="wrap" width="100%">
              {selectedUsers.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>

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
            <Button colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
