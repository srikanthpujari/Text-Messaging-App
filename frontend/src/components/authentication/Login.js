import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser } = ChatState();
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);

    if (!email || !password) {
      toast({
        title: "Please enter all the fields",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.post(
        "/api/user/login",
        { email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Logged in",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });

      localStorage.setItem("userData", JSON.stringify(data));
      setUser(JSON.parse(localStorage.getItem("userData")));
      setLoading(false);
      history.push("/chats");
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
      return;
    }
  };

  return (
    <VStack spacing="1em">
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          value={email}
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            value={password}
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="5rem">
            <Button
              size="sm"
              height="1.5rem"
              colorScheme="blue"
              onClick={handleClick}
            >
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 25 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guestUser@test.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
