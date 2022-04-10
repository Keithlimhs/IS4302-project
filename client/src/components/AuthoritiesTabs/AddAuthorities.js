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
  Spacer,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { addAuthority } from "../../services";

export default function AddAuthorities({ authorities, setAuthorities }) {
  const { userAddress } = React.useContext(MetaContext);
  const [inputAddress, setInputAddress] = useState("");
  const [inputName, setInputName] = useState("");
  const [status, setStatus] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {}, []);

  const handleRejection = async () => {
    setStatus("error");
    setShowAlert(true);
    setAlertMessage("Error adding employee!");
  };

  const handleAddAuthorities = async () => {
    if (inputName === "" || inputAddress === "") {
      handleRejection();
      return;
    }

    let response = await addAuthority(inputName, inputAddress);

    if (response == null) {
      handleRejection();
    } else {
      setInputAddress("");
      setInputName("");
      setStatus("success");
      setShowAlert(true);
      setAlertMessage("Authorities added!");
      setAuthorities(authorities.concat({name: inputName, address: inputAddress}));
    }
  };

  const handleInputAddressChange = (e) => setInputAddress(e.target.value);
  const handleInputNameChange = (e) => setInputName(e.target.value);

  const isError = inputAddress  === "" || inputName === "";

  return (
    <Box p="2">
      <FormControl isRequired isInvalid={isError}>
        <FormLabel htmlFor="address">Authorities Address</FormLabel>
        <Input
          id="address"
          value={inputAddress}
          onChange={handleInputAddressChange}
        />
        <FormLabel htmlFor="name">Authorities Name</FormLabel>
        <Input id="name" value={inputName} onChange={handleInputNameChange} />
        {!isError ? (
          <FormHelperText>
            Choose carefully! It's on the blockchain!
          </FormHelperText>
        ) : (
          <FormErrorMessage>Address is required.</FormErrorMessage>
        )}
      </FormControl>
      <Center>
        <Button size="md" onClick={() => handleAddAuthorities()}>
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
