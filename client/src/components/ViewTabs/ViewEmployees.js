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
import { getAllEmployees } from "../../services";

export default function ViewEmployees({employees}) {
  const { userAddress } = React.useContext(MetaContext);


  return (
    <Box p="2">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Name</Th>
{/*               <Th>Limit</Th>
 */}            </Tr>
          </Thead>
          <Tbody>
            {employees != null &&
              employees.map((i) => (
                <Tr key={i.wallet} >
                  <Td>{i.wallet}</Td>
                  <Td>{i.name}</Td>
{/*                   <Td>10</Td>
 */}                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
