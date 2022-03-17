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


export default function Header({setUserAddress, setWeb3}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg={"brand.cadetBlue"} px={4}>
        <Flex h={20} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <Heading>ClearLeth</Heading>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            ></HStack>

            <nav>
              <Link to="/"><Text px={2}>Home</Text></Link>
              <Link to="/employee">employee</Link>{"   "}
              <Link to="/employer">employer</Link>{"   "}
            </nav>
          </HStack>
          <Flex alignItems={"center"}>
            <ConnectWallet setUserAddress={setUserAddress} setWeb3={setWeb3}/>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
