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
  Button,
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
import { approveLeave, rejectLeave, cancelLeave } from "../../services";
const web3 = require("web3");

export default function ViewLeaves({ leaves, myInfo }) {
  const { userAddress } = React.useContext(MetaContext);

  const handleApprove = async (leaveId) => {
    approveLeave(leaveId, userAddress).then(() => {
      window.location.reload();
    });
  };

  const handleReject = async (leaveId) => {
    rejectLeave(leaveId).then(() => {
      window.location.reload();
    });
  };

  const handleCancel = async (leaveId) => {
    cancelLeave(leaveId).then(() => {
      window.location.reload();
    });
  };

  return (
    <Box p="2">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Employee Name</Th>
              <Th>Date</Th>
              <Th>Reason</Th>
              <Th>Status</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {leaves != null &&
              leaves.map((i, idx) => (
                <Tr key={idx}>
                  {myInfo.role == 0 && <Td>{myInfo.name}</Td>}
                  {myInfo.role != 0 && <Td>{i.name}</Td>}
                  <Td>
                    {
                      new Date(parseInt(i.date) * 1000)
                        .toLocaleString()
                        .split(",")[0]
                    }
                  </Td>
                  <Td>{web3.utils.hexToAscii(i.reason)}</Td>
                  <Td>
                    {i.status == 0 && <Tag colorScheme={"yellow"}>PENDING</Tag>}
                    {i.status == 1 && <Tag colorScheme={"blue"}>CANCELLED</Tag>}
                    {i.status == 2 && <Tag colorScheme={"green"}>APPROVED</Tag>}
                    {i.status == 3 && <Tag colorScheme={"red"}>REJECTED</Tag>}
                  </Td>
                  <Td>
                    {/*                     <Button
                      size="md"
                      bg="green.100"
                      onClick={() => handleCancel(i.id)}
                    >
                      Cancel
                    </Button> */}
                    &nbsp;
                    {i.status == 0 && myInfo.role == 1 && (
                      <>
                        <Button
                          size="md"
                          bg="green.100"
                          onClick={() => handleApprove(i.id)}
                        >
                          Approve
                        </Button>
                        &nbsp;
                        <Button
                          size="md"
                          bg="red.100"
                          onClick={() => handleReject(i.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {i.status == 0 && myInfo.role == 0 && (
                      <>
                        <Button
                          size="md"
                          bg="blue.100"
                          onClick={() => handleCancel(i.id)}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
