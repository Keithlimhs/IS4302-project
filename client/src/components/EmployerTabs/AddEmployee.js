import { MetaContext } from "../../contexts/MetaContext";
import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  Divider,
  Center,
  AlertIcon,
  AlertTitle,
  InputGroup,
  InputLeftAddon,
  Input,
  CloseButton,
  Button,
  Text,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { addEmployee } from "../../services";

export default function AddEmployee() {
  const { userAddress } = React.useContext(MetaContext);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {}, []);

  const handleAddEmployee = async () => {
    addEmployee(input).then(() => {
      setInput("");
      setStatus("success");
      setShowAlert(true);
    });
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const isError = input === "";

  return (
    <Box p="2">
      <Heading as="h1" size="l">
        <u>Add Employee</u>
      </Heading>
      <FormControl isRequired isInvalid={isError}>
        <FormLabel htmlFor="address">Employee Address</FormLabel>
        <Input id="address" value={input} onChange={handleInputChange} />
        {!isError ? (
          <FormHelperText>
            Choose carefully! It's on the blockchain!
          </FormHelperText>
        ) : (
          <FormErrorMessage>Address is required.</FormErrorMessage>
        )}
      </FormControl>
      <Center>
        <Button size="md" onClick={() => handleAddEmployee()}>
          Register
        </Button>
      </Center>
      {showAlert && (
        <Alert status={status} my={5}>
          <AlertIcon />
          Employee added!
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setShowAlert(false)}
          />
        </Alert>
      )}
    </Box>
  );
}
