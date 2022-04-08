import { MetaContext } from "../contexts/MetaContext";
import React, { useEffect, useState } from "react";
import {
  Box,
  Alert,
  Divider,
  AlertIcon,
  AlertTitle,
  InputGroup,
  InputLeftAddon,
  Input,
  CloseButton,
  Button,
  Text,
  Flex,
  Heading,
} from "@chakra-ui/react";

export default function AllEmployees() {
  const { userAddress, contractInstance } = React.useContext(MetaContext);
  const [myEmployees, setMyEmployees] = useState([]);
  const [numEmployees, setNumEmployees] = useState("");

  useEffect(() => {
    setMyEmployees([{id: 1}]);
    setNumEmployees = 1;
  }, []);

  return (
    <Box>
      <Heading as="h1" size="xl" m={5}>
        My Employees ({numEmployees})
      </Heading>

      <Flex
        borderWidth="1px"
        borderRadius="lg"
        m={5}
        px={10}
        overflow="hidden"
        flexDirection="column"
        boxShadow="md"
      >
        <Box p={3}>
          {myEmployees.length == 0 ? (
            <Text>No Employees currently!</Text>
          ) : (
            myEmployees.map((x) => <SingleEmployee key={x.id} item={x} />)
          )}
        </Box>
      </Flex>
    </Box>
  );
}
