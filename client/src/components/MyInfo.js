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
import { getMyInfo } from "../services";

export default function MyInfo() {
  const { userAddress } = React.useContext(MetaContext);
  const [myInfo, setMyInfo] = useState(null);

  useEffect(() => {
    initView();
  }, []);

  const initView = async () => {
    getMyInfo().then((e) => {
    console.log(e);
      setMyInfo(e);
    });
  };

  return (
    <Box p="2">
      {myInfo != null && (
        <Box>
          <Text fontSize="md">{myInfo.name}</Text>
          <Text fontSize="md">{myInfo.company}</Text>
          <Text fontSize="md">{myInfo.wallet}</Text>
          <Text fontSize="md">{myInfo.role}</Text>
        </Box>
      )}
    </Box>
  );
}
