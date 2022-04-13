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
  Tag,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import { getLeaveApplications } from "../../services";

export default function ViewLeaves({ leaves }) {
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
                  <Td>
                    {
                      new Date(parseInt(i.date) * 1000)
                        .toLocaleString()
                        .split(",")[0]
                    }
                  </Td>
                  <Td>{i.reason}</Td>
                  <Td>
                    {i.status == 0 && <Tag colorScheme={"yellow"}>PENDING</Tag>}
                    {i.status == 1 && <Tag colorScheme={"blue"}>CANCELLED</Tag>}
                    {i.status == 2 && <Tag colorScheme={"green"}>APPROVED</Tag>}
                    {i.status == 3 && <Tag colorScheme={"red"}>REJECTED</Tag>}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
