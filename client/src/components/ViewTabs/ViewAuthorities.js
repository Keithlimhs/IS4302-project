import { MetaContext } from "../../contexts/MetaContext";
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
import { getAllAuthorities } from "../../services";

export default function ViewAuthorities({authorities}) {
  const { userAddress } = React.useContext(MetaContext);

  useEffect(() => {
  }, []);


  return (
    <Box p="2">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {authorities != null &&
              authorities.map((i) => (
                <Tr key={i.wallet} >
                  <Td>{i.wallet}</Td>
                  <Td>{i.name}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
