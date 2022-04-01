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

export default function EmployeeDetails() {
  const { userAddress } = React.useContext(MetaContext);

  return (
    <Box p="2">
      <Heading as="h1" size="l">
        <u>hello</u>
      </Heading>
    </Box>
  );
}
