import React, { useEffect, useState } from "react";
import { MetaContext } from "../contexts/MetaContext";
import {
  Box,
  Text,
  Flex,
  Heading,
  Center,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  FormControl,
  Input,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from "@chakra-ui/react";
import employeeDetails from "./EmployeeDetails";
import EmployeeDetails from "./EmployeeDetails";
import { getContract } from "../services";


export default function EmployeeView() {
  const { userAddress } = React.useContext(MetaContext);
  const [input, setInput] = useState('')

  const handleInputChange = (e) => setInput(e.target.value)


  useEffect(() => {
    console.log(userAddress);

  }, []);


  const isError = input === ''

  return (
    <Box>
      <Center bg="brand.gold">
        <Heading color="white" m={6}>
          Employee
        </Heading>
      </Center>
      <Center>
        <Heading size="md" pt={5}>
          {userAddress}
        </Heading>
      </Center>

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
          <Heading size="lg" p={5}>
            Leave Management
          </Heading>
          <Tabs>
            <TabList>
              <Tab>My Info</Tab>
              <Tab>Apply Leaves</Tab>
              <Tab>View Leaves</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <EmployeeDetails item={2}></EmployeeDetails>
              </TabPanel>
              <TabPanel>
                <FormControl isInvalid={isError}>
                  <FormLabel htmlFor="date">Date</FormLabel>
                  <Input
                    id="date"
                    type="date"
                    value={input}
                    onChange={handleInputChange}
                  />
                  {!isError ? (
                    <FormHelperText>
                      Choose carefully! It's on the blockchain!
                    </FormHelperText>
                  ) : (
                    <FormErrorMessage>Dates are required.</FormErrorMessage>
                  )}
                </FormControl>
              </TabPanel>
              <TabPanel>
                <p>three!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
}
