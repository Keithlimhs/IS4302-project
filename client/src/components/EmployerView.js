import React from "react";
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
} from "@chakra-ui/react";
import AddEmployee from "./EmployerTabs/AddEmployee";
import ViewEmployees from "./EmployerTabs/ViewEmployees";

export default function EmployerView() {
  const { userAddress } = React.useContext(MetaContext);

  return (
    <Box>
      <Center bg="brand.gold">
        <Heading color="white" m={6}>
          Employer
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
              <Tab>View Employees</Tab>
              <Tab>Add Employees</Tab>
              <Tab>View Leaves</Tab>
              <Tab>Set Rules</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <p>one!</p>
              </TabPanel>
              <TabPanel>
                <ViewEmployees />
              </TabPanel>
              <TabPanel>
                <AddEmployee />
              </TabPanel>
              <TabPanel>
                <p>three!</p>
              </TabPanel>
              <TabPanel>
                <p>four!</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Box>
  );
}
