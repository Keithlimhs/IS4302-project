import { MetaContext } from "../contexts/MetaContext";
import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  Divider,
  AlertIcon,
  AlertTitle,
  InputGroup,
  InputLeftAddon,
  Input,
  CloseButton,
  Button,
  Text,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { addEmployee } from "../services";

export default function EmployeeDetails({ item }) {
  const { userAddress } = React.useContext(MetaContext);
  let { id } = item;

  useEffect(() => {      console.log(userAddress);
}, []);

  const handleAddEmployee = async () => {
      console.log(userAddress);
    addEmployee(userAddress);
  }

  return (
    <Box p="2">
      <Heading as="h1" size="l">
        <u>
          hello
          {item}
        </u>
      </Heading>
      <Button
        size="md"
        onClick={() => handleAddEmployee()}
      >
        Register
      </Button>
    </Box>
  );
}
