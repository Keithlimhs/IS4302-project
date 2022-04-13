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
} from "@chakra-ui/react";
import AddEmployer from "./EmployerTabs/AddEmployer";
import AddEmployee from "./EmployerTabs/AddEmployee";
import ViewEmployees from "./ViewTabs/ViewEmployees";
import ViewEmployers from "./ViewTabs/ViewEmployers";
import MyInfo from "./MyInfo";
import {
  getMyInfo,
  getOwnerAddress,
  getAllEmployees,
  getAllEmployers,
  getCompanyLeaves,
} from "../services";
import ViewLeaves from "./ViewTabs/ViewLeaves";

export default function EmployerView() {
  const { userAddress } = React.useContext(MetaContext);
  const [employees, setEmployees] = useState([]);
  const [employers, setEmployers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [myInfo, setMyInfo] = useState(null);
  const [accessRight, setAccessRight] = useState(false);

  useEffect(() => {
    initView();
  }, []);

  useEffect(() => {
    if (myInfo !== null) {
      initLeaves();
    } 
  }, [myInfo]);

  const initEmployees = async () => {
    getAllEmployees().then((e) => {
      setEmployees(e);
    });
  };

  const initEmployers = async () => {
    getAllEmployers().then((e) => {
      setEmployers(e);
    });
  };

  const initLeaves = async () => {
    console.log(myInfo);
    getCompanyLeaves(myInfo.wallet).then((e) => {
      console.log(e);
      setLeaves(e);
    });
  };

  const initView = async () => {
    let infoResult = await getMyInfo();
    if (infoResult == null) {
      return;
    } else {
      let ownerAddress = await getOwnerAddress();
      // 1 FOR EMPLOYEE
      if (infoResult.role == 1 || infoResult.wallet == ownerAddress) {
        console.log("Accessed!");
        setAccessRight(true);
      }
      setMyInfo(infoResult);
      initEmployees();
      initEmployers();
    }
  };

  return (
    <>
      <Center bg="brand.gold">
        <Heading color="white" m={6}>
          Employer
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
        <MyInfo myInfo={myInfo} />
      </Flex>
      {accessRight && (
        <Box>
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
              <Heading size="lg" py="5">
                Leave Management
              </Heading>
              <Tabs>
                <TabList>
                  <Tab>Add Employer</Tab>
                  <Tab>Add Employee</Tab>
                  <Tab>View Employers</Tab>
                  <Tab>View Employees</Tab>
                  <Tab>View Leaves</Tab>
                  <Tab>Set Rules</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <AddEmployer
                      setEmployers={setEmployers}
                      employers={employers}
                    />
                  </TabPanel>
                  <TabPanel>
                    <AddEmployee
                      setEmployees={setEmployees}
                      employees={employees}
                    />
                  </TabPanel>
                  <TabPanel>
                    <ViewEmployers employers={employers} />
                  </TabPanel>
                  <TabPanel>
                    <ViewEmployees employees={employees} />
                  </TabPanel>
                  <TabPanel>
                    <ViewLeaves leaves={leaves} />
                  </TabPanel>
                  <TabPanel>
                    <p>Coming soon!</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Flex>
          <br />
        </Box>
      )}
      {!accessRight && (
        <Center>
          <Heading>Sorry, you do not have access!</Heading>
        </Center>
      )}
      <br />
      <br />
    </>
  );
}
