import { MetaContext } from "../contexts/MetaContext";
import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  Divider,
  Center,
  AlertIcon,
  AlertTitle,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Text,
  FormControl,
  FormErrorMessage,
  FormLabel,
  FormHelperText,
  Flex,
  Heading,
  List,
} from "@chakra-ui/react";
import { ethers } from "ethers";

export default function MyInfo({ myInfo }) {
  const { userAddress } = React.useContext(MetaContext);

  return (
    <Box p="2">
      {myInfo != null && (
        <Box>
          <Heading size="lg" py="5">
            My Information
          </Heading>
          <Text fontSize="md">
            <b>Name:</b> {myInfo.name}
          </Text>
          <Text fontSize="md">
            <b>Company:</b> {myInfo.company}
          </Text>
          <Text fontSize="md">
            <b>Address:</b> {myInfo.wallet}
          </Text>
          <br></br>
        </Box>
      )}
      {myInfo == null && <Heading> Please Login to Metamask!</Heading>}
    </Box>
  );
}
