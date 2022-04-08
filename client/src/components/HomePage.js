import { MetaContext } from "../contexts/MetaContext";
import React, { useEffect, useState } from "react";
import {
  Box,
  LinkBox,
  LinkOverlay,
  Text,
  Link,
  Flex,
  Heading,
  HStack,
} from "@chakra-ui/react";

export default function HomePage() {
  useEffect(() => {}, []);

  return (
    <Box
      w="100%"
      my={100}
      p={4}
      color="black"
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Heading fontSize="60px" my={8} textAlign="center">
        Welcome to ClearLeth!
      </Heading>

      <Text fontSize="20px" m={5} textAlign="center">
        Who Are You?
      </Text>

      <HStack>
        <LinkBox
          as="article"
          w={"100%"}
          p="35"
          boxShadow="md"
          borderWidth="1px"
          rounded="md"
          textAlign="center"
          _hover={{
            background: "gray.50",
          }}
        >
          <Heading size="md" my="2">
            <LinkOverlay href="/employee">Employee 🙇‍♂️</LinkOverlay>
          </Heading>
          <Text>
            No more "forgetten" leaves!
          </Text>
        </LinkBox>

        <LinkBox
          as="article"
          w={"100%"}
          p="35"
          boxShadow="md"
          borderWidth="1px"
          rounded="md"
          textAlign="center"
          _hover={{
            background: "gray.50",
          }}
        >
          <Heading size="md" my="2">
            <LinkOverlay href="/employer">Employer 🕺</LinkOverlay>
          </Heading>
          <Text>Ditch those subscriptions! No more hassle!</Text>
        </LinkBox>

        <LinkBox
          as="article"
          w={"100%"}
          p="35"
          boxShadow="md"
          borderWidth="1px"
          rounded="md"
          textAlign="center"
          _hover={{
            background: "gray.50",
          }}
        >
          <Heading size="md" my="2">
            <LinkOverlay href="/authorities">Authorities 🏛</LinkOverlay>
          </Heading>
          <Text>Manage workplace disputes!</Text>
        </LinkBox>
      </HStack>

      <Text fontSize="16px" m={5} textAlign="center">
        (Login with Metamask)
      </Text>
    </Box>
  );
}
