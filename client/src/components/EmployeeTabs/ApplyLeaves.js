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
  InputLeftApplyon,
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
import { applyLeaves } from "../../services";
const moment = require("moment");
const web3 = require('web3');

export default function ApplyLeaves({ leaves, setLeaves }) {
  const { userAddress } = React.useContext(MetaContext);
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [inputDates, setInputDates] = useState([]);
  const [inputReasons, setInputReasons] = useState([]);
  const [status, setStatus] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {}, []);

  const handleRejection = async () => {
    setStatus("error");
    setShowAlert(true);
    setAlertMessage("Error applying for leaves!");
  };

  const handleAddToDates = async () => {
    if (date === "" || reason === "") {
      return;
    }
    setInputDates(inputDates.concat(date));
    setInputReasons(inputReasons.concat(reason));
    setDate("");
    setReason("");
  };

  const handleApplyLeaves = async () => {
    if (inputDates.length === 0 || inputReasons.length === 0) {
      handleRejection();
      return;
    }

    let unixDates = [];
    let hashReasons = [];
    for (let i=0; i<inputDates.length; i++) {
        let timestamp = moment(inputDates[i], "DD/MM/YYYY").unix();
        let hashed = web3.utils.asciiToHex(inputReasons[i]);
        const padded = ethers.utils.hexZeroPad(hashed, 32);
        unixDates.push(timestamp);
        hashReasons.push(padded);
    }

    let response = await applyLeaves(unixDates, hashReasons);

    if (response == null) {
      handleRejection();
    } else {
      setInputDates([]);
      setInputReasons([]);
      setStatus("success");
      setShowAlert(true);
      setAlertMessage("Leaves added!");
      for (let i = 0; i < inputDates.length; i++) {
        let hashed = web3.utils.asciiToHex(inputReasons[i]);
        const padded = ethers.utils.hexZeroPad(hashed, 32);
        setLeaves(
          leaves.concat({ name: inputDates[i], address: inputReasons[i] })
        );
      }
    }
  };

  const handleInputDateChange = (e) => setDate(e.target.value);
  const handleInputReasonChange = (e) => setReason(e.target.value);

  const isError = inputDates === "" || inputReasons === "";

  return (
    <Box p="2">
      {inputDates.length !== 0 &&
        inputDates.map((d, index) => (
          <Box key={index}>
            <Text>Date: {inputDates[index]}</Text>
            <Text>Reason: {inputReasons[index]}</Text>
            <Divider />
            <br />
          </Box>
        ))}

      <FormControl isRequired isInvalid={isError}>
        <Flex>
          <Box flex={1}>
            <FormLabel htmlFor="date">Date</FormLabel>
            <Input
              id="date"
              value={date}
              placeholder="11/02/2022"
              onChange={handleInputDateChange}
            />
          </Box>
          &nbsp;
          <Box flex={2}>
            <FormLabel htmlFor="reason">Reason</FormLabel>
            <Input
              placeholder="Family Matters"
              id="reason"
              value={reason}
              onChange={handleInputReasonChange}
            />
          </Box>
        </Flex>

        {!isError ? (
          <FormHelperText>
            Choose carefully! It's on the blockchain!
          </FormHelperText>
        ) : (
          <FormErrorMessage>Date/Reason is required.</FormErrorMessage>
        )}
      </FormControl>

      <Center>
        <Button size="md" onClick={() => handleAddToDates()}>
          Add To Application
        </Button>
        &nbsp;
        <Button size="md" onClick={() => handleApplyLeaves()}>
          Apply
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
