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
import { getLeaveApplications } from "../../services";

export default function ViewLeaves({leaves}) {
  const { userAddress } = React.useContext(MetaContext);


  return (
    <Box p="2">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Reason</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leaves != null &&
              leaves.map((i, idx) => (
                <Tr key={idx}>
                  <Td>{parseInt(i.date)}</Td>
                  <Td>{i.reason}</Td>
                  <Td>{i.status}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
