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
import { addEmployer } from "../../services";

export default function AddEmployer({ setEmployers }) {
  const { userAddress } = React.useContext(MetaContext);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {}, []);

  const handleAddEmployer = async () => {
    let response = await addEmployer(input);

    if (response == null) {
      setStatus("error");
      setShowAlert(true);
      setAlertMessage("Error adding employer!");
    } else {
      setInput("");
      setStatus("success");
      setShowAlert(true);
      setAlertMessage("Employer added!");
      setEmployers((employers) => employers.concat(input));
    }
  };

  const handleInputChange = (e) => setInput(e.target.value);

  const isError = input === "";

  return (
    <Box p="2">
      <FormControl isRequired isInvalid={isError}>
        <FormLabel htmlFor="address">Employer Address</FormLabel>
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
        <Button size="md" onClick={() => handleAddEmployer()}>
          Register
        </Button>
      </Center>
      {showAlert && (
        <Alert status={status} my={5}>
          <AlertIcon />
          {alertMessage}
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
