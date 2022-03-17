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

export default function HomePage() {

    useEffect(() => {
      }, []);

    return (
        <Box>
        <Heading as="h1" size="xl" m={5}>
          Homepage: ClearLeth Tagline here
        </Heading>
      </Box>
    );
  }