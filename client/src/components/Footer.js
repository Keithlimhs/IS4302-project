import { Heading, Box, Text } from "@chakra-ui/react";
import React from "react";

export default function Footer() {
  return (
    <Box
      bg="brand.gold"
      color="white"
      p="2"
      textAlign="center"
      style={{
        position: "fixed",
        left: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <Text fontSize="16px">
        Superior Leave Management, All on the Blockchain.
      </Text>
      <Text as="i" fontSize="16px">IS4302 GROUP 8</Text>
    </Box>
  );
}
