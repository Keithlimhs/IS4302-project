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

export default function AddEmployer({ employers, setEmployers }) {
  const { userAddress } = React.useContext(MetaContext);
  const [inputCompany, setInputCompany] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [inputName, setInputName] = useState("");
  const [inputLimit, setInputLimit] = useState("");
  const [status, setStatus] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {}, []);

  const handleRejection = async () => {
    setStatus("error");
    setShowAlert(true);
    setAlertMessage("Error adding employer!");
  };

  const handleAddEmployer = async () => {
    if (inputCompany === "" || inputName === "" || inputAddress === "") {
      handleRejection();
      return;
    }

    let response = await addEmployer(inputCompany, inputName, inputAddress, inputLimit);

    if (response == null) {
      handleRejection();
    } else {
      setInputCompany("");
      setInputAddress("");
      setInputName("");
      setInputLimit("");
      setStatus("success");
      setShowAlert(true);
      setAlertMessage("Employer added!");
      setEmployers(employers.concat({company: inputCompany, name: inputName, wallet: inputAddress, limit: inputLimit}));
    }
  };

  const handleInputCompanyChange = (e) => setInputCompany(e.target.value);
  const handleInputAddressChange = (e) => setInputAddress(e.target.value);
  const handleInputNameChange = (e) => setInputName(e.target.value);
  const handleInputLimitChange = (e) => setInputLimit(e.target.value);

  const isError = inputCompany  === "" || inputAddress  === "" || inputName === "" || inputLimit === "";

  return (
    <Box p="2">
      <FormControl isRequired isInvalid={isError}>
        <FormLabel htmlFor="company">Company</FormLabel>
        <Input id="company" value={inputCompany} onChange={handleInputCompanyChange} />
        <FormLabel htmlFor="address">Employer Address</FormLabel>
        <Input id="address" value={inputAddress} onChange={handleInputAddressChange} />
        <FormLabel htmlFor="name">Employer Name</FormLabel>
        <Input id="name" value={inputName} onChange={handleInputNameChange} />
        <FormLabel htmlFor="limit">Leave Limit</FormLabel>
        <Input id="limit" value={inputLimit} onChange={handleInputLimitChange} />
        {!isError ? (
          <FormHelperText>
            Choose carefully! It's on the blockchain!
          </FormHelperText>
        ) : (
          <FormErrorMessage>Input is required.</FormErrorMessage>
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
