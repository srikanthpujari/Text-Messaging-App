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

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);

  const postDetails = (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please select a Picture",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Text-Messaging-App");
      data.append("cloud_name", "developer527");
      fetch("https://api.cloudinary.com/v1_1/developer527/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });

      toast({
        title: "Picture uploaded",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
    } else {
      toast({
        title: "Error Occured",
        status: "warning",
        duration: 5000,
        position: "top",
        isClosable: true,
      });
      setLoading(false);
      console.log(pic);
      return;
    }
  };

  const submitHandler = async () => {
    setLoading(true);

    if (!name || !password || !email || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
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
        "/api/user",
        { name, email, password, pic },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Registration successfull",
        status: "success",
        duration: 5000,
        position: "top",
        isClosable: true,
      });

      localStorage.setItem("userData", JSON.stringify(data));
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
      <FormControl id="name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
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
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter your Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
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
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          padding={1}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 25 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
