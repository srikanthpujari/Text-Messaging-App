import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor="pointer"
        _hover={{ background: "#11a9c8", color: "white" }}
        width="100%"
        d="flex"
        alignItems="center"
        color="black"
        background="#ebf0f1"
        px={3}
        py={2}
        borderRadius="lg"
        mb={1}
      >
        <Avatar size="sm" src={user.pic} name={user.name} mr={3} />
        <Box>
          <Text>{user.name}</Text>
          <Text fontSize="sm">
            <b>Email:</b>
            {user.email}
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
