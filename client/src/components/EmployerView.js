import React from "react";
import { MetaContext } from "../contexts/MetaContext";
import {
  Box,
  Text,
  Flex,
  Heading,
} from "@chakra-ui/react";

export default function EmployerView() {
  const { userAddress } = React.useContext(MetaContext);

    return (
      <main style={{ padding: "1rem 0" }}>
        <Heading>Employer View</Heading>
        <Heading size="l">My address: {userAddress}</Heading>
        <Flex
          borderWidth="1px"
          borderRadius="lg"
          m={5}
          px={10}
          overflow="hidden"
          flexDirection="column"
          boxShadow="md"
        >
          <Box p={3}>
            <Text>Test 1</Text>
          </Box>
        </Flex>
      </main>
    );
  }