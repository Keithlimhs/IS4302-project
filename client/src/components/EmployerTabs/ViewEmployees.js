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

export default function ViewEmployees() {
  const { userAddress } = React.useContext(MetaContext);
  const [employees, setEmployees] = useState([]);
  /*   const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [showAlert, setShowAlert] = useState(false); */

  useEffect(() => {
    initView();
  }, []);

  const initView = async () => {
    getAllEmployees().then((e) => {
      setEmployees(e);
      /*       setStatus("success");
      setShowAlert(true); */
    });
  };

  /*   const handleInputChange = (e) => setInput(e.target.value);

  const isError = input === ""; */

  return (
    <Box p="2">
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Address</Th>
              <Th>Limit</Th>
            </Tr>
          </Thead>
          <Tbody>
            {employees != null &&
              employees.map((i) => (
                <Tr key={i} >
                  <Td>{i}</Td>
                  <Td>10</Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      {/*       <FormControl isRequired isInvalid={isError}>
        <FormLabel htmlFor="address">Employee Address</FormLabel>
        <Input id="address" value={input} onChange={handleInputChange} />
        {!isError ? (
          <FormHelperText>
            Choose carefully! It's on the blockchain!
          </FormHelperText>
        ) : (
          <FormErrorMessage>Address is required.</FormErrorMessage>
        )}
      </FormControl>
      <Center>
        <Button size="md" onClick={() => handleAddEmployee()}>
          Register
        </Button>
      </Center>
      {showAlert && (
        <Alert status={status} my={5}>
          <AlertIcon />
          Employee added!
          <CloseButton
            position="absolute"
            right="8px"
            top="8px"
            onClick={() => setShowAlert(false)}
          />
        </Alert>
      )} */}
    </Box>
  );
}
