import { Box } from "@chakra-ui/react";
import { useState } from "react";
import ChatBox from "../components/chatComponents/ChatBox";
import MyChats from "../components/chatComponents/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../context/ChatProvider";

const ChatsPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        d="flex"
        justifyContent="space-between"
        width="100%"
        padding="10px"
        height="92vh"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default ChatsPage;
