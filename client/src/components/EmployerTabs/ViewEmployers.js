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
import { getAllEmployers } from "../../services";

export default function ViewEmployers({ setEmployers, employers }) {
  const { userAddress } = React.useContext(MetaContext);
  /*   const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [showAlert, setShowAlert] = useState(false); */

  useEffect(() => {
    initView();
  }, []);

  const initView = async () => {
    getAllEmployers().then((e) => {
      setEmployers(e);
      /*       setStatus("success");
      setShowAlert(true); */
    });
  };

  /*   const handleInputChange = (e) => setInput(e.target.value);

  const isError = input === ""; */

  return (
    <Box p="2">
      <TableContainer>
        <Heading>Company: </Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Name</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employers != null &&
              employers.map((i) => (
                <Tr key={i}>
                  <Td>{i}</Td>
                  <Td>{i}</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
