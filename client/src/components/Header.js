import React from "react";
import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Center,
  Heading,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon, AddIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import ConnectWallet from "./ConnectWallet";
import { RiWallet3Line } from "react-icons/ri";


export default function Header({setUserAddress}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={"black"} p={2}>
        <Flex p={2} h={20} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            ></HStack>
            <Link to="/"><Heading size="md" color={"white"}>ClearLeth</Heading></Link>
              <Link to="/employee"><Text color={"white"}>Employee</Text></Link>{"   "}
              <Link to="/employer"><Text color={"white"}>Employer</Text></Link>{"   "}
          </HStack>
          <Flex alignItems={"center"} justifyContent={"space-between"}>
            <ConnectWallet setUserAddress={setUserAddress} />
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
