import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      px={2}
      py={1}
      backgroundColor="#4e6e80"
      color="white"
      borderRadius="lg"
      m={1}
      cursor="pointer"
    >
      {user.name}
      <CloseIcon fontSize="md" pl={2} />
    </Box>
  );
};

export default UserBadgeItem;
