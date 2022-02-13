import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  IconButton,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { user } = ChatState();

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton onClick={onOpen} d={{ base: "flex" }} icon={<ViewIcon />} />
      )}

      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent height="410px">
          <ModalHeader
            fontSize="x-large"
            fontFamily="Roboto"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
            padding={8}
          >
            <Image
              alt={user.name}
              src={user.pic}
              borderRadius="full"
              boxSize="150px"
            ></Image>
            <Text fontSize="2xl" fontFamily="Roboto">
              {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
