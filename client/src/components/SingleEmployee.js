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
import Link from "next/link";
import { ethers } from "ethers";
import { loadDonationsContract } from "../src/contracts";

export default function SingleListing({ item }) {
  const { userAddress } = React.useContext(MetaContext);
  let { id } = item;

  useEffect(() => {

  }, []);


  return (
    <Box p="2">
      <Heading as="h1" size="l">
        <u>
          {id.toString()}
        </u>
      </Heading>
    </Box>
  );
}
