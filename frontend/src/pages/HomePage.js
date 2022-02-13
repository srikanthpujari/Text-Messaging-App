import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";

const HomePage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = localStorage.getItem("userData");

    if (user && JSON.parse(user))
      if (user) {
        history.push("/chats");
      }
  }, [history]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        bg={"white"}
        p={3}
        w="100%"
        borderRadius="lg"
        m={"60px 0 15px 0"}
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Roboto">
          Messaging App
        </Text>
      </Box>
      <Box
        background={"white"}
        w="100%"
        borderRadius="lg"
        borderWidth="1px"
        padding="4"
      >
        <Tabs variant="soft-rounded">
          <TabList marginBottom="1em ">
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
